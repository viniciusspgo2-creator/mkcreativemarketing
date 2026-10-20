import { getSiteData } from "@/lib/settings";
import { NextRequest, NextResponse } from "next/server";
import { trackEvent } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const settings = await getSiteData();
    if (!settings.features.enabledTracking) return NextResponse.json({ ok: true });
    const body = await req.json().catch(() => ({}));
    const type = String(body?.type ?? "").slice(0, 60);
    if (!type) return NextResponse.json({ ok: false }, { status: 400 });
    await trackEvent(type, body?.label ? String(body.label).slice(0, 200) : undefined, body?.path ? String(body.path).slice(0, 300) : undefined);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
