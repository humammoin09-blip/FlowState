// FlowState Blocker - Background Service Worker (Manifest V3)
// Manages dynamic declarativeNetRequest rules during FlowState lockdown sessions using an ALLOWLIST approach.

const BASE_RULE_ID = 1000;
const STORAGE_KEY_RULE_IDS = "flowstate_active_rule_ids";
const STORAGE_KEY_LOCKDOWN = "flowstate_lockdown_active";
const STORAGE_KEY_URL = "flowstate_app_url";

// Safety allowlist that is ALWAYS allowed (cannot be removed by user)
// Ensures FlowState itself, Supabase, Google search, and essential services never get blocked.
const SAFETY_ALLOWLIST = [
  "localhost",
  "127.0.0.1",
  "chrome.google.com",
  "googleapis.com",
  "supabase.co",
  "vercel.app",
  "google.com", // for search
];

console.log("[FlowState Blocker] Service worker loaded and ready.");

/**
 * Normalizes a domain string: removes protocol, www, paths, ports, and queries.
 */
function cleanDomain(item) {
  if (!item) return "";
  let d = String(item).trim().toLowerCase();
  d = d.replace(/^https?:\/\//i, "");
  d = d.split("/")[0].split("?")[0].split("#")[0].split(":")[0];
  d = d.replace(/^www\./i, "");
  return d;
}

/**
 * Converts a blocked path pattern into a DeclarativeNetRequest urlFilter.
 * Higher priority rules (priority: 2) will block these paths even if the parent domain is allowlisted.
 */
function getPathUrlFilter(rawPath) {
  if (!rawPath) return null;
  let p = String(rawPath).trim().toLowerCase();
  if (!p) return null;

  p = p.replace(/^https?:\/\//i, "").replace(/^www\./i, "");

  // Special handling for YouTube Shorts
  if (
    p === "/shorts" ||
    p === "/shorts/*" ||
    p.includes("youtube.com/shorts")
  ) {
    return "||youtube.com/shorts";
  }

  if (p.startsWith("/")) {
    const clean = p.replace(/\/\*$/, "");
    return `*://*${clean}*`;
  }

  if (p.includes("/")) {
    const clean = p.replace(/\/\*$/, "");
    return `||${clean}`;
  }

  return `||${p}`;
}

/**
 * Checks if a tab's URL is allowed during lockdown.
 * Returns true if allowed, false if it should be blocked.
 */
function isTabUrlAllowed(tabUrl, excludedDomains, blockedPaths) {
  if (!tabUrl) return true;
  if (
    tabUrl.startsWith("chrome://") ||
    tabUrl.startsWith("chrome-extension://") ||
    tabUrl.startsWith("edge://") ||
    tabUrl.startsWith("about:") ||
    tabUrl.startsWith("devtools://")
  ) {
    return true;
  }

  try {
    const urlObj = new URL(tabUrl);
    const host = urlObj.hostname.replace(/^www\./i, "").toLowerCase();
    const pathname = urlObj.pathname.toLowerCase();

    // 1. First check if any blocked path matches (priority 2 override)
    if (Array.isArray(blockedPaths)) {
      for (const bp of blockedPaths) {
        if (!bp) continue;
        const pattern = bp.trim().toLowerCase();
        if (
          pattern.includes("youtube.com/shorts") ||
          pattern === "/shorts" ||
          pattern === "/shorts/*"
        ) {
          if (host.includes("youtube.com") && pathname.startsWith("/shorts")) {
            return false; // Blocked path!
          }
        } else if (pattern.includes("/")) {
          let pat = pattern.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
          const slashIdx = pat.indexOf("/");
          const patDomain = pat.slice(0, slashIdx);
          const patPath = pat.slice(slashIdx).replace(/\/\*$/, "");
          if ((!patDomain || host === patDomain || host.endsWith("." + patDomain)) && pathname.startsWith(patPath)) {
            return false;
          }
        }
      }
    }

    // 2. Check if host is in allowlist (including SAFETY_ALLOWLIST)
    const isAllowed = excludedDomains.some((allowed) => {
      const clean = cleanDomain(allowed);
      if (!clean) return false;
      return host === clean || host.endsWith("." + clean);
    });

    return isAllowed;
  } catch {
    return true;
  }
}

/**
 * Redirects any already-open tabs that are not on the allowlist (or match blocked paths) to blocked.html immediately.
 */
function closeOrRedirectActiveTabs(excludedDomains, blockedPaths) {
  if (!chrome.tabs) return;

  chrome.tabs.query({}, (tabs) => {
    if (chrome.runtime.lastError) {
      console.warn("[FlowState Blocker] Failed to query tabs:", chrome.runtime.lastError.message);
      return;
    }

    const blockedPageUrl = chrome.runtime.getURL("blocked.html");

    for (const tab of tabs) {
      if (!tab.url || !tab.id) continue;
      if (tab.url.startsWith("chrome://") || tab.url.startsWith("chrome-extension://")) continue;

      const allowed = isTabUrlAllowed(tab.url, excludedDomains, blockedPaths);
      if (!allowed) {
        console.log(`[FlowState Blocker] Redirecting active non-allowlisted tab (${tab.url}) to blocked.html`);
        chrome.tabs.update(tab.id, { url: blockedPageUrl }, () => {
          if (chrome.runtime.lastError) {
            console.debug("[FlowState Blocker] tab.update notice:", chrome.runtime.lastError.message);
          }
        });
      }
    }
  });
}

/**
 * Activates focus lockdown:
 * 1. Creates ONE broad blocking rule for ALL URLs (urlFilter: "*", priority: 1)
 *    with excludedRequestDomains set to the user allowlist + SAFETY_ALLOWLIST.
 * 2. Creates higher-priority rules (priority: 2) for blockedPaths (e.g. /shorts).
 * 3. Applies dynamic rules via chrome.declarativeNetRequest.
 */
function startLockdown(allowlistDomains, blockedPaths, flowstateUrl, sendResponse) {
  console.log("[FlowState Blocker] Starting lockdown with allowlistDomains:", allowlistDomains, "blockedPaths:", blockedPaths);

  const userAllowed = Array.isArray(allowlistDomains) ? allowlistDomains : [];

  // Save current FlowState tab URL and current allowlist for the blocked landing page
  const storageUpdate = { current_allowlist: userAllowed };
  if (flowstateUrl) {
    storageUpdate[STORAGE_KEY_URL] = flowstateUrl;
  }
  chrome.storage.local.set(storageUpdate);
  const pathsToProcess = Array.isArray(blockedPaths) ? blockedPaths : [];

  // Extract domain from flowstateUrl if present so the app itself is never blocked
  let appDomain = "";
  if (flowstateUrl) {
    appDomain = cleanDomain(flowstateUrl);
  }

  // Combined excludedRequestDomains: user allowlist + SAFETY_ALLOWLIST (+ app domain)
  const allExcludedDomains = Array.from(
    new Set(
      [...userAllowed, ...SAFETY_ALLOWLIST, appDomain]
        .map(cleanDomain)
        .filter((d) => Boolean(d) && !d.includes("/"))
    )
  );

  console.log("[FlowState Blocker] Combined excluded request domains for broad rule:", allExcludedDomains);

  // First fetch any existing dynamic rules to safely clean them up
  chrome.declarativeNetRequest.getDynamicRules((existingRules) => {
    if (chrome.runtime.lastError) {
      console.error("[FlowState Blocker] Error fetching dynamic rules:", chrome.runtime.lastError.message);
    }

    const existingRuleIds = (existingRules || []).map((r) => r.id);

    // Rule 1: Broad blocking rule for ALL URLs (priority: 1)
    const newRules = [
      {
        id: BASE_RULE_ID, // 1000
        priority: 1,
        action: {
          type: "redirect",
          redirect: {
            extensionPath: "/blocked.html",
          },
        },
        condition: {
          urlFilter: "*",
          resourceTypes: ["main_frame"],
          excludedRequestDomains: allExcludedDomains,
        },
      },
    ];
    const newRuleIds = [BASE_RULE_ID];
    let nextId = BASE_RULE_ID + 1;

    // Rules 2+: Higher-priority path blocking rules (priority: 2) overriding allowlist
    const pathFilters = new Set();
    for (const item of pathsToProcess) {
      const filter = getPathUrlFilter(item);
      if (filter) {
        pathFilters.add(filter);
      }
    }

    for (const filter of pathFilters) {
      newRules.push({
        id: nextId,
        priority: 2, // Higher priority ensures blocked paths override allowlist
        action: {
          type: "redirect",
          redirect: {
            extensionPath: "/blocked.html",
          },
        },
        condition: {
          urlFilter: filter,
          resourceTypes: ["main_frame"],
        },
      });
      newRuleIds.push(nextId);
      nextId++;
    }

    console.log(`[FlowState Blocker] Installing ${newRules.length} dynamic rules:`, newRules);

    chrome.declarativeNetRequest.updateDynamicRules(
      {
        removeRuleIds: existingRuleIds,
        addRules: newRules,
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error("[FlowState Blocker] Failed to updateDynamicRules:", chrome.runtime.lastError.message);
          if (sendResponse) sendResponse({ success: false, error: chrome.runtime.lastError.message });
          return;
        }

        console.log(`[FlowState Blocker] Successfully installed ${newRules.length} dynamic blocking rules:`, newRuleIds);

        chrome.storage.local.set({
          [STORAGE_KEY_RULE_IDS]: newRuleIds,
          [STORAGE_KEY_LOCKDOWN]: true,
        });

        // Intercept any currently active tabs that are not allowlisted or match blocked paths
        closeOrRedirectActiveTabs(allExcludedDomains, pathsToProcess);

        if (sendResponse) sendResponse({ success: true, count: newRules.length, ruleIds: newRuleIds });
      }
    );
  });
}

/**
 * Ends focus lockdown: removes all dynamic rules and clears storage state.
 */
function endLockdown(sendResponse) {
  console.log("[FlowState Blocker] Ending lockdown. Clearing all dynamic rules...");

  chrome.storage.local.get([STORAGE_KEY_RULE_IDS], (data) => {
    const savedRuleIds = data[STORAGE_KEY_RULE_IDS] || [];

    chrome.declarativeNetRequest.getDynamicRules((existingRules) => {
      const currentRuleIds = (existingRules || []).map((r) => r.id);
      const allIdsToRemove = Array.from(new Set([...savedRuleIds, ...currentRuleIds]));

      if (allIdsToRemove.length === 0) {
        console.log("[FlowState Blocker] No active rules to remove.");
        chrome.storage.local.set({ [STORAGE_KEY_RULE_IDS]: [], [STORAGE_KEY_LOCKDOWN]: false });
        if (sendResponse) sendResponse({ success: true, removedCount: 0 });
        return;
      }

      chrome.declarativeNetRequest.updateDynamicRules(
        {
          removeRuleIds: allIdsToRemove,
        },
        () => {
          if (chrome.runtime.lastError) {
            console.error("[FlowState Blocker] Failed to remove dynamic rules:", chrome.runtime.lastError.message);
            if (sendResponse) sendResponse({ success: false, error: chrome.runtime.lastError.message });
            return;
          }

          console.log("[FlowState Blocker] Successfully removed all dynamic rules:", allIdsToRemove);
          chrome.storage.local.set({
            [STORAGE_KEY_RULE_IDS]: [],
            [STORAGE_KEY_LOCKDOWN]: false,
          });

          if (sendResponse) sendResponse({ success: true, removedCount: allIdsToRemove.length });
        }
      );
    });
  });
}

// Runtime message listener for content script requests
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || !message.type) return false;

  console.log("[FlowState Blocker] Received message in background:", message.type, message);

  if (message.type === "FLOWSTATE_LOCKDOWN_START") {
    const allowlist = message.allowlistDomains || [];
    const paths = message.blockedPaths || [];
    chrome.storage.local.set({ current_allowlist: allowlist });
    startLockdown(allowlist, paths, message.flowstateUrl, sendResponse);
    return true; // Keep message channel open for async response
  }

  if (message.type === "FLOWSTATE_LOCKDOWN_END") {
    endLockdown(sendResponse);
    return true; // Keep message channel open for async response
  }

  if (message.type === "GET_LOCKDOWN_STATUS") {
    chrome.storage.local.get([STORAGE_KEY_LOCKDOWN, STORAGE_KEY_RULE_IDS], (data) => {
      sendResponse({
        isActive: !!data[STORAGE_KEY_LOCKDOWN],
        ruleCount: (data[STORAGE_KEY_RULE_IDS] || []).length,
      });
    });
    return true;
  }

  return false;
});
