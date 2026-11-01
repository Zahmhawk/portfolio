import {defaults} from '../../../lib/defaults';import {settingsRevision} from '../../../lib/settings-revision';
import {db,json} from '../../../lib/server';import {appearanceOptions} from '../../../lib/appearance';
export async function GET(){const row=await db().prepare("SELECT data FROM settings WHERE id='site'").first<any>();const raw=row?.data||'{}',stored=JSON.parse(raw),settings=Object.fromEntries(Object.entries(defaults).map(([key,value])=>[key,stored[key]??value]));return json({...appearanceOptions(settings),revision:await settingsRevision(raw),settings})}
