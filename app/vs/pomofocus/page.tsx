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
  Clock,
  ListTodo,
  CheckCircle2,
  DollarSign,
  Layers,
  Scale,
} from "lucide-react";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "FlowState vs Pomofocus: Which is the Best Free Pomodoro Timer?",
  description:
    "Comparing FlowState and Pomofocus. See why FlowState's built-in website blocker beats a standard Pomodoro timer for deep work.",
  keywords: [
    "flowstate vs pomofocus",
    "pomofocus alternative",
    "best free pomodoro timer",
    "pomodoro timer with website blocker",
  ],
  openGraph: {
    title: "FlowState vs Pomofocus: Which is the Best Free Pomodoro Timer?",
    description:
      "Comparing FlowState and Pomofocus. See why FlowState's built-in website blocker beats a standard Pomodoro timer for deep work.",
    url: "https://flowstate-deepwork.vercel.app/vs/pomofocus",
    type: "article",
  },
};

export default function FlowStateVsPomofocusPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "FlowState vs Pomofocus: Which is the Best Free Pomodoro Timer?",
    description:
      "Comparing FlowState and Pomofocus. See why FlowState's built-in website blocker beats a standard Pomodoro timer for deep work.",
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
    datePublished: "2026-10-29T10:00:00Z",
    dateModified: "2026-10-29T10:00:00Z",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://flowstate-deepwork.vercel.app/vs/pomofocus",
    },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Article Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Background Glow Mesh */}
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
          {/* Header & Title */}
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Scale className="w-3.5 h-3.5" />
                Pomodoro Timer Comparison
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">Updated for 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              FlowState vs Pomofocus: Which Timer Actually Keeps You Focused?
            </h1>

            {/* Intro */}
            <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 sm:p-7 backdrop-blur-sm text-slate-300 leading-relaxed text-base sm:text-lg space-y-4">
              <p>
                Pomofocus has earned a loyal following over the years for a good reason: it is simple, lightweight, and gives you a no-nonsense 25-minute Pomodoro countdown right in your browser. If you just need a bare-bones digital clock ticking in the corner of your screen, it gets the job done.
              </p>
              <p>
                The catch is that modern work happens on browsers packed with high-dopamine distractions. A passive timer sitting in an inactive tab can&apos;t stop you when impulse clicks drag you into YouTube Shorts, Reddit threads, or Twitter notifications during a tough task. A timer alone only tracks lost time—it does nothing to protect it. That is why modern deep work tools are moving beyond simple clocks toward active focus environments.
              </p>
            </div>
          </div>

          {/* Clean Tailwind Comparison Table */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                Side-by-Side Comparison
              </h2>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-sm">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-slate-900/80">
                    <th scope="col" className="p-4 sm:p-5 font-semibold text-slate-300 w-2/5">
                      Feature
                    </th>
                    <th scope="col" className="p-4 sm:p-5 font-semibold text-slate-300 w-[30%]">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-rose-400" />
                        <span>Pomofocus</span>
                      </div>
                    </th>
                    <th scope="col" className="p-4 sm:p-5 font-semibold text-emerald-400 w-[30%] bg-emerald-500/[0.04]">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                        <span>FlowState</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {/* Row 1: Website Blocking */}
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 sm:p-5">
                      <div className="flex items-center gap-2 font-medium text-white">
                        <ShieldAlert className="w-4 h-4 text-rose-400 hidden sm:inline" />
                        <span>Website Blocking</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Hard interception of YouTube Shorts, social feeds, and distracting domains.
                      </p>
                    </td>
                    <td className="p-4 sm:p-5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <X className="w-3.5 h-3.5" />
                        No
                      </span>
                    </td>
                    <td className="p-4 sm:p-5 bg-emerald-500/[0.02]">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        Yes (via Blocker)
                      </span>
                    </td>
                  </tr>

                  {/* Row 2: AI Coach */}
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 sm:p-5">
                      <div className="flex items-center gap-2 font-medium text-white">
                        <Bot className="w-4 h-4 text-indigo-400 hidden sm:inline" />
                        <span>AI Coach</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Dynamic session planning, cognitive burnout checks, and focus recovery.
                      </p>
                    </td>
                    <td className="p-4 sm:p-5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <X className="w-3.5 h-3.5" />
                        No
                      </span>
                    </td>
                    <td className="p-4 sm:p-5 bg-emerald-500/[0.02]">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        Yes
                      </span>
                    </td>
                  </tr>

                  {/* Row 3: Task Tracking */}
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 sm:p-5">
                      <div className="flex items-center gap-2 font-medium text-white">
                        <ListTodo className="w-4 h-4 text-cyan-400 hidden sm:inline" />
                        <span>Task Tracking</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Blueprint generation, session analytics, and structured task breakdown.
                      </p>
                    </td>
                    <td className="p-4 sm:p-5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        Basic (Simple text list)
                      </span>
                    </td>
                    <td className="p-4 sm:p-5 bg-emerald-500/[0.02]">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        Advanced (Daily Blueprints)
                      </span>
                    </td>
                  </tr>

                  {/* Row 4: Pricing */}
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 sm:p-5">
                      <div className="flex items-center gap-2 font-medium text-white">
                        <DollarSign className="w-4 h-4 text-emerald-400 hidden sm:inline" />
                        <span>Pricing</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Core timer and productivity feature availability.
                      </p>
                    </td>
                    <td className="p-4 sm:p-5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 text-slate-200 border border-white/10">
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                        Free (Ads / Paid plan for stats)
                      </span>
                    </td>
                    <td className="p-4 sm:p-5 bg-emerald-500/[0.02]">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Free (100% Free Deep Work OS)
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Why Choose FlowState Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Zap className="w-4 h-4" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Why FlowState Beats a Standard Pomodoro Timer
              </h2>
            </div>

            <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 sm:p-7 backdrop-blur-sm text-slate-300 leading-relaxed text-base space-y-4">
              <p>
                Passive Pomodoro timers assume your willpower is ironclad. They expect that seeing a digital clock reach 24:32 will somehow prevent you from opening a new tab and mindlessly clicking on YouTube Shorts or scrolling social media when coding or studying gets frustrating. In reality, willpower depletes quickly under stress.
              </p>
              <p>
                FlowState was built to eliminate this friction entirely. Instead of leaving you to battle algorithms alone, FlowState combines flexible Pomodoro sprint cycles with an integrated browser extension that physically locks out algorithmic distractions the second your timer starts. Coupled with an AI discipline coach that helps generate concrete session blueprints, FlowState doesn&apos;t just watch you work—it defends your attention.
              </p>
            </div>
          </section>

          {/* Why Choose Pomofocus Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <Clock className="w-4 h-4" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                When Does Pomofocus Make Sense?
              </h2>
            </div>

            <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 sm:p-7 backdrop-blur-sm text-slate-300 leading-relaxed text-base space-y-3">
              <p>
                Pomofocus is well-suited for situations where you already have total environmental control. If you work primarily offline, read physical print books, or only want a temporary timer tab without signing into an account or installing any extensions, Pomofocus is quick and hassle-free.
              </p>
              <p className="text-slate-400 text-sm sm:text-base">
                However, for modern digital workers and students who struggle with online distractions while doing research or homework on a desktop browser, a passive clock simply isn&apos;t enough to prevent procrastination.
              </p>
            </div>
          </section>

          {/* Verdict Section */}
          <section className="bg-gradient-to-br from-slate-900/90 via-slate-900/50 to-indigo-950/30 border border-indigo-500/20 rounded-2xl p-6 sm:p-8 backdrop-blur-sm space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The Verdict</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              If you need more than just a ticking clock, choose FlowState.
            </h2>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Pomofocus is a great, simple web timer. But if you want real deep work without falling victim to YouTube rabbit holes and tab distraction, FlowState gives you the automated website blocking, AI accountability, and focus architecture you need—completely free.
            </p>
          </section>

          {/* CTA Section */}
          <section className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 p-8 sm:p-10 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-6 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Timer + Website Blocker + AI Coach</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Upgrade from a basic timer to a deep work system
              </h2>

              <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
                Experience the difference hard website blocking makes during your focus sprints. No ads, no paywalls.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>Try FlowState</span>
                </Link>

                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 hover:border-white/20 transition-colors"
                >
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                  <span>Open Dashboard</span>
                </Link>
              </div>
            </div>
          </section>
        </article>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
