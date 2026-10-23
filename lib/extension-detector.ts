"use client";

import { supabase } from "@/lib/supabase";

export const STORAGE_KEY_EXTENSION_INSTALLED = "flowstate_extension_installed";

// In-memory state strictly defaults to false (Inactive) on app mount
let _isExtensionActive = false;
let _hasPongBeenReceived = false;
let _pingTimeoutId: NodeJS.Timeout | null = null;
let _probeIntervalId: NodeJS.Timeout | null = null;
let _hasInitialized = false;
const subscribers = new Set<() => void>();

function notifySubscribers() {
  subscribers.forEach((cb) => {
    try {
      cb();
    } catch (err) {
      console.warn("Notice: Error in extension subscriber callback:", err);
    }
  });
}

/**
 * Returns whether the FlowState Blocker extension is currently active and confirmed via ping/pong.
 * Strictly in-memory: NEVER reads from localStorage or Supabase to prevent false positives across browsers.
 */
export function isExtensionInstalled(): boolean {
  return _isExtensionActive;
}

/**
 * Strictly resets extension detection to false (Inactive) and clears any legacy localStorage cache.
 */
export function resetExtensionState(): void {
  if (_pingTimeoutId) {
    clearTimeout(_pingTimeoutId);
    _pingTimeoutId = null;
  }

  _hasPongBeenReceived = false;
  const wasActive = _isExtensionActive;
  _isExtensionActive = false;

  // Ensure no stale flags linger in localStorage or document attributes
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(STORAGE_KEY_EXTENSION_INSTALLED);
      if (document.documentElement) {
        document.documentElement.removeAttribute("data-flowstate-extension-installed");
      }
    } catch {}
  }

  if (wasActive) {
    notifySubscribers();
  }
}

/**
 * Actively pings the extension.
 * 1. Fires window.postMessage({ type: 'FLOWSTATE_PING_EXTENSION' }).
 * 2. Starts a 1.5-second timer. If FLOWSTATE_EXTENSION_PONG or FLOWSTATE_EXTENSION_HEARTBEAT
 *    is received before the timer ends, status is set to true (Active).
 * 3. If timer finishes and no PONG is received, strictly keeps the status false (Inactive).
 *    Do NOT fall back to any database or localStorage cached value.
 */
export function pingExtension(): void {
  if (typeof window === "undefined") return;

  _hasPongBeenReceived = false;

  // Clear any pending timeout before starting a new 1.5s probe window
  if (_pingTimeoutId) {
    clearTimeout(_pingTimeoutId);
    _pingTimeoutId = null;
  }

  try {
    window.postMessage(
      {
        source: "flowstate-focus-chamber",
        type: "FLOWSTATE_PING_EXTENSION",
      },
      "*"
    );
  } catch (err) {
    console.warn("Notice: Extension ping postMessage error:", err);
  }

  // 1.5-second verification window
  _pingTimeoutId = setTimeout(() => {
    _pingTimeoutId = null;

    if (!_hasPongBeenReceived) {
      const wasActive = _isExtensionActive;
      _isExtensionActive = false;

      // Strictly purge any legacy cached flags
      try {
        localStorage.removeItem(STORAGE_KEY_EXTENSION_INSTALLED);
        if (typeof document !== "undefined" && document.documentElement) {
          document.documentElement.removeAttribute("data-flowstate-extension-installed");
        }
      } catch {}

      if (wasActive) {
        notifySubscribers();
      }
    }
  }, 1500);
}

/**
 * Initializes global message listener, auth change hooks, and recurring probes.
 */
export function initExtensionDetection(): void {
  if (typeof window === "undefined" || _hasInitialized) return;
  _hasInitialized = true;

  // App mount: clean up any legacy localStorage flag immediately
  try {
    localStorage.removeItem(STORAGE_KEY_EXTENSION_INSTALLED);
  } catch {}

  const handleMessage = (event: MessageEvent) => {
    if (!event.data) return;
    const { type } = event.data;

    // Strict validation: only accept extension PONG or HEARTBEAT
    if (
      type === "FLOWSTATE_EXTENSION_PONG" ||
      type === "FLOWSTATE_EXTENSION_HEARTBEAT"
    ) {
      _hasPongBeenReceived = true;
      const wasActive = _isExtensionActive;
      _isExtensionActive = true;

      if (!wasActive) {
        notifySubscribers();
      }
    }
  };

  window.addEventListener("message", handleMessage);

  // Re-ping when tab regains focus to ensure live sync with browser state
  window.addEventListener("focus", () => {
    pingExtension();
  });

  // Listen for Supabase session changes (sign-in, sign-out)
  try {
    supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT" || event === "SIGNED_IN") {
        // Reset to false on session changes, then probe for the current browser
        resetExtensionState();
        if (event === "SIGNED_IN") {
          pingExtension();
        }
      }
    });
  } catch (err) {
    console.warn("Notice: Extension detector auth listener notice:", err);
  }

  // Send initial ping probe on mount
  pingExtension();

  // Periodic active probe every 5 seconds to keep live status in sync
  if (!_probeIntervalId) {
    _probeIntervalId = setInterval(() => {
      pingExtension();
    }, 5000);
  }
}

/**
 * Subscription helper for React useSyncExternalStore or hooks.
 * Used directly by Sidebar and banners for instantaneous updates.
 */
export function subscribeToExtension(callback: () => void): () => void {
  subscribers.add(callback);
  if (typeof window !== "undefined") {
    initExtensionDetection();
  }
  return () => {
    subscribers.delete(callback);
  };
}
