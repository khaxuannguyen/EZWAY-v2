'use client';

import { useEffect, useRef } from 'react';
import { FrameCache, frameAtStoryProgress, frameUrl, nearbyFrames, type FrameSequence } from './frame-sequence';

export function FrameSequenceCanvas({ sequence }: { sequence: FrameSequence }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.closest<HTMLDivElement>('.freight-story-stage');
    if (!canvas || !parent || !sequence.approved) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = window.matchMedia('(max-width: 767px)');
    let cleanup: (() => void) | undefined;
    const activate = () => {
      cleanup?.(); cleanup = undefined;
      parent.dataset.frames = 'false';
      if (reduced.matches) return;
      const context = canvas.getContext('2d', { alpha: false });
      if (!context) return;
      const variant = mobile.matches ? sequence.mobile : sequence.desktop;
      if (variant.width * variant.height > 1_440_000) return;
      let current = frameAtStoryProgress(Number(parent.dataset.progress ?? 0), sequence), previous = current, drawn = -1, raf = 0, disposed = false;
      const render = () => {
        raf = 0;
        const image = cache.get(current);
        // Do not show an unrelated stale frame during a fast seek or missing asset.
        if (!image) { parent.dataset.frames = 'false'; return; }
        if (drawn === current) { parent.dataset.frames = 'true'; return; }
        const box = canvas.getBoundingClientRect();
        if (!box.width || !box.height) return;
        const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
        const targetWidth = Math.round(box.width * ratio), targetHeight = Math.round(box.height * ratio);
        if (canvas.width !== targetWidth || canvas.height !== targetHeight) { canvas.width = targetWidth; canvas.height = targetHeight; }
        const scale = Math.max(canvas.width / image.width, canvas.height / image.height);
        const width = image.width * scale, height = image.height * scale;
        context.drawImage(image, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
        drawn = current; parent.dataset.frames = 'true';
      };
      const schedule = () => { if (!disposed && !raf) raf = requestAnimationFrame(render); };
      const cache = new FrameCache<ImageBitmap>(async (index, signal) => {
        const response = await fetch(frameUrl(variant, index), { signal: AbortSignal.any([signal, AbortSignal.timeout(8000)]), credentials: 'same-origin' });
        if (!response.ok) throw new Error('Frame unavailable');
        const blob = await response.blob();
        if (blob.size > 512_000) throw new Error('Frame exceeds delivery budget');
        const image = await createImageBitmap(blob);
        if (image.width !== variant.width || image.height !== variant.height) { image.close(); throw new Error('Invalid frame dimensions'); }
        return image;
      }, index => { if (index === current) schedule(); });
      const onProgress = (event: Event) => {
        const progress = (event as CustomEvent<number>).detail;
        previous = current; current = frameAtStoryProgress(progress, sequence);
        cache.request(nearbyFrames(current, sequence.count, current - previous)); schedule();
      };
      const resize = new ResizeObserver(() => { drawn = -1; schedule(); });
      const observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) { cache.request(nearbyFrames(current, sequence.count, 1)); observer.disconnect(); }
      }, { rootMargin: '600px' });
      observer.observe(parent); resize.observe(canvas); parent.addEventListener('freight-progress', onProgress);
      cleanup = () => { disposed = true; cancelAnimationFrame(raf); cache.dispose(); resize.disconnect(); observer.disconnect(); parent.removeEventListener('freight-progress', onProgress); parent.dataset.frames = 'false'; };
    };
    activate(); reduced.addEventListener('change', activate); mobile.addEventListener('change', activate);
    return () => { cleanup?.(); reduced.removeEventListener('change', activate); mobile.removeEventListener('change', activate); };
  }, [sequence]);
  return <canvas ref={canvasRef} className="freight-frame-canvas" aria-hidden="true"/>;
}
