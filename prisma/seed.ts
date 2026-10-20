// Seed CLI — cria o admin inicial e popula o conteúdo-base via lib compartilhada.
// Uso: bun prisma/seed.ts  (idempotente — pode rodar quantas vezes quiser)
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { seedInitialData, readingMinutes } from "../src/lib/seed-core";
import { BLOG_SEED } from "../src/lib/blog-seed";

const db = new PrismaClient();

async function main() {
  // ── Usuário admin inicial ──
  const email = process.env.ADMIN_BOOTSTRAP_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD ?? "";
  if (!email || password.length < 16) throw new Error("Configure ADMIN_BOOTSTRAP_EMAIL e ADMIN_BOOTSTRAP_PASSWORD com pelo menos 16 caracteres para o primeiro acesso.");
  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await db.user.upsert({
    where: { email: email },
    update: {},
    create: {
      name: "Equipe MK Creative",
      email: email,
      passwordHash,
      role: "ADMIN",
    },
  });

  await seedInitialData(db, admin.id);

  await db.auditLog.create({
    data: { userId: admin.id, action: "SEED", entity: "system", details: "Seed inicial executado: configurações, cidades, galeria indoor, artigos do blog." },
  });

  console.log("Seed concluído. Admin:", admin.email, "· Artigos:", BLOG_SEED.length, "· leitura média:", readingMinutes("<p>exemplo</p>"), "min/200 palavras");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
