export type AuspostZone = [state: string, transit: string, description: string, air: string, frozen: string];
export type StandardZone = [suburb: string, state: string, transit: string, zone: string];
export type PriorityZone = [transit: string, zone: string, days: string];
export type ZoneData = { auspost: Record<string, AuspostZone>; standard: Record<string, StandardZone[]>; priority: Record<string, PriorityZone> };

// Postcodes are identifiers: never coerce to numbers or infer service coverage.
export function normalizePostcode(value: string): string | null {
  const clean = value.trim();
  return /^\d{4}$/.test(clean) ? clean : null;
}
export function findZones(data: ZoneData, postcode: string) {
  const pc = normalizePostcode(postcode);
  if (!pc) return null;
  const auspost = data.auspost[pc] ?? null;
  const standard = data.standard[pc] ?? [];
  const priority = data.priority[pc] ?? null;
  const states = [...new Set([...(auspost ? [auspost[0]] : []), ...standard.map(row => row[1])])].sort();
  return { postcode: pc, auspost, standard, priority, states, found: !!auspost || standard.length > 0 || !!priority };
}
export function isManualZone(zone: string) { return !/^[1-4]$/.test(zone); }
