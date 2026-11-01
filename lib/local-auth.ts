import {authEmailCard,recoveryEmailHTML} from './auth-email-templates';
// import {randomInt} from 'node:crypto';
// import {appleReady,appleIdentity} from './apple-auth';
// import {hashPassword,verifyPassword,hashToken,randomToken} from './password-crypto.mjs';
// type Env={DB:D1Database;RESEND_API_KEY?:string;AUTH_FROM_EMAIL?:string;GOOGLE_CLIENT_ID?:string;GOOGLE_CLIENT_SECRET?:string;APPLE_CLIENT_ID?:string;APPLE_TEAM_ID?:string;APPLE_KEY_ID?:string;APPLE_PRIVATE_KEY?:string;APPLE_REDIRECT_URI?:string};
// const cookieName='portfolio_session',duration=86400000;
// const esc=(s:any)=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
// const emailOK=(v:string)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)&&v.length<=200;
// const reply=(data:any,status=200,headers:Record<string,string>={})=>Response.json(data,{status,headers:{'Cache-Control':'no-store',...headers}});
// const target=(v:string|null)=>v?.startsWith('/')&&!v.startsWith('//')&&!/^\/(auth|login|signup|forgot-password|reset-password|change-password)/.test(v)?v:'/';
// const cookie=(r:Request,value:string,age=86400)=>`${cookieName}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${age}${new URL(r.url).protocol==='https:'?'; Secure':''}`;
// const tokenOf=(r:Request)=>r.headers.get('cookie')?.split(';').map(x=>x.trim()).find(x=>x.startsWith(cookieName+'='))?.slice(cookieName.length+1)||'';
// export async function localSession(r:Request,env:Env){const token=tokenOf(r);if(!/^[A-Za-z0-9_-]{43}$/.test(token))return null;return env.DB.prepare('SELECT c.*,a.role FROM login_sessions s JOIN login_credentials c ON c.user_id=s.user_id JOIN accounts a ON a.user_id=c.user_id WHERE s.token_hash=? AND s.expires_at>?').bind(hashToken(token),new Date().toISOString()).first<any>()}
// async function makeSession(r:Request,env:Env,user:any,redirect='/'){const token=randomToken();await env.DB.prepare('INSERT INTO login_sessions(token_hash,user_id,expires_at) VALUES(?,?,?)').bind(hashToken(token),user.user_id,new Date(Date.now()+duration).toISOString()).run();return reply({ok:true,redirect:user.force_change?'/change-password':redirect},200,{'Set-Cookie':cookie(r,token)})}
// async function body(r:Request){if(!r.headers.get('content-type')?.startsWith('application/json'))throw Error('Use a JSON request');const raw=await r.text();if(raw.length>5000)throw Error('Request is too large');return JSON.parse(raw)}
// async function rate(env:Env,r:Request,label:string,max=10){const key=hashToken((r.headers.get('cf-connecting-ip')||'local')+'|'+label),now=Date.now();await env.DB.prepare('INSERT INTO login_attempts(key,started_at,count) VALUES(?,?,1) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN started_at<? THEN 1 ELSE count+1 END,started_at=CASE WHEN started_at<? THEN excluded.started_at ELSE started_at END').bind(key,now,now-900000,now-900000).run();const row=await env.DB.prepare('SELECT count FROM login_attempts WHERE key=?').bind(key).first<any>();return row.count<=max}
// async function mail(env:Env,to:string,subject:string,link:string){if(!env.RESEND_API_KEY||!env.AUTH_FROM_EMAIL)throw Error('Email delivery is not configured. Ask the administrator to configure email recovery.');const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+env.RESEND_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({from:env.AUTH_FROM_EMAIL,to:[to],subject,text:subject+'\n\n'+link+'\n\nThis link expires in 30 minutes.'})});if(!r.ok)throw Error('Email delivery failed. Please try again later.')}
// async function recovery(env:Env,user:any,kind:string){const raw=randomToken();await env.DB.prepare('INSERT INTO login_tokens(token_hash,user_id,kind,expires_at) VALUES(?,?,?,?)').bind(hashToken(raw),user.user_id,kind,new Date(Date.now()+1800000).toISOString()).run();return raw}
// const googleIcon = `
// <svg
//   xmlns="http://www.w3.org/2000/svg"
//   width="20"
//   height="20"
//   viewBox="0 0 48 48"
//   aria-hidden="true"
//   focusable="false"
// >
//   <path
//     fill="#EA4335"
//     d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
//   />
//   <path
//     fill="#4285F4"
//     d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6C44.4 38.03 46.98 31.85 46.98 24.55z"
//   />
//   <path
//     fill="#FBBC05"
//     d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.87 23.87 0 0 0 0 24c0 3.87.93 7.53 2.56 10.78l7.97-6.19z"
//   />
//   <path
//     fill="#34A853"
//     d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
//   />
// </svg>
// `;
// export function authPage(mode:string,settings:any,env:Env,request:Request){const nonce=randomToken(),google=!!(env.GOOGLE_CLIENT_ID&&env.GOOGLE_CLIENT_SECRET),admin=new URL(request.url).searchParams.get('admin')==='1';const titles:any={login:admin?'Administrator sign in':'Sign in to continue',signup:'Create your account',forgot:'Reset your password',resend:'Verify your email',reset:'Choose a new password',password:'Change your password'};const title=titles[mode]||titles.login;const pass=(name:string,label:string,auto='new-password')=>`<label>${label}<span class="password"><input name="${name}" type="password" required maxlength="128" autocomplete="${auto}"/><button type="button" class="reveal" aria-label="Show password">Show</button></span></label>`;const fields=mode==='login'?`<label>${admin?'Administrator ID':'Email or administrator ID'}<input name="identifier" autocomplete="username" required maxlength="200"/></label>${pass('password','Password','current-password')}`:mode==='signup'?`<label>Full name<input name="name" autocomplete="name" required maxlength="120"/></label><label>Email<input name="email" type="email" autocomplete="email" required maxlength="200"/></label>${pass('password','Password — at least 12 characters')}${pass('confirm','Confirm password')}`:['forgot','resend'].includes(mode)?'<label>Account email<input name="email" type="email" autocomplete="email" required maxlength="200"/></label>':`${mode==='password'?pass('current','Current password','current-password'):mode==='reset'&&!new URL(request.url).searchParams.get('token')?'<label>Account email<input name="email" type="email" autocomplete="email" required maxlength="200"/></label><label>Reset code<input name="otp" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" maxlength="6" required/></label>':''}${pass('password','New password — at least 12 characters')}${pass('confirm','Confirm new password')}${mode==='password'?'<label>Recovery email — optional<input name="email" type="email" maxlength="200" autocomplete="email"/></label>':''}`;return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><meta name="robots" content="noindex"/><title>${esc(title)} | ${esc(settings.browserTitle||settings.name||'Portfolio')}</title><link rel="icon" href="/favicon.svg"/><style nonce="${nonce}">*{box-sizing:border-box}body{margin:0;background:#f3f5f1;color:#233b32;font:15px/1.6 system-ui,sans-serif;min-height:100dvh;display:grid;place-items:center;padding:28px 16px}.panel{width:min(440px,100%);padding:34px;background:white;border:1px solid #dce3db;border-radius:22px;box-shadow:0 18px 60px #143f2810}.brand{font-weight:600;font-size:15px;display:flex;gap:12px;align-items:center;margin-bottom:30px}.mark{background:#e9efe8;padding:8px 11px;border-radius:10px;letter-spacing:.15em}h1{font-size:28px;line-height:1.25;margin:0 0 8px}p{color:#64746a;font-size:13px;margin:0 0 22px}form{display:grid;gap:17px}label{font-size:12px;font-weight:600;display:grid;gap:6px}input{width:100%;padding:12px;border:1px solid #c9d5cb;border-radius:9px;font:inherit;background:#fbfcfa;color:#1c362b}input:focus{outline:none;border-color:#50765d}.password{position:relative}.password input{padding-right:58px}.reveal{position:absolute;right:6px;top:6px;padding:7px;border:0;background:transparent;color:#486853;font-size:11px;cursor:pointer}button.submit,.provider{border:0;border-radius:9px;background:#28543e;color:white;padding:12px;font:600 13px system-ui;cursor:pointer;width:100%;display:block;text-align:center;text-decoration:none}.submit:disabled{opacity:.55;cursor:wait}.provider{background:transparent;color:#233b32;border:1px solid #d4ddd5;margin-bottom:9px}.provider:disabled{color:#7d857f;background:#f6f7f5;cursor:not-allowed}.providers{margin-bottom:23px}.links{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;font-size:12px;margin-top:19px}a{color:#28543e}#message{font-size:13px;color:#a13237;margin:14px 0;overflow-wrap:anywhere}.note{font-size:11px;margin-top:12px}.notice{padding:12px 0;color:#73612c}noscript{color:#a13237} @media(max-width:450px){.panel{padding:25px}h1{font-size:25px}}
// .providers .provider {
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   gap: 10px;
//   width: 100%;
//   min-height: 46px;
//   box-sizing: border-box;
// }

// .providers .provider svg {
//   display: block;
//   width: 20px;
//   height: 20px;
//   flex: 0 0 20px;
// }

// .providers .provider span {
//   line-height: 1.5;
// }
//   </style></head><body><main class="panel"><div class="brand"><span class="mark">${esc(settings.navMonogram||'NZ')}</span><span>${esc(settings.name||'Portfolio')}</span></div><h1>${title}</h1><p>${mode==='password'?'Enter your current password and a new password of at least 12 characters.':'Sign in is required before viewing this website.'}</p>${['login','signup'].includes(mode)&&!admin?`<div class="providers">${google
//   ? '<a class="provider" href="/auth/google">' +
//     googleIcon +
//     '<span>Continue with Google</span></a>'
//   : '<button class="provider" type="button" disabled>' +
//     googleIcon +
//     '<span>Continue with Google · not configured</span></button>'
//   }<p class="note">Social sign-in requires provider configuration. New email accounts require email verification.</p></div>`:''}<form id="auth-form">${fields}<button class="submit" type="submit">${mode==='signup'?'Create account':mode==='forgot'?'Send reset code':mode==='resend'?'Resend verification email':mode==='login'?'Continue':'Save password'}</button></form><div id="message" role="status"></div><noscript>Enable JavaScript to use the sign-in form.</noscript><div class="links">${mode==='login'?'<a href="/forgot-password">Forgot password?</a><a href="/signup">Create account</a><a href="/verify-email">Resend verification</a>':'<a href="/login">Back to sign in</a>'}${mode==='login'&&!admin?'<a href="/login?admin=1">Administrator sign in</a>':''}</div></main><script nonce="${nonce}">const mode=${JSON.stringify(mode)};document.querySelectorAll('.reveal').forEach(b=>b.onclick=()=>{const i=b.previousElementSibling;i.type=i.type==='password'?'text':'password';b.textContent=i.type==='password'?'Show':'Hide'});document.getElementById('auth-form').onsubmit=async e=>{e.preventDefault();const button=e.target.querySelector('.submit'),message=document.getElementById('message');const data=Object.fromEntries(new FormData(e.target));data.token=new URLSearchParams(location.search).get('token');data.returnTo=new URLSearchParams(location.search).get('return_to')||(new URLSearchParams(location.search).get('admin')==='1'?'/admin':'/');data.admin=new URLSearchParams(location.search).get('admin')==='1';button.disabled=true;message.textContent='';try{const r=await fetch('/auth/'+mode,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}),b=await r.json();if(!r.ok)throw Error(b.error||'Please try again');if(b.redirect){location.replace(b.redirect)}else{message.style.color='#28543e';message.textContent=b.message||'Saved.'}}catch(error){message.style.color='#a13237';message.textContent=error.message}finally{button.disabled=false}};</script></body></html>`,{headers:{'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':`default-src 'self'; script-src 'nonce-${nonce}'; style-src 'nonce-${nonce}'; img-src 'self' data:; base-uri 'none'; frame-ancestors 'none'; form-action 'self'`}})}
// export async function localAuth(request:Request,env:Env):Promise<{response?:Response;request?:Request}>{const url=new URL(request.url),path=url.pathname;const settings=JSON.parse((await env.DB.prepare("SELECT data FROM settings WHERE id='site'").first<any>())?.data||'{}');const page:any={'/login':'login','/signup':'signup','/forgot-password':'forgot','/verify-email':'resend','/reset-password':'reset','/change-password':'password'};const user=await localSession(request,env);
//  if(path==='/signin-with-chatgpt')return {response:Response.redirect(url.origin+'/login?return_to='+encodeURIComponent(target(url.searchParams.get('return_to'))),302)};
//  if(path==='/signout-with-chatgpt'||path==='/auth/logout'){if(request.headers.get('sec-fetch-site')==='cross-site')return {response:reply({error:'Forbidden'},403)};if(tokenOf(request))await env.DB.prepare('DELETE FROM login_sessions WHERE token_hash=?').bind(hashToken(tokenOf(request))).run();return {response:new Response(null,{status:302,headers:{Location:'/login','Set-Cookie':cookie(request,'',0),'Cache-Control':'no-store'}})}};
//  if(page[path]){if(path==='/change-password'&&!user)return {response:Response.redirect(url.origin+'/login?admin=1',302)};return {response:authPage(page[path],settings,env,request)}}

//  if(path==='/auth/apple'){
//   if(!appleReady(env))return {response:reply({error:'Apple sign-in requires registered Apple credentials and an HTTPS domain callback; localhost is not supported.'},503)};
//   const state=randomToken(),nonce=randomToken();await env.DB.prepare('INSERT INTO login_tokens(token_hash,user_id,kind,expires_at) VALUES(?,?,?,?)').bind(hashToken(state),nonce,'apple',new Date(Date.now()+600000).toISOString()).run();
//   const u=new URL('https://appleid.apple.com/auth/authorize');u.search=new URLSearchParams({client_id:env.APPLE_CLIENT_ID!,redirect_uri:env.APPLE_REDIRECT_URI!,response_type:'code',response_mode:'form_post',scope:'name email',state,nonce}).toString();
//   return {response:new Response(null,{status:302,headers:{Location:u.href,'Set-Cookie':`portfolio_apple=${state}; Path=/auth/apple; HttpOnly; Secure; SameSite=None; Max-Age=600`,'Cache-Control':'no-store'}})};
//  }
//  if(path==='/auth/apple/callback'){
//   try{
//    if(request.method!=='POST'||url.protocol!=='https:'||!appleReady(env)||url.origin+path!==env.APPLE_REDIRECT_URI)throw Error('Invalid Apple callback');
//    if(Number(request.headers.get('content-length')||0)>20000)throw Error('Callback too large');const raw=await request.text();if(raw.length>20000)throw Error('Callback too large');const b=new URLSearchParams(raw),state=b.get('state')||'',stored=request.headers.get('cookie')?.split(';').map(x=>x.trim()).find(x=>x.startsWith('portfolio_apple='))?.slice(16);
//    if(!/^[A-Za-z0-9_-]{43}$/.test(state)||state!==stored)throw Error('Invalid Apple sign-in state');
//    const attempt=await env.DB.prepare("DELETE FROM login_tokens WHERE token_hash=? AND kind='apple' AND expires_at>? RETURNING user_id").bind(hashToken(state),new Date().toISOString()).first<any>();if(!attempt||!b.get('code'))throw Error('Apple authorization expired or was cancelled');
//    const profile=await appleIdentity(env,b.get('code')!,attempt.user_id);if(!emailOK(profile.email))throw Error('Apple did not return a valid verified email');
//    // Namespace provider subjects; never link accounts merely by matching email.
//    const subject='apple:'+profile.sub;let found=await env.DB.prepare('SELECT * FROM login_credentials WHERE google_sub=?').bind(subject).first<any>();
//    if(!found){if(await env.DB.prepare('SELECT user_id FROM login_credentials WHERE email=?').bind(profile.email).first())throw Error('This email already has an account. Sign in using the original method.');
//     const id=crypto.randomUUID();let name='Apple user';try{const user=JSON.parse(b.get('user')||'{}');name=[user.name?.firstName,user.name?.lastName].filter(Boolean).join(' ').slice(0,120)||name}catch{}
//     await env.DB.batch([env.DB.prepare("INSERT INTO accounts(user_id,email,role) VALUES(?,?,'viewer')").bind(id,profile.email),env.DB.prepare('INSERT INTO login_credentials(user_id,username,email,name,verified,google_sub,created_at) VALUES(?,?,?,?,1,?,?)').bind(id,profile.email,profile.email,name,subject,new Date().toISOString())]);found={user_id:id,force_change:0};
//    }
//    const response=await makeSession(request,env,found);const data:any=await response.json();const headers=new Headers({Location:data.redirect,'Cache-Control':'no-store'});headers.append('Set-Cookie',response.headers.get('Set-Cookie')!);headers.append('Set-Cookie','portfolio_apple=; Path=/auth/apple; HttpOnly; Secure; SameSite=None; Max-Age=0');return {response:new Response(null,{status:303,headers})};
//   }catch{return {response:reply({error:'Apple sign-in could not be verified. Please sign in again.'},400)}}
//  }
//  if(path==='/auth/google'){if(!env.GOOGLE_CLIENT_ID||!env.GOOGLE_CLIENT_SECRET)return {response:reply({error:'Google sign-in is not configured'},503)};const state=await recovery(env,{user_id:''},'google'),u=new URL('https://accounts.google.com/o/oauth2/v2/auth');u.search=new URLSearchParams({client_id:env.GOOGLE_CLIENT_ID,redirect_uri:url.origin+'/auth/google/callback',response_type:'code',scope:'openid email profile',state,access_type:'online'}).toString();return {response:new Response(null,{status:302,headers:{Location:u.href,'Set-Cookie':`portfolio_oauth=${state}; Path=/auth/google; HttpOnly; SameSite=Lax; Max-Age=600${url.protocol==='https:'?'; Secure':''}`,'Cache-Control':'no-store'}})}}
//  if(path==='/auth/google/callback'){try{const state=url.searchParams.get('state')||'',stored=request.headers.get('cookie')?.split(';').map(x=>x.trim()).find(x=>x.startsWith('portfolio_oauth='))?.slice(16);if(!state||state!==stored||!env.GOOGLE_CLIENT_ID||!env.GOOGLE_CLIENT_SECRET)throw Error('Google sign-in state is invalid');const used=await env.DB.prepare("DELETE FROM login_tokens WHERE token_hash=? AND kind='google' AND expires_at>? RETURNING user_id").bind(hashToken(state),new Date().toISOString()).first();if(!used)throw Error('Google sign-in expired');const code=url.searchParams.get('code');if(!code)throw Error('Google did not authorize this request');const token=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_id:env.GOOGLE_CLIENT_ID,client_secret:env.GOOGLE_CLIENT_SECRET,redirect_uri:url.origin+'/auth/google/callback',grant_type:'authorization_code',code})});const tb:any=await token.json();if(!token.ok||!tb.access_token)throw Error('Google token exchange failed');const info=await fetch('https://openidconnect.googleapis.com/v1/userinfo',{headers:{Authorization:'Bearer '+tb.access_token}}),profile:any=await info.json();if(!info.ok||!profile.sub||profile.email_verified!==true||!emailOK(profile.email))throw Error('Google did not return a verified email');let found=await env.DB.prepare('SELECT * FROM login_credentials WHERE google_sub=?').bind(profile.sub).first<any>();if(!found){if(await env.DB.prepare('SELECT user_id FROM login_credentials WHERE email=?').bind(profile.email.toLowerCase()).first())throw Error('This email already has a password account. Use email sign-in.');const id=crypto.randomUUID();await env.DB.batch([env.DB.prepare("INSERT INTO accounts(user_id,email,role) VALUES(?,?,'viewer')").bind(id,profile.email.toLowerCase()),env.DB.prepare('INSERT INTO login_credentials(user_id,username,email,name,verified,google_sub,created_at) VALUES(?,?,?,?,1,?,?)').bind(id,profile.email.toLowerCase(),profile.email.toLowerCase(),String(profile.name||profile.email).slice(0,120),profile.sub,new Date().toISOString())]);found={user_id:id,force_change:0}}const response=await makeSession(request,env,found);const b:any=await response.json();return {response:new Response(null,{status:302,headers:{Location:b.redirect,'Set-Cookie':response.headers.get('Set-Cookie')!,'Cache-Control':'no-store'}})}}catch(e:any){return {response:reply({error:e.message},400)}}}
//  if(path==='/auth/verify'){const raw=url.searchParams.get('token')||'';const found=await env.DB.prepare("DELETE FROM login_tokens WHERE token_hash=? AND kind='verify' AND expires_at>? RETURNING user_id").bind(hashToken(raw),new Date().toISOString()).first<any>();if(!found)return {response:reply({error:'Verification link is invalid or expired'},400)};await env.DB.prepare('UPDATE login_credentials SET verified=1 WHERE user_id=?').bind(found.user_id).run();return {response:Response.redirect(url.origin+'/login',302)}}
//  if(path.startsWith('/auth/')){if(request.method!=='POST'||request.headers.get('origin')!==url.origin)return {response:reply({error:'Forbidden'},403)};let b:any;try{b=await body(request)}catch(e:any){return {response:reply({error:e.message},400)}};try{
//   if(path==='/auth/login'){const id=String(b.identifier||'').trim().toLowerCase(),password=String(b.password||'');if(!id||id.length>200||password.length>128)return {response:reply({error:'Enter your account and password'},400)};if(!await rate(env,request,'login|'+id))return {response:reply({error:'Too many attempts. Try again in 15 minutes.'},429)};const found=await env.DB.prepare('SELECT c.*,a.role FROM login_credentials c JOIN accounts a ON a.user_id=c.user_id WHERE lower(c.username)=? OR lower(c.email)=?').bind(id,id).first<any>();if(!verifyPassword(password,found?.password_hash)||!found)return {response:reply({error:'Incorrect account or password'},401)};if(b.admin&&found.role!=='owner')return {response:reply({error:'Administrator access required'},403)};if(env.RESEND_API_KEY&&found.role!=='owner'&&!found.verified&&!found.force_change)return {response:reply({error:'Verify your email before signing in'},403)};return {response:await makeSession(request,env,found,target(b.returnTo))}}
//   if(path==='/auth/signup'){if(!env.RESEND_API_KEY||!env.AUTH_FROM_EMAIL)return {response:reply({error:'New accounts require email verification. Email delivery must be configured by the administrator first.'},503)};const name=String(b.name||'').trim(),email=String(b.email||'').trim().toLowerCase(),password=String(b.password||'');if(!name||name.length>120||!emailOK(email)||password.length<12||password.length>128||password!==b.confirm)return {response:reply({error:'Enter your name, a valid email and matching passwords of at least 12 characters'},400)};if(!await rate(env,request,'signup',5))return {response:reply({error:'Too many registrations. Try later.'},429)};if(await env.DB.prepare('SELECT user_id FROM login_credentials WHERE email=? OR username=?').bind(email,email).first())return {response:reply({error:'An account already exists. Sign in, resend verification, or use password recovery.'},409)};const id=crypto.randomUUID();await env.DB.batch([env.DB.prepare("INSERT INTO accounts(user_id,email,role) VALUES(?,?,'viewer')").bind(id,email),env.DB.prepare('INSERT INTO login_credentials(user_id,username,email,name,password_hash,verified,created_at) VALUES(?,?,?,?,?,0,?)').bind(id,email,email,name,hashPassword(password),new Date().toISOString())]);if(env.RESEND_API_KEY&&env.AUTH_FROM_EMAIL){const raw=await recovery(env,{user_id:id},'verify');await mail(env,email,'Verify your portfolio account',url.origin+'/auth/verify?token='+raw);return {response:reply({ok:true,message:'Account created. Check your email to verify it before signing in.'})}}return {response:await makeSession(request,env,{user_id:id,force_change:0})}}
//   if(path==='/auth/password'){if(!user)return {response:reply({error:'Sign in required'},401)};const password=String(b.password||''),old=String(b.current||''),email=String(b.email||'').trim().toLowerCase();if(!await rate(env,request,'password|'+user.user_id,10))return {response:reply({error:'Too many attempts. Try later.'},429)};if(!verifyPassword(old,user.password_hash))return {response:reply({error:'Current password is incorrect'},401)};if(password.length<12||password.length>128||password!==b.confirm||password===old||email&&!emailOK(email))return {response:reply({error:'Use matching new passwords of at least 12 characters and a valid recovery email'},400)};if(email&&email!==user.email&&await env.DB.prepare('SELECT user_id FROM login_credentials WHERE email=?').bind(email).first())return {response:reply({error:'That email is already in use'},409)};await env.DB.batch([env.DB.prepare('UPDATE accounts SET email=? WHERE user_id=?').bind(email||user.email,user.user_id),env.DB.prepare('UPDATE login_credentials SET password_hash=?,force_change=0,email=?,verified=? WHERE user_id=?').bind(hashPassword(password),email||user.email,email&&email!==user.email?0:user.verified,user.user_id),env.DB.prepare('DELETE FROM login_sessions WHERE user_id=?').bind(user.user_id)]);return {response:await makeSession(request,env,{...user,force_change:0},user.role==='owner'?'/admin':'/')}}
//   if(path==='/auth/resend'){if(!env.RESEND_API_KEY||!env.AUTH_FROM_EMAIL)return {response:reply({error:'Email delivery is not configured'},503)};const email=String(b.email||'').trim().toLowerCase();if(!emailOK(email)||!await rate(env,request,'verify|'+email,5))return {response:reply({error:'Please try again later'},429)};const found=await env.DB.prepare('SELECT * FROM login_credentials WHERE email=?').bind(email).first<any>();if(found&&!found.verified){await env.DB.prepare("DELETE FROM login_tokens WHERE user_id=? AND kind='verify'").bind(found.user_id).run();const token=await recovery(env,found,'verify');await mail(env,email,'Verify your portfolio account',url.origin+'/auth/verify?token='+token)}return {response:reply({ok:true,message:'If an unverified account exists, a new verification email has been sent.'})}}
//   if(path==='/auth/forgot'){if(!env.RESEND_API_KEY||!env.AUTH_FROM_EMAIL)return {response:reply({error:'Email recovery is not configured. Contact the administrator.'},503)};const email=String(b.email||'').trim().toLowerCase();if(!emailOK(email)||!await rate(env,request,'forgot|'+email,5))return {response:reply({error:'Please try again later'},429)};const found=await env.DB.prepare('SELECT * FROM login_credentials WHERE email=?').bind(email).first<any>();if(found){await env.DB.prepare("DELETE FROM login_tokens WHERE user_id=? AND kind IN ('reset','reset_otp')").bind(found.user_id).run();const raw=await recovery(env,found,'reset'),otp=String(randomInt(100000,1000000));await env.DB.prepare('INSERT INTO login_tokens(token_hash,user_id,kind,expires_at) VALUES(?,?,?,?)').bind(hashToken(email+'|'+otp),found.user_id,'reset_otp',new Date(Date.now()+600000).toISOString()).run();await mail(env,email,'Reset your portfolio password','Your reset code: '+otp+' (expires in 10 minutes).\nEnter it at '+url.origin+'/reset-password\nOr use this single-use link:\n'+url.origin+'/reset-password?token='+raw)}return {response:reply({ok:true,message:'If this account exists, a reset code and link have been sent. Check your inbox.',redirect:'/reset-password'})}}
//   if(path==='/auth/reset'){const password=String(b.password||''),token=String(b.token||'');if(password.length<12||password.length>128||password!==b.confirm)return {response:reply({error:'Use matching passwords of at least 12 characters'},400)};if(!await rate(env,request,'reset',10))return {response:reply({error:'Try again later'},429)};const email=String(b.email||'').trim().toLowerCase(),otp=String(b.otp||'');if(!token&&(!emailOK(email)||!/^\d{6}$/.test(otp)))return {response:reply({error:'Enter your email and six-digit reset code'},400)};if(!token&&!await rate(env,request,'otp|'+email,5))return {response:reply({error:'Too many incorrect codes. Request a new code later.'},429)};const found=await env.DB.prepare('DELETE FROM login_tokens WHERE token_hash=? AND kind=? AND expires_at>? RETURNING user_id').bind(hashToken(token||email+'|'+otp),token?'reset':'reset_otp',new Date().toISOString()).first<any>();if(!found)return {response:reply({error:'Reset link or code is invalid or expired'},400)};await env.DB.batch([env.DB.prepare("DELETE FROM login_tokens WHERE user_id=? AND kind IN ('reset','reset_otp')").bind(found.user_id),env.DB.prepare('UPDATE login_credentials SET password_hash=?,force_change=0,verified=1 WHERE user_id=?').bind(hashPassword(password),found.user_id),env.DB.prepare('DELETE FROM login_sessions WHERE user_id=?').bind(found.user_id)]);return {response:reply({ok:true,redirect:'/login'})}}
//   return {response:reply({error:'Unknown authentication action'},404)};
//  }catch{return {response:reply({error:'The request could not be completed. Please try again.'},500)}}}
//  if(path==='/favicon.svg')return {};
//  if(!user)return {response:path.startsWith('/api/')?reply({error:'Sign in required'},401):Response.redirect(url.origin+'/login?'+new URLSearchParams({return_to:path+url.search,...(path.startsWith('/admin')?{admin:'1'}:{})}),302)};
//  if(user.force_change)return {response:path.startsWith('/api/')?reply({error:'Change the initial administrator password first'},403):Response.redirect(url.origin+'/change-password',302)};
//  if(path.startsWith('/admin')&&user.role!=='owner')return {response:Response.redirect(url.origin+'/login?admin=1&return_to='+encodeURIComponent(path+url.search),302)};
//  const headers=new Headers(request.headers);for(const key of [...headers.keys()])if(key.startsWith('oai-authenticated-user-'))headers.delete(key);headers.set('oai-authenticated-user-id',user.user_id);headers.set('oai-authenticated-user-email',user.email);headers.set('oai-authenticated-user-full-name',encodeURIComponent(user.name));headers.set('oai-authenticated-user-full-name-encoding','percent-encoded-utf-8');return {request:new Request(request,{headers})};
// }




import {randomInt} from 'node:crypto';

import {appleReady,appleIdentity} from './apple-auth';

import {hashPassword,verifyPassword,hashToken,randomToken} from './password-crypto.mjs';

type Env={DB:D1Database;RESEND_API_KEY?:string;AUTH_FROM_EMAIL?:string;GOOGLE_CLIENT_ID?:string;GOOGLE_CLIENT_SECRET?:string;APPLE_CLIENT_ID?:string;APPLE_TEAM_ID?:string;APPLE_KEY_ID?:string;APPLE_PRIVATE_KEY?:string;APPLE_REDIRECT_URI?:string};

const cookieName='portfolio_session',duration=86400000;

const esc=(s:any)=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));

const emailOK=(v:string)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)&&v.length<=200;

const reply=(data:any,status=200,headers:Record<string,string>={})=>Response.json(data,{status,headers:{'Cache-Control':'no-store',...headers}});

const target=(v:string|null)=>v?.startsWith('/')&&!v.startsWith('//')&&!/^\/(auth|login|signup|forgot-password|reset-password|change-password)/.test(v)?v:'/';

const cookie=(r:Request,value:string,age=86400)=>`${cookieName}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${age}${new URL(r.url).protocol==='https:'?'; Secure':''}`;

const tokenOf=(r:Request)=>r.headers.get('cookie')?.split(';').map(x=>x.trim()).find(x=>x.startsWith(cookieName+'='))?.slice(cookieName.length+1)||'';

export async function localSession(r:Request,env:Env){const token=tokenOf(r);if(!/^[A-Za-z0-9_-]{43}$/.test(token))return null;return env.DB.prepare('SELECT c.*,a.role FROM login_sessions s JOIN login_credentials c ON c.user_id=s.user_id JOIN accounts a ON a.user_id=c.user_id WHERE s.token_hash=? AND s.expires_at>?').bind(hashToken(token),new Date().toISOString()).first<any>()}

async function makeSession(r:Request,env:Env,user:any,redirect='/',notice?:LoginNotice){const token=randomToken();await env.DB.prepare('INSERT INTO login_sessions(token_hash,user_id,expires_at) VALUES(?,?,?)').bind(hashToken(token),user.user_id,new Date(Date.now()+duration).toISOString()).run();const emailNotification=notice?await loginEmail(r,env,user.user_id,notice):'not-requested';return reply({ok:true,redirect:user.force_change?'/change-password':redirect,emailNotification},200,{'Set-Cookie':cookie(r,token),'X-Auth-Email-Status':emailNotification})}

async function body(r:Request){if(!r.headers.get('content-type')?.startsWith('application/json'))throw Error('Use a JSON request');const raw=await r.text();if(raw.length>5000)throw Error('Request is too large');return JSON.parse(raw)}

async function rate(env:Env,r:Request,label:string,max=10){const key=hashToken((r.headers.get('cf-connecting-ip')||'local')+'|'+label),now=Date.now();await env.DB.prepare('INSERT INTO login_attempts(key,started_at,count) VALUES(?,?,1) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN started_at<? THEN 1 ELSE count+1 END,started_at=CASE WHEN started_at<? THEN excluded.started_at ELSE started_at END').bind(key,now,now-900000,now-900000).run();const row=await env.DB.prepare('SELECT count FROM login_attempts WHERE key=?').bind(key).first<any>();return row.count<=max}

type LoginNotice = 'welcome' | 'signin';

async function sendEmail(env: Env, to: string, subject: string, text: string, html?: string) {
  if (!env.RESEND_API_KEY || !env.AUTH_FROM_EMAIL) {
    throw Error('Email delivery is not configured. Ask the administrator to configure email recovery.');
  }
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {Authorization: 'Bearer ' + env.RESEND_API_KEY, 'Content-Type': 'application/json'},
    body: JSON.stringify({from: env.AUTH_FROM_EMAIL, to: [to], subject, text, ...(html ? {html} : {})}),
    signal: AbortSignal.timeout(10000),
  });
  const data: any = await response.json().catch(() => null);
  if (!response.ok || !data?.id) {
    // Do not log credentials, OTPs or provider response bodies.
    throw Error('Email provider rejected the request (' + response.status + '). Check Resend logs, sender and recipient permissions.');
  }
  return data.id as string;
}

async function mail(env: Env, to: string, subject: string, content: string) {
  return sendEmail(env, to, subject, subject + '\n\n' + content + '\n\nVerification/reset links expire in 30 minutes. Reset codes expire in 10 minutes.', recoveryEmailHTML(subject,content));
}

async function loginEmail(request: Request, env: Env, userId: string, kind: LoginNotice): Promise<'accepted' | 'failed' | 'not-configured' | 'no-verified-email'> {
  if (!env.RESEND_API_KEY || !env.AUTH_FROM_EMAIL) return 'not-configured';
  try {
    const user = await env.DB.prepare('SELECT name,email,verified FROM login_credentials WHERE user_id=?').bind(userId).first<any>();
    if (!user?.verified || !emailOK(user.email) || user.email.endsWith('.invalid')) return 'no-verified-email';
    const ua = request.headers.get('user-agent') || '';
    const browser = /Edg\//.test(ua) ? 'Microsoft Edge' : /OPR\//.test(ua) ? 'Opera' : /Firefox\//.test(ua) ? 'Firefox' : /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : 'Unknown browser';
    const system = /Android/.test(ua) ? 'Android' : /iPhone|iPad/.test(ua) ? 'iOS/iPadOS' : /Windows/.test(ua) ? 'Windows' : /Macintosh/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'Linux' : 'Unknown system';
    const at = new Date().toLocaleString('en-GB', {timeZone: 'Asia/Karachi', dateStyle: 'medium', timeStyle: 'short'}) + ' PKT';
    const name = String(user.name || 'there');
    const title = kind === 'welcome' ? 'Welcome — your account is ready' : 'Successful sign-in to your account';
    const introduction = kind === 'welcome'
      ? 'Your account has been verified and is ready to use.'
      : 'A successful sign-in to your account was recorded.';
    const text = `Assalamu alaikum, ${name}!\n\n${introduction}\nEmail: ${user.email}\nTime: ${at}\nBrowser/system: ${browser} — ${system}\n\nIf this was not you, contact the site administrator. If you use a password, reset it through Forgot password. If you use Google, review your Google Account security.\n\nNever share your password or OTP.`;
    const html = authEmailCard(title, `<p>Assalamu alaikum, <strong>${esc(name)}</strong>!</p><p>${esc(introduction)}</p><div style="padding:18px 20px;background:#eef6f1;border:1px solid #d5e8dc;border-radius:14px"><p style="margin:0"><strong>Email</strong><br>${esc(user.email)}</p><p style="margin:14px 0"><strong>Time</strong><br>${esc(at)}</p><p style="margin:0"><strong>Device</strong><br>${esc(browser)} / ${esc(system)}</p></div><p style="font-size:13px">If this was not you, contact the site administrator. If you use a password, reset it through Forgot password. If you use Google or Apple, review your provider account security.</p>`,kind==='welcome'?'WELCOME ABOARD':'SUCCESSFUL SIGN-IN');
    await sendEmail(env, user.email, title, text, html);
    return 'accepted';
  } catch {
    console.warn('Authentication notification email failed. Review Resend delivery logs.');
    return 'failed';
  }
}


async function recovery(env:Env,user:any,kind:string){const raw=randomToken();await env.DB.prepare('INSERT INTO login_tokens(token_hash,user_id,kind,expires_at) VALUES(?,?,?,?)').bind(hashToken(raw),user.user_id,kind,new Date(Date.now()+1800000).toISOString()).run();return raw}

const googleIcon = `

<svg

  xmlns="http://www.w3.org/2000/svg"

  width="20"

  height="20"

  viewBox="0 0 48 48"

  aria-hidden="true"

  focusable="false"

>

  <path

    fill="#EA4335"

    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"

  />

  <path

    fill="#4285F4"

    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6C44.4 38.03 46.98 31.85 46.98 24.55z"

  />

  <path

    fill="#FBBC05"

    d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.87 23.87 0 0 0 0 24c0 3.87.93 7.53 2.56 10.78l7.97-6.19z"

  />

  <path

    fill="#34A853"

    d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"

  />

</svg>

`;

export function authPage(mode:string,settings:any,env:Env,request:Request){const nonce=randomToken(),google=!!(env.GOOGLE_CLIENT_ID&&env.GOOGLE_CLIENT_SECRET),admin=new URL(request.url).searchParams.get('admin')==='1';const titles:any={login:admin?'Administrator sign in':'Sign in to continue',signup:'Create your account',forgot:'Reset your password',resend:'Verify your email',reset:'Choose a new password',password:'Change your password'};const title=titles[mode]||titles.login;const pass=(name:string,label:string,auto='new-password')=>`<label>${label}<span class="password"><input name="${name}" type="password" required maxlength="128" autocomplete="${auto}"/><button type="button" class="reveal" aria-label="Show password">Show</button></span></label>`;let fields=mode==='login'?`<label>${admin?'Administrator ID':'Email or administrator ID'}<input name="identifier" autocomplete="username" required maxlength="200"/></label>${pass('password','Password','current-password')}`:mode==='signup'?`<label>Full name<input name="name" autocomplete="name" required maxlength="120"/></label><label>Email<input name="email" type="email" autocomplete="email" required maxlength="200"/></label>${pass('password','Password — at least 12 characters')}${pass('confirm','Confirm password')}`:['forgot','resend'].includes(mode)?'<label>Account email<input name="email" type="email" autocomplete="email" required maxlength="200"/></label>':`${mode==='password'?pass('current','Current password','current-password'):mode==='reset'&&!new URL(request.url).searchParams.get('token')?'<label>Account email<input name="email" type="email" autocomplete="email" required maxlength="200"/></label><label>Reset code<input name="otp" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" maxlength="6" required/></label>':''}${pass('password','New password — at least 12 characters')}${pass('confirm','Confirm new password')}${mode==='password'?'<label>Recovery email — optional<input name="email" type="email" maxlength="200" autocomplete="email"/></label>':''}`;if(mode==='forgot'||(mode==='reset'&&!new URL(request.url).searchParams.get('token'))){fields=fields.replace('<input name="email" type="email" autocomplete="email" required maxlength="200"/>','<span class="recovery-email-input"><input name="email" type="email" autocomplete="email" required maxlength="200"/><button type="button" id="resend-code" aria-label="Send reset code again" title="Send reset code again"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 7v5h-5"/><path d="M20 12a8 8 0 1 0-2.4 5.7M20 7l-2.4-2.4"/></svg></button></span>')};return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><meta name="robots" content="noindex"/><title>${esc(title)} | ${esc(settings.browserTitle||settings.name||'Portfolio')}</title><link rel="icon" href="/favicon.svg"/><style nonce="${nonce}">*{box-sizing:border-box}body{margin:0;background:#f3f5f1;color:#233b32;font:15px/1.6 system-ui,sans-serif;min-height:100dvh;display:grid;place-items:center;padding:28px 16px}.panel{width:min(440px,100%);padding:34px;background:white;border:1px solid #dce3db;border-radius:22px;box-shadow:0 18px 60px #143f2810}.brand{font-weight:600;font-size:15px;display:flex;gap:12px;align-items:center;margin-bottom:30px}.mark{background:#e9efe8;padding:8px 11px;border-radius:10px;letter-spacing:.15em}h1{font-size:28px;line-height:1.25;margin:0 0 8px}p{color:#64746a;font-size:13px;margin:0 0 22px}form{display:grid;gap:17px}label{font-size:12px;font-weight:600;display:grid;gap:6px}input{width:100%;padding:12px;border:1px solid #c9d5cb;border-radius:9px;font:inherit;background:#fbfcfa;color:#1c362b}input:focus{outline:none;border-color:#50765d}.password{position:relative}.password input{padding-right:58px}.reveal{position:absolute;right:6px;top:6px;padding:7px;border:0;background:transparent;color:#486853;font-size:11px;cursor:pointer}button.submit,.provider{border:0;border-radius:9px;background:#28543e;color:white;padding:12px;font:600 13px system-ui;cursor:pointer;width:100%;display:block;text-align:center;text-decoration:none}.submit:disabled{opacity:.55;cursor:wait}.provider{background:transparent;color:#233b32;border:1px solid #d4ddd5;margin-bottom:9px}.provider:disabled{color:#7d857f;background:#f6f7f5;cursor:not-allowed}.providers{margin-bottom:23px}.links{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;font-size:12px;margin-top:19px}a{color:#28543e}#message{font-size:13px;color:#a13237;margin:14px 0;overflow-wrap:anywhere}.note{font-size:11px;margin-top:12px}.notice{padding:12px 0;color:#73612c}noscript{color:#a13237} @media(max-width:450px){.panel{padding:25px}h1{font-size:25px}}

.providers .provider {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  width: 100%;

  min-height: 46px;

  box-sizing: border-box;

}



.providers .provider svg {

  display: block;

  width: 20px;

  height: 20px;

  flex: 0 0 20px;

}



.providers .provider span {

  line-height: 1.5;

}

  #message:empty{display:none}#message:not(:empty){position:relative;padding:17px 18px 17px 48px;border:1px solid #d5e8dc;border-radius:14px;background:#eef6f1;color:#24543f;box-shadow:0 5px 18px #143f2808;line-height:1.7}#message:not(:empty)::before{content:"\\2713";position:absolute;left:17px;top:17px;font-weight:700;font-size:18px}#message[data-state=error]{background:#fff2f1;border-color:#f0d0cd;color:#9f3437}#message[data-state=error]::before{content:"!"}input[name=otp]{font-size:24px;letter-spacing:8px;text-align:center;background:#eef6f1;border-radius:12px}.password-recovery-link{text-align:end;margin-top:-7px;font-size:12px}.password-recovery-link a{text-underline-offset:3px}.links .create-account-button{display:block;flex-basis:100%;width:100%;padding:12px;border:0;border-radius:9px;background:#28543e;color:#fff;font:600 13px system-ui;text-align:center;text-decoration:none;cursor:pointer}.links .create-account-button:hover{background:#204532}.links .create-account-button:focus-visible{outline:3px solid #a8864b;outline-offset:3px}.recovery-email-input{display:flex;align-items:center;gap:8px}.recovery-email-input input{min-width:0;flex:1}#resend-code{flex:none;display:grid;place-items:center;width:43px;height:43px;border:1px solid #d5e8dc;border-radius:12px;background:#eef6f1;color:#286457;cursor:pointer}#resend-code:hover{background:#dceee3}#resend-code:disabled{opacity:.5;cursor:wait}#resend-code:focus-visible{outline:3px solid #a8864b;outline-offset:3px}</style></head><body><main class="panel"><div class="brand"><span class="mark">${esc(settings.navMonogram||'NZ')}</span><span>${esc(settings.name||'Portfolio')}</span></div><h1>${title}</h1><p>${mode==='password'?'Enter your current password and a new password of at least 12 characters.':'Sign in is required before viewing this website.'}</p>${['login','signup'].includes(mode)&&!admin?`<div class="providers">${google

  ? '<a class="provider" href="/auth/google">' +

    googleIcon +

    '<span>Continue with Google</span></a>'

  : '<button class="provider" type="button" disabled>' +

    googleIcon +

    '<span>Continue with Google · not configured</span></button>'

  }<p class="note">Social sign-in requires provider configuration. New email accounts require email verification.</p></div>`:''}<form id="auth-form">${fields}${mode==='login'?'<div class="password-recovery-link"><a href="/forgot-password">Forgot password?</a></div>':''}<button class="submit" type="submit">${mode==='signup'?'Create account':mode==='forgot'?'Send reset code':mode==='resend'?'Resend verification email':mode==='login'?'Continue':'Save password'}</button></form><div id="message" role="status"></div><noscript>Enable JavaScript to use the sign-in form.</noscript><div class="links">${mode==='login'?'<a class="submit create-account-button" href="/signup">Create account</a>':'<a href="/login">Back to sign in</a>'}</div></main><script nonce="${nonce}">const mode=${JSON.stringify(mode)};document.querySelectorAll('.reveal').forEach(b=>b.onclick=()=>{const i=b.previousElementSibling;i.type=i.type==='password'?'text':'password';b.textContent=i.type==='password'?'Show':'Hide'});const resendCode=document.getElementById('resend-code');if(resendCode)resendCode.onclick=async()=>{const form=document.getElementById('auth-form'),email=form.querySelector('input[name=email]'),message=document.getElementById('message');if(!email.reportValidity())return;resendCode.disabled=true;message.textContent='';try{const response=await fetch('/auth/forgot',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email.value})});const body=await response.json();if(!response.ok)throw Error(body.error||'Please try again.');message.dataset.state='success';message.textContent=body.message||'If this account exists, a reset code has been sent. Check your inbox.';}catch(error){message.dataset.state='error';message.textContent=error.message||'Unable to resend. Please try again.'}finally{resendCode.disabled=false}};document.getElementById('auth-form').onsubmit=async e=>{e.preventDefault();const button=e.target.querySelector('.submit'),message=document.getElementById('message');const data=Object.fromEntries(new FormData(e.target));data.token=new URLSearchParams(location.search).get('token');data.returnTo=new URLSearchParams(location.search).get('return_to')||(new URLSearchParams(location.search).get('admin')==='1'?'/admin':'/');data.admin=new URLSearchParams(location.search).get('admin')==='1';button.disabled=true;message.textContent='';delete message.dataset.state;try{const r=await fetch('/auth/'+mode,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}),b=await r.json();if(!r.ok)throw Error(b.error||'Please try again');if(b.redirect){location.replace(b.redirect)}else{message.dataset.state='success';message.textContent=b.message||'Saved.'}}catch(error){message.dataset.state='error';message.textContent=error.message}finally{button.disabled=false}};</script></body></html>`,{headers:{'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':`default-src 'self'; script-src 'nonce-${nonce}'; style-src 'nonce-${nonce}'; img-src 'self' data:; base-uri 'none'; frame-ancestors 'none'; form-action 'self'`}})}

export async function localAuth(request:Request,env:Env):Promise<{response?:Response;request?:Request}>{const url=new URL(request.url),path=url.pathname;const settings=JSON.parse((await env.DB.prepare("SELECT data FROM settings WHERE id='site'").first<any>())?.data||'{}');const page:any={'/login':'login','/signup':'signup','/forgot-password':'forgot','/verify-email':'resend','/reset-password':'reset','/change-password':'password'};const user=await localSession(request,env);

 if(path==='/signin-with-chatgpt')return {response:Response.redirect(url.origin+'/login?return_to='+encodeURIComponent(target(url.searchParams.get('return_to'))),302)};

 if(path==='/signout-with-chatgpt'||path==='/auth/logout'){if(request.headers.get('sec-fetch-site')==='cross-site')return {response:reply({error:'Forbidden'},403)};if(tokenOf(request))await env.DB.prepare('DELETE FROM login_sessions WHERE token_hash=?').bind(hashToken(tokenOf(request))).run();return {response:new Response(null,{status:302,headers:{Location:'/login','Set-Cookie':cookie(request,'',0),'Cache-Control':'no-store'}})}};

 if(page[path]){if(path==='/change-password'&&!user)return {response:Response.redirect(url.origin+'/login?admin=1',302)};return {response:authPage(page[path],settings,env,request)}}



 if(path==='/auth/apple'){

  if(!appleReady(env))return {response:reply({error:'Apple sign-in requires registered Apple credentials and an HTTPS domain callback; localhost is not supported.'},503)};

  const state=randomToken(),nonce=randomToken();await env.DB.prepare('INSERT INTO login_tokens(token_hash,user_id,kind,expires_at) VALUES(?,?,?,?)').bind(hashToken(state),nonce,'apple',new Date(Date.now()+600000).toISOString()).run();

  const u=new URL('https://appleid.apple.com/auth/authorize');u.search=new URLSearchParams({client_id:env.APPLE_CLIENT_ID!,redirect_uri:env.APPLE_REDIRECT_URI!,response_type:'code',response_mode:'form_post',scope:'name email',state,nonce}).toString();

  return {response:new Response(null,{status:302,headers:{Location:u.href,'Set-Cookie':`portfolio_apple=${state}; Path=/auth/apple; HttpOnly; Secure; SameSite=None; Max-Age=600`,'Cache-Control':'no-store'}})};

 }

 if(path==='/auth/apple/callback'){

  try{

   if(request.method!=='POST'||url.protocol!=='https:'||!appleReady(env)||url.origin+path!==env.APPLE_REDIRECT_URI)throw Error('Invalid Apple callback');

   if(Number(request.headers.get('content-length')||0)>20000)throw Error('Callback too large');const raw=await request.text();if(raw.length>20000)throw Error('Callback too large');const b=new URLSearchParams(raw),state=b.get('state')||'',stored=request.headers.get('cookie')?.split(';').map(x=>x.trim()).find(x=>x.startsWith('portfolio_apple='))?.slice(16);

   if(!/^[A-Za-z0-9_-]{43}$/.test(state)||state!==stored)throw Error('Invalid Apple sign-in state');

   const attempt=await env.DB.prepare("DELETE FROM login_tokens WHERE token_hash=? AND kind='apple' AND expires_at>? RETURNING user_id").bind(hashToken(state),new Date().toISOString()).first<any>();if(!attempt||!b.get('code'))throw Error('Apple authorization expired or was cancelled');

   const profile=await appleIdentity(env,b.get('code')!,attempt.user_id);if(!emailOK(profile.email))throw Error('Apple did not return a valid verified email');

   // Namespace provider subjects; never link accounts merely by matching email.

   const subject='apple:'+profile.sub;let found=await env.DB.prepare('SELECT * FROM login_credentials WHERE google_sub=?').bind(subject).first<any>();
   const isNewApple=!found;

   if(!found){if(await env.DB.prepare('SELECT user_id FROM login_credentials WHERE email=?').bind(profile.email).first())throw Error('This email already has an account. Sign in using the original method.');

    const id=crypto.randomUUID();let name='Apple user';try{const user=JSON.parse(b.get('user')||'{}');name=[user.name?.firstName,user.name?.lastName].filter(Boolean).join(' ').slice(0,120)||name}catch{}

    await env.DB.batch([env.DB.prepare("INSERT INTO accounts(user_id,email,role) VALUES(?,?,'viewer')").bind(id,profile.email),env.DB.prepare('INSERT INTO login_credentials(user_id,username,email,name,verified,google_sub,created_at) VALUES(?,?,?,?,1,?,?)').bind(id,profile.email,profile.email,name,subject,new Date().toISOString())]);found={user_id:id,force_change:0};

   }

   const response=await makeSession(request,env,found,'/',isNewApple?'welcome':'signin');const data:any=await response.json();const headers=new Headers({Location:data.redirect,'Cache-Control':'no-store','X-Auth-Email-Status':response.headers.get('X-Auth-Email-Status')||'unknown'});headers.append('Set-Cookie',response.headers.get('Set-Cookie')!);headers.append('Set-Cookie','portfolio_apple=; Path=/auth/apple; HttpOnly; Secure; SameSite=None; Max-Age=0');return {response:new Response(null,{status:303,headers})};

  }catch{return {response:reply({error:'Apple sign-in could not be verified. Please sign in again.'},400)}}

 }

 if(path==='/auth/google'){if(!env.GOOGLE_CLIENT_ID||!env.GOOGLE_CLIENT_SECRET)return {response:reply({error:'Google sign-in is not configured'},503)};const state=await recovery(env,{user_id:''},'google'),u=new URL('https://accounts.google.com/o/oauth2/v2/auth');u.search=new URLSearchParams({client_id:env.GOOGLE_CLIENT_ID,redirect_uri:url.origin+'/auth/google/callback',response_type:'code',scope:'openid email profile',state,access_type:'online',prompt:'select_account consent'}).toString();return {response:new Response(null,{status:302,headers:{Location:u.href,'Set-Cookie':`portfolio_oauth=${state}; Path=/auth/google; HttpOnly; SameSite=Lax; Max-Age=600${url.protocol==='https:'?'; Secure':''}`,'Cache-Control':'no-store'}})}}

 if(path==='/auth/google/callback'){try{const state=url.searchParams.get('state')||'',stored=request.headers.get('cookie')?.split(';').map(x=>x.trim()).find(x=>x.startsWith('portfolio_oauth='))?.slice(16);if(!state||state!==stored||!env.GOOGLE_CLIENT_ID||!env.GOOGLE_CLIENT_SECRET)throw Error('Google sign-in state is invalid');const used=await env.DB.prepare("DELETE FROM login_tokens WHERE token_hash=? AND kind='google' AND expires_at>? RETURNING user_id").bind(hashToken(state),new Date().toISOString()).first();if(!used)throw Error('Google sign-in expired');const code=url.searchParams.get('code');if(!code)throw Error('Google did not authorize this request');const token=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_id:env.GOOGLE_CLIENT_ID,client_secret:env.GOOGLE_CLIENT_SECRET,redirect_uri:url.origin+'/auth/google/callback',grant_type:'authorization_code',code})});const tb:any=await token.json();if(!token.ok||!tb.access_token)throw Error('Google token exchange failed');const info=await fetch('https://openidconnect.googleapis.com/v1/userinfo',{headers:{Authorization:'Bearer '+tb.access_token}}),profile:any=await info.json();if(!info.ok||!profile.sub||profile.email_verified!==true||!emailOK(profile.email))throw Error('Google did not return a verified email');let found=await env.DB.prepare('SELECT * FROM login_credentials WHERE google_sub=?').bind(profile.sub).first<any>();const isNewGoogle=!found;if(!found){if(await env.DB.prepare('SELECT user_id FROM login_credentials WHERE email=?').bind(profile.email.toLowerCase()).first())throw Error('This email already has a password account. Use email sign-in.');const id=crypto.randomUUID();await env.DB.batch([env.DB.prepare("INSERT INTO accounts(user_id,email,role) VALUES(?,?,'viewer')").bind(id,profile.email.toLowerCase()),env.DB.prepare('INSERT INTO login_credentials(user_id,username,email,name,verified,google_sub,created_at) VALUES(?,?,?,?,1,?,?)').bind(id,profile.email.toLowerCase(),profile.email.toLowerCase(),String(profile.name||profile.email).slice(0,120),profile.sub,new Date().toISOString())]);found={user_id:id,force_change:0}}const response=await makeSession(request,env,found,'/',isNewGoogle?'welcome':'signin');const b:any=await response.json();return {response:new Response(null,{status:302,headers:{Location:b.redirect,'Set-Cookie':response.headers.get('Set-Cookie')!,'Cache-Control':'no-store','X-Auth-Email-Status':response.headers.get('X-Auth-Email-Status')||'unknown'}})}}catch(e:any){return {response:reply({error:e.message},400)}}}

 if(path==='/auth/verify'){const raw=url.searchParams.get('token')||'';const found=await env.DB.prepare("DELETE FROM login_tokens WHERE token_hash=? AND kind='verify' AND expires_at>? RETURNING user_id").bind(hashToken(raw),new Date().toISOString()).first<any>();if(!found)return {response:reply({error:'Verification link is invalid or expired'},400)};await env.DB.prepare('UPDATE login_credentials SET verified=1 WHERE user_id=?').bind(found.user_id).run();const status=await loginEmail(request,env,found.user_id,'welcome');return {response:new Response(null,{status:302,headers:{Location:url.origin+'/login','Cache-Control':'no-store','X-Auth-Email-Status':status}})}}

 if(path.startsWith('/auth/')){if(request.method!=='POST'||request.headers.get('origin')!==url.origin)return {response:reply({error:'Forbidden'},403)};let b:any;try{b=await body(request)}catch(e:any){return {response:reply({error:e.message},400)}};try{

  if(path==='/auth/login'){const id=String(b.identifier||'').trim().toLowerCase(),password=String(b.password||'');if(!id||id.length>200||password.length>128)return {response:reply({error:'Enter your account and password'},400)};if(!await rate(env,request,'login|'+id))return {response:reply({error:'Too many attempts. Try again in 15 minutes.'},429)};const found=await env.DB.prepare('SELECT c.*,a.role FROM login_credentials c JOIN accounts a ON a.user_id=c.user_id WHERE lower(c.username)=? OR lower(c.email)=?').bind(id,id).first<any>();if(!verifyPassword(password,found?.password_hash)||!found)return {response:reply({error:'Incorrect account or password'},401)};if(b.admin&&found.role!=='owner')return {response:reply({error:'Administrator access required'},403)};if(env.RESEND_API_KEY&&found.role!=='owner'&&!found.verified&&!found.force_change)return {response:reply({error:'Verify your email before signing in'},403)};return {response:await makeSession(request,env,found,target(b.returnTo),'signin')}}

  if(path==='/auth/signup'){if(!env.RESEND_API_KEY||!env.AUTH_FROM_EMAIL)return {response:reply({error:'New accounts require email verification. Email delivery must be configured by the administrator first.'},503)};const name=String(b.name||'').trim(),email=String(b.email||'').trim().toLowerCase(),password=String(b.password||'');if(!name||name.length>120||!emailOK(email)||password.length<12||password.length>128||password!==b.confirm)return {response:reply({error:'Enter your name, a valid email and matching passwords of at least 12 characters'},400)};if(!await rate(env,request,'signup',5))return {response:reply({error:'Too many registrations. Try later.'},429)};if(await env.DB.prepare('SELECT user_id FROM login_credentials WHERE email=? OR username=?').bind(email,email).first())return {response:reply({error:'An account already exists. Sign in, resend verification, or use password recovery.'},409)};const id=crypto.randomUUID();await env.DB.batch([env.DB.prepare("INSERT INTO accounts(user_id,email,role) VALUES(?,?,'viewer')").bind(id,email),env.DB.prepare('INSERT INTO login_credentials(user_id,username,email,name,password_hash,verified,created_at) VALUES(?,?,?,?,?,0,?)').bind(id,email,email,name,hashPassword(password),new Date().toISOString())]);if(env.RESEND_API_KEY&&env.AUTH_FROM_EMAIL){const raw=await recovery(env,{user_id:id},'verify');await mail(env,email,'Verify your portfolio account',url.origin+'/auth/verify?token='+raw);return {response:reply({ok:true,message:'Account created. Check your email to verify it before signing in.'})}}return {response:await makeSession(request,env,{user_id:id,force_change:0})}}

  if(path==='/auth/password'){if(!user)return {response:reply({error:'Sign in required'},401)};const password=String(b.password||''),old=String(b.current||''),email=String(b.email||'').trim().toLowerCase();if(!await rate(env,request,'password|'+user.user_id,10))return {response:reply({error:'Too many attempts. Try later.'},429)};if(!verifyPassword(old,user.password_hash))return {response:reply({error:'Current password is incorrect'},401)};if(password.length<12||password.length>128||password!==b.confirm||password===old||email&&!emailOK(email))return {response:reply({error:'Use matching new passwords of at least 12 characters and a valid recovery email'},400)};if(email&&email!==user.email&&await env.DB.prepare('SELECT user_id FROM login_credentials WHERE email=?').bind(email).first())return {response:reply({error:'That email is already in use'},409)};await env.DB.batch([env.DB.prepare('UPDATE accounts SET email=? WHERE user_id=?').bind(email||user.email,user.user_id),env.DB.prepare('UPDATE login_credentials SET password_hash=?,force_change=0,email=?,verified=? WHERE user_id=?').bind(hashPassword(password),email||user.email,email&&email!==user.email?0:user.verified,user.user_id),env.DB.prepare('DELETE FROM login_sessions WHERE user_id=?').bind(user.user_id)]);return {response:await makeSession(request,env,{...user,force_change:0},user.role==='owner'?'/admin':'/')}}

  if(path==='/auth/resend'){if(!env.RESEND_API_KEY||!env.AUTH_FROM_EMAIL)return {response:reply({error:'Email delivery is not configured'},503)};const email=String(b.email||'').trim().toLowerCase();if(!emailOK(email)||!await rate(env,request,'verify|'+email,5))return {response:reply({error:'Please try again later'},429)};const found=await env.DB.prepare('SELECT * FROM login_credentials WHERE email=?').bind(email).first<any>();if(found&&!found.verified){await env.DB.prepare("DELETE FROM login_tokens WHERE user_id=? AND kind='verify'").bind(found.user_id).run();const token=await recovery(env,found,'verify');await mail(env,email,'Verify your portfolio account',url.origin+'/auth/verify?token='+token)}return {response:reply({ok:true,message:'If an unverified account exists, a new verification email has been sent.'})}}

  if(path==='/auth/forgot'){if(!env.RESEND_API_KEY||!env.AUTH_FROM_EMAIL)return {response:reply({error:'Email recovery is not configured. Contact the administrator.'},503)};const email=String(b.email||'').trim().toLowerCase();if(!emailOK(email)||!await rate(env,request,'forgot|'+email,5))return {response:reply({error:'Please try again later'},429)};const found=await env.DB.prepare('SELECT * FROM login_credentials WHERE email=?').bind(email).first<any>();if(found){await env.DB.prepare("DELETE FROM login_tokens WHERE user_id=? AND kind IN ('reset','reset_otp')").bind(found.user_id).run();const raw=await recovery(env,found,'reset'),otp=String(randomInt(100000,1000000));await env.DB.prepare('INSERT INTO login_tokens(token_hash,user_id,kind,expires_at) VALUES(?,?,?,?)').bind(hashToken(email+'|'+otp),found.user_id,'reset_otp',new Date(Date.now()+600000).toISOString()).run();await mail(env,email,'Reset your portfolio password','Your reset code: '+otp+' (expires in 10 minutes).\nEnter it at '+url.origin+'/reset-password\nOr use this single-use link:\n'+url.origin+'/reset-password?token='+raw)}return {response:reply({ok:true,message:'If this account exists, a reset code and link have been sent. Check your inbox.',redirect:'/reset-password'})}}

  if(path==='/auth/reset'){const password=String(b.password||''),token=String(b.token||'');if(password.length<12||password.length>128||password!==b.confirm)return {response:reply({error:'Use matching passwords of at least 12 characters'},400)};if(!await rate(env,request,'reset',10))return {response:reply({error:'Try again later'},429)};const email=String(b.email||'').trim().toLowerCase(),otp=String(b.otp||'');if(!token&&(!emailOK(email)||!/^\d{6}$/.test(otp)))return {response:reply({error:'Enter your email and six-digit reset code'},400)};if(!token&&!await rate(env,request,'otp|'+email,5))return {response:reply({error:'Too many incorrect codes. Request a new code later.'},429)};const found=await env.DB.prepare('DELETE FROM login_tokens WHERE token_hash=? AND kind=? AND expires_at>? RETURNING user_id').bind(hashToken(token||email+'|'+otp),token?'reset':'reset_otp',new Date().toISOString()).first<any>();if(!found)return {response:reply({error:'Reset link or code is invalid or expired'},400)};await env.DB.batch([env.DB.prepare("DELETE FROM login_tokens WHERE user_id=? AND kind IN ('reset','reset_otp')").bind(found.user_id),env.DB.prepare('UPDATE login_credentials SET password_hash=?,force_change=0,verified=1 WHERE user_id=?').bind(hashPassword(password),found.user_id),env.DB.prepare('DELETE FROM login_sessions WHERE user_id=?').bind(found.user_id)]);return {response:reply({ok:true,redirect:'/login'})}}

  return {response:reply({error:'Unknown authentication action'},404)};

 }catch{const emailAction=['/auth/signup','/auth/forgot','/auth/resend'].includes(path);return {response:reply({error:emailAction?'Email could not be sent. Check Resend logs and your sender/recipient permissions. No email delivery is confirmed.':'The request could not be completed. Please try again.'},emailAction?502:500)}}}

 if(path==='/favicon.svg')return {};

 if(!user)return {response:path.startsWith('/api/')?reply({error:'Sign in required'},401):Response.redirect(url.origin+'/login?'+new URLSearchParams({return_to:path+url.search,...(path.startsWith('/admin')?{admin:'1'}:{})}),302)};

 if(user.force_change)return {response:path.startsWith('/api/')?reply({error:'Change the initial administrator password first'},403):Response.redirect(url.origin+'/change-password',302)};

 if(path.startsWith('/admin')&&user.role!=='owner')return {response:Response.redirect(url.origin+'/login?admin=1&return_to='+encodeURIComponent(path+url.search),302)};

 const headers=new Headers(request.headers);for(const key of [...headers.keys()])if(key.startsWith('oai-authenticated-user-'))headers.delete(key);headers.set('oai-authenticated-user-id',user.user_id);headers.set('oai-authenticated-user-email',user.email);headers.set('oai-authenticated-user-full-name',encodeURIComponent(user.name));headers.set('oai-authenticated-user-full-name-encoding','percent-encoded-utf-8');return {request:new Request(request,{headers})};

}
