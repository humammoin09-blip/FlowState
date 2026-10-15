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

  const persistTaskCompletion = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ completed: true, remaining_seconds: 0 })
        .eq("id", taskId);

      if (error) {
        if (error.code === "PGRST204" || error.message?.includes("remaining_seconds")) {
          await supabase
            .from("tasks")
            .update({ completed: true })
            .eq("id", taskId);
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
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) {
        if (typeof window !== "undefined") {
          localStorage.setItem("flowstate_cached_tasks", JSON.stringify(data));
        }

        const formattedTasks: Task[] = data.map((t) => {
          const isCompletedSaved =
            typeof window !== "undefined" &&
            localStorage.getItem(`task_completed_${t.id}`) === "true";
          const savedTime =
            typeof window !== "undefined"
              ? localStorage.getItem(`task_timer_${t.id}`)
              : null;
          const isTaskCompleted = Boolean(
            t.completed ||
              t.remaining_seconds === 0 ||
              isCompletedSaved ||
              savedTime === "0"
          );

          if (isTaskCompleted) {
            if (typeof window !== "undefined") {
              localStorage.setItem(`task_timer_${t.id}`, "0");
              localStorage.setItem(`task_completed_${t.id}`, "true");
              localStorage.removeItem(`task_timer_end_${t.id}`);
            }
            return {
              ...t,
              completed: true,
              remainingSeconds: 0,
              remaining_seconds: 0,
            };
          }

          const defaultMins = parseInt(t.duration || "5", 10) || 5;

          let remaining: number;
          if (savedTime !== null) {
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
            }
            return {
              ...t,
              completed: true,
              remainingSeconds: 0,
              remaining_seconds: 0,
            };
          }

          if (typeof window !== "undefined") {
            localStorage.removeItem(`task_timer_end_${t.id}`);
          }

          return {
            ...t,
            completed: false,
            remainingSeconds: isNaN(remaining) ? defaultMins * 60 : remaining,
          };
        });
        setTasks(formattedTasks);
      }
    } catch (error) {
      console.warn("Graceful fallback: error fetching tasks from database, loading local cache:", error);
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem("flowstate_cached_tasks");
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            const normalized = parsed.map((t: Task) => {
              const isCompletedSaved = localStorage.getItem(`task_completed_${t.id}`) === "true";
              const savedTime = localStorage.getItem(`task_timer_${t.id}`);
              if (t.completed || t.remaining_seconds === 0 || isCompletedSaved || savedTime === "0") {
                return {
                  ...t,
                  completed: true,
                  remainingSeconds: 0,
                  remaining_seconds: 0,
                };
              }
              const defaultMins = parseInt(t.duration || "5", 10) || 5;
              const rem = savedTime !== null ? parseInt(savedTime, 10) : (t.remainingSeconds ?? defaultMins * 60);
              return {
                ...t,
                completed: false,
                remainingSeconds: isNaN(rem) ? defaultMins * 60 : rem,
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
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        () => {
          fetchTasks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTasks]);

  const [isFocusRunning, setIsFocusRunning] = useState<boolean>(false);
  const lastTickTimeRef = React.useRef<number | null>(null);

  const checkFocusRunning = useCallback(() => {
    if (typeof window === "undefined") return false;
    const running = localStorage.getItem("flowstate_pomodoro_running") === "true";
    const mode = localStorage.getItem("flowstate_pomodoro_mode") || "focus";
    const isFocusActive = props?.isFocusActive !== false;
    return running && mode === "focus" && isFocusActive;
  }, [props?.isFocusActive]);

  // Reactively track focus running state from props, localStorage, and cross-tab storage events
  useEffect(() => {
    const syncFocusState = () => {
      setIsFocusRunning(checkFocusRunning());
    };

    syncFocusState();
    window.addEventListener("storage", syncFocusState);
    window.addEventListener("focus", syncFocusState);
    window.addEventListener("visibilitychange", syncFocusState);

    return () => {
      window.removeEventListener("storage", syncFocusState);
      window.removeEventListener("focus", syncFocusState);
      window.removeEventListener("visibilitychange", syncFocusState);
    };
  }, [checkFocusRunning]);

  // Countdown timer interval - only decrements while active focus session is running
  useEffect(() => {
    if (!isFocusRunning) {
      lastTickTimeRef.current = null;
      return;
    }

    if (!lastTickTimeRef.current) {
      lastTickTimeRef.current = Date.now();
    }

    const tick = () => {
      if (!checkFocusRunning()) {
        lastTickTimeRef.current = null;
        return;
      }

      const now = Date.now();
      if (!lastTickTimeRef.current) {
        lastTickTimeRef.current = now;
        return;
      }

      const deltaMs = now - lastTickTimeRef.current;
      const deltaSecs = Math.floor(deltaMs / 1000);
      if (deltaSecs < 1) return;

      lastTickTimeRef.current += deltaSecs * 1000;

      const justCompletedTaskIds: string[] = [];

      setTasks((prevTasks) => {
        const nextTasks = prevTasks.map((task) => {
          // Guard at the top: skip already completed or 0-remaining tasks
          if (task.completed || task.remainingSeconds === 0) return task;

          let currentRemaining = task.remainingSeconds;
          if (currentRemaining === undefined) {
            // Check localStorage task_completed BEFORE fallback logic
            const isCompletedSaved =
              typeof window !== "undefined" &&
              localStorage.getItem(`task_completed_${task.id}`) === "true";
            if (isCompletedSaved) {
              if (typeof window !== "undefined") {
                localStorage.setItem(`task_timer_${task.id}`, "0");
              }
              return {
                ...task,
                completed: true,
                remainingSeconds: 0,
                remaining_seconds: 0,
              };
            }

            const savedTime =
              typeof window !== "undefined"
                ? localStorage.getItem(`task_timer_${task.id}`)
                : null;
            const defaultMins = parseInt(task.duration || "5", 10) || 5;

            if (savedTime !== null) {
              currentRemaining = parseInt(savedTime, 10);
            } else if (task.remaining_seconds !== undefined && task.remaining_seconds !== null) {
              currentRemaining = task.remaining_seconds;
            } else {
              currentRemaining = defaultMins * 60;
            }
          }

          if (currentRemaining <= 0) {
            if (typeof window !== "undefined") {
              localStorage.setItem(`task_timer_${task.id}`, "0");
              localStorage.setItem(`task_completed_${task.id}`, "true");
            }
            return {
              ...task,
              completed: true,
              remainingSeconds: 0,
              remaining_seconds: 0,
            };
          }

          const currentTime = Math.max(0, currentRemaining - deltaSecs);
          console.log('MIT tick:', currentTime, Date.now());

          if (typeof window !== "undefined") {
            localStorage.setItem(`task_timer_${task.id}`, currentTime.toString());
            localStorage.removeItem(`task_timer_end_${task.id}`);
          }

          // Trigger push notification at 120s (2m) and 60s (1m) remaining
          if (currentTime === 120 || currentTime === 60) {
            const notifyKey = `${task.id}_${currentTime}`;
            if (!notifiedTaskTimesRef.current.has(notifyKey)) {
              notifiedTaskTimesRef.current.add(notifyKey);
              if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
                new Notification("FlowState MIT Alert ⚡", {
                  body: `Task "${task.title}" is ending soon! Only ${Math.ceil(currentTime / 60)} minute${currentTime > 60 ? "s" : ""} left.`,
                  icon: "/favicon.ico",
                });
              }
            }
          }

          if (currentTime <= 0) {
            // IMMEDIATE LOCAL STORAGE PERSISTENCE:
            // Do NOT remove item — set to '0' and mark completed: true
            if (typeof window !== "undefined") {
              localStorage.setItem(`task_timer_${task.id}`, "0");
              localStorage.setItem(`task_completed_${task.id}`, "true");
              localStorage.removeItem(`task_timer_end_${task.id}`);
            }

            justCompletedTaskIds.push(task.id);

            const notifyKey = `${task.id}_0`;
            if (!notifiedTaskTimesRef.current.has(notifyKey)) {
              notifiedTaskTimesRef.current.add(notifyKey);
              if (typeof window !== "undefined") {
                window.dispatchEvent(
                  new CustomEvent("flowstate_new_notification", {
                    detail: {
                      title: `MIT Task "${task.title}" Timer Hit 0:00! ⚡`,
                      type: "task",
                    },
                  })
                );
                if ("Notification" in window && Notification.permission === "granted") {
                  new Notification("FlowState MIT Alert ⚡", {
                    body: `Task "${task.title}" has reached 0:00!`,
                    icon: "/favicon.ico",
                  });
                }
              }
            }

            // Immediately mark completed in local state
            return {
              ...task,
              completed: true,
              remainingSeconds: 0,
              remaining_seconds: 0,
            };
          }

          return { ...task, remainingSeconds: currentTime };
        });

        if (typeof window !== "undefined") {
          localStorage.setItem("flowstate_cached_tasks", JSON.stringify(nextTasks));
        }

        return nextTasks;
      });

      // Synchronously triggered async persistence to Supabase with race-condition guard
      if (justCompletedTaskIds.length > 0) {
        justCompletedTaskIds.forEach(async (taskId) => {
          await persistTaskCompletion(taskId);
        });
      }
    };

    const timer = setInterval(tick, 1000);
    window.addEventListener("focus", tick);
    window.addEventListener("visibilitychange", tick);

    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", tick);
      window.removeEventListener("visibilitychange", tick);
    };
  }, [isFocusRunning, checkFocusRunning, setTasks]);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const durationMins = parseInt(newTaskDuration, 10) || 5;
    const initialSeconds = durationMins * 60;
    const fallbackId = `local_task_${Date.now()}`;

    try {
      let data, error;
      const insertAttempt = await supabase
        .from("tasks")
        .insert([
          {
            title: newTaskTitle,
            priority: newTaskPriority,
            completed: false,
            duration: `${durationMins}m`,
            remaining_seconds: initialSeconds,
          },
        ])
        .select();

      data = insertAttempt.data;
      error = insertAttempt.error;

      if (error && (error.code === "PGRST204" || error.message?.includes("remaining_seconds"))) {
        const retry = await supabase
          .from("tasks")
          .insert([
            {
              title: newTaskTitle,
              priority: newTaskPriority,
              completed: false,
              duration: `${durationMins}m`,
            },
          ])
          .select();
        data = retry.data;
        error = retry.error;
      }

      if (error) throw error;
      if (data) {
        const newTaskId = data[0].id;
        localStorage.setItem(`task_timer_${newTaskId}`, initialSeconds.toString());
        localStorage.setItem(`task_completed_${newTaskId}`, "false");
        localStorage.removeItem(`task_timer_end_${newTaskId}`);

        const newTask: Task = {
          ...data[0],
          completed: false,
          remainingSeconds: initialSeconds,
          remaining_seconds: initialSeconds,
        };
        const updated = [newTask, ...tasks];
        setTasks(updated);
        localStorage.setItem("flowstate_cached_tasks", JSON.stringify(updated));
        setNewTaskTitle("");
        setNewTaskDuration("5");
      }
    } catch (error) {
      console.warn("Supabase insert failed, persisting task to local storage:", error);
      localStorage.setItem(`task_timer_${fallbackId}`, initialSeconds.toString());
      localStorage.setItem(`task_completed_${fallbackId}`, "false");
      localStorage.removeItem(`task_timer_end_${fallbackId}`);

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
      if (typeof window !== "undefined") {
        localStorage.setItem(`task_timer_${id}`, "0");
        localStorage.setItem(`task_completed_${id}`, "true");
        localStorage.removeItem(`task_timer_end_${id}`);
      }
    } else {
      if (typeof window !== "undefined") {
        localStorage.setItem(`task_completed_${id}`, "false");
        localStorage.setItem(`task_timer_${id}`, defaultSecs.toString());
      }
    }

    const updated = tasks.map((t) =>
      t.id === id
        ? {
            ...t,
            completed: nextStatus,
            remainingSeconds: nextStatus ? 0 : defaultSecs,
            remaining_seconds: nextStatus ? 0 : defaultSecs,
          }
        : t
    );
    setTasks(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("flowstate_cached_tasks", JSON.stringify(updated));
    }

    try {
      const updatePayload = nextStatus
        ? { completed: true, remaining_seconds: 0 }
        : { completed: false, remaining_seconds: defaultSecs };

      const { error } = await supabase
        .from("tasks")
        .update(updatePayload)
        .eq("id", id);

      if (error) {
        if (error.code === "PGRST204" || error.message?.includes("remaining_seconds")) {
          await supabase
            .from("tasks")
            .update({ completed: nextStatus })
            .eq("id", id);
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.warn("Supabase task toggle sync warning (local state preserved):", error);
    }
  };

  const deleteTask = async (id: string) => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(`task_timer_${id}`);
      localStorage.removeItem(`task_completed_${id}`);
      localStorage.removeItem(`task_timer_end_${id}`);
    }
    const updated = tasks.filter((task) => task.id !== id);
    setTasks(updated);
    if (typeof window !== "undefined") {
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
      const { error } = await supabase
        .from("tasks")
        .delete()
        .in("id", completedIds);
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
    <div className="space-y-6 text-white">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="text-cyan-400 w-5 h-5" /> Most Important Tasks (MITs)
        </h2>
        {tasks.some((t) => t.completed || t.remainingSeconds === 0) && (
          <button
            onClick={clearCompletedTasks}
            className="text-xs text-slate-400 hover:text-slate-200 bg-neutral-800/60 hover:bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-700/50 transition flex items-center gap-1.5"
            title="Clean up completed tasks without restarting them"
          >
            <Trash2 className="w-3.5 h-3.5 text-slate-400" />
            Clear Completed
          </button>
        )}
      </div>

      <AnimatePresence>
        {showAlert && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between gap-3 shadow-lg"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
              <span>
                <strong>Attention Required:</strong> You have high-priority MIT tasks pending focus attention!
              </span>
            </div>
            <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40 font-mono">
              OS Alerts Active
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={addTask} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 placeholder:text-neutral-500"
        />
        
        <input
          type="number"
          value={newTaskDuration}
          onChange={(e) => setNewTaskDuration(e.target.value)}
          placeholder="Mins (e.g. 5)"
          className="w-full sm:w-28 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-cyan-500 text-neutral-300 font-mono"
        />

        <select
          value={newTaskPriority}
          onChange={(e) => setNewTaskPriority(e.target.value)}
          className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-cyan-500 text-neutral-400"
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <button
          type="submit"
          className="bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-semibold px-5 py-3 rounded-xl transition flex items-center justify-center gap-2 active:scale-95 shadow-md"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </form>

      <div className="space-y-3">
        {loading ? (
          /* Glowing shimmer loading skeleton */
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-slate-900/60 backdrop-blur-xl animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-md bg-white/10" />
                  <div className="h-4 w-40 bg-white/10 rounded-lg" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-6 w-16 rounded-full bg-white/10" />
                  <div className="h-6 w-14 rounded-full bg-white/10" />
                  <div className="w-4 h-4 rounded bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          /* Polished empty state with helpful micro-copy */
          <div className="p-8 rounded-2xl border border-dashed border-white/10 bg-slate-900/30 text-center flex flex-col items-center justify-center space-y-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">No active MIT tasks yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Add your Most Important Tasks (MITs) above to prioritize your high-impact work and trigger countdown alerts.
              </p>
            </div>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-4 rounded-xl border transition ${
                task.completed
                  ? "bg-neutral-900/40 border-neutral-900 text-neutral-500 line-through"
                  : "bg-neutral-900 border-neutral-800 text-white hover:border-white/20"
              }`}
            >
              <div className="flex items-center gap-3">
                <button onClick={() => toggleTask(task.id, task.completed)}>
                  {task.completed ? (
                    <CheckSquare className="w-5 h-5 text-cyan-400" />
                  ) : (
                    <Square className="w-5 h-5 text-neutral-500 hover:text-white transition-colors" />
                  )}
                </button>
                <span>{task.title}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs px-2.5 py-1 rounded-full bg-neutral-800/80 text-cyan-300 flex items-center gap-1 border border-cyan-500/20 font-mono">
                  <Clock className="w-3 h-3" /> {formatTime(task.remainingSeconds)}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-400">
                  {task.priority}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-neutral-500 hover:text-red-400 transition"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}