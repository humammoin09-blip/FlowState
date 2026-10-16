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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl space-y-3 relative overflow-hidden animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-28 bg-white/10 rounded-lg" />
              <div className="h-4 w-20 bg-white/10 rounded-full" />
            </div>
            <div className="flex items-baseline gap-2 pt-1">
              <div className="h-9 w-20 bg-white/15 rounded-xl" />
              <div className="h-4 w-8 bg-white/10 rounded-md" />
            </div>
            <div className="h-3 w-36 bg-white/10 rounded-md mt-2" />
          </div>
        ))}
      </div>
    );
  }

  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Subtle animation/shake when streak breaks (Framer Motion)
  const shakeAnimation = isStreakBroken
    ? {
        x: [0, -6, 6, -5, 5, -3, 3, -1, 1, 0],
        transition: { duration: 0.6, ease: "easeInOut" as const },
      }
    : { x: 0 };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 1. Today's Focus Card */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" /> Today's Focus
          </span>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            Target: {dailyGoalHours}.0 hrs
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-white font-mono">
            {totalFocusHours.toFixed(1)}
          </span>
          <span className="text-xs text-slate-400">hrs</span>
        </div>
        <p className="text-[11px] text-slate-400">
          Deep work efficiency: <span className="text-emerald-400 font-semibold">{totalFocusHours > 0 ? "92%" : "Ready"}</span>
        </p>
      </div>

      {/* 2. Active Streak Card (with Dynamic States & Framer Motion Shake) */}
      <motion.div
        animate={shakeAnimation}
        className={`p-5 rounded-2xl backdrop-blur-xl space-y-3 relative overflow-hidden transition-all duration-300 ${
          isStreakBroken
            ? "bg-slate-900/90 border border-rose-500/30 shadow-[0_0_25px_rgba(244,63,94,0.15)]"
            : streakDays > 0
            ? "bg-slate-900/80 border border-emerald-500/25 shadow-[0_0_20px_rgba(16,185,129,0.08)]"
            : "bg-slate-900/80 border border-white/10"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            {isStreakBroken ? (
              <HeartCrack className="w-4 h-4 text-rose-400" />
            ) : (
              <Flame className={`w-4 h-4 ${streakDays > 0 ? "text-emerald-400" : "text-amber-400"}`} />
            )}
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
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono tracking-tight flex items-center gap-2">
              Streak Broken 💔
            </div>
            <div className="flex items-center justify-between gap-2 pt-1">
              <p className="text-[11px] text-rose-300 font-medium">
                Last active: {daysSinceLastActive === 1 ? "yesterday" : `${daysSinceLastActive || 2} days ago`}
              </p>
              {canUseStreakSaver && onUseStreakSaver && (
                <button
                  type="button"
                  onClick={onUseStreakSaver}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold transition-all active:scale-95 cursor-pointer"
                  title="Use your 1 monthly streak saver to preserve this streak"
                >
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Save Streak
                </button>
              )}
            </div>
          </div>
        ) : streakDays > 0 ? (
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-mono">
                {streakDays}
              </span>
              <span className="text-sm font-bold text-emerald-400">
                {streakDays === 1 ? "Day" : "Days"} 🔥
              </span>
            </div>
            <p className="text-[11px] text-emerald-400/80 font-medium mt-1">
              Active daily momentum maintained
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-200 font-mono">
                Start Today
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Complete 1 session (10m+) to begin your streak
            </p>
          </div>
        )}
      </motion.div>

      {/* 3. Task Completion Card */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Task Completion
          </span>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
            {completedTasks}/{totalTasks} Done
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-white font-mono">
            {completionPercentage}%
          </span>
          <span className="text-xs text-slate-400">Execution rate</span>
        </div>
        <p className="text-[11px] text-slate-400">
          Real task execution count
        </p>
      </div>
    </div>
  );
}