import type { gsap } from 'gsap';
import type { FreightMode } from './story-config';

type Timeline = gsap.core.Timeline;
type Gsap = typeof gsap;

export function buildFreightTimeline(gsap: Gsap, tl: Timeline, root: HTMLElement, mode: FreightMode) {
  const part = (name: string) => root.querySelector(`[data-part="${name}"]`)!;
  // Each labelled phase occupies exactly one timeline unit. All movement uses
  // transforms/opacity, so scrub is deterministic in either scroll direction.
  for (let phase = 0; phase < 6; phase++) tl.addLabel(`${mode}-${phase + 1}`, phase);
  tl.to(part('clock'), { duration: 6, rotation: 360, ease: 'none', transformOrigin: '50% 50%' }, 0);
  if (mode === 'sea') {
    gsap.set(part('truck'), { x: -650, opacity: 0 });
    gsap.set(part('ship'), { x: 330, opacity: 0 });
    gsap.set(part('hoist'), { y: -30 });
    gsap.set(part('cable'), { scaleY: 123 / 153, transformOrigin: '50% 0%' });
    tl.to(part('hoist'), { y: 0, duration: .3 }, 1)
      .to(part('cable'), { scaleY: 1, duration: .3 }, 1)
      .to([part('cargo'), part('hoist')], { y: -95, duration: .65 }, 1.3)
      .to(part('cable'), { scaleY: 58 / 153, duration: .65 }, 1.3)
      .to(part('cargo-shadow'), { scaleX: .65, opacity: .07, duration: .65, transformOrigin: '50% 50%' }, 1.3)
      .to(part('truck'), { x: 0, opacity: 1, duration: .45 }, 2)
      .to([part('cargo'), part('hoist'), part('cable')], { x: 260, duration: .5 }, 2)
      .to([part('cargo'), part('hoist')], { y: 2, duration: .35 }, 2.5)
      .to(part('cable'), { scaleY: 155 / 153, duration: .35 }, 2.5)
      .to(part('truck'), { y: 3, duration: .08, repeat: 1, yoyo: true }, 2.85)
      .to(part('hoist'), { y: -140, duration: .25 }, 2.85)
      .to(part('cable'), { scaleY: 13 / 153, duration: .25 }, 2.85)
      .to(part('cargo-shadow'), { opacity: 0, duration: .15 }, 3)
      .to([part('truck'), part('cargo')], { x: '+=150', duration: .9, ease: 'power1.inOut' }, 3)
      .to(part('yard'), { opacity: .15, duration: .6 }, 3)
      .to(part('ship'), { x: 0, opacity: 1, duration: .8 }, 3.2)
      .to(part('hoist'), { x: 410, y: 2, duration: .2 }, 4)
      .to(part('cable'), { x: 410, scaleY: 155 / 153, duration: .2 }, 4)
      .to([part('cargo'), part('hoist')], { y: -100, duration: .25 }, 4.2)
      .to(part('cable'), { scaleY: 53 / 153, duration: .25 }, 4.2)
      .to([part('cargo'), part('hoist'), part('cable')], { x: 610, duration: .3 }, 4.45)
      .to([part('cargo'), part('hoist')], { y: -68, duration: .2 }, 4.75)
      .to(part('cable'), { scaleY: 85 / 153, duration: .2 }, 4.75)
      .to(part('hoist'), { y: -140, opacity: 0, duration: .25 }, 4.95)
      .to(part('cable'), { scaleY: 13 / 153, opacity: 0, duration: .25 }, 4.95)
      .to(part('truck'), { x: -650, opacity: 0, duration: .7 }, 5)
      .to([part('ship'), part('cargo')], { x: '+=210', duration: 1, ease: 'power1.in' }, 5)
      .to(part('crane-frame'), { opacity: .35, duration: .8 }, 5);
  } else {
    gsap.set(part('sky'), { opacity: .15 });
    gsap.set(part('pallet'), { y: 40 });
    gsap.set([part('closed-door'), part('speed-lines')], { opacity: 0 });
    tl.to([part('loader'), part('pallet')], { x: 160, duration: .9 }, 1)
      .to(part('platform'), { y: -21, duration: .3 }, 2)
      .to(part('lift-scissors'), { scaleY: 3.1, duration: .3, transformOrigin: '50% 100%' }, 2)
      .to(part('pallet'), { y: 19, duration: .3 }, 2)
      .to(part('pallet'), { x: 192, scale: .7, duration: .4, transformOrigin: '50% 50%' }, 2.3)
      .to(part('pallet'), { opacity: 0, duration: .18 }, 2.55)
      .to(part('cargo-door'), { scaleY: 0, opacity: 0, duration: .3, transformOrigin: '50% 100%' }, 2.7)
      .to(part('closed-door'), { opacity: 1, duration: .2 }, 2.8)
      .to(part('loader'), { x: -260, opacity: 0, duration: .65 }, 3)
      .to(part('aircraft'), { x: -60, duration: .55 }, 3.3)
      .to(part('speed-lines'), { opacity: .8, duration: .5 }, 3.7)
      .to(part('aircraft'), { x: 130, duration: .8, ease: 'power2.in' }, 4)
      .to(part('runway'), { x: -100, duration: .8 }, 4)
      .to(part('aircraft'), { y: -65, rotation: -8, duration: .5, transformOrigin: '65% 65%' }, 4.5)
      .to(part('air-shadow'), { scaleX: .6, opacity: 0, duration: .6, transformOrigin: '50% 50%' }, 4.5)
      .to(part('landing-gear'), { scaleY: 0, duration: .35, transformOrigin: '50% 0%' }, 4.75)
      .to(part('aircraft'), { x: 360, y: -160, rotation: -12, duration: 1 }, 5)
      .to(part('sky'), { opacity: 1, duration: .9 }, 5)
      .to([part('runway'), part('speed-lines')], { opacity: 0, duration: .8 }, 5);
  }
  return tl;
}
