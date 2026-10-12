import * as THREE from 'three';
import { resolveMotion,reportAnimationFailure,type MotionChoice,type MotionState } from '../../../lib/animation-diagnostics';
import { geoToCartesian,globeOrigin,globeDestinations,greatCirclePoint,routeLift,routeViewDirection } from '../../../lib/globe-geo';

const vertex=`varying vec2 vUv;varying vec3 vNormal;varying vec3 vPosition;void main(){vUv=uv;vNormal=normalize(mat3(modelMatrix)*normal);vPosition=(modelMatrix*vec4(position,1.0)).xyz;gl_Position=projectionMatrix*viewMatrix*vec4(vPosition,1.0);}`;
const fragment=`uniform sampler2D earth;uniform vec3 sun;varying vec2 vUv;varying vec3 vNormal;varying vec3 vPosition;
void main(){vec3 albedo=texture2D(earth,vUv).rgb;vec3 n=normalize(vNormal);vec3 view=normalize(cameraPosition-vPosition);float daylight=max(dot(n,sun),0.0);float sea=smoothstep(.015,.09,albedo.b-max(albedo.r,albedo.g));float spec=pow(max(dot(n,normalize(sun+view)),0.0),65.0)*sea*.3;vec3 base=mix(albedo,albedo*vec3(.55,.8,1.08),sea*.55);vec3 color=base*(.15+.95*daylight)+vec3(.32,.58,.7)*spec;float rim=pow(1.0-max(dot(n,view),0.0),4.0);color+=vec3(.025,.09,.14)*rim*daylight;gl_FragColor=vec4(color,1.0);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`;
const atmosphere=`varying vec3 vNormal;varying vec3 vPosition;void main(){vec3 view=normalize(cameraPosition-vPosition);float edge=pow(1.0-abs(dot(normalize(vNormal),view)),5.5);gl_FragColor=vec4(.18,.46,.7,edge*.28);}`;
type Options={canvas:HTMLCanvasElement;originLabel:HTMLElement;destinationLabel:HTMLElement;onState:(state:'ready'|'fallback')=>void;onMotion?:(state:MotionState)=>void};
export function createEarthEngine({canvas,originLabel,destinationLabel,onState,onMotion}:Options){
 const mobile=matchMedia('(max-width:650px)').matches,low=mobile||navigator.hardwareConcurrency<=4;
 const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:!low,powerPreference:'low-power'});
 renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.setClearColor(0,0);renderer.setPixelRatio(Math.min(devicePixelRatio||1,low?1.25:1.75));
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(42,1,.1,20);camera.position.set(0,0,3.65);
 const globe=new THREE.Group();scene.add(globe);
 const geometry=new THREE.SphereGeometry(1,low?48:80,low?32:56);
 const texture=new THREE.TextureLoader().load(`/assets/globe/earth-${low?1024:2048}.webp`,()=>{if(disposed){texture.dispose();return;}ready=true;onState('ready');start();},undefined,()=>{if(!disposed){ready=false;reportAnimationFailure(canvas,'globe','texture-load');onState('fallback');stop();}});
 texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());
 const material=new THREE.ShaderMaterial({vertexShader:vertex,fragmentShader:fragment,uniforms:{earth:{value:texture},sun:{value:new THREE.Vector3(-.65,.4,1).normalize()}}});
 globe.add(new THREE.Mesh(geometry,material));
 const airGeometry=new THREE.SphereGeometry(1.018,low?40:64,32),airMaterial=new THREE.ShaderMaterial({vertexShader:vertex,fragmentShader:atmosphere,transparent:true,depthWrite:false,side:THREE.BackSide,blending:THREE.AdditiveBlending});globe.add(new THREE.Mesh(airGeometry,airMaterial));
 const startPoint=new THREE.Vector3(...geoToCartesian(globeOrigin.lat,globeOrigin.lon));
 const nodeGeometry=new THREE.SphereGeometry(.012,12,8),pulseGeometry=new THREE.SphereGeometry(.009,10,6);
 const originMaterial=new THREE.MeshBasicMaterial({color:0x8ff8e1}),originNode=new THREE.Mesh(nodeGeometry,originMaterial);originNode.position.copy(startPoint).multiplyScalar(1.015);globe.add(originNode);
 const routeMeshes=globeDestinations.map(d=>{
  const end=new THREE.Vector3(...geoToCartesian(d.lat,d.lon)),lift=routeLift(startPoint.toArray() as [number,number,number],end.toArray() as [number,number,number]);
  const points=Array.from({length:129},(_,i)=>new THREE.Vector3(...greatCirclePoint(startPoint.toArray() as [number,number,number],end.toArray() as [number,number,number],i/128,lift)));
  const lineGeometry=new THREE.BufferGeometry().setFromPoints(points),lineMaterial=new THREE.LineBasicMaterial({color:0x5ce4d6,transparent:true,opacity:.08,depthWrite:false}),line=new THREE.Line(lineGeometry,lineMaterial);globe.add(line);
  const nodeMaterial=new THREE.MeshBasicMaterial({color:0x69dfd8,transparent:true,opacity:.45}),node=new THREE.Mesh(nodeGeometry,nodeMaterial);node.position.copy(end).multiplyScalar(1.015);globe.add(node);
  const pulseMaterial=new THREE.MeshBasicMaterial({color:0xe4fff8,transparent:true,opacity:0}),pulse=new THREE.Mesh(pulseGeometry,pulseMaterial);globe.add(pulse);
  const trailArray=new Float32Array(24),trailGeometry=new THREE.BufferGeometry();trailGeometry.setAttribute('position',new THREE.BufferAttribute(trailArray,3));const trailMaterial=new THREE.LineBasicMaterial({color:0x8df5e9,transparent:true,opacity:0,depthWrite:false}),trail=new THREE.Line(trailGeometry,trailMaterial);globe.add(trail);
  return {end,points,lineGeometry,lineMaterial,nodeMaterial,node,pulseMaterial,pulse,trail,trailArray,trailGeometry,trailMaterial,weight:0,reveal:1};
 });
 let active=2,disposed=false,ready=false,visible=true,raf=0,last=0,lastPaint=0,elapsed=0,holdUntil=6,transitionStart=0;
 let pointerX=0,pointerY=0,quality=low?'mobile':'desktop',fpsLimit=low?30:60,dprCap=low?1.25:1.75;
 const media=matchMedia('(prefers-reduced-motion: reduce)');let reduced=media.matches;let choice:MotionChoice='system';
 const motionState=()=>resolveMotion(reduced,choice);
 const publishMotion=()=>{canvas.dataset.motionPreference=reduced?'reduce':'normal';canvas.dataset.motionState=motionState();onMotion?.(motionState());};publishMotion();
 renderer.debug.onShaderError=()=>{ready=false;reportAnimationFailure(canvas,'globe','shader-compile');stop();onState('fallback');};
 const target=new THREE.Quaternion(),from=new THREE.Quaternion(),yawRotation=new THREE.Quaternion(),pitchRotation=new THREE.Quaternion();const axisY=new THREE.Vector3(0,1,0),axisX=new THREE.Vector3(1,0,0),temp=new THREE.Vector3(),projected=new THREE.Vector3();
 function orientation(index:number){const direction=routeViewDirection(routeMeshes[index].end.toArray() as [number,number,number]);yawRotation.setFromAxisAngle(axisY,-Math.atan2(direction[0],direction[2]));pitchRotation.setFromAxisAngle(axisX,Math.atan2(direction[1],Math.hypot(direction[0],direction[2])));target.copy(pitchRotation).multiply(yawRotation);}
 orientation(active);globe.quaternion.copy(target);from.copy(target);routeMeshes[active].weight=1;
 let metricStart=0,frameCount=0,totalFrames=0,cpuSum=0,cpuMax=0,longTasks=0;const cpuSamples:number[]=[];
 const perfObserver=typeof PerformanceObserver!=='undefined'?new PerformanceObserver(list=>{longTasks+=list.getEntries().length;}):null;try{perfObserver?.observe({type:'longtask',buffered:false});}catch{/* optional browser metric */}
 function metrics(time:number,cpu:number){totalFrames++;frameCount++;cpuSum+=cpu;cpuMax=Math.max(cpuMax,cpu);if(cpuSamples.length<180)cpuSamples.push(cpu);canvas.dataset.frames=String(totalFrames);if(time-metricStart>=2000){const fps=frameCount*1000/(time-metricStart);canvas.dataset.fps=fps.toFixed(1);canvas.dataset.cpuMs=(cpuSum/frameCount).toFixed(2);canvas.dataset.cpuMaxMs=cpuMax.toFixed(2);canvas.dataset.longTasks=String(longTasks);canvas.dataset.drawCalls=String(renderer.info.render.calls);canvas.dataset.geometries=String(renderer.info.memory.geometries);canvas.dataset.textures=String(renderer.info.memory.textures);canvas.dataset.quality=quality;const memory=(performance as Performance&{memory?:{usedJSHeapSize:number}}).memory;if(memory)canvas.dataset.heapMb=(memory.usedJSHeapSize/1048576).toFixed(1);if(!low&&fps<25&&totalFrames>50){quality='adaptive';fpsLimit=30;dprCap=1;resize();}metricStart=time;frameCount=0;cpuSum=0;cpuMax=0;}}
 function label(element:HTMLElement,position:THREE.Vector3){temp.copy(position).applyQuaternion(globe.quaternion);const show=temp.z>1/camera.position.z+.01;projected.copy(temp).project(camera);element.style.opacity=show?'1':'0';element.style.transform=`translate(-50%,-50%) translate(${(projected.x*.5+.5)*canvas.clientWidth}px,${(-projected.y*.5+.5)*canvas.clientHeight}px)`;}
 function stop(){cancelAnimationFrame(raf);raf=0;canvas.dataset.running='false';}
 function render(time:number){raf=0;if(disposed||!ready||!visible||document.hidden)return;const moving=motionState()==='playing';
  if(moving&&time-lastPaint<1000/fpsLimit-1){raf=requestAnimationFrame(render);return;}
  const started=performance.now(),dt=Math.min((time-last)/1000||0,.06);last=time;lastPaint=time;
  if(moving)elapsed+=dt;
  const progress=Math.min(1,(elapsed-transitionStart)/1.15),ease=progress*progress*(3-2*progress);
  if(moving&&progress<1)globe.quaternion.slerpQuaternions(from,target,ease);
  else if(moving&&elapsed>holdUntil){yawRotation.setFromAxisAngle(axisY,Math.sin((elapsed-holdUntil)*Math.PI/60)*.035);globe.quaternion.copy(target).premultiply(yawRotation);}
  camera.position.x=pointerX*.07;camera.position.y=pointerY*.05;camera.lookAt(0,0,0);camera.updateMatrixWorld();
  routeMeshes.forEach((route,index)=>{
   const selected=index===active;route.weight=moving?THREE.MathUtils.damp(route.weight,selected?1:0,7,dt):selected?1:0;
   route.reveal=selected&&moving?Math.min(1,(elapsed-transitionStart)/1.05):1;
   route.lineGeometry.setDrawRange(0,selected?Math.max(2,Math.floor(129*route.reveal)):129);route.lineMaterial.opacity=.035+route.weight*.76;
   route.nodeMaterial.opacity=.25+route.weight*.75;route.node.scale.setScalar(1+route.weight*.3);
   const phase=moving?((elapsed-transitionStart)/4.2)%1:.58,pos=Math.max(0,phase)*128,lower=Math.min(127,Math.floor(pos));route.pulse.position.lerpVectors(route.points[lower],route.points[lower+1],pos-lower);
   route.pulse.visible=route.weight>.015;route.trail.visible=route.weight>.015;
   route.pulseMaterial.opacity=route.weight*Math.min(1,phase*8,(1-phase)*8)*(route.reveal>=phase?1:0);
   route.trailMaterial.opacity=route.weight*.35*(route.reveal>=phase?1:0);
   for(let j=0;j<8;j++){const t=Math.max(0,pos-j*1.3),k=Math.min(127,Math.floor(t));temp.lerpVectors(route.points[k],route.points[k+1],t-k);temp.toArray(route.trailArray,j*3);}route.trailGeometry.attributes.position.needsUpdate=true;
  });
  originNode.scale.setScalar(moving?1+.08*Math.sin(elapsed*1.7):1);globe.updateMatrixWorld();renderer.render(scene,camera);if(!ready){stop();return;}label(originLabel,originNode.position);label(destinationLabel,routeMeshes[active].node.position);
  metrics(time,performance.now()-started);canvas.dataset.running=String(moving);if(moving)raf=requestAnimationFrame(render);
 }
 function start(){stop();canvas.dataset.visible=String(visible);canvas.dataset.stopReason=disposed?'disposed':!ready?'not-ready':!visible?'offscreen':document.hidden?'hidden-tab':motionState();if(disposed||!ready||!visible||document.hidden)return;last=performance.now();metricStart=last;frameCount=0;cpuSum=0;cpuMax=0;render(last);}
 function resize(){const size=canvas.clientWidth;if(!size)return;renderer.setPixelRatio(Math.min(devicePixelRatio||1,dprCap));renderer.setSize(size,size,false);}
 const ro=new ResizeObserver(()=>{resize();start();});ro.observe(canvas);
 const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;start();},{threshold:.01});io.observe(canvas);
 const visibility=()=>start(),motion=()=>{reduced=media.matches;choice='system';publishMotion();if(reduced)globe.quaternion.copy(target);start();};
 const pointer=(event:PointerEvent)=>{if(motionState()!=='playing'||event.pointerType==='touch')return;const rect=canvas.getBoundingClientRect();pointerX=(event.clientX-rect.left)/rect.width-.5;pointerY=(event.clientY-rect.top)/rect.height-.5;};
 const leave=()=>{pointerX=0;pointerY=0;};
 const lost=(event:Event)=>{event.preventDefault();ready=false;reportAnimationFailure(canvas,'globe','context-lost');stop();onState('fallback');};const restored=()=>{if(!disposed){ready=true;delete canvas.dataset.motionError;onState('ready');start();}};
 document.addEventListener('visibilitychange',visibility);media.addEventListener('change',motion);canvas.addEventListener('pointermove',pointer);canvas.addEventListener('pointerleave',leave);canvas.addEventListener('webglcontextlost',lost);canvas.addEventListener('webglcontextrestored',restored);resize();
 return {
  select(index:number){if(!routeMeshes[index])return;active=index;from.copy(globe.quaternion);orientation(index);transitionStart=elapsed;holdUntil=elapsed+8;if(motionState()!=='playing')globe.quaternion.copy(target);start();},
  pause(value:boolean){choice=value?'pause':'play';publishMotion();start();},
  dispose(){disposed=true;stop();ro.disconnect();io.disconnect();perfObserver?.disconnect();document.removeEventListener('visibilitychange',visibility);media.removeEventListener('change',motion);canvas.removeEventListener('pointermove',pointer);canvas.removeEventListener('pointerleave',leave);canvas.removeEventListener('webglcontextlost',lost);canvas.removeEventListener('webglcontextrestored',restored);geometry.dispose();airGeometry.dispose();nodeGeometry.dispose();pulseGeometry.dispose();material.dispose();airMaterial.dispose();originMaterial.dispose();texture.dispose();routeMeshes.forEach(r=>{r.lineGeometry.dispose();r.lineMaterial.dispose();r.nodeMaterial.dispose();r.pulseMaterial.dispose();r.trailGeometry.dispose();r.trailMaterial.dispose();});renderer.dispose();renderer.forceContextLoss();},
 };
}
