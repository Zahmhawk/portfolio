import { getDatabase as getNodeDatabase, closeDatabase as closeNodeDatabase } from './database-provider-node.mjs';

export function getDatabase(): any {
  return getNodeDatabase();
}

export async function closeDatabase(): Promise<void> {
  await closeNodeDatabase();
}
