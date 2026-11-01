import assert from 'node:assert/strict';
import {createDatabase} from '../db/mysql-adapter.mjs';
// Models a row lock, but does not replace a concurrency test against MySQL.
for (const kind of ['verify','reset','reset_otp','google','apple']) {
  let token = {kind, expires:'2030-01-01', user_id:'user'};
  let unlock = Promise.resolve();
  const pool = {async getConnection() {
    let releaseLock = null, deleted = false;
    return {
      async beginTransaction() {},
      async execute(sql, args) {
        if (sql.startsWith('SELECT')) {
          const prior=unlock; unlock=new Promise(resolve=>{releaseLock=resolve}); await prior;
          return [[token && token.kind===args[1] && token.expires>args[2] ? {user_id:token.user_id} : null].filter(Boolean)];
        }
        if (sql.startsWith('DELETE')) { deleted=!!token; token=null; return [{affectedRows:deleted?1:0}]; }
        throw new Error('Unexpected SQL');
      },
      async commit(){ releaseLock?.(); releaseLock=null; },
      async rollback(){ releaseLock?.(); releaseLock=null; },
      release() {},
    };
  }, async end() {}};
  const db=createDatabase(pool);
  const results=await Promise.all([db.consumeLoginToken('hash',kind,'2029-01-01'),db.consumeLoginToken('hash',kind,'2029-01-01')]);
  assert.equal(results.filter(Boolean).length,1);
}
console.log('One-time token locking: MOCK PASS for verify, reset, OTP and OAuth kinds.');
