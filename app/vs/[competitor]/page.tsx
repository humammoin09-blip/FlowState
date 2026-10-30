import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
  Layers,
  Flame,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Compass,
} from "lucide-react";
import Footer from "@/components/Footer";
import {
  COMPETITOR_SLUGS,
  getCompetitor,
  getAllCompetitors,
} from "@/lib/competitors";

interface PageProps {
  params: Promise<{ competitor: string }>;
}

export async function generateStaticParams() {
  return COMPETITOR_SLUGS.map((competitor) => ({
    competitor,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { competitor: slug } = await params;
  const comp = getCompetitor(slug);

  if (!comp) {
    return {
      title: "Comparison Not Found | FlowState",
    };
  }

  const title = `FlowState vs ${comp.name}: Best ${comp.name} Alternative for Students (2026)`;
  const description = `Looking for the best ${comp.name} alternative? Compare ${comp.name} with FlowState to see why an integrated website blocker and AI coach beats passive tools for students in 2026.`;
  const url = `https://flowstate-deepwork.vercel.app/vs/${comp.slug}`;

  return {
    title,
    description,
    keywords: [
      `flowstate vs ${comp.name.toLowerCase()}`,
      `best ${comp.name.toLowerCase()} alternative`,
      `${comp.name.toLowerCase()} alternative for students`,
      `${comp.name.toLowerCase()} vs website blocker`,
      "deep work tool for students",
      "ai discipline coach",
      "stop procrastination website blocker",
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `FlowState vs ${comp.name}: Which is Better for Students in 2026?`,
      description,
      url,
      type: "article",
      siteName: "FlowState",
    },
    twitter: {
      card: "summary_large_image",
      title: `FlowState vs ${comp.name}: Which is Better for Students?`,
      description,
    },
  };
}

export default async function CompetitorComparisonPage({ params }: PageProps) {
  const { competitor: slug } = await params;
  const comp = getCompetitor(slug);

  if (!comp) {
    notFound();
  }

  const otherCompetitors = getAllCompetitors().filter((c) => c.slug !== comp.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `FlowState vs ${comp.name}: Which is Better for Students in 2026?`,
    description: `A detailed head-to-head comparison between FlowState and ${comp.name} for students, highlighting website blocking, AI accountability, and deep work systems.`,
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
    mainEntityOfPage: `https://flowstate-deepwork.vercel.app/vs/${comp.slug}`,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Atmospheric Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] opacity-60" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] opacity-60" />
      </div>

      {/* Sticky Header */}
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
        <article className="space-y-12">
          {/* Breadcrumb & Badges */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Link
                href="/"
                className="text-slate-400 hover:text-emerald-400 transition"
              >
                Home
              </Link>
              <span className="text-slate-600">/</span>
              <span className="text-slate-400">Comparisons</span>
              <span className="text-slate-600">/</span>
              <span className="text-emerald-400 font-medium">
                FlowState vs {comp.name}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Scale className="w-3.5 h-3.5" />
                {comp.category}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400">Updated for 2026</span>
            </div>

            {/* Main H1 Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              FlowState vs {comp.name}: Which is Better for Students in 2026?
            </h1>

            <p className="text-slate-400 text-lg leading-relaxed">
              {comp.tagline}. Here is a thorough, unbiased comparison of how{" "}
              {comp.name} compares with FlowState for students fighting digital
              distraction and building daily study consistency.
            </p>
          </div>

          {/* Section: Acknowledge What Competitor Does Well */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              What {comp.name} Does Well
            </h2>

            <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 sm:p-7 backdrop-blur-sm text-slate-300 leading-relaxed space-y-4">
              <p>{comp.whatItDoesWell}</p>
            </div>
          </section>

          {/* Section: The Student Dilemma / Core Limitation */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              Where {comp.name} Falls Short for Strict Focus
            </h2>

            <div className="bg-amber-950/20 border border-amber-500/20 rounded-2xl p-6 sm:p-7 backdrop-blur-sm text-slate-300 leading-relaxed space-y-4">
              <p>{comp.coreLimitation}</p>
            </div>
          </section>

          {/* Section: Comparison Table */}
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-emerald-400" />
                Comparison Table: {comp.name} vs FlowState
              </h2>
              <p className="text-sm text-slate-400">
                A feature-by-feature breakdown highlighting focus enforcement, website blocking, and student deep work capabilities.
              </p>
            </div>

            <div className="border border-white/10 rounded-2xl overflow-hidden bg-slate-900/60 backdrop-blur-sm shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-slate-950/80">
                      <th className="py-4 px-5 font-semibold text-slate-300 w-1/3">
                        Feature
                      </th>
                      <th className="py-4 px-5 font-semibold text-slate-400 w-1/3">
                        {comp.name}
                      </th>
                      <th className="py-4 px-5 font-semibold text-emerald-400 w-1/3 bg-emerald-500/5">
                        <div className="flex items-center gap-1.5">
                          <Zap className="w-4 h-4 fill-emerald-400/20 text-emerald-400" />
                          <span>FlowState</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {/* Primary Requested Highlight: Website Blocker */}
                    <tr className="bg-emerald-950/10 hover:bg-white/[0.02] transition">
                      <td className="py-4 px-5 font-medium text-white flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Hard Website Blocker</span>
                      </td>
                      <td className="py-4 px-5 text-slate-400">
                        <div className="flex items-start gap-2">
                          <X className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                          <span>{comp.hasWebsiteBlocker}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-emerald-300 font-medium bg-emerald-500/5">
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                          <span>{comp.flowStateBlocker}</span>
                        </div>
                      </td>
                    </tr>

                    {/* Dynamic Key Features */}
                    {comp.keyFeatures.map((kf, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02] transition">
                        <td className="py-4 px-5 font-medium text-slate-200">
                          {kf.feature}
                        </td>
                        <td className="py-4 px-5 text-slate-400">
                          {kf.competitor}
                        </td>
                        <td className="py-4 px-5 text-emerald-300 font-medium bg-emerald-500/5">
                          {kf.flowstate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section: Why Students Switch */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-emerald-400" />
              Why Students Switch from {comp.name} to FlowState
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {comp.whyStudentsSwitch.map((reason, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-slate-900/40 border border-white/5 hover:border-emerald-500/30 transition flex items-start gap-3.5"
                >
                  <div className="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span className="text-sm text-slate-300 leading-relaxed">
                    {reason}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Section: The Verdict */}
          <section className="space-y-6">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-emerald-950/20 border border-emerald-500/20 shadow-xl space-y-5">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <Bot className="w-4 h-4" />
                <span>The Verdict: Why FlowState is Better for Strict Focus</span>
              </div>

              <blockquote className="text-lg sm:text-xl font-medium text-slate-200 italic border-l-2 border-emerald-500 pl-4 py-1">
                &ldquo;{comp.verdict}&rdquo;
              </blockquote>

              <p className="text-slate-300 text-sm leading-relaxed">
                If you are a student, developer, or exam candidate preparing for high-stakes coursework, you do not suffer from an information problem—you suffer from an attention theft problem. While {comp.name} serves a legitimate purpose in its category, FlowState is engineered from the ground up to protect your cognitive bandwidth, hard-block short-form video traps, and ensure you finish your study sessions with zero distractions.
              </p>
            </div>
          </section>

          {/* Call to Action Banner */}
          <section className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-indigo-950/50 border border-white/10 text-center space-y-6">
            <div className="max-w-xl mx-auto space-y-3">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Experience Real Deep Work with FlowState
              </h3>
              <p className="text-sm text-slate-400">
                Join thousands of students and engineers who have conquered procrastination with a daily focus blueprint, AI discipline coach, and hard website blocker.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-lg shadow-emerald-500/20"
              >
                <span>Launch FlowState Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>

          {/* Cross-Competitor Comparisons for Programmatic SEO */}
          <section className="space-y-4 pt-4 border-t border-white/5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-400" />
              Compare Other Focus & Productivity Tools
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {otherCompetitors.map((other) => (
                <Link
                  key={other.slug}
                  href={`/vs/${other.slug}`}
                  className="p-3 rounded-lg bg-slate-900/40 border border-white/5 hover:border-emerald-500/30 hover:bg-slate-900 transition text-xs group"
                >
                  <div className="font-medium text-slate-300 group-hover:text-emerald-300 transition">
                    vs {other.name}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    {other.category}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
