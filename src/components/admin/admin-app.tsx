"use client";

// Admin — login, layout (sidebar + topbar) e roteamento interno
import "./admin-studio.css";
import { useCallback, useEffect, useState } from "react";
import { useSite } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlayMark } from "@/components/brand/illustrations";
import {
  LayoutDashboard, FileText, Globe, Search, Inbox, MonitorPlay, Settings, ImageIcon,
  LogOut, Menu, X, ExternalLink, ShieldCheck,
} from "lucide-react";
import { AdminDashboard } from "@/components/admin/dashboard";
import { AdminBlog } from "@/components/admin/blog";
import { AdminSiteEditor } from "@/components/admin/site-editor";
import { AdminLeads, AdminIndoor, AdminSettings } from "@/components/admin/managers";

type AdminUser = { id: string; name: string; email: string; role: string };

const NAV = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "blog", label: "Blog", icon: FileText },
  { key: "site", label: "Editor do Site", icon: Globe },
  { key: "servicos", label: "Serviços", icon: Globe },
  { key: "portfolio", label: "Portfólio", icon: ImageIcon },
  { key: "imagens", label: "Imagens & Vídeo", icon: ImageIcon },
  { key: "seo", label: "SEO", icon: Search },
  { key: "leads", label: "Leads", icon: Inbox },
  { key: "indoor", label: "Mídia Indoor", icon: MonitorPlay },
  { key: "config", label: "Configurações", icon: Settings },
];

export function AdminApp() {
  const { route, site } = useSite();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [checking, setChecking] = useState(true);
  const sub = route.view === "admin" ? route.sub : [];
  const current = sub[0] ?? "dashboard";

  const check = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const d = await res.json();
        setUser(d.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => { check(); }, [check]);

  if (checking || !site) {
    return (
      <div className="min-h-screen bg-[var(--mk-ink)] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-[3px] border-[var(--mk-orange)] border-t-transparent animate-spin" aria-hidden />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onLogin={setUser} />;
  }

  return (
    <AdminLayout user={user} current={current} sub={sub}>
      {current === "dashboard" && <AdminDashboard />}
      {current === "blog" && <AdminBlog sub={sub} />}
      {current === "site" && <AdminSiteEditor tab="conteudo" />}
      {current === "servicos" && <AdminSiteEditor tab="servicos" />}
      {current === "portfolio" && <AdminSiteEditor tab="portfolio" />}
      {current === "imagens" && <AdminSiteEditor tab="imagens" />}
      {current === "seo" && <AdminSiteEditor tab="seo" />}
      {current === "leads" && <AdminLeads />}
      {current === "indoor" && <AdminIndoor />}
      {current === "config" && <AdminSettings user={user} />}
    </AdminLayout>
  );
}

// ── Login ──
function LoginScreen({ onLogin }: { onLogin: (u: AdminUser) => void }) {
  const { site } = useSite();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fd.get("email"), password: fd.get("password") }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erro no login.");
        return;
      }
      onLogin(data.user);
      window.location.hash = "#/admin/dashboard";
    } catch {
      setError("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mk-admin min-h-screen bg-[var(--mk-ink)] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 opacity-[0.06] pointer-events-none" aria-hidden>
        <PlayMark className="w-[420px] h-[420px]" />
      </div>
      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          { }
          <img src={site?.media.brand.logoFooter || "/logo-mk-branco.png"} alt="MK Creative" className="h-10 mx-auto mb-3" width={140} height={53} />
          <p className="text-white/50 text-sm">Painel administrativo</p>
        </div>
        <form onSubmit={submit} className="bg-[var(--mk-ink-800)] border border-white/10 rounded-2xl p-7 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="admin-email" className="text-white/80">E-mail</Label>
            <Input id="admin-email" name="email" type="email" required autoComplete="username" placeholder="admin@mktvmarketing.com.br" className="h-11 bg-white/5 border-white/15 text-white placeholder:text-white/30" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="admin-pass" className="text-white/80">Senha</Label>
            <Input id="admin-pass" name="password" type="password" required autoComplete="current-password" placeholder="••••••••••" className="h-11 bg-white/5 border-white/15 text-white placeholder:text-white/30" />
          </div>
          {error && <p className="text-sm text-red-400 font-medium" role="alert">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full h-11 bg-[var(--mk-orange)] hover:bg-[var(--mk-orange-deep)] text-white font-bold rounded-xl">
            {loading ? "Entrando…" : "Entrar no painel"}
          </Button>
          <p className="text-[11px] text-white/30 text-center flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden /> Acesso restrito · sessão protegida
          </p>
        </form>

      </div>
    </div>
  );
}

// ── Layout ──
function AdminLayout({ user, current, sub, children }: { user: AdminUser; current: string; sub: string[]; children: React.ReactNode }) {
  const { navigate, site } = useSite();
  const [open, setOpen] = useState(false);

  const go = (key: string) => {
    navigate({ view: "admin", sub: [key] });
    setOpen(false);
  };

  return (
    <div className="mk-admin min-h-screen bg-[#f5f5f5] flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 z-50 h-screen w-64 shrink-0 bg-[var(--mk-ink)] text-white flex flex-col transition-transform duration-300 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
        aria-label="Menu do painel" id="admin-sidebar"
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/10">
          { }
          <img src={site?.media.brand.logoFooter || "/logo-mk-branco.png"} alt="MK Creative" className="h-7" width={110} height={40} />
          <button onClick={() => setOpen(false)} className="lg:hidden p-1.5 min-w-[36px] min-h-[36px]" aria-label="Fechar menu">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto mk-scroll" aria-label="Navegação do painel">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = current === item.key;
            return (
              <button
                key={item.key}
                onClick={() => go(item.key)}
                aria-current={active ? "page" : undefined}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors min-h-[44px] ${active ? "bg-[var(--mk-orange)] text-white shadow-[0_8px_20px_-8px_rgba(243,100,10,0.7)]" : "text-white/60 hover:text-white hover:bg-white/5"}`}
              >
                <Icon className="w-[18px] h-[18px]" aria-hidden />
                {item.label}
                {item.key === "leads" && current !== "leads" && <AdminLeadBadge />}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-1">
          <button
            onClick={() => { window.location.hash = "#/"; }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-white/60 hover:text-white hover:bg-white/5 min-h-[44px]"
          >
            <ExternalLink className="w-[18px] h-[18px]" aria-hidden /> Ver site
          </button>
          <button
            onClick={async () => { await fetch("/api/auth/logout", { method: "POST" }); window.location.reload(); }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-white/60 hover:text-red-400 hover:bg-white/5 min-h-[44px]"
          >
            <LogOut className="w-[18px] h-[18px]" aria-hidden /> Sair
          </button>
          <div className="px-3.5 py-2 text-[11px] text-white/35">
            {user.name} · {user.role === "ADMIN" ? "Administrador" : "Editor"}
          </div>
        </div>
      </aside>

      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setOpen(false)} aria-hidden />}

      {/* Conteúdo */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur border-b border-[#e3e3e3] flex items-center gap-3 px-4 sm:px-6" role="banner">
          <button onClick={() => setOpen(true)} className="lg:hidden p-2 -ml-2 min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Abrir menu" aria-expanded={open} aria-controls="admin-sidebar">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="font-display font-semibold text-lg capitalize">
            {NAV.find((n) => n.key === current)?.label ?? "Painel"}
            {sub[1] === "novo" && <span className="text-[var(--mk-orange-deep)]"> · novo artigo</span>}
          </h1>
          <div className="ml-auto flex items-center gap-2 text-xs text-[#525252]">
            <span className="hidden sm:inline">{new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}</span>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8" role="main">
          {children}
        </main>
      </div>
    </div>
  );
}

function AdminLeadBadge() {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    fetch("/api/admin/stats?range=7")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setCount(d.counters.unreadLeads))
      .catch(() => {});
  }, []);
  if (count === null || count === 0) return null;
  return <span className="ml-auto bg-[var(--mk-orange)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">{count}</span>;
}
