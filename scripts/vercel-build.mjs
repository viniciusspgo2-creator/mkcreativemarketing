// Build da Vercel: prisma generate → db push (cria/atualiza tabelas) → next build.
// - Usa DIRECT_URL (conexão direta do Neon) para o db push, se existir; senão DATABASE_URL.
//   (conexões "pooled"/pgbouncer podem falhar em operações de schema)
// - NÃO usa --accept-data-loss por padrão (evita apagar dados em produção).
//   Para permitir mudanças destrutivas conscientemente: PRISMA_ACCEPT_DATA_LOSS=1
import { spawnSync } from "node:child_process";

const run = (cmd, args, env = {}) => {
  const r = spawnSync(cmd, args, { stdio: "inherit", env: { ...process.env, ...env }, shell: process.platform === "win32" });
  return r.status ?? 1;
};

const dbUrl = process.env.DATABASE_URL || "";
const onVercel = !!process.env.VERCEL;

if (onVercel && (!dbUrl || /(127\.0\.0\.1|localhost)/.test(dbUrl))) {
  console.error("\n❌ DATABASE_URL não configurada (ou aponta para localhost) nas Environment Variables da Vercel.");
  console.error("   Configure a connection string do Neon em Settings → Environment Variables e faça Redeploy.\n");
  process.exit(1);
}

if (run("npx", ["prisma", "generate"]) !== 0) process.exit(1);

if (dbUrl) {
  const pushEnv = process.env.DIRECT_URL ? { DATABASE_URL: process.env.DIRECT_URL } : {};
  const base = ["prisma", "db", "push", "--skip-generate"];
  let code = run("npx", base, pushEnv);
  if (code !== 0 && process.env.PRISMA_ACCEPT_DATA_LOSS === "1") {
    console.warn("⚠️ Repetindo db push com --accept-data-loss (PRISMA_ACCEPT_DATA_LOSS=1).");
    code = run("npx", [...base, "--accept-data-loss"], pushEnv);
  }
  if (code !== 0) {
    console.error("\n❌ prisma db push falhou. Verifique DATABASE_URL (Neon, com ?sslmode=require).");
    console.error("   Se o erro for 'data loss', defina PRISMA_ACCEPT_DATA_LOSS=1 na Vercel ou ajuste o schema.\n");
    process.exit(code);
  }
} else {
  console.warn("⚠️ DATABASE_URL ausente: pulando prisma db push (build local).");
}

process.exit(run("npx", ["next", "build"]));
