import assert from 'node:assert/strict';
import {mkdtemp, mkdir, unlink, rmdir} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {createLocalFileStorage} from '../lib/file-storage-node.mjs';
const parent=resolve('outputs/storage-test'); await mkdir(parent,{recursive:true});
const directory=await mkdtemp(join(parent,'run-'));
const id='12345678-1234-4234-8234-123456789abc';
try {
  const storage=createLocalFileStorage(directory);
  assert.equal(await storage.get(id),null);
  const data=new Uint8Array([0,1,2,255]);
  await storage.put(id,data);
  assert.deepEqual((await storage.get(id)).body,data);
  await assert.rejects(storage.put(id,data),{code:'EEXIST'});
  await assert.rejects(storage.get('../outside'),/Invalid file ID/);
  await assert.rejects(storage.delete('../outside'),/Invalid file ID/);
  await storage.delete(id);
  assert.equal(await storage.get(id),null);
  await storage.delete(id);
  assert.throws(()=>createLocalFileStorage('relative'),/absolute private directory/);
  console.log('Local storage byte roundtrip, collision and traversal checks passed.');
} finally { try { await unlink(join(directory,id)); } catch(error) { if(error.code!=='ENOENT') throw error; } await rmdir(directory); }
