import { createMockKsnResponse, normalizeKsnResponse } from '../../../lib/ksn-tracking';

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;
const UPSTREAM_TIMEOUT_MS = 12_000;
const requestBuckets = new Map<string, { count: number; resetAt: number }>();

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

  const apiKey = process.env.KSN_TRACKING_API_KEY;
  if (!apiKey) return json({ error: 'SERVICE_UNAVAILABLE' }, 503);

  try {
    let raw: unknown;
    if (process.env.NODE_ENV !== 'production' && process.env.KSN_TRACKING_MOCK === 'true') {
      await new Promise((resolve) => setTimeout(resolve, 350));
      if (code.toUpperCase() === 'NOTFOUND') return json({ found: false }, 404);
      if (code.toUpperCase() === 'NETWORKERROR') return json({ error: 'UPSTREAM_UNAVAILABLE' }, 502);
      raw = createMockKsnResponse(code);
    } else {
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

      if (response.status === 404 || isNotFoundResponse(parsedResponse)) {
        return json({ found: false }, 404);
      }
      if (!response.ok) return json({ error: 'UPSTREAM_UNAVAILABLE' }, 502);
      if (parsedResponse === null) return json({ error: 'UPSTREAM_UNAVAILABLE' }, 502);
      raw = parsedResponse;
    }

    const tracking = normalizeKsnResponse(raw, code);
    if (!tracking) return json({ found: false }, 404);
    return json({ tracking });
  } catch {
    return json({ error: 'UPSTREAM_UNAVAILABLE' }, 502);
  }
}
