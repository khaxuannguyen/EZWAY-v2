import React from 'react';
import { Hero } from '../components/Hero';
import { Section, SectionHeader, Card, Button } from '../components/UiElements';
import { ShoppingCart, Plane, FileCheck, Truck, Users, Globe, Award, Headphones, ArrowRight, Shield, Box, TrendingUp, CheckCircle2, Map, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const SERVICES = [
  {
    icon: ShoppingCart,
    title: 'Mua hộ hàng Mỹ',
    desc: 'Đặt hàng từ Amazon, eBay, Costco dễ dàng. Tỷ giá tốt nhất thị trường, miễn phí công mua cho đơn hàng lớn.',
    link: '/mua-ho-hang-my',
    color: 'bg-orange-50 text-orange-600'
  },
  {
    icon: Plane,
    title: 'Vận chuyển Quốc tế',
    desc: 'Gửi hàng đi Mỹ, Úc, Canada, Châu Âu. Dịch vụ Door-to-Door, bao thuế nhập khẩu và thủ tục hải quan.',
    link: '/dich-vu',
    color: 'bg-blue-50 text-blue-600'
  },
  {
    icon: FileCheck,
    title: 'Thủ tục Hải quan',
    desc: 'Giải quyết các lô hàng khó, hàng cồng kềnh, hàng điện tử. Tư vấn pháp lý và giấy phép nhập khẩu.',
    link: '/dich-vu',
    color: 'bg-green-50 text-green-600'
  }
];

// Partner Logos - using stable high-res PNGs to avoid SVG rendering issues
const PARTNERS = [
  { name: "FedEx", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/FedEx_logo.svg/1200px-FedEx_logo.svg.png", h: "h-8 md:h-12", url: "https://www.fedex.com" },
  { name: "DHL", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/DHL_Logo.svg/1200px-DHL_Logo.svg.png", h: "h-6 md:h-8", url: "https://www.dhl.com" },
  { name: "UPS", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/United_Parcel_Service_logo_2014.svg/1200px-United_Parcel_Service_logo_2014.svg.png", h: "h-8 md:h-12", url: "https://www.ups.com" },
  { name: "USPS", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/United_States_Postal_Service_Logo.svg/1200px-United_States_Postal_Service_Logo.svg.png", h: "h-8 md:h-12", url: "https://www.usps.com" },
  { name: "Vietnam Airlines", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Vietnam_Airlines_Logo.svg/1200px-Vietnam_Airlines_Logo.svg.png", h: "h-8 md:h-12", url: "https://www.vietnamairlines.com" },
  { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1200px-Amazon_logo.svg.png", h: "h-6 md:h-9", url: "https://www.amazon.com" },
  { name: "eBay", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/EBay_logo.svg/1200px-EBay_logo.svg.png", h: "h-8 md:h-12", url: "https://www.ebay.com" },
];

export const Home: React.FC = () => {
  return (
    <>
      <Hero />

      {/* Trusted By / Partners Strip */}
      <div className="border-b border-slate-100 bg-white py-12 overflow-hidden relative">
         {/* Subtle fade overlay on sides */}
         <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10"></div>
         <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10"></div>
         
        <div className="max-w-[1200px] mx-auto px-6">
           <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-10">Đối tác vận chuyển & Thương mại điện tử hàng đầu</p>
           <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
              {PARTNERS.map((p, i) => (
                 <a 
                    key={i} 
                    href={p.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center transition-all duration-300 filter grayscale opacity-40 hover:grayscale-0 hover:opacity-100 hover:scale-110 hover:drop-shadow-xl p-2"
                    title={`Truy cập ${p.name}`}
                 >
                    <img 
                      src={p.logo} 
                      alt={p.name} 
                      className={`${p.h} w-auto object-contain`}
                    />
                 </a>
              ))}
           </div>
        </div>
      </div>

      {/* Services Grid */}
      <Section id="services" bg="light">
        <SectionHeader 
          title="Dịch vụ Logistics Toàn Diện" 
          subtitle="Giải pháp chuyên nghiệp"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {SERVICES.map((s, idx) => (
            <Card key={idx} className="h-full group border-t-4 border-t-transparent hover:border-t-primary transition-all">
              <div className={`w-16 h-16 ${s.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                <s.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900 group-hover:text-primary transition-colors">{s.title}</h3>
              <p className="text-slate-600 mb-8 leading-relaxed text-lg">
                {s.desc}
              </p>
              <div className="mt-auto">
                <Link to={s.link} className="inline-flex items-center text-primary font-bold hover:text-accent transition-colors group-hover:translate-x-2 duration-300">
                  Xem chi tiết <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Why Choose Us - Enhanced Layout */}
      <Section bg="white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 relative">
            {/* Visual Abstract blob/shape */}
            <div className="absolute -left-10 -top-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            
            <div className="relative grid grid-cols-2 gap-6">
               <div className="space-y-6 mt-12">
                  <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
                     <Headphones className="w-10 h-10 text-accent mb-4" />
                     <h4 className="font-bold text-lg mb-2 text-slate-900">Hỗ trợ 24/7</h4>
                     <p className="text-sm text-slate-600 leading-snug">Luôn sẵn sàng giải đáp mọi thắc mắc của bạn.</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
                     <FileCheck className="w-10 h-10 text-primary mb-4" />
                     <h4 className="font-bold text-lg mb-2 text-slate-900">Báo giá trọn gói</h4>
                     <p className="text-sm text-slate-600 leading-snug">Không phí ẩn, cam kết minh bạch tuyệt đối.</p>
                  </div>
               </div>
               <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
                     <Globe className="w-10 h-10 text-green-500 mb-4" />
                     <h4 className="font-bold text-lg mb-2 text-slate-900">Mạng lưới rộng</h4>
                     <p className="text-sm text-slate-600 leading-snug">Kết nối vận chuyển toàn cầu (Âu, Mỹ, Úc, Á).</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
                     <Award className="w-10 h-10 text-purple-500 mb-4" />
                     <h4 className="font-bold text-lg mb-2 text-slate-900">Chuyên môn cao</h4>
                     <p className="text-sm text-slate-600 leading-snug">Đội ngũ sáng lập 7 năm kinh nghiệm.</p>
                  </div>
               </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <SectionHeader 
              title="Đối tác tin cậy cho hàng hóa của bạn" 
              subtitle="Tại sao chọn EZWAY?"
              align="left"
              className="mb-8"
            />
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Chúng tôi không chỉ vận chuyển hàng hóa, chúng tôi mang đến sự an tâm. Với quy trình chuẩn hóa và công nghệ tracking hiện đại, bạn luôn làm chủ được hành trình đơn hàng của mình.
            </p>
            <div className="space-y-5 mb-10">
              {[
                {text: "Hệ thống đối tác toàn cầu: DHL, FedEx, UPS", icon: Globe},
                {text: "Đội ngũ xử lý hàng hóa chuyên nghiệp, đóng gói chuẩn IATA", icon: Shield},
                {text: "Cam kết đền bù 100% nếu xảy ra mất mát, hư hỏng", icon: Award},
                {text: "Miễn phí giao hàng nội thành TP.HCM & Hà Nội", icon: Truck}
              ].map((item, i) => (
                <div key={i} className="flex items-start group">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-primary flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-slate-700 font-medium pt-2">{item.text}</span>
                </div>
              ))}
            </div>
            <Button to="/lien-he" variant="primary" size="lg" icon>Tư vấn miễn phí</Button>
          </div>
        </div>
      </Section>

      {/* Story & Stats Section - REDESIGNED */}
      <Section bg="blue" className="relative overflow-hidden py-24">
         {/* Background Elements */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy to-brand-blue opacity-95"></div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* The Story Side */}
            <div className="text-left text-white space-y-8">
               <div>
                  <div className="inline-block px-4 py-1 bg-white/10 rounded-full text-accent font-bold text-xs uppercase mb-4 tracking-widest border border-white/10">
                    Câu chuyện của chúng tôi
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
                    Đúc kết <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-white">7 Năm Kinh Nghiệm.</span><br/>
                    Kiến tạo Giải pháp mới.
                  </h2>
                  <p className="text-blue-100 text-lg leading-relaxed opacity-90">
                    EZWAY ra đời không phải để trở thành công ty lâu đời nhất, mà để trở thành đối tác thấu hiểu bạn nhất. 
                    Được thành lập bởi đội ngũ chuyên gia đã có hơn <strong>7 năm chinh chiến</strong> tại các tập đoàn Logistics lớn, 
                    chúng tôi hiểu rõ từng "điểm nghẽn" của thị trường và quyết tâm xây dựng một dịch vụ <strong>Tử tế - Minh bạch - Toàn cầu</strong> ngay từ ngày đầu tiên.
                  </p>
                  <p className="text-blue-100 text-lg leading-relaxed opacity-90 mt-4 border-l-4 border-accent pl-4">
                     "Chúng tôi không chỉ vận chuyển đi Mỹ, chúng tôi kết nối Việt Nam với thế giới."
                  </p>
               </div>
               
               <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                        <CheckCircle2 className="w-6 h-6" />
                     </div>
                     <div>
                        <div className="text-2xl font-bold">100%</div>
                        <div className="text-sm text-blue-200">Trách nhiệm</div>
                     </div>
                  </div>
                  <div className="w-px h-12 bg-white/20 hidden sm:block"></div>
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                        <Zap className="w-6 h-6" />
                     </div>
                     <div>
                        <div className="text-2xl font-bold">Nhanh</div>
                        <div className="text-sm text-blue-200">Xử lý tối ưu</div>
                     </div>
                  </div>
               </div>
            </div>

            {/* The Real Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
               <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors group">
                  <TrendingUp className="w-8 h-8 text-accent mb-4 group-hover:scale-110 transition-transform" />
                  <div className="text-3xl font-bold text-white mb-1">7+ Năm</div>
                  <div className="text-sm font-medium text-blue-200 uppercase tracking-wide">Kinh nghiệm thực chiến</div>
                  <p className="text-xs text-blue-100/60 mt-2">Đội ngũ sáng lập am hiểu sâu sắc quy trình vận hành.</p>
               </div>
               
               <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors group translate-y-0 lg:translate-y-8">
                  <Globe className="w-8 h-8 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                  <div className="text-3xl font-bold text-white mb-1">200+</div>
                  <div className="text-sm font-medium text-blue-200 uppercase tracking-wide">Quốc gia kết nối</div>
                  <p className="text-xs text-blue-100/60 mt-2">Mạng lưới đối tác toàn cầu: Mỹ, Anh, Úc, Nhật...</p>
               </div>

               <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors group">
                  <Shield className="w-8 h-8 text-green-400 mb-4 group-hover:scale-110 transition-transform" />
                  <div className="text-3xl font-bold text-white mb-1">99.9%</div>
                  <div className="text-sm font-medium text-blue-200 uppercase tracking-wide">Tỷ lệ thông quan</div>
                  <p className="text-xs text-blue-100/60 mt-2">Xử lý hồ sơ chuyên nghiệp, hạn chế tối đa rủi ro.</p>
               </div>

               <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors group translate-y-0 lg:translate-y-8">
                  <Headphones className="w-8 h-8 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
                  <div className="text-3xl font-bold text-white mb-1">24/7</div>
                  <div className="text-sm font-medium text-blue-200 uppercase tracking-wide">Hỗ trợ tận tâm</div>
                  <p className="text-xs text-blue-100/60 mt-2">Luôn có người đồng hành cùng bạn trong mọi lô hàng.</p>
               </div>
            </div>
        </div>
      </Section>

      {/* CTA Strip */}
      <div className="bg-white py-24 relative overflow-hidden border-t border-slate-100">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-50 skew-x-12 opacity-50"></div>
        
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 relative z-10">
          <div className="bg-primary rounded-3xl p-10 lg:p-16 text-center lg:text-left shadow-2xl relative overflow-hidden">
             {/* Decor */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/20 rounded-full -ml-16 -mb-16 blur-3xl"></div>

             <div className="flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
                <div className="max-w-2xl">
                  <h2 className="text-3xl lg:text-5xl font-extrabold text-white mb-6">Sẵn sàng để gửi hàng?</h2>
                  <p className="text-blue-100 text-xl font-light leading-relaxed">
                    Đừng ngần ngại, hãy liên hệ ngay với EZWAY để nhận báo giá chi tiết và ưu đãi vận chuyển mới nhất.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                   <Button to="/lien-he" variant="white" size="xl" className="text-primary font-bold shadow-xl">Liên hệ ngay</Button>
                   <Button to="/gia-cuoc" variant="outline" size="xl" className="border-white/30 text-white hover:bg-white hover:text-primary hover:border-white">Xem bảng giá</Button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </>
  );
};