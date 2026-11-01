import { randomBytes } from 'node:crypto';
import { hashPassword } from './lib/password-crypto.mjs';
import { createMySqlDatabase } from './db/mysql-adapter.mjs';
import { loadEnvFile } from './lib/env-loader.mjs';

loadEnvFile();
const db = createMySqlDatabase();
const temporaryPassword = randomBytes(18).toString('base64url');
const passwordHash = hashPassword(temporaryPassword);

try {
  const owner = await db
    .prepare(
      "SELECT c.user_id FROM login_credentials c JOIN accounts a ON a.user_id = c.user_id WHERE lower(c.username) = 'niazis11' AND a.role = 'owner'"
    )
    .first();

  if (!owner?.user_id) {
    console.error('Administrator NIAZIS11 was not found. Import database.sql first.');
    process.exit(1);
  }

  await db.batch([
    db.prepare('UPDATE login_credentials SET password_hash = ?, force_change = 1 WHERE user_id = ?').bind(passwordHash, owner.user_id),
    db.prepare('DELETE FROM login_sessions WHERE user_id = ?').bind(owner.user_id),
    db.prepare('DELETE FROM login_tokens WHERE user_id = ?').bind(owner.user_id),
  ]);

  console.log('Admin ID: NIAZIS11');
  console.log('Temporary password:', temporaryPassword);
  console.log('Sign in and change this temporary password immediately.');
} finally {
  await db.close();
}
