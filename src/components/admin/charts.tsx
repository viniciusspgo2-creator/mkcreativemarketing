"use client";

// Gráficos SVG leves e on-brand (sem libs externas)
import { useMemo } from "react";

export type Point = { day: string; visits: number; pageviews: number };

// ── Área/linha suave ──
export function AreaChart({ data, height = 200, color = "var(--mk-orange)" }: { data: Point[]; height?: number; color?: string }) {
  const { path, area, max, w } = useMemo(() => {
    const w = 700;
    const h = height;
    const pad = 8;
    const max = Math.max(1, ...data.map((d) => Math.max(d.visits, d.pageviews)));
    const step = data.length > 1 ? (w - pad * 2) / (data.length - 1) : 0;
    const y = (v: number) => h - pad - (v / max) * (h - pad * 2 - 12);
    const pt = (arr: number[]) => arr.map((v, i) => `${pad + i * step},${y(v).toFixed(1)}`).join(" L ");
    const visitsPath = `M ${pt(data.map((d) => d.visits))}`;
    const pageviewsPath = `M ${pt(data.map((d) => d.pageviews))}`;
    const area = `${visitsPath} L ${pad + (data.length - 1) * step},${h - pad} L ${pad},${h - pad} Z`;
    return { path: visitsPath, pageviewsPath, area, max, w };
  }, [data, height]);

  if (!data.length) return <div className="h-40 flex items-center justify-center text-sm text-[#a89e94]">Sem dados ainda.</div>;

  return (
    <figure role="img" aria-label={`Visitas por dia nos últimos ${data.length} dias. Máximo: ${max} visitas em um dia.`}>
      <svg viewBox={`0 0 ${w} ${height}`} className="w-full" style={{ height }} preserveAspectRatio="none">
        <defs>
          <linearGradient id="mk-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {/* grid */}
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1="8" x2={w - 8} y1={height * f} y2={height * f} stroke="#e3e3e3" strokeWidth="1" strokeDasharray="3 5" />
        ))}
        <path d={area} fill="url(#mk-area)" />
        <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <figcaption className="flex items-center gap-4 mt-2 text-[11px] text-[#a89e94] font-medium">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} aria-hidden /> Visitas únicas</span>
        <span>Período: {data[0]?.day.slice(8)}/{data[0]?.day.slice(5, 7)} → {data[data.length - 1]?.day.slice(8)}/{data[data.length - 1]?.day.slice(5, 7)}</span>
      </figcaption>
    </figure>
  );
}

// ── Donut ──
export function Donut({ items, size = 150 }: { items: { label: string; value: number; color: string }[]; size?: number }) {
  const total = items.reduce((s, i) => s + i.value, 0);
  if (!total) return <div className="h-36 flex items-center justify-center text-sm text-[#a89e94]">Sem dados ainda.</div>;
  const r = 54;
  const c = 2 * Math.PI * r;
  const arcs: { key: string; dash: string; offset: number; color: string }[] = [];
  let acc = 0;
  for (const item of items) {
    const frac = item.value / total;
    arcs.push({ key: item.label, dash: `${frac * c} ${c}`, offset: -acc * c, color: item.color });
    acc += frac;
  }

  return (
    <div className="flex items-center gap-5">
      <svg viewBox="0 0 140 140" width={size} height={size} role="img" aria-label="Distribuição por categoria">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#EFE9E2" strokeWidth="16" />
        {arcs.map((a) => (
          <circle
            key={a.key}
            cx="70" cy="70" r={r} fill="none"
            stroke={a.color}
            strokeWidth="16"
            strokeDasharray={a.dash}
            strokeDashoffset={a.offset}
            transform="rotate(-90 70 70)"
            strokeLinecap="butt"
          />
        ))}
        <text x="70" y="66" textAnchor="middle" className="fill-[var(--mk-ink)] font-bold" style={{ fontSize: 22 }}>{total.toLocaleString("pt-BR")}</text>
        <text x="70" y="84" textAnchor="middle" className="fill-[#a89e94]" style={{ fontSize: 10 }}>total</text>
      </svg>
      <ul className="space-y-2 text-sm" aria-hidden={false}>
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: item.color }} aria-hidden />
            <span className="text-[#3d3730] font-medium capitalize">{item.label}</span>
            <span className="text-[#a89e94] text-xs ml-auto pl-3">{Math.round((item.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Barras horizontais ──
export function BarList({ items, unit = "visitas", color = "var(--mk-orange)" }: { items: { label: string; value: number }[]; unit?: string; color?: string }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  if (!items.length) return <div className="h-32 flex items-center justify-center text-sm text-[#a89e94]">Sem dados ainda.</div>;
  return (
    <ul className="space-y-3" role="list" aria-label={`Top itens por ${unit}`}>
      {items.map((item) => (
        <li key={item.label}>
          <div className="flex items-center justify-between text-sm mb-1 gap-3">
            <span className="text-[#3d3730] font-medium truncate">{item.label}</span>
            <span className="text-[#a89e94] text-xs shrink-0">{item.value.toLocaleString("pt-BR")} {unit}</span>
          </div>
          <div className="h-2 rounded-full bg-[var(--mk-sand)] overflow-hidden" role="presentation">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(item.value / max) * 100}%`, background: color }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
