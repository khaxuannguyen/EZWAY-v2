import {
  ArrowRight, BadgeCheck, Box, Boxes, Check, ChevronRight, ClipboardCheck,
  ExternalLink, FileCheck2, Globe2, MapPin, Menu, MessageCircle, PackageCheck,
  Phone, PlaneTakeoff, Radar, SearchCheck, ShieldAlert, ShoppingBag, Snowflake, Tags,
} from 'lucide-react';
import { ConsultationForm, TrackingForm } from './client-forms';

const services = [
  { icon: PlaneTakeoff, title: 'Gửi hàng quốc tế', description: 'Tư vấn phương án gửi thực phẩm khô đóng gói, quần áo, đồ dùng cá nhân, quà tặng và nhiều nhóm hàng khác từ Việt Nam.', audience: 'Phù hợp với cá nhân, gia đình và người bán hàng cần gửi đến người nhận ở nước ngoài.', details: ['Kiểm tra loại hàng và tuyến đến', 'Hỗ trợ đóng gói, khai báo', 'Tra cứu hành trình sau khi gửi'], cta: 'Nhận tư vấn tuyến gửi', href: '#bao-gia' },
  { icon: Snowflake, title: 'Gửi hàng đông lạnh', description: 'Kiểm tra khả năng nhận theo loại hàng, quốc gia đến và điều kiện vận chuyển tại thời điểm gửi.', audience: 'Phù hợp với nhu cầu gửi thực phẩm cần bảo quản đặc biệt sau khi được EZWAY xác nhận tuyến.', details: ['Kiểm tra tuyến trước khi nhận hàng', 'Tư vấn quy cách bảo quản', 'Chỉ xác nhận khi đủ điều kiện vận chuyển'], cta: 'Gửi thông tin để kiểm tra', href: '#lien-he', note: 'Cần kiểm tra tuyến' },
  { icon: ShoppingBag, title: 'Mua hộ hàng Mỹ', description: 'Hỗ trợ đặt hàng tại các website Mỹ như Amazon, eBay, Costco và vận chuyển về Việt Nam theo nhu cầu.', audience: 'Phù hợp khi bạn chưa có phương thức thanh toán, địa chỉ nhận tại Mỹ hoặc cần hỗ trợ gom kiện.', details: ['Tư vấn trước khi đặt mua', 'Nhận hàng tại kho Mỹ', 'Gom kiện theo yêu cầu phù hợp'], cta: 'Tư vấn mua hộ', href: '#bao-gia', id: 'mua-ho' },
  { icon: Tags, title: 'Đóng gói & khai báo', description: 'Đóng gói, hút chân không, dán nhãn và hướng dẫn thông tin khai báo phù hợp với lô hàng.', audience: 'Phù hợp với khách chưa chắc cách chuẩn bị hàng hoặc muốn giảm rủi ro do đóng gói chưa đúng.', details: ['Kiểm tra tình trạng hàng', 'Đề xuất quy cách đóng gói', 'Hỗ trợ chuẩn bị thông tin khai báo'], cta: 'Tư vấn cách chuẩn bị', href: '#bao-gia' },
  { icon: Boxes, title: 'Hàng cồng kềnh / theo yêu cầu', description: 'Tiếp nhận thông tin lô hàng có kích thước lớn, thiết bị hoặc yêu cầu xử lý riêng để kiểm tra phương án.', audience: 'Phù hợp với lô hàng cần đánh giá kích thước, vật liệu, chứng từ hoặc điều kiện tuyến trước khi nhận.', details: ['Đánh giá từ hình ảnh và kích thước', 'Kiểm tra yêu cầu chứng từ', 'Xác nhận phương án trước khi gửi'], cta: 'Trao đổi lô hàng', href: '#lien-he' },
];

const routes = [
  { flag: '🇺🇸', name: 'Mỹ', copy: 'Kiểm tra phương án gửi đến các bang theo thông tin lô hàng.' },
  { flag: '🇦🇺', name: 'Úc', copy: 'Tư vấn loại hàng, quy cách đóng gói và địa chỉ nhận tại Úc.' },
  { flag: '🇨🇦', name: 'Canada', copy: 'Xác nhận tuyến và yêu cầu khai báo trước khi gửi.' },
  { flag: '🇪🇺', name: 'Châu Âu', copy: 'Kiểm tra cụ thể theo quốc gia đến và nhóm hàng.' },
  { flag: '🇬🇧', name: 'Anh', copy: 'Tư vấn riêng theo điểm đến, loại hàng và thông tin người nhận.' },
];

const process = [
  { icon: MessageCircle, title: 'Gửi yêu cầu tư vấn', copy: 'Cho EZWAY biết nơi đến, loại hàng và nhu cầu dự kiến.' },
  { icon: ClipboardCheck, title: 'Chuẩn bị hàng & thông tin', copy: 'Chuẩn bị hàng cùng thông tin người gửi và người nhận.' },
  { icon: Box, title: 'Kiểm tra, đóng gói, báo cước', copy: 'EZWAY kiểm tra điều kiện nhận, tư vấn đóng gói và xác nhận chi phí.' },
  { icon: Radar, title: 'Vận chuyển & theo dõi', copy: 'Lô hàng được bàn giao vận chuyển và cập nhật hành trình tra cứu.' },
  { icon: PackageCheck, title: 'Giao tận tay người nhận', copy: 'Theo dõi đến trạng thái giao cuối cùng hoặc hỗ trợ khi cần làm rõ.' },
];

function BrandLogo({ footer = false }: { footer?: boolean }) {
  return <span className={footer ? 'home-footer-logo-panel' : 'home-logo'}><img src="/ezway-logo-transparent.png" alt="EZWAY — Moving Made Easy" /></span>;
}

export default function Home() {
  return (
    <main className="home-page" id="top">
      <div className="home-site-header">
        <div className="home-topbar"><div className="home-container home-topbar-inner"><a href="tel:0523666966"><Phone size={13} /> Hotline: 0523.666.966</a><a href="/tra-cuu"><Radar size={13} /> Tra cứu đơn hàng</a></div></div>
        <header className="home-header"><div className="home-container home-nav">
          <a href="#top" aria-label="EZWAY - Trang chủ"><BrandLogo /></a>
          <nav className="home-desktop-nav" aria-label="Điều hướng chính"><a href="#top">Trang chủ</a><a href="#mua-ho">Mua hộ hàng Mỹ</a><a href="#dich-vu">Dịch vụ</a><a href="#bao-gia">Giá cước</a><a href="https://ezway.vn/tin-tuc">Tin tức</a><a href="#lien-he">Liên hệ</a></nav>
          <a className="home-header-cta" href="#bao-gia">Nhận báo giá <ArrowRight size={16} /></a>
          <details className="home-mobile-menu"><summary aria-label="Mở menu điều hướng"><Menu size={22} /></summary><nav aria-label="Điều hướng trên điện thoại"><a href="#top">Trang chủ</a><a href="#mua-ho">Mua hộ hàng Mỹ</a><a href="#dich-vu">Dịch vụ</a><a href="#bao-gia">Giá cước</a><a href="https://ezway.vn/tin-tuc">Tin tức</a><a href="#lien-he">Liên hệ</a><a className="home-mobile-hotline" href="tel:0523666966"><Phone size={16} /> 0523.666.966</a></nav></details>
        </div></header>
      </div>

      <section className="home-hero" aria-labelledby="home-hero-title"><div className="home-hero-orbit" aria-hidden="true" /><div className="home-container home-hero-inner">
        <p className="home-eyebrow home-eyebrow-light"><span /> VẬN CHUYỂN QUỐC TẾ TỪ VIỆT NAM</p>
        <h1 id="home-hero-title">Gửi hàng quốc tế<br /><em>dễ hơn cùng EZWAY</em></h1>
        <p className="home-hero-route">Từ Việt Nam đi Mỹ, Úc, Canada, châu Âu và nhiều quốc gia khác.</p>
        <p className="home-hero-copy">EZWAY hỗ trợ nhận hàng, đóng gói, khai báo, theo dõi hành trình và giao tận nhà theo phương án được tư vấn trước.</p>
        <div className="home-tracking-wrap"><TrackingForm /></div>
        <a className="home-hero-quote" href="#bao-gia">Chưa có mã? Nhận báo giá <ChevronRight size={16} /></a>
        <div className="home-trust-points" aria-label="Những hỗ trợ chính"><span><SearchCheck size={17} /> Theo dõi hành trình</span><span><Box size={17} /> Hỗ trợ đóng gói</span><span><MessageCircle size={17} /> Tư vấn trước khi gửi</span></div>
      </div></section>

      <section className="home-capabilities" aria-label="EZWAY hỗ trợ bạn như thế nào"><div className="home-container home-capability-grid">
        <article><span><Globe2 size={24} /></span><div><h2>Kiểm tra đúng tuyến</h2><p>Xác nhận khả năng nhận theo quốc gia đến và loại hàng trước khi gửi.</p></div></article>
        <article><span><FileCheck2 size={24} /></span><div><h2>Chuẩn bị rõ ràng</h2><p>Hướng dẫn thông tin người nhận, đóng gói và khai báo cần thiết.</p></div></article>
        <article><span><Radar size={24} /></span><div><h2>Theo dõi tập trung</h2><p>Tra cứu mã EZWAY, KSN hoặc mã giao chặng cuối trên cùng một luồng.</p></div></article>
      </div></section>

      <section className="home-section home-services" id="dich-vu"><div className="home-container">
        <div className="home-heading home-heading-split"><div><p className="home-eyebrow">DỊCH VỤ EZWAY</p><h2>Chọn đúng dịch vụ cho lô hàng của bạn</h2></div><p>Mỗi nhóm hàng cần cách chuẩn bị khác nhau. EZWAY kiểm tra thông tin trước, sau đó mới xác nhận phương án phù hợp.</p></div>
        <div className="home-service-grid">{services.map(({ icon: Icon, title, description, audience, details, cta, href, note, id }) => <article className="home-service-card" key={title} id={id}>
          <div className="home-service-head"><span><Icon size={25} /></span>{note && <small>{note}</small>}</div><h3>{title}</h3><p>{description}</p>
          <details><summary>Xem dịch vụ phù hợp <ChevronRight size={16} /></summary><div><p><strong>Đối tượng phù hợp:</strong> {audience}</p><ul>{details.map(item => <li key={item}><Check size={14} /> {item}</li>)}</ul></div></details>
          <a href={href}>{cta} <ArrowRight size={16} /></a>
        </article>)}</div>
      </div></section>

      <section className="home-section home-routes" aria-labelledby="routes-title"><div className="home-container">
        <div className="home-heading home-heading-centered"><p className="home-eyebrow">TUYẾN VẬN CHUYỂN</p><h2 id="routes-title">Các điểm đến đang được tư vấn</h2><p>Thời gian, chi phí và khả năng nhận hàng được xác nhận riêng theo từng lô hàng — không áp dụng một cam kết chung cho mọi tuyến.</p></div>
        <div className="home-route-grid">{routes.map(route => <article key={route.name}><span className="home-flag" aria-hidden="true">{route.flag}</span><h3>{route.name}</h3><p>{route.copy}</p><a href="#bao-gia">Xem giá cước <ChevronRight size={15} /></a></article>)}</div>
      </div></section>

      <section className="home-section home-process" aria-labelledby="process-title"><div className="home-container">
        <div className="home-heading home-heading-centered"><p className="home-eyebrow">QUY TRÌNH GỬI HÀNG</p><h2 id="process-title">5 bước từ yêu cầu đến giao hàng</h2><p>Thông tin được kiểm tra theo từng bước để bạn biết cần chuẩn bị gì và có thể tra cứu ở đâu.</p></div>
        <ol className="home-process-list">{process.map(({ icon: Icon, title, copy }, index) => <li key={title}><span className="home-step-number">{String(index + 1).padStart(2, '0')}</span><span className="home-step-icon"><Icon size={22} /></span><h3>{title}</h3><p>{copy}</p></li>)}</ol>
        <div className="home-section-action"><a className="home-button home-button-primary" href="#bao-gia">Nhận tư vấn <ArrowRight size={16} /></a></div>
      </div></section>

      <section className="home-section home-cargo" aria-labelledby="cargo-title"><div className="home-container">
        <div className="home-heading home-heading-split"><div><p className="home-eyebrow home-eyebrow-light">KIỂM TRA LOẠI HÀNG</p><h2 id="cargo-title">Biết trước khi đóng gói</h2></div><p>Khả năng nhận còn phụ thuộc quốc gia đến, thành phần, quy cách đóng gói và quy định tại thời điểm gửi.</p></div>
        <div className="home-cargo-grid"><article className="home-cargo-regular"><span><BadgeCheck size={26} /></span><div><h3>Thường có thể nhận</h3><p>Vẫn cần kiểm tra theo tuyến và tình trạng thực tế.</p><ul><li>Quần áo</li><li>Đồ dùng cá nhân</li><li>Thực phẩm khô đóng gói</li><li>Quà tặng</li></ul></div></article><article className="home-cargo-review"><span><ShieldAlert size={26} /></span><div><h3>Cần EZWAY kiểm tra trước</h3><p>Không tự đóng gói kín trước khi được tư vấn.</p><ul><li>Chất lỏng, mỹ phẩm, thuốc</li><li>Thực phẩm đặc biệt</li><li>Pin và thiết bị điện tử</li><li>Hàng cồng kềnh / có kích thước lớn</li></ul></div></article></div>
        <div className="home-cargo-cta"><p>Chưa chắc hàng của bạn thuộc nhóm nào?</p><a href="#lien-he">Gửi ảnh hàng để được kiểm tra <ArrowRight size={16} /></a></div>
      </div></section>

      <section className="home-quote" id="bao-gia" aria-labelledby="quote-title"><div className="home-container home-quote-grid">
        <div className="home-quote-copy"><p className="home-eyebrow home-eyebrow-light">YÊU CẦU BÁO GIÁ</p><h2 id="quote-title">Cho EZWAY biết lô hàng bạn dự định gửi</h2><p>Không cần biết chính xác mọi thông số ngay từ đầu. Hãy cung cấp những gì bạn đang có; nội dung tư vấn sẽ được chuẩn bị để bạn sao chép và trao đổi qua hotline.</p><ul><li><Check size={16} /> Không tự động phát sinh thanh toán</li><li><Check size={16} /> Không lưu thông tin vào dịch vụ bên thứ ba</li><li><Check size={16} /> Có thể bổ sung hình ảnh khi trao đổi trực tiếp</li></ul><a className="home-call-card" href="tel:0523666966"><Phone size={20} /><span><small>HOTLINE CHÍNH THỨC</small><strong>0523.666.966</strong></span></a></div>
        <div className="home-form-card"><div className="home-form-head"><div><p>Báo giá theo nhu cầu</p><h3>Thông tin lô hàng</h3></div><span><FileCheck2 size={22} /></span></div><ConsultationForm variant="quote" /></div>
      </div></section>

      <section className="home-section home-knowledge" aria-labelledby="knowledge-title"><div className="home-container">
        <div className="home-heading home-heading-split"><div><p className="home-eyebrow">KIẾN THỨC GỬI HÀNG</p><h2 id="knowledge-title">Chuẩn bị tốt trước khi gửi</h2></div><a href="https://ezway.vn/tin-tuc">Xem tin tức EZWAY <ExternalLink size={15} /></a></div>
        <div className="home-knowledge-grid"><a href="https://ezway.vn/tin-tuc"><span>01</span><h3>Chuẩn bị thông tin người nhận khi gửi quốc tế</h3><p>Những dữ liệu cần kiểm tra trước khi bàn giao kiện hàng.</p><ChevronRight size={18} /></a><a href="https://ezway.vn/tin-tuc"><span>02</span><h3>Khai báo loại hàng rõ ràng ngay từ đầu</h3><p>Vì sao thành phần, quy cách và số lượng ảnh hưởng đến tư vấn tuyến.</p><ChevronRight size={18} /></a><a href="https://ezway.vn/tin-tuc"><span>03</span><h3>Cách đọc các trạng thái tracking phổ biến</h3><p>Hiểu trạng thái đang vận chuyển, xử lý hải quan và giao chặng cuối.</p><ChevronRight size={18} /></a></div>
      </div></section>

      <section className="home-section home-faq" aria-labelledby="faq-title"><div className="home-container home-faq-grid">
        <div className="home-heading"><p className="home-eyebrow">CÂU HỎI THƯỜNG GẶP</p><h2 id="faq-title">Trước khi gửi, bạn có thể muốn biết</h2><p>Nếu loại hàng hoặc điểm đến chưa có trong câu trả lời, hãy gửi thông tin để EZWAY kiểm tra riêng.</p><a href="tel:0523666966"><Phone size={16} /> Gọi 0523.666.966</a></div>
        <div className="home-faq-list"><details><summary>EZWAY nhận gửi đi những nước nào?<span>+</span></summary><p>Các tuyến đang được giới thiệu gồm Mỹ, Úc, Canada, các nước châu Âu và Anh. Với quốc gia khác, EZWAY cần kiểm tra điểm đến và loại hàng trước khi xác nhận.</p></details><details><summary>Chưa biết cân nặng có báo giá được không?<span>+</span></summary><p>Có thể gửi kích thước ước tính, danh sách hàng hoặc hình ảnh trước. Cân nặng và kích thước thực tế sẽ được xác nhận khi kiểm tra hàng.</p></details><details><summary>Hàng điện tử hoặc hàng cồng kềnh có gửi được không?<span>+</span></summary><p>Cần kiểm tra loại thiết bị, pin, kích thước, quốc gia đến và chứng từ liên quan. EZWAY chỉ xác nhận sau khi có đủ thông tin cần thiết.</p></details><details><summary>Tôi tra cứu hành trình ở đâu?<span>+</span></summary><p>Nhập mã vận đơn, mã KSN hoặc mã giao chặng cuối tại ô tra cứu đầu trang hoặc vào trang “Tra cứu đơn hàng”.</p></details><details><summary>Thời gian giao phụ thuộc vào những yếu tố nào?<span>+</span></summary><p>Thời gian có thể thay đổi theo tuyến, lịch vận chuyển, khâu khai báo, kiểm tra hải quan, điều kiện giao chặng cuối và thông tin người nhận.</p></details></div>
      </div></section>

      <section className="home-section home-contact" id="lien-he" aria-labelledby="contact-title"><div className="home-container home-contact-grid">
        <div className="home-contact-copy"><p className="home-eyebrow">LIÊN HỆ EZWAY</p><h2 id="contact-title">Trao đổi trực tiếp về lô hàng</h2><p>Gọi hotline hoặc để lại nội dung cần kiểm tra. Form sẽ chuẩn bị một bản tóm tắt để bạn sao chép khi trao đổi với EZWAY.</p><div className="home-contact-list"><a href="tel:0523666966"><span><Phone size={20} /></span><div><small>HOTLINE</small><strong>0523.666.966</strong></div></a><a href="https://www.google.com/maps/search/?api=1&query=112%2F40%20Th%E1%BA%A1nh%20Xu%C3%A2n%2022%2C%20Th%E1%BB%9Bi%20An%2C%20TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh" target="_blank" rel="noopener noreferrer"><span><MapPin size={20} /></span><div><small>ĐỊA CHỈ</small><strong>112/40 Thạnh Xuân 22, Thới An, TP. Hồ Chí Minh</strong><em>Mở trên Google Maps <ExternalLink size={12} /></em></div></a></div></div>
        <div className="home-form-card home-contact-form"><div className="home-form-head"><div><p>Cần EZWAY kiểm tra?</p><h3>Gửi nội dung tư vấn</h3></div><span><MessageCircle size={22} /></span></div><ConsultationForm variant="contact" /></div>
      </div></section>

      <footer className="home-footer"><div className="home-container home-footer-grid">
        <div className="home-footer-brand"><BrandLogo footer /><p>Vận chuyển quốc tế và mua hộ hàng Mỹ.</p><span>Moving Made Easy</span></div>
        <div className="home-footer-column"><h2>Liên hệ</h2><a href="tel:0523666966"><Phone size={15} /> 0523.666.966</a><p><MapPin size={15} /> <span>112/40 Thạnh Xuân 22, Thới An,<br />TP. Hồ Chí Minh</span></p></div>
        <div className="home-footer-column"><h2>Dịch vụ</h2><a href="#dich-vu">Gửi hàng quốc tế</a><a href="#mua-ho">Mua hộ hàng Mỹ</a><a href="#bao-gia">Báo giá</a></div>
        <div className="home-footer-column"><h2>Hỗ trợ</h2><a href="/tra-cuu">Tra cứu đơn hàng</a><a href="https://ezway.vn/tin-tuc">Tin tức</a><a href="#lien-he">Liên hệ</a></div>
      </div><div className="home-container home-footer-bottom"><span>© 2026 EZWAY. All rights reserved.</span><a href="#top">Về đầu trang ↑</a></div></footer>
      <div className="home-mobile-actions"><a href="tel:0523666966"><Phone size={16} /> Gọi hotline</a><a href="#bao-gia">Nhận báo giá</a></div>
    </main>
  );
}
