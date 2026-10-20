"use client";

import { useCopy } from "@/components/site/use-copy";

// Blocos compartilhados: FAQ acessível, formulário de lead (LGPD), lightbox, ícone de serviço
import { SilentVideo } from "./silent-video";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useSite } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LEAD_SERVICES } from "@/lib/services";
import { ChevronDown, CheckCircle2, X } from "lucide-react";
import { IconGoogle, IconSocial, IconTarget, IconSite, IconScreen, IconStore } from "@/components/brand/illustrations";

export const SERVICE_ICONS = {
  google: IconGoogle,
  social: IconSocial,
  target: IconTarget,
  site: IconSite,
  screen: IconScreen,
  store: IconStore,
} as const;

export function ServiceIcon({ icon, className = "" }: { icon: keyof typeof SERVICE_ICONS; className?: string }) {
  const Icon = SERVICE_ICONS[icon];
  return <Icon className={className} />;
}

// ── FAQ acessível (accordion nativo) ──
export function Faq({ items, dark = false }: { items: { q: string; a: string }[]; dark?: boolean }) {
  const [open, setOpen] = useState<number | null>(0);
  if (!items.length) return null;
  return (
    <div className={`divide-y ${dark ? "divide-white/10" : "divide-[#e3e3e3]"} border-y ${dark ? "border-white/10" : "border-[#e3e3e3]"}`} role="list">
      {items.map((item, i) => (
        <div key={i} role="listitem">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            className={`w-full flex items-center justify-between gap-4 text-left py-5 min-h-[44px] ${dark ? "text-white" : "text-[var(--mk-ink)]"}`}
          >
            <span className="font-display font-bold text-base sm:text-lg pr-4">{item.q}</span>
            <ChevronDown className={`w-5 h-5 shrink-0 transition-transform duration-300 ${open === i ? "rotate-180 text-[var(--mk-orange)]" : dark ? "text-white/50" : "text-[#a89e94]"}`} aria-hidden />
          </button>
          <div aria-hidden={open !== i} className={`grid transition-all duration-300 ${open === i ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"}`}>
            <div className="overflow-hidden">
              <p className={`text-[15px] leading-relaxed max-w-3xl ${dark ? "text-white/70" : "text-[#525252]"}`}>{item.a}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// JSON-LD FAQPage
export function FaqJsonLd({ items }: { items: { q: string; a: string }[] }) {
  useEffect(() => {
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: items.map((i) => ({
        "@type": "Question",
        name: i.q,
        acceptedAnswer: { "@type": "Answer", text: i.a },
      })),
    });
    document.head.appendChild(el);
    return () => { el.remove(); };
     
  }, [JSON.stringify(items)]);
  return null;
}

// ── Formulário de lead (honeypot + tempo mínimo + LGPD) ──
export function LeadForm({
  service: fixedService,
  source = "site",
  compact = false,
  cityField = false,
  onSuccess,
}: {
  service?: string;
  source?: string;
  compact?: boolean;
  cityField?: boolean;
  onSuccess?: () => void;
}) {
  const t = useCopy("formularios");
  const { route, site, track } = useSite();
  const formId = useId();
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const startedAt = useRef(Date.now());

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: fd.get("name"),
      company: fd.get("company"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      city: fd.get("city"),
      service: fixedService || String(fd.get("service") || "OUTRO"),
      message: fd.get("message"),
      consent: fd.get("consent") === "on",
      website: fd.get("website"),
      elapsedMs: Date.now() - startedAt.current,
      source,
      path: route.view,
    };
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erro ao enviar.");
        setState("error");
        return;
      }
      track("form_submit", payload.service);
      setState("done");
      onSuccess?.();
    } catch {
      setError("Erro de conexão. Tente novamente.");
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-6 sm:p-8 text-center" role="status">
        <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" aria-hidden />
        <h3 className="font-display font-bold text-xl text-[var(--mk-ink)] mb-2">{t("001", "Recebemos sua mensagem!")}</h3>
        <p className="text-[#525252] text-sm mb-5 max-w-md mx-auto">
          {t("002", "Obrigado pelo contato. Nossa equipe responde assim que possível — normalmente em um dia útil.")}</p>
        {site?.contact.whatsapp && (
          <Button onClick={() => setState("idle")} variant="outline" className="rounded-full">
            {t("003", "Enviar outra mensagem")}</Button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate={false}>
      {/* honeypot invisível */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className={`grid gap-4 ${compact ? "sm:grid-cols-2" : "sm:grid-cols-2"}`}>
        <div className="space-y-1.5">
          <Label htmlFor={formId + "-name"}>{t("004", "Nome *")}</Label>
          <Input id={formId + "-name"} name="name" required minLength={2} placeholder={t("005", "Seu nome")} className="h-11" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={formId + "-company"}>{t("006", "Empresa")}</Label>
          <Input id={formId + "-company"} name="company" placeholder={t("007", "Nome da empresa")} className="h-11" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={formId + "-email"}>{t("008", "E-mail *")}</Label>
          <Input id={formId + "-email"} name="email" type="email" required placeholder={t("009", "voce@empresa.com.br")} className="h-11" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={formId + "-phone"}>{t("010", "WhatsApp")}</Label>
          <Input id={formId + "-phone"} name="phone" type="tel" placeholder="(17) 99999-9999" className="h-11" />
        </div>
        {cityField && (
          <div className="space-y-1.5">
            <Label htmlFor={formId + "-city"}>{t("011", "Cidade de interesse")}</Label>
            <Input id={formId + "-city"} name="city" placeholder={t("012", "Ex.: Bady Bassitt")} className="h-11" />
          </div>
        )}
        {!fixedService && (
          <div className="space-y-1.5">
            <Label htmlFor={formId + "-service"}>{t("013", "Serviço de interesse")}</Label>
            <Select name="service" defaultValue="OUTRO">
              <SelectTrigger id={formId + "-service"} className="h-11 w-full">
                <SelectValue placeholder={t("014", "Selecione")} />
              </SelectTrigger>
              <SelectContent>
                {LEAD_SERVICES.map((s) => (
                  <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={formId + "-message"}>{t("015", "Mensagem *")}</Label>
        <Textarea id={formId + "-message"} name="message" required minLength={5} rows={compact ? 3 : 4} placeholder={t("016", "Conte um pouco sobre o seu negócio e o que você precisa.")} className="resize-y" />
      </div>

      <div className="flex items-start gap-2.5">
        <Checkbox id={formId + "-consent"} name="consent" required className="mt-0.5" />
        <Label htmlFor={formId + "-consent"} className="text-xs leading-relaxed text-[#525252] font-normal cursor-pointer">
          {t("017", "Autorizo o uso dos meus dados para contato comercial pela MK Creative, de acordo com a Política de Privacidade (LGPD). *")}</Label>
      </div>

      {error && (
        <p className="text-sm text-red-600 font-medium" role="alert">{error}</p>
      )}

      <Button type="submit" disabled={state === "sending"} className="w-full sm:w-auto h-12 px-8 bg-[var(--mk-orange)] hover:bg-[var(--mk-orange-deep)] text-white font-bold rounded-full">
        {state === "sending" ? "Enviando…" : "Enviar mensagem"}
      </Button>
    </form>
  );
}

// ── Lightbox acessível (galeria — fotos e vídeos YouTube/Vimeo) ──
export function Lightbox({
  items,
  index,
  onClose,
  onIndex,
}: {
  items: { src: string; alt: string; caption?: string; meta?: string; videoUrl?: string | null }[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const t = useCopy("formularios");
  const ref = useRef<HTMLDivElement>(null);

  const next = useCallback(() => onIndex((index! + 1) % items.length), [index, items.length, onIndex]);
  const prev = useCallback(() => onIndex((index! - 1 + items.length) % items.length), [index, items.length, onIndex]);

  const handlers = useRef({ onClose, next, prev });
  // Atualiza os handlers após o commit — nunca durante o render (React Compiler).
  useEffect(() => {
    handlers.current = { onClose, next, prev };
  });
  const isOpen = index !== null;
  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); handlers.current.onClose(); }
      if (e.key === "ArrowRight") { e.preventDefault(); handlers.current.next(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); handlers.current.prev(); }
      if (e.key === "Tab") {
        const nodes = ref.current?.querySelectorAll<HTMLElement>('button, a[href], iframe, [tabindex="0"]');
        if (!nodes?.length) return;
        const first = nodes[0], last = nodes[nodes.length - 1];
        if (e.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    ref.current?.querySelector<HTMLButtonElement>("button")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  if (index === null || !items[index]) return null;
  const item = items[index];

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[60] bg-[var(--mk-ink)]/95 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={item.alt}
      tabIndex={-1}
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label={t("018", "Fechar")}>
        <X className="w-5 h-5" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white min-w-[48px] min-h-[48px] flex items-center justify-center font-bold text-xl z-10"
        aria-label={t("019", "Mídia anterior")}
      >
        ‹
      </button>
      <figure className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
        {item.videoUrl ? (
          <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
            <SilentVideo url={item.videoUrl} title={item.alt} />
          </div>
        ) : (
          <img src={item.src} alt={item.alt} className="max-h-[76vh] w-auto max-w-full mx-auto rounded-xl object-contain" />
        )}
        {(item.caption || item.meta) && (
          <figcaption className="text-center text-white/80 text-sm mt-4 space-y-1">
            <p className="font-semibold">{item.caption}</p>
            {item.meta && <p className="text-white/50 text-xs uppercase tracking-wide">{item.meta}</p>}
          </figcaption>
        )}
      </figure>
      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white min-w-[48px] min-h-[48px] flex items-center justify-center font-bold text-xl z-10"
        aria-label={t("020", "Próxima mídia")}
      >
        ›
      </button>
    </div>
  );
}
