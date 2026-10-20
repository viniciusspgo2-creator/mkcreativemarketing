import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, isResponse, audit } from "@/lib/auth";
import { sanitizeHtml, readingMinutes, excerptFrom } from "@/lib/sanitize";
import { slugify } from "@/lib/services";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdmin(req);
  if (isResponse(user)) return user;
  const { id } = await params;
  const post = await db.post.findUnique({
    where: { id },
    include: {
      category: true,
      tags: { select: { tag: { select: { name: true, slug: true } } } },
      author: { select: { name: true } },
    },
  });
  if (!post) return NextResponse.json({ error: "Artigo não encontrado." }, { status: 404 });
  return NextResponse.json({ post: { ...post, tags: post.tags.map((t) => t.tag.name) } });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdmin(req);
  if (isResponse(user)) return user;
  try {
    const { id } = await params;
    const body = await req.json();
    const current = await db.post.findUnique({ where: { id } });
    if (!current) return NextResponse.json({ error: "Artigo não encontrado." }, { status: 404 });

    const data: Record<string, unknown> = {};
    if (body.title !== undefined) data.title = String(body.title).slice(0, 200);
    if (body.slug !== undefined && body.slug !== current.slug) {
      let slug = slugify(String(body.slug) || current.slug);
      const clash = await db.post.findUnique({ where: { slug } });
      if (clash && clash.id !== id) slug = `${slug}-${Date.now().toString(36)}`;
      data.slug = slug;
    }
    if (body.content !== undefined) {
      const content = sanitizeHtml(String(body.content));
      data.content = content;
      data.readingMinutes = readingMinutes(content);
      if (body.excerpt === undefined || body.excerpt === "") data.excerpt = excerptFrom(content);
    }
    if (body.excerpt !== undefined && body.excerpt !== "") data.excerpt = String(body.excerpt).slice(0, 300);
    if (body.coverImage !== undefined) data.coverImage = body.coverImage ? String(body.coverImage) : null;
    if (body.coverAlt !== undefined) data.coverAlt = body.coverAlt ? String(body.coverAlt).slice(0, 300) : null;
    if (body.status !== undefined) {
      const status = ["DRAFT", "SCHEDULED", "PUBLISHED"].includes(body.status) ? body.status : current.status;
      data.status = status;
      if (status === "PUBLISHED" && !current.publishedAt) data.publishedAt = new Date();
      if (status === "DRAFT") data.publishedAt = null;
    }
    if (body.categoryId !== undefined) data.categoryId = body.categoryId || null;
    if (body.scheduledAt !== undefined) data.scheduledAt = body.scheduledAt ? new Date(body.scheduledAt) : null;
    if (body.featured !== undefined) data.featured = Boolean(body.featured);
    if (body.seoTitle !== undefined) data.seoTitle = body.seoTitle ? String(body.seoTitle).slice(0, 200) : null;
    if (body.seoDescription !== undefined) data.seoDescription = body.seoDescription ? String(body.seoDescription).slice(0, 300) : null;
    if (body.ogImage !== undefined) data.ogImage = body.ogImage ? String(body.ogImage) : null;
    if (body.canonical !== undefined) data.canonical = body.canonical ? String(body.canonical) : null;
    if (body.robots !== undefined) data.robots = String(body.robots).slice(0, 60);
    if (body.focusKeyword !== undefined) data.focusKeyword = body.focusKeyword ? String(body.focusKeyword).slice(0, 120) : null;

    const post = await db.post.update({ where: { id }, data });

    if (Array.isArray(body.tags)) {
      await db.postTag.deleteMany({ where: { postId: id } });
      for (const tagName of body.tags.slice(0, 10)) {
        const name = String(tagName).trim();
        if (!name) continue;
        const tslug = slugify(name);
        const tag = await db.tag.upsert({ where: { slug: tslug }, update: {}, create: { name, slug: tslug } });
        await db.postTag.create({ data: { postId: id, tagId: tag.id } }).catch(() => {});
      }
    }

    await audit(user.id, "UPDATE", "post", post.id, post.title);
    return NextResponse.json({ ok: true, post });
  } catch {
    return NextResponse.json({ error: "Erro ao salvar artigo." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdmin(req);
  if (isResponse(user)) return user;
  try {
    const { id } = await params;
    await db.post.delete({ where: { id } });
    await audit(user.id, "DELETE", "post", id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erro ao excluir artigo." }, { status: 500 });
  }
}
