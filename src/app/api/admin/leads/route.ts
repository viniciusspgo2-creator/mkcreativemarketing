import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, isResponse } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await requireAdmin(req);
  if (isResponse(user)) return user;
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "";
  const service = searchParams.get("service") || "";
  const q = (searchParams.get("q") || "").trim().toLowerCase();

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (service) where.service = service;
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { email: { contains: q } },
      { company: { contains: q } },
      { city: { contains: q } },
    ];
  }

  const leads = await db.lead.findMany({
    where,
    orderBy: [{ createdAt: "desc" }],
    include: { events: { orderBy: { createdAt: "asc" } } },
  });

  return NextResponse.json({ leads });
}
