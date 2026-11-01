import {prepareForBackend} from '../../../../lib/sql-backend.mjs';
import {admin,db,json} from '../../../../lib/server';
import {preferences} from '../../../../lib/assistant-preferences';
export async function GET(){
  const user=await admin();
  if(!user)return json({error:'Administrator access required'},403);
  const from=new Date(Date.now()-30*86400000).toISOString();
  const [daily,recent,totals,p]=await Promise.all([
    prepareForBackend(
      db(),
      "SELECT date(created_at,'+5 hours') AS day,provider,count(*) AS requests,sum(coalesce(input_tokens,0)) AS inputTokens,sum(coalesce(output_tokens,0)) AS outputTokens,sum(CAST(cost_usd AS REAL)) AS knownCostUsd,sum(CASE WHEN cost_usd IS NULL THEN 1 ELSE 0 END) AS unpriced FROM ai_usage WHERE user_id=? AND created_at>=? GROUP BY day,provider ORDER BY day",
      "SELECT DATE_FORMAT(DATE_ADD(STR_TO_DATE(SUBSTRING(created_at,1,19),'%Y-%m-%dT%H:%i:%s'), INTERVAL 5 HOUR),'%Y-%m-%d') AS day,provider,count(*) AS requests,sum(coalesce(input_tokens,0)) AS inputTokens,sum(coalesce(output_tokens,0)) AS outputTokens,sum(CAST(cost_usd AS DOUBLE)) AS knownCostUsd,sum(CASE WHEN cost_usd IS NULL THEN 1 ELSE 0 END) AS unpriced FROM ai_usage WHERE user_id=? AND created_at>=? GROUP BY day,provider ORDER BY day"
    ).bind(user.userId,from).all(),
    db().prepare('SELECT provider,model,status,input_tokens,output_tokens,cost_usd,duration_ms,created_at FROM ai_usage WHERE user_id=? ORDER BY created_at DESC LIMIT 50').bind(user.userId).all(),
    prepareForBackend(
      db(),
      'SELECT count(*) AS requests,sum(coalesce(input_tokens,0)) AS inputTokens,sum(coalesce(output_tokens,0)) AS outputTokens,sum(CAST(cost_usd AS REAL)) AS knownCostUsd,sum(CASE WHEN cost_usd IS NULL THEN 1 ELSE 0 END) AS unpriced FROM ai_usage WHERE user_id=? AND created_at>=?',
      'SELECT count(*) AS requests,sum(coalesce(input_tokens,0)) AS inputTokens,sum(coalesce(output_tokens,0)) AS outputTokens,sum(CAST(cost_usd AS DOUBLE)) AS knownCostUsd,sum(CASE WHEN cost_usd IS NULL THEN 1 ELSE 0 END) AS unpriced FROM ai_usage WHERE user_id=? AND created_at>=?'
    ).bind(user.userId,from).first(),
    preferences(user.userId)
  ]);
  return json({daily:daily.results,recent:recent.results,totals,budgetUsd:p.budgetUsd,updatedAt:new Date().toISOString(),scope:'This website only, last 30 days. Recording begins with this feature; earlier calls are not reconstructed. Provider-reported cost where available; not your complete provider bill. Voice, recorded transcription and external application usage are not included.'});
}
