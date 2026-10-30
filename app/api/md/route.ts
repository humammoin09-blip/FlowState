import { NextRequest, NextResponse } from "next/server";
import { SITE_HOST, SITE_URL } from "@/lib/indexnow";

export const dynamic = "force-dynamic";

/**
 * Decodes common HTML entities into plain unicode characters.
 */
function decodeEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8212;|&mdash;/g, "—")
    .replace(/&#8211;|&ndash;/g, "–")
    .replace(/&#8220;|&ldquo;/g, '"')
    .replace(/&#8221;|&rdquo;/g, '"')
    .replace(/&#8230;|&hellip;/g, "...")
    .replace(/&#(\d+);/g, (_, code) => {
      try {
        return String.fromCharCode(parseInt(code, 10));
      } catch {
        return "";
      }
    })
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => {
      try {
        return String.fromCharCode(parseInt(code, 16));
      } catch {
        return "";
      }
    });
}

/**
 * Converts HTML into clean Markdown without any remaining HTML tags.
 */
function htmlToMarkdown(html: string): string {
  // Strip non-content / script / style / svg tags and contents
  let text = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, "")
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "");

  // Extract article or main tag if present to focus on the main text
  const articleMatch = text.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i);
  const mainMatch = text.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);

  if (articleMatch) {
    text = articleMatch[1];
  } else if (mainMatch) {
    text = mainMatch[1];
  } else {
    // Strip header, footer, and navigation if falling back to general HTML
    text = text
      .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, "")
      .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, "")
      .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, "");
  }

  // Convert headings
  text = text.replace(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi, "\n\n# $1\n\n");
  text = text.replace(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi, "\n\n## $1\n\n");
  text = text.replace(/<h3\b[^>]*>([\s\S]*?)<\/h3>/gi, "\n\n### $1\n\n");
  text = text.replace(/<h4\b[^>]*>([\s\S]*?)<\/h4>/gi, "\n\n#### $1\n\n");
  text = text.replace(/<h5\b[^>]*>([\s\S]*?)<\/h5>/gi, "\n\n##### $1\n\n");
  text = text.replace(/<h6\b[^>]*>([\s\S]*?)<\/h6>/gi, "\n\n###### $1\n\n");

  // Convert code blocks
  text = text.replace(
    /<pre\b[^>]*><code\b[^>]*>([\s\S]*?)<\/code><\/pre>/gi,
    "\n\n```\n$1\n```\n\n"
  );
  text = text.replace(/<code\b[^>]*>([\s\S]*?)<\/code>/gi, "`$1`");

  // Convert blockquotes
  text = text.replace(/<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, inner) => {
    const clean = inner.replace(/<[^>]+>/g, "").trim();
    return `\n\n> ${clean}\n\n`;
  });

  // Convert tables
  text = text.replace(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi, (_, rowContent) => {
    const cells: string[] = [];
    const cellRegex = /<t[hd]\b[^>]*>([\s\S]*?)<\/t[hd]>/gi;
    let match;
    while ((match = cellRegex.exec(rowContent)) !== null) {
      cells.push(match[1].replace(/<[^>]+>/g, "").trim());
    }
    if (cells.length === 0) return "";
    return `| ${cells.join(" | ")} |\n`;
  });

  // Convert list items
  text = text.replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, "\n- $1");

  // Convert links
  text = text.replace(
    /<a\b[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi,
    (_, href, linkContent) => {
      const clean = linkContent.replace(/<[^>]+>/g, "").trim();
      if (!clean) return "";
      return `[${clean}](${href})`;
    }
  );

  // Convert bold and italic
  text = text.replace(/<(?:strong|b)\b[^>]*>([\s\S]*?)<\/(?:strong|b)>/gi, "**$1**");
  text = text.replace(/<(?:em|i)\b[^>]*>([\s\S]*?)<\/(?:em|i)>/gi, "*$1*");

  // Convert paragraphs and line breaks
  text = text.replace(/<p\b[^>]*>([\s\S]*?)<\/p>/gi, "\n\n$1\n\n");
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<hr\s*\/?>/gi, "\n\n---\n\n");

  // Strip all remaining HTML tags
  text = text.replace(/<[^>]+>/g, "");

  // Decode HTML entities
  text = decodeEntities(text);

  // Clean up and normalize whitespace
  text = text
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return text;
}

/**
 * Default fallback summary for the FlowState homepage if local network fetch is inaccessible.
 */
function getHomepageFallbackMarkdown(): string {
  return `# FlowState — Deep Work & Productivity Dashboard

> A system-driven deep work dashboard that combines an AI coach with a hard website blocker to cure procrastination.

## Overview
FlowState is built on the philosophy that self-discipline is a structural design problem, not a character flaw. It combines a daily focus blueprint, real-time AI accountability coaching, and a browser extension that strictly blocks hyper-distracting feeds.

## Core Features
- **Daily Focus Blueprint**: Plan high-leverage 90-minute deep work blocks every morning.
- **AI Discipline Coach**: An AI accountability partner that detects friction, offers tactical interventions, and keeps you committed.
- **Hard Website Blocker Extension**: Hard blocks short-form dopamine traps (YouTube Shorts, Instagram Reels, Reddit) while keeping productive research sites open.
- **Streak & Consistency Heatmap**: Visual consistency tracking with automated streak protection alerts.
- **Pomodoro Deep Focus Timer**: Customizable intervals tailored for sustained cognitive flow.

## Key Links & Resources
- **Homepage**: https://flowstate-deepwork.vercel.app/
- **Cold Turkey Comparison**: https://flowstate-deepwork.vercel.app/vs/cold-turkey
- **Forest App Comparison**: https://flowstate-deepwork.vercel.app/vs/forest
- **Pomofocus Comparison**: https://flowstate-deepwork.vercel.app/vs/pomofocus
- **Blog & Guides**:
  - Cold Turkey Alternative Guide: https://flowstate-deepwork.vercel.app/blog/cold-turkey-alternative
  - How to Stay Disciplined: https://flowstate-deepwork.vercel.app/blog/how-to-stay-disciplined
  - How to Stop YouTube Shorts: https://flowstate-deepwork.vercel.app/blog/how-to-stop-youtube-shorts
  - How to Stop Instagram Reels: https://flowstate-deepwork.vercel.app/blog/how-to-stop-instagram-reels
- **FAQ**: https://flowstate-deepwork.vercel.app/faq
`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawTarget =
    searchParams.get("url") ||
    searchParams.get("path") ||
    searchParams.get("target") ||
    "/";

  // Derive the host & origin
  const reqHost =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    SITE_HOST;
  const reqProto =
    request.headers.get("x-forwarded-proto") ||
    (reqHost.includes("localhost") ? "http" : "https");
  const origin = `${reqProto}://${reqHost}`;

  let targetUrl: string;

  try {
    if (rawTarget.startsWith("http://") || rawTarget.startsWith("https://")) {
      const parsed = new URL(rawTarget);
      // Security check: restrict fetch to our own domain or localhost to avoid open SSRF
      const allowedHosts = [
        SITE_HOST,
        "flowstate-deepwork.vercel.app",
        "localhost",
        "127.0.0.1",
        reqHost.split(":")[0],
      ];
      if (!allowedHosts.includes(parsed.hostname)) {
        return new NextResponse(
          `# Invalid Target\n\nOnly FlowState URLs and paths are supported. Target was: ${rawTarget}`,
          {
            status: 400,
            headers: {
              "Content-Type": "text/markdown; charset=utf-8",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      }
      targetUrl = rawTarget;
    } else {
      const cleanPath = rawTarget.startsWith("/") ? rawTarget : `/${rawTarget}`;
      targetUrl = `${origin}${cleanPath}`;
    }
  } catch {
    return new NextResponse(`# Error\n\nInvalid URL provided: ${rawTarget}`, {
      status: 400,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  try {
    const res = await fetch(targetUrl, {
      headers: {
        "User-Agent": "FlowState-Markdown-Converter/1.0 (AI Search Agent)",
        Accept: "text/html,application/xhtml+xml,text/plain",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      // If fetching the root failed (e.g. self-referential SSR in preview/build), provide fallback
      const isRoot = targetUrl === origin || targetUrl === `${origin}/` || rawTarget === "/";
      if (isRoot) {
        return new NextResponse(getHomepageFallbackMarkdown(), {
          status: 200,
          headers: {
            "Content-Type": "text/markdown; charset=utf-8",
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }

      return new NextResponse(
        `# Page Not Found\n\nCould not fetch page at ${targetUrl} (Status: ${res.status})`,
        {
          status: res.status,
          headers: {
            "Content-Type": "text/markdown; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const html = await res.text();
    let markdown = htmlToMarkdown(html);

    if (!markdown || markdown.trim().length === 0) {
      markdown = getHomepageFallbackMarkdown();
    }

    return new NextResponse(markdown, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    const isRoot = rawTarget === "/" || rawTarget === `${origin}/`;
    if (isRoot) {
      return new NextResponse(getHomepageFallbackMarkdown(), {
        status: 200,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    return new NextResponse(
      `# Error Fetching Content\n\nFailed to convert ${targetUrl} to markdown: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      {
        status: 500,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}
