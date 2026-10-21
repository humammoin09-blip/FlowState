"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from "react";

export type NotificationType = "pomodoro" | "task" | "streak" | "system";

export interface NotificationItem {
  id: string | number;
  title: string;
  time: string;
  timestamp: number;
  read: boolean;
  type?: NotificationType;
}

export const STORAGE_KEY_NOTIFICATIONS = "flowstate_notifications";
export const NOTIFICATION_EVENT = "flowstate_new_notification";

export interface NotificationContextValue {
  notifications: NotificationItem[];
  unreadCount: number;
  addNotification: (item: {
    title: string;
    type?: NotificationType;
    timestamp?: number;
  }) => void;
  markAllAsRead: () => void;
  markAsRead: (id: string | number) => void;
  clearAllNotifications: () => void;
  removeNotification: (id: string | number) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function formatTimeAgo(timestamp?: number, fallback = "Just now"): string {
  if (!timestamp) return fallback;
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay}d ago`;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "welcome-1",
    title: "Welcome to FlowState! ⚡",
    time: "Just now",
    timestamp: Date.now(),
    read: false,
    type: "system",
  },
];

export function dispatchFlowStateNotification(notification: {
  title: string;
  type?: NotificationType;
  timestamp?: number;
}) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(NOTIFICATION_EVENT, {
        detail: notification,
      })
    );
  }
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const notifiedEventsRef = useRef<Set<string>>(new Set());
  const recentTitlesRef = useRef<Map<string, number>>(new Map());

  // Helper to persist to localStorage safely
  const persistNotifications = useCallback((items: NotificationItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(items.slice(0, 50)));
    } catch {
      // Ignore write errors (quota, incognito)
    }
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
      if (saved) {
        const parsed: NotificationItem[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const updated = parsed.map((n) => ({
            ...n,
            time: formatTimeAgo(n.timestamp, n.time),
          }));
          setNotifications(updated);
          return;
        }
      }
    } catch {
      // fallback on json parse error
    }

    setNotifications(DEFAULT_NOTIFICATIONS);
    persistNotifications(DEFAULT_NOTIFICATIONS);
  }, [persistNotifications]);

  // Add notification function
  const addNotification = useCallback(
    (item: { title: string; type?: NotificationType; timestamp?: number }) => {
      const now = item.timestamp || Date.now();
      const title = item.title.trim();

      // Debounce identical notifications within 4 seconds
      const lastSent = recentTitlesRef.current.get(title);
      if (lastSent && now - lastSent < 4000) {
        return;
      }
      recentTitlesRef.current.set(title, now);

      const newItem: NotificationItem = {
        id: `notif-${now}-${Math.random().toString(36).substring(2, 7)}`,
        title,
        time: "Just now",
        timestamp: now,
        read: false,
        type: item.type || "system",
      };

      setNotifications((prev) => {
        const updated = [newItem, ...prev.slice(0, 49)];
        persistNotifications(updated);
        return updated;
      });
    },
    [persistNotifications]
  );

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => {
      const hasUnread = prev.some((n) => !n.read);
      if (!hasUnread) return prev;
      const updated = prev.map((n) => ({ ...n, read: true }));
      persistNotifications(updated);
      return updated;
    });
  }, [persistNotifications]);

  // Mark single as read
  const markAsRead = useCallback(
    (id: string | number) => {
      setNotifications((prev) => {
        const target = prev.find((n) => n.id === id);
        if (!target || target.read) return prev;
        const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
        persistNotifications(updated);
        return updated;
      });
    },
    [persistNotifications]
  );

  // Clear all
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    persistNotifications([]);
  }, [persistNotifications]);

  // Remove single
  const removeNotification = useCallback(
    (id: string | number) => {
      setNotifications((prev) => {
        const updated = prev.filter((n) => n.id !== id);
        persistNotifications(updated);
        return updated;
      });
    },
    [persistNotifications]
  );

  // Real-time event listeners & cross-tab sync
  useEffect(() => {
    const handleCustomNotification = (e: Event) => {
      const customEvent = e as CustomEvent<{
        title: string;
        type?: NotificationType;
        timestamp?: number;
      }>;
      if (customEvent.detail && customEvent.detail.title) {
        addNotification({
          title: customEvent.detail.title,
          type: customEvent.detail.type,
          timestamp: customEvent.detail.timestamp,
        });
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_NOTIFICATIONS && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setNotifications(
              parsed.map((n: NotificationItem) => ({
                ...n,
                time: formatTimeAgo(n.timestamp, n.time),
              }))
            );
          }
        } catch {
          // ignore
        }
      }
    };

    // Background poller to catch timer completion even if timer component was unmounted or asleep
    const checkTimerEvents = () => {
      if (typeof window === "undefined") return;

      const now = Date.now();

      // 1. Pomodoro Timer Checking
      const pomodoroTargetEnd = localStorage.getItem("flowstate_pomodoro_target_end_time");
      const pomodoroRunning = localStorage.getItem("flowstate_pomodoro_running") === "true";
      const pomodoroMode = (localStorage.getItem("flowstate_pomodoro_mode") as NotificationType) || "pomodoro";

      if (pomodoroTargetEnd && pomodoroRunning) {
        const endTimeNum = Number(pomodoroTargetEnd);
        const remaining = Math.ceil((endTimeNum - now) / 1000);

        // Session ending soon (120s = 2 mins)
        if (remaining > 0 && remaining <= 120) {
          const endingSoonKey = `pomodoro_ending_soon_${endTimeNum}`;
          if (!notifiedEventsRef.current.has(endingSoonKey)) {
            notifiedEventsRef.current.add(endingSoonKey);
            addNotification({
              title: "2 minutes left in your focus session.",
              type: "pomodoro",
            });
          }
        }

        // Session complete (0:00)
        if (remaining <= 0) {
          const eventKey = `pomodoro_zero_${endTimeNum}`;
          if (!notifiedEventsRef.current.has(eventKey)) {
            notifiedEventsRef.current.add(eventKey);
            const savedMins =
              localStorage.getItem("flowstate_current_session_duration") ||
              localStorage.getItem("flowstate_last_completed_session_duration") ||
              "25";
            if (pomodoroMode === "pomodoro" || pomodoroMode === ("focus" as any)) {
              addNotification({
                title: `You completed a ${savedMins}m session! Great job.`,
                type: "pomodoro",
              });
            } else {
              addNotification({
                title: "Pomodoro break complete! Ready to start another focus block?",
                type: "pomodoro",
              });
            }
          }
        }
      }

      // 2. MIT Task Timers Checking
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("task_timer_end_")) {
          const taskId = key.replace("task_timer_end_", "");
          const endVal = localStorage.getItem(key);
          if (endVal) {
            const endNum = Number(endVal);
            const taskRemaining = Math.ceil((endNum - now) / 1000);
            if (taskRemaining <= 0) {
              const eventKey = `task_zero_${taskId}_${endNum}`;
              if (!notifiedEventsRef.current.has(eventKey)) {
                notifiedEventsRef.current.add(eventKey);

                // Look up task title from saved tasks
                let taskTitle = "Task";
                try {
                  const tasksRaw = localStorage.getItem("flowstate_tasks");
                  if (tasksRaw) {
                    const parsedTasks = JSON.parse(tasksRaw);
                    if (Array.isArray(parsedTasks)) {
                      const found = parsedTasks.find((t: { id: string | number; title?: string }) => String(t.id) === String(taskId));
                      if (found && found.title) {
                        taskTitle = found.title;
                      }
                    }
                  }
                } catch {
                  // ignore
                }

                addNotification({
                  title: `MIT Task '${taskTitle}' timer hit 0:00.`,
                  type: "task",
                });
              }
            }
          }
        }
      }
    };

    window.addEventListener(NOTIFICATION_EVENT, handleCustomNotification);
    window.addEventListener("storage", handleStorageChange);
    const pollerInterval = setInterval(checkTimerEvents, 1000);

    return () => {
      window.removeEventListener(NOTIFICATION_EVENT, handleCustomNotification);
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(pollerInterval);
    };
  }, [addNotification]);

  // Periodic relative time update (e.g. "Just now" -> "2m ago")
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          time: formatTimeAgo(n.timestamp, n.time),
        }))
      );
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAllAsRead,
        markAsRead,
        clearAllNotifications,
        removeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
