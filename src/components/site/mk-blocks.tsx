"use client";

import { useCopy } from "@/components/site/use-copy";

// ─────────────────────────────────────────────────────────────
// Blocos editoriais do redesign: mapa interativo da rede,
// contadores, player com moldura sofisticada (facade), mockup de
// Perfil da Empresa no Google e bloco antes/depois.
// ─────────────────────────────────────────────────────────────
import { SilentVideo } from "./silent-video";
import { useEffect, useMemo, useState } from "react";
import { parseVideoUrl } from "@/lib/video";
import { AnimatedCounter, Reveal } from "@/components/site/site-chrome";
import { MapPin, Play, Star, Navigation, Phone, Globe, Clock, Check, X } from "lucide-react";

// ───────────────────────── Mapa interativo da rede ─────────────────────────
export type MapCity = { id: string; name: string; slug: string; lat: number; lng: number; description: string | null };

export function NetworkMap({ cities, note }: { cities: MapCity[]; note?: string }) {
  const t = useCopy("componentes");
  const [active, setActive] = useState<string | null>(null);
  const W = 900;
  const H = 560;
  const PAD = 70;

  const projected = useMemo(() => {
    if (!cities.length) return [];
    const lats = cities.map((c) => c.lat);
    const lngs = cities.map((c) => c.lng);
    const minLat = Math.min(...lats), maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
    const spanLat = maxLat - minLat || 1;
    const spanLng = maxLng - minLng || 1;
    return cities.map((c) => ({
      ...c,
      x: PAD + ((c.lng - minLng) / spanLng) * (W - PAD * 2),
      y: PAD * 0.6 + ((maxLat - c.lat) / spanLat) * (H - PAD * 1.4),
    }));
  }, [cities]);

  const hq = projected.find((c) => c.slug === "sao-jose-do-rio-preto") ?? projected[0];
  const activeCity = projected.find((c) => c.id === active) ?? null;

  if (!projected.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center text-white/60 text-sm">
        {t("001", "O mapa da rede será publicado em breve — fale com a MK para saber a disponibilidade na sua cidade.")}</div>
    );
  }

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto select-none"
        role="img"
        aria-label={`Mapa da rede de telas: ${cities.map((c) => c.name).join(", ")}`}
        onMouseLeave={() => setActive(null)}
      >
        <defs>
          <radialGradient id="mk-map-glow" cx="50%" cy="45%" r="65%">
            <stop offset="0%" stopColor="rgba(243,100,10,0.16)" />
            <stop offset="60%" stopColor="rgba(243,100,10,0.05)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill="transparent" />
        <rect width={W} height={H} fill="url(#mk-map-glow)" />

        {/* malha de fundo */}
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={(H / 7) * i + 20} x2={W} y2={(H / 7) * i + 20} stroke="rgba(255,255,255,0.045)" strokeWidth={1} />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={`v${i}`} x1={(W / 10) * i + 30} y1={0} x2={(W / 10) * i + 30} y2={H} stroke="rgba(255,255,255,0.045)" strokeWidth={1} />
        ))}

        {/* conexões a partir da sede */}
        {hq && projected.filter((c) => c.id !== hq.id).map((c) => (
          <line
            key={`l-${c.id}`}
            x1={hq.x} y1={hq.y} x2={c.x} y2={c.y}
            stroke={active === c.id || active === hq.id ? "rgba(243,100,10,0.75)" : "rgba(255,255,255,0.14)"}
            strokeWidth={active === c.id ? 2 : 1.2}
            strokeDasharray="3 7"
            style={{ transition: "stroke 0.3s ease, stroke-width 0.3s ease" }}
          />
        ))}

        {/* cidades */}
        {projected.map((c) => {
          const isActive = active === c.id;
          const isHq = hq && c.id === hq.id;
          return (
            <g
              key={c.id}
              className="mk-map-dot"
              data-active={isActive}
              tabIndex={0}
              role="button"
              aria-label={`${c.name}: ${c.description ?? "cidade atendida pela rede"}`}
              onMouseEnter={() => setActive(c.id)}
              onFocus={() => setActive(c.id)}
              onClick={() => setActive(isActive ? null : c.id)}
              onBlur={() => setActive(null)}
            >
              {isHq && <circle cx={c.x} cy={c.y} r={22} fill="rgba(243,100,10,0.18)" className="anim-pulse-dot" />}
              <circle cx={c.x} cy={c.y} r={isActive ? 13 : 10} fill={isHq ? "#F3640A" : isActive ? "#FF7A1A" : "#141414"} stroke="#F3640A" strokeWidth={2.5} style={{ transition: "r 0.25s ease, fill 0.25s ease" }} />
              {isHq && <circle cx={c.x} cy={c.y} r={3.5} fill="#fff" />}
              <text
                x={c.x} y={c.y + (isHq ? 40 : 34)}
                textAnchor="middle"
                fill={isActive ? "#FFD9C0" : "rgba(255,255,255,0.72)"}
                fontSize={isActive ? 15 : 13}
                fontWeight={isActive ? 700 : 600}
                fontFamily="var(--font-inter), sans-serif"
                style={{ transition: "fill 0.25s ease" }}
              >
                {c.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* tooltip */}
      <div
        aria-live="polite"
        className={`min-h-[86px] mt-2 rounded-xl border transition-all duration-300 ${activeCity ? "border-[var(--mk-orange)]/40 bg-[var(--mk-ink-800)]" : "border-white/10 bg-white/[0.03]"}`}
      >
        {activeCity ? (
          <div className="p-4 sm:p-5">
            <p className="flex items-center gap-2 text-kicker text-[var(--mk-orange-hot)] mb-1.5">
              <MapPin className="w-3.5 h-3.5" aria-hidden />
              {activeCity.name}{hq && activeCity.id === hq.id ? " · sede da MK" : ""}
            </p>
            <p className="text-sm text-white/70 leading-relaxed">
              {activeCity.description ?? "Telas em estabelecimentos comerciais da cidade."}
            </p>
          </div>
        ) : (
          <div className="p-4 sm:p-5">
            <p className="text-sm text-white/50">{note ?? "Passe o cursor (ou toque) nas cidades para ver os detalhes de cada ponto da rede."}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ───────────────────────── Contadores da rede ─────────────────────────
export function StatsRow({ items, dark = false }: { items: { value: number; suffix: string; label: string }[]; dark?: boolean }) {
  if (!items.length) return null;
  const n = Math.min(items.length, 3);
  const cols = n === 1 ? "sm:grid-cols-1" : n === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3";
  return (
    <dl className={`grid grid-cols-1 ${cols} gap-px ${dark ? "bg-white/10" : "bg-[#e3e3e3]"} border ${dark ? "border-white/10" : "border-[#e3e3e3]"} rounded-2xl overflow-hidden`}>
      {items.slice(0, 3).map((s, i) => (
        <div key={i} className={`${dark ? "bg-[var(--mk-ink)]" : "bg-white"} p-6 sm:p-8`}>
          <dd className={`font-display font-bold tracking-tight leading-none ${dark ? "text-white" : "text-[var(--mk-ink)]"} ${i === 0 ? "text-6xl sm:text-7xl" : "text-5xl sm:text-6xl"} mb-3`}>
            <AnimatedCounter value={s.value} suffix={s.suffix} />
          </dd>
          <dt className={`text-sm leading-snug ${dark ? "text-white/60" : "text-[#525252]"}`}>{s.label}</dt>
        </div>
      ))}
    </dl>
  );
}

// ───────────────────────── Player com moldura sofisticada (facade) ─────────────────────────
// O iframe só carrega quando a pessoa clica — performance e privacidade.
export function VideoFrame({
  videoUrl,
  poster,
  title,
  ratio = "16/9",
  badge,
  className = "",
  autoPlay = false,
}: {
  autoPlay?: boolean;
  videoUrl: string;
  poster?: string | null;
  title: string;
  ratio?: "16/9" | "9/16" | "4/3";
  badge?: string;
  className?: string;
}) {
  const t = useCopy("componentes");
  const [playing, setPlaying] = useState(autoPlay);
  const info = useMemo(() => parseVideoUrl(videoUrl), [videoUrl]);
  const embed = info?.embedUrl ?? "";
  const aspect = ratio === "9/16" ? "aspect-[9/16]" : ratio === "4/3" ? "aspect-[4/3]" : "aspect-video";

  return (
    <figure className={`mk-frame ${className}`}>
      <div className={`mk-frame-media mk-screen relative ${aspect} bg-black overflow-hidden`}>
        {playing && embed ? (
          <SilentVideo url={videoUrl} title={title} />
        ) : (
          <button
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 w-full h-full text-left"
            aria-label={`Reproduzir vídeo: ${title}`}
          >
            {poster ? (
              <img src={poster} alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none" loading="lazy" />
            ) : (
              <span className="absolute inset-0 bg-gradient-to-br from-[#1c1c1c] to-black" aria-hidden />
            )}
            <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" aria-hidden />
            {badge && (
              <span className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm border border-white/15 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white/85">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--mk-signal)] anim-blink" aria-hidden />
                {badge}
              </span>
            )}
            <span className="absolute inset-0 flex items-center justify-center" aria-hidden>
              <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[var(--mk-orange)] flex items-center justify-center shadow-[0_16px_40px_-10px_rgba(243,100,10,0.8)] transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none">
                <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white ml-1" fill="currentColor" />
              </span>
            </span>
            <figcaption className="absolute bottom-0 inset-x-0 p-4 sm:p-5 z-10">
              <span className="block font-display font-bold text-white text-base sm:text-lg leading-tight">{title}</span>
              <span className="mt-1 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-white/60 font-semibold">
                <span className="w-6 h-[2px] bg-[var(--mk-orange)] inline-block" aria-hidden /> {t("002", "MK · em exibição na rede")}</span>
            </figcaption>
          </button>
        )}
      </div>
    </figure>
  );
}

// ───────────────────────── Mockup do Perfil da Empresa no Google ─────────────────────────
export function GbpMockup({ photos = [] }: { photos?: string[] }) {
  const t = useCopy("componentes");
  const shots = photos.slice(0, 4);
  while (shots.length < 4) shots.push("/og-mk-creative.jpg");
  return (
    <div className="relative" aria-label={t("003", "Exemplo ilustrativo de um Perfil da Empresa no Google bem cuidado")}>
      <span className="absolute -top-3 left-4 z-10 text-[10px] font-bold uppercase tracking-wider bg-[var(--mk-ink)] text-white/80 px-2.5 py-1 rounded-full border border-white/15">
        {t("004", "Exemplo ilustrativo")}</span>
      <div className="rounded-2xl bg-white border border-[#e3e3e3] shadow-[0_30px_70px_-30px_rgba(10,10,10,0.35)] overflow-hidden">
        {/* barra de busca */}
        <div className="flex items-center gap-3 px-4 sm:px-5 py-3.5 border-b border-[#eee7de]">
          <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 0 0 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <p className="flex-1 text-sm text-[#525252] truncate">{t("005", "sua empresa em São José do Rio Preto")}</p>
          <span className="w-7 h-7 rounded-full bg-[var(--mk-sand)] flex items-center justify-center shrink-0" aria-hidden>
            <Navigation className="w-3.5 h-3.5 text-[#525252]" />
          </span>
        </div>
        {/* capa + avatar */}
        <div className="relative">
          <div className="h-24 sm:h-28 bg-gradient-to-r from-[#2b2620] via-[#443e37] to-[var(--mk-ink)]" aria-hidden />
          <div className="px-4 sm:px-5 pb-5">
            <div className="flex items-end gap-3 -mt-8 sm:-mt-9 mb-3">
              <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center shrink-0" aria-hidden>
                <span className="font-display font-bold text-2xl text-[var(--mk-orange)]">{t("006", "MK")}</span>
              </span>
              <div className="pb-1 min-w-0">
                <p className="font-display font-bold text-lg sm:text-xl text-[#202124] leading-tight truncate">{t("007", "Sua Empresa")}</p>
                <p className="text-xs text-[#525252] truncate">{t("008", "Empresa local · Sua cidade, SP")}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mb-3">
              <span className="flex" aria-hidden>
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="w-4 h-4 text-[#FBBC05]" fill="currentColor" />
                ))}
              </span>
              <span className="text-xs text-[#525252] font-semibold">{t("009", "Avaliações respondidas · perfil ativo")}</span>
            </div>
            {/* ações */}
            <div className="grid grid-cols-3 gap-2 max-w-xs mb-4">
              {[
                { icon: Phone, label: t("010", "Ligar") },
                { icon: Navigation, label: t("011", "Rota") },
                { icon: Globe, label: t("012", "Site") },
              ].map((a) => (
                <span key={a.label} className="flex flex-col items-center gap-1 py-2.5 rounded-lg border border-[#dadce0] text-[#1a73e8]" aria-hidden>
                  <a.icon className="w-4 h-4" />
                  <span className="text-[11px] font-semibold">{a.label}</span>
                </span>
              ))}
            </div>
            {/* fotos */}
            <div className="grid grid-cols-4 gap-1.5 rounded-xl overflow-hidden mb-3">
              {shots.map((p, i) => (
                <img key={i} src={p} alt={`Foto ${i + 1} do perfil no Google`} className="w-full h-16 sm:h-20 object-cover" loading="lazy" width={220} height={160} />
              ))}
            </div>
            {/* horário */}
            <p className="flex items-center gap-2 text-xs text-[#525252]">
              <Clock className="w-3.5 h-3.5" aria-hidden />
              <span className="text-[#188038] font-bold">{t("013", "Aberto")}</span> {t("014", "· horários sempre atualizados")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────── Bloco Antes / Depois ─────────────────────────
export function BeforeAfter() {
  const t = useCopy("componentes");
  const BEFORE = [
    t("017", "Sem fotos recentes — perfil parado"),
    t("018", "Horário e telefone desatualizados"),
    t("019", "Avaliações sem resposta"),
    t("020", "Informações incompletas ou erradas"),
    t("021", "Concorrente aparece primeiro no mapa"),
  ];
  const AFTER = [
    t("022", "Fotos reais, em ordem e atualizadas"),
    t("023", "Informações comerciais corretas em todos os canais"),
    t("024", "Avaliações acompanhadas com resposta"),
    t("025", "Serviços e produtos bem descritos"),
    t("026", "Presença fortalecida na Pesquisa e no Maps"),
  ];
  
  
  return (
    <div className="grid md:grid-cols-2 gap-5 lg:gap-8">
      <RevealWrapper variant="left">
        <div className="h-full rounded-2xl border border-[#e3e3e3] bg-white p-6 sm:p-8">
          <p className="text-kicker text-[#a89e94] mb-4">{t("015", "Antes · perfil abandonado")}</p>
          <ul className="space-y-3.5">
            {BEFORE.map((t, i) => (
              <li key={i} className="flex gap-3 text-[15px] text-[#6b625a]">
                <span className="w-6 h-6 rounded-md bg-[#f3efe9] text-[#a89e94] flex items-center justify-center shrink-0 mt-0.5" aria-hidden>
                  <X className="w-3.5 h-3.5" />
                </span>
                <span className="line-through decoration-[#d8cfc4]/70 decoration-1">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </RevealWrapper>
      <RevealWrapper variant="right" delay={120}>
        <div className="h-full rounded-2xl bg-[var(--mk-ink)] text-white p-6 sm:p-8 relative overflow-hidden">
          <span className="absolute top-0 right-0 w-40 h-40 bg-[var(--mk-orange)]/20 blur-[70px] rounded-full pointer-events-none" aria-hidden />
          <p className="text-kicker text-[var(--mk-orange-hot)] mb-4 relative">{t("016", "Depois · gestão MK")}</p>
          <ul className="space-y-3.5 relative">
            {AFTER.map((t, i) => (
              <li key={i} className="flex gap-3 text-[15px] text-white/85">
                <span className="w-6 h-6 rounded-md bg-[var(--mk-orange)]/20 text-[var(--mk-orange-hot)] flex items-center justify-center shrink-0 mt-0.5" aria-hidden>
                  <Check className="w-3.5 h-3.5" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </RevealWrapper>
    </div>
  );
}

// wrapper local para não circular imports
function RevealWrapper({ children, variant = "up", delay = 0 }: { children: React.ReactNode; variant?: "up" | "left" | "right" | "mask" | "pop"; delay?: number }) {
  return <Reveal variant={variant} delay={delay}>{children}</Reveal>;
}

// ───────────────────────── Cabeçalho de seção editorial ─────────────────────────
export function SectionHead({
  kicker,
  title,
  lead,
  dark = false,
  index,
  className = "",
}: {
  kicker: string;
  title: React.ReactNode;
  lead?: string;
  dark?: boolean;
  index?: string;
  className?: string;
}) {
  return (
    <Reveal variant="mask" className={`max-w-3xl ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        {index && <span className={`font-mono text-xs font-bold ${dark ? "text-[var(--mk-orange-hot)]" : "text-[var(--mk-orange-deep)]"}`}>{index}</span>}
        <span className={`w-8 h-[2px] ${dark ? "bg-[var(--mk-orange-hot)]" : "bg-[var(--mk-orange)]"}`} aria-hidden />
        <p className={`text-kicker ${dark ? "text-[var(--mk-orange-hot)]" : "text-[var(--mk-orange-deep)]"}`}>{kicker}</p>
      </div>
      <h2 className={`text-display ${dark ? "text-white" : "text-[var(--mk-ink)]"}`}>{title}</h2>
      {lead && <p className={`text-lead mt-5 ${dark ? "text-white/65" : ""}`}>{lead}</p>}
    </Reveal>
  );
}

// ───────────────────────── Lista editorial numerada (hover revela) ─────────────────────────
export function EditorialList({
  items,
  dark = false,
  numbered = true,
}: {
  items: { title: string; text: string }[];
  dark?: boolean;
  numbered?: boolean;
}) {
  return (
    <ol className="list-none">
      {items.map((item, i) => (
        <EditorialRow key={i} index={i} title={item.title} text={item.text} dark={dark} numbered={numbered} />
      ))}
    </ol>
  );
}

function EditorialRow({ index, title, text, dark, numbered }: { index: number; title: string; text: string; dark?: boolean; numbered?: boolean }) {
  return (
    <Reveal
      as="li"
      variant="up"
      delay={Math.min(index * 60, 300)}
      className={`group grid grid-cols-[auto_1fr] sm:grid-cols-[110px_1fr] gap-x-4 sm:gap-x-8 gap-y-1.5 py-6 sm:py-7 border-t ${dark ? "border-white/10" : "border-[#e3e3e3]"} last:border-b transition-colors ${dark ? "hover:bg-white/[0.03]" : "hover:bg-[var(--mk-sand)]/50"}`}
    >
      <span
        aria-hidden
        className={`font-display font-bold leading-none tracking-tight pt-0.5 text-3xl sm:text-[2.6rem] transition-colors duration-300 ${dark ? "text-white/15 group-hover:text-[var(--mk-orange-hot)]" : "text-[var(--mk-sand)] group-hover:text-[var(--mk-orange)]"}`}
        style={{ WebkitTextStroke: dark ? "1px rgba(255,255,255,0.25)" : "1.5px var(--mk-orange)" }}
      >
        {numbered ? String(index + 1).padStart(2, "0") : "—"}
      </span>
      <div>
        <h3 className={`font-display font-bold text-lg sm:text-2xl tracking-tight mb-1.5 ${dark ? "text-white" : "text-[var(--mk-ink)]"}`}>{title}</h3>
        <p className={`text-[15px] leading-relaxed max-w-2xl ${dark ? "text-white/60" : "text-[#525252]"}`}>{text}</p>
      </div>
    </Reveal>
  );
}

// ───────────────────────── CTA editorial ─────────────────────────
export function BigCta({ title, text, action }: { title: React.ReactNode; text: string; action: React.ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
      <Reveal variant="mask" className="max-w-3xl">
        <h2 className="text-display text-white">{title}</h2>
        <p className="text-lead text-white/65 mt-5">{text}</p>
      </Reveal>
      <Reveal variant="up" delay={140} className="shrink-0">
        {action}
      </Reveal>
    </div>
  );
}
