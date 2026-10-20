import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, hashPassword, createSession, sessionCookieOptions, SESSION_COOKIE, audit, rateLimit } from "@/lib/auth";
import { seedInitialData } from "@/lib/seed-core";

// First access is explicit configuration. Never ship a universal admin password.
const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_BOOTSTRAP_EMAIL?.trim().toLowerCase() ?? "";
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_BOOTSTRAP_PASSWORD ?? "";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local";
    if (!(await rateLimit(`login:${ip}`, 8, 300))) {
      return NextResponse.json({ error: "Muitas tentativas. Aguarde alguns minutos." }, { status: 429 });
    }
    const body = await req.json().catch(() => null);
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");
    if (!email || !password) {
      return NextResponse.json({ error: "Informe e-mail e senha." }, { status: 400 });
    }

    // Bootstrap do primeiro acesso: banco vazio → cria o admin padrão
    try {
      const userCount = await db.user.count();
      if (userCount === 0 && DEFAULT_ADMIN_PASSWORD.length >= 16 && email === DEFAULT_ADMIN_EMAIL && password === DEFAULT_ADMIN_PASSWORD) {
        const passwordHash = await hashPassword(DEFAULT_ADMIN_PASSWORD);
        const created = await db.user.create({
          data: { name: "Equipe MK Creative", email: DEFAULT_ADMIN_EMAIL, passwordHash, role: "ADMIN" },
        });
        await audit(null, "SEED", "auth", undefined, "admin inicial criado no primeiro login");
        // Com o primeiro autor existente, popula o conteúdo completo (idempotente —
        // inclui os artigos do blog, que exigem um admin como autor).
        try {
          await seedInitialData(db, created.id);
        } catch {
          // seed best-effort — o ensureSeeded cobre em requisições futuras
        }
      }
    } catch {
      // banco ainda não migrado — segue o fluxo normal (erro de credenciais)
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user || !user.active || !(await verifyPassword(password, user.passwordHash))) {
      await audit(user?.id ?? null, "LOGIN_FAILED", "auth", undefined, email);
      return NextResponse.json({ error: "Credenciais inválidas." }, { status: 401 });
    }
    const { token, expiresAt } = await createSession(user.id, ip, req.headers.get("user-agent") ?? undefined);
    await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    await audit(user.id, "LOGIN", "auth", user.id, user.email);

    const res = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(expiresAt));
    return res;
  } catch {
    return NextResponse.json({ error: "Erro no login." }, { status: 500 });
  }
}
