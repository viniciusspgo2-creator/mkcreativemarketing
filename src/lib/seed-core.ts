// ─────────────────────────────────────────────────────────────
// Seed compartilhado — usado pelo CLI (prisma/seed.ts) e pelo
// bootstrap público (auto-seed no primeiro deploy, sem passo manual).
// Regra: idempotente — só cria o que NÃO existe; nunca sobrescreve
// edições feitas pelo cliente no painel.
// Nada inventado: sem números, clientes ou depoimentos falsos.
// ─────────────────────────────────────────────────────────────
import type { PrismaClient } from "@prisma/client";
import { BLOG_SEED, BLOG_CATEGORIES } from "./blog-seed";
import { DEFAULT_CONTENT, DEFAULT_INSTITUTION, DEFAULT_CONTACT, DEFAULT_SOCIAL, DEFAULT_SEO, DEFAULT_MEDIA, DEFAULT_HOME_SECTIONS } from "./settings";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function readingMinutes(html: string): number {
  const words = stripHtml(html).split(" ").length;
  return Math.max(1, Math.round(words / 200));
}

function slugifyTag(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "e")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type GallerySeedItem = {
  kind: "PHOTO" | "VIDEO";
  title: string; caption: string; venue: string; segment: string; dateLabel: string;
  src?: string; videoUrl?: string; vimeoId?: string; poster?: string; duration?: number;
};

// Galeria da rede indoor — fotos reais + vídeos hospedados no Vimeo da MK.
// Regra do produto: vídeo NUNCA por upload — sempre link (YouTube/Vimeo).
const GALLERY_SEED: GallerySeedItem[] = [
  { kind: "PHOTO", title: "Farmácia — tela no ponto de venda", caption: "Tela da rede em operação no ponto de venda, com anúncio em exibição.", venue: "Farmácia", segment: "Saúde", dateLabel: "AGO 2025", src: "/uploads/Indoor/indoor-tela-farmacia.webp", },
  { kind: "PHOTO", title: "Sorveteria — tela junto ao balcão", caption: "Tela instalada em ambiente de convívio, com anúncio em exibição junto ao balcão.", venue: "Sorveteria", segment: "Alimentação", dateLabel: "MAI 2026", src: "/uploads/Indoor/indoor-tela-sorveteria.webp", },
  { kind: "PHOTO", title: "Academia — musculação", caption: "Tela em área de musculação, com anúncio em exibição e relógio digital.", venue: "Academia", segment: "Fitness", dateLabel: "JUL 2026", src: "/uploads/Indoor/indoor-tela-academia-1.webp", },
  { kind: "PHOTO", title: "Academia — área de treino", caption: "Tela em área de treino, com anúncio em exibição.", venue: "Academia", segment: "Fitness", dateLabel: "JUL 2026", src: "/uploads/Indoor/indoor-tela-academia-2.webp", },
  { kind: "PHOTO", title: "Academia — em circulação", caption: "Tela em operação durante o treino, com público em circulação.", venue: "Academia", segment: "Fitness", dateLabel: "JUL 2026", src: "/uploads/Indoor/indoor-tela-academia-3.webp", },
  { kind: "VIDEO", title: "Criativo em exibição — ponto de espera", caption: "Criativo veiculado na rede, gravado no ponto de espera.", venue: "Ponto de espera", segment: "Serviços", dateLabel: "MAR 2026", vimeoId: "1235119740", videoUrl: "https://vimeo.com/1235119740", poster: "/uploads/Indoor/indoor-video-1235119740.webp", duration: 8, },
  { kind: "VIDEO", title: "Criativo em exibição — entre prateleiras", caption: "Criativo veiculado na rede, gravado entre as prateleiras da loja.", venue: "Loja", segment: "Varejo", dateLabel: "ABR 2026", vimeoId: "1235119744", videoUrl: "https://vimeo.com/1235119744", poster: "/uploads/Indoor/indoor-video-1235119744.webp", duration: 13, },
  { kind: "VIDEO", title: "Criativo em exibição — corredor da loja", caption: "Criativo veiculado na rede, gravado no corredor da loja.", venue: "Loja", segment: "Varejo", dateLabel: "ABR 2026", vimeoId: "1235119739", videoUrl: "https://vimeo.com/1235119739", poster: "/uploads/Indoor/indoor-video-1235119739.webp", duration: 14, },
  { kind: "VIDEO", title: "Criativo em exibição — anúncio na tela", caption: "Criativo veiculado na rede, gravado em estabelecimento comercial.", venue: "Comércio", segment: "Varejo", dateLabel: "JUN 2026", vimeoId: "1235119738", videoUrl: "https://vimeo.com/1235119738", poster: "/uploads/Indoor/indoor-video-1235119738.webp", duration: 11, },
  { kind: "VIDEO", title: "Criativo em exibição — academia", caption: "Criativo veiculado na rede, gravado na área de treino.", venue: "Academia", segment: "Fitness", dateLabel: "JUL 2026", vimeoId: "1235119783", videoUrl: "https://vimeo.com/1235119783", poster: "/uploads/Indoor/indoor-video-1235119783.webp", duration: 25, },
  { kind: "VIDEO", title: "Criativo em exibição — treino em andamento", caption: "Criativo veiculado na rede, gravado durante o treino.", venue: "Academia", segment: "Fitness", dateLabel: "JUL 2026", vimeoId: "1235119820", videoUrl: "https://vimeo.com/1235119820", poster: "/uploads/Indoor/indoor-video-1235119820.webp", duration: 14, },
];

export async function seedInitialData(db: PrismaClient, adminId?: string): Promise<void> {
  // ── Categorias do blog ──
  for (const cat of BLOG_CATEGORIES) {
    const exists = await db.category.findUnique({ where: { slug: cat.slug } });
    if (!exists) await db.category.create({ data: { name: cat.name, slug: cat.slug, color: cat.color } });
  }

  // ── Cidades da rede indoor (coordenadas reais aproximadas) ──
  const cities = [
    { name: "São José do Rio Preto", slug: "sao-jose-do-rio-preto", lat: -20.8197, lng: -49.3794, status: "ACTIVE", order: 0, description: "Sede da MK Creative e centro de operação da rede." },
    { name: "Bady Bassitt", slug: "bady-bassitt", lat: -20.9186, lng: -49.4372, status: "ACTIVE", order: 1, description: "Telas instaladas em estabelecimentos comerciais da cidade." },
    { name: "Potirendaba", slug: "potirendaba", lat: -21.0431, lng: -49.3783, status: "ACTIVE", order: 2, description: "Telas instaladas em estabelecimentos comerciais da cidade." },
    { name: "Monte Aprazível", slug: "monte-aprazivel", lat: -20.7678, lng: -49.7108, status: "ACTIVE", order: 3, description: "Telas instaladas em estabelecimentos comerciais da cidade." },
    { name: "José Bonifácio", slug: "jose-bonifacio", lat: -21.0511, lng: -49.6906, status: "ACTIVE", order: 4, description: "Telas instaladas em estabelecimentos comerciais da cidade." },
  ];
  for (const c of cities) {
    const exists = await db.city.findUnique({ where: { slug: c.slug } });
    if (!exists) await db.city.create({ data: c });
  }

  // ── Etapas "como funciona" ──
  if ((await db.campaignStep.count()) === 0) {
    await db.campaignStep.createMany({
      data: [
        { title: "Conversa inicial", description: "Entendemos a sua empresa, o público que você quer alcançar e o objetivo da campanha nas telas.", order: 1 },
        { title: "Produção do anúncio", description: "A MK produz a arte do anúncio no formato adequado para as telas, respeitando a identidade da sua marca.", order: 2 },
        { title: "Programação da campanha", description: "Definimos a veiculação com exibição recorrente nos pontos das cidades escolhidas.", order: 3 },
        { title: "Exibição recorrente", description: "O anúncio entra na programação das telas instaladas em ambientes com circulação e permanência de público.", order: 4 },
        { title: "Acompanhamento", description: "Seguimos disponíveis para ajustes, renovação e evolução da campanha.", order: 5 },
      ],
    });
  }

  // ── Formatos de anúncio ──
  if ((await db.adFormat.count()) === 0) {
    await db.adFormat.createMany({
      data: [
        { name: "Spot em tela horizontal (16:9)", description: "Arte animada estática ou em vídeo para as TVs instaladas nos estabelecimentos.", specs: "Arte 1920×1080 · vídeo ou estático · a MK produz a arte", order: 1 },
        { name: "Spot em totem vertical (9:16)", description: "Formato vertical para telas de totem em pontos de espera e circulação.", specs: "Arte 1080×1920 · vídeo ou estático · a MK produz a arte", order: 2 },
      ],
    });
  }

  // ── Galeria indoor (fotos + vídeos Vimeo autorizados) ──
  if ((await db.indoorMedia.count()) === 0) {
    for (const [i, g] of GALLERY_SEED.entries()) {
      await db.indoorMedia.create({
        data: {
          kind: g.kind, title: g.title, caption: g.caption, venue: g.venue, segment: g.segment,
          src: g.src ?? null, videoUrl: g.videoUrl ?? null, vimeoId: g.vimeoId ?? null,
          poster: g.poster ?? null, duration: g.duration ?? null,
          dateLabel: g.dateLabel, authorized: true, origin: "own", order: i + 1, active: true,
        },
      });
    }
  }

  // ── Settings (somente se a chave ainda não existir — nunca sobrescrever painel) ──
  const settings: Record<string, unknown> = {
    content: DEFAULT_CONTENT,
    institution: DEFAULT_INSTITUTION,
    contact: DEFAULT_CONTACT,
    social: DEFAULT_SOCIAL,
    seo: DEFAULT_SEO,
    features: { maintenance: false },
    homeSections: DEFAULT_HOME_SECTIONS,
    media: DEFAULT_MEDIA,
  };
  for (const [key, value] of Object.entries(settings)) {
    const exists = await db.setting.findUnique({ where: { key } });
    if (!exists) await db.setting.create({ data: { key, value: JSON.stringify(value) } });
  }

  // ── Pendências de conteúdo (checklist do painel) ──
  if ((await db.contentTask.count()) === 0) {
    await db.contentTask.createMany({
      data: [
        { title: "WhatsApp comercial", description: "Número usado nos botões e no rodapé. Configure em Configurações → Contato.", order: 1 },
        { title: "Links das redes sociais", description: "Instagram, Facebook, LinkedIn e YouTube oficiais da MK.", order: 2 },
        { title: "Horário de atendimento", description: "Horário comercial oficial, igual ao Perfil da Empresa no Google.", order: 3 },
        { title: "Projetos autorizados para o portfólio", description: "Cadastre projetos com autorização do cliente em Projetos.", order: 4 },
        { title: "Revisar captions da galeria", description: "Confira legendas e locais das fotos e vídeos na aba Mídia Indoor.", order: 5 },
      ],
    });
  }

  // ── Posts do blog ──
  if (!adminId) {
    // auto-seed: usa o primeiro admin existente (criado no primeiro login)
    const admin = await db.user.findFirst({ where: { role: "ADMIN" }, orderBy: { createdAt: "asc" } });
    if (admin) adminId = admin.id;
  }
  if (adminId) {
    const catMap = new Map<string, string>();
    for (const c of BLOG_CATEGORIES) {
      const found = await db.category.findUnique({ where: { slug: c.slug } });
      if (found) catMap.set(c.name, found.id);
    }
    for (const post of BLOG_SEED) {
      const exists = await db.post.findUnique({ where: { slug: post.slug } });
      if (exists) continue;
      const created = await db.post.create({
        data: {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverAlt: post.coverAlt,
          status: "PUBLISHED",
          authorId: adminId,
          categoryId: catMap.get(post.category) ?? null,
          publishedAt: new Date(),
          readingMinutes: readingMinutes(post.content),
          featured: post.featured,
          seoTitle: post.seoTitle,
          seoDescription: post.seoDescription,
          focusKeyword: post.focusKeyword,
        },
      });
      for (const tagName of post.tags) {
        const tslug = slugifyTag(tagName);
        const tag = await db.tag.upsert({ where: { slug: tslug }, update: {}, create: { name: tagName, slug: tslug } });
        await db.postTag.upsert({
          where: { postId_tagId: { postId: created.id, tagId: tag.id } },
          update: {},
          create: { postId: created.id, tagId: tag.id },
        });
      }
    }
  }
}

// ── Auto-seed do bootstrap: uma vez por processo, silencioso e protegido ──
let seedPromise: Promise<void> | null = null;

export async function ensureSeeded(db: PrismaClient): Promise<void> {
  if (!seedPromise) {
    seedPromise = (async () => {
      try {
        const [cities, media, steps, posts] = await Promise.all([
          db.city.count(),
          db.indoorMedia.count(),
          db.campaignStep.count(),
          db.post.count(),
        ]);
        if (cities === 0 && media === 0 && steps === 0) {
          // banco recém-criado — popula conteúdo base (admin é criado no primeiro login)
          await seedInitialData(db);
        } else if (posts === 0) {
          // banco semeado antes do primeiro login — popula o blog se já houver admin
          // (os artigos exigem um autor; o seed é idempotente)
          const admin = await db.user.findFirst({ where: { role: "ADMIN" }, orderBy: { createdAt: "asc" } });
          if (admin) await seedInitialData(db, admin.id);
        } else {
          // garante settings default mesmo em bancos parcialmente populados
          const content = await db.setting.findUnique({ where: { key: "content" } });
          if (!content) {
            await db.setting.create({ data: { key: "content", value: JSON.stringify(DEFAULT_CONTENT) } });
          }
        }
      } catch {
        // banco ainda não migrado ou indisponível — o site usa os defaults do código
      }
    })();
  }
  return seedPromise;
}
