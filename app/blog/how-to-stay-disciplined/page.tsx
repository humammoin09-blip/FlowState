import type { Metadata } from "next";
import Link from "next/link";
import {
  Zap,
  ArrowLeft,
  BookOpen,
  Clock,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Target,
  Flame,
  Layers,
  Compass,
  CheckCircle2,
  AlertTriangle,
  BrainCircuit,
  CalendarCheck,
  Sun,
  Shield,
  Hourglass,
  Sliders,
  Quote,
} from "lucide-react";
import Footer from "@/components/Footer";
import RelatedArticles from "@/components/RelatedArticles";

export const metadata: Metadata = {
  title: "How to Stay Disciplined (When Motivation Dies)",
  description:
    "Motivation is fleeting. Learn how to build unbreakable discipline using systems, friction, and hard accountability.",
  keywords: [
    "how to stay disciplined",
    "stay disciplined without motivation",
    "build discipline for students",
  ],
  openGraph: {
    title: "How to Stay Disciplined (When Motivation Dies)",
    description:
      "Motivation is fleeting. Learn how to build unbreakable discipline using systems, friction, and hard accountability.",
    url: "https://flowstate-deepwork.vercel.app/blog/how-to-stay-disciplined",
    type: "article",
  },
};

export default function HowToStayDisciplinedPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Stay Disciplined (When Motivation Dies)",
    description:
      "Motivation is fleeting. Learn how to build unbreakable discipline using systems, friction, and hard accountability.",
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
    datePublished: "2026-10-30T00:00:00Z",
    dateModified: "2026-10-30T00:00:00Z",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://flowstate-deepwork.vercel.app/blog/how-to-stay-disciplined",
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
          {/* Header & Title */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <BookOpen className="w-3.5 h-3.5" />
                Discipline &amp; Deep Work Guide
              </span>
              <span className="text-slate-500">•</span>
              <span className="inline-flex items-center gap-1 text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                7 min read
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">Updated October 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              How to Stay Disciplined (When Motivation Dies)
            </h1>

            {/* Intro Problem Statement */}
            <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 sm:p-7 backdrop-blur-sm text-slate-300 leading-relaxed text-base sm:text-lg space-y-3">
              <p>
                We have all experienced the intoxicating rush of inspiration. You watch a stirring video on Sunday evening, write down ambitious weekly goals, reorganize your desk, and swear that this week will be different. For forty-eight hours, you feel unstoppable.
              </p>
              <p>
                Then Wednesday arrives. You wake up exhausted, your head feels heavy, a complex homework assignment resists your first three attempts, and that electric surge of motivation is nowhere to be found. In that moment of cognitive resistance, your instinct is to conclude that you lack character or that you need another dose of inspiration before you can begin.
              </p>
              <p className="text-slate-400 text-sm sm:text-base">
                That is the fatal mistake. Motivation is not a strategy; it is an emotional weather pattern. When motivation fades—and it always does—true discipline is the only engine capable of finishing what inspiration started. But true discipline is rarely about clenching your teeth in agony. It is an engineering problem.
              </p>
            </div>
          </div>

          {/* Section 1: Why Motivation Fails */}
          <section className="space-y-4">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-400" />
                Why Motivation Fails: An Emotion, Not a System
              </h2>
            </div>

            <div className="space-y-4 text-slate-300 leading-relaxed text-sm sm:text-base">
              <p>
                Biologically speaking, motivation is nothing more than a temporary surge of dopamine released in anticipation of an effortless reward. Your brain generates motivation when a task feels novel, exciting, and immediately gratifying.
              </p>
              <p>
                Real learning and deep work, however, are fundamentally non-linear and taxing. Working through differential equations, writing a dense literature review, or debugging asynchronous race conditions requires prolonged metabolic energy from your prefrontal cortex. Because your evolutionary biology is optimized for conserving energy, your brain naturally interprets that cognitive friction as a signal to seek comfort.
              </p>
              <p>
                Relying on motivation to finish hard projects is like relying on a sailboat that only moves when an unpredictable gale blows. When the wind dies, you are stranded. Systems, in contrast, provide an auxiliary motor. They move you forward whether you feel enthusiastic, ambivalent, or entirely uninspired.
              </p>
            </div>
          </section>

          {/* Section 2: The 3 Pillars of Discipline */}
          <section className="space-y-6">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                The 3 Pillars of Unbreakable Discipline
              </h2>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              If willpower is a depletable battery, you cannot rely on sheer mental stamina to safeguard your future. High performers do not possess superhuman willpower—they build bulletproof architectures where distraction is physically difficult and focus is the path of least resistance.
            </p>

            <div className="grid gap-6">
              {/* Pillar 1 */}
              <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
                    1
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    Pillar 1: Environment Design (Physically Remove Distractions)
                  </h3>
                </div>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Your physical and digital environment dictates your default actions. If your smartphone rests in your peripheral vision on your desk, your brain drains valuable executive function simply suppressing the urge to tap it. Research consistently confirms that people with the highest self-control actually employ willpower the least: they proactively sculpt their surroundings so tempting choices do not exist in their immediate sphere.
                </p>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 text-xs sm:text-sm text-slate-400">
                  <strong className="text-slate-200">Execution Rule:</strong> Keep your mobile phone in another room or zipped inside your backpack before sitting down. Close all browser tabs that are unrelated to your current lecture or assignment before opening your workspace.
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm">
                    2
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    Pillar 2: Friction Engineering (Make Bad Habits Hard, Good Habits Frictionless)
                  </h3>
                </div>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Human behavior obeys the law of least effort. Social media engineers invest billions of dollars shaving milliseconds of friction from swipe animations and endless algorithmic video feeds. To defeat them, you must intentionally invert the friction equation.
                </p>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Add friction to time-wasting behaviors: log out of entertainment accounts, use website blockers to sever access to infinite scroll feeds, and require two-step authentication for social apps. Conversely, reduce friction for deep work: prepare your textbook, problem set, and notes on your screen the evening before so you can start working within five seconds of sitting down.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm">
                    3
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    Pillar 3: Non-Negotiable Accountability (Track Progress &amp; Enforce Consequences)
                  </h3>
                </div>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Discipline dissolves in secrecy. When you procrastinate in isolation without measurement, your brain creates convenient excuses: &quot;I&apos;ll make it up over the weekend.&quot; But when your daily output is measured with objective metrics and active streaks, drifting off-task carries an immediate, visible cost.
                </p>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Tracking your deep work hours and committing to clear, non-negotiable streaks transforms abstract goals into daily standards. When you know an active streak is on the line, you find the focus to begin even when energy is scarce.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: How FlowState Enforces Discipline */}
          <section className="space-y-5">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                How FlowState Enforces Discipline Automatically
              </h2>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Theory is useless if you have to manually remember to practice it every morning. FlowState is designed as a software-enforced discipline engine that integrates the three pillars directly into your daily computer workflow:
            </p>

            <div className="grid gap-5 sm:grid-cols-3">
              {/* Daily Blueprint */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CalendarCheck className="w-4 h-4" />
                  <span>Daily Blueprint</span>
                </div>
                <h4 className="text-white font-semibold text-base">Environment Architecture</h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Before you launch into random browser tabs, FlowState prompts you to lock in your 1 to 3 Most Important Tasks (MITs). By giving your brain a defined target before work starts, you eliminate morning decision fatigue.
                </p>
              </div>

              {/* Surgical Blocker */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-2.5">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                  <Shield className="w-4 h-4" />
                  <span>Surgical Blocker</span>
                </div>
                <h4 className="text-white font-semibold text-base">Hard Habit Friction</h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Rather than clunky blanket blockers that shut down your entire laptop, FlowState applies surgical friction. It cuts off toxic feeds while letting you watch full-length lecture tutorials. Learn more about{" "}
                  <Link
                    href="/blog/how-to-stop-youtube-shorts"
                    className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
                  >
                    how to stop YouTube Shorts while studying
                  </Link>{" "}
                  and see our comparison on{" "}
                  <Link
                    href="/vs/cold-turkey"
                    className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
                  >
                    FlowState vs Cold Turkey
                  </Link>
                  .
                </p>
              </div>

              {/* AI Coach */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-2.5">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <BrainCircuit className="w-4 h-4" />
                  <span>AI Focus Coach</span>
                </div>
                <h4 className="text-white font-semibold text-base">Real-Time Accountability</h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  When you feel an impulse to bail on a difficult session, the AI Coach intervenes with tactical, stoic reality checks, protects your active streaks, and helps you break cognitive blocks down into two-minute victories.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Daily Discipline Routine */}
          <section className="space-y-4">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-400" />
                Daily Discipline Routine (Example)
              </h2>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Discipline is sustained through consistent, repeatable daily rhythms. Here is a proven high-performance routine designed to protect cognitive bandwidth and guarantee daily academic momentum:
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/40 border border-white/10">
                <div className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold shrink-0 mt-0.5">
                  07:30 AM
                </div>
                <div>
                  <h4 className="font-semibold text-white text-base">Low-Dopamine Awakening</h4>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5 leading-relaxed">
                    Do not touch your phone or social feeds for the first 30 minutes of the morning. Expose your eyes to natural sunlight, drink a tall glass of water, and allow your nervous system to wake up without a flood of algorithmic stimulation.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/40 border border-white/10">
                <div className="px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold shrink-0 mt-0.5">
                  08:15 AM
                </div>
                <div>
                  <h4 className="font-semibold text-white text-base">Daily Blueprint Lock-in</h4>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5 leading-relaxed">
                    Open FlowState and log your top 2 Most Important Tasks (MITs) for the day. Explicitly decide which problem sets or thesis sections will be conquered before touching non-essential correspondence.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/40 border border-white/10">
                <div className="px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold shrink-0 mt-0.5">
                  09:00 AM
                </div>
                <div>
                  <h4 className="font-semibold text-white text-base">Deep Work Sprint #1 (The Core Anchor)</h4>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5 leading-relaxed">
                    Start a 90-minute FlowState sprint with the blocker active. Phone rests in another room. Tackle your most difficult conceptual task first while your mental stamina is pristine.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/40 border border-white/10">
                <div className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 font-mono text-xs font-bold shrink-0 mt-0.5">
                  12:30 PM
                </div>
                <div>
                  <h4 className="font-semibold text-white text-base">Active Screen-Free Reset</h4>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5 leading-relaxed">
                    Take a genuine restorative break: eat a balanced meal, go for a 20-minute walk outside, or stretch. Avoid scrolling short video feeds during your rest intervals to keep your working memory unpolluted.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/40 border border-white/10">
                <div className="px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300 font-mono text-xs font-bold shrink-0 mt-0.5">
                  05:00 PM
                </div>
                <div>
                  <h4 className="font-semibold text-white text-base">Review, Streak Log &amp; Workspace Reset</h4>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5 leading-relaxed">
                    Review your completed MITs, record your focus hours, and bank your streak credit. Clear your desktop tabs and set up tomorrow morning&apos;s primary document so your next sprint starts effortlessly.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Verdict */}
          <section className="bg-gradient-to-br from-slate-900/90 via-slate-900/50 to-emerald-950/30 border border-emerald-500/20 rounded-2xl p-6 sm:p-8 backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <Quote className="w-4 h-4" />
              <span>Core Takeaway</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              The True Meaning of Discipline
            </h2>

            <div className="space-y-3 text-slate-300 text-sm sm:text-base leading-relaxed">
              <p className="text-base sm:text-lg text-emerald-200 font-medium">
                &ldquo;Discipline isn&apos;t about being hard on yourself. It&apos;s about building a system that makes focus inevitable.&rdquo;
              </p>
              <p>
                Self-flagellation and guilt never created sustainable academic excellence. When you beat yourself up for lacking motivation, you only increase psychological friction and trigger the desire for more distraction.
              </p>
              <p>
                Shift your energy away from self-blame and toward system architecture. Remove the traps from your physical environment, dial up friction on instant-gratification feeds, and put ironclad daily accountability in place. When the system is right, consistency takes care of itself.
              </p>
            </div>
          </section>

          {/* CTA Section */}
          <section className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 p-8 sm:p-10 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-6 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Build Unbreakable Habits</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Ready to build your discipline system? Try FlowState.
              </h2>

              <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
                Stop waiting for motivation to strike. Equip your browser and daily routine with FlowState&apos;s Daily Blueprint, surgical website blocking, and AI focus accountability.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>Try FlowState Free</span>
                </Link>

                <Link
                  href="/vs/cold-turkey"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 hover:border-white/20 transition-colors"
                >
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                  <span>Explore Blocker Comparison</span>
                </Link>
              </div>
            </div>
          </section>

          {/* Related Articles Component */}
          <RelatedArticles currentHref="/blog/how-to-stay-disciplined" />
        </article>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
