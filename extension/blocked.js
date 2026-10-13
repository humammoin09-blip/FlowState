// FlowState Blocker - Blocked Page Controller
// Displays countdown and automatically redirects back to FlowState after 3 seconds.

(function () {
  const STORAGE_KEY_URL = "flowstate_app_url";
  const DEFAULT_URL = "http://localhost:3000";

  let secondsLeft = 3;
  let targetUrl = DEFAULT_URL;

  const countdownEl = document.getElementById("countdown");
  const progressEl = document.getElementById("progress");
  const returnLinkEl = document.getElementById("return-link");

  function updateUi() {
    if (countdownEl) {
      countdownEl.textContent = `${secondsLeft}s`;
    }
    if (progressEl) {
      const percentage = (secondsLeft / 3) * 100;
      progressEl.style.width = `${percentage}%`;
    }
  }

  function redirectNow() {
    console.log("[FlowState Blocker] Redirecting to FlowState:", targetUrl);
    window.location.href = targetUrl;
  }

  // Load target FlowState URL from storage
  if (chrome.storage && chrome.storage.local) {
    chrome.storage.local.get([STORAGE_KEY_URL], (data) => {
      if (data && data[STORAGE_KEY_URL]) {
        targetUrl = data[STORAGE_KEY_URL];
      }
      if (returnLinkEl) {
        returnLinkEl.href = targetUrl;
      }
    });
  }

  // Handle immediate click
  if (returnLinkEl) {
    returnLinkEl.addEventListener("click", (e) => {
      e.preventDefault();
      redirectNow();
    });
  }

  updateUi();

  const timer = setInterval(() => {
    secondsLeft -= 1;
    updateUi();

    if (secondsLeft <= 0) {
      clearInterval(timer);
      redirectNow();
    }
  }, 1000);
})();
