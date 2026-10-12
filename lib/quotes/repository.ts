import type { QuoteInput } from './validation.ts';
export type Lead = QuoteInput & {requestId:string;createdAt:string;consentRecordedAt:string;status:'NEW'};
export interface LeadEnv {EZWAY_LEADS_DB?:D1Database;ZALO_BOT_TOKEN?:string;ZALO_BOT_ADMIN_CHAT_IDS?:string;ZALO_NOTIFICATIONS_ENABLED?:string;LEAD_JOB_SECRET?:string;QUOTE_RATE_SALT?:string;RESEND_API_KEY?:string;LEAD_EMAIL_FROM?:string;LEAD_EMAIL_TO?:string}
export async function digest(value:string){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))).map(v=>v.toString(16).padStart(2,'0')).join('');}
export function newRequestId(now=new Date()){return `EZWQ-${now.toISOString().slice(0,10).replaceAll('-','')}-${crypto.randomUUID().replaceAll('-','').toUpperCase()}`;}
export async function persistLead(db:D1Database,input:QuoteInput,key:string){
  const hash=await digest(JSON.stringify(input)),createdAt=new Date().toISOString();
  const lead:Lead={...input,requestId:newRequestId(),createdAt,consentRecordedAt:createdAt,status:'NEW'};
  // D1 batch is transactional: a lead and its durable job commit together.
  await db.batch([
    db.prepare('INSERT OR IGNORE INTO quote_requests(request_id,idempotency_key,payload_hash,payload_json,created_at,consent_recorded_at) VALUES(?,?,?,?,?,?)').bind(lead.requestId,key,hash,JSON.stringify(lead),createdAt,createdAt),
    db.prepare('INSERT OR IGNORE INTO lead_jobs(request_id,next_attempt_at) SELECT request_id,? FROM quote_requests WHERE idempotency_key=? AND payload_hash=?').bind(Date.now(),key,hash),
  ]);
  const row=await db.prepare('SELECT request_id,payload_hash FROM quote_requests WHERE idempotency_key=?').bind(key).first<{request_id:string;payload_hash:string}>();
  if(!row)throw new Error('STORAGE_FAILURE');if(row.payload_hash!==hash)throw new Error('IDEMPOTENCY_CONFLICT');return row.request_id;
}
export async function consumeRate(db:D1Database,identity:string,salt:string,now=Date.now()){
  const bucket=await digest(`${salt}:${identity}:${Math.floor(now/3600000)}`);
  const result=await db.prepare('INSERT INTO quote_rate_limits(bucket,count,expires_at) VALUES(?,1,?) ON CONFLICT(bucket) DO UPDATE SET count=count+1 RETURNING count').bind(bucket,now+3600000).first<{count:number}>();
  return Boolean(result&&result.count<=10);
}
