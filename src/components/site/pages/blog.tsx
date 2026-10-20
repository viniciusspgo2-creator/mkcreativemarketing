"use client";

import { useCopy } from "@/components/site/use-copy";

// Blog — listagem com paginação/categorias + artigo (SEO Article, sumário, relacionados)
import { useEffect, useMemo, useState } from "react";
import { useSite } from "@/components/app-shell";
import { Reveal, WhatsAppButton } from "@/components/site/site-chrome";
import { Button } from "@/components/ui/button";
import { Clock, ChevronLeft, ChevronRight, Share2, ListTree } from "lucide-react";
import { sanitizeHtml } from "@/lib/sanitize";
import { PlayMark } from "@/components/brand/illustrations";

type PostCard = {
  id: string; title: string; slug: string; excerpt: string | null; coverImage: string | null; coverAlt: string | null;
  publishedAt: string | null; readingMinutes: number; featured: boolean; category: { name: string; slug: string; color: string | null } | null;
};

type FullPost = PostCard & {
  content: string; views: number; seoTitle: string | null; seoDescription: string | null;
  tags: { name: string; slug: string }[]; author: { name: string }; focusKeyword: string | null;
};

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export function BlogPage() {
  const t = useCopy("blog");
  const { site, navigate, route } = useSite();
  const activeCategory = route.view === "blog" ? route.category : undefined;
  const categories = site?.categories ?? [];

  const [page, setPage] = useState(1);
  const [retry, setRetry] = useState(0);
  const [feed, setFeed] = useState<{ key: string; posts: PostCard[]; totalPages: number } | null>(null);
  const [loadError, setLoadError] = useState(false);

  // Estado de carregamento derivado da chave da requisição — sem setState síncrono no effect.
  const feedKey = `${page}|${activeCategory ?? ""}|${retry}`;
  const loading = !feed || feed.key !== feedKey;
  const posts = feed?.posts ?? [];
  const totalPages = feed?.totalPages ?? 1;

  useEffect(() => {
    let active = true;
    const url = `/api/public/posts?page=${page}&perPage=9${activeCategory ? `&category=${encodeURIComponent(activeCategory)}` : ""}`;
    fetch(url, { signal: AbortSignal.timeout(15000) })
      .then((r) => { if(!r.ok)throw new Error();return r.json(); })
      .then((d) => {
        if (!active) return;
        setFeed({ key: feedKey, posts: d.posts ?? [], totalPages: d.totalPages ?? 1 });
        setLoadError(false);
      })
      .catch(() => {if(active){setLoadError(true);setFeed({ key: feedKey, posts: [], totalPages: 1 });}});
    return () => { active = false; };
  }, [feedKey, page, activeCategory]);

  return (
    <div className="bg-[var(--mk-paper)]">
      <section className="sect-l" aria-label={t("001", "Conteúdos")}>
        <div className="mk-container">
          <Reveal variant="mask" className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-[var(--mk-orange)]" aria-hidden />
              <p className="text-kicker text-[var(--mk-orange-deep)]">{t("002", "Conteúdos")}</p>
            </div>
            <h1 className="text-hero mb-5">{t("003", "Marketing local, ")}<span className="text-[var(--mk-orange)]">{t("004", "sem enrolação")}</span>.</h1>
            <p className="text-lead">
              {t("005", "Artigos escritos pela equipe MK sobre Google, redes sociais, mídia indoor, sites e comunicação visual — o que aprendemos gerenciando a presença de empresas da região.")}</p>
          </Reveal>
        </div>
      </section>

      <section className="pb-2">
        <div className="mk-container">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label={t("006", "Filtrar artigos por categoria")}>
            <CategoryChip active={!activeCategory} onClick={() => { setPage(1); navigate({ view: "blog" }); }} label={t("007", "Todos")} />
            {categories.map((c) => (
              <CategoryChip
                key={c.slug}
                active={activeCategory === c.slug}
                onClick={() => { setPage(1); navigate({ view: "blog", category: c.slug }); }}
                label={c.name}
                color={c.color ?? undefined}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="sect-l">
        <div className="mk-container">
        {loadError ? <div role="alert" className="border rounded-lg p-8"><p>Não foi possível carregar os conteúdos.</p><button onClick={()=>setRetry(v=>v+1)} className="underline min-h-11 mt-3">Tentar novamente</button></div> : loading ? (
          <div className="grid md:grid-cols-3 gap-5" aria-busy="true">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white border border-[#e3e3e3] rounded-2xl p-6 animate-pulse">
                <div className="h-3 w-24 bg-[var(--mk-sand)] rounded mb-4" />
                <div className="h-5 w-full bg-[var(--mk-sand)] rounded mb-2" />
                <div className="h-5 w-2/3 bg-[var(--mk-sand)] rounded mb-4" />
                <div className="h-3 w-full bg-[var(--mk-sand)] rounded" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <PlayMark className="w-14 h-14 mx-auto mb-4 opacity-40" aria-hidden />
            <h2 className="font-display font-bold text-xl mb-2">{t("008", "Nenhum artigo por aqui ainda")}</h2>
            <p className="text-sm text-[#525252] max-w-md mx-auto mb-6">
              {t("009", "Estamos preparando conteúdos sobre marketing local, mídia indoor e presença digital. Enquanto isso, fale com a MK.")}</p>
            <Button onClick={() => navigate({ view: "contato" })} className="rounded-full bg-[var(--mk-ink)] hover:bg-[var(--mk-ink-800)] text-white">
              {t("010", "Falar com a MK")}</Button>
          </div>
        ) : (
          <>
            {/* destaque editorial: primeiro post grande + demais em linhas numeradas */}
            {posts[0] && (
              <Reveal variant="mask">
                <button
                  onClick={() => navigate({ view: "artigo", slug: posts[0].slug })}
                  className="group w-full grid lg:grid-cols-[1.1fr_0.9fr] bg-white border border-[#e3e3e3] rounded-3xl overflow-hidden mb-12 text-left hover:shadow-[0_30px_60px_-30px_rgba(10,10,10,0.3)] transition-shadow"
                >
                  <div className="relative min-h-[240px] lg:min-h-[360px] bg-[var(--mk-sand)] overflow-hidden">
                    {posts[0].coverImage ? (
                      <img src={posts[0].coverImage} alt={posts[0].coverAlt ?? posts[0].title} loading="lazy" width={900} height={600} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none" />
                    ) : (
                      <PostCoverPattern category={posts[0].category?.name ?? ""} />
                    )}
                    <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-wider bg-[var(--mk-orange)] text-white px-3 py-1.5 rounded-full">
                      {t("011", "Destaque")}</span>
                  </div>
                  <div className="p-7 sm:p-10 flex flex-col justify-center">
                    {posts[0].category && (
                      <span className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: posts[0].category.color ?? "var(--mk-orange-deep)" }}>
                        {posts[0].category.name}
                      </span>
                    )}
                    <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight leading-tight mb-3 group-hover:text-[var(--mk-orange-deep)] transition-colors">{posts[0].title}</h2>
                    <p className="text-[15px] text-[#525252] leading-relaxed line-clamp-3 mb-5">{posts[0].excerpt}</p>
                    <span className="flex items-center gap-3 text-xs text-[#a89e94]">
                      {formatDate(posts[0].publishedAt)}
                      <span className="w-1 h-1 rounded-full bg-[#d8cfc4]" aria-hidden />
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" aria-hidden /> {posts[0].readingMinutes} {t("012", " min")}</span>
                    </span>
                  </div>
                </button>
              </Reveal>
            )}
            <ol className="list-none">
              {posts.slice(1).map((post, i) => (
                <Reveal as="li" key={post.id} variant="up" delay={i * 60}>
                  <button
                    onClick={() => navigate({ view: "artigo", slug: post.slug })}
                    className="group w-full grid grid-cols-[44px_1fr] sm:grid-cols-[80px_1fr_auto] gap-x-4 sm:gap-x-8 items-start sm:items-center py-6 sm:py-7 border-t border-[#e3e3e3] last:border-b text-left"
                  >
                    <span aria-hidden className="font-display font-bold text-2xl sm:text-3xl text-transparent tracking-tight" style={{ WebkitTextStroke: "1.2px var(--mk-orange)" }}>
                      {String(i + 2).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      {post.category && (
                        <span className="text-[11px] font-bold uppercase tracking-wider mb-1 block" style={{ color: post.category.color ?? "var(--mk-orange-deep)" }}>
                          {post.category.name}
                        </span>
                      )}
                      <span className="block font-display font-bold text-xl sm:text-2xl tracking-tight text-[var(--mk-ink)] group-hover:text-[var(--mk-orange-deep)] transition-colors mb-1">{post.title}</span>
                      <span className="block text-[15px] text-[#525252] leading-relaxed line-clamp-2 max-w-3xl">{post.excerpt}</span>
                    </span>
                    <span className="hidden sm:flex items-center gap-3 text-xs text-[#a89e94] whitespace-nowrap">
                      {formatDate(post.publishedAt)}
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" aria-hidden /> {post.readingMinutes} {t("013", " min")}</span>
                    </span>
                  </button>
                </Reveal>
              ))}
            </ol>
            {totalPages > 1 && (
              <nav className="flex items-center justify-center gap-2 mt-12" aria-label={t("014", "Paginação de artigos")}>
                <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => { setPage(page - 1); }} aria-label={t("015", "Página anterior")} className="rounded-full">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    variant={p === page ? "default" : "outline"}
                    size="icon"
                    onClick={() => { setPage(p); }}
                    aria-label={`Página ${p}`}
                    aria-current={p === page ? "page" : undefined}
                    className={`rounded-full ${p === page ? "bg-[var(--mk-orange)] hover:bg-[var(--mk-orange-deep)] text-white" : ""}`}
                  >
                    {p}
                  </Button>
                ))}
                <Button variant="outline" size="icon" disabled={page >= totalPages} onClick={() => { setPage(page + 1); }} aria-label={t("016", "Próxima página")} className="rounded-full">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </nav>
            )}
          </>
        )}
        </div>
      </section>
    </div>
  );
}

function CategoryChip({ active, onClick, label, color }: { active: boolean; onClick: () => void; label: string; color?: string }) {
  return (
    <button
      onClick={onClick}
      role="tab"
      aria-selected={active}
      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all min-h-[40px] border-2 ${active ? "bg-[var(--mk-ink)] text-white border-[var(--mk-ink)]" : "bg-white text-[#3d3730] border-[#e3e3e3] hover:border-[var(--mk-orange)]"}`}
      style={active && color ? { background: color, borderColor: color } : undefined}
    >
      {label}
    </button>
  );
}

function PostCoverPattern({ category }: { category: string }) {
  const seed = category.length;
  return (
    <svg viewBox="0 0 400 144" className="w-full h-full" aria-hidden="true">
      <rect width="400" height="144" fill="var(--mk-paper)" />
      {[...Array(6)].map((_, i) => (
        <circle
          key={i}
          cx={60 + ((i * 73 + seed * 31) % 300)}
          cy={30 + ((i * 47 + seed * 17) % 84)}
          r={10 + ((i * 13 + seed) % 22)}
          fill={i % 2 ? "var(--mk-orange)" : "var(--mk-sand)"}
          opacity={i % 2 ? 0.85 : 1}
        />
      ))}
      <rect x={20} y={20} width={360} height={104} rx={10} fill="none" stroke="var(--mk-ink)" strokeWidth={2} opacity={0.15} />
    </svg>
  );
}

// ───────────────────────── Artigo ─────────────────────────

export function ArticlePage({ slug }: { slug: string }) {
  const t = useCopy("blog");
  const { navigate } = useSite();
  const [post, setPost] = useState<FullPost | null>(null);
  const [related, setRelated] = useState<PostCard[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toc, setToc] = useState<{ id: string; text: string }[]>([]);

  useEffect(() => {
    fetch(`/api/public/posts/${encodeURIComponent(slug)}`)
      .then(async (r) => {
        if (!r.ok) throw new Error("404");
        return r.json();
      })
      .then((d) => {
        setPost(d.post);
        setRelated(d.related ?? []);
      })
      .catch(() => setNotFound(true));
  }, [slug]);

  // SEO do artigo + TOC
  useEffect(() => {
    if (!post) return;
    document.title = post.seoTitle || `${post.title} — MK Creative`;
    const meta = document.head.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", post.seoDescription || post.excerpt || "");

    const headers = Array.from(document.querySelectorAll(".mk-prose h2"));
    const items = headers.map((h, i) => {
      const id = `sec-${i}`;
      h.id = id;
      return { id, text: h.textContent ?? "" };
    });
    requestAnimationFrame(() => setToc(items));

    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.seoDescription || post.excerpt,
      author: { "@type": "Organization", name: post.author.name || "MK Creative" },
      publisher: { "@type": "Organization", name: "MK Creative", logo: { "@type": "ImageObject", url: "https://mktvmarketing.com.br/logo-mk-preto.png" } },
      datePublished: post.publishedAt,
      dateModified: post.publishedAt,
      mainEntityOfPage: `https://mktvmarketing.com.br/#/blog/${post.slug}`,
    });
    document.head.appendChild(el);
    return () => { el.remove(); };
  }, [post]);

  const safeContent = useMemo(() => (post?.content ? sanitizeHtml(post.content) : ""), [post]);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: post?.title ?? "", url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (notFound) {
    return (
      <div className="mk-container py-24 max-w-3xl text-center">
        <PlayMark className="w-16 h-16 mx-auto mb-5 opacity-40" aria-hidden />
        <h1 className="text-display mb-3">{t("017", "Artigo não encontrado")}</h1>
        <p className="text-[#525252] mb-8">{t("018", "O conteúdo que você procura pode ter mudado de endereço.")}</p>
        <Button onClick={() => navigate({ view: "blog" })} className="rounded-full bg-[var(--mk-ink)] hover:bg-[var(--mk-ink-800)] text-white">
          {t("019", "Ver todos os artigos")}</Button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mk-container py-24 max-w-4xl" aria-busy="true">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-32 bg-[var(--mk-sand)] rounded" />
          <div className="h-10 w-full bg-[var(--mk-sand)] rounded" />
          <div className="h-10 w-2/3 bg-[var(--mk-sand)] rounded" />
          <div className="h-40 w-full bg-[var(--mk-sand)] rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--mk-paper)]">
      <article className="mk-container pt-12 pb-20 max-w-[860px]">
        <nav aria-label={t("020", "Trilha de navegação")} className="mb-8 text-xs font-semibold text-[#a89e94]">
          <button onClick={() => navigate({ view: "home" })} className="hover:text-[var(--mk-orange-deep)]">{t("021", "Início")}</button>
          <span className="mx-2" aria-hidden>/</span>
          <button onClick={() => navigate({ view: "blog" })} className="hover:text-[var(--mk-orange-deep)]">{t("022", "Conteúdos")}</button>
          <span className="mx-2" aria-hidden>/</span>
          <span className="text-[var(--mk-ink)]">{post.category?.name ?? "Artigo"}</span>
        </nav>

        <header className="mb-10">
          {post.category && (
            <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: post.category.color ?? "var(--mk-orange-deep)" }}>
              {post.category.name}
            </span>
          )}
          <h1 className="text-display mt-3 mb-5">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#a89e94]">
            <span>{post.author.name || "Equipe MK Creative"}</span>
            <span>{formatDate(post.publishedAt)}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" aria-hidden /> {post.readingMinutes} {t("023", " min de leitura")}</span>
            <button onClick={share} className="flex items-center gap-1.5 font-semibold text-[var(--mk-orange-deep)] hover:underline min-h-[32px]">
              <Share2 className="w-4 h-4" aria-hidden />
              {copied ? "Link copiado!" : "Compartilhar"}
            </button>
          </div>
        </header>

        <div className="prose-wrap">
          {toc.length > 2 && (
            <nav className="mb-10 bg-white border border-[#e3e3e3] rounded-2xl p-5" aria-label={t("024", "Sumário do artigo")}>
              <h2 className="text-kicker text-[var(--mk-orange-deep)] mb-3 flex items-center gap-2">
                <ListTree className="w-4 h-4" aria-hidden /> {t("025", "Neste artigo")}</h2>
              <ol className="space-y-2 text-sm list-none">
                {toc.map((t, i) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} className="text-[#525252] hover:text-[var(--mk-orange-deep)] hover:underline underline-offset-4">
                      <span className="text-[var(--mk-orange)] font-bold mr-2">{String(i + 1).padStart(2, "0")}</span>
                      {t.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div className="mk-prose" dangerouslySetInnerHTML={{ __html: safeContent }} />
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10" aria-label={t("026", "Tags do artigo")}>
            {post.tags.map((t) => (
              <span key={t.slug} className="text-xs font-semibold bg-[var(--mk-sand)] text-[#3d3730] px-3 py-1.5 rounded-full">
                #{t.name}
              </span>
            ))}
          </div>
        )}

        <div className="mt-12 bg-white border border-[#e3e3e3] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <PlayMark className="w-12 h-12 shrink-0" aria-hidden />
          <div className="flex-1">
            <h2 className="font-display font-bold text-lg mb-1">{t("027", "Quer aplicar isso na sua empresa?")}</h2>
            <p className="text-sm text-[#525252]">{t("028", "A MK Creative gerencia presença digital e física para empresas da região de São José do Rio Preto.")}</p>
          </div>
          <WhatsAppButton size="sm" label={t("029", "Falar com a MK")} message={`Olá! Li o artigo "${post.title}" no site e quero conversar.`} />
        </div>

        {related.length > 0 && (
          <section className="mt-14" aria-label={t("030", "Artigos relacionados")}>
            <h2 className="text-title mb-6">{t("031", "Leia também")}</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {related.map((r) => (
                <button
                  key={r.slug}
                  onClick={() => navigate({ view: "artigo", slug: r.slug })}
                  className="group text-left bg-white border border-[#e3e3e3] rounded-xl p-5 hover:border-[var(--mk-orange)] transition-colors h-full"
                >
                  {r.category && (
                    <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: r.category.color ?? "var(--mk-orange-deep)" }}>
                      {r.category.name}
                    </span>
                  )}
                  <h3 className="font-display font-bold text-sm leading-snug mt-1.5 mb-2 group-hover:text-[var(--mk-orange-deep)] transition-colors">{r.title}</h3>
                  <span className="text-xs text-[#a89e94]">{r.readingMinutes} {t("032", " min →")}</span>
                </button>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
