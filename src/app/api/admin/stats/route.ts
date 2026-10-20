import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, isResponse } from "@/lib/auth";
import { dayKey, getOnlineCount } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await requireAdmin(req);
  if (isResponse(user)) return user;

  const { searchParams } = new URL(req.url);
  const range = [7, 30, 90].includes(Number(searchParams.get("range"))) ? Number(searchParams.get("range")) : 30;

  const now = new Date();
  const startToday = new Date(dayKey() + "T00:00:00.000Z");
  const startRange = new Date(Date.now() - (range - 1) * 86400000);
  startRange.setUTCHours(0, 0, 0, 0);
  const start30 = new Date(Date.now() - 29 * 86400000);
  start30.setUTCHours(0, 0, 0, 0);
  const start7 = new Date(Date.now() - 6 * 86400000);
  start7.setUTCHours(0, 0, 0, 0);
  const yesterdayStart = new Date(startToday.getTime() - 86400000);

  const [
    visitsToday,
    visitsYesterday,
    visits7,
    visits30,
    totalVisits,
    totalPageviews,
    onlineNow,
    series,
    topPaths,
    refSources,
    devices,
    browsers,
    waClicks,
    ctaClicks,
    formSubmits,
    leadsNew,
    leadsByStatus,
    leads30,
    publishedPosts,
    unreadLeads,
  ] = await Promise.all([
    db.visit.count({ where: { day: dayKey() } }),
    db.visit.count({ where: { day: dayKey(yesterdayStart) } }),
    db.visit.count({ where: { day: { gte: dayKey(start7) } } }),
    db.visit.count({ where: { day: { gte: dayKey(start30) } } }),
    db.visit.count(),
    db.visit.aggregate({ _sum: { pageviews: true } }).then((r) => r._sum.pageviews ?? 0),
    getOnlineCount(),
    // série diária
    db.visit.groupBy({
      by: ["day"],
      where: { day: { gte: dayKey(startRange) } },
      _sum: { pageviews: true },
      _count: { _all: true },
      orderBy: { day: "asc" },
    }),
    // páginas mais vistas
    db.pageView.groupBy({
      by: ["path"],
      where: { createdAt: { gte: startRange } },
      _count: { _all: true },
      orderBy: { _count: { path: "desc" } },
      take: 8,
    }),
    db.visit.groupBy({
      by: ["refSource"],
      where: { day: { gte: dayKey(startRange) } },
      _count: { _all: true },
      orderBy: { _count: { refSource: "desc" } },
    }),
    db.visit.groupBy({
      by: ["device"],
      where: { day: { gte: dayKey(startRange) } },
      _count: { _all: true },
      orderBy: { _count: { device: "desc" } },
    }),
    db.visit.groupBy({
      by: ["browser"],
      where: { day: { gte: dayKey(startRange) } },
      _count: { _all: true },
      orderBy: { _count: { browser: "desc" } },
      take: 5,
    }),
    db.trackEvent.count({ where: { type: "whatsapp_click", createdAt: { gte: startRange } } }),
    db.trackEvent.count({ where: { type: "cta_click", createdAt: { gte: startRange } } }),
    db.trackEvent.count({ where: { type: { in: ["form_submit", "lead_created"] }, createdAt: { gte: startRange } } }),
    db.lead.count({ where: { status: "NEW" } }),
    db.lead.groupBy({ by: ["status"], _count: { _all: true } }),
    db.lead.count({ where: { createdAt: { gte: startRange } } }),
    db.post.count({ where: { status: "PUBLISHED" } }),
    db.lead.count({ where: { read: false } }),
  ]);

  // preenche dias vazios da série
  const seriesMap = new Map(series.map((s) => [s.day, s]));
  const daily: { day: string; visits: number; pageviews: number }[] = [];
  for (let i = range - 1; i >= 0; i--) {
    const d = dayKey(new Date(Date.now() - i * 86400000));
    const row = seriesMap.get(d);
    daily.push({ day: d, visits: row?._count._all ?? 0, pageviews: row?._sum.pageviews ?? 0 });
  }

  const conversion = visits30 > 0 ? Math.round((leads30 / visits30) * 1000) / 10 : 0;

  return NextResponse.json({
    range,
    counters: {
      visitsToday, visitsYesterday, visits7, visits30, totalVisits, totalPageviews, onlineNow,
      waClicks, ctaClicks, formSubmits, leadsNew, leads30, conversion, publishedPosts, unreadLeads,
    },
    daily,
    topPaths: topPaths.map((p) => ({ path: p.path, views: p._count._all })),
    refSources: refSources.map((r) => ({ source: r.refSource ?? "direct", visits: r._count._all })),
    devices: devices.map((d) => ({ device: d.device ?? "outro", visits: d._count._all })),
    browsers: browsers.map((b) => ({ browser: b.browser ?? "outro", visits: b._count._all })),
    leadsByStatus: leadsByStatus.map((l) => ({ status: l.status, count: l._count._all })),
  });
}
