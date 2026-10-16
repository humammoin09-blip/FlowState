"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  RotateCcw,
  Quote,
  X,
  Play,
  ShieldAlert,
  ShieldCheck,
  Brain,
  Clock,
  HeartCrack,
} from "lucide-react";
import {
  StreakLossIntervention,
  fetchStreakLossQuote,
} from "@/lib/discipline-service";

interface StreakLossModalProps {
  isOpen: boolean;
  onClose: () => void;
  previousStreak: number;
  userName: string;
  onRebuildStreak?: () => void;
  canUseStreakSaver?: boolean;
  streakSaverCooldownDays?: number;
  daysSinceLastActive?: number;
  onUseStreakSaver?: () => void;
}

export function StreakLossModal({
  isOpen,
  onClose,
  previousStreak,
  userName,
  onRebuildStreak,
  canUseStreakSaver = false,
  streakSaverCooldownDays = 0,
  daysSinceLastActive = 2,
  onUseStreakSaver,
}: StreakLossModalProps) {
  const [intervention, setIntervention] = useState<StreakLossIntervention | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [saverSuccessMessage, setSaverSuccessMessage] = useState<string | null>(null);

  const loadIntervention = async () => {
    setLoading(true);
    try {
      const data = await fetchStreakLossQuote({
        userName,
        previousStreak,
      });
      setIntervention(data);
    } catch (err) {
      console.warn("Failed to retrieve streak loss quote:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadIntervention();
      setSaverSuccessMessage(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRebuild = () => {
    onClose();
    if (onRebuildStreak) {
      onRebuildStreak();
    }
  };

  const handleUseSaver = () => {
    if (onUseStreakSaver) {
      onUseStreakSaver();
      setSaverSuccessMessage("Streak Saver applied! Your momentum is preserved.");
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  const formattedDaysAgo =
    daysSinceLastActive === 1
      ? "yesterday"
      : `${daysSinceLastActive || 2} days ago`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
          className="relative w-full max-w-xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-rose-500/30 rounded-3xl shadow-2xl overflow-hidden z-10 my-8"
        >
          {/* Top glowing ambient hazard accent */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600" />
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px] pointer-events-none" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Header Badge & Title */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-inner">
                  <ShieldAlert className="w-8 h-8 text-rose-500" />
                </div>
                <div className="absolute -bottom-1 -right-1 p-1 bg-slate-950 rounded-full">
                  <HeartCrack className="w-4 h-4 text-rose-400" />
                </div>
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-rose-500/15 border border-rose-500/30 text-rose-400 mb-2">
                  Streak Broken 💔
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  The Chain Was Broken.
                </h2>
                <div className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto space-y-1">
                  <p>
                    {previousStreak > 0
                      ? `Your streak of ${previousStreak} consecutive days has lapsed.`
                      : "A day without focused effort has passed. The chain rests at zero."}
                  </p>
                  <p className="text-rose-400/90 font-medium flex items-center justify-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Last active: {formattedDaysAgo}
                  </p>
                </div>
              </div>
            </div>

            {/* STREAK SAVER SECTION (Only 1 per 30 days) */}
            {canUseStreakSaver && onUseStreakSaver ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-teal-950/50 border border-emerald-500/40 space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Streak Saver Available (1 / 30 Days)
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Monthly Shield
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  You have 1 monthly streak saver ready. Use it now to preserve your{" "}
                  <strong className="text-emerald-300">{previousStreak}-day active streak</strong>{" "}
                  and prevent the reset.
                </p>

                {saverSuccessMessage ? (
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center">
                    ✓ {saverSuccessMessage}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleUseSaver}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer active:scale-98"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Activate Streak Saver ({previousStreak} Days Preserved)
                  </button>
                )}
              </motion.div>
            ) : streakSaverCooldownDays > 0 ? (
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                  Monthly Streak Saver: Cooldown Active
                </span>
                <span className="font-mono text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                  Available in {streakSaverCooldownDays}d
                </span>
              </div>
            ) : null}

            {/* Psychological Quote Card */}
            <div className="relative rounded-2xl bg-slate-950/80 border border-slate-800/90 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-semibold text-rose-400">
                  <Quote className="w-3.5 h-3.5" />
                  Stoic Reality Check
                </span>
                <span className="font-mono text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                  {intervention?.modelUsed || "gemini-3.5-flash-lite"}
                </span>
              </div>

              {loading ? (
                <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-400">
                  <RotateCcw className="w-5 h-5 animate-spin text-rose-400" />
                  <span className="text-xs">Invoking Psychological Discipline Engine...</span>
                </div>
              ) : (
                <>
                  <blockquote className="text-sm sm:text-base font-serif text-slate-200 italic leading-relaxed">
                    &ldquo;{intervention?.quote || "You have power over your mind - not outside events. Realize this, and you will find strength. Never let one lost battle lose the war."}&rdquo;
                  </blockquote>
                  <div className="text-xs font-semibold text-slate-400 text-right">
                    — {intervention?.author || "Marcus Aurelius"}
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-300 leading-relaxed font-sans">
                    <p className="text-amber-200/90 font-medium mb-1">
                      {intervention?.headline || "Never Miss Twice."}
                    </p>
                    <p className="text-slate-400">
                      {intervention?.psychologicalMessage ||
                        "Missing one day is an accident; missing two is the beginning of a new habit. Regret is useless unless converted into immediate discipline. Reclaim your standard right now."}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Why You Started Reminder */}
            <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Brain className="w-3.5 h-3.5 text-indigo-400" />
                <span>The Iron Law of Momentum:</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                The pain of discipline weighs ounces. The pain of regret weighs tons. You didn&apos;t start this journey to quit when resistance appeared. The only failure is staying down.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleRebuild}
                className="w-full sm:flex-1 py-3 px-5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                Rebuild The Chain (Start 25m Focus)
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto py-3 px-5 rounded-xl font-medium text-xs text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                I Acknowledge
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
