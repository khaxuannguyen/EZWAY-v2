'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
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
  X,
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
  isMock?: boolean;
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
  estimatedDelivery?: string;
  timeline: TrackingEvent[];
  orderNumbers: RelatedOrder[];
};

type TrackingState = 'idle' | 'loading' | 'success' | 'not-found' | 'error';
type Tone = 'success' | 'info' | 'warning' | 'danger' | 'muted';

const progressSteps = ['Đã nhận hàng', 'Đã xuất Việt Nam', 'Đã đến nước nhận', 'Đang thông quan', 'Giao tận nhà'];

function normalizeStatus(value: string) {
  return value.trim().toUpperCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ');
}

function translateStatus(status: string) {
  const value = normalizeStatus(status);
  const exact: Record<string, string> = {
    'USDA SECOND INSPECTION': 'Kiểm tra bổ sung bởi cơ quan USDA',
    'DESTINATION CUSTOMS RELEASED': 'Đã hoàn tất thông quan tại nước nhận',
    'HOLD INSPECTION BY CUSTOMS': 'Tạm giữ để kiểm tra hải quan',
    'ARRIVED DESTINATION PORT': 'Đã đến cảng nước nhận',
    'DESTINATION CUSTOMS PROCESSING': 'Đang xử lý thông quan tại nước nhận',
    'ARRIVED DESTINATION AIRPORT': 'Đã đến sân bay nước nhận',
    'IN TRANSIT TO NEXT FACILITY': 'Đang vận chuyển tới điểm khai thác tiếp theo',
    'ITEM PROCESSED AT SORTING FACILITY': 'Đã xử lý tại trung tâm phân loại',
    'SHIPPING INFORMATION RECEIVED': 'Hãng giao đã nhận thông tin vận chuyển',
    'EXPORT SCAN & LEAVE OUR WAREHOUSE': 'Đã xuất kho tại Việt Nam',
    'WE HAVE YOUR PARCEL': 'Đã nhận kiện hàng',
    'SHIPMENT CREATED': 'Đã tạo thông tin vận đơn',
    'LABEL CREATED': 'Đã tạo nhãn vận đơn',
    'OUT FOR DELIVERY': 'Đang giao tới người nhận',
    'ONBOARD FOR DELIVERY': 'Đang giao tới người nhận',
    DELIVERED: 'Đã giao hàng thành công',
    DEPARTED: 'Đã rời điểm khai thác',
  };
  if (exact[value]) return exact[value];
  if (/DELIVERED/.test(value)) return 'Đã giao hàng thành công';
  if (/RETURN|UNDELIVERABLE|FAILED|EXCEPTION/.test(value)) return 'Hành trình cần được EZWAY hỗ trợ kiểm tra';
  if (/USDA|INSPECTION/.test(value)) return 'Kiện hàng đang được kiểm tra bổ sung';
  if (/CUSTOMS.*HOLD|HOLD.*CUSTOMS/.test(value)) return 'Tạm giữ để kiểm tra hải quan';
  if (/CUSTOMS.*RELEASE|CLEARANCE.*COMPLETE/.test(value)) return 'Đã hoàn tất thông quan tại nước nhận';
  if (/CUSTOMS|CLEARANCE/.test(value)) return 'Đang xử lý thủ tục hải quan';
  if (/OUT FOR DELIVERY|ONBOARD FOR DELIVERY/.test(value)) return 'Đang giao tới người nhận';
  if (/ARRIVED.*DESTINATION/.test(value)) return 'Đã đến điểm khai thác tại nước nhận';
  if (/ARRIVED/.test(value)) return 'Đã đến điểm khai thác tiếp theo';
  if (/DEPART|EXPORT|LEAVE OUR WAREHOUSE/.test(value)) return 'Đã rời điểm khai thác';
  if (/TRANSIT|NEXT FACILITY|FLIGHT/.test(value)) return 'Đang vận chuyển tới điểm tiếp theo';
  if (/SORTING|PROCESSED.*FACILITY/.test(value)) return 'Đã xử lý tại trung tâm khai thác';
  if (/RECEIVED|HAVE YOUR PARCEL|PICKED/.test(value)) return 'Đã nhận kiện hàng';
  if (/LABEL|CREATED|INFORMATION/.test(value)) return 'Đã tạo thông tin vận đơn';
  if (/[À-ỹ]/.test(status)) return status;
  return 'Hãng vận chuyển đã cập nhật hành trình';
}

function statusInfo(status: string, statusClass?: string) {
  const value = `${status} ${statusClass ?? ''}`.toLowerCase().replace(/[_-]+/g, ' ');
  const attention = /inspection|usda|customs hold|hold inspection/.test(value);
  if (/exception|returned|returning|failed|failure|undeliverable|cancelled/.test(value)) {
    return { tone: 'danger' as Tone, stage: -1, label: 'CẦN HỖ TRỢ', attention: false };
  }
  if (/delivered|đã giao/.test(value)) {
    return { tone: 'success' as Tone, stage: 4, label: 'ĐÃ GIAO HÀNG', attention: false };
  }
  if (/out for delivery|onboard for delivery|đang giao/.test(value)) {
    return { tone: 'info' as Tone, stage: 4, label: 'ĐANG GIAO HÀNG', attention: false };
  }
  if (attention) {
    return { tone: 'warning' as Tone, stage: 3, label: 'CẦN THEO DÕI', attention: true };
  }
  if (/customs released|customs release|clearance complete|đã hoàn tất thông quan/.test(value)) {
    return { tone: 'info' as Tone, stage: 4, label: 'ĐÃ THÔNG QUAN', attention: false };
  }
  if (/customs|clearance|thông quan/.test(value)) {
    return { tone: 'info' as Tone, stage: 3, label: 'ĐANG THÔNG QUAN', attention: false };
  }
  if (/arrived destination|destination port|destination airport|đến nước nhận/.test(value)) {
    return { tone: 'info' as Tone, stage: 2, label: 'ĐÃ ĐẾN NƯỚC NHẬN', attention: false };
  }
  if (/export|departed|leave our warehouse|đã xuất/.test(value)) {
    return { tone: 'info' as Tone, stage: 1, label: 'ĐÃ XUẤT VIỆT NAM', attention: false };
  }
  if (/transit|airport|facility|flight|shipping|vận chuyển/.test(value)) {
    return { tone: 'info' as Tone, stage: 1, label: 'ĐANG VẬN CHUYỂN', attention: false };
  }
  if (/received|created|label|parcel|picked|nhận hàng/.test(value)) {
    return { tone: 'info' as Tone, stage: 0, label: 'ĐÃ NHẬN HÀNG', attention: false };
  }
  return { tone: 'muted' as Tone, stage: -1, label: 'ĐANG CẬP NHẬT', attention: false };
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

function friendlyRoutePart(value: string) {
  const key = value.trim().toUpperCase();
  const names: Record<string, string> = { VN: 'Việt Nam', VIETNAM: 'Việt Nam', US: 'United States', USA: 'United States', AU: 'Australia', UK: 'United Kingdom' };
  return names[key] ?? value.trim();
}

function formatRoute(value: string) {
  const parts = value.split(/\s*(?:-?>|→)\s*/).filter(Boolean);
  return parts.length > 1 ? parts.map(friendlyRoutePart).join(' → ') : friendlyRoutePart(value);
}

function shipmentRoute(data: TrackingData, preferLatestLocation = false) {
  if (preferLatestLocation && data.timeline[0]?.location) return `Việt Nam → ${data.timeline[0].location}`;
  if (data.route) return formatRoute(data.route);
  return data.country ? `Việt Nam → ${friendlyRoutePart(data.country)}` : 'Tuyến vận chuyển đang cập nhật';
}

function statusHeadline(status: string, translatedStatus: string, location?: string) {
  const value = normalizeStatus(status);
  const place = location ? ` tại ${location}` : '';
  if (/USDA|INSPECTION/.test(value)) return `Kiện hàng đang được kiểm tra bổ sung${place}`;
  if (/CUSTOMS.*HOLD|HOLD.*CUSTOMS/.test(value)) return `Kiện hàng đang được kiểm tra hải quan${place}`;
  if (/DELIVERED/.test(value)) return 'Kiện hàng đã được giao thành công';
  if (/OUT FOR DELIVERY|ONBOARD FOR DELIVERY/.test(value)) return `Kiện hàng đang được giao tới người nhận${place}`;
  if (/CUSTOMS|CLEARANCE/.test(value)) return `Kiện hàng đang được xử lý thông quan${place}`;
  if (/ARRIVED.*DESTINATION/.test(value)) return `Kiện hàng đã đến nước nhận${place}`;
  if (/TRANSIT|DEPART|EXPORT|FLIGHT/.test(value)) return `Kiện hàng đang trên đường tới điểm tiếp theo${place}`;
  return location ? `${translatedStatus} tại ${location}` : translatedStatus;
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
        {code && <button className="lookup-search-clear" type="button" onClick={() => { onCodeChange(''); inputRef?.current?.focus(); }} aria-label="Xóa mã vận đơn"><X size={18} /></button>}
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
  const [relatedExpanded, setRelatedExpanded] = useState(false);
  const [searchStuck, setSearchStuck] = useState(false);
  const [toast, setToast] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const searchShellRef = useRef<HTMLDivElement>(null);
  const requestController = useRef<AbortController | null>(null);

  useEffect(() => {
    const initialCode = new URLSearchParams(window.location.search).get('code')?.trim() ?? '';
    let initialRequest: number | undefined;
    if (initialCode) {
      initialRequest = window.setTimeout(() => {
        setCode(initialCode);
        void track(initialCode);
      }, 0);
    } else {
      inputRef.current?.focus();
    }
    return () => {
      if (initialRequest) window.clearTimeout(initialRequest);
      requestController.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const updateSearchState = () => {
      const shell = searchShellRef.current;
      if (!shell) return;
      const headerOffset = window.innerWidth <= 600 ? 80 : 92;
      setSearchStuck(shell.getBoundingClientRect().top <= headerOffset && window.scrollY > 80);
    };
    updateSearchState();
    window.addEventListener('scroll', updateSearchState, { passive: true });
    window.addEventListener('resize', updateSearchState);
    return () => {
      window.removeEventListener('scroll', updateSearchState);
      window.removeEventListener('resize', updateSearchState);
    };
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
    setRelatedExpanded(false);
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
  const latestTranslatedStatus = data ? translateStatus(data.latestStatus) : '';
  const latestHeadline = data ? statusHeadline(data.latestStatus, latestTranslatedStatus, latestEvent?.location) : '';
  const visibleEvents = useMemo(
    () => data?.timeline.slice(0, expanded ? data.timeline.length : 5) ?? [],
    [data, expanded],
  );
  const information = data
    ? [
        { label: 'Tuyến vận chuyển', value: shipmentRoute(data), icon: Plane },
        { label: 'Dịch vụ', value: data.service, icon: Plane },
        { label: 'Carrier giao cuối', value: data.lastMileCarrier, icon: Truck },
        { label: 'Số kiện', value: data.totalPackages, icon: Box },
        { label: 'Mã carrier', value: data.carrierCode, icon: PackageCheck },
        { label: 'Dự kiến giao', value: data.estimatedDelivery, icon: Clock3 },
      ].filter((item) => item.value)
    : [];
  const visibleRelatedOrders = data?.orderNumbers.slice(0, relatedExpanded ? data.orderNumbers.length : 3) ?? [];

  return (
    <>
      <div ref={searchShellRef} className={`lookup-search-shell${searchStuck ? ' is-stuck' : ''}`}>
        <SearchForm compact={searchStuck} code={code} validation={validation} loading={state === 'loading'} inputRef={inputRef} onCodeChange={(value) => { setCode(value); if (validation) setValidation(''); }} onSubmit={submit} />
        {searchStuck && validation && <p className="lookup-sticky-validation" role="alert"><AlertCircle size={13} /> {validation}</p>}
      </div>

      {state !== 'idle' && (
        <div className="lookup-results-wrap">
          {state === 'loading' && <LoadingResults />}

          {state === 'not-found' && (
            <section className="lookup-state-card">
              <span><PackageSearch size={34} /></span>
              <p>CHƯA CÓ DỮ LIỆU HÀNH TRÌNH</p>
              <h2>Chưa tìm thấy mã vận đơn này.</h2>
              <div>Hãy kiểm tra lại mã EZWAY/HAWB hoặc liên hệ EZWAY để được hỗ trợ.</div>
              <div className="lookup-state-actions"><a href="tel:0523666966">Liên hệ hỗ trợ</a><Link href="/#bao-gia">Nhận báo giá</Link></div>
            </section>
          )}

          {state === 'error' && (
            <section className="lookup-state-card lookup-state-error">
              <span><AlertCircle size={34} /></span>
              <p>KẾT NỐI ĐANG GIÁN ĐOẠN</p>
              <h2>Chưa thể tải hành trình lúc này</h2>
              <div>Vui lòng thử lại sau ít phút. EZWAY luôn sẵn sàng hỗ trợ nếu bạn cần kiểm tra gấp.</div>
              <div className="lookup-state-actions"><button type="button" onClick={() => void track(searchedCode)}><RotateCcw size={16} /> Thử lại</button><a href="tel:0523666966">Liên hệ hỗ trợ</a><Link href="/#bao-gia">Nhận báo giá</Link></div>
            </section>
          )}

          {state === 'success' && data && currentStatus && (
            <div className="lookup-results" aria-live="polite">
              <section className={`lookup-overview lookup-tone-${currentStatus.tone}`}>
                <div className="lookup-overview-main">
                  <div className="lookup-status-line"><div className="lookup-status-badge"><span /> {currentStatus.label}</div>{data.isMock && <em>Dữ liệu minh hoạ kiểm thử</em>}</div>
                  <h2>{latestHeadline}</h2>
                  {latestEvent?.time && <p className="lookup-latest-time">Cập nhật mới nhất: <strong>{formatEventTime(latestEvent.time)}</strong> <span>(giờ địa phương theo hãng giao)</span></p>}
                  <div className="lookup-route-visual"><Plane size={18} /><span>Tuyến hiện tại</span><strong>{shipmentRoute(data, true)}</strong></div>

                  <div className="lookup-overview-meta">
                    {(data.packageCode || data.packageTrackingCode) && (
                      <div><span>Mã vận đơn</span><strong>{data.packageCode ?? data.packageTrackingCode}</strong><button type="button" onClick={() => void copyValue(data.packageCode ?? data.packageTrackingCode!)} aria-label="Sao chép mã vận đơn"><Copy size={15} /></button></div>
                    )}
                  </div>

                  {currentStatus.tone === 'success' && <div className="lookup-success-note"><CheckCircle2 size={20} /><span><strong>Đơn hàng đã giao thành công</strong> Cảm ơn bạn đã tin tưởng EZWAY.</span></div>}
                  {currentStatus.attention && <div className="lookup-attention-note"><AlertCircle size={20} /><span><strong>Kiện hàng đang được cơ quan kiểm tra theo quy trình.</strong> EZWAY đang theo dõi cập nhật từ đối tác. Hiện bạn chưa cần thực hiện thêm thao tác nào. <a href="tel:0523666966">Liên hệ hỗ trợ đơn hàng</a></span></div>}
                  {currentStatus.tone === 'danger' && <div className="lookup-danger-note"><AlertCircle size={20} /><span><strong>EZWAY đang sẵn sàng hỗ trợ kiểm tra.</strong> <a href="tel:0523666966">Liên hệ hỗ trợ đơn hàng</a></span></div>}
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

              <div className="lookup-content-grid">
                <section className="lookup-timeline-panel">
                  <div className="lookup-section-heading"><div><p>MỚI NHẤT → CŨ NHẤT</p><h2>Cập nhật hành trình</h2></div><span>{data.timeline.length} cập nhật</span></div>
                  {visibleEvents.length > 0 ? (
                    <ol className="lookup-timeline">
                      {visibleEvents.map((event, index) => {
                        const tone = toneFromStatus(event.title);
                        const translatedTitle = translateStatus(event.title);
                        return (
                          <li className={`lookup-event-${tone}`} key={`${event.time}-${event.title}-${index}`}>
                            <span className="lookup-timeline-dot">{index === 0 ? <PackageCheck size={15} /> : null}</span>
                            <div>
                              <div className="lookup-event-top"><time>{formatEventTime(event.time)}</time>{index === 0 && <span>Mới nhất</span>}</div>
                              <h3>{translatedTitle}</h3>
                              {event.location && <p><MapPin size={14} /> {event.location}</p>}
                              <details className="lookup-source-event"><summary>Cập nhật từ hãng <ChevronDown size={14} /></summary><p>{event.title}</p></details>
                            </div>
                          </li>
                        );
                      })}
                    </ol>
                  ) : <p className="lookup-no-timeline">Hành trình chi tiết đang được hãng vận chuyển cập nhật.</p>}
                  {data.timeline.length > 5 && (
                    <button className={`lookup-expand${expanded ? ' is-expanded' : ''}`} type="button" onClick={() => setExpanded((value) => !value)}>
                      {expanded ? 'Thu gọn còn 5 cập nhật' : `Xem toàn bộ ${data.timeline.length} cập nhật`} <ChevronDown size={17} />
                    </button>
                  )}
                </section>

                <aside className="lookup-sidebar">
                  {information.length > 0 && (
                    <section className="lookup-information">
                      <div className="lookup-section-heading"><div><p>THÔNG TIN KIỆN HÀNG</p><h2>Tóm tắt lô hàng</h2></div></div>
                      <dl className="lookup-summary-list">{information.map(({ label, value, icon: Icon }) => <div key={label}><dt><Icon size={16} /> {label}</dt><dd>{value}</dd></div>)}</dl>
                      {(data.lastMileWebsite || data.trackingUrl) && <a href={data.lastMileWebsite ?? data.trackingUrl} target="_blank" rel="noopener noreferrer">Theo dõi trên website hãng giao <ExternalLink size={15} /></a>}
                    </section>
                  )}

                  {data.orderNumbers.length > 0 && (
                    <details className="lookup-related" open>
                      <summary className="lookup-related-summary"><div><p>CÙNG MỘT LÔ HÀNG</p><h2>Các kiện cùng lô hàng</h2></div><ChevronDown size={18} /></summary>
                      <div className="lookup-related-list">
                        {visibleRelatedOrders.map((order, index) => {
                          const orderCode = order.trackingCode ?? order.hawb;
                          return (
                            <article key={`${order.hawb}-${order.trackingCode}-${index}`}>
                              <div className="lookup-related-head"><span className={`lookup-related-status lookup-event-${toneFromStatus(order.status ?? '', order.statusClass)}`}>{translateStatus(order.status ?? 'Đang cập nhật')}</span>{order.isCurrent && <strong>Đang theo dõi</strong>}</div>
                              {order.hawb && <p><span>HAWB</span><b>{order.hawb}</b></p>}
                              {order.trackingCode && <p><span>Mã tracking cuối</span><b>{order.trackingCode}</b></p>}
                              <div className="lookup-related-actions">
                                {orderCode && <button type="button" onClick={() => void copyValue(orderCode)}><Copy size={14} /> Sao chép</button>}
                                {order.trackingUrl && <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer">Theo dõi <ExternalLink size={13} /></a>}
                              </div>
                            </article>
                          );
                        })}
                      </div>
                      {data.orderNumbers.length > 3 && <button className="lookup-related-more" type="button" onClick={() => setRelatedExpanded((value) => !value)}>{relatedExpanded ? 'Thu gọn danh sách' : `Xem thêm ${data.orderNumbers.length - 3} kiện`} <ChevronDown size={15} /></button>}
                    </details>
                  )}

                  <section className="lookup-support-card">
                    <span><Headphones size={23} /></span>
                    <p>CẦN EZWAY HỖ TRỢ?</p>
                    <h2>Chúng tôi sẵn sàng kiểm tra cùng bạn</h2>
                    <a href="tel:0523666966">Liên hệ hỗ trợ đơn hàng</a>
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
