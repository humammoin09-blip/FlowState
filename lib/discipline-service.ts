export interface DisciplineAssessment {
  status: "success" | "fallback" | "error";
  modelUsed: string;
  verdict: "AHEAD_OF_SCHEDULE" | "ON_TRACK" | "BEHIND_SCHEDULE" | "CRITICAL_DRIFT";
  disciplineScore: number;
  headline: string;
  coachingMessage: string;
  actionableDirective: string;
  quote?: string;
  author?: string;
  timestamp: string;
}

export interface StreakLossIntervention {
  status: "success" | "fallback" | "error";
  modelUsed: string;
  headline: string;
  quote: string;
  author: string;
  psychologicalMessage: string;
  rebuildChallenge: string;
  timestamp: string;
}

export async function fetchDisciplineCoaching(params: {
  focusHours: number;
  dailyGoal: number;
  streakDays: number;
  completedTasks: number;
  totalTasks: number;
  userName?: string;
  tone?: "reality-check" | "tactical" | "stoic";
}): Promise<DisciplineAssessment> {
  try {
    const res = await fetch("/api/coach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...params,
        action: "coach",
      }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.warn("Client fallback for discipline coaching:", error);
    // Instant client-side fallback if server route is unreachable
    const ratio = params.dailyGoal > 0 ? params.focusHours / params.dailyGoal : 0;
    return {
      status: "fallback",
      modelUsed: "client-resilience-fallback",
      verdict: params.focusHours === 0 ? "CRITICAL_DRIFT" : ratio < 0.5 ? "BEHIND_SCHEDULE" : ratio < 1 ? "ON_TRACK" : "AHEAD_OF_SCHEDULE",
      disciplineScore: params.focusHours === 0 ? 25 : Math.round(Math.min(100, ratio * 100)),
      headline: params.focusHours === 0 ? "Time Is Slipping Away" : "Execute The Standard",
      coachingMessage: params.focusHours === 0
        ? `You have logged 0 hours toward your ${params.dailyGoal}h target today. Procrastination is a debt paid in missed potential. Take action immediately.`
        : `You are at ${params.focusHours}h of ${params.dailyGoal}h. Consistency is forged in refusing to quit before the target is reached.`,
      actionableDirective: "Start a 25-minute Pomodoro focus block right now.",
      quote: "Don't count on motivation. Motivation comes and goes. Count on discipline.",
      author: "Jocko Willink",
      timestamp: new Date().toISOString(),
    };
  }
}

export async function fetchStreakLossQuote(params: {
  userName?: string;
  previousStreak: number;
}): Promise<StreakLossIntervention> {
  try {
    const res = await fetch("/api/coach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...params,
        action: "streak_loss",
      }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.warn("Client fallback for streak loss quote:", error);
    return {
      status: "fallback",
      modelUsed: "client-resilience-fallback",
      headline: "The Chain Broke. Your Character Remains.",
      quote: "You have power over your mind - not outside events. Realize this, and you will find strength. Never let one lost battle lose the war.",
      author: "Marcus Aurelius",
      psychologicalMessage: "Yesterday was lost, but today is virgin territory. The pain of discipline is temporary; the shame of quitting is permanent. Rise and rebuild the chain today.",
      rebuildChallenge: "Lock in an immediate 25-minute focus session to lay the first link.",
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Calculates current week and today's focus hours using the exact same timezone-normalized
 * daily session calculation as ConsistencyHeatmap.tsx
 */
import {
  calculateStreakState,
  FocusSessionRecord,
  getLocalDateString,
  getDayDifference,
} from "@/lib/streak-service";

/**
 * Calculates current week and today's focus hours using timezone-normalized
 * daily session calculation. Accurately determines streak count based on
 * active day criteria and gap analysis.
 */
export function calculateConsistencyAnalytics(
  sessions: Array<{ duration_minutes?: number; created_at?: string; mode?: string | null }>
): {
  todayHours: number;
  todayMins: number;
  streakDays: number;
  isStreakBroken: boolean;
  todayDayName: string;
  dayMap: Record<string, { mins: number; count: number }>;
} {
  const now = new Date();
  const currentDayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday, ...
  const diffToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;

  const mondayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMonday, 0, 0, 0, 0);
  const sundayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMonday + 6, 23, 59, 59, 999);
  const startOfWeekMs = mondayDate.getTime();
  const endOfWeekMs = sundayDate.getTime();

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayMap: Record<string, { mins: number; count: number }> = {
    Mon: { mins: 0, count: 0 },
    Tue: { mins: 0, count: 0 },
    Wed: { mins: 0, count: 0 },
    Thu: { mins: 0, count: 0 },
    Fri: { mins: 0, count: 0 },
    Sat: { mins: 0, count: 0 },
    Sun: { mins: 0, count: 0 },
  };

  if (sessions && sessions.length > 0) {
    sessions.forEach((s) => {
      const mins = s.duration_minutes || 0;

      if (s.created_at) {
        let rawTimestamp = s.created_at;
        if (typeof rawTimestamp === "string" && !rawTimestamp.includes("Z") && !rawTimestamp.includes("+")) {
          rawTimestamp = rawTimestamp.replace(" ", "T") + "Z";
        }
        const dateObj = new Date(rawTimestamp);
        if (isNaN(dateObj.getTime())) return;

        const sessionMs = dateObj.getTime();

        if (sessionMs >= startOfWeekMs && sessionMs <= endOfWeekMs) {
          const localDayIndex = (dateObj.getDay() + 6) % 7;
          const dayName = weekDays[localDayIndex];
          if (dayMap[dayName]) {
            dayMap[dayName].mins += mins;
            dayMap[dayName].count += 1;
          }
        }
      }
    });
  }

  const todayDayIndex = (now.getDay() + 6) % 7;
  const todayDayName = weekDays[todayDayIndex];
  const todayMins = dayMap[todayDayName].mins;
  const todayHours = Number((todayMins / 60).toFixed(1));

  // Retrieve stored settings from localStorage for consistent streak state
  let storedStreak = 0;
  let storedLastDate: string | null = null;
  let storedPrevStreak = 0;
  let storedMaxStreak = 0;
  let storedLastBreakDate: string | null = null;
  let storedLastStreakSaver: string | null = null;

  if (typeof window !== "undefined") {
    const s = localStorage.getItem("flowstate_saved_streak");
    const d = localStorage.getItem("flowstate_last_active_date");
    const p = localStorage.getItem("flowstate_previous_streak");
    const m = localStorage.getItem("flowstate_max_streak");
    const b = localStorage.getItem("flowstate_last_break_date");
    const saver = localStorage.getItem("flowstate_last_streak_saver_used");

    if (s) storedStreak = parseInt(s, 10);
    if (d) storedLastDate = d;
    if (p) storedPrevStreak = parseInt(p, 10);
    if (m) storedMaxStreak = parseInt(m, 10);
    if (b) storedLastBreakDate = b;
    if (saver) storedLastStreakSaver = saver;
  }

  const streakState = calculateStreakState({
    sessions: sessions as FocusSessionRecord[],
    storedData: {
      currentStreak: storedStreak,
      lastActiveDate: storedLastDate,
      previousStreak: storedPrevStreak,
      maxStreak: storedMaxStreak,
      lastBreakDate: storedLastBreakDate,
      lastStreakSaverUsed: storedLastStreakSaver,
    },
    currentDate: now,
  });

  return {
    todayHours,
    todayMins,
    streakDays: streakState.currentStreak,
    isStreakBroken: streakState.isStreakBroken,
    todayDayName,
    dayMap,
  };
}

/**
 * Calculates whether a consecutive streak was broken by checking session history and settings.
 */
export function evaluateStreakStatus(sessions: Array<{ created_at?: string; duration_minutes?: number; mode?: string }>): {
  isStreakBroken: boolean;
  previousStreak: number;
  lastActiveDate: string | null;
  daysSinceLastActive: number;
  canUseStreakSaver: boolean;
} {
  if (typeof window === "undefined") {
    return {
      isStreakBroken: false,
      previousStreak: 0,
      lastActiveDate: null,
      daysSinceLastActive: 0,
      canUseStreakSaver: true,
    };
  }

  const now = new Date();
  const todayStr = getLocalDateString(now);

  const storedStreak = parseInt(localStorage.getItem("flowstate_saved_streak") || "0", 10);
  const storedLastDate = localStorage.getItem("flowstate_last_active_date");
  const storedPrevStreak = parseInt(localStorage.getItem("flowstate_previous_streak") || "0", 10);
  const storedLastSaver = localStorage.getItem("flowstate_last_streak_saver_used");
  const modalDismissedDate = localStorage.getItem("flowstate_streak_modal_dismissed_date");

  const streakState = calculateStreakState({
    sessions: sessions as FocusSessionRecord[],
    storedData: {
      currentStreak: storedStreak,
      lastActiveDate: storedLastDate,
      previousStreak: storedPrevStreak,
      lastStreakSaverUsed: storedLastSaver,
    },
    currentDate: now,
  });

  // If already shown and dismissed today, don't trigger modal repeatedly today
  const isDismissedToday = modalDismissedDate === todayStr;

  return {
    isStreakBroken: streakState.isStreakBroken && !isDismissedToday,
    previousStreak: streakState.previousStreak || 1,
    lastActiveDate: streakState.lastActiveDate,
    daysSinceLastActive: streakState.daysSinceLastActive,
    canUseStreakSaver: streakState.canUseStreakSaver,
  };
}

export interface PanicInterventionResult {
  status: "success" | "fallback" | "error";
  modelUsed?: string;
  headline?: string;
  interventionMessage: string;
  coachingInsight?: string;
  quote?: string;
  author?: string;
  timestamp?: string;
}

export async function fetchPanicIntervention(params?: {
  userName?: string;
  minutesLeft?: number;
  focusHours?: number;
  dailyGoal?: number;
  streakDays?: number;
}): Promise<PanicInterventionResult> {
  const fallbackText = "You are 10 minutes away from finishing. Your future self will thank you. Do you really want to quit?";
  try {
    const res = await fetch("/api/coach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...params,
        action: "panic_intervention",
      }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    return {
      ...data,
      interventionMessage: data.interventionMessage || fallbackText,
    };
  } catch (err) {
    console.warn("Client fallback for panic intervention:", err);
    return {
      status: "fallback",
      modelUsed: "local-discipline-engine",
      headline: "Hold The Line. Don't Surrender.",
      interventionMessage: fallbackText,
      coachingInsight: "The friction you feel right now is where your mental resilience is forged. Giving in now only reinforces the habit of quitting.",
      quote: "At the end of the day, you will be defined by what you resisted, not what you gave into.",
      author: "David Goggins",
      timestamp: new Date().toISOString(),
    };
  }
}
