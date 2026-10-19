"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertOctagon } from "lucide-react";

interface PanicButtonProps {
  onTrigger: () => void;
  disabled?: boolean;
  className?: string;
  holdDurationMs?: number;
}

const DEFAULT_HOLD_DURATION_MS = 5000;
const RADIUS = 14;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function PanicButton({
  onTrigger,
  disabled = false,
  className = "",
  holdDurationMs = DEFAULT_HOLD_DURATION_MS,
}: PanicButtonProps) {
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const startTimeRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const onTriggerRef = useRef(onTrigger);
  useEffect(() => {
    onTriggerRef.current = onTrigger;
  });

  // Cancel hold action & reset progress immediately if released early
  const cancelHold = useCallback(() => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    startTimeRef.current = null;
    setIsHolding(false);
    setProgress(0);
  }, []);

  const startHold = useCallback(
    (e?: React.SyntheticEvent) => {
      if (disabled) return;
      if (e && e.cancelable) {
        e.preventDefault();
      }

      // If already holding, don't restart
      if (startTimeRef.current !== null) return;

      cancelHold();
      setIsHolding(true);

      const startTime = performance.now();
      startTimeRef.current = startTime;

      const step = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const currentProgress = Math.min(1, Math.max(0, elapsed / holdDurationMs));
        setProgress(currentProgress);

        if (currentProgress >= 1) {
          // 5 seconds completed! Trigger action and reset hold
          cancelHold();
          onTriggerRef.current();
        } else {
          animFrameRef.current = requestAnimationFrame(step);
        }
      };

      animFrameRef.current = requestAnimationFrame(step);
    },
    [disabled, holdDurationMs, cancelHold]
  );

  // Global release & window blur listener to ensure reset if pointer lifts outside
  useEffect(() => {
    if (!isHolding) return;

    const handleGlobalRelease = () => {
      cancelHold();
    };

    window.addEventListener("pointerup", handleGlobalRelease);
    window.addEventListener("touchend", handleGlobalRelease);
    window.addEventListener("touchcancel", handleGlobalRelease);
    window.addEventListener("blur", handleGlobalRelease);

    return () => {
      window.removeEventListener("pointerup", handleGlobalRelease);
      window.removeEventListener("touchend", handleGlobalRelease);
      window.removeEventListener("touchcancel", handleGlobalRelease);
      window.removeEventListener("blur", handleGlobalRelease);
    };
  }, [isHolding, cancelHold]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  const remainingSeconds = Math.max(0, ((1 - progress) * (holdDurationMs / 1000))).toFixed(1);
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  return (
    <motion.button
      type="button"
      data-testid="panic-button"
      aria-label="Panic Button: Hold 5 seconds to quit session"
      title="Panic Button: Hold 5 seconds to quit session"
      disabled={disabled}
      onPointerDown={startHold}
      onPointerUp={cancelHold}
      onPointerLeave={cancelHold}
      onPointerCancel={cancelHold}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          startHold(e);
        }
      }}
      onKeyUp={(e) => {
        if (e.key === " " || e.key === "Enter") {
          cancelHold();
        }
      }}
      onContextMenu={(e) => e.preventDefault()}
      animate={{
        scale: isHolding ? 1.05 : 1,
      }}
      whileHover={{ scale: isHolding ? 1.05 : 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={`relative select-none flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl border transition-all duration-200 shadow-lg touch-none cursor-pointer overflow-hidden ${
        isHolding
          ? "bg-rose-500/25 border-rose-500 text-rose-200 shadow-[0_0_30px_rgba(244,63,94,0.5)] ring-2 ring-rose-500/50"
          : "bg-slate-900/80 border-rose-500/30 text-rose-300 hover:border-rose-500/60 hover:bg-rose-500/10 hover:shadow-[0_0_15px_rgba(244,63,94,0.2)]"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {/* Dynamic Glow Aura during hold */}
      {isHolding && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-gradient-to-r from-rose-500/20 via-red-500/30 to-amber-500/20 pointer-events-none"
        />
      )}

      {/* Circular SVG Progress Ring (fills up over 5 seconds) */}
      <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
        <svg className="w-8 h-8 -rotate-90">
          <circle
            cx="16"
            cy="16"
            r={RADIUS}
            className="stroke-rose-950/60"
            strokeWidth="3"
            fill="transparent"
          />
          <motion.circle
            cx="16"
            cy="16"
            r={RADIUS}
            className="stroke-rose-500"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            animate={{
              strokeDashoffset,
            }}
            transition={{ duration: 0.05, ease: "linear" }}
            fill="transparent"
            style={{
              filter: isHolding ? "drop-shadow(0px 0px 6px rgba(244,63,94,0.95))" : "none",
            }}
          />
        </svg>

        <AlertOctagon
          className={`w-3.5 h-3.5 absolute transition-transform ${
            isHolding ? "text-rose-400 scale-110 animate-pulse" : "text-rose-400/80"
          }`}
        />
      </div>

      {/* Button labels */}
      <div className="flex flex-col text-left relative z-10">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-black tracking-wide text-rose-300">
            Panic Button
          </span>
          {isHolding && (
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-[10px] font-mono font-bold text-rose-200 bg-rose-500/30 px-1 py-0.2 rounded border border-rose-500/50 animate-pulse"
            >
              {remainingSeconds}s
            </motion.span>
          )}
        </div>
        <span className="text-[10px] font-medium text-rose-400/80">
          {isHolding ? "Hold to Quit..." : "Hold 5s to Quit"}
        </span>
      </div>
    </motion.button>
  );
}
