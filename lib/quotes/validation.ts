import { cargoCategories, euCountries, markets } from './config.ts';
export type QuoteInput = {
  customerName:string;customerPhone:string;preferredContactMethod:'ZALO'|'PHONE';zaloSamePhone:boolean;
  originCountry:'VN';originCity:string;destinationMarket:string;destinationCountry:string;destinationCity:string;destinationPostalCode:string;
  serviceType:'AIR'|'SEA'|'ADVICE';cargoCategory:string;cargoDescription:string;estimatedWeightKg:number|null;packageCount:number|null;
  dimensions:{length:number;width:number;height:number}|null;customerNotes:string;source:string;consent:true;
};
export class QuoteValidationError extends Error { fields:Record<string,string>;constructor(fields:Record<string,string>){super('VALIDATION');this.fields=fields;} }
export function validateQuote(value:unknown):QuoteInput {
  if(!value||typeof value!=='object'||Array.isArray(value))throw new QuoteValidationError({form:'Dữ liệu yêu cầu chưa hợp lệ.'});
  const v=value as Record<string,unknown>,errors:Record<string,string>={};
  function text(key:string,max:number,required=false){const raw=v[key];const s=typeof raw==='string'?raw.trim().normalize('NFC').replace(/\s+/g,' '):'';if((required&&!s)||s.length>max||/[\u0000-\u001f\u007f]/.test(s))errors[key]=`Vui lòng kiểm tra thông tin (tối đa ${max} ký tự).`;return s;}
  function number(key:string,min:number,max:number,integer=false){const x=v[key];if(x==null||x==='')return null;if(typeof x!=='number'||!Number.isFinite(x)||x<min||x>max||(integer&&!Number.isInteger(x))){errors[key]='Số chưa hợp lệ.';return null;}return x;}
  const customerName=text('customerName',80,true),customerPhone=text('customerPhone',24,true).replace(/[\s().-]/g,'');
  if(!/^\+?\d{8,15}$/.test(customerPhone))errors.customerPhone='Nhập số điện thoại từ 8 đến 15 chữ số.';
  const destinationMarket=text('destinationMarket',2,true),destinationCountry=text('destinationCountry',2,true);
  if(!markets.some(m=>m.code===destinationMarket))errors.destinationMarket='Chọn điểm đến.';
  if(destinationMarket==='EU'?!euCountries.some(c=>c.code===destinationCountry):destinationCountry!==destinationMarket)errors.destinationCountry='Chọn quốc gia đến cụ thể.';
  const serviceType=text('serviceType',6,true),cargoCategory=text('cargoCategory',40,true),preferredContactMethod=text('preferredContactMethod',5,true);
  if(!['AIR','SEA','ADVICE'].includes(serviceType))errors.serviceType='Chọn phương án vận chuyển.';
  if(!cargoCategories.some(c=>c===cargoCategory))errors.cargoCategory='Chọn nhóm hàng.';
  if(!['ZALO','PHONE'].includes(preferredContactMethod))errors.preferredContactMethod='Chọn kênh liên hệ.';
  if(v.consent!==true)errors.consent='Cần đồng ý sử dụng thông tin để xử lý yêu cầu.';
  if(v.website)errors.form='Không thể tiếp nhận yêu cầu này.';
  const source=text('source',30,true);if(!['destination_gallery','header_cta','contact_form','quote_form','public_cta'].includes(source))errors.source='Nguồn yêu cầu chưa hợp lệ.';
  let dimensions:QuoteInput['dimensions']=null;
  if(v.dimensions!=null){const d=v.dimensions as Record<string,unknown>;if(typeof d!=='object'||Array.isArray(d)||!['length','width','height'].every(k=>typeof d[k]==='number'&&Number.isFinite(d[k])&&(d[k] as number)>0&&(d[k] as number)<=2000))errors.dimensions='Nhập đủ ba kích thước hợp lệ hoặc để trống.';else dimensions={length:d.length as number,width:d.width as number,height:d.height as number};}
  const result={customerName,customerPhone,preferredContactMethod:preferredContactMethod as QuoteInput['preferredContactMethod'],zaloSamePhone:v.zaloSamePhone!==false,originCountry:'VN' as const,originCity:text('originCity',120),destinationMarket,destinationCountry,destinationCity:text('destinationCity',120),destinationPostalCode:text('destinationPostalCode',20),serviceType:serviceType as QuoteInput['serviceType'],cargoCategory,cargoDescription:text('cargoDescription',600),estimatedWeightKg:number('estimatedWeightKg',.01,100000),packageCount:number('packageCount',1,10000,true),dimensions,customerNotes:text('customerNotes',600),source,consent:true as const};
  if(Object.keys(errors).length)throw new QuoteValidationError(errors);return result;
}
