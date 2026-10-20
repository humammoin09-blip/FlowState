"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Calendar,
  Sparkles,
  TrendingUp,
  Zap,
  Clock,
  Target,
  Award,
  Flame,
  Download,
  FileSpreadsheet,
  Check,
  AlertCircle,
  WifiOff,
  ShieldAlert,
  AlertOctagon,
  Trophy,
  History,
  HeartCrack,
  ShieldCheck,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { calculateConsistencyAnalytics } from "@/lib/discipline-service";
import {
  calculateStreakState,
  fetchUserSettingsFromDB,
  FocusSessionRecord,
} from "@/lib/streak-service";
import {
  filterSessionsByUserId,
  filterTasksByUserId,
} from "@/lib/user-service";

interface DayStat {
  day: string;
  hours: number;
  tasks: number;
  intensity: number;
  isPast?: boolean;
  isToday?: boolean;
  isMissed?: boolean;
  dateLabel?: string;
}

interface MatrixCell {
  dayIndex: number;
  intensity: number;
  hours: string;
  dateStr: string;
  formattedDate: string;
  isPast: boolean;
  isToday: boolean;
  isMissed: boolean;
}

export function ConsistencyHeatmap() {
  const [activeView, setActiveView] = useState<"weekly" | "matrix">("weekly");
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [exported, setExported] = useState<boolean>(false);
  const [isOfflineFallback, setIsOfflineFallback] = useState<boolean>(false);
  
  // Real Dynamic States
  const [totalFocusHours, setTotalFocusHours] = useState<number>(0);
  const [completedMitsCount, setCompletedMitsCount] = useState<number>(0);
  const [totalMitsCount, setTotalMitsCount] = useState<number>(0);
  const [consistencyScore, setConsistencyScore] = useState<number>(0);
  const [activeStreak, setActiveStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [isStreakBroken, setIsStreakBroken] = useState<boolean>(false);
  const [daysSinceLastBreak, setDaysSinceLastBreak] = useState<number>(0);
  const [missedDaysCount, setMissedDaysCount] = useState<number>(0);

  const [daysData, setDaysData] = useState<DayStat[]>([
    { day: "Mon", hours: 0, tasks: 0, intensity: 0 },
    { day: "Tue", hours: 0, tasks: 0, intensity: 0 },
    { day: "Wed", hours: 0, tasks: 0, intensity: 0 },
    { day: "Thu", hours: 0, tasks: 0, intensity: 0 },
    { day: "Fri", hours: 0, tasks: 0, intensity: 0 },
    { day: "Sat", hours: 0, tasks: 0, intensity: 0 },
    { day: "Sun", hours: 0, tasks: 0, intensity: 0 },
  ]);

  const [matrixData, setMatrixData] = useState<MatrixCell[]>([]);

  useEffect(() => {
    fetchRealAnalytics();
  }, []);

  const fetchRealAnalytics = async () => {
    try {
      setLoading(true);
      setIsOfflineFallback(false);

      const { data: authData } = await supabase.auth.getUser();
      const activeUid =
        authData?.user?.id ||
        (typeof window !== "undefined"
          ? localStorage.getItem("flowstate_active_user_id") || "guest_default"
          : "guest_default");

      // 1. Fetch Focus Sessions from Supabase with safe fallback
      let sessions: Array<{ duration_minutes?: number; created_at?: string; mode?: string }> | null = null;
      try {
        const { data, error } = await supabase.from("focus_sessions").select("*");
        if (error) throw error;
        sessions = filterSessionsByUserId(data || [], activeUid);
        if (sessions && typeof window !== "undefined") {
          localStorage.setItem(`flowstate_cached_focus_sessions_${activeUid}`, JSON.stringify(sessions));
          localStorage.setItem("flowstate_cached_focus_sessions", JSON.stringify(sessions));
        }
      } catch (dbErr) {
        console.warn("Supabase focus_sessions fetch failed, using offline fallback:", dbErr);
        setIsOfflineFallback(true);
        if (typeof window !== "undefined") {
          const cached =
            localStorage.getItem(`flowstate_cached_focus_sessions_${activeUid}`) ||
            localStorage.getItem("flowstate_cached_focus_sessions");
          if (cached) {
            try {
              sessions = filterSessionsByUserId(JSON.parse(cached), activeUid);
            } catch {
              sessions = null;
            }
          }
        }
      }

      // Unified calculation matching app/page.tsx and AIDisciplineCoach
      const analytics = calculateConsistencyAnalytics(sessions || []);
      const currentWeekMins = Object.values(analytics.dayMap).reduce((sum, d) => sum + d.mins, 0);
      const calculatedHours = Number((currentWeekMins / 60).toFixed(1));
      setTotalFocusHours(calculatedHours);

      const now = new Date();
      const todayDayIndex = (now.getDay() + 6) % 7; // Mon = 0, ..., Sun = 6
      const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const updatedDays = weekDays.map((d, idx) => {
        const hrs = Number((analytics.dayMap[d].mins / 60).toFixed(1));
        let intensity = 0;
        if (hrs >= 6) intensity = 4;
        else if (hrs >= 4) intensity = 3;
        else if (hrs >= 2) intensity = 2;
        else if (hrs > 0) intensity = 1;

        const isPast = idx < todayDayIndex;
        const isToday = idx === todayDayIndex;
        const isMissed = isPast && hrs === 0;

        return {
          day: d,
          hours: hrs,
          tasks: analytics.dayMap[d].count,
          intensity,
          isPast,
          isToday,
          isMissed,
        };
      });
      setDaysData(updatedDays);

      // Consistency Score Calculation (Based on weekly target of 30 hours)
      const weeklyTarget = 30;
      const calculatedScore = Math.min(100, Math.round((calculatedHours / weeklyTarget) * 100));
      setConsistencyScore(calculatedScore > 0 ? calculatedScore : 0);

      // Active Streak & Streak History Calculation
      const userSettings = await fetchUserSettingsFromDB(activeUid);
      const streakState = calculateStreakState({
        sessions: (sessions || []) as FocusSessionRecord[],
        storedData: userSettings,
      });

      setActiveStreak(streakState.currentStreak);
      setMaxStreak(streakState.maxStreak);
      setIsStreakBroken(streakState.isStreakBroken);
      setDaysSinceLastBreak(streakState.daysSinceLastBreak);

      // 2. Fetch Tasks / MITs with safe fallback
      let tasksData: Array<{ completed?: boolean; duration?: string }> | null = null;
      try {
        const { data, error } = await supabase.from("tasks").select("*");
        if (error) throw error;
        tasksData = filterTasksByUserId(data || [], activeUid);
        if (tasksData && typeof window !== "undefined") {
          localStorage.setItem(`flowstate_cached_tasks_${activeUid}`, JSON.stringify(tasksData));
          localStorage.setItem("flowstate_cached_tasks", JSON.stringify(tasksData));
        }
      } catch (taskErr) {
        console.warn("Supabase tasks fetch failed, using offline fallback:", taskErr);
        setIsOfflineFallback(true);
        if (typeof window !== "undefined") {
          const cached =
            localStorage.getItem(`flowstate_cached_tasks_${activeUid}`) ||
            localStorage.getItem("flowstate_cached_tasks");
          if (cached) {
            try {
              tasksData = filterTasksByUserId(JSON.parse(cached), activeUid);
            } catch {
              tasksData = null;
            }
          }
        }
      }

      if (tasksData) {
        setTotalMitsCount(tasksData.length);
        const completed = tasksData.filter((t) => t.completed).length;
        setCompletedMitsCount(completed);
      }

      // 3. Generate 28-Day Matrix mapping actual daily sessions or immutable failure log for past days
      const sessionMinutesByDate: Record<string, number> = {};
      if (sessions && sessions.length > 0) {
        sessions.forEach((s) => {
          if (!s.created_at) return;
          let rawTimestamp = s.created_at;
          if (typeof rawTimestamp === "string" && !rawTimestamp.includes("Z") && !rawTimestamp.includes("+")) {
            rawTimestamp = rawTimestamp.replace(" ", "T") + "Z";
          }
          const d = new Date(rawTimestamp);
          if (isNaN(d.getTime())) return;
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, "0");
          const date = String(d.getDate()).padStart(2, "0");
          const key = `${y}-${m}-${date}`;
          sessionMinutesByDate[key] = (sessionMinutesByDate[key] || 0) + (s.duration_minutes || 25);
        });
      }

      let matrixMissed = 0;
      const generatedMatrix: MatrixCell[] = Array.from({ length: 28 }, (_, i) => {
        // Day 28 = today (offset 0), Day 1 = 27 days ago (offset 27)
        const daysAgo = 27 - i;
        const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysAgo);
        const y = targetDate.getFullYear();
        const m = String(targetDate.getMonth() + 1).padStart(2, "0");
        const d = String(targetDate.getDate()).padStart(2, "0");
        const dateKey = `${y}-${m}-${d}`;
        const formattedDate = targetDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });

        const mins = sessionMinutesByDate[dateKey] || 0;
        const hrs = Number((mins / 60).toFixed(1));

        let intensity = 0;
        if (hrs >= 6) intensity = 4;
        else if (hrs >= 4) intensity = 3;
        else if (hrs >= 2) intensity = 2;
        else if (hrs > 0) intensity = 1;

        const isPast = daysAgo > 0;
        const isToday = daysAgo === 0;
        const isMissed = isPast && hrs === 0;

        if (isMissed) matrixMissed++;

        return {
          dayIndex: i + 1,
          intensity,
          hours: hrs.toFixed(1),
          dateStr: dateKey,
          formattedDate,
          isPast,
          isToday,
          isMissed,
        };
      });

      setMatrixData(generatedMatrix);
      setMissedDaysCount(matrixMissed);

    } catch (err) {
      console.error("Graceful error handling in analytics:", err);
      setIsOfflineFallback(true);
    } finally {
      setLoading(false);
    }
  };

  // Weekly Productivity Summary & CSV Export
  const handleExportWeeklyReport = () => {
    try {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
      const dateRangeStr = now.toLocaleDateString("en-US", options);

      let csvContent = `FlowState Weekly Productivity Report\n`;
      csvContent += `Generated At,${now.toISOString()}\n`;
      csvContent += `Report Period,Current Week (${dateRangeStr})\n`;
      csvContent += `Total Weekly Focus Hours,${totalFocusHours} hrs\n`;
      csvContent += `Weekly Consistency Score,${consistencyScore}%\n`;
      csvContent += `Completed MITs,${completedMitsCount} / ${totalMitsCount}\n`;
      csvContent += `Active Streak,${activeStreak} Days\n`;
      csvContent += `Immutable Ledger Missed Days (28-day window),${missedDaysCount}\n\n`;

      csvContent += `Day,Focus Hours,Sessions Logged,Status,Intensity Level\n`;
      daysData.forEach((d) => {
        const status = d.isMissed
          ? "MISSED (0h Failure Log)"
          : d.hours > 0
          ? "Logged"
          : d.isToday
          ? "Today (In Progress)"
          : "Upcoming";
        csvContent += `${d.day},${d.hours},${d.tasks},${status},Level ${d.intensity}\n`;
      });

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `FlowState_Weekly_Report_${now.toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExported(true);
      setTimeout(() => setExported(false), 2500);
    } catch (err) {
      console.error("Error exporting report:", err);
    }
  };

  const getHeatmapColor = (intensity: number, isMissed?: boolean) => {
    if (isMissed) {
      return "bg-rose-950/60 border-rose-600/70 text-rose-400 font-bold shadow-[0_0_10px_rgba(244,63,94,0.25)]";
    }
    switch (intensity) {
      case 0:
        return "bg-slate-900 border-white/5 text-slate-600";
      case 1:
        return "bg-emerald-950/80 border-emerald-800/40 text-emerald-300";
      case 2:
        return "bg-emerald-800/80 border-emerald-700/50 text-emerald-200";
      case 3:
        return "bg-emerald-600/90 border-emerald-500/60 text-white shadow-[0_0_8px_rgba(16,185,129,0.3)]";
      case 4:
        return "bg-emerald-400 border-emerald-300 text-slate-950 font-bold shadow-[0_0_12px_rgba(52,211,153,0.7)] animate-pulse";
      default:
        return "bg-slate-900";
    }
  };

  const maxHours = 8.0;

  return (
    <div className="space-y-6 pb-12">
      {/* Offline Fallback Banner */}
      <AnimatePresence>
        {isOfflineFallback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center justify-between gap-3 shadow-lg"
          >
            <div className="flex items-center gap-2.5">
              <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Offline Persistence Active:</strong> Operating in cached offline mode. Local session data will sync automatically when connected.
              </span>
            </div>
            <button
              onClick={fetchRealAnalytics}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-[10px] font-bold text-amber-200 transition-colors"
            >
              Retry Sync
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-white/10 shadow-xl relative overflow-hidden bg-slate-900/40">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-400" /> Performance Analytics Hub
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time calculations of your focus output, consistency score, and execution velocity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Export Weekly Report Button */}
          <button
            onClick={handleExportWeeklyReport}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)] active:scale-95"
            title="Download Weekly Summary CSV"
          >
            {exported ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Exported CSV</span>
              </>
            ) : (
              <>
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Export Weekly Report</span>
              </>
            )}
          </button>

          <div
            className="flex items-center gap-2 bg-rose-950/40 border border-rose-500/30 px-3.5 py-2 rounded-xl text-xs text-rose-300"
            title="The Immutable Consistency Ledger permanently records missed days with zero focus"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              Immutable Ledger: <strong>{missedDaysCount}</strong> Missed Day{missedDaysCount === 1 ? "" : "s"}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/80 border border-white/10 px-3.5 py-2 rounded-xl text-xs text-slate-300">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>{isOfflineFallback ? "Local Offline Cache" : "Supabase Live Database"}</span>
          </div>
        </div>
      </div>

      {/* Top 4 Quick Metric Cards / Skeleton Loading */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="glass-card p-5 rounded-2xl border border-white/10 bg-slate-900/60 animate-pulse space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="h-3 w-24 bg-white/10 rounded-md" />
                <div className="w-4 h-4 rounded-full bg-white/10" />
              </div>
              <div className="h-8 w-20 bg-white/15 rounded-lg pt-1" />
              <div className="h-2.5 w-32 bg-white/10 rounded-md" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Focus Time */}
          <div className="glass-card p-5 rounded-2xl border border-white/10 relative overflow-hidden bg-slate-900/60">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Focus Time</span>
              <Clock className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-white">{totalFocusHours} hrs</div>
            <div className="text-xs text-emerald-400 font-medium mt-2 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Calculated from sessions
            </div>
          </div>

          {/* Consistency Score */}
          <div className="glass-card p-5 rounded-2xl border border-white/10 relative overflow-hidden bg-slate-900/60">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Consistency Score</span>
              <Target className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-3xl font-bold text-white">{consistencyScore}%</div>
            <div className="text-xs text-teal-400 font-medium mt-2 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> Based on 30h weekly goal
            </div>
          </div>

          {/* Completed MITs */}
          <div className="glass-card p-5 rounded-2xl border border-white/10 relative overflow-hidden bg-slate-900/60">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Completed MITs</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-bold text-white">
              {completedMitsCount} / {totalMitsCount}
            </div>
            <div className="text-xs text-amber-400 font-medium mt-2">
              Real task execution count
            </div>
          </div>

          {/* Active Streak */}
          <div className={`glass-card p-5 rounded-2xl border relative overflow-hidden transition-all ${
            isStreakBroken
              ? "border-rose-500/30 bg-rose-950/20"
              : activeStreak > 0
              ? "border-emerald-500/30 bg-emerald-950/15"
              : "border-white/10 bg-slate-900/60"
          }`}>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Streak</span>
              {isStreakBroken ? (
                <HeartCrack className="w-4 h-4 text-rose-400" />
              ) : (
                <Flame className={`w-4 h-4 ${activeStreak > 0 ? "text-emerald-400" : "text-amber-400"}`} />
              )}
            </div>
            <div className="text-3xl font-bold font-mono">
              {isStreakBroken ? (
                <span className="text-rose-400">Broken 💔</span>
              ) : activeStreak > 0 ? (
                <span className="text-white">{activeStreak} <span className="text-emerald-400 text-lg">Days 🔥</span></span>
              ) : (
                <span className="text-slate-300">Start Today</span>
              )}
            </div>
            <div className={`text-xs font-medium mt-2 ${isStreakBroken ? "text-rose-400" : "text-emerald-400"}`}>
              {isStreakBroken ? "Streak interrupted — reset on next session" : "Unique active focus days logged"}
            </div>
          </div>
        </div>
      )}

      {/* Streak History & Momentum Metrics Card */}
      <div className="glass-card p-5 sm:p-6 rounded-3xl border border-white/10 relative overflow-hidden bg-slate-900/60 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Streak History & Accountability
              </h2>
              <p className="text-xs text-slate-400">
                All-time personal records, streak continuity, and unbroken focus momentum.
              </p>
            </div>
          </div>
          {isStreakBroken ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono bg-rose-500/15 border border-rose-500/30 text-rose-400">
              <HeartCrack className="w-3.5 h-3.5" />
              Streak Broken
            </span>
          ) : activeStreak > 0 ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <Flame className="w-3.5 h-3.5" />
              Streak Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono bg-slate-800 text-slate-400 border border-slate-700">
              Fresh Start
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          {/* 1. Max Streak Achieved */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              Max Streak Achieved
            </span>
            <div className="text-2xl font-extrabold text-amber-300 font-mono pt-1">
              {maxStreak} {maxStreak === 1 ? "Day" : "Days"} 🏆
            </div>
            <p className="text-[11px] text-slate-400">
              All-time longest consistency streak
            </p>
          </div>

          {/* 2. Current Streak */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Flame className={`w-4 h-4 ${isStreakBroken ? "text-rose-400" : "text-emerald-400"}`} />
              Current Streak
            </span>
            <div className={`text-2xl font-extrabold font-mono pt-1 ${isStreakBroken ? "text-rose-400" : "text-white"}`}>
              {isStreakBroken ? "0 Days (Broken)" : `${activeStreak} ${activeStreak === 1 ? "Day" : "Days"} 🔥`}
            </div>
            <p className="text-[11px] text-slate-400">
              {isStreakBroken ? "Streak broken — start session to start fresh" : "Active consecutive day chain"}
            </p>
          </div>

          {/* 3. Days Since Last Break */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Days Since Last Break
            </span>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono pt-1">
              {daysSinceLastBreak} {daysSinceLastBreak === 1 ? "Day" : "Days"} 🛡️
            </div>
            <p className="text-[11px] text-slate-400">
              {daysSinceLastBreak === 0 ? "Break registered recently" : "Consecutive days without interruption"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Heatmap & Consistency Card */}
      <div className="glass-card relative p-6 rounded-3xl border border-white/10 shadow-2xl overflow-hidden group bg-slate-900/60">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Header & Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Weekly Consistency Heatmap
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  {consistencyScore}% Score
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Deep focus intensity & habit consistency breakdown
              </p>
            </div>
          </div>

          {/* View Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-white/10">
            <button
              onClick={() => setActiveView("weekly")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === "weekly"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Weekly Bar Chart
            </button>
            <button
              onClick={() => setActiveView("matrix")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === "matrix"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              28-Day Matrix
            </button>
          </div>
        </div>

        {/* View Content */}
        <div className="py-6">
          {loading ? (
            /* Shimmer Loading Skeleton for Chart */
            <div className="h-48 flex items-end justify-between gap-3 sm:gap-6 px-4 pt-6 pb-2 animate-pulse">
              {[40, 65, 30, 80, 50, 20, 10].map((h, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div
                    style={{ height: `${h}%` }}
                    className="w-full max-w-[42px] rounded-t-xl bg-white/10"
                  />
                  <div className="h-3 w-6 bg-white/10 rounded mt-2" />
                </div>
              ))}
            </div>
          ) : activeView === "weekly" ? (
            <div className="space-y-4">
              <div className="relative h-48 flex items-end justify-between gap-3 sm:gap-6 px-4 pt-6 pb-2">
                <div className="absolute left-0 right-0 top-12 border-b border-dashed border-emerald-500/30 flex justify-between px-2">
                  <span className="text-[10px] font-mono text-emerald-400/80 bg-slate-950/80 px-1 rounded">
                    Target: 6.0h / day
                  </span>
                </div>

                {daysData.map((item) => {
                  const heightPercent = Math.min(100, (item.hours / maxHours) * 100);
                  const isHovered = hoveredDay === item.day;

                  return (
                    <div
                      key={item.day}
                      onMouseEnter={() => setHoveredDay(item.day)}
                      onMouseLeave={() => setHoveredDay(null)}
                      className="relative flex-1 flex flex-col items-center h-full justify-end group/bar cursor-pointer"
                    >
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`absolute -top-14 z-20 px-2.5 py-1.5 rounded-xl border text-[10px] shadow-xl flex flex-col items-center whitespace-nowrap ${
                            item.isMissed
                              ? "bg-rose-950/95 border-rose-500/50 text-rose-200 shadow-[0_0_16px_rgba(244,63,94,0.35)]"
                              : "bg-slate-900 border-white/20 text-white"
                          }`}
                        >
                          {item.isMissed ? (
                            <>
                              <span className="font-extrabold text-rose-400 flex items-center gap-1">
                                <AlertOctagon className="w-3 h-3 text-rose-400" /> MISSED DAY • 0.0 hrs
                              </span>
                              <span className="text-rose-300/80 text-[9px] font-mono">Immutable Consistency Failure</span>
                            </>
                          ) : (
                            <>
                              <span className="font-bold text-emerald-400">{item.hours} hrs</span>
                              <span className="text-slate-400">{item.tasks} sessions logged</span>
                            </>
                          )}
                        </motion.div>
                      )}

                      <div className="w-full max-w-[42px] h-full flex items-end">
                        {item.isMissed ? (
                          <div className="w-full h-12 rounded-t-xl bg-rose-950/40 border border-dashed border-rose-500/60 flex flex-col items-center justify-center shadow-[0_0_12px_rgba(244,63,94,0.25)] group-hover/bar:bg-rose-950/70 transition-all">
                            <span className="text-[12px] font-black text-rose-400 leading-none">✕</span>
                            <span className="text-[7.5px] font-mono font-extrabold text-rose-400/90 tracking-tight mt-0.5 uppercase">MISSED</span>
                          </div>
                        ) : (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${heightPercent}%` }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className={`w-full rounded-t-xl transition-all ${
                              item.hours >= 4
                                ? "bg-gradient-to-t from-emerald-500 to-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.5)] border-t border-emerald-200"
                                : "bg-slate-800 group-hover/bar:bg-emerald-500/50 border-t border-white/10"
                            }`}
                          />
                        )}
                      </div>

                      <span
                        className={`text-xs font-semibold mt-2 flex items-center gap-0.5 ${
                          item.isMissed
                            ? "text-rose-400 font-bold"
                            : item.hours >= 4
                            ? "text-emerald-400"
                            : "text-slate-400"
                        }`}
                      >
                        {item.day}
                        {item.isMissed && <span className="text-[9px] text-rose-500 font-black">✕</span>}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Zero-session helpful empty state notice */}
              {totalFocusHours === 0 && (
                <div className="py-3 px-4 rounded-xl bg-white/[0.02] border border-white/5 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>No focus sessions recorded yet this week. Complete a Pomodoro session above to light up your consistency bars!</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-2 max-w-xl mx-auto">
                {matrixData.map((cell) => (
                  <motion.div
                    key={cell.dayIndex}
                    whileHover={{ scale: 1.15 }}
                    className={`h-9 rounded-lg border flex flex-col items-center justify-center text-[10px] font-mono cursor-pointer transition-all ${
                      cell.isMissed
                        ? "bg-rose-950/60 border-rose-600/70 text-rose-400 font-bold shadow-[0_0_10px_rgba(244,63,94,0.25)] hover:border-rose-400 relative"
                        : getHeatmapColor(cell.intensity)
                    }`}
                    title={
                      cell.isMissed
                        ? `Day ${cell.dayIndex} (${cell.formattedDate}): MISSED DAY • 0.0h focus logged (Immutable Consistency Ledger)`
                        : `Day ${cell.dayIndex} (${cell.formattedDate}): ${cell.hours}h focus hours`
                    }
                  >
                    {cell.isMissed ? (
                      <div className="flex items-center gap-0.5 leading-none">
                        <span className="text-[11px] text-rose-400 font-black">✕</span>
                        <span className="text-[8px] text-rose-400/90 font-bold">0h</span>
                      </div>
                    ) : (
                      `${cell.hours}h`
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11px] text-slate-400 pt-2">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-400 font-semibold">
                  <div className="w-3.5 h-3.5 rounded border border-rose-500/60 bg-rose-950 text-rose-400 flex items-center justify-center text-[8px] font-black">
                    ✕
                  </div>
                  <span>Missed (0h Failure Log)</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span>Less</span>
                  <div className="flex items-center gap-1.5">
                    {[0, 1, 2, 3, 4].map((lvl) => (
                      <div key={lvl} className={`w-3.5 h-3.5 rounded border ${getHeatmapColor(lvl)}`} />
                    ))}
                  </div>
                  <span>More (Deep Flow)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Insights Banner */}
        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              <strong>Immutable Consistency Ledger:</strong> {missedDaysCount} missed day{missedDaysCount === 1 ? "" : "s"} permanently recorded in the 28-day window. Zero-hour days cannot be hidden or forgiven.
            </span>
          </div>
          <span className="text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20 flex items-center gap-1">
            <AlertOctagon className="w-3 h-3" /> Permanent Ledger
          </span>
        </div>
      </div>
    </div>
  );
}