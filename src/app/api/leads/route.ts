import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/auth";
import { trackEvent } from "@/lib/analytics";

export const dynamic = "force-dynamic";

const VALID_SERVICES = ["GOOGLE_SEO", "REDES_SOCIAIS", "TRAFEGO_PAGO", "CRIACAO_SITES", "MIDIA_INDOOR", "COMUNICACAO_VISUAL", "OUTRO"];
const VALID_STATUS = ["NEW", "CONTACT", "PROPOSAL", "WON", "LOST"];

export async function POST(req: NextRequest) {
  try {
    const ip = (req.headers.get("x-forwarded-for") || "local").split(",")[0].trim();
    if (!(await rateLimit(`lead:${ip}`, 5, 600))) {
      return NextResponse.json({ error: "Muitas mensagens enviadas. Tente novamente em alguns minutos." }, { status: 429 });
    }

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });

    // honeypot + tempo mínimo (3s)
    if (body.website) return NextResponse.json({ ok: true }); // honeypot preenchido: finge sucesso
    const elapsed = Number(body.elapsedMs ?? 0);
    if (elapsed && elapsed < 2500) {
      return NextResponse.json({ error: "Formulário enviado rápido demais. Tente novamente." }, { status: 400 });
    }

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const message = String(body.message ?? "").trim();
    const service = VALID_SERVICES.includes(body.service) ? body.service : "OUTRO";
    const consent = Boolean(body.consent);

    if (!name || name.length < 2) return NextResponse.json({ error: "Informe seu nome." }, { status: 400 });
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return NextResponse.json({ error: "Informe um e-mail válido." }, { status: 400 });
    if (!message || message.length < 5) return NextResponse.json({ error: "Escreva uma mensagem." }, { status: 400 });
    if (!consent) return NextResponse.json({ error: "É necessário aceitar o uso dos dados para contato (LGPD)." }, { status: 400 });

    const lead = await db.lead.create({
      data: {
        name: name.slice(0, 120),
        company: body.company ? String(body.company).slice(0, 120) : null,
        phone: body.phone ? String(body.phone).slice(0, 40) : null,
        email: email.slice(0, 160),
        service,
        message: message.slice(0, 4000),
        city: body.city ? String(body.city).slice(0, 120) : null,
        status: VALID_STATUS.includes(body.status) ? body.status : "NEW",
        source: body.source ? String(body.source).slice(0, 60) : "site",
        originPath: body.path ? String(body.path).slice(0, 300) : null,
        consent,
      },
    });

    await trackEvent("lead_created", service, body?.path);

    // E-mail: o envio real depende do SMTP configurado; o lead SEMPRE fica salvo no banco.
    // (Em produção: integração SMTP no painel dispara notificação para comercial@)

    return NextResponse.json({ ok: true, id: lead.id });
  } catch {
    return NextResponse.json({ error: "Erro ao enviar. Tente novamente." }, { status: 500 });
  }
}
