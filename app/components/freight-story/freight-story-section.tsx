'use client';

import { reportAnimationFailure,syncRefreshedMotion } from '../../../lib/animation-diagnostics';
import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { FreightStoryStage } from './freight-story-stage';
import { FREIGHT_VISUALS } from './freight-assets';
import { FREIGHT_STORIES, STORY_MOTION, type FreightMode } from './story-config';
import { SEA_PHASE_BOUNDARIES } from './sea-shipping-motion';
import { AIR_PHASE_BOUNDARIES } from './air-freight-motion';

function FreightStorySection({ mode }: { mode: FreightMode }) {
  const rootRef = useRef<HTMLElement>(null);
  const story = FREIGHT_STORIES[mode];
  const visual = FREIGHT_VISUALS[mode];
  const rigged = mode === 'sea' || visual.status === 'air-rig';
  const boundaries = mode === 'sea' ? SEA_PHASE_BOUNDARIES : AIR_PHASE_BOUNDARIES;
  const captions = story.phases;
  useEffect(() => {
    const root = rootRef.current;
    if (!root || (!rigged && !visual.sequence?.approved)) return;
    const stage = root.querySelector<HTMLElement>('.freight-story-stage')!;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let disposed = false, nearby = false, loading = false;
    const status = (state: string, text: string) => {
      root.dataset.motionState = state;
      root.querySelector<HTMLElement>('.freight-motion-status')!.textContent = text;
      root.querySelector<HTMLButtonElement>('.freight-motion-retry')!.hidden = state !== 'error';
    };
    const preference = () => {
      root.dataset.motionPreference = reduced.matches ? 'reduce' : 'normal';
      if (reduced.matches) status('system-reduced', 'Đang giảm chuyển động theo cài đặt thiết bị. Xem các bước hành trình bên dưới.');
    };
    preference();
    let media: ReturnType<(typeof import('gsap'))['gsap']['matchMedia']> | undefined;
    const loadMotion = async () => {
      if (disposed || loading || media || !nearby || reduced.matches || (rigged && stage.dataset.rigReady !== 'true')) return;
      loading = true;status('initializing', 'Đang chuẩn bị chuyển động…');let phase='gsap-import';
      try {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([
          import('gsap'), import('gsap/ScrollTrigger'),
        ]);
        if (disposed) return;
        phase='scrolltrigger-init';gsap.registerPlugin(ScrollTrigger);
        media = gsap.matchMedia();
        media.add({ desktop: '(min-width: 1024px)', tablet: '(min-width: 768px) and (max-width: 1023px)', mobile: '(max-width: 767px)', reduced: '(prefers-reduced-motion: reduce)' }, context => {
          if (context.conditions?.reduced) {preference();return;}
          const mobile = !!context.conditions?.mobile;
          const process = root.querySelector<HTMLDetailsElement>('.freight-process')!;
          const wasOpen = process.open;
          if (mobile && !rigged) process.open = true;
          const panel = root.querySelector<HTMLElement>('.freight-story-panel')!;
          const fill = root.querySelector<HTMLElement>('.freight-progress-fill')!;
          const phaseItems = [...root.querySelectorAll<HTMLElement>('.freight-phase')];
          let current = -1;
          root.dataset.animated = 'true';delete root.dataset.motionError;status('ready', 'Cuộn để điều khiển hành trình.');
          const renderProgress = (progress:number) => {
            root.dataset.motionUpdates=String(Number(root.dataset.motionUpdates||0)+1);
            fill.style.transform = `scaleX(${progress})`;
            const stage = root.querySelector<HTMLElement>('.freight-story-stage')!;
            stage.dataset.progress = String(progress);
            stage.dispatchEvent(new CustomEvent('freight-progress', { detail: progress }));
            const phase = rigged ? boundaries.filter(boundary => progress >= boundary).length : Math.min(5, Math.floor(progress * 6));
            if (phase !== current) {
              current = phase;
              root.dataset.phase = String(phase);
              phaseItems.forEach((item, i) => { if (i === phase) item.setAttribute('aria-current', 'step'); else item.removeAttribute('aria-current'); });
              root.querySelector<HTMLElement>('.freight-phase-caption')!.textContent = captions[phase][0];
              root.querySelector<HTMLElement>('.freight-phase-description')!.textContent = captions[phase][1];
              root.querySelector<HTMLElement>('.freight-phase-count')!.textContent = `0${phase + 1} / 06`;
            }
          };
          const timeline = gsap.timeline({ defaults: { ease: 'power2.inOut' }, onUpdate() {renderProgress(this.progress());}, scrollTrigger: {
            id: `ezway-${mode}-story`, trigger: rigged && mobile ? stage : mobile ? root.querySelector('.freight-phases')! : root, pin: rigged && mobile ? stage : mobile ? false : panel,
            start: mobile && !rigged ? 'top 80%' : 'top 80px',
            end: mobile && !rigged ? 'bottom 70%' : () => `+=${Math.round(window.innerHeight * (rigged ? (mode === 'sea' ? (mobile ? 4.6 : 5.8) : (mobile ? 4.2 : 5.0)) : context.conditions?.desktop ? STORY_MOTION.desktopScroll : STORY_MOTION.tabletScroll))}`,
            // Short catch-up smooths discrete wheel events; every mechanical
            // part still uses the same timeline pose, including reverse seeks.
            onRefresh: self => {
              root.dataset.triggerStart=String(self.start);root.dataset.triggerEnd=String(self.end);
              // ScrollTrigger restores scrubbed timelines with suppressEvents=true.
              // Our photographic parts are driven by a custom event, so explicitly
              // publish the restored pose after every refresh (including late AIR init).
              const progress=syncRefreshedMotion(self.animation,self.progress,renderProgress);
              root.dataset.timelineProgress=String(progress);
            },
            scrub: rigged ? .22 : STORY_MOTION.scrub, anticipatePin: 1, invalidateOnRefresh: true,
          } });
          const clock = { progress: 0 };
          for (let index = 0; index < 6; index++) timeline.addLabel(`${mode}-${index + 1}`, rigged ? (index ? boundaries[index - 1] * 6 : 0) : index);
          timeline.to(clock, { progress: 1, duration: 6, ease: 'none' }, 0);
          timeline.fromTo(root.querySelector('.freight-story-finish'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .6 }, 5.4);
          // Lazy imports can finish out of document order. Refresh upstream
          // pins first so the second story accounts for the first pin spacer.
          ScrollTrigger.sort();
          ScrollTrigger.refresh();
          return () => {
            root.dataset.animated = 'false';
            process.open = wasOpen;
            root.removeAttribute('data-phase');
            fill.style.removeProperty('transform');
            phaseItems.forEach(item => item.removeAttribute('aria-current'));
            stage.dataset.progress = '0';
            stage.dispatchEvent(new CustomEvent('freight-progress', { detail: 0 }));
            root.querySelector<HTMLElement>('.freight-phase-caption')!.textContent = captions[0][0];
            root.querySelector<HTMLElement>('.freight-phase-description')!.textContent = captions[0][1];
            root.querySelector<HTMLElement>('.freight-phase-count')!.textContent = '01 / 06';
          };
        }, root);
      } catch {
        media?.revert();media=undefined;
        root.dataset.animated = 'false';
        reportAnimationFailure(root, mode, phase);
        status('error', 'Chuyển động chưa tải được. Bạn vẫn có thể xem các bước hành trình hoặc thử lại.');
      } finally { loading = false; }
    };
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { nearby = true; observer.disconnect(); void loadMotion(); }
    }, { rootMargin: STORY_MOTION.preloadMargin });
    observer.observe(root);
    const onRigReady = () => { void loadMotion(); };
    stage.addEventListener('freight-rig-ready', onRigReady);
    const onPreferenceChange = () => { preference();void loadMotion(); };
    reduced.addEventListener('change', onPreferenceChange);
    const retry=()=>{void loadMotion();};const retryButton=root.querySelector<HTMLButtonElement>('.freight-motion-retry')!;retryButton.addEventListener('click',retry);
    return () => { disposed = true;retryButton.removeEventListener('click',retry); observer.disconnect(); stage.removeEventListener('freight-rig-ready', onRigReady); reduced.removeEventListener('change', onPreferenceChange); media?.revert(); };
  }, [mode, story, visual, rigged, captions, boundaries]);

  return <section ref={rootRef} className={`freight-story freight-story-${mode}`} id={`${mode}-freight-story`} aria-labelledby={`${mode}-story-title`} data-animated="false" data-render-status={visual.status}>
    <div className="freight-story-panel">
      <div className="ez-container">
        <div className="freight-story-heading"><div><p className="ez-kicker">{mode === 'sea' ? '03.1' : '03.2'} / {story.eyebrow}</p><h2 id={`${mode}-story-title`}>{story.headline}</h2></div><div><p>{story.description}</p><ul className="freight-features">{story.features.map(feature => <li key={feature}>{feature}</li>)}</ul></div></div>
        <FreightStoryStage mode={mode} title={captions[0][0]} description={captions[0][1]}/>
        <div className="freight-progress" aria-hidden="true"><span className="freight-progress-fill"/>{story.phases.map((_, index) => <i key={index} style={{ left: `${index * 20}%` }}/>)}</div>
        <p className="freight-static-note freight-motion-status" role="status">Chuyển động sẽ sẵn sàng khi hình tải xong.</p><button className="freight-motion-retry" type="button" hidden>Thử tải chuyển động lại</button>
        <details className="freight-process"><summary>Khám phá 6 bước {story.eyebrow} <span>↓</span></summary><ol className="freight-phases" aria-label={`Sáu bước ${story.eyebrow}`}>{story.phases.map(([title, copy], index) => <li className="freight-phase" key={title}><span className="freight-phase-number">0{index + 1}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol></details>
        <div className="freight-story-finish"><p>{story.final}</p><div className="ez-actions">{story.ctas.map(([label, href], i) => <a className={`ez-button${i ? ' ez-button-outline' : ''}`} href={href} key={href}>{label}<ArrowUpRight size={17}/></a>)}</div></div>
        <p className="freight-static-note">Hình minh hoạ AI. Phương án và lịch khai thác thực tế được xác nhận theo lô hàng.</p>
      </div>
    </div>
  </section>;
}

export function SeaFreightStorySection() { return <FreightStorySection mode="sea"/>; }
export function AirFreightStorySection() { return <FreightStorySection mode="air"/>; }
