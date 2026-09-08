import { createMockKsnResponse, normalizeKsnResponse } from '../../../lib/ksn-tracking';
import type { NormalizedTracking } from '../../../lib/ksn-tracking';
import { normalizeNamDeHtml } from '../../../lib/nam-de-tracking';

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;
const UPSTREAM_TIMEOUT_MS = 12_000;
const NAM_DE_TIMEOUT_MS = 9_000;
const NAM_DE_MAX_HTML_BYTES = 300_000;
const requestBuckets = new Map<string, { count: number; resetAt: number }>();
const namDeCache = new Map<string, { expiresAt: number; tracking: NormalizedTracking | null }>();

type LookupResult =
  | { kind: 'found'; tracking: NormalizedTracking }
  | { kind: 'not-found' }
  | { kind: 'unavailable' };

function json(body: unknown, status = 200, extraHeaders: Record<string, string> = {}) {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...extraHeaders,
    },
  });
}

function clientIdentifier(request: Request) {
  return (
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'anonymous'
  );
}

function consumeRateLimit(identifier: string) {
  const now = Date.now();
  const existing = requestBuckets.get(identifier);
  if (!existing || existing.resetAt <= now) {
    requestBuckets.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }
  if (existing.count >= MAX_REQUESTS) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)) };
  }
  existing.count += 1;
  return { allowed: true, retryAfter: 0 };
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
    const response = await fetch(upstreamUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });

    const responseText = await response.text();
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
    const response = await fetch(upstreamUrl, {
      method: 'GET',
      headers: {
        Accept: 'text/html,application/xhtml+xml',
        'User-Agent': 'EZWAY-Tracking/1.0 (+https://ezway.vn)',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(NAM_DE_TIMEOUT_MS),
    });
    if (!response.ok) return { kind: 'unavailable' };

    const contentLength = Number(response.headers.get('content-length') ?? 0);
    if (contentLength > NAM_DE_MAX_HTML_BYTES) return { kind: 'unavailable' };

    const html = await response.text();
    if (new TextEncoder().encode(html).byteLength > NAM_DE_MAX_HTML_BYTES) {
      return { kind: 'unavailable' };
    }

    const tracking = normalizeNamDeHtml(html, code, upstreamUrl.toString());
    const delivered = tracking?.latestStatus.toLowerCase().includes('delivered') ?? false;
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
  const rateLimit = consumeRateLimit(clientIdentifier(request));
  if (!rateLimit.allowed) {
    return json(
      { error: 'RATE_LIMITED' },
      429,
      { 'Retry-After': String(rateLimit.retryAfter) },
    );
  }

  const code = new URL(request.url).searchParams.get('code')?.trim() ?? '';
  if (!code || code.length > 120 || /[\u0000-\u001F\u007F]/.test(code)) {
    return json({ error: 'INVALID_TRACKING_CODE' }, 400);
  }

  let ksn: LookupResult;
  let namDe: LookupResult;

  if (/^\d{10}$/.test(code)) {
    namDe = await lookupNamDe(code);
    if (namDe.kind === 'found') return json({ tracking: namDe.tracking });
    ksn = await lookupKsn(code, process.env.KSN_TRACKING_API_KEY);
    if (ksn.kind === 'found') return json({ tracking: ksn.tracking });
  } else {
    ksn = await lookupKsn(code, process.env.KSN_TRACKING_API_KEY);
    if (ksn.kind === 'found') return json({ tracking: ksn.tracking });
    namDe = { kind: 'not-found' };
  }

  if (ksn.kind === 'not-found' && namDe.kind === 'not-found') {
    return json({ found: false }, 404);
  }
  return json({ error: 'UPSTREAM_UNAVAILABLE' }, 502);
}
