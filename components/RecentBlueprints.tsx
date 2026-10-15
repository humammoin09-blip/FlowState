"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  History,
  RotateCcw,
  Sparkles,
  Clock,
  Calendar,
  Globe,
  ArrowUpRight,
  Shield,
  Layers,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { FocusBlueprintRecord } from "@/components/FocusBlueprintModal";

interface RecentBlueprintsProps {
  onReuseBlueprint: (blueprint: FocusBlueprintRecord) => void;
  refreshTrigger?: number;
}

const STORAGE_KEY_CACHED_BLUEPRINTS = "flowstate_cached_focus_blueprints";

export function RecentBlueprints({
  onReuseBlueprint,
  refreshTrigger,
}: RecentBlueprintsProps) {
  const [blueprints, setBlueprints] = useState<FocusBlueprintRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchRecentBlueprints = useCallback(async () => {
    try {
      setLoading(true);

      // Check localStorage cache first
      let cachedList: FocusBlueprintRecord[] = [];
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem(STORAGE_KEY_CACHED_BLUEPRINTS);
        if (cached) {
          try {
            cachedList = JSON.parse(cached);
            if (Array.isArray(cachedList) && cachedList.length > 0) {
              setBlueprints(cachedList.slice(0, 5));
            }
          } catch {
            // ignore
          }
        }
      }

      // Query Supabase for last 5 blueprints
      const { data, error } = await supabase
        .from("focus_blueprints")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (!error && data && data.length > 0) {
        setBlueprints(data);
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY_CACHED_BLUEPRINTS, JSON.stringify(data));
        }
      } else if (cachedList.length > 0) {
        setBlueprints(cachedList.slice(0, 5));
      }
    } catch (err) {
      console.warn("Supabase blueprints fetch notice (using cache):", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecentBlueprints();

    // Subscribe to realtime changes on focus_blueprints table
    const channel = supabase
      .channel("recent_focus_blueprints_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "focus_blueprints" },
        () => {
          fetchRecentBlueprints();
        }
      )
      .subscribe();

    // Also listen for local custom event when a blueprint is locked in
    const handleLocalNewBlueprint = () => {
      fetchRecentBlueprints();
    };
    window.addEventListener("flowstate_blueprint_locked", handleLocalNewBlueprint);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener("flowstate_blueprint_locked", handleLocalNewBlueprint);
    };
  }, [fetchRecentBlueprints, refreshTrigger]);

  const formatTimestamp = (dateStr?: string) => {
    if (!dateStr) return "Recent session";
    try {
      const d = new Date(dateStr);
      const isToday = d.toDateString() === new Date().toDateString();
      const timeStr = d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      if (isToday) {
        return `Today at ${timeStr}`;
      }

      const datePart = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      return `${datePart}, ${timeStr}`;
    } catch {
      return "Recent session";
    }
  };

  return (
    <div className="glass-card rounded-3xl border border-white/10 p-5 sm:p-6 shadow-2xl relative overflow-hidden space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Recent Blueprints
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                Last 5
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Previous pre-session blueprints • Click to reuse
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchRecentBlueprints()}
          className="p-1.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          title="Refresh Blueprints"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Blueprint List */}
      <div className="space-y-2.5">
        {loading && blueprints.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400 animate-pulse">
            Loading recent blueprints...
          </div>
        ) : blueprints.length === 0 ? (
          <div className="py-7 text-center space-y-1.5">
            <p className="text-xs font-semibold text-slate-300">
              No blueprints saved yet
            </p>
            <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
              Start your first session to design a Focus Blueprint with AI domain suggestions.
            </p>
          </div>
        ) : (
          blueprints.map((bp, idx) => (
            <motion.div
              key={bp.id || `bp-${idx}`}
              whileHover={{ scale: 1.01 }}
              onClick={() => onReuseBlueprint(bp)}
              className="group p-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-white/5 hover:border-[#00ff88]/40 transition-all cursor-pointer space-y-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#00ff88] transition-colors truncate">
                    {bp.goal}
                  </h4>
                  {bp.planned_work && (
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {bp.planned_work}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300 font-bold">
                    {bp.session_duration || 25}m
                  </span>
                  <div className="p-1 rounded-lg bg-[#00ff88]/10 text-[#00ff88] opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Allowlist Chips & Date */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/5">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider shrink-0 flex items-center gap-0.5">
                    <Shield className="w-2.5 h-2.5 text-slate-500" />
                    Allowed:
                  </span>
                  {bp.allowlist?.slice(0, 3).map((domain) => (
                    <span
                      key={domain}
                      className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/10 text-[10px] font-mono text-slate-300 shrink-0"
                    >
                      {domain}
                    </span>
                  ))}
                  {bp.allowlist && bp.allowlist.length > 3 && (
                    <span className="text-[10px] font-mono text-slate-500">
                      +{bp.allowlist.length - 3} more
                    </span>
                  )}
                </div>

                <span className="text-[10px] text-slate-500 font-mono shrink-0">
                  {formatTimestamp(bp.created_at)}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
