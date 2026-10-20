import crypto from "crypto";
import { db } from "./db";

// ── Analytics próprio, anônimo e compatível com LGPD ──

const SALT = process.env.ANALYTICS_SALT || "mk-creative-static-salt";

export function dayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function visitorHash(ip: string, userAgent: string, day: string): string {
  return crypto.createHash("sha256").update(`${ip}|${userAgent}|${SALT}|${day}`).digest("hex");
}

export function parseUserAgent(ua: string): { device: string; browser: string; os: string } {
  const s = ua.toLowerCase();
  const isTablet = /ipad|tablet/.test(s);
  const isMobile = !isTablet && /mobile|iphone|android(?!.*tablet)|phone/.test(s);
  const device = isTablet ? "tablet" : isMobile ? "mobile" : "desktop";

  let browser = "Outro";
  if (/edg\//.test(s)) browser = "Edge";
  else if (/opr\/|opera/.test(s)) browser = "Opera";
  else if (/chrome\//.test(s)) browser = "Chrome";
  else if (/safari\//.test(s)) browser = "Safari";
  else if (/firefox\//.test(s)) browser = "Firefox";

  let os = "Outro";
  if (/windows/.test(s)) os = "Windows";
  else if (/android/.test(s)) os = "Android";
  else if (/iphone|ipad|ipod/.test(s)) os = "iOS";
  else if (/mac os/.test(s)) os = "macOS";
  else if (/linux/.test(s)) os = "Linux";

  return { device, browser, os };
}

export function refSource(referrer?: string | null): string {
  if (!referrer) return "direct";
  const r = referrer.toLowerCase();
  if (r.includes("google.") || r.includes("bing.") || r.includes("duckduckgo") || r.includes("search")) return "search";
  if (r.includes("instagram.") || r.includes("facebook.") || r.includes("fb.") || r.includes("linkedin.") || r.includes("twitter.") || r.includes("x.com") || r.includes("tiktok.") || r.includes("youtube.") || r.includes("whatsapp")) return "social";
  if (r.includes("wa.me") || r.includes("chat.whatsapp")) return "social";
  return "referral";
}

export function isBot(ua: string): boolean {
  return /bot|crawler|spider|crawling|headless|lighthouse|preview|monitor|uptime/i.test(ua);
}

type TrackArgs = {
  ip: string;
  userAgent: string;
  referrer?: string | null;
  path: string;
  title?: string | null;
};

export async function trackPageview({ ip, userAgent, referrer, path, title }: TrackArgs) {
  const day = dayKey();
  const hash = visitorHash(ip, userAgent, day);
  const { device, browser, os } = parseUserAgent(userAgent);
  const source = refSource(referrer);

  const visit = await db.visit.upsert({
    where: { visitorHash_day: { visitorHash: hash, day } },
    update: { pageviews: { increment: 1 }, lastActiveAt: new Date() },
    create: {
      visitorHash: hash,
      day,
      referrer: referrer ?? null,
      refSource: source,
      device,
      browser,
      os,
      landingPath: path,
    },
  });

  await db.pageView.create({ data: { visitId: visit.id, path: path.slice(0, 300), title: title?.slice(0, 200) ?? null } });

  // heartbeat do "online agora"
  return visit.id;
}

export async function trackEvent(type: string, label?: string, path?: string) {
  await db.trackEvent.create({ data: { type: type.slice(0, 60), label: label?.slice(0, 200) ?? null, path: path?.slice(0, 300) ?? null } });
}

export async function getOnlineCount(): Promise<number> {
  const since = new Date(Date.now() - 5 * 60 * 1000);
  return db.visit.count({ where: { lastActiveAt: { gte: since } } });
}
