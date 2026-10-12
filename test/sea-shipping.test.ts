import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SEA_PICKUP as M, seaPickupPose } from '../app/components/freight-story/sea-pickup-motion.ts';
import { SEA_PORT as P, seaShippingPose } from '../app/components/freight-story/sea-shipping-motion.ts';
const near = (a: number,b: number) => assert.ok(Math.abs(a-b)<.001, `${a} != ${b}`);

test('shipping preserves the previously verified pickup and transports cargo rigidly with truck',()=>{
  for(let i=0;i<=500;i++){
    const p=i/1000,s=seaShippingPose(p),old=seaPickupPose(p/.5);
    near(s.containerX,old.containerX);near(s.containerY,old.containerY);
  }
  for(const p of [.50,.55,.60,.63,.66]){
    const s=seaShippingPose(p);near(s.containerX-s.truckX,406);near(s.containerY+M.containerHeight,M.trailerDeck);
  }
  assert.ok(seaShippingPose(.63).truckX<seaShippingPose(.50).truckX);
});
test('crane attaches before lifting, clears vessel bridge, lowers to deck then releases',()=>{
  for(let i=665;i<=860;i++){
    const s=seaShippingPose(i/1000);
    near(s.hookX,s.containerX);near(s.hookY+M.spreaderHeight,s.containerY);
    assert.equal(s.craneLocked,true);assert.ok(s.cableBottom>s.cableTop);
  }
  assert.ok(seaShippingPose(.76).containerY+M.containerHeight<P.vesselY-50,'cargo clears bridge silhouette during traverse');
  near(seaShippingPose(.86).containerY+M.containerHeight,P.deckY);
  assert.ok(seaShippingPose(.90).hookY+M.spreaderHeight<seaShippingPose(.90).containerY-200);
});
test('vessel and loaded container depart together; arbitrary reverse seeks are deterministic',()=>{
  for(const p of [.86,.9,.95,1]){
    const s=seaShippingPose(p);near(s.containerX-s.vesselX,P.cargoDeckX-P.vesselX);near(s.containerY+M.containerHeight,P.deckY);
  }
  assert.ok(seaShippingPose(1).vesselX>seaShippingPose(.9).vesselX+800);
  const held=seaShippingPose(.76);for(const p of [1,0,.56,.86])seaShippingPose(p);
  assert.deepEqual(seaShippingPose(.76),held);
});
