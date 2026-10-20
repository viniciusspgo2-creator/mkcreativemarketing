import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, isResponse } from "@/lib/auth";

export const dynamic = "force-dynamic";

function csvCell(v: unknown): string {
  const s = String(v ?? "");
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(req: NextRequest) {
  const user = await requireAdmin(req);
  if (isResponse(user)) return user;

  const leads = await db.lead.findMany({ orderBy: { createdAt: "desc" } });
  const header = ["Data", "Nome", "Empresa", "E-mail", "Telefone", "Cidade", "Serviço", "Status", "Origem", "Mensagem"];
  const rows = leads.map((l) => [
    l.createdAt.toISOString(),
    l.name, l.company ?? "", l.email, l.phone ?? "", l.city ?? "",
    l.service, l.status, l.source, l.message.replace(/\n/g, " "),
  ]);

  const csv = "\uFEFF" + [header, ...rows].map((r) => r.map(csvCell).join(";")).join("\r\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-mk-creative-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
