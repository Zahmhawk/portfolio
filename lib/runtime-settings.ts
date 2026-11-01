import { env } from 'cloudflare:workers';

type RuntimeSetting = 'CHAT_ENCRYPTION_KEY' | 'OWNER_BOOTSTRAP_ENABLED';
export function getRuntimeSetting(name: RuntimeSetting): string {
  return String((env as Record<string, unknown>)[name] ?? '');
}
