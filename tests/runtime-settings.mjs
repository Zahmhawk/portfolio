import assert from 'node:assert/strict';
import {getRuntimeSetting} from '../lib/runtime-settings-node.mjs';
import {encryptKey,decryptKey} from '../lib/chat-crypto.ts';
const original=process.env.CHAT_ENCRYPTION_KEY;
try {
  // Synthetic test input only; the real key and credentials are never read or logged.
  const fixture=Buffer.alloc(32,7).toString('base64');
  process.env.CHAT_ENCRYPTION_KEY=fixture;
  assert.equal(getRuntimeSetting('CHAT_ENCRYPTION_KEY'),fixture);
  const cipher=await encryptKey('fixture-value','fixture-user',getRuntimeSetting('CHAT_ENCRYPTION_KEY'));
  assert.equal(await decryptKey(cipher,'fixture-user',getRuntimeSetting('CHAT_ENCRYPTION_KEY')),'fixture-value');
  await assert.rejects(decryptKey(cipher,'other-user',getRuntimeSetting('CHAT_ENCRYPTION_KEY')));
  assert.throws(()=>getRuntimeSetting('NOT_ALLOWED'));
  console.log('Runtime setting and synthetic encryption roundtrip: PASS.');
} finally { if(original===undefined)delete process.env.CHAT_ENCRYPTION_KEY;else process.env.CHAT_ENCRYPTION_KEY=original; }
