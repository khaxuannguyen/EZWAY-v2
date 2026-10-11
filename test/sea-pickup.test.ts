import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SEA_PICKUP as M, seaPickupPose } from '../app/components/freight-story/sea-pickup-motion.ts';

const near = (a: number, b: number) => assert.ok(Math.abs(a - b) < .001, `${a} != ${b}`);
test('cargo remains on ground until locks engage, then clears ground and rests on chassis', () => {
  for (const p of [0, .10, .12, .18, .24]) near(seaPickupPose(p).containerY + M.containerHeight, M.ground);
  const lifted = seaPickupPose(.48);
  assert.ok(lifted.containerY + M.containerHeight < M.trailerDeck - 50);
  for (const p of [.86, .90, 1]) {
    const s = seaPickupPose(p);
    near(s.containerY + M.containerHeight, M.trailerDeck);
    near(s.containerX, seaPickupPose(.86).containerX);
    assert.equal(s.supported, true);
  }
});
test('locked cargo cannot move independently of spreader; articulated boom endpoint follows mount', () => {
  for (let i = 0; i <= 1000; i++) {
    const s = seaPickupPose(i / 1000), a = s.boomAngle * Math.PI / 180;
    near(s.pivotX - s.boomLength * Math.cos(a) - M.boomTipOffsetY * Math.sin(a), s.wristX);
    near(s.pivotY - s.boomLength * Math.sin(a) + M.boomTipOffsetY * Math.cos(a), s.wristY);
    assert.ok(s.boomLength > 350 && s.boomLength < 690, 'telescoping sections retain overlap');
    if (s.locked) {
      near(s.spreaderX, s.containerX);
      near(s.spreaderY + M.spreaderHeight, s.containerY);
    }
  }
});
test('arbitrary forward/reverse seeks have no accumulated state and release does not lift cargo', () => {
  const reference = [.1, .4, .7, .95].map(seaPickupPose);
  for (const p of [1, .4, 0, .95, .7, .1]) {
    const index = [.1, .4, .7, .95].indexOf(p);
    if (index >= 0) assert.deepEqual(seaPickupPose(p), reference[index]);
  }
  assert.ok(seaPickupPose(1).spreaderY + M.spreaderHeight < seaPickupPose(1).containerY - 100);
  assert.deepEqual(seaPickupPose(NaN), seaPickupPose(0));
});
