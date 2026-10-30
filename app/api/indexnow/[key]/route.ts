import { INDEXNOW_KEY } from "@/lib/indexnow";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  const cleanKey = key.replace(/\.txt$/, "");

  if (key === INDEXNOW_KEY || cleanKey === INDEXNOW_KEY) {
    return new Response(INDEXNOW_KEY, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=86400",
      },
    });
  }

  return new Response("Not Found", {
    status: 404,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
