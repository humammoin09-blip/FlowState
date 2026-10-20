"use client";

import React, { useCallback, useSyncExternalStore, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Target,
  ShieldCheck,
  ShieldAlert,
  Timer,
  ExternalLink,
  ArrowRight,
  Check,
  X,
  Zap,
} from "lucide-react";
import {
  EDGE_STORE_URL,
  isExtensionInstalled,
} from "./InstallExtensionBanner";

export const STORAGE_KEY_WELCOME_SEEN = "flowstate_welcome_modal_seen";

const emptySubscribe = () => () => {};

const extensionSubscribe = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("message", callback);
  return () => {
    window.removeEventListener("message", callback);
  };
};

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBlueprint: () => void;
  onGoToFocusTimer: () => void;
}

export function WelcomeModal({
  isOpen,
  onClose,
  onOpenBlueprint,
  onGoToFocusTimer,
}: WelcomeModalProps) {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const extensionInstalled = useSyncExternalStore(
    extensionSubscribe,
    () => isExtensionInstalled(),
    () => false
  );

  const dismissAndMarkSeen = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY_WELCOME_SEEN, "true");
      } catch {
        // Ignore localStorage write errors
      }
    }
    onClose();
  }, [onClose]);

  const handleDismiss = useCallback(() => {
    dismissAndMarkSeen();
  }, [dismissAndMarkSeen]);

  const handleStepBlueprint = useCallback(() => {
    dismissAndMarkSeen();
    onOpenBlueprint();
  }, [dismissAndMarkSeen, onOpenBlueprint]);

  const handleStepTimer = useCallback(() => {
    dismissAndMarkSeen();
    onGoToFocusTimer();
  }, [dismissAndMarkSeen, onGoToFocusTimer]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleDismiss();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleDismiss]);

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleDismiss}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ type: "spring", duration: 0.45, bounce: 0.12 }}
            className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900/98 to-slate-950 border border-emerald-500/30 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_35px_rgba(16,185,129,0.15)] overflow-hidden z-10 my-4"
          >
            {/* Glowing top line accent */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-44 bg-emerald-500/10 rounded-full blur-[90px] pointer-events-none" />

            {/* Close Button */}
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Close welcome modal"
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800/80 transition-colors cursor-pointer z-20"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-5 sm:p-7 md:p-8 space-y-6">
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>Welcome to FlowState</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Your Launchpad for Relentless Focus
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  Follow these 3 simple steps to lock in your intention, silence distractions, and enter deep work.
                </p>
              </div>

              {/* 3 Step Cards */}
              <div className="space-y-3">
                {/* STEP 1: Set your Daily Blueprint */}
                <div className="group relative rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-white/10 hover:border-emerald-500/40 p-3.5 sm:p-4.5 transition-all duration-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0 mt-0.5 sm:mt-0 shadow-inner">
                      <Target className="w-5 h-5 text-emerald-400" />
                      <span className="absolute -top-1.5 -left-1.5 px-1.5 py-0.2 bg-emerald-500 text-slate-950 text-[9px] font-black rounded-full shadow">
                        01
                      </span>
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                        Set your Daily Blueprint
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Declare your primary goal and customize your strict study domain allowlist for today.
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={handleStepBlueprint}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 hover:border-emerald-500/70 transition-all shadow-sm active:scale-95 cursor-pointer whitespace-nowrap"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Open Blueprint</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* STEP 2: Install the FlowState Blocker Extension */}
                <div className="group relative rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-white/10 hover:border-emerald-500/40 p-3.5 sm:p-4.5 transition-all duration-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 shrink-0 mt-0.5 sm:mt-0 shadow-inner">
                      {extensionInstalled ? (
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <ShieldAlert className="w-5 h-5 text-teal-400" />
                      )}
                      <span className="absolute -top-1.5 -left-1.5 px-1.5 py-0.2 bg-teal-500 text-slate-950 text-[9px] font-black rounded-full shadow">
                        02
                      </span>
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                          Install the FlowState Blocker Extension
                        </h3>
                        {extensionInstalled && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                            <Check className="w-3 h-3 text-emerald-400" />
                            Installed
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Block unauthorized websites and tabs automatically while focus sessions are active.
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 self-end sm:self-center">
                    <a
                      href={EDGE_STORE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-500/20 to-emerald-500/20 hover:from-teal-500/30 hover:to-emerald-500/30 text-teal-300 border border-teal-500/40 hover:border-teal-400 transition-all shadow-sm active:scale-95 cursor-pointer whitespace-nowrap"
                    >
                      <span>Install for Edge</span>
                      <ExternalLink className="w-3.5 h-3.5 text-teal-400" />
                    </a>
                  </div>
                </div>

                {/* STEP 3: Start your first Focus Session */}
                <div className="group relative rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-white/10 hover:border-emerald-500/40 p-3.5 sm:p-4.5 transition-all duration-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0 mt-0.5 sm:mt-0 shadow-inner">
                      <Timer className="w-5 h-5 text-cyan-400" />
                      <span className="absolute -top-1.5 -left-1.5 px-1.5 py-0.2 bg-cyan-500 text-slate-950 text-[9px] font-black rounded-full shadow">
                        03
                      </span>
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        Start your first Focus Session
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Enter the full-screen focus chamber, choose your ambient soundscape, and start your timer.
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={handleStepTimer}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all duration-200 shadow-[0_0_15px_rgba(16,185,129,0.35)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] active:scale-95 cursor-pointer whitespace-nowrap"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Go to Focus Timer</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Option: Skip for now */}
              <div className="pt-2 flex flex-col items-center justify-center">
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-200 px-4 py-2 rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  Skip for now
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
