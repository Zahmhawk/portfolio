import assert from 'node:assert/strict';import {DatabaseSync} from 'node:sqlite';import {prepareChatProfileInitialization} from '../lib/chat-profile-initialize.mjs';
const sqlite=new DatabaseSync(':memory:');sqlite.exec('CREATE TABLE chat_profiles(user_id TEXT PRIMARY KEY,model TEXT NOT NULL,updated_at TEXT NOT NULL,encrypted_key TEXT)');
const d1={prepare(sql){return{bind(...args){return{async run(){return sqlite.prepare(sql).run(...args)}}}}}};
await prepareChatProfileInitialization(d1).bind('user','model','time').run();sqlite.prepare('UPDATE chat_profiles SET encrypted_key=?').run('cipher');
await prepareChatProfileInitialization(d1).bind('user','new model','new time').run();assert.deepEqual({...sqlite.prepare('SELECT model,updated_at,encrypted_key FROM chat_profiles').get()},{model:'model',updated_at:'time',encrypted_key:'cipher'});
let sql;prepareChatProfileInitialization({dialect:'mysql',prepare(value){sql=value;return {}}});assert.match(sql,/ON DUPLICATE KEY UPDATE user_id=user_id/);sqlite.close();console.log('Chat profile initialization: SQLite PASS; MySQL selection MOCK PASS.');
