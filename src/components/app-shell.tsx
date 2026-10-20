"use client";

// ─────────────────────────────────────────────────────────────
// MK Creative — App Shell (SPA de rota única com roteamento por hash)
// Rotas: #/ #/servicos/ #/servicos/{slug} #/midia-indoor #/blog #/blog/{slug}
//        #/sobre #/contato #/privacidade #/termos #/admin/{...}
// ─────────────────────────────────────────────────────────────

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { SiteData } from "@/lib/settings";
import type { Service } from "@/lib/services";
import { SERVICES } from "@/lib/services";
import { PublicSite } from "@/components/site/site-root";
import dynamic from "next/dynamic";
const AdminApp = dynamic(() => import("@/components/admin/admin-app").then(m => m.AdminApp), { loading: () => <p role="status" className="p-8">Carregando painel…</p> });

export type Counters = { onlineNow: number; totalPageviews: number; publishedPosts: number };

export type GalleryItem = { id: string; kind: string; title: string; caption: string | null; venue: string | null; segment: string | null; src: string | null; videoUrl: string | null; poster: string | null; dateLabel: string | null };
export type CityItem = { id: string; name: string; slug: string; lat: number; lng: number; description: string | null };
export type StepItem = { id: string; title: string; description: string | null };
export type CategoryItem = { name: string; slug: string; color: string | null };
export type FormatItem = { id: string; name: string; description: string | null; specs: string | null };

export type Bootstrap = SiteData & { counters: Counters; gallery: GalleryItem[]; cities: CityItem[]; steps: StepItem[]; categories: CategoryItem[]; formats: FormatItem[] };

export type Route =
  | { view: "home" }
  | { view: "servicos" }
  | { view: "servico"; slug: string }
  | { view: "midia-indoor" }
  | { view: "blog"; category?: string; page?: number }
  | { view: "artigo"; slug: string }
  | { view: "sobre" }
  | { view: "contato" }
  | { view: "privacidade" }
  | { view: "termos" }
  | { view: "admin"; sub: string[] };

export function parseHash(hash: string): Route {
  const clean = hash.replace(/^#\/?/, "").replace(/\/+$/, "");
  if (!clean) return { view: "home" };
  const [pathname, query = ""] = clean.split("?");
  const parts = pathname.split("/").filter(Boolean);

  if (parts[0] === "admin") return { view: "admin", sub: parts.slice(1) };
  if (parts[0] === "servicos" && parts[1]) return { view: "servico", slug: parts[1] };
  if (parts[0] === "servicos") return { view: "servicos" };
  if (parts[0] === "midia-indoor") return { view: "midia-indoor" };
  if (parts[0] === "blog" && parts[1]) return { view: "artigo", slug: parts[1] };
  if (parts[0] === "blog") {
    const category = new URLSearchParams(query).get("categoria") ?? undefined;
    return { view: "blog", category };
  }
  if (parts[0] === "sobre") return { view: "sobre" };
  if (parts[0] === "contato") return { view: "contato" };
  if (parts[0] === "privacidade") return { view: "privacidade" };
  if (parts[0] === "termos") return { view: "termos" };
  return { view: "home" };
}

export function routeToHash(r: Route): string {
  switch (r.view) {
    case "home": return "#/";
    case "servicos": return "#/servicos";
    case "servico": return `#/servicos/${r.slug}`;
    case "midia-indoor": return "#/midia-indoor";
    case "blog": return r.category ? `#/blog?categoria=${encodeURIComponent(r.category)}` : "#/blog";
    case "artigo": return `#/blog/${r.slug}`;
    case "sobre": return "#/sobre";
    case "contato": return "#/contato";
    case "privacidade": return "#/privacidade";
    case "termos": return "#/termos";
    case "admin": return `#/admin${r.sub.length ? "/" + r.sub.join("/") : ""}`;
  }
}

// ── Contexto do site ──

type SiteContextValue = {
  site: Bootstrap | null;
  route: Route;
  navigate: (r: Route) => void;
  services: Service[];
  isAdmin: boolean;
  refreshSite: () => Promise<void>;
  track: (type: string, label?: string) => void;
};

export const SiteContext = createContext<SiteContextValue>({
  site: null,
  route: { view: "home" },
  navigate: () => {},
  services: SERVICES,
  isAdmin: false,
  refreshSite: async () => {},
  track: () => {},
});

export function useSite() {
  return useContext(SiteContext);
}

export function useNavigate() {
  return useSite().navigate;
}

// ── SEO dinâmico (title/description/canonical/JSON-LD por rota) ──

function setMeta(name: string, content: string, attr: "name" | "property" = "name") {
  let el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export default function AppShell() {
  const [site, setSite] = useState<Bootstrap | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [route, setRoute] = useState<Route>(() => parseHash(typeof window !== "undefined" ? window.location.hash : ""));
  const routeRef = useRef(route);

  const refreshSite = useCallback(async () => {
    try {
      const res = await fetch("/api/public/bootstrap", { cache: "no-store" });
      if (res.ok) setSite(await res.json());
    } catch {
      // mantém site anterior
    }
  }, []);

  // Bounded request: a failed API must not leave an endless spinner.
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    (async () => {
      try {
        const res = await fetch("/api/public/bootstrap", { cache: "no-store", signal: controller.signal });
        if (!res.ok) throw new Error("Bootstrap unavailable");
        const data = await res.json();
        if (!data?.content || !data?.homeSections) throw new Error("Invalid bootstrap");
        if (active) setSite(data);
      } catch {
        if (active) setLoadError(true);
      } finally { clearTimeout(timer); }
    })();
    return () => { active = false; clearTimeout(timer); controller.abort(); };
  }, []);

  // roteamento por hash
  useEffect(() => {
    const onHash = () => {
      const r = parseHash(window.location.hash);
      routeRef.current = r;
      setRoute(r);
      if (!r.view.startsWith("admin")) {
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      }
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = useCallback((r: Route) => {
    const target = routeToHash(r);
    if (window.location.hash === target) {
      // força re-render
      setRoute(parseHash(target));
      window.scrollTo({ top: 0 });
      return;
    }
    window.location.hash = target;
  }, []);

  const track = useCallback((type: string, label?: string) => {
    if (site?.features.enabledTracking === false) return;
    fetch("/api/track/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, label, path: window.location.hash || "#/" }),
    }).catch(() => {});
  }, [site?.features.enabledTracking]);

  // tracking de pageviews (LGPD: dados anônimos, sem cookies de terceiros)
  useEffect(() => {
    if (!site || route.view === "admin" || !site.features.enabledTracking) return;
    const t = setTimeout(() => {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: routeToHash(route), title: document.title }),
        keepalive: true,
      }).catch(() => {});
    }, 600);
    return () => clearTimeout(t);
     
  }, [route, site?.features.enabledTracking]);

  // SEO por rota
  useEffect(() => {
    if (!site) return;
    const seo = site.seo;
    const ogImage = seo.defaultOgImage === "/og-mk-creative.jpg" ? site.media.brand.ogImage : seo.defaultOgImage;
    setMeta("og:image", new URL(ogImage || "/og-mk-creative.jpg", window.location.origin).href, "property");
    setMeta("twitter:image", new URL(ogImage || "/og-mk-creative.jpg", window.location.origin).href);
    setMeta("google-site-verification", seo.gscVerification);
    let favicon = document.head.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!favicon) { favicon = document.createElement("link"); favicon.rel = "icon"; document.head.appendChild(favicon); }
    favicon.href = site.media.brand.favicon;
    const base = "MK Creative";
    let title = seo.pages.home?.title || `${base} — Marketing e Mídia Indoor`;
    let description = seo.pages.home?.description || "";

    if (route.view === "servicos" && seo.pages.solucoes) { title = seo.pages.solucoes.title; description = seo.pages.solucoes.description; }
    else if (route.view === "servico") {
      const s = site.services.find((x) => x.slug === route.slug);
      if (s) { title = s.seo.title; description = s.seo.description; }
    } else if (route.view === "midia-indoor" && seo.pages.midia) { title = seo.pages.midia.title; description = seo.pages.midia.description; }
    else if (route.view === "blog" && seo.pages.blog) { title = seo.pages.blog.title; description = seo.pages.blog.description; }
    else if (route.view === "artigo") {
      // título do artigo aplicado pelo componente de artigo (fetch assíncrono)
    } else if (route.view === "sobre" && seo.pages.sobre) { title = seo.pages.sobre.title; description = seo.pages.sobre.description; }
    else if (route.view === "contato" && seo.pages.contato) { title = seo.pages.contato.title; description = seo.pages.contato.description; }
    else if (route.view === "privacidade") { title = `Política de Privacidade — ${base}`; description = `Como a ${base} coleta, usa e protege dados.`; }
    else if (route.view === "termos") { title = `Termos de Uso — ${base}`; description = `Termos de uso do site da ${base}.`; }

    document.title = title;
    setMeta("description", description);
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
  }, [route, site]);

  const isAdmin = route.view === "admin";

  const value = useMemo<SiteContextValue>(() => ({
    site, route, navigate, services: site?.services ?? SERVICES, isAdmin, refreshSite, track,
  }), [site, route, navigate, isAdmin, refreshSite, track]);

  if (!site) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--mk-paper)]">
        <div className="flex flex-col items-center gap-4">
          {!loadError && <div className="w-12 h-12 rounded-full border-[3px] border-[var(--mk-orange)] border-t-transparent animate-spin" aria-hidden />}
          <span role="status" className="text-sm text-[#525252] font-medium">{loadError ? "Não foi possível carregar o site. Tente novamente." : "Carregando MK Creative…"}</span>
          {loadError && <button onClick={() => window.location.reload()} className="rounded-md bg-black px-5 py-3 text-sm text-white">Tentar novamente</button>}
        </div>
      </div>
    );
  }

  return (
    <SiteContext.Provider value={value}>
      {isAdmin ? <AdminApp /> : <PublicSite />}
    </SiteContext.Provider>
  );
}
