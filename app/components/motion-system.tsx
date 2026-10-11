'use client';
import { useEffect } from 'react';
export function MotionSystem(){
  useEffect(()=>{
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
    let observer:IntersectionObserver|undefined,raf=0;
    const reveal=()=>{
      observer?.disconnect();
      const elements=document.querySelectorAll<HTMLElement>('.ez-reveal, .info-section, .info-service-card, .info-article-card');
      if(reduced.matches){elements.forEach(el=>el.classList.add('is-visible'));return;}
      observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer?.unobserve(e.target);}}),{threshold:.08});
      elements.forEach(el=>{el.classList.add('motion-ready');observer?.observe(el);});
    };
    const onScroll=()=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;const scroll=document.documentElement;const progress=window.scrollY/Math.max(1,scroll.scrollHeight-window.innerHeight);document.documentElement.style.setProperty('--page-progress',String(progress));
      const process=document.querySelector<HTMLElement>('.ez-process');if(process){const rect=process.getBoundingClientRect();const p=Math.max(0,Math.min(.999,(window.innerHeight*.55-rect.top)/Math.max(1,rect.height-window.innerHeight*.45)));process.dataset.step=String(Math.floor(p*5));}
    });};
    const magnet=(event:PointerEvent)=>{if(reduced.matches||event.pointerType==='touch')return;const button=(event.target as HTMLElement).closest<HTMLElement>('[data-magnetic]');if(!button)return;const rect=button.getBoundingClientRect();button.style.setProperty('--mx',`${(event.clientX-rect.left-rect.width/2)*.07}px`);button.style.setProperty('--my',`${(event.clientY-rect.top-rect.height/2)*.1}px`);};
    const reset=(event:PointerEvent)=>{const button=(event.target as HTMLElement).closest<HTMLElement>('[data-magnetic]');if(button){button.style.setProperty('--mx','0px');button.style.setProperty('--my','0px');}};
    reveal();onScroll();window.addEventListener('scroll',onScroll,{passive:true});reduced.addEventListener('change',reveal);document.addEventListener('pointermove',magnet);document.addEventListener('pointerout',reset);
    return()=>{observer?.disconnect();cancelAnimationFrame(raf);window.removeEventListener('scroll',onScroll);reduced.removeEventListener('change',reveal);document.removeEventListener('pointermove',magnet);document.removeEventListener('pointerout',reset);};
  },[]);return <div className="ez-reading-progress" aria-hidden="true"/>;
}
