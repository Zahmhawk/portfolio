import {proposeEdit,transitionEdit} from './admin-history';
export async function prepareSurveyReview(userId:string,input:any){return proposeEdit(userId,{...input,action:'survey',status:'draft'})}
export async function saveManualSurvey(userId:string,input:any){const preview=await proposeEdit(userId,{...input,action:'survey'});const result=await transitionEdit(userId,preview.id,'apply');if(!result.ok||!result.recordId)throw Error('Survey save was not confirmed.');return {...result,id:result.recordId}}
