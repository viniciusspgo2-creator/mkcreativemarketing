import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, isResponse } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdmin(req);
  if (isResponse(user)) return user;
  try {
    const { id } = await params;
    const body = await req.json();
    const data: Record<string, unknown> = {};
    if (body.title !== undefined) data.title = String(body.title).slice(0, 160);
    if (body.description !== undefined) data.description = body.description ? String(body.description).slice(0, 500) : null;
    if (body.order !== undefined) data.order = Number(body.order) || 0;
    if (body.active !== undefined) data.active = Boolean(body.active);
    const step = await db.campaignStep.update({ where: { id }, data });
    return NextResponse.json({ ok: true, step });
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar etapa." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdmin(req);
  if (isResponse(user)) return user;
  try {
    const { id } = await params;
    await db.campaignStep.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erro ao excluir etapa." }, { status: 500 });
  }
}
