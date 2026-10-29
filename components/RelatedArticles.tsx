import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Scale, HelpCircle, Shield, Clock, Compass } from "lucide-react";

export interface RelatedArticle {
  href: string;
  title: string;
  description: string;
  badge?: string;
  icon?: "guide" | "comparison" | "faq" | "blocker" | "timer";
}

export const ALL_RELATED_ARTICLES: RelatedArticle[] = [
  {
    href: "/blog/how-to-stop-youtube-shorts",
    title: "How to Stop YouTube Shorts While Studying",
    description: "7 practical ways to eliminate short-form video temptation and reclaim study focus.",
    badge: "Study Guide",
    icon: "guide",
  },
  {
    href: "/vs/forest",
    title: "FlowState vs Forest",
    description: "Compare virtual tree gamification with hard website blocking for desktop work.",
    badge: "App Comparison",
    icon: "comparison",
  },
  {
    href: "/vs/pomofocus",
    title: "FlowState vs Pomofocus",
    description: "Why a built-in website blocker beats a standard countdown clock for deep work.",
    badge: "App Comparison",
    icon: "timer",
  },
  {
    href: "/vs/cold-turkey",
    title: "FlowState vs Cold Turkey",
    description: "Rigid blanket blocking vs modern context-aware path blocking and AI coaching.",
    badge: "Blocker Comparison",
    icon: "blocker",
  },
  {
    href: "/faq",
    title: "Frequently Asked Questions",
    description: "Answers about FlowState, YouTube Shorts blocking, extension support, and pricing.",
    badge: "Help & FAQ",
    icon: "faq",
  },
];

interface RelatedArticlesProps {
  currentHref?: string;
  articles?: RelatedArticle[];
  heading?: string;
  subheading?: string;
  className?: string;
}

export function RelatedArticles({
  currentHref,
  articles,
  heading = "Related Reading",
  subheading = "Explore guides and comparisons to help you optimize your deep work setup.",
  className = "",
}: RelatedArticlesProps) {
  // If specific articles are provided, use them. Otherwise filter out currentHref.
  const displayArticles =
    articles ||
    (currentHref
      ? ALL_RELATED_ARTICLES.filter((item) => item.href !== currentHref)
      : ALL_RELATED_ARTICLES.slice(0, 3));

  const getBadgeIcon = (icon?: string) => {
    switch (icon) {
      case "guide":
        return <BookOpen className="w-3 h-3 text-emerald-400" />;
      case "faq":
        return <HelpCircle className="w-3 h-3 text-indigo-400" />;
      case "blocker":
        return <Shield className="w-3 h-3 text-cyan-400" />;
      case "timer":
        return <Clock className="w-3 h-3 text-amber-400" />;
      default:
        return <Scale className="w-3 h-3 text-emerald-400" />;
    }
  };

  return (
    <section className={`pt-6 border-t border-white/10 space-y-6 ${className}`}>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5" />
          <span>Deep Work Cluster</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          {heading}
        </h2>
        {subheading && (
          <p className="text-sm text-slate-400 max-w-xl">
            {subheading}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayArticles.map((article) => (
          <Link
            key={article.href}
            href={article.href}
            className="group flex flex-col justify-between p-5 rounded-2xl bg-slate-900/40 hover:bg-slate-900/70 border border-white/10 hover:border-emerald-500/30 transition-all duration-200 backdrop-blur-sm"
          >
            <div className="space-y-2.5">
              {article.badge && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/5 border border-white/10 text-slate-300">
                  {getBadgeIcon(article.icon)}
                  <span>{article.badge}</span>
                </div>
              )}
              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors tracking-tight leading-snug">
                {article.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-3">
                {article.description}
              </p>
            </div>

            <div className="pt-4 mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-400 group-hover:translate-x-0.5 transition-transform">
              <span>Read article</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default RelatedArticles;
