import {db} from './server';import {intakeDefaults} from './intake';
export async function intakeSiteSettings(){const row=await db().prepare("SELECT data FROM settings WHERE id='site'").first<any>();return {...intakeDefaults,...(row?JSON.parse(row.data):{})}}
