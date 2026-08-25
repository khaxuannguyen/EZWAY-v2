type JsonRecord = Record<string, unknown>;

export type TrackingEvent = {
  time: string;
  title: string;
  location?: string;
};

export type RelatedOrder = {
  hawb?: string;
  trackingCode?: string;
  status?: string;
  statusClass?: string;
  trackingUrl?: string;
  isCurrent: boolean;
};

export type NormalizedTracking = {
  queryCode: string;
  packageCode?: string;
  packageTrackingCode?: string;
  carrierCode?: string;
  country?: string;
  route?: string;
  trackingUrl?: string;
  statusClass?: string;
  latestStatus: string;
  service?: string;
  totalPackages?: string;
  lastMileCarrier?: string;
  lastMileWebsite?: string;
  contactInformation?: string;
  timeline: TrackingEvent[];
  orderNumbers: RelatedOrder[];
};

function asRecord(value: unknown): JsonRecord | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as JsonRecord)
    : null;
}

function stringValue(value: unknown): string | undefined {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed || undefined;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return undefined;
}

function pick(record: JsonRecord | null, keys: string[]): string | undefined {
  if (!record) return undefined;
  for (const key of keys) {
    const value = stringValue(record[key]);
    if (value) return value;
  }
  return undefined;
}

function safeHttpUrl(value: unknown): string | undefined {
  const candidate = stringValue(value);
  if (!candidate) return undefined;
  try {
    const url = new URL(candidate);
    return url.protocol === 'http:' || url.protocol === 'https:'
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

function normalizeArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  const record = asRecord(value);
  return record ? Object.values(record) : [];
}

function normalizeLocation(value: unknown): string | undefined {
  const direct = stringValue(value);
  if (direct) return direct;
  const record = asRecord(value);
  if (!record) return undefined;
  const parts = [
    pick(record, ['name', 'city', 'location']),
    pick(record, ['state', 'province']),
    pick(record, ['country', 'country_name']),
  ].filter(Boolean);
  return parts.length ? [...new Set(parts)].join(', ') : undefined;
}

function normalizeContact(value: unknown): string | undefined {
  const direct = stringValue(value);
  if (direct) return direct;
  const record = asRecord(value);
  if (!record) return undefined;
  const parts = [
    pick(record, ['name', 'contact_name']),
    pick(record, ['phone', 'telephone', 'hotline']),
    pick(record, ['email']),
    pick(record, ['address']),
  ].filter(Boolean);
  return parts.length ? parts.join(' · ') : undefined;
}

function unwrapPayload(raw: unknown): JsonRecord | null {
  let current: unknown = raw;
  for (let index = 0; index < 3; index += 1) {
    if (Array.isArray(current)) current = current[0];
    const record = asRecord(current);
    if (!record) return null;
    const next = record.data ?? record.result ?? record.package;
    if (next === undefined || next === current) return record;
    current = next;
  }
  return asRecord(current);
}

function getTimeline(payload: JsonRecord): TrackingEvent[] {
  const candidates = [
    payload.trackings,
    payload.tracking_history,
    payload.tracking,
    payload.history,
    payload.events,
    payload.tracking_information,
    payload.timeline,
  ];
  const source = candidates.find((candidate) => normalizeArray(candidate).length > 0);

  return normalizeArray(source)
    .map((entry, index) => {
      const record = asRecord(entry);
      if (!record) return null;
      const title = pick(record, ['title', 'status', 'description', 'message', 'event']);
      const time = pick(record, ['time', 'datetime', 'date', 'created_at', 'event_time', 'updated_at']);
      if (!title && !time) return null;
      const parsedTime = time ? Date.parse(time) : Number.NaN;
      return {
        event: {
          time: time ?? '',
          title: title ?? 'Cập nhật hành trình',
          location: normalizeLocation(record.location ?? record.address ?? record.place),
        },
        index,
        timestamp: Number.isNaN(parsedTime) ? null : parsedTime,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => {
      if (a.timestamp !== null && b.timestamp !== null) return b.timestamp - a.timestamp;
      if (a.timestamp !== null) return -1;
      if (b.timestamp !== null) return 1;
      return a.index - b.index;
    })
    .map(({ event }) => event);
}

export function normalizeKsnResponse(raw: unknown, queryCode: string): NormalizedTracking | null {
  const rawRecord = asRecord(raw);
  if (rawRecord && (rawRecord.success === false || rawRecord.found === false)) return null;

  const payload = unwrapPayload(raw);
  if (!payload) return null;
  const shipment = asRecord(payload.shipment_information ?? payload.shipment);
  const additional = asRecord(payload.additional_notes ?? payload.additional_information);
  const timeline = getTimeline(payload);

  const packageCode = pick(payload, ['package_code', 'packageCode', 'bill_code']);
  const packageTrackingCode = pick(payload, ['package_tracking_code', 'tracking_code', 'trackingCode']);
  const carrierCode = pick(payload, ['carrier_code', 'carrierCode', 'carrier']);
  const latestStatus =
    timeline[0]?.title ??
    pick(payload, ['latest_status', 'current_status', 'package_status']) ??
    (typeof payload.status === 'string' ? stringValue(payload.status) : undefined) ??
    'Đang cập nhật';

  const normalizedQuery = queryCode.toLowerCase();
  const orderNumbers = normalizeArray(
    shipment?.order_numbers ?? payload.order_numbers ?? payload.related_tracking_codes,
  )
    .map((entry) => {
      const record = asRecord(entry);
      if (!record) return null;
      const hawb = pick(record, ['package_hawb_code', 'hawb', 'hawb_code', 'order_number', 'package_code']);
      const trackingCode = pick(record, ['package_tracking_code', 'tracking_code', 'trackingCode', 'code']);
      const status = pick(record, ['status', 'current_status', 'title']);
      const statusClass = pick(record, ['status_class', 'statusClass']);
      const trackingUrl = safeHttpUrl(record.tracking_url ?? record.trackingUrl ?? record.url);
      if (!hawb && !trackingCode) return null;
      const isCurrent = record.is_current === true || [hawb, trackingCode]
        .filter(Boolean)
        .some((value) => value!.toLowerCase() === normalizedQuery);
      return { hawb, trackingCode, status, statusClass, trackingUrl, isCurrent };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const currentOrder = orderNumbers.find((order) => order.isCurrent) ?? orderNumbers[0];
  const hasMeaningfulData = Boolean(
    packageCode || packageTrackingCode || carrierCode || timeline.length || orderNumbers.length,
  );
  if (!hasMeaningfulData) return null;

  return {
    queryCode,
    packageCode,
    packageTrackingCode,
    carrierCode,
    country:
      pick(additional, ['country', 'destination_country', 'country_name']) ??
      pick(payload, ['destination_country', 'country_name']),
    route: pick(shipment, ['country', 'route', 'shipment_route']) ?? pick(payload, ['route']),
    trackingUrl: safeHttpUrl(payload.tracking_url ?? payload.trackingUrl),
    statusClass: currentOrder?.statusClass,
    latestStatus,
    service: pick(additional, ['service', 'service_name']) ?? pick(payload, ['service']),
    totalPackages:
      pick(additional, ['total_packages', 'total_package', 'package_count', 'total']) ??
      pick(shipment, ['total_packages', 'total_package', 'package_count', 'total']) ??
      pick(payload, ['total_packages', 'package_count']),
    lastMileCarrier:
      pick(additional, ['last_mile_carrier', 'last_mile', 'last_mile_provider']) ??
      pick(shipment, ['last_mile_carrier', 'last_mile', 'last_mile_provider']) ??
      pick(payload, ['last_mile_carrier']),
    lastMileWebsite:
      safeHttpUrl(additional?.last_mile_website ?? additional?.last_mile_url) ??
      safeHttpUrl(shipment?.last_mile_website ?? shipment?.last_mile_url) ??
      safeHttpUrl(payload.last_mile_website),
    contactInformation:
      normalizeContact(additional?.contact_information ?? additional?.contact) ??
      normalizeContact(shipment?.contact_information ?? shipment?.contact) ??
      normalizeContact(payload.contact_information),
    timeline,
    orderNumbers,
  };
}

export function createMockKsnResponse(queryCode: string): unknown {
  const normalizedCode = queryCode.toUpperCase();
  const delivered = normalizedCode.includes('DELIVERED');
  const customs = normalizedCode.includes('CUSTOMS');
  const latestTitle = delivered
    ? 'Delivered'
    : customs
      ? 'DESTINATION CUSTOMS PROCESSING'
      : 'In Transit to next facility';
  const statusClass = delivered ? 'delivered' : customs ? 'customs_processing' : 'in_transit';

  return {
    success: true,
    data: {
      package_code: 'EZW-MOCK-0001',
      package_tracking_code: queryCode,
      carrier_code: 'KSN',
      tracking_url: 'https://tools.usps.com/go/TrackConfirmAction_input',
      additional_notes: {
        service: 'Air Express',
        country: 'United States',
        total_package: 2,
        last_mile: 'USPS',
        last_mile_website: 'https://www.usps.com/',
        contact_information: { phone: '0523.666.966' },
      },
      shipment_information: {
        country: 'VN -> US',
        order_numbers: [
          {
            package_hawb_code: 'EZW-MOCK-0001',
            package_tracking_code: queryCode,
            is_current: true,
            status_class: statusClass,
            status: latestTitle,
            tracking_url: 'https://tools.usps.com/go/TrackConfirmAction_input',
          },
          {
            hawb: 'KSN-ORIGIN-8421',
            tracking_code: 'KSN84210001',
            status: 'Processing',
          },
        ],
      },
      trackings: [
        { time: '2026-08-25T06:30:00Z', title: latestTitle, location: delivered ? 'Seattle, WA' : customs ? null : 'Singapore Hub' },
        { time: '2026-08-24T14:15:00Z', title: 'Customs Processing', location: null },
        { time: '2026-08-24T08:20:00Z', title: 'Arrived Destination Airport', location: 'Los Angeles, CA' },
        { time: '2026-08-23T22:10:00Z', title: 'Departed', location: 'Singapore' },
        { time: '2026-08-23T08:00:00Z', title: 'Shipment Created', location: 'TP. Hồ Chí Minh' },
        { time: '2026-08-22T16:40:00Z', title: 'Export Scan & Leave our warehouse', location: 'TP. Hồ Chí Minh' },
        { time: '2026-08-22T09:15:00Z', title: 'We Have Your Parcel', location: 'TP. Hồ Chí Minh' },
        { time: '2026-08-21T15:30:00Z', title: 'LABEL CREATED', location: null },
      ],
    },
  };
}
