// Sanitizador de HTML do editor (whitelist) — usado no blog e em conteúdos do painel.
// Reescrito em TS puro (sem deps) — remove scripts, eventos e tags não autorizadas.

const ALLOWED_TAGS = new Set([
  "h2", "h3", "h4", "p", "br", "strong", "b", "em", "i", "u", "s",
  "ul", "ol", "li", "blockquote", "a", "img", "figure", "figcaption", "hr", "code", "pre", "span",
]);

const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(["href", "title", "target", "rel"]),
  img: new Set(["src", "alt", "width", "height", "loading"]),
  span: new Set([]),
};

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function safeUrl(url: string): string {
  const t = url.trim();
  if (/^(https?:\/\/|\/|#|mailto:|tel:)/i.test(t)) return t.replace(/"/g, "%22");
  return "#";
}

export function sanitizeHtml(dirty: string): string {
  if (!dirty) return "";
  let html = dirty;

  // remove blocos perigosos inteiros
  html = html.replace(/<script[\s\S]*?<\/script>/gi, "");
  html = html.replace(/<style[\s\S]*?<\/style>/gi, "");
  html = html.replace(/<iframe[\s\S]*?(<\/iframe>|>)/gi, "");
  html = html.replace(/<object[\s\S]*?<\/object>/gi, "");
  html = html.replace(/<embed[\s\S]*?>/gi, "");
  html = html.replace(/<!--[\s\S]*?-->/g, "");

  // tokeniza tags
  const out: string[] = [];
  const re = /<\/?([a-zA-Z][a-zA-Z0-9]*)((?:\s+[^<>]*?)?)\s*(\/?)>/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    out.push(html.slice(last, m.index));
    const full = m[0];
    const tag = m[1].toLowerCase();
    const attrsRaw = m[2] ?? "";
    const closing = full.startsWith("</");

    if (!ALLOWED_TAGS.has(tag)) {
      last = re.lastIndex;
      continue;
    }

    if (closing) {
      out.push(`</${tag}>`);
    } else {
      const allowed = ALLOWED_ATTRS[tag];
      let attrStr = "";
      if (allowed && allowed.size > 0) {
        const attrRe = /([a-zA-Z-]+)\s*=\s*"([^"]*)"|([a-zA-Z-]+)\s*=\s*'([^']*)'/g;
        let am: RegExpExecArray | null;
        while ((am = attrRe.exec(attrsRaw))) {
          const name = (am[1] || am[3] || "").toLowerCase();
          const value = am[2] ?? am[4] ?? "";
          if (allowed.has(name)) {
            if (name === "href" || name === "src") {
              attrStr += ` ${name}="${escapeHtml(safeUrl(value))}"`;
            } else {
              attrStr += ` ${name}="${escapeHtml(value)}"`;
            }
          }
        }
      }
      if (tag === "a") {
        // reforça segurança em links externos
        attrStr = attrStr.replace('target="_blank"', 'target="_blank" rel="noopener noreferrer"');
      }
      const self = m[3] === "/" || tag === "br" || tag === "hr" || tag === "img" ? " /" : "";
      out.push(`<${tag}${attrStr}${self}>`);
    }
    last = re.lastIndex;
  }
  out.push(html.slice(last));
  return out.join("");
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function readingMinutes(html: string): number {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function excerptFrom(html: string, max = 160): string {
  const text = stripHtml(html);
  if (text.length <= max) return text;
  return text.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
}
