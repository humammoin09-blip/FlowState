import type { Metadata } from "next";
import Link from "next/link";
import {
  Zap,
  ArrowLeft,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Bot,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Clock,
  Layers,
  Flame,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import Footer from "@/components/Footer";
import RelatedArticles, { GEO_RELATED_ARTICLES } from "@/components/RelatedArticles";

export const metadata: Metadata = {
  title: "Distraction Blocker for Students: Block YouTube Shorts & More",
  description:
    "A free distraction blocker built for students. Block YouTube Shorts, Instagram Reels, and Reddit while still allowing educational lectures and research.",
  keywords: [
    "distraction blocker for students",
    "website blocker for students",
    "study blocker",
    "block distractions while studying",
  ],
  alternates: {
    canonical:
      "https://flowstate-deepwork.vercel.app/distraction-blocker-for-students",
  },
  openGraph: {
    title: "Distraction Blocker for Students: Block YouTube Shorts & More",
    description:
      "A free distraction blocker built for students. Block YouTube Shorts, Instagram Reels, and Reddit while still allowing educational lectures and research.",
    url: "https://flowstate-deepwork.vercel.app/distraction-blocker-for-students",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Distraction Blocker for Students: Block YouTube Shorts & More",
    description:
      "A free distraction blocker built for students. Block YouTube Shorts, Instagram Reels, and Reddit while still allowing educational lectures and research.",
  },
};

export default function DistractionBlockerForStudentsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "The Distraction Blocker Built for Students",
    description:
      "A free distraction blocker built for students. Block YouTube Shorts, Instagram Reels, and Reddit while still allowing educational lectures and research.",
    author: {
      "@type": "Organization",
      name: "FlowState",
      url: "https://flowstate-deepwork.vercel.app",
    },
    publisher: {
      "@type": "Organization",
      name: "FlowState",
      url: "https://flowstate-deepwork.vercel.app",
      logo: {
        "@type": "ImageObject",
        url: "https://flowstate-deepwork.vercel.app/icon.svg",
      },
    },
    datePublished: "2026-11-13T00:00:00Z",
    dateModified: "2026-11-13T00:00:00Z",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id":
        "https://flowstate-deepwork.vercel.app/distraction-blocker-for-students",
    },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Article Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Atmospheric Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] opacity-60" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] opacity-60" />
      </div>

      {/* Header */}
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

      {/* Main Content */}
      <main className="flex-1 relative z-10 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <article className="space-y-12">
          {/* Hero & Title */}
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <GraduationCap className="w-3.5 h-3.5" />
                Student Focus Defense
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">100% Free For High School &amp; University</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              The Distraction Blocker Built for Students
            </h1>

            <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 sm:p-7 backdrop-blur-sm text-slate-300 leading-relaxed text-base sm:text-lg space-y-4">
              <p>
                Modern coursework requires studying directly inside an open browser. You need YouTube for calculus walkthroughs, Google Drive for project slides, and Reddit or Stack Overflow for coding errors. But when your study environment shares the exact same browser window with algorithmic dopamine traps, willpower stands no chance.
              </p>
              <p>
                FlowState is a <strong>distraction blocker built specifically for students</strong>. Unlike rigid corporate blockers that lock you out of the internet entirely, FlowState uses surgical URL path blocking to eliminate short-form feeds like YouTube Shorts, Instagram Reels, and viral algorithmic threads while preserving your lectures, academic research, and study portals.
              </p>
            </div>
          </div>

          {/* Section 1: The Student Distraction Epidemic */}
          <section className="space-y-6">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
                The Student Distraction Epidemic
              </h2>
            </div>

            {/* Bold 40-word summary */}
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 text-amber-100 text-sm leading-relaxed">
              <p>
                <strong>Modern students face algorithmic feeds engineered by thousands of engineers to hijack dopamine. A single accidental click on a YouTube Short or Instagram Reel derails hours of study time, spiking stress, ruining grade averages, and turning late-night revision into anxious scrolling marathons.</strong>
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <ShieldAlert className="w-4 h-4" />
                  <span>The YouTube Shorts Trap</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  You open YouTube to watch a 10-minute linear algebra lecture, but an algorithmic Short on your sidebar catches your eye. Forty minutes later, your notes are blank and your cognitive focus is completely shattered.
                </p>
              </div>

              <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Clock className="w-4 h-4" />
                  <span>The Exam Week Willpower Collapse</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  During midterms and finals, mental fatigue is at its peak. Relying on sheer discipline to resist opening Reddit or social tabs fails when your brain is already exhausted from studying complex material.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: How FlowState Blocks Distractions */}
          <section className="bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-emerald-950/30 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-sm space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>Surgical Path Blocking &amp; Allowlists</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              How FlowState Blocks Distractions
            </h2>

            {/* Bold 40-word summary */}
            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4 text-emerald-100 text-sm leading-relaxed">
              <p>
                <strong>FlowState abandons blunt domain blocking in favor of surgical path filtering. During study sessions, it isolates and terminates addictive routes like YouTube Shorts and viral algorithmic feeds while keeping full-length professor lectures, reference documentation, and school portals completely accessible.</strong>
              </p>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Here is how FlowState’s student-centric blocking architecture solves the online study dilemma:
            </p>

            <div className="grid gap-4">
              <div className="bg-slate-950/60 border border-white/10 rounded-xl p-5 space-y-2">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  1. Surgical Path Blocking Over Domain Bans
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Traditional blockers force an impossible choice: block all of <code>youtube.com</code> and lose your class tutorials, or unblock it and drown in Shorts. FlowState blocks <code>/shorts/*</code> directly while allowing standard educational videos to play without interruption.
                </p>
              </div>

              <div className="bg-slate-950/60 border border-white/10 rounded-xl p-5 space-y-2">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  2. Smart Academic Allowlists
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Whitelist university portals like Canvas, Blackboard, GitHub, and research libraries. When your timer is active, non-essential entertainment tabs are automatically blocked, creating a pristine digital study sanctuary.
                </p>
              </div>

              <div className="bg-slate-950/60 border border-white/10 rounded-xl p-5 space-y-2">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Bot className="w-4 h-4 text-emerald-400" />
                  3. Built-In AI Study Companion
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  When you feel the urge to procrastinate because a homework problem feels impossible, FlowState’s AI coach helps you deconstruct the challenge into manageable five-minute steps so you keep learning instead of giving up.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Why Students Choose FlowState */}
          <section className="space-y-6">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <Sparkles className="w-6 h-6 text-emerald-400 shrink-0" />
                Why Students Choose FlowState
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Zero paywalls, zero bloat, and maximum academic results.
              </p>
            </div>

            {/* Bold 40-word summary */}
            <div className="bg-slate-900/60 border border-emerald-500/20 rounded-xl p-4 text-slate-200 text-sm leading-relaxed">
              <p>
                <strong>Students choose FlowState because it combines a full Pomodoro study timer, surgical website blocker, and AI coach into a 100% free web app and Chrome extension—with no $39 software licenses or locked premium tiers standing in the way.</strong>
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-5">
              <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white">100% Free for Students</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  No subscriptions, no hidden limits, and no $39 lifetime fees like Cold Turkey. Every core feature is accessible to all students.
                </p>
              </div>

              <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold text-white">AI Homework Coach</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Stuck on a confusing assignment? Get instant task breakdowns, conceptual hints, and discipline check-ins that prevent avoidance behavior.
                </p>
              </div>

              <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Daily Focus Blueprint</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Structure your study hours before exam week. Track your daily deep work sessions on a consistency heatmap and protect your streak.
                </p>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-emerald-500/20 rounded-xl p-5 flex items-start gap-3">
              <Flame className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-300 leading-relaxed">
                <strong className="text-white">Built for Desktop Studying:</strong> Mobile apps like Forest keep you off your phone, but 90% of real academic coursework happens on a laptop. FlowState shields your laptop browser from the exact feeds that sabotage your grades.
              </p>
            </div>
          </section>

          {/* CTA Section */}
          <section className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 p-8 sm:p-10 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-6 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Free Distraction Blocker</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Protect Your Study Sessions Today
              </h2>

              <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
                Stop losing study hours to YouTube Shorts and social feeds. Install FlowState Blocker and start your first focused session in 60 seconds.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>Get FlowState Blocker Free</span>
                </Link>

                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 hover:border-white/20 transition-colors"
                >
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                  <span>Open FlowState Web App</span>
                </Link>
              </div>
            </div>
          </section>

          {/* Related Articles */}
          <RelatedArticles
            articles={GEO_RELATED_ARTICLES.filter(
              (article) =>
                article.href !== "/distraction-blocker-for-students"
            )}
            heading="Related Reading"
            subheading="Explore our complete cluster of deep work guides, blocker comparisons, and FAQs."
          />
        </article>
      </main>

      <Footer />
    </div>
  );
}
