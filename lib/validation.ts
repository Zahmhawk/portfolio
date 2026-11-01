export type {Question} from './questions';
export function cleanString(v:unknown,max=3000){return typeof v==='string'?v.trim().slice(0,max):''}
export function safeURL(v:unknown){const s=cleanString(v,1000);if(!s)return '';if(/^\/api\/demo-document\?id=demo-publication(?:-[234])?$/.test(s))return s;if(s.startsWith('/api/files?id=')&&/^\/api\/files\?id=[a-zA-Z0-9-]+$/.test(s))return s;try{const u=new URL(s);return u.protocol==='https:'?u.toString():''}catch{return ''}}
export function contactError(b:any){if(!cleanString(b.name,150)||!cleanString(b.contact,200)||!cleanString(b.message,3000))return 'Please complete your name, contact and message.';if(b.consent!==true)return 'Please agree to the use of your information for this request.';if(b.website)return 'Unable to accept this request.';return ''}
export {validateQuestions as questionsError,validateAnswers as answerError,summarizeQuestions as surveyReport} from './questions';
