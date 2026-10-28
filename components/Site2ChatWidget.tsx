"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";

export function Site2ChatWidget() {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/auth");

  useEffect(() => {
    // If the widget was already mounted and user navigated to an auth route, hide it
    const widgetHost = document.querySelector("[data-site2chat]") as HTMLElement | null;
    if (widgetHost) {
      widgetHost.style.display = isAuthPage ? "none" : "";
    }
  }, [isAuthPage]);

  // Do not load or execute the widget script on authentication or sensitive pages
  if (isAuthPage) {
    return null;
  }

  return (
    <Script
      id="site2chat-widget"
      src="https://site2chat.vercel.app/widget.js"
      data-chatbot-id="bfeada37-91f2-4626-996d-7923f761db54"
      data-chatbot-name="Flowstate deepwork assistant"
      strategy="afterInteractive"
    />
  );
}
