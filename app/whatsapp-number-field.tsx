'use client';

import {useEffect, useId, useState} from 'react';
import {getCountries, getCountryCallingCode, parsePhoneNumberFromString} from 'libphonenumber-js';
import type {CountryCode} from 'libphonenumber-js';
import SmartSelect from './smart-select';
import geography from '../lib/geography-countries.json';

const names = new Map(geography.countries.map(country => [country.code, country.name]));
const countries = getCountries().map(code => ({code, name: names.get(code) || code, callingCode: getCountryCallingCode(code)})).sort((a,b) => a.name.localeCompare(b.name));

function readNumber(value:string):{country:CountryCode; national:string} {
  const digits=value.replace(/\D/g,'');
  if(!digits)return {country:'PK',national:''};
  const parsed=parsePhoneNumberFromString(`+${digits}`);
  if(parsed?.country)return {country:parsed.country,national:String(parsed.nationalNumber)};
  const match=[...countries].sort((a,b)=>b.callingCode.length-a.callingCode.length).find(item=>digits.startsWith(item.callingCode));
  return match?{country:match.code,national:digits.slice(match.callingCode.length)}:{country:'PK',national:digits};
}

export default function WhatsAppNumberField({value,onChange}:{value:string;onChange:(value:string)=>void}) {
  const id=useId();
  const [number,setNumber]=useState(()=>readNumber(value||''));
  const {country,national}=number;
  const callingCode=getCountryCallingCode(country);
  const combined=national?callingCode+national:'';
  // Sync external updates without changing an empty country selection or a shared calling code.
  useEffect(()=>{
    const incoming=(value||'').replace(/\D/g,'');
    setNumber(current=>incoming===(current.national?getCountryCallingCode(current.country)+current.national:'')?current:readNumber(value||''));
  },[value]);
  const parsed=combined?parsePhoneNumberFromString(`+${combined}`):undefined;
  const valid=!national||Boolean(parsed?.isValid()&&parsed.countryCallingCode===callingCode);
  function updateCountry(next:CountryCode){setNumber({country:next,national});onChange(national?getCountryCallingCode(next)+national:'')}
  function updateNumber(raw:string){
    const trimmed=raw.trim();
    if(trimmed.startsWith('+')||trimmed.startsWith('00')){
      const phone=parsePhoneNumberFromString(trimmed.startsWith('00')?`+${trimmed.slice(2)}`:trimmed);
      if(phone?.country){setNumber({country:phone.country,national:String(phone.nationalNumber)});onChange(phone.number.replace(/\D/g,''));return}
    }
    const digits=raw.replace(/\D/g,'').replace(/^0+/,'');
    setNumber({country,national:digits});onChange(digits?callingCode+digits:'');
  }
  return <div className="whatsapp-number-field wide">
    <h4>WhatsApp number</h4>
    <div className="whatsapp-number-grid">
      <label htmlFor={`${id}-country`}>Country / calling code
        <SmartSelect id={`${id}-country`} value={country} searchable searchPlaceholder="Search country or code..." onChange={event=>updateCountry(event.target.value as CountryCode)}>
          {countries.map(item=><option key={item.code} value={item.code} data-search={`${item.name}|${item.code}|+${item.callingCode}|${item.callingCode}`}>{item.name} (+{item.callingCode})</option>)}
        </SmartSelect>
      </label>
      <label htmlFor={`${id}-number`}>Number without country code
        <div className="whatsapp-number-input" dir="ltr">
          <span aria-hidden="true">+{callingCode}</span>
          <input id={`${id}-number`} type="tel" inputMode="tel" autoComplete="tel-national" dir="ltr" maxLength={25} placeholder={country==='PK'?'3001234567':'Phone number'} value={national} aria-invalid={!valid} aria-describedby={`${id}-help`} onChange={event=>updateNumber(event.target.value)} ref={element=>{element?.setCustomValidity(valid?'':'Enter a valid number for the selected country.')}}/>
        </div>
      </label>
    </div>
    <small id={`${id}-help`} role={valid?undefined:'alert'}>{!valid?'Check the selected country and phone number.':combined?`Saved WhatsApp number: +${combined}`:'Select a country, then enter the number without its leading zero.'}</small>
  </div>;
}
