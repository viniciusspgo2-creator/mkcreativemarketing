import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, isResponse, audit } from "@/lib/auth";
import { sanitizeHtml, readingMinutes, excerptFrom } from "@/lib/sanitize";
import { slugify } from "@/lib/services";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await requireAdmin(req);
  if (isResponse(user)) return user;
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "";
  const q = (searchParams.get("q") || "").trim();
  const categoryId = searchParams.get("categoryId") || "";

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (categoryId) where.categoryId = categoryId;
  if (q) where.title = { contains: q };

  const posts = await db.post.findMany({
    where,
    orderBy: [{ updatedAt: "desc" }],
    include: {
      category: { select: { name: true, slug: true, color: true } },
      author: { select: { name: true } },
      tags: { select: { tag: { select: { name: true, slug: true } } } },
    },
  });

  const categories = await db.category.findMany({ orderBy: { name: "asc" } });

  return NextResponse.json({
    posts: posts.map((p) => ({ ...p, tags: p.tags.map((t) => t.tag) })),
    categories,
  });
}

export async function POST(req: NextRequest) {
  const user = await requireAdmin(req);
  if (isResponse(user)) return user;
  try {
    const body = await req.json();
    const title = String(body.title ?? "").trim();
    if (!title) return NextResponse.json({ error: "Título obrigatório." }, { status: 400 });

    let slug = slugify(String(body.slug ?? "") || title);
    const existing = await db.post.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    const content = body.content ? sanitizeHtml(String(body.content)) : "";
    const status = ["DRAFT", "SCHEDULED", "PUBLISHED"].includes(body.status) ? body.status : "DRAFT";

    const post = await db.post.create({
      data: {
        title: title.slice(0, 200),
        slug,
        excerpt: body.excerpt ? String(body.excerpt).slice(0, 300) : excerptFrom(content),
        content,
        coverImage: body.coverImage ? String(body.coverImage) : null,
        coverAlt: body.coverAlt ? String(body.coverAlt).slice(0, 300) : null,
        status,
        authorId: user.id,
        categoryId: body.categoryId || null,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
        readingMinutes: readingMinutes(content),
        featured: Boolean(body.featured),
        seoTitle: body.seoTitle ? String(body.seoTitle).slice(0, 200) : null,
        seoDescription: body.seoDescription ? String(body.seoDescription).slice(0, 300) : null,
        ogImage: body.ogImage ? String(body.ogImage) : null,
        canonical: body.canonical ? String(body.canonical) : null,
        robots: body.robots ? String(body.robots) : "index,follow",
        focusKeyword: body.focusKeyword ? String(body.focusKeyword).slice(0, 120) : null,
      },
    });

    if (Array.isArray(body.tags)) {
      for (const tagName of body.tags.slice(0, 10)) {
        const name = String(tagName).trim();
        if (!name) continue;
        const tslug = slugify(name);
        const tag = await db.tag.upsert({ where: { slug: tslug }, update: {}, create: { name, slug: tslug } });
        await db.postTag.create({ data: { postId: post.id, tagId: tag.id } }).catch(() => {});
      }
    }

    await audit(user.id, "CREATE", "post", post.id, post.title);
    return NextResponse.json({ ok: true, post });
  } catch {
    return NextResponse.json({ error: "Erro ao criar artigo." }, { status: 500 });
  }
}
