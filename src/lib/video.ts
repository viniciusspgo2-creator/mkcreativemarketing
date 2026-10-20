export type VideoInfo = { provider: "youtube" | "vimeo"; id: string; embedUrl: string; url: string; thumbnail: string | null };

/** Strict provider validation; keep Vimeo's unlisted privacy hash in storage and embeds. */
export function parseVideoUrl(raw: string): VideoInfo | null {
  let input = (raw ?? "").trim();
  if (!input) return null;
  // Accept the official copied embed code as well as a link.
  if (input.startsWith("<iframe")) input = input.match(/\bsrc=["']([^"']+)["']/i)?.[1]?.replace(/&amp;/g, "&") ?? "";
  let u: URL;
  try { u = new URL(/^https?:\/\//i.test(input) ? input : `https://${input}`); } catch { return null; }
  if (!["http:", "https:"].includes(u.protocol) || u.username || u.password) return null;
  const host = u.hostname.toLowerCase().replace(/^www\./, "");
  const parts = u.pathname.split("/").filter(Boolean);
  if (["youtube.com", "m.youtube.com", "youtu.be", "youtube-nocookie.com"].includes(host)) {
    const id = host === "youtu.be" ? parts[0] : u.searchParams.get("v") || (["embed", "shorts", "live"].includes(parts[0]) ? parts[1] : "");
    if (!id || !/^[\w-]{6,20}$/.test(id)) return null;
    return { provider: "youtube", id, url: `https://www.youtube.com/watch?v=${id}`, thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&playsinline=1&rel=0&enablejsapi=1` };
  }
  if (host !== "vimeo.com" && host !== "player.vimeo.com") return null;
  const index = parts.findIndex(p => /^\d{6,12}$/.test(p));
  if (index < 0) return null;
  const id = parts[index];
  const hash = u.searchParams.get("h") || parts[index + 1];
  if (hash && !/^[a-z0-9]{6,64}$/i.test(hash)) return null;
  const params = new URLSearchParams();
  if (hash) params.set("h", hash);
  for (const [k, v] of Object.entries({ autoplay:"1", muted:"1", playsinline:"1", title:"0", byline:"0", portrait:"0", dnt:"1", volume:"0", unmute_button:"0", keyboard:"0" })) params.set(k,v);
  return { provider: "vimeo", id, url: `https://vimeo.com/${id}${hash ? `?h=${hash}` : ""}`, embedUrl: `https://player.vimeo.com/video/${id}?${params}`, thumbnail: null };
}
export function validateVideoUrl(raw: string): string | null {
  return parseVideoUrl(raw) ? null : "Cole um link completo do Vimeo ou YouTube. Para vídeo não listado do Vimeo, inclua o código de privacidade (h=…).";
}
