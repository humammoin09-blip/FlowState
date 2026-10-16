"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar, NavTab } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { StatCards } from "@/components/StatCards";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import TaskList, { Task } from "@/components/TaskList";
import { ConsistencyHeatmap } from "@/components/ConsistencyHeatmap";
import { ProfileModal } from "@/components/ProfileModal";
import { AIDisciplineCoach } from "@/components/AIDisciplineCoach";
import { StreakLossModal } from "@/components/StreakLossModal";
import { RecentBlueprints } from "@/components/RecentBlueprints";
import { TodaysBlueprintCard } from "@/components/TodaysBlueprintCard";
import { evaluateStreakStatus, calculateConsistencyAnalytics } from "@/lib/discipline-service";
import { checkAndSendEveningStreakAlert } from "@/lib/streak-protection";
import {
  calculateStreakState,
  fetchUserSettingsFromDB,
  useStreakSaver,
  STORAGE_KEYS,
  getLocalDateString,
  FocusSessionRecord,
} from "@/lib/streak-service";
import { Sparkles, Flame, Zap, Shield, ArrowRight, BarChart3, Timer, CheckSquare } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function FlowStateDashboard() {
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [timerTime, setTimerTime] = useState<string>("25:00");
  const [focusHours, setFocusHours] = useState<number>(0.0);
  const [streakDays, setStreakDays] = useState<number>(0);
  const [isStreakBroken, setIsStreakBroken] = useState<boolean>(false);
  const [daysSinceLastActive, setDaysSinceLastActive] = useState<number>(0);
  const [canUseStreakSaver, setCanUseStreakSaver] = useState<boolean>(true);
  const [streakSaverCooldownDays, setStreakSaverCooldownDays] = useState<number>(0);

  // Streak Loss Modal & Psychological Alert State
  const [streakLossModalOpen, setStreakLossModalOpen] = useState<boolean>(false);
  const [previousBrokenStreak, setPreviousBrokenStreak] = useState<number>(0);

  // Profile Customization States
  const [userName, setUserName] = useState<string>("Alex Vance");
  const [userTitle, setUserTitle] = useState<string>("Flow Master");
  const [dailyGoal, setDailyGoal] = useState<number>(6);
  const [userAvatar, setUserAvatar] = useState<string>("🚀");
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  // Load profile from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedName = localStorage.getItem("flowstate_user_name");
      const savedTitle = localStorage.getItem("flowstate_user_title");
      const savedGoal = localStorage.getItem("flowstate_daily_goal");
      const savedAvatar = localStorage.getItem("flowstate_user_avatar");
      if (savedName) setUserName(savedName);
      if (savedTitle) setUserTitle(savedTitle);
      if (savedGoal) setDailyGoal(parseFloat(savedGoal));
      if (savedAvatar) setUserAvatar(savedAvatar);

      const cachedSessions = localStorage.getItem("flowstate_cached_focus_sessions");
      if (cachedSessions) {
        try {
          const parsed = JSON.parse(cachedSessions);
          const analytics = calculateConsistencyAnalytics(parsed);
          setFocusHours(analytics.todayHours);
        } catch {
          // ignore
        }
      }
    }
  }, []);

  const [statsLoading, setStatsLoading] = useState<boolean>(true);

  // Fetch dynamic active streak and focus hours with gap comparison logic
  const fetchAnalyticsAndStreak = async () => {
    try {
      setStatsLoading(true);
      const { data: sessions, error } = await supabase
        .from("focus_sessions")
        .select("duration_minutes, created_at, mode");

      if (error) throw error;

      const sessionList = sessions || [];
      if (typeof window !== "undefined" && sessions) {
        localStorage.setItem("flowstate_cached_focus_sessions", JSON.stringify(sessions));
      }

      const analytics = calculateConsistencyAnalytics(sessionList);
      setFocusHours(analytics.todayHours);

      // Compare lastActiveDate with today's date from Supabase / localStorage
      const userSettings = await fetchUserSettingsFromDB();
      const streakState = calculateStreakState({
        sessions: sessionList as FocusSessionRecord[],
        storedData: userSettings,
      });

      setStreakDays(streakState.currentStreak);
      setIsStreakBroken(streakState.isStreakBroken);
      setDaysSinceLastActive(streakState.daysSinceLastActive);
      setCanUseStreakSaver(streakState.canUseStreakSaver);
      setStreakSaverCooldownDays(streakState.streakSaverCooldownDays);

      // Smart Streak Break Check
      if (streakState.isStreakBroken) {
        setPreviousBrokenStreak(streakState.previousStreak);
        const todayStr = getLocalDateString();
        const dismissed = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEYS.MODAL_DISMISSED_DATE) : null;
        if (dismissed !== todayStr) {
          setStreakLossModalOpen(true);
        }
      }

      // Smart Streak Protection Check
      checkAndSendEveningStreakAlert({
        focusHours: analytics.todayHours,
        streakDays: streakState.currentStreak,
        dailyGoal: Number(dailyGoal),
      });
    } catch (err) {
      console.warn("Notice: Focus sessions remote fetch failed, falling back to local cache:", err);
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem("flowstate_cached_focus_sessions");
        let parsed: FocusSessionRecord[] = [];
        if (cached) {
          try {
            parsed = JSON.parse(cached);
            const analytics = calculateConsistencyAnalytics(parsed);
            setFocusHours(analytics.todayHours);
          } catch {
            // retain existing
          }
        }

        const userSettings = await fetchUserSettingsFromDB();
        const streakState = calculateStreakState({
          sessions: parsed,
          storedData: userSettings,
        });

        setStreakDays(streakState.currentStreak);
        setIsStreakBroken(streakState.isStreakBroken);
        setDaysSinceLastActive(streakState.daysSinceLastActive);
        setCanUseStreakSaver(streakState.canUseStreakSaver);
        setStreakSaverCooldownDays(streakState.streakSaverCooldownDays);

        if (streakState.isStreakBroken) {
          setPreviousBrokenStreak(streakState.previousStreak);
          const todayStr = getLocalDateString();
          const dismissed = localStorage.getItem(STORAGE_KEYS.MODAL_DISMISSED_DATE);
          if (dismissed !== todayStr) {
            setStreakLossModalOpen(true);
          }
        }
      }
    } finally {
      setStatsLoading(false);
    }
  };

  const handleUseStreakSaver = async () => {
    const result = await useStreakSaver();
    if (result.success && result.data) {
      setStreakDays(result.data.currentStreak);
      setIsStreakBroken(false);
      setDaysSinceLastActive(result.data.daysSinceLastActive);
      setCanUseStreakSaver(false);
      setStreakSaverCooldownDays(30);
      setStreakLossModalOpen(false);
      fetchAnalyticsAndStreak();
    } else {
      alert(result.message);
    }
  };

  // Periodic evening streak protection alert monitor (checks every 60s & on focus)
  useEffect(() => {
    const runProtectionCheck = () => {
      checkAndSendEveningStreakAlert({
        focusHours,
        streakDays,
        dailyGoal: Number(dailyGoal),
      });
    };

    runProtectionCheck();
    const interval = setInterval(runProtectionCheck, 60000);
    window.addEventListener("focus", runProtectionCheck);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", runProtectionCheck);
    };
  }, [focusHours, streakDays, dailyGoal]);

  useEffect(() => {
    fetchAnalyticsAndStreak();

    const channel = supabase
      .channel("dashboard_focus_sessions_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "focus_sessions" },
        () => {
          fetchAnalyticsAndStreak();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Fetch tasks dynamically from tasks table
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchDashboardTasks = async () => {
    try {
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
    } catch (err) {
      console.warn("Notice: Tasks remote fetch failed, falling back to local cache:", err);
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
            // retain existing
          }
        }
      }
    }
  };

  useEffect(() => {
    fetchDashboardTasks();

    const channel = supabase
      .channel("dashboard_tasks_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        () => {
          fetchDashboardTasks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Request browser notification permissions cleanly on app load
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission();
    }
  }, []);

  // Background timer sync to keep Header and Sidebar updated when on other tabs or returning from OS focus
  useEffect(() => {
    const syncGlobalTimer = () => {
      if (typeof window === "undefined") return;

      const running = localStorage.getItem("flowstate_pomodoro_running") === "true";
      const targetEndTime = localStorage.getItem("flowstate_pomodoro_target_end_time");
      const savedRemaining = localStorage.getItem("flowstate_pomodoro_remaining");

      if (running && targetEndTime) {
        const left = Math.max(0, Math.ceil((Number(targetEndTime) - Date.now()) / 1000));
        if (left > 0) {
          setTimerActive(true);
          const m = Math.floor(left / 60);
          const s = left % 60;
          setTimerTime(`${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`);
        } else {
          setTimerActive(false);
          setTimerTime("00:00");
        }
      } else if (savedRemaining !== null) {
        setTimerActive(false);
        const rem = Math.max(0, Number(savedRemaining));
        const m = Math.floor(rem / 60);
        const s = rem % 60;
        setTimerTime(`${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`);
      }
    };

    syncGlobalTimer();
    const interval = setInterval(syncGlobalTimer, 1000);
    window.addEventListener("focus", syncGlobalTimer);
    window.addEventListener("visibilitychange", syncGlobalTimer);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", syncGlobalTimer);
      window.removeEventListener("visibilitychange", syncGlobalTimer);
    };
  }, []);

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.filter((t) => !t.completed).length;

  // Stagger Container Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Background Radial Neon Mesh Gradient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] opacity-70" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[140px] opacity-70" />
        <div className="absolute top-1/2 right-10 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingTasksCount={pendingCount}
        timerActive={timerActive}
        timerTime={timerTime}
        userAvatar={userAvatar}
        userName={userName}
        userTitle={userTitle}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        {/* Top Header with Profile Click Handler */}
        <Header 
          timerActive={timerActive} 
          timerTime={timerTime} 
          userName={userName}
          userTitle={userTitle}
          userAvatar={userAvatar}
          onOpenProfile={() => setIsProfileOpen(true)}
        />

        {/* Content Area */}
        <main className="flex-1 px-4 sm:px-8 py-6 space-y-6 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* TOP ROW: 3 Dynamic Stat Cards */}
                <motion.section variants={itemVariants}>
                  <StatCards
                    totalFocusHours={focusHours}
                    streakDays={streakDays}
                    completedTasks={completedCount}
                    totalTasks={tasks.length}
                    dailyGoalHours={Number(dailyGoal)}
                    loading={statsLoading}
                    isStreakBroken={isStreakBroken}
                    daysSinceLastActive={daysSinceLastActive}
                    canUseStreakSaver={canUseStreakSaver}
                    onUseStreakSaver={handleUseStreakSaver}
                    onOpenStreakLossModal={() => setStreakLossModalOpen(true)}
                  />
                </motion.section>

                {/* TODAY'S FOCUS BLUEPRINT PROMINENT CARD */}
                <motion.section variants={itemVariants}>
                  <TodaysBlueprintCard
                    onEditBlueprint={(bp) => {
                      if (typeof window !== "undefined") {
                        window.dispatchEvent(
                          new CustomEvent("flowstate_reuse_blueprint", {
                            detail: bp,
                          })
                        );
                      }
                    }}
                  />
                </motion.section>

                {/* AI DISCIPLINE COACH & REALITY CHECK WIDGET */}
                <motion.section variants={itemVariants}>
                  <AIDisciplineCoach
                    focusHours={focusHours}
                    dailyGoal={Number(dailyGoal)}
                    streakDays={streakDays}
                    completedTasks={completedCount}
                    totalTasks={tasks.length}
                    userName={userName}
                    isStreakBroken={isStreakBroken}
                    onStartFocusSession={() => {
                      if (typeof window !== "undefined") {
                        window.dispatchEvent(new CustomEvent("flowstate_start_timer"));
                      }
                    }}
                    onOpenStreakLossModal={() => setStreakLossModalOpen(true)}
                  />
                </motion.section>

                {/* MIDDLE SECTION: Split Layout (Pomodoro Timer Left, Daily MITs Right) */}
                <motion.section
                  variants={itemVariants}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
                >
                  <div className="lg:col-span-5">
                    <PomodoroTimer
                      timerActive={timerActive}
                      setTimerActive={setTimerActive}
                      timerTime={timerTime}
                      setTimerTime={setTimerTime}
                      onFocusComplete={() => {
                        fetchAnalyticsAndStreak();
                      }}
                    />
                  </div>

                  <div className="lg:col-span-7 space-y-6">
                    <TaskList tasks={tasks} setTasks={setTasks} isFocusActive={timerActive} />
                    <RecentBlueprints
                      onReuseBlueprint={(bp) => {
                        if (typeof window !== "undefined") {
                          window.dispatchEvent(
                            new CustomEvent("flowstate_reuse_blueprint", {
                              detail: bp,
                            })
                          );
                        }
                      }}
                    />
                  </div>
                </motion.section>

                {/* BOTTOM SECTION: Weekly Consistency Heatmap */}
                <motion.section variants={itemVariants}>
                  <ConsistencyHeatmap />
                </motion.section>
              </motion.div>
            )}

            {activeTab === "timer" && (
              <motion.div
                key="timerTab"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-2xl mx-auto py-8"
              >
                <div className="mb-4 text-center">
                  <h2 className="text-2xl font-extrabold text-white">
                    Full-Screen Focus Chamber
                  </h2>
                  <p className="text-xs text-slate-400">
                    Minimize distractions and step into ultra-deep flow
                  </p>
                </div>
                <div className="h-[520px]">
                  <PomodoroTimer
                    timerActive={timerActive}
                    setTimerActive={setTimerActive}
                    timerTime={timerTime}
                    setTimerTime={setTimerTime}
                    onFocusComplete={() => {
                      fetchAnalyticsAndStreak();
                    }}
                  />
                </div>
              </motion.div>
            )}

            {activeTab === "tasks" && (
              <motion.div
                key="tasksTab"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-4xl mx-auto py-4"
              >
                <div className="h-[620px]">
                  <TaskList tasks={tasks} setTasks={setTasks} isFocusActive={timerActive} />
                </div>
              </motion.div>
            )}

            {activeTab === "analytics" && (
              <motion.div
                key="analyticsTab"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <ConsistencyHeatmap />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Profile Setup Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userName={userName}
        setUserName={setUserName}
        userTitle={userTitle}
        setUserTitle={setUserTitle}
        dailyGoal={dailyGoal.toString()}
        setDailyGoal={(goal: string) => setDailyGoal(parseFloat(goal))}
        userAvatar={userAvatar}
        setUserAvatar={setUserAvatar}
      />

      {/* Streak Loss Psychological Quote & Alert Modal */}
      <StreakLossModal
        isOpen={streakLossModalOpen}
        onClose={() => {
          setStreakLossModalOpen(false);
          if (typeof window !== "undefined") {
            const todayStr = getLocalDateString();
            localStorage.setItem(STORAGE_KEYS.MODAL_DISMISSED_DATE, todayStr);
          }
        }}
        previousStreak={previousBrokenStreak}
        userName={userName}
        canUseStreakSaver={canUseStreakSaver}
        streakSaverCooldownDays={streakSaverCooldownDays}
        daysSinceLastActive={daysSinceLastActive}
        onUseStreakSaver={handleUseStreakSaver}
        onRebuildStreak={() => {
          setStreakLossModalOpen(false);
          if (typeof window !== "undefined") {
            const todayStr = getLocalDateString();
            localStorage.setItem(STORAGE_KEYS.MODAL_DISMISSED_DATE, todayStr);
            window.dispatchEvent(new CustomEvent("flowstate_start_timer"));
          }
        }}
      />
    </div>
  );
}