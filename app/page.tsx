import { QuoteForm, TrackingForm } from './client-forms';

export default function Home() {
  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="EZWAY - Trang chủ">
          <span className="brand-mark" aria-hidden="true">E</span>
          <span>
            <strong>EZWAY</strong>
            <small>Moving made easy</small>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Điều hướng chính">
          <a href="#services">Dịch vụ</a>
          <a href="#process">Quy trình</a>
          <a href="#about">Về EZWAY</a>
        </nav>
        <a className="button button-small button-light" href="tel:0378899543">
          0378 899 543
        </a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Logistics quốc tế từ Việt Nam</p>
          <h1>Gửi hàng đi xa.<br /><em>Không còn lo xa.</em></h1>
          <p className="hero-lead">
            EZWAY đồng hành từ lấy hàng, khai báo hải quan đến giao tận tay —
            một đầu mối, theo dõi rõ ràng, hỗ trợ xuyên suốt.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#quote">Nhận báo giá</a>
            <a className="text-link" href="#tracking">Tra cứu đơn hàng <span>→</span></a>
          </div>
          <div className="trust-row" aria-label="Các cam kết dịch vụ">
            <span>Door-to-door</span><span>Hỗ trợ hải quan</span><span>Bảo hiểm hàng hóa</span>
          </div>
        </div>

        <div className="route-panel" aria-label="Minh họa hành trình vận chuyển">
          <div className="route-panel-head">
            <div>
              <small>HÀNH TRÌNH MẪU</small>
              <strong>Hồ Chí Minh → California</strong>
            </div>
            <span className="live-pill"><i /> Đang vận chuyển</span>
          </div>
          <div className="route-map" aria-hidden="true">
            <span className="continent continent-a" />
            <span className="continent continent-b" />
            <span className="route-line" />
            <span className="route-point point-a" />
            <span className="route-point point-b" />
            <span className="parcel">EZ</span>
          </div>
          <div className="route-stops">
            <div><i className="done" /><span><strong>Đã nhận hàng</strong><small>TP. Hồ Chí Minh</small></span></div>
            <div><i className="active" /><span><strong>Đang trung chuyển</strong><small>Trạng thái được cập nhật liên tục</small></span></div>
            <div><i /><span><strong>Giao tận tay</strong><small>California, Hoa Kỳ</small></span></div>
          </div>
        </div>
      </section>

      <section className="signal-strip" aria-label="Điểm nổi bật">
        <p><strong>7+ năm</strong><span>Kinh nghiệm thực chiến</span></p>
        <p><strong>Door-to-door</strong><span>Một đầu mối xuyên suốt</span></p>
        <p><strong>24/7</strong><span>Tra cứu trạng thái</span></p>
        <p><strong>Toàn cầu</strong><span>Mỹ, Úc, Canada, Châu Âu</span></p>
      </section>

      <section className="section services" id="services">
        <div className="section-heading">
          <p className="kicker">Từ kiện nhỏ đến lô hàng khó</p>
          <h2>Một đối tác. Ba nhu cầu<br />vận chuyển cốt lõi.</h2>
          <p>Chọn đúng tuyến, đúng phương án và biết rõ ai đang chịu trách nhiệm cho lô hàng của bạn.</p>
        </div>
        <div className="service-grid">
          <article className="service-card service-featured">
            <span className="service-number">01</span>
            <div className="service-icon">✦</div>
            <p className="card-label">DỊCH VỤ CHỦ LỰC</p>
            <h3>Vận chuyển quốc tế</h3>
            <p>Gửi hàng đi Mỹ, Úc, Canada và Châu Âu với phương án door-to-door, hỗ trợ thuế và thủ tục.</p>
            <ul>
              <li>Hàng cá nhân & thương mại</li>
              <li>Đường bay & tuyến phù hợp</li>
              <li>Theo dõi hành trình rõ ràng</li>
            </ul>
            <a href="#quote">Nhận tư vấn tuyến <span>→</span></a>
          </article>
          <article className="service-card">
            <span className="service-number">02</span>
            <div className="service-icon">US</div>
            <p className="card-label">SHOPPING KHÔNG BIÊN GIỚI</p>
            <h3>Mua hộ hàng Mỹ</h3>
            <p>Đặt hàng từ Amazon, eBay, Costco và các website Mỹ; EZWAY hỗ trợ mua, nhận và đưa hàng về Việt Nam.</p>
            <a href="#quote">Tôi cần mua hộ <span>→</span></a>
          </article>
          <article className="service-card">
            <span className="service-number">03</span>
            <div className="service-icon">HS</div>
            <p className="card-label">GỠ NÚT THẮT HỒ SƠ</p>
            <h3>Thủ tục hải quan</h3>
            <p>Tư vấn hồ sơ cho hàng cồng kềnh, điện tử và lô hàng cần giấy phép nhập khẩu chuyên biệt.</p>
            <a href="#quote">Trao đổi lô hàng <span>→</span></a>
          </article>
        </div>
      </section>

      <section className="clarity-section" id="about">
        <div className="clarity-copy">
          <p className="kicker light-kicker">Logistics không cần mơ hồ</p>
          <h2>Biết hàng ở đâu.<br />Biết bước tiếp theo.<br /><em>Biết ai đang xử lý.</em></h2>
          <p>EZWAY được xây dựng từ hơn 7 năm kinh nghiệm trong ngành, tập trung xử lý những điểm nghẽn thường gặp: thông tin rời rạc, chi phí khó hiểu và thiếu một người theo sát.</p>
          <a className="button button-lime" href="#quote">Nói chuyện với chuyên viên</a>
        </div>
        <div className="clarity-board">
          <div className="board-head"><span>TỔNG QUAN LÔ HÀNG</span><i>LIVE</i></div>
          <div className="shipment-code">
            <small>MÃ VẬN ĐƠN</small><strong>EZW — 4829 0317</strong>
            <span>Đúng lịch</span>
          </div>
          <div className="progress-track"><span /></div>
          <div className="progress-labels"><span>Đã nhận</span><span>Đang bay</span><span>Hải quan</span><span>Giao hàng</span></div>
          <div className="board-grid">
            <div><small>ĐIỂM ĐẾN</small><strong>San Jose, US</strong></div>
            <div><small>DỰ KIẾN</small><strong>28 Tháng 08</strong></div>
            <div><small>PHƯƠNG THỨC</small><strong>Door-to-door</strong></div>
            <div><small>HỖ TRỢ</small><strong>Đang hoạt động</strong></div>
          </div>
          <div className="support-row"><span>EZ</span><p><small>PHỤ TRÁCH LÔ HÀNG</small><strong>Chuyên viên EZWAY</strong></p><a href="tel:0378899543">Gọi ngay</a></div>
        </div>
      </section>

      <section className="section process" id="process">
        <div className="section-heading compact-heading">
          <p className="kicker">Quy trình bốn bước</p>
          <h2>Từ yêu cầu đến tận tay.</h2>
          <p>Mỗi chặng đều có đầu việc rõ ràng, để bạn không phải tự ghép nối nhiều nhà cung cấp.</p>
        </div>
        <div className="process-line">
          <article><span>01</span><h3>Gửi yêu cầu</h3><p>Cho EZWAY biết loại hàng, điểm đến và thời gian mong muốn.</p></article>
          <article><span>02</span><h3>Chốt phương án</h3><p>Nhận tư vấn tuyến, chi phí và hồ sơ cần chuẩn bị trước khi gửi.</p></article>
          <article><span>03</span><h3>EZWAY xử lý</h3><p>Lấy hàng, đóng gói, khai báo và bàn giao cho mạng lưới vận chuyển.</p></article>
          <article><span>04</span><h3>Giao & đối soát</h3><p>Theo dõi trạng thái đến khi kiện hàng được giao tận tay người nhận.</p></article>
        </div>
      </section>

      <section className="tracking-section" id="tracking">
        <div>
          <p className="kicker light-kicker">Đã có mã vận đơn?</p>
          <h2>Một mã.<br />Toàn bộ hành trình.</h2>
          <p>Nhập mã để chuyển thẳng đến hệ thống tra cứu EZWAY hiện tại.</p>
        </div>
        <TrackingForm />
      </section>

      <section className="section quote-section" id="quote">
        <div className="quote-copy">
          <p className="kicker">Bắt đầu từ đây</p>
          <h2>Cho chúng tôi biết<br />bạn muốn gửi gì.</h2>
          <p>Chỉ cần thông tin cơ bản. Chuyên viên EZWAY sẽ tiếp nhận và cùng bạn chọn phương án phù hợp.</p>
          <div className="contact-stack">
            <a href="tel:0378899543"><small>GỌI TRỰC TIẾP</small><strong>0378 899 543</strong></a>
            <a href="mailto:Info@ezway.vn"><small>EMAIL</small><strong>Info@ezway.vn</strong></a>
          </div>
        </div>
        <div className="quote-card">
          <div className="quote-card-head"><span>YÊU CẦU TƯ VẤN</span><i>1–2 phút</i></div>
          <QuoteForm />
        </div>
      </section>

      <section className="section faq-section">
        <div className="section-heading compact-heading">
          <p className="kicker">Câu hỏi thường gặp</p>
          <h2>Những điều cần biết trước khi gửi.</h2>
        </div>
        <div className="faq-list">
          <details><summary>EZWAY đang hỗ trợ những tuyến nào?<span>+</span></summary><p>Website hiện tại giới thiệu các tuyến chính từ Việt Nam đi Mỹ, Úc, Canada và Châu Âu. Với điểm đến khác, bạn có thể gửi yêu cầu để được kiểm tra tuyến phù hợp.</p></details>
          <details><summary>Tôi chưa biết chính xác trọng lượng có nhận tư vấn được không?<span>+</span></summary><p>Có. Bạn có thể gửi kích thước ước lượng hoặc hình ảnh kiện hàng trước; chuyên viên sẽ hướng dẫn cách tính trọng lượng thực và trọng lượng quy đổi.</p></details>
          <details><summary>Hàng cồng kềnh hoặc điện tử có gửi được không?<span>+</span></summary><p>Tùy loại hàng, quốc gia đến và yêu cầu giấy phép. EZWAY có dịch vụ tư vấn hải quan cho các lô hàng đặc thù trước khi nhận vận chuyển.</p></details>
          <details><summary>Tôi theo dõi đơn hàng bằng cách nào?<span>+</span></summary><p>Dùng mã vận đơn trong khu vực “Tra cứu đơn hàng”. Nếu trạng thái cần làm rõ, hãy gọi trực tiếp 0378 899 543 để được hỗ trợ.</p></details>
        </div>
      </section>

      <footer>
        <div className="footer-top">
          <a className="brand footer-brand" href="#top" aria-label="EZWAY - về đầu trang">
            <span className="brand-mark" aria-hidden="true">E</span>
            <span><strong>EZWAY</strong><small>Moving made easy</small></span>
          </a>
          <p>Giải pháp vận chuyển quốc tế, mua hộ hàng Mỹ và hỗ trợ thủ tục hải quan.</p>
          <a className="footer-chat" href="https://zalo.me/0378899543" target="_blank" rel="noreferrer">Chat Zalo <span>↗</span></a>
        </div>
        <div className="footer-bottom"><span>© 2026 EZWAY Logistics</span><span>TP. Hồ Chí Minh · Việt Nam</span></div>
      </footer>

      <div className="mobile-cta"><a href="tel:0378899543">Gọi ngay</a><a href="#quote">Nhận báo giá</a></div>
    </main>
  );
}
