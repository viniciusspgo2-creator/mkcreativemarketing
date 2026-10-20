"use client";

// Leads (CRM), Mídia Indoor (cidades + galeria) e Configurações
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSite } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Field } from "@/components/admin/site-editor";
import {
  Download, Search, MessageCircle, Mail, Trash2, Check, StickyNote, MapPin, Images,
  Save, Loader2, Plus, ShieldCheck, Lock, EyeOff, Video, Image as ImageIcon,
} from "lucide-react";
import { LEAD_SERVICES, LEAD_STATUS, slugify } from "@/lib/services";
import { whatsappLink } from "@/lib/settings";
import { parseVideoUrl } from "@/lib/video";
import { cn } from "@/lib/utils";

// ───────────────────────── LEADS ─────────────────────────

type Lead = {
  id: string; name: string; company: string | null; phone: string | null; email: string;
  service: string; message: string; city: string | null; status: string; source: string;
  originPath: string | null; notes: string | null; read: boolean; consent: boolean;
  createdAt: string; events: { id: string; type: string; content: string | null; createdAt: string }[];
};

export function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Lead | null>(null);

  const load = useCallback(async () => {
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (serviceFilter) params.set("service", serviceFilter);
    if (q) params.set("q", q);
    const d = await fetch(`/api/admin/leads?${params}`).then((r) => r.json());
    setLeads(d.leads ?? []);
    setLoading(false);
  }, [statusFilter, serviceFilter, q]);

  useEffect(() => {
    let active = true;
    (async () => {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (serviceFilter) params.set("service", serviceFilter);
      if (q) params.set("q", q);
      const d = await fetch(`/api/admin/leads?${params}`).then((r) => r.json());
      if (!active) return;
      setLeads(d.leads ?? []);
      setLoading(false);
    })();
    return () => { active = false; };
  }, [statusFilter, serviceFilter, q]);
  void load;

  const setStatus = async (lead: Lead, status: string) => {
    setLeads((ls) => ls.map((l) => (l.id === lead.id ? { ...l, status } : l)));
    await fetch(`/api/admin/leads/${lead.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, read: true }),
    });
  };

  const del = async (id: string) => {
    if (!window.confirm("Excluir este lead?")) return;
    await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
    setSelected(null);
    load();
  };

  return (
    <div className="space-y-5 max-w-[1400px]">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a89e94]" aria-hidden />
          <Input value={q} onChange={(e) => { setLoading(true); setQ(e.target.value); }} placeholder="Buscar nome, e-mail…" className="pl-9 h-10 bg-white" aria-label="Buscar leads" />
        </div>
        <Select value={statusFilter || "all"} onValueChange={(v) => { setLoading(true); setStatusFilter(v === "all" ? "" : v); }}>
          <SelectTrigger className="w-44 h-10 bg-white" aria-label="Status"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            {Object.entries(LEAD_STATUS).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={serviceFilter || "all"} onValueChange={(v) => { setLoading(true); setServiceFilter(v === "all" ? "" : v); }}>
          <SelectTrigger className="w-44 h-10 bg-white" aria-label="Serviço"><SelectValue placeholder="Serviço" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os serviços</SelectItem>
            {LEAD_SERVICES.map((s) => (
              <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <a href="/api/admin/leads/export" download className="ml-auto">
          <Button variant="outline" className="rounded-full gap-1.5 h-10 bg-white">
            <Download className="w-4 h-4" aria-hidden /> Exportar CSV
          </Button>
        </a>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-[#a89e94]">Carregando leads…</div>
      ) : leads.length === 0 ? (
        <Card className="rounded-2xl border-[#e3e3e3]">
          <CardContent className="py-14 text-center">
            <h2 className="font-display font-bold text-lg mb-1">Nenhum lead por aqui</h2>
            <p className="text-sm text-[#525252] max-w-md mx-auto">
              Quando alguém enviar o formulário do site, o contato aparece aqui com status, histórico e atalhos de resposta.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5 items-start">
          <Card className="rounded-2xl border-[#e3e3e3] overflow-hidden">
            <div className="overflow-x-auto mk-scroll max-h-[70vh]">
              <table className="w-full text-sm">
                <thead className="sticky top-0 z-10">
                  <tr className="border-b border-[#e3e3e3] bg-[var(--mk-paper)] text-left">
                    <th className="px-5 py-3 font-bold text-xs uppercase tracking-wide text-[#525252]">Contato</th>
                    <th className="px-4 py-3 font-bold text-xs uppercase tracking-wide text-[#525252] hidden md:table-cell">Serviço</th>
                    <th className="px-4 py-3 font-bold text-xs uppercase tracking-wide text-[#525252]">Status</th>
                    <th className="px-4 py-3 font-bold text-xs uppercase tracking-wide text-[#525252] hidden sm:table-cell">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e3e3e3]">
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className={cn("hover:bg-[var(--mk-paper)]/60 cursor-pointer transition-colors", selected?.id === lead.id && "bg-orange-50/60")}
                      onClick={() => { setSelected(lead); if (!lead.read) markRead(lead); }}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          {!lead.read && <span className="w-2 h-2 rounded-full bg-[var(--mk-orange)] shrink-0" aria-label="Não lido" />}
                          <div>
                            <p className="font-semibold text-[var(--mk-ink)]">{lead.name}</p>
                            <p className="text-xs text-[#a89e94] truncate max-w-[200px]">{lead.email}{lead.company ? ` · ${lead.company}` : ""}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-xs font-semibold text-[#525252]">
                        {LEAD_SERVICES.find((s) => s.key === lead.service)?.label ?? lead.service}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={cn("text-[11px]", LEAD_STATUS[lead.status]?.color)}>{LEAD_STATUS[lead.status]?.label ?? lead.status}</Badge>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell text-xs text-[#a89e94]">
                        {new Date(lead.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {selected ? (
            <LeadDetail lead={selected} onStatus={setStatus} onDelete={del} onRefresh={load} />
          ) : (
            <Card className="rounded-2xl border-[#e3e3e3] border-dashed">
              <CardContent className="py-16 text-center text-sm text-[#a89e94]">
                Selecione um lead para ver os detalhes.
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );

  async function markRead(lead: Lead) {
    setLeads((ls) => ls.map((l) => (l.id === lead.id ? { ...l, read: true } : l)));
    await fetch(`/api/admin/leads/${lead.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
    }).catch(() => {});
  }
}

function LeadDetail({ lead, onStatus, onDelete, onRefresh }: { lead: Lead; onStatus: (l: Lead, s: string) => void; onDelete: (id: string) => void; onRefresh: () => void }) {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState(lead.notes ?? "");

  const waHref = lead.phone ? `https://wa.me/55${lead.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Olá ${lead.name.split(" ")[0]}! Aqui é a MK Creative, recebemos seu contato pelo site.`)}` : null;

  const addNote = async () => {
    if (!note.trim()) return;
    await fetch(`/api/admin/leads/${lead.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newNote: note }),
    });
    setNote("");
    onRefresh();
  };

  const saveNotes = async () => {
    await fetch(`/api/admin/leads/${lead.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    });
  };

  return (
    <Card className="rounded-2xl border-[#e3e3e3] overflow-hidden">
      <CardHeader className="pb-3 flex-row items-start justify-between">
        <div>
          <CardTitle className="font-display font-bold text-lg">{lead.name}</CardTitle>
          <p className="text-xs text-[#a89e94] mt-0.5">
            {new Date(lead.createdAt).toLocaleString("pt-BR")} · origem: {lead.source}{lead.originPath ? ` (${lead.originPath})` : ""}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => onDelete(lead.id)} aria-label="Excluir lead" className="text-red-500 hover:bg-red-50">
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <InfoRow label="E-mail" value={lead.email} href={`mailto:${lead.email}`} icon={<Mail className="w-3.5 h-3.5" />} />
          <InfoRow label="Telefone" value={lead.phone ?? "—"} />
          {lead.company && <InfoRow label="Empresa" value={lead.company} />}
          {lead.city && <InfoRow label="Cidade" value={lead.city} />}
        </div>

        <div className="bg-[var(--mk-paper)] rounded-xl p-3.5 border border-[#e3e3e3]">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#a89e94] mb-1">Mensagem</p>
          <p className="text-sm text-[#3d3730] whitespace-pre-wrap leading-relaxed">{lead.message}</p>
        </div>

        <div className="space-y-1.5">
          <Label className="text-[13px] font-semibold">Status do funil</Label>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Alterar status">
            {Object.entries(LEAD_STATUS).map(([key, meta]) => (
              <button
                key={key}
                onClick={() => onStatus(lead, key)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all min-h-[32px]",
                  lead.status === key ? meta.color : "bg-white border-[#e3e3e3] text-[#a89e94] hover:border-[var(--mk-orange)]"
                )}
                aria-pressed={lead.status === key}
              >
                {meta.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {waHref && (
            <a href={waHref} target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="rounded-full bg-[#f3640a] hover:bg-[#c74a00] text-white gap-1.5">
                <MessageCircle className="w-3.5 h-3.5" aria-hidden /> Responder no WhatsApp
              </Button>
            </a>
          )}
          <a href={`mailto:${lead.email}?subject=${encodeURIComponent("Recebemos seu contato — MK Creative")}`}>
            <Button size="sm" variant="outline" className="rounded-full gap-1.5 bg-white">
              <Mail className="w-3.5 h-3.5" aria-hidden /> Responder por e-mail
            </Button>
          </a>
        </div>

        <div className="space-y-2 border-t border-[#e3e3e3] pt-3">
          <Label htmlFor="lead-note" className="text-[13px] font-semibold flex items-center gap-1.5">
            <StickyNote className="w-3.5 h-3.5 text-[var(--mk-orange)]" aria-hidden /> Nova anotação
          </Label>
          <div className="flex gap-2">
            <Input id="lead-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ex.: ligar quinta às 14h" className="h-9 bg-white" onKeyDown={(e) => e.key === "Enter" && addNote()} />
            <Button size="sm" onClick={addNote} className="rounded-lg bg-[var(--mk-ink)] text-white hover:bg-[var(--mk-ink-800)]">Add</Button>
          </div>
          {lead.events.length > 0 && (
            <ul className="space-y-1.5 pt-2 max-h-36 overflow-y-auto mk-scroll" role="list" aria-label="Histórico">
              {lead.events.map((ev) => (
                <li key={ev.id} className="text-xs text-[#525252] flex gap-2">
                  <span className="text-[#a89e94] shrink-0">{new Date(ev.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}</span>
                  <span>{ev.type === "STATUS_CHANGE" ? "↪ " : "✎ "}{ev.content}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-1.5 border-t border-[#e3e3e3] pt-3">
          <Label htmlFor="lead-notes" className="text-[13px] font-semibold">Observações internas</Label>
          <Textarea id="lead-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Notas gerais sobre o lead…" className="bg-white" />
          <Button size="sm" variant="outline" onClick={saveNotes} className="rounded-full bg-white gap-1.5">
            <Save className="w-3.5 h-3.5" aria-hidden /> Salvar observações
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoRow({ label, value, href, icon }: { label: string; value: string; href?: string; icon?: React.ReactNode }) {
  return (
    <div className="bg-[var(--mk-paper)] rounded-lg px-3 py-2 border border-[#e3e3e3]">
      <p className="text-[10px] font-bold uppercase tracking-wide text-[#a89e94] flex items-center gap-1">{icon} {label}</p>
      {href ? (
        <a href={href} className="text-[13px] font-semibold text-[var(--mk-orange-deep)] hover:underline break-all">{value}</a>
      ) : (
        <p className="text-[13px] font-semibold text-[#3d3730] break-all">{value}</p>
      )}
    </div>
  );
}

// ───────────────────────── MÍDIA INDOOR ─────────────────────────

type CityRow = { id: string; name: string; slug: string; lat: number; lng: number; description: string | null; status: string; order: number; _count?: { points: number; media: number } };
type MediaRow = {
  id: string; kind: string; title: string; caption: string | null; venue: string | null; segment: string | null;
  src: string | null; videoUrl: string | null; poster: string | null; vimeoId: string | null; dateLabel: string | null;
  authorized: boolean; faceVisible: boolean; origin: string; active: boolean; cityId: string | null;
  city: { name: string } | null;
};

export function AdminIndoor() {
  const [cities, setCities] = useState<CityRow[]>([]);
  const [media, setMedia] = useState<MediaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityDialog, setCityDialog] = useState(false);
  const [mediaDialog, setMediaDialog] = useState(false);
  const [editingCity, setEditingCity] = useState<CityRow | null>(null);
  const [editingMedia, setEditingMedia] = useState<MediaRow | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [c, m] = await Promise.all([
      fetch("/api/admin/cities").then((r) => r.json()),
      fetch("/api/admin/indoor").then((r) => r.json()),
    ]);
    setCities(c.cities ?? []);
    setMedia(m.media ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      const [c, m] = await Promise.all([
        fetch("/api/admin/cities").then((r) => r.json()),
        fetch("/api/admin/indoor").then((r) => r.json()),
      ]);
      if (!active) return;
      setCities(c.cities ?? []);
      setMedia(m.media ?? []);
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);
  void load;

  const toggleMedia = async (m: MediaRow, patch: Partial<MediaRow>) => {
    setMedia((ms) => ms.map((x) => (x.id === m.id ? { ...x, ...patch } : x)));
    await fetch(`/api/admin/indoor/${m.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
  };

  const delMedia = async (id: string) => {
    if (!window.confirm("Excluir esta mídia da galeria?")) return;
    await fetch(`/api/admin/indoor/${id}`, { method: "DELETE" });
    load();
  };

  const delCity = async (id: string) => {
    if (!window.confirm("Excluir cidade? As mídias associadas perderão o vínculo.")) return;
    await fetch(`/api/admin/cities/${id}`, { method: "DELETE" });
    load();
  };

  const pending = media.filter((m) => !m.authorized || m.origin === "stock");

  return (
    <div className="space-y-5 max-w-[1400px]">
      <Tabs defaultValue="galeria">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList className="bg-white border border-[#e3e3e3] rounded-full p-1 h-10">
            <TabsTrigger value="galeria" className="rounded-full text-sm px-4 data-[state=active]:bg-[var(--mk-ink)] data-[state=active]:text-white gap-1.5">
              <Images className="w-3.5 h-3.5" aria-hidden /> Galeria da rede
            </TabsTrigger>
            <TabsTrigger value="cidades" className="rounded-full text-sm px-4 data-[state=active]:bg-[var(--mk-ink)] data-[state=active]:text-white gap-1.5">
              <MapPin className="w-3.5 h-3.5" aria-hidden /> Cidades
            </TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-full gap-1.5 h-9 bg-white" onClick={() => { setEditingCity(null); setCityDialog(true); }}>
              <Plus className="w-4 h-4" /> Cidade
            </Button>
            <Button className="rounded-full gap-1.5 h-9 bg-[var(--mk-orange)] hover:bg-[var(--mk-orange-deep)] text-white font-bold" onClick={() => { setEditingMedia(null); setMediaDialog(true); }}>
              <Plus className="w-4 h-4" /> Mídia
            </Button>
          </div>
        </div>

        <TabsContent value="galeria" className="mt-5">
          {pending.length > 0 && (
            <div className="mb-4 bg-amber-50 border border-amber-300 rounded-xl p-3.5 text-sm text-amber-800 flex items-center gap-2">
              <EyeOff className="w-4 h-4 shrink-0" aria-hidden />
              <span><strong>{pending.length} mídia(s)</strong> oculta(s) no site — aguardando confirmação de divulgação ou licença (origem stock).</span>
            </div>
          )}
          {loading ? (
            <div className="p-10 text-center text-sm text-[#a89e94]">Carregando…</div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {media.map((m) => (
                <Card key={m.id} className={cn("rounded-2xl border-[#e3e3e3] overflow-hidden", !m.authorized && "opacity-75")}>
                  <div className="relative h-40 bg-[var(--mk-sand)]">
                    {m.kind === "PHOTO" && m.src ? (
                       
                      <img src={m.src} alt={m.caption ?? m.title} className="w-full h-full object-cover" loading="lazy" />
                    ) : m.poster ? (
                       
                      <img src={m.poster} alt={m.caption ?? m.title} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#a89e94]">
                        <Video className="w-8 h-8" aria-hidden />
                      </div>
                    )}
                    <span className="absolute top-2 left-2 flex gap-1">
                      <Badge className={cn("text-[10px] border", m.kind === "PHOTO" ? "bg-white/90 text-stone-700 border-stone-200" : "bg-[var(--mk-ink)] text-white border-[var(--mk-ink)]")}>
                        {m.kind === "PHOTO" ? <ImageIcon className="w-3 h-3 mr-0.5" aria-hidden /> : <Video className="w-3 h-3 mr-0.5" aria-hidden />}
                        {m.kind}
                      </Badge>
                      {m.origin !== "own" && <Badge className="text-[10px] bg-amber-100 text-amber-800 border-amber-300 border">{m.origin}</Badge>}
                    </span>
                    {!m.authorized && (
                      <span className="absolute inset-0 bg-[var(--mk-ink)]/55 flex items-center justify-center">
                        <span className="bg-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                          <EyeOff className="w-3.5 h-3.5" aria-hidden /> oculta no site
                        </span>
                      </span>
                    )}
                  </div>
                  <CardContent className="p-4 space-y-2.5">
                    <div>
                      <p className="font-semibold text-sm leading-snug">{m.title}</p>
                      <p className="text-xs text-[#a89e94]">{m.venue ?? "—"}{m.dateLabel ? ` · ${m.dateLabel}` : ""}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#e3e3e3] pt-2.5">
                      <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                        <Switch checked={m.authorized} onCheckedChange={(v) => toggleMedia(m, { authorized: v })} aria-label="Autorizada para divulgação" />
                        Divulgação
                      </label>
                      <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                        <Switch checked={m.active} onCheckedChange={(v) => toggleMedia(m, { active: v })} aria-label="Ativa" />
                        Ativa
                      </label>
                      <span className="flex items-center gap-1.5 text-xs text-[#a89e94] ml-auto">
                        <Switch checked={m.faceVisible} onCheckedChange={(v) => toggleMedia(m, { faceVisible: v })} aria-label="Rosto visível" />
                        rosto visível
                      </span>
                    </div>
                    <div className="flex gap-1.5">
                      <Button size="sm" variant="outline" className="rounded-full h-7 text-xs bg-white flex-1" onClick={() => { setEditingMedia(m); setMediaDialog(true); }}>
                        Editar
                      </Button>
                      <Button size="sm" variant="outline" className="rounded-full h-7 text-xs text-red-500 hover:bg-red-50" onClick={() => delMedia(m.id)} aria-label="Excluir mídia">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cidades" className="mt-5">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cities.map((city) => (
              <Card key={city.id} className="rounded-2xl border-[#e3e3e3]">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display font-bold">{city.name}</h3>
                      <p className="text-xs text-[#a89e94] font-mono">{city.lat.toFixed(4)}, {city.lng.toFixed(4)}</p>
                    </div>
                    <Badge variant="outline" className={cn("text-[10px]", city.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700 border-emerald-300" : "bg-amber-50 text-amber-700 border-amber-300")}>
                      {city.status === "ACTIVE" ? "Ativa" : "Em breve"}
                    </Badge>
                  </div>
                  <p className="text-sm text-[#525252]">{city.description}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="rounded-full h-8 text-xs bg-white flex-1" onClick={() => { setEditingCity(city); setCityDialog(true); }}>Editar</Button>
                    <Button size="sm" variant="outline" className="rounded-full h-8 text-xs text-red-500 hover:bg-red-50" onClick={() => delCity(city.id)} aria-label={`Excluir ${city.name}`}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-xs text-[#a89e94] mt-4">
            As coordenadas (lat/lng) alimentam o mapa da rede exibido na home e na página de Mídia Indoor. Cidades novas aparecem no mapa automaticamente.
          </p>
        </TabsContent>
      </Tabs>

      {/* Dialog cidade (remonta a cada abertura) */}
      {cityDialog && (
        <CityDialog key={editingCity?.id ?? "new"} onClose={() => setCityDialog(false)} city={editingCity} onSaved={load} />
      )}
      {/* Dialog mídia (remonta a cada abertura) */}
      {mediaDialog && (
        <MediaDialog key={editingMedia?.id ?? "new"} onClose={() => setMediaDialog(false)} media={editingMedia} cities={cities} onSaved={load} />
      )}
    </div>
  );
}

function CityDialog({ onClose, city, onSaved }: { onClose: () => void; city: CityRow | null; onSaved: () => void }) {
  const [form, setForm] = useState(() =>
    city
      ? { name: city.name, lat: String(city.lat), lng: String(city.lng), description: city.description ?? "", status: city.status }
      : { name: "", lat: "", lng: "", description: "", status: "ACTIVE" }
  );
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!form.name || !form.lat || !form.lng) {
      alert("Preencha nome, latitude e longitude.");
      return;
    }
    setSaving(true);
    const payload = { name: form.name, lat: Number(form.lat), lng: Number(form.lng), description: form.description, status: form.status };
    await fetch(city ? `/api/admin/cities/${city.id}` : "/api/admin/cities", {
      method: city ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    onClose();
    onSaved();
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">{city ? "Editar cidade" : "Nova cidade da rede"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3.5">
          <Field label="Nome da cidade *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Latitude *" value={form.lat} onChange={(v) => setForm({ ...form, lat: v })} placeholder="-20.9186" />
            <Field label="Longitude *" value={form.lng} onChange={(v) => setForm({ ...form, lng: v })} placeholder="-49.4372" />
          </div>
          <Field label="Descrição" value={form.description} onChange={(v) => setForm({ ...form, description: v })} multiline rows={2} />
          <div className="space-y-1.5">
            <Label className="text-[13px]">Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
              <SelectTrigger className="h-10 bg-white w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Ativa</SelectItem>
                <SelectItem value="COMING_SOON">Em breve</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={submit} disabled={saving} className="w-full rounded-full bg-[var(--mk-orange)] hover:bg-[var(--mk-orange-deep)] text-white font-bold">
            {saving ? "Salvando…" : "Salvar cidade"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MediaDialog({ onClose, media, cities, onSaved }: { onClose: () => void; media: MediaRow | null; cities: CityRow[]; onSaved: () => void }) {
  const [form, setForm] = useState(() =>
    media
      ? {
          kind: media.kind, title: media.title, caption: media.caption ?? "", venue: media.venue ?? "", segment: media.segment ?? "",
          cityId: media.cityId ?? "none", src: media.src ?? "", poster: media.poster ?? "", videoUrl: media.videoUrl ?? (media.vimeoId && /^\d+$/.test(media.vimeoId) ? `https://vimeo.com/${media.vimeoId}` : ""), dateLabel: media.dateLabel ?? "",
          authorized: media.authorized, active: media.active, origin: media.origin,
        }
      : { kind: "PHOTO", title: "", caption: "", venue: "", segment: "", cityId: "none", src: "", poster: "", videoUrl: "", dateLabel: "", authorized: true, active: true, origin: "own" }
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [linkError, setLinkError] = useState("");

  const upload = async (file: File, target: "src" | "poster") => {
    setUploading(true);setLinkError("");
    try {
      const fd=new FormData();fd.append("file",file);fd.append("folder","Indoor");fd.append("alt",form.caption||form.title);
      const res=await fetch("/api/admin/upload",{method:"POST",body:fd});const result=await res.json();
      if(!res.ok)throw new Error(result.error||"Erro no envio da imagem.");
      setForm(f=>({...f,[target]:result.asset.url}));
    }catch(error){setLinkError((error as Error).message);}finally{setUploading(false);}
  };

  const submit = async () => {
    if (!form.title) {
      alert("Informe um título.");
      return;
    }
    if (form.kind === "VIDEO" && form.videoUrl.trim()) {
      const info = parseVideoUrl(form.videoUrl);
      if (!info) {
        setLinkError("Link não reconhecido. Use um endereço do YouTube (youtube.com/watch?v=… ou youtu.be/…) ou do Vimeo (vimeo.com/…).");
        return;
      }
    } else if (form.kind === "VIDEO") {
      setLinkError("Cole o link do vídeo hospedado no YouTube ou Vimeo.");
      return;
    }
    setLinkError("");
    setSaving(true);
    const payload = { ...form, cityId: form.cityId === "none" ? null : form.cityId };
    try {
      const res = await fetch(media ? `/api/admin/indoor/${media.id}` : "/api/admin/indoor", { method:media?"PUT":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload) });
      const result=await res.json();if(!res.ok)throw new Error(result.error||"Erro ao salvar mídia.");
      onClose();onSaved();
    }catch(error){setLinkError((error as Error).message);}finally{setSaving(false);}
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto mk-scroll">
        <DialogHeader>
          <DialogTitle className="font-display">{media ? "Editar mídia" : "Nova mídia da galeria"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[13px]">Tipo</Label>
              <Select value={form.kind} onValueChange={(v) => setForm({ ...form, kind: v })}>
                <SelectTrigger className="h-10 bg-white w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PHOTO">Foto (upload)</SelectItem>
                  <SelectItem value="VIDEO">Vídeo (link YouTube/Vimeo)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[13px]">Origem</Label>
              <Select value={form.origin} onValueChange={(v) => setForm({ ...form, origin: v })}>
                <SelectTrigger className="h-10 bg-white w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="own">Própria (MK)</SelectItem>
                  <SelectItem value="client">Cliente</SelectItem>
                  <SelectItem value="stock">Stock/licenciada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Field label="Título *" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <Field label="Legenda" value={form.caption} onChange={(v) => setForm({ ...form, caption: v })} multiline rows={2} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Local (ex.: Farmácia)" value={form.venue} onChange={(v) => setForm({ ...form, venue: v })} />
            <Field label="Segmento" value={form.segment} onChange={(v) => setForm({ ...form, segment: v })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-[13px]">Cidade</Label>
              <Select value={form.cityId || "none"} onValueChange={(v) => setForm({ ...form, cityId: v })}>
                <SelectTrigger className="h-10 bg-white w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem vínculo</SelectItem>
                  {cities.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Field label="Data (rótulo)" value={form.dateLabel} onChange={(v) => setForm({ ...form, dateLabel: v })} placeholder="AGO 2025" />
          </div>

          {form.kind === "PHOTO" ? (
            <div className="space-y-1.5">
              <Label className="text-[13px]">Arquivo (foto) *</Label>
              <p className="text-[11px] text-[#525252] bg-[var(--mk-sand)] border border-[#e3e3e3] rounded-lg px-3 py-2">
                Recomendado: <strong>JPG ou WebP</strong>, até <strong>4MB</strong>. Fotos da rede em operação ficam melhores em <strong>1200×900px</strong> (horizontal) ou <strong>900×1200px</strong> (vertical).
              </p>
              <div className="flex items-center gap-2">
                <Input value={form.src} onChange={(e) => setForm({ ...form, src: e.target.value })} placeholder="Cole o link ou faça o upload" className="h-10 bg-white font-mono text-xs" />
                <label className="cursor-pointer shrink-0">
                  <span className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl border border-[#e3e3e3] bg-white text-sm font-semibold hover:border-[var(--mk-orange)] transition-colors">
                    <Plus className="w-4 h-4" aria-hidden /> Enviar foto
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f, "src"); e.target.value = ""; }} aria-label="Enviar foto" />
                </label>
              </div>
              {form.src && (
                 
                <img src={form.src} alt="Pré-visualização" className="h-28 rounded-lg object-cover border border-[#e3e3e3]" />
              )}
            </div>
          ) : (
            <>
              <div className="bg-[var(--mk-sand)] border border-[#e3e3e3] rounded-xl p-4 space-y-1.5">
                <p className="text-[13px] font-bold text-[var(--mk-ink)] flex items-center gap-2">
                  <Video className="w-4 h-4 text-[var(--mk-orange-deep)]" aria-hidden /> Vídeos são adicionados por LINK — nunca por upload
                </p>
                <p className="text-xs text-[#525252] leading-relaxed">
                  1. Faça o upload do vídeo na sua conta do <strong>YouTube</strong> (pode ser não listado) ou <strong>Vimeo</strong>.<br />
                  2. Copie o endereço completo do vídeo (ex.: <code className="font-mono text-[11px] bg-white px-1 rounded">youtube.com/watch?v=…</code> ou <code className="font-mono text-[11px] bg-white px-1 rounded">vimeo.com/123456789</code>).<br />
                  3. Cole o link no campo abaixo. O site cria o player automaticamente.
                </p>
              </div>
              <Field
                label="Link do vídeo no YouTube ou Vimeo *"
                value={form.videoUrl}
                onChange={(v) => {
                  setForm({ ...form, videoUrl: v });
                  setLinkError("");
                }}
                placeholder="https://www.youtube.com/watch?v=… ou https://vimeo.com/…"
              />
              {linkError && <p className="text-xs text-red-600 font-semibold" role="alert">{linkError}</p>}
              {form.videoUrl && parseVideoUrl(form.videoUrl) && (
                <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" aria-hidden /> Link válido ({parseVideoUrl(form.videoUrl)!.provider === "youtube" ? "YouTube" : "Vimeo"}) — player pronto.
                </p>
              )}
              <div className="space-y-1.5">
                <Label className="text-[13px]">Capa do vídeo (opcional)</Label>
                <p className="text-[11px] text-[#525252] bg-[var(--mk-sand)] border border-[#e3e3e3] rounded-lg px-3 py-2">
                  Imagem exibida antes de reproduzir. Recomendado: <strong>1280×720px</strong>, JPG ou WebP, até 4MB. Vídeos do YouTube usam a capa automática se este campo ficar vazio.
                </p>
                <div className="flex items-center gap-2">
                  <Input value={form.poster} onChange={(e) => setForm({ ...form, poster: e.target.value })} className="h-10 bg-white font-mono text-xs" />
                  <label className="cursor-pointer shrink-0">
                    <span className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl border border-[#e3e3e3] bg-white text-sm font-semibold hover:border-[var(--mk-orange)] transition-colors">
                      <Plus className="w-4 h-4" aria-hidden /> Enviar capa
                    </span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f, "poster"); e.target.value = ""; }} aria-label="Enviar capa" />
                  </label>
                </div>
              </div>
            </>
          )}

          <div className="flex flex-wrap gap-5 border-t border-[#e3e3e3] pt-3">
            <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
              <Switch checked={form.authorized} onCheckedChange={(v) => setForm({ ...form, authorized: v })} /> Autorizada para divulgação
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
              <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} /> Ativa
            </label>
          </div>
          {uploading && <p className="text-xs text-[var(--mk-orange-deep)] flex items-center gap-1.5"><Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden /> Enviando arquivo…</p>}
          <Button onClick={submit} disabled={saving || uploading} className="w-full rounded-full bg-[var(--mk-orange)] hover:bg-[var(--mk-orange-deep)] text-white font-bold">
            {saving ? "Salvando…" : "Salvar mídia"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ───────────────────────── CONFIGURAÇÕES ─────────────────────────

export function AdminSettings({ user }: { user: { id: string; name: string; email: string; role: string } }) {
  const { refreshSite } = useSite();
  const [contact, setContact] = useState({ whatsapp: "", whatsappMessage: "", phone: "", hours: "", showPublicCounter: true });
  const [social, setSocial] = useState({ instagram: "", facebook: "", linkedin: "", youtube: "" });
  const [institution, setInstitution] = useState({ brandName: "", legalName: "", cnpj: "", addressStreet: "", addressDistrict: "", addressCity: "", addressState: "", email: "" });
  const [maintenance, setMaintenance] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pwd, setPwd] = useState({ current: "", next: "" });
  const [pwdMsg, setPwdMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings").then((r) => r.json()).then((d) => {
      setContact(d.contact);
      setSocial(d.social);
      setInstitution(d.institution);
      setMaintenance(d.features?.maintenance ?? false);
    }).catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true);
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contact, social, institution, features: { maintenance } }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      refreshSite();
    } else {
      alert("Erro ao salvar.");
    }
  };

  const changePassword = async () => {
    setPwdMsg("");
    const res = await fetch("/api/admin/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: pwd.current, newPassword: pwd.next }),
    });
    const data = await res.json();
    if (res.ok) {
      setPwdMsg("Senha alterada com sucesso!");
      setPwd({ current: "", next: "" });
    } else {
      setPwdMsg(data.error ?? "Erro ao alterar senha.");
    }
  };

  return (
    <div className="max-w-[860px] space-y-5">
      <div className="flex items-center gap-3">
        <Button onClick={save} disabled={saving} className="rounded-full bg-[var(--mk-orange)] hover:bg-[var(--mk-orange-deep)] text-white font-bold h-9 gap-1.5">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden /> : <Save className="w-4 h-4" aria-hidden />}
          Salvar configurações
        </Button>
        {saved && <span className="text-xs font-semibold text-emerald-600">✓ Salvo</span>}
      </div>

      <Card className="rounded-2xl border-[#e3e3e3]">
        <CardHeader className="pb-2">
          <CardTitle className="font-display font-bold">Contato & WhatsApp</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="WhatsApp comercial (com DDI)" value={contact.whatsapp} onChange={(v) => setContact({ ...contact, whatsapp: v })} placeholder="+55 17 99999-9999" />
          <Field label="Mensagem pré-preenchida do WhatsApp" value={contact.whatsappMessage} onChange={(v) => setContact({ ...contact, whatsappMessage: v })} multiline rows={2} />
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Telefone (opcional)" value={contact.phone} onChange={(v) => setContact({ ...contact, phone: v })} />
            <Field label="Horário de atendimento" value={contact.hours} onChange={(v) => setContact({ ...contact, hours: v })} placeholder="Seg a Sex, 8h às 18h" />
          </div>
          <div className="flex items-center justify-between border border-[#e3e3e3] rounded-xl p-3.5">
            <div>
              <p className="font-semibold text-sm">Contador de visitas público</p>
              <p className="text-xs text-[#a89e94]">Exibe "X online agora · Y visitas" no rodapé do site.</p>
            </div>
            <Switch checked={contact.showPublicCounter} onCheckedChange={(v) => setContact({ ...contact, showPublicCounter: v })} aria-label="Contador público" />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-[#e3e3e3]">
        <CardHeader className="pb-2">
          <CardTitle className="font-display font-bold">Redes sociais</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <Field label="Instagram" value={social.instagram} onChange={(v) => setSocial({ ...social, instagram: v })} placeholder="https://instagram.com/…" />
          <Field label="Facebook" value={social.facebook} onChange={(v) => setSocial({ ...social, facebook: v })} placeholder="https://facebook.com/…" />
          <Field label="LinkedIn" value={social.linkedin} onChange={(v) => setSocial({ ...social, linkedin: v })} placeholder="https://linkedin.com/company/…" />
          <Field label="YouTube" value={social.youtube} onChange={(v) => setSocial({ ...social, youtube: v })} placeholder="https://youtube.com/@…" />
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-[#e3e3e3]">
        <CardHeader className="pb-2">
          <CardTitle className="font-display font-bold">Dados institucionais</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <Field label="Nome da marca" value={institution.brandName} onChange={(v) => setInstitution({ ...institution, brandName: v })} />
          <Field label="Razão social" value={institution.legalName} onChange={(v) => setInstitution({ ...institution, legalName: v })} />
          <Field label="CNPJ" value={institution.cnpj} onChange={(v) => setInstitution({ ...institution, cnpj: v })} />
          <Field label="E-mail" value={institution.email} onChange={(v) => setInstitution({ ...institution, email: v })} />
          <Field label="Endereço" value={institution.addressStreet} onChange={(v) => setInstitution({ ...institution, addressStreet: v })} />
          <Field label="Bairro" value={institution.addressDistrict} onChange={(v) => setInstitution({ ...institution, addressDistrict: v })} />
          <Field label="Cidade" value={institution.addressCity} onChange={(v) => setInstitution({ ...institution, addressCity: v })} />
          <Field label="UF" value={institution.addressState} onChange={(v) => setInstitution({ ...institution, addressState: v })} />
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-[#e3e3e3]">
        <CardHeader className="pb-2">
          <CardTitle className="font-display font-bold">Modo manutenção</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between border border-[#e3e3e3] rounded-xl p-3.5">
            <div>
              <p className="font-semibold text-sm">Site em manutenção</p>
              <p className="text-xs text-[#a89e94]">Quando ativo, o site público mostra um aviso de manutenção (o painel continua acessível).</p>
            </div>
            <Switch checked={maintenance} onCheckedChange={setMaintenance} aria-label="Modo manutenção" />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-[#e3e3e3]">
        <CardHeader className="pb-2">
          <CardTitle className="font-display font-bold flex items-center gap-2">
            <Lock className="w-4.5 h-4.5 text-[var(--mk-orange)]" aria-hidden /> Segurança · alterar senha
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
        <p className="text-xs text-[#a89e94] flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" aria-hidden /> Conectado como {user.email}
        </p>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Senha atual" value={pwd.current} onChange={(v) => setPwd({ ...pwd, current: v })} type="password" />
            <Field label="Nova senha (mín. 10 caracteres)" value={pwd.next} onChange={(v) => setPwd({ ...pwd, next: v })} type="password" />
          </div>
          {pwdMsg && <p className={cn("text-sm font-semibold", pwdMsg.includes("sucesso") ? "text-emerald-600" : "text-red-500")}>{pwdMsg}</p>}
          <Button onClick={changePassword} variant="outline" className="rounded-full bg-white gap-1.5">
            <Lock className="w-3.5 h-3.5" aria-hidden /> Alterar senha
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
