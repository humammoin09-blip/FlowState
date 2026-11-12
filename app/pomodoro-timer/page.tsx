import type { Metadata } from "next";
import Link from "next/link";
import {
  Zap,
  ArrowLeft,
  Check,
  X,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Bot,
  Timer,
  AlertTriangle,
  Layers,
  CheckCircle2,
  Flame,
  Award,
} from "lucide-react";
import Footer from "@/components/Footer";
import RelatedArticles, { GEO_RELATED_ARTICLES } from "@/components/RelatedArticles";

export const metadata: Metadata = {
  title: "Pomodoro Timer with Website Blocker (Free & Open Source)",
  description:
    "A Pomodoro timer that actually blocks distracting websites. FlowState combines the Pomodoro technique with an AI coach and hard site blocker.",
  keywords: [
    "pomodoro timer with blocker",
    "pomodoro timer free",
    "pomodoro timer for studying",
    "focus timer with blocker",
  ],
  alternates: {
    canonical: "https://flowstate-deepwork.vercel.app/pomodoro-timer",
  },
  openGraph: {
    title: "Pomodoro Timer with Website Blocker (Free & Open Source)",
    description:
      "A Pomodoro timer that actually blocks distracting websites. FlowState combines the Pomodoro technique with an AI coach and hard site blocker.",
    url: "https://flowstate-deepwork.vercel.app/pomodoro-timer",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pomodoro Timer with Website Blocker (Free & Open Source)",
    description:
      "A Pomodoro timer that actually blocks distracting websites. FlowState combines the Pomodoro technique with an AI coach and hard site blocker.",
  },
};

export default function PomodoroTimerPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "The Pomodoro Timer That Actually Blocks Distractions",
    description:
      "A Pomodoro timer that actually blocks distracting websites. FlowState combines the Pomodoro technique with an AI coach and hard site blocker.",
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
    datePublished: "2026-11-12T00:00:00Z",
    dateModified: "2026-11-12T00:00:00Z",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://flowstate-deepwork.vercel.app/pomodoro-timer",
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
                Pomodoro + Hard Blocker
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">Free &amp; Open Source Core</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              The Pomodoro Timer That Actually Blocks Distractions
            </h1>

            <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 sm:p-7 backdrop-blur-sm text-slate-300 leading-relaxed text-base sm:text-lg space-y-4">
              <p>
                The Pomodoro Technique has helped millions of people divide intimidating projects into manageable 25-minute sprints. But modern web browsers were not around when Francesco Cirillo invented the kitchen-timer method in the late 1980s.
              </p>
              <p>
                Today, an online countdown alone cannot protect you against multi-billion dollar algorithms. <strong>FlowState</strong> combines a clean, distraction-free Pomodoro timer with an <strong>automated hard website blocker</strong> and an <strong>AI accountability coach</strong>—giving the classic Pomodoro protocol the enforcement teeth it desperately needs.
              </p>
            </div>
          </div>

          {/* Section 1: Why Pomodoro Alone Isn't Enough */}
          <section className="space-y-6">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
                Why Pomodoro Alone Isn&apos;t Enough
              </h2>
            </div>

            <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 text-amber-100 text-sm leading-relaxed">
              <p>
                <strong>Summary: When willpower fails, a passive countdown timer cannot stop reflex tab-switching. Without active site blocking, students and knowledge workers frequently start a 25-minute Pomodoro only to spend 20 minutes scrolling YouTube Shorts, Instagram, or Reddit in adjacent browser tabs.</strong>
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Willpower Is a Depleting Resource</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Every time you force yourself not to check a notification or resist opening an addictive website, your cognitive stamina drains. By your third or fourth Pomodoro cycle, willpower collapses, and a single &ldquo;quick peek&rdquo; ruins the rest of your afternoon.
                </p>
              </div>

              <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Layers className="w-4 h-4" />
                  <span>The Passive Stopwatch Trap</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Standard web timers like Pomofocus or kitchen clocks are passive observers. They count down whether you are writing high-leverage code or watching endless 30-second video clips. They measure time, but do nothing to protect it.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: How FlowState Enhances Pomodoro */}
          <section className="bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-emerald-950/30 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-sm space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Next-Gen Pomodoro System</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              How FlowState Enhances Pomodoro
            </h2>

            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4 text-emerald-100 text-sm leading-relaxed">
              <p>
                <strong>Summary: FlowState turns the Pomodoro technique into an automated distraction-proof pipeline. The moment you start a sprint, our browser extension enforces hard URL blocking across Shorts, Reels, and Reddit while an integrated AI coach keeps you accountable and unstuck.</strong>
              </p>
            </div>

            <div className="grid gap-4">
              <div className="bg-slate-950/60 border border-white/10 rounded-xl p-5 space-y-2">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  1. Automatic Hard Blocker During Every Sprint
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  When you press start, FlowState communicates with your browser extension to instantly intercept social feeds, short-form video hooks, and custom domain distractions. When the break bell rings, restrictions relax automatically.
                </p>
              </div>

              <div className="bg-slate-950/60 border border-white/10 rounded-xl p-5 space-y-2">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Bot className="w-4 h-4 text-emerald-400" />
                  2. Built-in AI Coach When Resistance Hits
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Most procrastination happens during the first three minutes of a sprint because a task feels too broad. FlowState&apos;s AI coach breaks vague items (&ldquo;study for bio midterm&rdquo;) into actionable, concrete micro-steps so you build immediate momentum.
                </p>
              </div>

              <div className="bg-slate-950/60 border border-white/10 rounded-xl p-5 space-y-2">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  3. Focus Blueprint &amp; Streak Analytics
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Instead of disconnected timer sessions, plan your day in the Focus Blueprint. Track completed blocks on your GitHub-style consistency heatmap and safeguard your streak even when life interrupts.
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
                Everything required for elite deep work in a modern browser environment.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-5">
              <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Timer className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Customizable Pomodoro Intervals</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Run classic 25/5 minute cycles or customize 50/10 ultradian rhythm blocks with gentle chimes and fullscreen OLED display modes.
                </p>
              </div>

              <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold text-white">AI Accountability Coach</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Need a nudge to start or reflect after a grueling session? Get contextual guidance, friction analysis, and blueprint suggestions instantly.
                </p>
              </div>

              <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Surgical Path Blocker</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Block YouTube Shorts, Instagram Reels, and distracting domains at the browser level while keeping professor lectures and study portals open.
                </p>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-emerald-500/20 rounded-xl p-5 flex items-start gap-3">
              <Flame className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-300 leading-relaxed">
                <strong className="text-white">100% Free &amp; Open Source Core:</strong> FlowState does not lock essential blocking features behind monthly paywalls. Download the browser extension, launch the web app, and get into flow immediately.
              </p>
            </div>
          </section>

          {/* CTA Section */}
          <section className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 p-8 sm:p-10 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-6 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Timer className="w-3.5 h-3.5" />
                <span>Modern Deep Work Timer</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Experience Pomodoro with Real Protection
              </h2>

              <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
                Stop fighting dopamine algorithms with fragile willpower. Block distractions automatically during your focus sprints.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>Start Free Pomodoro Session</span>
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
              (article) => article.href !== "/pomodoro-timer"
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
