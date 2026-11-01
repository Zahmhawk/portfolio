import mysql from 'mysql2/promise';

// This adapter does not rewrite SQLite SQL. Every statement must be reviewed
// and converted before the Node runtime is connected to it.
export function createDatabase(pool) {
  function prepare(sql) {
    if (typeof sql !== 'string' || !sql.trim()) throw new TypeError('SQL is required');
    return statement(sql, []);
  }
  function statement(sql, values) {
    async function execute(connection) {
      const [result] = await connection.execute(sql, values);
      if (Array.isArray(result)) return { success: true, results: result, meta: { changes: 0 } };
      return { success: true, results: [], meta: { changes: result.affectedRows, last_row_id: result.insertId } };
    }
    return {
      bind(...next) { return statement(sql, next); },
      async first(column) {
        const response = await execute(pool);
        const row = response.results[0] ?? null;
        return column && row ? row[column] ?? null : row;
      },
      async all() { return execute(pool); },
      async run() { return execute(pool); },
      _execute: execute,
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
        for (const item of statements) {
          if (typeof item?._execute !== 'function') throw new TypeError('Invalid batch statement');
          results.push(await item._execute(connection));
        }
        await connection.commit();
        return results;
      } catch (error) {
        try { await connection.rollback(); } catch { /* preserve the original error */ }
        throw error;
      } finally { connection.release(); }
    },
    // One-time authentication tokens must be selected and deleted on the
    // same connection while the row is locked. Not yet wired into local-auth.
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
        try { await connection.rollback(); } catch { /* preserve the original error */ }
        throw error;
      } finally { connection.release(); }
    },
    async close() { await pool.end(); },
  };
}

export function createMySqlDatabase(env = process.env) {
  for (const key of ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD']) {
    if (!env[key]) throw new Error(`${key} is required`);
  }
  const port = Number(env.DB_PORT || 3306);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('DB_PORT must be a valid port');
  return createDatabase(mysql.createPool({
    host: env.DB_HOST, port, database: env.DB_NAME, user: env.DB_USER,
    password: env.DB_PASSWORD, waitForConnections: true, connectionLimit: 10,
    charset: 'utf8mb4', supportBigNumbers: true, bigNumberStrings: true,
    multipleStatements: false,
  }));
}
