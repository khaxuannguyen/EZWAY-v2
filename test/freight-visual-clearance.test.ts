import {test} from 'node:test';
import assert from 'node:assert/strict';
import {SEA_PICKUP as M,seaPickupPose} from '../app/components/freight-story/sea-pickup-motion.ts';
import {seaShippingPose} from '../app/components/freight-story/sea-shipping-motion.ts';
import {AIR_RIG} from '../app/components/freight-story/air-freight-motion.ts';

test('the receiving trailer clears the stacker silhouette throughout pickup, with its wrist still attached',()=>{
  for(let i=0;i<=1000;i++){
    const s=seaPickupPose(i/1000);
    assert.ok(s.bodyX>=s.truckX+M.truckWidth+10,'trailer sweeps into stacker body');
    const angle=s.boomAngle*Math.PI/180;
    const wristX=s.pivotX-s.boomLength*Math.cos(angle)-M.boomTipOffsetY*Math.sin(angle);
    const wristY=s.pivotY-s.boomLength*Math.sin(angle)+M.boomTipOffsetY*Math.cos(angle);
    assert.ok(Math.abs(wristX-s.wristX)<1e-8&&Math.abs(wristY-s.wristY)<1e-8);
  }
});

test('ground shadow fades continuously during crane lift and stays absent over water',()=>{
  let previous=Infinity;
  for(let i=6650;i<=10000;i++){
    const s=seaShippingPose(i/10000);
    assert.ok(s.cargoShadowOpacity>=0&&s.cargoShadowOpacity<=previous+1e-8);
    if(i>=7150)assert.equal(s.cargoShadowOpacity,0);
    previous=s.cargoShadowOpacity;
  }
});

test('lower scissor bearings align with the photographed chassis rail',()=>{
  // The rail centre is y=153 in the 1200px-wide cropped source photograph.
  const photographedRail=AIR_RIG.ground-AIR_RIG.loaderHeight+153*AIR_RIG.loaderWidth/1200;
  assert.ok(Math.abs(AIR_RIG.basePivotY-photographedRail)<.5);
});
