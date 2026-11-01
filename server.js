import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import http from 'node:http';
import { loadEnvFile } from './lib/env-loader.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
process.chdir(root);
loadEnvFile(root);

const nitroEntry = path.join(root, '.output', 'server', 'index.mjs');
const standaloneEntry = path.join(root, 'dist', 'standalone', 'server.js');

async function startServer() {
  if (existsSync(nitroEntry)) {
    console.log('[Server] Launching Nitro application from .output/server/index.mjs');
    await import(nitroEntry);
    return;
  }

  if (existsSync(standaloneEntry)) {
    console.log('[Server] Launching standalone application from dist/standalone/server.js');
    await import(standaloneEntry);
    return;
  }

  // Attempt automatic build if .output is missing
  console.log('[Server] Build output not found. Attempting automatic build (npm run build)...');
  try {
    const { execSync } = await import('node:child_process');
    execSync('npm run build', { cwd: root, stdio: 'inherit' });
    if (existsSync(nitroEntry)) {
      console.log('[Server] Build succeeded. Launching Nitro server...');
      await import(nitroEntry);
      return;
    }
  } catch (buildErr) {
    console.error('[Server] Automatic build attempt failed:', buildErr?.message || buildErr);
  }

  // Resilient HTTP fallback server (avoids Hostinger 503 Service Unavailable error)
  const port = process.env.PORT || process.env.NITRO_PORT || 3000;
  const host = process.env.HOST || '0.0.0.0';

  const fallbackServer = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portfolio - Setup in Progress</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; max-width: 640px; width: 100%; padding: 32px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5); }
    h1 { color: #38bdf8; margin-top: 0; font-size: 24px; display: flex; align-items: center; gap: 10px; }
    p { line-height: 1.6; color: #cbd5e1; }
    .step { background: #0f172a; border-left: 4px solid #38bdf8; padding: 12px 16px; margin: 16px 0; border-radius: 0 8px 8px 0; }
    .step strong { color: #f1f5f9; display: block; margin-bottom: 4px; }
    code { background: #334155; color: #7dd3fc; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 14px; }
    .badge { display: inline-block; background: #0284c7; color: #fff; font-size: 12px; font-weight: bold; padding: 4px 8px; border-radius: 6px; text-transform: uppercase; margin-bottom: 12px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">Hostinger Node.js Connected</div>
    <h1>Portfolio Server is Running</h1>
    <p>Your Node.js server is online on Hostinger! To display your complete portfolio, complete these simple setup steps:</p>
    <div class="step">
      <strong>Step 1: Run the Build Command</strong>
      In <strong>Hostinger hPanel &rarr; Node.js</strong>, make sure <strong>Build Command</strong> is set to <code>npm run build</code> and click <strong>Deploy / Run Build</strong>.
    </div>
    <div class="step">
      <strong>Step 2: Configure Database (.env)</strong>
      In <strong>Hostinger hPanel &rarr; Databases</strong>, create a MySQL database and import <code>database.sql</code> via phpMyAdmin. Add <code>DB_HOST</code>, <code>DB_NAME</code>, <code>DB_USER</code>, and <code>DB_PASSWORD</code> in <strong>Node.js &rarr; Environment Variables</strong>.
    </div>
    <div class="step">
      <strong>Step 3: Restart Application</strong>
      Once the build finishes, click <strong>Restart</strong> in the Hostinger Node.js panel.
    </div>
  </div>
</body>
</html>`);
  });

  fallbackServer.listen(port, host, () => {
    console.log(`[Server] Resilient setup server active on http://${host}:${port}`);
    console.log('[Server] Run "npm run build" in Hostinger hPanel to compile full production application.');
  });
}

startServer().catch((err) => {
  console.error('[Server] Fatal startup error:', err);
});
