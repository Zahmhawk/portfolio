import assert from 'node:assert/strict';import ts from 'typescript';import {readFileSync} from 'node:fs';import {createRequire,Module} from 'node:module';import path from 'node:path';import {DatabaseSync} from 'node:sqlite';
const source=readFileSync('lib/geography-loader.ts','utf8');const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;const {loadGeography,isCountryData,isPlaces}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
const pk=JSON.parse(readFileSync('public/geography/PK.json'));assert.ok(isCountryData(pk));const sindh=pk.regions.find(r=>r.name==='Sindh'),sanghar=sindh.districts.find(d=>d.name==='Sanghar');const key=sindh.id+'.'+sanghar.id;assert.ok(pk.cityFileKeys.includes(key));const places=JSON.parse(readFileSync('public/geography/PK/'+key+'.json'));assert.ok(isPlaces(places));for(const name of ['Sanghar','Shahdadpur','Tando Adam'])assert.ok(places.some(p=>p[1]===name&&p[2]==='Asia/Karachi'));
const realFetch=globalThis.fetch;const signal=()=>new AbortController().signal;let calls=0;
try{
 globalThis.fetch=async()=>{calls++;return calls===1?new Response('fail',{status:503}):Response.json(pk)};
 await assert.rejects(loadGeography('/retry','v',isCountryData,signal()),/503/);assert.equal((await loadGeography('/retry','v',isCountryData,signal())).country,'PK');
 await loadGeography('/retry','v',isCountryData,signal());assert.equal(calls,2);
 globalThis.fetch=async()=>new Response('<html>login</html>',{headers:{'Content-Type':'text/html'}});await assert.rejects(loadGeography('/html','v',isCountryData,signal()),/different page/);
 globalThis.fetch=async()=>Response.json({regions:null});await assert.rejects(loadGeography('/bad','v',isCountryData,signal()),/format/);
 globalThis.fetch=(_,options)=>new Promise((resolve,reject)=>options.signal.addEventListener('abort',()=>reject(new DOMException('Aborted','AbortError'))));await assert.rejects(loadGeography('/stall','v',isCountryData,signal(),20),/timed out/);
 const c=new AbortController();const req=loadGeography('/cancel','v',isCountryData,c.signal);c.abort();await assert.rejects(req,/Abort/);
}finally{globalThis.fetch=realFetch}
// Run the existing intake serializer used by publication, contact, registration and survey APIs.
const require=createRequire(import.meta.url);const original=require.extensions['.ts'];require.extensions['.ts']=(m,file)=>m._compile(ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,file);
const {intakeRecord}=require('../lib/intake.ts');const raw={country:'Pakistan',province:'Sindh',district:'Sanghar',city:'Sanghar',timezone:'Asia/Karachi'};
for(const context of ['publication','contact','registration','survey']){const saved=intakeRecord(raw,{},context);for(const [k,v] of Object.entries(raw))assert.equal(saved[k],v)}
const db=new DatabaseSync(':memory:');db.exec('CREATE TABLE submissions (data TEXT)');db.prepare('INSERT INTO submissions(data) VALUES(?)').run(JSON.stringify({profile:intakeRecord(raw,{},'publication')}));assert.deepEqual(JSON.parse(db.prepare('SELECT data FROM submissions').get().data).profile,raw);db.close();if(original)require.extensions['.ts']=original;else delete require.extensions['.ts'];
console.log('PASS: actual Sanghar source, schema checks, timeout, cancellation, failure/retry, successful-only cache, HTML rejection, shared intake serialization and isolated SQLite round-trip.');
