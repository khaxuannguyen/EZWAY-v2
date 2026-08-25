'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  AlertCircle,
  Boxes,
  CheckCircle2,
  Clock3,
  ExternalLink,
  MapPin,
  PackageSearch,
  Phone,
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
  trackingUrl?: string;
  isCurrent: boolean;
};
type TrackingData = {
  queryCode: string;
  packageCode?: string;
  packageTrackingCode?: string;
  carrierCode?: string;
  country?: string;
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
type StatusTone = 'success' | 'info' | 'warning' | 'danger';

function statusTone(status: string): StatusTone {
  const normalized = status.toLowerCase();
  if (normalized.includes('delivered') || normalized.includes('đã giao')) return 'success';
  if (
    normalized.includes('exception') ||
    normalized.includes('returned') ||
    normalized.includes('failed') ||
    normalized.includes('hoàn trả')
  ) return 'danger';
  if (
    normalized.includes('customs') ||
    normalized.includes('processing') ||
    normalized.includes('clearance') ||
    normalized.includes('hải quan') ||
    normalized.includes('đang xử lý')
  ) return 'warning';
  return 'info';
}

function formatEventTime(value: string) {
  if (!value) return 'Thời gian đang cập nhật';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function TrackingSkeleton() {
  return (
    <div className="tracking-skeleton" aria-label="Đang tải hành trình">
      <div className="skeleton-status skeleton-block" />
      <div className="skeleton-grid">
        <span className="skeleton-block" /><span className="skeleton-block" /><span className="skeleton-block" />
      </div>
      <div className="skeleton-timeline">
        {[0, 1, 2, 3].map((item) => <span className="skeleton-block" key={item} />)}
      </div>
    </div>
  );
}

function TrackingModal({
  open,
  state,
  data,
  searchedCode,
  onClose,
  onRetry,
}: {
  open: boolean;
  state: TrackingState;
  data: TrackingData | null;
  searchedCode: string;
  onClose: () => void;
  onRetry: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="tracking-modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="tracking-modal" role="dialog" aria-modal="true" aria-labelledby="tracking-modal-title">
        <header className="tracking-modal-header">
          <div>
            <p>EZWAY LOGISTICS</p>
            <h2 id="tracking-modal-title">Theo dõi đơn hàng</h2>
          </div>
          <button className="tracking-close" type="button" onClick={onClose} aria-label="Đóng kết quả tra cứu" autoFocus><X size={21} /></button>
        </header>

        <div className="tracking-modal-body" aria-live="polite" aria-busy={state === 'loading'}>
          {state === 'loading' && <TrackingSkeleton />}

          {state === 'not-found' && (
            <div className="tracking-empty-state">
              <span><PackageSearch size={34} /></span>
              <h3>Chưa tìm thấy hành trình</h3>
              <p>Chưa tìm thấy hành trình cho mã này. Vui lòng kiểm tra lại mã vận đơn hoặc liên hệ EZWAY: <a href="tel:0523666966">0523.666.966</a>.</p>
              <button type="button" onClick={onClose}>Kiểm tra lại mã</button>
            </div>
          )}

          {state === 'error' && (
            <div className="tracking-empty-state tracking-error-state">
              <span><AlertCircle size={34} /></span>
              <h3>Chưa thể tải hành trình</h3>
              <p>Kết nối tra cứu đang gián đoạn. Vui lòng thử lại sau ít phút hoặc gọi EZWAY để được hỗ trợ.</p>
              <button type="button" onClick={onRetry}><RotateCcw size={15} /> Thử lại</button>
            </div>
          )}

          {state === 'success' && data && (
            <>
              <section className={`latest-status status-${statusTone(data.latestStatus)}`}>
                <div><span className="status-pulse" /><p>TRẠNG THÁI MỚI NHẤT</p></div>
                <h3>{data.latestStatus}</h3>
                <small>Mã đang tra cứu: <strong>{searchedCode}</strong></small>
              </section>

              <section className="tracking-summary-grid" aria-label="Thông tin kiện hàng">
                {data.packageCode && <article><small>PACKAGE CODE</small><strong>{data.packageCode}</strong></article>}
                {data.packageTrackingCode && <article><small>TRACKING CODE</small><strong>{data.packageTrackingCode}</strong></article>}
                {data.carrierCode && <article><small>ĐƠN VỊ VẬN CHUYỂN</small><strong>{data.carrierCode}</strong></article>}
                {data.country && <article><small>TUYẾN / QUỐC GIA ĐẾN</small><strong>{data.country}</strong></article>}
              </section>

              <div className="tracking-content-grid">
                <section className="timeline-panel">
                  <div className="tracking-section-title"><span><Clock3 size={17} /></span><div><h3>Hành trình đơn hàng</h3><p>Mới nhất → cũ nhất</p></div></div>
                  {data.timeline.length ? (
                    <ol className="tracking-timeline">
                      {data.timeline.map((event, index) => (
                        <li className={`timeline-${statusTone(event.title)}`} key={`${event.time}-${event.title}-${index}`}>
                          <span className="timeline-dot">{index === 0 && <span />}</span>
                          <div className="timeline-event">
                            <time>{formatEventTime(event.time)}</time>
                            <h4>{event.title}</h4>
                            {event.location && <p className="timeline-location"><MapPin size={13} /> {event.location}</p>}
                          </div>
                        </li>
                      ))}
                    </ol>
                  ) : <p className="timeline-pending">Hành trình chi tiết đang được cập nhật.</p>}
                </section>

                <aside className="tracking-details-panel">
                  <div className="tracking-section-title"><span><Plane size={17} /></span><div><h3>Thông tin bổ sung</h3><p>Dữ liệu từ hệ thống KSN</p></div></div>
                  <dl className="tracking-details-list">
                    {data.service && <div><dt>Dịch vụ</dt><dd>{data.service}</dd></div>}
                    {data.country && <div><dt>Quốc gia đến</dt><dd>{data.country}</dd></div>}
                    {data.totalPackages && <div><dt>Tổng số kiện</dt><dd>{data.totalPackages}</dd></div>}
                    {data.lastMileCarrier && <div><dt>Giao chặng cuối</dt><dd><Truck size={14} /> {data.lastMileCarrier}</dd></div>}
                    {data.contactInformation && <div><dt>Liên hệ</dt><dd><Phone size={14} /> {data.contactInformation}</dd></div>}
                  </dl>
                  {data.lastMileWebsite && <a className="last-mile-link" href={data.lastMileWebsite} target="_blank" rel="noopener noreferrer">Website hãng giao chặng cuối <ExternalLink size={14} /></a>}
                </aside>
              </div>

              {data.orderNumbers.length > 0 && (
                <section className="related-orders">
                  <div className="tracking-section-title"><span><Boxes size={17} /></span><div><h3>Các mã liên quan</h3><p>HAWB và mã theo dõi của từng chặng</p></div></div>
                  <div className="related-orders-grid">
                    {data.orderNumbers.map((order, index) => (
                      <article key={`${order.hawb}-${order.trackingCode}-${index}`}>
                        <div className="related-order-head"><strong>{order.hawb ?? order.trackingCode}</strong>{order.isCurrent && <span>Đang theo dõi</span>}</div>
                        {order.hawb && order.trackingCode && <p>Tracking code: <strong>{order.trackingCode}</strong></p>}
                        {order.status && <p>Trạng thái: <strong className={`order-status status-text-${statusTone(order.status)}`}>{order.status}</strong></p>}
                        {order.trackingUrl && <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer">Theo dõi hãng giao <ExternalLink size={13} /></a>}
                      </article>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </section>
    </div>,
    document.body,
  );
}

export function TrackingForm() {
  const [code, setCode] = useState('');
  const [searchedCode, setSearchedCode] = useState('');
  const [validation, setValidation] = useState('');
  const [state, setState] = useState<TrackingState>('idle');
  const [data, setData] = useState<TrackingData | null>(null);
  const [open, setOpen] = useState(false);
  const requestController = useRef<AbortController | null>(null);

  useEffect(() => () => requestController.current?.abort(), []);

  async function track(nextCode?: string) {
    const trimmedCode = (nextCode ?? code).trim();
    if (!trimmedCode) {
      setValidation('Vui lòng nhập mã tracking trước khi tra cứu.');
      return;
    }

    setValidation('');
    setSearchedCode(trimmedCode);
    setData(null);
    setState('loading');
    setOpen(true);
    requestController.current?.abort();
    const controller = new AbortController();
    requestController.current = controller;

    try {
      const response = await fetch(`/api/tracking?code=${encodeURIComponent(trimmedCode)}`, {
        method: 'GET',
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

  function close() {
    requestController.current?.abort();
    setOpen(false);
    setState('idle');
  }

  return (
    <>
      <form className="hero-tracking-form" onSubmit={submit} noValidate>
        <label className="sr-only" htmlFor="tracking-code">Mã vận đơn</label>
        <div className="tracking-input-row">
          <Search size={21} aria-hidden="true" />
          <input
            id="tracking-code"
            value={code}
            onChange={(event) => { setCode(event.target.value); if (validation) setValidation(''); }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                void track();
              }
            }}
            placeholder="Nhập mã bill EZWAY / mã KSN / mã last-mile..."
            autoComplete="off"
            aria-invalid={Boolean(validation)}
            aria-describedby={validation ? 'tracking-validation' : undefined}
          />
          <button type="submit">Tra cứu</button>
        </div>
        {validation && <p className="tracking-validation" id="tracking-validation"><AlertCircle size={13} /> {validation}</p>}
      </form>
      <TrackingModal open={open} state={state} data={data} searchedCode={searchedCode} onClose={close} onRetry={() => void track(searchedCode)} />
    </>
  );
}

export function QuoteForm() {
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const message = [
      'Xin chào EZWAY, tôi muốn nhận tư vấn vận chuyển:',
      `• Nhu cầu: ${formData.get('service')}`,
      `• Điểm đến: ${formData.get('destination')}`,
      `• Trọng lượng dự kiến: ${formData.get('weight') || 'Chưa xác định'}`,
      `• Liên hệ: ${formData.get('contact')}`,
    ].join('\n');

    setSent(true);
    window.open(
      `https://wa.me/84523666966?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer',
    );
  }

  return (
    <form className="quote-form" onSubmit={submit}>
      <div className="field full-field">
        <label htmlFor="service">Bạn đang cần</label>
        <select id="service" name="service" defaultValue="Gửi hàng quốc tế">
          <option>Gửi hàng quốc tế</option><option>Mua hộ hàng Mỹ</option><option>Thủ tục hải quan</option><option>Tư vấn lô hàng đặc biệt</option>
        </select>
      </div>
      <div className="field"><label htmlFor="destination">Gửi đến đâu?</label><input id="destination" name="destination" placeholder="Mỹ, Úc, Canada..." required /></div>
      <div className="field"><label htmlFor="weight">Trọng lượng dự kiến</label><input id="weight" name="weight" placeholder="Ví dụ: 5 kg" /></div>
      <div className="field full-field"><label htmlFor="contact">Số điện thoại / Zalo</label><input id="contact" name="contact" inputMode="tel" placeholder="Số để EZWAY liên hệ lại" required /></div>
      <button className="quote-submit" type="submit">Gửi yêu cầu qua WhatsApp <span>↗</span></button>
      <p className="form-note" role="status">{sent ? 'Yêu cầu đã được tạo. Hãy gửi tin nhắn trong cửa sổ WhatsApp vừa mở.' : 'Không cần thanh toán. EZWAY sẽ tư vấn tuyến phù hợp trước.'}</p>
    </form>
  );
}
