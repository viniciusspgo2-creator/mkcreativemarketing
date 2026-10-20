"use client";

// Blog admin — lista + editor com WYSIWYG próprio e painel de SEO
import { useCallback, useEffect, useRef, useState } from "react";
import { useSite } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  ArrowLeft, Bold, Italic, List, ListOrdered, Quote, Link2, ImagePlus, Heading2, Heading3,
  Eye, Save, Trash2, Star, Search, Plus, Upload, ExternalLink, Loader2,
} from "lucide-react";
import { slugify } from "@/lib/services";
import { cn } from "@/lib/utils";
import { PlayMark } from "@/components/brand/illustrations";

type PostRow = {
  id: string; title: string; slug: string; excerpt: string | null; content: string | null;
  coverImage: string | null; coverAlt: string | null; status: string; publishedAt: string | null;
  readingMinutes: number; featured: boolean; views: number; seoTitle: string | null; seoDescription: string | null;
  focusKeyword: string | null; categoryId: string | null;
  category: { name: string; slug: string; color: string | null } | null;
  author: { name: string } | null;
  tags: { name: string; slug: string }[];
};

type Category = { id: string; name: string; slug: string; color: string | null };
type MediaAsset = { id: string; url: string; filename: string; alt: string | null };

const STATUS_LABEL: Record<string, string> = { DRAFT: "Rascunho", PUBLISHED: "Publicado", SCHEDULED: "Agendado" };
const STATUS_STYLE: Record<string, string> = {
  DRAFT: "bg-stone-100 text-stone-600 border-stone-300",
  PUBLISHED: "bg-emerald-50 text-emerald-700 border-emerald-300",
  SCHEDULED: "bg-amber-50 text-amber-700 border-amber-300",
};

export function AdminBlog({ sub }: { sub: string[] }) {
  const { navigate } = useSite();
  const editingId = sub[1] === "novo" ? "new" : sub[1];
  const [mode, setMode] = useState<"list" | "edit">(sub[1] ? "edit" : "list");
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const load = useCallback(async () => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (statusFilter) params.set("status", statusFilter);
    const d = await fetch(`/api/admin/posts?${params}`).then((r) => r.json());
    setPosts(d.posts ?? []);
    setCategories(d.categories ?? []);
    setLoading(false);
  }, [q, statusFilter]);

  useEffect(() => {
    let active = true;
    (async () => {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (statusFilter) params.set("status", statusFilter);
      const d = await fetch(`/api/admin/posts?${params}`).then((r) => r.json());
      if (!active) return;
      setPosts(d.posts ?? []);
      setCategories(d.categories ?? []);
      setLoading(false);
    })();
    return () => { active = false; };
  }, [q, statusFilter]);
  void load;

  const del = async (id: string, title: string) => {
    if (!window.confirm(`Excluir o artigo "${title}"? Esta ação não pode ser desfeita.`)) return;
    await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    load();
  };

  if (mode === "edit") {
    return <PostEditor key={editingId} id={editingId} categories={categories} onBack={() => { setMode("list"); navigate({ view: "admin", sub: ["blog"] }); load(); }} />;
  }

  return (
    <div className="space-y-5 max-w-[1400px]">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a89e94]" aria-hidden />
          <Input value={q} onChange={(e) => { setLoading(true); setQ(e.target.value); }} placeholder="Buscar artigos…" className="pl-9 h-10 bg-white" aria-label="Buscar artigos" />
        </div>
        <Select value={statusFilter || "all"} onValueChange={(v) => { setLoading(true); setStatusFilter(v === "all" ? "" : v); }}>
          <SelectTrigger className="w-40 h-10 bg-white" aria-label="Filtrar por status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="PUBLISHED">Publicados</SelectItem>
            <SelectItem value="DRAFT">Rascunhos</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => { setMode("edit"); navigate({ view: "admin", sub: ["blog", "novo"] }); }} className="bg-[var(--mk-orange)] hover:bg-[var(--mk-orange-deep)] text-white font-bold rounded-full h-10 px-5 gap-2">
          <Plus className="w-4 h-4" aria-hidden /> Novo artigo
        </Button>
      </div>

      <Card className="rounded-2xl border-[#e3e3e3] overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-sm text-[#a89e94]">Carregando artigos…</div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center">
            <PlayMark className="w-12 h-12 mx-auto mb-4 opacity-30" aria-hidden />
            <h2 className="font-display font-bold text-lg mb-1">Nenhum artigo encontrado</h2>
            <p className="text-sm text-[#525252] mb-5">Crie o primeiro artigo do blog da MK.</p>
            <Button onClick={() => { setMode("edit"); navigate({ view: "admin", sub: ["blog", "novo"] }); }} className="rounded-full bg-[var(--mk-orange)] hover:bg-[var(--mk-orange-deep)] text-white font-bold">
              Criar artigo
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto mk-scroll">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e3e3e3] bg-[var(--mk-paper)]/60 text-left">
                  <th className="px-5 py-3.5 font-bold text-xs uppercase tracking-wide text-[#525252]">Artigo</th>
                  <th className="px-4 py-3.5 font-bold text-xs uppercase tracking-wide text-[#525252] hidden md:table-cell">Categoria</th>
                  <th className="px-4 py-3.5 font-bold text-xs uppercase tracking-wide text-[#525252]">Status</th>
                  <th className="px-4 py-3.5 font-bold text-xs uppercase tracking-wide text-[#525252] hidden sm:table-cell">Views</th>
                  <th className="px-4 py-3.5 font-bold text-xs uppercase tracking-wide text-[#525252] text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e3e3]">
                {posts.map((p) => (
                  <tr key={p.id} className="hover:bg-[var(--mk-paper)]/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <button onClick={() => { setMode("edit"); navigate({ view: "admin", sub: ["blog", p.id] }); }} className="text-left group">
                        <span className="font-semibold text-[var(--mk-ink)] group-hover:text-[var(--mk-orange-deep)] transition-colors flex items-center gap-1.5">
                          {p.featured && <Star className="w-3.5 h-3.5 text-[var(--mk-signal)] fill-[var(--mk-signal)]" aria-label="Destaque" />}
                          {p.title}
                        </span>
                        <span className="text-xs text-[#a89e94] font-mono">/{p.slug}</span>
                      </button>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      {p.category ? (
                        <span className="text-xs font-bold uppercase tracking-wide" style={{ color: p.category.color ?? undefined }}>{p.category.name}</span>
                      ) : (
                        <span className="text-xs text-[#a89e94]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge variant="outline" className={cn("text-[11px]", STATUS_STYLE[p.status])}>{STATUS_LABEL[p.status] ?? p.status}</Badge>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell text-[#525252] font-medium">{p.views.toLocaleString("pt-BR")}</td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <Button variant="ghost" size="sm" onClick={() => window.open(`/api/public/posts/${p.slug}`, "_blank")} aria-label={`Ver ${p.title} publicado`} className="h-8 px-2">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => del(p.id, p.title)}
                        aria-label={`Excluir ${p.title}`}
                        className="h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

// ───────────────────────── Editor ─────────────────────────

function PostEditor({ id, categories, onBack }: { id: string; categories: Category[]; onBack: () => void }) {
  const isNew = id === "new";
  const [post, setPost] = useState<Partial<PostRow> | null>(isNew ? {} : null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isNew) return;
    let active = true;
    (async () => {
      try {
        const r = await fetch(`/api/admin/posts/${id}`);
        const d = await r.json();
        if (active) setPost(d?.post ?? {});
      } catch {
        if (active) setPost({});
      }
    })();
    return () => { active = false; };
  }, [id, isNew]);

  const update = (patch: Partial<PostRow>) => setPost((p) => ({ ...p, ...patch }));

  const exec = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
    syncContent();
  };

  const syncContent = () => {
    if (editorRef.current) update({ content: editorRef.current.innerHTML });
  };

  const save = async (statusOverride?: string) => {
    if (!post?.title?.trim()) {
      alert("O artigo precisa de um título.");
      return;
    }
    setSaving(true);
    const payload = {
      ...post,
      status: statusOverride ?? post.status ?? "DRAFT",
      content: editorRef.current?.innerHTML ?? post.content ?? "",
      slug: post.slug || slugify(post.title),
    };
    const res = await fetch(isNew ? "/api/admin/posts" : `/api/admin/posts/${id}`, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(false);
    if (res.ok) {
      setSavedAt(new Date());
      if (isNew && data.post?.id) {
        window.location.hash = `#/admin/blog/${data.post.id}`;
      } else {
        setPost((p) => ({ ...p, ...data.post }));
      }
    } else {
      alert(data.error ?? "Erro ao salvar.");
    }
  };

  // upload de imagem de capa
  const uploadCover = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "Blog");
    fd.append("alt", post?.coverAlt ?? post?.title ?? "");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (res.ok) update({ coverImage: data.asset.url });
    else alert(data.error ?? "Erro no upload.");
  };

  if (post === null) {
    return <div className="p-10 text-center text-sm text-[#a89e94]">Carregando artigo…</div>;
  }

  const title = post.title ?? "";
  const seoTitle = post.seoTitle ?? title;
  const seoDesc = post.seoDescription ?? post.excerpt ?? "";
  const keyword = (post.focusKeyword ?? "").toLowerCase();

  // checklist SEO
  const checks = [
    { ok: title.length >= 25 && title.length <= 70, label: "Título entre 25 e 70 caracteres", current: `${title.length} caracteres` },
    { ok: seoTitle.length <= 60 && seoTitle.length > 15, label: "SEO title ≤ 60 caracteres", current: `${seoTitle.length} caracteres` },
    { ok: seoDesc.length >= 120 && seoDesc.length <= 165, label: "Meta description entre 120 e 165", current: `${seoDesc.length} caracteres` },
    { ok: (post.coverAlt ?? "").length > 8, label: "Imagem de capa com texto ALT", current: post.coverAlt ? "definido" : "faltando" },
    { ok: !!keyword && !!post.content && post.content.toLowerCase().includes(keyword), label: "Palavra-chave presente no conteúdo", current: keyword || "não definida" },
    { ok: !!post.categoryId, label: "Categoria definida", current: post.categoryId ? "ok" : "faltando" },
  ];

  return (
    <div className="max-w-[1100px] space-y-5">
      {/* Topbar */}
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" onClick={onBack} className="rounded-full h-9 gap-1.5 bg-white">
          <ArrowLeft className="w-4 h-4" aria-hidden /> Voltar
        </Button>
        <span className="text-sm text-[#a89e94]">
          {savedAt ? `Salvo às ${savedAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}` : isNew ? "Novo artigo" : "Editando"}
        </span>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" onClick={() => save("DRAFT")} disabled={saving} className="rounded-full h-9 bg-white">
            {post.status === "PUBLISHED" ? "Mover para rascunho" : "Salvar rascunho"}
          </Button>
          <Button onClick={() => save("PUBLISHED")} disabled={saving} className="rounded-full h-9 bg-[var(--mk-orange)] hover:bg-[var(--mk-orange-deep)] text-white font-bold gap-1.5">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden /> : <Save className="w-4 h-4" aria-hidden />}
            {post.status === "PUBLISHED" ? "Salvar e atualizar" : "Publicar"}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.55fr_1fr] gap-5 items-start">
        {/* Coluna principal */}
        <div className="space-y-5">
          <Card className="rounded-2xl border-[#e3e3e3]">
            <CardContent className="space-y-4 p-6">
              <div className="space-y-1.5">
                <Label htmlFor="post-title">Título *</Label>
                <Input
                  id="post-title"
                  value={title}
                  onChange={(e) => update({ title: e.target.value, slug: post.slug || undefined })}
                  placeholder="Título do artigo"
                  className="h-12 font-display font-bold text-lg bg-white"
                />
                <p className="text-[11px] text-[#a89e94] font-mono">/#/blog/{post.slug || slugify(title) || "slug-do-artigo"}</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="post-slug">Slug (URL)</Label>
                <Input id="post-slug" value={post.slug ?? ""} onChange={(e) => update({ slug: slugify(e.target.value) })} placeholder="slug-amigavel" className="h-10 bg-white font-mono text-sm" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="post-excerpt">Resumo (aparece nos cards)</Label>
                <Textarea id="post-excerpt" value={post.excerpt ?? ""} onChange={(e) => update({ excerpt: e.target.value })} rows={2} placeholder="Resumo curto do artigo…" className="bg-white" />
              </div>
            </CardContent>
          </Card>

          {/* Editor WYSIWYG */}
          <Card className="rounded-2xl border-[#e3e3e3]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-[#525252] uppercase tracking-wide">Conteúdo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border border-[#e3e3e3] rounded-xl overflow-hidden bg-white" role="group" aria-label="Barra de ferramentas do editor">
                <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-[#e3e3e3] bg-[var(--mk-paper)]/70">
                  <ToolBtn onClick={() => exec("formatBlock", "<h2>")} label="Título de seção"><Heading2 className="w-4 h-4" /></ToolBtn>
                  <ToolBtn onClick={() => exec("formatBlock", "<h3>")} label="Subtítulo"><Heading3 className="w-4 h-4" /></ToolBtn>
                  <ToolBtn onClick={() => exec("formatBlock", "<p>")} label="Parágrafo"><span className="text-xs font-bold px-0.5">P</span></ToolBtn>
                  <span className="w-px h-5 bg-[#e3e3e3] mx-1" aria-hidden />
                  <ToolBtn onClick={() => exec("bold")} label="Negrito"><Bold className="w-4 h-4" /></ToolBtn>
                  <ToolBtn onClick={() => exec("italic")} label="Itálico"><Italic className="w-4 h-4" /></ToolBtn>
                  <span className="w-px h-5 bg-[#e3e3e3] mx-1" aria-hidden />
                  <ToolBtn onClick={() => exec("insertUnorderedList")} label="Lista"><List className="w-4 h-4" /></ToolBtn>
                  <ToolBtn onClick={() => exec("insertOrderedList")} label="Lista numerada"><ListOrdered className="w-4 h-4" /></ToolBtn>
                  <ToolBtn onClick={() => exec("formatBlock", "<blockquote>")} label="Citação"><Quote className="w-4 h-4" /></ToolBtn>
                  <span className="w-px h-5 bg-[#e3e3e3] mx-1" aria-hidden />
                  <ToolBtn
                    onClick={() => {
                      const url = window.prompt("URL do link (deixe em branco para remover):");
                      if (url !== null) exec(url ? "createLink" : "unlink", url);
                    }}
                    label="Inserir link"
                  >
                    <Link2 className="w-4 h-4" />
                  </ToolBtn>
                  <ToolBtn onClick={() => fileRef.current?.click()} label="Inserir imagem"><ImagePlus className="w-4 h-4" /></ToolBtn>
                </div>
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={syncContent}
                  onBlur={syncContent}
                  className="mk-prose min-h-[320px] max-h-[560px] overflow-y-auto mk-scroll p-5 outline-none focus:ring-2 focus:ring-[var(--mk-orange)]/30 rounded-b-xl"
                  aria-label="Editor de conteúdo do artigo"
                  dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
                />
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const fd = new FormData();
                  fd.append("file", file);
                  fd.append("folder", "Blog");
                  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
                  const data = await res.json();
                  if (res.ok) {
                    editorRef.current?.focus();
                    document.execCommand("insertHTML", false, `<img src="${data.asset.url}" alt="${post.title ?? ""}" />`);
                    syncContent();
                  } else {
                    alert(data.error ?? "Erro no upload.");
                  }
                  e.target.value = "";
                }}
                aria-hidden
              />
            </CardContent>
          </Card>
        </div>

        {/* Coluna lateral */}
        <div className="space-y-5">
          <Card className="rounded-2xl border-[#e3e3e3]">
            <CardContent className="space-y-4 p-5">
              <div className="space-y-1.5">
                <Label htmlFor="post-status">Status</Label>
                <Select value={post.status ?? "DRAFT"} onValueChange={(v) => update({ status: v })}>
                  <SelectTrigger id="post-status" className="h-10 bg-white w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Rascunho</SelectItem>
                    <SelectItem value="PUBLISHED">Publicado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="post-category">Categoria</Label>
                <Select value={post.categoryId ?? "none"} onValueChange={(v) => update({ categoryId: v === "none" ? null : v })}>
                  <SelectTrigger id="post-category" className="h-10 bg-white w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sem categoria</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="post-tags">Tags (separadas por vírgula)</Label>
                <Input
                  id="post-tags"
                  value={(post.tags ?? []).map((t: string | { name?: string }) => (typeof t === "string" ? t : t?.name ?? "")).filter(Boolean).join(", ")}
                  onChange={(e) => update({ tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) as unknown as PostRow["tags"] })}
                  placeholder="seo local, google"
                  className="h-10 bg-white"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="post-featured">Destaque na home</Label>
                <Switch id="post-featured" checked={!!post.featured} onCheckedChange={(v) => update({ featured: v })} />
              </div>
            </CardContent>
          </Card>

          {/* Capa */}
          <Card className="rounded-2xl border-[#e3e3e3]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-[#525252] uppercase tracking-wide">Imagem de capa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {post.coverImage ? (
                <div className="relative rounded-xl overflow-hidden border border-[#e3e3e3] group">
                  { }
                  <img src={post.coverImage} alt={post.coverAlt ?? ""} className="w-full h-36 object-cover" />
                  <button
                    onClick={() => update({ coverImage: null })}
                    className="absolute top-2 right-2 p-2 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remover capa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => coverInputRef.current?.click()}
                  className="w-full h-28 rounded-xl border-2 border-dashed border-[#d9d0c5] hover:border-[var(--mk-orange)] flex flex-col items-center justify-center gap-2 text-[#a89e94] hover:text-[var(--mk-orange-deep)] transition-colors bg-white"
                >
                  <Upload className="w-5 h-5" aria-hidden />
                  <span className="text-sm font-semibold">Enviar capa</span>
                </button>
              )}
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadCover(f); e.target.value = ""; }}
                aria-hidden
              />
              <div className="space-y-1.5">
                <Label htmlFor="cover-alt">Texto ALT da capa (acessibilidade/SEO)</Label>
                <Input id="cover-alt" value={post.coverAlt ?? ""} onChange={(e) => update({ coverAlt: e.target.value })} placeholder="Descreva a imagem" className="h-10 bg-white" />
              </div>
            </CardContent>
          </Card>

          {/* Painel SEO */}
          <Card className="rounded-2xl border-[#e3e3e3]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-[#525252] uppercase tracking-wide flex items-center gap-2">
                <Eye className="w-4 h-4 text-[var(--mk-orange)]" aria-hidden /> SEO · prévia no Google
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white border border-[#e3e3e3] rounded-xl p-4">
                <p className="text-[11px] text-[#525252] mb-1">mktvmarketing.com.br › conteúdos</p>
                <p className="text-[#1a0dab] text-base leading-snug font-medium truncate">{seoTitle || "Título do artigo"}</p>
                <p className="text-[13px] text-[#4d5156] leading-snug mt-1 line-clamp-2">{seoDesc || "A descrição aparece aqui. Escreva uma meta description entre 120 e 165 caracteres."}</p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="seo-title">SEO title</Label>
                <Input id="seo-title" value={post.seoTitle ?? ""} onChange={(e) => update({ seoTitle: e.target.value })} placeholder={title} className="h-10 bg-white" />
                <p className={cn("text-[11px]", seoTitle.length > 60 ? "text-red-500" : "text-[#a89e94]")}>{seoTitle.length}/60</p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="seo-desc">Meta description</Label>
                <Textarea id="seo-desc" value={post.seoDescription ?? ""} onChange={(e) => update({ seoDescription: e.target.value })} rows={3} className="bg-white" />
                <p className={cn("text-[11px]", seoDesc.length > 165 || seoDesc.length < 120 ? "text-red-500" : "text-emerald-600")}>{seoDesc.length}/165</p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="seo-keyword">Palavra-chave foco</Label>
                <Input id="seo-keyword" value={post.focusKeyword ?? ""} onChange={(e) => update({ focusKeyword: e.target.value })} placeholder="ex.: mídia indoor" className="h-10 bg-white" />
              </div>
              <ul className="space-y-2 border-t border-[#e3e3e3] pt-3" role="list" aria-label="Checklist SEO">
                {checks.map((ch, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px]">
                    <span className={cn("w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5", ch.ok ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600")}>
                      {ch.ok ? "✓" : "!"}
                    </span>
                    <span className="text-[#3d3730]">
                      {ch.label}
                      <span className="text-[#a89e94]"> — {ch.current}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ToolBtn({ onClick, label, children }: { onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="w-8 h-8 rounded-lg hover:bg-[var(--mk-sand)] flex items-center justify-center text-[#3d3730] min-w-[32px] min-h-[32px]"
    >
      {children}
    </button>
  );
}
