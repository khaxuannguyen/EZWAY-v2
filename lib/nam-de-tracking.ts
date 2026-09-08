import type { NormalizedTracking, TrackingEvent } from './ksn-tracking';

const MONTHS: Record<string, string> = {
  january: '01',
  february: '02',
  march: '03',
  april: '04',
  may: '05',
  june: '06',
  july: '07',
  august: '08',
  september: '09',
  october: '10',
  november: '11',
  december: '12',
};

function decodeHtml(value: string) {
  return value
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code: string) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
}

function cleanText(value: string | undefined) {
  if (!value) return undefined;
  const cleaned = decodeHtml(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^\s*,\s*/, '')
    .replace(/\s*,\s*$/, '');
  return cleaned || undefined;
}

function capture(html: string, pattern: RegExp) {
  return cleanText(pattern.exec(html)?.[1]);
}

function toIsoTime(dateValue: string | undefined, timeValue: string | undefined) {
  if (!dateValue || !timeValue) return [dateValue, timeValue].filter(Boolean).join(' • ');

  const date = /^(\d{1,2})\s+([a-z]+),?\s+(\d{4})$/i.exec(dateValue.trim());
  const time = /^(\d{1,2}):(\d{2})\s*(AM|PM)\s*GMT\s*([+-]\d{1,2})(?::?(\d{2}))?$/i.exec(
    timeValue.trim(),
  );
  if (!date || !time) return `${dateValue} • ${timeValue}`;

  const month = MONTHS[date[2].toLowerCase()];
  if (!month) return `${dateValue} • ${timeValue}`;

  let hour = Number(time[1]) % 12;
  if (time[3].toUpperCase() === 'PM') hour += 12;
  const offsetHour = Math.abs(Number(time[4])).toString().padStart(2, '0');
  const offsetMinute = (time[5] ?? '00').padStart(2, '0');
  const offsetSign = time[4].startsWith('-') ? '-' : '+';

  return `${date[3]}-${month}-${date[1].padStart(2, '0')}T${String(hour).padStart(2, '0')}:${time[2]}:00${offsetSign}${offsetHour}:${offsetMinute}`;
}

function getTimeline(html: string): TrackingEvent[] {
  const timelineHtml = html.split('class="list-history-order')[1] ?? '';
  const chunks = timelineHtml.split('<div class="grid grid-cols-12 md:grid-cols-7">').slice(1);
  const events: TrackingEvent[] = [];
  let currentDate: string | undefined;

  for (const chunk of chunks) {
    const title = capture(
      chunk,
      /<p class="text-\[15px\]\s+font-bold\s+uppercase\s+!mb-\[5px\]">([\s\S]*?)<\/p>/i,
    );
    if (!title) continue;

    const date = capture(
      chunk,
      /<p class="sub-date[^">]*font-bold[^">]*">([\s\S]*?)<\/p>/i,
    );
    if (date) currentDate = date;

    const time = capture(
      chunk,
      /<p class="sub-date\s+mb-0\s+text-\[15px\]">([\s\S]*?)<\/p>/i,
    );
    const titleIndex = chunk.search(/<p class="text-\[15px\]\s+font-bold\s+uppercase\s+!mb-\[5px\]">/i);
    const afterTitle = titleIndex >= 0 ? chunk.slice(titleIndex) : chunk;
    const location = capture(
      afterTitle,
      /<p class="text-\[14px\]\s+mb-0">([\s\S]*?)<\/p>/i,
    );

    events.push({
      time: toIsoTime(currentDate, time),
      title,
      ...(location ? { location } : {}),
    });
  }

  return events;
}

function destinationCountry(destination: string | undefined) {
  if (!destination) return undefined;
  const parts = destination.split(',').map((part) => part.trim()).filter(Boolean);
  return parts.at(-1);
}

export function normalizeNamDeHtml(
  html: string,
  queryCode: string,
  trackingUrl: string,
): NormalizedTracking | null {
  if (/Không\s+tìm\s+thấy\s+đơn\s+hàng/i.test(html)) return null;

  const pageCode = capture(
    html,
    /Tracking code:\s*<span[^>]*>([\s\S]*?)<\/span>/i,
  );
  const referenceCode = capture(
    html,
    /REF:\s*<a[^>]*>\s*<span[^>]*>([\s\S]*?)<\/span>/i,
  );
  const service = capture(
    html,
    /<strong>Service Area:<\/strong>\s*([\s\S]*?)<\/p>/i,
  );
  const origin = capture(
    html,
    /<strong>Origin Service Area:<\/strong>\s*([\s\S]*?)<\/p>/i,
  );
  const destination = capture(
    html,
    /<strong>Destination:<\/strong>\s*([\s\S]*?)<\/p>/i,
  );
  const timeline = getTimeline(html);

  if (!pageCode && timeline.length === 0) return null;

  const originLabel = !origin || /^VN$/i.test(origin) ? 'Việt Nam' : origin;
  const route = destination ? `${originLabel} → ${destination}` : originLabel;

  return {
    queryCode,
    packageCode: pageCode ?? queryCode,
    packageTrackingCode: referenceCode,
    country: destinationCountry(destination),
    route,
    trackingUrl,
    latestStatus: timeline[0]?.title ?? 'Đang cập nhật',
    service,
    lastMileCarrier: referenceCode?.toUpperCase().startsWith('1Z') ? 'UPS' : undefined,
    lastMileWebsite: trackingUrl,
    timeline,
    orderNumbers: [],
  };
}
