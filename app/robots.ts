import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/md"],
        disallow: ["/api/", "/auth/"],
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-User",
          "PerplexityBot",
          "Google-Extended",
          "CCBot",
        ],
        allow: ["/", "/api/md"],
        disallow: ["/auth/"],
      },
    ],
    sitemap: "https://flowstate-deepwork.vercel.app/sitemap.xml",
  };
}
