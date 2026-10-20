import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const perPage = Math.min(24, Math.max(1, parseInt(searchParams.get("perPage") || "9", 10)));
  const category = searchParams.get("category") || "";
  const featured = searchParams.get("featured") === "1";

  const where: Record<string, unknown> = { status: "PUBLISHED" };
  if (category) where.category = { slug: category };
  if (featured) where.featured = true;

  const [total, posts] = await Promise.all([
    db.post.count({ where }),
    db.post.findMany({
      where,
      orderBy: [{ publishedAt: "desc" }],
      skip: (page - 1) * perPage,
      take: perPage,
      select: {
        id: true, title: true, slug: true, excerpt: true, coverImage: true, coverAlt: true,
        publishedAt: true, readingMinutes: true, featured: true, views: true,
        category: { select: { name: true, slug: true, color: true } },
        tags: { select: { tag: { select: { name: true, slug: true } } } },
      },
    }),
  ]);

  return NextResponse.json({
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
    posts: posts.map((p) => ({ ...p, tags: p.tags.map((t) => t.tag) })),
  });
}
