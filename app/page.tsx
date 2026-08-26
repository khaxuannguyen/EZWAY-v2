import {
  ArrowRight, BadgeCheck, Box, Boxes, Check, ChevronRight, ClipboardCheck,
  ExternalLink, FileCheck2, Globe2, MapPin, Menu, MessageCircle, PackageCheck,
  Newspaper, Phone, PlaneTakeoff, Radar, SearchCheck, ShieldAlert, ShoppingBag, Snowflake, Tags,
} from 'lucide-react';
import { ConsultationForm, PurchaseRequestForm, TrackingForm } from './client-forms';

const services = [
  { icon: PlaneTakeoff, image: '/ezway-service-global.jpg', imageAlt: 'Các kiện hàng được dán nhãn và chuẩn bị tại khu vực khai thác vận chuyển quốc tế', title: 'Gửi hàng quốc tế', description: 'Tư vấn phương án gửi thực phẩm khô đóng gói, quần áo, đồ dùng cá nhân, quà tặng và nhiều nhóm hàng khác từ Việt Nam.', audience: 'Phù hợp với cá nhân, gia đình và người bán hàng cần gửi đến người nhận ở nước ngoài.', details: ['Kiểm tra loại hàng và tuyến đến', 'Hỗ trợ đóng gói, khai báo', 'Tra cứu hành trình sau khi gửi'], href: '#bao-gia' },
  { icon: Snowflake, image: '/ezway-service-frozen.jpg', imageAlt: 'Kiện hàng bảo quản lạnh với túi giữ nhiệt và gel lạnh được chuẩn bị trên bàn đóng gói', title: 'Gửi hàng đông lạnh', description: 'Kiểm tra khả năng nhận theo loại hàng, quốc gia đến và điều kiện vận chuyển tại thời điểm gửi.', audience: 'Phù hợp với nhu cầu gửi thực phẩm cần bảo quản đặc biệt sau khi được EZWAY xác nhận tuyến.', details: ['Kiểm tra tuyến trước khi nhận hàng', 'Tư vấn quy cách bảo quản', 'Chỉ xác nhận khi đủ điều kiện vận chuyển'], href: '#lien-he', note: 'Cần kiểm tra tuyến' },
  { icon: Tags, image: '/ezway-service-packing.jpg', imageAlt: 'Nhân viên chuẩn bị giấy bảo vệ và đóng gói quần áo trong thùng carton', title: 'Đóng gói & khai báo', description: 'Đóng gói, hút chân không, dán nhãn và hướng dẫn thông tin khai báo phù hợp với lô hàng.', audience: 'Phù hợp với khách chưa chắc cách chuẩn bị hàng hoặc muốn giảm rủi ro do đóng gói chưa đúng.', details: ['Kiểm tra tình trạng hàng', 'Đề xuất quy cách đóng gói', 'Hỗ trợ chuẩn bị thông tin khai báo'], href: '#bao-gia' },
  { icon: Boxes, image: '/ezway-service-bulky.jpg', imageAlt: 'Kiện carton cỡ lớn được gia cố và đo kích thước trước khi vận chuyển', title: 'Hàng cồng kềnh / theo yêu cầu', description: 'Tiếp nhận thông tin lô hàng có kích thước lớn, thiết bị hoặc yêu cầu xử lý riêng để kiểm tra phương án.', audience: 'Phù hợp với lô hàng cần đánh giá kích thước, vật liệu, chứng từ hoặc điều kiện tuyến trước khi nhận.', details: ['Đánh giá từ hình ảnh và kích thước', 'Kiểm tra yêu cầu chứng từ', 'Xác nhận phương án trước khi gửi'], href: '#lien-he' },
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

const usBuyingSteps = [
  { title: 'Gửi link sản phẩm', copy: 'Dán link website Mỹ và ghi rõ số lượng, màu sắc, kích thước hoặc phiên bản cần mua.' },
  { title: 'Kiểm tra & báo giá', copy: 'EZWAY kiểm tra thông tin sản phẩm và phản hồi các khoản chi phí dự kiến trước khi đặt.' },
  { title: 'Xác nhận đặt mua', copy: 'Bạn xác nhận sản phẩm và phương án thanh toán theo báo giá; EZWAY tiến hành đặt hàng.' },
  { title: 'Nhận tại kho Mỹ & gửi về Việt Nam', copy: 'Khi người bán giao tới kho, đơn tiếp tục theo phương án vận chuyển đã được xác nhận.' },
];

const newsArticles = [
  {
    category: 'Logistics Việt Nam', region: 'Trong nước', source: 'Logistics Việt Nam · Bộ Công Thương',
    date: '24/08/2026', isoDate: '2026-08-24',
    title: 'Logistics cần được nhìn nhận như hạ tầng thiết yếu của đô thị thông minh',
    summary: 'Tọa đàm đề xuất kết nối dữ liệu, tự động hóa và quy hoạch dòng hàng hóa để phát triển đô thị bền vững.',
    href: 'https://logistics.gov.vn/tin-hoat-dong/toa-dam-phat-trien-do-thi-thong-minh-ben-vung-duoi-goc-nhin-logistics-va-quan-ly-chuoi-cung-ung',
  },
  {
    category: 'Kinh tế Việt Nam', region: 'Trong nước', source: 'VnEconomy',
    date: '22/08/2026', isoDate: '2026-08-22',
    title: 'Nửa đầu tháng 8/2026, xuất khẩu tăng tốc, nhập siêu còn 1,5 tỷ USD',
    summary: 'Cục Hải quan ghi nhận xuất khẩu nửa đầu tháng 8 tăng trong khi nhập khẩu giảm, giúp thu hẹp nhập siêu của kỳ.',
    href: 'https://vneconomy.vn/nua-dau-thang-82026-xuat-khau-tang-toc-nhap-sieu-con-15-ty-usd.htm',
  },
  {
    category: 'Hạ tầng vận tải', region: 'Trong nước', source: 'VietnamPlus',
    date: '12/08/2026', isoDate: '2026-08-12',
    title: 'Thử nghiệm tuyến container quốc tế kết nối Cần Thơ với Quảng Tây',
    summary: 'Tuyến thử nghiệm mở thêm phương án vận chuyển trực tiếp cho hàng nông sản Đồng bằng sông Cửu Long sang Trung Quốc.',
    href: 'https://www.vietnamplus.vn/thu-nghiem-tuyen-container-quoc-te-ket-noi-can-tho-voi-quang-tay-post1129787.vnp',
  },
  {
    category: 'Hải quan', region: 'Trong nước', source: 'Báo Chính phủ',
    date: '10/08/2026', isoDate: '2026-08-10',
    title: 'Nghỉ lễ 2/9 dài 5 ngày, hải quan trực 24/7 thông quan hàng hóa',
    summary: 'Cục Hải quan bố trí lực lượng trực trong kỳ nghỉ để duy trì thủ tục, hệ thống và luồng hàng xuất nhập khẩu.',
    href: 'https://baochinhphu.vn/nghi-le-2-9-dai-5-ngay-hai-quan-truc-24-7-thong-quan-hang-hoa-102260810182209985.htm',
  },
  {
    category: 'Hàng hải quốc tế', region: 'Quốc tế', source: 'FreightWaves',
    date: '24/08/2026', isoDate: '2026-08-24',
    title: 'Kênh đào Panama giảm công suất, chuỗi vận tải biển đứng trước rủi ro mới',
    summary: 'Hạn chế số lượt tàu và mớn nước có thể ảnh hưởng lịch trình, chi phí và định tuyến hàng hóa qua bờ Đông và vùng Vịnh Mỹ.',
    href: 'https://www.freightwaves.com/news/panama-canal-new-capacity-cuts-put-us-ports-on-notice',
  },
  {
    category: 'Công nghệ logistics', region: 'Quốc tế', source: 'FreightWaves',
    date: '21/08/2026', isoDate: '2026-08-21',
    title: 'Áp lực giao hàng nhanh thúc đẩy AI trong vận hành chặng cuối',
    summary: 'Kỳ vọng giao nhanh và miễn phí đang khiến doanh nghiệp thử nghiệm AI hỗ trợ lập tuyến, điều phối và theo dõi giao hàng.',
    href: 'https://www.freightwaves.com/news/fareye-agentic-ai-dispatcher',
  },
  {
    category: 'Thị trường châu Âu', region: 'Quốc tế', source: 'Maersk',
    date: '14/08/2026', isoDate: '2026-08-14',
    title: 'Maersk cập nhật thị trường logistics châu Âu tháng 8/2026',
    summary: 'Bản cập nhật lưu ý kế hoạch năng lực mùa cao điểm, điều kiện tại các cảng và rủi ro gián đoạn từ địa chính trị.',
    href: 'https://www.maersk.com/news/articles/2026/08/14/europe-market-update-august',
  },
  {
    category: 'Thương mại quốc tế', region: 'Quốc tế', source: 'Reuters',
    date: '07/08/2026', isoDate: '2026-08-07',
    title: 'Làn sóng nhập khẩu container sớm vào Mỹ bắt đầu hạ nhiệt',
    summary: 'Các nhà giao nhận cho biết đợt đưa hàng vào sớm đã qua đỉnh, nhưng chi phí nền từ nhiên liệu và phụ phí tuyến vẫn có thể duy trì cao.',
    href: 'https://www.marketscreener.com/news/early-surge-in-us-container-imports-coming-to-an-end-shippers-say-ce7f50d3d989f024',
  },
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
          <nav className="home-desktop-nav" aria-label="Điều hướng chính"><a href="#top">Trang chủ</a><a href="#mua-ho">Mua hộ hàng Mỹ</a><a href="#dich-vu">Dịch vụ</a><a href="#bao-gia">Giá cước</a><a href="#tin-tuc">Tin tức</a><a href="#lien-he">Liên hệ</a></nav>
          <a className="home-header-cta" href="#bao-gia">Nhận báo giá <ArrowRight size={16} /></a>
          <details className="home-mobile-menu"><summary aria-label="Mở menu điều hướng"><Menu size={22} /></summary><nav aria-label="Điều hướng trên điện thoại"><a href="#top">Trang chủ</a><a href="#mua-ho">Mua hộ hàng Mỹ</a><a href="#dich-vu">Dịch vụ</a><a href="#bao-gia">Giá cước</a><a href="#tin-tuc">Tin tức</a><a href="#lien-he">Liên hệ</a><a className="home-mobile-hotline" href="tel:0523666966"><Phone size={16} /> 0523.666.966</a></nav></details>
        </div></header>
      </div>

      <section className="home-hero" aria-labelledby="home-hero-title"><div className="home-hero-orbit" aria-hidden="true" /><div className="home-container home-hero-inner">
        <p className="home-eyebrow home-eyebrow-light"><span /> VẬN CHUYỂN QUỐC TẾ TỪ VIỆT NAM</p>
        <h1 id="home-hero-title">GỬI HÀNG QUỐC TẾ<br /><em>DỄ HƠN CÙNG EZWAY</em></h1>
        <p className="home-hero-route">Từ Việt Nam đi Mỹ, Úc, Canada, châu Âu và nhiều quốc gia khác.</p>
        <p className="home-hero-copy">EZWAY hỗ trợ nhận hàng, đóng gói, khai báo, theo dõi hành trình và giao tận nhà theo phương án được tư vấn trước.</p>
        <div className="home-tracking-wrap"><TrackingForm /></div>
        <div className="home-hero-status" aria-label="Minh hoạ hành trình vận đơn">
          <div className="home-hero-status-top"><span><Radar size={14} /> Minh hoạ hành trình</span><em>Không phải dữ liệu thực</em></div>
          <div className="home-hero-status-meta"><strong>EZW2508260001</strong><span>Việt Nam <ArrowRight size={13} /> Canada</span></div>
          <ol>
            <li className="is-done"><span><Check size={11} /></span><small>Đã nhận hàng</small></li>
            <li className="is-done"><span><Check size={11} /></span><small>Đóng gói</small></li>
            <li className="is-done"><span><Check size={11} /></span><small>Xuất kho</small></li>
            <li className="is-current"><span><Radar size={11} /></span><small>Đang giao</small></li>
          </ol>
        </div>
        <a className="home-hero-quote" href="#bao-gia">Chưa có mã? Nhận báo giá <ChevronRight size={16} /></a>
        <div className="home-trust-points" aria-label="Những hỗ trợ chính"><span><SearchCheck size={17} /> Theo dõi hành trình</span><span><Box size={17} /> Hỗ trợ đóng gói</span><span><MessageCircle size={17} /> Tư vấn trước khi gửi</span></div>
      </div></section>

      <section className="home-capabilities" aria-label="EZWAY hỗ trợ bạn như thế nào"><div className="home-container home-capability-grid">
        <article><span><Globe2 size={25} /></span><div><h2>Báo đúng tuyến, rõ cước phí</h2><p>Kiểm tra quốc gia nhận, loại hàng và cân nặng trước khi tư vấn.</p></div></article>
        <article><span><FileCheck2 size={25} /></span><div><h2>Hỗ trợ đóng gói & hút chân không</h2><p>Chuẩn bị kiện hàng gọn, an toàn và phù hợp từng tuyến.</p></div></article>
        <article><span><Radar size={25} /></span><div><h2>Theo dõi đơn xuyên suốt</h2><p>Tra cứu vận đơn EZWAY hoặc nhận hỗ trợ trong suốt hành trình.</p></div></article>
      </div></section>

      <section className="home-trust-strip" aria-label="Năng lực hỗ trợ của EZWAY"><div className="home-container">
        <span><Check size={15} /> Hỗ trợ nhận hàng tại Việt Nam</span><span><Check size={15} /> Đóng gói & khai báo</span><span><Check size={15} /> Giao tận nhà theo tuyến</span><span><Check size={15} /> Tracking rõ ràng</span>
      </div></section>

      <section className="home-section home-services" id="dich-vu"><div className="home-container">
        <div className="home-heading home-heading-split"><div><p className="home-eyebrow">DỊCH VỤ VẬN CHUYỂN</p><h2>Bạn cần gửi gì? EZWAY kiểm tra tuyến phù hợp trước khi nhận hàng.</h2></div><p>Thực phẩm, đồ cá nhân, hàng đông lạnh hay mua hộ Mỹ — mỗi nhóm hàng đều cần cách chuẩn bị riêng.</p></div>
        <div className="home-service-grid">{services.map(({ icon: Icon, image, imageAlt, title, description, audience, details, href, note }) => <article className="home-service-card" key={title}>
          <figure className="home-service-visual"><img src={image} width="1200" height="800" loading="lazy" decoding="async" alt={imageAlt} /><figcaption><span><Icon size={24} /></span><div><small>Hình ảnh minh hoạ</small>{note && <em>{note}</em>}</div></figcaption></figure><h3>{title}</h3><p>{description}</p>
          <details><summary>Xem dịch vụ phù hợp <ChevronRight size={16} /></summary><div><p><strong>Đối tượng phù hợp:</strong> {audience}</p><ul>{details.map(item => <li key={item}><Check size={14} /> {item}</li>)}</ul></div></details>
          <a href={href}>Xem điều kiện gửi <ArrowRight size={16} /></a>
        </article>)}</div>
        <div className="home-service-conversion"><div><span><MessageCircle size={22} /></span><div><h3>Gửi ảnh hàng, nhận tư vấn tuyến miễn phí</h3><p>EZWAY kiểm tra loại hàng, điểm đến và cách tính cước trước khi nhận.</p></div></div><a href="#lien-he">Gửi ảnh hàng, nhận tư vấn tuyến miễn phí <ArrowRight size={17} /></a></div>
      </div></section>

      <section className="home-us-buy" id="mua-ho" aria-labelledby="us-buy-title"><div className="home-container">
        <div className="home-us-buy-grid">
          <div className="home-us-buy-copy"><div className="home-us-flag"><span aria-hidden="true">🇺🇸</span><strong>DỊCH VỤ RIÊNG · MỸ → VIỆT NAM</strong></div><p className="home-eyebrow home-eyebrow-light">MUA HỘ HÀNG MỸ</p><h2 id="us-buy-title">Bạn chọn món.<br />EZWAY hỗ trợ đặt mua và đưa hàng về Việt Nam.</h2><p>Dành riêng cho khách muốn mua tại website Mỹ nhưng cần hỗ trợ thanh toán, nhận hàng tại Mỹ và vận chuyển về Việt Nam. Khả năng mua được kiểm tra theo từng website và loại sản phẩm.</p>
            <figure className="home-us-photo"><img src="/ezway-us-shopping.webp" width="1536" height="1024" loading="lazy" decoding="async" alt="Minh hoạ kiện hàng mua hộ gồm giày, quần áo và sản phẩm chăm sóc được chuẩn bị tại kho" /><figcaption><span>HÀNG MUA HỘ</span><small>Hình ảnh minh hoạ</small></figcaption></figure>
            <div className="home-us-benefits"><span><ShoppingBag size={18} /><strong>Gửi đúng link & thuộc tính</strong></span><span><ClipboardCheck size={18} /><strong>Xác nhận chi phí trước khi mua</strong></span><span><Radar size={18} /><strong>Theo dõi hành trình về Việt Nam</strong></span></div>
            <a className="home-us-call" href="tel:0523666966"><Phone size={18} /><span><small>CẦN HỎI NHANH?</small><strong>0523.666.966</strong></span></a>
          </div>
          <div className="home-us-form-card" id="mua-ho-form"><div className="home-us-form-head"><div><p>GỬI LINK NHẬN BÁO GIÁ</p><h3>Sản phẩm bạn muốn mua</h3></div><span><ShoppingBag size={23} /></span></div><PurchaseRequestForm /></div>
        </div>
        <div className="home-us-platforms"><p>CÓ THỂ GỬI LINK TỪ CÁC WEBSITE MỸ PHỔ BIẾN</p><div><span>amazon</span><span>eBay</span><span>Walmart</span><span>Costco</span><span>Target</span><span>Best Buy</span></div><small>Các thương hiệu thuộc sở hữu của đơn vị tương ứng. EZWAY không tuyên bố là đối tác chính thức.</small></div>
        <div className="home-us-process"><div className="home-us-process-heading"><p>QUY TRÌNH MUA HỘ</p><h3>Từ đường link đến kiện hàng tại Việt Nam</h3></div><ol>{usBuyingSteps.map((step, index) => <li key={step.title}><span>{String(index + 1).padStart(2, '0')}</span><div><h4>{step.title}</h4><p>{step.copy}</p></div></li>)}</ol></div>
        <div className="home-us-cost"><div><p>CHI PHÍ ĐƯỢC TÁCH RÕ</p><h3>Một báo giá có thể gồm</h3></div><div className="home-us-cost-formula"><span>Giá sản phẩm</span><b>+</b><span>Thuế & ship nội địa Mỹ<br /><small>nếu có</small></span><b>+</b><span>Phí dịch vụ mua hộ</span><b>+</b><span>Cước Mỹ → Việt Nam</span></div><p>Không tự áp mức phí hoặc tỷ giá mẫu. EZWAY sẽ xác nhận từng khoản cho đúng đơn hàng trước khi bạn quyết định mua.</p></div>
      </div></section>

      <section className="home-section home-routes" aria-labelledby="routes-title"><div className="home-container">
        <div className="home-heading home-heading-centered"><p className="home-eyebrow">TUYẾN VẬN CHUYỂN</p><h2 id="routes-title">Các điểm đến đang được tư vấn</h2><p>Thời gian, chi phí và khả năng nhận hàng được xác nhận riêng theo từng lô hàng — không áp dụng một cam kết chung cho mọi tuyến.</p></div>
        <div className="home-route-grid">{routes.map(route => <article key={route.name}><span className="home-flag" aria-hidden="true">{route.flag}</span><h3>{route.name}</h3><p>{route.copy}</p><a href="#bao-gia">Xem giá cước <ChevronRight size={15} /></a></article>)}</div>
      </div></section>

      <section className="home-operations" aria-labelledby="operations-title"><div className="home-container">
        <div className="home-heading home-heading-split"><div><p className="home-eyebrow">HÀNH TRÌNH KIỆN HÀNG</p><h2 id="operations-title">Hình dung rõ hơn về khâu chuẩn bị và vận chuyển</h2></div><p>Hàng hóa cần được kiểm tra, bảo vệ và sắp xếp phù hợp trước khi đi vào tuyến vận chuyển. Các hình dưới đây minh hoạ những công đoạn khách hàng thường quan tâm.</p></div>
        <div className="home-operations-grid">
          <figure className="home-operation-main"><img src="/ezway-air-cargo.webp" width="1600" height="900" loading="lazy" decoding="async" alt="Minh hoạ các kiện hàng trên pallet tại khu vực khai thác hàng không" /><figcaption><div><small>HÌNH ẢNH MINH HOẠ</small><h3>Từ kho đến tuyến vận chuyển</h3><p>Kiện hàng được sắp xếp và chuẩn bị trước khi bàn giao cho chặng vận chuyển tiếp theo.</p></div><span><PlaneTakeoff size={21} /></span></figcaption></figure>
          <figure className="home-operation-side"><img src="/ezway-packing-care.webp" width="1456" height="1092" loading="lazy" decoding="async" alt="Minh hoạ nhân viên sử dụng giấy bảo vệ để đóng gói quần áo trong thùng carton" /><figcaption><div><small>HÌNH ẢNH MINH HOẠ</small><h3>Đóng gói theo đặc điểm hàng</h3><p>Quy cách bảo vệ được tư vấn theo loại hàng và điều kiện của tuyến gửi.</p></div><span><Box size={21} /></span></figcaption></figure>
        </div>
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

      <section className="home-section home-news" id="tin-tuc" aria-labelledby="news-title"><div className="home-container">
        <div className="home-heading home-heading-split"><div><p className="home-eyebrow">TIN TỨC LOGISTICS & KINH TẾ</p><h2 id="news-title">Chuyển động thị trường trong và ngoài nước</h2><p>Các bài đáng chú ý được EZWAY chọn lọc và tóm tắt ngắn. Bấm vào từng bài để đọc nội dung đầy đủ tại nguồn xuất bản.</p></div><div className="home-news-updated"><Newspaper size={18} /><span><small>CẬP NHẬT GẦN NHẤT</small><strong>25/08/2026</strong></span></div></div>
        <div className="home-news-grid">{newsArticles.map(article => <a className={article.region === 'Quốc tế' ? 'home-news-card is-international' : 'home-news-card'} href={article.href} target="_blank" rel="noopener noreferrer" key={article.href} aria-label={`${article.title} — đọc tại ${article.source}`}>
          <div className="home-news-tags"><span>{article.category}</span><em>{article.region}</em></div>
          <div className="home-news-source"><strong>{article.source}</strong><time dateTime={article.isoDate}>{article.date}</time></div>
          <h3>{article.title}</h3><p>{article.summary}</p>
          <span className="home-news-link">Đọc bài gốc <ExternalLink size={14} /></span>
        </a>)}</div>
        <p className="home-news-note">EZWAY chỉ tóm tắt và dẫn nguồn; nội dung chi tiết thuộc bản quyền của đơn vị xuất bản.</p>
      </div></section>

      <section className="home-section home-faq" aria-labelledby="faq-title"><div className="home-container home-faq-grid">
        <div className="home-heading"><p className="home-eyebrow">CÂU HỎI THƯỜNG GẶP</p><h2 id="faq-title">Trước khi gửi, bạn có thể muốn biết</h2><p>Nếu loại hàng hoặc điểm đến chưa có trong câu trả lời, hãy gửi thông tin để EZWAY kiểm tra riêng.</p><a href="tel:0523666966"><Phone size={16} /> Gọi 0523.666.966</a></div>
        <div className="home-faq-list"><details><summary>EZWAY nhận gửi đi những nước nào?<span>+</span></summary><p>Các tuyến đang được giới thiệu gồm Mỹ, Úc, Canada, các nước châu Âu và Anh. Với quốc gia khác, EZWAY cần kiểm tra điểm đến và loại hàng trước khi xác nhận.</p></details><details><summary>Mua hộ hàng Mỹ bắt đầu từ đâu?<span>+</span></summary><p>Bạn dán link sản phẩm vào form “Mua hộ hàng Mỹ”, ghi rõ số lượng và thuộc tính cần mua. EZWAY sẽ kiểm tra thông tin trước khi xác nhận báo giá và đặt hàng.</p></details><details><summary>Chi phí mua hộ hàng Mỹ gồm những gì?<span>+</span></summary><p>Tùy đơn hàng, báo giá có thể gồm giá sản phẩm, thuế hoặc ship nội địa Mỹ nếu có, phí dịch vụ mua hộ và cước vận chuyển Mỹ – Việt Nam. Từng khoản được xác nhận theo đơn thực tế.</p></details><details><summary>Chưa biết cân nặng có báo giá được không?<span>+</span></summary><p>Có thể gửi kích thước ước tính, danh sách hàng hoặc hình ảnh trước. Cân nặng và kích thước thực tế sẽ được xác nhận khi kiểm tra hàng.</p></details><details><summary>Hàng điện tử hoặc hàng cồng kềnh có gửi được không?<span>+</span></summary><p>Cần kiểm tra loại thiết bị, pin, kích thước, quốc gia đến và chứng từ liên quan. EZWAY chỉ xác nhận sau khi có đủ thông tin cần thiết.</p></details><details><summary>Tôi tra cứu hành trình ở đâu?<span>+</span></summary><p>Nhập mã vận đơn, mã KSN hoặc mã giao chặng cuối tại ô tra cứu đầu trang hoặc vào trang “Tra cứu đơn hàng”.</p></details><details><summary>Thời gian giao phụ thuộc vào những yếu tố nào?<span>+</span></summary><p>Thời gian có thể thay đổi theo tuyến, lịch vận chuyển, khâu khai báo, kiểm tra hải quan, điều kiện giao chặng cuối và thông tin người nhận.</p></details></div>
      </div></section>

      <section className="home-section home-contact" id="lien-he" aria-labelledby="contact-title"><div className="home-container home-contact-grid">
        <div className="home-contact-copy"><p className="home-eyebrow">LIÊN HỆ EZWAY</p><h2 id="contact-title">Trao đổi trực tiếp về lô hàng</h2><p>Gọi hotline hoặc để lại nội dung cần kiểm tra. Form sẽ chuẩn bị một bản tóm tắt để bạn sao chép khi trao đổi với EZWAY.</p><div className="home-contact-list"><a href="tel:0523666966"><span><Phone size={20} /></span><div><small>HOTLINE</small><strong>0523.666.966</strong></div></a><a href="https://www.google.com/maps/search/?api=1&query=112%2F40%20Th%E1%BA%A1nh%20Xu%C3%A2n%2022%2C%20Th%E1%BB%9Bi%20An%2C%20TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh" target="_blank" rel="noopener noreferrer"><span><MapPin size={20} /></span><div><small>ĐỊA CHỈ</small><strong>112/40 Thạnh Xuân 22, Thới An, TP. Hồ Chí Minh</strong><em>Mở trên Google Maps <ExternalLink size={12} /></em></div></a></div></div>
        <div className="home-form-card home-contact-form"><div className="home-form-head"><div><p>Cần EZWAY kiểm tra?</p><h3>Gửi nội dung tư vấn</h3></div><span><MessageCircle size={22} /></span></div><ConsultationForm variant="contact" /></div>
      </div></section>

      <footer className="home-footer"><div className="home-container home-footer-grid">
        <div className="home-footer-brand"><BrandLogo footer /><p>Vận chuyển quốc tế và mua hộ hàng Mỹ.</p><span>Moving Made Easy</span></div>
        <div className="home-footer-column"><h2>Liên hệ</h2><a href="tel:0523666966"><Phone size={15} /> 0523.666.966</a><p><MapPin size={15} /> <span>112/40 Thạnh Xuân 22, Thới An,<br />TP. Hồ Chí Minh</span></p></div>
        <div className="home-footer-column"><h2>Dịch vụ</h2><a href="#dich-vu">Gửi hàng quốc tế</a><a href="#mua-ho">Mua hộ hàng Mỹ</a><a href="#bao-gia">Báo giá</a></div>
        <div className="home-footer-column"><h2>Hỗ trợ</h2><a href="/tra-cuu">Tra cứu đơn hàng</a><a href="#tin-tuc">Tin tức</a><a href="#lien-he">Liên hệ</a></div>
      </div><div className="home-container home-footer-bottom"><span>© 2026 EZWAY. All rights reserved.</span><a href="#top">Về đầu trang ↑</a></div></footer>
      <div className="home-mobile-actions"><a href="tel:0523666966"><Phone size={16} /> Gọi hotline</a><a href="#bao-gia">Nhận báo giá</a></div>
    </main>
  );
}
