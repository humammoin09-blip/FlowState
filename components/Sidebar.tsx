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
    {
      id: "dashboard" as NavTab,
      label: "Dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "timer" as NavTab,
      label: "Focus Timer",
      icon: Timer,
      badge: timerActive ? (
        <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded-full animate-pulse border border-emerald-500/30">
          {timerTime}
        </span>
      ) : null,
    },
    {
      id: "tasks" as NavTab,
      label: "MIT Tasks",
      icon: CheckSquare,
      badge: pendingTasksCount > 0 ? (
        <span className="text-[10px] font-semibold text-indigo-300 bg-indigo-500/20 px-1.5 py-0.5 rounded-full border border-indigo-500/30">
          {pendingTasksCount}
        </span>
      ) : null,
    },
    {
      id: "analytics" as NavTab,
      label: "Analytics",
      icon: BarChart3,
      badge: null,
    },
  ];

  return (
    <>
      {/* Desktop Persistent Sidebar (hidden on mobile) */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden md:flex flex-col h-screen sticky top-0 z-30 bg-slate-950/80 backdrop-blur-2xl border-r border-white/10 select-none shadow-[4px_0_24px_rgba(0,0,0,0.5)] shrink-0"
      >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3.5 top-7 z-40 flex items-center justify-center w-7 h-7 rounded-full bg-slate-900 border border-white/15 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/50 shadow-lg hover:shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-all"
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Brand Header */}
      <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-white/5 shrink-0 overflow-hidden">
        <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-indigo-600 p-[1px] shadow-[0_0_14px_rgba(16,185,129,0.3)] shrink-0">
          <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
            <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400/20 drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
          </div>
        </div>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col whitespace-nowrap"
            >
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-base bg-gradient-to-r from-slate-100 via-white to-slate-300 bg-clip-text text-transparent">
                  FlowState
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
              </div>
              <span className="text-[10px] font-medium text-slate-400 tracking-wider">
                DEEP WORK OS v2.4
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Navigation (Top) */}
      <nav className="px-2.5 py-2 space-y-1 shrink-0">
        <div className="px-2.5 pb-1">
          {!isCollapsed ? (
            <span className="text-[9.5px] font-semibold text-slate-500 uppercase tracking-widest">
              Navigation
            </span>
          ) : (
            <div className="h-3" />
          )}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex items-center w-full px-2.5 py-1.5 rounded-lg font-medium text-[13px] transition-all duration-200 group ${
                isActive
                  ? "text-white bg-slate-900/90 border border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-500/15 via-indigo-500/10 to-transparent border-l-2 border-emerald-400"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              <Icon
                className={`w-4 h-4 shrink-0 transition-all duration-200 z-10 ${
                  isActive
                    ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                    : "text-slate-400 group-hover:text-slate-200 group-hover:scale-105"
                }`}
              />

              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="ml-2.5 font-medium whitespace-nowrap z-10 flex-1 text-left text-[13px]"
                >
                  {item.label}
                </motion.span>
              )}

              {!isCollapsed && item.badge && (
                <div className="z-10 ml-auto">{item.badge}</div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Soundscape Widget (Middle) */}
      <div className="px-2.5 py-1 flex-1 overflow-y-auto min-h-0">
        {!isCollapsed && <SoundscapePlayer />}
      </div>

      {/* User Profile & Status Section (Anchored to Bottom) */}
      <div className="mt-auto p-2 border-t border-white/5 space-y-1.5 shrink-0">
        {/* User Mini Profile / Status Card */}
        <div
          onClick={onOpenProfile}
          className={`relative flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/60 border border-white/10 transition hover:bg-slate-900/90 hover:border-emerald-500/30 ${
            onOpenProfile ? "cursor-pointer" : ""
          }`}
          title={onOpenProfile ? "Click to view / edit profile" : undefined}
        >
          <div className="relative shrink-0">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-500 p-[1px] shadow-sm overflow-hidden">
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-300 overflow-hidden">
                {userAvatar && (userAvatar.startsWith("data:image/") || userAvatar.startsWith("http")) ? (
                  <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : userAvatar ? (
                  <span className="text-[10px]">{userAvatar}</span>
                ) : userName === "Guest User" ? (
                  <User className="w-3.5 h-3.5 text-slate-300" />
                ) : (
                  userName.slice(0, 2).toUpperCase()
                )}
              </div>
            </div>
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border-[1.5px] border-slate-950 shadow-[0_0_6px_#10b981]" />
          </div>

          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col text-left overflow-hidden flex-1"
            >
              <span className="text-[12px] font-semibold text-slate-200 truncate leading-tight">
                {userName}
              </span>
              <span className="text-[9.5px] text-emerald-400/90 font-medium flex items-center gap-1 truncate leading-tight mt-0.5">
                <Sparkles className="w-2.5 h-2.5 shrink-0" /> {userName === "Guest User" ? "New User" : userTitle}
              </span>
            </motion.div>
          )}
        </div>

        {/* Extension Blocker Status Indicator */}
        <div
          onClick={handleExtensionIndicatorClick}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[10.5px] transition-all ${
            isExtensionActive
              ? "bg-emerald-950/25 border-emerald-500/20 text-emerald-300"
              : "bg-rose-950/25 border-rose-500/25 text-rose-300 hover:bg-rose-950/40 hover:border-rose-500/40 cursor-pointer"
          } ${isCollapsed ? "justify-center px-1" : "justify-between"}`}
          title={
            isExtensionActive
              ? "FlowState Blocker is active and protecting your sessions"
              : "FlowState Blocker is inactive. Click to install the extension."
          }
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              {isExtensionActive ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500 shadow-[0_0_6px_#10b981]" />
                </>
              ) : (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500 shadow-[0_0_6px_#f43f5e]" />
                </>
              )}
            </span>
            {!isCollapsed && (
              <span className="text-[10.5px] font-semibold tracking-tight truncate">
                {isExtensionActive ? "Blocker Active" : "Blocker Inactive"}
              </span>
            )}
          </div>
          {!isCollapsed && !isExtensionActive && (
            <span className="text-[8.5px] font-bold text-rose-400 bg-rose-500/15 border border-rose-500/30 px-1 py-0.2 rounded ml-1 shrink-0">
              Install
            </span>
          )}
        </div>

        {/* Legal Links (Desktop Sidebar) */}
        {!isCollapsed && (
          <div className="flex items-center justify-center gap-2 pt-0.5 text-[9.5px] text-slate-500">
            <Link
              href="/privacy"
              className="hover:text-slate-300 transition-colors"
            >
              Privacy
            </Link>
            <span>•</span>
            <Link
              href="/terms"
              className="hover:text-slate-300 transition-colors"
            >
              Terms
            </Link>
          </div>
        )}
      </div>
    </motion.aside>

    {/* Mobile Drawer Overlay (Slide-out menu for < md screens) */}
    <AnimatePresence>
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Slide-out Drawer */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 32 }}
            className="relative w-64 max-w-[80vw] h-full bg-slate-950/95 backdrop-blur-2xl border-r border-white/10 flex flex-col z-10 shadow-2xl overflow-y-auto"
          >
            {/* Header with Brand & Close Button */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-indigo-600 p-[1px] shadow-[0_0_12px_rgba(16,185,129,0.3)] shrink-0">
                  <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                    <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                  </div>
                </div>
                <div>
                  <span className="font-bold tracking-tight text-base bg-gradient-to-r from-slate-100 via-white to-slate-300 bg-clip-text text-transparent">
                    FlowState
                  </span>
                  <span className="text-[9.5px] block font-medium text-slate-400">DEEP WORK OS</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Items (Top) */}
            <nav className="px-2.5 py-2 space-y-1 shrink-0">
              <div className="px-2.5 pb-1 text-[9.5px] font-semibold text-slate-500 uppercase tracking-widest">
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
                    className={`relative flex items-center w-full px-2.5 py-2 rounded-lg font-medium text-[13px] transition-all duration-200 group cursor-pointer ${
                      isActive
                        ? "text-white bg-slate-900/90 border border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-500/15 via-indigo-500/10 to-transparent border-l-2 border-emerald-400" />
                    )}
                    <Icon className={`w-4 h-4 shrink-0 z-10 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                    <span className="ml-2.5 font-medium whitespace-nowrap z-10 flex-1 text-left text-[13px]">{item.label}</span>
                    {item.badge && <div className="z-10 ml-auto">{item.badge}</div>}
                  </button>
                );
              })}
            </nav>

            {/* Soundscape Widget (Middle) */}
            <div className="px-2.5 py-1 flex-1 overflow-y-auto min-h-0">
              <SoundscapePlayer />
            </div>

            {/* User Profile & Status (Anchored to Bottom) */}
            <div className="mt-auto p-2 border-t border-white/5 space-y-1.5 shrink-0">
              <div
                onClick={() => {
                  if (onCloseMobile) onCloseMobile();
                  if (onOpenProfile) onOpenProfile();
                }}
                className={`relative flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/60 border border-white/10 transition hover:bg-slate-900/90 hover:border-emerald-500/30 ${
                  onOpenProfile ? "cursor-pointer" : ""
                }`}
                title="Click to view / edit profile"
              >
                <div className="relative shrink-0">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-500 p-[1px] shadow-sm overflow-hidden">
                    <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-300 overflow-hidden">
                      {userAvatar && (userAvatar.startsWith("data:image/") || userAvatar.startsWith("http")) ? (
                        <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : userAvatar ? (
                        <span className="text-[10px]">{userAvatar}</span>
                      ) : userName === "Guest User" ? (
                        <User className="w-3.5 h-3.5 text-slate-300" />
                      ) : (
                        userName.slice(0, 2).toUpperCase()
                      )}
                    </div>
                  </div>
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border-[1.5px] border-slate-950 shadow-[0_0_6px_#10b981]" />
                </div>
                <div className="flex flex-col text-left overflow-hidden flex-1">
                  <span className="text-[12px] font-semibold text-slate-200 truncate leading-tight">{userName}</span>
                  <span className="text-[9.5px] text-emerald-400/90 font-medium flex items-center gap-1 truncate leading-tight mt-0.5">
                    <Sparkles className="w-2.5 h-2.5 shrink-0" /> {userName === "Guest User" ? "New User" : userTitle}
                  </span>
                </div>
              </div>

              {/* Extension Blocker Status Indicator */}
              <div
                onClick={handleExtensionIndicatorClick}
                className={`flex items-center justify-between gap-1.5 px-2 py-1 rounded-lg border text-[10.5px] transition-all ${
                  isExtensionActive
                    ? "bg-emerald-950/25 border-emerald-500/20 text-emerald-300"
                    : "bg-rose-950/25 border-rose-500/25 text-rose-300 hover:bg-rose-950/40 hover:border-rose-500/40 cursor-pointer"
                }`}
                title={
                  isExtensionActive
                    ? "FlowState Blocker is active and protecting your sessions"
                    : "FlowState Blocker is inactive. Click to install the extension."
                }
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="relative flex h-1.5 w-1.5 shrink-0">
                    {isExtensionActive ? (
                      <>
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500 shadow-[0_0_6px_#10b981]" />
                      </>
                    ) : (
                      <>
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500 shadow-[0_0_6px_#f43f5e]" />
                      </>
                    )}
                  </span>
                  <span className="text-[10.5px] font-semibold tracking-tight truncate">
                    {isExtensionActive ? "Blocker Active" : "Blocker Inactive"}
                  </span>
                </div>
                {!isExtensionActive && (
                  <span className="text-[8.5px] font-bold text-rose-400 bg-rose-500/15 border border-rose-500/30 px-1 py-0.2 rounded shrink-0">
                    Install
                  </span>
                )}
              </div>

              {/* Legal Links (Mobile Drawer) */}
              <div className="flex items-center justify-center gap-3 pt-1 text-[9.5px] text-slate-500">
                <Link
                  href="/privacy"
                  onClick={onCloseMobile}
                  className="hover:text-slate-300 transition-colors"
                >
                  Privacy Policy
                </Link>
                <span>•</span>
                <Link
                  href="/terms"
                  onClick={onCloseMobile}
                  className="hover:text-slate-300 transition-colors"
                >
                  Terms of Service
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