// Staging-only import. Source must be a consistent snapshot created separately.
// The destination must already have a reviewed MySQL schema and be empty.
import { DatabaseSync } from 'node:sqlite';
import mysql from 'mysql2/promise';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const tables = [
  'accounts','login_credentials','login_sessions','login_attempts','login_tokens',
  'settings','content','revisions','files','submissions','surveys','answers',
  'survey_sessions','publication_access','audit','admin_changes','chat_profiles',
  'chat_threads','chat_messages','chat_connections','chat_limits','voice_limits',
  'chat_requests','ai_usage','assistant_preferences','assistant_survey_drafts',
  'site_update_views',
];
const identifier = name => '`' + name.replaceAll('`','``') + '`';
const sqliteIdentifier = name => '"' + name.replaceAll('"','""') + '"';

export async function migrate(source, connection, report = console.log) {
  let transaction = false;
  try {
    source.exec('BEGIN');
    const sourceTables = source.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all().map(x => x.name).filter(x => !['_cf_METADATA','d1_migrations'].includes(x)).sort();
    if (JSON.stringify(sourceTables) !== JSON.stringify([...tables].sort())) throw new Error('Unexpected source table inventory');
    const definitions = [];
    const summary = [];
    for (const table of tables) {
      const sourceColumns = source.prepare(`PRAGMA table_info(${sqliteIdentifier(table)})`).all();
      const columns = sourceColumns.map(x => x.name);
      const [destination] = await connection.execute('SELECT COLUMN_NAME AS name, DATA_TYPE AS dataType, COLUMN_TYPE AS columnType, IS_NULLABLE AS nullable, CHARACTER_MAXIMUM_LENGTH AS maxLength, COLLATION_NAME AS collation, COLUMN_DEFAULT AS defaultValue FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME=? ORDER BY ORDINAL_POSITION', [table]);
      if (JSON.stringify(columns) !== JSON.stringify(destination.map(x => x.name))) throw new Error(`Column mismatch in ${table}`);
      for (let i = 0; i < columns.length; i++) {
        const src = sourceColumns[i], dest = destination[i], col = sqliteIdentifier(src.name);
        if ((src.notnull === 1 || src.pk > 0) !== (dest.nullable === 'NO')) throw new Error(`Nullability mismatch in ${table}.${src.name}`);
        const sourceDefault = src.dflt_value === null ? null : String(src.dflt_value).replace(/^'(.*)'$/, '$1').replaceAll("''", "'");
        const destDefault = dest.defaultValue === null ? null : String(dest.defaultValue).replace(/^\('(.*)'\)$/, '$1');
        if (sourceDefault !== destDefault) throw new Error(`Default mismatch in ${table}.${src.name}`);
        if (src.type.toUpperCase() === 'INTEGER') {
          if (dest.dataType !== 'bigint' || /unsigned/i.test(dest.columnType)) throw new Error(`Integer type mismatch in ${table}.${src.name}`);
          const bad = source.prepare(`SELECT COUNT(*) AS n FROM ${sqliteIdentifier(table)} WHERE ${col} IS NOT NULL AND typeof(${col}) <> 'integer'`).get().n;
          if (bad) throw new Error(`Non-integer source data in ${table}.${src.name}`);
        } else if (src.type.toUpperCase() === 'TEXT') {
          if (!['varchar', 'longtext'].includes(dest.dataType) || dest.collation !== 'utf8mb4_0900_bin') throw new Error(`Text type or collation mismatch in ${table}.${src.name}`);
          const stats = source.prepare(`SELECT COUNT(*) AS n, MAX(length(${col})) AS maxLength FROM ${sqliteIdentifier(table)} WHERE ${col} IS NOT NULL AND typeof(${col}) <> 'text'`).get();
          if (stats.n) throw new Error(`Non-text source data in ${table}.${src.name}`);
          if (dest.dataType === 'varchar') {
            const max = source.prepare(`SELECT MAX(length(${col})) AS n FROM ${sqliteIdentifier(table)}`).get().n;
            if (max !== null && max > Number(dest.maxLength)) throw new Error(`Text length exceeds destination in ${table}.${src.name}`);
          }
        } else throw new Error(`Unsupported source type in ${table}.${src.name}`);
      }
      const sourceIndexes = source.prepare(`PRAGMA index_list(${sqliteIdentifier(table)})`).all().filter(x => x.unique).map(index => ({
        primary: index.origin === 'pk',
        columns: source.prepare(`PRAGMA index_info(${sqliteIdentifier(index.name)})`).all().map(x => x.name),
      }));
      const [indexes] = await connection.execute('SELECT INDEX_NAME AS name, NON_UNIQUE AS nonUnique, SEQ_IN_INDEX AS position, COLUMN_NAME AS columnName, SUB_PART AS subPart FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME=? ORDER BY INDEX_NAME, SEQ_IN_INDEX', [table]);
      const mysqlIndexes = new Map();
      for (const index of indexes) {
        if (Number(index.nonUnique) !== 0) continue;
        if (index.subPart !== null) throw new Error(`Prefix index is incompatible in ${table}`);
        if (!mysqlIndexes.has(index.name)) mysqlIndexes.set(index.name, []);
        mysqlIndexes.get(index.name).push(index.columnName);
      }
      const signature = (primary, cols) => JSON.stringify([primary, cols]);
      const expected = sourceIndexes.map(x => signature(x.primary, x.columns)).sort();
      const actual = [...mysqlIndexes].map(([name, cols]) => signature(name === 'PRIMARY', cols)).sort();
      if (JSON.stringify(expected) !== JSON.stringify(actual)) throw new Error(`Unique index mismatch in ${table}`);
      const [engine] = await connection.execute('SELECT ENGINE AS engine FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME=?', [table]);
      if (engine.length !== 1 || String(engine[0].engine).toLowerCase() !== 'innodb') throw new Error(`Table must use InnoDB: ${table}`);
      const [count] = await connection.query(`SELECT COUNT(*) AS n FROM ${identifier(table)}`);
      if (Number(count[0].n) !== 0) throw new Error(`Destination table is not empty: ${table}`);
      definitions.push({ table, columns });
    }
    await connection.beginTransaction(); transaction = true;
    for (const {table, columns} of definitions) {
      const query = `INSERT INTO ${identifier(table)} (${columns.map(identifier).join(',')}) VALUES (${columns.map(() => '?').join(',')})`;
      const reader = source.prepare(`SELECT * FROM ${sqliteIdentifier(table)}`);
      reader.setReadBigInts(true);
      let count = 0;
      for (const row of reader.iterate()) {
        const values = columns.map(name => typeof row[name] === 'bigint' ? row[name].toString() : row[name]);
        await connection.execute(query, values);
        count++;
      }
      const [destination] = await connection.query(`SELECT COUNT(*) AS n FROM ${identifier(table)}`);
      const actual = Number(destination[0].n);
      if (actual !== count) throw new Error(`Count mismatch in ${table}`);
      summary.push(`${table}: ${count} / ${actual} MATCH`);
    }
    await connection.commit(); transaction = false;
    source.exec('COMMIT');
    for (const line of summary) report(line);
  } catch (error) {
    if (transaction) { try { await connection.rollback(); } catch {} }
    try { source.exec('ROLLBACK'); } catch {}
    throw error;
  }
}

async function main() {
  if (process.env.MIGRATION_TARGET !== 'staging') throw new Error('MIGRATION_TARGET must be staging; production import is prohibited');
  for (const key of ['DB_HOST','DB_NAME','DB_USER','DB_PASSWORD']) if (!process.env[key]) throw new Error(`${key} is required`);
  const file = process.argv[2];
  if (!file) throw new Error('Usage: node scripts/migrate-sqlite-to-mysql.mjs <snapshot.sqlite>');
  const port = Number(process.env.DB_PORT || 3306);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid DB_PORT');
  const source = new DatabaseSync(resolve(file), {readOnly: true});
  let connection;
  try {
    connection = await mysql.createConnection({host:process.env.DB_HOST,port,user:process.env.DB_USER,password:process.env.DB_PASSWORD,database:process.env.DB_NAME,charset:'utf8mb4',multipleStatements:false});
    await migrate(source, connection);
    console.log('Staging import committed.');
  } finally { source.close(); if (connection) await connection.end(); }
}
if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  main().catch(error => { console.error('Migration failed:', error.code || error.message); process.exitCode = 1; });
}

