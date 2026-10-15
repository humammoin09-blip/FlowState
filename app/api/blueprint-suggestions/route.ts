import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

const DEFAULT_SUGGESTIONS = [
  "youtube.com",
  "google.com",
  "github.com",
  "stackoverflow.com",
];

const CANDIDATE_MODELS = [
  "gemini-1.5-flash",
  "gemini-2.0-flash",
  "gemini-3.8-flash",
  "gemini-3.5-flash-lite",
];

const SYSTEM_PROMPT =
  'You are a focus coach for a deep work app. Based on the user\'s goal, suggest 5-8 websites/domains they will need. Return ONLY a JSON array of domain strings, nothing else. Example: ["youtube.com", "github.com", "stackoverflow.com"]';

/**
 * Normalizes and sanitizes domain strings:
 * - Lowercase and trim
 * - Strips protocols (https://, http://)
 * - Strips leading www.
 * - Strips paths, queries, hashes, and port numbers
 * - Extracts valid domain format
 */
function sanitizeDomain(input: string): string {
  if (!input) return "";
  let cleaned = input.trim().toLowerCase();

  // Remove markdown quotes, backticks or brackets
  cleaned = cleaned.replace(/["'`[\]()]/g, "").trim();

  // Strip protocol
  cleaned = cleaned.replace(/^https?:\/\//i, "");

  // Strip leading www.
  cleaned = cleaned.replace(/^www\./i, "");

  // Take hostname portion before slash, query, hash, or port
  cleaned = cleaned.split("/")[0].split("?")[0].split("#")[0].split(":")[0];

  // Validate standard domain pattern or localhost
  const domainPattern = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/i;
  if (cleaned === "localhost" || domainPattern.test(cleaned)) {
    return cleaned;
  }

  // Attempt regex match if domain was surrounded by text
  const match = cleaned.match(/([a-z0-9-]+\.[a-z0-9-.]+)/i);
  if (match && match[1]) {
    return match[1].replace(/^www\./i, "");
  }

  return "";
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { goal = "", plannedWork = "" } = body;

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      "";

    if (!goal && !plannedWork) {
      return NextResponse.json({
        domains: DEFAULT_SUGGESTIONS,
        source: "fallback",
      });
    }

    if (apiKey.trim()) {
      // 1. Attempt using official @google/generative-ai SDK
      try {
        const genAI = new GoogleGenerativeAI(apiKey.trim());

        for (const modelName of CANDIDATE_MODELS) {
          try {
            const model = genAI.getGenerativeModel({
              model: modelName,
              systemInstruction: SYSTEM_PROMPT,
              generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 250,
              },
            });

            const prompt = `User's Session Goal: "${goal}"\nPlanned Work: "${plannedWork || "Not specified"}"\n\nSuggest 5-8 websites/domains they will need for this work:`;
            const result = await model.generateContent(prompt);
            const responseText = result.response.text();

            if (responseText) {
              const parsed = parseDomainResponse(responseText);
              if (parsed && parsed.length > 0) {
                return NextResponse.json({
                  domains: parsed,
                  source: "gemini",
                  model: modelName,
                });
              }
            }
          } catch (modelErr) {
            console.warn(`SDK attempt with ${modelName} failed, trying next:`, modelErr);
            continue;
          }
        }
      } catch (sdkErr) {
        console.warn("GoogleGenerativeAI SDK init notice, falling back to direct REST fetch:", sdkErr);
      }

      // 2. Direct REST fetch fallback to Google Gemini API
      for (const modelName of CANDIDATE_MODELS) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey.trim()}`;
          const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      text: `${SYSTEM_PROMPT}\n\nUser Goal: ${goal}\nPlanned Work: ${plannedWork || "Not specified"}\nSuggest 5-8 websites/domains needed:`,
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 250,
              },
            }),
          });

          if (!response.ok) continue;

          const data = await response.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = parseDomainResponse(rawText);
            if (parsed && parsed.length > 0) {
              return NextResponse.json({
                domains: parsed,
                source: "gemini",
                model: modelName,
              });
            }
          }
        } catch {
          continue;
        }
      }
    }

    // Default Fallback
    return NextResponse.json({
      domains: DEFAULT_SUGGESTIONS,
      source: "fallback",
    });
  } catch (error) {
    console.error("Blueprint suggestions API error:", error);
    return NextResponse.json({
      domains: DEFAULT_SUGGESTIONS,
      source: "fallback",
    });
  }
}

function parseDomainResponse(rawText: string): string[] | null {
  try {
    // Strip markdown JSON code fence if present
    const cleaned = rawText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // Find JSON array substring if extra text was included
    const arrayStart = cleaned.indexOf("[");
    const arrayEnd = cleaned.lastIndexOf("]");
    if (arrayStart !== -1 && arrayEnd !== -1 && arrayEnd > arrayStart) {
      const jsonSnippet = cleaned.substring(arrayStart, arrayEnd + 1);
      const parsedArray = JSON.parse(jsonSnippet);

      if (Array.isArray(parsedArray)) {
        const sanitizedList = parsedArray
          .map((item) => (typeof item === "string" ? sanitizeDomain(item) : ""))
          .filter((d): d is string => Boolean(d && d.length > 2 && d.includes(".")));

        // Deduplicate
        const uniqueDomains = Array.from(new Set(sanitizedList));
        if (uniqueDomains.length > 0) {
          return uniqueDomains.slice(0, 8);
        }
      }
    }
  } catch (err) {
    console.warn("Failed to parse Gemini domain response JSON:", err);
  }

  // Fallback line-by-line regex parsing
  const matches = rawText.match(/(?:[a-z0-9-]+\.)+[a-z]{2,}/gi);
  if (matches && matches.length > 0) {
    const sanitized = matches
      .map(sanitizeDomain)
      .filter((d): d is string => Boolean(d && d.length > 2 && d.includes(".")));
    const unique = Array.from(new Set(sanitized));
    if (unique.length > 0) {
      return unique.slice(0, 8);
    }
  }

  return null;
}
