"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  Sparkles,
  Play,
  Coffee,
  LogOut,
  Loader2,
} from "lucide-react";
import {
  fetchPanicIntervention,
  PanicInterventionResult,
} from "@/lib/discipline-service";

interface PanicInterventionModalProps {
  isOpen: boolean;
  onContinue: () => void;
  onBreak: () => void;
  onQuit: () => void;
  minutesLeft?: number;
  userName?: string;
}

export function PanicInterventionModal({
  isOpen,
  onContinue,
  onBreak,
  onQuit,
  minutesLeft = 10,
  userName = "Warrior",
}: PanicInterventionModalProps) {
  const [aiData, setAiData] = useState<PanicInterventionResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isQuitting, setIsQuitting] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    fetchPanicIntervention({
      userName,
      minutesLeft,
    })
      .then((data) => {
        if (isMounted) {
          setAiData(data);
        }
      })
      .catch((err) => {
        console.warn("Panic intervention AI fetch notice:", err);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, minutesLeft, userName]);

  const handleQuitClick = async () => {
    setIsQuitting(true);
    try {
      await onQuit();
    } finally {
      setIsQuitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="panic-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl select-none"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            key="panic-modal-card"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="relative w-full max-w-lg rounded-3xl bg-slate-950/95 border border-rose-500/40 p-6 sm:p-7 shadow-[0_0_50px_rgba(244,63,94,0.3)] flex flex-col items-center text-center space-y-4 sm:space-y-5 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient background glows */}
            <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-rose-500/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

            {/* Pulse Header Icon */}
            <div className="relative">
              <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                <ShieldAlert className="w-8 h-8 animate-pulse text-rose-400" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-900 border border-rose-500/60 flex items-center justify-center text-rose-400">
                <Sparkles className="w-3 h-3" />
              </div>
            </div>

            {/* Badge & Title */}
            <div className="space-y-1.5 max-w-md">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[10px] font-extrabold uppercase tracking-widest">
                <Sparkles className="w-3 h-3 text-rose-400" />
                <span>Google Gemini AI Intervention</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {aiData?.headline || "Hold The Line"}
              </h3>
            </div>

            {/* Required Exact Intervention Text Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-white/10 w-full shadow-inner text-center">
              <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
                You are 10 minutes away from finishing. Your future self will thank you. Do you really want to quit?
              </p>

              {aiData?.coachingInsight && (
                <p className="text-xs text-slate-300 mt-2.5 pt-2.5 border-t border-white/10 italic leading-normal">
                  &ldquo;{aiData.coachingInsight}&rdquo;
                </p>
              )}

              {aiData?.quote && (
                <div className="mt-2 text-[11px] text-amber-300/90 font-medium">
                  — {aiData.quote} {aiData.author ? `(${aiData.author})` : ""}
                </div>
              )}

              {isLoading && (
                <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] text-rose-400/80 animate-pulse">
                  <Sparkles className="w-3 h-3 animate-spin" />
                  <span>Consulting Google Gemini AI Coach...</span>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full pt-1">
              {/* Action 1: 'No, I'll continue' */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onContinue}
                className="flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>No, I&apos;ll continue</span>
              </motion.button>

              {/* Action 2: 'I need a 5-min break' */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onBreak}
                className="py-3 px-3.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-900 hover:bg-slate-850 text-amber-300 border border-amber-500/30 hover:border-amber-500/50 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Coffee className="w-3.5 h-3.5 text-amber-400" />
                <span>I need a 5-min break</span>
              </motion.button>

              {/* Action 3: 'Yes, I quit' */}
              <motion.button
                type="button"
                disabled={isQuitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleQuitClick}
                className="py-3 px-3.5 rounded-xl text-xs sm:text-sm font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/30 hover:border-rose-500/50 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isQuitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-400" />
                ) : (
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                )}
                <span>Yes, I quit</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
