"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Edit3,
  Globe,
  ExternalLink,
  Target,
  Layers,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { FocusBlueprintRecord } from "@/components/FocusBlueprintModal";

interface TodaysBlueprintCardProps {
  onEditBlueprint?: (blueprint: FocusBlueprintRecord) => void;
}

const STORAGE_KEY_TODAY_BLUEPRINT = "flowstate_today_blueprint";

function getDomainIcon(domain: string) {
  const clean = domain.toLowerCase().trim();
  if (clean.includes("youtube.com") || clean.includes("youtu.be")) {
    return <span className="text-sm">📺</span>;
  }
  if (clean.includes("github.com")) {
    return <span className="text-sm">💻</span>;
  }
  if (clean.includes("google.com")) {
    return <span className="text-sm">🔍</span>;
  }
  if (clean.includes("gemini")) {
    return <span className="text-sm">✨</span>;
  }
  return <Globe className="w-3.5 h-3.5 text-emerald-400" />;
}

export function TodaysBlueprintCard({ onEditBlueprint }: TodaysBlueprintCardProps) {
  const [blueprint, setBlueprint] = useState<FocusBlueprintRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTodaysBlueprint = useCallback(async () => {
    try {
      setLoading(true);

      const todayStr = new Date().toISOString().split("T")[0];

      // 1. Check local storage cache first for instant render on refresh
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem(STORAGE_KEY_TODAY_BLUEPRINT);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (parsed && parsed.goal) {
              const bpDate = parsed.created_at
                ? new Date(parsed.created_at).toISOString().split("T")[0]
                : todayStr;
              if (bpDate === todayStr) {
                setBlueprint(parsed);
              }
            }
          } catch {
            // ignore
          }
        }
      }

      // 2. Fetch latest from Supabase created today
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

      const { data, error } = await supabase
        .from("focus_blueprints")
        .select("*")
        .gte("created_at", startOfDay)
        .order("created_at", { ascending: false })
        .limit(1);

      if (!error && data && data.length > 0) {
        const latest = data[0] as FocusBlueprintRecord;
        setBlueprint(latest);
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY_TODAY_BLUEPRINT, JSON.stringify(latest));
          localStorage.setItem("flowstate_last_blueprint_date", todayStr);
        }
      }
    } catch (err) {
      console.warn("Notice: Error fetching today's blueprint from Supabase:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodaysBlueprint();

    // Listen to local event when blueprint is confirmed/locked in
    const handleBlueprintLocked = (e: Event) => {
      const customEvent = e as CustomEvent<FocusBlueprintRecord>;
      if (customEvent.detail) {
        setBlueprint(customEvent.detail);
      } else {
        fetchTodaysBlueprint();
      }
    };
    window.addEventListener("flowstate_blueprint_locked", handleBlueprintLocked);

    // Subscribe to realtime Supabase changes
    const channel = supabase
      .channel("todays_blueprint_card_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "focus_blueprints" },
        () => {
          fetchTodaysBlueprint();
        }
      )
      .subscribe();

    return () => {
      window.removeEventListener("flowstate_blueprint_locked", handleBlueprintLocked);
      supabase.removeChannel(channel);
    };
  }, [fetchTodaysBlueprint]);

  const handleEdit = () => {
    if (blueprint && onEditBlueprint) {
      onEditBlueprint(blueprint);
    } else {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("flowstate_start_timer"));
      }
      if (onEditBlueprint) {
        onEditBlueprint({
          id: "new",
          goal: "",
          allowlist: [],
          planned_work: "",
          session_duration: 25,
          created_at: new Date().toISOString(),
        });
      }
    }
  };

  const domains = Array.isArray(blueprint?.allowlist)
    ? blueprint.allowlist.filter((d) => Boolean(d) && !d.includes("localhost") && !d.includes("127.0.0.1"))
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative rounded-2xl bg-gradient-to-r from-slate-900/95 via-slate-900/85 to-slate-950/95 border border-emerald-500/25 p-4 sm:p-6 md:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_24px_rgba(16,185,129,0.08)] backdrop-blur-xl overflow-hidden hover:border-emerald-500/40 transition-colors duration-300"
    >
      {/* Subtle Glow Accents */}
      <div className="absolute top-0 right-1/4 w-60 h-24 bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 right-10 w-48 h-24 bg-teal-500/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-5">
        {/* Left Section: Icon, Badge, Goal & Allowed Domains */}
        <div className="space-y-3 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-[11px] font-extrabold uppercase tracking-wider shadow-[0_0_12px_rgba(16,185,129,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Today&apos;s Focus Blueprint</span>
            </span>
            <span className="text-slate-500 text-xs hidden sm:inline">•</span>
            <span className="text-[11px] text-slate-400 font-mono">
              {new Date().toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          {blueprint ? (
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-baseline gap-2 flex-wrap">
                <span>Today&apos;s Blueprint:</span>
                <span className="text-emerald-300 font-black">{blueprint.goal}</span>
              </h3>

              {blueprint.planned_work && (
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                  <span className="text-slate-500">Planned work:</span> {blueprint.planned_work}
                </p>
              )}

              {/* Allowed Resources Section */}
              <div className="flex items-center gap-2 pt-2.5 flex-wrap">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                  Allowed:
                </span>
                {domains.length > 0 ? (
                  domains.map((domain) => (
                    <span
                      key={domain}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950/80 border border-white/10 text-xs font-mono font-medium text-slate-200 hover:border-emerald-500/40 transition-colors shadow-sm"
                    >
                      {getDomainIcon(domain)}
                      <span>{domain}</span>
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">
                    Essential tools only (localhost, FlowState)
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-base font-bold text-white">
                No Blueprint Set for Today
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Start your first focus session today to craft today&apos;s blueprint and protect your attention.
              </p>
            </div>
          )}
        </div>

        {/* Right Section: Action Button */}
        <div className="flex items-center gap-2 self-start md:self-center shrink-0 pt-1 md:pt-0 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleEdit}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 hover:border-emerald-500/60 transition-all shadow-sm active:scale-95 cursor-pointer w-full sm:w-auto"
            title={blueprint ? "Edit Today's Blueprint" : "Set Today's Blueprint"}
          >
            <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{blueprint ? "Edit Today's Blueprint" : "Set Today's Blueprint"}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
