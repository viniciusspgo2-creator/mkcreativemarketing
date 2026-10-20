import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, isResponse } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await requireAdmin(req);
  if (isResponse(user)) return user;
  const steps = await db.campaignStep.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ steps });
}

export async function POST(req: NextRequest) {
  const user = await requireAdmin(req);
  if (isResponse(user)) return user;
  try {
    const body = await req.json();
    const title = String(body.title ?? "").trim();
    if (!title) return NextResponse.json({ error: "Título obrigatório." }, { status: 400 });
    const maxOrder = await db.campaignStep.aggregate({ _max: { order: true } });
    const step = await db.campaignStep.create({
      data: {
        title: title.slice(0, 160),
        description: body.description ? String(body.description).slice(0, 500) : null,
        order: (maxOrder._max.order ?? 0) + 1,
      },
    });
    return NextResponse.json({ ok: true, step });
  } catch {
    return NextResponse.json({ error: "Erro ao criar etapa." }, { status: 500 });
  }
}
