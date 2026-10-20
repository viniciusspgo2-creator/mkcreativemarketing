import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await db.post.findUnique({
    where: { slug },
    include: {
      category: { select: { name: true, slug: true, color: true } },
      tags: { select: { tag: { select: { name: true, slug: true } } } },
      author: { select: { name: true } },
    },
  });

  if (!post || post.status !== "PUBLISHED") {
    return NextResponse.json({ error: "Artigo não encontrado." }, { status: 404 });
  }

  // incrementa views (best effort)
  await db.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } }).catch(() => {});

  // relacionados: mesma categoria, depois recentes
  const related = await db.post.findMany({
    where: { status: "PUBLISHED", id: { not: post.id }, ...(post.categoryId ? { categoryId: post.categoryId } : {}) },
    orderBy: [{ publishedAt: "desc" }],
    take: 3,
    select: { title: true, slug: true, excerpt: true, coverImage: true, readingMinutes: true, category: { select: { name: true, slug: true, color: true } }, publishedAt: true },
  });

  return NextResponse.json({
    post: {
      ...post,
      tags: post.tags.map((t) => t.tag),
    },
    related,
  });
}
