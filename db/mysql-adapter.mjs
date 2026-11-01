import mysql from 'mysql2/promise';
import { loadEnvFile } from '../lib/env-loader.mjs';

export { loadEnvFile };

export function createDatabase(pool) {
  function prepare(sql) {
    if (typeof sql !== 'string' || !sql.trim()) throw new TypeError('SQL is required');
    return statement(sql, [], false);
  }
  function statement(sql, values, requirePriorChange = false) {
    async function execute(connection) {
      const [result] = await connection.execute(sql, values);
      if (Array.isArray(result)) return { success: true, results: result, meta: { changes: 0 } };
      return { success: true, results: [], meta: { changes: result.affectedRows, last_row_id: result.insertId } };
    }
    return {
      bind(...next) { return statement(sql, next, requirePriorChange); },
      requirePreviousChanges() { return statement(sql, values, true); },
      async first(column) {
        const response = await execute(pool);
        const row = response.results[0] ?? null;
        return column && row ? row[column] ?? null : row;
      },
      async all() { return execute(pool); },
      async run() { return execute(pool); },
      _execute: execute,
      _requirePriorChange: requirePriorChange,
    };
  }
  return {
    dialect: 'mysql',
    prepare,
    async batch(statements) {
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();
        const results = [];
        let firstChanges = 1;
        for (let i = 0; i < statements.length; i++) {
          const item = statements[i];
          if (typeof item?._execute !== 'function') throw new TypeError('Invalid batch statement');
          if (item._requirePriorChange && firstChanges === 0) {
            results.push({ success: true, results: [], meta: { changes: 0 } });
            continue;
          }
          const res = await item._execute(connection);
          if (i === 0) firstChanges = res.meta?.changes ?? 0;
          results.push(res);
        }
        await connection.commit();
        return results;
      } catch (error) {
        try { await connection.rollback(); } catch { /* preserve original error */ }
        throw error;
      } finally { connection.release(); }
    },
    async consumeLoginToken(tokenHash, kind, now) {
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();
        const [rows] = await connection.execute(
          'SELECT user_id FROM login_tokens WHERE token_hash=? AND kind=? AND expires_at>? FOR UPDATE',
          [tokenHash, kind, now],
        );
        if (!rows.length) { await connection.commit(); return null; }
        const [deleted] = await connection.execute(
          'DELETE FROM login_tokens WHERE token_hash=? AND kind=? AND expires_at>?',
          [tokenHash, kind, now],
        );
        if (deleted.affectedRows !== 1) throw new Error('Token consumption failed');
        await connection.commit();
        return { user_id: rows[0].user_id };
      } catch (error) {
        try { await connection.rollback(); } catch { /* preserve original error */ }
        throw error;
      } finally { connection.release(); }
    },
    async close() { await pool.end(); },
  };
}

export function createMySqlDatabase(env = process.env) {
  if (env === process.env) loadEnvFile();
  for (const key of ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD']) {
    if (!env[key]) throw new Error(`${key} is required in environment variables (.env)`);
  }
  const port = Number(env.DB_PORT || 3306);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('DB_PORT must be a valid port');
  return createDatabase(mysql.createPool({
    host: env.DB_HOST,
    port,
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    charset: 'utf8mb4',
    supportBigNumbers: true,
    bigNumberStrings: false,
    decimalNumbers: true,
    multipleStatements: false,
  }));
}
