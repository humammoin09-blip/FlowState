"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  Sparkles,
  Clock,
  AlertCircle,
  ClipboardList,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  encodeTaskDuration,
  decodeTaskDuration,
  filterTasksByUserId,
} from "@/lib/user-service";

export interface Task {
  id: string;
  title: string;
  priority?: string;
  category?: string;
  completed: boolean;
  duration?: string;
  remainingSeconds?: number;
  remaining_seconds?: number;
  created_at?: string;
}

export interface TaskListProps {
  tasks?: Task[];
  setTasks?: React.Dispatch<React.SetStateAction<Task[]>>;
  isFocusActive?: boolean;
}

export default function TaskList(props?: TaskListProps) {
  const [internalTasks, setInternalTasks] = useState<Task[]>([]);
  const tasks = props?.tasks ?? internalTasks;
  const setTasks = props?.setTasks ?? setInternalTasks;

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("Medium");
  const [newTaskDuration, setNewTaskDuration] = useState("5");
  const [loading, setLoading] = useState(true);
  const showAlert = tasks.some((t) => !t.completed && t.priority === "High");
  const notifiedTaskTimesRef = React.useRef<Set<string>>(new Set());

  const [isFocusRunning, setIsFocusRunning] = useState<boolean>(false);

  const checkFocusRunning = useCallback(() => {
    if (typeof window === "undefined") return false;
    const running = localStorage.getItem("flowstate_pomodoro_running") === "true";
    const mode = localStorage.getItem("flowstate_pomodoro_mode") || "focus";
    const isFocusActive = props?.isFocusActive !== false;
    return running && mode === "focus" && isFocusActive;
  }, [props?.isFocusActive]);

  useEffect(() => {
    const syncFocusState = () => {
      setIsFocusRunning(checkFocusRunning());
    };

    syncFocusState();
    window.addEventListener("storage", syncFocusState);
    window.addEventListener("focus", syncFocusState);
    document.addEventListener("visibilitychange", syncFocusState);

    return () => {
      window.removeEventListener("storage", syncFocusState);
      window.removeEventListener("focus", syncFocusState);
      document.removeEventListener("visibilitychange", syncFocusState);
    };
  }, [checkFocusRunning]);

  const workerRef = React.useRef<Worker | null>(null);
  const timeoutsRef = React.useRef<Map<string, NodeJS.Timeout>>(new Map());
  const scheduledTasksRef = React.useRef<Map<string, number>>(new Map());
  const notifiedEventsRef = React.useRef<Set<string>>(new Set());
  const toastedEventsRef = React.useRef<Set<string>>(new Set());
  const tasksRef = React.useRef<Task[]>(tasks);

  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  const requestNotificationPermission = useCallback(() => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  const clearTaskTimeouts = useCallback((taskId: string) => {
    const t2m = timeoutsRef.current.get(`${taskId}_2min`);
    if (t2m) {
      clearTimeout(t2m);
      timeoutsRef.current.delete(`${taskId}_2min`);
    }
    const t1m = timeoutsRef.current.get(`${taskId}_1min`);
    if (t1m) {
      clearTimeout(t1m);
      timeoutsRef.current.delete(`${taskId}_1min`);
    }
    const t0m = timeoutsRef.current.get(`${taskId}_0min`);
    if (t0m) {
      clearTimeout(t0m);
      timeoutsRef.current.delete(`${taskId}_0min`);
    }
  }, []);

  const cancelTaskTimeouts = useCallback(
    (taskId: string) => {
      clearTaskTimeouts(taskId);
      scheduledTasksRef.current.delete(taskId);
      if (workerRef.current) {
        try {
          workerRef.current.postMessage({
            type: "CANCEL_TASK",
            taskId,
          });
        } catch {
          // ignore
        }
      }
    },
    [clearTaskTimeouts]
  );

  const cancelAllTaskTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current.clear();
    scheduledTasksRef.current.clear();
    if (workerRef.current) {
      try {
        workerRef.current.postMessage({ type: "STOP_ALL" });
      } catch {
        // ignore
      }
    }
  }, []);

  const handleThresholdTrigger = useCallback(
    (taskId: string, taskTitle: string, threshold: "2min" | "1min" | "0min", endTime: number) => {
      const dedupKey = `${taskId}_${threshold}_${endTime}`;
      const storageKey = `flowstate_mit_notified_${dedupKey}`;

      if (notifiedEventsRef.current.has(dedupKey)) return;
      if (typeof window !== "undefined" && localStorage.getItem(storageKey) === "true") {
        notifiedEventsRef.current.add(dedupKey);
        return;
      }

      notifiedEventsRef.current.add(dedupKey);
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, "true");
      }

      let message = "";
      if (threshold === "2min") {
        message = `Task '${taskTitle}' is ending soon! Only 2 minutes left.`;
      } else if (threshold === "1min") {
        message = `Task '${taskTitle}' is ending soon! Only 1 minute left.`;
      } else if (threshold === "0min") {
        message = `Task '${taskTitle}' has reached 0:00!`;
      }

      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        try {
          new Notification("FlowState MIT Alert ⚡", {
            body: message,
            icon: "/favicon.ico",
          });
        } catch (err) {
          console.warn("MIT Task Notification error:", err);
        }
      }

      if (typeof window !== "undefined") {
        const isVisible = typeof document !== "undefined" && document.visibilityState === "visible";

        if (threshold === "0min") {
          window.dispatchEvent(
            new CustomEvent("flowstate_new_notification", {
              detail: { title: message, type: "task" },
            })
          );
          if (isVisible) {
            toastedEventsRef.current.add(dedupKey);
            localStorage.setItem(`flowstate_mit_toasted_${dedupKey}`, "true");
          }
        } else if (isVisible) {
          window.dispatchEvent(
            new CustomEvent("flowstate_new_notification", {
              detail: { title: message, type: "task" },
            })
          );
          toastedEventsRef.current.add(dedupKey);
          localStorage.setItem(`flowstate_mit_toasted_${dedupKey}`, "true");
        }
      }
    },
    []
  );

  const scheduleTaskNotifications = useCallback(
    (taskId: string, taskTitle: string, endTime: number) => {
      if (typeof window === "undefined") return;

      requestNotificationPermission();

      if (scheduledTasksRef.current.get(taskId) === endTime) {
        return;
      }
      scheduledTasksRef.current.set(taskId, endTime);

      const now = Date.now();
      const delay2m = endTime - 120000 - now;
      const delay1m = endTime - 60000 - now;
      const delay0m = endTime - now;

      clearTaskTimeouts(taskId);

      if (delay2m <= 0) {
        toastedEventsRef.current.add(`${taskId}_2min_${endTime}`);
        localStorage.setItem(`flowstate_mit_toasted_${taskId}_2min_${endTime}`, "true");
      }
      if (delay1m <= 0) {
        toastedEventsRef.current.add(`${taskId}_1min_${endTime}`);
        localStorage.setItem(`flowstate_mit_toasted_${taskId}_1min_${endTime}`, "true");
      }

      if (delay2m > 0) {
        const t2m = setTimeout(() => {
          handleThresholdTrigger(taskId, taskTitle, "2min", endTime);
        }, delay2m);
        timeoutsRef.current.set(`${taskId}_2min`, t2m);
      }

      if (delay1m > 0) {
        const t1m = setTimeout(() => {
          handleThresholdTrigger(taskId, taskTitle, "1min", endTime);
        }, delay1m);
        timeoutsRef.current.set(`${taskId}_1min`, t1m);
      }

      if (delay0m > 0) {
        const t0m = setTimeout(() => {
          handleThresholdTrigger(taskId, taskTitle, "0min", endTime);
        }, delay0m);
        timeoutsRef.current.set(`${taskId}_0min`, t0m);
      }

      if (workerRef.current) {
        try {
          workerRef.current.postMessage({
            type: "SCHEDULE_TASK",
            task: {
              id: taskId,
              title: taskTitle,
              endTime,
              has2m: delay2m > 0,
              has1m: delay1m > 0,
              notified2m: delay2m <= 0,
              notified1m: delay1m <= 0,
              notified0m: delay0m <= 0,
            },
          });
        } catch (err) {
          console.warn("Worker task schedule notice:", err);
        }
      }
    },
    [clearTaskTimeouts, handleThresholdTrigger, requestNotificationPermission]
  );

  useEffect(() => {
    let worker: Worker | null = null;
    let workerBlobUrl: string | null = null;

    try {
      if (typeof window !== "undefined" && typeof Worker !== "undefined") {
        const workerScript = `
          var activeTasks = [];
          var intervalId = null;

          function checkTasks() {
            var now = Date.now();
            for (var i = 0; i < activeTasks.length; i++) {
              var t = activeTasks[i];
              if (!t || !t.endTime) continue;

              if (t.has2m && !t.notified2m && now >= t.endTime - 120000 && now < t.endTime) {
                t.notified2m = true;
                self.postMessage({ type: 'TASK_ALERT', taskId: t.id, taskTitle: t.title, threshold: '2min', endTime: t.endTime });
              }

              if (t.has1m && !t.notified1m && now >= t.endTime - 60000 && now < t.endTime) {
                t.notified1m = true;
                self.postMessage({ type: 'TASK_ALERT', taskId: t.id, taskTitle: t.title, threshold: '1min', endTime: t.endTime });
              }

              if (!t.notified0m && now >= t.endTime) {
                t.notified0m = true;
                self.postMessage({ type: 'TASK_ALERT', taskId: t.id, taskTitle: t.title, threshold: '0min', endTime: t.endTime });
              }
            }
          }

          self.onmessage = function(e) {
            if (!e.data) return;
            var msg = e.data;

            if (msg.type === 'SCHEDULE_TASK') {
              var task = msg.task;
              var idx = -1;
              for (var j = 0; j < activeTasks.length; j++) {
                if (activeTasks[j].id === task.id) {
                  idx = j;
                  break;
                }
              }
              if (idx >= 0) {
                activeTasks[idx] = task;
              } else {
                activeTasks.push(task);
              }
              if (!intervalId) {
                intervalId = setInterval(checkTasks, 500);
              }
              checkTasks();
            } else if (msg.type === 'CANCEL_TASK') {
              activeTasks = activeTasks.filter(function(t) { return t.id !== msg.taskId; });
              if (activeTasks.length === 0 && intervalId) {
                clearInterval(intervalId);
                intervalId = null;
              }
            } else if (msg.type === 'STOP_ALL') {
              activeTasks = [];
              if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
              }
            }
          };
        `;

        const blob = new Blob([workerScript], { type: "application/javascript" });
        workerBlobUrl = URL.createObjectURL(blob);
        worker = new Worker(workerBlobUrl);
        workerRef.current = worker;

        worker.onmessage = (e) => {
          if (e.data && e.data.type === "TASK_ALERT") {
            const { taskId, taskTitle, threshold, endTime } = e.data;
            handleThresholdTrigger(taskId, taskTitle, threshold, endTime);
          }
        };
      }
    } catch (err) {
      console.warn("MIT Task Worker initialization notice:", err);
    }

    return () => {
      if (worker) {
        worker.postMessage({ type: "STOP_ALL" });
        worker.terminate();
        workerRef.current = null;
      }
      if (workerBlobUrl) {
        URL.revokeObjectURL(workerBlobUrl);
      }
    };
  }, [handleThresholdTrigger]);

  const checkVisibilityFallback = useCallback(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    if (document.visibilityState !== "visible") return;
    if (!checkFocusRunning()) return;

    const now = Date.now();
    const currentTasks = tasksRef.current;

    currentTasks.forEach((task) => {
      if (task.completed) return;
      const savedEnd = localStorage.getItem(`task_timer_end_${task.id}`);
      if (!savedEnd) return;
      const endTime = Number(savedEnd);
      const currentTime = Math.max(0, Math.ceil((endTime - now) / 1000));

      if (currentTime <= 0) {
        const key0m = `${task.id}_0min_${endTime}`;
        if (!toastedEventsRef.current.has(key0m) && localStorage.getItem(`flowstate_mit_toasted_${key0m}`) !== "true") {
          toastedEventsRef.current.add(key0m);
          localStorage.setItem(`flowstate_mit_toasted_${key0m}`, "true");
          window.dispatchEvent(
            new CustomEvent("flowstate_new_notification", {
              detail: { title: `Task '${task.title}' has reached 0:00!`, type: "task" },
            })
          );
        }
        toastedEventsRef.current.add(`${task.id}_1min_${endTime}`);
        toastedEventsRef.current.add(`${task.id}_2min_${endTime}`);
      } else if (currentTime <= 60) {
        const key1m = `${task.id}_1min_${endTime}`;
        if (!toastedEventsRef.current.has(key1m) && localStorage.getItem(`flowstate_mit_toasted_${key1m}`) !== "true") {
          toastedEventsRef.current.add(key1m);
          localStorage.setItem(`flowstate_mit_toasted_${key1m}`, "true");
          window.dispatchEvent(
            new CustomEvent("flowstate_new_notification", {
              detail: { title: `Task '${task.title}' is ending soon! Only 1 minute left.`, type: "task" },
            })
          );
        }
        toastedEventsRef.current.add(`${task.id}_2min_${endTime}`);
      } else if (currentTime <= 120) {
        const key2m = `${task.id}_2min_${endTime}`;
        if (!toastedEventsRef.current.has(key2m) && localStorage.getItem(`flowstate_mit_toasted_${key2m}`) !== "true") {
          toastedEventsRef.current.add(key2m);
          localStorage.setItem(`flowstate_mit_toasted_${key2m}`, "true");
          window.dispatchEvent(
            new CustomEvent("flowstate_new_notification", {
              detail: { title: `Task '${task.title}' is ending soon! Only 2 minutes left.`, type: "task" },
            })
          );
        }
      }
    });
  }, [checkFocusRunning]);

  const persistTaskCompletion = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ completed: true, remaining_seconds: 0 })
        .eq("id", taskId);

      if (error) {
        if (error.code === "PGRST204" || error.message?.includes("remaining_seconds")) {
          await supabase.from("tasks").update({ completed: true }).eq("id", taskId);
        } else {
          console.warn("Supabase completion sync warning:", error);
        }
      }
    } catch (err) {
      console.warn("Supabase completion update failed:", err);
    }
  };

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const { data: authData } = await supabase.auth.getUser();
      const activeUid =
        authData?.user?.id ||
        (typeof window !== "undefined"
          ? localStorage.getItem("flowstate_active_user_id") || "guest_default"
          : "guest_default");

      const { data, error } = await supabase.from("tasks").select("*").order("created_at", { ascending: false });

      if (error) throw error;
      if (data) {
        const userTasks = filterTasksByUserId(data, activeUid);
        if (typeof window !== "undefined") {
          localStorage.setItem(`flowstate_cached_tasks_${activeUid}`, JSON.stringify(userTasks));
          localStorage.setItem("flowstate_cached_tasks", JSON.stringify(userTasks));
        }

        const formattedTasks: Task[] = userTasks.map((t) => {
          const isCompletedSaved =
            typeof window !== "undefined" && localStorage.getItem(`task_completed_${t.id}`) === "true";
          const savedTime = typeof window !== "undefined" ? localStorage.getItem(`task_timer_${t.id}`) : null;
          const savedEndTime = typeof window !== "undefined" ? localStorage.getItem(`task_timer_end_${t.id}`) : null;
          const isTaskCompleted = Boolean(
            t.completed || t.remaining_seconds === 0 || isCompletedSaved || savedTime === "0"
          );

          if (isTaskCompleted) {
            if (typeof window !== "undefined") {
              localStorage.setItem(`task_timer_${t.id}`, "0");
              localStorage.setItem(`task_completed_${t.id}`, "true");
              localStorage.removeItem(`task_timer_end_${t.id}`);
            }
            return {
              ...t,
              duration: decodeTaskDuration(t.duration),
              completed: true,
              remainingSeconds: 0,
              remaining_seconds: 0,
            };
          }

          const rawDuration = decodeTaskDuration(t.duration);
          const defaultMins = parseInt(rawDuration || "5", 10) || 5;

          let remaining: number;
          if (savedEndTime !== null) {
            remaining = Math.max(0, Math.ceil((Number(savedEndTime) - Date.now()) / 1000));
          } else if (savedTime !== null) {
            remaining = parseInt(savedTime, 10);
          } else if (t.remaining_seconds !== undefined && t.remaining_seconds !== null) {
            remaining = t.remaining_seconds;
          } else {
            remaining = defaultMins * 60;
          }

          if (remaining <= 0) {
            if (typeof window !== "undefined") {
              localStorage.setItem(`task_timer_${t.id}`, "0");
              localStorage.setItem(`task_completed_${t.id}`, "true");
              localStorage.removeItem(`task_timer_end_${t.id}`);
            }
            return {
              ...t,
              duration: rawDuration,
              completed: true,
              remainingSeconds: 0,
              remaining_seconds: 0,
            };
          }

          return {
            ...t,
            duration: rawDuration,
            completed: false,
            remainingSeconds: isNaN(remaining) ? defaultMins * 60 : remaining,
          };
        });
        setTasks(formattedTasks);
      }
    } catch (error) {
      console.warn("Graceful fallback: error fetching tasks from database, loading local cache:", error);
      if (typeof window !== "undefined") {
        const activeUid = localStorage.getItem("flowstate_active_user_id") || "guest_default";
        const cached = localStorage.getItem(`flowstate_cached_tasks_${activeUid}`) || localStorage.getItem("flowstate_cached_tasks");
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            const normalized = parsed.map((t: Task) => {
              const isCompletedSaved = localStorage.getItem(`task_completed_${t.id}`) === "true";
              const savedTime = localStorage.getItem(`task_timer_${t.id}`);
              const savedEndTime = localStorage.getItem(`task_timer_end_${t.id}`);
              const rawDuration = decodeTaskDuration(t.duration);
              if (t.completed || t.remaining_seconds === 0 || isCompletedSaved || savedTime === "0") {
                return { ...t, duration: rawDuration, completed: true, remainingSeconds: 0, remaining_seconds: 0 };
              }
              const defaultMins = parseInt(rawDuration || "5", 10) || 5;
              let rem: number;
              if (savedEndTime !== null) {
                rem = Math.max(0, Math.ceil((Number(savedEndTime) - Date.now()) / 1000));
              } else if (savedTime !== null) {
                rem = parseInt(savedTime, 10);
              } else {
                rem = t.remainingSeconds ?? defaultMins * 60;
              }
              return {
                ...t,
                duration: rawDuration,
                completed: rem <= 0,
                remainingSeconds: isNaN(rem) ? defaultMins * 60 : Math.max(0, rem),
              };
            });
            setTasks(normalized);
          } catch {
            // keep existing tasks
          }
        }
      }
    } finally {
      setLoading(false);
    }
  }, [setTasks]);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    fetchTasks();

    const channel = supabase
      .channel("tasks_realtime_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, () => {
        fetchTasks();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTasks]);

  useEffect(() => {
    const tick = () => {
      const focusRunning = checkFocusRunning();
      const now = Date.now();

      if (!focusRunning) {
        cancelAllTaskTimeouts();
        setTasks((prevTasks) => {
          let hasChanges = false;
          const nextTasks = prevTasks.map((task) => {
            if (task.completed || task.remainingSeconds === 0) return task;
            const endVal = typeof window !== "undefined" ? localStorage.getItem(`task_timer_end_${task.id}`) : null;
            if (endVal) {
              hasChanges = true;
              const rem = Math.max(0, Math.ceil((Number(endVal) - now) / 1000));
              if (typeof window !== "undefined") {
                localStorage.setItem(`task_timer_${task.id}`, rem.toString());
                localStorage.removeItem(`task_timer_end_${task.id}`);
              }
              return { ...task, remainingSeconds: rem };
            }
            return task;
          });
          if (hasChanges && typeof window !== "undefined") {
            localStorage.setItem("flowstate_cached_tasks", JSON.stringify(nextTasks));
          }
          return nextTasks;
        });
        return;
      }

      const justCompletedTaskIds: string[] = [];

      setTasks((prevTasks) => {
        const nextTasks = prevTasks.map((task) => {
          if (task.completed || task.remainingSeconds === 0) return task;

          const isCompletedSaved =
            typeof window !== "undefined" && localStorage.getItem(`task_completed_${task.id}`) === "true";
          if (isCompletedSaved) {
            if (typeof window !== "undefined") {
              localStorage.setItem(`task_timer_${task.id}`, "0");
              localStorage.removeItem(`task_timer_end_${task.id}`);
            }
            return { ...task, completed: true, remainingSeconds: 0, remaining_seconds: 0 };
          }

          let endTime: number;
          const savedEnd = typeof window !== "undefined" ? localStorage.getItem(`task_timer_end_${task.id}`) : null;

          if (savedEnd) {
            endTime = Number(savedEnd);
          } else {
            const savedTime = typeof window !== "undefined" ? localStorage.getItem(`task_timer_${task.id}`) : null;
            const defaultMins = parseInt(task.duration || "5", 10) || 5;
            let durationInSeconds: number;

            if (task.remainingSeconds !== undefined && task.remainingSeconds > 0) {
              durationInSeconds = task.remainingSeconds;
            } else if (savedTime !== null && parseInt(savedTime, 10) > 0) {
              durationInSeconds = parseInt(savedTime, 10);
            } else if (task.remaining_seconds !== undefined && task.remaining_seconds !== null && task.remaining_seconds > 0) {
              durationInSeconds = task.remaining_seconds;
            } else {
              durationInSeconds = defaultMins * 60;
            }

            endTime = now + durationInSeconds * 1000;
            if (typeof window !== "undefined") {
              localStorage.setItem(`task_timer_end_${task.id}`, String(endTime));
              localStorage.setItem(`task_timer_${task.id}`, String(durationInSeconds));
            }
          }

          scheduleTaskNotifications(task.id, task.title, endTime);

          const currentTime = Math.max(0, Math.ceil((endTime - now) / 1000));

          if (typeof window !== "undefined") {
            localStorage.setItem(`task_timer_${task.id}`, currentTime.toString());
          }

          if (currentTime <= 0) {
            if (typeof window !== "undefined") {
              localStorage.setItem(`task_timer_${task.id}`, "0");
              localStorage.setItem(`task_completed_${task.id}`, "true");
              localStorage.removeItem(`task_timer_end_${task.id}`);
            }

            justCompletedTaskIds.push(task.id);
            handleThresholdTrigger(task.id, task.title, "0min", endTime);

            return { ...task, completed: true, remainingSeconds: 0, remaining_seconds: 0 };
          }

          return { ...task, remainingSeconds: currentTime };
        });

        if (typeof window !== "undefined") {
          localStorage.setItem("flowstate_cached_tasks", JSON.stringify(nextTasks));
        }

        return nextTasks;
      });

      if (justCompletedTaskIds.length > 0) {
        justCompletedTaskIds.forEach(async (taskId) => {
          await persistTaskCompletion(taskId);
        });
      }
    };

    const onVisibilityChange = () => {
      tick();
      checkVisibilityFallback();
    };

    const onFocus = () => {
      tick();
      checkVisibilityFallback();
    };

    const onTimerStarted = () => {
      requestNotificationPermission();
      tick();
    };

    tick();
    checkVisibilityFallback();
    const timer = setInterval(tick, 1000);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("focus", onFocus);
    window.addEventListener("storage", tick);
    window.addEventListener("flowstate_timer_started", onTimerStarted);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("storage", tick);
      window.removeEventListener("flowstate_timer_started", onTimerStarted);
    };
  }, [
    checkFocusRunning,
    setTasks,
    scheduleTaskNotifications,
    handleThresholdTrigger,
    cancelAllTaskTimeouts,
    checkVisibilityFallback,
    requestNotificationPermission,
  ]);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    requestNotificationPermission();

    const { data: authData } = await supabase.auth.getUser();
    const activeUid =
      authData?.user?.id ||
      (typeof window !== "undefined"
        ? localStorage.getItem("flowstate_active_user_id") || "guest_default"
        : "guest_default");

    const durationMins = parseInt(newTaskDuration, 10) || 5;
    const initialSeconds = durationMins * 60;
    const fallbackId = `local_task_${Date.now()}`;
    const encodedDuration = encodeTaskDuration(`${durationMins}m`, activeUid);

    try {
      let data, error;
      const insertAttempt = await supabase.from("tasks").insert([{ title: newTaskTitle, priority: newTaskPriority, completed: false, duration: encodedDuration, remaining_seconds: initialSeconds }]).select();

      data = insertAttempt.data;
      error = insertAttempt.error;

      if (error && (error.code === "PGRST204" || error.message?.includes("remaining_seconds"))) {
        const retry = await supabase.from("tasks").insert([{ title: newTaskTitle, priority: newTaskPriority, completed: false, duration: encodedDuration }]).select();
        data = retry.data;
        error = retry.error;
      }

      if (error) throw error;
      if (data) {
        const newTaskId = data[0].id;
        const focusRunning = checkFocusRunning();
        localStorage.setItem(`task_timer_${newTaskId}`, initialSeconds.toString());
        localStorage.setItem(`task_completed_${newTaskId}`, "false");
        if (focusRunning) {
          const taskEndTime = Date.now() + initialSeconds * 1000;
          localStorage.setItem(`task_timer_end_${newTaskId}`, String(taskEndTime));
          scheduleTaskNotifications(newTaskId, newTaskTitle, taskEndTime);
        } else {
          localStorage.removeItem(`task_timer_end_${newTaskId}`);
        }

        const newTask: Task = {
          ...data[0],
          duration: `${durationMins}m`,
          completed: false,
          remainingSeconds: initialSeconds,
          remaining_seconds: initialSeconds,
        };
        const updated = [newTask, ...tasks];
        setTasks(updated);
        localStorage.setItem(`flowstate_cached_tasks_${activeUid}`, JSON.stringify(updated));
        localStorage.setItem("flowstate_cached_tasks", JSON.stringify(updated));
        setNewTaskTitle("");
        setNewTaskDuration("5");
      }
    } catch (error) {
      console.warn("Supabase insert failed, persisting task to local storage:", error);
      const focusRunning = checkFocusRunning();
      localStorage.setItem(`task_timer_${fallbackId}`, initialSeconds.toString());
      localStorage.setItem(`task_completed_${fallbackId}`, "false");
      if (focusRunning) {
        const taskEndTime = Date.now() + initialSeconds * 1000;
        localStorage.setItem(`task_timer_end_${fallbackId}`, String(taskEndTime));
        scheduleTaskNotifications(fallbackId, newTaskTitle, taskEndTime);
      } else {
        localStorage.removeItem(`task_timer_end_${fallbackId}`);
      }

      const fallbackTask: Task = {
        id: fallbackId,
        title: newTaskTitle,
        priority: newTaskPriority,
        completed: false,
        duration: `${durationMins}m`,
        remainingSeconds: initialSeconds,
        remaining_seconds: initialSeconds,
        created_at: new Date().toISOString(),
      };
      const updated = [fallbackTask, ...tasks];
      setTasks(updated);
      localStorage.setItem(`flowstate_cached_tasks_${activeUid}`, JSON.stringify(updated));
      localStorage.setItem("flowstate_cached_tasks", JSON.stringify(updated));
      setNewTaskTitle("");
      setNewTaskDuration("5");
    }
  };

  const toggleTask = async (id: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    const task = tasks.find((t) => t.id === id);
    const defaultSecs = (parseInt(task?.duration || "5", 10) || 5) * 60;

    if (nextStatus) {
      cancelTaskTimeouts(id);
      if (typeof window !== "undefined") {
        localStorage.setItem(`task_timer_${id}`, "0");
        localStorage.setItem(`task_completed_${id}`, "true");
        localStorage.removeItem(`task_timer_end_${id}`);
      }
    } else {
      if (typeof window !== "undefined") {
        localStorage.setItem(`task_completed_${id}`, "false");
        localStorage.setItem(`task_timer_${id}`, defaultSecs.toString());
        if (checkFocusRunning()) {
          requestNotificationPermission();
          const taskEndTime = Date.now() + defaultSecs * 1000;
          localStorage.setItem(`task_timer_end_${id}`, String(taskEndTime));
          scheduleTaskNotifications(id, task?.title || "Task", taskEndTime);
        } else {
          localStorage.removeItem(`task_timer_end_${id}`);
          cancelTaskTimeouts(id);
        }
      }
    }

    const updated = tasks.map((t) =>
      t.id === id
        ? { ...t, completed: nextStatus, remainingSeconds: nextStatus ? 0 : defaultSecs, remaining_seconds: nextStatus ? 0 : defaultSecs }
        : t
    );
    setTasks(updated);
    if (typeof window !== "undefined") {
      const activeUid = localStorage.getItem("flowstate_active_user_id") || "guest_default";
      localStorage.setItem(`flowstate_cached_tasks_${activeUid}`, JSON.stringify(updated));
      localStorage.setItem("flowstate_cached_tasks", JSON.stringify(updated));
    }

    try {
      const updatePayload = nextStatus ? { completed: true, remaining_seconds: 0 } : { completed: false, remaining_seconds: defaultSecs };

      const { error } = await supabase.from("tasks").update(updatePayload).eq("id", id);

      if (error) {
        if (error.code === "PGRST204" || error.message?.includes("remaining_seconds")) {
          await supabase.from("tasks").update({ completed: nextStatus }).eq("id", id);
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.warn("Supabase task toggle sync warning (local state preserved):", error);
    }
  };

  const deleteTask = async (id: string) => {
    cancelTaskTimeouts(id);
    if (typeof window !== "undefined") {
      localStorage.removeItem(`task_timer_${id}`);
      localStorage.removeItem(`task_completed_${id}`);
      localStorage.removeItem(`task_timer_end_${id}`);
    }
    const updated = tasks.filter((task) => task.id !== id);
    setTasks(updated);
    if (typeof window !== "undefined") {
      const activeUid = localStorage.getItem("flowstate_active_user_id") || "guest_default";
      localStorage.setItem(`flowstate_cached_tasks_${activeUid}`, JSON.stringify(updated));
      localStorage.setItem("flowstate_cached_tasks", JSON.stringify(updated));
    }

    try {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
    } catch (error) {
      console.warn("Supabase task deletion sync warning (local state preserved):", error);
    }
  };

  const clearCompletedTasks = async () => {
    const completedTasks = tasks.filter((t) => t.completed || t.remainingSeconds === 0);
    if (completedTasks.length === 0) return;

    const completedIds = completedTasks.map((t) => t.id);

    completedIds.forEach((id) => cancelTaskTimeouts(id));

    if (typeof window !== "undefined") {
      completedIds.forEach((id) => {
        localStorage.removeItem(`task_timer_${id}`);
        localStorage.removeItem(`task_completed_${id}`);
        localStorage.removeItem(`task_timer_end_${id}`);
      });
    }

    const updated = tasks.filter((t) => !t.completed && t.remainingSeconds !== 0);
    setTasks(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("flowstate_cached_tasks", JSON.stringify(updated));
    }

    try {
      const { error } = await supabase.from("tasks").delete().in("id", completedIds);
      if (error) throw error;
    } catch (error) {
      console.warn("Supabase clear completed sync warning:", error);
    }
  };

  const formatTime = (seconds?: number) => {
    if (seconds === undefined || isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4 rounded-[28px] border border-slate-800 bg-slate-950/70 p-3 shadow-[0_18px_40px_rgba(2,6,23,0.35)] sm:p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-300">
            <Sparkles className="h-4 w-4" />
          </span>
          <h2 className="text-lg font-semibold tracking-tight text-slate-50 sm:text-xl">Most Important Tasks</h2>
        </div>

        {tasks.some((t) => t.completed || t.remainingSeconds === 0) && (
          <button
            onClick={clearCompletedTasks}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/80 px-2.5 py-1.5 text-[10px] font-medium text-slate-300 transition hover:border-slate-600 hover:text-white"
            title="Clean up completed tasks without restarting them"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear completed
          </button>
        )}
      </div>

      <AnimatePresence>
        {showAlert && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center justify-between gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-200"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-300" />
              <span>
                <strong className="font-semibold text-amber-100">Attention required:</strong> You have high-priority MIT tasks pending focus attention.
              </span>
            </div>
            <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.16em] text-amber-300">
              Alerts active
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={addTask} className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_110px_130px_auto]">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new task..."
          className="h-11 rounded-xl border border-slate-800 bg-slate-900/80 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-500/40 focus:outline-none"
        />

        <input
          type="number"
          value={newTaskDuration}
          onChange={(e) => setNewTaskDuration(e.target.value)}
          placeholder="Minutes"
          className="h-11 rounded-xl border border-slate-800 bg-slate-900/80 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-500/40 focus:outline-none"
        />

        <select
          value={newTaskPriority}
          onChange={(e) => setNewTaskPriority(e.target.value)}
          className="h-11 rounded-xl border border-slate-800 bg-slate-900/80 px-3 text-sm text-slate-200 focus:border-cyan-500/40 focus:outline-none"
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </form>

      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-3 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-md bg-slate-800" />
                  <div className="h-4 w-32 rounded-full bg-slate-800" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-7 w-16 rounded-full bg-slate-800" />
                  <div className="h-7 w-16 rounded-full bg-slate-800" />
                  <div className="h-4 w-4 rounded bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 px-4 py-10 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-300">
              <ClipboardList className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-slate-100">No active MIT tasks yet</p>
            <p className="mt-1 max-w-sm text-xs text-slate-400">
              Add your Most Important Tasks above to prioritize high-impact work and keep focus running smoothly.
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`flex flex-col gap-3 rounded-2xl border p-3 transition sm:flex-row sm:items-center sm:justify-between ${
                task.completed
                  ? "border-slate-800 bg-slate-900/50 text-slate-500 line-through"
                  : "border-slate-800 bg-slate-900/70 text-slate-100 hover:border-slate-700"
              }`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <button type="button" onClick={() => toggleTask(task.id, task.completed)} className="flex-shrink-0">
                  {task.completed ? (
                    <CheckSquare className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <Square className="h-5 w-5 text-slate-500 transition hover:text-slate-200" />
                  )}
                </button>
                <span className="min-w-0 truncate text-sm font-medium">{task.title}</span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <span className="inline-flex items-center gap-1 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-medium text-cyan-300">
                  <Clock className="h-3 w-3" />
                  {formatTime(task.remainingSeconds)}
                </span>
                <span className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-[10px] font-medium text-slate-300">
                  {task.priority}
                </span>
                <button
                  type="button"
                  onClick={() => deleteTask(task.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-rose-300"
                  title="Delete task"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
