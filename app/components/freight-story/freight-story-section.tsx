'use client';

import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { AirScene, SeaScene } from './story-assets';
import { FREIGHT_STORIES, STORY_MOTION, type FreightMode } from './story-config';

function FreightStorySection({ mode }: { mode: FreightMode }) {
  const rootRef = useRef<HTMLElement>(null);
  const story = FREIGHT_STORIES[mode];
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let disposed = false, nearby = false, loading = false;
    let media: ReturnType<(typeof import('gsap'))['gsap']['matchMedia']> | undefined;
    const loadMotion = async () => {
      if (disposed || loading || media || !nearby || reduced.matches) return;
      loading = true;
      try {
        const [{ gsap }, { ScrollTrigger }, { buildFreightTimeline }] = await Promise.all([
          import('gsap'), import('gsap/ScrollTrigger'), import('./story-timelines'),
        ]);
        if (disposed) return;
        gsap.registerPlugin(ScrollTrigger);
        media = gsap.matchMedia();
        media.add({ desktop: '(min-width: 1100px)', tablet: '(min-width: 900px) and (max-width: 1099px)', mobile: '(max-width: 899px)', reduced: '(prefers-reduced-motion: reduce)' }, context => {
          if (context.conditions?.reduced) return;
          const mobile = !!context.conditions?.mobile;
          const panel = root.querySelector<HTMLElement>('.freight-story-panel')!;
          const fill = root.querySelector<HTMLElement>('.freight-progress-fill')!;
          const phaseItems = [...root.querySelectorAll<HTMLElement>('.freight-phase')];
          let current = -1;
          root.dataset.animated = 'true';
          const timeline = gsap.timeline({ defaults: { ease: 'power2.inOut' }, onUpdate() {
            const progress = this.progress();
            fill.style.transform = `scaleX(${progress})`;
            const phase = Math.min(5, Math.floor(progress * 6));
            if (phase !== current) {
              current = phase;
              root.dataset.phase = String(phase);
              phaseItems.forEach((item, i) => { if (i === phase) item.setAttribute('aria-current', 'step'); else item.removeAttribute('aria-current'); });
              root.querySelector<HTMLElement>('.freight-phase-caption')!.textContent = story.phases[phase][0];
            }
          }, scrollTrigger: {
            id: `ezway-${mode}-story`, trigger: mobile ? root.querySelector('.freight-phases')! : root, pin: mobile ? false : panel,
            start: mobile ? 'top 80%' : 'top 80px',
            end: mobile ? 'bottom 70%' : () => `+=${Math.round(window.innerHeight * (context.conditions?.desktop ? STORY_MOTION.desktopScroll : STORY_MOTION.tabletScroll))}`,
            scrub: STORY_MOTION.scrub, anticipatePin: 1, invalidateOnRefresh: true,
          } });
          buildFreightTimeline(gsap, timeline, root, mode);
          // Lazy imports can finish out of document order. Refresh upstream
          // pins first so the second story accounts for the first pin spacer.
          ScrollTrigger.sort();
          ScrollTrigger.refresh();
          return () => {
            root.dataset.animated = 'false';
            root.removeAttribute('data-phase');
            fill.style.removeProperty('transform');
            phaseItems.forEach(item => item.removeAttribute('aria-current'));
            root.querySelector<HTMLElement>('.freight-phase-caption')!.textContent = 'Từ chuẩn bị đến khởi hành';
          };
        }, root);
      } catch {
        // Static vector scene, all phase descriptions and CTAs remain usable.
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
  }, [mode, story]);

  return <section ref={rootRef} className={`freight-story freight-story-${mode}`} id={`${mode}-freight-story`} aria-labelledby={`${mode}-story-title`} data-animated="false">
    <div className="freight-story-panel">
      <div className="ez-container">
        <div className="freight-story-heading"><div><p className="ez-kicker">{mode === 'sea' ? '03.1' : '03.2'} / {story.eyebrow}</p><h2 id={`${mode}-story-title`}>{story.headline}</h2></div><div><p>{story.description}</p><ul className="freight-features">{story.features.map(feature => <li key={feature}>{feature}</li>)}</ul></div></div>
        <div className="freight-story-stage"><div className="freight-scene-meta"><span>EZWAY / {mode === 'sea' ? 'OCEAN OPERATIONS' : 'AIR OPERATIONS'}</span><span className="freight-scroll-hint">CUỘN ĐỂ THEO DÕI ↓</span><svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><g data-part="clock"><path d="M10 1a9 9 0 1 1-9 9" fill="none" stroke="currentColor"/><path d="M10 4v6l4 2" fill="none" stroke="currentColor"/></g></svg></div>{mode === 'sea' ? <SeaScene/> : <AirScene/>}<div className="freight-scene-caption"><span className="freight-phase-caption">Từ chuẩn bị đến khởi hành</span><span>MINH HOẠ QUY TRÌNH</span></div></div>
        <div className="freight-progress" aria-hidden="true"><span className="freight-progress-fill"/></div>
        <ol className="freight-phases" aria-label={`Sáu bước ${story.eyebrow}`}>{story.phases.map(([title, copy], index) => <li className="freight-phase" key={title}><span className="freight-phase-number">0{index + 1}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol>
        <div className="freight-story-finish"><p>{story.final}</p><div className="ez-actions">{story.ctas.map(([label, href], i) => <a className={`ez-button${i ? ' ez-button-outline' : ''}`} href={href} key={href}>{label}<ArrowUpRight size={17}/></a>)}</div></div>
        <p className="freight-static-note">Quy trình minh hoạ. Thiết bị, phương án và lịch khai thác thực tế được xác nhận theo lô hàng.</p>
      </div>
    </div>
  </section>;
}

export function SeaFreightStorySection() { return <FreightStorySection mode="sea"/>; }
export function AirFreightStorySection() { return <FreightStorySection mode="air"/>; }
