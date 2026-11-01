import {prepareForBackend} from '../../../../lib/sql-backend.mjs';
import {admin,db,json} from '../../../../lib/server';
export async function GET(){
  if(!await admin())return json({error:'Owner access required'},403);
  const start=new Date(Date.now()-29*86400000).toISOString().slice(0,10);
  const [content,requests,surveys,answers,accounts,files,daily]=await Promise.all([
    prepareForBackend(
      db(),
      "SELECT status,count(*) AS n FROM content WHERE id NOT LIKE 'demo-%' AND (status!='published' OR json_extract(data,'$.publishAt') IS NULL OR json_extract(data,'$.publishAt')='' OR json_extract(data,'$.publishAt')<=?) GROUP BY status",
      "SELECT status,count(*) AS n FROM content WHERE id NOT LIKE 'demo-%' AND (status!='published' OR JSON_UNQUOTE(JSON_EXTRACT(data,'$.publishAt')) IS NULL OR JSON_UNQUOTE(JSON_EXTRACT(data,'$.publishAt'))='' OR JSON_UNQUOTE(JSON_EXTRACT(data,'$.publishAt'))<=?) GROUP BY status"
    ).bind(new Date().toISOString()).all(),
    db().prepare('SELECT kind,status,count(*) AS n FROM submissions GROUP BY kind,status').all(),
    db().prepare("SELECT status,count(*) AS n FROM surveys WHERE id NOT LIKE 'demo-%' GROUP BY status").all(),
    db().prepare('SELECT count(*) AS n FROM answers WHERE expires_at IS NULL OR expires_at>?').bind(new Date().toISOString()).first<any>(),
    db().prepare('SELECT count(*) AS n FROM accounts').first<any>(),
    db().prepare('SELECT count(*) AS n FROM files').first<any>(),
    prepareForBackend(
      db(),
      "SELECT date(created_at,'+5 hours') AS day,count(*) AS n FROM submissions WHERE created_at>=? GROUP BY day ORDER BY day",
      "SELECT DATE_FORMAT(DATE_ADD(STR_TO_DATE(SUBSTRING(created_at,1,19),'%Y-%m-%dT%H:%i:%s'), INTERVAL 5 HOUR),'%Y-%m-%d') AS day,count(*) AS n FROM submissions WHERE created_at>=? GROUP BY day ORDER BY day"
    ).bind(start).all()
  ]);
  return json({content:content.results,requests:requests.results,surveys:surveys.results,responses:answers.n,accounts:accounts.n,files:files.n,daily:daily.results,updatedAt:new Date().toISOString(),note:'Saved records only. Page views, uptime and delivery are not monitored.'});
}
