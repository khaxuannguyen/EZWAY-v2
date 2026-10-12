import { toPublicTracking } from '../../../lib/public-tracking';
import { createMockKsnResponse, normalizeKsnResponse } from '../../../lib/ksn-tracking';
import type { NormalizedTracking } from '../../../lib/ksn-tracking';
import { normalizeNamDeHtml } from '../../../lib/nam-de-tracking';
import { lookupZat } from '../../../lib/zat-tracking';
import {createRateLimiter,trackingClientKey,validTrackingCode,readBoundedText,securityHeaders,fetchTrustedPartner} from '../../../lib/public-security';

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;
// Live KSN lookups can take 20–46 seconds; keep a bounded deadline that
// accommodates the partner's response rather than aborting at 12 seconds.
const KSN_TIMEOUT_MS = 60_000;
const NAM_DE_TIMEOUT_MS = 9_000;
const NAM_DE_MAX_HTML_BYTES = 300_000;
const limiter = createRateLimiter(MAX_REQUESTS, WINDOW_MS);
const namDeCache = new Map<string, { expiresAt: number; tracking: NormalizedTracking | null }>();

type LookupResult =
  | { kind: 'found'; tracking: NormalizedTracking }
  | { kind: 'not-found' }
  | { kind: 'unavailable' };

function json(body: unknown, status = 200, extraHeaders: Record<string, string> = {}) {
  return Response.json(body, {
    status,
    headers: {
      ...securityHeaders,
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex, nofollow, noarchive',
      'X-Content-Type-Options': 'nosniff',
      ...extraHeaders,
    },
  });
}

function isNotFoundResponse(payload: unknown) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return false;
  const record = payload as Record<string, unknown>;
  const message = [record.message, record.error]
    .find((value): value is string => typeof value === 'string')
    ?.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  return Boolean(
    message &&
      (message.includes('khong ton tai') ||
        message.includes('khong tim thay') ||
        message.includes('not found')),
  );
}

async function lookupKsn(code: string, apiKey: string | undefined): Promise<LookupResult> {
  if (process.env.NODE_ENV !== 'production' && process.env.KSN_TRACKING_MOCK === 'true') {
    await new Promise((resolve) => setTimeout(resolve, 350));
    if (code.toUpperCase() === 'NOTFOUND') return { kind: 'not-found' };
    if (code.toUpperCase() === 'NETWORKERROR') return { kind: 'unavailable' };
    const tracking = normalizeKsnResponse(createMockKsnResponse(code), code);
    return tracking ? { kind: 'found', tracking } : { kind: 'not-found' };
  }

  if (!apiKey) return { kind: 'unavailable' };

  try {
    const upstreamUrl = new URL('https://kango-post.com/api/get-tracking');
    upstreamUrl.searchParams.set('code', code);
    const response = await fetchTrustedPartner(upstreamUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      signal: AbortSignal.timeout(KSN_TIMEOUT_MS),
    });

    const responseText = await readBoundedText(response);
    let parsedResponse: unknown;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch {
      parsedResponse = null;
    }

    if (response.status === 404 || isNotFoundResponse(parsedResponse)) return { kind: 'not-found' };
    if (!response.ok || parsedResponse === null) return { kind: 'unavailable' };

    const tracking = normalizeKsnResponse(parsedResponse, code);
    return tracking ? { kind: 'found', tracking } : { kind: 'not-found' };
  } catch {
    return { kind: 'unavailable' };
  }
}

async function lookupNamDe(code: string): Promise<LookupResult> {
  if (!/^\d{10}$/.test(code)) return { kind: 'not-found' };

  const cached = namDeCache.get(code);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.tracking
      ? { kind: 'found', tracking: cached.tracking }
      : { kind: 'not-found' };
  }

  try {
    const upstreamUrl = new URL('https://global-tracking.info/');
    upstreamUrl.searchParams.set('order-code', code);
    const response = await fetchTrustedPartner(upstreamUrl, {
      method: 'GET',
      headers: {
        Accept: 'text/html,application/xhtml+xml',
        'User-Agent': 'EZWAY-Tracking/1.0 (+https://ezway.vn)',
      },
      signal: AbortSignal.timeout(NAM_DE_TIMEOUT_MS),
    });
    if (!response.ok) return { kind: 'unavailable' };

    const contentLength = Number(response.headers.get('content-length') ?? 0);
    if (contentLength > NAM_DE_MAX_HTML_BYTES) return { kind: 'unavailable' };

    const html = await readBoundedText(response, NAM_DE_MAX_HTML_BYTES);
    if (new TextEncoder().encode(html).byteLength > NAM_DE_MAX_HTML_BYTES) {
      return { kind: 'unavailable' };
    }

    const tracking = normalizeNamDeHtml(html, code, upstreamUrl.toString());
    const delivered = tracking?.latestStatus.toLowerCase().includes('delivered') ?? false;
    if (namDeCache.size >= 300) namDeCache.delete(namDeCache.keys().next().value!);
    namDeCache.set(code, {
      tracking,
      expiresAt: Date.now() + (tracking ? (delivered ? 12 * 60 * 60_000 : 5 * 60_000) : 60_000),
    });
    return tracking ? { kind: 'found', tracking } : { kind: 'not-found' };
  } catch {
    return { kind: 'unavailable' };
  }
}

export async function GET(request: Request) {
  const rateLimit = limiter.consume(trackingClientKey(request));
  if (!rateLimit.allowed) {
    return json(
      { error: 'RATE_LIMITED' },
      429,
      { 'Retry-After': String(rateLimit.retryAfter) },
    );
  }

  const code = new URL(request.url).searchParams.get('code')?.trim() ?? '';
  if (!validTrackingCode(code)) {
    return json({ error: 'INVALID_TRACKING_CODE' }, 400);
  }

  let ksn: LookupResult;
  let namDe: LookupResult;

  if (/^ZVN\d+$/i.test(code)) {
    const zat = await lookupZat(code);
    if (zat.kind === 'found') return json({ tracking: toPublicTracking(zat.tracking, 'zat') });
    return zat.kind === 'not-found'
      ? json({ found: false }, 404)
      : json({ error: 'UPSTREAM_UNAVAILABLE' }, 502);
  }

  if (/^\d{10}$/.test(code)) {
    namDe = await lookupNamDe(code);
    if (namDe.kind === 'found') return json({ tracking: toPublicTracking(namDe.tracking, 'nam-de') });
    ksn = await lookupKsn(code, process.env.KSN_TRACKING_API_KEY);
    if (ksn.kind === 'found') return json({ tracking: toPublicTracking(ksn.tracking, 'ksn') });
  } else {
    ksn = await lookupKsn(code, process.env.KSN_TRACKING_API_KEY);
    if (ksn.kind === 'found') return json({ tracking: toPublicTracking(ksn.tracking, 'ksn') });
    namDe = { kind: 'not-found' };
  }

  if (ksn.kind === 'not-found' && namDe.kind === 'not-found') {
    return json({ found: false }, 404);
  }
  return json({ error: 'UPSTREAM_UNAVAILABLE' }, 502);
}
