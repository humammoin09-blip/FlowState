"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  AlertTriangle,
  X,
  Globe,
  Loader2,
  RotateCcw,
  ShieldCheck,
  Target,
  Briefcase,
  Layers,
  Calendar,
  Clock,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export interface FocusBlueprintRecord {
  id?: string;
  user_id?: string | null;
  goal: string;
  planned_work: string;
  allowlist: string[];
  session_duration: number;
  created_at?: string;
}

interface FocusBlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (blueprint: FocusBlueprintRecord) => void;
  sessionDuration: number;
  existingAllowlist: string[];
  prefilledBlueprint?: Partial<FocusBlueprintRecord> | null;
}

const STORAGE_KEY_TODAY_BLUEPRINT = "flowstate_today_blueprint";
const STORAGE_KEY_CACHED_BLUEPRINTS = "flowstate_cached_focus_blueprints";

export function FocusBlueprintModal({
  isOpen,
  onClose,
  onConfirm,
  sessionDuration,
  existingAllowlist,
  prefilledBlueprint,
}: FocusBlueprintModalProps) {
  // Wizard state: 1 (Goal), 2 (Planned Work), 3 (Resources/Allowlist)
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [direction, setDirection] = useState<number>(1);

  // Form inputs
  const [goal, setGoal] = useState<string>("");
  const [plannedWork, setPlannedWork] = useState<string>("");
  const [suggestedDomains, setSuggestedDomains] = useState<string[]>([]);
  const [selectedDomains, setSelectedDomains] = useState<Set<string>>(new Set());
  const [customDomainInput, setCustomDomainInput] = useState<string>("");
  const [customInputError, setCustomInputError] = useState<string | null>(null);

  // AI loading state
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const fetchedForSignatureRef = useRef<string>("");

  // Confirmation on Escape / Cancel
  const [showCancelPrompt, setShowCancelPrompt] = useState<boolean>(false);

  // Saved blueprint from earlier today state
  const [todaysBlueprint, setTodaysBlueprint] = useState<FocusBlueprintRecord | null>(null);
  const [showUseTodayPrompt, setShowUseTodayPrompt] = useState<boolean>(false);

  // Submitting state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Check if a blueprint was created earlier today
  const checkTodaysBlueprint = useCallback(async () => {
    try {
      // 1. Check local storage cache
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(STORAGE_KEY_TODAY_BLUEPRINT);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.created_at) {
            const blueprintDate = new Date(parsed.created_at).toDateString();
            const todayDate = new Date().toDateString();
            if (blueprintDate === todayDate && parsed.goal) {
              setTodaysBlueprint(parsed);
              setShowUseTodayPrompt(true);
              return;
            }
          }
        }
      }

      // 2. Query Supabase for most recent blueprint today
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

      const { data, error } = await supabase
        .from("focus_blueprints")
        .select("*")
        .gte("created_at", startOfDay)
        .order("created_at", { ascending: false })
        .limit(1);

      if (!error && data && data.length > 0) {
        const latestToday = data[0];
        setTodaysBlueprint(latestToday);
        setShowUseTodayPrompt(true);
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY_TODAY_BLUEPRINT, JSON.stringify(latestToday));
        }
      }
    } catch {
      // ignore check error
    }
  }, []);

  // Initialize or reset modal state when opened
  useEffect(() => {
    if (isOpen) {
      setShowCancelPrompt(false);
      setIsSubmitting(false);

      if (prefilledBlueprint) {
        // Pre-filled from "Recent Blueprints" reuse or external prompt
        setGoal(prefilledBlueprint.goal || "");
        setPlannedWork(prefilledBlueprint.planned_work || "");
        if (prefilledBlueprint.allowlist && prefilledBlueprint.allowlist.length > 0) {
          setSuggestedDomains(prefilledBlueprint.allowlist);
          setSelectedDomains(new Set(prefilledBlueprint.allowlist));
        }
        setStep(1);
        setShowUseTodayPrompt(false);
      } else {
        // Reset defaults
        setGoal("");
        setPlannedWork("");
        setStep(1);
        setSuggestedDomains([]);
        setSelectedDomains(new Set());
        fetchedForSignatureRef.current = "";
        checkTodaysBlueprint();
      }
    }
  }, [isOpen, prefilledBlueprint, checkTodaysBlueprint]);

  // Handle Escape key listener with confirmation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        e.preventDefault();
        setShowCancelPrompt(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Fetch AI domain suggestions when entering Step 3
  const fetchDomainSuggestions = async (currentGoal: string, currentPlanned: string) => {
    const signature = `${currentGoal}::${currentPlanned}`;
    if (fetchedForSignatureRef.current === signature && suggestedDomains.length > 0) {
      return;
    }

    setIsLoadingAi(true);

    try {
      const res = await fetch("/api/blueprint-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: currentGoal,
          plannedWork: currentPlanned,
        }),
      });

      if (!res.ok) throw new Error("API call failed");

      const data = await res.json();
      const domains: string[] = data?.domains || [
        "youtube.com",
        "google.com",
        "github.com",
        "stackoverflow.com",
      ];

      setSuggestedDomains(domains);
      // All toggleable suggestions ON by default
      setSelectedDomains(new Set(domains));
      fetchedForSignatureRef.current = signature;
    } catch {
      const fallback = [
        "youtube.com",
        "google.com",
        "github.com",
        "stackoverflow.com",
      ];
      setSuggestedDomains(fallback);
      setSelectedDomains(new Set(fallback));
      fetchedForSignatureRef.current = signature;
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Step Navigation handlers
  const handleNextFromStep1 = () => {
    if (!goal.trim()) return;
    setDirection(1);
    setStep(2);
  };

  const handleNextFromStep2 = (skipped = false) => {
    if (skipped) {
      setPlannedWork("");
    } else if (!plannedWork.trim()) {
      return;
    }
    setDirection(1);
    setStep(3);
    fetchDomainSuggestions(goal, skipped ? "" : plannedWork);
  };

  const handleBackToStep1 = () => {
    setDirection(-1);
    setStep(1);
  };

  const handleBackToStep2 = () => {
    setDirection(-1);
    setStep(2);
  };

  // Toggle domain chip ON/OFF
  const toggleDomain = (domain: string) => {
    setSelectedDomains((prev) => {
      const next = new Set(prev);
      if (next.has(domain)) {
        next.delete(domain);
      } else {
        next.add(domain);
      }
      return next;
    });
  };

  // Add custom domain
  const handleAddCustomDomain = () => {
    const raw = customDomainInput.trim().toLowerCase();
    if (!raw) return;

    let cleaned = raw.replace(/^https?:\/\//, "").replace(/^www\./, "");
    cleaned = cleaned.split("/")[0].split("?")[0].split("#")[0].split(":")[0];

    if (!cleaned || (!cleaned.includes(".") && cleaned !== "localhost")) {
      setCustomInputError("Please enter a valid domain (e.g. leetcode.com)");
      return;
    }

    setSuggestedDomains((prev) => {
      if (prev.includes(cleaned)) return prev;
      return [...prev, cleaned];
    });

    setSelectedDomains((prev) => new Set(prev).add(cleaned));
    setCustomDomainInput("");
    setCustomInputError(null);
  };

  // Apply Blueprint and confirm
  const handleConfirmBlueprint = async (customBlueprint?: FocusBlueprintRecord) => {
    setIsSubmitting(true);

    const bpToSave: FocusBlueprintRecord = customBlueprint || {
      goal: goal.trim(),
      planned_work: plannedWork.trim(),
      allowlist: Array.from(selectedDomains),
      session_duration: sessionDuration || 25,
      created_at: new Date().toISOString(),
    };

    // Save to localStorage immediately for offline resilience
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY_TODAY_BLUEPRINT, JSON.stringify(bpToSave));

        const cached = localStorage.getItem(STORAGE_KEY_CACHED_BLUEPRINTS);
        const list: FocusBlueprintRecord[] = cached ? JSON.parse(cached) : [];
        const updatedList = [bpToSave, ...list.filter((b) => b.id !== bpToSave.id)].slice(0, 20);
        localStorage.setItem(STORAGE_KEY_CACHED_BLUEPRINTS, JSON.stringify(updatedList));
      } catch {
        // ignore storage error
      }
    }

    // Save to Supabase focus_blueprints table
    try {
      const { data: authData } = await supabase.auth.getUser();
      const currentUserId = authData?.user?.id || null;

      const { data: inserted, error } = await supabase
        .from("focus_blueprints")
        .insert([
          {
            user_id: currentUserId,
            goal: bpToSave.goal,
            planned_work: bpToSave.planned_work,
            allowlist: bpToSave.allowlist,
            session_duration: bpToSave.session_duration,
          },
        ])
        .select()
        .single();

      const today = new Date().toISOString().split("T")[0];
      if (!error && inserted) {
        bpToSave.id = inserted.id;
        if (typeof window !== "undefined") {
          localStorage.setItem("flowstate_last_blueprint_date", today);
          localStorage.setItem(STORAGE_KEY_TODAY_BLUEPRINT, JSON.stringify(inserted));
        }
      } else if (typeof window !== "undefined") {
        localStorage.setItem("flowstate_last_blueprint_date", today);
        localStorage.setItem(STORAGE_KEY_TODAY_BLUEPRINT, JSON.stringify(bpToSave));
      }
    } catch (err) {
      console.warn("Supabase focus_blueprints save notice (cached locally):", err);
    }

    // Notify parent to start timer, update allowlist, broadcast lockdown, and show toast
    onConfirm(bpToSave);
  };

  // Option: Use today's blueprint directly
  const handleUseTodaysBlueprint = () => {
    if (!todaysBlueprint) return;
    setShowUseTodayPrompt(false);
    handleConfirmBlueprint(todaysBlueprint);
  };

  // Option: Edit today's blueprint in wizard
  const handleEditTodaysBlueprint = () => {
    if (!todaysBlueprint) return;
    setGoal(todaysBlueprint.goal || "");
    setPlannedWork(todaysBlueprint.planned_work || "");
    if (todaysBlueprint.allowlist && todaysBlueprint.allowlist.length > 0) {
      setSuggestedDomains(todaysBlueprint.allowlist);
      setSelectedDomains(new Set(todaysBlueprint.allowlist));
    }
    setShowUseTodayPrompt(false);
    setStep(1);
  };

  // Variants for Framer Motion slide left/right
  const stepVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.25, ease: "easeOut" as const },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -50 : 50,
      opacity: 0,
      transition: { duration: 0.2, ease: "easeIn" as const },
    }),
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className="relative w-full max-w-xl rounded-3xl bg-[#020617] border border-white/10 p-6 sm:p-7 shadow-[0_0_60px_rgba(0,255,136,0.12)] text-slate-100 overflow-hidden"
      >
        {/* Glow Accent Orb */}
        <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-[#00ff88]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88] shadow-[0_0_15px_rgba(0,255,136,0.2)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                  Focus Blueprint
                </h2>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#00ff88]/15 border border-[#00ff88]/30 text-[#00ff88] font-bold">
                  Pre-Session
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Architect your distraction-free deep work session
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowCancelPrompt(true)}
            className="p-1.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
            title="Close Wizard"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cancel Confirmation Prompt */}
        <AnimatePresence>
          {showCancelPrompt && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-4 z-40 rounded-2xl bg-slate-950/95 backdrop-blur-2xl border border-rose-500/40 p-6 flex flex-col justify-center items-center text-center space-y-4 shadow-2xl"
            >
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.25)]">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">
                  Blueprint will not be saved. Cancel session?
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Leaving now will exit the setup wizard and you will not enter the Focus Chamber.
                </p>
              </div>
              <div className="flex items-center gap-3 w-full max-w-xs pt-1">
                <button
                  type="button"
                  onClick={() => setShowCancelPrompt(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 transition-all"
                >
                  Resume Setup
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCancelPrompt(false);
                    onClose();
                  }}
                  className="flex-1 py-2.5 rounded-xl text-xs font-extrabold bg-rose-500 hover:bg-rose-400 text-slate-950 transition-all shadow-lg"
                >
                  Cancel Session
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 'Use Today's Blueprint' Option Screen */}
        <AnimatePresence>
          {showUseTodayPrompt && todaysBlueprint && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="my-5 p-5 rounded-2xl bg-slate-900/90 border border-[#00ff88]/30 space-y-4 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-ping" />
                  <span className="text-xs font-bold text-[#00ff88] uppercase tracking-wider">
                    Blueprint Saved Earlier Today
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {todaysBlueprint.session_duration} mins
                </span>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400">Today&apos;s Active Goal:</p>
                <p className="text-sm font-bold text-white mt-0.5">&ldquo;{todaysBlueprint.goal}&rdquo;</p>
                {todaysBlueprint.planned_work && (
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    <span className="text-slate-500">Work:</span> {todaysBlueprint.planned_work}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Allowlist Domains ({todaysBlueprint.allowlist?.length || 0}):
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto no-scrollbar">
                  {todaysBlueprint.allowlist?.map((d, i) => (
                    <span
                      key={`${d}-${i}`}
                      className="px-2 py-0.5 rounded-md bg-[#00ff88]/10 border border-[#00ff88]/30 text-[10px] font-mono text-[#00ff88]"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleUseTodaysBlueprint}
                  disabled={isSubmitting}
                  className="w-full sm:flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold bg-[#00ff88] hover:bg-[#00ff88]/90 text-[#020617] shadow-[0_0_20px_rgba(0,255,136,0.35)] transition-all flex items-center justify-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Use Today&apos;s Blueprint</span>
                </button>
                <button
                  type="button"
                  onClick={handleEditTodaysBlueprint}
                  className="w-full sm:w-auto py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 transition-colors"
                >
                  Edit / Adjust
                </button>
                <button
                  type="button"
                  onClick={() => setShowUseTodayPrompt(false)}
                  className="w-full sm:w-auto py-2.5 px-3 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Create New
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3-Step Wizard View */}
        {!showUseTodayPrompt && (
          <div className="mt-5 space-y-6">
            {/* 3 Dots Progress Indicator */}
            <div className="flex items-center justify-center gap-6 pb-2">
              {[
                { stepNumber: 1, label: "Goal", icon: Target },
                { stepNumber: 2, label: "Planned Work", icon: Briefcase },
                { stepNumber: 3, label: "Resources", icon: Layers },
              ].map(({ stepNumber, label, icon: StepIcon }) => {
                const isActive = step === stepNumber;
                const isCompleted = step > stepNumber;
                return (
                  <div key={stepNumber} className="flex flex-col items-center gap-1.5">
                    <div
                      className={`relative flex items-center justify-center w-8 h-8 rounded-full text-xs font-black transition-all duration-300 ${
                        isActive
                          ? "bg-[#00ff88] text-[#020617] shadow-[0_0_15px_#00ff88] ring-2 ring-[#00ff88]/40 scale-110"
                          : isCompleted
                          ? "bg-[#00ff88]/20 border border-[#00ff88]/50 text-[#00ff88]"
                          : "bg-slate-900 border border-white/10 text-slate-500"
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : stepNumber}
                    </div>
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                        isActive ? "text-[#00ff88]" : isCompleted ? "text-slate-300" : "text-slate-500"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Wizard Steps Form with Slide Transition */}
            <div className="relative min-h-[260px] overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                {step === 1 && (
                  <motion.div
                    key="step1"
                    custom={direction}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="space-y-4"
                  >
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#00ff88]">
                        Step 1 of 3
                      </span>
                      <h3 className="text-base sm:text-lg font-extrabold text-white mt-0.5">
                        What is your main goal for this session?
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Define a single, unmistakable outcome. This anchors your attention and guards against drifting.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="relative">
                        <textarea
                          rows={3}
                          value={goal}
                          onChange={(e) => setGoal(e.target.value)}
                          placeholder="Complete Chapter 5 of LangGraph tutorial"
                          className="w-full p-3.5 rounded-2xl bg-slate-900/90 border border-white/15 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00ff88] focus:ring-1 focus:ring-[#00ff88] transition-all resize-none shadow-inner"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              if (goal.trim()) handleNextFromStep1();
                            }
                          }}
                        />
                        <span className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-500">
                          {goal.trim().length} chars
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 italic">
                        * Required field. Press Enter or click Next to proceed.
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-slate-400 font-mono">
                        Duration: <strong className="text-[#00ff88]">{sessionDuration}m</strong>
                      </span>
                      <button
                        type="button"
                        onClick={handleNextFromStep1}
                        disabled={!goal.trim()}
                        className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                          goal.trim()
                            ? "bg-[#00ff88] hover:bg-[#00ff88]/90 text-[#020617] shadow-[0_0_20px_rgba(0,255,136,0.35)] active:scale-95 cursor-pointer"
                            : "bg-slate-900 border border-white/10 text-slate-600 cursor-not-allowed"
                        }`}
                      >
                        <span>Next: Planned Work</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    custom={direction}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="space-y-4"
                  >
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#00ff88]">
                        Step 2 of 3
                      </span>
                      <h3 className="text-base sm:text-lg font-extrabold text-white mt-0.5">
                        What will you work on?
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Break down the specific actions, videos, or tools you need to engage with.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <textarea
                        rows={3}
                        value={plannedWork}
                        onChange={(e) => setPlannedWork(e.target.value)}
                        placeholder="Watch YouTube lectures, solve LeetCode problems, debug in VS Code"
                        className="w-full p-3.5 rounded-2xl bg-slate-900/90 border border-white/15 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00ff88] focus:ring-1 focus:ring-[#00ff88] transition-all resize-none shadow-inner"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            if (plannedWork.trim()) handleNextFromStep2(false);
                          }
                        }}
                      />
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Specify your tools or click Skip to proceed</span>
                        <span className="font-mono">{plannedWork.trim().length} chars</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={handleBackToStep1}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 transition-colors flex items-center gap-1.5"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleNextFromStep2(true)}
                          className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
                        >
                          Skip
                        </button>
                        <button
                          type="button"
                          onClick={() => handleNextFromStep2(false)}
                          disabled={!plannedWork.trim()}
                          className={`px-5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                            plannedWork.trim()
                              ? "bg-[#00ff88] hover:bg-[#00ff88]/90 text-[#020617] shadow-[0_0_20px_rgba(0,255,136,0.35)] active:scale-95 cursor-pointer"
                              : "bg-slate-900 border border-white/10 text-slate-600 cursor-not-allowed"
                          }`}
                        >
                          <span>Next: Resources</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    custom={direction}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#00ff88]">
                          Step 3 of 3 • Resources Needed
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-white mt-1 leading-snug">
                        Based on your goal, here are the sites/tools I recommend. Add or remove any:
                      </p>
                    </div>

                    {/* AI Loading State */}
                    {isLoadingAi ? (
                      <div className="py-8 flex flex-col items-center justify-center space-y-2.5 text-center">
                        <Loader2 className="w-6 h-6 animate-spin text-[#00ff88]" />
                        <p className="text-xs font-medium text-slate-300">
                          AI Focus Coach is analyzing your goal & selecting essential sites...
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Domain Suggestions Chips */}
                        <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span>Toggle allowed domains (ON by default):</span>
                            <span className="font-mono text-[#00ff88] font-bold">
                              {selectedDomains.size} permitted
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
                            {suggestedDomains.map((domain) => {
                              const isChecked = selectedDomains.has(domain);
                              return (
                                <button
                                  key={domain}
                                  type="button"
                                  onClick={() => toggleDomain(domain)}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1.5 border ${
                                    isChecked
                                      ? "bg-[#00ff88]/20 border-[#00ff88]/60 text-[#00ff88] shadow-[0_0_12px_rgba(0,255,136,0.25)]"
                                      : "bg-slate-950/70 border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-300"
                                  }`}
                                >
                                  <div
                                    className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] ${
                                      isChecked ? "bg-[#00ff88] text-[#020617]" : "border border-slate-600"
                                    }`}
                                  >
                                    {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                  </div>
                                  <span>{domain}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Custom Domain Input */}
                        <div className="space-y-1">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={customDomainInput}
                              onChange={(e) => {
                                setCustomDomainInput(e.target.value);
                                setCustomInputError(null);
                              }}
                              placeholder="Add custom domain (e.g. docs.python.org)"
                              className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00ff88]"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddCustomDomain();
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={handleAddCustomDomain}
                              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1 shrink-0"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add</span>
                            </button>
                          </div>
                          {customInputError && (
                            <p className="text-[11px] text-amber-400 font-medium pl-1">
                              {customInputError}
                            </p>
                          )}
                        </div>

                        {/* Prominent Warning Banner */}
                        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5 shadow-md">
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <p className="leading-snug">
                            <strong>⚠️ Everything else will be BLOCKED during this session.</strong> Make sure you&apos;ve added all sites you need.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Footer Action Buttons */}
                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={handleBackToStep2}
                        disabled={isSubmitting}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 transition-colors flex items-center gap-1.5"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleConfirmBlueprint()}
                        disabled={isSubmitting || selectedDomains.size === 0}
                        className={`px-6 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-xl ${
                          selectedDomains.size > 0 && !isSubmitting
                            ? "bg-gradient-to-r from-[#00ff88] to-emerald-400 text-[#020617] shadow-[0_0_25px_rgba(0,255,136,0.4)] hover:brightness-110 active:scale-95 cursor-pointer"
                            : "bg-slate-900 border border-white/10 text-slate-600 cursor-not-allowed"
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-[#020617]" />
                            <span>Locking In...</span>
                          </>
                        ) : (
                          <>
                            <Target className="w-4 h-4" />
                            <span>Confirm & Start Focus 🎯</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
