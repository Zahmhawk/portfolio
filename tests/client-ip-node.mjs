import assert from 'node:assert/strict';
import {resolveClientIp} from '../lib/client-ip-node.mjs';
assert.equal(resolveClientIp('203.0.113.1','198.51.100.2',[]),'203.0.113.1');
assert.equal(resolveClientIp('127.0.0.1','198.51.100.3, 192.0.2.2',['127.0.0.1']),'192.0.2.2');
assert.equal(resolveClientIp('203.0.113.1','198.51.100.2',['127.0.0.1']),'203.0.113.1');
assert.equal(resolveClientIp('127.0.0.1','invalid',['127.0.0.1']),'127.0.0.1');
assert.equal(resolveClientIp('invalid','198.51.100.1',['invalid']),null);
console.log('Trusted proxy IP resolution: unit PASS; not wired to Node entrypoint.');
