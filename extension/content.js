// FlowState Blocker - Content Script Bridge
// Listens for window.postMessage events from the FlowState web app and forwards them to background.js

console.log("[FlowState content.js] Content script initialized on:", window.location.href);

// Signal that FlowState Blocker extension is active and installed
try {
  localStorage.setItem("flowstate_extension_installed", "true");
  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.setAttribute("data-flowstate-extension-installed", "true");
  }
} catch (e) {
  // Ignore storage exceptions in sandboxed contexts
}

// Broadcast ready heartbeat to window
window.postMessage(
  {
    source: "flowstate-extension",
    type: "FLOWSTATE_EXTENSION_HEARTBEAT",
    version: "1.1.0",
  },
  "*"
);

window.addEventListener("message", (event) => {
  // Only accept messages with FlowState source identifier
  if (!event.data || event.data.source !== "flowstate-focus-chamber") return;

  const { type, payload } = event.data;
  console.log("[FlowState content.js] Received postMessage from web app:", type, payload);

  // Ping probe to verify extension is active
  if (type === "FLOWSTATE_PING_EXTENSION") {
    try {
      localStorage.setItem("flowstate_extension_installed", "true");
      if (typeof document !== "undefined" && document.documentElement) {
        document.documentElement.setAttribute("data-flowstate-extension-installed", "true");
      }
    } catch (e) {}

    window.postMessage(
      {
        source: "flowstate-extension",
        type: "FLOWSTATE_EXTENSION_PONG",
        version: "1.1.0",
      },
      "*"
    );
    return;
  }

  if (type === "FLOWSTATE_LOCKDOWN_START") {
    console.log('[FlowState content.js] Forwarding to background:', event.data.type);

    const allowlistDomains = (payload && Array.isArray(payload.allowlistDomains))
      ? payload.allowlistDomains
      : [];
    const blockedPaths = (payload && Array.isArray(payload.blockedPaths))
      ? payload.blockedPaths
      : [];

    chrome.runtime.sendMessage(
      {
        type: "FLOWSTATE_LOCKDOWN_START",
        allowlistDomains,
        blockedPaths,
        flowstateUrl: window.location.href,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.warn("[FlowState content.js] sendMessage error:", chrome.runtime.lastError.message);
        } else {
          console.log("[FlowState content.js] Background response for LOCKDOWN_START:", response);
        }
      }
    );
  } else if (type === "FLOWSTATE_LOCKDOWN_END") {
    console.log('[FlowState content.js] Forwarding to background:', event.data.type);

    chrome.runtime.sendMessage(
      {
        type: "FLOWSTATE_LOCKDOWN_END",
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.warn("[FlowState content.js] sendMessage error:", chrome.runtime.lastError.message);
        } else {
          console.log("[FlowState content.js] Background response for LOCKDOWN_END:", response);
        }
      }
    );
  }
});
