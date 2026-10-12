import { env } from 'cloudflare:workers';
import { dispatchLeadJobs } from '../../../../lib/quotes/notifications';
import type { LeadEnv } from '../../../../lib/quotes/repository';
export async function POST(request:Request){const config=env as LeadEnv;const headers={'Cache-Control':'no-store','X-Robots-Tag':'noindex'};
 if(!config.LEAD_JOB_SECRET||request.headers.get('authorization')!==`Bearer ${config.LEAD_JOB_SECRET}`)return Response.json({error:'Unauthorized'},{status:401,headers});
 try{return Response.json(await dispatchLeadJobs(config),{headers});}catch{return Response.json({error:'Job processing unavailable'},{status:503,headers});}
}
