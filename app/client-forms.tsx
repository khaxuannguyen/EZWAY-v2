'use client';

import { FormEvent, useId, useState } from 'react';
import { AlertCircle, Check, Clipboard, Phone, Search } from 'lucide-react';

export function TrackingForm() {
  const [code, setCode] = useState('');
  const [validation, setValidation] = useState('');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedCode = code.trim();
    if (!normalizedCode) {
      setValidation('Vui lòng nhập mã vận đơn trước khi tra cứu.');
      return;
    }
    window.location.assign(`/tra-cuu?code=${encodeURIComponent(normalizedCode)}`);
  }

  return (
    <form className="hero-tracking-form" onSubmit={submit} noValidate>
      <label className="sr-only" htmlFor="tracking-code">Mã vận đơn</label>
      <div className="tracking-input-row">
        <Search size={21} aria-hidden="true" />
        <input id="tracking-code" value={code} onChange={(event) => { setCode(event.target.value); if (validation) setValidation(''); }} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} placeholder="Nhập mã vận đơn / tracking" autoComplete="off" aria-invalid={Boolean(validation)} aria-describedby={validation ? 'tracking-validation' : undefined} />
        <button type="submit">Tra cứu hành trình</button>
      </div>
      {validation && <p className="tracking-validation" id="tracking-validation"><AlertCircle size={14} /> {validation}</p>}
    </form>
  );
}

type ConsultationVariant = 'quote' | 'contact';
type FieldErrors = Partial<Record<'name' | 'phone' | 'destination' | 'item', string>>;

export function ConsultationForm({ variant }: { variant: ConsultationVariant }) {
  const prefix = useId().replace(/:/g, '');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [preparedMessage, setPreparedMessage] = useState('');
  const [copyStatus, setCopyStatus] = useState('');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values = {
      name: String(data.get('name') || '').trim(),
      phone: String(data.get('phone') || '').trim(),
      destination: String(data.get('destination') || '').trim(),
      item: String(data.get('item') || '').trim(),
      weight: String(data.get('weight') || '').trim(),
      note: String(data.get('note') || '').trim(),
    };
    const nextErrors: FieldErrors = {};
    if (!values.name) nextErrors.name = 'Vui lòng nhập họ tên.';
    if (!values.phone) nextErrors.phone = 'Vui lòng nhập số điện thoại/Zalo.';
    else if (!/^[+()\d.\s-]{8,20}$/.test(values.phone) || values.phone.replace(/\D/g, '').length < 8) nextErrors.phone = 'Số liên hệ chưa đúng định dạng.';
    if (!values.destination) nextErrors.destination = 'Vui lòng nhập quốc gia đến.';
    if (!values.item) nextErrors.item = 'Vui lòng mô tả loại hàng.';
    setErrors(nextErrors);
    setCopyStatus('');
    if (Object.keys(nextErrors).length) {
      setPreparedMessage('');
      return;
    }

    setPreparedMessage([
      `YÊU CẦU ${variant === 'quote' ? 'BÁO GIÁ' : 'TƯ VẤN'} EZWAY`,
      `Họ tên: ${values.name}`,
      `Số điện thoại/Zalo: ${values.phone}`,
      `Quốc gia gửi đến: ${values.destination}`,
      `Loại hàng: ${values.item}`,
      `Cân nặng ước tính: ${values.weight || 'Chưa xác định'}`,
      `Ghi chú: ${values.note || 'Không có'}`,
    ].join('\n'));
  }

  async function copyMessage() {
    if (!preparedMessage) return;
    try {
      await navigator.clipboard.writeText(preparedMessage);
      setCopyStatus('Đã sao chép nội dung.');
    } catch {
      setCopyStatus('Không thể tự sao chép. Vui lòng chọn nội dung và sao chép thủ công.');
    }
  }

  const fieldId = (field: string) => `${prefix}-${variant}-${field}`;
  const fieldError = (field: keyof FieldErrors) => errors[field] ? <span className="home-field-error" id={`${fieldId(field)}-error`}><AlertCircle size={12} /> {errors[field]}</span> : null;

  return (
    <form className="home-consult-form" onSubmit={submit} noValidate>
      <div className="home-field"><label htmlFor={fieldId('name')}>Họ tên <b>*</b></label><input id={fieldId('name')} name="name" autoComplete="name" placeholder="Tên người cần tư vấn" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? `${fieldId('name')}-error` : undefined} />{fieldError('name')}</div>
      <div className="home-field"><label htmlFor={fieldId('phone')}>Số điện thoại / Zalo <b>*</b></label><input id={fieldId('phone')} name="phone" inputMode="tel" autoComplete="tel" placeholder="Số liên hệ của bạn" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? `${fieldId('phone')}-error` : undefined} />{fieldError('phone')}</div>
      <div className="home-field"><label htmlFor={fieldId('destination')}>Quốc gia gửi đến <b>*</b></label><input id={fieldId('destination')} name="destination" placeholder="Ví dụ: Mỹ, Úc, Canada..." aria-invalid={Boolean(errors.destination)} aria-describedby={errors.destination ? `${fieldId('destination')}-error` : undefined} />{fieldError('destination')}</div>
      <div className="home-field"><label htmlFor={fieldId('weight')}>Cân nặng ước tính</label><input id={fieldId('weight')} name="weight" placeholder="Ví dụ: khoảng 5 kg" /></div>
      <div className="home-field home-field-full"><label htmlFor={fieldId('item')}>Loại hàng <b>*</b></label><input id={fieldId('item')} name="item" placeholder="Ví dụ: quần áo, thực phẩm khô..." aria-invalid={Boolean(errors.item)} aria-describedby={errors.item ? `${fieldId('item')}-error` : undefined} />{fieldError('item')}</div>
      <div className="home-field home-field-full"><label htmlFor={fieldId('note')}>Ghi chú</label><textarea id={fieldId('note')} name="note" rows={3} placeholder="Kích thước, số kiện hoặc điều cần EZWAY kiểm tra" /></div>
      <button className="home-form-submit" type="submit">Chuẩn bị yêu cầu tư vấn <span>→</span></button>
      <p className="home-form-disclosure">Form không tự gửi sang WhatsApp/Zalo và không thay thế xác nhận trực tiếp từ EZWAY.</p>
      {preparedMessage && <div className="home-form-success" role="status">
        <div><span><Check size={16} /></span><p><strong>Nội dung đã sẵn sàng</strong> Sao chép nội dung dưới đây rồi gọi hotline để được tư vấn.</p></div>
        <textarea value={preparedMessage} readOnly aria-label="Nội dung yêu cầu tư vấn đã chuẩn bị" rows={8} />
        <div className="home-form-success-actions"><button type="button" onClick={copyMessage}><Clipboard size={15} /> Sao chép nội dung</button><a href="tel:0523666966"><Phone size={15} /> Gọi 0523.666.966</a></div>
        {copyStatus && <p className="home-copy-status">{copyStatus}</p>}
      </div>}
    </form>
  );
}
