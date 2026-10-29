import React from "react";
import Link from "next/link";
import { Zap, ShieldCheck } from "lucide-react";

interface FooterProps {
  className?: string;
}

export function Footer({ className = "" }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`border-t border-white/5 bg-slate-950/80 backdrop-blur-md py-6 px-4 sm:px-6 lg:px-8 mt-auto z-10 ${className}`}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand & Copyright */}
        <div className="flex items-center gap-2.5 text-xs text-slate-400">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-emerald-500 to-indigo-600 p-[1px] flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[5px] flex items-center justify-center">
              <Zap className="w-2.5 h-2.5 text-emerald-400 fill-emerald-400/20" />
            </div>
          </div>
          <span className="font-semibold text-slate-300">FlowState</span>
          <span className="text-slate-600">•</span>
          <span suppressHydrationWarning>© {currentYear} FlowState. All rights reserved.</span>
        </div>

        {/* Legal & Help Links */}
        <nav
          aria-label="Footer navigation links"
          className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-400"
        >
          <Link
            href="/blog/how-to-stop-youtube-shorts"
            className="hover:text-emerald-400 text-slate-400 transition-colors"
          >
            Blog
          </Link>
          <span className="text-slate-700">•</span>
          <Link
            href="/privacy"
            className="hover:text-emerald-400 text-slate-400 transition-colors"
          >
            Privacy Policy
          </Link>
          <span className="text-slate-700">•</span>
          <Link
            href="/terms"
            className="hover:text-emerald-400 text-slate-400 transition-colors"
          >
            Terms of Service
          </Link>
          <span className="text-slate-700">•</span>
          <a
            href="mailto:humammoin09@gmail.com"
            className="hover:text-emerald-400 text-slate-400 transition-colors"
          >
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
