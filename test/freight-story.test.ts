import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import type { gsap as Gsap } from 'gsap';
import { buildFreightTimeline } from '../app/components/freight-story/story-timelines.ts';

const gsap: typeof Gsap = createRequire(import.meta.url)('gsap').gsap;
type Target = { x: number; y: number; rotation: number; scale: number; scaleX: number; scaleY: number; opacity: number; transformOrigin: string };
function scene(mode: 'sea' | 'air') {
  const parts = new Map<string, Target>();
  const root = { querySelector(selector: string) {
    const name = selector.match(/"([^"]+)"/)![1];
    if (!parts.has(name)) parts.set(name, { x: 0, y: 0, rotation: 0, scale: 1, scaleX: 1, scaleY: 1, opacity: 1, transformOrigin: '' });
    return parts.get(name);
  } } as unknown as HTMLElement;
  const tl = buildFreightTimeline(gsap, gsap.timeline({ paused: true }), root, mode);
  return { tl, part: (name: string) => parts.get(name)! };
}

test('SEA container stays on the truck during transfer and is lifted before vessel handoff', () => {
  const { tl, part } = scene('sea');
  try {
    tl.seek(3.2);
    const relativeX = part('cargo').x - part('truck').x;
    const deckY = part('cargo').y;
    tl.seek(3.85);
    assert.equal(part('cargo').x - part('truck').x, relativeX);
    assert.equal(part('cargo').y, deckY);
    tl.seek(4.44);
    assert.ok(part('cargo').y < deckY - 80, 'lift clear of chassis before moving to vessel');
    tl.seek(4.95);
    assert.ok(part('cargo').x > part('truck').x + relativeX, 'cargo moved beyond truck onto vessel');
    assert.equal(part('cargo').y, -68);
  } finally { tl.kill(); }
});

test('AIR closes the cargo door before accelerating and retracts equipment during takeoff', () => {
  const { tl, part } = scene('air');
  try {
    tl.seek(3);
    assert.equal(part('pallet').opacity, 0);
    assert.equal(part('closed-door').opacity, 1);
    tl.seek(4);
    assert.equal(part('loader').opacity, 0);
    tl.seek(5.2);
    assert.ok(part('aircraft').y < 0);
    assert.ok(part('aircraft').rotation < 0);
    assert.equal(part('landing-gear').scaleY, 0);
  } finally { tl.kill(); }
});

test('both six-phase timelines reverse deterministically without stale cargo or vehicle state', () => {
  for (const mode of ['sea', 'air'] as const) {
    const { tl, part } = scene(mode);
    try {
      assert.equal(tl.duration(), 6);
      assert.equal(Object.keys(tl.labels).length, 6);
      tl.seek(2.4);
      const names = mode === 'sea' ? ['cargo', 'truck', 'hoist', 'cable'] : ['pallet', 'loader', 'aircraft', 'cargo-door'];
      const pose = (target: Target) => ({ x: target.x, y: target.y, rotation: target.rotation, scale: target.scale, scaleX: target.scaleX, scaleY: target.scaleY, opacity: target.opacity });
      const state = names.map(name => pose(part(name)));
      tl.seek(6).seek(0).seek(2.4);
      names.forEach((name, index) => assert.deepEqual(pose(part(name)), state[index]));
    } finally { tl.kill(); }
  }
});
