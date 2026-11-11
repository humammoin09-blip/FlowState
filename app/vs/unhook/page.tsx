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
  Scale,
  Award,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import Footer from "@/components/Footer";
import RelatedArticles, { GEO_RELATED_ARTICLES } from "@/components/RelatedArticles";

export const metadata: Metadata = {
  title: "Unhook Alternative: Block YouTube Shorts & Distractions",
  description:
    "Looking for an Unhook alternative? FlowState blocks YouTube Shorts and other distracting sites, not just hides them. Compare features and pricing.",
  keywords: [
    "unhook alternative",
    "block youtube shorts",
    "youtube shorts blocker",
    "stop youtube shorts",
  ],
  alternates: {
    canonical: "https://flowstate-deepwork.vercel.app/vs/unhook",
  },
  openGraph: {
    title: "Unhook Alternative: Block YouTube Shorts & Distractions",
    description:
      "Looking for an Unhook alternative? FlowState blocks YouTube Shorts and other distracting sites, not just hides them. Compare features and pricing.",
    url: "https://flowstate-deepwork.vercel.app/vs/unhook",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Unhook Alternative: Block YouTube Shorts & Distractions",
    description:
      "Looking for an Unhook alternative? FlowState blocks YouTube Shorts and other distracting sites, not just hides them.",
  },
};

export default function FlowStateVsUnhookPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Unhook Alternative: Block YouTube Shorts & Distractions",
    description:
      "Looking for an Unhook alternative? FlowState blocks YouTube Shorts and other distracting sites, not just hides them. Compare features and pricing.",
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
      "@id": "https://flowstate-deepwork.vercel.app/vs/unhook",
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
                <Scale className="w-3.5 h-3.5" />
                YouTube Blocker Comparison
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">Unhook Alternative</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              Unhook vs FlowState: Which YouTube Blocker is Better?
            </h1>

            <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 sm:p-7 backdrop-blur-sm text-slate-300 leading-relaxed text-base sm:text-lg space-y-4">
              <p>
                Unhook is a popular browser extension that cleans up the YouTube interface by hiding recommendations, comments, and the Shorts shelf. For casual cleanup, it works well.
              </p>
              <p>
                But if you are looking for an <strong>Unhook alternative</strong> because you still end up typing a Shorts link, toggling the extension off, or drifting straight over to Instagram Reels and Reddit, hiding YouTube elements is not enough. FlowState goes further by actively blocking YouTube Shorts and other distracting sites during your focus sessions—paired with a study timer and AI coach.
              </p>
            </div>
          </div>

          {/* Comparison Table */}
          <section className="space-y-4">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                Unhook vs. FlowState Feature Comparison
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                See how cosmetic YouTube hiding compares against full distraction blocking.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-sm">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900/80 text-xs uppercase tracking-wider text-slate-400 border-b border-white/10">
                  <tr>
                    <th scope="col" className="px-5 py-4 font-semibold text-white">
                      Capability
                    </th>
                    <th scope="col" className="px-5 py-4 font-semibold text-slate-300">
                      Unhook
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
                      YouTube Shorts Handling
                    </td>
                    <td className="px-5 py-4 text-slate-300">
                      Hides Shorts in YouTube
                    </td>
                    <td className="px-5 py-4 font-semibold text-emerald-300 bg-emerald-500/5 border-l border-emerald-500/20">
                      <span className="inline-flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-400" /> Blocks Shorts Across All Sites
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="px-5 py-4 font-medium text-white">
                      Blocks Instagram Reels, Reddit &amp; Other Sites
                    </td>
                    <td className="px-5 py-4 text-rose-400">
                      <span className="inline-flex items-center gap-1.5">
                        <X className="w-4 h-4" /> No (YouTube only)
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-emerald-300 bg-emerald-500/5 border-l border-emerald-500/20">
                      <span className="inline-flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-400" /> Yes (Full cross-site blocking)
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="px-5 py-4 font-medium text-white">
                      Educational Video Allowlisting
                    </td>
                    <td className="px-5 py-4 text-slate-300">
                      Keeps YouTube watch page open
                    </td>
                    <td className="px-5 py-4 font-semibold text-emerald-300 bg-emerald-500/5 border-l border-emerald-500/20">
                      <span className="inline-flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-400" /> Allows lectures, blocks /shorts/
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="px-5 py-4 font-medium text-white">
                      Integrated Pomodoro Timer &amp; Focus Blueprint
                    </td>
                    <td className="px-5 py-4 text-rose-400">
                      <span className="inline-flex items-center gap-1.5">
                        <X className="w-4 h-4" /> No
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-emerald-300 bg-emerald-500/5 border-l border-emerald-500/20">
                      <span className="inline-flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-400" /> Built-in Study Timer &amp; Blueprint
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="px-5 py-4 font-medium text-white">
                      AI Accountability Coach
                    </td>
                    <td className="px-5 py-4 text-rose-400">
                      <span className="inline-flex items-center gap-1.5">
                        <X className="w-4 h-4" /> No
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-emerald-300 bg-emerald-500/5 border-l border-emerald-500/20">
                      <span className="inline-flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-400" /> Included Free
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="px-5 py-4 font-medium text-white">
                      Pricing
                    </td>
                    <td className="px-5 py-4 text-slate-300">Free</td>
                    <td className="px-5 py-4 font-bold text-emerald-400 bg-emerald-500/5 border-l border-emerald-500/20">
                      100% Free
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Why Hiding Isn't Enough */}
          <section className="space-y-6">
            <div className="border-b border-white/10 pb-3">
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                Why Hiding YouTube Shorts Isn&apos;t Enough When You&apos;re Procrastinating
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Cosmetic Hiding vs. Real Blocking</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Unhook only hides UI elements inside YouTube. If someone sends you a Shorts link, or you get bored and open Instagram Reels, Reddit, or TikTok in the next tab, Unhook cannot stop you.
                </p>
              </div>

              <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>A Complete Deep Work System</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  FlowState enforces hard URL blocking across YouTube Shorts and distracting sites during active sprints, while giving you a Pomodoro timer, Focus Blueprint, and AI coach in one place.
                </p>
              </div>
            </div>
          </section>

          {/* Verdict Section */}
          <section className="bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-emerald-950/30 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-sm space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
              <Bot className="w-3.5 h-3.5" />
              <span>Verdict</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Unhook vs. FlowState: The Bottom Line
            </h2>

            <p className="text-slate-200 text-base sm:text-lg leading-relaxed font-medium">
              Use Unhook if you only want to hide YouTube Shorts. Use FlowState for a complete distraction-blocking system.
            </p>
          </section>

          {/* CTA Section */}
          <section className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 p-8 sm:p-10 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-6 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Block Shorts &amp; Distracting Sites • 100% Free</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Ready to Stop YouTube Shorts For Good?
              </h2>

              <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
                Keep full-length lectures open while blocking Shorts, Reels, and social feeds automatically during every study block.
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
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 hover:border-white/20 transition-colors"
                >
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                  <span>Open Web App</span>
                </Link>
              </div>
            </div>
          </section>

          {/* Related Articles */}
          <RelatedArticles
            articles={GEO_RELATED_ARTICLES.filter(
              (article) => article.href !== "/vs/unhook"
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
