import { constants } from 'node:fs';
import { mkdir, open, unlink } from 'node:fs/promises';
import { isAbsolute, join, resolve } from 'node:path';
import { loadEnvFile } from './env-loader.mjs';

const UUID = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;

export function createLocalFileStorage(directory) {
  if (!directory || !isAbsolute(directory)) throw new Error('FILE_STORAGE_DIR must be an absolute private directory');
  function objectPath(id) {
    if (typeof id !== 'string' || !UUID.test(id)) throw new Error('Invalid file ID');
    return join(directory, id);
  }
  return {
    async get(id) {
      const path = objectPath(id);
      let file;
      try {
        file = await open(path, constants.O_RDONLY | (constants.O_NOFOLLOW || 0));
        const stat = await file.stat();
        if (!stat.isFile()) throw new Error('Invalid stored object');
        return { body: new Uint8Array(await file.readFile()) };
      } catch (error) {
        if (error.code === 'ENOENT') return null;
        throw error;
      } finally { await file?.close(); }
    },
    async put(id, data) {
      const path = objectPath(id);
      await mkdir(directory, { recursive: true, mode: 0o700 });
      const file = await open(path, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | (constants.O_NOFOLLOW || 0), 0o600);
      try { await file.writeFile(data); } finally { await file.close(); }
    },
    async delete(id) {
      try { await unlink(objectPath(id)); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    },
  };
}

export function getFileStorage() {
  loadEnvFile();
  const dir = process.env.FILE_STORAGE_DIR
    ? resolve(process.cwd(), process.env.FILE_STORAGE_DIR)
    : join(process.cwd(), '.storage', 'files');
  return createLocalFileStorage(dir);
}
