import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { tables } from '../scripts/migrate-sqlite-to-mysql.mjs';
const report=JSON.parse(readFileSync('outputs/hostinger-audit/schema-report.json','utf8'));
const sql=readFileSync('db/mysql-migrations/0001_schema.sql','utf8');
const actual=[...sql.matchAll(/CREATE TABLE `([^`]+)` \(([\s\S]*?)\n\) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;/g)];
assert.equal(actual.length, tables.length);
for(const [,name,body] of actual){
 const source=report.tables.find(t=>t.name===name); assert.ok(source,`Unexpected table ${name}`);
 const columns=[...body.matchAll(/^  `([^`]+)` (?:VARCHAR\(384\)|LONGTEXT|BIGINT)/gm)].map(m=>m[1]);
 assert.deepEqual(columns,source.columns.map(c=>c.name),`Columns for ${name}`);
 const primary=source.columns.filter(c=>c.pk).sort((a,b)=>a.pk-b.pk).map(c=>c.name);
 const primaryMatch=body.match(/PRIMARY KEY \(([^)]+)\)/);
 assert.deepEqual([...primaryMatch[1].matchAll(/`([^`]+)`/g)].map(m=>m[1]),primary,`Primary key for ${name}`);
 for(const idx of source.indexes.filter(i=>i.origin!=='pk'))assert.ok(body.includes('KEY `'+idx.name+'`'),`Index ${idx.name}`);
}
console.log('All 27 schema drafts match snapshot column order and primary/index names (static check).');
