export type FreightMode = 'sea' | 'air';

export const STORY_MOTION = {
  desktopScroll: 3.6,
  tabletScroll: 2.6,
  scrub: 0.45,
  preloadMargin: '900px 0px',
  phaseCount: 6,
} as const;

export const FREIGHT_STORIES = {
  sea: {
    eyebrow: 'SEA FREIGHT',
    headline: 'VẬN CHUYỂN ĐƯỜNG BIỂN ỔN ĐỊNH, TIẾT KIỆM, MINH BẠCH',
    description: 'Phù hợp hàng cồng kềnh, hàng số lượng lớn. Tư vấn tối ưu chi phí, kiểm tra phương án door-to-door và theo dõi hành trình rõ ràng.',
    features: ['FCL / LCL', 'Theo dõi vận đơn', 'Đóng gói / chứng từ'],
    phases: [
      ['Chuẩn bị tại bãi', 'Kiểm tra hàng, phương án đóng container và điều kiện tuyến.'],
      ['Nâng container', 'Spreader hạ xuống, khóa container và nâng khỏi mặt bãi.'],
      ['Đặt lên đầu kéo', 'Điều phối thiết bị, hạ container lên chassis để bàn giao.'],
      ['Di chuyển tới cảng', 'Đầu kéo đưa container từ bãi tới khu vực xếp tàu.'],
      ['Xếp lên tàu', 'Cẩu cảng nâng container khỏi xe và hạ vào vị trí trên boong.'],
      ['Rời bến', 'Theo dõi hành trình qua các mốc cập nhật từ đối tác.'],
    ],
    final: 'Giải pháp đường biển tối ưu cho lô hàng lớn, chi phí tiết kiệm, lịch trình rõ ràng.',
    ctas: [['Xem bảng giá SEA', '/gia-cuoc#yeu-cau'], ['Nhận tư vấn gửi hàng', '#bao-gia']],
  },
  air: {
    eyebrow: 'AIR FREIGHT',
    headline: 'GỬI HÀNG ĐƯỜNG BAY NHANH, AN TOÀN, ĐÚNG LỊCH',
    description: 'Phù hợp hàng cần đi nhanh, theo dõi dễ dàng, tối ưu thời gian giao nhận quốc tế. Phương án và thời gian dự kiến được xác nhận theo tuyến.',
    features: ['Express / Priority', 'Theo dõi minh bạch', 'Chứng từ / đóng gói'],
    phases: [
      ['Sẵn sàng tại sân đỗ', 'Pallet và thiết bị phục vụ mặt đất chờ tại khu vực hàng hóa.'],
      ['Tiếp cận máy bay', 'High loader đưa pallet tới cửa khoang hàng đang mở.'],
      ['Nạp hàng vào khoang', 'Nâng platform, chuyển pallet vào khoang và đóng cửa.'],
      ['Chuẩn bị khởi hành', 'Thiết bị rời sân đỗ; máy bay chuyển tới đường băng.'],
      ['Tăng tốc & cất cánh', 'Máy bay tăng tốc, nâng mũi và rời mặt đất.'],
      ['Kết nối điểm đến', 'Theo dõi các chặng khai thác và giao nhận tiếp theo.'],
    ],
    final: 'Giải pháp đường bay cho các lô hàng cần tốc độ, lịch trình ổn định và hỗ trợ tận nơi.',
    ctas: [['Xem dịch vụ AIR', '/dich-vu/van-chuyen-hang-khong'], ['Nhận báo giá ngay', '#bao-gia']],
  },
} as const;
