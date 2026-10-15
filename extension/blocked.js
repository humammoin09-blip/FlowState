// FlowState Blocker - Custom Focus Landing Page Controller
// Renders allowed domain buttons and FlowState settings link. Auto-redirect removed.

(function () {
  const STORAGE_KEY_URL = "flowstate_app_url";
  const STORAGE_KEY_ALLOWLIST = "current_allowlist";
  const DEFAULT_URL = "http://localhost:3000";

  const containerEl = document.getElementById("allowed-domains");
  const settingsLinkEl = document.getElementById("flowstate-settings-link");

  /**
   * Normalizes a raw domain and returns domain-specific icon, display label, and clean URL.
   */
  function getDomainMeta(rawDomain) {
    if (!rawDomain) return null;
    let clean = String(rawDomain).trim().toLowerCase();
    clean = clean.replace(/^https?:\/\//i, "");
    clean = clean.replace(/^www\./i, "");
    clean = clean.split("/")[0].split("?")[0].split("#")[0].split(":")[0];

    if (!clean) return null;

    // 1. YouTube
    if (clean === "youtube.com" || clean.endsWith(".youtube.com") || clean === "youtu.be") {
      return {
        icon: "📺",
        label: "Go to YouTube",
        url: "https://www.youtube.com",
      };
    }

    // 2. GitHub
    if (clean === "github.com" || clean.endsWith(".github.com")) {
      return {
        icon: "💻",
        label: "Go to GitHub",
        url: "https://github.com",
      };
    }

    // 3. Google Search
    if (clean === "google.com" || clean.endsWith(".google.com")) {
      return {
        icon: "🔍",
        label: "Go to Google",
        url: "https://www.google.com",
      };
    }

    // 4. Gemini
    if (clean.includes("gemini.google") || clean === "gemini.com") {
      return {
        icon: "✨",
        label: "Go to Gemini",
        url: "https://gemini.google.com",
      };
    }

    // 5. StackOverflow
    if (clean.includes("stackoverflow.com")) {
      return {
        icon: "📚",
        label: "Go to StackOverflow",
        url: "https://stackoverflow.com",
      };
    }

    // 6. Wikipedia
    if (clean.includes("wikipedia.org")) {
      return {
        icon: "📖",
        label: "Go to Wikipedia",
        url: "https://wikipedia.org",
      };
    }

    // Generic globe icon with capitalized label for others
    const parts = clean.split(".");
    const mainName = parts.length > 1 ? parts[0] : clean;
    const capitalized = mainName.charAt(0).toUpperCase() + mainName.slice(1);

    return {
      icon: "🌐",
      label: `Go to ${capitalized}`,
      url: `https://${clean}`,
    };
  }

  function renderButtons(allowlist) {
    if (!containerEl) return;
    containerEl.innerHTML = "";

    const rawList = Array.isArray(allowlist) ? allowlist : [];
    
    // Filter internal services and local hosts
    const filteredDomains = rawList.filter((d) => {
      if (!d) return false;
      const lower = String(d).toLowerCase().trim();
      return (
        !lower.includes("localhost") &&
        !lower.includes("127.0.0.1") &&
        !lower.includes("chrome.google.com") &&
        !lower.includes("googleapis.com") &&
        !lower.includes("supabase.co") &&
        !lower.includes("vercel.app")
      );
    });

    const seenLabels = new Set();
    const validItems = [];

    for (const d of filteredDomains) {
      const meta = getDomainMeta(d);
      if (meta && !seenLabels.has(meta.label)) {
        seenLabels.add(meta.label);
        validItems.push(meta);
      }
    }

    if (validItems.length === 0) {
      const emptyDiv = document.createElement("div");
      emptyDiv.className = "empty-state";
      emptyDiv.textContent = "No external study domains configured in today's blueprint.";
      containerEl.appendChild(emptyDiv);
      return;
    }

    for (const item of validItems) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "domain-btn";
      btn.innerHTML = `
        <span class="icon">${item.icon}</span>
        <span class="label">${item.label}</span>
        <span class="arrow">→</span>
      `;
      btn.addEventListener("click", () => {
        // Open site in the same tab
        window.location.href = item.url;
      });
      containerEl.appendChild(btn);
    }
  }

  // Load target FlowState URL and allowlist from storage
  if (chrome.storage && chrome.storage.local) {
    chrome.storage.local.get([STORAGE_KEY_URL, STORAGE_KEY_ALLOWLIST], (data) => {
      let targetUrl = DEFAULT_URL;
      if (data && data[STORAGE_KEY_URL]) {
        targetUrl = data[STORAGE_KEY_URL];
      }
      if (settingsLinkEl) {
        settingsLinkEl.href = targetUrl;
        settingsLinkEl.addEventListener("click", (e) => {
          e.preventDefault();
          window.location.href = targetUrl;
        });
      }

      const allowlist = (data && data[STORAGE_KEY_ALLOWLIST]) || [];
      renderButtons(allowlist);
    });
  } else {
    // Fallback if chrome.storage is not available
    renderButtons(["youtube.com", "github.com", "google.com"]);
  }
})();
