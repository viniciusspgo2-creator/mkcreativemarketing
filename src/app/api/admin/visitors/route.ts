import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, isResponse } from "@/lib/auth";
import { getOnlineCount, dayKey } from "@/lib/analytics";

export const dynamic = "force-dynamic";

// Contador de visitas em tempo real (dashboard + widget público)
export async function GET(req: NextRequest) {
  const user = await requireAdmin(req);
  if (isResponse(user)) return user;

  const [onlineNow, today, yesterday, totalVisitors, totalPageviews, recent] = await Promise.all([
    getOnlineCount(),
    db.visit.count({ where: { day: dayKey() } }),
    db.visit.count({ where: { day: dayKey(new Date(Date.now() - 86400000)) } }),
    db.visit.count(),
    db.visit.aggregate({ _sum: { pageviews: true } }).then((r) => r._sum.pageviews ?? 0),
    db.visit.findMany({
      orderBy: { lastActiveAt: "desc" },
      take: 8,
      select: { id: true, device: true, browser: true, refSource: true, landingPath: true, pageviews: true, lastActiveAt: true },
    }),
  ]);

  return NextResponse.json({
    onlineNow, today, yesterday, totalVisitors, totalPageviews,
    recent: recent.map((r) => ({
      ...r,
      minutesAgo: Math.max(0, Math.round((Date.now() - r.lastActiveAt.getTime()) / 60000)),
    })),
  });
}
