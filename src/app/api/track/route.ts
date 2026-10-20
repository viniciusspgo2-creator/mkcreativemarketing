import { getSiteData } from "@/lib/settings";
import { NextRequest, NextResponse } from "next/server";
import { trackPageview } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const settings = await getSiteData();
    if (!settings.features.enabledTracking) return NextResponse.json({ ok: true });
    const body = await req.json().catch(() => ({}));
    const ua = req.headers.get("user-agent") || "";
    const ip = (req.headers.get("x-forwarded-for") || "local").split(",")[0].trim();
    const path = String(body?.path ?? "/").slice(0, 300);
    if (!path || !(path.startsWith("/") || path.startsWith("#"))) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    await trackPageview({
      ip,
      userAgent: ua,
      referrer: req.headers.get("referer"),
      path,
      title: body?.title ? String(body.title) : null,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
