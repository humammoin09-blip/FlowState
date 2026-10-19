"use client";

import React from "react";
import { motion } from "framer-motion";
import { Flame, Target, CheckCircle2, HeartCrack, ShieldCheck } from "lucide-react";

type StatCardsProps = {
  totalFocusHours: number;
  streakDays: number;
  completedTasks: number;
  totalTasks: number;
  dailyGoalHours: number;
  loading?: boolean;
  isStreakBroken?: boolean;
  daysSinceLastActive?: number;
  canUseStreakSaver?: boolean;
  onUseStreakSaver?: () => void;
  onOpenStreakLossModal?: () => void;
};

export function StatCards({
  totalFocusHours,
  streakDays,
  completedTasks,
  totalTasks,
  dailyGoalHours,
  loading = false,
  isStreakBroken = false,
  daysSinceLastActive = 0,
  canUseStreakSaver = false,
  onUseStreakSaver,
  onOpenStreakLossModal,
}: StatCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {[1, 2, 3].map((idx) => (
          <div
            key={idx}
            className="p-4 sm:p-6 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl space-y-4 relative overflow-hidden animate-pulse shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-28 bg-white/10 rounded-lg" />
              <div className="h-5 w-24 bg-white/10 rounded-full" />
            </div>
            <div className="flex items-baseline gap-2 pt-2">
              <div className="h-10 w-24 bg-white/15 rounded-xl" />
              <div className="h-4 w-8 bg-white/10 rounded-md" />
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full mt-2" />
            <div className="h-3 w-40 bg-white/10 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const focusGoalPercent = dailyGoalHours > 0 ? Math.min(100, Math.round((totalFocusHours / dailyGoalHours) * 100)) : 0;

  // Subtle animation/shake when streak breaks (Framer Motion)
  const shakeAnimation = isStreakBroken
    ? {
        x: [0, -6, 6, -5, 5, -3, 3, -1, 1, 0],
        transition: { duration: 0.6, ease: "easeInOut" as const },
      }
    : { x: 0 };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      {/* 1. Today's Focus Card */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950/90 border border-white/10 hover:border-emerald-500/30 backdrop-blur-xl space-y-4 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.36)] hover:shadow-[0_12px_36px_rgba(16,185,129,0.1)] transition-all duration-300 group">
        {/* Ambient Top Glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/15 transition-colors" />

        <div className="flex items-center justify-between relative z-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Target className="w-3.5 h-3.5" />
            </span>
            Today&apos;s Focus
          </span>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-medium">
            Target: {dailyGoalHours}.0h
          </span>
        </div>

        <div className="flex items-baseline gap-2 relative z-10 pt-1">
          <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
            {totalFocusHours.toFixed(1)}
          </span>
          <span className="text-sm text-slate-400 font-medium">hrs</span>
        </div>

        {/* Mini Progress Bar */}
        <div className="space-y-1.5 relative z-10">
          <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${focusGoalPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>{focusGoalPercent}% of daily target</span>
            <span className="text-emerald-400 font-medium">{totalFocusHours > 0 ? "92% efficiency" : "Ready"}</span>
          </div>
        </div>
      </div>

      {/* 2. Active Streak Card (with Dynamic States & Framer Motion Shake) */}
      <motion.div
        animate={shakeAnimation}
        className={`p-4 sm:p-6 rounded-2xl backdrop-blur-xl space-y-4 relative overflow-hidden transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.36)] group ${
          isStreakBroken
            ? "bg-gradient-to-br from-slate-900/90 to-rose-950/30 border border-rose-500/30 shadow-[0_0_30px_rgba(244,63,94,0.15)]"
            : streakDays > 0
            ? "bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950/90 border border-emerald-500/25 hover:border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.08)]"
            : "bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950/90 border border-white/10 hover:border-white/20"
        }`}
      >
        {/* Ambient Top Glow */}
        <div
          className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl pointer-events-none transition-colors ${
            isStreakBroken
              ? "bg-rose-500/15"
              : streakDays > 0
              ? "bg-emerald-500/10 group-hover:bg-emerald-500/15"
              : "bg-amber-500/10"
          }`}
        />

        <div className="flex items-center justify-between relative z-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span
              className={`p-1 rounded-lg border ${
                isStreakBroken
                  ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  : streakDays > 0
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
              }`}
            >
              {isStreakBroken ? (
                <HeartCrack className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <Flame className={`w-3.5 h-3.5 ${streakDays > 0 ? "text-emerald-400" : "text-amber-400"}`} />
              )}
            </span>
            Active Streak
          </span>

          {/* Accent Badges */}
          {isStreakBroken ? (
            <span
              onClick={onOpenStreakLossModal}
              className="text-xs font-mono font-bold text-rose-400 bg-rose-500/15 px-2.5 py-0.5 rounded-full border border-rose-500/30 cursor-pointer hover:bg-rose-500/25 transition-colors"
            >
              Broken 💔
            </span>
          ) : streakDays > 0 ? (
            <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              Active 🔥
            </span>
          ) : (
            <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700">
              Start Today
            </span>
          )}
        </div>

        {/* Value Display */}
        {isStreakBroken ? (
          <div className="space-y-2 relative z-10 pt-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono tracking-tight flex items-center gap-2">
              Streak Broken 💔
            </div>
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-rose-500/20">
              <p className="text-[11px] text-rose-300 font-medium">
                Last active: {daysSinceLastActive === 1 ? "yesterday" : `${daysSinceLastActive || 2} days ago`}
              </p>
              {canUseStreakSaver && onUseStreakSaver && (
                <button
                  type="button"
                  onClick={onUseStreakSaver}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold transition-all active:scale-95 cursor-pointer shadow-sm"
                  title="Use your 1 monthly streak saver to preserve this streak"
                >
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Save Streak
                </button>
              )}
            </div>
          </div>
        ) : streakDays > 0 ? (
          <div className="space-y-2 relative z-10 pt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                {streakDays}
              </span>
              <span className="text-sm font-bold text-emerald-400">
                {streakDays === 1 ? "Day" : "Days"} 🔥
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/5">
              <span className="text-emerald-400/90 font-medium">Daily momentum alive</span>
              <span className="text-slate-500 font-mono">Keep it rolling</span>
            </div>
          </div>
        ) : (
          <div className="space-y-2 relative z-10 pt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-200 font-mono">
                Start Today
              </span>
            </div>
            <p className="text-[11px] text-slate-400 pt-1 border-t border-white/5">
              Complete 1 session (10m+) to begin your streak
            </p>
          </div>
        )}
      </motion.div>

      {/* 3. Task Completion Card */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950/90 border border-white/10 hover:border-cyan-500/30 backdrop-blur-xl space-y-4 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.36)] hover:shadow-[0_12px_36px_rgba(6,182,212,0.1)] transition-all duration-300 group">
        {/* Ambient Top Glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/15 transition-colors" />

        <div className="flex items-center justify-between relative z-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span className="p-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
            Task Completion
          </span>
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20 font-medium">
            {completedTasks}/{totalTasks} Done
          </span>
        </div>

        <div className="flex items-baseline gap-2 relative z-10 pt-1">
          <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
            {completionPercentage}%
          </span>
          <span className="text-sm text-slate-400 font-medium">rate</span>
        </div>

        {/* Mini Progress Bar */}
        <div className="space-y-1.5 relative z-10">
          <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>{completedTasks} completed</span>
            <span className="text-cyan-400 font-medium">{totalTasks - completedTasks} remaining</span>
          </div>
        </div>
      </div>
    </div>
  );
}