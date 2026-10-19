"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Download, ExternalLink, X, Check, RefreshCw } from "lucide-react";
import { InstallGuideModal } from "./InstallGuideModal";
import {
  EDGE_STORE_URL,
  STORAGE_KEY_EXTENSION_INSTALLED,
  isExtensionInstalled,
} from "./InstallExtensionBanner";

interface ExtensionRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ExtensionRequiredModal({
  isOpen,
  onClose,
  onSuccess,
}: ExtensionRequiredModalProps) {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [verified, setVerified] = useState(false);

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

  // Listen for extension detection messages while modal is open
  useEffect(() => {
    if (!isOpen) return;

    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;
      const { source, type } = event.data;
      if (
        source === "flowstate-extension" ||
        type === "FLOWSTATE_EXTENSION_HEARTBEAT" ||
        type === "FLOWSTATE_EXTENSION_PONG"
      ) {
        setVerified(true);
        try {
          localStorage.setItem(STORAGE_KEY_EXTENSION_INSTALLED, "true");
        } catch {}
        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
        }, 1200);
      }
    };

    window.addEventListener("message", handleMessage);

    // Actively ping extension
    try {
      window.postMessage(
        { source: "flowstate-focus-chamber", type: "FLOWSTATE_PING_EXTENSION" },
        "*"
      );
    } catch {}

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [isOpen, onClose, onSuccess]);

  const handleVerify = () => {
    setIsChecking(true);
    // Ping extension
    try {
      window.postMessage(
        { source: "flowstate-focus-chamber", type: "FLOWSTATE_PING_EXTENSION" },
        "*"
      );
    } catch {}

    setTimeout(() => {
      if (isExtensionInstalled()) {
        setVerified(true);
        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
        }, 800);
      } else {
        setIsChecking(false);
      }
    }, 700);
  };

  const handleOpenInstall = () => {
    // Detect browser: if Edge, open Edge store directly; otherwise open CRX guide
    const isEdge =
      typeof navigator !== "undefined" &&
      navigator.userAgent.toLowerCase().includes("edg/");
    if (isEdge) {
      window.open(EDGE_STORE_URL, "_blank", "noopener,noreferrer");
    } else {
      setIsGuideOpen(true);
    }
  };

  return (
    <>
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
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                boxShadow: [
                  "0 25px 60px -15px rgba(0,0,0,0.9), 0 0 25px rgba(16,185,129,0.15)",
                  "0 25px 60px -15px rgba(0,0,0,0.9), 0 0 45px rgba(16,185,129,0.35)",
                  "0 25px 60px -15px rgba(0,0,0,0.9), 0 0 25px rgba(16,185,129,0.15)",
                ],
              }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{
                opacity: { duration: 0.25 },
                scale: { duration: 0.25 },
                y: { duration: 0.25 },
                boxShadow: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
              }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-3xl bg-slate-900/95 border border-emerald-500/35 p-6 sm:p-8 text-center text-slate-100 z-10 overflow-hidden backdrop-blur-2xl"
            >
              {/* Background ambient lighting */}
              <div className="absolute top-0 right-1/4 w-60 h-24 bg-emerald-500/15 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 left-10 w-48 h-24 bg-indigo-500/10 blur-3xl pointer-events-none" />

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Shield Icon with glowing ring */}
              <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-4">
                <ShieldAlert className="w-8 h-8 text-emerald-400 animate-pulse" />
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500" />
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Extension Required
              </h2>

              {/* High-visibility alert requirement card */}
              <div className="my-4 p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 text-slate-200 text-sm sm:text-base leading-relaxed text-center shadow-inner space-y-2">
                <p className="font-bold text-white text-base">
                  To block distracting sites, you must install the FlowState Blocker.
                </p>
                <p className="text-xs text-slate-400 leading-normal">
                  The extension is required to enforce your daily blueprint and lock out distractions. Focus sessions cannot start without it.
                </p>
              </div>

              {/* Verified Success State */}
              {verified ? (
                <div className="py-4 flex flex-col items-center gap-2 text-emerald-400 animate-fade-in">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                    <Check className="w-6 h-6 text-emerald-400" />
                  </div>
                  <span className="text-sm font-bold">Extension Detected! Starting focus session...</span>
                </div>
              ) : (
                <div className="space-y-3 pt-1">
                  {/* Primary CTA: "Click here to install" */}
                  <button
                    type="button"
                    onClick={handleOpenInstall}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm sm:text-base font-extrabold bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 transition-all duration-200 shadow-[0_0_25px_rgba(16,185,129,0.45)] hover:shadow-[0_0_35px_rgba(16,185,129,0.65)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                  >
                    <Download className="w-5 h-5 text-slate-950" />
                    <span>Click here to install</span>
                  </button>

                  {/* Quick-links for specific browsers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <a
                      href={EDGE_STORE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-slate-950/70 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/10 hover:border-emerald-500/40 transition-all cursor-pointer"
                    >
                      <span>Install for Edge (1-Click)</span>
                      <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                    </a>

                    <button
                      type="button"
                      onClick={() => setIsGuideOpen(true)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-slate-950/70 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/10 hover:border-emerald-500/40 transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Get for Chrome / Brave</span>
                    </button>
                  </div>

                  {/* Verification Check & Dismiss */}
                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10 text-xs">
                    <button
                      type="button"
                      onClick={handleVerify}
                      disabled={isChecking}
                      className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors font-medium disabled:opacity-50 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? "animate-spin" : ""}`} />
                      <span>{isChecking ? "Checking..." : "I've installed it, check again"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={onClose}
                      className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sideload Guide Modal for Chrome/Brave */}
      <InstallGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </>
  );
}
