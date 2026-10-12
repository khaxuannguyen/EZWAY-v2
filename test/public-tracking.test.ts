import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {normalizeZatHtml} from '../lib/zat-tracking.ts';
import {normalizeNamDeHtml} from '../lib/nam-de-tracking.ts';
import {normalizeKsnResponse,createMockKsnResponse,type NormalizedTracking} from '../lib/ksn-tracking.ts';
import {toPublicTracking} from '../lib/public-tracking.ts';
import {isVerifiedLastMileUrl} from '../lib/last-mile-carriers.ts';
import {trackingApiHarness,namFixture} from './helpers/tracking-api-harness.ts';
const forbidden=/kango|\bksn\b|\bzat\b|nam[\s_-]*de|global-tracking|zatexpress|trackingUrl|carrierCode|raw_secret/i;
const base:NormalizedTracking={queryCode:'400000000001',latestStatus:'Not delivered; held by KSN',timeline:[{time:'2026-10-12T10:00:00Z',title:'Not delivered; returned from ZAT Express',location:'Kango Post, London'},{time:'2026-10-11T10:00:00Z',title:'Arrived at NamDe'}],orderNumbers:[]};
test('fresh allowlist strips nested upstream fields/URLs/branding while preserving state, time, order and source',()=>{
 const internal={...base,carrierCode:'KSN-123',trackingUrl:'https://kango-post.com/?raw_secret=1',lastMileWebsite:'https://global-tracking.info/',service:'KSN-SEA-USA-BH',raw_secret:'private',orderNumbers:[{hawb:'5001114699',isCurrent:false,trackingUrl:'https://sys.zatexpress.vn/'}]};
 const snapshot=JSON.stringify(internal);const publicData=JSON.parse(JSON.stringify(toPublicTracking(internal,'zat')));
 assert.doesNotMatch(JSON.stringify(publicData),forbidden);assert.equal(JSON.stringify(internal),snapshot);
 assert.match(publicData.latestStatus,/Not delivered; held/);assert.match(publicData.timeline[0].title,/Not delivered; returned/);
 assert.equal(publicData.timeline[0].time,base.timeline[0].time);assert.match(publicData.timeline[0].location,/London/);
 assert.equal(publicData.service,'Vận chuyển đường biển');assert.equal(publicData.orderNumbers[0].hawb,'5001114699');assert.equal(publicData.orderNumbers[0].lookupCode,undefined);
});
for(const code of ['ZVN202622246','ZVN202622248'])test(`existing ${code} remains normalized, with no upstream public links`,()=>{
 const internal=normalizeZatHtml(readFileSync(new URL(`./fixtures/zat-${code}.html`,import.meta.url),'utf8'),code)!;const pub=toPublicTracking(internal,'zat');
 assert.equal(pub.latestStatus,internal.latestStatus);assert.deepEqual(pub.timeline,internal.timeline);assert.equal(pub.orderNumbers.length,internal.orderNumbers.length);
 assert.equal(pub.packageCode,code);assert.doesNotMatch(JSON.stringify(pub),forbidden);assert.ok(pub.orderNumbers.every(o=>!o.lookupCode));
});
test('NamDe full UPS reference gets UPS only; prefix alone and country do not fabricate a carrier',()=>{
 const internal=normalizeNamDeHtml(namFixture,'2000000001','https://global-tracking.info/?order-code=2000000001')!;
 assert.equal(toPublicTracking(internal,'nam-de').lastMileWebsite,'https://www.ups.com/track');
 assert.equal(toPublicTracking({...internal,packageTrackingCode:'1ZINVALID'},'nam-de').lastMileWebsite,undefined);
 assert.equal(toPublicTracking({...internal,lastMileCarrier:undefined},'nam-de').lastMileCarrier,undefined);
});
test('explicit final carriers use configured HTTPS endpoints; no arbitrary upstream href or suffix-host bypass',()=>{
 for(const [carrier,country,url] of [['UPS','US','https://www.ups.com/track'],['DHL Express','US','https://www.dhl.com/'],['DHL eCommerce','US','https://www.dhl.com/'],['DPD','United Kingdom','https://track.dpd.co.uk/search'],['FedEx','US','https://www.fedex.com/vi-vn/tracking.html']]){
  const pub=toPublicTracking({...base,lastMileCarrier:carrier,country,lastMileWebsite:'https://evil.example/',trackingUrl:'javascript:alert(1)'},'ksn');assert.equal(pub.lastMileWebsite,url);assert.ok(isVerifiedLastMileUrl(pub.lastMileCarrier,pub.lastMileWebsite));
 }
 for(const value of ['http://www.ups.com/track','https://www.ups.com.evil.example/track','https://www.ups.com@evil.example/track','https://www.ups.com/track?redirect=https://evil.example','https://www.ups.com:444/track','javascript:alert(1)'])assert.equal(isVerifiedLastMileUrl('UPS',value),false);
 assert.equal(toPublicTracking({...base,lastMileCarrier:'DPD',country:'Canada'},'ksn').lastMileWebsite,undefined);
 assert.equal(toPublicTracking({...base,lastMileCarrier:'Kango',country:'US'},'ksn').lastMileWebsite,undefined);
});
test('related lookup needs supported routing plus evidence, never redirects to upstream',()=>{
 const pub=toPublicTracking({...base,orderNumbers:[{hawb:'400000000002',isCurrent:false,trackingUrl:'https://kango-post.com/tracking?code=400000000002'},{hawb:'400000000003',isCurrent:false,trackingUrl:'https://kango-post.com.evil.example/tracking?code=400000000003'},{hawb:'400000000004',isCurrent:false,trackingUrl:'https://kango-post.com/tracking?code=OTHER'}]},'ksn');
 assert.equal(pub.orderNumbers[0].lookupCode,'400000000002');assert.equal(pub.orderNumbers[1].lookupCode,undefined);assert.equal(pub.orderNumbers[2].lookupCode,undefined);
});
test('KSN existing normalization stays usable behind public boundary',()=>{const raw=createMockKsnResponse('400000000001');const internal=normalizeKsnResponse(raw,'400000000001')!;const pub=toPublicTracking(internal,'ksn');assert.equal(pub.timeline.length,internal.timeline.length);assert.equal(pub.latestStatus,internal.latestStatus);assert.doesNotMatch(JSON.stringify(pub),forbidden);});
test('actual GET route branches retain lookup priority, apply DTO before JSON and keep private cache/rate limits',async()=>{
 for(const [code,first] of [['ZVN202622246','zat'],['ZVN202622248','zat'],['2000000001','global-tracking.info'],['320240648427','kango-post.com']]){
  const {GET,calls}=trackingApiHarness();const r=await GET(new Request(`https://ezway.vn/api/tracking?code=${code}`));assert.equal(r.status,200);assert.equal(calls[0],first);assert.equal(r.headers.get('cache-control'),'private, no-store');assert.doesNotMatch(await r.text(),forbidden);
 }
 const {GET}=trackingApiHarness();assert.equal((await GET(new Request('https://ezway.vn/api/tracking?code=https://evil.example'))).status,400);
 for(let i=0;i<19;i++)await GET(new Request('https://ezway.vn/api/tracking?code=400000000001'));
 assert.equal((await GET(new Request('https://ezway.vn/api/tracking?code=400000000001'))).status,429);
});
