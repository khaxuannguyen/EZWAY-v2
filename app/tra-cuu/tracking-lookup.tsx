'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Box,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Copy,
  ExternalLink,
  Headphones,
  MapPin,
  PackageCheck,
  PackageSearch,
  Plane,
  RotateCcw,
  Search,
  Truck,
} from 'lucide-react';

type TrackingEvent = { time: string; title: string; location?: string };
type RelatedOrder = {
  hawb?: string;
  trackingCode?: string;
  status?: string;
  statusClass?: string;
  trackingUrl?: string;
  isCurrent: boolean;
};
type TrackingData = {
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

type TrackingState = 'idle' | 'loading' | 'success' | 'not-found' | 'error';
type Tone = 'success' | 'info' | 'warning' | 'danger' | 'muted';

const progressSteps = ['Đã nhận hàng', 'Đang vận chuyển', 'Thông quan', 'Đang giao', 'Đã giao'];

function statusInfo(status: string, statusClass?: string) {
  const value = `${status} ${statusClass ?? ''}`.toLowerCase().replace(/[_-]+/g, ' ');
  if (/exception|returned|returning|failed|failure|undeliverable|cancelled/.test(value)) {
    return { tone: 'danger' as Tone, stage: -1, label: 'CẦN HỖ TRỢ', headline: 'Hành trình đang cần EZWAY hỗ trợ' };
  }
  if (/delivered|đã giao/.test(value)) {
    return { tone: 'success' as Tone, stage: 4, label: 'ĐÃ GIAO HÀNG', headline: 'Đơn hàng đã giao thành công' };
  }
  if (/out for delivery|onboard for delivery|đang giao/.test(value)) {
    return { tone: 'info' as Tone, stage: 3, label: 'ĐANG GIAO HÀNG', headline: 'Kiện hàng đang được giao đến người nhận' };
  }
  if (/customs|clearance|thông quan/.test(value)) {
    return { tone: 'warning' as Tone, stage: 2, label: 'ĐANG THÔNG QUAN', headline: 'Kiện hàng đang được xử lý thông quan' };
  }
  if (/transit|departed|airport|facility|flight|shipping|vận chuyển/.test(value)) {
    return { tone: 'info' as Tone, stage: 1, label: 'ĐANG VẬN CHUYỂN', headline: 'Kiện hàng đang trên đường đến người nhận' };
  }
  if (/received|created|label|parcel|picked|nhận hàng/.test(value)) {
    return { tone: 'info' as Tone, stage: 0, label: 'ĐÃ NHẬN HÀNG', headline: 'EZWAY đã tiếp nhận thông tin kiện hàng' };
  }
  return { tone: 'muted' as Tone, stage: -1, label: 'ĐANG CẬP NHẬT', headline: 'Hành trình kiện hàng đang được cập nhật' };
}

function toneFromStatus(status: string, statusClass?: string): Tone {
  return statusInfo(status, statusClass).tone;
}

function parseEventDate(value: string) {
  if (!value) return null;
  const normalized = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)
    ? value.replace(' ', 'T') + '+07:00'
    : value;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatEventTime(value: string) {
  const date = parseEventDate(value);
  if (!date) return value || 'Thời gian đang cập nhật';
  const datePart = new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(date);
  const timePart = new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(date);
  return `${datePart} • ${timePart}`;
}

function formatRoute(value: string) {
  return value.replace(/\s*-?>\s*/g, ' → ');
}

function SearchForm({
  compact = false,
  code,
  validation,
  loading,
  inputRef,
  onCodeChange,
  onSubmit,
}: {
  compact?: boolean;
  code: string;
  validation: string;
  loading: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  onCodeChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const inputId = compact ? 'lookup-code-compact' : 'lookup-code';
  return (
    <form className={`lookup-search${compact ? ' lookup-search-compact' : ''}`} onSubmit={onSubmit} noValidate>
      <label className="sr-only" htmlFor={inputId}>Mã vận đơn</label>
      <div>
        <Search size={compact ? 19 : 22} aria-hidden="true" />
        <input
          ref={inputRef}
          id={inputId}
          value={code}
          onChange={(event) => onCodeChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              event.currentTarget.form?.requestSubmit();
            }
          }}
          placeholder="Ví dụ: EZW… hoặc mã tracking"
          autoComplete="off"
          aria-invalid={Boolean(validation)}
        />
        <button type="submit" disabled={loading}>
          {loading ? <><span className="lookup-button-spinner" /> Đang tra cứu</> : <>Tra cứu đơn hàng <ArrowRight size={16} /></>}
        </button>
      </div>
      {!compact && validation && <p role="alert"><AlertCircle size={14} /> {validation}</p>}
    </form>
  );
}

function LoadingResults() {
  return (
    <div className="lookup-loading" aria-label="Đang tải hành trình" aria-busy="true">
      <section className="lookup-loading-overview">
        <div><i /><i /><i /><i /></div><div><i /><i /><i /><i /><i /></div>
      </section>
      <div className="lookup-loading-cards">{[0, 1, 2, 3].map((item) => <i key={item} />)}</div>
      <section className="lookup-loading-body"><div>{[0, 1, 2, 3, 4].map((item) => <i key={item} />)}</div><aside><i /><i /><i /></aside></section>
    </div>
  );
}

export function TrackingLookup() {
  const [code, setCode] = useState('');
  const [searchedCode, setSearchedCode] = useState('');
  const [validation, setValidation] = useState('');
  const [state, setState] = useState<TrackingState>('idle');
  const [data, setData] = useState<TrackingData | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [toast, setToast] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const requestController = useRef<AbortController | null>(null);

  useEffect(() => {
    const initialCode = new URLSearchParams(window.location.search).get('code')?.trim() ?? '';
    if (initialCode) {
      setCode(initialCode);
      void track(initialCode);
    } else {
      inputRef.current?.focus();
    }
    return () => requestController.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function track(nextCode?: string) {
    const normalizedCode = (nextCode ?? code).trim();
    if (!normalizedCode) {
      setValidation('Vui lòng nhập mã vận đơn trước khi tra cứu.');
      inputRef.current?.focus();
      return;
    }

    setValidation('');
    setSearchedCode(normalizedCode);
    setState('loading');
    setData(null);
    setExpanded(false);
    window.history.replaceState(null, '', `/tra-cuu?code=${encodeURIComponent(normalizedCode)}`);
    requestController.current?.abort();
    const controller = new AbortController();
    requestController.current = controller;

    try {
      const response = await fetch(`/api/tracking?code=${encodeURIComponent(normalizedCode)}`, {
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
      if (response.status === 404) {
        setState('not-found');
        return;
      }
      if (!response.ok) {
        setState('error');
        return;
      }
      const payload = (await response.json()) as { tracking?: TrackingData };
      if (!payload.tracking) {
        setState('not-found');
        return;
      }
      setData(payload.tracking);
      setState('success');
    } catch (error) {
      if ((error as Error).name !== 'AbortError') setState('error');
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void track();
  }

  async function copyValue(value: string) {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const helper = document.createElement('textarea');
      helper.value = value;
      helper.style.position = 'fixed';
      helper.style.opacity = '0';
      document.body.appendChild(helper);
      helper.select();
      document.execCommand('copy');
      helper.remove();
    }
    setToast('Đã sao chép mã vận đơn');
    window.setTimeout(() => setToast(''), 2200);
  }

  const currentStatus = data ? statusInfo(data.latestStatus, data.statusClass) : null;
  const latestEvent = data?.timeline[0];
  const visibleEvents = useMemo(
    () => data?.timeline.slice(0, expanded ? data.timeline.length : 6) ?? [],
    [data, expanded],
  );
  const information = data
    ? [
        { label: 'Dịch vụ', value: data.service, icon: Plane },
        { label: 'Điểm đến', value: data.country, icon: MapPin },
        { label: 'Số kiện', value: data.totalPackages, icon: Box },
        { label: 'Đơn vị giao cuối', value: data.lastMileCarrier, icon: Truck },
        { label: 'Mã carrier', value: data.carrierCode, icon: PackageCheck },
        { label: 'Thông tin liên hệ', value: data.contactInformation, icon: Headphones },
      ].filter((item) => item.value)
    : [];

  return (
    <>
      <SearchForm code={code} validation={validation} loading={state === 'loading'} inputRef={inputRef} onCodeChange={(value) => { setCode(value); if (validation) setValidation(''); }} onSubmit={submit} />

      {state !== 'idle' && (
        <div className="lookup-results-wrap">
          <div className="lookup-sticky-search">
            <SearchForm compact code={code} validation="" loading={state === 'loading'} onCodeChange={setCode} onSubmit={submit} />
          </div>

          {state === 'loading' && <LoadingResults />}

          {state === 'not-found' && (
            <section className="lookup-state-card">
              <span><PackageSearch size={34} /></span>
              <p>KHÔNG TÌM THẤY DỮ LIỆU</p>
              <h2>Chưa tìm thấy hành trình cho mã này</h2>
              <div>Kiểm tra lại mã vận đơn hoặc gọi EZWAY để được hỗ trợ.</div>
              <a href="tel:0523666966">Gọi 0523.666.966</a>
            </section>
          )}

          {state === 'error' && (
            <section className="lookup-state-card lookup-state-error">
              <span><AlertCircle size={34} /></span>
              <p>KẾT NỐI ĐANG GIÁN ĐOẠN</p>
              <h2>Chưa thể tải hành trình lúc này</h2>
              <div>Vui lòng thử lại sau ít phút. EZWAY luôn sẵn sàng hỗ trợ nếu bạn cần kiểm tra gấp.</div>
              <button type="button" onClick={() => void track(searchedCode)}><RotateCcw size={16} /> Thử lại</button>
            </section>
          )}

          {state === 'success' && data && currentStatus && (
            <div className="lookup-results" aria-live="polite">
              <section className={`lookup-overview lookup-tone-${currentStatus.tone}`}>
                <div className="lookup-overview-main">
                  <div className="lookup-status-badge"><span /> {currentStatus.label}</div>
                  <h2>{currentStatus.headline}</h2>
                  <p className="lookup-source-status">Trạng thái hãng giao: <strong>{data.latestStatus}</strong></p>

                  <dl className="lookup-current-event">
                    {latestEvent?.location && <div><dt><MapPin size={17} /> Đang ở</dt><dd>{latestEvent.location}</dd></div>}
                    {latestEvent?.time && <div><dt><Clock3 size={17} /> Cập nhật lúc</dt><dd>{formatEventTime(latestEvent.time)}</dd></div>}
                  </dl>

                  <div className="lookup-overview-meta">
                    {(data.packageCode || data.packageTrackingCode) && (
                      <div><span>Mã vận đơn</span><strong>{data.packageCode ?? data.packageTrackingCode}</strong><button type="button" onClick={() => void copyValue(data.packageCode ?? data.packageTrackingCode!)} aria-label="Sao chép mã vận đơn"><Copy size={15} /></button></div>
                    )}
                    {data.route && <div><span>Tuyến</span><strong>{formatRoute(data.route)}</strong></div>}
                  </div>

                  {currentStatus.tone === 'success' && <div className="lookup-success-note"><CheckCircle2 size={20} /><span><strong>Đơn hàng đã giao thành công</strong> Cảm ơn bạn đã tin tưởng EZWAY.</span></div>}
                  {currentStatus.tone === 'danger' && <div className="lookup-warning-note"><AlertCircle size={20} /><span><strong>EZWAY đang sẵn sàng hỗ trợ.</strong> Gọi <a href="tel:0523666966">0523.666.966</a> để được kiểm tra nhanh.</span></div>}
                </div>

                {currentStatus.stage >= 0 && (
                  <div className="lookup-progress" aria-label="Tiến trình đơn hàng">
                    {progressSteps.map((step, index) => {
                      const completed = index < currentStatus.stage;
                      const active = index === currentStatus.stage;
                      return (
                        <div className={`${completed ? 'is-complete' : ''}${active ? ' is-active' : ''}`} key={step}>
                          <span>{completed ? <Check size={17} /> : index + 1}</span>
                          <p>{step}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              {information.length > 0 && (
                <section className="lookup-information">
                  <div className="lookup-section-heading"><div><p>THÔNG TIN VẬN CHUYỂN</p><h2>Chi tiết kiện hàng</h2></div>
                    {(data.lastMileWebsite || data.trackingUrl) && <a href={data.lastMileWebsite ?? data.trackingUrl} target="_blank" rel="noopener noreferrer">Theo dõi trên website hãng giao <ExternalLink size={15} /></a>}
                  </div>
                  <div className="lookup-information-grid">
                    {information.map(({ label, value, icon: Icon }) => (
                      <article key={label}><span><Icon size={19} /></span><div><p>{label}</p><strong>{value}</strong></div></article>
                    ))}
                  </div>
                </section>
              )}

              <div className="lookup-content-grid">
                <section className="lookup-timeline-panel">
                  <div className="lookup-section-heading"><div><p>LỊCH SỬ HÀNH TRÌNH</p><h2>Các cập nhật mới nhất</h2></div><span>Mới nhất → cũ nhất</span></div>
                  {visibleEvents.length > 0 ? (
                    <ol className="lookup-timeline">
                      {visibleEvents.map((event, index) => {
                        const tone = toneFromStatus(event.title);
                        return (
                          <li className={`lookup-event-${tone}`} key={`${event.time}-${event.title}-${index}`}>
                            <span className="lookup-timeline-dot">{index === 0 ? <PackageCheck size={15} /> : null}</span>
                            <div>
                              <div className="lookup-event-top"><time>{formatEventTime(event.time)}</time>{index === 0 && <span>Mới nhất</span>}</div>
                              <h3>{event.title}</h3>
                              {event.location && <p><MapPin size={14} /> {event.location}</p>}
                            </div>
                          </li>
                        );
                      })}
                    </ol>
                  ) : <p className="lookup-no-timeline">Hành trình chi tiết đang được hãng vận chuyển cập nhật.</p>}
                  {data.timeline.length > 6 && (
                    <button className={`lookup-expand${expanded ? ' is-expanded' : ''}`} type="button" onClick={() => setExpanded((value) => !value)}>
                      {expanded ? 'Thu gọn hành trình' : `Xem toàn bộ hành trình (${data.timeline.length})`} <ChevronDown size={17} />
                    </button>
                  )}
                </section>

                <aside className="lookup-sidebar">
                  {data.orderNumbers.length > 0 && (
                    <section className="lookup-related">
                      <div className="lookup-section-heading"><div><p>CÁC KIỆN LIÊN QUAN</p><h2>Các mã vận đơn liên quan</h2></div></div>
                      <div className="lookup-related-list">
                        {data.orderNumbers.map((order, index) => {
                          const orderCode = order.trackingCode ?? order.hawb;
                          return (
                            <article key={`${order.hawb}-${order.trackingCode}-${index}`}>
                              <div className="lookup-related-head"><span className={`lookup-related-status lookup-event-${toneFromStatus(order.status ?? '', order.statusClass)}`}>{order.status ?? 'Đang cập nhật'}</span>{order.isCurrent && <strong>Đang theo dõi</strong>}</div>
                              {order.hawb && <p><span>HAWB</span><b>{order.hawb}</b></p>}
                              {order.trackingCode && <p><span>Tracking code</span><b>{order.trackingCode}</b></p>}
                              <div className="lookup-related-actions">
                                {orderCode && <button type="button" onClick={() => void copyValue(orderCode)}><Copy size={14} /> Sao chép</button>}
                                {order.trackingUrl && <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer">Theo dõi hãng <ExternalLink size={13} /></a>}
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </section>
                  )}

                  <section className="lookup-support-card">
                    <span><Headphones size={23} /></span>
                    <p>CẦN EZWAY HỖ TRỢ?</p>
                    <h2>Chúng tôi luôn sẵn sàng kiểm tra cùng bạn</h2>
                    <a href="tel:0523666966">Gọi 0523.666.966</a>
                  </section>
                </aside>
              </div>
            </div>
          )}
        </div>
      )}

      {toast && <div className="lookup-toast" role="status"><CheckCircle2 size={17} /> {toast}</div>}
    </>
  );
}
