export const securityHeaders:Record<string,string>={
  'X-Content-Type-Options':'nosniff',
  'X-Frame-Options':'DENY',
  'Referrer-Policy':'strict-origin-when-cross-origin',
  'Permissions-Policy':'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  // Monitor first. Tighten script-src after reviewing real production violations.
  'Content-Security-Policy-Report-Only':"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; connect-src 'self'; frame-src 'none'; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'",
};
export function isProtectedPath(path:string){
  let decoded:string;try{decoded=decodeURIComponent(path);}catch{return true;}
  return /(?:^|\/)\.(?:git|svn|hg|env)(?:[./]|$)/i.test(decoded)||/(?:^|\/)(?:node_modules|\.openai|\.wrangler|work|outputs)(?:\/|$)/i.test(decoded)||/\.(?:map|sql|sqlite|bak|log|pem|key|zip|tar|tgz|bundle)$/i.test(decoded)||/(?:^|\/)(?:package(?:-lock)?\.json|wrangler\.(?:toml|jsonc?)|vite\.config\.[cm]?[jt]s|tsconfig\.json)$/i.test(decoded);
}
/** Bounded isolate-local guard. An edge WAF/native rate binding is required across instances. */
export function createRateLimiter(maxRequests=20,windowMs=60_000,capacity=2000){
  const buckets=new Map<string,{count:number;resetAt:number}>();
  return {consume(key:string,now=Date.now()){
    for(const [id,bucket] of buckets){if(bucket.resetAt<=now)buckets.delete(id);}
    const current=buckets.get(key);
    if(!current){if(buckets.size>=capacity)return {allowed:false,retryAfter:60};buckets.set(key,{count:1,resetAt:now+windowMs});return {allowed:true,retryAfter:0};}
    if(current.count>=maxRequests)return {allowed:false,retryAfter:Math.max(1,Math.ceil((current.resetAt-now)/1000))};
    current.count++;return {allowed:true,retryAfter:0};
  },get size(){return buckets.size;}};
}
export function trackingClientKey(request:Request){
  // CF overwrites this on its ingress. Other hosting must strip it and provide a trusted identity.
  const ip=request.headers.get('cf-connecting-ip')?.trim();
  return ip&&ip.length<=64&&/^[a-f\d:.]+$/i.test(ip)?ip:'anonymous';
}
export function validTrackingCode(code:string){return /^[A-Za-z\d][A-Za-z\d_-]{0,119}$/.test(code);}
/** Keep partner credentials on the fixed HTTPS origin, even if the upstream redirects. */
export async function fetchTrustedPartner(url:URL,options:RequestInit,fetcher:typeof fetch=fetch){
  const origin=url.origin;let current=url;
  if(url.protocol!=='https:')throw new Error('UPSTREAM_PROTOCOL');
  for(let attempt=0;attempt<3;attempt++){
    const response=await fetcher(current,{...options,redirect:'manual'});
    if(response.status<300||response.status>=400)return response;
    const location=response.headers.get('location');if(!location)return response;
    const next=new URL(location,current);if(next.origin!==origin)throw new Error('UPSTREAM_REDIRECT');
    await response.body?.cancel();current=next;
  }
  throw new Error('UPSTREAM_REDIRECT_LIMIT');
}
export async function readBoundedText(response:Response,maxBytes=300_000){
  if(Number(response.headers.get('content-length'))>maxBytes)throw new Error('UPSTREAM_SIZE');
  if(!response.body)return '';
  const reader=response.body.getReader(),decoder=new TextDecoder();let size=0,text='';
  try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>maxBytes){await reader.cancel();throw new Error('UPSTREAM_SIZE');}text+=decoder.decode(value,{stream:true});}return text+decoder.decode();}finally{reader.releaseLock();}
}
