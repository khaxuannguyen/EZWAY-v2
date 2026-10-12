import { destinationName } from './config.ts';
import type { Lead,LeadEnv } from './repository.ts';
import { readBoundedText } from '../public-security.ts';
export type DeliveryResult = {status:'SENT'|'RETRY'|'FAILED'|'NOT_CONFIGURED';messageId?:string;code?:string};
export function formatLead(lead:Lead){return [
 '🔔 EZWAY — YÊU CẦU TƯ VẤN MỚI',`Mã yêu cầu: ${lead.requestId}`,`Thời gian: ${lead.createdAt}`,'Nguồn: Website EZWAY.VN',
 `Khách hàng: ${lead.customerName}`,`Điện thoại: ${lead.customerPhone}`,`Liên hệ ưu tiên: ${lead.preferredContactMethod==='ZALO'?'Zalo':'Gọi điện'}${lead.preferredContactMethod==='ZALO'&&!lead.zaloSamePhone?' (cần xác nhận số Zalo)':''}`,
 `Tuyến: Việt Nam → ${destinationName(lead.destinationCountry)}`,`Lấy hàng: ${lead.originCity||'Chưa cung cấp'}`,`Dịch vụ: ${lead.serviceType==='ADVICE'?'Cần tư vấn':lead.serviceType}`,
 `Loại hàng: ${lead.cargoCategory}`,`Trọng lượng: ${lead.estimatedWeightKg==null?'Chưa biết':lead.estimatedWeightKg+' kg'}`,`Số kiện: ${lead.packageCount??'Chưa biết'}`,
 `Điểm nhận: ${[lead.destinationCity,lead.destinationPostalCode].filter(Boolean).join(', ')||'Chưa cung cấp'}`,
 `Kích thước: ${lead.dimensions?Object.values(lead.dimensions).join(' × ')+' cm':'Chưa cung cấp'}`,
 `Mô tả: ${lead.cargoDescription.slice(0,300)||'Không có'}`,`Ghi chú: ${lead.customerNotes.slice(0,300)||'Không có'}`,'Trạng thái: CHỜ TƯ VẤN',
 ].join('\n').slice(0,2000);}
export async function sendZalo(env:LeadEnv,chatId:string,lead:Lead,fetcher:typeof fetch=fetch):Promise<DeliveryResult>{
 if(env.ZALO_NOTIFICATIONS_ENABLED!=='true'||!env.ZALO_BOT_TOKEN||!chatId)return {status:'NOT_CONFIGURED'};
 try{const response=await fetcher(`https://bot-api.zaloplatforms.com/bot${env.ZALO_BOT_TOKEN}/sendMessage`,{method:'POST',redirect:'error',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:chatId,text:formatLead(lead)}),signal:AbortSignal.timeout(5000)});
  const data=JSON.parse(await readBoundedText(response,32000)) as {ok?:boolean;result?:{message_id?:string};error_code?:number};
  if(response.ok&&data.ok===true&&typeof data.result?.message_id==='string')return {status:'SENT',messageId:data.result.message_id};
  return {status:response.status===429||response.status>=500||[408,429,500,502,503,504].includes(data.error_code||0)?'RETRY':'FAILED',code:'ZALO_REJECTED'};
 }catch{return {status:'RETRY',code:'ZALO_NETWORK_OR_TIMEOUT'};}
}
export async function sendEmail(env:LeadEnv,lead:Lead,fetcher:typeof fetch=fetch):Promise<DeliveryResult>{
 if(!env.RESEND_API_KEY||!env.LEAD_EMAIL_FROM||!env.LEAD_EMAIL_TO)return {status:'NOT_CONFIGURED'};
 try{const r=await fetcher('https://api.resend.com/emails',{method:'POST',redirect:'error',headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':`lead/${lead.requestId}`},body:JSON.stringify({from:env.LEAD_EMAIL_FROM,to:env.LEAD_EMAIL_TO.split(',').map(s=>s.trim()).filter(Boolean),subject:`EZWAY — ${lead.requestId}`,text:formatLead(lead)}),signal:AbortSignal.timeout(5000)});
  const data=JSON.parse(await readBoundedText(r,32000)) as {id?:string};return r.ok&&data.id?{status:'SENT',messageId:data.id}:{status:r.status===429||r.status>=500?'RETRY':'FAILED',code:'EMAIL_REJECTED'};
 }catch{return {status:'RETRY',code:'EMAIL_NETWORK_OR_TIMEOUT'};}
}
export const retryDelay=(attempt:number)=>Math.min(3600000,60000*2**Math.max(0,attempt-1));
export async function dispatchLeadJobs(env:LeadEnv,fetcher:typeof fetch=fetch,limit=3){
 const db=env.EZWAY_LEADS_DB;if(!db)throw new Error('STORAGE_UNAVAILABLE');const now=Date.now();
 const rows=await db.prepare("SELECT request_id FROM lead_jobs WHERE state IN ('PENDING','RETRY','WAITING_CONFIG','PROCESSING') AND next_attempt_at<=? AND lease_until<=? ORDER BY next_attempt_at LIMIT ?").bind(now,now,limit).all<{request_id:string}>();
 let processed=0;
 for(const row of rows.results){
  const owner=crypto.randomUUID();const claim=await db.prepare("UPDATE lead_jobs SET state='PROCESSING',lease_until=?,lease_owner=? WHERE request_id=? AND lease_until<=? AND next_attempt_at<=? AND state IN ('PENDING','RETRY','WAITING_CONFIG','PROCESSING')").bind(Date.now()+120000,owner,row.request_id,Date.now(),Date.now()).run();if(!claim.meta.changes)continue;
  try{
   const leadRow=await db.prepare('SELECT payload_json FROM quote_requests WHERE request_id=?').bind(row.request_id).first<{payload_json:string}>();if(!leadRow)continue;const lead=JSON.parse(leadRow.payload_json) as Lead;
   const chats=env.ZALO_NOTIFICATIONS_ENABLED==='true'&&env.ZALO_BOT_TOKEN?[...new Set((env.ZALO_BOT_ADMIN_CHAT_IDS||'').split(',').map(s=>s.trim()).filter(s=>/^[\w.:-]{1,160}$/.test(s)))].slice(0,5):[];
   if(!chats.length){
    const previous=await db.prepare("SELECT status FROM lead_deliveries WHERE request_id=? AND channel='EMAIL' AND recipient='fallback'").bind(row.request_id).first<{status:string}>();
    const email=previous?.status==='SENT'?{status:'SENT' as const}:await sendEmail(env,lead,fetcher);
    if(email.status!=='NOT_CONFIGURED')await db.prepare("INSERT INTO lead_deliveries(request_id,channel,recipient,status) VALUES(?,'EMAIL','fallback',?) ON CONFLICT(request_id,channel,recipient) DO UPDATE SET status=excluded.status").bind(row.request_id,email.status).run();
    await db.batch([db.prepare("UPDATE lead_jobs SET state='WAITING_CONFIG',next_attempt_at=?,lease_until=0 WHERE request_id=? AND lease_owner=?").bind(Date.now()+60000,row.request_id,owner),db.prepare("UPDATE quote_requests SET zalo_notification_status='NOT_CONFIGURED',email_notification_status=? WHERE request_id=?").bind(email.status,row.request_id)]);processed++;continue;
   }
   let retry=false,failed=false;
   for(const chat of chats){
    await db.prepare("INSERT OR IGNORE INTO lead_deliveries(request_id,channel,recipient) VALUES(?,'ZALO',?)").bind(row.request_id,chat).run();
    const previous=await db.prepare("SELECT status FROM lead_deliveries WHERE request_id=? AND channel='ZALO' AND recipient=?").bind(row.request_id,chat).first<{status:string}>();if(previous?.status==='SENT')continue;if(previous?.status==='FAILED'){failed=true;continue;}
    const result=await sendZalo(env,chat,lead,fetcher);retry ||= result.status==='RETRY';failed ||= result.status==='FAILED';
    await db.prepare("UPDATE lead_deliveries SET status=?,provider_message_id=?,last_error_code=? WHERE request_id=? AND channel='ZALO' AND recipient=?").bind(result.status,result.messageId||null,result.code||null,row.request_id,chat).run();
   }
   const job=await db.prepare('SELECT attempts FROM lead_jobs WHERE request_id=?').bind(row.request_id).first<{attempts:number}>();const attempts=(job?.attempts||0)+1;
   const emailHistory=await db.prepare("SELECT status FROM lead_deliveries WHERE request_id=? AND channel='EMAIL' AND recipient='fallback'").bind(row.request_id).first<{status:string}>();
   let emailStatus=emailHistory?.status||'NOT_NEEDED';
   if(retry||failed){
    const previous=await db.prepare("SELECT status FROM lead_deliveries WHERE request_id=? AND channel='EMAIL' AND recipient='fallback'").bind(row.request_id).first<{status:string}>();
    const result=previous?.status==='SENT'?{status:'SENT' as const}:await sendEmail(env,lead,fetcher);emailStatus=result.status;
    await db.prepare("INSERT INTO lead_deliveries(request_id,channel,recipient,status,provider_message_id,last_error_code) VALUES(?,'EMAIL','fallback',?,?,?) ON CONFLICT(request_id,channel,recipient) DO UPDATE SET status=excluded.status,provider_message_id=excluded.provider_message_id,last_error_code=excluded.last_error_code").bind(row.request_id,result.status,'messageId' in result?result.messageId||null:null,'code' in result?result.code||null:null).run();
    retry ||= result.status==='RETRY';
   }
   const state=retry&&attempts<5?'RETRY':failed||retry?'FAILED':'DONE';
   await db.batch([db.prepare('UPDATE lead_jobs SET state=?,attempts=?,next_attempt_at=?,lease_until=0 WHERE request_id=? AND lease_owner=?').bind(state,attempts,Date.now()+retryDelay(attempts),row.request_id,owner),db.prepare('UPDATE quote_requests SET zalo_notification_status=?,email_notification_status=? WHERE request_id=?').bind(retry?(attempts<5?'RETRY':'FAILED'):failed?'FAILED':'SENT',emailStatus,row.request_id)]);processed++;
  }catch{await db.prepare("UPDATE lead_jobs SET state=CASE WHEN attempts>=4 THEN 'FAILED' ELSE 'RETRY' END,attempts=attempts+1,next_attempt_at=?,lease_until=0 WHERE request_id=? AND lease_owner=?").bind(Date.now()+60000,row.request_id,owner).run();}
 }
 await db.prepare('DELETE FROM quote_rate_limits WHERE expires_at<?').bind(Date.now()).run();return {processed};
}
