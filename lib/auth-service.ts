import { supabase } from "./supabase";
import {
  decodeSessionMode,
  encodeSessionMode,
  decodeTaskDuration,
  encodeTaskDuration,
  resolveActiveUserProfile,
  filterSessionsByUserId,
  filterTasksByUserId,
} from "./user-service";
import {
  STORAGE_KEYS,
  getLocalDateString,
  calculateStreakState,
  getUserStreakKey,
  FocusSessionRecord,
  UserStreakData,
} from "./streak-service";

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

  // 4. Migrate Profile Metadata (if present)
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

    // Mark as migrated for this guest -> auth user pair
    localStorage.setItem(migrationKey, "true");
  }

  // 5. Update user metadata on Supabase auth with profile values
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

  // 6. Force complete re-fetch from Supabase and overwrite localStorage
  // Ensures streak calculation strictly uses the combined focus_sessions from Supabase
  await forceSyncUserDataFromSupabase(authUserId);

  console.log(`[FlowState Progressive Auth] Migration completed successfully:`, result);
  return result;
}

/**
 * Forces a complete re-fetch of all user data (focus sessions, streak, tasks) from Supabase.
 * Overwrites localStorage with the newly fetched Supabase data.
 * Ensures the streak calculation strictly uses the focus_sessions from Supabase.
 */
export async function forceSyncUserDataFromSupabase(userId: string): Promise<{
  sessions: any[];
  tasks: any[];
  streak: UserStreakData;
}> {
  let userSessions: any[] = [];
  let userTasks: any[] = [];
  let streakState: UserStreakData = calculateStreakState({ sessions: [] });

  if (!userId || typeof window === "undefined") {
    return { sessions: [], tasks: [], streak: streakState };
  }

  try {
    console.log(`[FlowState Data Sync] Forcing complete re-fetch from Supabase for user: ${userId}`);

    // 1. Ensure active user ID is set
    localStorage.setItem("flowstate_active_user_id", userId);

    // 2. Fetch all focus_sessions from Supabase
    try {
      const { data: allSessions, error: sessError } = await supabase
        .from("focus_sessions")
        .select("*")
        .order("created_at", { ascending: true });

      if (!sessError && Array.isArray(allSessions)) {
        userSessions = filterSessionsByUserId(allSessions, userId);
        // Overwrite localStorage with the newly fetched Supabase data
        localStorage.setItem(`flowstate_cached_focus_sessions_${userId}`, JSON.stringify(userSessions));
        localStorage.setItem("flowstate_cached_focus_sessions", JSON.stringify(userSessions));
      }
    } catch (err) {
      console.warn("Notice: Failed fetching focus_sessions during force-sync:", err);
    }

    // 3. Fetch user_settings from Supabase for streak saver cooldown & metadata
    let userSettings: Partial<UserStreakData> = {};
    try {
      const { data: settingsRow } = await supabase
        .from("user_settings")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (settingsRow) {
        userSettings = {
          lastActiveDate: settingsRow.last_active_date,
          currentStreak: settingsRow.current_streak,
          maxStreak: settingsRow.max_streak,
          lastBreakDate: settingsRow.last_break_date,
          lastStreakSaverUsed: settingsRow.last_streak_saver_used,
        };
      }
    } catch (err) {
      console.warn("Notice: Failed fetching user_settings during force-sync:", err);
    }

    // 4. Strictly calculate streak using the focus_sessions from Supabase
    streakState = calculateStreakState({
      sessions: userSessions as FocusSessionRecord[],
      storedData: userSettings,
    });

    // Overwrite localStorage streak keys with newly calculated Supabase streak
    localStorage.setItem(getUserStreakKey(STORAGE_KEYS.CURRENT_STREAK, userId), String(streakState.currentStreak));
    localStorage.setItem(STORAGE_KEYS.CURRENT_STREAK, String(streakState.currentStreak));

    localStorage.setItem(getUserStreakKey(STORAGE_KEYS.MAX_STREAK, userId), String(streakState.maxStreak));
    localStorage.setItem(STORAGE_KEYS.MAX_STREAK, String(streakState.maxStreak));

    if (streakState.lastActiveDate) {
      localStorage.setItem(getUserStreakKey(STORAGE_KEYS.LAST_ACTIVE_DATE, userId), streakState.lastActiveDate);
      localStorage.setItem(STORAGE_KEYS.LAST_ACTIVE_DATE, streakState.lastActiveDate);
    }

    localStorage.setItem(getUserStreakKey(STORAGE_KEYS.IS_STREAK_BROKEN, userId), String(streakState.isStreakBroken));
    localStorage.setItem(STORAGE_KEYS.IS_STREAK_BROKEN, String(streakState.isStreakBroken));

    if (streakState.lastBreakDate) {
      localStorage.setItem(getUserStreakKey(STORAGE_KEYS.LAST_BREAK_DATE, userId), streakState.lastBreakDate);
      localStorage.setItem(STORAGE_KEYS.LAST_BREAK_DATE, streakState.lastBreakDate);
    }

    // Persist updated streak to Supabase user_settings so database is in sync with sessions
    try {
      await supabase.from("user_settings").upsert({
        id: userId,
        user_id: userId,
        current_streak: streakState.currentStreak,
        max_streak: streakState.maxStreak,
        last_active_date: streakState.lastActiveDate,
        last_break_date: streakState.lastBreakDate || null,
        last_streak_saver_used: streakState.lastStreakSaverUsed || null,
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.warn("Notice: Failed saving calculated streak to Supabase user_settings:", err);
    }

    // 5. Fetch tasks from Supabase
    try {
      const { data: allTasks, error: taskError } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (!taskError && Array.isArray(allTasks)) {
        userTasks = filterTasksByUserId(allTasks, userId);
        // Overwrite localStorage with newly fetched tasks from Supabase
        localStorage.setItem(`flowstate_cached_tasks_${userId}`, JSON.stringify(userTasks));
        localStorage.setItem("flowstate_cached_tasks", JSON.stringify(userTasks));
      }
    } catch (err) {
      console.warn("Notice: Failed fetching tasks during force-sync:", err);
    }
  } catch (globalErr) {
    console.error("Critical forceSyncUserDataFromSupabase error:", globalErr);
  }

  return { sessions: userSessions, tasks: userTasks, streak: streakState };
}
