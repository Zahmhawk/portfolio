import {randomBytes,scryptSync,timingSafeEqual,createHash} from 'node:crypto';
export const hashToken=v=>createHash('sha256').update(v).digest('hex');
export const randomToken=()=>randomBytes(32).toString('base64url');
export function hashPassword(value){const salt=randomBytes(18).toString('base64url');return ['scrypt',32768,8,3,salt,scryptSync(value,salt,32,{N:32768,r:8,p:3,maxmem:64*1024*1024}).toString('base64url')].join('$')}
export function verifyPassword(value,stored){try{const [alg,n,r,p,salt,hash]=(stored||'scrypt$32768$8$3$dummy-salt$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA').split('$');if(alg!=='scrypt'||n!=='32768'||r!=='8'||p!=='3')return false;const actual=scryptSync(value,salt,32,{N:32768,r:8,p:3,maxmem:64*1024*1024}),expected=Buffer.from(hash,'base64url');return !!stored&&actual.length===expected.length&&timingSafeEqual(actual,expected)}catch{return false}}
