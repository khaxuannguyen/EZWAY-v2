'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Search, MapPin, Package, Truck, Info, RotateCcw, ArrowUpRight, Check, AlertCircle } from 'lucide-react';
import { findZones, isManualZone, normalizePostcode, type ZoneData, type StandardZone } from '../../lib/au-zones';

const stateNames: Record<string, string> = { ACT:'Australian Capital Territory', NSW:'New South Wales', NT:'Northern Territory', QLD:'Queensland', SA:'South Australia', TAS:'Tasmania', VIC:'Victoria', WA:'Western Australia', NAT:'NAT (theo bảng đối tác)' };
type Result = NonNullable<ReturnType<typeof findZones>>;
function ZoneValue({ value }: { value: string }) {
  return isManualZone(value) ? <span className="zone-manual"><AlertCircle size={16}/>Cần EZWAY kiểm tra <small>{value}</small></span> : <strong className="zone-number"><small>ZONE</small>{value}</strong>;
}
function Empty({ searched, available = false }: { searched: boolean; available?: boolean }) {
  return <div className="zone-empty"><Search size={24}/><p>{!searched ? 'Nhập postcode để xem zone tính cước' : available ? 'Chọn suburb để xem zone Toll Standard' : 'Không có dữ liệu trong bảng đã cung cấp'}</p></div>;
}
export function ZoneLookup() {
  const [data, setData] = useState<ZoneData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [postcode, setPostcode] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [state, setState] = useState('');
  const [suburb, setSuburb] = useState('');
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setLoadError(false);
    fetch('/data/au-zones.json', { signal: controller.signal }).then(r => { if (!r.ok) throw new Error('DATA_LOAD'); return r.json(); }).then(value => { const d = value as ZoneData; if (!d?.auspost || !d?.standard || !d?.priority) throw new Error('DATA_FORMAT'); setData(d); setLoading(false); }).catch(() => { if (!controller.signal.aborted) { setLoadError(true); setLoading(false); } });
    return () => controller.abort();
  }, [attempt]);
  function lookup(value = postcode) {
    if (!data) return;
    if (!normalizePostcode(value)) { setError('Nhập đủ 4 chữ số postcode Úc, ví dụ 0800 hoặc 2000.'); setResult(null); setState(''); setSuburb(''); return; }
    const next = findZones(data, value)!;
    setPostcode(value.trim()); setResult(next); setError('');
    const nextState = next.states.length === 1 ? next.states[0] : '';
    setState(nextState); setSuburb(next.standard.length === 1 ? '0' : '');
  }
  function clear() { setPostcode(''); setResult(null); setState(''); setSuburb(''); setError(''); input.current?.focus(); }
  const rows = result?.standard.map((r, i) => ({ r, i })).filter(({r}) => !state || r[1] === state) ?? [];
  const selected: StandardZone | undefined = suburb === '' ? undefined : result?.standard[Number(suburb)];
  const auspost = result?.auspost && (!state || result.auspost[0] === state) ? result.auspost : null;
  const priority = result?.priority;
  return <section className="ez-container zone-workspace" aria-label="Công cụ tra cứu zone Úc">
    <div className="zone-tabs"><a href="/tra-cuu">Tra cứu vận đơn <ArrowUpRight size={14}/></a><a href="/check-zone" aria-current="page"><MapPin size={16}/> Check zone Úc</a><span>Đối chiếu theo dữ liệu đối tác</span></div>
    <div className="zone-layout"><aside className="zone-input-panel">
      <div className="zone-panel-title"><span className="zone-icon"><MapPin size={22}/></span><div><h2>Địa chỉ nhận hàng</h2><p>Bắt đầu từ postcode tại Úc</p></div></div>
      <form onSubmit={e => { e.preventDefault(); lookup(); }} noValidate>
        <label htmlFor="zone-postcode"><b>01</b> POSTCODE</label><div className="zone-input-wrap"><MapPin size={20}/><input ref={input} id="zone-postcode" inputMode="numeric" autoComplete="postal-code" placeholder="VD: 2000" maxLength={4} value={postcode} aria-invalid={!!error} aria-describedby="zone-input-message" onChange={e => { setPostcode(e.target.value); setResult(null); setState(''); setSuburb(''); setError(''); }}/></div>
        <p id="zone-input-message" className={error ? 'zone-error' : 'zone-help'}>{error || 'Giữ số 0 ở đầu, ví dụ: 0800.'}</p>
        <button className="zone-search" disabled={loading || loadError} type="submit"><Search size={17}/>{loading ? 'Đang tải dữ liệu…' : 'Tra cứu zone'}<ArrowRight size={17}/></button>
        {loadError && <p role="alert" className="zone-error">Chưa tải được bảng zone. <button type="button" className="zone-inline" onClick={() => setAttempt(n => n + 1)}>Thử lại</button></p>}
        <div className="zone-examples">Thử nhanh:{['2000','2168','0800'].map(pc => <button type="button" disabled={!data || loading} key={pc} onClick={() => lookup(pc)}>{pc}</button>)}</div>
        <label htmlFor="zone-state"><b>02</b> BANG (STATE)</label><select id="zone-state" disabled={!result?.states.length} value={state} onChange={e => { setState(e.target.value); const matches = result?.standard.map((r,i) => ({r,i})).filter(({r}) => !e.target.value || r[1] === e.target.value) ?? []; setSuburb(matches.length === 1 ? String(matches[0].i) : ''); }}><option value="">{result?.states.length ? 'Chọn bang' : 'Tự động sau khi tra cứu'}</option>{result?.states.map(s => <option value={s} key={s}>{s} — {stateNames[s] || s}</option>)}</select>
        <label htmlFor="zone-suburb"><b>03</b> KHU VỰC (SUBURB)</label><select id="zone-suburb" disabled={!rows.length} value={suburb} onChange={e => { setSuburb(e.target.value); const row = result?.standard[Number(e.target.value)]; if (e.target.value !== '' && row) setState(row[1]); }}><option value="">{rows.length ? `Chọn suburb (${rows.length} kết quả)` : 'Chưa có dữ liệu suburb'}</option>{rows.map(({r,i}) => <option key={i} value={i}>{r[0]} · {r[1]}</option>)}</select>
        <p className="zone-help">Danh sách suburb lấy từ Toll Standard. Aupost và Toll Priority được tra độc lập theo postcode.</p>
      </form>
      <button type="button" className="zone-reset" onClick={clear}><RotateCcw size={14}/>Tra cứu địa chỉ khác</button>
      {result?.found && <a className="zone-map-link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([selected?.[0], state, result.postcode, 'Australia'].filter(Boolean).join(' '))}`} target="_blank" rel="noreferrer">Xem địa chỉ trên bản đồ <ArrowUpRight size={16}/></a>}
    </aside>
    <div className="zone-results" aria-live="polite" aria-atomic="true">
      <div className="zone-result-heading"><div><p className="zone-eyebrow">KẾT QUẢ TRA CỨU</p><h2>{result ? `Postcode ${result.postcode}` : 'Một địa chỉ. Hai đối tác.'}</h2></div><span className="zone-country"><img src="/assets/destinations/v1/flags/au.svg" width="26" height="18" alt=""/> Úc</span></div>
      {result && !result.found && <div className="zone-not-found" role="status"><AlertCircle size={20}/><div><strong>Chưa tìm thấy postcode {result.postcode}</strong><p>Kiểm tra lại mã bưu chính hoặc liên hệ EZWAY để xác nhận khu vực giao hàng.</p></div></div>}
      <article className="zone-carrier zone-auspost"><div className="zone-carrier-header"><div><span className="zone-carrier-mark">a</span><h3>Aupost <small>Australia Post</small></h3></div><span className="zone-carrier-tag">E-PARCEL & EXPRESS</span></div>
        {auspost ? <><div className="zone-location"><MapPin size={15}/>{auspost[2]} · {auspost[0]}<span>Mã vùng: {auspost[1]}</span></div><div className="zone-service-grid">{[[ 'AIR-AU · AIR-AUF', auspost[3] ], ['AIR-AU-DL · AIR-AU-DL-BH', auspost[4]]].map(([label,zone]) => <div className="zone-service" key={label}><p>{label}</p><ZoneValue value={zone}/></div>)}</div></> : <Empty searched={!!result}/>}
        <div className="zone-card-note"><Info size={14}/>Zone tính cước theo postcode trong bảng Aupost.</div>
      </article>
      <article className="zone-carrier zone-toll"><div className="zone-carrier-header"><div><span className="zone-toll-mark"><Truck size={23}/></span><h3>Toll Global <small>Standard & Priority</small></h3></div><span className="zone-carrier-tag">TỪ MELBOURNE</span></div>
        <div className="zone-service-grid zone-toll-services"><div className="zone-service"><p>STANDARD <small>AIR-AU-TOLL</small></p>{selected ? <><ZoneValue value={selected[3]}/><div className="zone-service-meta">{selected[0]} · {selected[1]}<br/>Transit zone: <b>{selected[2]}</b></div></> : <Empty searched={!!result} available={!!rows.length}/>}</div><div className="zone-service"><p>PRIORITY <small>AIR-AU-DL-TOLL-BH</small></p>{priority ? <><ZoneValue value={priority[1]}/><div className="zone-service-meta">Transit zone: <b>{priority[0]}</b><br/>{priority[2]} ngày dự kiến sau pickup tại MEL</div></> : <Empty searched={!!result}/>}</div></div>
        <div className="zone-card-note"><Info size={14}/>Chọn đúng suburb để xác định zone Toll Standard.</div>
      </article>
      <div className="zone-data-note"><Check size={16}/><p>Nguồn: bảng checkzone.xlsx do EZWAY cung cấp. Zone là vùng tính cước; giá vận chuyển được xác nhận theo dịch vụ và kiện hàng.</p></div>
    </div></div>
    <div className="zone-bottom-grid"><details className="zone-policy"><summary><Package size={19}/> Quy định quá cân & quá khổ của Toll <span>+</span></summary><div><p>Theo ghi chú trong bảng Toll: phụ phí <strong>30 AUD/kiện</strong> nếu thuộc ngưỡng quá cân hoặc quá khổ. Nếu gặp cả hai, chỉ thu một loại phí.</p><ul><li>Cân thực hoặc cân thể tích (D × R × C / 4000): trên 30 kg đến 34,9 kg.</li><li>Dài từ 120–179 cm; rộng từ 80–179 cm; cao từ 60–179 cm. Chiều dài là cạnh dài nhất.</li><li>Vượt 34,9 kg hoặc một cạnh trên 179 cm: cần chuyển dịch vụ trucking theo bảng.</li></ul><p>Phí remote tham chiếu một workbook ngoài chưa có trong dữ liệu này. Liên hệ EZWAY để xác nhận phí remote và tổng phụ phí.</p></div></details><div className="zone-support"><div><h3>Cần kiểm tra thêm địa chỉ?</h3><p>EZWAY hỗ trợ xác nhận zone và dịch vụ phù hợp.</p></div><a href="/lien-he">Liên hệ EZWAY <ArrowUpRight size={17}/></a></div></div>
  </section>;
}
