import {admin,json} from '../../../../lib/server';
import {connectionRows,chatSecret} from '../../../../lib/chat-connections';
import {assistantEnvironment} from '../../../../lib/assistant-environment';
export async function GET(){const user=await admin();if(!user)return json({error:'Owner access required.'},403);const {rows,profile}=await connectionRows(user.userId);const context=await assistantEnvironment(user.userId,rows,profile,!!chatSecret(),'chat',true);return json({capabilities:context.capabilities})}
