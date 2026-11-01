import {db} from './server';import {EditError,prepareEdit,PreparedEdit} from './admin-edits';
const tables={settings:['id','data'],content:['id','kind','data','status','position','updated_at'],surveys:['id','title','description','consent','questions','status','version','config','created_at']} as const;
export async function proposeEdit(user:string,input:any){const edit=await prepareEdit(input),id=crypto.randomUUID(),now=new Date().toISOString();await db().prepare('INSERT INTO admin_changes(id,user_id,entity,record_id,before_data,after_data,summary,state,created_at) VALUES(?,?,?,?,?,?,?,?,?)').bind(id,user,edit.entity,edit.id,JSON.stringify(edit.before),JSON.stringify(edit.after),edit.summary,'draft',now).run();return {...edit,recordId:edit.id,id,state:'draft',created_at:now}}
export async function editHistory(user:string){return (await db().prepare('SELECT id,entity,record_id,summary,state,created_at,applied_at FROM admin_changes WHERE user_id=? ORDER BY created_at DESC LIMIT 50').bind(user).all<any>()).results}
export async function editDetail(user:string,id:string){const row=await db().prepare('SELECT * FROM admin_changes WHERE id=? AND user_id=?').bind(id,user).first<any>();if(!row)throw new EditError('Change unavailable.',404);return {...row,before:JSON.parse(row.before_data),after:JSON.parse(row.after_data)}}
export async function transitionEdit(user:string,id:string,mode:'apply'|'undo'|'discard'){
  const row=await editDetail(user,id);
  if(mode==='discard'){await db().prepare("UPDATE admin_changes SET state='discarded' WHERE id=? AND user_id=? AND state='draft'").bind(id,user).run();return {ok:true}}
  const undo=mode==='undo',required=undo?'applied':'draft';
  if(row.state!==required)throw new EditError('This change has already been handled.',409);
  if(!undo&&Date.now()-Date.parse(row.created_at)>86400000)throw new EditError('Preview expired. Prepare a new change.',409);
  const before=undo?row.after:row.before,after=undo?row.before:row.after,entity=row.entity as PreparedEdit['entity'],columns=tables[entity];
  if(!columns)throw new EditError('Unsupported record.',400);
  if(entity==='surveys'&&(await db().prepare('SELECT count(*) AS n FROM answers WHERE survey_id=?').bind(row.record_id).first<any>())?.n)throw new EditError('Responses now exist. Changes to this questionnaire are locked.',409);
  const isMysql=(db() as any).dialect==='mysql';
  const eqOp=isMysql?' <=> ?':' IS ?';
  const fromDual=isMysql?' FROM DUAL':'';
  const values:any[]=[];
  let condition:string;
  if(before){condition=columns.map(k=>k+eqOp).join(' AND ');values.push(...columns.map(k=>before[k]))}
  else{condition='NOT EXISTS(SELECT 1 FROM '+entity+' WHERE id=?)';values.push(row.record_id)}
  if(entity==='surveys'){condition+=' AND NOT EXISTS(SELECT 1 FROM answers WHERE survey_id=?)';values.push(row.record_id)}
  const gate="EXISTS(SELECT 1 FROM admin_changes WHERE id=? AND user_id=? AND state=?)";
  let stmt:any;
  if(after&&before){stmt=db().prepare('UPDATE '+entity+' SET '+columns.filter(k=>k!=='id').map(k=>k+'=?').join(',')+' WHERE '+condition+' AND '+gate).bind(...columns.filter(k=>k!=='id').map(k=>after[k]),...values,id,user,required)}
  else if(after){stmt=db().prepare('INSERT INTO '+entity+'('+columns.join(',')+') SELECT '+columns.map(()=>'?').join(',')+fromDual+' WHERE '+condition+' AND '+gate).bind(...columns.map(k=>after[k]),...values,id,user,required)}
  else{stmt=db().prepare('DELETE FROM '+entity+' WHERE '+condition+' AND '+gate).bind(...values,id,user,required)}
  if(!undo&&after){
    if(entity==='settings')await prepareEdit({action:'settings',data:JSON.parse(after.data)});
    else if(entity==='content')await prepareEdit({action:'content',...(before?{id:row.record_id}:{}),kind:after.kind,data:JSON.parse(after.data),status:after.status,position:after.position});
    else await prepareEdit({action:'survey',...(before?{id:row.record_id}:{}),...after,id:before?row.record_id:undefined,questions:JSON.parse(after.questions),config:JSON.parse(after.config)});
  }
  const now=new Date().toISOString();
  let updateChangeStmt:any;
  let auditStmt:any;
  if(isMysql){
    updateChangeStmt=(db().prepare('UPDATE admin_changes SET state=?,applied_at=? WHERE id=? AND user_id=? AND state=?').bind(undo?'undone':'applied',now,id,user,required) as any).requirePreviousChanges();
    auditStmt=(db().prepare('INSERT INTO audit(id,user_id,action,created_at) VALUES (?,?,?,?)').bind(crypto.randomUUID(),user,(undo?'Undo: ':'Apply: ')+row.summary,now) as any).requirePreviousChanges();
  }else{
    updateChangeStmt=db().prepare('UPDATE admin_changes SET state=?,applied_at=? WHERE id=? AND user_id=? AND state=? AND changes()=1').bind(undo?'undone':'applied',now,id,user,required);
    auditStmt=db().prepare('INSERT INTO audit(id,user_id,action,created_at) SELECT ?,?,?,? WHERE changes()=1').bind(crypto.randomUUID(),user,(undo?'Undo: ':'Apply: ')+row.summary,now);
  }
  const results=await db().batch([stmt,updateChangeStmt,auditStmt]);
  if(!results[0].meta.changes)throw new EditError('The record changed since this preview. Reload and prepare a new change; newer edits were preserved.',409);
  return {ok:true,state:undo?'undone':'applied',entity,recordId:row.record_id,summary:row.summary};
}
