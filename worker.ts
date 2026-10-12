import app from 'vinext/server/app-router-entry';
import { dispatchLeadJobs } from './lib/quotes/notifications';
import type { LeadEnv } from './lib/quotes/repository';
import { leadQueueHealth } from './lib/quotes/health';
const worker = {
 fetch:app.fetch,
 async scheduled(_event:ScheduledController,env:LeadEnv){await dispatchLeadJobs(env);if(env.EZWAY_LEADS_DB){const health=await leadQueueHealth(env.EZWAY_LEADS_DB);if(health.requiresAttention)console.warn('EZWAY_LEAD_QUEUE_ATTENTION',JSON.stringify(health));}},
};

export default worker;
