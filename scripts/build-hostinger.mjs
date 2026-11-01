import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const vite = path.join(root, 'node_modules/vite/bin/vite.js');

const result = spawnSync(
  process.execPath,
  [vite, 'build', '--config', 'vite.hostinger.config.ts'],
  {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, NITRO_PRESET: 'node' },
  },
);

if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

// Create dist/standalone/server.js forwarding entry for Hostinger compatibility
const standaloneDir = path.join(root, 'dist', 'standalone');
mkdirSync(standaloneDir, { recursive: true });
writeFileSync(
  path.join(standaloneDir, 'server.js'),
  "import '../../.output/server/index.mjs';\n",
);
