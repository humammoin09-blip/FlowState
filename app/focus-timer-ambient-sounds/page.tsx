import type { Metadata } from "next";
import Link from "next/link";
import {
  Zap,
  ArrowLeft,
  Headphones,
  CheckCircle2,
  AlertTriangle,
  Bot,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Clock,
  Layers,
  Flame,
  CloudRain,
  Radio,
  Waves,
  Music,
} from "lucide-react";
import Footer from "@/components/Footer";
import RelatedArticles, { GEO_RELATED_ARTICLES } from "@/components/RelatedArticles";

export const metadata: Metadata = {
  title: "Focus Timer with Ambient Sounds: Rain, Lo-Fi & Alpha Waves",
  description:
    "A focus timer with built-in ambient sounds. Study with Rain, Lo-Fi, and Alpha waves while FlowState blocks distracting websites and keeps you in flow.",
  keywords: [
    "focus timer with ambient sounds",
    "study timer with rain sounds",
    "lofi study timer",
    "focus timer with music",
  ],
  alternates: {
    canonical:
      "https://flowstate-deepwork.vercel.app/focus-timer-ambient-sounds",
  },
  openGraph: {
    title: "Focus Timer with Ambient Sounds: Rain, Lo-Fi & Alpha Waves",
    description:
      "A focus timer with built-in ambient sounds. Study with Rain, Lo-Fi, and Alpha waves while FlowState blocks distracting websites and keeps you in flow.",
    url: "https://flowstate-deepwork.vercel.app/focus-timer-ambient-sounds",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Focus Timer with Ambient Sounds: Rain, Lo-Fi & Alpha Waves",
    description:
      "A focus timer with built-in ambient sounds. Study with Rain, Lo-Fi, and Alpha waves while FlowState blocks distracting websites and keeps you in flow.",
  },
};

export default function FocusTimerAmbientSoundsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Focus Timer with Ambient Sounds (Rain, Lo-Fi, Alpha Waves)",
    description:
      "A focus timer with built-in ambient sounds. Study with Rain, Lo-Fi, and Alpha waves while FlowState blocks distracting websites and keeps you in flow.",
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
        "https://flowstate-deepwork.vercel.app/focus-timer-ambient-sounds",
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
                <Headphones className="w-3.5 h-3.5" />
                Acoustic Flow Architecture
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">Audio Immersion + Site Blocker</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              Focus Timer with Ambient Sounds (Rain, Lo-Fi, Alpha Waves)
            </h1>

            <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 sm:p-7 backdrop-blur-sm text-slate-300 leading-relaxed text-base sm:text-lg space-y-4">
              <p>
                Entering deep cognitive flow requires more than just starting a stopwatch. Environmental noise—office chatter, door slams, coffee shop bustle, and sudden notification rings—repeatedly fragments your working memory before flow state can establish itself.
              </p>
              <p>
                FlowState is a <strong>focus timer with built-in ambient sounds</strong> that pairs soothing acoustic soundscapes (Rain, Lo-Fi beats, and Alpha Brain Waves) with hard browser website blocking. By simultaneously shielding your ears from auditory interruptions and your browser from distraction rabbit holes, FlowState crafts the ultimate deep work bubble.
              </p>
            </div>
          </div>

          {/* Section 1: Why Soundscapes Improve Focus */}
          <section className="space-y-6">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
                Why Soundscapes Improve Focus
              </h2>
            </div>

            {/* Bold 40-word summary */}
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 text-amber-100 text-sm leading-relaxed">
              <p>
                <strong>Scientific research reveals ambient soundscapes mask abrupt acoustic changes that trigger the brain’s startle reflex. By providing constant, non-intrusive auditory stimulation through stochastic resonance and steady rhythmic tempos, soundscapes elevate dopamine and maintain cognitive stamina during demanding deep study sessions.</strong>
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <Waves className="w-4 h-4" />
                  <span>Acoustic Masking &amp; Cognitive Armor</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  The human brain evolved to monitor sudden acoustic fluctuations for potential threats. A continuous soundscape of gentle rainfall or steady pink noise masks unpredictable background noises, allowing your prefrontal cortex to stay fully immersed in deep work.
                </p>
              </div>

              <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Radio className="w-4 h-4" />
                  <span>Alpha Wave Synchronization</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Alpha brainwave frequencies (8–12 Hz) correspond to calm, alert concentration—the hallmark of the flow state. Ambient tones encourage neural entrainment, easing racing thoughts and reducing anxiety before intimidating assignments.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: How FlowState Combines Sound + Blocking */}
          <section className="bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-emerald-950/30 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-sm space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>Dual-Barrier Immersion</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              How FlowState Combines Sound + Blocking
            </h2>

            {/* Bold 40-word summary */}
            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4 text-emerald-100 text-sm leading-relaxed">
              <p>
                <strong>Listening to ambient music without an active website blocker leaves you vulnerable to opening YouTube Shorts or Reddit in another tab. FlowState synchronizes your auditory soundscape with hard browser-level distraction blocking, creating an ironclad acoustic and digital focus sanctuary.</strong>
              </p>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Most people listen to ambient tracks on YouTube or Spotify—which perversely keeps an open portal to algorithmic rabbit holes on their screen. FlowState unifies sound and protection into a single browser ecosystem:
            </p>

            <div className="grid gap-4">
              <div className="bg-slate-950/60 border border-white/10 rounded-xl p-5 space-y-2">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  1. One-Click Audio Without Tab Clutter
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  No need to run streaming tabs or navigate distracting interfaces. Select your preferred soundscape directly inside the FlowState dashboard, click start, and your focus audio begins alongside your Pomodoro countdown.
                </p>
              </div>

              <div className="bg-slate-950/60 border border-white/10 rounded-xl p-5 space-y-2">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  2. Hard Blocking Keeps Your Hands on Your Work
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  While rain sounds protect your ears, FlowState’s Chromium extension stops impulsive tab switching to YouTube Shorts, Instagram Reels, and social feeds in their tracks. Your audio cocoon is backed by real digital enforcement.
                </p>
              </div>

              <div className="bg-slate-950/60 border border-white/10 rounded-xl p-5 space-y-2">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Bot className="w-4 h-4 text-emerald-400" />
                  3. Built-In AI Coach &amp; Session Metrics
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Pair your immersion with an interactive AI study partner that helps you break down complex problem sets and logs completed deep work sessions to your daily consistency heatmap.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Choose Your Soundscape */}
          <section className="space-y-6">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <Sparkles className="w-6 h-6 text-emerald-400 shrink-0" />
                Choose Your Soundscape
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Carefully tuned audio environments designed for deep work immersion.
              </p>
            </div>

            {/* Bold 40-word summary */}
            <div className="bg-slate-900/60 border border-emerald-500/20 rounded-xl p-4 text-slate-200 text-sm leading-relaxed">
              <p>
                <strong>FlowState offers a suite of science-backed audio environments: gentle rain to soothe mental anxiety, chill Lo-Fi beats to maintain creative coding flow, and alpha brain waves for rigorous, multi-hour analytical studying and deep reading.</strong>
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-5">
              <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <CloudRain className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Rain &amp; Storms</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Natural white noise with gentle droplets and distant rolling thunder. Perfect for washing away noisy room chatter and easing task anxiety.
                </p>
              </div>

              <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <Music className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Lo-Fi Study Beats</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Relaxing, lyric-free chillhop rhythms calibrated around 70–85 BPM to maintain steady dopaminergic drive during writing and coding blocks.
                </p>
              </div>

              <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <Waves className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Alpha Brain Waves</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Binaural and isochronic soundwaves that foster relaxed alertness, ideal for intense exam memorization and difficult mathematical proofs.
                </p>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-emerald-500/20 rounded-xl p-5 flex items-start gap-3">
              <Flame className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-300 leading-relaxed">
                <strong className="text-white">Seamless Timer Integration:</strong> Ambient sounds start automatically when your focus sprint commences and gently fade out when the rest bell rings, making transitions natural and effortless.
              </p>
            </div>
          </section>

          {/* CTA Section */}
          <section className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 p-8 sm:p-10 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-6 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Headphones className="w-3.5 h-3.5" />
                <span>Timer + Ambient Audio + Hard Blocker • 100% Free</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Enter Acoustic Flow State Now
              </h2>

              <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
                Choose your soundscape, set your focus sprint, and let FlowState block distracting tabs while you dive into deep work.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>Start Ambient Focus Timer Free</span>
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
                article.href !== "/focus-timer-ambient-sounds"
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
