"""Generate local geography assets from official GeoNames dumps (CC BY 4.0).
Download countryInfo.txt, admin1CodesASCII.txt, admin2Codes.txt, timeZones.txt,
cities500.zip and PK.zip to the directory supplied as argv[1].
"""
import sys,json,zipfile,collections,datetime,pathlib,re
source=pathlib.Path(sys.argv[1]);root=pathlib.Path(__file__).resolve().parents[1];out=root/'public/geography';out.mkdir(parents=True,exist_ok=True)
def rows(name):return [l.split('\t') for l in (source/name).read_text().splitlines() if l.strip() and not l.startswith('#')]
zones=collections.defaultdict(set)
for r in rows('timeZones.txt'):
 if len(r)>1 and '/' in r[1]:zones[r[0]].add(r[1])
countries={r[0]:{'code':r[0],'name':r[4],'zones':sorted(zones[r[0]])} for r in rows('countryInfo.txt') if len(r)>5 and re.fullmatch('[A-Z]{2}',r[0])}
admin1={r[0]:r[2] or r[1] for r in rows('admin1CodesASCII.txt')};admin2={r[0]:r[2] or r[1] for r in rows('admin2Codes.txt')}
data={cc:{'country':cc,'regions':{},'cities':{}} for cc in countries}
for code,name in admin1.items():
 cc,state=code.split('.',1)
 if cc in data:data[cc]['regions'][state]={'id':state,'name':name,'districts':{},'zones':set()}
for code,name in admin2.items():
 parts=code.split('.',2)
 if len(parts)!=3:continue
 cc,state,district=parts
 if cc in data and state in data[cc]['regions']:data[cc]['regions'][state]['districts'][district]={'id':district,'name':name,'zones':set()}
def add(r):
 if len(r)<19 or r[8] not in data or r[6]!='P' or r[7] in ['PPLQ','PPLH','PPLW']:return
 cc=r[8];state=r[10] or '_';district=r[11] or '_';country=data[cc]
 # Do not invent region names for unknown identifiers.
 if state not in country['regions']:
  if state!='_':return
  country['regions'][state]={'id':'_','name':'Country-wide / region not specified','districts':{},'zones':set()}
 region=country['regions'][state]
 if district not in region['districts']:
  if district!='_':return
  region['districts'][district]={'id':'_','name':'District not specified / wider area','zones':set()}
 timezone=r[17];region['zones'].add(timezone);region['districts'][district]['zones'].add(timezone)
 # id, display name, IANA zone. No coordinates or arbitrary parent guesses.
 country['cities'].setdefault(state+'.'+district,{})[r[0]]=[r[0],r[2] or r[1],timezone]
with zipfile.ZipFile(source/'cities500.zip') as z:
 for line in z.read('cities500.txt').decode().splitlines():
  r=line.split('\t')
  if r[8]!='PK':add(r)
with zipfile.ZipFile(source/'PK.zip') as z:
 for line in z.read('PK.txt').decode().splitlines():add(line.split('\t'))
count=0;pkcount=0
for cc,country in data.items():
 regions=[]
 for state,region in country['regions'].items():
  region['zones']=sorted(z for z in region['zones'] if z)
  region['districts']=sorted([dict(d,zones=sorted(z for z in d['zones'] if z)) for d in region['districts'].values()],key=lambda d:d['name'])
  regions.append(region)
 country['regions']=sorted(regions,key=lambda r:r['name'])
 citymap={key:sorted(values.values(),key=lambda v:v[1]) for key,values in country['cities'].items()}
 count+=sum(map(len,citymap.values()))
 if cc=='PK':
  pkcount=sum(map(len,citymap.values()));(out/'PK').mkdir(exist_ok=True)
  for key,values in citymap.items():(out/'PK'/f'{key}.json').write_text(json.dumps(values,ensure_ascii=False,separators=(',',':')))
  country['cityFiles']=True;country['cityFileKeys']=sorted(citymap);country['cities']={}
 else:country['cities']=citymap
 (out/f'{cc}.json').write_text(json.dumps(country,ensure_ascii=False,separators=(',',':')))
meta={'version':datetime.date.today().isoformat(),'source':'GeoNames','license':'CC BY 4.0','countries':sorted(countries.values(),key=lambda c:c['name'])}
(root/'lib/geography-countries.json').write_text(json.dumps(meta,ensure_ascii=False,separators=(',',':')))
(out/'LICENSE.txt').write_text('Geographical data © GeoNames contributors. CC BY 4.0: https://creativecommons.org/licenses/by/4.0/\nSource: https://download.geonames.org/export/dump/\nCountry/state/district data from countryInfo, admin1CodesASCII, admin2Codes. Worldwide cities500 and Pakistan populated places from PK.zip. Coverage and administrative assignments may be incomplete. No guessed parent districts. Generated '+meta['version']+'\n')
print(json.dumps({'countries':len(countries),'places':count,'pakistanPlaces':pkcount,'files':len(list(out.rglob('*'))),'bytes':sum(p.stat().st_size for p in out.rglob('*') if p.is_file())}))
