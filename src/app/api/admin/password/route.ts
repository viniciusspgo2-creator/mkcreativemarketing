import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, isResponse, hashPassword, audit } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const user = await requireAdmin(req);
  if (isResponse(user)) return user;
  try {
    const body = await req.json();
    const { currentPassword, newPassword } = body;
    if (!currentPassword || !newPassword) return NextResponse.json({ error: "Preencha a senha atual e a nova senha." }, { status: 400 });
    if (String(newPassword).length < 10) return NextResponse.json({ error: "A nova senha precisa ter pelo menos 10 caracteres." }, { status: 400 });
    if (!/[A-Za-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      return NextResponse.json({ error: "A nova senha precisa ter letras e números." }, { status: 400 });
    }

    const me = await db.user.findUnique({ where: { id: user.id } });
    if (!me) return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });

    const bcrypt = await import("bcryptjs");
    if (!(await bcrypt.compare(String(currentPassword), me.passwordHash))) {
      return NextResponse.json({ error: "Senha atual incorreta." }, { status: 400 });
    }

    await db.user.update({ where: { id: me.id }, data: { passwordHash: await hashPassword(String(newPassword)) } });
    await audit(me.id, "UPDATE", "user", me.id, "password");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erro ao alterar senha." }, { status: 500 });
  }
}
