import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { validateQuote,QuoteValidationError } from '../lib/quotes/validation.ts';
import { consumeRate,persistLead,type LeadEnv } from '../lib/quotes/repository.ts';
import { dispatchLeadJobs,formatLead,sendZalo } from '../lib/quotes/notifications.ts';
import { leadQueueHealth } from '../lib/quotes/health.ts';
import { publicLeadBinding } from '../lib/quotes/deployment-config.ts';

const payload={customerName:'QA Test',customerPhone:'0900 000 000',preferredContactMethod:'PHONE',destinationMarket:'US',destinationCountry:'US',serviceType:'ADVICE',cargoCategory:'Quần áo',source:'quote_form',consent:true};
function database(){const sqlite=new DatabaseSync(':memory:');sqlite.exec('PRAGMA foreign_keys=ON');sqlite.exec(readFileSync(new URL('../migrations/leads/0001_public_leads.sql',import.meta.url),'utf8'));sqlite.exec(readFileSync(new URL('../migrations/leads/0002_delivery_attempts.sql',import.meta.url),'utf8'));
 function statement(sql:string,values:unknown[]=[]){return {bind:(...args:unknown[])=>statement(sql,args),first:async()=>sqlite.prepare(sql).get(...values as (string|number|null)[])||null,run:async()=>({meta:{changes:Number(sqlite.prepare(sql).run(...values as (string|number|null)[]).changes)}}),all:async()=>({results:sqlite.prepare(sql).all(...values as (string|number|null)[])})};}
 const db={prepare:statement,batch:async(queries:{run:()=>Promise<unknown>}[])=>{sqlite.exec('BEGIN');try{const results=[];for(const q of queries)results.push(await q.run());sqlite.exec('COMMIT');return results;}catch(e){sqlite.exec('ROLLBACK');throw e;}}} as unknown as D1Database;
 return {db,sqlite};
}
test('server schema rejects EU without member, spoofed consent, honeypot and invalid measurements',()=>{
 for(const patch of [{destinationMarket:'EU',destinationCountry:'EU'},{consent:'true'},{website:'spam'},{estimatedWeightKg:-1},{packageCount:1.5},{dimensions:{length:3}}])assert.throws(()=>validateQuote({...payload,...patch}),QuoteValidationError);
 assert.equal(validateQuote({...payload,destinationMarket:'EU',destinationCountry:'DE'}).destinationCountry,'DE');
 assert.equal(validateQuote({...payload,cargoDescription:'a\nb'}).cargoDescription,'a b');
});
test('lead and outbox survive retries; same idempotency key never creates second lead',async()=>{
 const {db,sqlite}=database(),key=crypto.randomUUID(),input=validateQuote(payload);const id=await persistLead(db,input,key);assert.equal(await persistLead(db,input,key),id);
 assert.equal(sqlite.prepare('SELECT count(*) AS n FROM quote_requests').get()?.n,1);assert.equal(sqlite.prepare('SELECT count(*) AS n FROM lead_jobs').get()?.n,1);
 await assert.rejects(()=>persistLead(db,{...input,customerName:'Changed'},key),/IDEMPOTENCY_CONFLICT/);
 assert.equal(sqlite.prepare('SELECT count(*) AS n FROM quote_requests').get()?.n,1);
});
test('storage failure does not return a request ID',async()=>{const {db,sqlite}=database();sqlite.exec('DROP TABLE lead_jobs');await assert.rejects(()=>persistLead(db,validateQuote(payload),crypto.randomUUID()));assert.equal(sqlite.prepare('SELECT count(*) AS n FROM quote_requests').get()?.n,0);});
test('persistent rate limiter enforces limit without storing IP',async()=>{const {db,sqlite}=database();for(let i=0;i<10;i++)assert.equal(await consumeRate(db,'127.0.0.1','private',1000),true);assert.equal(await consumeRate(db,'127.0.0.1','private',1000),false);assert.ok(!JSON.stringify(sqlite.prepare('SELECT * FROM quote_rate_limits').all()).includes('127.0.0.1'));});
test('missing configuration records status without pretending a notification was sent',async()=>{const {db,sqlite}=database();await persistLead(db,validateQuote(payload),crypto.randomUUID());await dispatchLeadJobs({EZWAY_LEADS_DB:db});assert.equal(sqlite.prepare('SELECT zalo_notification_status FROM quote_requests').get()?.zalo_notification_status,'NOT_CONFIGURED');assert.equal(sqlite.prepare('SELECT state FROM lead_jobs').get()?.state,'WAITING_CONFIG');});
test('explicit transient rejection plus email failure retains lead and retries; confirmed delivery is never resent',async()=>{
 const {db,sqlite}=database();await persistLead(db,validateQuote(payload),crypto.randomUUID());const env:LeadEnv={EZWAY_LEADS_DB:db,ZALO_BOT_TOKEN:'test-only',ZALO_NOTIFICATIONS_ENABLED:'true',ZALO_BOT_ADMIN_CHAT_IDS:'allowed-group',RESEND_API_KEY:'test-only',LEAD_EMAIL_FROM:'qa@example.test',LEAD_EMAIL_TO:'ops@example.test'};
 const broken=(async()=>Response.json({ok:false},{status:503})) as typeof fetch;await dispatchLeadJobs(env,broken);assert.equal(sqlite.prepare('SELECT count(*) AS n FROM quote_requests').get()?.n,1);assert.equal(sqlite.prepare('SELECT state FROM lead_jobs').get()?.state,'RETRY');assert.equal(sqlite.prepare('SELECT email_notification_status FROM quote_requests').get()?.email_notification_status,'RETRY');
 sqlite.exec('UPDATE lead_jobs SET next_attempt_at=0');let calls=0;const good=(async(_url:unknown,options:RequestInit)=>{calls++;assert.equal(options.redirect,'manual');const data=JSON.parse(String(options.body));assert.equal(data.chat_id,'allowed-group');assert.ok(data.text.length<=2000);return Response.json({ok:true,result:{message_id:'confirmed-1'}});}) as typeof fetch;
 await dispatchLeadJobs(env,good);assert.equal(calls,1);assert.equal(sqlite.prepare('SELECT zalo_notification_status FROM quote_requests').get()?.zalo_notification_status,'SENT');
 sqlite.exec("UPDATE lead_jobs SET state='RETRY',next_attempt_at=0");await dispatchLeadJobs(env,good);assert.equal(calls,1);
});
test('provider checks actual confirmation, fixed origin and bounded text',async()=>{const input=validateQuote(payload);const lead={...input,requestId:'EZWQ-QA',createdAt:'2026-10-12',consentRecordedAt:'2026-10-12',status:'NEW' as const};assert.ok(formatLead(lead).length<=2000);const env={ZALO_NOTIFICATIONS_ENABLED:'true',ZALO_BOT_TOKEN:'test-only'};const fake=(async()=>Response.json({ok:false},{status:200})) as typeof fetch;assert.equal((await sendZalo(env,'allowed-group',lead,fake)).status,'FAILED');});
test('Zalo timeout is uncertain, uses email fallback, and is not sent again on retry',async()=>{
 const {db,sqlite}=database();await persistLead(db,validateQuote(payload),crypto.randomUUID());const env:LeadEnv={EZWAY_LEADS_DB:db,ZALO_NOTIFICATIONS_ENABLED:'true',ZALO_BOT_TOKEN:'test',ZALO_BOT_ADMIN_CHAT_IDS:'approved',RESEND_API_KEY:'test',LEAD_EMAIL_FROM:'test@example.test',LEAD_EMAIL_TO:'test@example.test'};let zaloCalls=0;
 const provider=(async(url:string|URL|Request)=>{if(String(url).includes('zaloplatforms')){zaloCalls++;throw new Error('Timed out');}return Response.json({id:'email-confirmed'});}) as typeof fetch;
 await dispatchLeadJobs(env,provider);assert.equal(sqlite.prepare('SELECT state FROM lead_jobs').get()?.state,'NEEDS_REVIEW');assert.equal(sqlite.prepare("SELECT provider_message_id FROM lead_deliveries WHERE channel='EMAIL'").get()?.provider_message_id,'email-confirmed');
 sqlite.exec("UPDATE lead_jobs SET state='RETRY',next_attempt_at=0");await dispatchLeadJobs(env,provider);assert.equal(zaloCalls,1);assert.equal((await leadQueueHealth(db)).needsReview,1);
});
test('email retry has five-attempt bound even when Zalo is unconfigured',async()=>{
 const {db,sqlite}=database();await persistLead(db,validateQuote(payload),crypto.randomUUID());let calls=0;const provider=(async()=>{calls++;throw new Error('timeout');}) as typeof fetch;const env:LeadEnv={EZWAY_LEADS_DB:db,RESEND_API_KEY:'test',LEAD_EMAIL_FROM:'test@example.test',LEAD_EMAIL_TO:'test@example.test'};
 for(let i=0;i<8;i++){sqlite.exec('UPDATE lead_jobs SET next_attempt_at=0');await dispatchLeadJobs(env,provider);}assert.equal(calls,5);assert.equal(sqlite.prepare("SELECT status FROM lead_deliveries WHERE channel='EMAIL'").get()?.status,'FAILED');assert.equal(sqlite.prepare('SELECT count(*) AS n FROM quote_requests').get()?.n,1);
});
test('concurrent drains claim once; a crashed Zalo send is reviewed rather than replayed',async()=>{
 const {db,sqlite}=database();await persistLead(db,validateQuote(payload),crypto.randomUUID());const env:LeadEnv={EZWAY_LEADS_DB:db,ZALO_NOTIFICATIONS_ENABLED:'true',ZALO_BOT_TOKEN:'test',ZALO_BOT_ADMIN_CHAT_IDS:'approved'};let calls=0;const provider=(async()=>{calls++;return Response.json({ok:true,result:{message_id:'confirmed'}});}) as typeof fetch;
 await Promise.all([dispatchLeadJobs(env,provider),dispatchLeadJobs(env,provider)]);assert.equal(calls,1);
 sqlite.exec("UPDATE lead_jobs SET state='PROCESSING',lease_until=0,next_attempt_at=0; UPDATE lead_deliveries SET status='SENDING'");await dispatchLeadJobs(env,provider);assert.equal(calls,1);assert.equal((await leadQueueHealth(db)).needsReview,1);
});
test('remote deployment cannot use local placeholder IDs',()=>{assert.throws(()=>publicLeadBinding('staging'),/real dedicated/);assert.throws(()=>publicLeadBinding('production','00000000-0000-4000-8000-000000000001'),/placeholders/);assert.equal(publicLeadBinding('staging','12345678-1234-4321-9999-123456789abc').database_name,'ezway-public-leads-staging');});
