export const rigClamp = (p: number) => Number.isFinite(p) ? Math.max(0, Math.min(1, p)) : 0;
export const rigMix = (a: number, b: number, t: number) => a + (b - a) * t;
export function rigStep(p: number, start: number, end: number) {
  const t = rigClamp((p - start) / (end - start));
  return t * t * (3 - 2 * t);
}
