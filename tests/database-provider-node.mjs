import assert from 'node:assert/strict';
import {getDatabase,closeDatabase} from '../lib/database-provider-node.mjs';
const keys=['DB_HOST','DB_NAME','DB_USER','DB_PASSWORD'];
const old=Object.fromEntries(keys.map(key=>[key,process.env[key]]));
try {
  Object.assign(process.env,{DB_HOST:'127.0.0.1',DB_NAME:'test_only',DB_USER:'test_only',DB_PASSWORD:'test_only'});
  const a=getDatabase(),b=getDatabase(); assert.equal(a,b);
  await closeDatabase(); const c=getDatabase(); assert.notEqual(c,a); await closeDatabase();
  console.log('Node MySQL provider pool lifecycle: MOCK PASS; no MySQL connection attempted.');
} finally { for(const key of keys) old[key] === undefined ? delete process.env[key] : process.env[key]=old[key]; }
