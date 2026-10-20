"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { parseVideoUrl } from "@/lib/video";
import { Pause, Play, RotateCcw, VolumeX } from "lucide-react";

/** Only mounts a player after a request to play; silence is enforced by the provider API. */
export function SilentVideo({ url, title, onError }: { url: string; title: string; onError?: () => void }) {
  const info = useMemo(() => parseVideoUrl(url), [url]);
  const frame = useRef<HTMLIFrameElement>(null);
  const [status, setStatus] = useState("Carregando vídeo…");
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const [paused, setPaused] = useState(false);
  const controls = useRef<{ play: () => void; pause: () => void } | null>(null);
  useEffect(() => {
    if (!info || !frame.current) return;
    let disposed = false;
    let cleanup = () => {};
    setFailed(false); setPaused(false); setStatus("Carregando vídeo…");
    const fail = () => { if (!disposed) { setFailed(true); setStatus("Não foi possível reproduzir este vídeo."); onError?.(); } };
    if (info.provider === "vimeo") {
      import("@vimeo/player").then(({ default: Player }) => {
        if (disposed || !frame.current) return;
        const player = new Player(frame.current);
        const mute = () => { player.setMuted(true).catch(() => {}); player.setVolume(0).catch(() => {}); };
        const start = () => { mute(); player.play().catch(() => { if (!disposed) setStatus("Toque em reproduzir para iniciar."); }); };
        controls.current = { play: start, pause: () => { player.pause().catch(() => {}); } };
        player.on("loaded", start);
        player.on("playing", () => { if (!disposed) { setStatus(""); setPaused(false); } });
        player.on("pause", () => { if (!disposed) setPaused(true); });
        player.on("volumechange", (data: { volume: number; muted?: boolean }) => { if (data.volume > 0 || data.muted === false) mute(); });
        player.on("error", fail);
        player.ready().then(start).catch(fail);
        cleanup = () => { player.off("loaded"); player.off("playing"); player.off("pause"); player.off("volumechange"); player.off("error"); player.unload().catch(() => {}); };
      }).catch(fail);
    } else {
      const origin = "https://www.youtube-nocookie.com";
      const command = (func: string) => frame.current?.contentWindow?.postMessage(JSON.stringify({ event:"command", func, args:[] }), origin);
      const play = () => { command("mute"); command("playVideo"); setPaused(false); };
      controls.current = { play, pause: () => { command("pauseVideo"); setPaused(true); } };
      const receive = (event: MessageEvent) => {
        if (event.source !== frame.current?.contentWindow || event.origin !== origin) return;
        let data; try { data = typeof event.data === "string" ? JSON.parse(event.data) : event.data; } catch { return; }
        command("mute");
        if (data?.event === "onReady" || data?.event === "infoDelivery") setStatus("");
        if (data?.event === "onError") fail();
      };
      window.addEventListener("message", receive);
      const ready = () => frame.current?.contentWindow?.postMessage(JSON.stringify({event:"listening",id:"mk-silent"}),origin);
      frame.current.addEventListener("load", ready);
      cleanup = () => { window.removeEventListener("message", receive); frame.current?.removeEventListener("load", ready); };
    }
    return () => { disposed = true; controls.current = null; cleanup(); };
  }, [url, retry]);
  if (!info) return <p role="alert" className="p-6 text-white">O link deste vídeo precisa ser atualizado.</p>;
  return <div className="mk-silent-video">
    {!failed && <iframe key={`${url}-${retry}`} ref={frame} src={info.embedUrl} title={title} allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" onError={() => setFailed(true)} />}
    {failed ? <div className="mk-video-error" role="alert"><strong>Este vídeo está indisponível.</strong><p>O proprietário pode precisar liberar a incorporação ou atualizar o link de compartilhamento.</p><button onClick={() => setRetry(r => r + 1)}><RotateCcw size={16} />Tentar novamente</button></div> : <>
      {status && <p className="mk-video-status" role="status">{status}</p>}
      <div className="mk-video-toolbar"><button onClick={() => { if (paused || status) { controls.current?.play(); } else { controls.current?.pause(); } }} aria-label={paused || status ? "Reproduzir vídeo" : "Pausar vídeo"}>{paused || status ? <Play size={16} /> : <Pause size={16} />}{paused || status ? "Reproduzir" : "Pausar"}</button><span><VolumeX size={15} /> Sem áudio</span></div>
    </>}
  </div>;
}
