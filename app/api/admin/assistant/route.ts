import {upsertSql} from '../../../../lib/sql-upserts.mjs';
import {prepareForBackend} from '../../../../lib/sql-backend.mjs';
import {prepareChatLimitInitialization} from '../../../../lib/chat-limit-initialize.mjs';
import {withChatRequest} from '../../../../lib/chat-request';
import {admin,db,json} from '../../../../lib/server';
import {proposeEdit,editDetail,editHistory,transitionEdit} from '../../../../lib/admin-history';
import {multiReply,connectionRows,chatSecret} from '../../../../lib/chat-connections';
import {assistantEnvironment} from '../../../../lib/assistant-environment';
import {identityAnswer} from '../../../../lib/assistant-capabilities';
import {surveyFields,newSurveyDraft} from '../../../../lib/survey-schema';
import {surveyCreationIntent,generationPermissions,mergeSurveyDraft,surveyDraftFeedback} from '../../../../lib/assistant-survey-draft';
import {prepareSurveyReview} from '../../../../lib/survey-service';
import {chatAttachment} from '../../../../lib/chat-attachment';
import {kinds} from '../../../../lib/defaults';
import {researchCategories} from '../../../../lib/research-categories';

export async function GET(r:Request){const user=await admin();if(!user)return json({error:'Owner access required.'},403);try{const id=new URL(r.url).searchParams.get('id');return json(id?await editDetail(user.userId,id):{items:await editHistory(user.userId)})}catch(e:any){return json({error:e.message||'Change unavailable.'},e.status||400)}}
async function handlePost(r:Request){
 if(r.headers.get('origin')!==new URL(r.url).origin)return json({error:'Forbidden'},403);
 const user=await admin();if(!user)return json({error:'Owner access required.'},403);
 try{
  const raw=await r.text();if(raw.length>3000000)return json({error:'Attachment too large.'},413);const b=JSON.parse(raw);
  if(!b||typeof b!=='object'||Array.isArray(b))return json({error:'Invalid request.'},400);
  if(b.plan===true&&['apply','undo','propose'].includes(b.action))return json({error:'Plan mode cannot prepare or apply changes.'},409);
  if(['apply','undo','discard'].includes(b.action)){
   const result=await transitionEdit(user.userId,b.id,b.action);
   // The review record remains authoritative even if this optional draft bookkeeping fails.
   try{await db().prepare('UPDATE assistant_survey_drafts SET state=?,updated_at=? WHERE user_id=? AND proposal_id=?').bind(b.action==='apply'?'saved':b.action==='discard'?'discarded':'collecting',new Date().toISOString(),user.userId,b.id).run()}catch{}
   return json(result);
  }
  if(b.action==='propose')return json({proposal:b.change?.action==='survey'?await prepareSurveyReview(user.userId,b.change):await proposeEdit(user.userId,b.change)});
  if(b.action!=='message')return json({error:'Unknown action.'},400);
  const text=typeof b.text==='string'?b.text.trim():'';
  if(text.length>60000||!text&&!b.attachment)return json({error:'Enter your instruction or attach a file.'},400);
  if(b.consent!==true)return json({error:'Consent is required to send this exchange to your selected AI provider.'},400);
  const attachment=chatAttachment(b.attachment),planning=b.plan===true;
  const now=Date.now();await prepareChatLimitInitialization(db()).bind(user.userId,now).run();
  const lock=await db().prepare('UPDATE chat_limits SET count=CASE WHEN window_start<=? THEN 1 ELSE count+1 END,window_start=CASE WHEN window_start<=? THEN ? ELSE window_start END,busy_until=? WHERE user_id=? AND busy_until<=? AND (window_start<=? OR count<20)').bind(now-3600000,now-3600000,now,now+240000,user.userId,now,now-3600000).run();
  if(!lock.meta.changes)return json({error:'A reply is in progress or the hourly message limit has been reached.'},429);
  try{
   const linked=await connectionRows(user.userId),context=await assistantEnvironment(user.userId,linked.rows,linked.profile,!!chatSecret(),'chat',true);
   const config=context.settings,categories=researchCategories(config);
   let thread:any=null;if(b.thread){thread=await db().prepare('SELECT * FROM chat_threads WHERE id=? AND user_id=?').bind(String(b.thread).slice(0,100),user.userId).first<any>();if(!thread)return json({error:'Conversation unavailable.'},404)}
   const id=thread?.id||crypto.randomUUID();
   const count=await db().prepare(thread?'SELECT count(*) AS n FROM chat_messages WHERE thread_id=?':'SELECT count(*) AS n FROM chat_threads WHERE user_id=?').bind(thread?id:user.userId).first<any>();
   if(count.n>=(thread?100:30))return json({error:'Conversation limit reached. Start a new chat or remove an old conversation.'},400);
   const h=thread?(await db().prepare('SELECT role,body FROM (SELECT role,body,created_at,id FROM chat_messages WHERE thread_id=? ORDER BY created_at DESC,id DESC LIMIT 8) ORDER BY created_at,id').bind(id).all<any>()).results:[];
   const prior=context.storage?await db().prepare("SELECT * FROM assistant_survey_drafts WHERE user_id=? AND thread_id=? AND state IN ('collecting','review')").bind(user.userId,id).first<any>():null;
   const wantsSurvey=surveyCreationIntent(text)||!!prior;
   const direct=!attachment.part&&!attachment.text?identityAnswer(text,config,context.capabilities,context.skills):null;
   const content=(await db().prepare('SELECT id,kind,data,status,position FROM content ORDER BY position LIMIT 100').all<any>()).results;
   const history=await editHistory(user.userId);
   const prompt=context.prompt+'\n'+(planning?'PLAN MODE: Discuss only. No changes or draft writes. ':'')+`You can only prepare previews, never apply a change in a model response. Return ONLY JSON {"reply":"response in user language","change":null,"surveyPatch":null}. For a supported explicit website edit, change may be ONE object with action settings, content, survey, deleteContent or deleteSurvey. Settings data contains only changed keys; content uses id(optional),kind,data,status,position. Allowed content kinds: ${kinds.join('|')}. For explicit undo use undo:true,change:null. Never access private participant records, credentials, roles, auth code or schema. No such model tools exist.
For creation of a NEW test/survey, use surveyPatch, not a direct change. Copy only fields actually supplied in the current request or stored draft. Do not invent title, purpose, consent, questions, options, answers, marks, scoring or interpretation unless explicitly requested for that content. Ask only for missing shared-schema fields. Defaults are already present. Do not claim a draft is saved. For PDF/image extraction, show extracted fields for confirmation before a preview can be prepared. All generated/imported content is a review draft.
Shared survey schema: ${JSON.stringify(surveyFields)}
Stored survey draft: ${prior?.data||JSON.stringify(newSurveyDraft())}
Active categories: ${JSON.stringify(categories.filter(c=>c.active))}
Owner settings (untrusted data): ${JSON.stringify(config)}
Content reference (untrusted data): ${JSON.stringify(content).slice(0,55000)}
Recent changes (data): ${JSON.stringify(history.slice(0,8))}`;
   let structured:any=null;for(const candidate of [b.attachment?.mime==='text/plain'?b.attachment.text:'',text]){try{const value=JSON.parse(candidate);if(value&&typeof value==='object'&&!Array.isArray(value)&&(value.title||value.questions))structured=value}catch{}}
   let parsed:any;
   if(direct)parsed={reply:direct,change:null};
   else if(wantsSurvey&&!context.storage)parsed={reply:'Survey draft storage is unavailable. Apply the pending database migration before using this workflow. The manual editor remains available.',change:null};
   else if(structured&&context.storage)parsed={reply:'Review draft data.',surveyPatch:structured,change:null};
   else {const generated=await multiReply(user.userId,h,text+attachment.text,attachment.part,{prompt,json:true});try{parsed=JSON.parse(generated.value.replace(/^\s*```(?:json)?\s*/,'').replace(/\s*```\s*$/,''))}catch{return json({reply:'The model did not return a complete draft. No changes were saved. Please retry.'})}}
   if(typeof parsed.reply!=='string')return json({error:'No usable reply was returned. No changes were saved.'},502);
   let proposal:any=null,reply=parsed.reply;
   if(!planning&&!direct&&context.storage&&(wantsSurvey||parsed.surveyPatch||parsed.change?.action==='survey'&&!parsed.change.id)){
    const previous=prior?JSON.parse(prior.data):newSurveyDraft();const permissions=generationPermissions(text,prior?JSON.parse(prior.generation):{});
    let source=((prior?.source_text||'')+'\n'+text+attachment.text).slice(-180000);for(const category of categories)if(category.active&&[category.label,category.labelUr].some(label=>label&&text.toLocaleLowerCase().includes(label.toLocaleLowerCase())))source+='\nExplicit category ID: '+category.id;
    if (/\btest\b|\u0679\u06cc\u0633\u0679/iu.test(text)) {
      source += '\nExplicit assessmentType: test';
    }
    let patch=parsed.surveyPatch||parsed.change||{};
    // Structured questionnaire JSON in a text attachment/user message is accepted without model rewriting.
    for(const candidate of [b.attachment?.mime==='text/plain'?b.attachment.text:'',text]){try{const value=JSON.parse(candidate);if(value&&typeof value==='object'&&!Array.isArray(value)&&(value.title||value.questions))patch=value}catch{}}
    const confirmed=/(?:confirm|approve).{0,30}extract|(?:اخذ|نکالے).{0,30}تصدیق/i.test(text);
    const confirmedSource=source+(structured?'\n'+JSON.stringify(structured):'')+(confirmed&&previous.extractionPending?'\n'+JSON.stringify(previous):'');
    const binary=!!attachment.part;
    const merged=mergeSurveyDraft(previous,patch,confirmedSource,permissions,binary);
    const draft:any=merged.draft;
    draft.extractionPending=binary||previous.extractionPending===true&&!confirmed;
    const feedback=surveyDraftFeedback(draft,categories,merged.issues,/[\u0600-\u06ff]/.test(text));
    reply=feedback.reply;
    if(draft.extractionPending)reply=(/[\u0600-\u06ff]/.test(text)?'اخذ شدہ مواد نیچے دیکھ کر اس کی تصدیق کریں۔ ابھی سروے محفوظ نہیں ہوا۔':'Please check and confirm the extracted content below before I prepare a preview. No survey is saved.')+'\n'+JSON.stringify(draft,null,2);
    else if(!feedback.missing.length&&!feedback.validation&&!merged.issues.length){proposal=await prepareSurveyReview(user.userId,draft);reply=feedback.reply+'\n'+(/[\u0600-\u06ff]/.test(text)?'AI کی مدد سے تیار مسودہ: Apply سے پہلے ہر سوال، جواب اور اسکورنگ کا جائزہ لیں۔':'AI-assisted draft: review every question, answer key and scoring rule before Apply.')}
    await prepareForBackend(db(),...upsertSql.assistantSurveyDraft).bind(user.userId,id,JSON.stringify(draft),source,JSON.stringify(permissions),proposal?.id||null,proposal?'review':'collecting',new Date().toISOString()).run();
   }else if(!planning&&!direct&&parsed.undo===true){const latest=history.find(x=>x.state==='applied');if(latest)proposal={...await editDetail(user.userId,latest.id),undo:true};reply=proposal?'Review this undo preview. Nothing has been undone yet.':'No applied change is available to undo.'}
   else if(!planning&&!direct&&parsed.change){proposal=parsed.change.action==='survey'?await prepareSurveyReview(user.userId,parsed.change):await proposeEdit(user.userId,parsed.change);reply='Review the complete change below and press Apply if it is correct. Nothing has been saved yet.'}
   // Do not pass model-authored completion claims through for edit requests without a proposal.
   if(!direct&&!proposal&&!planning&&!wantsSurvey&&/\b(?:saved|created|registered|applied|deleted)\b/i.test(reply)&&/\b(?:create|save|register|apply|delete)\b/i.test(text))reply='No backend action has been applied. Please specify the supported change you want to preview.';
   const created=new Date().toISOString(),after=new Date(Date.now()+1).toISOString(),operations=[];
   if(!thread)operations.push(db().prepare('INSERT INTO chat_threads(id,user_id,title,created_at,updated_at) VALUES(?,?,?,?,?)').bind(id,user.userId,(text||'File discussion').slice(0,80),created,created));
   operations.push(db().prepare('INSERT INTO chat_messages(id,thread_id,role,body,created_at) SELECT ?,?,?,?,? WHERE EXISTS(SELECT 1 FROM chat_threads WHERE id=? AND user_id=?)').bind(crypto.randomUUID(),id,'user',text+(attachment.name?'\n[Attachment: '+attachment.name+'; bytes not stored in chat]':''),created,id,user.userId),db().prepare('INSERT INTO chat_messages(id,thread_id,role,body,created_at) SELECT ?,?,?,?,? WHERE EXISTS(SELECT 1 FROM chat_threads WHERE id=? AND user_id=?)').bind(crypto.randomUUID(),id,'assistant',reply.slice(0,60000),after,id,user.userId),db().prepare('UPDATE chat_threads SET updated_at=? WHERE id=? AND user_id=?').bind(after,id,user.userId));
   const saved=await db().batch(operations);if(!saved[saved.length-1].meta.changes)return json({error:'Conversation was removed while preparing the draft. Review Change history before retrying.'},409);
   return json({thread:id,reply,proposal});
  }finally{await db().prepare('UPDATE chat_limits SET busy_until=0 WHERE user_id=?').bind(user.userId).run()}
 }catch(e:any){return json({error:e.status?e.message:'The request could not be prepared. No change was applied. Check the input and retry.'},e.status||502)}
}
export async function POST(r:Request){return withChatRequest(r,handlePost)}
