import type { NormalizedTracking } from './ksn-tracking';
import { validTrackingCode } from './public-security.ts';
import { verifiedCarrier,lastMileUrl,type LastMileCarrier } from './last-mile-carriers.ts';

export type TrackingProvider = 'ksn'|'zat'|'nam-de';
export type PublicRelatedOrder = {hawb?:string;trackingCode?:string;status?:string;statusClass?:string;isCurrent:boolean;lookupCode?:string};
export type PublicTracking = {
  isMock?:boolean;queryCode:string;packageCode?:string;packageTrackingCode?:string;country?:string;route?:string;
  latestStatus:string;statusClass?:string;service?:string;totalPackages?:string;estimatedDelivery?:string;
  lastMileCarrier?:LastMileCarrier;lastMileWebsite?:string;lastMileTrackingCode?:string;
  timeline:{time:string;title:string;location?:string}[];orderNumbers:PublicRelatedOrder[];
};
const brands=/\b(?:KSN|Kango(?:[\s_-]*Post)?|ZAT(?:[\s_-]*Express)?|Nam[\s_-]*De)\b/gi;
const domains=/(?:[\w-]+\.)*(?:kango-post\.com|zatexpress\.vn|global-tracking\.info)(?:[^\s,;<>]*)/gi;
function hasBrand(value:string){brands.lastIndex=0;domains.lastIndex=0;return brands.test(value)||domains.test(value);}
export function publicTrackingText(value?:string):string|undefined {
  if(!value)return undefined;
  let text=value;
  for(let i=0;i<2;i++){try{const decoded=decodeURIComponent(text);if(decoded===text)break;text=decoded;}catch{break;}}
  text=text.replace(/[\u200B-\u200D\uFEFF]/g,'').replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi,' ').replace(/<[^>]*>/g,' ')
    .replace(/(?:https?:\/\/|www\.)[^\s<>]+/gi,' ').replace(domains,' ').replace(brands,'trung tâm khai thác').replace(/\s+/g,' ').trim();
  return text||undefined;
}
function code(value?:string){return value&&validTrackingCode(value)&&!hasBrand(value)?value:undefined;}
function statusClass(value?:string){return value&&/^(delivered|inspection|customs_processing|in_transit|out_for_delivery|exception|returned|failed|pending|processing|created)$/i.test(value)?value:undefined;}
function service(value?:string){
  if(!value)return undefined;
  const sea=/(?:^|[\s_-])(SEA|OCEAN)(?:$|[\s_-])/i.test(value),air=/(?:^|[\s_-])(AIR|AIRFREIGHT)(?:$|[\s_-])/i.test(value);
  if(sea&&!air)return 'Vận chuyển đường biển';if(air&&!sea)return 'Vận chuyển hàng không';
  return hasBrand(value)?undefined:publicTrackingText(value);
}
function relatedLookup(order:NormalizedTracking['orderNumbers'][number],provider:TrackingProvider,queryCode:string){
  if(order.isCurrent&&[order.hawb,order.trackingCode].some(c=>c?.toLowerCase()===queryCode.toLowerCase()))return queryCode;
  if(provider==='zat')return [order.hawb,order.trackingCode].find(c=>c&&code(c)&&/^ZVN\d+$/i.test(c));
  // A valid-looking identifier alone does not prove independent lookup support.
  try{
    const url=new URL(order.trackingUrl??'');if(url.protocol!=='https:'||url.username||url.password||url.port)return;
    const candidate=provider==='ksn'&&['kango-post.com','www.kango-post.com'].includes(url.hostname)&&/^\/(?:tracking|track|api\/get-tracking)\/?$/.test(url.pathname)
      ?url.searchParams.get('code'):provider==='nam-de'&&url.hostname==='global-tracking.info'?url.searchParams.get('order-code'):undefined;
    if(candidate&&code(candidate)&&[order.hawb,order.trackingCode].includes(candidate)&& (provider!=='nam-de'||/^\d{10}$/.test(candidate)))return candidate;
  }catch{/* no verified independent lookup */}
}
/** Server boundary: construct a fresh allowlisted DTO. Internal data is never mutated. */
export function toPublicTracking(data:NormalizedTracking,provider:TrackingProvider):PublicTracking {
  let carrier=verifiedCarrier(data.lastMileCarrier);
  // This parser inferred UPS from a prefix. Require the complete known 1Z form.
  if(provider==='nam-de'&&carrier==='UPS'&&!/^1Z[A-Z\d]{16}$/i.test(data.packageTrackingCode??''))carrier=undefined;
  const country=publicTrackingText(data.country);
  return {
    ...(data.isMock?{isMock:true}:{}),queryCode:data.queryCode,
    packageCode:data.packageCode===data.queryCode?data.queryCode:code(data.packageCode),packageTrackingCode:code(data.packageTrackingCode),
    country,route:publicTrackingText(data.route),latestStatus:publicTrackingText(data.latestStatus)??'Đang cập nhật',
    statusClass:statusClass(data.statusClass),service:service(data.service),totalPackages:/^\d+$/.test(data.totalPackages??'')?data.totalPackages:undefined,
    estimatedDelivery:publicTrackingText(data.estimatedDelivery),
    lastMileCarrier:carrier,lastMileWebsite:carrier?lastMileUrl(carrier,country):undefined,lastMileTrackingCode:carrier&&data.packageTrackingCode!==data.queryCode&&data.packageTrackingCode!==data.packageCode?code(data.packageTrackingCode):undefined,
    timeline:data.timeline.map(event=>({time:publicTrackingText(event.time)??'',title:publicTrackingText(event.title)??'Cập nhật hành trình',location:publicTrackingText(event.location)})),
    orderNumbers:data.orderNumbers.map(order=>({hawb:code(order.hawb),trackingCode:code(order.trackingCode),status:publicTrackingText(order.status),statusClass:statusClass(order.statusClass),isCurrent:order.isCurrent,lookupCode:relatedLookup(order,provider,data.queryCode)})),
  };
}
