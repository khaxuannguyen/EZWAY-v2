import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { lookupZat, normalizeZatHtml } from '../lib/zat-tracking.ts';

const sample = (code: string) => readFileSync(new URL(`./fixtures/zat-${code}.html`, import.meta.url), 'utf8');

for (const [code, count, firstPackage] of [
  ['ZVN202622246', '7', '5001114699'],
  ['ZVN202622248', '3', '5001114743'],
]) {
  test(`normalizes actual ZAT shipment ${code}`, () => {
    const result = normalizeZatHtml(sample(code), code.toLowerCase());
    assert.ok(result);
    assert.equal(result.packageCode, code);
    assert.equal(result.route, 'VIET NAM → Canada');
    assert.equal(result.country, 'Canada');
    assert.equal(result.service, 'SEA - CA');
    assert.equal(result.totalPackages, count);
    assert.equal(result.orderNumbers.length, Number(count));
    assert.equal(result.orderNumbers[0].hawb, firstPackage);
    assert.equal(result.orderNumbers[0].trackingUrl, `https://sys.zatexpress.vn/view/tracking/index.php?b=${firstPackage}`);
    assert.equal(result.latestStatus, 'Origin customs processing');
    assert.equal(result.timeline.length, 4);
    assert.equal(result.timeline[0].time, code === 'ZVN202622246' ? '2026-10-06 10:17:58' : '2026-10-06 10:15:58');
    assert.equal(result.timeline[0].location, 'HO CHI MINH, VN');
    assert.equal(result.timeline[1].title, 'Transit');
    assert.equal(result.timeline[3].title, 'Label Created');
    assert.equal(result.trackingUrl, `https://sys.zatexpress.vn/view/tracking/index1.php?b=${code}`);
    assert.equal(result.lastMileCarrier, undefined);
  });
}

test('rejects missing shipments, login pages, mismatched codes and an echoed heading', () => {
  for (const html of ['Lỗi không tìm thấy mã vận đơn', '<form>Đăng nhập</form>', '<h1>Tracking ID: ZVN1</h1>']) {
    assert.equal(normalizeZatHtml(html, 'ZVN1'), null);
  }
  assert.equal(normalizeZatHtml(sample('ZVN202622246'), 'ZVN202622248'), null);
});

test('sorts timestamps while preserving source order when times are equal', () => {
  const html = sample('ZVN202622246').replace('2026-10-02 22:40:48', '2026-10-10 12:00:00');
  const result = normalizeZatHtml(html, 'ZVN202622246');
  assert.equal(result?.timeline[0].title, 'Label Created');
  assert.equal(result?.timeline[1].title, 'Origin customs processing');
});

test('supports real shipment details with no timeline without inventing an event', () => {
  const html = sample('ZVN202622246').replace(/vertical-timeline-element-content/g, 'removed-content');
  const result = normalizeZatHtml(html, 'ZVN202622246');
  assert.ok(result);
  assert.deepEqual(result.timeline, []);
  assert.equal(result.latestStatus, 'Đang cập nhật');
});

test('ZAT lookup distinguishes missing shipments from upstream failure and bounds body size', async (t) => {
  let calls = 0;
  t.mock.method(globalThis, 'fetch', async (input: URL | RequestInfo) => {
    calls++;
    const code = new URL(String(input)).searchParams.get('b');
    if (code === 'ZVN101') return new Response(sample('ZVN202622246').replaceAll('ZVN202622246', 'ZVN101'));
    if (code === 'ZVN102') return new Response('Lỗi không tìm thấy mã vận đơn');
    if (code === 'ZVN103') return new Response('<form>Đăng nhập</form>');
    if (code === 'ZVN104') return new Response('Unavailable', { status: 503 });
    if (code === 'ZVN105') throw new Error('timeout');
    return new Response('x'.repeat(300_001));
  });
  const found = await lookupZat('zvn101');
  assert.equal(found.kind, 'found');
  const callsBeforeCache = calls;
  assert.deepEqual(await lookupZat('ZVN101'), found);
  assert.equal(calls, callsBeforeCache);
  assert.equal((await lookupZat('ZVN102')).kind, 'not-found');
  for (const code of ['ZVN103', 'ZVN104', 'ZVN105', 'ZVN106']) {
    assert.equal((await lookupZat(code)).kind, 'unavailable');
  }
  const callsBeforeInvalid = calls;
  assert.equal((await lookupZat('https://example.com')).kind, 'not-found');
  assert.equal(calls, callsBeforeInvalid);
});
