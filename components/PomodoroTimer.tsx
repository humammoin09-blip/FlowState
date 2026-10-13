"use client";

import { supabase } from "@/lib/supabase";
import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Headphones,
  Sparkles,
  Timer,
  SlidersHorizontal,
  AlertTriangle,
  Lock,
  ShieldAlert,
  ShieldCheck,
  Maximize2,
  Minimize2,
  Globe,
  Check,
  Plus,
  Trash2,
  X,
  RefreshCw,
} from "lucide-react";
import { PanicButton } from "@/components/PanicButton";
import { PanicInterventionModal } from "@/components/PanicInterventionModal";

export type TimerMode = "focus" | "shortBreak" | "longBreak";

export interface AllowedDomainItem {
  domain: string;
  isDefault?: boolean;
}

export interface WarningHistoryEntry {
  id: string;
  timestamp: number;
  awaySeconds: number;
  status: "working_approved" | "distracted_flagged";
  domain?: string;
}

export interface WarningState {
  count: number;
  lastTriggeredAt: number | null;
  history: WarningHistoryEntry[];
}

export interface SmartAlertState {
  isOpen: boolean;
  awaySeconds: number;
  suggestedDomain: string;
  isExternalApp?: boolean;
}

export interface AwayToastState {
  isOpen: boolean;
  awaySeconds: number;
}

interface PomodoroTimerProps {
  timerActive: boolean;
  setTimerActive: (active: boolean) => void;
  timerTime: string;
  setTimerTime: (time: string) => void;
  onFocusComplete?: () => void;
}

const STORAGE_KEY_TARGET_END_TIME = "flowstate_pomodoro_target_end_time";
const STORAGE_KEY_RUNNING = "flowstate_pomodoro_running";
const STORAGE_KEY_MODE = "flowstate_pomodoro_mode";
const STORAGE_KEY_REMAINING = "flowstate_pomodoro_remaining";
const STORAGE_KEY_COMPLETED_SESSIONS = "flowstate_pomodoro_completed_sessions";
const STORAGE_KEY_FOCUS_DURATION = "flowstate_pomodoro_focus_duration_mins";
const STORAGE_KEY_ALLOWED_DOMAINS = "flowstate_pomodoro_allowed_domains";
const STORAGE_KEY_BLOCKED_PATHS = "flowstate_pomodoro_blocked_paths";
const STORAGE_KEY_WARNING_STATE = "flowstate_pomodoro_warning_state";
const STORAGE_KEY_GRACE_PERIOD = "flowstate_pomodoro_grace_period_secs";

export const DEFAULT_GRACE_PERIOD_SECS = 10;
export const DEFAULT_ALLOWED_DOMAINS: string[] = ["localhost", "youtube.com"];
export const DEFAULT_BLOCKED_PATHS: string[] = [
  "/shorts",
  "/shorts/*",
  "youtube.com/shorts",
  "youtube.com/shorts/*",
];

/**
 * Normalizes a hostname or domain string:
 * - Trims whitespace and lowercases
 * - Strips protocol (http://, https://)
 * - Strips paths, queries, and hash fragments
 * - Strips port numbers (:3000)
 * - Strips leading 'www.' (e.g. 'www.youtube.com' -> 'youtube.com')
 */
export function normalizeDomain(input: string): string {
  if (!input) return "";
  let cleaned = input.trim().toLowerCase();
  cleaned = cleaned.replace(/^https?:\/\//, "");
  cleaned = cleaned.split("/")[0].split("?")[0].split("#")[0];
  cleaned = cleaned.split(":")[0];
  cleaned = cleaned.replace(/^www\./, "");
  return cleaned;
}

// Backward-compatible alias
export const sanitizeDomain = normalizeDomain;

/**
 * Normalizes a pathname:
 * - Trims and lowercases
 * - Ensures a leading slash
 * - Strips trailing query and hash fragments
 */
export function normalizePathname(input: string): string {
  if (!input) return "/";
  let cleaned = input.trim().toLowerCase();
  cleaned = cleaned.split("?")[0].split("#")[0];
  if (!cleaned.startsWith("/")) {
    cleaned = "/" + cleaned;
  }
  return cleaned;
}

/**
 * Checks if a normalized hostname is in the allowed domains array.
 * Matches exact hostname or subdomains (e.g., 'docs.github.com' matches 'github.com').
 */
export function isDomainAllowed(
  hostname: string,
  allowedDomains: string[]
): boolean {
  if (!hostname || !allowedDomains || allowedDomains.length === 0) return false;
  const normHost = normalizeDomain(hostname);
  if (!normHost) return false;

  return allowedDomains.some((item) => {
    const normAllowed = normalizeDomain(item);
    if (!normAllowed) return false;
    return normHost === normAllowed || normHost.endsWith("." + normAllowed);
  });
}

/**
 * Checks if a URL matches any pattern in the blockedPaths array.
 * Supports patterns such as:
 * - "/shorts" or "/shorts/*"
 * - "youtube.com/shorts" or "youtube.com/shorts/*"
 */
export function isPathBlocked(
  hostname: string,
  pathname: string,
  blockedPaths: string[]
): boolean {
  if (!blockedPaths || blockedPaths.length === 0) return false;
  const normHost = normalizeDomain(hostname);
  const normPath = normalizePathname(pathname);

  return blockedPaths.some((raw) => {
    if (!raw) return false;
    let pattern = raw.trim().toLowerCase();
    if (!pattern) return false;

    pattern = pattern.replace(/^https?:\/\//, "");

    const slashIdx = pattern.indexOf("/");
    if (slashIdx > 0) {
      const patternDomain = normalizeDomain(pattern.slice(0, slashIdx));
      const patternSubpath = normalizePathname(pattern.slice(slashIdx));

      if (patternDomain) {
        const domainMatches =
          normHost === patternDomain || normHost.endsWith("." + patternDomain);
        if (!domainMatches) return false;
      }
      return matchPathPattern(normPath, patternSubpath);
    } else {
      const patternSubpath = normalizePathname(pattern);
      return matchPathPattern(normPath, patternSubpath);
    }
  });
}

function matchPathPattern(actualPath: string, patternPath: string): boolean {
  if (patternPath.endsWith("/*")) {
    const base = patternPath.slice(0, -2);
    return actualPath === base || actualPath.startsWith(base + "/") || actualPath.startsWith(base);
  }
  if (patternPath.endsWith("*")) {
    const base = patternPath.slice(0, -1);
    return actualPath.startsWith(base);
  }
  return actualPath === patternPath || actualPath.startsWith(patternPath + "/");
}

/**
 * Resolves the primary host of the running FlowState application.
 * Dynamically resolves window.location.hostname in browser or parses NEXT_PUBLIC_APP_URL.
 */
export function getAppHostname(): string {
  if (typeof window !== "undefined" && window.location?.hostname) {
    return normalizeDomain(window.location.hostname);
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    try {
      return normalizeDomain(new URL(process.env.NEXT_PUBLIC_APP_URL).hostname);
    } catch {}
  }
  return "localhost";
}

/**
 * Extension Bridge: broadcasts Focus Chamber state updates to browser extensions.
 * Uses window.location.origin directly for target origin — works across localhost and production.
 */
export function broadcastExtensionMessage(type: string, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || !window.location?.origin) return;
  try {
    window.postMessage(
      {
        source: "flowstate-focus-chamber",
        type,
        payload,
        timestamp: Date.now(),
      },
      window.location.origin
    );
  } catch (err) {
    console.debug("Extension bridge postMessage notice:", err);
  }
}

/**
 * Combined check: returns true if the hostname is allowlisted AND the path is not blocked.
 * The running app's own hostname is dynamically recognized across localhost and production domains.
 */
export function isUrlAllowed(
  hostname: string,
  pathname: string,
  allowedDomains: string[],
  blockedPaths: string[]
): boolean {
  const normHost = normalizeDomain(hostname);
  const currentAppHost = getAppHostname();

  const isHostPermitted =
    normHost === currentAppHost ||
    normHost === "localhost" ||
    normHost === "127.0.0.1" ||
    isDomainAllowed(normHost, allowedDomains);

  return (
    isHostPermitted &&
    !isPathBlocked(normHost, pathname, blockedPaths)
  );
}

export function PomodoroTimer({
  timerActive,
  setTimerActive,
  timerTime,
  setTimerTime,
  onFocusComplete,
}: PomodoroTimerProps) {
  // Custom focus duration in minutes (default: 25)
  const [customFocusMins, setCustomFocusMins] = useState<number>(25);
  const [showCustomDuration, setShowCustomDuration] = useState<boolean>(false);
  const [pendingModeSwitch, setPendingModeSwitch] = useState<TimerMode | null>(null);

  const modeDurations: Record<TimerMode, number> = useMemo(
    () => ({
      focus: customFocusMins * 60,
      shortBreak: 5 * 60,
      longBreak: 15 * 60,
    }),
    [customFocusMins]
  );

  const [mode, setMode] = useState<TimerMode>("focus");
  const [timeLeft, setTimeLeft] = useState<number>(modeDurations.focus);
  const [completedSessions, setCompletedSessions] = useState(2);
  const [selectedSound, setSelectedSound] = useState<string>("Rain");
  const [soundPlaying, setSoundPlaying] = useState(false);

  // Focus Lockdown & Distraction Deterrent states
  const [distractionCount, setDistractionCount] = useState<number>(0);
  const [showDistractionOverlay, setShowDistractionOverlay] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const chamberRef = useRef<HTMLDivElement>(null);

  // Smart Allowlist & Grace Period states
  const [allowedDomains, setAllowedDomains] = useState<string[]>(DEFAULT_ALLOWED_DOMAINS);
  const [blockedPaths, setBlockedPaths] = useState<string[]>(DEFAULT_BLOCKED_PATHS);
  const [showAllowlistModal, setShowAllowlistModal] = useState<boolean>(false);
  const [newDomainInput, setNewDomainInput] = useState<string>("");
  const [newBlockedPathInput, setNewBlockedPathInput] = useState<string>("");
  const [allowlistFeedback, setAllowlistFeedback] = useState<string | null>(null);

  // Warning state
  const [warningState, setWarningState] = useState<WarningState>({
    count: 0,
    lastTriggeredAt: null,
    history: [],
  });

  // Configurable Away Grace Period state (default 10s)
  const [gracePeriodSecs, setGracePeriodSecs] = useState<number>(DEFAULT_GRACE_PERIOD_SECS);
  const gracePeriodRef = useRef<number>(DEFAULT_GRACE_PERIOD_SECS);

  // Non-blocking Away Toast state
  const [awayToastState, setAwayToastState] = useState<AwayToastState>({
    isOpen: false,
    awaySeconds: 0,
  });
  const awayToastTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Smart Alert state (retained for backward compatibility)
  const [smartAlertState, setSmartAlertState] = useState<SmartAlertState>({
    isOpen: false,
    awaySeconds: 0,
    suggestedDomain: "External Application",
    isExternalApp: true,
  });

  // Friction-based Panic Button & AI Intervention modal state
  const [showPanicModal, setShowPanicModal] = useState<boolean>(false);

  const graceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const awayTimestampRef = useRef<number | null>(null);
  const timerActiveRef = useRef<boolean>(timerActive);
  const modeRef = useRef<TimerMode>(mode);

  const allowedDomainsRef = useRef<string[]>(allowedDomains);
  const blockedPathsRef = useRef<string[]>(blockedPaths);

  useEffect(() => {
    gracePeriodRef.current = gracePeriodSecs;
  }, [gracePeriodSecs]);

  useEffect(() => {
    timerActiveRef.current = timerActive;
  }, [timerActive]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    allowedDomainsRef.current = allowedDomains;
  }, [allowedDomains]);

  useEffect(() => {
    blockedPathsRef.current = blockedPaths;
  }, [blockedPaths]);

  const isCompletingRef = useRef(false);
  const notifiedTimesRef = useRef<Set<number>>(new Set());

  // Load custom focus duration, allowed domains, blocked paths, and warning state on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedCustom = localStorage.getItem(STORAGE_KEY_FOCUS_DURATION);
    if (savedCustom) {
      const parsed = parseInt(savedCustom, 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 120) {
        setCustomFocusMins(parsed);
      }
    }

    // Load Allowed Domains (defaults to localhost & youtube.com)
    try {
      const savedDomains = localStorage.getItem(STORAGE_KEY_ALLOWED_DOMAINS);
      if (savedDomains) {
        const parsed = JSON.parse(savedDomains);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAllowedDomains(parsed);
          allowedDomainsRef.current = parsed;
        } else {
          localStorage.setItem(STORAGE_KEY_ALLOWED_DOMAINS, JSON.stringify(DEFAULT_ALLOWED_DOMAINS));
        }
      } else {
        localStorage.setItem(STORAGE_KEY_ALLOWED_DOMAINS, JSON.stringify(DEFAULT_ALLOWED_DOMAINS));
      }
    } catch {
      setAllowedDomains(DEFAULT_ALLOWED_DOMAINS);
    }

    // Load Blocked Paths (defaults to /shorts, youtube.com/shorts/*)
    try {
      const savedBlocked = localStorage.getItem(STORAGE_KEY_BLOCKED_PATHS);
      if (savedBlocked) {
        const parsed = JSON.parse(savedBlocked);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBlockedPaths(parsed);
          blockedPathsRef.current = parsed;
        } else {
          localStorage.setItem(STORAGE_KEY_BLOCKED_PATHS, JSON.stringify(DEFAULT_BLOCKED_PATHS));
        }
      } else {
        localStorage.setItem(STORAGE_KEY_BLOCKED_PATHS, JSON.stringify(DEFAULT_BLOCKED_PATHS));
      }
    } catch {
      setBlockedPaths(DEFAULT_BLOCKED_PATHS);
    }

    // Load Warning State
    try {
      const savedWarnings = localStorage.getItem(STORAGE_KEY_WARNING_STATE);
      if (savedWarnings) {
        const parsed: WarningState = JSON.parse(savedWarnings);
        if (parsed && typeof parsed.count === "number") {
          setWarningState(parsed);
          setDistractionCount(parsed.count);
        }
      }
    } catch {
      // ignore
    }

    // Load Grace Period Setting (defaults to 10s)
    try {
      const savedGrace = localStorage.getItem(STORAGE_KEY_GRACE_PERIOD);
      if (savedGrace) {
        const parsedGrace = parseInt(savedGrace, 10);
        if (!isNaN(parsedGrace) && parsedGrace >= 1 && parsedGrace <= 300) {
          setGracePeriodSecs(parsedGrace);
          gracePeriodRef.current = parsedGrace;
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }, []);

  const handleTimerCompletion = useCallback((currentMode: TimerMode) => {
    if (isCompletingRef.current) return;
    isCompletingRef.current = true;

    setTimerActive(false);
    localStorage.setItem(STORAGE_KEY_RUNNING, "false");
    localStorage.removeItem(STORAGE_KEY_TARGET_END_TIME);

    const defaultDuration = modeDurations[currentMode];
    localStorage.setItem(STORAGE_KEY_REMAINING, String(defaultDuration));
    setTimeLeft(defaultDuration);
    setTimerTime(formatTime(defaultDuration));
    setShowDistractionOverlay(false);
    setAwayToastState({ isOpen: false, awaySeconds: 0 });
    if (awayToastTimerRef.current) {
      clearTimeout(awayToastTimerRef.current);
      awayToastTimerRef.current = null;
    }
    setSmartAlertState({ isOpen: false, awaySeconds: 0, suggestedDomain: "External Application", isExternalApp: true });
    if (graceTimerRef.current) {
      clearTimeout(graceTimerRef.current);
      graceTimerRef.current = null;
    }
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("flowstate_tab_wandered_alert");
      sessionStorage.removeItem("flowstate_away_timestamp");
      sessionStorage.removeItem("flowstate_smart_alert_due");
    }

    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      new Notification("FlowState Focus Complete! 🎯", {
        body: "Great job! Your focus session is complete.",
        icon: "/favicon.ico",
      });
    }

    if (currentMode === "focus") {
      setCompletedSessions((prev) => {
        const next = Math.min(prev + 1, 4);
        localStorage.setItem(STORAGE_KEY_COMPLETED_SESSIONS, String(next));
        return next;
      });

      const sessionMins = customFocusMins || 25;
      const newSessionRecord = {
        duration_minutes: sessionMins,
        mode: "focus",
        created_at: new Date().toISOString(),
      };

      // Always cache in localStorage for robust offline persistence
      if (typeof window !== "undefined") {
        try {
          const cached = localStorage.getItem("flowstate_cached_focus_sessions");
          const existing = cached ? JSON.parse(cached) : [];
          existing.unshift(newSessionRecord);
          localStorage.setItem("flowstate_cached_focus_sessions", JSON.stringify(existing.slice(0, 100)));
        } catch {
          // ignore cache error
        }
      }

      (async () => {
        try {
          const { error } = await supabase
            .from("focus_sessions")
            .insert([
              {
                duration_minutes: sessionMins,
                mode: "focus",
              },
            ]);
          if (error) console.warn("Supabase focus session sync notice (saved to local cache):", error);
        } catch (err) {
          console.warn("Offline/Network notice saving focus session:", err);
        }
      })();

      if (onFocusComplete) onFocusComplete();
    }

    setTimeout(() => {
      isCompletingRef.current = false;
    }, 1000);
  }, [customFocusMins, modeDurations, onFocusComplete, setTimerActive, setTimerTime]);

  const syncStateFromStorage = useCallback(() => {
    if (typeof window === "undefined") return;

    const savedMode = (localStorage.getItem(STORAGE_KEY_MODE) as TimerMode) || "focus";
    const savedRunning = localStorage.getItem(STORAGE_KEY_RUNNING) === "true";
    const savedTargetEndTime = localStorage.getItem(STORAGE_KEY_TARGET_END_TIME);
    const savedRemaining = localStorage.getItem(STORAGE_KEY_REMAINING);
    const savedCompleted = localStorage.getItem(STORAGE_KEY_COMPLETED_SESSIONS);
    const savedSound = localStorage.getItem("flowstate_active_soundscape");
    const savedSoundPlaying = localStorage.getItem("flowstate_soundscape_playing") === "true";

    if (savedSound) {
      setSelectedSound(savedSound);
      setSoundPlaying(savedSoundPlaying);
    }

    setMode(savedMode);
    if (savedCompleted) {
      setCompletedSessions(parseInt(savedCompleted, 10));
    }

    if (savedRunning && savedTargetEndTime) {
      const targetEndTime = Number(savedTargetEndTime);
      const now = Date.now();
      const left = Math.max(0, Math.ceil((targetEndTime - now) / 1000));
      if (left > 0) {
        setTimeLeft(left);
        setTimerActive(true);
        setTimerTime(formatTime(left));
      } else {
        handleTimerCompletion(savedMode);
      }
    } else if (savedRemaining !== null) {
      const remaining = Math.max(0, Number(savedRemaining));
      setTimeLeft(remaining);
      setTimerActive(false);
      setTimerTime(formatTime(remaining));
    } else {
      const defaultTime = modeDurations[savedMode];
      setTimeLeft(defaultTime);
      setTimerActive(false);
      setTimerTime(formatTime(defaultTime));
    }
  }, [handleTimerCompletion, modeDurations, setTimerActive, setTimerTime]);

  useEffect(() => {
    syncStateFromStorage();
  }, [syncStateFromStorage]);

  // Sync soundscape selection with external events (e.g. sidebar player)
  useEffect(() => {
    const handleSoundChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ name: string; playing: boolean }>;
      if (customEvent.detail && customEvent.detail.name) {
        setSelectedSound(customEvent.detail.name);
        setSoundPlaying(customEvent.detail.playing);
      }
    };

    window.addEventListener("flowstate_sound_change", handleSoundChange);
    return () => {
      window.removeEventListener("flowstate_sound_change", handleSoundChange);
    };
  }, []);

  const handleSoundSelect = (soundName: string) => {
    setSelectedSound(soundName);
    const playing = soundName !== "Silent";
    setSoundPlaying(playing);

    if (typeof window !== "undefined") {
      localStorage.setItem("flowstate_active_soundscape", soundName);
      localStorage.setItem("flowstate_soundscape_playing", String(playing));
      window.dispatchEvent(
        new CustomEvent("flowstate_sound_change", {
          detail: { name: soundName, playing },
        })
      );
    }
  };

  useEffect(() => {
    const tick = () => {
      const savedRunning = localStorage.getItem(STORAGE_KEY_RUNNING) === "true";
      const savedTargetEndTime = localStorage.getItem(STORAGE_KEY_TARGET_END_TIME);
      const savedMode = (localStorage.getItem(STORAGE_KEY_MODE) as TimerMode) || "focus";

      if (savedRunning && savedTargetEndTime) {
        const targetEndTime = Number(savedTargetEndTime);
        const now = Date.now();
        const left = Math.max(0, Math.ceil((targetEndTime - now) / 1000));

        // Low time notification trigger (2 mins = 120s, 1 min = 60s)
        if (left === 120 || left === 60) {
          if (!notifiedTimesRef.current.has(left)) {
            notifiedTimesRef.current.add(left);
            if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
              new Notification("FlowState Focus Alert ⚡", {
                body: `Focus session ending soon! ${Math.ceil(left / 60)} minute${left > 60 ? "s" : ""} remaining.`,
                icon: "/favicon.ico",
              });
            }
          }
        }

        if (left > 120) {
          notifiedTimesRef.current.clear();
        }

        if (left <= 0) {
          handleTimerCompletion(savedMode);
        } else {
          setTimeLeft(left);
          setTimerActive(true);
          setTimerTime(formatTime(left));
        }
      }
    };

    const interval = setInterval(tick, 1000);
    window.addEventListener("focus", tick);
    window.addEventListener("visibilitychange", tick);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", tick);
      window.removeEventListener("visibilitychange", tick);
    };
  }, [handleTimerCompletion, setTimerActive, setTimerTime]);

  // Configurable grace period updater
  const handleUpdateGracePeriod = useCallback((secs: number) => {
    const clamped = Math.max(1, Math.min(300, secs));
    setGracePeriodSecs(clamped);
    gracePeriodRef.current = clamped;
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_GRACE_PERIOD, String(clamped));
    }
  }, []);

  // Dismiss non-blocking away toast
  const dismissAwayToast = useCallback(() => {
    if (awayToastTimerRef.current) {
      clearTimeout(awayToastTimerRef.current);
      awayToastTimerRef.current = null;
    }
    setAwayToastState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // Trigger non-blocking away toast with 15s auto-dismiss
  const triggerAwayToast = useCallback((elapsedSecs: number) => {
    if (awayToastTimerRef.current) {
      clearTimeout(awayToastTimerRef.current);
    }

    setAwayToastState({
      isOpen: true,
      awaySeconds: elapsedSecs,
    });

    broadcastExtensionMessage("AWAY_TOAST_TRIGGERED", {
      awaySeconds: elapsedSecs,
      gracePeriod: gracePeriodRef.current,
    });
    broadcastExtensionMessage("SMART_ALERT_TRIGGERED", {
      awaySeconds: elapsedSecs,
      gracePeriod: gracePeriodRef.current,
    });

    // Auto-dismiss after 15 seconds
    awayToastTimerRef.current = setTimeout(() => {
      setAwayToastState((prev) => ({ ...prev, isOpen: false }));
      awayToastTimerRef.current = null;
    }, 15000);
  }, []);

  // Clean up auto-dismiss timer on unmount
  useEffect(() => {
    return () => {
      if (awayToastTimerRef.current) {
        clearTimeout(awayToastTimerRef.current);
      }
    };
  }, []);

  // Toast Action: Yes, Working
  const handleToastYesWorking = useCallback(() => {
    dismissAwayToast();

    setWarningState((prev) => {
      const updated: WarningState = {
        ...prev,
        history: [
          {
            id: Math.random().toString(36).substring(2, 9),
            timestamp: Date.now(),
            awaySeconds: awayToastState.awaySeconds,
            status: "working_approved",
            domain: "Productive Task",
          },
          ...prev.history.slice(0, 49),
        ],
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY_WARNING_STATE, JSON.stringify(updated));
      }
      return updated;
    });
  }, [dismissAwayToast, awayToastState.awaySeconds]);

  // Toast Action: No, Distracted
  const handleToastNoDistracted = useCallback(() => {
    dismissAwayToast();
    setDistractionCount((prev) => prev + 1);

    setWarningState((prev) => {
      const updated: WarningState = {
        count: prev.count + 1,
        lastTriggeredAt: Date.now(),
        history: [
          {
            id: Math.random().toString(36).substring(2, 9),
            timestamp: Date.now(),
            awaySeconds: awayToastState.awaySeconds,
            status: "distracted_flagged",
            domain: "Distraction",
          },
          ...prev.history.slice(0, 49),
        ],
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY_WARNING_STATE, JSON.stringify(updated));
      }
      return updated;
    });
  }, [dismissAwayToast, awayToastState.awaySeconds]);

  // Toast Action: Dismiss
  const handleToastDismiss = useCallback(() => {
    dismissAwayToast();
  }, [dismissAwayToast]);

  // Pure Time-Based Tab Away Monitor
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleVisibility = () => {
      const isRunning =
        timerActiveRef.current ||
        localStorage.getItem(STORAGE_KEY_RUNNING) === "true";
      const curMode =
        (localStorage.getItem(STORAGE_KEY_MODE) as TimerMode) ||
        modeRef.current ||
        "focus";

      if (document.visibilityState === "hidden") {
        if (isRunning && curMode === "focus") {
          // Tab switched away or minimized during active focus session:
          // Record away timestamp
          const leaveTime = Date.now();
          awayTimestampRef.current = leaveTime;
          sessionStorage.setItem("flowstate_away_timestamp", String(leaveTime));
        }
      } else if (document.visibilityState === "visible") {
        // Tab restored / user returned to FlowState tab
        const storedLeaveTime = sessionStorage.getItem("flowstate_away_timestamp");
        const leaveTime =
          awayTimestampRef.current || (storedLeaveTime ? Number(storedLeaveTime) : null);

        // Always consume and clear away timestamp immediately
        sessionStorage.removeItem("flowstate_away_timestamp");
        sessionStorage.removeItem("flowstate_smart_alert_due");
        awayTimestampRef.current = null;

        if (leaveTime && isRunning && curMode === "focus") {
          const elapsedMs = Date.now() - leaveTime;
          const elapsedSecs = Math.max(1, Math.round(elapsedMs / 1000));
          const threshold = gracePeriodRef.current ?? DEFAULT_GRACE_PERIOD_SECS;

          // Pure time-based detection: only trigger toast if user was away > threshold (default 10s)
          // No URL checks, no allowlist checks — web apps cannot detect external tabs/apps.
          if (elapsedSecs > threshold) {
            triggerAwayToast(elapsedSecs);
          }
        }
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    window.addEventListener("visibilitychange", handleVisibility);
    document.addEventListener("visibilitychange", handleVisibility);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      window.removeEventListener("visibilitychange", handleVisibility);
      document.removeEventListener("visibilitychange", handleVisibility);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      if (graceTimerRef.current) {
        clearTimeout(graceTimerRef.current);
      }
    };
  }, [triggerAwayToast]);

  const toggleFullscreen = () => {
    if (typeof document === "undefined") return;
    if (!document.fullscreenElement) {
      chamberRef.current?.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const toggleTimer = () => {
    const savedRunning = localStorage.getItem(STORAGE_KEY_RUNNING) === "true";

    if (savedRunning) {
      // Pause
      const savedTargetEndTime = localStorage.getItem(STORAGE_KEY_TARGET_END_TIME);
      let left = timeLeft;
      if (savedTargetEndTime) {
        left = Math.max(0, Math.ceil((Number(savedTargetEndTime) - Date.now()) / 1000));
      }
      localStorage.setItem(STORAGE_KEY_RUNNING, "false");
      localStorage.removeItem(STORAGE_KEY_TARGET_END_TIME);
      localStorage.setItem(STORAGE_KEY_REMAINING, String(left));

      setTimeLeft(left);
      setTimerActive(false);
      setTimerTime(formatTime(left));
    } else {
      // Start / Resume
      const timeToUse = timeLeft <= 0 ? modeDurations[mode] : timeLeft;
      const targetEndTime = Date.now() + timeToUse * 1000;

      localStorage.setItem(STORAGE_KEY_TARGET_END_TIME, String(targetEndTime));
      localStorage.setItem(STORAGE_KEY_RUNNING, "true");
      localStorage.setItem(STORAGE_KEY_MODE, mode);
      localStorage.removeItem(STORAGE_KEY_REMAINING);

      setTimeLeft(timeToUse);
      setTimerActive(true);
      setTimerTime(formatTime(timeToUse));
    }
  };
  // Listen for external start trigger (e.g. from AI Discipline Coach or Streak Rebuild Modal)
  const toggleTimerRef = useRef(toggleTimer);
  useEffect(() => {
    toggleTimerRef.current = toggleTimer;
  });
  useEffect(() => {
    const handleExternalStart = () => {
      const savedRunning = localStorage.getItem(STORAGE_KEY_RUNNING) === "true";
      if (!savedRunning) {
        toggleTimerRef.current();
      }
    };
    window.addEventListener("flowstate_start_timer", handleExternalStart);
    return () => {
      window.removeEventListener("flowstate_start_timer", handleExternalStart);
    };
  }, []);

  // State-protected mode change: prevents accidental resets while active
  const applyModeChange = (newMode: TimerMode) => {
    setMode(newMode);
    const duration = modeDurations[newMode];

    localStorage.setItem(STORAGE_KEY_MODE, newMode);
    localStorage.setItem(STORAGE_KEY_RUNNING, "false");
    localStorage.removeItem(STORAGE_KEY_TARGET_END_TIME);
    localStorage.setItem(STORAGE_KEY_REMAINING, String(duration));

    setTimeLeft(duration);
    setTimerActive(false);
    setTimerTime(formatTime(duration));
    setPendingModeSwitch(null);
  };

  const handleModeChange = (newMode: TimerMode) => {
    if (newMode === mode) return;

    // Check if a session is currently running
    const isRunning = timerActive || localStorage.getItem(STORAGE_KEY_RUNNING) === "true";
    if (isRunning) {
      // State Protection: prompt the user to confirm switching modes instead of silently resetting
      setPendingModeSwitch(newMode);
      return;
    }

    applyModeChange(newMode);
  };

  // Fully resets the current mode's timer back to default duration, clears target end time, and pauses
  const handleReset = () => {
    const duration = modeDurations[mode];

    localStorage.setItem(STORAGE_KEY_RUNNING, "false");
    localStorage.removeItem(STORAGE_KEY_TARGET_END_TIME);
    localStorage.setItem(STORAGE_KEY_REMAINING, String(duration));

    setTimeLeft(duration);
    setTimerActive(false);
    setTimerTime(formatTime(duration));
    setPendingModeSwitch(null);
    setDistractionCount(0);
    setShowDistractionOverlay(false);
    setSmartAlertState({ isOpen: false, awaySeconds: 0, suggestedDomain: "External Application", isExternalApp: true });
    if (graceTimerRef.current) {
      clearTimeout(graceTimerRef.current);
      graceTimerRef.current = null;
    }
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("flowstate_tab_wandered_alert");
      sessionStorage.removeItem("flowstate_away_timestamp");
      sessionStorage.removeItem("flowstate_smart_alert_due");
    }
  };

  // Trigger Google Gemini AI Intervention modal after 5 seconds hold
  const handlePanicTrigger = useCallback(() => {
    // Pause timer during intervention modal
    const savedRunning = localStorage.getItem(STORAGE_KEY_RUNNING) === "true";
    if (savedRunning) {
      const savedTargetEndTime = localStorage.getItem(STORAGE_KEY_TARGET_END_TIME);
      let left = timeLeft;
      if (savedTargetEndTime) {
        left = Math.max(0, Math.ceil((Number(savedTargetEndTime) - Date.now()) / 1000));
      }
      localStorage.setItem(STORAGE_KEY_RUNNING, "false");
      localStorage.removeItem(STORAGE_KEY_TARGET_END_TIME);
      localStorage.setItem(STORAGE_KEY_REMAINING, String(left));
      setTimeLeft(left);
      setTimerActive(false);
      setTimerTime(formatTime(left));
    }

    // Do NOT exit immediately! Show AI intervention modal
    setShowPanicModal(true);
  }, [formatTime, setTimerActive, setTimerTime, timeLeft]);

  // Modal Action 1: 'No, I'll continue' -> Close modal, resume timer
  const handlePanicContinue = () => {
    setShowPanicModal(false);
    const timeToUse = timeLeft <= 0 ? modeDurations[mode] : timeLeft;
    const targetEndTime = Date.now() + timeToUse * 1000;

    localStorage.setItem(STORAGE_KEY_TARGET_END_TIME, String(targetEndTime));
    localStorage.setItem(STORAGE_KEY_RUNNING, "true");
    localStorage.setItem(STORAGE_KEY_MODE, mode);
    localStorage.removeItem(STORAGE_KEY_REMAINING);

    setTimeLeft(timeToUse);
    setTimerActive(true);
    setTimerTime(formatTime(timeToUse));
  };

  // Modal Action 2: 'I need a 5-min break' -> Pause timer, switch to Break mode
  const handlePanicBreak = () => {
    setShowPanicModal(false);
    applyModeChange("shortBreak");
  };

  // Modal Action 3: 'Yes, I quit' -> End session, log a 'Panic Quit' event in the Supabase database
  const handlePanicQuit = async () => {
    setShowPanicModal(false);
    handleReset();

    if (isFullscreen && typeof document !== "undefined" && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }

    try {
      const { error } = await supabase.from("focus_sessions").insert([
        {
          duration_minutes: 0,
          mode: "Panic Quit",
        },
      ]);
      if (error) console.warn("Supabase focus_sessions log notice:", error);
    } catch (err) {
      console.warn("Supabase panic quit network notice:", err);
    }

    try {
      await supabase.from("panic_events").insert([
        {
          event_type: "Panic Quit",
          mode: "focus",
          created_at: new Date().toISOString(),
          details: "User initiated early session exit via Panic Button",
        },
      ]);
    } catch {
      // ignore if table doesn't exist
    }

    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("flowstate_panic_quit_events");
        const list = cached ? JSON.parse(cached) : [];
        list.unshift({
          event: "Panic Quit",
          mode: "focus",
          timestamp: Date.now(),
          date: new Date().toISOString(),
        });
        localStorage.setItem("flowstate_panic_quit_events", JSON.stringify(list.slice(0, 50)));
      } catch {
        // ignore cache error
      }

      window.dispatchEvent(new CustomEvent("flowstate_panic_quit"));
    }
  };

  // Smart Alert Action: Yes, Working (adds domain to allowlist, no warning increment)
  const handleSmartAlertYesWorking = (domainCandidate?: string) => {
    const rawCandidate = (
      domainCandidate ||
      smartAlertState.suggestedDomain ||
      "External Application"
    ).trim();

    const isExternal =
      rawCandidate.toLowerCase() === "external application" ||
      smartAlertState.isExternalApp;

    const domain = isExternal ? "External Application" : normalizeDomain(rawCandidate);

    if (!isExternal && domain && !allowedDomains.includes(domain)) {
      const nextDomains = [...allowedDomains, domain];
      setAllowedDomains(nextDomains);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY_ALLOWED_DOMAINS, JSON.stringify(nextDomains));
      }
    }

    // Safe working return: record history, keep warning count clean
    setWarningState((prev) => {
      const updated: WarningState = {
        ...prev,
        history: [
          {
            id: Math.random().toString(36).substring(2, 9),
            timestamp: Date.now(),
            awaySeconds: smartAlertState.awaySeconds,
            status: "working_approved",
            domain: domain || "External Application",
          },
          ...prev.history.slice(0, 49),
        ],
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY_WARNING_STATE, JSON.stringify(updated));
      }
      return updated;
    });

    setSmartAlertState({
      isOpen: false,
      awaySeconds: 0,
      suggestedDomain: "External Application",
      isExternalApp: true,
    });
  };

  // Smart Alert Action: No, Distracted (increments warning count)
  const handleSmartAlertNoDistracted = () => {
    const nextCount = distractionCount + 1;
    setDistractionCount(nextCount);

    const domain = smartAlertState.suggestedDomain || "External Application";

    setWarningState((prev) => {
      const updated: WarningState = {
        count: prev.count + 1,
        lastTriggeredAt: Date.now(),
        history: [
          {
            id: Math.random().toString(36).substring(2, 9),
            timestamp: Date.now(),
            awaySeconds: smartAlertState.awaySeconds,
            status: "distracted_flagged",
            domain: domain,
          },
          ...prev.history.slice(0, 49),
        ],
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY_WARNING_STATE, JSON.stringify(updated));
      }
      return updated;
    });

    setSmartAlertState({
      isOpen: false,
      awaySeconds: 0,
      suggestedDomain: "External Application",
      isExternalApp: true,
    });
  };

  // Allowlist domain management
  const handleAddDomain = (domain: string) => {
    const sanitized = normalizeDomain(domain);
    if (!sanitized) {
      setAllowlistFeedback("Please enter a valid domain (e.g. github.com)");
      return;
    }
    if (allowedDomains.includes(sanitized)) {
      setAllowlistFeedback(`"${sanitized}" is already in your allowlist.`);
      return;
    }
    const updated = [...allowedDomains, sanitized];
    setAllowedDomains(updated);
    setNewDomainInput("");
    setAllowlistFeedback(`Added "${sanitized}" to allowlist.`);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_ALLOWED_DOMAINS, JSON.stringify(updated));
    }
  };

  const handleRemoveDomain = (domainToRemove: string) => {
    const updated = allowedDomains.filter((d) => d !== domainToRemove);
    setAllowedDomains(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_ALLOWED_DOMAINS, JSON.stringify(updated));
    }
  };

  // Blocked paths management (Bonus path matching)
  const handleAddBlockedPath = (path: string) => {
    if (!path) return;
    const cleaned = path.trim().toLowerCase();
    if (!cleaned) return;
    if (blockedPaths.includes(cleaned)) {
      setAllowlistFeedback(`Path "${cleaned}" is already in blocked paths.`);
      return;
    }
    const updated = [...blockedPaths, cleaned];
    setBlockedPaths(updated);
    setNewBlockedPathInput("");
    setAllowlistFeedback(`Added "${cleaned}" to blocked paths.`);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_BLOCKED_PATHS, JSON.stringify(updated));
    }
  };

  const handleRemoveBlockedPath = (pathToRemove: string) => {
    const updated = blockedPaths.filter((p) => p !== pathToRemove);
    setBlockedPaths(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_BLOCKED_PATHS, JSON.stringify(updated));
    }
  };

  const handleResetAllowlist = () => {
    setAllowedDomains(DEFAULT_ALLOWED_DOMAINS);
    setBlockedPaths(DEFAULT_BLOCKED_PATHS);
    handleUpdateGracePeriod(DEFAULT_GRACE_PERIOD_SECS);
    setAllowlistFeedback("Reset settings to default values");
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_ALLOWED_DOMAINS, JSON.stringify(DEFAULT_ALLOWED_DOMAINS));
      localStorage.setItem(STORAGE_KEY_BLOCKED_PATHS, JSON.stringify(DEFAULT_BLOCKED_PATHS));
    }
  };

  const handleSkip = () => {
    const nextMode: TimerMode = mode === "focus" ? "shortBreak" : "focus";
    applyModeChange(nextMode);
  };

  // Set custom duration for Focus mode
  const handleSetCustomFocus = (mins: number) => {
    const validMins = Math.max(1, Math.min(120, mins));
    setCustomFocusMins(validMins);
    localStorage.setItem(STORAGE_KEY_FOCUS_DURATION, String(validMins));

    if (mode === "focus" && !timerActive) {
      const newDurationSec = validMins * 60;
      setTimeLeft(newDurationSec);
      setTimerTime(formatTime(newDurationSec));
      localStorage.setItem(STORAGE_KEY_REMAINING, String(newDurationSec));
    }
  };

  const totalModeDuration = modeDurations[mode];
  const progressRatio = totalModeDuration > 0 ? (totalModeDuration - timeLeft) / totalModeDuration : 0;

  // SVG Circular Ring parameters
  const ringRadius = 78;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringDashoffset = ringCircumference - progressRatio * ringCircumference;

  const modeColors: Record<TimerMode, { accent: string; glow: string; badge: string }> = {
    focus: {
      accent: "from-emerald-500 to-teal-400",
      glow: "rgba(16,185,129,0.35)",
      badge: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    },
    shortBreak: {
      accent: "from-cyan-500 to-blue-400",
      glow: "rgba(6,182,212,0.35)",
      badge: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    },
    longBreak: {
      accent: "from-indigo-500 to-purple-400",
      glow: "rgba(99,102,241,0.35)",
      badge: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
    },
  };

  const sounds = [
    { name: "Rain", icon: "🌧️" },
    { name: "Lo-Fi", icon: "🎵" },
    { name: "Alpha", icon: "🧠" },
    { name: "Silent", icon: "🔇" },
  ];

  return (
    <div
      ref={chamberRef}
      className={`glass-card relative p-6 rounded-3xl border shadow-2xl flex flex-col justify-between h-full overflow-hidden group transition-all duration-500 ${
        timerActive && mode === "focus"
          ? "border-emerald-500/40 shadow-[0_0_35px_rgba(16,185,129,0.18)] ring-1 ring-emerald-500/30"
          : "border-white/10"
      }`}
    >
      {/* Background glow orb */}
      <div
        className="absolute -top-10 -left-10 w-48 h-48 rounded-full blur-3xl transition-all duration-700 pointer-events-none"
        style={{ background: modeColors[mode].glow }}
      />

      {/* Header Controls & Mode Switcher */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-white/[0.05] border border-white/10 text-emerald-400">
              <Timer className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 tracking-wide">
                Focus Engine
              </h2>
              <p className="text-[11px] text-slate-400">
                Pomodoro Cycle 3/4
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Focus Lockdown Visual State Pill */}
            {timerActive && mode === "focus" && (
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                  <Lock className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span className="hidden sm:inline">Focus Lockdown</span> Active
                </div>

                {distractionCount > 0 && (
                  <button
                    onClick={() => setShowDistractionOverlay(true)}
                    className="flex items-center gap-1 text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded-full hover:bg-rose-500/20 transition-all"
                    title="Distraction Deterrent: Click to view wandering alert"
                  >
                    <ShieldAlert className="w-3 h-3 text-rose-400" />
                    <span>{distractionCount} Wander{distractionCount === 1 ? "" : "s"}</span>
                  </button>
                )}
              </div>
            )}

            {/* Allowlist & Settings Trigger */}
            <button
              onClick={() => setShowAllowlistModal(true)}
              className={`p-1.5 px-2 rounded-lg border text-xs transition-all flex items-center gap-1.5 ${
                showAllowlistModal
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                  : "bg-slate-900/60 border-white/10 text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
              title="Configure Settings: Away Grace Period & Study Allowlist"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-semibold hidden sm:inline">Settings</span>
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded-full border border-emerald-500/30">
                {gracePeriodSecs}s
              </span>
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white bg-slate-900/60 transition-all"
              title={isFullscreen ? "Exit Fullscreen Chamber" : "Enter Fullscreen Chamber"}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            {mode === "focus" && (
              <button
                onClick={() => setShowCustomDuration(!showCustomDuration)}
                className={`p-1.5 rounded-lg border text-xs transition-all flex items-center gap-1 ${
                  showCustomDuration
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                    : "bg-slate-900/60 border-white/10 text-slate-400 hover:text-slate-200"
                }`}
                title="Customize Focus Duration"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono">{customFocusMins}m</span>
              </button>
            )}

            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${modeColors[mode].badge}`}
            >
              {mode === "focus"
                ? `Deep Work (${customFocusMins}m)`
                : mode === "shortBreak"
                ? "Short Rest"
                : "Long Recovery"}
            </span>
          </div>
        </div>

        {/* Custom Duration Selector Dropdown / Inline Controls */}
        <AnimatePresence>
          {showCustomDuration && mode === "focus" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-xl space-y-2 overflow-hidden"
            >
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Focus Session Length:
                </span>
                <span className="font-mono text-emerald-400 font-bold">{customFocusMins} minutes</span>
              </div>
              <div className="flex items-center gap-2">
                {[15, 20, 25, 40, 50, 60].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => handleSetCustomFocus(mins)}
                    className={`flex-1 py-1 rounded-lg text-xs font-semibold font-mono transition-all border ${
                      customFocusMins === mins
                        ? "bg-emerald-500/25 border-emerald-500/50 text-emerald-300 shadow-sm"
                        : "bg-slate-800/60 border-white/5 text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="range"
                  min="5"
                  max="90"
                  step="5"
                  value={customFocusMins}
                  onChange={(e) => handleSetCustomFocus(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-900/80 border border-white/10">
          {(["focus", "shortBreak", "longBreak"] as TimerMode[]).map(
            (m) => (
              <button
                key={m}
                onClick={() => handleModeChange(m)}
                className={`relative py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  mode === m
                    ? "text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {mode === m && (
                  <motion.div
                    layoutId="timerModeIndicator"
                    className="absolute inset-0 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 capitalize">
                  {m === "focus"
                    ? `Focus (${customFocusMins}m)`
                    : m === "shortBreak"
                    ? "Break (5m)"
                    : "Rest (15m)"}
                </span>
              </button>
            )
          )}
        </div>

        {/* Pre-session Setup Bar: Study Allowlist & Grace Period Quick Status */}
        {!timerActive && mode === "focus" && (
          <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-900/60 border border-white/5 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1 shrink-0">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Grace:
              </span>
              <span className="px-1.5 py-0.5 rounded-md bg-white/[0.06] border border-white/10 text-[10px] font-mono text-emerald-300 font-bold">
                {gracePeriodSecs}s
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                Allowlist:
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {allowedDomains.slice(0, 2).map((d) => (
                  <span
                    key={d}
                    className="px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/10 text-[10px] font-mono text-slate-200"
                  >
                    {d}
                  </span>
                ))}
                {allowedDomains.length > 2 && (
                  <span className="text-[10px] text-slate-400 font-mono">
                    +{allowedDomains.length - 2} more
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowAllowlistModal(true)}
              className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 ml-2 shrink-0 transition-colors"
            >
              Configure →
            </button>
          </div>
        )}
      </div>

      {/* Mode Switch State Protection Modal */}
      <AnimatePresence>
        {pendingModeSwitch && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-4 z-30 rounded-2xl bg-slate-950/95 backdrop-blur-2xl border border-amber-500/30 p-5 flex flex-col justify-center items-center text-center space-y-4 shadow-2xl"
          >
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Focus Session Active</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Your current session countdown is still running. Switching modes will pause and change your active cycle.
              </p>
            </div>
            <div className="flex items-center gap-3 w-full max-w-xs">
              <button
                onClick={() => setPendingModeSwitch(null)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold bg-slate-850 hover:bg-slate-800 text-slate-300 border border-white/10 transition-all"
              >
                Keep Active
              </button>
              <button
                onClick={() => applyModeChange(pendingModeSwitch)}
                className="flex-1 py-2 rounded-xl text-xs font-extrabold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-lg"
              >
                Switch & Reset
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Productivity Return Non-blocking Toast */}
      <AnimatePresence>
        {awayToastState.isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 w-full max-w-sm rounded-2xl bg-slate-950/95 backdrop-blur-2xl border border-white/15 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.65),0_0_25px_rgba(16,185,129,0.15)] text-left space-y-3 pointer-events-auto"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Focus Monitor
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                15s auto-dismiss
              </span>
            </div>

            <div>
              <p className="text-sm font-semibold text-white leading-snug">
                Away for {awayToastState.awaySeconds}s. Was this productive?
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Timer kept running. Confirm your focus to maintain discipline.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleToastYesWorking}
                className="flex-1 py-1.5 px-2 rounded-xl text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 active:scale-95 transition-all flex items-center justify-center gap-1 shadow-sm"
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Yes, Working</span>
              </button>

              <button
                type="button"
                onClick={handleToastNoDistracted}
                className="flex-1 py-1.5 px-2 rounded-xl text-xs font-bold bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 active:scale-95 transition-all flex items-center justify-center gap-1"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>No, Distracted</span>
              </button>

              <button
                type="button"
                onClick={handleToastDismiss}
                className="py-1.5 px-2.5 rounded-xl text-xs font-medium bg-slate-900 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/10 active:scale-95 transition-all"
              >
                Dismiss
              </button>
            </div>

            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 15, ease: "linear" }}
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Focus Chamber Settings Modal */}
      <AnimatePresence>
        {showAllowlistModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-2 sm:inset-4 z-40 rounded-2xl bg-slate-950/95 backdrop-blur-2xl border border-white/15 p-4 sm:p-5 flex flex-col justify-between shadow-2xl overflow-y-auto"
          >
            <div className="space-y-3.5">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-bold text-white">Focus Chamber Settings</h3>
                    <p className="text-[11px] text-slate-400">
                      Configure Away Grace Period & Study Allowlist
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowAllowlistModal(false);
                    setAllowlistFeedback(null);
                  }}
                  className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Away Grace Period Configuration */}
              <div className="space-y-2 text-left p-3 rounded-xl bg-slate-900/80 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-emerald-400" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Away Grace Period</h4>
                      <p className="text-[10px] text-slate-400">
                        Trigger non-blocking toast when returning after being away longer than this.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-lg">
                    {gracePeriodSecs}s
                  </span>
                </div>

                <div className="flex items-center gap-1.5 pt-1">
                  {[5, 10, 15, 30, 60].map((secs) => (
                    <button
                      key={secs}
                      type="button"
                      onClick={() => handleUpdateGracePeriod(secs)}
                      className={`flex-1 py-1 px-1.5 rounded-lg text-xs font-mono font-semibold transition-all border ${
                        gracePeriodSecs === secs
                          ? "bg-emerald-500/25 border-emerald-500/50 text-emerald-300 shadow-sm"
                          : "bg-slate-950/60 border-white/5 text-slate-400 hover:text-white hover:bg-slate-800"
                      }`}
                    >
                      {secs}s{secs === 10 ? " (Default)" : ""}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <span className="text-[10px] text-slate-500">Custom:</span>
                  <input
                    type="range"
                    min="3"
                    max="120"
                    step="1"
                    value={gracePeriodSecs}
                    onChange={(e) => handleUpdateGracePeriod(Number(e.target.value))}
                    className="flex-1 accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
                  />
                  <span className="text-[10px] font-mono text-slate-300 w-8 text-right">
                    {gracePeriodSecs}s
                  </span>
                </div>
              </div>

              {/* Add Domain Input */}
              <div className="space-y-1.5 text-left">
                <label className="text-[11px] font-semibold text-slate-300 block">
                  Add Allowed Domain
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Globe className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={newDomainInput}
                      onChange={(e) => setNewDomainInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddDomain(newDomainInput);
                        }
                      }}
                      placeholder="e.g. github.com, stackoverflow.com"
                      className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 font-mono"
                    />
                  </div>
                  <button
                    onClick={() => handleAddDomain(newDomainInput)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
                {allowlistFeedback && (
                  <p className="text-[11px] text-emerald-400 font-medium">
                    {allowlistFeedback}
                  </p>
                )}
              </div>

              {/* Quick Preset Badges */}
              <div className="space-y-1 text-left">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                  Popular Study & Dev Sites (Click to add):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {["github.com", "stackoverflow.com", "chatgpt.com", "docs.google.com", "notion.so"].map((preset) => {
                    const isAlreadyAdded = allowedDomains.includes(preset);
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handleAddDomain(preset)}
                        disabled={isAlreadyAdded}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-mono transition-all flex items-center gap-1 border ${
                          isAlreadyAdded
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 opacity-60 cursor-default"
                            : "bg-slate-900 border-white/10 text-slate-300 hover:text-white hover:border-emerald-500/40 hover:bg-slate-800"
                        }`}
                      >
                        {isAlreadyAdded ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Plus className="w-2.5 h-2.5 text-slate-400" />}
                        <span>{preset}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Allowed Domains List */}
              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-300">
                    Active Allowed Domains ({allowedDomains.length})
                  </span>
                  <span className="text-slate-500 text-[10px]">{gracePeriodSecs}s Grace Period Configured</span>
                </div>
                <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1">
                  {allowedDomains.map((domain) => {
                    const isDefault = DEFAULT_ALLOWED_DOMAINS.includes(domain);
                    return (
                      <div
                        key={domain}
                        className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/5"
                      >
                        <div className="flex items-center gap-2">
                          <Globe className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-xs font-mono text-slate-200">{domain}</span>
                          {isDefault && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-slate-400">
                              Default
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveDomain(domain)}
                          className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title={`Remove ${domain}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Blocked Paths (Bonus Path Matching) */}
              <div className="space-y-1.5 text-left pt-2 border-t border-white/10">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-rose-300">
                    Blocked Paths / Routes ({blockedPaths.length})
                  </span>
                  <span className="text-slate-500 text-[10px]">Strict Path Matching</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Blocks specific sub-paths (e.g. /shorts/*, youtube.com/shorts/*) even if domain is allowed.
                </p>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={newBlockedPathInput}
                      onChange={(e) => setNewBlockedPathInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddBlockedPath(newBlockedPathInput);
                        }
                      }}
                      placeholder="e.g. /shorts/*, youtube.com/shorts/*"
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500/50 font-mono"
                    />
                  </div>
                  <button
                    onClick={() => handleAddBlockedPath(newBlockedPathInput)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-500/80 hover:bg-rose-500 text-white transition-all flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Block</span>
                  </button>
                </div>

                <div className="max-h-24 overflow-y-auto space-y-1 pr-1 pt-0.5">
                  {blockedPaths.map((path) => (
                    <div
                      key={path}
                      className="flex items-center justify-between px-2.5 py-1 rounded-lg bg-rose-950/40 border border-rose-500/20 text-rose-200 text-xs font-mono"
                    >
                      <span className="truncate">{path}</span>
                      <button
                        onClick={() => handleRemoveBlockedPath(path)}
                        className="p-0.5 text-slate-400 hover:text-rose-400 transition-colors ml-2"
                        title={`Remove blocked path ${path}`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-2.5 border-t border-white/10 mt-3">
              <button
                onClick={handleResetAllowlist}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset Defaults</span>
              </button>
              <button
                onClick={() => {
                  setShowAllowlistModal(false);
                  setAllowlistFeedback(null);
                }}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                Done
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gentle Distraction Deterrent Overlay */}
      <AnimatePresence>
        {showDistractionOverlay && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-4 z-40 rounded-2xl bg-slate-950/95 backdrop-blur-2xl border border-rose-500/40 p-5 flex flex-col justify-center items-center text-center space-y-3.5 shadow-2xl"
          >
            <div className="relative">
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.25)]">
                <ShieldAlert className="w-7 h-7 animate-pulse text-rose-400" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-900 border border-rose-500/50 text-[10px] font-mono font-bold text-rose-400 flex items-center justify-center">
                {distractionCount}
              </div>
            </div>

            <div className="space-y-1 max-w-sm">
              <span className="text-[10px] font-black uppercase tracking-widest text-rose-400 bg-rose-500/15 px-2.5 py-0.5 rounded-full border border-rose-500/30">
                Focus Lockdown Alert
              </span>
              <h3 className="text-base font-extrabold text-white">
                Tab Wandering Detected
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                You strayed from the active Focus Chamber. Context switching fragments cognitive momentum and destroys deep flow state. Maintain discipline and stay locked in.
              </p>
            </div>

            <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-slate-300">
              <span className="text-slate-400">Time Remaining:</span>
              <span className="text-emerald-400 font-bold">{timerTime}</span>
              <span className="text-slate-600">|</span>
              <span className="text-rose-400 font-bold">{distractionCount} Wander{distractionCount === 1 ? "" : "s"} Logged</span>
            </div>

            <div className="flex items-center gap-3 w-full max-w-xs pt-1">
              <button
                onClick={() => setShowDistractionOverlay(false)}
                className="w-full py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5 fill-slate-950" />
                <span>Recommit & Lock In</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Intervention Modal (Triggered after 5 seconds hold) */}
      <PanicInterventionModal
        isOpen={showPanicModal}
        onContinue={handlePanicContinue}
        onBreak={handlePanicBreak}
        onQuit={handlePanicQuit}
        minutesLeft={Math.max(1, Math.ceil(timeLeft / 60))}
        userName={
          typeof window !== "undefined"
            ? localStorage.getItem("flowstate_user_name") || "Alex Vance"
            : "Alex Vance"
        }
      />

      {/* Main Timer Dial & Numerical Countdown */}
      <div className="relative py-6 flex flex-col items-center justify-center">
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Outer SVG Ring */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r={ringRadius}
              className="stroke-slate-800/80"
              strokeWidth="6"
              fill="transparent"
            />
            <motion.circle
              cx="96"
              cy="96"
              r={ringRadius}
              className="stroke-emerald-400"
              strokeWidth="6"
              strokeDasharray={ringCircumference}
              animate={{ strokeDashoffset: ringDashoffset }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              strokeLinecap="round"
              fill="transparent"
              style={{
                filter: `drop-shadow(0px 0px 10px ${modeColors[mode].glow})`,
              }}
            />
          </svg>

          {/* Time Display inside Ring */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-4xl sm:text-5xl font-black tracking-tight font-mono text-white drop-shadow-md">
              {timerTime}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1 flex items-center gap-1">
              {timerActive ? (
                mode === "focus" ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-bold">
                    <Lock className="w-2.5 h-2.5 animate-pulse" />
                    Lockdown Active
                  </span>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    Recovery Mode
                  </>
                )
              ) : (
                "Ready to Flow"
              )}
            </span>
          </div>
        </div>

        {/* Session Indicators */}
        <div className="flex items-center gap-2 mt-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`w-2 h-2 rounded-full transition-all ${
                s <= completedSessions
                  ? "bg-emerald-400 shadow-[0_0_8px_#10b981]"
                  : "bg-slate-800 border border-white/10"
              }`}
            />
          ))}
          <span className="text-[10px] text-slate-400 font-mono ml-1">
            Session {completedSessions}/4
          </span>
        </div>
      </div>

      {/* Timer Action Controls & Ambient Sound Select */}
      <div className="space-y-4 pt-2">
        {/* Play/Pause / Panic Button / Reset / Skip Action Buttons */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
          {/* Friction-based Panic Button replaces direct quit during Focus mode */}
          {mode === "focus" ? (
            <PanicButton onTrigger={handlePanicTrigger} />
          ) : (
            <button
              onClick={handleReset}
              className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all active:scale-95"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={toggleTimer}
            className={`flex items-center justify-center gap-2 px-8 py-3 rounded-2xl font-extrabold text-sm text-slate-950 transition-all shadow-xl ${
              timerActive
                ? "bg-gradient-to-r from-amber-400 to-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                : "bg-gradient-to-r from-emerald-400 to-teal-300 shadow-[0_0_25px_rgba(16,185,129,0.5)]"
            }`}
          >
            {timerActive ? (
              <>
                <Pause className="w-4 h-4 fill-slate-950" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Start Focus</span>
              </>
            )}
          </motion.button>

          <button
            onClick={handleSkip}
            className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all active:scale-95"
            title="Skip Session"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Ambient Sound Selector */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-medium">
            <Headphones className="w-3.5 h-3.5 text-indigo-400" />
            <span>Soundscape:</span>
          </div>

          <div className="flex items-center gap-1.5">
            {sounds.map((s) => (
              <button
                key={s.name}
                onClick={() => handleSoundSelect(s.name)}
                className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                  selectedSound === s.name && soundPlaying
                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-[0_0_8px_rgba(99,102,241,0.3)]"
                    : "bg-slate-900/40 text-slate-400 hover:bg-slate-800"
                }`}
              >
                <span>{s.icon}</span>{" "}
                <span className="hidden sm:inline">{s.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
