/**
 * Configuration and pattern constants for the FlowState companion Chrome extension.
 */

// NOTE: When deploying to production, update "https://*.yourdomain.com/*" with your production domain (e.g. "https://flowstate.app/*" or Vercel URL)
export const EXTENSION_CONTENT_SCRIPT_MATCHES = [
  "http://localhost:3000/*",
  "https://flowstate-deepwork.vercel.app/*",
];

/**
 * Returns dynamic match patterns based on configured APP_URL and window.origin.
 */
export function getActiveExtensionMatches(): string[] {
  const matches = new Set<string>(["http://localhost:3000/*"]);

  if (process.env.NEXT_PUBLIC_APP_URL) {
    try {
      const url = new URL(process.env.NEXT_PUBLIC_APP_URL);
      matches.add(`${url.origin}/*`);
    } catch {}
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    matches.add(`${window.location.origin}/*`);
  }

  return Array.from(matches);
}
