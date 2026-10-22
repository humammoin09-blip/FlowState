import { supabase } from "./supabase";
import {
  decodeSessionMode,
  encodeSessionMode,
  decodeTaskDuration,
  encodeTaskDuration,
  resolveActiveUserProfile,
} from "./user-service";
import { STORAGE_KEYS, getLocalDateString } from "./streak-service";

export interface MigrationResult {
  success: boolean;
  migratedSessionsCount: number;
  migratedTasksCount: number;
  migratedBlueprintsCount: number;
  migratedSettings: boolean;
  error?: string;
}

/**
 * Checks if the current user qualifies for the 'Save Your Progress' banner:
 * Criteria: User is a Guest AND (active for 3+ days OR completed 3+ sessions).
 */
export async function checkProgressiveOnboardingEligibility(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    const profile = await resolveActiveUserProfile();
    if (!profile.isGuest) {
      return false;
    }

    const guestId = profile.id;

    // Check days active
    const createdAtStr =
      localStorage.getItem(`flowstate_account_created_at_${guestId}`) ||
      localStorage.getItem("flowstate_account_created_at");

    let daysActive = 0;
    if (createdAtStr) {
      const createdTime = new Date(createdAtStr).getTime();
      if (!isNaN(createdTime) && createdTime > 0) {
        daysActive = Math.floor((Date.now() - createdTime) / (1000 * 60 * 60 * 24));
      }
    }

    // Check completed sessions
    const cachedSessions =
      localStorage.getItem(`flowstate_cached_focus_sessions_${guestId}`) ||
      localStorage.getItem("flowstate_cached_focus_sessions");

    let completedSessions = 0;
    if (cachedSessions) {
      try {
        const parsed = JSON.parse(cachedSessions);
        if (Array.isArray(parsed)) {
          completedSessions = parsed.filter(
            (s) => s.duration_minutes !== undefined && s.duration_minutes > 0
          ).length;
        }
      } catch {}
    }

    // Check streak
    const currentStreakStr =
      localStorage.getItem(`${STORAGE_KEYS.CURRENT_STREAK}_${guestId}`) ||
      localStorage.getItem(STORAGE_KEYS.CURRENT_STREAK);
    const streak = currentStreakStr ? parseInt(currentStreakStr, 10) : 0;

    return daysActive >= 3 || completedSessions >= 3 || streak >= 3;
  } catch (err) {
    console.warn("Notice: Progressive onboarding check:", err);
    return false;
  }
}

/**
 * Migrates all guest data (tasks, focus_sessions, blueprints, user_settings, localStorage)
 * from the guest_id to the newly authenticated Supabase user ID.
 */
export async function migrateGuestDataToAuthenticatedUser(
  guestId: string,
  authUserId: string
): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: true,
    migratedSessionsCount: 0,
    migratedTasksCount: 0,
    migratedBlueprintsCount: 0,
    migratedSettings: false,
  };

  if (!guestId || !authUserId || guestId === authUserId) {
    return result;
  }

  // Prevent multiple redundant migrations for the same guest_id -> authUserId pair
  const migrationKey = `flowstate_migrated_${guestId}_to_${authUserId}`;
  if (typeof window !== "undefined" && localStorage.getItem(migrationKey) === "true") {
    return result;
  }

  console.log(`[FlowState Progressive Auth] Starting data migration from ${guestId} to ${authUserId}...`);

  // 1. Migrate focus_sessions in Supabase
  try {
    const { data: sessions, error } = await supabase.from("focus_sessions").select("*");
    if (!error && Array.isArray(sessions)) {
      const guestSessions = sessions.filter(
        (s) => s.mode && s.mode.includes(`::uid:${guestId}`)
      );
      for (const s of guestSessions) {
        const cleanMode = decodeSessionMode(s.mode);
        const newMode = encodeSessionMode(cleanMode, authUserId);
        const { error: updateErr } = await supabase
          .from("focus_sessions")
          .update({ mode: newMode })
          .eq("id", s.id);
        if (!updateErr) {
          result.migratedSessionsCount++;
        }
      }
    }
  } catch (err) {
    console.warn("Notice: focus_sessions migration error:", err);
  }

  // 2. Migrate tasks in Supabase
  try {
    const { data: tasks, error } = await supabase.from("tasks").select("*");
    if (!error && Array.isArray(tasks)) {
      const guestTasks = tasks.filter(
        (t) => t.duration && t.duration.includes(`::uid:${guestId}`)
      );
      for (const t of guestTasks) {
        const cleanDuration = decodeTaskDuration(t.duration);
        const newDuration = encodeTaskDuration(cleanDuration, authUserId);
        const { error: updateErr } = await supabase
          .from("tasks")
          .update({ duration: newDuration })
          .eq("id", t.id);
        if (!updateErr) {
          result.migratedTasksCount++;
        }
      }
    }
  } catch (err) {
    console.warn("Notice: tasks migration error:", err);
  }

  // 3. Migrate focus_blueprints in Supabase
  try {
    // Blueprints created by guest were inserted with user_id = null
    const { data: blueprints, error } = await supabase
      .from("focus_blueprints")
      .select("*")
      .is("user_id", null);

    if (!error && Array.isArray(blueprints) && blueprints.length > 0) {
      for (const bp of blueprints) {
        const { error: updateErr } = await supabase
          .from("focus_blueprints")
          .update({ user_id: authUserId })
          .eq("id", bp.id);
        if (!updateErr) {
          result.migratedBlueprintsCount++;
        }
      }
    }
  } catch (err) {
    console.warn("Notice: focus_blueprints migration error:", err);
  }

  // 4. Migrate user_settings (streaks) in Supabase
  try {
    const { data: guestSettings } = await supabase
      .from("user_settings")
      .select("*")
      .eq("id", guestId)
      .maybeSingle();

    if (guestSettings) {
      await supabase.from("user_settings").upsert({
        id: authUserId,
        user_id: authUserId,
        current_streak: guestSettings.current_streak,
        max_streak: guestSettings.max_streak,
        last_active_date: guestSettings.last_active_date,
        last_break_date: guestSettings.last_break_date,
        last_streak_saver_used: guestSettings.last_streak_saver_used,
        updated_at: new Date().toISOString(),
      });
      result.migratedSettings = true;

      // Clean up previous guest record in Supabase
      try {
        await supabase.from("user_settings").delete().eq("id", guestId);
      } catch {}
    }
  } catch (err) {
    console.warn("Notice: user_settings migration error:", err);
  }

  // 5. Migrate LocalStorage Keys to New Authenticated User ID
  if (typeof window !== "undefined") {
    // Set active user ID
    localStorage.setItem("flowstate_active_user_id", authUserId);

    // Profile metadata
    const name =
      localStorage.getItem(`flowstate_name_${guestId}`) ||
      localStorage.getItem("flowstate_user_name");
    const title =
      localStorage.getItem(`flowstate_title_${guestId}`) ||
      localStorage.getItem("flowstate_user_title");
    const avatar =
      localStorage.getItem(`flowstate_avatar_${guestId}`) ||
      localStorage.getItem("flowstate_user_avatar");
    const goal =
      localStorage.getItem(`flowstate_goal_${guestId}`) ||
      localStorage.getItem("flowstate_daily_goal");
    const createdAt =
      localStorage.getItem(`flowstate_account_created_at_${guestId}`) ||
      localStorage.getItem("flowstate_account_created_at");

    if (name) localStorage.setItem(`flowstate_name_${authUserId}`, name);
    if (title) localStorage.setItem(`flowstate_title_${authUserId}`, title);
    if (avatar) localStorage.setItem(`flowstate_avatar_${authUserId}`, avatar);
    if (goal) localStorage.setItem(`flowstate_goal_${authUserId}`, goal);
    if (createdAt) localStorage.setItem(`flowstate_account_created_at_${authUserId}`, createdAt);

    // Cached sessions
    const cachedSessions =
      localStorage.getItem(`flowstate_cached_focus_sessions_${guestId}`) ||
      localStorage.getItem("flowstate_cached_focus_sessions");
    if (cachedSessions) {
      try {
        const parsed = JSON.parse(cachedSessions);
        if (Array.isArray(parsed)) {
          const migrated = parsed.map((s) => ({
            ...s,
            mode: s.mode ? `${decodeSessionMode(s.mode)}::uid:${authUserId}` : s.mode,
          }));
          localStorage.setItem(`flowstate_cached_focus_sessions_${authUserId}`, JSON.stringify(migrated));
          localStorage.setItem("flowstate_cached_focus_sessions", JSON.stringify(migrated));
        }
      } catch {}
    }

    // Cached tasks
    const cachedTasks =
      localStorage.getItem(`flowstate_cached_tasks_${guestId}`) ||
      localStorage.getItem("flowstate_cached_tasks");
    if (cachedTasks) {
      try {
        const parsed = JSON.parse(cachedTasks);
        if (Array.isArray(parsed)) {
          const migrated = parsed.map((t) => ({
            ...t,
            duration: t.duration ? `${decodeTaskDuration(t.duration)}::uid:${authUserId}` : t.duration,
          }));
          localStorage.setItem(`flowstate_cached_tasks_${authUserId}`, JSON.stringify(migrated));
          localStorage.setItem("flowstate_cached_tasks", JSON.stringify(migrated));
        }
      } catch {}
    }

    // Streak metadata keys
    const streakKeys = [
      STORAGE_KEYS.CURRENT_STREAK,
      STORAGE_KEYS.MAX_STREAK,
      STORAGE_KEYS.LAST_ACTIVE_DATE,
      STORAGE_KEYS.LAST_BREAK_DATE,
      STORAGE_KEYS.LAST_STREAK_SAVER_USED,
      STORAGE_KEYS.PREVIOUS_STREAK,
      STORAGE_KEYS.IS_STREAK_BROKEN,
    ];
    for (const key of streakKeys) {
      const val = localStorage.getItem(`${key}_${guestId}`) || localStorage.getItem(key);
      if (val !== null) {
        localStorage.setItem(`${key}_${authUserId}`, val);
      }
    }

    // Mark as migrated
    localStorage.setItem(migrationKey, "true");
  }

  // 6. Update user metadata on Supabase auth with profile values
  try {
    const savedName =
      (typeof window !== "undefined" && localStorage.getItem(`flowstate_name_${authUserId}`)) ||
      (typeof window !== "undefined" && localStorage.getItem("flowstate_user_name")) ||
      "";
    const savedTitle =
      (typeof window !== "undefined" && localStorage.getItem(`flowstate_title_${authUserId}`)) ||
      (typeof window !== "undefined" && localStorage.getItem("flowstate_user_title")) ||
      "";
    const savedAvatar =
      (typeof window !== "undefined" && localStorage.getItem(`flowstate_avatar_${authUserId}`)) ||
      (typeof window !== "undefined" && localStorage.getItem("flowstate_user_avatar")) ||
      "";

    if (savedName || savedTitle || savedAvatar) {
      await supabase.auth.updateUser({
        data: {
          full_name: savedName || undefined,
          professional_title: savedTitle || undefined,
          avatar: savedAvatar || undefined,
        },
      });
    }
  } catch (err) {
    console.warn("Notice: Updating auth user metadata during migration:", err);
  }

  // Dispatch a global event so UI components refresh their data immediately
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("flowstate_user_authenticated", {
        detail: { guestId, authUserId },
      })
    );
  }

  console.log(`[FlowState Progressive Auth] Migration completed successfully:`, result);
  return result;
}
