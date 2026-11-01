import assert from 'node:assert/strict';
import { createDatabase } from '../db/mysql-adapter.mjs';
const calls = [];
let fail = false;
const connection = {
  async execute(sql, values) { calls.push([sql, values]); if (fail) throw new Error('expected failure'); return sql.startsWith('SELECT') ? [[{ id: 7 }]] : [{ affectedRows: 2, insertId: 3 }]; },
  async beginTransaction() { calls.push('begin'); },
  async commit() { calls.push('commit'); },
  async rollback() { calls.push('rollback'); },
  release() { calls.push('release'); },
};
const pool = { ...connection, async getConnection() { return connection; }, async end() {} };
const db = createDatabase(pool);
assert.equal(await db.prepare('SELECT id FROM x WHERE id = ?').bind(7).first('id'), 7);
assert.equal((await db.prepare('UPDATE x SET a = ?').bind('v').run()).meta.changes, 2);
assert.equal((await db.batch([db.prepare('UPDATE x SET a = ?').bind('v')])).length, 1);
assert.deepEqual(calls.slice(-4).map(v => Array.isArray(v) ? 'execute' : v), ['begin','execute','commit','release']);
fail = true;
await assert.rejects(db.batch([db.prepare('UPDATE x SET a = ?').bind('v')]), /expected failure/);
assert.deepEqual(calls.slice(-4).map(v => Array.isArray(v) ? 'execute' : v), ['begin','execute','rollback','release']);
console.log('MySQL adapter contract and rollback tests passed (mock pool).');
