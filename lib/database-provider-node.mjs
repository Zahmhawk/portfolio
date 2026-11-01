import { createMySqlDatabase } from '../db/mysql-adapter.mjs';
let database;
export function getDatabase() {
  database ??= createMySqlDatabase();
  return database;
}
// Call only during server shutdown, after requests have drained.
export async function closeDatabase() {
  const current = database;
  database = undefined;
  if (current) await current.close();
}
