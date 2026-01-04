import React, { useState } from 'react';
import { Button } from './UiElements';
import { ShieldCheck, Clock, MapPin, Search, ArrowRight, Zap, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Hero: React.FC = () => {
  const [trackingId, setTrackingId] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (trackingId.trim()) {
      navigate(`/tra-cuu?id=${trackingId.trim()}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative min-h-[95vh] flex items-center bg-gradient-to-br from-blue-50 via-white to-slate-50 overflow-hidden pt-32 pb-16 lg:pt-36 lg:pb-0">
      
      {/* Background Decor Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[100px] mix-blend-multiply animate-blob"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-orange-100/30 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-2000"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Content Left (7 cols) */}
          <div className="lg:col-span-7 space-y-8 lg:space-y-10 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-white border border-blue-100 rounded-full px-4 py-2 text-brand-blue text-sm font-bold shadow-sm animate-fade-in-up">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span className="tracking-wide text-xs uppercase">Giải pháp Logistics Toàn Cầu</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-brand-navy leading-[1.1] tracking-tight">
              Vận chuyển Quốc Tế <br/>
              {/* Added pb-3 and leading-normal to fix clipping issues with bg-clip-text on descenders */}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-500 text-3xl md:text-4xl lg:text-5xl mt-2 pb-3 leading-normal">
                Đơn giản - An toàn & Tiết Kiệm
              </span>
            </h1>
            
            <p className="text-lg lg:text-xl text-slate-600 max-w-xl leading-relaxed mx-auto lg:mx-0">
              Dịch vụ mua hộ và vận chuyển chuyên nghiệp. Tỷ giá tốt nhất thị trường, cam kết bảo hiểm 100% giá trị hàng hóa.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center lg:justify-start">
              {/* Primary Call to Action uses Orange (Accent) */}
              <Button to="/gia-cuoc" variant="cta" size="xl" icon className="shadow-orange-500/25">
                Nhận báo giá ngay
              </Button>
              <Button to="/dich-vu" variant="white" size="xl" className="text-slate-700 border-slate-200 hover:border-brand-blue hover:text-brand-blue">
                Tìm hiểu quy trình
              </Button>
            </div>

            <div className="pt-8 border-t border-slate-200/60 flex flex-wrap justify-center lg:justify-start gap-6 md:gap-10 text-slate-600 text-sm font-semibold">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-green-100 rounded-full text-green-600"><ShieldCheck className="w-4 h-4" /></div>
                <span>Bảo hiểm 100%</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-blue-100 rounded-full text-brand-blue"><Clock className="w-4 h-4" /></div>
                <span>Giao 7-10 ngày</span>
              </div>
               <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-orange-100 rounded-full text-accent"><Zap className="w-4 h-4" /></div>
                <span>Tracking 24/7</span>
              </div>
            </div>
          </div>

          {/* Visual Right (5 cols) - Functional Tracking Widget */}
          <div className="lg:col-span-5 relative perspective-1000">
            {/* Main Widget Card */}
            <div className="relative z-10 bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-white shadow-2xl shadow-blue-900/10 transform rotate-y-6 hover:rotate-y-0 transition-transform duration-700 ease-out">
                 {/* Widget Header */}
                 <div className="flex justify-between items-center mb-8">
                    <h3 className="text-brand-navy font-bold text-lg flex items-center gap-2">
                       <div className="p-2 bg-brand-blue/10 rounded-lg text-brand-blue">
                          <Search className="w-5 h-5" />
                       </div>
                       Tra cứu vận đơn
                    </h3>
                    <div className="flex gap-1.5">
                       <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
                       <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80"></div>
                       <div className="w-2.5 h-2.5 rounded-full bg-green-400/80"></div>
                    </div>
                 </div>

                 {/* Input Simulation */}
                 <div className="relative mb-8 group">
                    <input 
                      type="text" 
                      placeholder="Nhập mã tracking (VD: EZ123...)" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-4 pr-14 text-slate-900 font-medium focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all placeholder:text-slate-400 shadow-inner"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <button 
                      onClick={handleSearch}
                      className="absolute right-2 top-2 bottom-2 bg-brand-blue hover:bg-blue-700 text-white px-3 rounded-lg transition-colors shadow-md shadow-blue-500/20"
                    >
                       <ArrowRight className="w-5 h-5" />
                    </button>
                 </div>

                 {/* Status Visual */}
                 <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-white border border-blue-100 shadow-sm">
                        <div className="mt-1 relative">
                           {/* Status Indicator Green for Success/Active */}
                           <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_0_4px_rgba(34,197,94,0.2)]"></div>
                           <div className="absolute top-3 left-1.5 w-0.5 h-10 bg-slate-200"></div>
                        </div>
                        <div>
                           <p className="text-[10px] text-brand-blue uppercase font-bold tracking-wider mb-1">Mới cập nhật</p>
                           <p className="text-brand-navy text-sm font-bold">Đã nhập kho Tân Sơn Nhất (SGN)</p>
                           <p className="text-xs text-slate-500 mt-1">10:45 AM • Hôm nay</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-2 pl-4 opacity-60 grayscale hover:grayscale-0 transition-all">
                        <div className="mt-1">
                           <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
                        </div>
                        <div>
                           <p className="text-slate-700 text-sm font-medium">Đang vận chuyển (In Transit)</p>
                           <p className="text-xs text-slate-400 mt-1">Los Angeles, USA • Hôm qua</p>
                        </div>
                    </div>
                 </div>
            </div>
            
            {/* 3D Floating Elements (Decorative) */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-accent rounded-3xl rotate-12 opacity-20 blur-xl animate-float"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-brand-blue rounded-full opacity-10 blur-2xl animate-float animation-delay-2000"></div>
          </div>
        </div>
      </div>
    </div>
  );
};