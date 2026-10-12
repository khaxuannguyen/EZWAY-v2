export type MotionChoice = 'system' | 'play' | 'pause';
export type MotionState = 'playing' | 'system-reduced' | 'user-paused';

export function resolveMotion(reduced: boolean, choice: MotionChoice): MotionState {
  if (choice === 'pause') return 'user-paused';
  return reduced && choice !== 'play' ? 'system-reduced' : 'playing';
}

export function syncRefreshedMotion(animation: {progress():number} | undefined, fallback: number, publish: (progress:number)=>void) {
  const progress = animation?.progress() ?? fallback;
  publish(progress);
  return progress;
}

// Only fixed diagnostic codes: no exception messages, URLs, tokens or user data.
export function reportAnimationFailure(element: HTMLElement | null, component: 'globe' | 'sea' | 'air', code: string) {
  if (element?.dataset.motionError === code) return;
  if (element) element.dataset.motionError = code;
  console.warn(`[EZWAY animation] ${component}: ${code}`);
}
