import {contentVisible} from './content-visibility';
import {researchConfig} from './research';
import {researchCategories} from './research-categories';
import {withDemoSurveys} from './research-demo';
import {withDemo} from './demo';
import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../app/chatgpt-auth';
import {defaults,seedEntries} from './defaults';
export const db=()=>{if(!env.DB)throw new Error('Database unavailable');return env.DB;};
export function json(data:any,status=200){return Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}})}
export function sameOrigin(r:Request){const o=r.headers.get('origin');return !o||o===new URL(r.url).origin;}
export async function admin(){const u=await getChatGPTUser();if(!u)return null;const a=await db().prepare('SELECT role FROM accounts WHERE user_id=?').bind(u.userId).first<{role:string}>();return a?.role==='owner'?u:null;}
export async function audit(user:string,action:string){await db().prepare('INSERT INTO audit (id,user_id,action,created_at) VALUES (?,?,?,?)').bind(crypto.randomUUID(),user,action,new Date().toISOString()).run()}
export async function publicData(){const s=await db().prepare("SELECT data FROM settings WHERE id='site'").first<{data:string}>();const all=await db().prepare("SELECT * FROM content ORDER BY position").all<any>();const initialized=await db().prepare("SELECT user_id FROM accounts WHERE role='owner' LIMIT 1").first();const sur=await db().prepare("SELECT id,title,description,version,config,status FROM surveys ORDER BY created_at DESC").all<any>();const feedback=await db().prepare("SELECT id,name,data FROM submissions WHERE kind='feedback' AND status='approved' ORDER BY created_at DESC LIMIT 12").all<any>();return {categories:researchCategories(s?JSON.parse(s.data):{}),feedback:feedback.results.filter(x=>JSON.parse(x.data).publicationConsent===true).map(x=>({id:x.id,name:x.name,rating:JSON.parse(x.data).rating,message:JSON.parse(x.data).message,programme:JSON.parse(x.data).programme})),settings:s?{...defaults,...JSON.parse(s.data)}:defaults,entries:initialized?withDemo(all.results,s?JSON.parse(s.data).demoContent!==false:true).filter(x=>contentVisible(x)):seedEntries,surveys:withDemoSurveys(sur.results,s?JSON.parse(s.data).demoContent!==false:true).filter(x=>(x.status===undefined||x.status==='published')&&researchCategories(s?JSON.parse(s.data):{}).some(c=>c.active&&c.id===researchConfig(x.config).audience)).map(x=>({id:x.id,title:x.title,description:x.description,version:x.version,config:JSON.stringify({audience:researchConfig(x.config).audience,assessmentType:researchConfig(x.config).assessmentType})}))}}
export async function throttle(contact:string,kind:string){const r=await db().prepare("SELECT count(*) AS n FROM submissions WHERE contact=? AND kind=? AND created_at>?").bind(contact,kind,new Date(Date.now()-60000).toISOString()).first<{n:number}>();return (r?.n||0)>=3;}
