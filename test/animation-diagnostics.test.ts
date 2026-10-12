import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveMotion,reportAnimationFailure,syncRefreshedMotion} from '../lib/animation-diagnostics.ts';
import { gsap } from 'gsap';
import { seaShippingPose } from '../app/components/freight-story/sea-shipping-motion.ts';
test('system reduced motion stays static until explicit play; pause still wins',()=>{
 assert.equal(resolveMotion(true,'system'),'system-reduced');
 assert.equal(resolveMotion(false,'system'),'playing');
 assert.equal(resolveMotion(true,'play'),'playing');
 assert.equal(resolveMotion(true,'pause'),'user-paused');
 assert.equal(resolveMotion(false,'pause'),'user-paused');
});
test('GSAP suppressed refresh skips the rig callback; explicit refresh publication restores its pose',()=>{
 let pose=seaShippingPose(0);const clock={progress:0};
 const publish=(p:number)=>{pose=seaShippingPose(p);};
 const timeline=gsap.timeline({paused:true,onUpdate(){publish(this.progress());}}).to(clock,{progress:1,duration:6,ease:'none'});
 try{
  timeline.progress(.43);assert.deepEqual(pose,seaShippingPose(.43));
  timeline.progress(0);timeline.totalProgress(.93,true);
  assert.deepEqual(pose,seaShippingPose(0)); // Exactly what refresh's suppressEvents does.
  syncRefreshedMotion(timeline,0,publish);assert.deepEqual(pose,seaShippingPose(.93));
  timeline.totalProgress(.27,true);syncRefreshedMotion(timeline,0,publish);
  assert.deepEqual(pose,seaShippingPose(.27));
 }finally{timeline.kill();gsap.ticker.sleep();}
});
test('same initialization failure is logged once per element with a fixed diagnostic code',()=>{
 const element={dataset:{}} as HTMLElement;const entries:unknown[][]=[];const warn=console.warn;
 try{console.warn=(...args:unknown[])=>{entries.push(args);};reportAnimationFailure(element,'sea','gsap-import');reportAnimationFailure(element,'sea','gsap-import');assert.equal(entries.length,1);assert.equal(element.dataset.motionError,'gsap-import');assert.deepEqual(entries[0],['[EZWAY animation] sea: gsap-import']);}finally{console.warn=warn;}
});
