import {newSurveyDraft,missingSurveyFields,validateSurveyDraft} from './survey-schema';
export function surveyCreationIntent(text:string){return /(?:create|add|make|build|new).{0,55}(?:survey|test|questionnaire)|(?:survey|test|questionnaire).{0,35}(?:create|add|make|build)|(?:سروے|ٹیسٹ|سوال نامہ).{0,45}(?:بنائیں|بنا|نیا|تیار)|(?:نیا|بنائیں).{0,45}(?:سروے|ٹیسٹ|سوال نامہ)/i.test(text)}
export function generationPermissions(text:string,previous:any={}){
 const denied=(topic:string)=>new RegExp('(?:do not|don.t|never|without)\\s+(?:generate|invent|write|create|draft|design).{0,35}'+topic,'i').test(text);
 return {
 questions:!denied('questions')&&!/(?:سوالات|سوال).{0,20}(?:مت|نہ|نہیں)/.test(text)&&(previous.questions===true||/\b(?:generate|invent|draft).{0,35}\bquestions\b|\b(?:write|create)\s+(?:(?:\d+|new|sample|draft|original)\s+)*questions\b|(?:سوالات|سوال).{0,20}(?:بنائیں|تخلیق|لکھیں)/i.test(text)),
 answers:!denied('(?:answers|answer keys)')&&(previous.answers===true||/\b(?:generate|invent|draft|write|create)\s+(?:(?:new|sample|draft|correct)\s+)*(?:answers|answer keys)\b|(?:جوابات|جواب).{0,20}(?:بنائیں|لکھیں)/i.test(text)),
 scoring:!denied('(?:scoring|interpretation)')&&(previous.scoring===true||/\b(?:generate|write|create|design).{0,35}(?:scoring|interpretation)|(?:اسکورنگ|تشریح).{0,20}(?:بنائیں|لکھیں)/i.test(text))};
}
const normalized=(s:string)=>s.normalize('NFKC').toLocaleLowerCase().replace(/\s+/g,' ').trim();
const supplied=(value:any,source:string)=>typeof value==='string'&&value.trim()&&normalized(source).includes(normalized(value));
function suppliedKey(key:string,value:any,source:string){
 const pair=JSON.stringify({[key]:value}).slice(1,-1);
 if(normalized(source).includes(normalized(pair)))return true;
 const escaped=String(value).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 const label=key==='marks'?'(?:marks|نمبر)':'(?:correct\\s*answer|answer\\s*key|درست\\s*جواب)';
 return !Array.isArray(value)&&new RegExp(label+'\\s*[:=]\\s*'+escaped+'(?:\\s|[,.;]|$)','i').test(source);
}
export function mergeSurveyDraft(previous:any,patch:any,source:string,permissions:any,binary=false){
 const next={...newSurveyDraft(),...previous,config:{...newSurveyDraft().config,...previous?.config}};const issues:string[]=[];
 if(!patch||typeof patch!=='object'||Array.isArray(patch))return {draft:next,issues};
 for(const key of ['title','description','consent'])if(typeof patch[key]==='string'&&patch[key]!==previous?.[key]){if(supplied(patch[key],source)||binary)next[key as 'title']=patch[key];else issues.push('Provide the exact '+key+' text; it cannot be invented.')}
 if(patch.config&&typeof patch.config==='object'&&!Array.isArray(patch.config)){
  for(const key of Object.keys(newSurveyDraft().config))if(Object.hasOwn(patch.config,key)){
   if(['audience','identityMode','minorPolicy','retentionDays','assessmentType','scoringMode'].includes(key)&&JSON.stringify(patch.config[key])!==JSON.stringify(previous?.config?.[key])&&!normalized(source).includes(normalized(String(patch.config[key])))){issues.push('Please supply config.'+key+' explicitly.');continue}
   const evidence=['instrument','reference','license','reviewer','reviewedAt'].includes(key);
   if((['domains','construct'].includes(key)||evidence)&&JSON.stringify(patch.config[key])!==JSON.stringify(previous?.config?.[key])&&patch.config[key]&&(!Array.isArray(patch.config[key])||patch.config[key].length)&&(evidence||!permissions.scoring)&&!binary&&!normalized(source).includes(normalized(typeof patch.config[key]==='string'?patch.config[key]:JSON.stringify(patch.config[key])))){issues.push(evidence?'Supply actual instrument, evidence, permission and reviewer details; these cannot be fabricated.':'Supply scoring/interpretation rules or explicitly request a generated draft.');continue}
   (next.config as any)[key]=patch.config[key];
  }
 }
 if(Array.isArray(patch.questions)&&JSON.stringify(patch.questions)!==JSON.stringify(previous?.questions)){
  let valid=true;for(const q of patch.questions){if(!q||typeof q.label!=='string'||q.options!==undefined&&!Array.isArray(q.options)){valid=false;break}
   if(!permissions.questions&&!binary&&(!supplied(q.label,source)||(q.options||[]).some((v:any)=>!supplied(String(v),source))))valid=false;
   for(const key of ['correctAnswer','marks'])if(q[key]!==undefined&&!permissions.answers&&!binary&&!suppliedKey(key,q[key],source))valid=false;
  }
  if(valid)next.questions=patch.questions;else issues.push('Provide the question text, options and test keys/marks, or explicitly request their generation.');
 }
 next.id='';next.status='draft';return {draft:next,issues};
}
export function surveyDraftFeedback(draft:any,categories:any[],issues:string[],ur:boolean){const missing=missingSurveyFields(draft);const validation=missing.length?'':validateSurveyDraft(draft,categories);const names:any={title:ur?'عنوان':'title',description:ur?'مقصد':'purpose',consent:ur?'شرکت کی رضامندی کا متن':'participant consent text',questions:ur?'سوالات اور ضروری جوابات':'questions and any required test keys','config.audience':ur?'شرکا کا فعال زمرہ':'active participant category'};return {missing,validation,reply:missing.length?(ur?'براہ کرم یہ باقی معلومات فراہم کریں: ':'Please provide the remaining fields: ')+missing.map(k=>names[k]).join(', '):validation?(ur?'مسودہ ابھی درست نہیں: ':'The draft needs correction: ')+validation:issues.length?issues.join(' '):ur?'مکمل مسودہ تیار ہے۔ پیش نظارہ دیکھیں، پھر Apply دبائیں۔ ابھی سروے محفوظ نہیں ہوا۔':'The complete draft is ready for review. Inspect the preview, then press Apply. The survey has not been saved.'}}
