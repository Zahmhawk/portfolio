import { getRuntimeSetting as getNodeRuntimeSetting } from './runtime-settings-node.mjs';

export type RuntimeSetting = 'CHAT_ENCRYPTION_KEY' | 'OWNER_BOOTSTRAP_ENABLED';
export function getRuntimeSetting(name: RuntimeSetting): string {
  return String(getNodeRuntimeSetting(name) ?? '');
}
