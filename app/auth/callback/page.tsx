"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  migrateGuestDataToAuthenticatedUser,
  forceSyncUserDataFromSupabase,
} from "@/lib/auth-service";
import { Loader2, ShieldCheck } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Securing your session...");

  useEffect(() => {
    let hasRun = false;

    const completeAuthAndMigrate = async () => {
      if (hasRun) return;
      hasRun = true;

      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        const sessionUser = data?.session?.user;
        if (sessionUser) {
          setStatus("Syncing your focus streaks and tasks...");
          const guestId =
            typeof window !== "undefined"
              ? localStorage.getItem("flowstate_current_guest_id") ||
                localStorage.getItem("flowstate_active_user_id")
              : null;

          if (guestId && guestId.startsWith("guest_") && guestId !== sessionUser.id) {
            await migrateGuestDataToAuthenticatedUser(guestId, sessionUser.id);
          }

          // Force complete re-fetch of all user data from Supabase and overwrite localStorage
          await forceSyncUserDataFromSupabase(sessionUser.id);
        }
      } catch (err) {
        console.warn("Auth callback notice:", err);
      } finally {
        router.replace("/");
      }
    };

    completeAuthAndMigrate();

    // Fallback safety timeout
    const timeout = setTimeout(() => {
      router.replace("/");
    }, 4000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
      <div className="flex flex-col items-center gap-4 text-center max-w-sm">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
          <ShieldCheck className="w-6 h-6 animate-pulse" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-white">Securing your Focus Journey</h2>
          <p className="text-xs text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            <span>{status}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
