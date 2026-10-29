import type { Metadata } from "next";
import Link from "next/link";
import {
  Zap,
  ArrowLeft,
  HelpCircle,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Footer from "@/components/Footer";
import FAQAccordion from "./FAQAccordion";
import RelatedArticles from "@/components/RelatedArticles";

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
          text: "YouTube Shorts are engineered with variable-reward algorithms that make them nearly impossible to resist through willpower alone. FlowState solves this with an automatic website blocker extension that specifically intercepts and disables YouTube Shorts URLs while keeping full-length educational lectures, tutorials, and music completely accessible. When you start a focus session in FlowState, Shorts and other algorithmic feeds are blocked immediately so you can study without temptation.",
        },
      },
      {
        "@type": "Question",
        name: "Is FlowState free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, FlowState is 100% free to use. There are no hidden paywalls, no premium subscriptions, and no trial periods. You get complete access to the Pomodoro timer, daily blueprints, task tracking, AI discipline coach, and the FlowState Blocker extension without paying a cent.",
        },
      },
      {
        "@type": "Question",
        name: "Does the FlowState Blocker work on Chrome and Edge?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! FlowState Blocker is built for Chromium browsers and is available on both the Google Chrome Web Store and the Microsoft Edge Add-ons catalog. You can install it with a single click and it integrates seamlessly with your FlowState dashboard to manage active blocking sessions.",
        },
      },
      {
        "@type": "Question",
        name: "Can I use FlowState without installing the extension?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, you can use FlowState's core Pomodoro timer, task manager, and AI discipline coach directly in your browser without installing anything. However, if you want automated website blocking (such as locking out YouTube Shorts, Reddit, and custom distraction domains during focus sprints), you will need the companion FlowState Blocker extension installed.",
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
          </div>

          {/* Interactive Accordion */}
          <section className="space-y-4">
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
                Ready to experience distraction-free study sessions?
              </h2>

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

          {/* Related Articles Component */}
          <RelatedArticles currentHref="/faq" />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
