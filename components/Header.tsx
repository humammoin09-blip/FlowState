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

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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

  // Toggle dropdown and mark all notifications as read when opening
  const toggleNotifications = () => {
    const nextState = !showNotifications;
    setShowNotifications(nextState);
    if (nextState) {
      markAllAsRead();
    }
  };

  // Update header greeting and date
  useEffect(() => {
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

  // Dynamic XP & Level calculation
  const currentXP = calculateUserXP(focusHours, completedTasksCount);
  const currentLevel = calculateUserLevel(currentXP);
  const isGuestOrNew = userName === "Guest User" || userName === "New User";

  // Get user initials for avatar fallback
  const initials = isGuestOrNew
    ? "GU"
    : userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

  return (
    <header className="sticky top-0 z-40 w-full px-3 sm:px-6 py-3 sm:py-4 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between gap-3">
      {/* Left: Mobile Hamburger Toggle + Greeting Banner & Live Status */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          aria-label="Open Navigation Menu"
          className="md:hidden p-2 -ml-1 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors flex-shrink-0 cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <h1 className="text-base sm:text-xl md:text-2xl font-extrabold tracking-tight text-white flex items-center gap-1.5 sm:gap-2 truncate">
              <span className="truncate">{greeting}, {userName.split(" ")[0]}</span>
              <span className="inline-block animate-bounce text-amber-400 flex-shrink-0">
                ⚡
              </span>
            </h1>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5 flex items-center gap-1.5 sm:gap-2 truncate">
            <span>{currentDateStr || "Thursday, Sep 24"}</span>
            <span className="w-1 h-1 rounded-full bg-slate-600 flex-shrink-0" />
            <span className="text-emerald-400 font-medium truncate">
              Optimal Focus Window
            </span>
          </p>
        </div>

        {/* Live Focus Status Indicator Pill */}
        <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
          </span>
          <span>
            {timerActive
              ? `Deep Focus Active (${timerTime})`
              : "Flow State Ready"}
          </span>
        </div>
      </div>

      {/* Right: Search, Notifications, User Avatar Badge */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Search Bar / Cmd+K trigger */}
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks, sessions, commands..."
            className="w-64 pl-9 pr-12 py-1.5 text-xs rounded-xl bg-slate-900/60 border border-white/10 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all"
          />
          <kbd className="absolute right-2.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 border border-white/10 rounded">
            ⌘K
          </kbd>
        </div>

        {/* Welcome Guide / Onboarding Trigger */}
        <button
          onClick={() => {
            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("flowstate_open_welcome_modal"));
            }
          }}
          className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-slate-900/80 border border-white/10 text-slate-300 hover:text-white hover:border-emerald-500/40 hover:text-emerald-400 transition-all cursor-pointer flex-shrink-0"
          aria-label="Welcome Guide"
          title="Open Welcome Guide"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Notification Bell Dropdown */}
        <div ref={dropdownRef} className="relative flex-shrink-0">
          <button
            type="button"
            onClick={toggleNotifications}
            className="relative flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl bg-slate-900/80 border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-colors cursor-pointer"
            aria-label="Notifications"
            aria-expanded={showNotifications}
          >
            <Bell className="w-4 h-4 pointer-events-none" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-500 text-[10px] font-bold text-slate-950 flex items-center justify-center border-2 border-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.5)] pointer-events-none leading-none">
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
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 top-full mt-2 w-80 sm:w-96 max-w-[calc(100vw-1.5rem)] rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-white/15 shadow-2xl p-4 z-50 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Notifications
                    </span>
                    {unreadCount > 0 ? (
                      <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        {unreadCount} New
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">
                        All Caught Up
                      </span>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={markAllAsRead}
                        className="text-[10px] text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-0.5 cursor-pointer"
                        title="Mark all as read"
                      >
                        <Check className="w-3 h-3" />
                        <span>Read</span>
                      </button>
                      <span className="text-slate-600">•</span>
                      <button
                        type="button"
                        onClick={clearAllNotifications}
                        className="text-[10px] text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-0.5 cursor-pointer"
                        title="Clear all"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Clear</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          if (!n.read) {
                            markAsRead(n.id);
                          }
                          if (String(n.title).toLowerCase().includes("welcome to flowstate")) {
                            if (typeof window !== "undefined") {
                              window.dispatchEvent(new CustomEvent("flowstate_open_welcome_modal"));
                            }
                            setShowNotifications(false);
                          }
                        }}
                        className={`flex items-start gap-2.5 p-2.5 rounded-xl transition-all text-left cursor-pointer ${
                          n.read
                            ? "bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 opacity-80"
                            : "bg-emerald-500/[0.08] hover:bg-emerald-500/[0.12] border border-emerald-500/25"
                        }`}
                      >
                        <div
                          className={`p-1.5 rounded-lg border mt-0.5 flex-shrink-0 ${
                            n.type === "pomodoro"
                              ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                              : n.type === "task"
                              ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                              : n.type === "streak"
                              ? "bg-orange-500/10 border-orange-500/20 text-orange-400"
                              : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                          }`}
                        >
                          {n.type === "pomodoro" ? (
                            <Clock className="w-3.5 h-3.5" />
                          ) : n.type === "task" ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : n.type === "streak" ? (
                            <Flame className="w-3.5 h-3.5" />
                          ) : (
                            <Zap className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <div className="flex-1 overflow-hidden min-w-0">
                          <p
                            className={`text-xs leading-snug break-words ${
                              n.read
                                ? "font-normal text-slate-300"
                                : "font-semibold text-white"
                            }`}
                          >
                            {n.title}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-1">
                            {n.time}
                          </p>
                        </div>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0 shadow-[0_0_6px_#10b981]" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Avatar Badge - Clickable to open ProfileModal */}
        <div
          onClick={onOpenProfile}
          className="flex items-center gap-2.5 pl-2 border-l border-white/10 cursor-pointer group flex-shrink-0"
          title="Click to edit profile"
        >
          <div className="relative transition-transform group-hover:scale-105">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-400 via-indigo-500 to-purple-500 p-[1.5px] shadow-[0_0_12px_rgba(16,185,129,0.3)]">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-xs font-bold text-white overflow-hidden">
                {userAvatar &&
                (userAvatar.startsWith("data:image/") ||
                  userAvatar.startsWith("http")) ? (
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="w-full h-full object-cover"
                  />
                ) : userAvatar ? (
                  <span className="text-base">{userAvatar}</span>
                ) : isGuestOrNew ? (
                  <User className="w-4 h-4 text-slate-300" />
                ) : (
                  initials
                )}
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-slate-950 border border-white/20 text-[8px] font-bold text-amber-400">
              {currentLevel}
            </span>
          </div>

          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-bold text-slate-100 flex items-center gap-1">
              {userName}
              {!isGuestOrNew && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {userTitle} • {currentXP.toLocaleString()} XP
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
