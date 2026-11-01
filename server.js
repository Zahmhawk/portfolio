import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { loadEnvFile } from './lib/env-loader.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
process.chdir(root);
loadEnvFile(root);

const nitroEntry = path.join(root, '.output', 'server', 'index.mjs');
const standaloneEntry = path.join(root, 'dist', 'standalone', 'server.js');

if (existsSync(nitroEntry)) {
  await import(nitroEntry);
} else if (existsSync(standaloneEntry)) {
  await import(standaloneEntry);
} else {
  console.error('Build output (.output/server/index.mjs) not found. Please run "npm run build" first.');
  process.exit(1);
}
