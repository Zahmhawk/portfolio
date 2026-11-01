import {validateSurveyDraft,normalizedSurvey} from './survey-schema';
import {appearanceOptions} from './appearance';
import {researchCategories,categoryError} from './research-categories';
import {validateTestKeys,normalizeQuestion} from './questions';
import {researchError,researchConfig} from './research';
import {intakeSettings,compactFieldError} from './intake';
import {communityError,communityOptions} from './community';
import {bannerOptions,bannerError,bannerSlides} from './banners';
import {publicationType,youtubeResource} from './publications';
import {navigationOptions,navigationError} from './navigation';
import {db} from './server';import {defaults,kinds} from './defaults';import {cleanString,questionsError,safeURL} from './validation';

export class EditError extends Error {status:number;constructor(message:string,status=400){super(message);this.status=status}}
function fail(message:string,status=400):never{throw new EditError(message,status)}
export type PreparedEdit={entity:'settings'|'content'|'surveys';id:string;before:any;after:any;summary:string};
export async function prepareEdit(input:any):Promise<PreparedEdit>{
if(!input||typeof input!=='object'||Array.isArray(input))fail('Invalid edit.');
const now=new Date().toISOString();let b={...input};
if(b.action==='settings'){
const before=await db().prepare("SELECT * FROM settings WHERE id='site'").first<any>();
if(!b.data||typeof b.data!=='object'||Array.isArray(b.data)||Object.keys(b.data).some(k=>!Object.hasOwn(defaults,k)))fail('Choose supported site settings only.');
b.data={...defaults,...JSON.parse(before?.data||'{}'),...b.data};
const categoryIssue=categoryError(b.data||{});if(categoryIssue)fail(categoryIssue,400);const fieldIssue=compactFieldError({...defaults,...b.data});if(fieldIssue)fail(fieldIssue,400);if(!b.data||typeof b.data!=='object')fail('Invalid settings',400);const communityIssue=communityError(b.data);if(communityIssue)fail(communityIssue,400);const bannerIssue=bannerError(b.data);if(bannerIssue)fail(bannerIssue,400);if(b.data.bannerSlidesJson!==undefined){for(const slide of bannerSlides(b.data)){for(const image of [slide.image,slide.mobileImage]){if(image.startsWith('/api/files?id=')){const id=new URL(image,'https://local.invalid').searchParams.get('id');const f=await db().prepare('SELECT mime,is_public FROM files WHERE id=?').bind(id).first<any>();if(!f||!f.is_public||!f.mime.startsWith('image/'))fail('Banner backgrounds must use public image files. Upload them from Banners & backgrounds.',400);}}}}const menuError=navigationError(b.data);if(menuError)fail(menuError,400);const data:any={};for(const key of Object.keys(defaults))data[key]=typeof (defaults as any)[key]==='boolean'?!!b.data[key]:cleanString(b.data[key],8000);Object.assign(data,appearanceOptions(b.data),intakeSettings({...defaults,...b.data}),navigationOptions({...defaults,...b.data}),bannerOptions({...defaults,...b.data}),communityOptions({...defaults,...b.data}));for(const key of ['portrait','cv','favicon'])data[key]=safeURL(data[key]);if(data.favicon.startsWith('/api/files?id=')){const fid=new URL(data.favicon,'https://local.invalid').searchParams.get('id');const image=await db().prepare('SELECT mime,is_public FROM files WHERE id=?').bind(fid).first<any>();if(!image||!image.is_public||!image.mime.startsWith('image/'))fail('Choose a public uploaded image for the favicon',400);}data.whatsapp=data.whatsapp.replace(/[^0-9]/g,'');if(data.whatsapp&&!/^[1-9][0-9]{7,14}$/.test(data.whatsapp))fail('Use an international WhatsApp number, for example 923XXXXXXXXX.',400);if(!/^#[0-9a-fA-F]{6}$/.test(data.accent))data.accent=defaults.accent;
return {entity:'settings',id:'site',before,after:{id:'site',data:JSON.stringify(data)},summary:'Update website settings'};
}
if(b.action==='content'){
if(b.id&&(!/^[A-Za-z0-9_-]{1,100}$/.test(b.id)||b.id.startsWith('demo-')))fail('Duplicate demo content before editing.');
const before=b.id?await db().prepare('SELECT * FROM content WHERE id=?').bind(b.id).first<any>():null;
if(b.id&&!before)fail('Content no longer exists.',404);
b={...b,kind:b.kind||before?.kind,data:{...JSON.parse(before?.data||'{}'),...b.data},status:b.status||before?.status||'draft',position:b.position??before?.position??0};
if(!kinds.includes(b.kind))fail('Unknown section',400);if(!cleanString(b.data?.title,300))fail('A title is required.',400);const data:any={};for(const k of ['title','titleUr','subtitle','subtitleUr','body','bodyUr','tag','tagUr','meta','metaUr','date','deadline','mode','modeUr','venue','venueUr','category','categoryUr','subcategory','subcategoryUr','author','year','publishAt'])data[k]=cleanString(b.data[k],k.startsWith('body')?8000:500);if(data.publishAt&&!Number.isFinite(Date.parse(data.publishAt)))fail('Choose a valid publication date.',400);if(b.kind==='publication'){data.publicationType=publicationType(b.data);data.category=data.category||'Education';}data.value=Math.max(0,Math.min(1000000000,Math.round(Number(b.data.value)||0)));data.suffix=cleanString(b.data.suffix,12);data.icon=['teachers','schools','leaders','parents','learners','award'].includes(b.data.icon)?b.data.icon:'award';data.image=safeURL(b.data.image);data.imagesJson=JSON.stringify((()=>{try{const a=JSON.parse(b.data.imagesJson||'[]');return Array.isArray(a)?a.map(safeURL).filter(Boolean).slice(0,8):[]}catch{return []}})());data.featured=b.data.featured===true;data.link=safeURL(b.data.link);if(b.kind==='publication'&&data.publicationType==='video'){const video=youtubeResource(data.link);if(!video)fail('Enter a valid HTTPS YouTube video link.',400);data.link=video.url;}if(b.kind==='publication'&&data.publicationType==='image'&&b.status==='published'){if(!data.link.startsWith('/api/files?id='))fail('Upload an image for this resource.',400);const imageId=new URL(data.link,'https://local.invalid').searchParams.get('id');const image=await db().prepare('SELECT mime,is_public FROM files WHERE id=?').bind(imageId).first<any>();if(!image||!image.is_public||!image.mime.startsWith('image/'))fail('Choose a public uploaded image.',400);}if(b.kind==='publication'&&data.publicationType!=='image'&&b.status==='published'&&data.link.startsWith('/api/files?id=')){const fileId=new URL(data.link,'https://local.invalid').searchParams.get('id');const file=await db().prepare('SELECT mime,is_public FROM files WHERE id=?').bind(fileId).first<any>();if(!file||!file.is_public||file.mime!=='application/pdf')fail('Use a public PDF for this publication. Upload it with Upload PDF document.',400);}data.capacity=Math.max(0,Math.min(100000,Number(b.data.capacity)||0));data.registrationOpen=b.data.registrationOpen!==false;const id=cleanString(b.id,100)||crypto.randomUUID();const old=before;if(old&&b.updatedAt&&old.updated_at!==b.updatedAt)fail('This entry changed. Reload before saving.',409);
return {entity:'content',id,before,after:{id,kind:b.kind,data:JSON.stringify(data),status:['draft','published','archived'].includes(b.status)?b.status:'draft',position:Number(b.position)||0,updated_at:now},summary:(before?'Update ':'Create ')+b.kind+': '+data.title};
}
if(b.action==='deleteContent'||b.action==='deleteSurvey'){
const entity=b.action==='deleteContent'?'content':'surveys';
if(typeof b.id!=='string'||b.id.startsWith('demo-'))fail('Demo entries cannot be deleted individually. Hide demo data in Overview.');
const before=await db().prepare('SELECT * FROM '+entity+' WHERE id=?').bind(b.id).first<any>();
if(!before)fail('Record not found.',404);
if(entity==='surveys'&&(await db().prepare('SELECT count(*) AS n FROM answers WHERE survey_id=?').bind(b.id).first<any>())?.n)fail('This questionnaire has responses. Close it instead to preserve participant records.',409);
return {entity,id:b.id,before,after:null,summary:'Move to Trash: '+(before.title||JSON.parse(before.data).title)};
}
if(b.action==='survey'){
if(b.id&&(!/^[A-Za-z0-9_-]{1,100}$/.test(b.id)||b.id.startsWith('demo-')))fail('Duplicate demo questionnaires before editing.');
const id=b.id||crypto.randomUUID();const before=await db().prepare('SELECT * FROM surveys WHERE id=?').bind(id).first<any>();
if(b.id&&!before)fail('Questionnaire no longer exists.',404);
if(before&&(await db().prepare('SELECT count(*) AS n FROM answers WHERE survey_id=?').bind(id).first<any>())?.n)fail('Responses exist. Duplicate this questionnaire to edit it.',409);
b={...before,...b,questions:b.questions||JSON.parse(before?.questions||'[]'),config:b.config||JSON.parse(before?.config||'{}')};
const current=await db().prepare("SELECT data FROM settings WHERE id='site'").first<any>();
const issue=validateSurveyDraft(b,researchCategories(JSON.parse(current?.data||'{}')));if(issue)fail(issue);
if(before&&b.updatedAt&&b.updatedAt!==before.created_at)fail('Reload before saving this questionnaire.',409);
const normalized=normalizedSurvey(b),config=normalized.config,questions=normalized.questions;
return {entity:'surveys',id,before,after:{id,title:cleanString(b.title,300),description:cleanString(b.description,5000),consent:cleanString(b.consent,5000),questions:JSON.stringify(questions),status:['draft','published','closed'].includes(b.status)?b.status:'draft',version:before?.version||1,config:JSON.stringify(config),created_at:before?.created_at||now},summary:(before?'Update ':'Create ')+config.assessmentType+': '+cleanString(b.title,300)+' ('+questions.length+' questions)'};
}
fail('This action is not available to the website assistant.');
}
