import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, isResponse, audit } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdmin(req);
  if (isResponse(user)) return user;
  try {
    const { id } = await params;
    const body = await req.json();
    const data: Record<string, unknown> = {};
    if (body.name !== undefined) data.name = String(body.name).slice(0, 120);
    if (body.lat !== undefined) data.lat = Number(body.lat);
    if (body.lng !== undefined) data.lng = Number(body.lng);
    if (body.description !== undefined) data.description = body.description ? String(body.description).slice(0, 500) : null;
    if (body.status !== undefined) data.status = body.status === "COMING_SOON" ? "COMING_SOON" : "ACTIVE";
    if (body.order !== undefined) data.order = Number(body.order) || 0;

    const city = await db.city.update({ where: { id }, data });
    await audit(user.id, "UPDATE", "city", id, city.name);
    return NextResponse.json({ ok: true, city });
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar cidade." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdmin(req);
  if (isResponse(user)) return user;
  try {
    const { id } = await params;
    await db.city.delete({ where: { id } });
    await audit(user.id, "DELETE", "city", id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erro ao excluir cidade." }, { status: 500 });
  }
}
