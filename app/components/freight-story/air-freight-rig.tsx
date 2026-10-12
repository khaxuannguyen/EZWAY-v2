'use client';
import {useEffect,useRef,useState} from 'react';
import {AIR_RIG as M,airFreightPose} from './air-freight-motion';

const asset=(name:string)=>`/assets/freight-story/air/rig-v1/${name}.webp`;
const at=(x:number,y:number,width:number,height:number)=>({left:x,top:y,width,height});

export function AirFreightRig(){
  const rootRef=useRef<HTMLDivElement>(null);
  const [nearby,setNearby]=useState(false),[failed,setFailed]=useState(false);
  useEffect(()=>{
    const root=rootRef.current;if(!root)return;
    const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){setNearby(true);observer.disconnect();}},{rootMargin:'900px'});
    observer.observe(root);return()=>observer.disconnect();
  },[]);
  useEffect(()=>{
    const root=rootRef.current;if(!root||!nearby||failed)return;
    const stage=root.closest<HTMLElement>('.freight-story-stage')!,plane=root.querySelector<HTMLElement>('.air-rig-plane')!;
    const parts=Object.fromEntries([...root.querySelectorAll<HTMLElement>('[data-air-part]')].map(node=>[node.dataset.airPart!,node]));
    const move=(name:string,x:number,y:number)=>{parts[name].style.transform=`translate3d(${x}px,${y}px,0)`;};
    let disposed=false;
    const draw=(progress:number)=>{
      const s=airFreightPose(progress);
      parts.camera.style.transform=`translate3d(${s.camera.x}px,${s.camera.y}px,0) scale(${s.camera.zoom})`;
      parts.aircraft.style.transform=`translate3d(${s.planeX}px,${s.planeY}px,0) rotate(${s.pitch}deg)`;
      move('loader',s.loaderX,M.ground-M.loaderHeight);
      move('platform',s.platformX,s.platformY);
      move('pallet',s.palletX,s.palletY);
      parts.door.style.transform=`perspective(1200px) rotateX(${s.doorAngle}deg)`;
      parts['main-gear'].style.transform=`translateY(${-180*s.gearAngle/90}px) rotate(${s.gearAngle}deg)`;
      parts['nose-gear'].style.transform=`translateY(${-180*s.gearAngle/90}px) rotate(${s.gearAngle}deg)`;
      move('background',s.backgroundX,0);parts.sky.style.opacity=String(s.skyOpacity);
      for(const [name,x,angle] of [['arm-a',s.armLeftX,-s.armAngle],['arm-b',s.armLeftX,s.armAngle]] as const){
        parts[name].style.transform=`translate3d(${x}px,${name==='arm-a'?M.basePivotY:s.armTopY}px,0) rotate(${angle}deg)`;
      }
      root.querySelectorAll<HTMLElement>('.air-main-wheel').forEach(w=>{w.style.transform=`rotate(${s.wheelAngle}deg)`;});
      root.querySelectorAll<HTMLElement>('.air-nose-wheel').forEach(w=>{w.style.transform=`rotate(${s.noseWheelAngle}deg)`;});
      root.querySelectorAll<HTMLElement>('.air-loader-wheel').forEach(w=>{w.style.transform=`rotate(${s.loaderWheelAngle}deg)`;});
      parts.shadow.style.transform=`translate3d(${s.planeX}px,${M.ground-5}px,0) scaleX(${Math.max(.4,1+s.planeY/1800)})`;
      parts.shadow.style.opacity=String(.25*(1-s.skyOpacity));
      root.dataset.pose=JSON.stringify(s);root.dataset.loaded=String(s.palletLoaded);root.dataset.airborne=String(s.planeY<0);
    };
    const resize=()=>{const scale=Math.max(root.clientWidth/M.width,root.clientHeight/M.height);plane.style.left=`${(root.clientWidth-M.width*scale)/2}px`;plane.style.top=`${(root.clientHeight-M.height*scale)/2}px`;plane.style.transform=`scale(${scale})`;};
    const observer=new ResizeObserver(resize);observer.observe(root);resize();draw(Number(stage.dataset.progress||0));
    const onProgress=(event:Event)=>draw((event as CustomEvent<number>).detail);stage.addEventListener('freight-progress',onProgress);
    Promise.all([...root.querySelectorAll<HTMLImageElement>('img')].map(img=>img.decode())).then(()=>{if(disposed)return;root.dataset.ready='true';stage.dataset.rigReady='true';stage.dispatchEvent(new Event('freight-rig-ready'));}).catch(()=>{if(!disposed)setFailed(true);});
    return()=>{disposed=true;observer.disconnect();stage.removeEventListener('freight-progress',onProgress);delete stage.dataset.rigReady;};
  },[nearby,failed]);
  if(failed)return <div className="sea-rig-error">Hình thao tác hiện chưa tải được. Xem quy trình và liên hệ EZWAY bên dưới.</div>;
  const source=(name:string)=>nearby?asset(name):undefined;
  return <div ref={rootRef} className="air-freight-rig" data-ready="false" role="img" aria-label="Mô phỏng high-loader đưa pallet vào khoang; máy bay tăng tốc, nâng mũi và rời mặt đất theo cuộn trang">
    <div className="air-rig-plane">
      <img data-air-part="background" className="air-rig-background" src={source('environment')} alt="" loading="eager" decoding="async"/>
      <img data-air-part="sky" className="air-rig-background air-rig-sky" src={source('sky')} alt="" loading="eager" decoding="async"/>
      <div data-air-part="camera" className="air-world">
        <div data-air-part="shadow" className="sea-rig-shadow air-aircraft-shadow"/>
        <div data-air-part="aircraft" className="air-aircraft" style={{transformOrigin:`${M.mainPivotX}px ${M.mainPivotY}px`}}>
          <div data-air-part="main-gear" className="air-object air-gear" style={{...at(M.mainGearX,M.ground-M.mainGearHeight,M.mainGearWidth,M.mainGearHeight),transformOrigin:'50% 0'}}>
            <img src={source('mainGear')} alt="" loading="eager" decoding="async"/>
            {[244,838].map(x=><i className="air-wheel air-main-wheel" key={x} style={{...at(x*290/1093-M.mainWheelRadius,225.26-M.mainWheelRadius,2*M.mainWheelRadius,2*M.mainWheelRadius),backgroundImage:nearby?`url(${asset('mainGear')})`:undefined,backgroundSize:`${M.mainGearWidth}px ${M.mainGearHeight}px`,backgroundPosition:`${-(x*290/1093-M.mainWheelRadius)}px ${-(225.26-M.mainWheelRadius)}px`}}/>)}
          </div>
          <div data-air-part="nose-gear" className="air-object air-gear" style={{...at(M.noseGearX,M.ground-M.noseGearHeight,M.noseGearWidth,M.noseGearHeight),transformOrigin:'50% 0'}}>
            <img src={source('noseGear')} alt="" loading="eager" decoding="async"/>
            <i className="air-wheel air-nose-wheel" style={{...at(M.noseWheelX-M.noseGearX-M.noseWheelRadius,M.noseGearHeight-2*M.noseWheelRadius,2*M.noseWheelRadius,2*M.noseWheelRadius),backgroundImage:nearby?`url(${asset('noseGear')})`:undefined,backgroundSize:`${M.noseGearWidth}px ${M.noseGearHeight}px`,backgroundPosition:`${-(M.noseWheelX-M.noseGearX-M.noseWheelRadius)}px ${-(M.noseGearHeight-2*M.noseWheelRadius)}px`}}/>
          </div>
          <img className="air-object" src={source('aircraft')} style={at(0,M.aircraftY,M.aircraftWidth,M.aircraftHeight)} alt="" loading="eager" decoding="async"/>
          <div className="air-pallet-window"><img data-air-part="pallet" className="air-object" src={source('pallet')} style={at(0,0,M.palletWidth,M.palletHeight)} alt="" loading="eager" decoding="async"/></div>
          <img data-air-part="door" className="air-object air-door" src={source('door')} style={at(M.doorX,M.doorY,M.doorWidth,M.doorHeight)} alt="" loading="eager" decoding="async"/>
        </div>
        <div data-air-part="loader" className="air-object" style={at(0,0,M.loaderWidth,M.loaderHeight)}>
          <img src={source('loader')} alt="" loading="eager" decoding="async"/>
          {[119,563].map(x=><i key={x} className="air-wheel air-loader-wheel" style={{...at(x-32,138-32,64,64),backgroundImage:nearby?`url(${asset('loader')})`:undefined,backgroundSize:`${M.loaderWidth}px ${M.loaderHeight}px`,backgroundPosition:`${-(x-32)}px ${-(138-32)}px`}}/>)}
        </div>
        {['arm-a','arm-b'].map(name=><img data-air-part={name} className="air-object air-scissor-arm" src={source('arm')} style={at(M.armArtworkLeft,-M.armHeight/2,M.armArtworkWidth,M.armHeight)} key={name} alt="" loading="eager" decoding="async"/>)}
        <img data-air-part="platform" className="air-object" src={source('platform')} style={at(0,0,M.platformWidth,M.platformHeight)} alt="" loading="eager" decoding="async"/>
      </div>
    </div>
  </div>;
}
