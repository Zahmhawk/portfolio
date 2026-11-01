// Server-only configuration. Values are never logged or regenerated.
export function getRuntimeSetting(name) {
  if (name !== 'CHAT_ENCRYPTION_KEY' && name !== 'OWNER_BOOTSTRAP_ENABLED') throw new Error('Unknown runtime setting');
  return process.env[name] ?? '';
}
