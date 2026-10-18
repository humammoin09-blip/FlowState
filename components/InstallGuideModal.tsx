"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Download, ExternalLink, Puzzle, Terminal } from "lucide-react";

export const CRX_DOWNLOAD_URL =
  "https://github.com/humammoin09-blip/Momentum-AI/releases/latest/download/extension.crx";

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InstallGuideModal({ isOpen, onClose }: InstallGuideModalProps) {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

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

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedUrl(text);
      setTimeout(() => setCopiedUrl(null), 2000);
    }
  };

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
            className="relative w-full max-w-xl rounded-3xl bg-slate-900/95 border border-white/10 p-6 sm:p-7 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_25px_rgba(16,185,129,0.08)] backdrop-blur-2xl text-slate-100 z-10 overflow-hidden"
          >
            {/* Ambient emerald & indigo glow in modal */}
            <div className="absolute top-0 right-1/4 w-56 h-20 bg-emerald-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 left-10 w-44 h-24 bg-indigo-500/10 blur-3xl pointer-events-none" />

            {/* Close (X) Button */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3.5 mb-6 pr-8">
              <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)] shrink-0">
                <Puzzle className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  Install for Chrome, Brave, or Edge
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Follow these simple steps to install the FlowState Blocker extension
                </p>
              </div>
            </div>

            {/* Steps Container */}
            <div className="space-y-4 mb-6">
              {/* Step 1 */}
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-white/5">
                <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold shrink-0 mt-0.5">
                  1
                </div>
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Click the button below to download the extension file (<code className="px-1.5 py-0.5 rounded-md bg-emerald-950/60 text-emerald-300 font-mono text-xs border border-emerald-500/30">extension.crx</code>).
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-white/5">
                <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold shrink-0 mt-0.5">
                  2
                </div>
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed flex-1">
                  <div>Open your browser&apos;s extension page:</div>
                  <div className="mt-2.5 space-y-2">
                    {/* Chrome */}
                    <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-900/80 border border-white/5">
                      <span className="text-xs text-slate-400">
                        <strong className="text-slate-200">For Chrome:</strong> Type <code className="text-emerald-400 font-mono px-1">chrome://extensions</code> in the URL bar.
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard("chrome://extensions")}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition shrink-0"
                        title="Copy URL"
                      >
                        {copiedUrl === "chrome://extensions" ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Brave */}
                    <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-900/80 border border-white/5">
                      <span className="text-xs text-slate-400">
                        <strong className="text-slate-200">For Brave:</strong> Type <code className="text-emerald-400 font-mono px-1">brave://extensions</code> in the URL bar.
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard("brave://extensions")}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition shrink-0"
                        title="Copy URL"
                      >
                        {copiedUrl === "brave://extensions" ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Edge */}
                    <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-900/80 border border-white/5">
                      <span className="text-xs text-slate-400">
                        <strong className="text-slate-200">For Edge:</strong> Type <code className="text-emerald-400 font-mono px-1">edge://extensions</code> in the URL bar.
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard("edge://extensions")}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition shrink-0"
                        title="Copy URL"
                      >
                        {copiedUrl === "edge://extensions" ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-white/5">
                <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold shrink-0 mt-0.5">
                  3
                </div>
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Turn ON <strong className="text-slate-100">&apos;Developer mode&apos;</strong> (toggle located in the top right corner).
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-white/5">
                <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold shrink-0 mt-0.5">
                  4
                </div>
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Drag and drop the downloaded <code className="px-1.5 py-0.5 rounded-md bg-emerald-950/60 text-emerald-300 font-mono text-xs border border-emerald-500/30">extension.crx</code> file directly onto the page.
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-white/5">
                <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold shrink-0 mt-0.5">
                  5
                </div>
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Click <strong className="text-slate-100">&apos;Add extension&apos;</strong> when prompted.
                </div>
              </div>
            </div>

            {/* Prominent Action Button: Download .crx File */}
            <div className="pt-2">
              <a
                href={CRX_DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all duration-200 shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_30px_rgba(16,185,129,0.55)] hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>📥 Download .crx File</span>
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
