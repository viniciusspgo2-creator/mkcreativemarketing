import { SERVICES, type Service } from "./services";
import { DEFAULT_APPEARANCE, DEFAULT_EDITORIAL, DEFAULT_PORTFOLIO, DEFAULT_WORK, mergeServices, type Appearance, type CopyCatalog, type Editorial, type Portfolio, type WorkItem } from "./cms";
import { COPY_DEFAULTS } from "./copy-defaults";


// ── Settings: leitura/escrita em JSON por chave, com cache em memória ──

type CacheEntry = { value: unknown; at: number };
const cache = new Map<string, CacheEntry>();
const TTL = 5_000; // 5s

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL) return hit.value as T;
  try {
    const { db } = await import("./db");
    const row = await db.setting.findUnique({ where: { key } });
    if (!row) return fallback;
    const value = JSON.parse(row.value) as T;
    cache.set(key, { value, at: Date.now() });
    return value;
  } catch {
    return fallback;
  }
}

export async function setSetting(key: string, value: unknown) {
  const { db } = await import("./db");
  const serialized = JSON.stringify(value);
  await db.setting.upsert({ where: { key }, update: { value: serialized }, create: { key, value: serialized } });
  cache.delete(key);
}

export function invalidateSettings() {
  cache.clear();
}

// deep merge: stored overrides defaults (objetos; arrays substituem)
export function deepMerge<T>(base: T, override: unknown): T {
  if (override === undefined || override === null) return base;
  if (Array.isArray(base) || Array.isArray(override) || typeof base !== "object" || typeof override !== "object") {
    return override as T;
  }
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [k, v] of Object.entries(override as Record<string, unknown>)) {
    if (["__proto__", "prototype", "constructor"].includes(k)) continue;
    const b = (base as Record<string, unknown>)[k];
    out[k] = b !== undefined && typeof b === "object" && b !== null && !Array.isArray(b) ? deepMerge(b, v) : v;
  }
  return out as T;
}

// ── Tipos de conteúdo do site (defaults) ──

export type HeroContent = {
  badge: string; titleA: string; titleB: string; titleC: string; subtitle: string;
  ctaPrimaryLabel: string; ctaPrimaryTo: string; ctaSecondaryLabel: string; ctaSecondaryTo: string;
};
export type AboutContent = { eyebrow: string; title: string; paragraphs: string[]; highlights: string[] };
export type ConceptContent = { eyebrow: string; title: string; lead: string; paragraphs: string[]; phrase: string };
export type ProcessStep = { title: string; text: string };
export type FaqItem = { q: string; a: string };
export type PromisesContent = { yes: string[]; no: string[] };
// Contadores animados — valores editáveis no painel (usar apenas números reais)
export type StatItem = { value: number; suffix: string; label: string };
export type StatsContent = { eyebrow: string; title: string; items: StatItem[] };

export type SiteContent = {
  hero: HeroContent;
  about: AboutContent;
  concept: ConceptContent;
  marquee: string[];
  process: ProcessStep[];
  faq: FaqItem[];
  promises: PromisesContent;
  stats: StatsContent;
};

// Vídeo do mega menu (Soluções) — reproduzido sem áudio, em loop
export type MenuVideo = {
  enabled: boolean;
  src: string; // MP4 (arquivo local do site ou URL externa de CDN)
  poster: string; // imagem de capa enquanto carrega
  kicker: string; // etiqueta sobre o vídeo (ex.: REDE PRÓPRIA)
  title: string;
  subtitle: string;
  ctaLabel: string;
};

// Imagens da marca — substituíveis pelo painel com resolução recomendada
export type BrandImages = {
  logoHeader: string; // usado no topo (fundo claro)
  logoFooter: string; // usado no rodapé e no painel (fundo escuro)
  favicon: string;
  ogImage: string; // imagem de compartilhamento 1200×630
};

// Imagens do hero da home (fotos reais das telas em operação)
export type HeroImages = { primary: string; secondary: string; tertiary: string };

export type MediaSettings = {
  menuVideo: MenuVideo;
  brand: BrandImages;
  heroImages: HeroImages;
  // imagem por serviço (slug) — substituível no painel · recomendação 1600×1200
  serviceImages: Record<string, string>;
  heroArtwork: string;
  aboutImage: string;
};

export type Institution = {
  brandName: string; legalName: string; cnpj: string;
  addressStreet: string; addressDistrict: string; addressCity: string; addressState: string; email: string;
};
export type Contact = { whatsapp: string; whatsappMessage: string; phone: string; hours: string; showPublicCounter: boolean };
export type Social = { instagram: string; facebook: string; linkedin: string; youtube: string };
export type SeoPages = Record<string, { title: string; description: string }>;
export type SeoSettings = { gaId: string; gscVerification: string; metaPixel: string; defaultOgImage: string; pages: SeoPages };
export type HomeSection = { key: string; label: string; visible: boolean };

// ── Defaults (mesmos valores do seed) ──

export const DEFAULT_CONTENT: SiteContent = {
  hero: {
    badge: "Rede própria de mídia indoor · 4 cidades",
    titleA: "Sua marca.",
    titleB: "Impossível",
    titleC: "de ignorar.",
    subtitle: "Conectamos estratégia, design e mídia para colocar sua empresa em evidência. No digital, nas telas e na vida real.",
    ctaPrimaryLabel: "Falar no WhatsApp",
    ctaPrimaryTo: "contato",
    ctaSecondaryLabel: "Ver a rede de telas",
    ctaSecondaryTo: "midia-indoor",
  },
  about: {
    eyebrow: "Quem é a MK",
    title: "Estratégia antes da execução. Presença digital e física.",
    paragraphs: [
      "A MK Creative é uma empresa de marketing, publicidade e comunicação sediada em São José do Rio Preto/SP. Gerenciamos a presença de empresas locais no Google, nas redes sociais e no mundo físico — da fachada à tela do celular.",
      "Mais do que executar serviços isolados, buscamos entender cada negócio e construir uma presença coerente nos diferentes pontos de contato entre a empresa e seus clientes.",
      "Diferencial da MK: temos e operamos uma rede própria de telas digitais em estabelecimentos comerciais de quatro cidades da região — o anúncio sai do planejamento e entra na rua.",
    ],
    highlights: ["Estratégia antes da execução", "Presença digital e física integradas", "Rede própria de mídia indoor"],
  },
  concept: {
    eyebrow: "O conceito",
    title: "DIGITAL + FÍSICO",
    lead: "Sua marca não existe em um único lugar.",
    paragraphs: [
      "O cliente pode encontrar uma empresa pesquisando no Google, navegando pelas redes sociais, acessando o site, vendo um anúncio na tela de uma loja ou passando em frente à fachada.",
      "A MK Creative trabalha esses pontos de contato para construir uma presença mais consistente para as marcas — do Google à fachada.",
    ],
    phrase: "Do Google à fachada. Da tela do celular à presença da sua marca no mundo real.",
  },
  marquee: ["Google & SEO Local", "Redes Sociais", "Tráfego Pago", "Criação de Sites", "Mídia Indoor", "Comunicação Visual", "São José do Rio Preto", "Bady Bassitt", "Potirendaba", "Monte Aprazível", "José Bonifácio"],
  process: [
    { title: "Conversa", text: "Entendemos o negócio, o público e o objetivo antes de qualquer entrega." },
    { title: "Estratégia", text: "Definimos canais, mensagens e prioridades — digital e físico." },
    { title: "Execução", text: "Produzimos e colocamos no ar: perfil, conteúdo, campanhas, site, telas, fachada." },
    { title: "Acompanhamento", text: "Gerenciamos, ajustamos e evoluímos com transparência." },
  ],
  faq: [
    { q: "A MK garante o primeiro lugar no Google?", a: "Não — e desconfie de quem prometer. O posicionamento é definido pelo Google e depende de diversos fatores. O que fazemos é trabalho técnico e de conteúdo consistente, sempre dentro das diretrizes." },
    { q: "O que é a rede de mídia indoor da MK?", a: "É uma rede própria de telas digitais instaladas em estabelecimentos comerciais de Bady Bassitt, Potirendaba, Monte Aprazível e José Bonifácio. As campanhas são exibidas de forma recorrente em ambientes com circulação e permanência de público." },
    { q: "Vocês atendem empresas de qualquer tamanho?", a: "Atendemos principalmente pequenas e médias empresas locais — comércio, clínicas, restaurantes, prestadores de serviço e indústrias com atendimento direto." },
    { q: "Como começa um trabalho com a MK?", a: "Por uma conversa. Você chama no WhatsApp ou envia o formulário, entendemos o seu momento e propomos um plano com escopo claro." },
    { q: "A MK produz a arte dos anúncios das telas?", a: "Sim. A MK produz a arte no formato adequado para exibição, respeitando a identidade da sua marca." },
    { q: "Em que cidades a rede de telas está instalada?", a: "Sede em São José do Rio Preto e telas em Bady Bassitt, Potirendaba, Monte Aprazível e José Bonifácio." },
  ],
  promises: {
    yes: ["Trabalho planejado e transparente", "Gestão ativa dos canais contratados", "Arte e conteúdo produzidos pela MK", "Acompanhamento próximo e linguagem clara"],
    no: ["Não prometemos primeiro lugar no Google", "Não inventamos números de audiência", "Não trabalhamos com compromissos que não podemos medir"],
  },
  stats: {
    eyebrow: "A rede em números",
    title: "Conte com o que é real.",
    items: [
      { value: 4, suffix: "", label: "cidades com telas da rede própria" },
      { value: 6, suffix: "", label: "frentes de solução integradas" },
      { value: 100, suffix: "%", label: "das artes produzidas pela MK" },
    ],
  },
};

export const DEFAULT_INSTITUTION: Institution = {
  brandName: "MK Creative",
  legalName: "A. F. C. PARAGUASSU - ME",
  cnpj: "49.511.069/0001-79",
  addressStreet: "Rua Antonio Olimpio, 69",
  addressDistrict: "Vila Aurora",
  addressCity: "São José do Rio Preto",
  addressState: "SP",
  email: "comercial@mktvmarketing.com.br",
};

export const DEFAULT_CONTACT: Contact = {
  whatsapp: "",
  whatsappMessage: "Olá! Vim pelo site da MK Creative e gostaria de conversar sobre os serviços de vocês.",
  phone: "",
  hours: "",
  showPublicCounter: true,
};

export const DEFAULT_SOCIAL: Social = { instagram: "", facebook: "", linkedin: "", youtube: "" };

export const DEFAULT_SEO: SeoSettings = {
  gaId: "", gscVerification: "", metaPixel: "", defaultOgImage: "/og-mk-creative.jpg",
  pages: {
    home: { title: "MK Creative — Marketing, Mídia Indoor e Comunicação Visual em São José do Rio Preto/SP", description: "Presença digital e física para empresas locais: Google, redes sociais, sites, tráfego pago, mídia indoor com rede própria de telas e comunicação visual." },
    solucoes: { title: "Soluções — MK Creative", description: "Google & SEO Local, redes sociais, tráfego pago, criação de sites, mídia indoor e comunicação visual em São José do Rio Preto e região." },
    midia: { title: "Mídia Indoor — Rede de telas digitais em 4 cidades", description: "Anuncie na rede própria de telas digitais da MK Creative: exibição recorrente em estabelecimentos comerciais de Bady Bassitt, Potirendaba, Monte Aprazível e José Bonifácio." },
    blog: { title: "Conteúdos — Blog da MK Creative", description: "Artigos sobre marketing local, Google, redes sociais, mídia indoor, sites e comunicação visual para empresas da região de São José do Rio Preto." },
    sobre: { title: "A MK — MK Creative", description: "Conheça a MK Creative: agência de presença digital e física em São José do Rio Preto/SP com rede própria de mídia indoor." },
    contato: { title: "Contato — MK Creative", description: "Fale com a MK Creative: WhatsApp, formulário e dados de contato. São José do Rio Preto/SP." },
  },
};

export const DEFAULT_MEDIA: MediaSettings = {
  heroArtwork: "/images/mk-conexao-960.webp",
  aboutImage: "/uploads/Indoor/indoor-tela-academia-1.webp",
  menuVideo: {
    enabled: true,
    src: "/videos/menu-indoor.mp4",
    poster: "/videos/menu-indoor-poster.jpg",
    kicker: "Rede própria",
    title: "Mídia Indoor",
    subtitle: "Telas em 4 cidades da região",
    ctaLabel: "Quero anunciar nas telas",
  },
  brand: {
    logoHeader: "/logo-mk-preto.png",
    logoFooter: "/logo-mk-branco.png",
    favicon: "/favicon.svg",
    ogImage: "/og-mk-creative.jpg",
  },
  heroImages: {
    primary: "/uploads/Indoor/indoor-tela-academia-1.webp",
    secondary: "/uploads/Indoor/indoor-tela-farmacia.webp",
    tertiary: "/uploads/Indoor/indoor-tela-sorveteria.webp",
  },
  serviceImages: {
    "google-seo-local": "/criativos/criativo-google-seo.webp",
    "gestao-redes-sociais": "/criativos/criativo-redes-sociais.webp",
    "trafego-pago": "/criativos/criativo-google-pin.webp",
    "criacao-de-sites": "/criativos/criativo-sites-resultado.webp",
    "midia-indoor": "/criativos/criativo-indoor-totem.webp",
    "comunicacao-visual": "/criativos/criativo-indoor-portrait.webp",
  },
};

export const DEFAULT_HOME_SECTIONS: HomeSection[] = [
  { key: "hero", label: "Hero", visible: true },
  { key: "marquee", label: "Faixa de serviços e cidades", visible: true },
  { key: "solutions", label: "Soluções", visible: true },
  { key: "indoor", label: "Mídia Indoor em destaque", visible: true },
  { key: "work", label: "Galeria de criativos", visible: true },
  { key: "concept", label: "DIGITAL + FÍSICO", visible: true },
  { key: "process", label: "Como trabalhamos", visible: true },
  { key: "promises", label: "O que prometemos (e o que não)", visible: true },
  { key: "blog", label: "Últimos conteúdos", visible: true },
  { key: "faq", label: "FAQ", visible: true },
  { key: "cta", label: "CTA final / contato", visible: true },
];

// ── Loader completo (usado pelo site público e pelo admin) ──

export async function getSiteData() {
  const [content, institution, contact, social, seo, features, homeSections, media, services, copy, portfolio, work, appearance, editorial, revision] = await Promise.all([
    getSetting<SiteContent>("content", DEFAULT_CONTENT),
    getSetting<Institution>("institution", DEFAULT_INSTITUTION),
    getSetting<Contact>("contact", DEFAULT_CONTACT),
    getSetting<Social>("social", DEFAULT_SOCIAL),
    getSetting<SeoSettings>("seo", DEFAULT_SEO),
    getSetting<{ maintenance: boolean; enabledTracking: boolean }>("features", { maintenance: false, enabledTracking: true }),
    getSetting<HomeSection[]>("homeSections", DEFAULT_HOME_SECTIONS),
    getSetting<MediaSettings>("media", DEFAULT_MEDIA),
    getSetting<Service[] | null>("services", null),
    getSetting<CopyCatalog>("copy", {}),
    getSetting<Portfolio>("portfolio", DEFAULT_PORTFOLIO),
    getSetting<WorkItem[]>("work", DEFAULT_WORK),
    getSetting<Appearance>("appearance", DEFAULT_APPEARANCE),
    getSetting<Editorial>("editorial", DEFAULT_EDITORIAL),
    getSetting<string>("_revision", "initial"),
  ]);
  return {
    content: deepMerge(DEFAULT_CONTENT, content),
    institution: deepMerge(DEFAULT_INSTITUTION, institution),
    contact: deepMerge(DEFAULT_CONTACT, contact),
    social: deepMerge(DEFAULT_SOCIAL, social),
    seo: deepMerge(DEFAULT_SEO, seo),
    features: { ...features, maintenance: features.maintenance ?? false, enabledTracking: features.enabledTracking ?? true },
    homeSections: homeSections.length ? [...homeSections, ...DEFAULT_HOME_SECTIONS.filter(d => !homeSections.some(s => s.key === d.key))] : DEFAULT_HOME_SECTIONS,
    media: deepMerge(DEFAULT_MEDIA, media),
    services: mergeServices(SERVICES, services),
    copy: deepMerge(COPY_DEFAULTS, copy),
    portfolio: deepMerge(DEFAULT_PORTFOLIO, portfolio), work,
    appearance: deepMerge(DEFAULT_APPEARANCE, appearance),
    editorial: deepMerge(DEFAULT_EDITORIAL, editorial), revision,
  };
}

export type SiteData = Awaited<ReturnType<typeof getSiteData>>;

export function whatsappLink(contact: Contact, extraMessage?: string) {
  if (!contact.whatsapp) return "";
  const msg = extraMessage || contact.whatsappMessage;
  const digits = contact.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;
}
