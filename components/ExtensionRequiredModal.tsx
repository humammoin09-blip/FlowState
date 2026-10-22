"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Download, ExternalLink, X, Check, RefreshCw, AlertCircle } from "lucide-react";
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
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const detectedRef = useRef(false);
  const isCheckingRef = useRef(false);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const checkTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const autoCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Keep isCheckingRef in sync with state
  useEffect(() => {
    isCheckingRef.current = isChecking;
  }, [isChecking]);

  // Reset states and clear active timers when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setIsChecking(false);
      setVerified(false);
      setToastMessage(null);
      detectedRef.current = false;
      if (checkTimeoutRef.current) clearTimeout(checkTimeoutRef.current);
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      if (autoCloseTimeoutRef.current) clearTimeout(autoCloseTimeoutRef.current);
    }
  }, [isOpen]);

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
        detectedRef.current = true;
        try {
          localStorage.setItem(STORAGE_KEY_EXTENSION_INSTALLED, "true");
        } catch {}

        // If not currently in a manual verification check loop, close automatically
        if (!isCheckingRef.current) {
          setVerified(true);
          autoCloseTimeoutRef.current = setTimeout(() => {
            if (onSuccess) onSuccess();
            onClose();
          }, 800);
        }
      }
    };

    window.addEventListener("message", handleMessage);

    // Initial ping to probe extension
    try {
      window.postMessage(
        { source: "flowstate-focus-chamber", type: "FLOWSTATE_PING_EXTENSION" },
        "*"
      );
    } catch {}

    return () => {
      window.removeEventListener("message", handleMessage);
      if (autoCloseTimeoutRef.current) clearTimeout(autoCloseTimeoutRef.current);
    };
  }, [isOpen, onClose, onSuccess]);

  const handleVerify = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (isChecking) return;

    // Reset previous toast and check timers
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    if (checkTimeoutRef.current) clearTimeout(checkTimeoutRef.current);
    if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
    setToastMessage(null);

    // Initial check against storage/DOM flags
    detectedRef.current = isExtensionInstalled();
    setIsChecking(true);

    const ping = () => {
      try {
        window.postMessage(
          { source: "flowstate-focus-chamber", type: "FLOWSTATE_PING_EXTENSION" },
          "*"
        );
      } catch {}
    };

    // Ping immediately and repeatedly during the 2-second check
    ping();
    pingIntervalRef.current = setInterval(ping, 400);

    // Show loading spinner for 2 seconds
    checkTimeoutRef.current = setTimeout(() => {
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = null;
      }
      setIsChecking(false);

      const isDetected = detectedRef.current || isExtensionInstalled();

      if (isDetected) {
        setVerified(true);
        try {
          localStorage.setItem(STORAGE_KEY_EXTENSION_INSTALLED, "true");
        } catch {}
        // Automatically close modal after brief visual confirmation
        autoCloseTimeoutRef.current = setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
        }, 800);
      } else {
        setToastMessage(
          "Extension not detected. Please ensure it is installed and enabled in your browser."
        );
        toastTimeoutRef.current = setTimeout(() => {
          setToastMessage(null);
          toastTimeoutRef.current = null;
        }, 5000);
      }
    }, 2000);
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
      {/* Red Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            role="alert"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[70] max-w-md w-[calc(100%-2rem)] sm:w-auto px-4 py-3 rounded-2xl bg-red-950/95 border border-red-500/50 shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_25px_rgba(239,68,68,0.35)] backdrop-blur-2xl flex items-center gap-3 text-red-200 text-xs sm:text-sm font-semibold pointer-events-auto"
          >
            <div className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0" />
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span className="flex-1 leading-snug">{toastMessage}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setToastMessage(null);
              }}
              className="p-1 rounded-lg text-red-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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
                {/* Background ambient lighting */}
                <div className="absolute top-0 right-1/4 w-60 h-24 bg-emerald-500/15 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 left-10 w-48 h-24 bg-indigo-500/10 blur-3xl pointer-events-none" />

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
                    <div className="flex flex-col gap-2 pt-3 border-t border-white/10 text-xs">
                      <div className="flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={handleVerify}
                          disabled={isChecking}
                          className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                            isChecking
                              ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)] opacity-80 cursor-wait"
                              : "bg-white/5 hover:bg-white/10 text-emerald-400 hover:text-emerald-300 border border-emerald-500/20 hover:border-emerald-500/40"
                          }`}
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? "animate-spin text-emerald-300" : ""}`} />
                          <span>{isChecking ? "Checking for extension..." : "I've installed it, check again"}</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            onClose();
                          }}
                          className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>

                      {/* Small inline red notification if not detected */}
                      {toastMessage && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs text-left"
                        >
                          <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                          <span className="flex-1">{toastMessage}</span>
                        </motion.div>
                      )}
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
