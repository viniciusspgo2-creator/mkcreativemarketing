import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, isResponse, audit } from "@/lib/auth";
import { parseVideoUrl } from "@/lib/video";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await requireAdmin(req);
  if (isResponse(user)) return user;
  try {
    const media = await db.indoorMedia.findMany({
      orderBy: { order: "asc" },
      include: { city: { select: { name: true, slug: true } } },
    });
    const cities = await db.city.findMany({ orderBy: { order: "asc" }, select: { id: true, name: true } });
    return NextResponse.json({ media, cities });
  } catch {
    return NextResponse.json({ media: [], cities: [] });
  }
}

export async function POST(req: NextRequest) {
  const user = await requireAdmin(req);
  if (isResponse(user)) return user;
  try {
    const body = await req.json();
    const title = String(body.title ?? "").trim();
    if (!title) return NextResponse.json({ error: "Título obrigatório." }, { status: 400 });
    const maxOrder = await db.indoorMedia.aggregate({ _max: { order: true } });

    // Validação de vídeo: apenas link externo (YouTube/Vimeo) — sem upload de vídeo
    const kind = body.kind === "VIDEO" ? "VIDEO" : "PHOTO";
    let videoUrl: string | null = body.videoUrl ? String(body.videoUrl) : null;
    if (kind === "VIDEO") {
      const info = parseVideoUrl(videoUrl ?? "");
      if (!info) {
        return NextResponse.json(
          { error: "Link de vídeo inválido. A galeria não aceita upload de vídeos: hospede no YouTube ou Vimeo e cole o link completo." },
          { status: 400 }
        );
      }
      videoUrl = info.url;
    } else {
      videoUrl = null;
    }

    const media = await db.indoorMedia.create({
      data: {
        kind,
        title: title.slice(0, 200),
        caption: body.caption ? String(body.caption).slice(0, 500) : null,
        venue: body.venue ? String(body.venue).slice(0, 120) : null,
        segment: body.segment ? String(body.segment).slice(0, 80) : null,
        cityId: body.cityId || null,
        src: body.src ? String(body.src) : null,
        videoUrl,
        vimeoId: body.vimeoId ? String(body.vimeoId) : null,
        poster: body.poster ? String(body.poster) : null,
        duration: body.duration ? Number(body.duration) : null,
        dateLabel: body.dateLabel ? String(body.dateLabel).slice(0, 20) : null,
        authorized: Boolean(body.authorized),
        faceVisible: Boolean(body.faceVisible),
        origin: ["own", "stock", "client"].includes(body.origin) ? body.origin : "own",
        order: (maxOrder._max.order ?? 0) + 1,
        active: body.active !== false,
      },
    });
    await audit(user.id, "CREATE", "indoorMedia", media.id, media.title);
    return NextResponse.json({ ok: true, media });
  } catch {
    return NextResponse.json({ error: "Erro ao criar mídia." }, { status: 500 });
  }
}
