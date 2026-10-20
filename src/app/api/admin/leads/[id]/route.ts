import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, isResponse, audit } from "@/lib/auth";

export const dynamic = "force-dynamic";

const VALID_STATUS = ["NEW", "CONTACT", "PROPOSAL", "WON", "LOST"];

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdmin(req);
  if (isResponse(user)) return user;
  try {
    const { id } = await params;
    const body = await req.json();
    const current = await db.lead.findUnique({ where: { id } });
    if (!current) return NextResponse.json({ error: "Lead não encontrado." }, { status: 404 });

    const data: Record<string, unknown> = {};
    if (body.status !== undefined && VALID_STATUS.includes(body.status)) {
      data.status = body.status;
      if (body.status !== current.status) {
        await db.leadEvent.create({ data: { leadId: id, type: "STATUS_CHANGE", content: `${current.status} → ${body.status}` } });
      }
    }
    if (body.read !== undefined) data.read = Boolean(body.read);
    if (body.notes !== undefined) data.notes = String(body.notes).slice(0, 4000);

    if (typeof body.newNote === "string" && body.newNote.trim()) {
      await db.leadEvent.create({ data: { leadId: id, type: "NOTE", content: body.newNote.trim().slice(0, 1000) } });
    }

    const lead = await db.lead.update({ where: { id }, data });
    await audit(user.id, "UPDATE", "lead", id, `status=${lead.status}`);
    return NextResponse.json({ ok: true, lead });
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar lead." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdmin(req);
  if (isResponse(user)) return user;
  try {
    const { id } = await params;
    await db.lead.delete({ where: { id } });
    await audit(user.id, "DELETE", "lead", id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erro ao excluir lead." }, { status: 500 });
  }
}
