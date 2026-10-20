import { NextRequest, NextResponse } from "next/server";
import { db } from "./db";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export const SESSION_COOKIE = "mk_session";
const SESSION_DAYS = 14;

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export async function createSession(userId: string, ip?: string, userAgent?: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await db.session.create({ data: { token, userId, expiresAt, ip: ip ?? null, userAgent: userAgent ?? null } });
  return { token, expiresAt };
}

export function sessionCookieOptions(expiresAt: Date) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    expires: expiresAt,
  };
}

export async function getSessionUser(req: NextRequest): Promise<SessionUser | null> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await db.session.findUnique({
    where: { token },
    include: { user: true },
  });
  if (!session) return null;
  if (session.expiresAt < new Date()) {
    await db.session.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }
  if (!session.user.active) return null;
  return { id: session.user.id, name: session.user.name, email: session.user.email, role: session.user.role };
}

export async function requireAdmin(req: NextRequest): Promise<SessionUser | NextResponse> {
  const user = await getSessionUser(req);
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  return user;
}

export function isResponse(x: unknown): x is NextResponse {
  return x instanceof NextResponse;
}

export async function audit(userId: string | null, action: string, entity: string, entityId?: string, details?: string) {
  await db.auditLog.create({ data: { userId: userId ?? undefined, action, entity, entityId: entityId ?? undefined, details: details ?? undefined } }).catch(() => {});
}

// ── Rate limit simples em banco (login e formulários) ──
export async function rateLimit(key: string, limit: number, windowSeconds: number): Promise<boolean> {
  // usa TrackEvent como armazenamento genérico de contagem por janela
  const since = new Date(Date.now() - windowSeconds * 1000);
  const count = await db.trackEvent.count({
    where: { type: `rl:${key}`, createdAt: { gte: since } },
  });
  if (count >= limit) return false;
  await db.trackEvent.create({ data: { type: `rl:${key}` } });
  // limpeza oportunista
  if (Math.random() < 0.05) {
    await db.trackEvent.deleteMany({ where: { type: { startsWith: "rl:" }, createdAt: { lt: new Date(Date.now() - 24 * 3600 * 1000) } } }).catch(() => {});
  }
  return true;
}
