import { NextResponse } from "next/server";
import { INDEXNOW_KEY, SITE_HOST, SITE_URL } from "@/lib/indexnow";
import { COMPETITOR_SLUGS } from "@/lib/competitors";

const DEFAULT_URLS = [
  `${SITE_URL}/`,
  `${SITE_URL}/blog/cold-turkey-alternative`,
  `${SITE_URL}/blog/how-to-stay-disciplined`,
  `${SITE_URL}/blog/how-to-stop-instagram-reels`,
  `${SITE_URL}/blog/how-to-stop-youtube-shorts`,
  ...COMPETITOR_SLUGS.map((slug) => `${SITE_URL}/vs/${slug}`),
  `${SITE_URL}/faq`,
];

function normalizeUrls(rawUrls: unknown): string[] {
  let list: string[] = [];

  if (Array.isArray(rawUrls)) {
    list = rawUrls.filter((item): item is string => typeof item === "string");
  } else if (
    rawUrls &&
    typeof rawUrls === "object" &&
    "urls" in rawUrls &&
    Array.isArray((rawUrls as { urls: unknown[] }).urls)
  ) {
    list = (rawUrls as { urls: unknown[] }).urls.filter(
      (item): item is string => typeof item === "string"
    );
  } else if (
    rawUrls &&
    typeof rawUrls === "object" &&
    "urlList" in rawUrls &&
    Array.isArray((rawUrls as { urlList: unknown[] }).urlList)
  ) {
    list = (rawUrls as { urlList: unknown[] }).urlList.filter(
      (item): item is string => typeof item === "string"
    );
  }

  if (list.length === 0) {
    list = DEFAULT_URLS;
  }

  const normalized = list.map((url) => {
    const trimmed = url.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    return `${SITE_URL}${cleanPath}`;
  });

  return Array.from(new Set(normalized));
}

async function sendToIndexNow(urls: string[]) {
  const payload = {
    host: SITE_HOST,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/api/indexnow/${INDEXNOW_KEY}`,
    urlList: urls,
  };

  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  const responseText = await response.text();

  return {
    status: response.status,
    ok: response.ok,
    responseText,
    submittedCount: urls.length,
    urlList: urls,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const urls = normalizeUrls(body);

    if (urls.length === 0) {
      return NextResponse.json(
        { error: "No valid URLs provided to submit." },
        { status: 400 }
      );
    }

    const result = await sendToIndexNow(urls);

    return NextResponse.json({
      message: result.ok
        ? "Successfully submitted URLs to IndexNow."
        : `IndexNow submission returned status ${result.status}.`,
      ...result,
    });
  } catch (error) {
    console.error("IndexNow ping error:", error);
    return NextResponse.json(
      {
        error: "Failed to ping search engines via IndexNow.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await sendToIndexNow(DEFAULT_URLS);
    return NextResponse.json({
      message: result.ok
        ? "Successfully pinged IndexNow with default site URLs."
        : `IndexNow submission returned status ${result.status}.`,
      ...result,
    });
  } catch (error) {
    console.error("IndexNow GET ping error:", error);
    return NextResponse.json(
      {
        error: "Failed to ping search engines via IndexNow.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
