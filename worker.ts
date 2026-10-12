import app from 'vinext/server/app-router-entry';
import { dispatchLeadJobs } from './lib/quotes/notifications';
import type { LeadEnv } from './lib/quotes/repository';
const worker = {
 fetch:app.fetch,
 async scheduled(_event:ScheduledController,env:LeadEnv){await dispatchLeadJobs(env);},
};

export default worker;
