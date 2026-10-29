"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Flame,
  Check,
  Trash2,
  Menu,
  User,
  HelpCircle,
} from "lucide-react";
import { calculateUserXP, calculateUserLevel } from "@/lib/user-service";
import {
  useNotifications,
  NotificationItem,
  STORAGE_KEY_NOTIFICATIONS,
  NOTIFICATION_EVENT,
} from "@/lib/NotificationContext";

export type { NotificationItem };
export { STORAGE_KEY_NOTIFICATIONS, NOTIFICATION_EVENT };

interface HeaderProps {
  timerActive: boolean;
  timerTime: string;
  userName?: string;
  userTitle?: string;
  onOpenProfile?: () => void;
  userAvatar?: string;
  onToggleMobileMenu?: () => void;
  focusHours?: number;
  completedTasksCount?: number;
}

export function Header({
  timerActive,
  timerTime,
  userName = "Guest User",
  userTitle = "New User",
  onOpenProfile,
  userAvatar = "",
  onToggleMobileMenu,
  focusHours = 0,
  completedTasksCount = 0,
}: HeaderProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [greeting, setGreeting] = useState("Good Afternoon");
  const [currentDateStr, setCurrentDateStr] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    notifications,
    unreadCount,
    markAllAsRead,
    markAsRead,
    clearAllNotifications,
  } = useNotifications();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  const toggleNotifications = () => {
    const nextState = !showNotifications;
    setShowNotifications(nextState);
    if (nextState) {
      markAllAsRead();
    }
  };

  useEffect(() => {
    setIsMounted(true);
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      if (hours < 12) setGreeting("Good Morning");
      else if (hours < 18) setGreeting("Good Afternoon");
      else setGreeting("Good Evening");

      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        month: "short",
        day: "numeric",
      };
      setCurrentDateStr(now.toLocaleDateString("en-US", options));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const currentXP = calculateUserXP(focusHours, completedTasksCount);
  const currentLevel = calculateUserLevel(currentXP);
  const isGuestOrNew = userName === "Guest User" || userName === "New User";

  const initials = isGuestOrNew
    ? "GU"
    : userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 px-3 py-3 backdrop-blur-xl sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            aria-label="Open Navigation Menu"
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80 text-slate-300 transition hover:border-slate-700 hover:text-white md:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1
                className="truncate text-base font-semibold tracking-tight text-slate-50 sm:text-xl"
                suppressHydrationWarning
              >
                {greeting}, {userName.split(" ")[0]}
              </h1>
              <span className="inline-flex h-2.5 w-2.5 flex-shrink-0 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.9)]" />
            </div>
            <p
              className="mt-1 flex items-center gap-2 truncate text-[10px] font-medium text-slate-400 sm:text-xs"
              suppressHydrationWarning
            >
              <span>{isMounted ? currentDateStr : ""}</span>
              {isMounted && currentDateStr ? <span className="h-1 w-1 rounded-full bg-slate-600" /> : null}
              <span className="text-emerald-400">Optimal Focus Window</span>
            </p>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-medium text-emerald-300 lg:flex">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/80" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            {timerActive ? `Deep focus ${timerTime}` : "Flow state ready"}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="relative hidden items-center lg:flex">
            <Search className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks, sessions, commands..."
              className="w-64 rounded-xl border border-slate-800 bg-slate-900/80 py-2 pl-9 pr-11 text-xs text-slate-200 placeholder:text-slate-500 focus:border-emerald-500/40 focus:outline-none"
            />
            <kbd className="absolute right-2.5 rounded-md border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
              ⌘K
            </kbd>
          </div>

          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("flowstate_open_welcome_modal"));
              }
            }}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80 text-slate-300 transition hover:border-slate-700 hover:text-white"
            aria-label="Welcome Guide"
            title="Open Welcome Guide"
          >
            <HelpCircle className="h-4 w-4" />
          </button>

          <div ref={dropdownRef} className="relative flex-shrink-0">
            <button
              type="button"
              onClick={toggleNotifications}
              aria-label="Notifications"
              aria-expanded={showNotifications}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80 text-slate-300 transition hover:border-slate-700 hover:text-white"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border border-slate-950 bg-emerald-400 px-1 text-[9px] font-bold text-slate-950">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                  className="absolute right-0 top-full z-50 mt-2 w-[min(22rem,calc(100vw-1.5rem))] rounded-2xl border border-slate-800 bg-slate-950/95 p-4 shadow-2xl"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                        Notifications
                      </span>
                      {unreadCount > 0 ? (
                        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                          {unreadCount} New
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                          All caught up
                        </span>
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={markAllAsRead}
                          className="inline-flex items-center gap-1 text-[10px] text-slate-400 transition hover:text-emerald-400"
                        >
                          <Check className="h-3 w-3" />
                          Read
                        </button>
                        <span className="text-slate-700">•</span>
                        <button
                          type="button"
                          onClick={clearAllNotifications}
                          className="inline-flex items-center gap-1 text-[10px] text-slate-400 transition hover:text-rose-400"
                        >
                          <Trash2 className="h-3 w-3" />
                          Clear
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 max-h-80 space-y-2 overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400">No notifications yet</div>
                    ) : (
                      notifications.map((n, idx) => (
                        <div
                          key={n.id || `notif-${idx}`}
                          onClick={() => {
                            if (!n.read) markAsRead(n.id);
                            if (String(n.title).toLowerCase().includes("welcome to flowstate")) {
                              if (typeof window !== "undefined") {
                                window.dispatchEvent(new CustomEvent("flowstate_open_welcome_modal"));
                              }
                              setShowNotifications(false);
                            }
                          }}
                          className={`flex cursor-pointer items-start gap-2.5 rounded-xl border p-2.5 text-left transition ${
                            n.read
                              ? "border-slate-800 bg-slate-900/60 opacity-80 hover:bg-slate-900"
                              : "border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/15"
                          }`}
                        >
                          <div
                            className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border ${
                              n.type === "pomodoro"
                                ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                                : n.type === "task"
                                  ? "border-cyan-500/20 bg-cyan-500/10 text-cyan-400"
                                  : n.type === "streak"
                                    ? "border-orange-500/20 bg-orange-500/10 text-orange-400"
                                    : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                            }`}
                          >
                            {n.type === "pomodoro" ? (
                              <Clock className="h-3.5 w-3.5" />
                            ) : n.type === "task" ? (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            ) : n.type === "streak" ? (
                              <Flame className="h-3.5 w-3.5" />
                            ) : (
                              <Zap className="h-3.5 w-3.5" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={`break-words text-xs leading-snug ${n.read ? "text-slate-300" : "font-semibold text-white"}`}>
                              {n.title}
                            </p>
                            <p className="mt-1 text-[10px] text-slate-400">{n.time}</p>
                          </div>
                          {!n.read && <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />}
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div
            onClick={onOpenProfile}
            className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900/80 px-2 py-1.5 transition hover:border-slate-700"
            title="Click to edit profile"
          >
            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-slate-700 bg-gradient-to-br from-emerald-400 via-cyan-500 to-indigo-500 p-[1px]">
                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[10px] bg-slate-950 text-xs font-semibold text-slate-100">
                  {userAvatar && (userAvatar.startsWith("data:image/") || userAvatar.startsWith("http")) ? (
                    <img src={userAvatar} alt={userName} className="h-full w-full object-cover" />
                  ) : userAvatar ? (
                    <span className="text-sm">{userAvatar}</span>
                  ) : isGuestOrNew ? (
                    <User className="h-4 w-4 text-slate-300" />
                  ) : (
                    initials
                  )}
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-slate-950 bg-amber-400 text-[8px] font-bold text-slate-950">
                {currentLevel}
              </span>
            </div>

            <div className="hidden sm:flex sm:flex-col">
              <span className="flex items-center gap-1 text-xs font-semibold text-slate-100">
                {userName}
                {!isGuestOrNew && <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />}
              </span>
              <span className="text-[10px] text-slate-400">
                {userTitle} • {currentXP.toLocaleString()} XP
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
