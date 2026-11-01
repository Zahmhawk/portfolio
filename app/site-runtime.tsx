'use client';
import {shouldNotifyVersion} from '../lib/site-updates';
import {usePathname} from 'next/navigation';
import {useEffect,useRef,useState} from 'react';
import {RefreshCw,X} from 'lucide-react';
import {appearanceVariables} from '../lib/appearance';
const seenKey='portfolio-seen-versions-v1';
export default function SiteRuntime({initial}:{initial:any}){
 const pathname=usePathname(),isAdmin=pathname==='/admin'||pathname.startsWith('/admin/');
 const [update,setUpdate]=useState(''),[version,setVersion]=useState(initial.siteVersion||'1.0');
 const dismissed=useRef('');
 useEffect(()=>{
  let active=true,controller:AbortController|null=null,config=initial,revision=initial.revision,signedIn=false;
  const baseline=initial.siteVersion||'1.0',seen=new Set<string>();
  function readLocal(){try{const values=JSON.parse(localStorage.getItem(seenKey)||'[]');if(Array.isArray(values))values.filter(v=>typeof v==='string').forEach(v=>seen.add(v))}catch{}}
  function persist(){try{localStorage.setItem(seenKey,JSON.stringify([...seen].slice(-50)))}catch{}}
  async function remember(v:string){seen.add(v);persist();if(signedIn){try{const r=await fetch('/api/site-update-seen',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({version:v})});if(r.ok)return (await r.json() as any).first!==false}catch{}}return true}
  const publicPage=()=>location.pathname!=='/admin'&&!location.pathname.startsWith('/admin/');
  readLocal();
  const ready=(async()=>{try{const r=await fetch('/api/site-update-seen',{cache:'no-store'});if(r.ok){signedIn=true;const b:any=await r.json();if(Array.isArray(b.versions))b.versions.forEach((v:string)=>seen.add(v));persist();}}catch{}if(active&&publicPage())remember(baseline)})();
  function apply(){const settings=config.settings||initial.settings;if(settings){document.title=settings.browserTitle||settings.name+' | '+settings.role;const icon=document.querySelector<HTMLLinkElement>('link[rel="icon"]');if(icon)icon.href=settings.favicon||'/favicon.svg'}if(!config.themeConfigured)return;const dark=document.documentElement.dataset.theme==='dark';for(const [key,value] of Object.entries(appearanceVariables(config,dark)))document.documentElement.style.setProperty(key,value);document.documentElement.dataset.siteTheme=config.themePreset}
  apply();const observer=new MutationObserver(apply);observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  async function check(){if(document.hidden)return;await ready;if(!active)return;readLocal();controller?.abort();controller=new AbortController();try{const r=await fetch('/api/site-state',{cache:'no-store',signal:controller.signal});if(!r.ok)return;const b:any=await r.json();if(!active)return;config=b;apply();if(b.revision!==revision){window.dispatchEvent(new CustomEvent('portfolio-settings-update',{detail:b.settings}));revision=b.revision}const id=b.siteVersion;if(shouldNotifyVersion(baseline,id,location.pathname,dismissed.current)&&!seen.has(id)){const first=await remember(id);if(active&&first&&publicPage()){setVersion(id);setUpdate(id)}}else if(id===baseline){setUpdate('')}}catch{}}
  const changed=()=>void check(),storage=(e:StorageEvent)=>{if(e.key===seenKey){readLocal();setUpdate('')}};
  const timer=setInterval(check,30000);document.addEventListener('visibilitychange',changed);window.addEventListener('portfolio-content-changed',changed);window.addEventListener('storage',storage);
  return()=>{active=false;controller?.abort();clearInterval(timer);observer.disconnect();document.removeEventListener('visibilitychange',changed);window.removeEventListener('portfolio-content-changed',changed);window.removeEventListener('storage',storage)};
 },[initial.siteVersion]);
 return update&&!isAdmin?<aside className="site-update-toast" role="status"><div><strong>Website update available · نئی اپڈیٹ</strong><small>Version {version} — save unfinished work before refreshing.</small></div><button type="button" className="small-button" onClick={()=>location.reload()}><RefreshCw size={15}/>Refresh</button><button type="button" className="icon-button" aria-label="Dismiss update" onClick={()=>{dismissed.current=update;setUpdate('')}}><X size={17}/></button></aside>:null;
}
