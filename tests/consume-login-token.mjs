import {DatabaseSync} from 'node:sqlite';
import assert from 'node:assert/strict';
import {consumeLoginToken} from '../lib/consume-login-token.mjs';
const sqlite=new DatabaseSync(':memory:');
sqlite.exec('CREATE TABLE login_tokens(token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL, kind TEXT NOT NULL, expires_at TEXT NOT NULL)');
const db={prepare(sql){return {bind(...values){return {async first(){return sqlite.prepare(sql).get(...values) ?? null}}}}}};
const insert=sqlite.prepare('INSERT INTO login_tokens VALUES(?,?,?,?)');
for(const kind of ['verify','reset','reset_otp','google','apple']){
 insert.run(kind,'user',kind,'2030-01-01T00:00:00.000Z');
 assert.equal((await consumeLoginToken(db,kind,kind,'2029-01-01T00:00:00.000Z')).user_id,'user');
 assert.equal(await consumeLoginToken(db,kind,kind,'2029-01-01T00:00:00.000Z'),null);
}
insert.run('expired','user','verify','2028-01-01T00:00:00.000Z');
assert.equal(await consumeLoginToken(db,'expired','verify','2029-01-01T00:00:00.000Z'),null);
insert.run('wrong-kind','user','verify','2030-01-01T00:00:00.000Z');
assert.equal(await consumeLoginToken(db,'wrong-kind','reset','2029-01-01T00:00:00.000Z'),null);
let seen;const mysql={async consumeLoginToken(...args){seen=args;return {user_id:'user'}}};
assert.equal((await consumeLoginToken(mysql,'hash','verify','now')).user_id,'user');
assert.deepEqual(seen,['hash','verify','now']);
sqlite.close();
console.log('Token dispatch and expiry: SQLite PASS, MySQL dispatch MOCK PASS.');
