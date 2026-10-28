import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NotificationProvider } from "@/lib/NotificationContext";
import { Site2ChatWidget } from "@/components/Site2ChatWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "FlowState — Deep Work & Productivity Dashboard",
  description:
    "Ultra-modern OLED dark theme dashboard for deep focus, task management, and consistency tracking.",
  
  
  verification: {
    google: "etAOPfp7BR3W97U_LhV1VT1mkaHs102fNJ9akPRSvB4",
  },
  

  openGraph: {
    title: "FlowState — Deep Work & Productivity Dashboard",
    description:
      "Ultra-modern OLED dark theme dashboard for deep focus, task management, and consistency tracking.",
    url: appUrl,
    siteName: "FlowState",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FlowState — Deep Work & Productivity Dashboard",
    description:
      "Ultra-modern OLED dark theme dashboard for deep focus, task management, and consistency tracking.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full bg-slate-950 font-sans text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200"
        suppressHydrationWarning
      >
        <NotificationProvider>
          {children}
        </NotificationProvider>
        <Site2ChatWidget />
      </body>
    </html>
  );
}