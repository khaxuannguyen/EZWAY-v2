import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { findZones, normalizePostcode, isManualZone, type ZoneData } from '../lib/au-zones.ts';
const data: ZoneData = JSON.parse(readFileSync(new URL('../public/data/au-zones.json', import.meta.url), 'utf8'));

test('all four source tables are retained independently', () => {
  assert.equal(Object.keys(data.auspost).length, 9091);
  assert.equal(Object.values(data.standard).reduce((sum, rows) => sum + rows.length, 0), 16285);
  assert.equal(Object.keys(data.priority).length, 2611);
  for (const pc of [...Object.keys(data.auspost), ...Object.keys(data.standard), ...Object.keys(data.priority)]) assert.match(pc, /^\d{4}$/);
});
test('leading zero postcodes and invalid input', () => {
  assert.equal(normalizePostcode(' 0800 '), '0800');
  for (const pc of ['', '800', '20000', '2e03', 'abcd', '20 00', '<script>']) assert.equal(normalizePostcode(pc), null);
  const r = findZones(data, '0800')!;
  assert.deepEqual(r.auspost, ['NT','DAR','Darwin','4','4']);
  assert.deepEqual(r.standard[0], ['DARWIN CITY','NT','DRW','3']);
  assert.deepEqual(r.priority, ['DRW','4','1']);
});
test('Priority is looked up by its own postcode instead of the adjacent Standard row', () => {
  const r = findZones(data, '2168')!;
  assert.equal(r.auspost?.[3], '2');
  assert.equal(r.standard[0][0], 'ASHCROFT');
  assert.deepEqual(r.priority, ['SYD','1','1']);
  const p = findZones(data, '2259')!;
  assert.equal(p.standard[0][3], '2');
  assert.equal(p.priority?.[1], '1');
});
test('suburb differences within the same postcode remain available', () => {
  const entry = Object.entries(data.standard).find(([, rows]) => new Set(rows.map(r => r[3])).size > 1);
  assert.ok(entry);
  const r = findZones(data, entry[0])!;
  assert.deepEqual(r.standard, entry[1]);
  assert.ok(new Set(r.standard.map(row => row[3])).size > 1);
});
test('manual checks, missing services, and missing postcode are distinct', () => {
  assert.equal(isManualZone('CHECK'), true);
  assert.equal(isManualZone('Check Case by Case'), true);
  assert.equal(isManualZone('2'), false);
  assert.ok(findZones(data, '6215')!.standard.some(r => r[3] === 'CHECK'));
  const absent = String(Array.from({ length: 10000 }, (_,i) => String(i).padStart(4,'0')).find(pc => !data.auspost[pc] && !data.standard[pc] && !data.priority[pc]));
  assert.equal(findZones(data, absent)?.found, false);
  assert.equal(findZones(data, 'bad'), null);
  assert.equal(findZones(data, '9999')?.auspost?.[3], '1');
  assert.equal(findZones(data, '9999')?.priority, null);
});
