import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, isResponse, audit } from "@/lib/auth";
import { parseVideoUrl } from "@/lib/video";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdmin(req);
  if (isResponse(user)) return user;
  try {
    const { id } = await params;
    const body = await req.json();
    const data: Record<string, unknown> = {};
    if (body.title !== undefined) data.title = String(body.title).slice(0, 200);
    if (body.caption !== undefined) data.caption = body.caption ? String(body.caption).slice(0, 500) : null;
    if (body.venue !== undefined) data.venue = body.venue ? String(body.venue).slice(0, 120) : null;
    if (body.segment !== undefined) data.segment = body.segment ? String(body.segment).slice(0, 80) : null;
    if (body.cityId !== undefined) data.cityId = body.cityId || null;
    if (body.src !== undefined) data.src = body.src ? String(body.src) : null;
    if (body.videoUrl !== undefined) {
      if (body.videoUrl) {
        const info = parseVideoUrl(String(body.videoUrl));
        if (!info) {
          return NextResponse.json(
            { error: "Link de vídeo inválido. Use o endereço completo de um vídeo do YouTube ou Vimeo (a galeria não aceita upload de vídeos)." },
            { status: 400 }
          );
        }
        data.videoUrl = info.url;
      } else {
        data.videoUrl = null;
      }
    }
    if (body.vimeoId !== undefined) data.vimeoId = body.vimeoId ? String(body.vimeoId) : null;
    if (body.poster !== undefined) data.poster = body.poster ? String(body.poster) : null;
    if (body.duration !== undefined) data.duration = body.duration ? Number(body.duration) : null;
    if (body.dateLabel !== undefined) data.dateLabel = body.dateLabel ? String(body.dateLabel).slice(0, 20) : null;
    if (body.authorized !== undefined) data.authorized = Boolean(body.authorized);
    if (body.faceVisible !== undefined) data.faceVisible = Boolean(body.faceVisible);
    if (body.origin !== undefined && ["own", "stock", "client"].includes(body.origin)) data.origin = body.origin;
    if (body.active !== undefined) data.active = Boolean(body.active);
    if (body.order !== undefined) data.order = Number(body.order) || 0;

    const media = await db.indoorMedia.update({ where: { id }, data });
    await audit(user.id, "UPDATE", "indoorMedia", id, media.title);
    return NextResponse.json({ ok: true, media });
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar mídia." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdmin(req);
  if (isResponse(user)) return user;
  try {
    const { id } = await params;
    await db.indoorMedia.delete({ where: { id } });
    await audit(user.id, "DELETE", "indoorMedia", id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erro ao excluir mídia." }, { status: 500 });
  }
}
