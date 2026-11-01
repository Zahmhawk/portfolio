import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));

const viteBin1 = path.join(root, 'node_modules', 'vite', 'bin', 'vite.js');
const viteBin2 = path.join(root, 'node_modules', '.bin', 'vite');

let cmd = process.execPath;
let args = [viteBin1, 'build', '--config', 'vite.hostinger.config.ts'];

if (!existsSync(viteBin1)) {
  if (existsSync(viteBin2)) {
    cmd = viteBin2;
    args = ['build', '--config', 'vite.hostinger.config.ts'];
  } else {
    cmd = 'npx';
    args = ['vite', 'build', '--config', 'vite.hostinger.config.ts'];
  }
}

const result = spawnSync(cmd, args, {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, NITRO_PRESET: 'node' },
});

if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

// Create dist/standalone/server.js forwarding entry for Hostinger compatibility
const standaloneDir = path.join(root, 'dist', 'standalone');
mkdirSync(standaloneDir, { recursive: true });
writeFileSync(
  path.join(standaloneDir, 'server.js'),
  "import '../../.output/server/index.mjs';\n",
);
