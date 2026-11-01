import { randomBytes } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { hashPassword } from './lib/password-crypto.mjs';

process.chdir(fileURLToPath(new URL('.', import.meta.url)));

const temporaryPassword = randomBytes(18).toString('base64url');
const passwordHash = hashPassword(temporaryPassword);
const quote = (value) => "'" + value.replaceAll("'", "''") + "'";

const owner = `
  SELECT c.user_id
  FROM login_credentials c
  JOIN accounts a ON a.user_id = c.user_id
  WHERE lower(c.username) = 'niazis11'
    AND a.role = 'owner'
`;

const sql = `
  UPDATE login_credentials
  SET password_hash = ${quote(passwordHash)}, force_change = 1
  WHERE user_id IN (${owner});

  DELETE FROM login_sessions
  WHERE user_id IN (${owner});

  DELETE FROM login_tokens
  WHERE user_id IN (${owner});

  SELECT username, force_change
  FROM login_credentials
  WHERE user_id IN (${owner});
`;

const result = spawnSync(
  process.execPath,
  [
    'node_modules/wrangler/bin/wrangler.js',
    'd1',
    'execute',
    'DB',
    '--local',
    '--config',
    'wrangler.local.json',
    '--persist-to',
    '.wrangler/state',
    '--command',
    sql,
  ],
  { encoding: 'utf8' },
);

if (result.status !== 0) {
  console.error(result.stderr || result.stdout || 'Reset failed.');
  process.exit(1);
}

console.log(result.stdout);

if (!result.stdout.toLowerCase().includes('niazis11')) {
  console.error('Administrator NIAZIS11 was not found. Do not delete your database.');
  process.exit(1);
}

console.log('\nAdmin ID: NIAZIS11');
console.log('Temporary password:', temporaryPassword);
console.log('Sign in and change this temporary password immediately.');