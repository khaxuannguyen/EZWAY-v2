'use client';

import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { FreightStoryStage } from './freight-story-stage';
import { FREIGHT_VISUALS } from './freight-assets';
import { FREIGHT_STORIES, STORY_MOTION, type FreightMode } from './story-config';

function FreightStorySection({ mode }: { mode: FreightMode }) {
  const rootRef = useRef<HTMLElement>(null);
  const story = FREIGHT_STORIES[mode];
  const visual = FREIGHT_VISUALS[mode];
  useEffect(() => {
    const root = rootRef.current;
    // A still poster cannot truthfully depict a twelve-action mechanical story.
    // Keep normal scrolling until an approved coherent render sequence exists.
    if (!root || !visual.sequence?.approved) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let disposed = false, nearby = false, loading = false;
    let media: ReturnType<(typeof import('gsap'))['gsap']['matchMedia']> | undefined;
    const loadMotion = async () => {
      if (disposed || loading || media || !nearby || reduced.matches) return;
      loading = true;
      try {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([
          import('gsap'), import('gsap/ScrollTrigger'),
        ]);
        if (disposed) return;
        gsap.registerPlugin(ScrollTrigger);
        media = gsap.matchMedia();
        media.add({ desktop: '(min-width: 1024px)', tablet: '(min-width: 768px) and (max-width: 1023px)', mobile: '(max-width: 767px)', reduced: '(prefers-reduced-motion: reduce)' }, context => {
          if (context.conditions?.reduced) return;
          const mobile = !!context.conditions?.mobile;
          const process = root.querySelector<HTMLDetailsElement>('.freight-process')!;
          const wasOpen = process.open;
          if (mobile) process.open = true;
          const panel = root.querySelector<HTMLElement>('.freight-story-panel')!;
          const fill = root.querySelector<HTMLElement>('.freight-progress-fill')!;
          const phaseItems = [...root.querySelectorAll<HTMLElement>('.freight-phase')];
          let current = -1;
          root.dataset.animated = 'true';
          const timeline = gsap.timeline({ defaults: { ease: 'power2.inOut' }, onUpdate() {
            const progress = this.progress();
            fill.style.transform = `scaleX(${progress})`;
            const stage = root.querySelector<HTMLElement>('.freight-story-stage')!;
            stage.dataset.progress = String(progress);
            stage.dispatchEvent(new CustomEvent('freight-progress', { detail: progress }));
            const phase = Math.min(5, Math.floor(progress * 6));
            if (phase !== current) {
              current = phase;
              root.dataset.phase = String(phase);
              phaseItems.forEach((item, i) => { if (i === phase) item.setAttribute('aria-current', 'step'); else item.removeAttribute('aria-current'); });
              root.querySelector<HTMLElement>('.freight-phase-caption')!.textContent = story.phases[phase][0];
              root.querySelector<HTMLElement>('.freight-phase-description')!.textContent = story.phases[phase][1];
              root.querySelector<HTMLElement>('.freight-phase-count')!.textContent = `0${phase + 1} / 06`;
            }
          }, scrollTrigger: {
            id: `ezway-${mode}-story`, trigger: mobile ? root.querySelector('.freight-phases')! : root, pin: mobile ? false : panel,
            start: mobile ? 'top 80%' : 'top 80px',
            end: mobile ? 'bottom 70%' : () => `+=${Math.round(window.innerHeight * (context.conditions?.desktop ? STORY_MOTION.desktopScroll : STORY_MOTION.tabletScroll))}`,
            scrub: STORY_MOTION.scrub, anticipatePin: 1, invalidateOnRefresh: true,
          } });
          const clock = { progress: 0 };
          for (let index = 0; index < 6; index++) timeline.addLabel(`${mode}-${index + 1}`, index);
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
            root.querySelector<HTMLElement>('.freight-phase-caption')!.textContent = story.phases[0][0];
            root.querySelector<HTMLElement>('.freight-phase-description')!.textContent = story.phases[0][1];
            root.querySelector<HTMLElement>('.freight-phase-count')!.textContent = '01 / 06';
          };
        }, root);
      } catch {
        // Photorealistic poster, phase descriptions and CTAs remain usable.
        root.dataset.animated = 'false';
      }
    };
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { nearby = true; observer.disconnect(); void loadMotion(); }
    }, { rootMargin: STORY_MOTION.preloadMargin });
    observer.observe(root);
    const onPreferenceChange = () => { void loadMotion(); };
    reduced.addEventListener('change', onPreferenceChange);
    return () => { disposed = true; observer.disconnect(); reduced.removeEventListener('change', onPreferenceChange); media?.revert(); };
  }, [mode, story, visual]);

  return <section ref={rootRef} className={`freight-story freight-story-${mode}`} id={`${mode}-freight-story`} aria-labelledby={`${mode}-story-title`} data-animated="false" data-render-status={visual.status}>
    <div className="freight-story-panel">
      <div className="ez-container">
        <div className="freight-story-heading"><div><p className="ez-kicker">{mode === 'sea' ? '03.1' : '03.2'} / {story.eyebrow}</p><h2 id={`${mode}-story-title`}>{story.headline}</h2></div><div><p>{story.description}</p><ul className="freight-features">{story.features.map(feature => <li key={feature}>{feature}</li>)}</ul></div></div>
        <FreightStoryStage mode={mode} title={story.phases[0][0]} description={story.phases[0][1]}/>
        <div className="freight-progress" aria-hidden="true"><span className="freight-progress-fill"/>{story.phases.map((_, index) => <i key={index} style={{ left: `${index * 20}%` }}/>)}</div>
        <details className="freight-process"><summary>Khám phá 6 bước {story.eyebrow} <span>↓</span></summary><ol className="freight-phases" aria-label={`Sáu bước ${story.eyebrow}`}>{story.phases.map(([title, copy], index) => <li className="freight-phase" key={title}><span className="freight-phase-number">0{index + 1}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol></details>
        <div className="freight-story-finish"><p>{story.final}</p><div className="ez-actions">{story.ctas.map(([label, href], i) => <a className={`ez-button${i ? ' ez-button-outline' : ''}`} href={href} key={href}>{label}<ArrowUpRight size={17}/></a>)}</div></div>
        <p className="freight-static-note">Hình minh hoạ AI. Phương án và lịch khai thác thực tế được xác nhận theo lô hàng.</p>
      </div>
    </div>
  </section>;
}

export function SeaFreightStorySection() { return <FreightStorySection mode="sea"/>; }
export function AirFreightStorySection() { return <FreightStorySection mode="air"/>; }
