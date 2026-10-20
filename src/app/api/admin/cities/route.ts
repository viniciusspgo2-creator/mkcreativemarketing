import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, isResponse, audit } from "@/lib/auth";
import { slugify } from "@/lib/services";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await requireAdmin(req);
  if (isResponse(user)) return user;
  const cities = await db.city.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { points: true, media: true } } },
  });
  return NextResponse.json({ cities });
}

export async function POST(req: NextRequest) {
  const user = await requireAdmin(req);
  if (isResponse(user)) return user;
  try {
    const body = await req.json();
    const name = String(body.name ?? "").trim();
    if (!name) return NextResponse.json({ error: "Nome obrigatório." }, { status: 400 });
    const lat = Number(body.lat);
    const lng = Number(body.lng);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return NextResponse.json({ error: "Latitude e longitude são obrigatórias (mapa da rede)." }, { status: 400 });

    const city = await db.city.create({
      data: {
        name: name.slice(0, 120),
        slug: slugify(name),
        lat, lng,
        description: body.description ? String(body.description).slice(0, 500) : null,
        status: body.status === "COMING_SOON" ? "COMING_SOON" : "ACTIVE",
        order: Number(body.order) || 99,
      },
    });
    await audit(user.id, "CREATE", "city", city.id, city.name);
    return NextResponse.json({ ok: true, city });
  } catch {
    return NextResponse.json({ error: "Erro ao criar cidade (slug duplicado?)." }, { status: 500 });
  }
}
