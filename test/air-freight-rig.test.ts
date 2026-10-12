import {test} from 'node:test';
import assert from 'node:assert/strict';
import {AIR_RIG as M,airFreightPose} from '../app/components/freight-story/air-freight-motion.ts';
const near=(a:number,b:number)=>assert.ok(Math.abs(a-b)<.001,`${a} != ${b}`);

test('rigid scissor bars support level platform and pallet; loaded cargo stays on hold floor',()=>{
  for(let i=0;i<=580;i++){
    const p=i/1000,s=airFreightPose(p),height=M.basePivotY-s.armTopY;
    near(Math.hypot(s.armSpan,height),M.armLength);
    assert.ok(s.armSpan>200&&s.armSpan<=M.armLength);
    if(p<.42)near(s.palletY+M.palletHeight,s.platformY);
  }
  for(const p of [.3,.35,.4]){const s=airFreightPose(p);near(s.platformX,M.doorX+M.doorWidth);near(s.platformY,M.doorFloor);}
  for(const p of [.42,.49,.62]){
    const s=airFreightPose(p);near(s.palletY+M.palletHeight,M.doorFloor);assert.ok(s.palletX+M.palletWidth<M.doorX,'pallet is behind fuselage occlusion, not faded');
  }
});
test('equipment lowers and clears before door closes and aircraft taxis',()=>{
  near(airFreightPose(.49).platformY,460);
  assert.ok(airFreightPose(.58).loaderX>20000);
  assert.equal(airFreightPose(.58).doorClosed,false);
  near(airFreightPose(.62).doorAngle,0);
  near(airFreightPose(.61).planeX,0);
  assert.ok(airFreightPose(.64).planeX>0);
});
test('takeoff rotates around main-wheel contact before liftoff, then retracts gear during climb',()=>{
  for(const p of [.7,.76,.79,.82])near(airFreightPose(p).mainContactY,M.ground);
  const rotation=airFreightPose(.81);
  assert.ok(rotation.pitch<-8);assert.ok(rotation.noseWheel.y+M.noseWheelRadius<M.ground-150);
  assert.ok(airFreightPose(.84).mainContactY<M.ground);
  near(airFreightPose(.875).gearAngle,0);
  assert.equal(airFreightPose(1).gearAngle,90);assert.equal(airFreightPose(1).doorClosed,true);
  assert.ok(airFreightPose(1).planeY<-900);
});
test('air loading and takeoff reverse to identical poses after arbitrary forward seeks',()=>{
  const states=[.25,.38,.61,.8,.93].map(airFreightPose);
  for(const p of [1,.93,0,.25,.8,.38,.61]){
    const index=[.25,.38,.61,.8,.93].indexOf(p);if(index>=0)assert.deepEqual(airFreightPose(p),states[index]);
  }
});
