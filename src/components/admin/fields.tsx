"use client";
import { useId, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, ImageIcon, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
export function Field({
  label, value, onChange, multiline, rows, placeholder, type = "text", mono = false,
}: {
  label: string; value: string; onChange: (v: string) => void; multiline?: boolean; rows?: number; placeholder?: string; type?: string; mono?: boolean;
}) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-[13px]">{label}</Label>
      {multiline ? (
        <Textarea id={id} value={value ?? ""} onChange={(e) => onChange(e.target.value)} rows={rows ?? 3} placeholder={placeholder} className="bg-white" />
      ) : (
        <Input id={id} type={type} value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cn("h-10 bg-white", mono && "font-mono text-xs")} />
      )}
    </div>
  );
}

// ── Campo de imagem com upload direto + resolução recomendada ──
export function ImageField({
  label, value, onChange, hint, folder = "Site",
}: {
  label: string; value: string; onChange: (v: string) => void; hint?: string; folder?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [assets, setAssets] = useState<{id:string;url:string;filename:string}[]|null>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const loadAssets = async () => {
    setLibraryOpen(v=>!v);
    if (assets) return;
    try { const res=await fetch("/api/admin/media"); if(!res.ok)throw new Error(); const result=await res.json();setAssets(result.assets??[]); }
    catch {setError("Não foi possível carregar as imagens. Tente novamente.");}
  };
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setError("");
    if (file.size > 4 * 1024 * 1024) {
      setError("Imagem maior que 4MB. Reduza o tamanho ou exporte em JPG/WebP.");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      fd.append("alt", label);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data2 = await res.json();
      if (res.ok) {
        onChange(data2.asset.url);
      } else {
        setError(data2.error ?? "Erro no upload.");
      }
    } catch {
      setError("Erro de conexão no upload.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-[13px] font-semibold">{label}</Label>
      {hint && <p className="text-[11px] text-[#525252] bg-[var(--mk-sand)] border border-[#e3e3e3] rounded-lg px-3 py-1.5">{hint}</p>}
      <div className="flex items-start gap-3">
        <div className="w-28 h-[68px] rounded-lg border border-[#e3e3e3] bg-white flex items-center justify-center overflow-hidden shrink-0">
          {value ? (
            <img src={value} alt={`Pré-visualização: ${label}`} className="w-full h-full object-contain" />
          ) : (
            <ImageIcon className="w-6 h-6 text-[#c9c0b5]" aria-hidden />
          )}
        </div>
        <div className="flex-1 space-y-2 min-w-0">
          <div className="flex gap-2">
            <Input value={value ?? ""} onChange={(e) => onChange(e.target.value)} aria-label={`Endereço de ${label}`} placeholder="Cole o link da imagem ou envie do computador" className="h-10 bg-white font-mono text-xs" />
            <label className="cursor-pointer shrink-0">
              <span className={cn("inline-flex items-center gap-1.5 h-10 px-4 rounded-xl text-sm font-semibold transition-colors border", uploading ? "bg-[var(--mk-sand)] text-[#a89e94] border-[#e3e3e3]" : "bg-[var(--mk-ink)] text-white border-[var(--mk-ink)] hover:bg-[var(--mk-ink-800)]")}>
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden /> : <Upload className="w-4 h-4" aria-hidden />}
                {uploading ? "Enviando…" : "Enviar"}
              </span>
              <input ref={inputRef} type="file" disabled={uploading} accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/avif" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }} aria-label={`Enviar ${label}`} />
            </label>
          </div>
          <button type="button" className="text-xs underline min-h-[32px]" onClick={loadAssets} aria-expanded={libraryOpen}>{libraryOpen?"Fechar arquivos enviados":"Escolher entre imagens enviadas"}</button>
          {libraryOpen && <div className="border rounded-md p-2 max-h-56 overflow-auto"><p className="text-xs mb-2">Arquivos de imagem do site</p>{assets===null?<p className="text-xs">Carregando…</p>:assets.length===0?<p className="text-xs">Nenhuma imagem enviada.</p>:<div className="grid grid-cols-3 gap-2">{assets.map(a=><button type="button" key={a.id} onClick={()=>{onChange(a.url);setLibraryOpen(false);}} className="border rounded overflow-hidden p-1 text-left" aria-label={`Selecionar ${a.filename}`}><img src={a.url} alt={a.filename} loading="lazy" className="h-14 w-full object-contain"/><span className="block text-[9px] truncate">{a.filename}</span></button>)}</div>}</div>}
          {error && <p className="text-xs text-red-600 font-semibold" role="alert">{error}</p>}
        </div>
      </div>
    </div>
  );
}

