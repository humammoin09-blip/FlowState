"use client";

import React, { useState } from "react";
import { ChevronDown, Sparkles, ShieldAlert, DollarSign, Laptop, Puzzle } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  icon: React.ReactNode;
}

const faqs: FAQItem[] = [
  {
    id: "youtube-shorts",
    question: "How do I stop getting distracted by YouTube Shorts?",
    answer:
      "YouTube Shorts are engineered with variable-reward algorithms that make them nearly impossible to resist through willpower alone. FlowState solves this with an automatic website blocker extension that specifically intercepts and disables YouTube Shorts URLs while keeping full-length educational lectures, tutorials, and music completely accessible. When you start a focus session in FlowState, Shorts and other algorithmic feeds are blocked immediately so you can study without temptation.",
    icon: <ShieldAlert className="w-5 h-5 text-rose-400" />,
  },
  {
    id: "pricing",
    question: "Is FlowState free to use?",
    answer:
      "Yes, FlowState is 100% free to use. There are no hidden paywalls, no premium subscriptions, and no trial periods. You get complete access to the Pomodoro timer, daily blueprints, task tracking, AI discipline coach, and the FlowState Blocker extension without paying a cent.",
    icon: <DollarSign className="w-5 h-5 text-emerald-400" />,
  },
  {
    id: "browser-support",
    question: "Does the FlowState Blocker work on Chrome and Edge?",
    answer:
      "Yes! FlowState Blocker is built for Chromium browsers and is available on both the Google Chrome Web Store and the Microsoft Edge Add-ons catalog. You can install it with a single click and it integrates seamlessly with your FlowState dashboard to manage active blocking sessions.",
    icon: <Laptop className="w-5 h-5 text-indigo-400" />,
  },
  {
    id: "extension-optional",
    question: "Can I use FlowState without installing the extension?",
    answer:
      "Yes, you can use FlowState's core Pomodoro timer, task manager, and AI discipline coach directly in your browser without installing anything. However, if you want automated website blocking (such as locking out YouTube Shorts, Reddit, and custom distraction domains during focus sprints), you will need the companion FlowState Blocker extension installed.",
    icon: <Puzzle className="w-5 h-5 text-cyan-400" />,
  },
];

export function FAQAccordion() {
  // Default first item open
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "youtube-shorts": true,
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq) => {
        const isOpen = !!openItems[faq.id];

        return (
          <div
            key={faq.id}
            className={`rounded-2xl border transition-all duration-200 backdrop-blur-sm ${
              isOpen
                ? "bg-slate-900/70 border-emerald-500/30 shadow-[0_4px_20px_rgba(16,185,129,0.06)]"
                : "bg-slate-900/40 border-white/10 hover:border-white/20"
            }`}
          >
            <button
              type="button"
              onClick={() => toggleItem(faq.id)}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${faq.id}`}
              className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer select-none"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-white/10 flex items-center justify-center shrink-0">
                  {faq.icon}
                </div>
                <span className="text-base sm:text-lg font-semibold text-white tracking-tight">
                  {faq.question}
                </span>
              </div>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                  isOpen
                    ? "rotate-180 bg-emerald-500/20 text-emerald-400"
                    : "bg-white/5 text-slate-400"
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>

            {isOpen && (
              <div
                id={`faq-answer-${faq.id}`}
                className="px-5 pb-6 sm:px-6 sm:pb-6 pt-0 border-t border-white/5 mt-1"
              >
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed pt-3">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default FAQAccordion;
