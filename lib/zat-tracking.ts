import type { NormalizedTracking, RelatedOrder, TrackingEvent } from './ksn-tracking';

const TRACKING_URL = 'https://sys.zatexpress.vn/view/tracking/index1.php';
const MAX_HTML_BYTES = 300_000;
const MAX_CACHE_ENTRIES = 300;
const cache = new Map<string, { expiresAt: number; tracking: NormalizedTracking | null }>();

export type ZatLookupResult =
  | { kind: 'found'; tracking: NormalizedTracking }
  | { kind: 'not-found' }
  | { kind: 'unavailable' };

function text(value: string | undefined) {
  return value?.replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&').replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ').trim() || undefined;
}

export function normalizeZatHtml(html: string, queryCode: string): NormalizedTracking | null {
  // The partner includes an entire example timeline inside an HTML comment.
  const source = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '');
  const pageCode = text(/<h1\b[^>]*>\s*Tracking ID:\s*([\s\S]*?)<\/h1>/i.exec(source)?.[1]);
  if (pageCode?.toUpperCase() !== queryCode.toUpperCase()) return null;

  const fields = new Map<string, string>();
  for (const match of source.matchAll(/<span\b[^>]*class=["'][^"']*\btag\b[^"']*["'][^>]*>([\s\S]*?)<\/span>/gi)) {
    const value = text(match[1]);
    const separator = value?.indexOf(':') ?? -1;
    if (value && separator >= 0) fields.set(value.slice(0, separator).trim().toUpperCase(), value.slice(separator + 1).trim());
  }

  const timeline: TrackingEvent[] = [];
  const chunks = source.split(/<div\b[^>]*class=["'][^"']*\bvertical-timeline-element-content\b[^"']*["'][^>]*>/i).slice(1);
  for (const chunk of chunks) {
    const title = text(/<h4\b[^>]*class=["'][^"']*\btimeline-title\b[^"']*["'][^>]*>([\s\S]*?)<\/h4>/i.exec(chunk)?.[1]);
    const time = text(/<span\b[^>]*class=["'][^"']*\bvertical-timeline-element-date\b[^"']*["'][^>]*>([\s\S]*?)<\/span>/i.exec(chunk)?.[1]);
    const location = text(/<p\b[^>]*>([\s\S]*?)<\/p>/i.exec(chunk)?.[1]);
    if (title && time && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(time)) {
      timeline.push({ title, time, ...(location ? { location } : {}) });
    }
  }
  // ISO-shaped partner timestamps sort without changing their local timezone.
  timeline.sort((a, b) => b.time.localeCompare(a.time));

  const orderNumbers: RelatedOrder[] = [];
  const seen = new Set<string>();
  for (const match of source.matchAll(/<a\b[^>]*href=["']index\.php\?b=(\d+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const code = match[1];
    if (seen.has(code) || text(match[2]) !== code) continue;
    seen.add(code);
    orderNumbers.push({ hawb: code, trackingUrl: `https://sys.zatexpress.vn/view/tracking/index.php?b=${code}`, isCurrent: false });
  }
  const totalPackages = /TỔNG SỐ KIỆN:\s*(\d+)/i.exec(text(source) ?? '')?.[1];
  // An echoed query in a heading alone does not prove a shipment exists.
  if (!timeline.length && !orderNumbers.length && !fields.get('FROM') && !fields.get('TO')) return null;

  const origin = fields.get('FROM');
  const destination = fields.get('TO');
  return {
    queryCode,
    packageCode: pageCode,
    carrierCode: 'ZAT Express',
    country: destination || undefined,
    route: [origin, destination].filter(Boolean).join(' → ') || undefined,
    trackingUrl: `${TRACKING_URL}?b=${encodeURIComponent(pageCode!)}`,
    latestStatus: timeline[0]?.title ?? 'Đang cập nhật',
    service: fields.get('DỊCH VỤ') || undefined,
    totalPackages,
    timeline,
    orderNumbers,
  };
}

export async function lookupZat(code: string): Promise<ZatLookupResult> {
  code = code.toUpperCase();
  if (!/^ZVN\d+$/.test(code)) return { kind: 'not-found' };
  const cached = cache.get(code);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.tracking ? { kind: 'found', tracking: cached.tracking } : { kind: 'not-found' };
  }
  try {
    const url = new URL(TRACKING_URL);
    url.searchParams.set('b', code);
    const response = await fetch(url, {
      headers: { Accept: 'text/html', 'User-Agent': 'EZWAY-Tracking/1.0 (+https://ezway.vn)' },
      redirect: 'manual',
      signal: AbortSignal.timeout(25_000),
    });
    if (!response.ok || !response.body) return { kind: 'unavailable' };
    if (Number(response.headers.get('content-length') ?? 0) > MAX_HTML_BYTES) {
      await response.body.cancel();
      return { kind: 'unavailable' };
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let html = '';
    let bytes = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_HTML_BYTES) {
        await reader.cancel();
        return { kind: 'unavailable' };
      }
      html += decoder.decode(value, { stream: true });
    }
    html += decoder.decode();
    const notFound = /(?:không\s+tìm\s+thấy|không\s+tồn\s+tại)\s+(?:mã\s+)?vận\s+đơn/i.test(text(html) ?? '');
    const tracking = notFound ? null : normalizeZatHtml(html, code);
    // Login pages and changed HTML are connection errors, not missing shipments.
    if (!tracking && !notFound) return { kind: 'unavailable' };
    for (const [key, entry] of cache) if (entry.expiresAt <= Date.now()) cache.delete(key);
    if (cache.size >= MAX_CACHE_ENTRIES) cache.delete(cache.keys().next().value!);
    cache.set(code, { tracking, expiresAt: Date.now() + (tracking ? 5 * 60_000 : 60_000) });
    return tracking ? { kind: 'found', tracking } : { kind: 'not-found' };
  } catch (error) {
    console.warn('ZAT tracking upstream unavailable:', error instanceof Error ? error.message : 'Unknown error');
    return { kind: 'unavailable' };
  }
}
