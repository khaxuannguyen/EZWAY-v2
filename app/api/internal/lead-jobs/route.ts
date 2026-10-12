import { env } from 'cloudflare:workers';
import { dispatchLeadJobs,probeZalo } from '../../../../lib/quotes/notifications';
import type { LeadEnv } from '../../../../lib/quotes/repository';
import { leadQueueHealth } from '../../../../lib/quotes/health';
export async function GET(request:Request){const config=env as LeadEnv;const headers={'Cache-Control':'no-store','X-Robots-Tag':'noindex'};
 if(!config.LEAD_JOB_SECRET||request.headers.get('authorization')!==`Bearer ${config.LEAD_JOB_SECRET}`)return Response.json({error:'Unauthorized'},{status:401,headers});
 if(new URL(request.url).searchParams.get('probe')==='zalo')return Response.json(await probeZalo(config),{headers});
 if(!config.EZWAY_LEADS_DB)return Response.json({error:'Storage unavailable'},{status:503,headers});
 return Response.json(await leadQueueHealth(config.EZWAY_LEADS_DB),{headers});
}
export async function POST(request:Request){const config=env as LeadEnv;const headers={'Cache-Control':'no-store','X-Robots-Tag':'noindex'};
 if(!config.LEAD_JOB_SECRET||request.headers.get('authorization')!==`Bearer ${config.LEAD_JOB_SECRET}`)return Response.json({error:'Unauthorized'},{status:401,headers});
 try{return Response.json(await dispatchLeadJobs(config),{headers});}catch{return Response.json({error:'Job processing unavailable'},{status:503,headers});}
}
