import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { migrate, tables } from '../scripts/migrate-sqlite-to-mysql.mjs';

function source() {
  const db = new DatabaseSync(':memory:');
  for (const t of tables) db.exec(`CREATE TABLE "${t}" (id TEXT PRIMARY KEY); INSERT INTO "${t}" VALUES ('item')`);
  return db;
}
function mock({failTable, occupiedTable, badCollation, missingPrimary, maxLength} = {}) {
  const counts = Object.fromEntries(tables.map(t => [t, t === occupiedTable ? 1 : 0]));
  const calls = [];
  return {
    calls,
    async execute(sql, values) {
      if (sql.includes('INFORMATION_SCHEMA.COLUMNS')) return [[{name:'id', dataType:'varchar',columnType:'varchar(384)',nullable:'NO',maxLength:maxLength ?? 384,collation:badCollation ? 'utf8mb4_general_ci' : 'utf8mb4_0900_bin',defaultValue:null}]];
      if (sql.includes('INFORMATION_SCHEMA.TABLES')) return [[{engine:'InnoDB'}]];
      if (sql.includes('INFORMATION_SCHEMA.STATISTICS')) return [missingPrimary ? [] : [{name:'PRIMARY',nonUnique:0,position:1,columnName:'id',subPart:null}]];
      const table = sql.match(/^INSERT INTO `([^`]+)`/)[1];
      if (table === failTable) throw Object.assign(new Error('duplicate value'), {code:'ER_DUP_ENTRY'});
      counts[table]++; return [{affectedRows:1}];
    },
    async query(sql) { const table = sql.match(/FROM `([^`]+)`/)[1]; return [[{n:counts[table]}]]; },
    async beginTransaction() { calls.push('begin'); },
    async commit() { calls.push('commit'); },
    async rollback() { calls.push('rollback'); },
  };
}
let db = source(), connection = mock(), report = [];
await migrate(db, connection, line => report.push(line));
assert.equal(report.length, tables.length);
assert.deepEqual(connection.calls, ['begin', 'commit']);
assert.ok(report.every(x => x.endsWith('1 / 1 MATCH')));
db.close();
db = source(); connection = mock({failTable: 'chat_messages'}); report = [];
await assert.rejects(migrate(db, connection, line => report.push(line)), {code:'ER_DUP_ENTRY'});
assert.deepEqual(connection.calls, ['begin', 'rollback']);
assert.equal(report.length, 0);
db.close();
db = source(); connection = mock({occupiedTable:'accounts'});
await assert.rejects(migrate(db, connection, () => {}), /Destination table is not empty/);
assert.deepEqual(connection.calls, []);
db.close();
for (const [options, message] of [[{badCollation:true}, /collation mismatch/], [{missingPrimary:true}, /Unique index mismatch/], [{maxLength:2}, /length exceeds destination/]]) {
  db = source(); connection = mock(options);
  await assert.rejects(migrate(db, connection, () => {}), message);
  assert.deepEqual(connection.calls, []);
  db.close();
}
console.log('Migration inventory, row counts, empty destination and rollback tests passed (mock MySQL).');
