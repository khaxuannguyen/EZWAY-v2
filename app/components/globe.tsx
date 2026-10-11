'use client';

import { useEffect, useRef, useState } from 'react';
import land from '../../lib/earth-points.json';

export const destinations = [
  { name: 'Mỹ', code: 'US', lat: 38, lon: -100, flag: '🇺🇸' },
  { name: 'Canada', code: 'CA', lat: 49, lon: -110, flag: '🇨🇦' },
  { name: 'Úc', code: 'AU', lat: -27, lon: 134, flag: '🇦🇺' },
  { name: 'New Zealand', code: 'NZ', lat: -41, lon: 174, flag: '🇳🇿' },
  { name: 'Anh', code: 'GB', lat: 52, lon: -1, flag: '🇬🇧' },
  { name: 'Châu Âu', code: 'EU', lat: 48, lon: 12, flag: '🇪🇺' },
];
type Vector = [number, number, number];
const rad = Math.PI / 180;
function vector(lat: number, lon: number): Vector { return [Math.cos(lat*rad)*Math.sin(lon*rad), -Math.sin(lat*rad), Math.cos(lat*rad)*Math.cos(lon*rad)]; }
const origin = vector(10.8, 106.7);
const dots = land.map(([lat, lon]) => vector(lat, lon));
const routes = destinations.map(d => {
  const end = vector(d.lat,d.lon);
  const angle = Math.acos(Math.min(1, origin.reduce((s,v,i)=>s+v*end[i],0)));
  return Array.from({length:70},(_,i)=>{
    const t=i/69, a=Math.sin((1-t)*angle)/Math.sin(angle), b=Math.sin(t*angle)/Math.sin(angle);
    const elevation=1+0.23*Math.sin(t*Math.PI);
    return origin.map((v,k)=>(a*v+b*end[k])*elevation) as Vector;
  });
});

export default function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(2);
  const pauseRef = useRef(false);
  const viewRef = useRef(-106.7*rad);
  const [active,setActive] = useState(2);
  const [paused,setPaused] = useState(false);
  const [fallback,setFallback] = useState(false);

  useEffect(()=>{
    const canvas=canvasRef.current;
    const ctx=canvas?.getContext('2d',{alpha:true});
    if(!canvas||!ctx){setFallback(true);return;}
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduced=media.matches, visible=true, raf=0, last=0, width=0, yaw=-106.7*rad, tilt=-0.15;
    let pointerX=0,pointerY=0, spin=0, previousView=viewRef.current, painted=0;
    const resize=()=>{width=canvas.clientWidth;const dpr=Math.min(window.devicePixelRatio||1,1.75);canvas.width=Math.round(width*dpr);canvas.height=Math.round(width*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);};
    const project=(v:Vector)=>{const [x,y,z]=v;const a=x*Math.cos(yaw)+z*Math.sin(yaw),b=-x*Math.sin(yaw)+z*Math.cos(yaw);return [a,y*Math.cos(tilt)-b*Math.sin(tilt),y*Math.sin(tilt)+b*Math.cos(tilt)];};
    const draw=(time:number)=>{
      // 30 fps is enough for a slowly rotating globe; preserve main-thread time for forms.
      if(time-painted<33 && visible&&!document.hidden&&!reduced&&!pauseRef.current){raf=requestAnimationFrame(draw);return;}
      painted=time;
      const delta=Math.min(time-last||16,80);last=time;
      const moving=visible&&!document.hidden&&!reduced&&!pauseRef.current;
      if(previousView!==viewRef.current){spin=0;previousView=viewRef.current;}
      if(moving) spin+=delta*0.000022;
      const targetYaw=viewRef.current+spin+pointerX*0.1;
      const turn=Math.atan2(Math.sin(targetYaw-yaw),Math.cos(targetYaw-yaw));
      yaw=reduced||pauseRef.current?targetYaw:yaw+turn*.065;tilt=-0.15+pointerY*0.06;
      const radius=width*0.335,cx=width/2,cy=width/2;
      ctx.clearRect(0,0,width,width);
      const glow=ctx.createRadialGradient(cx,cy,radius*0.8,cx,cy,radius*1.35);glow.addColorStop(0,'rgba(49,133,255,0)');glow.addColorStop(.7,'rgba(49,133,255,.10)');glow.addColorStop(1,'rgba(49,133,255,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,width,width);
      const ocean=ctx.createRadialGradient(cx-radius*.5,cy-radius*.5,0,cx,cy,radius);ocean.addColorStop(0,'#123e73');ocean.addColorStop(.7,'#0a2246');ocean.addColorStop(1,'#07172f');ctx.fillStyle=ocean;ctx.beginPath();ctx.arc(cx,cy,radius,0,Math.PI*2);ctx.fill();
      ctx.lineWidth=1;ctx.strokeStyle='rgba(70,162,255,.22)';ctx.stroke();
      const projected=dots.filter((_,i)=>width>=450||i%2===0).map(project);
      for(let band=0;band<4;band++){ctx.fillStyle=`rgba(99,192,230,${.24+band*.17})`;ctx.beginPath();for(const [x,y,z] of projected){if(z<0||Math.min(3,Math.floor(z*4))!==band)continue;const px=cx+x*radius,py=cy+y*radius,r=(width<450?.9:1.05)*(0.7+z*.4);ctx.moveTo(px+r,py);ctx.arc(px,py,r,0,Math.PI*2);}ctx.fill();}
      // The hidden hemisphere remains clipped; flight arcs are projected in 3D.
      routes.forEach((route,index)=>{
        const selected=index===activeRef.current;ctx.lineWidth=selected?1.9:1;ctx.strokeStyle=selected?'rgba(65,232,236,.85)':'rgba(74,146,219,.3)';
        let drawing=false;ctx.beginPath();
        route.forEach(point=>{const [x,y,z]=project(point);if(z<-.02){drawing=false;return;}if(!drawing){ctx.moveTo(cx+x*radius,cy+y*radius);drawing=true;}else ctx.lineTo(cx+x*radius,cy+y*radius);});ctx.stroke();
        const phase=(reduced || pauseRef.current) ? 0.65 : (time*.00014+index*.15)%1;
        const [x,y,z]=project(route[Math.floor(phase*69)]);if(z>0){ctx.fillStyle=selected?'#b1ffff':'#3185ff';ctx.shadowColor='#28d7e5';ctx.shadowBlur=selected?15:5;ctx.beginPath();ctx.arc(cx+x*radius,cy+y*radius,selected?3:1.8,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}
        const [ex,ey,ez]=project(vector(destinations[index].lat,destinations[index].lon));if(ez>0){ctx.fillStyle=selected?'#8affef':'#5d8cc1';ctx.beginPath();ctx.arc(cx+ex*radius,cy+ey*radius,selected?4:2.6,0,Math.PI*2);ctx.fill();if(selected){ctx.font=`600 ${Math.max(11,width*.022)}px Arial`;ctx.fillStyle='#c5efff';ctx.fillText(destinations[index].name,cx+ex*radius+9,cy+ey*radius-9);}}
      });
      const [x,y,z]=project(origin);if(z>0){ctx.fillStyle='#7dffed';ctx.shadowColor='#28d7e5';ctx.shadowBlur=18;ctx.beginPath();ctx.arc(cx+x*radius,cy+y*radius,4,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.font=`700 ${Math.max(11,width*.023)}px Arial`;ctx.fillStyle='#d6ffff';ctx.fillText('VIỆT NAM',cx+x*radius+12,cy+y*radius+5);}
      ctx.strokeStyle='rgba(60,140,215,.12)';ctx.beginPath();ctx.ellipse(cx,cy,radius*1.35,radius*.32,-.3,0,Math.PI*2);ctx.stroke();
      canvas.dataset.frame=String(Math.floor(time));
      if(moving)raf=requestAnimationFrame(draw);
    };
    const start=()=>{cancelAnimationFrame(raf);draw(performance.now());};
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;start();},{rootMargin:'100px'});observer.observe(canvas);
    const ro=new ResizeObserver(()=>{resize();start();});ro.observe(canvas);
    const pointer=(e:PointerEvent)=>{if(reduced||e.pointerType==='touch')return;const b=canvas.getBoundingClientRect();pointerX=(e.clientX-b.left)/b.width-.5;pointerY=(e.clientY-b.top)/b.height-.5;if(pauseRef.current)start();};
    const changeMotion=()=>{reduced=media.matches;start();};
    const redraw=()=>start();
    canvas.addEventListener('pointermove',pointer);media.addEventListener('change',changeMotion);document.addEventListener('visibilitychange',redraw);canvas.addEventListener('globe-update',redraw);
    resize();start();
    return ()=>{cancelAnimationFrame(raf);observer.disconnect();ro.disconnect();canvas.removeEventListener('pointermove',pointer);media.removeEventListener('change',changeMotion);document.removeEventListener('visibilitychange',redraw);canvas.removeEventListener('globe-update',redraw);};
  },[]);

  return <div className="ez-globe">
    <div className="ez-globe-surface"><canvas ref={canvasRef} aria-label="Địa cầu ba chiều minh hoạ các tuyến từ Việt Nam" role="img"/>{fallback&&<div className="ez-globe-fallback">VIỆT NAM → MỸ · CANADA · ÚC · NEW ZEALAND · ANH · CHÂU ÂU</div>}<span className="ez-globe-coordinate">10.8° N / 106.7° E<br/><b>HO CHI MINH CITY</b></span></div>
    <div className="ez-globe-controls" aria-label="Chọn điểm đến trên địa cầu">{destinations.map((d,i)=><button type="button" key={d.code} aria-pressed={active===i} onClick={()=>{activeRef.current=i;const end=vector(d.lat,d.lon);viewRef.current=-Math.atan2(origin[0]+end[0],origin[2]+end[2]);setActive(i);canvasRef.current?.dispatchEvent(new Event('globe-update'));}}>{d.flag} {d.name}</button>)}<button className="ez-globe-pause" type="button" aria-pressed={paused} onClick={()=>{pauseRef.current=!paused;setPaused(!paused);canvasRef.current?.dispatchEvent(new Event('globe-update'));}}>{paused?'Tiếp tục':'Dừng chuyển động'}</button></div>
    <p className="ez-globe-caption">Minh hoạ mạng lưới điểm đến. Khả năng nhận hàng được xác nhận theo từng tuyến.</p>
  </div>;
}
