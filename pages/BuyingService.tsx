import React from 'react';
import { Section, SectionHeader, Card, Button } from '../components/UiElements';
import { CheckCircle, ShoppingBag, CreditCard, PackageCheck, Truck, ArrowRight, Calculator, Zap, ShieldCheck, AlertCircle, X, Check } from 'lucide-react';

const STEPS = [
  {
    icon: ShoppingBag,
    title: "1. Gửi Link Sản Phẩm",
    desc: "Tìm món đồ bạn thích tại Amazon, eBay, BestBuy... và gửi link cho EZWAY. Đội ngũ sẽ kiểm tra độ uy tín của người bán (Seller Rating) giúp bạn."
  },
  {
    icon: Calculator,
    title: "2. Nhận Báo Giá Chi Tiết",
    desc: "Bảng giá trọn gói (All-in) bao gồm: Giá web + Tax Mỹ (nếu có) + Phí mua hộ (3-5%) + Cước vận chuyển ước tính."
  },
  {
    icon: CreditCard,
    title: "3. Đặt Cọc & Mua Hàng",
    desc: "Thanh toán cọc 70-100% giá trị đơn hàng bằng VNĐ. Chúng tôi tiến hành checkout ngay lập tức để không lỡ deal sale."
  },
  {
    icon: PackageCheck,
    title: "4. Nhận Hàng Tại VN",
    desc: "Hàng về sau 7-14 ngày. EZWAY hỗ trợ freeship nội thành hoặc gửi Viettel Post đi tỉnh. Bạn thanh toán phần còn lại khi nhận hàng."
  }
];

const CATEGORIES = [
  {
    title: "Hàng Công Nghệ & Điện Tử",
    items: ["Laptop, MacBook, Surface", "Điện thoại iPhone, Samsung", "Linh kiện PC, Card màn hình"],
    note: "Bảo hiểm 100% hư hỏng, vỡ màn hình. Bao thủ tục hải quan.",
    fee: "Phụ thu thấp nhất thị trường"
  },
  {
    title: "Thời Trang & Hàng Hiệu",
    items: ["Quần áo, Giày Sneaker", "Túi xách (Coach, MK, LV...)", "Kính mát, Đồng hồ"],
    note: "Cam kết giữ nguyên hộp (Fullbox), bill giấy từ hãng.",
    fee: "Cước tính theo cân thực tế"
  },
  {
    title: "Thực Phẩm & TPCN",
    items: ["Vitamin, Collagen", "Sữa bột, Đồ ăn dặm", "Nước hoa, Mỹ phẩm"],
    note: "Date xa, hỗ trợ đóng gói chống sốc, kiểm đếm số lượng.",
    fee: "Không phụ thu số lượng lớn"
  }
];

const WEBSITES = [
  { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1200px-Amazon_logo.svg.png", url: "https://www.amazon.com" },
  { name: "eBay", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/EBay_logo.svg/1200px-EBay_logo.svg.png", url: "https://www.ebay.com" },
  { name: "Costco", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Costco_Wholesale_logo_2010-10-26.svg/1200px-Costco_Wholesale_logo_2010-10-26.svg.png", url: "https://www.costco.com" },
  { name: "Jomashop", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Jomashop_Logo.jpg/800px-Jomashop_Logo.jpg", url: "https://www.jomashop.com" }, // Fallback text if img fails
  { name: "Sephora", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Sephora_logo.svg/1200px-Sephora_logo.svg.png", url: "https://www.sephora.com" }, 
  { name: "Nike", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png", url: "https://www.nike.com" },
];

export const BuyingService: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="bg-slate-900 pt-32 pb-24 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/90 to-slate-900"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/50 text-orange-400 font-bold text-sm mb-6">
            <Zap className="w-4 h-4" /> Dịch vụ mua hộ trọn gói A-Z
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
            Săn Sale Hàng Mỹ <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white">Giá Về Tay Cực Rẻ</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
            Bạn chỉ cần gửi link, EZWAY sẽ lo toàn bộ thủ tục thanh toán, thuế Mỹ, vận chuyển và thông quan. Tỷ giá tốt nhất thị trường.
          </p>
          <div className="flex justify-center gap-4">
            <Button to="/lien-he" size="xl" icon>Gửi Link Báo Giá Ngay</Button>
            <Button variant="outline" size="xl" className="border-slate-600 text-slate-300 hover:bg-white hover:text-slate-900 hover:border-white">Xem Quy Trình</Button>
          </div>
        </div>
      </div>

      {/* Real World Example Section - NEW */}
      <Section bg="white" className="-mt-12 pt-0 relative z-20">
        <div className="max-w-[1200px] mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              
              {/* Left: The Formula */}
              <div className="p-8 lg:p-12 bg-slate-50">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <Calculator className="w-6 h-6 text-primary" />
                  Công thức tính giá về tay
                </h3>
                <div className="space-y-4 text-slate-700">
                   <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <span className="font-semibold">1. Giá Web (Price)</span>
                      <span className="text-sm bg-slate-100 px-2 py-1 rounded">Theo link sản phẩm</span>
                   </div>
                   <div className="flex justify-center text-slate-400"><span className="text-xl">+</span></div>
                   <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <span className="font-semibold">2. Tax Mỹ (Nếu có)</span>
                      <span className="text-sm bg-slate-100 px-2 py-1 rounded">Thường là 8-9%</span>
                   </div>
                   <div className="flex justify-center text-slate-400"><span className="text-xl">+</span></div>
                   <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <span className="font-semibold">3. Công Mua Hộ</span>
                      <span className="text-sm bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded">Chỉ từ 3% - 5%</span>
                   </div>
                   <div className="flex justify-center text-slate-400"><span className="text-xl">+</span></div>
                   <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <span className="font-semibold">4. Cước Vận Chuyển</span>
                      <span className="text-sm bg-slate-100 px-2 py-1 rounded">Tính theo KG thực tế</span>
                   </div>
                </div>
                <div className="mt-8 p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-sm text-slate-600">
                  <strong className="text-primary block mb-1">Lưu ý:</strong>
                  Tỷ giá tính theo Vietcombank bán ra + chênh lệch chuyển đổi ngoại tệ (thấp hơn thị trường chợ đen).
                </div>
              </div>

              {/* Right: Concrete Example */}
              <div className="p-8 lg:p-12 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                
                <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-wider opacity-80 border-b border-white/10 pb-4">
                  Ví dụ thực tế: Giày Nike Air Jordan 1
                </h3>

                <div className="space-y-5 text-sm md:text-base relative z-10">
                   <div className="flex justify-between items-center">
                      <span className="text-slate-300">Giá Web (Nike.com)</span>
                      <span className="font-mono font-bold">$120.00</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-slate-300">Tax Mỹ (8.75%)</span>
                      <span className="font-mono text-red-300">+$10.50</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-slate-300">Công mua hộ (3%)</span>
                      <span className="font-mono text-accent">+$3.60</span>
                   </div>
                   <div className="flex justify-between items-center pb-4 border-b border-white/10">
                      <span className="text-slate-300">Cước vận chuyển (Ước tính 1kg)</span>
                      <span className="font-mono text-slate-300">+$10.00</span>
                   </div>
                   
                   <div className="flex justify-between items-center pt-2">
                      <span className="font-bold text-lg">Tổng chi phí về tay</span>
                      <div className="text-right">
                         <span className="block text-2xl font-bold text-green-400 font-mono">$144.10</span>
                         <span className="text-xs text-slate-400">~ 3.650.000 VNĐ</span>
                      </div>
                   </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                   <p className="text-sm text-slate-400 mb-4">So với giá cửa hàng tại Việt Nam (~5.000.000đ)</p>
                   <div className="inline-block bg-green-500/20 text-green-400 px-4 py-2 rounded-lg font-bold border border-green-500/30">
                      TIẾT KIỆM NGAY 1.350.000đ
                   </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </Section>

      {/* Categories Detail */}
      <Section bg="light">
        <SectionHeader title="Chúng tôi mua hộ những gì?" subtitle="Đa dạng ngành hàng" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CATEGORIES.map((cat, idx) => (
            <Card key={idx} className="bg-white hover:border-primary transition-all duration-300">
               <div className="mb-6">
                 <h3 className="text-xl font-bold text-slate-900 mb-3">{cat.title}</h3>
                 <div className="w-12 h-1 bg-accent rounded-full"></div>
               </div>
               <ul className="space-y-3 mb-6">
                 {cat.items.map((item, i) => (
                   <li key={i} className="flex items-center text-slate-600 text-sm">
                     <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                     {item}
                   </li>
                 ))}
               </ul>
               <div className="bg-surface p-4 rounded-xl border border-slate-100 text-sm space-y-2">
                 <p className="flex items-start text-slate-700">
                    <ShieldCheck className="w-4 h-4 text-green-600 mr-2 mt-0.5 shrink-0" />
                    {cat.note}
                 </p>
                 <p className="flex items-start text-slate-700 font-semibold">
                    <Zap className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 shrink-0" />
                    {cat.fee}
                 </p>
               </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Why Use Service vs DIY */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
             <SectionHeader title="Tại sao nên chọn mua hộ?" subtitle="Giải pháp thông minh" align="left" />
             <p className="text-lg text-slate-600 mb-8 leading-relaxed">
               Việc tự mua hàng từ website Mỹ thường gặp rào cản về thẻ thanh toán (thẻ VN hay bị hủy đơn), địa chỉ nhận hàng tại Mỹ và thủ tục hải quan phức tạp khi về Việt Nam.
             </p>
             
             <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="grid grid-cols-2 text-center text-sm font-bold bg-slate-50 border-b border-slate-200">
                   <div className="p-4 text-slate-500">Tự Mua (DIY)</div>
                   <div className="p-4 text-primary bg-blue-50">Dùng EZWAY</div>
                </div>
                <div className="divide-y divide-slate-100">
                   <div className="grid grid-cols-2 text-sm p-4 items-center">
                      <div className="flex items-center gap-2 text-slate-600"><X className="w-4 h-4 text-red-500" /> Cần thẻ Visa/Master Mỹ</div>
                      <div className="flex items-center gap-2 text-slate-900 font-medium bg-blue-50/50 p-2 rounded"><Check className="w-4 h-4 text-green-500" /> Chuyển khoản VNĐ</div>
                   </div>
                   <div className="grid grid-cols-2 text-sm p-4 items-center">
                      <div className="flex items-center gap-2 text-slate-600"><X className="w-4 h-4 text-red-500" /> Rủi ro mất hàng cao</div>
                      <div className="flex items-center gap-2 text-slate-900 font-medium bg-blue-50/50 p-2 rounded"><Check className="w-4 h-4 text-green-500" /> Bảo hiểm 100%</div>
                   </div>
                   <div className="grid grid-cols-2 text-sm p-4 items-center">
                      <div className="flex items-center gap-2 text-slate-600"><X className="w-4 h-4 text-red-500" /> Tự lo thủ tục Hải Quan</div>
                      <div className="flex items-center gap-2 text-slate-900 font-medium bg-blue-50/50 p-2 rounded"><Check className="w-4 h-4 text-green-500" /> Bao thuế & Thông quan</div>
                   </div>
                   <div className="grid grid-cols-2 text-sm p-4 items-center">
                      <div className="flex items-center gap-2 text-slate-600"><X className="w-4 h-4 text-red-500" /> Web chặn IP Việt Nam</div>
                      <div className="flex items-center gap-2 text-slate-900 font-medium bg-blue-50/50 p-2 rounded"><Check className="w-4 h-4 text-green-500" /> Checkout mọi website</div>
                   </div>
                </div>
             </div>
          </div>

          <div className="space-y-8">
             <h3 className="text-2xl font-bold text-slate-900 mb-6">Quy trình chuyên nghiệp</h3>
             <div className="space-y-6">
                {STEPS.map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                     <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center shadow-sm">
                           <step.icon className="w-6 h-6" />
                        </div>
                        {idx !== STEPS.length - 1 && (
                           <div className="w-0.5 h-full bg-slate-200 mx-auto my-2"></div>
                        )}
                     </div>
                     <div className="pb-8">
                        <h4 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </Section>

      {/* Popular Websites Strip */}
      <div className="bg-slate-50 py-16 border-t border-slate-200">
        <div className="max-w-[1200px] mx-auto px-6">
          <p className="text-center text-slate-500 font-semibold mb-8 uppercase tracking-widest text-xs">Hỗ trợ mua hàng trên 100+ Website Mỹ</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
             {WEBSITES.map((site, i) => (
                <a key={i} href={site.url} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                   {site.logo && !site.logo.includes('Jomashop') ? (
                      <img src={site.logo} alt={site.name} className="h-8 md:h-10 w-auto object-contain" />
                   ) : (
                      <span className="text-xl font-bold text-slate-800">{site.name}</span>
                   )}
                </a>
             ))}
          </div>
          <div className="text-center mt-12">
             <Button to="/lien-he" size="xl" variant="primary" icon className="shadow-orange-500/25">Gửi Link Để Nhận Báo Giá</Button>
          </div>
        </div>
      </div>
    </>
  );
};