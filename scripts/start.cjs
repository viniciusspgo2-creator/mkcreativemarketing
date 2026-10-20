// Run the standalone Next server with its required static assets using Node.js.
const { existsSync, cpSync } = require('node:fs');
const { resolve, join } = require('node:path');
const { spawn } = require('node:child_process');
const root = resolve(__dirname, '..');
const standalone = join(root, '.next', 'standalone');
if (!existsSync(join(standalone, 'server.js'))) {
  console.error('Build ausente. Execute npm run build antes de npm start.');
  process.exit(1);
}
for (const [source, destination] of [['public', 'public'], ['.next/static', '.next/static']]) {
  if (existsSync(join(root, source))) cpSync(join(root, source), join(standalone, destination), { recursive: true });
}
const server = spawn(process.execPath, [join(standalone, 'server.js')], {
  cwd: standalone, stdio: 'inherit', env: { ...process.env, NODE_ENV: 'production' },
});
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.kill(signal));
server.on('exit', code => process.exit(code ?? 0));
server.on('error', error => { console.error(error.message); process.exit(1); });
