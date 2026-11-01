'use client';
import {useEffect,useRef,useState} from 'react';
import {ArrowUpRight} from 'lucide-react';
import {textOf} from '../lib/defaults';

export default function SubscribeForm({settings:s,ur}:{settings:any;ur:boolean}){
  const [busy,setBusy]=useState(false),[done,setDone]=useState(false),[manage,setManage]=useState(''),[error,setError]=useState(''),[checking,setChecking]=useState(true),[lookupError,setLookupError]=useState(''),[email,setEmail]=useState(''),[signedIn,setSignedIn]=useState(false);
  const busyRef=useRef(false);const generation=useRef(0),pending=useRef<AbortController|null>(null),mounted=useRef(false);
  const t=(en:string,u:string)=>ur?u:en;
  async function status(){
    if(busyRef.current)return;
    const id=++generation.current;pending.current?.abort();const controller=new AbortController();pending.current=controller;
    setChecking(true);setLookupError('');const timer=setTimeout(()=>controller.abort(),12000);
    try{const response=await fetch('/api/subscribe',{cache:'no-store',signal:controller.signal}),data:any=await response.json();if(!response.ok)throw Error(data.error||'Could not check subscription.');if(typeof data.subscribed!=='boolean')throw Error('Invalid subscription status.');if(!mounted.current||id!==generation.current)return;setDone(data.subscribed);setEmail(data.email||'');setSignedIn(data.signedIn===true);setManage(data.manageURL||'')}
    catch(e:any){if(mounted.current&&id===generation.current)setLookupError(e.name==='AbortError'?'Subscription check timed out. Please retry.':e.message||'Could not check subscription.')}
    finally{clearTimeout(timer);if(mounted.current&&id===generation.current)setChecking(false)}
  }
  useEffect(()=>{mounted.current=true;status();const focus=()=>{if(document.visibilityState==='visible')status()};window.addEventListener('focus',focus);document.addEventListener('visibilitychange',focus);return()=>{mounted.current=false;++generation.current;pending.current?.abort();window.removeEventListener('focus',focus);document.removeEventListener('visibilitychange',focus)}},[]);
  return <div className="subscribe-block"><h3>{textOf(s,'footerSubscribeTitle',ur)}</h3><p>{textOf(s,'footerSubscribeBody',ur)}</p>{checking?<p role="status">{t('Checking subscription...','سبسکرپشن دیکھی جا رہی ہے…')}</p>:lookupError?<div role="alert"><p>{lookupError}</p><button type="button" className="small-button" onClick={status}>{t('Retry','\u062f\u0648\u0628\u0627\u0631\u06c1 \u06a9\u0648\u0634\u0634 \u06a9\u0631\u06cc\u06ba')}</button></div>:done?<div className="subscribe-success" role="status"><strong>{t('Subscribed','سبسکرائب ہو چکا ہے')} <span aria-hidden="true">✓</span></strong><p>{t('Your email has been saved for updates.','آپ کی ای میل تازہ معلومات کے لیے محفوظ ہو گئی ہے۔')}</p>{manage&&<a href={manage}>{t('Manage or unsubscribe — save this link','سبسکرپشن کا انتظام یا خاتمہ — یہ لنک محفوظ کریں')}</a>}</div>:<form onSubmit={async e=>{
    e.preventDefault();busyRef.current=true;setBusy(true);setError('');++generation.current;pending.current?.abort();const fields=Object.fromEntries(new FormData(e.currentTarget));
    try{const response=await fetch('/api/subscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...fields,consent:fields.consent==='on'}),signal:AbortSignal.timeout(12000)}),data:any=await response.json();if(!response.ok||data.subscribed!==true)throw Error(data.error||'Subscription could not be confirmed.');if(!mounted.current)return;++generation.current;pending.current?.abort();setChecking(false);setLookupError('');setManage(data.manageURL||'');setDone(true)}catch(e:any){if(mounted.current)setError(e.message||'Please try again.')}finally{busyRef.current=false;if(mounted.current)setBusy(false)}
  }}><label className="subscribe-email"><span className="sr-only">{t('Your email address','اپنی ای میل لکھیں')}</span><input type="email" name="email" value={email} readOnly={signedIn} onChange={e=>setEmail(e.target.value)} maxLength={254} autoComplete="email" placeholder={t('Your email address','اپنی ای میل لکھیں')} required/><button type="submit" disabled={busy}>{busy?'...':t('Subscribe','سبسکرائب کریں')}<ArrowUpRight size={16}/></button></label><label className="check-label"><input type="checkbox" name="consent" required/>{t('I agree to receive updates. I can unsubscribe.','میں تازہ معلومات وصول کرنے سے متفق ہوں اور سبسکرپشن ختم کر سکتا ہوں۔')}</label><label className="honey">Website<input name="website" tabIndex={-1}/></label>{error&&<p className="error" role="alert">{error}</p>}</form>}</div>
}
