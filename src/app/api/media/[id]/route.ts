import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Serve imagens armazenadas no PostgreSQL (upload do painel).
 * URL imutável: /api/media/{id} — cache longo no CDN da Vercel.
 * Compatível com Neon + Vercel (nenhum acesso a disco).
 */
export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    if (!id || id.length < 10 || id.length > 40 || !/^[a-z0-9]+$/i.test(id)) {
      return NextResponse.json({ error: "ID inválido." }, { status: 400 });
    }
    const asset = await db.mediaAsset.findUnique({
      where: { id },
      select: { data: true, mime: true, filename: true },
    });
    if (!asset || !asset.data) {
      return NextResponse.json({ error: "Imagem não encontrada." }, { status: 404 });
    }
    const bytes = Buffer.from(asset.data, "base64");
    return new NextResponse(new Uint8Array(bytes), {
      status: 200,
      headers: {
        "Content-Type": asset.mime || "image/webp",
        "Content-Length": String(bytes.length),
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Disposition": `inline; filename="${asset.filename}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Erro ao carregar imagem." }, { status: 500 });
  }
}
