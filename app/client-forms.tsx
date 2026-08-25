'use client';

import { FormEvent, useState } from 'react';

export function TrackingForm() {
  const [code, setCode] = useState('');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trackingCode = code.trim();
    if (!trackingCode) return;
    window.open(
      `https://ezway.vn/tra-cuu?code=${encodeURIComponent(trackingCode)}`,
      '_blank',
      'noopener,noreferrer',
    );
  }

  return (
    <form className="tracking-form" onSubmit={submit}>
      <label htmlFor="tracking-code">Mã vận đơn</label>
      <div>
        <input
          id="tracking-code"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="Ví dụ: EZW24081234"
          autoComplete="off"
          required
        />
        <button type="submit">Tra cứu <span>→</span></button>
      </div>
      <small>Dữ liệu được tra cứu trên hệ thống hiện tại của EZWAY.</small>
    </form>
  );
}

export function QuoteForm() {
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = [
      'Xin chào EZWAY, tôi muốn nhận tư vấn vận chuyển:',
      `• Nhu cầu: ${data.get('service')}`,
      `• Điểm đến: ${data.get('destination')}`,
      `• Trọng lượng dự kiến: ${data.get('weight') || 'Chưa xác định'}`,
      `• Liên hệ: ${data.get('contact')}`,
    ].join('\n');

    setSent(true);
    window.open(
      `https://wa.me/84378899543?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer',
    );
  }

  return (
    <form className="quote-form" onSubmit={submit}>
      <div className="field full-field">
        <label htmlFor="service">Bạn đang cần</label>
        <select id="service" name="service" defaultValue="Gửi hàng quốc tế">
          <option>Gửi hàng quốc tế</option>
          <option>Mua hộ hàng Mỹ</option>
          <option>Thủ tục hải quan</option>
          <option>Tư vấn lô hàng đặc biệt</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="destination">Gửi đến đâu?</label>
        <input id="destination" name="destination" placeholder="Mỹ, Úc, Canada..." required />
      </div>
      <div className="field">
        <label htmlFor="weight">Trọng lượng dự kiến</label>
        <input id="weight" name="weight" placeholder="Ví dụ: 5 kg" />
      </div>
      <div className="field full-field">
        <label htmlFor="contact">Số điện thoại / Zalo</label>
        <input id="contact" name="contact" inputMode="tel" placeholder="Số để EZWAY liên hệ lại" required />
      </div>
      <button className="button quote-submit" type="submit">Gửi yêu cầu qua WhatsApp <span>↗</span></button>
      <p className="form-note" role="status">
        {sent ? 'Yêu cầu đã được tạo. Hãy gửi tin nhắn trong cửa sổ WhatsApp vừa mở.' : 'Không cần thanh toán. EZWAY sẽ tư vấn tuyến phù hợp trước.'}
      </p>
    </form>
  );
}
