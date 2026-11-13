import type { Metadata } from "next";
import Link from "next/link";
import {
  Zap,
  ArrowLeft,
  Timer,
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
  Award,
} from "lucide-react";
import Footer from "@/components/Footer";
import RelatedArticles, { GEO_RELATED_ARTICLES } from "@/components/RelatedArticles";

export const metadata: Metadata = {
  title: "Deep Work Timer: Block Distractions & Enter Flow",
  description:
    "A deep work timer that actually blocks distracting websites. FlowState combines a Pomodoro engine with an AI coach and hard website blocker for unbreakable focus.",
  keywords: [
    "deep work timer",
    "deep work app",
    "timer for deep work sessions",
    "focus timer for deep work",
  ],
  alternates: {
    canonical: "https://flowstate-deepwork.vercel.app/deep-work-timer",
  },
  openGraph: {
    title: "Deep Work Timer: Block Distractions & Enter Flow",
    description:
      "A deep work timer that actually blocks distracting websites. FlowState combines a Pomodoro engine with an AI coach and hard website blocker for unbreakable focus.",
    url: "https://flowstate-deepwork.vercel.app/deep-work-timer",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Deep Work Timer: Block Distractions & Enter Flow",
    description:
      "A deep work timer that actually blocks distracting websites. FlowState combines a Pomodoro engine with an AI coach and hard website blocker for unbreakable focus.",
  },
};

export default function DeepWorkTimerPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "The Deep Work Timer That Actually Blocks Distractions",
    description:
      "A deep work timer that actually blocks distracting websites. FlowState combines a Pomodoro engine with an AI coach and hard website blocker for unbreakable focus.",
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
      "@id": "https://flowstate-deepwork.vercel.app/deep-work-timer",
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
                <Timer className="w-3.5 h-3.5" />
                Deep Work Protocol
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">Uninterrupted Cognitive Flow</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              The Deep Work Timer That Actually Blocks Distractions
            </h1>

            <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 sm:p-7 backdrop-blur-sm text-slate-300 leading-relaxed text-base sm:text-lg space-y-4">
              <p>
                In an era dominated by hyper-engineered algorithmic feeds and constant message pings, the ability to perform <strong>deep work</strong>—cognitively demanding, distraction-free concentration—has become the ultimate superpower. Yet most professionals and students still try to execute deep work sessions using basic stopwatch websites or kitchen timers.
              </p>
              <p>
                FlowState is a dedicated <strong>deep work timer</strong> engineered with teeth. It pairs flexible 25, 50, and 90-minute focus protocols with an automated browser-level website blocker, a clear Daily Focus Blueprint, and an AI accountability coach that guards your cognitive stamina from context switching.
              </p>
            </div>
          </div>

          {/* Section 1: Why You Need a Dedicated Deep Work Timer */}
          <section className="space-y-6">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
                Why You Need a Dedicated Deep Work Timer
              </h2>
            </div>

            {/* Bold 40-word summary */}
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 text-amber-100 text-sm leading-relaxed">
              <p>
                <strong>Passive countdown timers only measure passing minutes; they cannot defend your working memory from digital ambush. Research shows a single distraction tab introduces twenty-three minutes of attention residue, destroying deep flow even if the timer keeps counting down in the background.</strong>
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <ShieldAlert className="w-4 h-4" />
                  <span>The Devastation of Attention Residue</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  As computer science professor Cal Newport proved, switching tabs to &ldquo;quickly check&rdquo; an inbox or watch one 30-second Short leaves attention residue that cripples your problem-solving capability long after you click back.
                </p>
              </div>

              <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Kitchen Timers Don&apos;t Stop Tab Reflexes</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Standard web stopwatches like Pomofocus are completely passive. They let you open addictive feeds without resistance, leaving your deep work session compromised while giving you a false sense of accomplishment.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: How FlowState Powers Deep Work */}
          <section className="bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-emerald-950/30 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-sm space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>Full Deep Work Engine</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              How FlowState Powers Deep Work
            </h2>

            {/* Bold 40-word summary */}
            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4 text-emerald-100 text-sm leading-relaxed">
              <p>
                <strong>FlowState turns deep work theory into frictionless execution. By synchronizing a single-objective Focus Blueprint, automatic browser path blocking that shields your tabs without breaking educational lectures, and an AI coach to resolve cognitive friction, it guarantees uninterrupted deep flow sessions.</strong>
              </p>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              FlowState eliminates the common friction points that derail knowledge workers and students before they reach deep immersion:
            </p>

            <div className="grid gap-4">
              <div className="bg-slate-950/60 border border-white/10 rounded-xl p-5 space-y-2">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  1. Focus Blueprint: Define Your MIT Before Starting
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Deep work requires a unambiguous cognitive target. The Focus Blueprint forces you to articulate the single most important task for that block. When the countdown begins, you have zero doubts about what you are building.
                </p>
              </div>

              <div className="bg-slate-950/60 border border-white/10 rounded-xl p-5 space-y-2">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  2. Surgical Path Blocking: Defend Your Immersion
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  While blunt blockers knock out your entire internet connection, FlowState surgically blocks algorithmic routes (such as <code>youtube.com/shorts/*</code>, Instagram Reels, and Reddit feeds) while preserving documentation, tutorials, and research materials.
                </p>
              </div>

              <div className="bg-slate-950/60 border border-white/10 rounded-xl p-5 space-y-2">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Bot className="w-4 h-4 text-emerald-400" />
                  3. Built-in AI Coach: Dismantle Cognitive Fatigue
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Deep work is mentally demanding. When you hit a wall forty minutes into a sprint, FlowState’s AI coach helps you deconstruct the conceptual obstacle into bite-sized steps so you finish strong rather than giving up.
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
                Everything required for elite, high-output deep work sessions.
              </p>
            </div>

            {/* Bold 40-word summary */}
            <div className="bg-slate-900/60 border border-emerald-500/20 rounded-xl p-4 text-slate-200 text-sm leading-relaxed">
              <p>
                <strong>Tailored for serious knowledge workers, FlowState unites customizable ultradian rhythm intervals, minimalist full-screen OLED timers, real-time website blocking, and long-term consistency heatmaps that track cumulative hours spent in true cognitive flow without subscription fees.</strong>
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-5">
              <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Customizable Intervals</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Run standard 25/5 Pomodoros, 50/10 sprints, or 90-minute ultradian deep work blocks suited to high-complexity engineering and writing.
                </p>
              </div>

              <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold text-white">AI Deconstruction Coach</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Break monolithic deliverables into clear execution stages with interactive AI feedback whenever cognitive friction threatens your momentum.
                </p>
              </div>

              <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Automated Browser Defense</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Instant integration with FlowState&apos;s extension ensures distraction tabs are hard-blocked the moment your timer starts.
                </p>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-emerald-500/20 rounded-xl p-5 flex items-start gap-3">
              <Flame className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-300 leading-relaxed">
                <strong className="text-white">GitHub-Style Flow Analytics:</strong> Visual heatmap and deep work session tracking show your real hours of locked-in concentration over weeks and months, turning discipline into tangible visual progress.
              </p>
            </div>
          </section>

          {/* CTA Section */}
          <section className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 p-8 sm:p-10 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-6 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Zap className="w-3.5 h-3.5" />
                <span>100% Free Deep Work Timer</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Enter Unbreakable Flow Today
              </h2>

              <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
                Lock down your browser, clarify your daily priorities, and start your first distraction-free deep work session right now.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>Start Free Deep Work Timer</span>
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
              (article) => article.href !== "/deep-work-timer"
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
