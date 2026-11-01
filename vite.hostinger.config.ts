import { defineConfig } from 'vite';
import vinext from 'vinext';
import { nitro } from 'nitro/vite';
import { fileURLToPath } from 'node:url';

process.env.NITRO_PRESET ??= 'node';

export default defineConfig({
  resolve: {
    alias: [
      { find: '@/lib/file-storage', replacement: fileURLToPath(new URL('./lib/file-storage-node.mjs', import.meta.url)) },
      { find: '@/lib/database-provider', replacement: fileURLToPath(new URL('./lib/database-provider-node.mjs', import.meta.url)) },
      { find: '@/lib/runtime-settings', replacement: fileURLToPath(new URL('./lib/runtime-settings-node.mjs', import.meta.url)) },
      { find: '@', replacement: fileURLToPath(new URL('./', import.meta.url)) },
    ],
  },
  plugins: [
    vinext(),
    nitro({
      handlers: [
        {
          route: '/**',
          middleware: true,
          handler: fileURLToPath(new URL('./lib/node-auth-nitro.ts', import.meta.url)),
        },
      ],
    }),
  ],
});
