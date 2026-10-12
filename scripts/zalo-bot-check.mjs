// Operator-only CLI. Never logs credential-bearing URLs or message contents.
import fs from 'node:fs/promises';
const vars=await fs.readFile('.dev.vars','utf8').catch(()=> '');
const token=process.env.ZALO_BOT_TOKEN||vars.split(/\r?\n/).find(l=>l.startsWith('ZALO_BOT_TOKEN='))?.slice(15).trim();
if(!token){console.error('ZALO_BOT_TOKEN missing');process.exit(1);}
const method=process.argv[2]==='updates'?'getUpdates':'getMe';
try{
 const response=await fetch(`https://bot-api.zaloplatforms.com/bot${token}/${method}`,{method:'POST',redirect:'error',headers:{'Content-Type':'application/json'},body:JSON.stringify(method==='getUpdates'?{timeout:30}:{}),signal:AbortSignal.timeout(40000)});
 const data=await response.json();
 if(method==='getMe')console.log({ok:data.ok===true,account:data.result?.account_name,canJoinGroups:data.result?.can_join_groups});
 else console.log({ok:data.ok===true,chatId:data.result?.message?.chat?.id,chatType:data.result?.message?.chat?.chat_type,isTestMessage:/EZWAY TEST/i.test(data.result?.message?.text||''),errorCode:data.error_code});
}catch{console.error('Zalo check unavailable; credentials and provider details suppressed');process.exitCode=1;}
