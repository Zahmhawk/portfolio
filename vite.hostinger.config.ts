import { defineConfig } from 'vite';
import vinext from 'vinext';
import { nitro } from 'nitro/vite';
import { fileURLToPath } from 'node:url';

// Fail closed until Node authenticates sessions and strips spoofed identity
// headers. A successful build without that boundary would be unsafe to deploy.
export default defineConfig({
  resolve: {
    alias: [
      { find: '@/lib/file-storage', replacement: fileURLToPath(new URL('./lib/file-storage-node.mjs', import.meta.url)) },
      { find: '@/lib/database-provider', replacement: fileURLToPath(new URL('./lib/database-provider-node.mjs', import.meta.url)) },
      { find: '@/lib/runtime-settings', replacement: fileURLToPath(new URL('./lib/runtime-settings-node.mjs', import.meta.url)) },
    ],
  },
  plugins: [
    { name: 'hostinger-migration-safety', buildStart() {
      throw new Error('Hostinger build disabled: Node authentication and database migration are not yet complete.');
    } },
    vinext(),
    nitro(),
  ],
});
