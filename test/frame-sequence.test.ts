import test from 'node:test';
import assert from 'node:assert/strict';
import { FrameCache, frameAtProgress, frameAtStoryProgress, nearbyFrames, frameUrl } from '../app/components/freight-story/frame-sequence.ts';

test('scroll seeks clamp safely and reverse to the exact same numbered frame', () => {
  assert.equal(frameAtProgress(-2, 192), 0);
  assert.equal(frameAtProgress(2, 192), 191);
  assert.equal(frameAtProgress(NaN, 192), 0);
  assert.equal(frameAtProgress(.5, 192), 96);
  const frame = frameAtProgress(.4, 192);
  frameAtProgress(1, 192); frameAtProgress(0, 192);
  assert.equal(frameAtProgress(.4, 192), frame);
  assert.equal(frameUrl({ template: '/frames/{frame}.webp', width: 1600, height: 900 }, frame), '/frames/0076.webp');
  assert.deepEqual(nearbyFrames(0, 192, -1), [0, 1, 2]);
  assert.ok(nearbyFrames(191, 192, 1).every(index => index <= 191));
  const sequence = { count: 192, approved: true, desktop: { template: '', width: 1600, height: 900 }, mobile: { template: '', width: 960, height: 540 }, phaseRanges: [[0,23],[24,63],[64,103],[104,119],[120,167],[168,191]] as const };
  assert.equal(frameAtStoryProgress(1 / 6, sequence), 24);
  assert.equal(frameAtStoryProgress(4 / 6, sequence), 120);
  assert.equal(frameAtStoryProgress(1, sequence), 191);
});

test('cache limits concurrency, replaces a stale queue and closes evicted bitmaps', async () => {
  const requested: number[] = [], closed: number[] = [], ready: number[] = [];
  const pending = new Map<number, (value: { close: () => void }) => void>();
  const cache = new FrameCache((index: number) => new Promise<{ close: () => void }>(resolve => { requested.push(index); pending.set(index, resolve); }), index => ready.push(index), 2);
  const resolve = async (index: number) => { pending.get(index)!({ close: () => closed.push(index) }); await new Promise(done => setImmediate(done)); };
  cache.request([0, 1, 2, 3, 4]);
  assert.deepEqual(requested, [0, 1]);
  cache.request([100, 101, 102]);
  await resolve(0);
  assert.deepEqual(requested, [0, 1, 100]);
  await resolve(1); await resolve(100);
  assert.equal(cache.get(0), undefined);
  assert.ok(closed.includes(0));
  assert.ok(ready.includes(100));
  cache.dispose();
  await resolve(101); await resolve(102);
  assert.ok(closed.includes(101) && closed.includes(102), 'late decoded images must close after disposal');
  assert.ok(!requested.includes(2), 'stale queued frames never load');
});

test('missing frames are not retried endlessly; unmount aborts outstanding requests', async () => {
  let failedCalls = 0, signal: AbortSignal | undefined;
  const cache = new FrameCache(async (index, requestSignal) => {
    if (index === 0) { failedCalls++; throw new Error('404'); }
    signal = requestSignal;
    return new Promise<{ close: () => void }>(() => {});
  }, () => {});
  cache.request([0]); await new Promise(done => setImmediate(done));
  cache.request([0, 1]); await new Promise(done => setImmediate(done));
  assert.equal(failedCalls, 1);
  cache.dispose(); assert.equal(signal?.aborted, true);
});
