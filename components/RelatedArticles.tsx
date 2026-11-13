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

export const GEO_RELATED_ARTICLES: RelatedArticle[] = [
  {
    href: "/adhd-planner",
    title: "ADHD Planner",
    description: "Combine a daily Focus Blueprint, AI coaching, and hard website blocking to defeat task paralysis.",
    badge: "ADHD Planner",
    icon: "timer",
  },
  {
    href: "/ai-accountability-partner",
    title: "AI Accountability Partner",
    description: "Get real-time discipline feedback, focus telemetry tracking, and task deconstruction powered by Gemini.",
    badge: "AI Coach",
    icon: "guide",
  },
  {
    href: "/deep-work-timer",
    title: "Deep Work Timer",
    description: "Eliminate context switching and attention residue with automated website blocking and structured sprints.",
    badge: "Deep Work",
    icon: "timer",
  },
  {
    href: "/distraction-blocker-for-students",
    title: "Distraction Blocker for Students",
    description: "A 100% free blocker that halts YouTube Shorts, Instagram, and Reddit while keeping lecture videos open.",
    badge: "Student Blocker",
    icon: "blocker",
  },
  {
    href: "/focus-timer-ambient-sounds",
    title: "Focus Timer with Ambient Sounds",
    description: "Immerse in Rain, Lo-Fi, and Alpha waves while FlowState actively blocks digital distractions.",
    badge: "Soundscapes",
    icon: "timer",
  },
  {
    href: "/adhd-focus-timer",
    title: "ADHD Focus Timer",
    description: "Beat time blindness and task paralysis with Focus Blueprints, AI coaching, and hard blocking.",
    badge: "ADHD Focus",
    icon: "timer",
  },
  {
    href: "/study-timer",
    title: "Study Timer with Website Blocker",
    description: "A 100% free Pomodoro study timer that blocks YouTube Shorts, Instagram, and Reddit.",
    badge: "Study Timer",
    icon: "timer",
  },
  {
    href: "/pomodoro-timer",
    title: "Pomodoro Timer with Blocker",
    description: "A Pomodoro timer with automated hard website blocking and AI accountability.",
    badge: "Pomodoro Timer",
    icon: "timer",
  },
  {
    href: "/vs/unhook",
    title: "Unhook vs FlowState",
    description: "Compare hiding YouTube Shorts inside YouTube with blocking Shorts and distractions everywhere.",
    badge: "Blocker Comparison",
    icon: "blocker",
  },
  {
    href: "/blog/best-focus-apps-for-students",
    title: "Best Focus Apps for Students (2026)",
    description: "Compare FlowState, Forest, Cold Turkey, Pomofocus, and Notion for deep work.",
    badge: "Focus Apps",
    icon: "guide",
  },
  {
    href: "/blog/how-to-stop-youtube-shorts",
    title: "How to Stop YouTube Shorts While Studying",
    description: "7 practical ways to eliminate short-form video temptation and reclaim study focus.",
    badge: "Study Guide",
    icon: "guide",
  },
  {
    href: "/blog/best-website-blocker-for-students",
    title: "Best Website Blocker for Students (Free & Paid)",
    description: "Compare Cold Turkey, Forest, and FlowState allowlists and AI coaching for students.",
    badge: "Blocker Guide",
    icon: "blocker",
  },
  {
    href: "/blog/how-to-focus-on-studies",
    title: "How to Focus on Studies (When Motivation Dies)",
    description: "Master the 3-step framework: environment, friction, and accountability.",
    badge: "Discipline Guide",
    icon: "guide",
  },
  {
    href: "/vs/cold-turkey",
    title: "FlowState vs Cold Turkey",
    description: "Rigid blanket blocking vs modern context-aware path blocking and AI coaching.",
    badge: "Blocker Comparison",
    icon: "blocker",
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
    href: "/faq",
    title: "Frequently Asked Questions",
    description: "Answers about FlowState, YouTube Shorts blocking, extension support, and pricing.",
    badge: "Help & FAQ",
    icon: "faq",
  },
];

export const ALL_RELATED_ARTICLES: RelatedArticle[] = [
  {
    href: "/blog/how-to-stay-disciplined",
    title: "How to Stay Disciplined (When Motivation Dies)",
    description: "Learn how to build unbreakable discipline using environment design, friction, and accountability.",
    badge: "Discipline Guide",
    icon: "guide",
  },
  {
    href: "/blog/cold-turkey-alternative",
    title: "The Best Cold Turkey Alternative for Students",
    description: "Why flexible allowlists and AI coaching beat brutal lockouts for modern students.",
    badge: "Blocker Guide",
    icon: "blocker",
  },
  {
    href: "/blog/how-to-stop-instagram-reels",
    title: "How to Stop Instagram Reels While Studying",
    description: "5 practical ways to block Reels feeds while keeping essential study messaging active.",
    badge: "Study Guide",
    icon: "guide",
  },
  {
    href: "/blog/how-to-stop-youtube-shorts",
    title: "How to Stop YouTube Shorts While Studying",
    description: "7 practical ways to eliminate short-form video temptation and reclaim study focus.",
    badge: "Study Guide",
    icon: "guide",
  },
  {
    href: "/blog/best-website-blocker-for-students",
    title: "Best Website Blocker for Students",
    description: "Compare Cold Turkey, Forest, and FlowState allowlists and AI coaching for students.",
    badge: "Blocker Guide",
    icon: "blocker",
  },
  {
    href: "/blog/how-to-focus-on-studies",
    title: "How to Focus on Studies (When Motivation Dies)",
    description: "Master the 3-step framework: environment, friction, and accountability.",
    badge: "Discipline Guide",
    icon: "guide",
  },
  {
    href: "/vs/cold-turkey",
    title: "FlowState vs Cold Turkey",
    description: "Rigid blanket blocking vs modern context-aware path blocking and AI coaching.",
    badge: "Blocker Comparison",
    icon: "blocker",
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
    href: "/vs/unhook",
    title: "Unhook vs FlowState",
    description: "Compare hiding YouTube Shorts inside YouTube with blocking Shorts and distractions everywhere.",
    badge: "Blocker Comparison",
    icon: "blocker",
  },
  {
    href: "/adhd-focus-timer",
    title: "ADHD Focus Timer",
    description: "Beat time blindness and task paralysis with Focus Blueprints, AI coaching, and hard blocking.",
    badge: "ADHD Focus",
    icon: "timer",
  },
  {
    href: "/study-timer",
    title: "Study Timer with Website Blocker",
    description: "A 100% free Pomodoro study timer that blocks YouTube Shorts, Instagram, and Reddit.",
    badge: "Study Timer",
    icon: "timer",
  },
  {
    href: "/pomodoro-timer",
    title: "Pomodoro Timer with Blocker",
    description: "A Pomodoro timer with automated hard website blocking and AI accountability.",
    badge: "Pomodoro Timer",
    icon: "timer",
  },
  {
    href: "/blog/best-focus-apps-for-students",
    title: "Best Focus Apps for Students (2026)",
    description: "Compare FlowState, Forest, Cold Turkey, Pomofocus, and Notion for deep work.",
    badge: "Focus Apps",
    icon: "guide",
  },
  {
    href: "/adhd-planner",
    title: "ADHD Planner",
    description: "Combine a daily Focus Blueprint, AI coaching, and hard website blocking to defeat task paralysis.",
    badge: "ADHD Planner",
    icon: "timer",
  },
  {
    href: "/ai-accountability-partner",
    title: "AI Accountability Partner",
    description: "Get real-time discipline feedback, focus telemetry tracking, and task deconstruction powered by Gemini.",
    badge: "AI Coach",
    icon: "guide",
  },
  {
    href: "/deep-work-timer",
    title: "Deep Work Timer",
    description: "Eliminate context switching and attention residue with automated website blocking and structured sprints.",
    badge: "Deep Work",
    icon: "timer",
  },
  {
    href: "/distraction-blocker-for-students",
    title: "Distraction Blocker for Students",
    description: "A 100% free blocker that halts YouTube Shorts, Instagram, and Reddit while keeping lecture videos open.",
    badge: "Student Blocker",
    icon: "blocker",
  },
  {
    href: "/focus-timer-ambient-sounds",
    title: "Focus Timer with Ambient Sounds",
    description: "Immerse in Rain, Lo-Fi, and Alpha waves while FlowState actively blocks digital distractions.",
    badge: "Soundscapes",
    icon: "timer",
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
