import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Zap,
  Clock,
  BookOpen,
  CheckCircle2,
  Smartphone,
  Monitor,
  History,
  Timer,
  Compass,
  ShieldAlert,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Quote,
} from "lucide-react";
import Footer from "@/components/Footer";
import RelatedArticles, { GEO_RELATED_ARTICLES } from "@/components/RelatedArticles";

export const metadata: Metadata = {
  title: "How to Stop YouTube Shorts While Studying (7 Practical Tips)",
  description:
    "Struggling with YouTube Shorts? Learn 7 practical ways to block Shorts and reclaim your study time using Focus Apps like FlowState.",
  keywords: [
    "how to stop youtube shorts",
    "youtube shorts blocker",
    "block shorts while studying",
    "leechblock alternative",
    "unhook alternative",
    "flowstate vs leechblock",
    "flowstate vs unhook",
  ],
  openGraph: {
    title: "How to Stop YouTube Shorts While Studying (7 Practical Tips)",
    description:
      "Struggling with YouTube Shorts? Learn 7 practical ways to block Shorts and reclaim your study time using Focus Apps like FlowState.",
    url: "https://flowstate-deepwork.vercel.app/blog/how-to-stop-youtube-shorts",
    type: "article",
  },
};

export default function YouTubeShortsGuidePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Stop YouTube Shorts While Studying (7 Practical Tips)",
    description:
      "Struggling with YouTube Shorts? Learn 7 practical ways to block Shorts and reclaim your study time using Focus Apps like FlowState.",
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
    dateModified: "2026-11-02T10:00:00Z",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://flowstate-deepwork.vercel.app/blog/how-to-stop-youtube-shorts",
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
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] opacity-60" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] opacity-60" />
      </div>

      {/* Top Header */}
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
      <main className="flex-1 relative z-10 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <article className="space-y-10">
          {/* Article Header & Title */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <BookOpen className="w-3.5 h-3.5" />
                Study Productivity Guide
              </span>
              <span className="text-slate-500">•</span>
              <span className="inline-flex items-center gap-1 text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                6 min read
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">Updated October 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              How to Stop YouTube Shorts While Studying
            </h1>

            {/* Intro Problem Statement */}
            <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 sm:p-7 backdrop-blur-sm text-slate-300 leading-relaxed text-base sm:text-lg">
              <p>
                You open YouTube intending to take a quick 5-minute break between problem sets or check a 3-minute explanation for a difficult lecture topic. But the moment the app loads, an auto-playing YouTube Shorts feed pulls you in. You tell yourself you will watch just one clip—and before you know it, you are mindlessly swiping through video after video, only to look up at the clock and realize you just lost 2 hours of prime study time.
              </p>
              <p className="mt-3 text-slate-400 text-sm sm:text-base">
                Short-form video feeds are scientifically engineered around variable reward intervals that trigger constant dopamine hits. When you are studying or under cognitive strain, your brain naturally seeks relief—and YouTube Shorts is designed to exploit that vulnerability. Fortunately, with the right combination of friction, environment design, and automated tools, you can permanently dismantle the loop and take back control of your academic schedule.
              </p>
            </div>

            {/* Statistics & Expert Quote Card */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-slate-900/60 border border-emerald-500/20 rounded-xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Research Benchmark</span>
                </div>
                <p className="text-2xl font-black text-white">2.4+ Hours Daily</p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Studies show students lose 2+ hours daily to short-form video feeds. Furthermore, UC Irvine research reveals it requires an average of <strong>23 minutes and 15 seconds</strong> to regain deep cognitive focus after a single digital distraction.
                </p>
              </div>

              <div className="bg-slate-900/60 border border-indigo-500/20 rounded-xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                  <Quote className="w-3.5 h-3.5" />
                  <span>Cognitive Science Insight</span>
                </div>
                <blockquote className="text-xs text-slate-200 italic leading-relaxed">
                  &ldquo;Social algorithms optimize for variable capture, not comprehension. When studying under cognitive strain, short-form dopamine loops override willpower every single time.&rdquo;
                </blockquote>
                <p className="text-[11px] text-slate-400">— Dr. Gloria Mark, Attention Researcher &amp; Author of <em>Attention Span</em></p>
              </div>
            </div>
          </div>

          {/* 7 Tips Section */}
          <section className="space-y-6">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                How Can You Stop YouTube Shorts While Protecting Your Study Focus?
              </h2>
            </div>

            {/* Answer-First 40-60 Word Bold Summary */}
            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 text-emerald-100 text-sm leading-relaxed">
              <p>
                <strong>Summary: To eliminate YouTube Shorts while studying, students must replace willpower with automated systems. Effective techniques include uninstalling mobile apps, pausing YouTube watch history to clear homepage feeds, creating dedicated study browser profiles, and using surgical path blockers that disable Shorts routes while keeping academic lectures, coding walkthroughs, and educational tutorials completely accessible.</strong>
              </p>
            </div>

            <div className="grid gap-6">
              {/* Tip 1 */}
              <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm transition hover:border-white/15">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                      1. Why Should You Uninstall the YouTube App From Your Mobile Phone?
                    </h3>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                      The mobile YouTube application is optimized for thumb swiping and instant sensory gratification, making it nearly impossible to resist when your device is resting on your study desk. Deleting the app forces you to access YouTube only via a mobile web browser, introducing valuable physical friction that stops impulsive tap-and-scroll habits. For even greater focus, keep your phone entirely in another room during active study sessions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tip 2 */}
              <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm transition hover:border-white/15">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                    <Monitor className="w-5 h-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                      2. Why Use YouTube Exclusively on Desktop for Academic Research?
                    </h3>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                      Whenever you need YouTube for long-form lectures, walkthroughs, or academic tutorials, restrict yourself strictly to your desktop or laptop. Desktop environments make infinite scrolling noticeably more clumsy than mobile gestures, giving your conscious mind time to realize when you are drifting off-task. Maximize your lecture in theater or fullscreen mode immediately to hide distracting sidebar recommendations.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tip 3 */}
              <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm transition hover:border-white/15">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <History className="w-5 h-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                      3. How Does Pausing Watch History Blank Out Your YouTube Feed?
                    </h3>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                      YouTube's recommendation algorithm feeds you addictive Shorts based directly on your browsing patterns and past video history. By navigating to your Google account settings and pausing your YouTube watch history, the platform replaces your homepage feed with a completely empty, neutral search box. Without tempting thumbnails to catch your gaze, you can search exclusively for the lesson you need and exit as soon as it concludes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tip 4 */}
              <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm transition hover:border-white/15">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <Timer className="w-5 h-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                      4. Why Anchor Your Study Sessions with a Pomodoro Timer?
                    </h3>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                      Unstructured study sessions cause cognitive exhaustion, which triggers the subconscious urge to open high-dopamine video feeds for temporary relief. Structuring your workday into strict 25 or 50-minute focus sprints creates a firm mental commitment with a defined finish line. Knowing that a scheduled rest interval is approaching prevents your mind from seeking instant escape in the middle of complex assignments.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tip 5 */}
              <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm transition hover:border-white/15">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                      5. How Does a Dedicated &quot;Study Only&quot; Browser Profile Prevent Distractions?
                    </h3>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                      Browsing with your personal Google account logged in immediately surfaces your favorite gaming channels, podcasts, and trending Shorts. Set up a separate, clean browser profile specifically designated for university or exam prep where you remain completely signed out of entertainment subscriptions. This physical separation prevents your muscle memory from clicking into personalized distraction feeds when opening new tabs.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tip 6 */}
              <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm transition hover:border-white/15">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                      6. Why Use a Targeted Focus Blocker to Remove Shorts Surgically?
                    </h3>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                      Standard website blockers often block the entire YouTube domain, which leaves you stranded when you legitimately need to watch university lectures or coding tutorials. Modern tools like FlowState Blocker specifically intercept and shut down YouTube Shorts routes and addictive algorithmic loops while preserving access to essential educational content. This guarantees you can learn freely without constantly battling willpower fatigue.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tip 7 */}
              <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm transition hover:border-white/15">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                      7. Why Schedule Dedicated Entertainment Windows Instead of Micro-Breaks?
                    </h3>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                      Using fast-paced short videos as a quick study pause is dangerous because short clips never provide restorative mental rest. Instead, schedule a deliberate 30-minute entertainment window in the evening after your primary coursework is finished. During brief 5-minute study breaks, step away from screens to drink water, stretch, or look out a window to genuinely recharge your mental energy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section: How FlowState Blocker Solves This Automatically */}
          <section className="bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-emerald-950/30 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-sm space-y-6">
            <div className="flex items-center gap-2.5 text-xs font-semibold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Intelligent Path Blocking</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              How Does FlowState Blocker Surgically Block Shorts Without Breaking Lectures?
            </h2>

            {/* Answer-First 40-60 Word Bold Summary */}
            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 text-emerald-100 text-sm leading-relaxed">
              <p>
                <strong>Summary: Traditional website blockers operate at the domain level, forcing students to either block all of YouTube—cutting off university lectures—or leave it open to dopamine traps. FlowState Blocker introduces surgical path blocking, inspecting URLs in real time to intercept Shorts feeds and recommendations while keeping lecture videos completely intact for distraction-free learning.</strong>
              </p>
            </div>

            <div className="space-y-4 text-slate-300 leading-relaxed text-base">
              <p>
                The fundamental flaw of traditional website blockers (like Cold Turkey, Freedom, or basic hosts file blockers) is that they operate exclusively at the <strong>domain level</strong>. They see <code>youtube.com</code> as one monolithic entity. Your only two choices are:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-300 pl-2">
                <li><strong className="text-rose-400">Nuclear Block:</strong> Block the entire domain <code>youtube.com</code>. This prevents distractions, but it also completely cuts off your access to university lectures, 3Blue1Brown calculus visualizations, programming tutorials, and homework explanations.</li>
                <li><strong className="text-amber-400">Zero Protection:</strong> Leave YouTube unblocked so you can watch your lecture, exposing yourself to auto-playing Shorts, clickbait thumbnails, and recommendation rabbit holes.</li>
              </ul>
              <p>
                <strong>FlowState Blocker solves this with surgical Path Blocking.</strong> Instead of severing the entire domain connection, the FlowState Chrome extension inspects the full URL path in real time.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Allowed: Study Lectures</span>
                </div>
                <p className="text-xs text-slate-300 font-mono bg-slate-950/60 px-2.5 py-1.5 rounded border border-white/5">
                  youtube.com/watch?v=...
                </p>
                <p className="text-xs text-slate-400">
                  Full-length lecture videos, coding walkthroughs, and course tutorials remain completely open and uninterrupted.
                </p>
              </div>

              <div className="bg-rose-950/30 border border-rose-500/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Blocked: Infinite Algorithmic Feeds</span>
                </div>
                <p className="text-xs text-slate-300 font-mono bg-slate-950/60 px-2.5 py-1.5 rounded border border-white/5">
                  youtube.com/shorts/*
                </p>
                <p className="text-xs text-slate-400">
                  Shorts URLs, algorithmic home shelves, and addictive feeds are intercepted instantly with zero willpower required.
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-300 pt-2">
              With FlowState Path Blocking, you never have to choose between having the study materials you need and protecting your attention from mindless dopamine scrolling. You get deep focus automatically.
            </p>

            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-md shadow-emerald-500/20"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                <span>Get FlowState Blocker Free</span>
              </Link>
            </div>
          </section>

          {/* Section: Why Use FlowState Instead of LeechBlock and Unhook? */}
          <section className="bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-indigo-950/30 border border-indigo-500/20 rounded-2xl p-6 sm:p-8 backdrop-blur-sm space-y-6">
            <div className="flex items-center gap-2.5 text-xs font-semibold text-indigo-400">
              <Sparkles className="w-4 h-4" />
              <span>Free Distraction Blocker Comparison</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Why Use FlowState Instead of LeechBlock and Unhook?
            </h2>

            {/* 50-word bold summary */}
            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 text-emerald-100 text-sm leading-relaxed">
              <p>
                <strong>While LeechBlock and Unhook are great for hiding YouTube Shorts, they require manual setup and don&apos;t block other sites. FlowState combines a Pomodoro timer, an AI coach, and a hard site blocker that automatically blocks Shorts and distracting sites in one click.</strong>
              </p>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              When searching for free tools to stop YouTube Shorts, browser extensions like <strong>Unhook</strong> (Remove YouTube Recommended Videos) and <strong>LeechBlock NG</strong> are popular open-source choices. However, there is a fundamental difference in architecture: Unhook and LeechBlock are single-purpose utilities requiring tedious manual configuration, whereas FlowState is an automated focus system designed specifically for deep study sessions.
            </p>

            {/* Comparison Table: FlowState vs LeechBlock + Unhook (Focus: Automation vs Manual Setup) */}
            <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950/60">
              <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-white/10">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold text-white">Focus Dimension</th>
                    <th scope="col" className="px-4 py-3 font-semibold text-slate-300">LeechBlock + Unhook</th>
                    <th scope="col" className="px-4 py-3 font-bold text-emerald-400 bg-emerald-500/10 border-l border-emerald-500/20">FlowState</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="px-4 py-3 font-medium text-white">Setup &amp; Automation</td>
                    <td className="px-4 py-3 text-amber-400">Manual Setup (Type regex rules, configure blocksets, toggle multiple CSS checkboxes)</td>
                    <td className="px-4 py-3 font-semibold text-emerald-300 bg-emerald-500/5 border-l border-emerald-500/20">100% Automated (Blocks Shorts, Reels &amp; doomscrolling in 1 click)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-white">Blocking Scope</td>
                    <td className="px-4 py-3 text-slate-400">Fragmented (Unhook only affects YouTube; LeechBlock requires manual URL lists)</td>
                    <td className="px-4 py-3 font-semibold text-emerald-300 bg-emerald-500/5 border-l border-emerald-500/20">Unified Cross-Site (Shorts, Reels, Reddit &amp; entertainment tabs)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-white">Lecture Preservation</td>
                    <td className="px-4 py-3 text-slate-300">Hides UI elements manually; prone to breaking with YouTube updates</td>
                    <td className="px-4 py-3 font-semibold text-emerald-300 bg-emerald-500/5 border-l border-emerald-500/20">Surgical Path Blocking (Lectures work smoothly; Shorts routes closed)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-white">AI Accountability Coach</td>
                    <td className="px-4 py-3 text-rose-400">None (Pure static blocker with no cognitive support)</td>
                    <td className="px-4 py-3 font-semibold text-emerald-300 bg-emerald-500/5 border-l border-emerald-500/20">Built-in AI Coach (Diagnoses procrastination and breaks down tough tasks)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-white">Sprint Timer &amp; Blueprint</td>
                    <td className="px-4 py-3 text-slate-400">None (Requires running external Pomodoro apps)</td>
                    <td className="px-4 py-3 font-semibold text-emerald-300 bg-emerald-500/5 border-l border-emerald-500/20">Integrated Pomodoro timer &amp; daily study blueprint</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-white">Pricing</td>
                    <td className="px-4 py-3 text-slate-300">Free open-source</td>
                    <td className="px-4 py-3 font-bold text-emerald-400 bg-emerald-500/5 border-l border-emerald-500/20">100% Free Complete Operating System</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 space-y-2">
                <h3 className="font-bold text-white text-sm">The Problem with Manual Setup (LeechBlock &amp; Unhook)</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  LeechBlock requires you to manually maintain blocksets, write domain wildcards, and set time quotas. Unhook relies on hiding CSS selectors—meaning when YouTube modifies its code, recommendations often leak back through. Most critically, neither tool provides a timer or coaching when cognitive friction strikes.
                </p>
              </div>
              <div className="bg-slate-900/60 border border-emerald-500/30 rounded-xl p-4 space-y-2">
                <h3 className="font-bold text-emerald-400 text-sm">The FlowState Solution: Automated Deep Work</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  FlowState automates the entire focus pipeline. With one click, your Pomodoro countdown begins, Shorts and distracting tabs are automatically blocked at the network route level, and your AI coach stands by to keep you accountable. No manual rule-building required.
                </p>
              </div>
            </div>
          </section>

          {/* Story Section */}
          <section className="bg-gradient-to-br from-slate-900/80 via-slate-900/40 to-indigo-950/30 border border-indigo-500/20 rounded-2xl p-6 sm:p-8 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-2.5 text-xs font-semibold text-indigo-400">
              <Quote className="w-4 h-4" />
              <span>Real Student Experience</span>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              How Did One Engineering Student Reclaim 10 Hours Weekly from Shorts?
            </h2>

            {/* Answer-First 40-60 Word Bold Summary */}
            <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-xl p-4 text-indigo-100 text-sm leading-relaxed">
              <p>
                <strong>Summary: Undergraduate engineering student Rahul struggled with chronic procrastination, regularly losing ninety minutes every study night to recommended YouTube Shorts clips. By pairing mobile phone friction with FlowState’s surgical path blocker on desktop, Rahul completely eliminated algorithmic temptation, reclaimed ten hours each week, completed assignments by 8:00 PM, and aced his finals.</strong>
              </p>
            </div>

            <div className="space-y-3 text-slate-300 text-sm sm:text-base leading-relaxed">
              <p>
                Rahul, a third-year engineering undergraduate, was preparing for competitive semester exams. He frequently relied on YouTube to review complex calculus walkthroughs and computer systems lectures. But almost every evening, a familiar pattern repeated: while searching for a thermodynamics explanation, an algorithmic Short about tech gadgets or comedy skits appeared in his sidebar.
              </p>
              <p>
                He clicked just one 40-second video to rest his eyes. Ninety minutes later, he was still scrolling through dozens of irrelevant clips, his notes untouched, and his anxiety spiking as midnight approached. The next morning, he felt behind on syllabus goals and frustrated with his lack of self-control.
              </p>
              <p>
                Realizing that willpower alone could not beat an algorithmic feed created by hundreds of behavioral engineers, Rahul decided to automate his focus defense. He uninstalled YouTube from his smartphone, set up FlowState on his desktop laptop with strict focus blocks, and turned on FlowState Blocker to actively suppress YouTube Shorts URLs while keeping his full-length professor lectures open.
              </p>
              <p>
                Within one week, the difference was striking. Rahul reclaimed more than 10 hours of wasted scrolling time, finished his daily problem sets before 8:00 PM, and went into exam week confident and completely well-rested.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-3 border-t border-white/5 text-xs text-slate-400">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-300">
                R
              </div>
              <div>
                <p className="font-semibold text-slate-200">Rahul M.</p>
                <p className="text-slate-400">Computer Science Undergraduate</p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 p-8 sm:p-10 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-6 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Automate Your Digital Willpower</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Ready to Reclaim Your Focus from Algorithmic Distractions?
              </h2>

              {/* Answer-First 40-60 Word Bold Summary */}
              <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 text-emerald-100 text-sm leading-relaxed">
                <p>
                  <strong>Summary: Stopping compulsive short-form video consumption does not require superhuman willpower; it requires automated friction and smarter study infrastructure. FlowState provides instant, zero-cost protection against YouTube Shorts and algorithmic feeds while keeping educational materials open. Set up your first deep work session in sixty seconds and restore your daily academic focus.</strong>
                </p>
              </div>

              <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
                Still getting distracted? FlowState Blocker automatically blocks YouTube Shorts while allowing educational videos. Install it and let the system protect your focus.
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
                  <span>Install Extension</span>
                </Link>
              </div>
            </div>
          </section>

          {/* Related Articles Component linking to the other 6 pages */}
          <RelatedArticles
            articles={GEO_RELATED_ARTICLES.filter(
              (article) => article.href !== "/blog/how-to-stop-youtube-shorts"
            )}
            heading="Related Reading"
            subheading="Explore our complete cluster of deep work guides, blocker comparisons, and FAQs."
          />
        </article>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
