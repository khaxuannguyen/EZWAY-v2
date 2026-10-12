import { env } from 'cloudflare:workers';
import { QuoteValidationError,validateQuote } from '../../../../lib/quotes/validation';
import { consumeRate,persistLead,type LeadEnv } from '../../../../lib/quotes/repository';
import { dispatchLeadJobs } from '../../../../lib/quotes/notifications';
import { readBoundedText,securityHeaders,trackingClientKey } from '../../../../lib/public-security';
const reply=(body:unknown,status=200)=>Response.json(body,{status,headers:{...securityHeaders,'Cache-Control':'private, no-store','X-Robots-Tag':'noindex, nofollow'}});
export async function POST(request:Request){
 if(request.headers.get('origin')!==new URL(request.url).origin||request.headers.get('sec-fetch-site')==='cross-site')return reply({error:'Yêu cầu không hợp lệ.'},403);
 if(!request.headers.get('content-type')?.startsWith('application/json'))return reply({error:'Định dạng chưa hợp lệ.'},415);
 const key=request.headers.get('idempotency-key')||'';if(!/^[a-f\d-]{36}$/i.test(key))return reply({error:'Vui lòng tải lại biểu mẫu.'},400);
 const config=env as LeadEnv;if(!config.EZWAY_LEADS_DB||!config.QUOTE_RATE_SALT)return reply({error:'Chưa thể lưu yêu cầu. Vui lòng thử lại hoặc gọi EZWAY.'},503);
 let input;try{const raw=await readBoundedText(new Response(request.body),12000);input=validateQuote(JSON.parse(raw));}catch(e){return e instanceof QuoteValidationError?reply({error:'Vui lòng kiểm tra các trường được đánh dấu.',fields:e.fields},422):reply({error:'Dữ liệu không hợp lệ hoặc vượt giới hạn.'},400);}
 try{
  if(!await consumeRate(config.EZWAY_LEADS_DB,trackingClientKey(request),config.QUOTE_RATE_SALT))return reply({error:'Bạn đã gửi nhiều yêu cầu. Vui lòng thử lại sau hoặc gọi EZWAY.'},429);
  const requestId=await persistLead(config.EZWAY_LEADS_DB,input,key);
  // Awaited, bounded processing. Durable outbox survives provider failures/restarts.
  try{await dispatchLeadJobs(config,fetch,1);}catch{/* lead already committed; no provider details in customer response */}
  return reply({requestId,accepted:true},201);
 }catch(e){return e instanceof Error&&e.message==='IDEMPOTENCY_CONFLICT'?reply({error:'Yêu cầu đã thay đổi. Vui lòng bắt đầu một yêu cầu mới.'},409):reply({error:'Chưa thể lưu yêu cầu. Nội dung của bạn vẫn được giữ, vui lòng thử lại.'},503);}
}
