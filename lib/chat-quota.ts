import {prepareChatLimitInitialization} from './chat-limit-initialize.mjs';
import {db} from './server';
export async function takeDictationQuota(user:string){const now=Date.now();await prepareChatLimitInitialization(db()).bind(user,now).run();const r=await db().prepare('UPDATE chat_limits SET count=CASE WHEN window_start<=? THEN 1 ELSE count+1 END,window_start=CASE WHEN window_start<=? THEN ? ELSE window_start END WHERE user_id=? AND (window_start<=? OR count<20)').bind(now-3600000,now-3600000,now,user,now-3600000).run();return !!r.meta.changes}
