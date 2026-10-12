'use client';

import { FormEvent, useState } from 'react';
import { ShippingConsultationWizard } from './components/consultation/shipping-wizard';
import { AlertCircle, Check, Clipboard, Link2, Phone, Search, ShoppingCart } from 'lucide-react';

export function TrackingForm() {
  const [code, setCode] = useState('');
  const [validation, setValidation] = useState('');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedCode = code.trim();
    if (!/^[A-Za-z\d][A-Za-z\d_-]{0,119}$/.test(normalizedCode)) {
      setValidation('Nhập mã vận đơn hợp lệ, tối đa 120 ký tự chữ, số, dấu gạch ngang hoặc gạch dưới.');
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
export function ConsultationForm({ variant, destination }: { variant: ConsultationVariant; destination?: string }) {
  return <ShippingConsultationWizard destination={destination} source={variant === 'contact' ? 'contact_form' : 'quote_form'}/>;
}

type PurchaseFieldErrors = Partial<Record<'name' | 'phone' | 'product', string>>;

export function PurchaseRequestForm() {
  const [errors, setErrors] = useState<PurchaseFieldErrors>({});
  const [preparedMessage, setPreparedMessage] = useState('');
  const [copyStatus, setCopyStatus] = useState('');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values = {
      name: String(data.get('name') || '').trim(),
      phone: String(data.get('phone') || '').trim(),
      product: String(data.get('product') || '').trim(),
      quantity: String(data.get('quantity') || '').trim(),
      variation: String(data.get('variation') || '').trim(),
      note: String(data.get('note') || '').trim(),
    };
    const nextErrors: PurchaseFieldErrors = {};
    if (!values.name) nextErrors.name = 'Vui lòng nhập họ tên.';
    if (!values.phone) nextErrors.phone = 'Vui lòng nhập số điện thoại/Zalo.';
    else if (!/^[+()\d.\s-]{8,20}$/.test(values.phone) || values.phone.replace(/\D/g, '').length < 8) nextErrors.phone = 'Số liên hệ chưa đúng định dạng.';
    if (!values.product) nextErrors.product = 'Vui lòng dán link hoặc mô tả sản phẩm.';
    setErrors(nextErrors);
    setCopyStatus('');
    if (Object.keys(nextErrors).length) {
      setPreparedMessage('');
      return;
    }

    setPreparedMessage([
      'YÊU CẦU MUA HỘ HÀNG MỸ — EZWAY',
      `Họ tên: ${values.name}`,
      `Số điện thoại/Zalo: ${values.phone}`,
      `Link / sản phẩm: ${values.product}`,
      `Số lượng: ${values.quantity || 'Chưa xác định'}`,
      `Màu sắc / kích thước / phiên bản: ${values.variation || 'Chưa xác định'}`,
      `Ghi chú: ${values.note || 'Không có'}`,
    ].join('\n'));
  }

  async function copyMessage() {
    if (!preparedMessage) return;
    try {
      await navigator.clipboard.writeText(preparedMessage);
      setCopyStatus('Đã sao chép yêu cầu mua hộ.');
    } catch {
      setCopyStatus('Không thể tự sao chép. Vui lòng chọn nội dung và sao chép thủ công.');
    }
  }

  const fieldId = (field: string) => `ezway-buy-${field}`;
  const fieldError = (field: keyof PurchaseFieldErrors) => errors[field] ? <span className="home-field-error" id={`${fieldId(field)}-error`}><AlertCircle size={12} /> {errors[field]}</span> : null;

  return (
    <form className="home-consult-form home-buy-form" onSubmit={submit} noValidate>
      <div className="home-field"><label htmlFor={fieldId('name')}>Họ tên <b>*</b></label><input id={fieldId('name')} name="name" autoComplete="name" placeholder="Tên người cần báo giá" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? `${fieldId('name')}-error` : undefined} />{fieldError('name')}</div>
      <div className="home-field"><label htmlFor={fieldId('phone')}>Số điện thoại / Zalo <b>*</b></label><input id={fieldId('phone')} name="phone" inputMode="tel" autoComplete="tel" placeholder="Số liên hệ của bạn" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? `${fieldId('phone')}-error` : undefined} />{fieldError('phone')}</div>
      <div className="home-field home-field-full"><label htmlFor={fieldId('product')}>Link hoặc mô tả sản phẩm <b>*</b></label><div className="home-buy-link-field"><Link2 size={17} /><textarea id={fieldId('product')} name="product" rows={3} placeholder="Dán một hoặc nhiều link sản phẩm tại website Mỹ" aria-invalid={Boolean(errors.product)} aria-describedby={errors.product ? `${fieldId('product')}-error` : undefined} /></div>{fieldError('product')}</div>
      <div className="home-field"><label htmlFor={fieldId('quantity')}>Số lượng</label><input id={fieldId('quantity')} name="quantity" inputMode="numeric" placeholder="Ví dụ: 2 sản phẩm" /></div>
      <div className="home-field"><label htmlFor={fieldId('variation')}>Thuộc tính sản phẩm</label><input id={fieldId('variation')} name="variation" placeholder="Màu, size, phiên bản..." /></div>
      <div className="home-field home-field-full"><label htmlFor={fieldId('note')}>Yêu cầu khác</label><textarea id={fieldId('note')} name="note" rows={2} placeholder="Mã giảm giá, ngân sách hoặc điều cần EZWAY kiểm tra" /></div>
      <button className="home-form-submit home-buy-submit" type="submit"><ShoppingCart size={17} /> Chuẩn bị yêu cầu mua hộ</button>
      <p className="home-form-disclosure">Báo giá chỉ được xác nhận sau khi EZWAY kiểm tra link, thuộc tính sản phẩm và các khoản phí liên quan.</p>
      {preparedMessage && <div className="home-form-success" role="status">
        <div><span><Check size={16} /></span><p><strong>Yêu cầu mua hộ đã sẵn sàng</strong> Sao chép nội dung rồi liên hệ hotline để EZWAY kiểm tra và xác nhận báo giá.</p></div>
        <textarea value={preparedMessage} readOnly aria-label="Nội dung yêu cầu mua hộ đã chuẩn bị" rows={8} />
        <div className="home-form-success-actions"><button type="button" onClick={copyMessage}><Clipboard size={15} /> Sao chép nội dung</button><a href="tel:0523666966"><Phone size={15} /> Gọi 0523.666.966</a></div>
        {copyStatus && <p className="home-copy-status">{copyStatus}</p>}
      </div>}
    </form>
  );
}
