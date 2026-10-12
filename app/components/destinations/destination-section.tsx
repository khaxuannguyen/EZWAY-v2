import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { destinationRoutes } from './destination-routes';
import './destination.css';

export function DestinationSection() {
  return <section className="ez-section ez-destinations" id="tuyen-van-chuyen" aria-labelledby="destination-heading">
    <div className="ez-container">
      <div className="ez-destination-intro">
        <div><p className="ez-kicker">02 / KẾT NỐI QUỐC TẾ</p><h2 id="destination-heading">Từ Việt Nam.<br/><span>Đến nơi bạn cần.</span></h2></div>
        <div className="ez-destination-lead"><span className="ez-destination-coordinate">VIETNAM <ArrowRight size={18}/> WORLD</span><p>Mỗi điểm đến mở ra một hành trình. Chọn nơi bạn muốn gửi hàng — EZWAY cùng bạn chuẩn bị phương án phù hợp.</p><span className="ez-destination-count">06 ĐIỂM ĐẾN · MỘT SỰ ĐỒNG HÀNH</span></div>
      </div>
      <p className="ez-destination-swipe">Vuốt để khám phá các điểm đến <ArrowRight size={16}/></p>
      <div className="ez-destination-gallery" role="list" aria-label="Các điểm đến quốc tế">
        {destinationRoutes.map((route, index) => {
          const asset = `/assets/destinations/v1/${route.code.toLowerCase()}`;
          return <div role="listitem" className="ez-destination-item" key={route.code}><a className="ez-destination-card" href={`/gia-cuoc?destination=${route.code}&source=destination_gallery#yeu-cau`} data-quote-destination={route.code} data-quote-source="destination_gallery" aria-label={`Nhận tư vấn tuyến đi ${route.name}`}>
            <img className="ez-destination-photo" src={`${asset}-960.webp`} srcSet={`${asset}-600.webp 600w, ${asset}-960.webp 960w`} sizes="(max-width: 650px) 84vw, (max-width: 1000px) 45vw, 400px" width="960" height="1200" alt={`Hình minh hoạ ${route.landmark}`} loading="lazy" decoding="async"/>
            <div className="ez-destination-top"><span className="ez-destination-flag"><img src={`/assets/destinations/v1/flags/${route.code.toLowerCase()}.svg`} width="30" height="20" alt=""/>{route.code === 'EU' ? 'ĐA QUỐC GIA' : route.name}</span><span className="ez-destination-route">VN / 0{index + 1}</span></div>
            <div className="ez-destination-content"><div className="ez-destination-title"><span className="ez-destination-code" aria-hidden="true">{route.code}</span><h3>{route.name}</h3></div><p>{route.copy}</p><span className="ez-destination-link">Tư vấn tuyến<span className="ez-destination-arrow"><ArrowUpRight size={20}/></span></span></div>
          </a></div>;
        })}
      </div>
      <div className="ez-destination-footer"><div><h3>Điểm đến của bạn. Phương án của chúng tôi.</h3><p>Chia sẻ loại hàng và nơi nhận để bắt đầu một cuộc trao đổi.</p></div><a href="/gia-cuoc#yeu-cau">Nhận báo giá theo điểm đến <ArrowUpRight size={19}/></a></div>
      <p className="ez-destination-note">Hình điểm đến mang tính minh hoạ. Điều kiện nhận hàng được xác nhận theo từng tuyến.</p>
    </div>
  </section>;
}
