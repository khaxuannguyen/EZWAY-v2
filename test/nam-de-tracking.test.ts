import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeNamDeHtml } from '../lib/nam-de-tracking.ts';

const resultPage = `
  <p>Tracking code: <span class="inline-block font-bold">2008261944</span></p>
  <p>REF: <a><span class="inline-block font-bold">1Z197K070330563427</span></a></p>
  <p><strong>Service Area:</strong> CHUYÊN TUYẾN MỸ</p>
  <p><strong>Origin Service Area:</strong> , VN</p>
  <p><strong>Destination:</strong> California, United States </p>
  <div class="list-history-order my-scrollbar1 max-h-[500px]">
    <div class="grid grid-cols-12 md:grid-cols-7">
      <p class="sub-date text-[14px] !mb-[5px] capitalize">Thursday</p>
      <p class="sub-date mb-0 text-[14px] font-bold">03 September, 2026</p>
      <p class="sub-date mb-0 text-[15px]">10:24 AM GMT+7</p>
      <p class="text-[15px] font-bold uppercase !mb-[5px]">DELIVERED</p>
      <p class="text-[14px] mb-0">WINNETKA CA US</p>
    </div>
    <div class="grid grid-cols-12 md:grid-cols-7">
      <p class="sub-date mb-0 text-[15px]">09:40 AM GMT+7</p>
      <p class="text-[15px] font-bold uppercase !mb-[5px]">Out For Delivery Today</p>
      <p class="text-[14px] mb-0">Van Nuys CA US</p>
    </div>
  </div>`;

test('normalizes Nam De shipment and carries the date across same-day events', () => {
  const tracking = normalizeNamDeHtml(
    resultPage,
    '2008261944',
    'https://global-tracking.info/?order-code=2008261944',
  );

  assert.ok(tracking);
  assert.equal(tracking.packageCode, '2008261944');
  assert.equal(tracking.packageTrackingCode, '1Z197K070330563427');
  assert.equal(tracking.route, 'Việt Nam → California, United States');
  assert.equal(tracking.country, 'United States');
  assert.equal(tracking.lastMileCarrier, 'UPS');
  assert.equal(tracking.latestStatus, 'DELIVERED');
  assert.equal(tracking.timeline.length, 2);
  assert.equal(tracking.timeline[0].time, '2026-09-03T10:24:00+07:00');
  assert.equal(tracking.timeline[1].time, '2026-09-03T09:40:00+07:00');
});

test('keeps a shipment useful when last-mile reference and location are missing', () => {
  const html = resultPage
    .replace(/<p>REF:[\s\S]*?<\/p>/, '')
    .replace('<p class="text-[14px] mb-0">WINNETKA CA US</p>', '<p class="text-[14px] mb-0"></p>');
  const tracking = normalizeNamDeHtml(html, '2307263071', 'https://global-tracking.info/?order-code=2307263071');

  assert.ok(tracking);
  assert.equal(tracking.packageTrackingCode, undefined);
  assert.equal(tracking.timeline[0].location, undefined);
});

test('returns null for the partner not-found page', () => {
  assert.equal(
    normalizeNamDeHtml(
      '<div class="message alert alert-danger">Không tìm thấy đơn hàng</div>',
      '0000000000',
      'https://global-tracking.info/?order-code=0000000000',
    ),
    null,
  );
});
