import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  Activity,
  AlertTriangle,
  RefreshCw,
  Mail,
  Zap,
} from "lucide-react";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service — FlowState",
  description:
    "Terms of Service for FlowState: Guidelines and conditions for using our productivity platform.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Background Neon Mesh Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] opacity-60" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] opacity-60" />
      </div>

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-20 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-slate-100 hover:text-white transition group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-indigo-600 p-[1px] shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight">FlowState</span>
              <span className="text-[10px] text-slate-400">Deep Work OS</span>
            </div>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900/80 border border-white/10 hover:border-emerald-500/30 transition shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Page Header */}
        <div className="mb-10 text-center sm:text-left space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <FileText className="w-3.5 h-3.5" />
            <span>Terms of Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Terms of Service
          </h1>
          <p className="text-sm text-slate-400">
            Effective Date: October 2026 • Last updated: October 2026
          </p>
        </div>

        {/* Terms Sections */}
        <div className="space-y-6 text-slate-200">
          {/* Section 1: Acceptance of Terms */}
          <section className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm transition hover:border-white/15">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Acceptance of Terms
                </h2>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  By using FlowState, you agree to these terms.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Use of Service */}
          <section className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm transition hover:border-white/15">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                <Activity className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Use of Service
                </h2>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  FlowState is provided &apos;as is&apos; for personal productivity purposes. You agree not to misuse the service or attempt to bypass the browser extension&apos;s blocking mechanisms maliciously.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Limitation of Liability */}
          <section className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm transition hover:border-white/15">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Limitation of Liability
                </h2>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  We are not responsible for any data loss, missed deadlines, or damages resulting from the use of this app.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Changes to Terms */}
          <section className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm transition hover:border-white/15">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Changes to Terms
                </h2>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  We reserve the right to update these terms at any time.
                </p>
              </div>
            </div>
          </section>

          {/* Contact and Privacy Links */}
          <section className="bg-slate-900/20 border border-white/5 rounded-xl p-5 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Questions about our Terms? Contact us at{" "}
                <a
                  href="mailto:humammoin09@gmail.com"
                  className="text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-4 transition"
                >
                  humammoin09@gmail.com
                </a>
              </span>
            </div>
            <Link
              href="/privacy"
              className="text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-4 transition shrink-0"
            >
              Read our Privacy Policy →
            </Link>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
