'use client';

import { FormEvent, useState } from 'react';
import { AlertCircle, Search } from 'lucide-react';

export function TrackingForm() {
  const [code, setCode] = useState('');
  const [validation, setValidation] = useState('');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedCode = code.trim();
    if (!normalizedCode) {
      setValidation('Vui lòng nhập mã tracking trước khi tra cứu.');
      return;
    }
    window.location.assign(`/tra-cuu?code=${encodeURIComponent(normalizedCode)}`);
  }

  return (
    <form className="hero-tracking-form" onSubmit={submit} noValidate>
      <label className="sr-only" htmlFor="tracking-code">Mã vận đơn</label>
      <div className="tracking-input-row">
        <Search size={21} aria-hidden="true" />
        <input
          id="tracking-code"
          value={code}
          onChange={(event) => { setCode(event.target.value); if (validation) setValidation(''); }}
          placeholder="Nhập mã bill EZWAY / mã KSN / mã last-mile..."
          autoComplete="off"
          aria-invalid={Boolean(validation)}
          aria-describedby={validation ? 'tracking-validation' : undefined}
        />
        <button type="submit">Tra cứu</button>
      </div>
      {validation && <p className="tracking-validation" id="tracking-validation"><AlertCircle size={13} /> {validation}</p>}
    </form>
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
