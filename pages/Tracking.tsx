import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Section, Button, Card } from '../components/UiElements';
import { Search, Package, MapPin, CheckCircle2, Truck, AlertCircle, Clock, Box, Layers, FileText, Copy, ArrowRight, Plane, Anchor, HelpCircle, ChevronRight } from 'lucide-react';

export const Tracking: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id) {
      setQuery(id);
      handleSearch(id);
    }
  }, [location]);

  const handleCopy = () => {
    if (result?.id) {
        navigator.clipboard.writeText(result.id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSearch = async (idToCheck = query) => {
    if (!idToCheck.trim()) return;
    
    setLoading(true);
    setError('');
    setResult(null);

    // Simulate API delay for UX
    try {
      // In a real app, replace this with actual API call
      // const response = await fetch(`http://localhost:3001/api/tracking?code=${idToCheck.trim()}`);
      
      // MOCK DATA LOGIC FOR DEMO
      await new Promise(resolve => setTimeout(resolve, 800)); // Fake delay
      
      if (idToCheck.length < 5) {
          throw new Error("Mã vận đơn không hợp lệ. Vui lòng kiểm tra lại.");
      }

      // Successful Mock Result
      setResult({
        id: idToCheck.toUpperCase(),
        status: 'in_transit', // pending, in_transit, customs, delivered
        statusLabel: 'Đang vận chuyển',
        currentStep: 2, // 1: Picked up, 2: In Transit, 3: Customs/Hub, 4: Delivered
        from: 'Thành phố Hồ Chí Minh, VN',
        to: 'California, USA',
        estimatedDelivery: '05/11/2024',
        service: 'KSN-SEA-USA-UPS',
        term: 'Người gửi trả phí (Prepaid)',
        weight: '12.5 KG',
        packing: 'Thùng carton (Đã đóng gỗ)',
        totalPackages: '26 Kiện',
        progress: 45,
        subPackages: ['320240474595-01', '320240474595-02'],
        events: [
          { date: '01/11/2024', time: '11:24', location: 'HO CHI MINH, VN', description: 'Đã hoàn tất thủ tục xuất khẩu (Export Customs Cleared)', status: 'current' },
          { date: '01/11/2024', time: '09:15', location: 'HO CHI MINH, VN', description: 'Hàng rời kho (Departed from Facility)', status: 'completed' },
          { date: '31/10/2024', time: '16:40', location: 'HO CHI MINH, VN', description: 'Đã nhận hàng tại kho EZWAY (Picked up)', status: 'completed' },
          { date: '31/10/2024', time: '14:30', location: 'System', description: 'Đã tạo nhãn vận đơn (Label Created)', status: 'completed' },
        ]
      });

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Không tìm thấy thông tin vận đơn. Vui lòng kiểm tra lại mã.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  // Helper to render status steps
  const renderSteps = (currentStep: number) => {
      const steps = [
          { id: 1, label: "Đã nhận hàng", icon: Box },
          { id: 2, label: "Đang vận chuyển", icon: Plane },
          { id: 3, label: "Đang giao phát", icon: Truck },
          { id: 4, label: "Giao thành công", icon: CheckCircle2 }
      ];

      return (
          <div className="w-full py-6">
              <div className="flex items-center justify-between relative">
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-100 -z-10"></div>
                  <div 
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-brand-blue -z-10 transition-all duration-1000"
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                  ></div>
                  
                  {steps.map((step) => {
                      const isActive = step.id <= currentStep;
                      const isCurrent = step.id === currentStep;
                      return (
                          <div key={step.id} className="flex flex-col items-center bg-white px-2">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                  isActive ? 'bg-brand-blue border-brand-blue text-white shadow-lg shadow-blue-200' : 'bg-white border-slate-200 text-slate-300'
                              }`}>
                                  <step.icon className="w-5 h-5" />
                              </div>
                              <span className={`text-xs font-bold mt-2 uppercase tracking-wide ${isActive ? 'text-brand-blue' : 'text-slate-400'}`}>
                                  {step.label}
                              </span>
                          </div>
                      )
                  })}
              </div>
          </div>
      );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Search Hero */}
      <div className="bg-brand-navy pt-32 pb-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-accent text-xs font-bold uppercase tracking-wider mb-6 animate-fade-in-up">
              Real-time Tracking System
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tight animate-fade-in-up delay-100">
              Tra Cứu Hành Trình Đơn Hàng
          </h1>
          
          <div className="relative group max-w-2xl mx-auto shadow-2xl rounded-2xl animate-fade-in-up delay-200">
             <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-slate-400 group-focus-within:text-brand-blue transition-colors" />
             </div>
             <input 
                type="text" 
                className="w-full h-20 pl-16 pr-40 rounded-2xl bg-white border-0 focus:ring-4 focus:ring-brand-blue/30 outline-none text-xl font-bold text-brand-navy placeholder:text-slate-300 transition-all"
                placeholder="Nhập mã vận đơn (VD: EZ123456)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
             />
             <div className="absolute right-2 top-2 bottom-2">
                <Button 
                   onClick={() => handleSearch()} 
                   disabled={loading}
                   className="h-full px-8 rounded-xl text-lg"
                   variant="cta"
                >
                   {loading ? (
                      <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Đang tìm...</span>
                      </div>
                   ) : (
                      <>Tra cứu</>
                   )}
                </Button>
             </div>
          </div>
          <p className="text-slate-400 mt-6 text-sm animate-fade-in-up delay-300">
              Hệ thống hỗ trợ tra cứu vận đơn: EZWAY, DHL, FedEx, UPS, USPS.
          </p>
        </div>
      </div>

      {/* Results Section */}
      <Section className="min-h-[600px] -mt-20 relative z-20 pt-0">
        
        {/* ERROR STATE */}
        {error && (
            <div className="max-w-2xl mx-auto text-center p-10 bg-white rounded-3xl border border-red-100 shadow-xl animate-fade-in-up">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-brand-navy mb-3">Không tìm thấy vận đơn</h3>
                <p className="text-slate-600 mb-8">{error}</p>
                <div className="flex justify-center gap-4">
                    <Button variant="outline" onClick={() => {setQuery(''); setError('')}}>Thử lại</Button>
                    <Button to="/lien-he" variant="primary">Liên hệ hỗ trợ</Button>
                </div>
            </div>
        )}

        {/* EMPTY STATE */}
        {!result && !loading && !error && (
             <div className="max-w-4xl mx-auto bg-white rounded-3xl p-12 text-center shadow-card border border-slate-100">
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Package className="w-12 h-12 text-brand-blue/50" />
                </div>
                <h3 className="text-xl font-bold text-brand-navy mb-2">Chưa có thông tin tra cứu</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                    Vui lòng nhập mã vận đơn vào ô tìm kiếm phía trên để xem chi tiết hành trình đơn hàng của bạn.
                </p>
             </div>
        )}

        {/* RESULT STATE */}
        {result && (
          <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
            
            {/* 1. Header & Status Progress */}
            <Card className="border-0 shadow-xl overflow-visible">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-slate-100">
                  <div className="w-full md:w-auto">
                     <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded">Mã vận đơn (Tracking ID)</span>
                        <div className="flex-grow md:hidden"></div>
                        <button 
                            onClick={handleCopy}
                            className="text-brand-blue hover:text-blue-700 text-xs font-bold flex items-center gap-1 transition-colors"
                        >
                            {copied ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            {copied ? 'Đã sao chép' : 'Sao chép'}
                        </button>
                     </div>
                     <div className="text-4xl lg:text-5xl font-black text-brand-navy tracking-tight flex items-center gap-3">
                         {result.id}
                     </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                      <div className="text-right">
                          <span className="block text-xs text-slate-500 font-bold uppercase mb-1">Dự kiến giao hàng</span>
                          <span className="block text-2xl font-bold text-accent">{result.estimatedDelivery}</span>
                      </div>
                  </div>
               </div>

               {/* Route Info */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-12 py-8">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-brand-blue shrink-0">
                        <MapPin className="w-6 h-6" />
                     </div>
                     <div>
                        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Gửi từ (Origin)</div>
                        <div className="font-bold text-lg text-brand-navy">{result.from}</div>
                     </div>
                  </div>
                  
                  <div className="hidden md:flex flex-col items-center justify-center opacity-30">
                     <div className="w-full border-t-2 border-dashed border-slate-400"></div>
                     <Plane className="w-5 h-5 text-slate-500 -mt-2.5 bg-white px-1 rotate-90 md:rotate-0" />
                  </div>

                  <div className="flex items-center gap-4 md:flex-row-reverse md:text-right">
                     <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-accent shrink-0">
                        <MapPin className="w-6 h-6" />
                     </div>
                     <div>
                        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Đến (Destination)</div>
                        <div className="font-bold text-lg text-brand-navy">{result.to}</div>
                     </div>
                  </div>
               </div>

               {/* Visual Stepper */}
               <div className="pt-4 pb-2 border-t border-slate-100">
                  {renderSteps(result.currentStep)}
               </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 2. Left Column: Details */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Shipment Info */}
                    <Card className="bg-white h-full border-t-4 border-t-brand-blue">
                        <h3 className="text-sm font-extrabold uppercase text-slate-400 mb-6 flex items-center gap-2 tracking-wider">
                            <FileText className="w-4 h-4" /> Thông tin kiện hàng
                        </h3>
                        <dl className="space-y-5">
                            <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                                <dt className="text-sm text-slate-500">Dịch vụ</dt>
                                <dd className="font-bold text-brand-blue text-right">{result.service}</dd>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                                <dt className="text-sm text-slate-500">Trọng lượng</dt>
                                <dd className="font-bold text-slate-900">{result.weight}</dd>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                                <dt className="text-sm text-slate-500">Số kiện</dt>
                                <dd className="font-bold text-slate-900">{result.totalPackages}</dd>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                                <dt className="text-sm text-slate-500">Đóng gói</dt>
                                <dd className="font-bold text-slate-900 text-right max-w-[60%]">{result.packing}</dd>
                            </div>
                            <div className="pt-2">
                                <dt className="text-sm text-slate-500 mb-1">Điều khoản (Term)</dt>
                                <dd className="font-bold text-xs bg-slate-100 px-2 py-1 rounded inline-block text-slate-700">{result.term}</dd>
                            </div>
                        </dl>
                    </Card>

                    {/* Support Box */}
                    <div className="bg-gradient-to-br from-brand-navy to-slate-800 rounded-2xl p-6 text-white shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <HelpCircle className="w-6 h-6 text-accent" />
                            <h4 className="font-bold text-lg">Cần hỗ trợ?</h4>
                        </div>
                        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                            Nếu đơn hàng có dấu hiệu bất thường hoặc chậm trễ, vui lòng liên hệ ngay.
                        </p>
                        <Button to="/lien-he" variant="teal" size="sm" className="w-full justify-center">
                            Liên hệ CSKH
                        </Button>
                    </div>
                </div>

                {/* 3. Right Column: Timeline */}
                <div className="lg:col-span-2">
                    <Card className="h-full border-0">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                            <h3 className="text-lg font-bold flex items-center gap-2 text-brand-navy">
                                <Clock className="w-5 h-5 text-accent" />
                                Chi tiết hành trình
                            </h3>
                            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase">Latest First</span>
                        </div>
                        
                        <div className="relative pl-4 space-y-10">
                            {/* Vertical Connecting Line */}
                            <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-slate-100"></div>

                            {result.events.map((event: any, i: number) => (
                                <div key={i} className="relative pl-10 group">
                                    {/* Timeline Node */}
                                    <div className={`absolute left-[18px] top-1.5 w-5 h-5 rounded-full border-4 border-white shadow-sm z-10 transition-all duration-300 ${
                                        i === 0 
                                            ? 'bg-accent ring-4 ring-orange-100 scale-110' 
                                            : 'bg-slate-300 group-hover:bg-brand-blue'
                                    }`}></div>
                                    
                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 bg-white rounded-xl hover:bg-slate-50 p-4 -ml-4 -mt-4 transition-colors border border-transparent hover:border-slate-100">
                                        <div className="sm:w-28 shrink-0 pt-0.5">
                                            <div className="font-bold text-brand-navy text-sm">{event.date}</div>
                                            <div className="text-xs text-slate-400 font-mono mt-0.5 flex items-center">
                                                <Clock className="w-3 h-3 mr-1" /> {event.time}
                                            </div>
                                        </div>
                                        <div className="flex-grow">
                                            <div className={`font-bold text-base mb-1.5 ${i === 0 ? 'text-accent' : 'text-slate-800'}`}>
                                                {event.description}
                                            </div>
                                            <div className="flex items-center text-xs text-slate-500 font-bold uppercase tracking-wide">
                                                <MapPin className="w-3 h-3 mr-1" /> {event.location}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
          </div>
        )}
      </Section>
    </div>
  );
};