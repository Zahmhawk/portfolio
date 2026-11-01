import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {prepareForBackend} from '../lib/sql-backend.mjs';
import {upsertSql} from '../lib/sql-upserts.mjs';
const sqlite=new DatabaseSync(':memory:');
sqlite.exec(`CREATE TABLE assistant_preferences(user_id TEXT PRIMARY KEY,memories TEXT,skills TEXT,budget_usd TEXT,updated_at TEXT);
CREATE TABLE chat_profiles(user_id TEXT PRIMARY KEY,encrypted_key TEXT,model TEXT,updated_at TEXT,voice_name TEXT DEFAULT 'Kore');
CREATE TABLE surveys(id TEXT PRIMARY KEY,title TEXT,description TEXT,consent TEXT,questions TEXT,status TEXT,version INTEGER,config TEXT,created_at TEXT);`);
const d1={prepare(sql){return{bind(...params){return{run:async()=>sqlite.prepare(sql).run(...params)}}}}};
async function write(key,params){await prepareForBackend(d1,...upsertSql[key]).bind(...params).run()}
await write('assistantPreferences',['u','a','b','1','t1']);await write('assistantPreferences',['u','c','d','2','t2']);
assert.deepEqual({...sqlite.prepare('SELECT memories,skills,budget_usd,updated_at FROM assistant_preferences').get()},{memories:'c',skills:'d',budget_usd:'2',updated_at:'t2'});
await write('chatProfile',['u','cipher1','model1','t1']);await write('chatProfile',['u','cipher2','model2','t2']);
assert.deepEqual({...sqlite.prepare('SELECT encrypted_key,model,voice_name FROM chat_profiles').get()},{encrypted_key:'cipher2',model:'model2',voice_name:'Kore'});
await write('survey',['s','a','d','c','q','draft',1,'cfg','original']);await write('survey',['s','b','d2','c2','q2','published',99,'cfg2','different']);
assert.deepEqual({...sqlite.prepare('SELECT title,status,version,created_at FROM surveys').get()},{title:'b',status:'published',version:1,created_at:'original'});
for(const pair of Object.values(upsertSql)){let selected;prepareForBackend({dialect:'mysql',prepare(sql){selected=sql;return {}}},...pair);assert.equal(selected,pair[1])}
sqlite.close();
console.log('Three SQLite upsert insert/update contracts PASS; MySQL selection MOCK PASS.');
