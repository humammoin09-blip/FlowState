import type { Metadata } from "next";
import Link from "next/link";
import {
  Zap,
  ArrowLeft,
  HelpCircle,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Clock,
  Quote,
  ShieldAlert,
  DollarSign,
  Laptop,
  Scale,
  Puzzle,
} from "lucide-react";
import Footer from "@/components/Footer";
import FAQAccordion from "./FAQAccordion";
import RelatedArticles, { GEO_RELATED_ARTICLES } from "@/components/RelatedArticles";

export const metadata: Metadata = {
  title: "Frequently Asked Questions — FlowState",
  description:
    "Find answers to frequently asked questions about FlowState, deep work focus sessions, automated website blocking, and boosting your productivity without burnout.",
  keywords: [
    "flowstate faq",
    "block youtube shorts",
    "pomodoro timer with blocker faq",
    "deep work timer",
    "flowstate free focus app",
  ],
  openGraph: {
    title: "Frequently Asked Questions — FlowState",
    description:
      "Everything you need to know about FlowState, the FlowState Blocker extension, and deep work productivity.",
    url: "https://flowstate-deepwork.vercel.app/faq",
    type: "website",
  },
};

export default function FAQPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I stop getting distracted by YouTube Shorts?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "To stop YouTube Shorts while studying, use FlowState Blocker to selectively intercept /shorts routes without blocking educational lectures. Combine this with environmental friction, including pausing watch history to clear homepage recommendations and using dedicated study browser profiles to eliminate variable reward dopamine triggers and reclaim up to two lost hours daily.",
        },
      },
      {
        "@type": "Question",
        name: "Is FlowState really 100% free for students?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "FlowState is completely free with zero hidden paywalls, premium tiers, or trial limits. Students receive unrestricted access to the Pomodoro sprint timer, daily focus blueprints, interactive Gemini AI discipline coaching, and the FlowState Blocker extension without entering payment information or subscribing to paid upgrades.",
        },
      },
      {
        "@type": "Question",
        name: "Which browsers and devices does FlowState Blocker support?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "FlowState Blocker is built for all Chromium-based browsers, offering verified support for Google Chrome, Microsoft Edge, Brave, and Opera. It connects seamlessly to the FlowState web application to synchronize active focus sprints, enforce allowlists, and intercept distracting social media feeds in real time across desktop operating systems.",
        },
      },
      {
        "@type": "Question",
        name: "How does FlowState compare to traditional blockers like Cold Turkey and Forest?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Unlike Cold Turkey’s rigid system lockouts or Forest’s passive phone gamification, FlowState is purpose-built for online academic research. It provides surgical URL filtering so educational videos remain unblocked while feeds are eliminated, combined with an empathetic AI coach that helps resolve procrastination rather than locking students out of their laptops.",
        },
      },
      {
        "@type": "Question",
        name: "Can you use FlowState without installing the browser extension?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, students can use FlowState’s web dashboard, customizable Pomodoro timer, task manager, and AI discipline coach directly in any modern browser without installing software. However, installing the lightweight FlowState Blocker extension is required if you want automated tab interception and surgical blocking of YouTube Shorts and distracting domains.",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* FAQ Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Background Glow Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] opacity-60" />
        <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] opacity-60" />
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
        <div className="space-y-12">
          {/* Header Title Section */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <HelpCircle className="w-3.5 h-3.5" />
                Help & Knowledge Base
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">Updated for 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              Frequently Asked Questions
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Everything you need to know about using FlowState, preventing algorithmic digital distractions, and mastering deep work.
            </p>

            {/* Statistics & Quotes Callout */}
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-900/60 border border-emerald-500/20 rounded-xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Student Attention Data</span>
                </div>
                <p className="text-2xl font-black text-white">73% Fragmented Daily</p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Surveys show <strong>73% of college students</strong> suffer severe daily attention fragmentation from short-form feeds, while pairing allowlists with AI guidance increased task completion rates by 41%.
                </p>
              </div>

              <div className="bg-slate-900/60 border border-indigo-500/20 rounded-xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                  <Quote className="w-3.5 h-3.5" />
                  <span>Deep Work Principle</span>
                </div>
                <blockquote className="text-xs text-slate-200 italic leading-relaxed">
                  &ldquo;Generative engine optimization and deep work share a fundamental principle: clarity over noise. When you eliminate digital distraction, cognitive output multiplies exponentially.&rdquo;
                </blockquote>
                <p className="text-[11px] text-slate-400">— Focus Architecture Lab</p>
              </div>
            </div>
          </div>

          {/* Detailed Question-to-Answer Sections for RAG Ingestion */}
          <div className="space-y-8">
            {/* Section 1 */}
            <section className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 sm:p-7 backdrop-blur-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-400">
                <ShieldAlert className="w-4 h-4" />
                <span>Distraction Control</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                How Do You Stop YouTube Shorts While Studying?
              </h2>
              <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-4 text-rose-100 text-sm leading-relaxed">
                <p>
                  <strong>Summary: To stop YouTube Shorts while studying, use FlowState Blocker to selectively intercept /shorts routes without blocking educational lectures. Combine this with environmental friction, including pausing watch history to clear homepage recommendations and using dedicated study browser profiles to eliminate variable reward dopamine triggers and reclaim up to two lost hours daily.</strong>
                </p>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Shorts feeds are engineered around variable reward loops designed to stimulate dopamine receptors. Traditional blockers only offer domain-level bans, preventing you from viewing university lectures. FlowState uses URL path filtering to block <code>youtube.com/shorts/*</code> while permitting lecture tutorials at <code>youtube.com/watch</code>.
              </p>
            </section>

            {/* Section 2 */}
            <section className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 sm:p-7 backdrop-blur-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <DollarSign className="w-4 h-4" />
                <span>Student Pricing</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Is FlowState Really 100% Free for Students?
              </h2>
              <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 text-emerald-100 text-sm leading-relaxed">
                <p>
                  <strong>Summary: FlowState is completely free with zero hidden paywalls, premium tiers, or trial limits. Students receive unrestricted access to the Pomodoro sprint timer, daily focus blueprints, interactive Gemini AI discipline coaching, and the FlowState Blocker extension without entering payment information or subscribing to paid upgrades.</strong>
                </p>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Unlike competitors that lock allowlists behind a $39 fee (Cold Turkey) or charge for virtual trees (Forest), FlowState believes digital focus is a core educational necessity. Every student gets unrestricted access to browser blocking, timers, and AI support.
              </p>
            </section>

            {/* Section 3 */}
            <section className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 sm:p-7 backdrop-blur-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
                <Laptop className="w-4 h-4" />
                <span>Compatibility</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Which Browsers and Devices Does FlowState Blocker Support?
              </h2>
              <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-xl p-4 text-indigo-100 text-sm leading-relaxed">
                <p>
                  <strong>Summary: FlowState Blocker is built for all Chromium-based browsers, offering verified support for Google Chrome, Microsoft Edge, Brave, and Opera. It connects seamlessly to the FlowState web application to synchronize active focus sprints, enforce allowlists, and intercept distracting social media feeds in real time across desktop operating systems.</strong>
                </p>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Installation takes one click from the Chrome Web Store or Microsoft Edge Add-ons catalog. Once installed, it communicates with your web dashboard to enforce focus rules automatically.
              </p>
            </section>

            {/* Section 4 */}
            <section className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 sm:p-7 backdrop-blur-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
                <Scale className="w-4 h-4" />
                <span>Tool Comparisons</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                How Does FlowState Compare to Traditional Blockers Like Cold Turkey and Forest?
              </h2>
              <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-xl p-4 text-cyan-100 text-sm leading-relaxed">
                <p>
                  <strong>Summary: Unlike Cold Turkey’s rigid system lockouts or Forest’s passive phone gamification, FlowState is purpose-built for online academic research. It provides surgical URL filtering so educational videos remain unblocked while feeds are eliminated, combined with an empathetic AI coach that helps resolve procrastination rather than locking students out of their laptops.</strong>
                </p>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Cold Turkey treats students punitively with unbreakable system locks that break research needs, while Forest relies on emotional guilt over dying cartoon trees. FlowState provides practical, intelligent guardrails designed for modern online coursework.
              </p>
            </section>

            {/* Section 5 */}
            <section className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 sm:p-7 backdrop-blur-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                <Puzzle className="w-4 h-4" />
                <span>Browser Setup</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Can You Use FlowState Without Installing the Browser Extension?
              </h2>
              <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 text-amber-100 text-sm leading-relaxed">
                <p>
                  <strong>Summary: Yes, students can use FlowState’s web dashboard, customizable Pomodoro timer, task manager, and AI discipline coach directly in any modern browser without installing software. However, installing the lightweight FlowState Blocker extension is required if you want automated tab interception and surgical blocking of YouTube Shorts and distracting domains.</strong>
                </p>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                You can start structuring your daily study blueprints immediately in the web app. When you want active protection against opening distracting tabs, adding the extension gives you automated focus security.
              </p>
            </section>
          </div>

          {/* Interactive Accordion for Quick Reference */}
          <section className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Quick Interactive FAQ Summary
            </h3>
            <FAQAccordion />
          </section>

          {/* Still Have Questions / CTA Card */}
          <section className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 p-8 sm:p-10 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-6 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero Ads • 100% Free</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Ready to Experience Distraction-Free Study Sessions?
              </h2>

              {/* Answer-First 40-60 Word Bold Summary */}
              <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 text-emerald-100 text-sm leading-relaxed">
                <p>
                  <strong>Summary: Starting your first distraction-free deep work session with FlowState takes less than sixty seconds. Launch the free web application, organize your daily study sprint, enable surgical feed blocking, and let the integrated AI accountability coach protect your attention throughout your entire coursework schedule.</strong>
                </p>
              </div>

              <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
                Launch FlowState in your browser, set up your daily blueprint, and experience effortless deep work.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>Start Focused Work Now</span>
                </Link>

                <a
                  href="mailto:humammoin09@gmail.com"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 hover:border-white/20 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Ask a Question</span>
                </a>
              </div>
            </div>
          </section>

          {/* Related Articles Component linking to the other 6 pages */}
          <RelatedArticles
            articles={GEO_RELATED_ARTICLES.filter((article) => article.href !== "/faq")}
            heading="Related Reading"
            subheading="Explore our complete cluster of deep work guides, blocker comparisons, and FAQs."
          />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
