import {researchDefaults,researchConfig,researchError} from './research';
import {questionsError,cleanString} from './validation';
import {questionTypes,validateTestKeys,normalizeQuestion} from './questions';
export const surveyFields={title:{required:true,max:300},description:{required:true,max:5000,purpose:'purpose'},consent:{required:true,max:5000},questions:{required:true,min:1,max:60,item:{id:'unique 1-100 letter/digit/underscore/hyphen ID',label:'required, max 500 characters',labelUr:'optional Urdu script',type:questionTypes.map(([type])=>type),required:'boolean',options:'2-30 distinct strings for choice/radio/multi/multiselect',min:'scale integer endpoint',max:'scale integer endpoint',marks:'test: >0 and <=100; default 1',correctAnswer:'test: required for objective items; valid option or array for multi; text key optional for manual marking'}},config:{assessmentType:['survey','test'],audience:'active category ID',identityMode:['named','anonymous'],minorPolicy:['adults','guardian'],retentionDays:{min:1,max:3650},scoringMode:['off','reviewed']}} as const;
export function newSurveyDraft(audience=''){return {id:'',title:'',description:'',consent:'',status:'draft',questions:[] as any[],config:{...researchDefaults,audience,domains:[]}}}
export function missingSurveyFields(input:any){const missing:string[]=[];for(const key of ['title','description','consent'])if(typeof input?.[key]!=='string'||!input[key].trim())missing.push(key);if(!Array.isArray(input?.questions)||!input.questions.length)missing.push('questions');if(!input?.config?.audience)missing.push('config.audience');return missing}
export function validateSurveyDraft(input:any,categories:{id:string;active:boolean}[]){
 const missing=missingSurveyFields(input);if(missing.length)return 'Required fields: '+missing.join(', ');
 for(const [key,max] of [['title',300],['description',5000],['consent',5000]] as const)if(input[key].length>max)return key+' is too long.';
 const issue=questionsError(input.questions);if(issue)return issue;
 const raw=input.config;if(!['survey','test'].includes(raw.assessmentType))return 'Choose survey or test.';
 if(!['named','anonymous'].includes(raw.identityMode)||!['adults','guardian'].includes(raw.minorPolicy))return 'Choose valid identity and age/guardian settings.';
 if(!Number.isInteger(raw.retentionDays)||raw.retentionDays<1||raw.retentionDays>3650)return 'Retention must be 1–3650 days.';
 if(!['off','demo','reviewed'].includes(raw.scoringMode))return 'Choose a valid scoring mode.';
 const config=researchConfig(raw);if(!categories.some(c=>c.active&&c.id===config.audience))return 'Choose an active participant category.';
 if(config.assessmentType==='test'&&config.scoringMode!=='off')return 'Tests use answer keys and marks, not psychometric scoring.';
 const scoring=researchError(config,input.questions);if(scoring)return scoring;
 if(config.assessmentType==='test'){const keys=validateTestKeys(input.questions);if(keys)return keys}
 return '';
}
export function normalizedSurvey(input:any){const config=researchConfig(input.config);return {title:cleanString(input.title,300),description:cleanString(input.description,5000),consent:cleanString(input.consent,5000),questions:input.questions.map((q:any)=>normalizeQuestion(q,config.assessmentType==='test')),config}}
