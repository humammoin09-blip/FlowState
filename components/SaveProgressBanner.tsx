"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, X, ShieldAlert, Cloud } from "lucide-react";
import { checkProgressiveOnboardingEligibility } from "@/lib/auth-service";

interface SaveProgressBannerProps {
  onOpenAuth: () => void;
  className?: string;
}

const STORAGE_KEY_SAVE_PROGRESS_DISMISSED = "flowstate_save_progress_banner_dismissed";

export function SaveProgressBanner({ onOpenAuth, className = "" }: SaveProgressBannerProps) {
  const [shouldShow, setShouldShow] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    (async () => {
      if (typeof window === "undefined") return;

      // Check if dismissed previously today
      const dismissedDate = localStorage.getItem(STORAGE_KEY_SAVE_PROGRESS_DISMISSED);
      const today = new Date().toISOString().split("T")[0];
      if (dismissedDate === today) {
        setIsDismissed(true);
        return;
      }

      // Check eligibility (Guest AND 3+ active days OR 3+ completed sessions)
      const isEligible = await checkProgressiveOnboardingEligibility();
      setShouldShow(isEligible);
    })();

    // Listen for auth events to automatically hide if user logs in
    const handleAuthChange = () => {
      checkProgressiveOnboardingEligibility().then((eligible) => setShouldShow(eligible));
    };
    window.addEventListener("flowstate_user_authenticated", handleAuthChange);

    return () => {
      window.removeEventListener("flowstate_user_authenticated", handleAuthChange);
    };
  }, []);

  const handleDismiss = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setIsDismissed(true);
    if (typeof window !== "undefined") {
      const today = new Date().toISOString().split("T")[0];
      localStorage.setItem(STORAGE_KEY_SAVE_PROGRESS_DISMISSED, today);
    }
  };

  if (!shouldShow || isDismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, height: 0, margin: 0, padding: 0 }}
        transition={{ duration: 0.3 }}
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-950/90 border border-amber-500/30 p-3.5 sm:p-4 text-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(245,158,11,0.08)] backdrop-blur-xl ${className}`}
      >
        {/* Subtle ambient lighting */}
        <div className="absolute top-0 right-1/4 w-48 h-16 bg-amber-500/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-6 left-12 w-40 h-16 bg-emerald-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          {/* Left info column */}
          <div className="flex items-center gap-3 min-w-0 pr-6 sm:pr-0">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/40 text-amber-400 shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
              </span>
            </div>

            <div className="space-y-0.5">
              <div className="text-xs sm:text-sm font-bold text-white tracking-tight">
                Don&apos;t lose your streak!{" "}
                <span className="text-slate-300 font-normal">
                  Create a free account to sync your data across devices.
                </span>
              </div>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
            <button
              type="button"
              onClick={onOpenAuth}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 transition-all duration-200 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_22px_rgba(16,185,129,0.5)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>Save Progress</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss banner for today"
              title="Dismiss"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
