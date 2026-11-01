import { createMySqlDatabase } from '../db/mysql-adapter.mjs';
import { loadEnvFile } from './env-loader.mjs';

let database;

function createFallbackDatabase() {
  function prepare(sql) {
    return {
      bind() { return prepare(sql); },
      requirePreviousChanges() { return prepare(sql); },
      async first() { return null; },
      async all() { return { success: true, results: [], meta: { changes: 0 } }; },
      async run() { return { success: true, results: [], meta: { changes: 0 } }; },
    };
  }
  return {
    dialect: 'mysql',
    prepare,
    async batch() { return []; },
    async consumeLoginToken() { return null; },
    async close() {},
  };
}

export function getDatabase() {
  if (database) return database;
  loadEnvFile();
  try {
    database = createMySqlDatabase();
    return database;
  } catch (err) {
    console.warn('[database-provider] MySQL connection not initialized:', err?.message || err);
    console.warn('[database-provider] Operating with default/fallback data until MySQL credentials are provided.');
    return createFallbackDatabase();
  }
}

// Call only during server shutdown, after requests have drained.
export async function closeDatabase() {
  const current = database;
  database = undefined;
  if (current && typeof current.close === 'function') {
    try {
      await current.close();
    } catch {
      // Ignore close errors during shutdown
    }
  }
}
