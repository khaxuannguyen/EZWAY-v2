'use client';
import { useEffect,useRef,useState } from 'react';
import { globeDestinations } from '../../lib/globe-geo';
import { reportAnimationFailure,type MotionState } from '../../lib/animation-diagnostics';
import type { createEarthEngine } from './hero-globe/earth-engine';
import './hero-globe/earth-globe.css';

export default function Globe(){
 const canvas=useRef<HTMLCanvasElement>(null),originLabel=useRef<HTMLSpanElement>(null),destinationLabel=useRef<HTMLSpanElement>(null);
 const engine=useRef<ReturnType<typeof createEarthEngine>|null>(null);
 const [active,setActive]=useState(2),[motion,setMotion]=useState<MotionState>('playing'),[state,setState]=useState<'loading'|'ready'|'fallback'>('loading');
 const activeRef=useRef(active),pausedRef=useRef(false);
 useEffect(()=>{
  let mounted=true;let phase='engine-import';
  // Keep the server-rendered poster stable; defer GPU code until after first paint.
  const timer=window.setTimeout(async()=>{
   try{
    const {createEarthEngine}=await import('./hero-globe/earth-engine');
    if(!mounted||!canvas.current||!originLabel.current||!destinationLabel.current)return;
    phase='webgl-init';engine.current=createEarthEngine({canvas:canvas.current,originLabel:originLabel.current,destinationLabel:destinationLabel.current,onMotion:(value)=>{if(mounted)setMotion(value);},onState:(value)=>{if(mounted)setState(value);}});
    engine.current.select(activeRef.current);if(pausedRef.current)engine.current.pause(true);
   }catch{if(mounted){reportAnimationFailure(canvas.current,'globe',phase);setState('fallback');}}
  },1800);
  return()=>{mounted=false;window.clearTimeout(timer);engine.current?.dispose();engine.current=null;};
 },[]); const selected=globeDestinations[active];
 return <div className="ez-globe ez-earth" data-state={state}>
  <div className="ez-globe-surface ez-earth-surface">
   <div className="ez-earth-poster" aria-hidden="true"><div/></div>
   <canvas ref={canvas} role="img" aria-label={`Địa cầu 3D: tuyến minh hoạ từ TP.HCM đến ${selected.city}, ${selected.name}`}/>
   <span className="ez-earth-node-label" ref={originLabel} aria-hidden="true">VIỆT NAM</span><span className="ez-earth-node-label ez-earth-destination-label" ref={destinationLabel} aria-hidden="true">{selected.name}<small>{selected.city}</small></span>
   <span className="ez-globe-coordinate">10.8231° N / 106.6297° E<br/><b>HO CHI MINH CITY</b></span>
   {state==='fallback'&&<span className="ez-earth-fallback-note">Bản xem nhẹ · Việt Nam → {selected.name}</span>}
  </div>
  <div className="ez-globe-controls ez-earth-controls" role="group" aria-label="Chọn điểm đến trên địa cầu">{globeDestinations.map((d,index)=><button key={d.code} type="button" aria-pressed={index===active} aria-label={`${d.name} — ${d.city}`} onClick={()=>{activeRef.current=index;setActive(index);engine.current?.select(index);}}><img src={`/assets/destinations/v1/flags/${d.code.toLowerCase()}.svg`} width="19" height="13" alt=""/><span><b>{d.code}</b> / {d.name}</span></button>)}</div>
  <div className="ez-earth-action-row"><button type="button" className="ez-earth-motion" aria-pressed={motion!=='playing'} disabled={state!=='ready'} onClick={()=>{const pause=motion==='playing';pausedRef.current=pause;engine.current?.pause(pause);}}>{state!=='ready'?'Chuyển động chưa sẵn sàng':motion==='system-reduced'?'Bật chuyển động':motion==='user-paused'?'Tiếp tục chuyển động':'Dừng chuyển động'}</button><a href={`/gia-cuoc?destination=${selected.code}&source=public_cta#yeu-cau`} data-quote-destination={selected.code} data-quote-source="public_cta">Tư vấn tuyến {selected.name} ↗</a></div>
  {motion==='system-reduced'&&<p className="ez-globe-caption" role="status">Đang giảm chuyển động theo cài đặt thiết bị. Bạn có thể chủ động bật chuyển động.</p>}
  <p className="ez-globe-caption" aria-live="polite">Việt Nam → {selected.name}. Tuyến và thành phố là minh hoạ, không phải dữ liệu khai thác trực tiếp.</p>
  <span className="ez-earth-credit">Earth imagery: NASA Earth Observatory</span>
 </div>;
}
