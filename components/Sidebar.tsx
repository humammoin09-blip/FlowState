"use client";

import SoundscapePlayer from "./SoundscapePlayer";
import React, { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { isExtensionInstalled, subscribeToExtension } from "./InstallExtensionBanner";
import {
  LayoutDashboard,
  Timer,
  CheckSquare,
  BarChart3,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Zap,
  X,
  User,
} from "lucide-react";

export type NavTab = "dashboard" | "timer" | "tasks" | "analytics";

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  pendingTasksCount: number;
  timerActive: boolean;
  timerTime: string;
  userAvatar?: string;
  userName?: string;
  userTitle?: string;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  onOpenProfile?: () => void;
}

export function Sidebar({
  activeTab,
  setActiveTab,
  pendingTasksCount,
  timerActive,
  timerTime,
  userAvatar = "",
  userName = "Guest User",
  userTitle = "New User",
  isMobileOpen = false,
  onCloseMobile,
  onOpenProfile,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isExtensionActive = useSyncExternalStore(
    subscribeToExtension,
    () => isExtensionInstalled(),
    () => false
  );

  const handleExtensionIndicatorClick = () => {
    if (!isExtensionActive && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("flowstate_show_extension_required"));
    }
  };

  const navItems = [
    { id: "dashboard" as NavTab, label: "Dashboard", icon: LayoutDashboard },
    {
      id: "timer" as NavTab,
      label: "Focus Timer",
      icon: Timer,
      badge: timerActive ? (
        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-medium text-emerald-300">
          {timerTime}
        </span>
      ) : null,
    },
    {
      id: "tasks" as NavTab,
      label: "MIT Tasks",
      icon: CheckSquare,
      badge:
        pendingTasksCount > 0 ? (
          <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-cyan-300">
            {pendingTasksCount}
          </span>
        ) : null,
    },
    { id: "analytics" as NavTab, label: "Analytics", icon: BarChart3 },
  ];

  return (
    <>
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 84 : 240 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="hidden h-screen shrink-0 flex-col border-r border-slate-800/80 bg-slate-950/90 backdrop-blur-xl md:flex"
      >
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3.5 top-7 z-40 flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 transition hover:border-slate-600 hover:text-white"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800/90 px-4 py-3.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
            <Zap className="h-4 w-4" />
          </div>

          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base font-semibold tracking-tight text-slate-50">FlowState</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-slate-500">Deep Work OS</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="space-y-1 px-2.5 py-3">
          {!isCollapsed && (
            <div className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Navigation
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left text-sm transition ${
                  isActive
                    ? "border border-slate-700 bg-slate-900/90 text-white shadow-[0_10px_30px_rgba(15,23,42,0.32)]"
                    : "text-slate-400 hover:bg-slate-900/80 hover:text-slate-200"
                }`}
              >
                {isActive && <div className="absolute inset-y-1 left-1 w-0.5 rounded-full bg-emerald-400" />}
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                {!isCollapsed && <span className="flex-1 font-medium">{item.label}</span>}
                {!isCollapsed && item.badge && <div className="ml-auto">{item.badge}</div>}
              </button>
            );
          })}
        </nav>

        <div className="flex-1 px-2.5 py-1">
          {!isCollapsed && <SoundscapePlayer />}
        </div>

        <div className="space-y-2 border-t border-slate-800/90 p-2.5">
          <div
            onClick={onOpenProfile}
            className={`flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900/60 p-2 transition ${
              onOpenProfile ? "cursor-pointer hover:border-slate-700" : ""
            }`}
            title={onOpenProfile ? "Click to view / edit profile" : undefined}
          >
            <div className="relative shrink-0">
              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-slate-700 bg-gradient-to-br from-emerald-400 via-cyan-500 to-indigo-500 p-[1px]">
                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-slate-950 text-[10px] font-semibold text-white">
                  {userAvatar && (userAvatar.startsWith("data:image/") || userAvatar.startsWith("http")) ? (
                    <img src={userAvatar} alt="Avatar" className="h-full w-full object-cover" />
                  ) : userAvatar ? (
                    <span>{userAvatar}</span>
                  ) : userName === "Guest User" ? (
                    <User className="h-3.5 w-3.5 text-slate-300" />
                  ) : (
                    userName.slice(0, 2).toUpperCase()
                  )}
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-slate-950 bg-emerald-400" />
            </div>

            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-semibold text-slate-100">{userName}</div>
                <div className="mt-0.5 flex items-center gap-1 truncate text-[9px] text-emerald-300">
                  <Sparkles className="h-2.5 w-2.5" />
                  {userName === "Guest User" ? "New User" : userTitle}
                </div>
              </div>
            )}
          </div>

          <div
            onClick={handleExtensionIndicatorClick}
            className={`flex items-center gap-2 rounded-xl border px-2.5 py-1.5 text-[10px] transition ${
              isExtensionActive
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                : "border-rose-500/20 bg-rose-500/10 text-rose-300 hover:border-rose-500/30"
            } ${isCollapsed ? "justify-center px-1.5" : "justify-between"}`}
            title={
              isExtensionActive
                ? "FlowState Blocker is active and protecting your sessions"
                : "FlowState Blocker is inactive. Click to install the extension."
            }
          >
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span
                  className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isExtensionActive ? "animate-ping bg-emerald-400" : "animate-ping bg-rose-400"
                  }`}
                />
                <span
                  className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
                    isExtensionActive ? "bg-emerald-400" : "bg-rose-400"
                  }`}
                />
              </span>
              {!isCollapsed && (
                <span className="font-medium">
                  {isExtensionActive ? "Blocker Active" : "Blocker Inactive"}
                </span>
              )}
            </div>
            {!isCollapsed && !isExtensionActive && (
              <span className="rounded border border-rose-500/30 bg-rose-500/10 px-1 py-0.5 text-[8px] font-bold text-rose-300">
                Install
              </span>
            )}
          </div>

          {!isCollapsed && (
            <div className="flex items-center justify-center gap-3 pt-1 text-[9px] text-slate-500">
              <Link href="/privacy" className="transition hover:text-slate-300">
                Privacy
              </Link>
              <span>•</span>
              <Link href="/terms" className="transition hover:text-slate-300">
                Terms
              </Link>
            </div>
          )}
        </div>
      </motion.aside>

      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 30 }}
              className="relative z-10 flex h-full w-[82%] max-w-[18rem] flex-col border-r border-slate-800 bg-slate-950/95"
            >
              <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-base font-semibold text-slate-50">FlowState</div>
                    <div className="text-[9px] uppercase tracking-[0.2em] text-slate-500">Deep Work OS</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onCloseMobile}
                  aria-label="Close menu"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-900 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <nav className="space-y-1 px-2.5 py-3">
                <div className="px-2 pb-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Navigation
                </div>

                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        if (onCloseMobile) onCloseMobile();
                      }}
                      className={`relative flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left text-sm transition ${
                        isActive
                          ? "border border-slate-700 bg-slate-900/90 text-white"
                          : "text-slate-400 hover:bg-slate-900/80 hover:text-slate-200"
                      }`}
                    >
                      {isActive && <div className="absolute inset-y-1 left-1 w-0.5 rounded-full bg-emerald-400" />}
                      <Icon className={`h-4 w-4 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                      <span className="flex-1 font-medium">{item.label}</span>
                      {item.badge && <div>{item.badge}</div>}
                    </button>
                  );
                })}
              </nav>

              <div className="flex-1 px-2.5 py-1">
                <SoundscapePlayer />
              </div>

              <div className="space-y-2 border-t border-slate-800 p-2.5">
                <div
                  onClick={() => {
                    if (onCloseMobile) onCloseMobile();
                    if (onOpenProfile) onOpenProfile();
                  }}
                  className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900/60 p-2"
                >
                  <div className="relative shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-slate-700 bg-gradient-to-br from-emerald-400 via-cyan-500 to-indigo-500 p-[1px]">
                      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-slate-950 text-[10px] font-semibold text-white">
                        {userAvatar && (userAvatar.startsWith("data:image/") || userAvatar.startsWith("http")) ? (
                          <img src={userAvatar} alt="Avatar" className="h-full w-full object-cover" />
                        ) : userAvatar ? (
                          <span>{userAvatar}</span>
                        ) : userName === "Guest User" ? (
                          <User className="h-3.5 w-3.5 text-slate-300" />
                        ) : (
                          userName.slice(0, 2).toUpperCase()
                        )}
                      </div>
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-slate-950 bg-emerald-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-semibold text-slate-100">{userName}</div>
                    <div className="mt-0.5 flex items-center gap-1 truncate text-[9px] text-emerald-300">
                      <Sparkles className="h-2.5 w-2.5" />
                      {userName === "Guest User" ? "New User" : userTitle}
                    </div>
                  </div>
                </div>

                <div
                  onClick={handleExtensionIndicatorClick}
                  className={`flex items-center justify-between gap-2 rounded-xl border px-2.5 py-1.5 text-[10px] ${
                    isExtensionActive
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                      : "border-rose-500/20 bg-rose-500/10 text-rose-300"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5 shrink-0">
                      <span
                        className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                          isExtensionActive ? "animate-ping bg-emerald-400" : "animate-ping bg-rose-400"
                        }`}
                      />
                      <span
                        className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
                          isExtensionActive ? "bg-emerald-400" : "bg-rose-400"
                        }`}
                      />
                    </span>
                    <span className="font-medium">
                      {isExtensionActive ? "Blocker Active" : "Blocker Inactive"}
                    </span>
                  </div>
                  {!isExtensionActive && (
                    <span className="rounded border border-rose-500/30 bg-rose-500/10 px-1 py-0.5 text-[8px] font-bold text-rose-300">
                      Install
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-center gap-3 pt-1 text-[9px] text-slate-500">
                  <Link href="/privacy" onClick={onCloseMobile} className="transition hover:text-slate-300">
                    Privacy Policy
                  </Link>
                  <span>•</span>
                  <Link href="/terms" onClick={onCloseMobile} className="transition hover:text-slate-300">
                    Terms
                  </Link>
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
