import { supabase } from "@/lib/supabase";

export interface FocusSessionRecord {
  id?: string;
  duration_minutes?: number;
  mode?: string;
  created_at?: string;
}

export interface UserStreakData {
  currentStreak: number;
  maxStreak: number;
  lastActiveDate: string | null; // YYYY-MM-DD
  lastBreakDate: string | null;  // YYYY-MM-DD
  isStreakBroken: boolean;
  daysSinceLastActive: number;
  daysSinceLastBreak: number;
  lastStreakSaverUsed: string | null; // ISO timestamp
  canUseStreakSaver: boolean;
  previousStreak: number;
  streakSaverCooldownDays: number;
  createdAt?: string | null;
}

export interface UserSettingsRow {
  id: string;
  user_id?: string | null;
  last_active_date?: string | null;
  current_streak?: number;
  max_streak?: number;
  last_break_date?: string | null;
  last_streak_saver_used?: string | null;
  created_at?: string;
  updated_at?: string;
}

// LocalStorage Keys for resilient offline-first persistence
export const STORAGE_KEYS = {
  LAST_ACTIVE_DATE: "flowstate_last_active_date",
  CURRENT_STREAK: "flowstate_saved_streak",
  MAX_STREAK: "flowstate_max_streak",
  LAST_BREAK_DATE: "flowstate_last_break_date",
  IS_STREAK_BROKEN: "flowstate_is_streak_broken",
  PREVIOUS_STREAK: "flowstate_previous_streak",
  LAST_STREAK_SAVER_USED: "flowstate_last_streak_saver_used",
  MODAL_DISMISSED_DATE: "flowstate_streak_modal_dismissed_date",
};

/**
 * Returns a date string formatted as YYYY-MM-DD in user's local timezone.
 */
export function getLocalDateString(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Returns the calendar day difference between two YYYY-MM-DD dates (d2 - d1).
 * Safe against UTC / timezone drifts.
 */
export function getDayDifference(dateStr1: string, dateStr2: string): number {
  if (!dateStr1 || !dateStr2) return 0;
  const [y1, m1, d1] = dateStr1.split("-").map(Number);
  const [y2, m2, d2] = dateStr2.split("-").map(Number);
  if (!y1 || !m1 || !d1 || !y2 || !m2 || !d2) return 0;
  const utc1 = Date.UTC(y1, m1 - 1, d1);
  const utc2 = Date.UTC(y2, m2 - 1, d2);
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((utc2 - utc1) / msPerDay);
}

/**
 * Formats elapsed days into user-friendly text like 'today', 'yesterday', '3 days ago'
 */
export function formatDaysAgo(gap: number): string {
  if (gap <= 0) return "today";
  if (gap === 1) return "yesterday";
  return `${gap} days ago`;
}

/**
 * Parses timestamp string into local YYYY-MM-DD
 */
export function parseSessionDate(createdAt?: string): string | null {
  if (!createdAt) return null;
  let raw = createdAt;
  if (typeof raw === "string" && !raw.includes("Z") && !raw.includes("+")) {
    raw = raw.replace(" ", "T") + "Z";
  }
  const dateObj = new Date(raw);
  if (isNaN(dateObj.getTime())) return null;
  return getLocalDateString(dateObj);
}

/**
 * An 'active day' is defined as: a day where the user completed at least ONE focus session
 * (minimum 10 minutes total focus time, or at least 1 completed session).
 */
export function isSessionActive(s: FocusSessionRecord): boolean {
  if (s.mode === "Panic Quit" && (s.duration_minutes || 0) === 0) {
    return false;
  }
  return (s.duration_minutes || 0) > 0 || s.mode === "focus";
}

export function isDayActive(sessionsOnDay: FocusSessionRecord[]): boolean {
  let totalMins = 0;
  let completedCount = 0;
  for (const s of sessionsOnDay) {
    if (isSessionActive(s)) {
      totalMins += s.duration_minutes || 0;
      completedCount++;
    }
  }
  return totalMins >= 10 || completedCount >= 1;
}

/**
 * Extracts all unique active dates from an array of sessions
 */
export function getActiveDatesFromSessions(sessions: FocusSessionRecord[]): Set<string> {
  const dayGroups: Record<string, FocusSessionRecord[]> = {};

  sessions.forEach((s) => {
    const dStr = parseSessionDate(s.created_at);
    if (dStr) {
      if (!dayGroups[dStr]) dayGroups[dStr] = [];
      dayGroups[dStr].push(s);
    }
  });

  const activeDates = new Set<string>();
  Object.entries(dayGroups).forEach(([dStr, group]) => {
    if (isDayActive(group)) {
      activeDates.add(dStr);
    }
  });

  return activeDates;
}

/**
 * Calculates historical all-time max streak from sorted active date strings
 */
export function calculateHistoricalMaxStreak(activeDateStrings: string[]): number {
  if (activeDateStrings.length === 0) return 0;
  const sorted = Array.from(new Set(activeDateStrings)).sort();
  let max = 1;
  let current = 1;
  for (let i = 1; i < sorted.length; i++) {
    const diff = getDayDifference(sorted[i - 1], sorted[i]);
    if (diff === 1) {
      current++;
      if (current > max) max = current;
    } else if (diff > 1) {
      current = 1;
    }
  }
  return max;
}

/**
 * Checks if Streak Saver is available (allowed only once every 30 days)
 */
export function checkStreakSaverAvailability(
  lastStreakSaverUsed: string | null,
  todayStr: string
): { canUse: boolean; cooldownDays: number } {
  if (!lastStreakSaverUsed) {
    return { canUse: true, cooldownDays: 0 };
  }

  const lastUsedDateStr = lastStreakSaverUsed.slice(0, 10);
  const diffDays = getDayDifference(lastUsedDateStr, todayStr);

  if (diffDays >= 30) {
    return { canUse: true, cooldownDays: 0 };
  }

  return { canUse: false, cooldownDays: Math.max(1, 30 - diffDays) };
}

/**
 * Evaluates streak status based on user's active days and stored settings
 */
export function calculateStreakState({
  sessions,
  storedData,
  currentDate = new Date(),
}: {
  sessions: FocusSessionRecord[];
  storedData?: Partial<UserStreakData>;
  currentDate?: Date;
}): UserStreakData {
  const todayStr = getLocalDateString(currentDate);
  const yesterdayDate = new Date(currentDate);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterdayDate);

  const activeDates = getActiveDatesFromSessions(sessions);
  const allActiveDatesList = Array.from(activeDates).sort();

  // Pick the latest active date between sessions and stored settings
  let lastActiveDate = storedData?.lastActiveDate || null;
  if (allActiveDatesList.length > 0) {
    const latestSessionDate = allActiveDatesList[allActiveDatesList.length - 1];
    if (!lastActiveDate || latestSessionDate > lastActiveDate) {
      lastActiveDate = latestSessionDate;
    }
  }

  const storedStreak = storedData?.currentStreak ?? 0;
  const storedPrevStreak = storedData?.previousStreak ?? 0;
  let maxStreak = Math.max(
    storedData?.maxStreak ?? 0,
    calculateHistoricalMaxStreak(allActiveDatesList)
  );
  let lastBreakDate = storedData?.lastBreakDate || null;
  const lastStreakSaverUsed = storedData?.lastStreakSaverUsed || null;

  const { canUse: canUseStreakSaver, cooldownDays: streakSaverCooldownDays } =
    checkStreakSaverAvailability(lastStreakSaverUsed, todayStr);

  // If user has never been active
  if (!lastActiveDate) {
    return {
      currentStreak: 0,
      maxStreak: 0,
      lastActiveDate: null,
      lastBreakDate: null,
      isStreakBroken: false,
      daysSinceLastActive: 0,
      daysSinceLastBreak: 0,
      lastStreakSaverUsed,
      canUseStreakSaver,
      previousStreak: 0,
      streakSaverCooldownDays,
    };
  }

  const gap = getDayDifference(lastActiveDate, todayStr);

  let currentStreak = 0;
  let isStreakBroken = false;
  let previousStreak = storedPrevStreak;

  if (gap === 0) {
    // Gap === 0 day: same day, active today!
    // Check if yesterday was active to calculate the streak count
    const wasYesterdayActive = activeDates.has(yesterdayStr) || storedData?.lastActiveDate === yesterdayStr;
    if (wasYesterdayActive && storedStreak > 0) {
      currentStreak = storedStreak;
    } else if (storedStreak > 0) {
      currentStreak = storedStreak;
    } else {
      currentStreak = 1;
    }
    isStreakBroken = false;
  } else if (gap === 1) {
    // Gap === 1 day: yesterday was active! Streak is alive and ready to increment
    currentStreak = storedStreak > 0 ? storedStreak : 1;
    isStreakBroken = false;
  } else {
    // Gap > 1 day: user has NOT been active for 2+ consecutive days
    // Streak is BROKEN, streak = 0
    currentStreak = 0;
    isStreakBroken = true;
    previousStreak = storedStreak > 0 ? storedStreak : (storedPrevStreak || 1);
    if (!lastBreakDate) {
      lastBreakDate = yesterdayStr;
    }
  }

  maxStreak = Math.max(maxStreak, currentStreak, previousStreak);

  // Calculate days since last break
  let daysSinceLastBreak = 0;
  if (isStreakBroken) {
    daysSinceLastBreak = 0;
  } else if (lastBreakDate) {
    daysSinceLastBreak = Math.max(0, getDayDifference(lastBreakDate, todayStr));
  } else {
    daysSinceLastBreak = currentStreak;
  }

  return {
    currentStreak,
    maxStreak,
    lastActiveDate,
    lastBreakDate,
    isStreakBroken,
    daysSinceLastActive: Math.max(0, gap),
    daysSinceLastBreak,
    lastStreakSaverUsed,
    canUseStreakSaver,
    previousStreak,
    streakSaverCooldownDays,
  };
}

export function getUserStreakKey(baseKey: string, userId?: string): string {
  if (typeof window === "undefined") return baseKey;
  const uid =
    userId ||
    localStorage.getItem("flowstate_active_user_id") ||
    "guest_default";
  return `${baseKey}_${uid}`;
}

/**
 * Loads user settings from Supabase (with localStorage fallback)
 */
export async function fetchUserSettingsFromDB(userId?: string): Promise<Partial<UserStreakData>> {
  const localData: Partial<UserStreakData> = {};
  const activeUid =
    userId ||
    (typeof window !== "undefined"
      ? localStorage.getItem("flowstate_active_user_id") || "guest_default"
      : "guest_default");

  if (typeof window !== "undefined") {
    const sDate = localStorage.getItem(getUserStreakKey(STORAGE_KEYS.LAST_ACTIVE_DATE, activeUid));
    const sStreak = localStorage.getItem(getUserStreakKey(STORAGE_KEYS.CURRENT_STREAK, activeUid));
    const sMax = localStorage.getItem(getUserStreakKey(STORAGE_KEYS.MAX_STREAK, activeUid));
    const sBreak = localStorage.getItem(getUserStreakKey(STORAGE_KEYS.LAST_BREAK_DATE, activeUid));
    const sPrev = localStorage.getItem(getUserStreakKey(STORAGE_KEYS.PREVIOUS_STREAK, activeUid));
    const sSaver = localStorage.getItem(getUserStreakKey(STORAGE_KEYS.LAST_STREAK_SAVER_USED, activeUid));
    const sBroken = localStorage.getItem(getUserStreakKey(STORAGE_KEYS.IS_STREAK_BROKEN, activeUid));

    if (sDate) localData.lastActiveDate = sDate;
    if (sStreak) localData.currentStreak = parseInt(sStreak, 10);
    if (sMax) localData.maxStreak = parseInt(sMax, 10);
    if (sBreak) localData.lastBreakDate = sBreak;
    if (sPrev) localData.previousStreak = parseInt(sPrev, 10);
    if (sSaver) localData.lastStreakSaverUsed = sSaver;
    if (sBroken) localData.isStreakBroken = sBroken === "true";
  }

  try {
    const { data, error } = await supabase
      .from("user_settings")
      .select("*")
      .eq("id", activeUid)
      .maybeSingle();

    if (!error && data) {
      return {
        lastActiveDate: data.last_active_date || localData.lastActiveDate || null,
        currentStreak: data.current_streak ?? localData.currentStreak ?? 0,
        maxStreak: data.max_streak ?? localData.maxStreak ?? 0,
        lastBreakDate: data.last_break_date || localData.lastBreakDate || null,
        lastStreakSaverUsed: data.last_streak_saver_used || localData.lastStreakSaverUsed || null,
        previousStreak: localData.previousStreak ?? (data.current_streak || 1),
        createdAt: data.created_at || null,
      };
    }
  } catch (err) {
    console.warn("Notice: user_settings remote fetch fallback to local:", err);
  }

  return localData;
}

/**
 * Saves user streak settings to Supabase and LocalStorage
 */
export async function persistStreakSettings(
  data: {
    currentStreak: number;
    maxStreak: number;
    lastActiveDate: string | null;
    lastBreakDate?: string | null;
    previousStreak?: number;
    lastStreakSaverUsed?: string | null;
    isStreakBroken?: boolean;
  },
  userId?: string
): Promise<void> {
  const activeUid =
    userId ||
    (typeof window !== "undefined"
      ? localStorage.getItem("flowstate_active_user_id") || "guest_default"
      : "guest_default");

  // Always update localStorage immediately
  if (typeof window !== "undefined") {
    if (data.lastActiveDate) {
      localStorage.setItem(getUserStreakKey(STORAGE_KEYS.LAST_ACTIVE_DATE, activeUid), data.lastActiveDate);
    }
    localStorage.setItem(getUserStreakKey(STORAGE_KEYS.CURRENT_STREAK, activeUid), String(data.currentStreak));
    localStorage.setItem(getUserStreakKey(STORAGE_KEYS.MAX_STREAK, activeUid), String(data.maxStreak));
    if (data.lastBreakDate) {
      localStorage.setItem(getUserStreakKey(STORAGE_KEYS.LAST_BREAK_DATE, activeUid), data.lastBreakDate);
    }
    if (data.previousStreak !== undefined) {
      localStorage.setItem(getUserStreakKey(STORAGE_KEYS.PREVIOUS_STREAK, activeUid), String(data.previousStreak));
    }
    if (data.lastStreakSaverUsed) {
      localStorage.setItem(getUserStreakKey(STORAGE_KEYS.LAST_STREAK_SAVER_USED, activeUid), data.lastStreakSaverUsed);
    }
    if (data.isStreakBroken !== undefined) {
      localStorage.setItem(getUserStreakKey(STORAGE_KEYS.IS_STREAK_BROKEN, activeUid), String(data.isStreakBroken));
    }
  }

  // Sync to Supabase user_settings table
  try {
    await supabase.from("user_settings").upsert({
      id: activeUid,
      last_active_date: data.lastActiveDate,
      current_streak: data.currentStreak,
      max_streak: data.maxStreak,
      last_break_date: data.lastBreakDate || null,
      last_streak_saver_used: data.lastStreakSaverUsed || null,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("Supabase user_settings sync notice (persisted locally):", err);
  }
}

/**
 * Invoked when user completes a focus session.
 * Implements:
 * - If user had an active day yesterday, and has an active day today -> streak++
 * - If user did NOT have an active day yesterday (missed a day), and has an active day today -> streak RESETS to 1
 * - Same day completed sessions keep current streak
 */
export async function handleSessionCompletedStreakUpdate(
  sessionMins: number,
  sessionDate: Date = new Date(),
  userId?: string
): Promise<UserStreakData> {
  const todayStr = getLocalDateString(sessionDate);
  const yesterdayDate = new Date(sessionDate);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterdayDate);

  const stored = await fetchUserSettingsFromDB(userId);
  const prevLastActive = stored.lastActiveDate;
  const prevStreak = stored.currentStreak ?? 0;
  let maxStreak = stored.maxStreak ?? 0;

  let nextStreak = 1;

  if (prevLastActive === todayStr) {
    // Already active today: keep streak
    nextStreak = Math.max(1, prevStreak);
  } else if (prevLastActive === yesterdayStr) {
    // Active yesterday, active today -> streak++
    nextStreak = (prevStreak > 0 ? prevStreak : 1) + 1;
  } else {
    // Did NOT have an active day yesterday -> streak RESETS to 1
    nextStreak = 1;
  }

  maxStreak = Math.max(maxStreak, nextStreak);

  const updatedData: UserStreakData = {
    currentStreak: nextStreak,
    maxStreak,
    lastActiveDate: todayStr,
    lastBreakDate: stored.lastBreakDate || null,
    isStreakBroken: false,
    daysSinceLastActive: 0,
    daysSinceLastBreak: stored.lastBreakDate
      ? Math.max(0, getDayDifference(stored.lastBreakDate, todayStr))
      : nextStreak,
    lastStreakSaverUsed: stored.lastStreakSaverUsed || null,
    canUseStreakSaver: checkStreakSaverAvailability(stored.lastStreakSaverUsed || null, todayStr).canUse,
    previousStreak: prevStreak,
    streakSaverCooldownDays: checkStreakSaverAvailability(stored.lastStreakSaverUsed || null, todayStr).cooldownDays,
  };

  await persistStreakSettings({
    currentStreak: updatedData.currentStreak,
    maxStreak: updatedData.maxStreak,
    lastActiveDate: updatedData.lastActiveDate,
    lastBreakDate: updatedData.lastBreakDate,
    previousStreak: updatedData.previousStreak,
    lastStreakSaverUsed: updatedData.lastStreakSaverUsed,
    isStreakBroken: false,
  }, userId);

  return updatedData;
}

/**
 * Applies a Streak Saver (once every 30 days) to recover a broken streak.
 */
export async function useStreakSaver(
  currentDate: Date = new Date(),
  userId?: string
): Promise<{
  success: boolean;
  message: string;
  data?: UserStreakData;
}> {
  const todayStr = getLocalDateString(currentDate);
  const yesterdayDate = new Date(currentDate);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterdayDate);

  const stored = await fetchUserSettingsFromDB(userId);
  const { canUse, cooldownDays } = checkStreakSaverAvailability(
    stored.lastStreakSaverUsed || null,
    todayStr
  );

  if (!canUse) {
    return {
      success: false,
      message: `Streak Saver is available only once every 30 days. Ready in ${cooldownDays} day${cooldownDays === 1 ? "" : "s"}.`,
    };
  }

  // Restore the previous streak count (or stored streak)
  const restoredStreak = Math.max(1, stored.previousStreak || stored.currentStreak || 1);
  const maxStreak = Math.max(stored.maxStreak || 0, restoredStreak);
  const nowIso = new Date().toISOString();

  // Streak saver bridges the missed day: lastActiveDate is treated as yesterday
  const updatedData: UserStreakData = {
    currentStreak: restoredStreak,
    maxStreak,
    lastActiveDate: yesterdayStr,
    lastBreakDate: stored.lastBreakDate || null,
    isStreakBroken: false,
    daysSinceLastActive: 1, // Ready to increment today
    daysSinceLastBreak: stored.lastBreakDate
      ? Math.max(0, getDayDifference(stored.lastBreakDate, todayStr))
      : restoredStreak,
    lastStreakSaverUsed: nowIso,
    canUseStreakSaver: false,
    previousStreak: restoredStreak,
    streakSaverCooldownDays: 30,
  };

  await persistStreakSettings({
    currentStreak: updatedData.currentStreak,
    maxStreak: updatedData.maxStreak,
    lastActiveDate: updatedData.lastActiveDate,
    lastBreakDate: updatedData.lastBreakDate,
    previousStreak: updatedData.previousStreak,
    lastStreakSaverUsed: nowIso,
    isStreakBroken: false,
  }, userId);

  return {
    success: true,
    message: `Streak Saver activated! Your ${restoredStreak}-day streak has been restored. Complete a session today to keep the momentum!`,
    data: updatedData,
  };
}
