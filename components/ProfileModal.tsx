"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, X, Check, Target, Sparkles, Database, Upload, ShieldCheck, LogOut, Cloud, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

type ProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  setUserName: (name: string) => void;
  userTitle: string;
  setUserTitle: (title: string) => void;
  dailyGoal?: string;
  setDailyGoal?: (goal: string) => void;
  userAvatar?: string;
  setUserAvatar?: (avatar: string) => void;
  onOpenAuth?: () => void;
};

export function ProfileModal({
  isOpen,
  onClose,
  userName,
  setUserName,
  userTitle,
  setUserTitle,
  dailyGoal: dailyGoalProp,
  setDailyGoal: setDailyGoalProp,
  userAvatar: userAvatarProp,
  setUserAvatar: setUserAvatarProp,
  onOpenAuth,
}: ProfileModalProps) {
  if (!isOpen) return null;

  const [name, setName] = useState(userName);
  const [title, setTitle] = useState(userTitle);
  const [dailyGoal, setDailyGoal] = useState<string>(dailyGoalProp || "6");
  const [selectedAvatar, setSelectedAvatar] = useState<string>(userAvatarProp || "🚀");
  const [saving, setSaving] = useState(false);
  const [authEmail, setAuthEmail] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(true);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  useEffect(() => {
    setName(userName);
    setTitle(userTitle);
    const savedGoal = localStorage.getItem("flowstate_daily_goal") || dailyGoalProp || "6";
    const savedAvatar = localStorage.getItem("flowstate_user_avatar") || userAvatarProp || "🚀";
    setDailyGoal(savedGoal);
    setSelectedAvatar(savedAvatar);
    setErrorToast(null);

    // Correctly fetch active Supabase session & user
    (async () => {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        let user = userData?.user || null;

        if (!user || userError) {
          const { data: sessionData } = await supabase.auth.getSession();
          user = sessionData?.session?.user || null;
        }

        if (user) {
          setAuthEmail(user.email || null);
          setIsGuest(false);

          const userId = user.id;
          const meta = user.user_metadata || {};
          const savedName = localStorage.getItem(`flowstate_name_${userId}`) || meta.full_name || meta.name;
          const savedTitle = localStorage.getItem(`flowstate_title_${userId}`) || meta.professional_title;
          const savedGoal = localStorage.getItem(`flowstate_goal_${userId}`) || meta.daily_goal;
          const savedAvatar = localStorage.getItem(`flowstate_avatar_${userId}`) || meta.avatar;

          if (savedName) setName(savedName);
          if (savedTitle) setTitle(savedTitle);
          if (savedGoal) setDailyGoal(String(savedGoal));
          if (savedAvatar) setSelectedAvatar(savedAvatar);
        } else {
          setAuthEmail(null);
          setIsGuest(true);
        }
      } catch (err) {
        console.warn("Profile auth check notice:", err);
        setIsGuest(true);
      }
    })();
  }, [isOpen, userName, userTitle, dailyGoalProp, userAvatarProp]);

  const avatars = ["🚀", "⚡", "💻", "🔥", "🎯", "👑", "🦊"];

  const isCustomImage = (str: string) => {
    return str.startsWith("data:image/") || str.startsWith("http://") || str.startsWith("https://") || str.startsWith("blob:");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (!result) return;

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        const resizedDataUrl = canvas.toDataURL(file.type || "image/png");
        setSelectedAvatar(resizedDataUrl);
      };
      img.onerror = () => {
        setSelectedAvatar(result);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    } catch (err) {
      console.warn("Sign out error:", err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorToast(null);

    try {
      // 1. Update React state immediately
      setUserName(name);
      setUserTitle(title);
      if (setDailyGoalProp) setDailyGoalProp(dailyGoal);
      if (setUserAvatarProp) setUserAvatarProp(selectedAvatar);

      // 2. Fetch active Supabase user/session
      const { data: authData } = await supabase.auth.getUser();
      let user = authData?.user || null;
      if (!user) {
        const { data: sessionData } = await supabase.auth.getSession();
        user = sessionData?.session?.user || null;
      }

      const activeUserId =
        user?.id ||
        (typeof window !== "undefined"
          ? localStorage.getItem("flowstate_active_user_id") || "guest_default"
          : "guest_default");

      // 3. Persist locally for instant responsiveness
      if (typeof window !== "undefined") {
        localStorage.setItem("flowstate_user_name", name);
        localStorage.setItem("flowstate_user_title", title);
        localStorage.setItem("flowstate_daily_goal", dailyGoal);
        localStorage.setItem("flowstate_user_avatar", selectedAvatar);

        localStorage.setItem(`flowstate_name_${activeUserId}`, name);
        localStorage.setItem(`flowstate_title_${activeUserId}`, title);
        localStorage.setItem(`flowstate_goal_${activeUserId}`, dailyGoal);
        localStorage.setItem(`flowstate_avatar_${activeUserId}`, selectedAvatar);
      }

      // 4. If logged in, update auth metadata and user_settings table in Supabase
      if (user) {
        // Update user auth metadata
        try {
          const { error: metaError } = await supabase.auth.updateUser({
            data: {
              full_name: name,
              name: name,
              professional_title: title,
              avatar: selectedAvatar,
              daily_goal: dailyGoal,
            },
          });
          if (metaError) {
            console.warn("Notice: Supabase auth updateUser metadata notice:", metaError);
          }
        } catch (metaErr) {
          console.warn("Notice: Supabase auth updateUser exception:", metaErr);
        }

        // Upsert user_settings table safely with onConflict: id
        try {
          const { error: settingsError } = await supabase.from("user_settings").upsert(
            {
              id: user.id,
              user_id: user.id,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "id" }
          );

          if (settingsError) {
            console.warn("Notice: user_settings upsert notice:", settingsError);
          }
        } catch (settingsCatchErr) {
          console.warn("Notice: user_settings upsert exception:", settingsCatchErr);
        }
      }

      setSaving(false);
      onClose();
    } catch (error: any) {
      console.error("Profile save error:", error);
      setSaving(false);
      setErrorToast(error?.message || "Failed to save profile changes. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg p-6 sm:p-7 rounded-3xl bg-slate-900 border border-white/10 shadow-2xl relative text-white space-y-6 overflow-hidden"
      >
        {/* Close Button inside motion.div */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onClose();
          }}
          aria-label="Close modal"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 z-50 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-4 h-4 text-slate-400 hover:text-white" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Profile & Identity Setup</h2>
            <p className="text-xs text-slate-400">Customize your FlowState dashboard presence & goals</p>
          </div>
        </div>

        {/* Error Toast */}
        {errorToast && (
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="flex-1">{errorToast}</span>
          </div>
        )}

        {/* Account Sync Status Banner */}
        {isGuest ? (
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
              <span className="text-slate-300 truncate">
                <strong className="text-amber-300">Guest Mode:</strong> Stored locally
              </span>
            </div>
            {onOpenAuth && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-[11px] transition shadow-[0_0_10px_rgba(16,185,129,0.3)] shrink-0 cursor-pointer"
              >
                <Cloud className="w-3 h-3" />
                <span>Save Progress</span>
              </button>
            )}
          </div>
        ) : (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-300 truncate">
                Signed in as <strong className="text-emerald-300">{authEmail}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-300 transition text-[11px] shrink-0 cursor-pointer"
              title="Sign out of account"
            >
              <LogOut className="w-3 h-3" />
              <span>Sign out</span>
            </button>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {/* Avatar Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Choose Avatar Icon or Upload Custom Image
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {avatars.map((av) => (
                <button
                  type="button"
                  key={av}
                  onClick={() => setSelectedAvatar(av)}
                  className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center border transition cursor-pointer ${
                    selectedAvatar === av
                      ? "bg-emerald-500/20 border-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                      : "bg-slate-950 border-white/10 text-slate-400 hover:border-white/30"
                  }`}
                >
                  {av}
                </button>
              ))}

              {/* Local File Upload Button */}
              <label
                className={`w-10 h-10 rounded-xl flex items-center justify-center border transition cursor-pointer relative ${
                  isCustomImage(selectedAvatar)
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                    : "bg-slate-950 border-white/10 text-slate-400 hover:border-white/30 hover:text-white"
                }`}
                title="Upload image from device"
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Upload className="w-4 h-4" />
              </label>

              {/* Custom Image Preview */}
              {isCustomImage(selectedAvatar) && (
                <div
                  className="relative w-10 h-10 rounded-xl overflow-hidden border-2 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                  title="Uploaded Avatar Preview"
                >
                  <img
                    src={selectedAvatar}
                    alt="Custom Avatar"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-emerald-950/20 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-emerald-300 drop-shadow" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white"
                placeholder="e.g. John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Professional Title / Role
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white"
                placeholder="e.g. Software Engineer"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-400" /> Daily Focus Target (Hours)
            </label>
            <select
              value={dailyGoal}
              onChange={(e) => setDailyGoal(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-slate-300 font-mono"
            >
              <option value="4">4 Hours (Light Execution)</option>
              <option value="6">6 Hours (Optimal Deep Work)</option>
              <option value="8">8 Hours (Hardcore Flow)</option>
              <option value="10">10 Hours (Elite Beast Mode)</option>
            </select>
          </div>

          <div className="pt-3 flex items-center justify-between border-t border-white/10">
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <Database className="w-3 h-3" /> Synced with Local & Supabase Cloud
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50 cursor-pointer"
              >
                <Check className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
