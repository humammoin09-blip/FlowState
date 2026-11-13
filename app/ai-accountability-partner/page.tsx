import type { Metadata } from "next";
import Link from "next/link";
import {
  Zap,
  ArrowLeft,
  Bot,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Clock,
  Layers,
  Flame,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import Footer from "@/components/Footer";
import RelatedArticles, { GEO_RELATED_ARTICLES } from "@/components/RelatedArticles";

export const metadata: Metadata = {
  title: "AI Accountability Partner: Stop Relying on Willpower",
  description:
    "FlowState's AI Accountability Coach gives you brutal reality checks, tracks your focus data, and keeps you consistent. The ultimate AI productivity partner.",
  keywords: [
    "ai accountability partner",
    "ai accountability app",
    "ai coach for productivity",
    "ai discipline coach",
  ],
  alternates: {
    canonical: "https://flowstate-deepwork.vercel.app/ai-accountability-partner",
  },
  openGraph: {
    title: "AI Accountability Partner: Stop Relying on Willpower",
    description:
      "FlowState's AI Accountability Coach gives you brutal reality checks, tracks your focus data, and keeps you consistent. The ultimate AI productivity partner.",
    url: "https://flowstate-deepwork.vercel.app/ai-accountability-partner",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Accountability Partner: Stop Relying on Willpower",
    description:
      "FlowState's AI Accountability Coach gives you brutal reality checks, tracks your focus data, and keeps you consistent. The ultimate AI productivity partner.",
  },
};

export default function AiAccountabilityPartnerPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "AI Accountability Partner: Stop Relying on Willpower",
    description:
      "FlowState's AI Accountability Coach gives you brutal reality checks, tracks your focus data, and keeps you consistent. The ultimate AI productivity partner.",
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
      "@id": "https://flowstate-deepwork.vercel.app/ai-accountability-partner",
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
                <Bot className="w-3.5 h-3.5" />
                Next-Gen AI Accountability
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">Real-Time Behavioral Feedback</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              AI Accountability Partner: Stop Relying on Willpower
            </h1>

            <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 sm:p-7 backdrop-blur-sm text-slate-300 leading-relaxed text-base sm:text-lg space-y-4">
              <p>
                Willpower is biologically finite. When you sit down to work alone, your brain naturally seeks the path of least resistance—rationalizing &ldquo;just five minutes&rdquo; on YouTube Shorts or scrolling social media instead of tackling hard cognitive problems.
              </p>
              <p>
                FlowState introduces the modern <strong>AI accountability partner</strong>. Backed by Google&apos;s Gemini model and directly connected to your deep work timer and browser telemetry, the FlowState AI coach delivers constructive reality checks, breaks down intimidating roadblocks, and tracks your consistency with total objectivity.
              </p>
            </div>
          </div>

          {/* Section 1: Why Human Accountability Fails */}
          <section className="space-y-6">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
                Why Human Accountability Fails
              </h2>
            </div>

            {/* Bold 40-word summary */}
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 text-amber-100 text-sm leading-relaxed">
              <p>
                <strong>Human accountability partnerships constantly dissolve because friends get busy, time zones mismatch, and social politeness prevents honest feedback. When accountability depends on sporadic text check-ins, people easily accept weak excuses and fail to intercept real-time procrastination in the moment it strikes.</strong>
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <ShieldAlert className="w-4 h-4" />
                  <span>The &ldquo;Polite Excuse&rdquo; Trap</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  When you tell a friend you skipped your study block because you were &ldquo;tired,&rdquo; they politely validate you. A human peer rarely asks tough questions or analyzes the digital friction that actually derailed your momentum.
                </p>
              </div>

              <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Asynchronous Delay &amp; Invisibility</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  By the time your accountability partner replies hours later, the afternoon is already lost. Human partners cannot watch your active browser session, spot distraction drift, or offer instant recalibration when focus breaks down.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: How the FlowState AI Coach Works */}
          <section className="bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-emerald-950/30 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-sm space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              <Bot className="w-4 h-4" />
              <span>Intelligent Discipline Architecture</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              How the FlowState AI Coach Works
            </h2>

            {/* Bold 40-word summary */}
            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4 text-emerald-100 text-sm leading-relaxed">
              <p>
                <strong>Powered by Gemini, FlowState’s AI coach functions as an always-on discipline partner. It analyzes your daily blueprints, breaks intimidating assignments into low-friction micro-milestones, interprets real focus session metrics, and provides tailored psychological strategies when resistance or mental fatigue strikes.</strong>
              </p>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Instead of generic motivational quotes, the FlowState AI Coach interacts with your actual deep work workflow through three core mechanisms:
            </p>

            <div className="grid gap-4">
              <div className="bg-slate-950/60 border border-white/10 rounded-xl p-5 space-y-2">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  1. Pre-Session Blueprint Refinement
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Before you start the timer, share your top goals with the AI Coach. It identifies hidden scope creep, flags unrealistically massive tasks, and helps you formulate clear, measurable criteria for a successful session.
                </p>
              </div>

              <div className="bg-slate-950/60 border border-white/10 rounded-xl p-5 space-y-2">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  2. Immediate Cognitive De-Escalation
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  When you find yourself wanting to abandon a difficult coding bug or calculus problem, click the AI Coach. It guides you through the Socratic method to identify the exact sticking point and formulate a five-minute experiment to resume progress.
                </p>
              </div>

              <div className="bg-slate-950/60 border border-white/10 rounded-xl p-5 space-y-2">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  3. Post-Session Telemetry &amp; Streak Analysis
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  The AI reviews your completed sprint cycles, evaluates daily velocity, and provides an honest reflection. If your focus wavered, it helps you isolate the environmental trigger rather than wallowing in guilt.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: What Makes It Different */}
          <section className="space-y-6">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <Sparkles className="w-6 h-6 text-emerald-400 shrink-0" />
                What Makes It Different
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Why FlowState outperforms standalone chatbots and passive habit apps.
              </p>
            </div>

            {/* Bold 40-word summary */}
            <div className="bg-slate-900/60 border border-emerald-500/20 rounded-xl p-4 text-slate-200 text-sm leading-relaxed">
              <p>
                <strong>Unlike generic chatbots detached from your browser, FlowState’s AI accountability partner operates inside your actual workspace. It coordinates with real-time website blocking, enforces timer disciplines, protects your streak with zero judgment, and provides actionable coaching tailored to your objective telemetry.</strong>
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-5">
              <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Directly Tied to Blocker</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Your AI Coach isn&apos;t just talk. It works alongside an automated extension that physically intercepts YouTube Shorts, Instagram, and Reddit while you work.
                </p>
              </div>

              <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Objective &amp; Non-Judgmental</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  No awkward social anxiety or fear of embarrassment. FlowState gives you direct, constructive truth that keeps you moving forward without shame.
                </p>
              </div>

              <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Always Available (24/7)</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Whether you are studying at 6:00 AM or grinding through code at midnight, your accountability coach is active, awake, and ready to keep you in flow.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 p-8 sm:p-10 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-6 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Zap className="w-3.5 h-3.5" />
                <span>Zero Subscription • 100% Free</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Meet Your 24/7 AI Accountability Coach
              </h2>

              <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
                Connect your Focus Blueprint, activate hard distraction blocking, and experience accountability that actually works.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>Start with AI Coach Free</span>
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
              (article) => article.href !== "/ai-accountability-partner"
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
