# FlowState Blocker — Chrome Extension (Manifest V3)

A Chrome extension companion for the FlowState web application. It enforces distraction-free lockdown during deep work sessions by dynamically blocking distracting websites and sub-paths (including YouTube Shorts) using Chrome's Declarative Net Request API.

---

## 🚀 Features

- **Dynamic DeclarativeNetRequest Blocking**: Blocks configured distracting domains (e.g., `instagram.com`, `reddit.com`, `tiktok.com`, `twitter.com`, `facebook.com`) without performance overhead.
- **YouTube Shorts Granular Blocking**: Handles `||youtube.com/shorts` specifically with high priority, allowing productive YouTube videos/tutorials while completely blocking Shorts.
- **Instant Tab Interception**: When lockdown starts, any distracting tabs that are already open immediately redirect to the FlowState blocked screen.
- **Dark-Themed Blocked Landing Page**: Shows a clean interface reminding you of your active deep work session with a 3-second auto-redirect countdown back to FlowState.
- **Seamless Web App Bridge**: Listens for window `postMessage` events (`FLOWSTATE_LOCKDOWN_START` and `FLOWSTATE_LOCKDOWN_END`) transmitted from the Focus Chamber.

---

## 🛠️ Step-by-Step Installation Guide

### 1. Open Chrome Extensions
1. In Google Chrome, navigate to:
   ```text
   chrome://extensions
   ```
   *(Or click the puzzle icon in the top-right toolbar and select **Manage Extensions**).*

### 2. Enable Developer Mode
1. In the top-right corner of the `chrome://extensions` page, toggle the **Developer mode** switch to **ON**.

### 3. Load Unpacked Extension
1. Click the **Load unpacked** button in the top-left corner.
2. In the folder picker dialog, select the `extension` folder located inside this project:
   ```text
   <path-to-flowstate-project>/extension
   ```
3. Click **Select Folder** (or **Open**).
4. You should now see **FlowState Blocker** listed with version `1.0.0` and its service worker active.

---

## 🔍 How to Debug Using the Service Worker Console

1. Navigate to `chrome://extensions`.
2. Locate the **FlowState Blocker** card.
3. Click the blue link that says **service worker** next to "Inspect views".
4. Chrome DevTools will open, attached directly to the background service worker.
5. In the **Console** tab, you will see real-time log messages such as:
   - `[FlowState Blocker] Service worker loaded and ready.`
   - `[FlowState Blocker] Starting lockdown for domains: [...]`
   - `[FlowState Blocker] Successfully installed X dynamic blocking rules: [1000, 1001, ...]`
   - `[FlowState Blocker] Ending lockdown. Clearing all dynamic rules...`

To inspect the content script bridge on the FlowState app:
1. Open your FlowState web tab (`http://localhost:3000`).
2. Open regular Chrome DevTools (`F12` or `Ctrl+Shift+I`).
3. View the **Console** tab to observe:
   - `[FlowState Blocker] Content script initialized on: http://localhost:3000`
   - `[FlowState Blocker] Received postMessage from web app: FLOWSTATE_LOCKDOWN_START`

---

## 🔄 How to Update When Code Changes

Whenever you modify any file inside `extension/` (such as `background.js`, `content.js`, `manifest.json`, or `blocked.html`):

1. Navigate to:
   ```text
   chrome://extensions
   ```
2. Locate the **FlowState Blocker** card.
3. Click the circular **Reload** icon (🔄) in the bottom-right corner of the card.
4. Refresh your FlowState web tab (`http://localhost:3000`) so the updated content script injects cleanly.

---

## 🧪 Testing the Lockdown Workflow

1. Start your FlowState web development server:
   ```bash
   npm run dev
   ```
2. Open `http://localhost:3000` in Google Chrome.
3. Start a Pomodoro Focus session (click **Start Focus**).
4. In another tab, try opening any blocked site (e.g., `https://www.reddit.com` or `https://www.youtube.com/shorts`).
5. Chrome will intercept the request and redirect you to `blocked.html`:
   - *"🚫 Focus Lockdown Active. This site is blocked during your FlowState session. Return to FlowState."*
   - After 3 seconds, it will automatically redirect you back to FlowState.
6. When your timer completes or you pause/panic quit the session, `FLOWSTATE_LOCKDOWN_END` triggers and all blocking rules are immediately lifted.
