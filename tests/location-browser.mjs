import {build} from 'esbuild';import {createServer} from 'node:http';import {readFile} from 'node:fs/promises';import {spawn} from 'node:child_process';
await build({entryPoints:['tests/fixtures/location-harness.tsx'],bundle:true,format:'esm',jsx:'automatic',outfile:'.wrangler/location-check/client.js'});
const server=createServer(async(req,res)=>{try{const path=new URL(req.url,'http://localhost').pathname;const file=path==='/client.js'?'.wrangler/location-check/client.js':path.startsWith('/geography/')?'public'+path:path==='/style.css'?'app/globals.css':null;if(file){res.setHeader('Content-Type',file.endsWith('.json')?'application/json':file.endsWith('.css')?'text/css':'text/javascript');res.end(await readFile(file));}else {res.setHeader('Content-Type','text/html');res.end((req.url.includes('saved=1')?'<script>window.initial={country:"PK",province:"Sindh",district:"Sanghar",city:"Sanghar",timezone:"Asia/Karachi"}</script>':'')+'<meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/style.css"><div id="root"></div><script type="module" src="/client.js"></script>');}}catch{res.statusCode=404;res.end('missing')}}).listen(5199,'127.0.0.1');
const chrome=spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--no-first-run','--no-default-browser-check','--remote-debugging-port=9241','--user-data-dir='+process.cwd()+'/.wrangler/location-check/chrome','about:blank'],{windowsHide:true,stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));let tabs;for(let i=0;i<50;i++){try{tabs=await (await fetch('http://127.0.0.1:9241/json')).json();break}catch{await sleep(100)}}
const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);let id=0;const pending=new Map();ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)?.(m);pending.delete(m.id)}};const cdp=(method,params={})=>new Promise(r=>{const n=++id;pending.set(n,r);ws.send(JSON.stringify({id:n,method,params}))});
const run=async expression=>{const r=await cdp('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.result.exceptionDetails)throw Error(JSON.stringify(r.result.exceptionDetails));return r.result.result.value};
await cdp('Runtime.enable');ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.method==='Runtime.exceptionThrown')console.log('BROWSER EXCEPTION',JSON.stringify(m.params.exceptionDetails));});
await cdp('Page.navigate',{url:'http://127.0.0.1:5199'});await sleep(1500);
try {console.log(await run(`(async()=>{
 const wait=ms=>new Promise(r=>setTimeout(r,ms));
 const check=(ok,name)=>{if(!ok)throw Error(name);results.push(name)};const results=[];
 const combo=name=>document.querySelector('button[role=combobox][aria-label="'+name+'"]');
 async function choose(name,text){const c=combo(name);for(let i=0;c.disabled&&i<100;i++)await wait(50);if(c.disabled)throw Error(name+' disabled');c.click();await wait(30);const list=document.getElementById(c.getAttribute('aria-controls'));let option=[...list.querySelectorAll('button[role=option]')].find(b=>b.textContent===text);if(!option){const search=c.parentElement.querySelector('input[type=search]');const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;setter.call(search,text);search.dispatchEvent(new Event('input',{bubbles:true}));await wait(30);option=[...list.querySelectorAll('button[role=option]')].find(b=>b.textContent===text)}if(!option)throw Error('Missing '+text);option.click();await wait(100)}
 const hidden=name=>document.querySelector('input[name='+name+']').value;
 await choose('Choose country','Pakistan');await wait(200);await choose('Choose state or province','Sindh');await choose('Choose district','Sanghar');await wait(200);
 const cityOptions=[...combo('Choose city').parentElement.querySelectorAll('select option')].map(o=>o.textContent);
 check(['Sanghar','Tando Adam','Shahdadpur'].every(name=>cityOptions.some(o=>o.startsWith(name))),'Pakistan > Sindh > Sanghar source cities loaded');
 const citySelect=combo('Choose city').parentElement.querySelector('select');citySelect.value=[...citySelect.options].find(o=>o.textContent.startsWith('Sanghar')).value;citySelect.dispatchEvent(new Event('change',{bubbles:true}));await wait(50);
 check(hidden('city')==='Sanghar'&&hidden('timezone')==='Asia/Karachi','Selected city and timezone submitted as names');
 const data=Object.fromEntries(new FormData(document.querySelector('form')));check(data.country==='Pakistan'&&data.province==='Sindh'&&data.district==='Sanghar'&&data.city==='Sanghar','FormData keeps all location fields');
 await choose('Choose state or province','Punjab');check(!hidden('district')&&!hidden('city'),'Province change clears district and city');
 await choose('Choose country','United States');await wait(150);await choose('Choose state or province','California');check(!hidden('city')&&hidden('province')==='California','Second country loads real regions and clears old city');
 const originalFetch=window.fetch;let fail=true;
 window.fetch=async(url,options)=>{if(String(url).includes('/geography/CA.json')&&fail)return new Response('failed',{status:503});return originalFetch(url,options)};
 await choose('Choose country','Canada');await wait(150);check(document.querySelector('[role=alert]')?.textContent.includes('503'),'Failed country request shows explicit error');
 fail=false;[...document.querySelectorAll('button')].find(b=>b.textContent==='Retry').click();await wait(250);check(!combo('Choose state or province').disabled&&!document.querySelector('[role=alert]'),'Retry clears error and loads country');
 window.fetch=async(url,options)=>{if(String(url).includes('/geography/FR.json')){await wait(500);return originalFetch(url)}return originalFetch(url,options)};
 await choose('Choose country','France');await choose('Choose country','Germany');await wait(700);check(hidden('country')==='Germany'&&combo('Choose state or province').parentElement.textContent.includes('Bavaria'),'Late response cannot overwrite newer country');
 window.fetch=originalFetch;
 await choose('Choose country','Pakistan');await choose('Choose state or province','Sindh');
 let failCities=true;window.fetch=async(url,options)=>{if(String(url).includes('/geography/PK/')&&failCities)return new Response('failed',{status:503});return originalFetch(url,options)};
 await choose('Choose district','Hyderabad District');await wait(100);check(document.querySelector('[role=alert]')?.textContent.includes('503'),'City request failure is explicit');
 failCities=false;[...document.querySelectorAll('button')].find(b=>b.textContent==='Retry cities').click();await wait(200);check(!document.querySelector('[role=alert]')&&!combo('Choose city').disabled,'City retry recovers without resetting parents');
 window.fetch=originalFetch;await choose('Choose country','Antarctica');await wait(100);check(document.body.textContent.includes('No regions are listed'),'Unavailable source level has an explicit empty state');
 document.documentElement.dataset.theme='dark';check(!!getComputedStyle(combo('Choose country')).backgroundColor,'Dark styling remains available');
 return {results,sourceCityCount:cityOptions.length-2};
})()`));
await cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
await cdp('Page.navigate',{url:'http://127.0.0.1:5199/?saved=1'});await sleep(900);
console.log(await run(`(async()=>{const wait=ms=>new Promise(r=>setTimeout(r,ms));const hidden=k=>document.querySelector('input[name='+k+']').value;if(hidden('country')!=='Pakistan'||hidden('province')!=='Sindh'||hidden('district')!=='Sanghar'||hidden('city')!=='Sanghar'||hidden('timezone')!=='Asia/Karachi')throw Error('Saved profile not restored');const button=document.querySelector('button[aria-label="Choose state or province"]');button.focus();button.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true}));await wait(80);if(button.getAttribute('aria-expanded')!=='true')throw Error('Keyboard open failed');button.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));await wait(30);if(button.getAttribute('aria-expanded')!=='false')throw Error('Keyboard close failed');return 'PASS: saved profile restored from country code, timezone retained, dropdown keyboard open/close at mobile viewport';})()`));
}finally{ws.close();chrome.kill();server.close();}

