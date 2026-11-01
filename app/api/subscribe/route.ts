import {getChatGPTUser} from '../../chatgpt-auth';
import {db,json,sameOrigin} from '../../../lib/server';
import {hash} from '../../../lib/community';
import {cleanString} from '../../../lib/validation';

const normalize=(email:string)=>email.trim().toLowerCase();
async function accountEmail(){
  const user=await getChatGPTUser();
  if(!user)return {signedIn:false,email:''};
  // userId comes from the authenticated server session, never request parameters.
  const account=await db().prepare('SELECT email,verified FROM login_credentials WHERE user_id=?').bind(user.userId).first<{email:string;verified:number}>();
  if(!account||account.verified!==1)throw Error('Verify your account email before managing its subscription.');
  return {signedIn:true,email:normalize(account.email)};
}
function remember(r:Request,id:string,token:string){return `portfolio_subscription=${encodeURIComponent(id+'.'+token)}; Path=/; Max-Age=31536000; HttpOnly;${new URL(r.url).protocol==='https:'?' Secure;':''} SameSite=Lax`}
async function remembered(r:Request){
  const raw=(r.headers.get('cookie')||'').split(';').map(v=>v.trim()).find(v=>v.startsWith('portfolio_subscription='));if(!raw)return null;
  let id:string,token:string;
  try{const value=decodeURIComponent(raw.slice('portfolio_subscription='.length)),dot=value.indexOf('.');id=value.slice(0,dot);token=value.slice(dot+1);if(!/^sub_[a-f0-9]{64}$/.test(id)||!token||token.length>100)return null}catch{return null}
  const row=await db().prepare("SELECT contact,data,status FROM submissions WHERE id=? AND kind='subscriber'").bind(id).first<any>();
  if(!row)return null;
  let saved:any;try{saved=JSON.parse(row.data)}catch{throw Error('Subscription record could not be read.')}
  return saved.tokenHash===await hash(token)?{...row,id,token}:null;
}
export async function GET(r:Request){
  try{
    const account=await accountEmail();
    if(account.signedIn){
      const id='sub_'+await hash(account.email);
      const row=await db().prepare("SELECT status FROM submissions WHERE id=? AND kind='subscriber'").bind(id).first<any>();
      return json({...account,subscribed:row?.status==='active'});
    }
    const row=await remembered(r);
    return json({signedIn:false,subscribed:row?.status==='active',...(row?.status==='active'?{manageURL:'/unsubscribe?id='+row.id+'&token='+row.token}:{})});
  }catch{return json({error:'Subscription status could not be checked. Please retry. If your email is unverified, verify it first.'},503)}
}
export async function POST(r:Request){
  if(!sameOrigin(r))return json({error:'Forbidden'},403);
  let b:any;try{const raw=await r.text();if(raw.length>4000)throw Error();b=JSON.parse(raw)}catch{return json({error:'Invalid request'},400)}
  if(!b||typeof b!=='object'||Array.isArray(b)||b.website)return json({error:'Invalid request'},400);
  try{
    if(b.action==='unsubscribe'){
      const id=cleanString(b.id,100),token=cleanString(b.token,100);
      if(!id||!token)return json({error:'The unsubscribe link is incomplete.'},400);
      const row=await db().prepare("SELECT data FROM submissions WHERE id=? AND kind='subscriber'").bind(id).first<any>();
      if(!row||JSON.parse(row.data).tokenHash!==await hash(token))return json({error:'This unsubscribe link is invalid or has expired.'},400);
      await db().prepare("UPDATE submissions SET status='unsubscribed' WHERE id=? AND kind='subscriber'").bind(id).run();
      const response=json({ok:true,subscribed:false});response.headers.set('Set-Cookie',remember(r,'','').replace('Max-Age=31536000','Max-Age=0'));return response;
    }
    const account=await accountEmail();
    const email=account.signedIn?account.email:normalize(cleanString(b.email,254));
    if(b.consent!==true||!/^\S+@[^\s@]+\.[^\s@]+$/.test(email))return json({error:'Enter a valid email and agree to receive updates.'},400);
    const id='sub_'+await hash(email),token=crypto.randomUUID()+crypto.randomUUID(),now=new Date().toISOString();
    const data=JSON.stringify({consent:true,consentAt:now,source:'website footer',emailVerified:account.signedIn,tokenHash:await hash(token)});
    // The primary key is a hash of the normalized email; simultaneous inserts cannot duplicate it.
    const result=await db().prepare("INSERT INTO submissions (id,kind,ref,name,contact,data,status,created_at) VALUES (?,'subscriber',NULL,'Subscriber',?,?,'active',?) ON CONFLICT(id) DO NOTHING").bind(id,email,data,now).run();
    let changed=!!result.meta.changes;
    if(!changed){const update=await db().prepare("UPDATE submissions SET data=?,status='active',created_at=? WHERE id=? AND kind='subscriber' AND status='unsubscribed'").bind(data,now,id).run();changed=!!update.meta.changes}
    const response=json({ok:true,subscribed:true,...(changed?{manageURL:'/unsubscribe?id='+id+'&token='+token}:{})});
    if(changed)response.headers.set('Set-Cookie',remember(r,id,token));return response;
  }catch{return json({error:'Your subscription could not be updated. Please retry. Verify your account email if necessary.'},503)}
}
