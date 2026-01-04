import React from 'react';
import { Section, SectionHeader, Card, Button } from '../components/UiElements';
import { Plane, Ship, Package, Home, Shield, RefreshCw } from 'lucide-react';

const SERVICES_LIST = [
  {
    icon: Plane,
    title: "Vận chuyển đường hàng không",
    desc: "Giải pháp nhanh nhất cho hàng hóa cấp thiết. Thời gian 3-5 ngày làm việc. Phù hợp tài liệu, mẫu phẩm, hàng giá trị cao. Bay thẳng từ SGN/HAN đến LAX/JFK."
  },
  {
    icon: Ship,
    title: "Vận chuyển đường biển",
    desc: "Giải pháp tiết kiệm tối đa cho hàng cồng kềnh, số lượng lớn. Thời gian 3-4 tuần. Dịch vụ gom hàng lẻ (LCL) và nguyên container (FCL)."
  },
  {
    icon: Package,
    title: "Gửi hàng cá nhân đi Mỹ",
    desc: "Dịch vụ dành cho quà tặng, hành lý cá nhân, thực phẩm khô đi Mỹ. Chúng tôi hỗ trợ trọn gói thủ tục FDA, tem nhãn mác."
  },
  {
    icon: Home,
    title: "Door-to-Door Delivery",
    desc: "Lấy hàng tận nhà tại VN, giao tận tay người nhận tại nước ngoài. Khách hàng không cần phải ra bưu cục hay lo lắng về vận chuyển nội địa."
  },
  {
    icon: Shield,
    title: "Bảo hiểm hàng hóa",
    desc: "Chính sách đền bù minh bạch. Cam kết hoàn tiền 100% nếu mất mát, hư hỏng do vận chuyển. Bảo vệ quyền lợi tuyệt đối cho khách hàng."
  },
  {
    icon: RefreshCw,
    title: "Gom hàng & Đóng gói",
    desc: "Kho bãi rộng rãi hỗ trợ gom hàng từ nhiều shop online (Shopee, Tiki...). Đóng gói lại (re-packing) miễn phí để tiết kiệm thể tích."
  }
];

export const Services: React.FC = () => {
  return (
    <>
      <div className="bg-gradient-to-br from-primary to-blue-900 py-32 relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-[1200px] mx-auto px-6 text-center relative z-10">
            <h1 className="text-5xl lg:text-6xl font-extrabold text-white mb-6">Dịch Vụ Vận Chuyển</h1>
            <p className="text-blue-100 text-xl max-w-2xl mx-auto leading-relaxed">
              Chúng tôi cung cấp đa dạng các giải pháp logistics linh hoạt, phù hợp với mọi nhu cầu và ngân sách của cá nhân và doanh nghiệp.
            </p>
        </div>
      </div>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES_LIST.map((s, i) => (
            <Card key={i} className="flex flex-col hover:border-primary/30">
              <div className="w-14 h-14 bg-blue-50 text-primary rounded-xl flex items-center justify-center mb-6">
                <s.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">{s.title}</h3>
              <p className="text-slate-600 flex-grow mb-8 leading-relaxed">
                {s.desc}
              </p>
              <Button variant="outline" size="sm" to="/lien-he" className="self-start">Tư vấn ngay</Button>
            </Card>
          ))}
        </div>
      </Section>

      <Section bg="light">
        <SectionHeader title="Quy trình gửi hàng" subtitle="Đơn giản & Minh bạch" />
        <div className="max-w-5xl mx-auto relative">
            {/* Vertical Line for Desktop */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 transform -translate-x-1/2"></div>

            <div className="space-y-12 md:space-y-0">
                {/* Step 1 */}
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 relative">
                    <div className="md:w-1/2 flex justify-end">
                       <div className="bg-white p-8 rounded-2xl shadow-card border border-slate-100 md:text-right w-full md:max-w-md">
                          <h4 className="font-bold text-xl mb-2 text-primary">01. Liên hệ & Báo giá</h4>
                          <p className="text-slate-600">Cung cấp thông tin hàng hóa (loại hàng, khối lượng, kích thước) để nhận báo giá sơ bộ qua Zalo/Facebook.</p>
                       </div>
                    </div>
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary border-4 border-white shadow-lg z-10 hidden md:flex items-center justify-center text-white font-bold text-sm">1</div>
                    <div className="md:w-1/2"></div>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 relative md:pt-16">
                    <div className="md:w-1/2"></div>
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary border-4 border-white shadow-lg z-10 hidden md:flex items-center justify-center text-white font-bold text-sm">2</div>
                    <div className="md:w-1/2 flex justify-start">
                       <div className="bg-white p-8 rounded-2xl shadow-card border border-slate-100 w-full md:max-w-md">
                          <h4 className="font-bold text-xl mb-2 text-primary">02. Gửi hàng về kho</h4>
                          <p className="text-slate-600">Gửi hàng đến văn phòng EZWAY hoặc nhân viên đến lấy hàng tận nhà (khu vực nội thành TP.HCM).</p>
                       </div>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 relative md:pt-16">
                    <div className="md:w-1/2 flex justify-end">
                       <div className="bg-white p-8 rounded-2xl shadow-card border border-slate-100 md:text-right w-full md:max-w-md">
                          <h4 className="font-bold text-xl mb-2 text-primary">03. Thanh toán & Vận chuyển</h4>
                          <p className="text-slate-600">Hàng được kiểm tra, đóng gói lại chuẩn quốc tế, làm thủ tục hải quan và bay ngay trong ngày.</p>
                       </div>
                    </div>
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary border-4 border-white shadow-lg z-10 hidden md:flex items-center justify-center text-white font-bold text-sm">3</div>
                    <div className="md:w-1/2"></div>
                </div>
            </div>
        </div>
      </Section>
    </>
  );
};