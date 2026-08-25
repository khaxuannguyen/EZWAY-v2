import {
  BadgeDollarSign,
  Boxes,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Globe2,
  Headphones,
  Menu,
  MessageCircle,
  PackageCheck,
  PlaneTakeoff,
  Phone,
  Radar,
  ReceiptText,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import { QuoteForm, TrackingForm } from './client-forms';

const benefits = [
  {
    icon: Globe2,
    title: 'Vận chuyển toàn cầu',
    text: 'Kết nối Mỹ, Úc, Canada, Châu Âu và nhiều thị trường quốc tế.',
  },
  {
    icon: Radar,
    title: 'Theo dõi thời gian thực',
    text: 'Tra cứu trạng thái vận đơn rõ ràng trong suốt hành trình.',
  },
  {
    icon: ShieldCheck,
    title: 'An toàn & bảo hiểm',
    text: 'Quy trình đóng gói và phương án bảo vệ hàng hóa phù hợp.',
  },
  {
    icon: BadgeDollarSign,
    title: 'Giá cước cạnh tranh',
    text: 'Tư vấn tuyến tối ưu, thông tin chi phí minh bạch trước khi gửi.',
  },
];

function Logo({ footer = false }: { footer?: boolean }) {
  return (
    <span className={`logo-frame${footer ? ' footer-logo-frame' : ''}`}>
      <img src="/ezway-logo.jpg" alt="EZWAY — Moving Made Easy" />
    </span>
  );
}

export default function Home() {
  return (
    <main className="site-shell" id="top">
      <div className="utility-bar">
        <div className="container utility-inner">
          <div className="utility-group">
            <a href="tel:0523666966"><Phone size={13} /> 0523.666.966</a>
            <a href="https://wa.me/84523666966" target="_blank" rel="noreferrer"><MessageCircle size={13} /> WhatsApp</a>
          </div>
          <span><Clock3 size={13} /> Hỗ trợ khách hàng 24/7</span>
        </div>
      </div>

      <header className="main-header">
        <div className="container nav-inner">
          <a className="logo-link" href="#top" aria-label="EZWAY - Trang chủ"><Logo /></a>
          <nav className="desktop-nav" aria-label="Điều hướng chính">
            <a className="active" href="#top">Trang chủ</a>
            <a href="#mua-ho">Mua hộ hàng Mỹ</a>
            <a href="#dich-vu">Dịch vụ</a>
            <a href="#bao-gia">Giá cước</a>
            <a href="https://ezway.vn/tin-tuc">Tin tức</a>
            <a href="#lien-he">Liên hệ</a>
          </nav>
          <a className="header-hotline-cta" href="tel:0523666966">Hotline: 0523.666.966</a>
          <a className="header-track" href="#tracking">Tra cứu</a>
          <details className="mobile-menu">
            <summary aria-label="Mở menu"><Menu size={22} /></summary>
            <nav aria-label="Điều hướng trên điện thoại">
              <a href="#top">Trang chủ</a><a href="#mua-ho">Mua hộ hàng Mỹ</a><a href="#dich-vu">Dịch vụ</a>
              <a href="#bao-gia">Giá cước</a><a href="https://ezway.vn/tin-tuc">Tin tức</a><a href="#lien-he">Liên hệ</a>
            </nav>
          </details>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-depth hero-depth-one" aria-hidden="true" />
        <div className="hero-depth hero-depth-two" aria-hidden="true" />
        <div className="container hero-content">
          <p className="hero-badge"><span /> INTERNATIONAL LOGISTICS PLATFORM</p>
          <h1><span>Vận chuyển quốc tế</span>Nhanh hơn, an toàn hơn,<br />minh bạch hơn</h1>
          <p className="hero-description">Tối ưu hành trình vận chuyển toàn cầu với quy trình rõ ràng, hỗ trợ hải quan và đồng hành xuyên suốt từ lúc nhận đến khi giao hàng.</p>
          <div id="tracking"><TrackingForm /></div>
          <div className="hero-actions">
            <a className="cta cta-orange" href="#bao-gia">Nhận báo giá ngay</a>
            <a className="cta cta-white" href="#dich-vu">Khám phá dịch vụ</a>
          </div>
          <a className="hero-hotline" href="tel:0523666966"><Phone size={15} /> Hotline: <strong>0523.666.966</strong></a>
        </div>
      </section>

      <section className="benefits-wrap" aria-label="Lợi ích dịch vụ EZWAY">
        <div className="container benefit-grid">
          {benefits.map(({ icon: Icon, title, text }) => (
            <article className="benefit-card" key={title}>
              <span className="benefit-icon"><Icon size={26} strokeWidth={1.8} /></span>
              <div><h2>{title}</h2><p>{text}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="container metrics-strip" hidden aria-label="Chỉ số vận hành — chờ xác thực">
        <p><strong>—</strong><span>Kiện hàng đã xử lý</span></p>
        <p><strong>—</strong><span>Tỷ lệ giao đúng hẹn</span></p>
        <p><strong>—</strong><span>Hỗ trợ khách hàng</span></p>
      </section>

      <section className="route-band" aria-label="Các tuyến vận chuyển chủ lực">
        <div className="container route-band-inner">
          <p>Tuyến vận chuyển chủ lực</p>
          <div><span>Việt Nam → Mỹ</span><i /><span>Việt Nam → Úc</span><i /><span>Việt Nam → Canada</span><i /><span>Việt Nam → Châu Âu</span></div>
        </div>
      </section>

      <section className="section services-section" id="dich-vu">
        <div className="container">
          <div className="section-heading centered-heading">
            <p className="section-eyebrow">DỊCH VỤ LOGISTICS TOÀN DIỆN</p>
            <h2>Một đầu mối cho toàn bộ hành trình</h2>
            <p>Từ mua hàng, vận chuyển đến xử lý hồ sơ hải quan — EZWAY giúp bạn chọn đúng phương án và theo sát từng bước.</p>
          </div>
          <div className="services-grid">
            <article className="service-card" id="mua-ho">
              <div className="service-card-top"><span className="service-icon"><ShoppingBag size={27} /></span><small>01</small></div>
              <h3>Mua hộ hàng Mỹ</h3>
              <p>Hỗ trợ đặt hàng từ Amazon, eBay, Costco và nhiều website tại Mỹ, sau đó vận chuyển về Việt Nam.</p>
              <ul><li><CheckCircle2 size={15} /> Tư vấn trước khi mua</li><li><CheckCircle2 size={15} /> Nhận hàng tại kho Mỹ</li><li><CheckCircle2 size={15} /> Gộp kiện theo nhu cầu</li></ul>
              <a href="#bao-gia">Tìm hiểu dịch vụ <ChevronRight size={16} /></a>
            </article>
            <article className="service-card service-card-primary">
              <div className="service-card-top"><span className="service-icon"><PlaneTakeoff size={27} /></span><small>02</small></div>
              <h3>Vận chuyển quốc tế</h3>
              <p>Gửi hàng từ Việt Nam đến Mỹ, Úc, Canada và Châu Âu với quy trình door-to-door rõ ràng.</p>
              <ul><li><CheckCircle2 size={15} /> Hàng cá nhân & thương mại</li><li><CheckCircle2 size={15} /> Hỗ trợ đóng gói</li><li><CheckCircle2 size={15} /> Theo dõi hành trình</li></ul>
              <a href="#bao-gia">Nhận tư vấn tuyến <ChevronRight size={16} /></a>
            </article>
            <article className="service-card">
              <div className="service-card-top"><span className="service-icon"><ClipboardCheck size={27} /></span><small>03</small></div>
              <h3>Thủ tục hải quan</h3>
              <p>Tư vấn hồ sơ cho hàng điện tử, hàng cồng kềnh và các lô hàng có yêu cầu chuyên biệt.</p>
              <ul><li><CheckCircle2 size={15} /> Kiểm tra hồ sơ</li><li><CheckCircle2 size={15} /> Tư vấn giấy phép</li><li><CheckCircle2 size={15} /> Hỗ trợ thông quan</li></ul>
              <a href="#bao-gia">Trao đổi lô hàng <ChevronRight size={16} /></a>
            </article>
          </div>
        </div>
      </section>

      <section className="confidence-section">
        <div className="container confidence-grid">
          <div className="confidence-copy">
            <p className="section-eyebrow light">VÌ SAO CHỌN EZWAY?</p>
            <h2>Logistics chuyên nghiệp bắt đầu từ thông tin rõ ràng</h2>
            <p>EZWAY tập trung giải quyết những điểm khiến khách hàng lo lắng nhất: không biết chọn tuyến nào, hồ sơ cần gì và ai đang theo sát lô hàng.</p>
            <a className="cta cta-orange" href="#bao-gia">Trao đổi với chuyên viên</a>
          </div>
          <div className="confidence-list">
            <article><span><ReceiptText size={23} /></span><div><h3>Chi phí được tư vấn trước</h3><p>Giải thích rõ phương án, phạm vi dịch vụ và các thông tin cần xác nhận trước khi gửi.</p></div></article>
            <article><span><PackageCheck size={23} /></span><div><h3>Quy trình có đầu mối phụ trách</h3><p>Một đội ngũ đồng hành từ lúc nhận yêu cầu đến khi hoàn tất giao hàng.</p></div></article>
            <article><span><Headphones size={23} /></span><div><h3>Hỗ trợ khi cần xử lý phát sinh</h3><p>Tiếp nhận thông tin nhanh qua hotline và WhatsApp chính thức của EZWAY.</p></div></article>
          </div>
        </div>
      </section>

      <section className="section process-section">
        <div className="container">
          <div className="section-heading split-heading">
            <div><p className="section-eyebrow">QUY TRÌNH VẬN CHUYỂN</p><h2>Từ yêu cầu đến giao tận tay</h2></div>
            <p>Mỗi bước đều có thông tin cần chuẩn bị và người phụ trách rõ ràng, giúp bạn chủ động hơn trong toàn bộ hành trình.</p>
          </div>
          <div className="process-grid">
            <article><span>01</span><div className="process-icon"><MessageCircle size={24} /></div><h3>Gửi yêu cầu</h3><p>Cung cấp loại hàng, điểm đến và thời gian dự kiến.</p></article>
            <article><span>02</span><div className="process-icon"><ReceiptText size={24} /></div><h3>Chọn phương án</h3><p>Nhận tư vấn tuyến, chi phí và hồ sơ cần chuẩn bị.</p></article>
            <article><span>03</span><div className="process-icon"><Boxes size={24} /></div><h3>Nhận & xử lý hàng</h3><p>Đóng gói, khai báo và bàn giao cho mạng lưới vận chuyển.</p></article>
            <article><span>04</span><div className="process-icon"><PackageCheck size={24} /></div><h3>Giao & hoàn tất</h3><p>Theo dõi đến khi kiện hàng được giao cho người nhận.</p></article>
          </div>
        </div>
      </section>

      <section className="quote-section" id="bao-gia">
        <div className="container quote-grid">
          <div className="quote-copy">
            <p className="section-eyebrow light">NHẬN TƯ VẤN VẬN CHUYỂN</p>
            <h2>Bắt đầu với vài thông tin cơ bản</h2>
            <p>Cho EZWAY biết nhu cầu, điểm đến và trọng lượng dự kiến. Nội dung sẽ được chuẩn bị sẵn để bạn gửi qua WhatsApp chính thức.</p>
            <div className="official-contact">
              <a href="tel:0523666966"><Phone size={19} /><span><small>HOTLINE CHÍNH THỨC</small><strong>0523.666.966</strong></span></a>
              <a href="https://wa.me/84523666966" target="_blank" rel="noreferrer"><MessageCircle size={19} /><span><small>WHATSAPP</small><strong>Chat với EZWAY</strong></span></a>
            </div>
          </div>
          <div className="quote-card"><div className="quote-card-title"><span>Yêu cầu báo giá</span><small>Phản hồi qua hotline / WhatsApp</small></div><QuoteForm /></div>
        </div>
      </section>

      <section className="section faq-section">
        <div className="container faq-grid">
          <div className="section-heading"><p className="section-eyebrow">CÂU HỎI THƯỜNG GẶP</p><h2>Thông tin cần biết trước khi gửi</h2><p>Nếu trường hợp của bạn chưa có trong danh sách, hãy gọi hotline để được kiểm tra trực tiếp.</p></div>
          <div className="faq-list">
            <details><summary>EZWAY hỗ trợ những tuyến quốc tế nào?<span>+</span></summary><p>Các tuyến được giới thiệu hiện nay gồm Mỹ, Úc, Canada và Châu Âu. Với điểm đến khác, vui lòng liên hệ để kiểm tra khả năng phục vụ.</p></details>
            <details><summary>Chưa biết chính xác trọng lượng có báo giá được không?<span>+</span></summary><p>Bạn vẫn có thể gửi kích thước ước lượng hoặc hình ảnh kiện hàng; đội ngũ EZWAY sẽ hướng dẫn bổ sung thông tin cần thiết.</p></details>
            <details><summary>Hàng điện tử hoặc hàng cồng kềnh có gửi được không?<span>+</span></summary><p>Khả năng vận chuyển phụ thuộc loại hàng và quốc gia đến. EZWAY sẽ kiểm tra yêu cầu hồ sơ trước khi xác nhận phương án.</p></details>
            <details><summary>Tôi tra cứu hành trình đơn hàng ở đâu?<span>+</span></summary><p>Nhập mã vận đơn tại ô tra cứu ở đầu trang. Nếu cần làm rõ trạng thái, hãy gọi hotline 0523.666.966.</p></details>
          </div>
        </div>
      </section>

      <footer id="lien-he">
        <div className="container footer-main">
          <div className="footer-brand"><Logo footer /><p>Giải pháp vận chuyển quốc tế, mua hộ hàng Mỹ và hỗ trợ thủ tục hải quan.</p></div>
          <div className="footer-column"><h2>Liên hệ EZWAY</h2><a href="tel:0523666966"><Phone size={16} /> 0523.666.966</a><p><span className="footer-pin">•</span>112/40 Thạnh Xuân 22, Thới An,<br />TP. Hồ Chí Minh</p></div>
          <div className="footer-column"><h2>Liên kết nhanh</h2><a href="#top">Trang chủ</a><a href="#mua-ho">Mua hộ hàng Mỹ</a><a href="#dich-vu">Dịch vụ</a><a href="#bao-gia">Nhận báo giá</a></div>
          <div className="footer-column"><h2>Hỗ trợ</h2><a href="#tracking">Tra cứu vận đơn</a><a href="https://ezway.vn/tin-tuc">Tin tức</a><a href="https://wa.me/84523666966" target="_blank" rel="noreferrer">WhatsApp</a></div>
        </div>
        <div className="container footer-bottom"><span>© 2026 EZWAY Logistics. All rights reserved.</span><span>Moving Made Easy</span></div>
      </footer>

      <div className="mobile-cta"><a href="tel:0523666966"><Phone size={16} /> Gọi ngay</a><a href="#bao-gia">Nhận báo giá</a></div>
    </main>
  );
}
