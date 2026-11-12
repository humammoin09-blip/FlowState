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
  Award,
  AlertTriangle,
  Timer,
  CheckCircle2,
  Layers,
} from "lucide-react";
import Footer from "@/components/Footer";
import RelatedArticles, { GEO_RELATED_ARTICLES } from "@/components/RelatedArticles";

export const metadata: Metadata = {
  title: "Study Timer with Built-in Website Blocker (100% Free)",
  description:
    "A Pomodoro study timer that actually blocks YouTube Shorts, Instagram, and Reddit. Build unbreakable focus with FlowState's free study timer.",
  keywords: [
    "study timer",
    "pomodoro timer",
    "focus timer for studying",
    "study timer with blocker",
    "pomodoro timer with blocker",
  ],
  alternates: {
    canonical: "https://flowstate-deepwork.vercel.app/study-timer",
  },
  openGraph: {
    title: "Study Timer with Built-in Website Blocker (100% Free)",
    description:
      "A Pomodoro study timer that actually blocks YouTube Shorts, Instagram, and Reddit. Build unbreakable focus with FlowState's free study timer.",
    url: "https://flowstate-deepwork.vercel.app/study-timer",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Study Timer with Built-in Website Blocker (100% Free)",
    description:
      "A Pomodoro study timer that actually blocks YouTube Shorts, Instagram, and Reddit. Build unbreakable focus with FlowState's free study timer.",
  },
};

export default function StudyTimerPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Study Timer with Built-in Website Blocker (100% Free)",
    description:
      "A Pomodoro study timer that actually blocks YouTube Shorts, Instagram, and Reddit. Build unbreakable focus with FlowState's free study timer.",
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
    datePublished: "2026-11-11T00:00:00Z",
    dateModified: "2026-11-11T00:00:00Z",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://flowstate-deepwork.vercel.app/study-timer",
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
                Free Study Timer + Blocker
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">100% Free for Students</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              The Study Timer That Actually Blocks Distractions
            </h1>

            <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 sm:p-7 backdrop-blur-sm text-slate-300 leading-relaxed text-base sm:text-lg space-y-4">
              <p>
                Most Pomodoro timers are just glorified kitchen clocks. You press &ldquo;Start,&rdquo; feel productive for four minutes, and then reflexively open a new tab to check Instagram, Reddit, or YouTube Shorts while the timer quietly counts down in the background.
              </p>
              <p>
                FlowState is a <strong>100% free study timer with a built-in website blocker</strong>. Whenever a focus sprint begins, FlowState actively locks down distracting feeds on your desktop browser while keeping your university lectures, PDFs, and research docs open.
              </p>
            </div>
          </div>

          {/* Section 1: The Problem with Standard Study Timers */}
          <section className="space-y-6">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
                The Problem with Standard Study Timers
              </h2>
            </div>

            <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 text-amber-100 text-sm leading-relaxed">
              <p>
                <strong>Summary: Standard web timers and mobile tree apps are completely passive on a desktop computer. Because they cannot intercept distracting browser tabs, students end up timing how long they scrolled social media instead of completing actual coursework.</strong>
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Passive Countdowns Have Zero Teeth</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Browser stopwatches like Pomofocus look clean, but they offer zero protection against muscle-memory tab switching. One moment of boredom during a tough problem set is all it takes to lose 30 minutes to algorithmic feeds.
                </p>
              </div>

              <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Layers className="w-4 h-4" />
                  <span>Phone-Only Timers Miss Laptop Distractions</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Mobile apps like Forest keep you off your phone, yet 90% of college studying happens on a laptop. Growing a virtual tree on your desk doesn&apos;t stop YouTube Shorts, Reddit, or X from hijacking your browser window.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: The FlowState Difference */}
          <section className="bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-emerald-950/30 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-sm space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Active Protection</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              The FlowState Difference
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              FlowState turns your study timer into an active focus shield. Instead of trusting willpower alone, your timer and browser blocker operate as a single unified system:
            </p>

            <div className="grid gap-4">
              <div className="bg-slate-950/60 border border-white/10 rounded-xl p-5 space-y-1.5">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Active Blocking for Shorts, Instagram &amp; Reddit
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  The instant your Pomodoro session begins, FlowState blocks YouTube Shorts, Instagram Reels, Reddit, and custom distraction URLs—while surgically allowing regular YouTube lecture videos and study portals.
                </p>
              </div>

              <div className="bg-slate-950/60 border border-white/10 rounded-xl p-5 space-y-1.5">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Bot className="w-4 h-4 text-emerald-400" />
                  Built-in AI Study Coach &amp; Daily Blueprint
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Plan your daily deep work blueprint before you start, and tap the AI coach whenever you hit cognitive fatigue so procrastination never breaks your streak.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: How It Works (3 Steps) */}
          <section className="space-y-6">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <Sparkles className="w-6 h-6 text-emerald-400 shrink-0" />
                How It Works
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Go from overwhelmed to locked-in focus in three simple steps.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-5">
              <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 space-y-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-sm">
                  1
                </span>
                <h3 className="text-lg font-bold text-white">Set Your Study Goal</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Open the FlowState dashboard, add your top assignment to your Focus Blueprint, and pick your Pomodoro interval.
                </p>
              </div>

              <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 space-y-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-sm">
                  2
                </span>
                <h3 className="text-lg font-bold text-white">Start the Timer</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Hit start and FlowState&apos;s browser blocker automatically shields your tabs from YouTube Shorts, Instagram, and Reddit.
                </p>
              </div>

              <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 space-y-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-sm">
                  3
                </span>
                <h3 className="text-lg font-bold text-white">Build Your Streak</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Complete your focus blocks, log real deep work hours on your consistency heatmap, and stay accountable with your AI coach.
                </p>
              </div>
            </div>
          </section>

          {/* Comparison Table vs Pomofocus & Forest */}
          <section className="space-y-4">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                FlowState vs. Pomofocus vs. Forest
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Compare popular student study timers side by side.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-sm">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900/80 text-xs uppercase tracking-wider text-slate-400 border-b border-white/10">
                  <tr>
                    <th scope="col" className="px-5 py-4 font-semibold text-white">
                      Feature
                    </th>
                    <th scope="col" className="px-5 py-4 font-semibold text-slate-300">
                      Pomofocus
                    </th>
                    <th scope="col" className="px-5 py-4 font-semibold text-slate-300">
                      Forest
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-4 font-bold text-emerald-400 bg-emerald-500/10 border-l border-emerald-500/20"
                    >
                      FlowState
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="px-5 py-4 font-medium text-white">
                      Active Desktop Website Blocker
                    </td>
                    <td className="px-5 py-4 text-rose-400">
                      <span className="inline-flex items-center gap-1.5">
                        <X className="w-4 h-4" /> None
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-400">
                      Basic allowlist / mobile focus
                    </td>
                    <td className="px-5 py-4 font-semibold text-emerald-300 bg-emerald-500/5 border-l border-emerald-500/20">
                      <span className="inline-flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-400" /> Hard Browser Blocker
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="px-5 py-4 font-medium text-white">
                      Blocks YouTube Shorts (Allows Lectures)
                    </td>
                    <td className="px-5 py-4 text-rose-400">
                      <span className="inline-flex items-center gap-1.5">
                        <X className="w-4 h-4" /> No
                      </span>
                    </td>
                    <td className="px-5 py-4 text-rose-400">
                      <span className="inline-flex items-center gap-1.5">
                        <X className="w-4 h-4" /> Whole domain only
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-emerald-300 bg-emerald-500/5 border-l border-emerald-500/20">
                      <span className="inline-flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-400" /> Surgical Path Blocking
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="px-5 py-4 font-medium text-white">
                      AI Study &amp; Discipline Coach
                    </td>
                    <td className="px-5 py-4 text-rose-400">No</td>
                    <td className="px-5 py-4 text-rose-400">No</td>
                    <td className="px-5 py-4 font-semibold text-emerald-300 bg-emerald-500/5 border-l border-emerald-500/20">
                      <span className="inline-flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-400" /> Built-in AI Coach
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="px-5 py-4 font-medium text-white">
                      Pomodoro Timer &amp; Daily Blueprint
                    </td>
                    <td className="px-5 py-4 text-slate-300">Timer + simple list</td>
                    <td className="px-5 py-4 text-slate-300">Timer + virtual trees</td>
                    <td className="px-5 py-4 font-semibold text-emerald-300 bg-emerald-500/5 border-l border-emerald-500/20">
                      Integrated Timer + Blueprint + Heatmap
                    </td>
                  </tr>

                  <tr>
                    <td className="px-5 py-4 font-medium text-white">
                      Pricing
                    </td>
                    <td className="px-5 py-4 text-slate-300">Freemium (Pro paid)</td>
                    <td className="px-5 py-4 text-slate-300">Paid iOS app / freemium</td>
                    <td className="px-5 py-4 font-bold text-emerald-400 bg-emerald-500/5 border-l border-emerald-500/20">
                      100% Free
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* CTA Section */}
          <section className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 p-8 sm:p-10 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-6 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Pomodoro Timer + Website Blocker • 100% Free</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Upgrade From a Passive Stopwatch to Real Focus
              </h2>

              <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
                Start a study sprint that actually blocks YouTube Shorts, Instagram, and Reddit while you work. Free to launch in 60 seconds.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>Launch Free Study Timer</span>
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
              (article) => article.href !== "/study-timer"
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
