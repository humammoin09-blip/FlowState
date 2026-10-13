// FlowState Blocker - Background Service Worker (Manifest V3)
// Manages dynamic declarativeNetRequest rules during FlowState lockdown sessions.

const BASE_RULE_ID = 1000;
const STORAGE_KEY_RULE_IDS = "flowstate_active_rule_ids";
const STORAGE_KEY_LOCKDOWN = "flowstate_lockdown_active";
const STORAGE_KEY_URL = "flowstate_app_url";

console.log("[FlowState Blocker] Service worker loaded and ready.");

/**
 * Checks if a tab's URL matches a blocked domain or path pattern.
 */
function isTabUrlBlocked(tabUrl, blockedPattern) {
  if (!tabUrl || !blockedPattern) return false;
  try {
    const urlObj = new URL(tabUrl);
    const host = urlObj.hostname.replace(/^www\./, "").toLowerCase();
    const pathname = urlObj.pathname.toLowerCase();

    if (blockedPattern.includes("youtube.com/shorts") || blockedPattern === "/shorts") {
      return host.includes("youtube.com") && pathname.startsWith("/shorts");
    }

    let targetHost = blockedPattern
      .replace(/^https?:\/\//i, "")
      .replace(/^www\./i, "")
      .split("/")[0]
      .toLowerCase();

    return host === targetHost || host.endsWith("." + targetHost);
  } catch {
    return false;
  }
}

/**
 * Redirects any already-open tabs that match blocked sites to blocked.html immediately.
 */
function closeOrRedirectActiveTabs(blockedDomains) {
  if (!chrome.tabs || !blockedDomains || blockedDomains.length === 0) return;

  chrome.tabs.query({}, (tabs) => {
    if (chrome.runtime.lastError) {
      console.warn("[FlowState Blocker] Failed to query tabs:", chrome.runtime.lastError.message);
      return;
    }

    const blockedPageUrl = chrome.runtime.getURL("blocked.html");

    for (const tab of tabs) {
      if (!tab.url || !tab.id) continue;
      if (tab.url.startsWith("chrome://") || tab.url.startsWith("chrome-extension://")) continue;

      const shouldBlock = blockedDomains.some((d) => isTabUrlBlocked(tab.url, d));
      if (shouldBlock) {
        console.log(`[FlowState Blocker] Redirecting active distracting tab (${tab.url}) to blocked.html`);
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
 * Activates focus lockdown: removes old rules, generates new dynamic rules, and applies them.
 */
function startLockdown(blockedDomains, flowstateUrl, sendResponse) {
  console.log("[FlowState Blocker] Starting lockdown for domains:", blockedDomains);

  // Save current FlowState tab URL for the redirect button
  if (flowstateUrl) {
    chrome.storage.local.set({ [STORAGE_KEY_URL]: flowstateUrl });
  }

  // First fetch any existing dynamic rules to safely clean them up
  chrome.declarativeNetRequest.getDynamicRules((existingRules) => {
    if (chrome.runtime.lastError) {
      console.error("[FlowState Blocker] Error fetching dynamic rules:", chrome.runtime.lastError.message);
    }

    const existingRuleIds = (existingRules || []).map((r) => r.id);

    // Build new dynamic rules starting from BASE_RULE_ID (1000)
    let nextId = BASE_RULE_ID;
    const newRules = [];
    const newRuleIds = [];

    const domainsToProcess = Array.isArray(blockedDomains) && blockedDomains.length > 0
      ? blockedDomains
      : [
          "instagram.com",
          "reddit.com",
          "tiktok.com",
          "twitter.com",
          "facebook.com",
          "youtube.com/shorts",
        ];

    for (const item of domainsToProcess) {
      if (!item) continue;
      const trimmed = String(item).trim();
      if (!trimmed) continue;

      let urlFilter;
      let priority = 1;

      // Special handling: YouTube Shorts blocked even if youtube.com is allowed
      if (
        trimmed.includes("youtube.com/shorts") ||
        trimmed === "/shorts" ||
        trimmed === "/shorts/*"
      ) {
        urlFilter = "||youtube.com/shorts";
        priority = 2; // Higher priority ensures Shorts is blocked regardless of parent rules
      } else {
        let domain = trimmed.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
        domain = domain.split("/")[0].split("?")[0].split("#")[0];
        urlFilter = `||${domain}`;
      }

      newRules.push({
        id: nextId,
        priority: priority,
        action: {
          type: "redirect",
          redirect: {
            extensionPath: "/blocked.html",
          },
        },
        condition: {
          urlFilter: urlFilter,
          resourceTypes: ["main_frame", "sub_frame"],
        },
      });

      newRuleIds.push(nextId);
      nextId++;
    }

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

        // Intercept any currently active tabs that were already loaded
        closeOrRedirectActiveTabs(domainsToProcess);

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
    startLockdown(message.blockedDomains, message.flowstateUrl, sendResponse);
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
