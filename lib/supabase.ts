import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Dynamic redirect URL for Supabase Auth flows (OAuth, magic links, email confirmations).
 * Always derives the base URL from window.location.origin in the browser,
 * with fallback to process.env.NEXT_PUBLIC_APP_URL.
 * Guarantees zero hardcoded localhost:3000 across localhost and production.
 */
export function getAuthRedirectUrl(path: string = "/auth/callback"): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}${path.startsWith("/") ? path : `/${path}`}`;
  }
  const base = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "http://localhost:3000";
  return `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}