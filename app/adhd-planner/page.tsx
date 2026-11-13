import type { Metadata } from "next";
import Link from "next/link";
import {
  Zap,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Bot,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Clock,
  Layers,
  Flame,
} from "lucide-react";
import Footer from "@/components/Footer";
import RelatedArticles, { GEO_RELATED_ARTICLES } from "@/components/RelatedArticles";

export const metadata: Metadata = {
  title: "ADHD Planner: A System That Works When Willpower Fails",
  description:
    "An ADHD-friendly planner that combines a focus timer, AI coach, and hard website blocker. Build unbreakable focus and stop losing time to distractions.",
  keywords: [
    "adhd planner",
    "adhd planner for adults",
    "adhd productivity",
    "adhd focus system",
    "adhd time management",
  ],
  alternates: {
    canonical: "https://flowstate-deepwork.vercel.app/adhd-planner",
  },
  openGraph: {
    title: "ADHD Planner: A System That Works When Willpower Fails",
    description:
      "An ADHD-friendly planner that combines a focus timer, AI coach, and hard website blocker. Build unbreakable focus and stop losing time to distractions.",
    url: "https://flowstate-deepwork.vercel.app/adhd-planner",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "ADHD Planner: A System That Works When Willpower Fails",
    description:
      "An ADHD-friendly planner that combines a focus timer, AI coach, and hard website blocker. Build unbreakable focus and stop losing time to distractions.",
  },
};

export default function AdhdPlannerPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "ADHD Planner: A System That Works When Willpower Fails",
    description:
      "An ADHD-friendly planner that combines a focus timer, AI coach, and hard website blocker. Build unbreakable focus and stop losing time to distractions.",
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
      "@id": "https://flowstate-deepwork.vercel.app/adhd-planner",
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
                <Calendar className="w-3.5 h-3.5" />
                ADHD Executive Function System
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">Built for Task Paralysis &amp; Time Blindness</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              ADHD Planner: A System That Works When Willpower Fails
            </h1>

            <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 sm:p-7 backdrop-blur-sm text-slate-300 leading-relaxed text-base sm:text-lg space-y-4">
              <p>
                Most planners are designed for neurotypical brains that can smoothly transition between tasks, estimate hours accurately, and maintain steady motivation. For adults with ADHD, paper notebooks and bloated productivity apps quickly turn into digital graveyards of half-finished checklists and shame.
              </p>
              <p>
                FlowState is a next-generation <strong>ADHD planner</strong> designed from the ground up for minds battling <strong>executive dysfunction</strong> and <strong>time blindness</strong>. Instead of asking you to manage an overwhelming to-do list, it acts as an external operating system—combining a streamlined single-task Focus Blueprint, hard browser distraction blocking, and a proactive AI accountability coach.
              </p>
            </div>
          </div>

          {/* Section 1: Why Traditional Planners Fail ADHD Brains */}
          <section className="space-y-6">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
                Why Traditional Planners Fail ADHD Brains
              </h2>
            </div>

            {/* Bold 40-word summary */}
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 text-amber-100 text-sm leading-relaxed">
              <p>
                <strong>Traditional planners assume steady executive function, reliable time estimation, and durable willpower. For ADHD adults, gigantic to-do lists trigger cognitive overload, time blindness turns ten-minute breaks into hours of doomscrolling, and passive notebooks cannot protect your attention from digital dopamine traps.</strong>
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Executive Dysfunction &amp; Overwhelm</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  When faced with twenty unprioritized items on a planner page, the ADHD brain cannot easily sequence urgency. This dopamine deficit triggers task paralysis, causing you to freeze or escape into low-effort distractions.
                </p>
              </div>

              <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Time Blindness &amp; Vanishing Hours</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Static calendar boxes cannot communicate the real physical passing of time. Without an active, high-contrast timer anchored to your immediate task, an entire afternoon quietly slips away to impulsive tab switching.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: The FlowState System */}
          <section className="bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-emerald-950/30 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-sm space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>External Operating System</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              The FlowState System
            </h2>

            {/* Bold 40-word summary */}
            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4 text-emerald-100 text-sm leading-relaxed">
              <p>
                <strong>The FlowState system replaces overwhelming task lists with an integrated executive architecture. By synchronizing a focused daily blueprint, automated browser-level site blocking, and an on-demand AI coach, it dismantles friction, eliminates task paralysis, and safeguards your dopamine throughout the working day.</strong>
              </p>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Instead of relying on fragile self-control, FlowState provides three interconnected pillars engineered specifically for ADHD minds:
            </p>

            <div className="grid gap-4">
              <div className="bg-slate-950/60 border border-white/10 rounded-xl p-5 space-y-2">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  1. Focus Blueprint: One Priority at a Time
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  FlowState collapses chaotic backlogs into a disciplined Daily Blueprint. You define your Most Important Tasks (MITs) and work through them sequentially. By shielding you from future tasks until the current one is done, it completely removes decision fatigue.
                </p>
              </div>

              <div className="bg-slate-950/60 border border-white/10 rounded-xl p-5 space-y-2">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  2. Hard Website Blocking: Zero-Friction Defense
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  The moment your planning block turns into action, FlowState’s browser extension activates hard path blocking. Impulsive clicks to YouTube Shorts, Instagram Reels, and Reddit are halted instantly—while keeping essential documentation, lectures, and tools open.
                </p>
              </div>

              <div className="bg-slate-950/60 border border-white/10 rounded-xl p-5 space-y-2">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Bot className="w-4 h-4 text-emerald-400" />
                  3. Built-In AI Coach: Beat Procrastination at the Root
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  When a task triggers dread or avoidance, FlowState’s AI coach helps you break the intimidating assignment into microscopic, five-minute starting milestones. You never have to stare at a blank screen wondering how to begin.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Key Features */}
          <section className="space-y-6">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <Sparkles className="w-6 h-6 text-emerald-400 shrink-0" />
                Key Features
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                A complete productivity suite crafted to support neurodivergent workflows.
              </p>
            </div>

            {/* Bold 40-word summary */}
            <div className="bg-slate-900/60 border border-emerald-500/20 rounded-xl p-4 text-slate-200 text-sm leading-relaxed">
              <p>
                <strong>Engineered for adult ADHD, FlowState unites high-contrast Pomodoro timers to overcome time blindness, an interactive AI coach to dismantle intimidating projects, surgical browser blocking against dopamine rabbit holes, and guilt-free streak tracking that forgives off-days without triggering shame spirals.</strong>
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-5">
              <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Visual Sprint Timer</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Make time visible with OLED-friendly high-contrast countdowns, custom work/break intervals, and calming chimes that gently anchor attention.
                </p>
              </div>

              <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold text-white">AI Deconstruction</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Transform vague, intimidating goals like &ldquo;prepare tax filing&rdquo; into concrete, bite-sized micro-steps with single-click AI suggestions.
                </p>
              </div>

              <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Surgical Blocker</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Block addictive algorithmic feeds at the browser network layer so your impulsive tab switches hit an iron wall rather than an endless feed.
                </p>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-emerald-500/20 rounded-xl p-5 flex items-start gap-3">
              <Flame className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-300 leading-relaxed">
                <strong className="text-white">Zero-Shame Consistency Heatmap:</strong> Traditional planners make you feel like a failure after missing two days. FlowState uses visual heatmaps and streak-saver mechanics so a rough afternoon never ruins your long-term momentum.
              </p>
            </div>
          </section>

          {/* CTA Section */}
          <section className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 p-8 sm:p-10 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-6 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Zap className="w-3.5 h-3.5" />
                <span>100% Free ADHD Productivity System</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Stop Fighting Your Brain. Upgrade to FlowState.
              </h2>

              <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
                Set up your Focus Blueprint, turn on hard website blocking, and start your first guided focus sprint in under 60 seconds.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>Start Free ADHD Focus Session</span>
                </Link>

                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 hover:border-white/20 transition-colors"
                >
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                  <span>Open FlowState Dashboard</span>
                </Link>
              </div>
            </div>
          </section>

          {/* Related Articles */}
          <RelatedArticles
            articles={GEO_RELATED_ARTICLES.filter(
              (article) => article.href !== "/adhd-planner"
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
