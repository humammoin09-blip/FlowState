"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Puzzle, Info } from "lucide-react";

export const CHROME_STORE_URL =
  "https://chromewebstore.google.com/detail/flowstate-blocker/pfogmdmeecmebledgboclipombjdneip";

export const CRX_DOWNLOAD_URL = CHROME_STORE_URL;

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InstallGuideModal({ isOpen, onClose }: InstallGuideModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl bg-slate-900/95 border border-white/10 p-6 sm:p-7 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_25px_rgba(16,185,129,0.08)] backdrop-blur-2xl text-slate-100 z-10 overflow-hidden"
          >
            {/* Close Button inside motion.div so it fades out and scales down together with the modal */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onClose();
              }}
              aria-label="Close modal"
              className="absolute top-4 right-4 sm:top-5 sm:right-5 z-50 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 text-slate-400 hover:text-white" />
            </button>

            {/* Ambient emerald & indigo glow in modal */}
            <div className="absolute top-0 right-1/4 w-56 h-20 bg-emerald-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 left-10 w-44 h-24 bg-indigo-500/10 blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center gap-3.5 mb-6 pr-8">
              <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)] shrink-0">
                <Puzzle className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  Install for Chrome or Brave
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Get the official FlowState Blocker extension
                </p>
              </div>
            </div>

            {/* Action Button: Add to Chrome */}
            <div className="mb-4">
              <a
                href={CHROME_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all duration-200 shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_30px_rgba(16,185,129,0.55)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <span>Add to Chrome</span>
                <ExternalLink className="w-4 h-4 ml-0.5" />
              </a>
            </div>

            {/* Brave Note */}
            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-950/60 border border-white/5 text-xs text-slate-300 leading-relaxed">
              <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p>
                For Brave users, you can install it directly from the Chrome Web Store.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
