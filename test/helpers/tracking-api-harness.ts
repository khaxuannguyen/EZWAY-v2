import ts from 'typescript';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import * as ksn from '../../lib/ksn-tracking.ts';
import * as nam from '../../lib/nam-de-tracking.ts';
import * as security from '../../lib/public-security.ts';
import {normalizeZatHtml} from '../../lib/zat-tracking.ts';
import * as publicTracking from '../../lib/public-tracking.ts';

export const namFixture=`<p>Tracking code: <span>2000000001</span></p><p>REF: <a><span>1Z197K070330563427</span></a></p><p><strong>Service Area:</strong> CHUYÊN TUYẾN MỸ</p><p><strong>Origin Service Area:</strong> VN</p><p><strong>Destination:</strong> California, United States</p><div class="list-history-order"><div class="grid grid-cols-12 md:grid-cols-7"><p class="sub-date font-bold">03 September, 2026</p><p class="sub-date mb-0 text-[15px]">10:24 AM GMT+7</p><p class="text-[15px] font-bold uppercase !mb-[5px]">DELIVERED</p><p class="text-[14px] mb-0">California US</p></div></div>`;
export function trackingApiHarness(){
 const calls:string[]=[];
 const mockFetch:typeof fetch=async(input)=>{
  const url=new URL(String(input));calls.push(url.hostname);
  if(url.hostname==='global-tracking.info')return new Response(namFixture);
  const code=url.searchParams.get('code')??'';
  const raw=ksn.createMockKsnResponse(code) as {data:Record<string,unknown>};
  raw.data.is_mock=true;
  const carrier=code==='400000000011'?'DHL Express':code==='400000000012'?'DPD':code==='400000000013'?'Unknown courier':'UPS';
  raw.data.additional_notes={service:'KSN-SEA-USA-BH',country:carrier==='DPD'?'United Kingdom':'United States',last_mile:carrier,last_mile_website:'https://sys.zatexpress.vn/redirect',total_package:'3'};
  raw.data.shipment_information={route:'VN -> US',order_numbers:[{hawb:code,tracking_code:code,is_current:true,status:'In Transit',tracking_url:`https://kango-post.com/tracking?code=${code}`},{hawb:'400000000002',status:'Arrived at KSN',tracking_url:'https://kango-post.com/tracking?code=400000000002'},{hawb:'400000000003',status:'At ZAT Express',tracking_url:'https://evil.example/'}]};
  return Response.json(raw);
 };
 const modules:Record<string,unknown>={
  '../../../lib/ksn-tracking':ksn,'../../../lib/nam-de-tracking':nam,'../../../lib/public-tracking':publicTracking,
  '../../../lib/public-security':{...security,fetchTrustedPartner:(url:URL,options:RequestInit)=>security.fetchTrustedPartner(url,options,mockFetch)},
  '../../../lib/zat-tracking':{lookupZat:async(code:string)=>{calls.push('zat');const file=code.toUpperCase()==='ZVN202622248'?'ZVN202622248':'ZVN202622246';const normalized=normalizeZatHtml(readFileSync(new URL(`../fixtures/zat-${file}.html`,import.meta.url),'utf8'),code);return normalized?{kind:'found',tracking:normalized}:{kind:'not-found'};}},
 };
 const source=readFileSync(new URL('../../app/api/tracking/route.ts',import.meta.url),'utf8');
 const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const exports: {GET?:(request:Request)=>Promise<Response>}={};
 vm.runInNewContext(compiled,{exports,require:(id:string)=>{if(!(id in modules))throw Error('Unexpected route dependency');return modules[id];},Response,Request,URL,AbortSignal,TextEncoder,process:{env:{NODE_ENV:'production',KSN_TRACKING_API_KEY:'synthetic-test-key'}},console});
 return {GET:exports.GET!,calls};
}
