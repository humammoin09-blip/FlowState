"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Download, X, ShieldAlert, Sparkles } from "lucide-react";
import { InstallGuideModal } from "./InstallGuideModal";

export const STORAGE_KEY_EXTENSION_INSTALLED = "flowstate_extension_installed";
export const STORAGE_KEY_BANNER_DISMISSED = "flowstate_extension_banner_dismissed";

export const EDGE_STORE_URL =
  "https://microsoftedge.microsoft.com/addons/detail/flowstate-blocker/ofphnidnpdfbfkgakpglbjiogolfebac";
export const CHROME_CRX_URL =
  "https://github.com/humammoin09-blip/Momentum-AI/releases/latest/download/extension.crx";

/**
 * Global helper to check if FlowState extension is installed
 */
export function isExtensionInstalled(): boolean {
  if (typeof window === "undefined") return false;

  // 1. Check local storage flag
  if (localStorage.getItem(STORAGE_KEY_EXTENSION_INSTALLED) === "true") {
    return true;
  }

  // 2. Check DOM attribute set by content script
  if (
    document.documentElement.getAttribute("data-flowstate-extension-installed") ===
    "true"
  ) {
    try {
      localStorage.setItem(STORAGE_KEY_EXTENSION_INSTALLED, "true");
    } catch {}
    return true;
  }

  return false;
}

export { ExtensionRequiredModal } from "./ExtensionRequiredModal";

interface InstallExtensionBannerProps {
  className?: string;
}

export function InstallExtensionBanner({ className = "" }: InstallExtensionBannerProps) {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);

  const checkStatus = useCallback(() => {
    if (typeof window === "undefined") return;

    // 1. Check local storage flags
    const installed = isExtensionInstalled();
    const dismissed = localStorage.getItem(STORAGE_KEY_BANNER_DISMISSED) === "true";

    if (installed) setIsInstalled(true);
    if (dismissed) setIsDismissed(true);
  }, []);

  useEffect(() => {
    setIsMounted(true);
    checkStatus();

    // 3. Listen for window.postMessage from extension content script
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;

      const { source, type } = event.data;
      if (
        source === "flowstate-extension" ||
        type === "FLOWSTATE_EXTENSION_HEARTBEAT" ||
        type === "FLOWSTATE_EXTENSION_PONG"
      ) {
        setIsInstalled(true);
        try {
          localStorage.setItem(STORAGE_KEY_EXTENSION_INSTALLED, "true");
        } catch {}
      }
    };

    window.addEventListener("message", handleMessage);

    // 4. Actively ping extension bridge to verify presence
    try {
      window.postMessage(
        {
          source: "flowstate-focus-chamber",
          type: "FLOWSTATE_PING_EXTENSION",
        },
        "*"
      );
    } catch {}

    // Check again after a short delay in case extension content script injects async
    const timer = setTimeout(() => {
      checkStatus();
      try {
        window.postMessage(
          {
            source: "flowstate-focus-chamber",
            type: "FLOWSTATE_PING_EXTENSION",
          },
          "*"
        );
      } catch {}
    }, 1000);

    return () => {
      window.removeEventListener("message", handleMessage);
      clearTimeout(timer);
    };
  }, [checkStatus]);

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY_BANNER_DISMISSED, "true");
    } catch {}
  };

  // Do not render if not mounted yet (SSR safe)
  if (!isMounted) {
    return null;
  }

  // If installed or dismissed, but modal is currently open, still show the modal
  if (isInstalled || isDismissed) {
    return (
      <InstallGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    );
  }

  return (
    <>
      <AnimatePresence>
        <div className="relative group">
          {/* Subtle Outer Glowing/Pulsing Aura */}
          <motion.div
            animate={{
              opacity: [0.35, 0.75, 0.35],
              scale: [0.995, 1.008, 0.995],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-emerald-500/40 via-teal-400/50 to-emerald-500/40 blur-sm pointer-events-none -z-10"
          />

          {/* Main Banner with Glowing/Pulsing Border Animation */}
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.99 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              borderColor: [
                "rgba(16, 185, 129, 0.4)",
                "rgba(16, 185, 129, 0.95)",
                "rgba(52, 211, 153, 0.95)",
                "rgba(16, 185, 129, 0.4)",
              ],
              boxShadow: [
                "0 0 0 1px rgba(16, 185, 129, 0.3), 0 0 20px rgba(16, 185, 129, 0.15), 0 10px 35px rgba(0,0,0,0.5)",
                "0 0 0 2px rgba(16, 185, 129, 0.8), 0 0 40px rgba(16, 185, 129, 0.45), 0 10px 35px rgba(0,0,0,0.5)",
                "0 0 0 2.5px rgba(52, 211, 153, 0.9), 0 0 50px rgba(16, 185, 129, 0.55), 0 10px 35px rgba(0,0,0,0.5)",
                "0 0 0 1px rgba(16, 185, 129, 0.3), 0 0 20px rgba(16, 185, 129, 0.15), 0 10px 35px rgba(0,0,0,0.5)",
              ],
            }}
            exit={{ opacity: 0, y: -8, height: 0, margin: 0, padding: 0 }}
            transition={{
              opacity: { duration: 0.25, ease: "easeOut" },
              y: { duration: 0.25, ease: "easeOut" },
              scale: { duration: 0.25, ease: "easeOut" },
              borderColor: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
              boxShadow: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
            }}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900/95 via-slate-900/90 to-slate-950/95 border p-4 sm:p-5 backdrop-blur-xl ${className}`}
          >
            {/* Subtle glowing backdrop accents */}
            <div className="absolute top-0 right-1/4 w-64 h-24 bg-emerald-500/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-8 left-12 w-48 h-20 bg-emerald-600/10 blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Left Column: Pulsing Icon + Bold Attention Headline */}
              <div className="flex items-start sm:items-center gap-3.5 min-w-0 pr-8 md:pr-0">
                {/* Glowing Pulse Shield Icon */}
                <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-emerald-500/20 border border-emerald-500/40 text-emerald-400 shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.35)] mt-0.5 sm:mt-0">
                  <ShieldAlert className="w-5 h-5 text-emerald-400 animate-pulse" />
                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500" />
                  </span>
                </div>

                {/* Banner Text Message */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.25)]">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Required Setup • Blocker Inactive</span>
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white tracking-tight">
                    FlowState Blocker is not installed.{" "}
                    <span className="text-slate-300 font-normal">
                      Install the browser extension to activate distraction blocking during focus sessions.
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Action Buttons & Dismiss 'X' Button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 w-full md:w-auto shrink-0">
                {/* Install for Edge */}
                <a
                  href={EDGE_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 transition-all duration-200 shadow-[0_0_20px_rgba(16,185,129,0.45)] hover:shadow-[0_0_28px_rgba(16,185,129,0.65)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <span>Install for Edge</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {/* Get for Chrome/Brave (opens step-by-step install guide modal) */}
                <button
                  type="button"
                  onClick={() => setIsGuideModalOpen(true)}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-extrabold bg-slate-950/80 hover:bg-slate-900 text-emerald-300 hover:text-emerald-200 border border-emerald-500/40 hover:border-emerald-400 transition-all duration-200 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Get for Chrome/Brave</span>
                </button>

                {/* Manual Dismiss 'X' Button */}
                <button
                  onClick={handleDismiss}
                  aria-label="Dismiss extension banner"
                  title="Dismiss banner"
                  className="absolute top-3 right-3 md:static p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Chrome/Brave/Edge Sideload Guide Modal */}
      <InstallGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </>
  );
}

