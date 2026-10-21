"use client";

import React, { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Trophy, Play, Coffee, X } from "lucide-react";

export interface SessionCompleteCelebrationProps {
  isOpen: boolean;
  durationMinutes?: number;
  startTime?: number | string | Date | null;
  endTime?: number | string | Date | null;
  onStartAnother: () => void;
  onTakeBreak: () => void;
  onClose?: () => void;
}

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  rotate: number;
  targetRotate: number;
  color: string;
  size: number;
  shape: "rect" | "circle" | "strip";
  duration: number;
  delay: number;
}

const CONFETTI_COLORS = [
  "#10b981", // emerald
  "#34d399", // light emerald
  "#00ff88", // neon green
  "#f59e0b", // amber
  "#fbbf24", // yellow
  "#06b6d4", // cyan
  "#38bdf8", // light blue
  "#a855f7", // purple
  "#ec4899", // pink
  "#ffffff", // white
];

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function generateConfettiParticles(count = 55): ConfettiParticle[] {
  const particles: ConfettiParticle[] = [];
  const shapes: Array<"rect" | "circle" | "strip"> = ["rect", "circle", "strip"];

  for (let i = 0; i < count; i++) {
    const r1 = pseudoRandom(i * 7 + 1);
    const r2 = pseudoRandom(i * 7 + 2);
    const r3 = pseudoRandom(i * 7 + 3);
    const r4 = pseudoRandom(i * 7 + 4);
    const r5 = pseudoRandom(i * 7 + 5);
    const r6 = pseudoRandom(i * 7 + 6);

    const angle = (Math.PI * 2 * i) / count + (r1 - 0.5) * 0.5;
    const distance = 180 + r2 * 320;
    const targetX = Math.cos(angle) * distance + (r3 - 0.5) * 80;
    const targetY = Math.sin(angle) * distance + 100 + r4 * 200;
    const shape = shapes[Math.floor(r5 * shapes.length)];

    particles.push({
      id: i,
      x: 0,
      y: 0,
      targetX,
      targetY,
      rotate: (r1 - 0.5) * 90,
      targetRotate: (r2 - 0.5) * 720,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: shape === "strip" ? 14 : 7 + r6 * 6,
      shape,
      duration: 2.2 + r3 * 1.4,
      delay: r4 * 0.25,
    });
  }

  return particles;
}

const STATIC_CONFETTI_PARTICLES = generateConfettiParticles(55);

/**
 * Resolves the completed session's duration in minutes dynamically:
 * 1. Explicit durationMinutes prop (if passed)
 * 2. Difference between session startTime and endTime
 * 3. localStorage recorded duration from completed session or custom settings
 */
export function resolveCompletedSessionDuration({
  durationMinutes,
  startTime,
  endTime,
}: {
  durationMinutes?: number;
  startTime?: number | string | Date | null;
  endTime?: number | string | Date | null;
}): number {
  // 1. Explicit duration passed from timer state
  if (typeof durationMinutes === "number" && !isNaN(durationMinutes) && durationMinutes > 0) {
    return Math.round(durationMinutes);
  }

  // 2. Check pending celebration and stored durations in localStorage
  if (typeof window !== "undefined") {
    const pendingDur = localStorage.getItem("pending_celebration_duration");
    if (pendingDur) {
      const parsed = parseInt(pendingDur, 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }

    try {
      const pending = localStorage.getItem("pending_celebration");
      if (pending) {
        const parsed = JSON.parse(pending);
        if (parsed && typeof parsed === "object" && parsed.duration) {
          const val = Number(parsed.duration);
          if (!isNaN(val) && val > 0) return Math.round(val);
        }
      }
    } catch {
      // ignore
    }

    const lastSessionDur = localStorage.getItem("flowstate_last_completed_session_duration");
    if (lastSessionDur) {
      const parsed = parseInt(lastSessionDur, 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }

    const customFocusDur =
      localStorage.getItem("flowstate_pomodoro_focus_duration_mins") ||
      localStorage.getItem("flowstate_custom_focus_duration") ||
      localStorage.getItem("flowstate_current_session_duration");
    if (customFocusDur) {
      const parsed = parseInt(customFocusDur, 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }

    try {
      const activeUid = localStorage.getItem("flowstate_active_user_id") || "guest_default";
      const cached =
        localStorage.getItem(`flowstate_cached_focus_sessions_${activeUid}`) ||
        localStorage.getItem("flowstate_cached_focus_sessions");
      if (cached) {
        const parsedList = JSON.parse(cached);
        if (Array.isArray(parsedList) && parsedList.length > 0 && parsedList[0].duration_minutes) {
          const val = Number(parsedList[0].duration_minutes);
          if (!isNaN(val) && val > 0) return Math.round(val);
        }
      }
    } catch {
      // ignore
    }
  }

  // 3. Elapsed duration from startTime and endTime
  if (startTime && endTime) {
    const startMs = typeof startTime === "number" ? startTime : new Date(startTime).getTime();
    const endMs = typeof endTime === "number" ? endTime : new Date(endTime).getTime();
    if (!isNaN(startMs) && !isNaN(endMs) && endMs > startMs) {
      const elapsedMinutes = Math.round((endMs - startMs) / (60 * 1000));
      if (elapsedMinutes > 0) {
        return elapsedMinutes;
      }
    }
  }

  return 25;
}

export function SessionCompleteCelebration({
  isOpen,
  durationMinutes,
  startTime,
  endTime,
  onStartAnother,
  onTakeBreak,
  onClose,
}: SessionCompleteCelebrationProps) {
  // Calculate dynamic duration
  const dynamicDuration = useMemo(
    () => resolveCompletedSessionDuration({ durationMinutes, startTime, endTime }),
    [durationMinutes, startTime, endTime]
  );

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Confetti particles pre-generated deterministically to ensure pure rendering
  const confettiParticles = isOpen ? STATIC_CONFETTI_PARTICLES : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          {/* Dark backdrop ensuring celebration stands out */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-md"
          />

          {/* Confetti Animation Container */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden z-20">
            {confettiParticles.map((p) => (
              <motion.div
                key={p.id}
                initial={{
                  opacity: 1,
                  scale: 0,
                  x: 0,
                  y: -50,
                  rotate: p.rotate,
                }}
                animate={{
                  opacity: [1, 1, 0.8, 0],
                  scale: [0, 1.2, 1, 0.8],
                  x: p.targetX,
                  y: p.targetY,
                  rotate: p.targetRotate,
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  repeat: Infinity,
                  repeatDelay: 1.5,
                }}
                style={{
                  position: "absolute",
                  backgroundColor: p.color,
                  width: p.shape === "strip" ? 4 : p.size,
                  height: p.shape === "strip" ? p.size : p.size,
                  borderRadius: p.shape === "circle" ? "50%" : p.shape === "strip" ? "2px" : "3px",
                  boxShadow: `0 0 10px ${p.color}60`,
                }}
              />
            ))}
          </div>

          {/* Celebration Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.55, bounce: 0.18 }}
            className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900/98 to-slate-950 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_0_50px_rgba(16,185,129,0.25)] text-center space-y-6 z-30 overflow-hidden"
          >
            {/* Top gradient glow line */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-44 bg-emerald-500/15 rounded-full blur-[80px] pointer-events-none" />

            {/* Close Button */}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close celebration"
                className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800 transition-colors cursor-pointer z-40"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Glowing Trophy Icon Badge */}
            <div className="relative mx-auto flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500/25 via-teal-500/15 to-amber-500/20 border border-emerald-500/40 text-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.35)]">
              <Trophy className="w-10 h-10 text-emerald-400" />
              <motion.span
                animate={{
                  scale: [1, 1.25, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-1.5 -right-1.5 p-1 bg-slate-950 rounded-full border border-amber-400/40 text-amber-400"
              >
                <Sparkles className="w-4 h-4 fill-amber-400/20" />
              </motion.span>
            </div>

            {/* Title & Celebration Text */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.25)]">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Focus Goal Achieved</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Session Complete! 🎉
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-md mx-auto">
                You added{" "}
                <span className="text-emerald-300 font-extrabold font-mono underline decoration-emerald-500/50 decoration-2 underline-offset-4">
                  +{dynamicDuration} minutes
                </span>{" "}
                to your focus time. Keep the momentum going!
              </p>
            </div>

            {/* Stat Summary Box */}
            <div className="rounded-2xl bg-slate-950/70 border border-white/10 p-3.5 flex items-center justify-around text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Time Earned</span>
                <span className="text-emerald-400 font-mono font-black text-base sm:text-lg">
                  +{dynamicDuration}m
                </span>
              </div>
              <div className="h-7 w-[1px] bg-white/10" />
              <div>
                <span className="text-slate-400 block text-[11px]">Status</span>
                <span className="text-emerald-300 font-semibold text-xs sm:text-sm flex items-center gap-1">
                  Deep Flow Logged
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onStartAnother}
                className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 transition-all duration-200 shadow-[0_0_25px_rgba(16,185,129,0.45)] hover:shadow-[0_0_35px_rgba(16,185,129,0.65)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Start Another Session</span>
              </button>

              <button
                type="button"
                onClick={onTakeBreak}
                className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/10 hover:border-emerald-500/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Coffee className="w-4 h-4 text-emerald-400" />
                <span>Take a Break</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
