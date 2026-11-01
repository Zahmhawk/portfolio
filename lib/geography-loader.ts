export type Place=[string,string,string];
export type District={id:string;name:string;zones:string[]};
export type Region={id:string;name:string;zones:string[];districts:District[]};
export type CountryData={country:string;regions:Region[];cities:Record<string,Place[]>;cityFiles?:boolean;cityFileKeys?:string[]};
const cache=new Map<string,unknown>();
export async function loadGeography<T>(path:string,version:string,validate:(value:unknown)=>value is T,signal:AbortSignal,timeoutMs=12000):Promise<T>{
  const key=path+'?v='+encodeURIComponent(version);
  if(cache.has(key))return cache.get(key) as T;
  const controller=new AbortController();
  const abort=()=>controller.abort();signal.addEventListener('abort',abort,{once:true});
  const timer=setTimeout(()=>controller.abort(),timeoutMs);
  try{
    if(signal.aborted)controller.abort();
    const response=await fetch(key,{signal:controller.signal,headers:{Accept:'application/json'}});
    if(!response.ok)throw Error('Location data could not load (HTTP '+response.status+').');
    if(response.redirected||!response.headers.get('content-type')?.includes('application/json'))throw Error('Expected location data but received a different page. Please retry or sign in again.');
    const value:unknown=await response.json();
    if(!validate(value))throw Error('The location data format is invalid.');
    if(controller.signal.aborted)throw Error('Location request was cancelled.');
    cache.set(key,value);return value;
  }catch(error){
    if(controller.signal.aborted&&!signal.aborted)throw Error('Location request timed out. Please retry.');
    throw error;
  }finally{clearTimeout(timer);signal.removeEventListener('abort',abort)}
}
const zones=(v:any)=>Array.isArray(v)&&v.every((z:any)=>typeof z==='string');
export function isCountryData(v:any):v is CountryData{return !!v&&typeof v.country==='string'&&Array.isArray(v.regions)&&v.regions.every((r:any)=>typeof r.id==='string'&&typeof r.name==='string'&&zones(r.zones)&&Array.isArray(r.districts)&&r.districts.every((d:any)=>typeof d.id==='string'&&typeof d.name==='string'&&zones(d.zones)))&&!!v.cities&&typeof v.cities==='object'&&!Array.isArray(v.cities)&&Object.values(v.cities).every(isPlaces)&&(v.cityFileKeys===undefined||zones(v.cityFileKeys))}
export function isPlaces(v:any):v is Place[]{return Array.isArray(v)&&v.every((p:any)=>Array.isArray(p)&&p.length===3&&p.every((s:any)=>typeof s==='string'))}
