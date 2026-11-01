import { getFileStorage as getNodeFileStorage } from './file-storage-node.mjs';

export function getFileStorage(): any {
  return getNodeFileStorage();
}
