"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  KeyRound,
} from "lucide-react";
import { supabase, getAuthRedirectUrl } from "@/lib/supabase";
import { migrateGuestDataToAuthenticatedUser } from "@/lib/auth-service";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isSendingLink, setIsSendingLink] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  // Reset state on open/close
  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setOtpCode("");
      setIsSendingLink(false);
      setIsVerifyingOtp(false);
      setIsGoogleLoading(false);
      setLinkSent(false);
      setShowOtpInput(false);
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [isOpen]);

  // Handle Magic Link (Email OTP)
  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsSendingLink(true);

    try {
      const redirectUrl = getAuthRedirectUrl();
      const { error } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        throw error;
      }

      setLinkSent(true);
      setShowOtpInput(true);
      setSuccessMessage(`Magic link & 6-digit code sent to ${trimmed}!`);
    } catch (err: any) {
      console.warn("Magic Link send notice:", err);
      setErrorMessage(
        err?.message || "Failed to send magic link. Please check your email and try again."
      );
    } finally {
      setIsSendingLink(false);
    }
  };

  // Handle entering 6-digit OTP code directly
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedCode = otpCode.trim();
    if (!trimmedCode) {
      setErrorMessage("Please enter the verification code sent to your email.");
      return;
    }

    setIsVerifyingOtp(true);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: trimmedCode,
        type: "email",
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        setSuccessMessage("Authenticated! Migrating your guest progress...");

        // Perform guest data migration
        const guestId =
          localStorage.getItem("flowstate_current_guest_id") ||
          localStorage.getItem("flowstate_active_user_id");

        if (guestId && guestId.startsWith("guest_")) {
          await migrateGuestDataToAuthenticatedUser(guestId, data.user.id);
        }

        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
        }, 800);
      }
    } catch (err: any) {
      console.warn("OTP verification notice:", err);
      setErrorMessage(
        err?.message || "Invalid or expired code. Please check your email and try again."
      );
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Handle Google OAuth
  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setIsGoogleLoading(true);

    try {
      const redirectUrl = getAuthRedirectUrl();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        throw error;
      }
    } catch (err: any) {
      console.warn("Google OAuth notice:", err);
      if (
        err?.message?.includes("provider is not enabled") ||
        err?.message?.includes("Unsupported provider")
      ) {
        setErrorMessage(
          "Google OAuth is not configured on this Supabase project. Please use the Magic Link option above."
        );
      } else {
        setErrorMessage(err?.message || "Google sign-in could not be completed. Please try Magic Link.");
      }
      setIsGoogleLoading(false);
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
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl bg-slate-900/95 border border-emerald-500/35 p-6 sm:p-8 text-slate-100 z-10 overflow-hidden backdrop-blur-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_35px_rgba(16,185,129,0.2)]"
          >
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-1/4 w-60 h-24 bg-emerald-500/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 left-10 w-48 h-24 bg-indigo-500/10 blur-3xl pointer-events-none" />

            {/* Close (X) Button inside motion.div so it animates out together */}
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

            {/* Header Icon & Title */}
            <div className="text-center space-y-2 mb-6">
              <div className="relative mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.25)] mb-3">
                <ShieldCheck className="w-7 h-7 text-emerald-400" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Secure your Focus Journey
              </h2>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                Sync your streaks, blueprints, and tasks across all your devices. Zero passwords required.
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-xl bg-red-950/70 border border-red-500/40 text-red-300 text-xs flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span className="flex-1">{errorMessage}</span>
              </motion.div>
            )}

            {/* Success Message */}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="flex-1">{successMessage}</span>
              </motion.div>
            )}

            {/* Magic Link Form */}
            {!linkSent ? (
              <form onSubmit={handleSendMagicLink} className="space-y-3.5">
                <div>
                  <label
                    htmlFor="magic-email"
                    className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5"
                  >
                    Enter your email to get a magic link
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="magic-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@flowstate.app"
                      autoFocus
                      required
                      className="w-full bg-slate-950 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white placeholder:text-slate-600 transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSendingLink || !email.trim()}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-extrabold bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 transition-all duration-200 shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_30px_rgba(16,185,129,0.55)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                  {isSendingLink ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Sending Link...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Link</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* If Magic Link sent: allow clicking link OR entering OTP code directly */
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-1.5">
                  <p className="text-xs font-semibold text-emerald-300">
                    📧 Check your inbox for the magic link!
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Click the link in your email to log in instantly, or enter the 6-digit code below:
                  </p>
                </div>

                {showOtpInput && (
                  <form onSubmit={handleVerifyOtp} className="space-y-3">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="6-digit code (e.g. 123456)"
                        maxLength={10}
                        autoFocus
                        className="w-full bg-slate-950 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white placeholder:text-slate-600 font-mono tracking-widest transition"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isVerifyingOtp || !otpCode.trim()}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-extrabold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)] disabled:opacity-50 cursor-pointer"
                    >
                      {isVerifyingOtp ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Verifying & Migrating...</span>
                        </>
                      ) : (
                        <>
                          <span>Verify & Complete</span>
                          <CheckCircle2 className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setLinkSent(false);
                      setShowOtpInput(false);
                      setOtpCode("");
                    }}
                    className="text-slate-400 hover:text-white transition"
                  >
                    Use different email
                  </button>

                  <button
                    type="button"
                    onClick={handleSendMagicLink}
                    disabled={isSendingLink}
                    className="text-emerald-400 hover:text-emerald-300 font-medium transition"
                  >
                    Resend Link
                  </button>
                </div>
              </div>
            )}

            {/* Visual Divider */}
            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-white/10" />
              <span className="flex-shrink mx-3 text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                Or
              </span>
              <div className="flex-grow border-t border-white/10" />
            </div>

            {/* Continue with Google Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full inline-flex items-center justify-center gap-3 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-slate-950 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer disabled:opacity-50 shadow-sm"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>Continue with Google</span>
            </button>

            {/* Security Guarantee & Legal Footnote */}
            <p className="text-[10px] text-slate-500 text-center mt-5 leading-normal">
              🔒 Encrypted via Supabase Auth. By signing in, you agree to our{" "}
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-slate-400 text-slate-400"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-slate-400 text-slate-400"
              >
                Privacy Policy
              </a>
              .
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
