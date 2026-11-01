// Apple server-side authorization. Identity is accepted only after signature,
// issuer, audience, expiry and the per-attempt nonce have all been verified.
type AppleEnv={APPLE_CLIENT_ID?:string;APPLE_TEAM_ID?:string;APPLE_KEY_ID?:string;APPLE_PRIVATE_KEY?:string;APPLE_REDIRECT_URI?:string};
const encode=(v:Uint8Array)=>btoa(String.fromCharCode(...v)).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
const bytes=(s:string)=>Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));
const json=(v:unknown)=>encode(new TextEncoder().encode(JSON.stringify(v)));
export function appleReady(env:AppleEnv){try{const u=new URL(env.APPLE_REDIRECT_URI||'');return !!(env.APPLE_CLIENT_ID&&env.APPLE_TEAM_ID&&env.APPLE_KEY_ID&&env.APPLE_PRIVATE_KEY&&u.protocol==='https:'&&u.hostname!=='localhost'&&!/^\d+(\.\d+){3}$/.test(u.hostname)&&!u.hash)}catch{return false}}
export async function appleIdentity(env:AppleEnv,code:string,nonce:string){
 if(!appleReady(env))throw Error('Apple sign-in is not configured');
 const now=Math.floor(Date.now()/1000),header=json({alg:'ES256',kid:env.APPLE_KEY_ID}),payload=json({iss:env.APPLE_TEAM_ID,iat:now,exp:now+300,aud:'https://appleid.apple.com',sub:env.APPLE_CLIENT_ID});
 const pem=env.APPLE_PRIVATE_KEY!.replace(/\\n/g,'\n').replace(/-----[^-]+-----/g,'').replace(/\s/g,'');
 const key=await crypto.subtle.importKey('pkcs8',bytes(pem),{name:'ECDSA',namedCurve:'P-256'},false,['sign']);
 const unsigned=header+'.'+payload,signature=await crypto.subtle.sign({name:'ECDSA',hash:'SHA-256'},key,new TextEncoder().encode(unsigned));
 const response=await fetch('https://appleid.apple.com/auth/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_id:env.APPLE_CLIENT_ID!,client_secret:unsigned+'.'+encode(new Uint8Array(signature)),code,grant_type:'authorization_code',redirect_uri:env.APPLE_REDIRECT_URI!})});
 const tokens:any=await response.json();if(!response.ok||!tokens.id_token)throw Error('Apple token exchange failed');
 const parts=String(tokens.id_token).split('.');if(parts.length!==3)throw Error('Invalid Apple identity token');
 const h=JSON.parse(new TextDecoder().decode(bytes(parts[0]))),claims=JSON.parse(new TextDecoder().decode(bytes(parts[1])));
 if(h.alg!=='RS256'||!h.kid)throw Error('Invalid Apple signing algorithm');
 const keysResponse=await fetch('https://appleid.apple.com/auth/keys');if(!keysResponse.ok)throw Error('Apple verification keys unavailable');
 const keys:any=await keysResponse.json(),jwk=keys.keys?.find((k:any)=>k.kid===h.kid&&k.kty==='RSA'&&k.alg==='RS256');if(!jwk)throw Error('Apple signing key not found');
 const publicKey=await crypto.subtle.importKey('jwk',jwk,{name:'RSASSA-PKCS1-v1_5',hash:'SHA-256'},false,['verify']);
 if(!await crypto.subtle.verify('RSASSA-PKCS1-v1_5',publicKey,bytes(parts[2]),new TextEncoder().encode(parts[0]+'.'+parts[1])))throw Error('Invalid Apple signature');
 if(claims.iss!=='https://appleid.apple.com'||claims.aud!==env.APPLE_CLIENT_ID||!Number.isFinite(claims.exp)||claims.exp<=now||!Number.isFinite(claims.iat)||claims.iat>now+60||claims.nonce!==nonce||typeof claims.sub!=='string'||!claims.sub||!['true',true].includes(claims.email_verified)||typeof claims.email!=='string')throw Error('Apple identity validation failed');
 return {sub:claims.sub,email:claims.email.toLowerCase()};
}
