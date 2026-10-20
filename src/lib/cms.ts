import type { Service } from "./services";

export type WorkItem = { id: string; src: string; title: string; category: string; kind: "digital" | "indoor"; visible: boolean };
export type Project = { id: string; name: string; category: string; description: string; image: string; url: string; demo: boolean; visible: boolean };
export type Portfolio = { enabled: boolean; eyebrow: string; title: string; description: string; projects: Project[] };
export type CopyCatalog = Record<string, Record<string, string>>;
export type Editorial = {
  indoorFaq: { q: string; a: string }[];
  indoorSteps: { title: string; description: string | null }[] | null;
  indoorFormats: { name: string; description: string | null; specs: string | null }[] | null;
  channels: { name: string; label: string; href: string; cta: string }[];
};
export type Appearance = { orange: string; ink: string; paper: string; surface: string; bodySize: number; headingFont: "bricolage" | "inter"; radius: number };
export const DEFAULT_APPEARANCE: Appearance = { orange: "#f3640a", ink: "#101010", paper: "#ffffff", surface: "#f4f4f4", bodySize: 16, headingFont: "bricolage", radius: 10 };
export const DEFAULT_WORK: WorkItem[] = [
  { id: "mk-indoor", src: "/criativos/criativo-indoor-movimento.webp", title: "Sua marca em movimento", category: "Mídia indoor", kind: "indoor", visible: true },
  { id: "mk-sites", src: "/criativos/criativo-sites-resultado.webp", title: "Uma presença que faz diferença", category: "Sites & experiência digital", kind: "digital", visible: true },
  { id: "mk-social", src: "/criativos/criativo-redes-sociais.webp", title: "Conteúdo para ser lembrado", category: "Redes sociais", kind: "digital", visible: true },
  { id: "mk-google", src: "/criativos/criativo-google-seo.webp", title: "O próximo encontro começa na busca", category: "Google & SEO local", kind: "digital", visible: true },
];
export const DEFAULT_PORTFOLIO: Portfolio = {
  enabled: true, eyebrow: "Portfólio / Web design", title: "Cada negócio pede um site próprio.",
  description: "Explore três conceitos de demonstração. São projetos fictícios para apresentar possibilidades de linguagem, navegação e composição — substituíveis pelos trabalhos da MK.",
  projects: [
    { id: "alva", name: "Alva Arquitetura", category: "Site institucional", description: "Espaço para projetos, materiais e uma arquitetura de informação leve.", image: "/portfolio/alva.svg", url: "/portfolio/alva.html", demo: true, visible: true },
    { id: "vertice", name: "Vértice Studio", category: "Landing page", description: "Uma experiência direta, com identidade marcante e foco no primeiro contato.", image: "/portfolio/vertice.svg", url: "/portfolio/vertice.html", demo: true, visible: true },
    { id: "casa", name: "Casa do Grão", category: "Catálogo digital", description: "Produtos, origem e um jeito mais próximo de apresentar a marca.", image: "/portfolio/casa.svg", url: "/portfolio/casa.html", demo: true, visible: true },
  ],
};
export const DEFAULT_EDITORIAL: Editorial = {
  channels: [
    { name: "No digital", label: "Sites, conteúdo e campanhas que trabalham juntos.", href: "#/servicos", cta: "Explorar soluções digitais" },
    { name: "Na sua cidade", label: "Sua mensagem na rotina de quem está por perto.", href: "#/midia-indoor", cta: "Conhecer a rede de telas" },
  ],
  indoorSteps: null, indoorFormats: null,
  indoorFaq: [
    { q: "Como funciona anunciar nas telas?", a: "Depois da conversa inicial, a MK produz a arte do anúncio, programa a veiculação e acompanha a campanha nas cidades escolhidas." },
    { q: "Preciso ter a arte pronta?", a: "Não. A MK produz a arte no formato adequado para as telas, respeitando a identidade da sua marca." },
    { q: "Em quais cidades as telas estão instaladas?", a: "Consulte a cobertura e os pontos disponíveis no mapa da rede ou converse com a equipe." },
    { q: "Como a campanha é acompanhada?", a: "A MK informa o escopo de veiculação e acompanha a programação. As métricas disponíveis são apresentadas com clareza, conforme o formato contratado." },
  ],
};
export function mergeServices(defaults: Service[], saved: Service[] | null): Service[] {
  const ordered = saved?.length ? [...saved.map(s => defaults.find(d => d.slug === s.slug)).filter((s): s is Service => !!s), ...defaults.filter(d => !saved.some(s => s.slug === d.slug))] : defaults;
  return ordered.map(base => {
    const item = saved?.find(s => s.slug === base.slug);
    return item ? { ...base, ...item, key: base.key, slug: base.slug, icon: base.icon } : base;
  });
}
export function publicLink(value: string, fallback = "#/contato"): string {
  const v = value.trim();
  if (/^#\//.test(v) || /^\/(?!\/)/.test(v)) return v;
  if (/^(contato|servicos|sobre|blog|midia-indoor)$/.test(v)) return `#/${v}`;
  try { const u = new URL(v); if (u.protocol === "https:" || u.protocol === "http:") return u.href; } catch { /* invalid destination */ }
  return fallback;
}
