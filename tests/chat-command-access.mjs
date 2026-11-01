import assert from 'node:assert/strict';import ts from 'typescript';import {readFileSync} from 'node:fs';import {createRequire,Module} from 'node:module';import path from 'node:path';
const require=createRequire(import.meta.url);
function load(file,overrides={}){const filename=path.resolve(file),m=new Module(filename);m.filename=filename;m.paths=Module._nodeModulePaths(path.dirname(filename));const original=m.require.bind(m);m.require=id=>Object.hasOwn(overrides,id)?overrides[id]:original(id);m._compile(ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true,target:ts.ScriptTarget.ES2022}}).outputText,filename);return m.exports}
let identity=null,writes=0,preferenceReads=0,role='viewer';
const database={prepare(sql){return {bind(){return this},async first(){return sql.includes('SELECT role')?{role}:{requests:0}},async all(){return {results:[]}},async run(){writes++;return {success:true}}}}};
const serverSource=readFileSync('lib/server.ts','utf8');const adminSource=serverSource.slice(serverSource.indexOf('export async function admin()'),serverSource.indexOf('export async function audit('));const compiled=ts.transpileModule(adminSource,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const exports={};new Function('exports','getChatGPTUser','db',compiled)(exports,async()=>identity,()=>database);
const server={admin:exports.admin,db:()=>database,json:(data,status=200)=>Response.json(data,{status}),sameOrigin:r=>!r.headers.get('origin')||r.headers.get('origin')===new URL(r.url).origin};
const preferences=async()=>{preferenceReads++;return {memories:[],skills:[],budgetUsd:0}};
const routes={preferences:load('app/api/chat/preferences/route.ts',{'../../../../lib/server':server,'../../../../lib/assistant-preferences':{preferences}}),usage:load('app/api/chat/usage/route.ts',{'../../../../lib/server':server,'../../../../lib/assistant-preferences':{preferences}})};
const request=body=>new Request('https://site.test/api/chat/preferences',{method:'POST',headers:{Origin:'https://site.test','Content-Type':'application/json'},body:JSON.stringify(body)});
for(const user of [null,{userId:'fixture-viewer',isAdmin:true}]){identity=user;role='viewer';assert.equal((await routes.preferences.GET()).status,403);assert.equal((await routes.preferences.POST(request({memories:[],skills:[],budgetUsd:0}))).status,403);assert.equal((await routes.usage.GET()).status,403)}
assert.equal(writes,0);assert.equal(preferenceReads,0);
identity={userId:'fixture-owner'};role='owner';assert.equal((await routes.preferences.GET()).status,200);assert.equal((await routes.usage.GET()).status,200);
assert.equal((await routes.preferences.POST(request({memories:[],skills:[],budgetUsd:0}))).status,200);assert.equal(writes,1);
assert.equal((await routes.preferences.POST(request({memories:[{name:'invalid',text:''}],skills:[],budgetUsd:0}))).status,400);
const cross=new Request('https://site.test/api/chat/preferences',{method:'POST',headers:{Origin:'https://other.test'},body:'{}'});assert.equal((await routes.preferences.POST(cross)).status,403);
const window=load('app/chat-command-window.tsx',{'../lib/chat-commands':load('lib/chat-commands.ts'),'./smart-select':{default:()=>null},'./admin/assistant-history':{default:()=>null}}).default;const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
for(const isAdmin of [false,undefined,'true'])assert.equal(renderToStaticMarkup(React.createElement(window,{command:'help',account:{isAdmin},ur:false,close(){},reload:async()=>{},planning:false})), '');
assert.ok(renderToStaticMarkup(React.createElement(window,{command:'help',account:{isAdmin:true},ur:false,close(){},reload:async()=>{},planning:false})).includes('/memory'));
const chat=readFileSync('app/ai-chat.tsx','utf8').replace(/\s/g,'');assert.ok(chat.includes('constsuggestions=account?.isAdmin===true&&'));assert.ok(chat.includes("if(cmd.startsWith('/')){if(account?.isAdmin!==true)"));assert.ok(chat.includes('command&&account?.signedIn&&account?.isAdmin===true&&'));
console.log('PASS: anonymous/viewer/forged admin flag denied; database owner permitted; preference validation and origin checks preserved; unauthorized reads/writes prevented; command window restricted to strict admin flag.');
