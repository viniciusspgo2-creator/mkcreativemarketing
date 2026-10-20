"use client";

// Dashboard — KPIs, contador de visitas em tempo real, gráficos, pendências
import { useCallback, useEffect, useState } from "react";
import { AreaChart, BarList, Donut } from "@/components/admin/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users, Eye, MousePointerClick, MessageCircle, Zap, TrendingUp, TrendingDown,
  Minus, CircleDot, CheckCircle2, Circle, Smartphone, Monitor, Tablet, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Stats = {
  range: number;
  counters: {
    visitsToday: number; visitsYesterday: number; visits7: number; visits30: number;
    totalVisits: number; totalPageviews: number; onlineNow: number;
    waClicks: number; ctaClicks: number; formSubmits: number; leadsNew: number; leads30: number;
    conversion: number; publishedPosts: number; unreadLeads: number;
  };
  daily: { day: string; visits: number; pageviews: number }[];
  topPaths: { path: string; views: number }[];
  refSources: { source: string; visits: number }[];
  devices: { device: string; visits: number }[];
  browsers: { browser: string; visits: number }[];
  leadsByStatus: { status: string; count: number }[];
};

type Visitors = {
  onlineNow: number; today: number; yesterday: number; totalVisitors: number; totalPageviews: number;
  recent: { id: string; device: string | null; browser: string | null; refSource: string | null; landingPath: string | null; pageviews: number; minutesAgo: number }[];
};

type Task = { id: string; title: string; description: string | null; done: boolean };

const SOURCE_LABELS: Record<string, string> = { direct: "Direto", search: "Buscadores", social: "Redes sociais", referral: "Referência" };
const SOURCE_COLORS: Record<string, string> = { direct: "#0A0A0A", search: "#F3640A", social: "#FF7A1A", referral: "#C2500A" };
const DEVICE_COLORS: Record<string, string> = { desktop: "#0A0A0A", mobile: "#F3640A", tablet: "#FFD23F", outro: "#C2500A" };
const DEVICE_ICONS: Record<string, React.ElementType> = { desktop: Monitor, mobile: Smartphone, tablet: Tablet, outro: CircleDot };

function kpi(n: number | undefined | null) {
  return (n ?? 0).toLocaleString("pt-BR");
}

function Delta({ a, b }: { a: number; b: number }) {
  const diff = a - b;
  const pct = b > 0 ? Math.round((diff / b) * 100) : a > 0 ? 100 : 0;
  if (diff === 0) return <span className="flex items-center gap-1 text-xs text-[#a89e94]"><Minus className="w-3 h-3" /> estável</span>;
  const up = diff > 0;
  return (
    <span className={cn("flex items-center gap-1 text-xs font-semibold", up ? "text-emerald-600" : "text-red-500")}>
      {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {Math.abs(pct)}% vs. ontem
    </span>
  );
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [visitors, setVisitors] = useState<Visitors | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [range, setRange] = useState(30);
  const [loadError, setLoadError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [pulse, setPulse] = useState(false);

  const load = useCallback(async (r: number) => {
    const [s, v] = await Promise.all([
      fetch(`/api/admin/stats?range=${r}`).then((res) => res.json()),
      fetch("/api/admin/visitors").then((res) => res.json()),
    ]);
    setStats(s);
    setVisitors(v);
  }, []);

  const loadTasks = useCallback(async () => {
    try {
      const d = await fetch("/api/admin/tasks").then((r) => r.json());
      setTasks(d.tasks ?? []);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoadError(false);
      try {
        const [s,v]=await Promise.all([fetch(`/api/admin/stats?range=${range}`).then(r=>{if(!r.ok)throw new Error();return r.json();}),fetch("/api/admin/visitors").then(r=>{if(!r.ok)throw new Error();return r.json();})]);
        if(active){setStats(s);setVisitors(v);}
      }catch{if(active)setLoadError(true);}
    })();
    (async () => {
      try {
        const d = await fetch("/api/admin/tasks").then((r) => r.json());
        if (active) setTasks(d.tasks ?? []);
      } catch { /* ignore */ }
    })();
    return () => { active = false; };
  }, [range,retry]);
  void load; void loadTasks;

  // pulso em tempo real (contador online)
  useEffect(() => {
    const t = setInterval(async () => {
      try {
        const v = await fetch("/api/admin/visitors").then((r) => r.json());
        setVisitors(v);
        setPulse(true);
        setTimeout(() => setPulse(false), 500);
      } catch { /* ignore */ }
    }, 20000);
    return () => clearInterval(t);
  }, []);

  const toggleTask = async (task: Task) => {
    setTasks((ts) => ts.map((t) => (t.id === task.id ? { ...t, done: !t.done } : t)));
    await fetch(`/api/admin/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !task.done }),
    }).catch(() => {});
  };

  if(loadError)return <div role="alert" className="border bg-white rounded-lg p-8"><p>Não foi possível carregar as métricas.</p><button className="underline min-h-11 mt-3" onClick={()=>setRetry(v=>v+1)}>Tentar novamente</button></div>;

  if (!stats || !visitors) {
    return (
      <div className="space-y-4" aria-busy="true">
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-white rounded-2xl animate-pulse" />)}
        </div>
        <div className="h-72 bg-white rounded-2xl animate-pulse" />
      </div>
    );
  }

  const c = stats.counters;
  const openTasks = tasks.filter((t) => !t.done);

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Linha 1: contador em tempo real + KPIs principais */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Contador online — destaque */}
        <Card className="bg-[var(--mk-ink)] text-white border-[var(--mk-ink)] rounded-2xl overflow-hidden relative">
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-[var(--mk-orange)]/20 blur-2xl" aria-hidden />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-white/60 flex items-center gap-2">
              <span className={cn("relative flex h-2.5 w-2.5 transition-transform", pulse && "scale-150")} aria-hidden>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f3640a] opacity-60" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#f3640a]" />
              </span>
              Visitantes agora
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-display font-bold text-4xl mb-1" aria-live="polite">{kpi(visitors.onlineNow)}</div>
            <p className="text-xs text-white/45">online nos últimos 5 minutos</p>
          </CardContent>
        </Card>

        <KpiCard
          icon={<Users className="w-4 h-4" />}
          label="Visitas hoje"
          value={kpi(visitors.today)}
          delta={<Delta a={visitors.today} b={visitors.yesterday} />}
        />
        <KpiCard
          icon={<Eye className="w-4 h-4" />}
          label="Visualizações totais"
          value={kpi(stats.counters.totalPageviews)}
          sub={`${kpi(stats.counters.totalVisits)} visitantes únicos`}
        />
        <KpiCard
          icon={<MessageCircle className="w-4 h-4" />}
          label="Cliques no WhatsApp"
          value={kpi(c.waClicks)}
          sub={`últimos ${stats.range} dias`}
          accent
        />
      </div>

      {/* Linha 2: KPIs secundários */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <MiniKpi label="Visitas 7 dias" value={kpi(c.visits7)} />
        <MiniKpi label="Visitas 30 dias" value={kpi(c.visits30)} />
        <MiniKpi label="Novos leads" value={kpi(c.leadsNew)} accent={c.leadsNew > 0} />
        <MiniKpi label="Envios de formulário" value={kpi(c.formSubmits)} />
        <MiniKpi label="Conversão visita → lead" value={`${c.conversion}%`} />
      </div>

      {/* Linha 3: gráfico principal */}
      <Card className="rounded-2xl border-[#e3e3e3]">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="font-display font-bold text-lg flex items-center gap-2">
            <Zap className="w-4.5 h-4.5 text-[var(--mk-orange)]" aria-hidden /> Audiência do site
          </CardTitle>
          <div className="flex gap-1.5" role="tablist" aria-label="Período do gráfico">
            {[7, 30, 90].map((r) => (
              <Button
                key={r}
                size="sm"
                variant={range === r ? "default" : "outline"}
                onClick={() => setRange(r)}
                className={cn("rounded-full text-xs h-8 px-3.5", range === r && "bg-[var(--mk-orange)] hover:bg-[var(--mk-orange-deep)] text-white")}
                role="tab"
                aria-selected={range === r}
              >
                {r} dias
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <AreaChart data={stats.daily} height={220} />
        </CardContent>
      </Card>

      {/* Linha 4: três colunas */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="rounded-2xl border-[#e3e3e3]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-[#525252] uppercase tracking-wide">Origem do tráfego</CardTitle>
          </CardHeader>
          <CardContent>
            <Donut
              items={stats.refSources.map((r) => ({
                label: SOURCE_LABELS[r.source] ?? r.source,
                value: r.visits,
                color: SOURCE_COLORS[r.source] ?? "#a89e94",
              }))}
            />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-[#e3e3e3]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-[#525252] uppercase tracking-wide">Páginas mais vistas</CardTitle>
          </CardHeader>
          <CardContent>
            <BarList
              items={stats.topPaths.map((p) => ({ label: prettyPath(p.path), value: p.views }))}
              unit="views"
            />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-[#e3e3e3]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-[#525252] uppercase tracking-wide">Dispositivos e navegadores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Donut
              size={120}
              items={stats.devices.map((d) => ({
                label: d.device,
                value: d.visits,
                color: DEVICE_COLORS[d.device] ?? "#a89e94",
              }))}
            />
            <BarList items={stats.browsers.map((b) => ({ label: b.browser, value: b.visits }))} unit="sessões" color="#0A0A0A" />
          </CardContent>
        </Card>
      </div>

      {/* Linha 5: visitantes recentes + pendências */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="rounded-2xl border-[#e3e3e3] lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-[#525252] uppercase tracking-wide">Visitas recentes (tempo real)</CardTitle>
          </CardHeader>
          <CardContent>
            {visitors.recent.length === 0 ? (
              <p className="text-sm text-[#a89e94] py-4 text-center">Nenhuma visita registrada ainda. Compartilhe o site para começar a coletar métricas!</p>
            ) : (
              <ul className="divide-y divide-[#e3e3e3]" role="list">
                {visitors.recent.map((r) => {
                  const Icon = DEVICE_ICONS[r.device ?? "outro"] ?? CircleDot;
                  return (
                    <li key={r.id} className="flex items-center gap-3 py-2.5 text-sm">
                      <span className="w-8 h-8 rounded-lg bg-[var(--mk-sand)] flex items-center justify-center text-[var(--mk-orange-deep)] shrink-0">
                        <Icon className="w-4 h-4" aria-hidden />
                      </span>
                      <span className="font-mono text-xs text-[#3d3730] truncate flex-1">{r.landingPath ?? "/#"}</span>
                      <Badge variant="outline" className="text-[10px] shrink-0">{SOURCE_LABELS[r.refSource ?? ""] ?? r.refSource ?? "direto"}</Badge>
                      <span className="text-xs text-[#a89e94] shrink-0">{r.pageviews} pv · há {r.minutesAgo < 1 ? "poucos seg" : `${r.minutesAgo} min`}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-[#e3e3e3]">
          <CardHeader className="pb-3 flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-[#525252] uppercase tracking-wide">Pendências de conteúdo</CardTitle>
            {openTasks.length > 0 && (
              <Badge className="bg-[var(--mk-orange)] text-white text-[10px]">{openTasks.length}</Badge>
            )}
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <p className="text-sm text-[#a89e94] py-2">Nenhuma pendência. Tudo em ordem! 🎉</p>
            ) : (
              <ul className="space-y-1 max-h-64 overflow-y-auto mk-scroll" role="list">
                {tasks.map((t) => (
                  <li key={t.id}>
                    <button
                      onClick={() => toggleTask(t)}
                      className="w-full flex items-start gap-2.5 text-left px-2 py-2 rounded-lg hover:bg-[var(--mk-paper)] transition-colors"
                      aria-pressed={t.done}
                    >
                      {t.done ? (
                        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" aria-hidden />
                      ) : (
                        <Circle className="w-4.5 h-4.5 text-[#c9c0b5] shrink-0 mt-0.5" aria-hidden />
                      )}
                      <span className={cn("text-sm", t.done ? "line-through text-[#a89e94]" : "text-[#3d3730] font-medium")}>{t.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KpiCard({ icon, label, value, sub, delta, accent }: { icon: React.ReactNode; label: string; value: string; sub?: string; delta?: React.ReactNode; accent?: boolean }) {
  return (
    <Card className={cn("rounded-2xl border-[#e3e3e3]", accent && "border-[var(--mk-orange)]/40 bg-orange-50/40")}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-[#525252] flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-[var(--mk-sand)] text-[var(--mk-orange-deep)] flex items-center justify-center">{icon}</span>
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="font-display font-bold text-3xl text-[var(--mk-ink)] mb-1">{value}</div>
        {delta ?? (sub && <p className="text-xs text-[#a89e94]">{sub}</p>)}
      </CardContent>
    </Card>
  );
}

function MiniKpi({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={cn("bg-white border rounded-2xl px-4 py-3.5", accent ? "border-[var(--mk-orange)]/50" : "border-[#e3e3e3]")}>
      <p className="text-[11px] font-semibold text-[#a89e94] uppercase tracking-wide mb-0.5">{label}</p>
      <p className="font-display font-bold text-xl text-[var(--mk-ink)]">{value}</p>
    </div>
  );
}

function prettyPath(path: string): string {
  if (path === "#/" || path === "/" || path === "#") return "Início";
  if (path.startsWith("#/servicos/")) return `Serviço: ${path.replace("#/servicos/", "").replace(/-/g, " ")}`;
  if (path.startsWith("#/blog/")) return `Artigo: ${path.replace("#/blog/", "").replace(/-/g, " ").slice(0, 38)}`;
  const map: Record<string, string> = {
    "#/midia-indoor": "Mídia Indoor",
    "#/blog": "Blog (Conteúdos)",
    "#/sobre": "A MK",
    "#/contato": "Contato",
    "#/servicos": "Soluções",
    "#/privacidade": "Privacidade",
    "#/termos": "Termos",
  };
  return map[path] ?? path.replace("#/", "/").replace(/-/g, " ");
}
