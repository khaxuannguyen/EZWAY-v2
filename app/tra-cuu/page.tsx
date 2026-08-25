import type { Metadata } from 'next';
import { Phone } from 'lucide-react';
import { TrackingLookup } from './tracking-lookup';

export const metadata: Metadata = {
  title: 'Tra cứu đơn hàng | EZWAY Logistics',
  description: 'Theo dõi trạng thái và hành trình kiện hàng EZWAY.',
};

export default function TrackingPage() {
  return (
    <main className="lookup-page">
      <header className="lookup-header">
        <div className="container lookup-header-inner">
          <a href="/" aria-label="EZWAY - Trang chủ">
            <img src="/ezway-logo-transparent.png" alt="EZWAY — Moving Made Easy" />
          </a>
          <div className="lookup-header-actions">
            <a href="tel:0523666966"><Phone size={16} /> 0523.666.966</a>
            <a href="/#bao-gia">Nhận báo giá</a>
          </div>
        </div>
      </header>

      <section className="lookup-hero">
        <div className="container lookup-hero-inner">
          <p>EZWAY TRACKING</p>
          <h1>Theo dõi hành trình đơn hàng</h1>
          <span>Nhập mã vận đơn để xem trạng thái mới nhất của kiện hàng.</span>
        </div>
      </section>

      <section className="container lookup-main" aria-label="Tra cứu hành trình đơn hàng">
        <TrackingLookup />
      </section>

      <footer className="lookup-footer">
        <div className="container lookup-footer-main">
          <div className="lookup-footer-brand">
            <img src="/ezway-logo-transparent.png" alt="EZWAY — Moving Made Easy" />
            <p>Vận chuyển quốc tế rõ ràng, an toàn và dễ theo dõi.</p>
          </div>
          <div><h2>Liên hệ EZWAY</h2><a href="tel:0523666966">Hotline: 0523.666.966</a><p>112/40 Thạnh Xuân 22, Thới An,<br />TP. Hồ Chí Minh</p></div>
          <div><h2>Liên kết nhanh</h2><a href="/">Trang chủ</a><a href="/#dich-vu">Dịch vụ</a><a href="/#bao-gia">Báo giá</a><a href="https://ezway.vn/tin-tuc">Tin tức</a><a href="/#lien-he">Liên hệ</a></div>
        </div>
        <div className="container lookup-footer-bottom"><span>© 2026 EZWAY Logistics. All rights reserved.</span><span>Moving Made Easy</span></div>
      </footer>
    </main>
  );
}
