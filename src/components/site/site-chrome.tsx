"use client";

import { useCopy } from "@/components/site/use-copy";

// Chrome público: header + mega menu, footer, WhatsApp, cookies, cursor, reveals
import { useEffect, useRef, useState } from "react";
import { useSite } from "@/components/app-shell";
import { whatsappLink } from "@/lib/settings";
import { SERVICES } from "@/lib/services";
import { PlayMark } from "@/components/brand/illustrations";
import { Button } from "@/components/ui/button";
import { Menu, X, MessageCircle, Eye, ShieldCheck, ArrowRight, ArrowUpRight } from "lucide-react";

// ───────────────────────── Reveal on scroll (variações) ─────────────────────────
// variant: up | left | right | mask | pop | img — use "img" em wrappers de <img>
export function Reveal({
  children,
  className = "",
  delay = 0,
  variant = "up",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: "up" | "left" | "right" | "mask" | "pop" | "img";
  as?: keyof React.JSX.IntrinsicElements;
}) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("revealed");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setTimeout(() => el.classList.add("revealed"), delay);
            io.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);
  const T = Tag as React.ElementType;
  const variantCls = variant === "img" ? "rv rv-img" : `rv rv-${variant}`;
  return (
    <T ref={ref as React.Ref<HTMLElement>} className={`${variantCls} ${className}`}>
      {/* clip-path no filho: o elemento observado nunca pode ficar com área zero,
          senão o IntersectionObserver nunca dispara (comportamento do Chromium) */}
      {variant === "mask" ? <div className="rv-clip">{children}</div> : children}
    </T>
  );
}

// ───────────────────────── Contador animado (valores editáveis no painel) ─────────────────────────
export function AnimatedCounter({ value, suffix = "", className = "" }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let started = false;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started) {
            started = true;
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
              setDisplay(value);
              io.disconnect();
              return;
            }
            const t0 = performance.now();
            const dur = 1400;
            const tick = (t: number) => {
              const p = Math.min(1, (t - t0) / dur);
              const eased = 1 - Math.pow(1 - p, 4);
              setDisplay(Math.round(eased * value));
              if (p < 1) raf = requestAnimationFrame(tick);
            };
            raf = requestAnimationFrame(tick);
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value]);
  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {display.toLocaleString("pt-BR")}
      {suffix}
    </span>
  );
}

// ───────────────────────── Cursor com identidade (desktop) ─────────────────────────
export function CursorDot() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) return;
    const el = ref.current;
    if (!el) return;
    let x = -100, y = -100, raf = 0;
    const move = (e: MouseEvent) => {
      x = e.clientX; y = e.clientY;
      if (!raf) raf = requestAnimationFrame(() => {
        el.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%)`;
        raf = 0;
      });
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      el.dataset.hot = Boolean(t.closest("a, button, [role='button'], input, textarea, select, summary")) ? "true" : "false";
    };
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", over); cancelAnimationFrame(raf); };
  }, []);
  return <div ref={ref} className="mk-cursor-dot" aria-hidden="true" />;
}

// ───────────────────────── Marquee ─────────────────────────
export function Marquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-[#e3e3e3] bg-white py-4" aria-hidden="true">
      <div className="mk-marquee-track">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-3 px-6 text-sm font-semibold whitespace-nowrap text-[#525252]">
            {item}
            <span className="inline-block w-1.5 h-1.5 rounded-[2px] bg-[var(--mk-orange)]" />
          </span>
        ))}
      </div>
    </div>
  );
}

// ───────────────────────── Botão WhatsApp com tracking ─────────────────────────
export function WhatsAppButton({ message, label, className = "", size = "default" }: { message?: string; label?: string; className?: string; size?: "default" | "lg" | "sm" }) {
  const t = useCopy("navegacao");
  const { site, track } = useSite();
  const contact = site?.contact;
  const href = whatsappLink(contact ?? { whatsapp: "", whatsappMessage: "", phone: "", hours: "", showPublicCounter: false }, message);
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("whatsapp_click", message?.slice(0, 60))}
      className={className}
    >
      <span className={`inline-flex items-center justify-center bg-[var(--mk-ink)] hover:bg-[#303030] text-white font-semibold gap-2 rounded-full px-5 ${size === "lg" ? "h-12 text-sm" : size === "sm" ? "h-9 text-xs" : "h-10 text-sm"}`}>
        <MessageCircle className="w-4 h-4" aria-hidden />
        {label ?? t("063", "Falar no WhatsApp")}
      </span>
    </a>
  );
}

// ───────────────────────── Header ─────────────────────────
export function SiteHeader() {
  const t = useCopy("navegacao");
  const { site, route, navigate, track, services } = useSite();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [solucoesOpen, setSolucoesOpen] = useState(false);
  const mobileToggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => { document.body.style.overflow = previous; desktop.removeEventListener("change", closeOnDesktop); };
  }, [open]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      // segurança extra: se a página rolar com o mega aberto, fecha
      setSolucoesOpen((wasOpen) => (wasOpen ? false : wasOpen));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (open && e.key === "Tab") {
        const items = document.getElementById("mk-mobile-navigation")?.querySelectorAll<HTMLElement>('a[href], button');
        const last = items?.[items.length - 1];
        if (e.shiftKey && document.activeElement === mobileToggle.current && last) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); mobileToggle.current?.focus(); }
      }
      if (e.key === "Escape") {
        setSolucoesOpen(false);
        setOpen(false);
        if (open) mobileToggle.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, []);

  const go = (r: Parameters<typeof navigate>[0]) => {
    setOpen(false);
    setSolucoesOpen(false);
    navigate(r);
  };

  const published = site?.counters.publishedPosts ?? 0;
  const wa = whatsappLink(site?.contact ?? { whatsapp: "", whatsappMessage: "", phone: "", hours: "", showPublicCounter: false });
  const logoHeader = site?.media?.brand?.logoHeader || "/logo-mk-preto.png";
  const menuVideo = site?.media?.menuVideo;

  const linkCls = (active: boolean) =>
    `relative whitespace-nowrap text-[14px] xl:text-[15px] font-semibold transition-colors ${active ? "text-[var(--mk-orange-deep)]" : "text-[#3d3730] hover:text-[var(--mk-ink)]"}`;

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${scrolled ? "bg-[var(--mk-paper)]/90 backdrop-blur-md border-b border-[#e3e3e3] shadow-[0_8px_30px_-18px_rgba(10,10,10,0.35)]" : "bg-[var(--mk-paper)] border-b border-transparent"}`}
      role="banner"
    >
      <a href="#conteudo" onClick={(e) => { e.preventDefault(); document.getElementById("conteudo")?.focus(); document.getElementById("conteudo")?.scrollIntoView(); }} className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-[var(--mk-ink)] focus:text-white focus:px-3 focus:py-2 focus:rounded-md text-sm">
        {t("001", "Pular para o conteúdo")}</a>
      <div className="mk-container flex items-center justify-between gap-3 h-16 lg:h-[76px]">
        <button onClick={() => go({ view: "home" })} className="flex items-center gap-2 shrink-0" aria-label={t("002", "Ir para a página inicial da MK Creative")}>
          <img src={logoHeader} alt={t("003", "MK Creative — logo")} className="h-8 lg:h-9 w-auto" width={140} height={53} />
        </button>

        <nav className="hidden lg:flex items-center gap-0 min-w-0" aria-label={t("004", "Navegação principal")}>
          <button onClick={() => go({ view: "home" })} className={`${linkCls(route.view === "home")} px-2.5 xl:px-3.5 py-2.5`}>
            {t("005", "Início")}</button>

          <div
            className="relative"
            onMouseLeave={() => setSolucoesOpen(false)}
          >
            <button
              className={`${linkCls(route.view === "servicos" || route.view === "servico")} px-2.5 xl:px-3.5 py-2.5 flex items-center gap-1`}
              aria-expanded={solucoesOpen}
              aria-haspopup="true"
              onClick={() => setSolucoesOpen(v => !v)}
            >
              {t("006", "Soluções")}</button>
            {solucoesOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50 w-[min(920px,calc(100vw-3rem))]" aria-label={t("007", "Menu de soluções")}>
                <div className="mk-mega shadow-[0_32px_80px_-24px_rgba(10,10,10,0.55)]">
                  {/* Coluna de serviços */}
                  <div className="p-6 grid grid-cols-2 gap-x-7 gap-y-1 content-start">
                    {services.map((s, i) => (
                      <button
                        key={s.slug}
                        onClick={() => go({ view: "servico", slug: s.slug })}
                        className="text-left px-3.5 py-3 rounded-xl hover:bg-white/[0.06] transition-colors group"
                        
                      >
                        <span className="flex items-baseline gap-2.5 mb-1">
                          <span className="text-[11px] font-bold text-white/30 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                          <span className={`text-[13.5px] font-bold leading-tight ${s.accent ? "text-[var(--mk-orange-hot)]" : "text-white group-hover:text-[var(--mk-orange-hot)] transition-colors"}`}>{s.nav}</span>
                        </span>
                        <span className="block text-[11.5px] leading-[1.55] text-white/50 pl-[26px] line-clamp-4">{s.cardText}</span>
                      </button>
                    ))}
                  </div>

                  {/* Card do vídeo — rede própria de mídia indoor */}
                  {menuVideo?.enabled !== false && (
                    <div className="relative bg-[var(--mk-ink-800)] border-l border-white/10 min-h-[420px] overflow-hidden">
                      {menuVideo?.src ? (
                        <video
                          className="absolute inset-0 w-full h-full object-cover"
                          src={menuVideo.src}
                          poster={menuVideo.poster || undefined}
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          aria-label={t("008", "Vídeo da rede de telas MK em operação")}
                          tabIndex={-1}
                        />
                      ) : (
                        <img src={menuVideo?.poster || "/videos/menu-indoor-poster.jpg"} alt={t("009", "Rede de telas MK")} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--mk-ink)] via-[var(--mk-ink)]/25 to-transparent" aria-hidden />
                      <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/45 backdrop-blur-sm border border-white/15 rounded-full px-2.5 py-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--mk-signal)] anim-blink" aria-hidden />
                        <span className="text-[9px] font-bold uppercase tracking-wider text-white/85">{t("010", "Rede própria · ao vivo nas telas")}</span>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 p-5">
                        <p className="text-kicker text-[var(--mk-orange-hot)] mb-1">{menuVideo?.kicker || "Rede própria"}</p>
                        <p className="font-display font-bold text-xl text-white leading-tight">{menuVideo?.title || "Mídia Indoor"}</p>
                        <p className="text-xs text-white/60 mt-1 mb-3.5">{menuVideo?.subtitle || "Telas em 4 cidades da região"}</p>
                        <Button
                          size="sm"
                          onClick={() => go({ view: "midia-indoor" })}
                          className="w-full bg-[var(--mk-orange)] hover:bg-[var(--mk-orange-deep)] text-white font-bold rounded-full h-9 gap-1.5"
                        >
                          {menuVideo?.ctaLabel || "Quero anunciar nas telas"}
                          <ArrowRight className="w-3.5 h-3.5" aria-hidden />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <button onClick={() => go({ view: "midia-indoor" })} className={`${linkCls(route.view === "midia-indoor")} px-2.5 xl:px-3.5 py-2.5 flex items-center gap-1.5`}>
            {t("011", "Mídia Indoor")}<span className="hidden xl:inline text-[9px] font-bold uppercase tracking-wide bg-[var(--mk-signal)] text-[var(--mk-ink)] px-1.5 py-0.5 rounded">{t("012", "Rede própria")}</span>
          </button>
          {published > 0 && (
            <button onClick={() => go({ view: "blog" })} className={`${linkCls(route.view === "blog" || route.view === "artigo")} px-2.5 xl:px-3.5 py-2.5`}>
              {t("013", "Conteúdos")}</button>
          )}
          <button onClick={() => go({ view: "sobre" })} className={`${linkCls(route.view === "sobre")} px-2.5 xl:px-3.5 py-2.5`}>
            {t("014", "A MK")}</button>
        </nav>

        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <button onClick={() => go({ view: "contato" })} className="link-underline text-[14px] xl:text-[15px] font-semibold text-[#3d3730] hover:text-[var(--mk-ink)] px-2.5 py-2 whitespace-nowrap">
            {t("015", "Pedir proposta")}</button>
          {wa ? <WhatsAppButton size="sm" className="hidden sm:inline" /> : (
            <Button size="sm" onClick={() => go({ view: "contato" })} className="bg-[var(--mk-ink)] hover:bg-[var(--mk-ink-800)] text-white rounded-full px-5">
              {t("016", "Falar com a MK")}</Button>
          )}
        </div>

        <button
          className="lg:hidden p-2 -mr-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
          onClick={() => setOpen(!open)}
          ref={mobileToggle}
          aria-controls="mk-mobile-navigation"
          aria-expanded={open}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* menu mobile */}
      {open && (
        <div className="lg:hidden border-t border-[#e3e3e3] bg-[var(--mk-paper)] absolute w-full" id="mk-mobile-navigation">
          <nav className="px-4 py-4 flex flex-col gap-1 max-h-[calc(100dvh-82px)] overflow-y-auto" aria-label={t("017", "Menu mobile")}>
            <button onClick={() => go({ view: "home" })} className="text-left px-3 py-3 rounded-lg font-bold text-[var(--mk-ink)] hover:bg-[var(--mk-sand)]">{t("018", "Início")}</button>
            <button onClick={() => go({ view: "servicos" })} className="text-left px-3 py-3 rounded-lg font-bold text-[var(--mk-ink)] hover:bg-[var(--mk-sand)]">{t("019", "Soluções")}</button>
            {services.map((s) => (
              <button key={s.slug} onClick={() => go({ view: "servico", slug: s.slug })} className="text-left pl-8 pr-3 py-2.5 rounded-lg text-sm text-[#525252] hover:bg-[var(--mk-sand)]">
                {s.nav}
              </button>
            ))}
            <button onClick={() => go({ view: "midia-indoor" })} className="text-left px-3 py-3 rounded-lg font-bold text-[var(--mk-ink)] hover:bg-[var(--mk-sand)] flex items-center gap-2">
              {t("020", "Mídia Indoor")}<span className="text-[10px] font-bold uppercase bg-[var(--mk-signal)] px-1.5 py-0.5 rounded">{t("021", "Rede própria")}</span>
            </button>
            {published > 0 && (
              <button onClick={() => go({ view: "blog" })} className="text-left px-3 py-3 rounded-lg font-bold text-[var(--mk-ink)] hover:bg-[var(--mk-sand)]">{t("022", "Conteúdos")}</button>
            )}
            <button onClick={() => go({ view: "sobre" })} className="text-left px-3 py-3 rounded-lg font-bold text-[var(--mk-ink)] hover:bg-[var(--mk-sand)]">{t("023", "A MK")}</button>
            <div className="pt-3 pb-2 flex flex-col gap-2">
              <Button onClick={() => go({ view: "contato" })} className="w-full bg-[var(--mk-ink)] hover:bg-[var(--mk-ink-800)] text-white rounded-full h-11">
                {t("024", "Pedir proposta")}</Button>
              {wa && (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => { track("whatsapp_click", "menu-mobile"); setOpen(false); }}
                  className="w-full bg-[#157c3a] hover:bg-[#116630] text-white rounded-full min-h-11 flex items-center justify-center gap-2 font-semibold"
                >
                    <MessageCircle className="w-4 h-4" /> {t("025", "Falar no WhatsApp")}</a>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

// ───────────────────────── Contador público de visitas (rodapé) ─────────────────────────
export function PublicCounter() {
  const t = useCopy("navegacao");
  const { site } = useSite();
  if (!site?.contact.showPublicCounter) return null;
  const c = site.counters;
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/60" role="status" aria-label={t("026", "Contador de visitas do site")}>
      <span className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2" aria-hidden>
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff893f] opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f3640a]" />
        </span>
        <strong className="text-white/85">{c.onlineNow}</strong> {t("027", "online agora")}</span>
      <span className="flex items-center gap-1.5">
        <Eye className="w-3.5 h-3.5" aria-hidden />
        <strong className="text-white/85">{c.totalPageviews.toLocaleString("pt-BR")}</strong> {t("028", "visitas no site")}</span>
    </div>
  );
}

// ───────────────────────── Footer ─────────────────────────
export function SiteFooter() {
  const t = useCopy("navegacao");
  const { site, navigate, services } = useSite();
  const inst = site!.institution;
  const contact = site!.contact;
  const social = site!.social;
  const logoFooter = site?.media?.brand?.logoFooter || "/logo-mk-branco.png";

  return (
    <footer className="mt-auto mk-dark mk-noise relative z-10" role="contentinfo">
      <div className="mk-container pt-16 pb-10 lg:pt-20">
        {/* linha editorial de topo */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-12 border-b border-white/10">
          <div className="max-w-2xl">
            <img src={logoFooter} alt={t("029", "MK Creative — logo")} className="h-10 w-auto mb-6" width={140} height={53} loading="lazy" />
            <p className="text-display-sm text-white">
              {t("030", "Do Google")}<span className="text-[var(--mk-orange-hot)]">{t("031", "à fachada")}</span>.<br />
              {t("032", "Da tela do celular")}<span className="text-[var(--mk-orange-hot)]">{t("033", "à tela da loja")}</span>.
            </p>
          </div>
          <div className="shrink-0">
            <PublicCounter />
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1.2fr] py-12">
          <nav aria-label={t("034", "Serviços no rodapé")}>
            <h2 className="text-kicker text-white/40 mb-5">{t("035", "Soluções")}</h2>
            <ul className="space-y-3 text-[15px]">
              {services.map((s) => (
                <li key={s.slug}>
                  <button onClick={() => navigate({ view: "servico", slug: s.slug })} className="link-underline text-white/75 hover:text-white transition-colors text-left">
                    {s.nav}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t("036", "Navegação do site")}>
            <h2 className="text-kicker text-white/40 mb-5">{t("037", "Site")}</h2>
            <ul className="space-y-3 text-[15px]">
              <li><button onClick={() => navigate({ view: "home" })} className="link-underline text-white/75 hover:text-white transition-colors">{t("038", "Início")}</button></li>
              <li><button onClick={() => navigate({ view: "midia-indoor" })} className="link-underline text-white/75 hover:text-white transition-colors">{t("039", "Mídia Indoor")}</button></li>
              {(site!.counters.publishedPosts ?? 0) > 0 && <li><button onClick={() => navigate({ view: "blog" })} className="link-underline text-white/75 hover:text-white transition-colors">{t("040", "Conteúdos")}</button></li>}
              <li><button onClick={() => navigate({ view: "sobre" })} className="link-underline text-white/75 hover:text-white transition-colors">{t("041", "A MK")}</button></li>
              <li><button onClick={() => navigate({ view: "contato" })} className="link-underline text-white/75 hover:text-white transition-colors">{t("042", "Contato")}</button></li>
              <li><button onClick={() => navigate({ view: "privacidade" })} className="link-underline text-white/75 hover:text-white transition-colors">{t("043", "Privacidade")}</button></li>
              <li><button onClick={() => navigate({ view: "termos" })} className="link-underline text-white/75 hover:text-white transition-colors">{t("044", "Termos de Uso")}</button></li>
            </ul>
          </nav>

          <div>
            <h2 className="text-kicker text-white/40 mb-5">{t("045", "Contato")}</h2>
            <address className="not-italic space-y-3 text-[15px]">
              <p className="text-white/75">{inst.addressStreet} — {inst.addressDistrict}</p>
              <p className="text-white/75">{inst.addressCity}/{inst.addressState}</p>
              <p><a href={`mailto:${inst.email}`} className="link-underline text-white/75 hover:text-white transition-colors break-all">{inst.email}</a></p>
              {contact.whatsapp && (
                <p className="pt-1">
                  <a
                    href={whatsappLink(contact)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-semibold text-[#ff893f] hover:underline"
                  >
                    <MessageCircle className="w-4 h-4" aria-hidden /> {t("046", "WhatsApp comercial")}</a>
                </p>
              )}
              {contact.hours && <p className="text-white/50 text-sm">{contact.hours}</p>}
            </address>
            {(social.instagram || social.facebook || social.linkedin || social.youtube) && (
              <div className="flex gap-4 pt-5">
                {social.instagram && <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold uppercase tracking-wide link-underline text-white/70 hover:text-white">{t("047", "Instagram")}</a>}
                {social.facebook && <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold uppercase tracking-wide link-underline text-white/70 hover:text-white">{t("048", "Facebook")}</a>}
                {social.linkedin && <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold uppercase tracking-wide link-underline text-white/70 hover:text-white">{t("049", "LinkedIn")}</a>}
                {social.youtube && <a href={social.youtube} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold uppercase tracking-wide link-underline text-white/70 hover:text-white">{t("050", "YouTube")}</a>}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between gap-6">
            <p className="text-sm leading-relaxed text-white/55 max-w-xs">
              {t("051", "Agência de marketing com rede própria de mídia indoor. Presença digital e física que trabalha junta — em São José do Rio Preto e região.")}</p>
            <button
              onClick={() => navigate({ view: "contato" })}
              className="group inline-flex items-center gap-2 self-start text-lg font-display font-bold text-white"
            >
              {t("052", "Começar um projeto")}<span className="w-10 h-10 rounded-full bg-[var(--mk-orange)] flex items-center justify-center transition-transform duration-300 group-hover:rotate-45 motion-reduce:transition-none">
                <ArrowUpRight className="w-5 h-5 text-white" aria-hidden />
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mk-container py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>{inst.legalName} {t("053", " · CNPJ ")}{inst.cnpj}</p>
          <p>© {new Date().getFullYear()} {inst.brandName} {t("054", " · Todos os direitos reservados")}</p>
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent("mk:open-cookie"));
            }}
            className="flex items-center gap-1.5 hover:text-white transition-colors font-medium"
          >
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden /> {t("055", "Gerenciar cookies")}</button>
        </div>
      </div>
    </footer>
  );
}

// ───────────────────────── WhatsApp flutuante ─────────────────────────
export function WhatsAppFloat() {
  const t = useCopy("navegacao");
  const { site, track, services } = useSite();
  const href = whatsappLink(site?.contact ?? { whatsapp: "", whatsappMessage: "", phone: "", hours: "", showPublicCounter: false });
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("whatsapp_click", "float")}
      className={`fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-[#f3640a] hover:bg-[#c74a00] shadow-[0_10px_30px_-8px_rgba(37,211,102,0.6)] items-center justify-center transition-all duration-300 hover:scale-105 motion-reduce:transition-none ${visible ? "flex opacity-100 translate-y-0" : "flex opacity-0 translate-y-4 pointer-events-none"}`}
      aria-label={t("056", "Falar no WhatsApp com a MK Creative")}
    >
      <MessageCircle className="w-7 h-7 text-white" aria-hidden />
    </a>
  );
}

// ───────────────────────── Banner de cookies (LGPD) ─────────────────────────
export function CookieBanner() {
  const t = useCopy("navegacao");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("mk-cookie-consent");
    if (!consent) {
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    const onOpen = () => setVisible(true);
    window.addEventListener("mk:open-cookie", onOpen);
    return () => window.removeEventListener("mk:open-cookie", onOpen);
  }, []);

  const decide = async (accepted: boolean) => {
    localStorage.setItem("mk-cookie-consent", accepted ? "all" : "necessary");
    setVisible(false);
    window.dispatchEvent(new Event("mk:consent"));
    await fetch("/api/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statistics: accepted, marketing: accepted }),
    }).catch(() => {});
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-5" role="dialog" aria-label={t("057", "Preferências de cookies")} aria-modal="false">
      <div className="max-w-3xl mx-auto bg-[var(--mk-ink)] text-white rounded-2xl shadow-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 border border-white/10">
        <div className="flex items-start gap-3 flex-1">
          <PlayMark className="w-8 h-8 shrink-0 hidden sm:block" />
          <p className="text-sm text-white/80 leading-relaxed">
            {t("058", "Usamos cookies essenciais para o site funcionar e um contador de visitas")}<strong className="text-white">{t("059", "anônimo")}</strong> {t("060", "(compatível com LGPD, sem dados pessoais). Aceita os cookies de estatística para nos ajudar a melhorar?")}</p>
        </div>
        <div className="flex gap-2 shrink-0 w-full sm:w-auto">
          <Button variant="outline" onClick={() => decide(false)} className="flex-1 sm:flex-none bg-transparent border-white/25 text-white hover:bg-white/10 rounded-full">
            {t("061", "Só essenciais")}</Button>
          <Button onClick={() => decide(true)} className="flex-1 sm:flex-none bg-[var(--mk-orange)] hover:bg-[var(--mk-orange-deep)] text-white rounded-full">
            {t("062", "Aceitar todos")}</Button>
        </div>
      </div>
    </div>
  );
}
