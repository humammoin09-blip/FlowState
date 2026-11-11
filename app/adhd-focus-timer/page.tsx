import type { Metadata } from "next";
import Link from "next/link";
import {
  Zap,
  ArrowLeft,
  Clock,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Bot,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Timer,
  Flame,
  ShieldAlert,
} from "lucide-react";
import Footer from "@/components/Footer";
import RelatedArticles, { GEO_RELATED_ARTICLES } from "@/components/RelatedArticles";

export const metadata: Metadata = {
  title: "ADHD Focus Timer: A System That Works When Willpower Fails",
  description:
    "Struggling with time blindness and distraction? FlowState's ADHD-friendly focus timer combines an AI coach and hard website blocking to keep you in flow.",
  keywords: [
    "adhd focus timer",
    "focus timer for adhd",
    "time blindness app",
    "adhd productivity tool",
  ],
  alternates: {
    canonical: "https://flowstate-deepwork.vercel.app/adhd-focus-timer",
  },
  openGraph: {
    title: "ADHD Focus Timer: A System That Works When Willpower Fails",
    description:
      "Struggling with time blindness and distraction? FlowState's ADHD-friendly focus timer combines an AI coach and hard website blocking to keep you in flow.",
    url: "https://flowstate-deepwork.vercel.app/adhd-focus-timer",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "ADHD Focus Timer: A System That Works When Willpower Fails",
    description:
      "Struggling with time blindness and distraction? FlowState's ADHD-friendly focus timer combines an AI coach and hard website blocking to keep you in flow.",
  },
};

export default function AdhdFocusTimerPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "ADHD Focus Timer: A System That Works When Willpower Fails",
    description:
      "Struggling with time blindness and distraction? FlowState's ADHD-friendly focus timer combines an AI coach and hard website blocking to keep you in flow.",
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
      "@id": "https://flowstate-deepwork.vercel.app/adhd-focus-timer",
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
                ADHD Focus System
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">Built for Time Blindness &amp; Executive Dysfunction</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              ADHD Focus Timer: A System That Works When Willpower Fails
            </h1>

            <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 sm:p-7 backdrop-blur-sm text-slate-300 leading-relaxed text-base sm:text-lg space-y-4">
              <p>
                If you have an ADHD brain, you already know the painful gap between knowing what you need to do and actually starting it. A basic countdown clock cannot fix executive dysfunction, task paralysis, or <strong>time blindness</strong>—when 10 minutes of &ldquo;checking one thing&rdquo; quietly turns into two hours of scrolling.
              </p>
              <p>
                FlowState is an <strong>ADHD focus timer</strong> built as a complete external executive-function system. Instead of relying on fragile willpower, it pairs structured Focus Blueprints, hard browser-level website blocking, and a real-time AI coach to help you initiate tasks and protect your attention.
              </p>
            </div>
          </div>

          {/* Section 1: Why Traditional Timers Fail ADHD Brains */}
          <section className="space-y-6">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
                Why Traditional Timers Fail ADHD Brains
              </h2>
            </div>

            <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 text-amber-100 text-sm leading-relaxed">
              <p>
                <strong>Summary: Standard timers only measure time—they do not shield you from time blindness or dopamine traps. Once a distraction tab pulls your attention away, a silent countdown in another window cannot bring you back or help you break down an overwhelming assignment.</strong>
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Time Blindness &amp; Invisible Drift</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  ADHD time blindness makes &ldquo;now&rdquo; and &ldquo;not now&rdquo; the only two time zones. You open a new tab to look up a single formula, hit a YouTube Short or Reddit thread, and suddenly the 25-minute timer has been blinking at 00:00 for an hour.
                </p>
              </div>

              <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Task Paralysis Before Starting</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  When a task feels vague or huge—like &ldquo;write term paper&rdquo; or &ldquo;study organic chemistry&rdquo;—staring at a blank stopwatch increases overwhelm. Traditional timers expect you to already have momentum, which is the exact part ADHD makes hardest.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: How FlowState Works for ADHD */}
          <section className="bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-emerald-950/30 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-sm space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>External Executive Function</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              How FlowState Works for ADHD
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              FlowState replaces scattered sticky notes and passive timers with two pillars designed specifically for distracted, easily overwhelmed minds: a structured <strong>Focus Blueprint</strong> and <strong>hard website blocking</strong>.
            </p>

            <div className="grid gap-4">
              <div className="bg-slate-950/60 border border-white/10 rounded-xl p-5 space-y-2">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  1. Focus Blueprint: Eliminate Decision Fatigue
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Instead of facing a chaotic 30-item to-do list, your daily Focus Blueprint locks in clear, prioritized deep work blocks. You always know the single next task in front of you, making it drastically easier to cross the starting line when motivation is low.
                </p>
              </div>

              <div className="bg-slate-950/60 border border-white/10 rounded-xl p-5 space-y-2">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  2. Hard Blocking: Stop Impulse Tab Switching
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  When your timer starts, FlowState&apos;s Chromium extension automatically intercepts dopamine traps like YouTube Shorts, Instagram Reels, and Reddit. Even better, surgical path blocking lets you keep educational YouTube lectures and class docs open while closing the rabbit holes that hijack your hyperfocus.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Key Features */}
          <section className="space-y-6">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <Sparkles className="w-6 h-6 text-emerald-400 shrink-0" />
                Key Features for ADHD Focus
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Everything you need to beat time blindness and finish what you start.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-5">
              <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Timer className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Pomodoro Focus Timer</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Anchor your perception of time with visible, distraction-free OLED focus sprints and structured breaks so hours never vanish unnoticed.
                </p>
              </div>

              <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold text-white">AI Coach</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Stuck in task paralysis? Chat with FlowState&apos;s built-in AI coach to break intimidating assignments into tiny, low-friction first steps in seconds.
                </p>
              </div>

              <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Hard Blocker</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Block short-form feeds and distracting sites at the browser level during sessions—removing temptation before your brain has time to negotiate.
                </p>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-emerald-500/20 rounded-xl p-5 flex items-start gap-3">
              <Flame className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-300 leading-relaxed">
                <strong className="text-white">Zero shame, built-in streak protection:</strong> Missed days happen with ADHD. FlowState tracks your consistency with a visual heatmap and streak saver so one off-day never triggers an all-or-nothing spiral.
              </p>
            </div>
          </section>

          {/* CTA Section */}
          <section className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 p-8 sm:p-10 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-6 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Zap className="w-3.5 h-3.5" />
                <span>Free ADHD Productivity System</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Stop Fighting Your Brain With Passive Timers
              </h2>

              <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
                Launch your Focus Blueprint, turn on hard distraction blocking, and start a guided session in under 60 seconds—completely free.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>Start Your ADHD Focus Session Free</span>
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
              (article) => article.href !== "/adhd-focus-timer"
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
