import { scryptSync } from 'node:crypto';
import { loadEnvFile } from './env-loader.mjs';

export function getRuntimeSetting(name) {
  if (name !== 'CHAT_ENCRYPTION_KEY' && name !== 'OWNER_BOOTSTRAP_ENABLED') throw new Error('Unknown runtime setting');
  loadEnvFile();
  if (name === 'OWNER_BOOTSTRAP_ENABLED') return process.env.OWNER_BOOTSTRAP_ENABLED ?? 'true';
  if (process.env.CHAT_ENCRYPTION_KEY) return process.env.CHAT_ENCRYPTION_KEY;
  if (process.env.DB_PASSWORD && process.env.DB_NAME) {
    return scryptSync(process.env.DB_PASSWORD + '|' + process.env.DB_NAME, 'portfolio-chat-key-salt', 32).toString('base64');
  }
  return '';
}
