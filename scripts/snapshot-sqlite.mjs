import { DatabaseSync, backup } from 'node:sqlite';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const [sourceArg, snapshotArg, reportArg] = process.argv.slice(2);
if (!sourceArg || !snapshotArg || !reportArg) {
  console.error('Usage: node scripts/snapshot-sqlite.mjs <source.sqlite> <new-snapshot.sqlite> <new-report.json>');
  process.exit(2);
}
const [source, snapshot, report] = [sourceArg, snapshotArg, reportArg].map(value => resolve(value));
if (new Set([source, snapshot, report]).size !== 3 || !existsSync(source) || existsSync(snapshot) || existsSync(report)) {
  throw new Error('Source must exist; snapshot and report must be distinct new paths.');
}
mkdirSync(dirname(snapshot), { recursive: true });
mkdirSync(dirname(report), { recursive: true });
const original = new DatabaseSync(source, { readOnly: true });
try { await backup(original, snapshot); } finally { original.close(); }
const db = new DatabaseSync(snapshot, { readOnly: true });
const quote = value => '"' + value.replaceAll('"', '""') + '"';
try {
  const objects = db.prepare("SELECT type, name, tbl_name, sql FROM sqlite_master WHERE name NOT LIKE 'sqlite_%' ORDER BY type, name").all();
  const tables = objects.filter(object => object.type === 'table').map(({ name }) => {
    const table = quote(name);
    const indexes = db.prepare(`PRAGMA index_list(${table})`).all().map(index => ({
      ...index, columns: db.prepare(`PRAGMA index_xinfo(${quote(index.name)})`).all()
    }));
    return {
      name,
      rows: db.prepare(`SELECT COUNT(*) AS count FROM ${table}`).get().count,
      columns: db.prepare(`PRAGMA table_info(${table})`).all(),
      foreignKeys: db.prepare(`PRAGMA foreign_key_list(${table})`).all(),
      indexes,
    };
  });
  const integrity = db.prepare('PRAGMA integrity_check').all();
  writeFileSync(report, JSON.stringify({ integrity, tables, objects }, null, 2), { flag: 'wx', mode: 0o600 });
  console.log(`Snapshot created; ${tables.length} tables inventoried. Integrity: ${integrity.map(x => x.integrity_check).join(', ')}`);
  console.log('Report contains schema metadata and row counts, not table records. Keep snapshot and report private.');
} finally { db.close(); }

