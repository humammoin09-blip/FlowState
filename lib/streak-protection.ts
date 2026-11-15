import { getLocalDateString } from "./streak-service";

/**
 * Smart Streak Protection & Inactivity Notification Service
 * Sends strategic accountability browser notifications if the user hasn't logged
 * any focus time by evening, reminding them before their streak resets at midnight.
 */

export function checkAndSendEveningStreakAlert(params: {
  focusHours: number;
  streakDays: number;
  dailyGoal: number;
  hasCompletedSessionToday?: boolean;
  thresholdHour?: number;
}): { triggered: boolean; reason: string } {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return { triggered: false, reason: "Notifications not supported in this environment" };
  }

  // 1. Condition: User must have an active streak > 0
  if (!params.streakDays || params.streakDays <= 0) {
    return { triggered: false, reason: "No active streak (> 0) to protect" };
  }

  const now = new Date();
  const currentHour = now.getHours(); // 0 - 23
  const todayStr = getLocalDateString(now);

  // 2. Condition: Current time is past a certain threshold (late evening, default 20:00 / 8:00 PM)
  const thresholdHour = params.thresholdHour ?? 20;
  const isLateEvening = currentHour >= thresholdHour;
  if (!isLateEvening) {
    return {
      triggered: false,
      reason: `Current time (${currentHour}:00) is before evening threshold (${thresholdHour}:00)`,
    };
  }

  // 3. Condition: User hasn't already completed a session today
  let completedToday = Boolean(params.hasCompletedSessionToday) || params.focusHours > 0;
  if (!completedToday && typeof window !== "undefined") {
    try {
      const activeUid = localStorage.getItem("flowstate_active_user_id") || "guest_default";
      const lastActive =
        localStorage.getItem(`flowstate_last_active_date_${activeUid}`) ||
        localStorage.getItem("flowstate_last_active_date");
      if (lastActive === todayStr) {
        completedToday = true;
      }
    } catch {
      // ignore localStorage read error
    }
  }

  if (completedToday) {
    return { triggered: false, reason: "User has already completed a session today" };
  }

  const storageKey = `flowstate_streak_evening_alert_${todayStr}`;
  const alreadySent = localStorage.getItem(storageKey);

  if (alreadySent === "true") {
    return { triggered: false, reason: "Already alerted today" };
  }

  try {
    const streakDays = params.streakDays;
    const titleText = `⚠️ Your streak is about to break! (${streakDays}-day streak at risk)`;

    window.dispatchEvent(
      new CustomEvent("flowstate_new_notification", {
        detail: {
          title: titleText,
          type: "streak",
        },
      })
    );

    if (Notification.permission === "granted") {
      new Notification("⚠️ Streak Shield: Do Not Break The Chain!", {
        body: `It's late evening and you haven't completed a focus session today. Your ${streakDays}-day streak is about to break at midnight! Lock in a focus session now.`,
        icon: "/favicon.ico",
        tag: "flowstate-streak-protection",
      });
    }

    localStorage.setItem(storageKey, "true");
    return { triggered: true, reason: "Late evening streak break alert dispatched" };
  } catch (err) {
    console.warn("Failed to dispatch evening streak notification:", err);
    return { triggered: false, reason: "Notification dispatch error" };
  }
}

/**
 * Allows immediate manual testing / verification of the browser accountability alert
 */
export function sendTestStreakAlert(params: {
  streakDays: number;
  focusHours: number;
}): boolean {
  if (typeof window === "undefined" || !("Notification" in window)) {
    alert("Browser notifications are not supported in this browser.");
    return false;
  }

  if (Notification.permission === "granted") {
    const streakText = params.streakDays > 0 ? `${params.streakDays}-day active streak` : "daily consistency";
    window.dispatchEvent(
      new CustomEvent("flowstate_new_notification", {
        detail: {
          title: `🛡️ FlowState Streak Shield Alert: Protect your ${streakText}!`,
          type: "streak",
        },
      })
    );
    new Notification("🛡️ FlowState Streak Shield Alert (Test)", {
      body: `Accountability Check: You're at risk of losing your ${streakText} before midnight! Deploy a 25m focus sprint now.`,
      icon: "/favicon.ico",
      tag: "flowstate-streak-test",
    });
    return true;
  } else if (Notification.permission === "default") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        sendTestStreakAlert(params);
      }
    });
  } else {
    alert("Browser notifications are blocked. Please enable notification permissions in your browser settings to receive streak protection alerts.");
  }
  return false;
}
