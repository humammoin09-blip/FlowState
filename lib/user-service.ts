import { supabase } from "./supabase";

export interface UserProfile {
  id: string;
  name: string;
  title: string;
  avatar: string;
  isGuest: boolean;
  email?: string;
  dailyGoal: number;
}

const GUEST_ID_KEY = "flowstate_current_guest_id";
const USER_ID_KEY = "flowstate_active_user_id";

/**
 * Returns a persistent unique identifier for the guest session on this browser
 */
export function getOrCreateGuestId(): string {
  if (typeof window === "undefined") return "guest_default";
  let guestId = localStorage.getItem(GUEST_ID_KEY);
  if (!guestId) {
    const nowIso = new Date().toISOString();
    guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(GUEST_ID_KEY, guestId);
    localStorage.setItem(`flowstate_account_created_at_${guestId}`, nowIso);
    localStorage.setItem("flowstate_account_created_at", nowIso);
  } else if (!localStorage.getItem(`flowstate_account_created_at_${guestId}`)) {
    const parts = guestId.split("_");
    const ts = parseInt(parts[1], 10);
    const dateStr = !isNaN(ts) && ts > 0 ? new Date(ts).toISOString() : new Date().toISOString();
    localStorage.setItem(`flowstate_account_created_at_${guestId}`, dateStr);
  }
  return guestId;
}

/**
 * Sanitizes legacy mock data out of localStorage so returning users don't see mock 'Alex Vance' / 'Bateman'
 */
export function purgeLegacyMockData(): void {
  if (typeof window === "undefined") return;
  const legacyName = localStorage.getItem("flowstate_user_name");
  if (legacyName === "Alex Vance" || legacyName === "Bateman" || legacyName === "Patrick Bateman") {
    localStorage.removeItem("flowstate_user_name");
  }
  const legacyTitle = localStorage.getItem("flowstate_user_title");
  if (legacyTitle === "Flow Master") {
    localStorage.removeItem("flowstate_user_title");
  }
}

/**
 * Resolves the active user profile from Supabase Auth or local guest storage
 */
export async function resolveActiveUserProfile(): Promise<UserProfile> {
  purgeLegacyMockData();

  let authUser = null;
  try {
    const { data } = await supabase.auth.getUser();
    authUser = data?.user || null;
  } catch (err) {
    console.warn("Supabase auth check notice:", err);
  }

  if (authUser) {
    const userId = authUser.id;
    if (typeof window !== "undefined") {
      localStorage.setItem(USER_ID_KEY, userId);
      if (authUser.created_at) {
        localStorage.setItem(`flowstate_account_created_at_${userId}`, authUser.created_at);
      }
    }

    const emailName = authUser.email ? authUser.email.split("@")[0] : "";
    const metaName =
      authUser.user_metadata?.full_name ||
      authUser.user_metadata?.name ||
      authUser.user_metadata?.user_name;

    const storedName = typeof window !== "undefined" ? localStorage.getItem(`flowstate_name_${userId}`) : null;
    const storedTitle = typeof window !== "undefined" ? localStorage.getItem(`flowstate_title_${userId}`) : null;
    const storedAvatar = typeof window !== "undefined" ? localStorage.getItem(`flowstate_avatar_${userId}`) : null;
    const storedGoal = typeof window !== "undefined" ? localStorage.getItem(`flowstate_goal_${userId}`) : null;

    return {
      id: userId,
      name: storedName || metaName || emailName || "Guest User",
      title: storedTitle || (storedName || metaName ? "Flow State Practitioner" : "New User"),
      avatar: storedAvatar || "",
      isGuest: false,
      email: authUser.email,
      dailyGoal: storedGoal ? parseFloat(storedGoal) : 6,
    };
  }

  // Unauthenticated / Guest User
  const guestId = getOrCreateGuestId();
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_ID_KEY, guestId);
  }

  let guestName = "Guest User";
  let guestTitle = "New User";
  let guestAvatar = "";
  let guestGoal = 6;

  if (typeof window !== "undefined") {
    const savedName = localStorage.getItem(`flowstate_name_${guestId}`) || localStorage.getItem("flowstate_user_name");
    const savedTitle = localStorage.getItem(`flowstate_title_${guestId}`) || localStorage.getItem("flowstate_user_title");
    const savedAvatar = localStorage.getItem(`flowstate_avatar_${guestId}`) || localStorage.getItem("flowstate_user_avatar");
    const savedGoal = localStorage.getItem(`flowstate_goal_${guestId}`) || localStorage.getItem("flowstate_daily_goal");

    if (savedName && savedName !== "Alex Vance" && savedName !== "Bateman") {
      guestName = savedName;
    }
    if (savedTitle && savedTitle !== "Flow Master") {
      guestTitle = savedTitle;
    } else if (savedName && savedName !== "Guest User") {
      guestTitle = "Flow State Practitioner";
    }
    if (savedAvatar) {
      guestAvatar = savedAvatar;
    }
    if (savedGoal) {
      guestGoal = parseFloat(savedGoal) || 6;
    }
  }

  return {
    id: guestId,
    name: guestName,
    title: guestTitle,
    avatar: guestAvatar,
    isGuest: true,
    dailyGoal: guestGoal,
  };
}

/**
 * Encodes userId into mode column to isolate focus sessions across users in Supabase
 */
export function encodeSessionMode(mode: string, userId: string): string {
  return `${mode}::uid:${userId}`;
}

/**
 * Extracts clean mode name from stored session mode string
 */
export function decodeSessionMode(storedMode: string | null | undefined): string {
  if (!storedMode) return "focus";
  return storedMode.split("::uid:")[0] || "focus";
}

/**
 * Filters sessions that belong strictly to the provided userId
 */
export function filterSessionsByUserId<T extends { mode?: string | null | undefined }>(
  sessions: T[],
  userId: string
): T[] {
  if (!Array.isArray(sessions)) return [];
  return sessions.filter((s) => {
    if (!s.mode) return false;
    // Check if session has the user's tag
    return s.mode.includes(`::uid:${userId}`);
  });
}

/**
 * Encodes userId into task duration to isolate tasks across users in Supabase
 */
export function encodeTaskDuration(duration: string, userId: string): string {
  return `${duration}::uid:${userId}`;
}

/**
 * Extracts clean duration display string (e.g. '5m')
 */
export function decodeTaskDuration(storedDuration: string | null | undefined): string {
  if (!storedDuration) return "5m";
  return storedDuration.split("::uid:")[0] || "5m";
}

/**
 * Filters tasks that belong strictly to the provided userId
 */
export function filterTasksByUserId<T extends { duration?: string | null | undefined }>(
  tasks: T[],
  userId: string
): T[] {
  if (!Array.isArray(tasks)) return [];
  return tasks.filter((t) => {
    if (!t.duration) return false;
    return t.duration.includes(`::uid:${userId}`);
  });
}

/**
 * Dynamically computes XP based on real focus hours and completed tasks. Starts at 0 for new users.
 */
export function calculateUserXP(focusHours: number, completedTasks: number): number {
  const safeHours = Math.max(0, focusHours || 0);
  const safeTasks = Math.max(0, completedTasks || 0);
  return Math.round(safeHours * 100 + safeTasks * 50);
}

/**
 * Computes level based on XP (starts at Level 1 with 0 XP)
 */
export function calculateUserLevel(xp: number): number {
  return Math.max(1, Math.floor(xp / 500) + 1);
}
