import { NextResponse } from "next/server";
import { getSiteData } from "@/lib/settings";
import { db } from "@/lib/db";
import { getOnlineCount } from "@/lib/analytics";
import { ensureSeeded } from "@/lib/seed-core";

export const dynamic = "force-dynamic";

// Cada consulta tem fallback seguro — o build e o primeiro acesso NÃO quebram
// caso o banco esteja vazio (primeiro deploy) ou temporariamente indisponível.
// Na primeira chamada após o deploy, popula o conteúdo-base automaticamente.
export async function GET() {
  await ensureSeeded(db);
  const site = await getSiteData();

  const [onlineNow, totalVisits, publishedPosts, gallery, cities, steps, categories, formats] = await Promise.all([
    getOnlineCount().catch(() => 0),
    db.visit
      .aggregate({ _sum: { pageviews: true } })
      .then((r) => r._sum.pageviews ?? 0)
      .catch(() => 0),
    db.post
      .count({ where: { status: "PUBLISHED" } })
      .catch(() => 0),
    // fotos (com arquivo) e vídeos (com link YouTube/Vimeo) autorizados e ativos
    db.indoorMedia
      .findMany({
        where: {
          active: true,
          authorized: true,
          OR: [{ kind: "PHOTO", src: { not: null } }, { kind: "VIDEO", videoUrl: { not: null } }, { kind: "VIDEO", vimeoId: { not: null } }],
        },
        orderBy: { order: "asc" },
        select: { id: true, kind: true, title: true, caption: true, venue: true, segment: true, src: true, videoUrl: true, vimeoId: true, poster: true, dateLabel: true },
        take: 24,
      })
      .catch(() => []),
    db.city
      .findMany({
        where: { status: "ACTIVE" },
        orderBy: { order: "asc" },
        select: { id: true, name: true, slug: true, lat: true, lng: true, description: true },
      })
      .catch(() => []),
    db.campaignStep
      .findMany({ where: { active: true }, orderBy: { order: "asc" }, select: { id: true, title: true, description: true } })
      .catch(() => []),
    db.category
      .findMany({ orderBy: { name: "asc" }, select: { name: true, slug: true, color: true } })
      .catch(() => []),
    db.adFormat
      .findMany({ where: { active: true }, orderBy: { order: "asc" }, select: { id: true, name: true, description: true, specs: true } })
      .catch(() => []),
  ]);

  // normaliza vídeos legados (apenas vimeoId antigo, sem videoUrl)
  const galleryNormalized = gallery.map((g) => ({
    ...g,
    videoUrl:
      g.videoUrl ??
      (g.kind === "VIDEO" && g.vimeoId && /^\d+$/.test(g.vimeoId) ? `https://vimeo.com/${g.vimeoId}` : null),
  }));

  return NextResponse.json({
    ...site,
    counters: { onlineNow, totalPageviews: totalVisits, publishedPosts },
    gallery: galleryNormalized,
    cities,
    steps,
    categories,
    formats,
  });
}
