export interface FrameVariant {
  template: string;
  width: number;
  height: number;
}
export interface FrameSequence {
  count: number;
  desktop: FrameVariant;
  mobile: FrameVariant;
  /** Must only be enabled after geometry, licensing and continuity QA. */
  approved: boolean;
  phaseRanges?: ReadonlyArray<readonly [number, number]>;
}
export const clampProgress = (value: number) => Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
export const frameAtProgress = (progress: number, count: number) => Math.floor(clampProgress(progress) * Math.max(0, count - 1));
export const frameUrl = (variant: FrameVariant, index: number) => variant.template.replace('{frame}', String(index).padStart(4, '0'));
export function frameAtStoryProgress(progress: number, sequence: FrameSequence) {
  if (!sequence.phaseRanges) return frameAtProgress(progress, sequence.count);
  const p = clampProgress(progress), phase = Math.min(5, Math.floor(p * 6));
  const [start, end] = sequence.phaseRanges[phase];
  return Math.min(sequence.count - 1, start + frameAtProgress(p * 6 - phase, end - start + 1));
}
export function nearbyFrames(index: number, count: number, direction: number) {
  const offsets = direction < 0 ? [0, -1, 1, -2, 2, -3] : [0, 1, -1, 2, -2, 3];
  return offsets.map(offset => index + offset).filter(value => value >= 0 && value < count);
}

/** Bounded LRU with a two-request limit. Superseded queues never fetch an entire story. */
export class FrameCache<T extends { close?: () => void }> {
  private values = new Map<number, T>();
  private queue: number[] = [];
  private inFlight = new Map<number, AbortController>();
  private failed = new Set<number>();
  private disposed = false;
  private load: (index: number, signal: AbortSignal) => Promise<T>;
  private ready: (index: number) => void;
  readonly capacity: number;
  constructor(load: (index: number, signal: AbortSignal) => Promise<T>, ready: (index: number) => void, capacity = 6) {
    this.load = load; this.ready = ready; this.capacity = capacity;
  }
  get(index: number) {
    const value = this.values.get(index);
    if (value) { this.values.delete(index); this.values.set(index, value); }
    return value;
  }
  request(indices: number[]) {
    if (this.disposed) return;
    this.queue = [...new Set(indices)].filter(index => !this.values.has(index) && !this.inFlight.has(index) && !this.failed.has(index));
    this.pump();
  }
  private pump() {
    while (!this.disposed && this.inFlight.size < 2 && this.queue.length) {
      const index = this.queue.shift()!;
      const controller = new AbortController();
      this.inFlight.set(index, controller);
      void this.load(index, controller.signal).then(value => {
        if (this.disposed) { value.close?.(); return; }
        this.values.set(index, value);
        while (this.values.size > this.capacity) {
          const oldest = this.values.keys().next().value!;
          this.values.get(oldest)?.close?.(); this.values.delete(oldest);
        }
        this.ready(index);
      }).catch(() => { if (!this.disposed) this.failed.add(index); }).finally(() => { this.inFlight.delete(index); this.pump(); });
    }
  }
  dispose() {
    this.disposed = true; this.queue = [];
    this.inFlight.forEach(controller => controller.abort());
    this.values.forEach(value => value.close?.()); this.values.clear();
  }
}
