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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((idx) => (
          <div
            key={idx}
            className="animate-pulse rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="h-3 w-24 rounded-full bg-slate-800" />
              <div className="h-6 w-20 rounded-full bg-slate-800" />
            </div>
            <div className="h-8 w-20 rounded-xl bg-slate-800" />
            <div className="mt-4 h-2 w-full rounded-full bg-slate-800" />
            <div className="mt-2 h-3 w-32 rounded-full bg-slate-800" />
          </div>
        ))}
      </div>
    );
  }

  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const focusGoalPercent = dailyGoalHours > 0 ? Math.min(100, Math.round((totalFocusHours / dailyGoalHours) * 100)) : 0;

  const shakeAnimation = isStreakBroken
    ? {
        x: [0, -5, 5, -4, 4, -2, 2, 0],
        transition: { duration: 0.5, ease: "easeInOut" as const },
      }
    : { x: 0 };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-[0_18px_40px_rgba(2,6,23,0.2)] sm:p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
              <Target className="h-3.5 w-3.5" />
            </span>
            Today&apos;s Focus
          </div>
          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
            {dailyGoalHours}.0h target
          </span>
        </div>

        <div className="mt-5 flex items-end gap-2">
          <span className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{totalFocusHours.toFixed(1)}</span>
          <span className="pb-1 text-sm text-slate-400">hrs</span>
        </div>

        <div className="mt-5 space-y-2">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${focusGoalPercent}%` }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>{focusGoalPercent}% of target</span>
            <span className="font-medium text-emerald-300">{totalFocusHours > 0 ? "On track" : "Ready"}</span>
          </div>
        </div>
      </div>

      <motion.div
        animate={shakeAnimation}
        className={`rounded-2xl border p-4 shadow-[0_18px_40px_rgba(2,6,23,0.2)] sm:p-5 ${
          isStreakBroken
            ? "border-rose-500/20 bg-rose-500/5"
            : streakDays > 0
              ? "border-emerald-500/20 bg-emerald-500/5"
              : "border-slate-800 bg-slate-900/80"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-xl border ${
                isStreakBroken
                  ? "border-rose-500/20 bg-rose-500/10 text-rose-300"
                  : streakDays > 0
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                    : "border-amber-500/20 bg-amber-500/10 text-amber-300"
              }`}
            >
              {isStreakBroken ? <HeartCrack className="h-3.5 w-3.5" /> : <Flame className="h-3.5 w-3.5" />}
            </span>
            Active Streak
          </div>

          {isStreakBroken ? (
            <span
              onClick={onOpenStreakLossModal}
              className="cursor-pointer rounded-full border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-[10px] font-medium text-rose-300"
            >
              Broken
            </span>
          ) : streakDays > 0 ? (
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
              Active
            </span>
          ) : (
            <span className="rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300">
              Start
            </span>
          )}
        </div>

        {isStreakBroken ? (
          <div className="mt-5 space-y-3">
            <div className="text-2xl font-semibold text-rose-300">Streak broken</div>
            <div className="flex items-center justify-between gap-2 border-t border-rose-500/15 pt-3 text-[11px] text-rose-200">
              <span>
                Last active: {daysSinceLastActive === 1 ? "yesterday" : `${daysSinceLastActive || 2} days ago`}
              </span>
              {canUseStreakSaver && onUseStreakSaver && (
                <button
                  type="button"
                  onClick={onUseStreakSaver}
                  className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 font-medium text-emerald-300"
                >
                  <ShieldCheck className="h-3 w-3" />
                  Save
                </button>
              )}
            </div>
          </div>
        ) : streakDays > 0 ? (
          <div className="mt-5 space-y-3">
            <div className="flex items-end gap-2">
              <span className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{streakDays}</span>
              <span className="pb-1 text-sm font-medium text-emerald-300">days</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-[11px] text-slate-400">
              <span className="text-emerald-300">Daily momentum alive</span>
              <span>Keep it rolling</span>
            </div>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            <div className="text-2xl font-semibold text-slate-100">Start today</div>
            <p className="border-t border-slate-800 pt-3 text-[11px] text-slate-400">
              Complete 1 session (10m+) to begin your streak
            </p>
          </div>
        )}
      </motion.div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-[0_18px_40px_rgba(2,6,23,0.2)] sm:p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-300">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </span>
            Task Completion
          </div>
          <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium text-cyan-300">
            {completedTasks}/{totalTasks} done
          </span>
        </div>

        <div className="mt-5 flex items-end gap-2">
          <span className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{completionPercentage}%</span>
          <span className="pb-1 text-sm text-slate-400">rate</span>
        </div>

        <div className="mt-5 space-y-2">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400"
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>{completedTasks} completed</span>
            <span className="font-medium text-cyan-300">{totalTasks - completedTasks} left</span>
          </div>
        </div>
      </div>
    </div>
  );
}
