// Operator-only CLI. Never logs credential-bearing URLs or message contents.
import fs from 'node:fs/promises';
const vars=await fs.readFile('.dev.vars','utf8').catch(()=> '');
const token=process.env.ZALO_BOT_TOKEN||vars.split(/\r?\n/).find(l=>l.startsWith('ZALO_BOT_TOKEN='))?.slice(15).trim();
if(!token){console.error('ZALO_BOT_TOKEN missing');process.exit(1);}
const method=process.argv[2]==='updates'?'getUpdates':process.argv[2]==='webhook'?'getWebhookInfo':'getMe';
const started=Date.now();
try{
 const response=await fetch(`https://bot-api.zaloplatforms.com/bot${token}/${method}`,{method:'POST',redirect:'error',headers:{'Content-Type':'application/json'},body:JSON.stringify(method==='getUpdates'?{timeout:30}:{}),signal:AbortSignal.timeout(40000)});
 const data=await response.json();
 const metadata={httpStatus:response.status,elapsedMs:Date.now()-started,ok:data.ok===true,errorCode:data.error_code};
 if(method==='getMe')console.log({...metadata,account:data.result?.account_name,accountType:data.result?.account_type,canJoinGroups:data.result?.can_join_groups});
 else if(method==='getWebhookInfo')console.log({...metadata,webhookConfigured:data.ok===true?Boolean(data.result?.url):null});
 else console.log({...metadata,chatId:data.result?.message?.chat?.id,chatType:data.result?.message?.chat?.chat_type,isTestMessage:/EZWAY TEST/i.test(data.result?.message?.text||'')});
}catch{console.error('Zalo check unavailable; credentials and provider details suppressed');process.exitCode=1;}
