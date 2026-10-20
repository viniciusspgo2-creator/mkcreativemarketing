import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, isResponse, audit } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdmin(req);
  if (isResponse(user)) return user;
  try {
    const { id } = await params;
    const asset = await db.mediaAsset.findUnique({ where: { id } });
    if (!asset) return NextResponse.json({ error: "Arquivo não encontrado." }, { status: 404 });

    // imagens ficam no banco — basta remover o registro (compatível com Vercel, sem disco)
    await db.mediaAsset.delete({ where: { id } });
    await audit(user.id, "DELETE", "mediaAsset", id, asset.filename);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erro ao excluir arquivo." }, { status: 500 });
  }
}
