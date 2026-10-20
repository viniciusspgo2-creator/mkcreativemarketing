import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    await db.consentLog.create({
      data: {
        statistics: Boolean(body?.statistics),
        marketing: Boolean(body?.marketing),
        referrer: req.headers.get("referer")?.slice(0, 300) ?? null,
      },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
