// AES-GCM with account-bound authenticated data. The master key is a hosted runtime secret.
const enc=new TextEncoder();
const b64=(bytes:Uint8Array)=>btoa(String.fromCharCode(...bytes));
const bytes=(s:string)=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
async function master(secret:string){if(!secret||bytes(secret).length!==32)throw Error('Chat encryption is not configured');return crypto.subtle.importKey('raw',bytes(secret),'AES-GCM',false,['encrypt','decrypt'])}
export async function encryptKey(value:string,userId:string,secret:string){const iv=crypto.getRandomValues(new Uint8Array(12));const encrypted=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:enc.encode(userId)},await master(secret),enc.encode(value));return JSON.stringify({v:1,iv:b64(iv),data:b64(new Uint8Array(encrypted))})}
export async function decryptKey(value:string,userId:string,secret:string){const data=JSON.parse(value);if(data.v!==1)throw Error('Invalid secret format');const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes(data.iv),additionalData:enc.encode(userId)},await master(secret),bytes(data.data));return new TextDecoder().decode(plain)}
