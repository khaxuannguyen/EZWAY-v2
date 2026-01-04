import React, { useState, useEffect } from 'react';
import { Section, SectionHeader, Button, Card } from '../components/UiElements';
import { Info, Download, Phone, Plane, Ship, AlertCircle, Search, MapPin, ChevronDown, ChevronRight, Scale, ArrowDown, Calculator, Package, Check, AlertTriangle, FileText } from 'lucide-react';

// --- CONFIG DATA ---
const COUNTRIES = [
  { id: 'USA', name: 'Mỹ (USA)', flag: '🇺🇸', currency: 'VNĐ', rate: 240000 },
  { id: 'UK', name: 'Anh (UK)', flag: '🇬🇧', currency: 'VNĐ', rate: 260000 },
  { id: 'AUS', name: 'Úc (Australia)', flag: '🇦🇺', currency: 'VNĐ', rate: 230000 },
  { id: 'CAN', name: 'Canada', flag: '🇨🇦', currency: 'VNĐ', rate: 250000 },
  { id: 'JPN', name: 'Nhật Bản', flag: '🇯🇵', currency: 'VNĐ', rate: 190000 },
  { id: 'EU', name: 'Châu Âu (EU)', flag: '🇪🇺', currency: 'VNĐ', rate: 270000 },
];

const GOODS_TYPES = [
    { id: 'normal', name: 'Quần áo / Giày dép / Đồ thường', surcharge: 0 },
    { id: 'cosmetic', name: 'Mỹ phẩm / Nước hoa / TPCN', surcharge: 50000 }, // +50k/kg
    { id: 'electronic', name: 'Điện tử (Laptop/Phone/Loa)', surcharge: 0.10 }, // +10% value
    { id: 'luxury', name: 'Hàng hiệu (Túi/Đồng hồ >$500)', surcharge: 0.05 }, // +5% value
];

const EXCHANGE_RATE = 25500;

// --- SURCHARGE DATA ---
const SURCHARGE_DATA = {
  hcmAir: [
    { stt: 1, name: "Sơn móng tay", fee: "300 - 700.000/Kiện", note: "Từ 1 - 5kg phụ thu 300k, từ 5 tới 22kg phụ thu 500k, từ 22-30kg phụ thu 700k" },
    { stt: 2, name: "Pin kèm thiết bị", fee: "300 - 700.000/Kiện", note: "Từ 1 - 5kg phụ thu 300k, từ 5 tới 22kg phụ thu 500k, từ 22-30kg phụ thu 700k" },
    { stt: 3, name: "Loa bình thường (không pin)", fee: "500.000 - 1.000.000/Cái", note: "Lưu ý nếu kiện hàng nào > 1 loa thì hải quan sẽ phụ thu thêm từ 200-500k/1 cái loa tùy loại. Ops kiểm tra check case by case" },
    { stt: 4, name: "Loa có pin", fee: "1.200.000 - 2.000.000/Cái", note: "Ops kiểm tra check case by case" },
    { stt: 5, name: "Loa kẹo kéo", fee: "700.000/Cái", note: "Lưu ý nếu kiện hàng nào > 1 loa thì phụ thu thêm 200-500k/cái tùy loại. Ops kiểm tra check case by case" },
    { stt: 6, name: "Loa nhỏ cỡ lòng bàn tay", fee: "300.000/Kiện", note: "Lưu ý nếu kiện hàng nào > 1 loa thì phụ thu thêm 200-500k/cái tùy loại. Ops kiểm tra check case by case" },
    { stt: 7, name: "Loa xịn có giá trị cao và có pin", fee: "1.000.000/Kiện", note: "Ops kiểm tra check case by case" },
    { stt: 8, name: "Nước hoa", fee: "300.000/Kiện + 50.000/Chai", note: "Từ 1 - 5kg phụ thu 300k, từ 5 tới 22kg phụ thu 500k, từ 22-30kg phụ thu 700k (Và cộng 50k/1 chai phí HQ)" },
    { stt: 9, name: "Hàng khí nén xịt", fee: "300.000/Kiện", note: "BÌNH GAS, MÁY CÓ BÌNH GAS KHÔNG NHẬN" },
    { stt: 10, name: "Chất Lỏng khác (mắm, syrup, dầu gội...)", fee: "100 - 300.000/Kiện", note: "Case by case. Hàng đặc biệt bị phụ thu An Ninh, bộ phận OPS sẽ chốt bill và tư vấn." },
    { stt: 11, name: "Fake thương hiệu (QUẦN ÁO)", fee: "30.000/Kg", note: "Lưu ý phụ thu số kg full thùng không tách kg ra cân." },
    { stt: 12, name: "Fake túi, mắt kính, thắt lưng...", fee: "50.000/Cái", note: "" },
    { stt: 13, name: "Fake giày/dép thương hiệu", fee: "50.000/Đôi", note: "" },
    { stt: 14, name: "Túi, ví, giày da cá sấu", fee: "100.000/Cái", note: "" },
    { stt: 15, name: "Đồng hồ thường", fee: "50.000/Cái", note: "" },
    { stt: 16, name: "Đồng hồ Fake", fee: "100.000/Cái", note: "" },
    { stt: 17, name: "Hộp đồng hồ fake", fee: "50.000/Hộp", note: "" },
    { stt: 18, name: "Nhang Trầm, bột trầm...", fee: "120.000/Kg", note: "" },
    { stt: 19, name: "SÁCH, BÁO, TẠP CHÍ, Giấy", fee: "15.000/Kg", note: "" },
    { stt: 20, name: "Hàng yến", fee: "350.000/Kg", note: "1 Bill chỉ được đóng tối đa 1kg yến và yêu cầu đóng túi Zip bạc để hạn chế rủi ro" },
    { stt: 21, name: "Hàng đông trùng, Safaron", fee: "150.000/Kg", note: "" },
    { stt: 22, name: "Hàng yến hũ", fee: "30.000/Kg", note: "" },
    { stt: 23, name: "Thuốc sinh lý...", fee: "50.000/Hộp", note: "" },
    { stt: 24, name: "Hàng mỹ ký (trang sức giả)", fee: "100-300.000/Kg", note: "Phụ thu tùy loại, nếu vàng bạc thật phụ thu cao. Ops kiểm tra check case by case" },
    { stt: 25, name: "Thuốc nhuộm, mực xăm", fee: "300.000/Kiện", note: "" },
    { stt: 26, name: "Elasten (Collagen, Filter)", fee: "50.000/Hộp", note: "" },
    { stt: 27, name: "Sâm Hàn", fee: "50.000/Hộp", note: "" },
    { stt: 28, name: "Máy Móc (Có Motor)", fee: "500 - 1.000.000/Máy", note: "" },
    { stt: 29, name: "Đông y, thuốc nam, thuốc bắc", fee: "30.000/Kg", note: "" },
    { stt: 30, name: "Máy y tế, máy triệt lông", fee: "1 - 2.000.000/Máy", note: "Tùy trị giá" },
    { stt: 31, name: "Máy ảnh (Nếu không pin)", fee: "200.000/Máy", note: "Máy ảnh có pin phụ thu 500-700k/1 cái" },
    { stt: 32, name: "Lông mi giả, tóc giả", fee: "30.000/Kg", note: "" },
    { stt: 33, name: "Vòng đá, vòng trầm...", fee: "50.000/Cái", note: "" },
    { stt: 34, name: "Đá (trang sức giả)", fee: "200.000/Kg", note: "" },
    { stt: 35, name: "Sữa bột", fee: "20.000/Kg", note: "" },
    { stt: 36, name: "Thuốc tây", fee: "200.000/Kg", note: "" },
    { stt: 37, name: "Hạt giống, gạo", fee: "30.000/Kg", note: "" },
    { stt: 38, name: "Hàng thịt trứng, mật ong", fee: "10.000/Kg", note: "Tuyến Air Úc, UK, Singapore: 10k/kg. Tuyến USA dịch vụ KSN-USBH miễn phụ thu. Các tuyến Air còn lại: 20k/kg" },
    { stt: 39, name: "Thuốc nam tàu tiếng trung", fee: "120.000/Kg", note: "" },
    { stt: 40, name: "Hàng Mỹ phẩm, TPCN", fee: "30.000/Kg", note: "" },
    { stt: 41, name: "Cây xanh", fee: "200.000/Kg", note: "Phụ thu chỉ áp dụng riêng cho chuyên tuyến EU và UK Đông Lạnh" },
    { stt: 42, name: "Con Labubu", fee: "50k - 500k/Con", note: "Phụ thu tùy kích thước. Ops kiểm tra check case by case" },
    { stt: 43, name: "Các loại dầu thoa (thuốc)", fee: "30.000/Kg", note: "" },
    { stt: 44, name: "Phí Hun Trùng (Hàng Gỗ)", fee: "550.000/Lô", note: "Áp dụng cho đường bay" },
    { stt: 45, name: "Hàng Máy móc không điện tử", fee: "10.000/Kg", note: "" },
    { stt: 46, name: "Que test y tế, Salonpas", fee: "30.000/Kg", note: "" },
    { stt: 47, name: "Lens mắt", fee: "50.000/Cặp", note: "" },
    { stt: 48, name: "Các loại gỗ", fee: "20.000/Kg", note: "" },
  ],
  hanoiAir: [
    { stt: 1, name: "Thuốc tây", fee: "Miễn phụ thu", note: "Miễn phụ thu" },
    { stt: 2, name: "Hàng thịt trứng", fee: "Miễn phụ thu", note: "Miễn phụ thu" },
    { stt: 3, name: "Yến sào", fee: "Miễn phụ thu", note: "Miễn phụ thu" },
    { stt: 4, name: "Hạt giống", fee: "Miễn phụ thu", note: "Miễn phụ thu" },
    { stt: 5, name: "Hàng Fake", fee: "Miễn phụ thu", note: "Miễn phụ thu (Phụ thu các dịch vụ không phải dành cho hàng fake như AUF)" },
    { stt: 6, name: "Lông Mi", fee: "Miễn phụ thu", note: "Miễn phụ thu" },
    { stt: 7, name: "Sơn móng tay, nước hoa, pin", fee: "300.000/Kiện", note: "Lưu ý tùy thuộc vào ca an ninh xuất khẩu, nếu hàng lên sân bay nhưng không xuất khẩu không được sẽ trả hàng về." },
    { stt: 8, name: "Cây Xanh", fee: "200.000/Kg", note: "Chuyên tuyến UK đông lạnh và EU. Lưu ý chỉ nhận đúng tuyến và dịch vụ." },
  ],
  sea: [
    { stt: 1, name: "Hàng Fake, nhái thương hiệu...", fee: "30.000/Kg", note: "Lưu ý phụ thu số kg Full lô hàng không phụ thu riêng lẻ (ví dụ thùng 30kg có 10kg phụ thu thì tính 30kg)" },
    { stt: 2, name: "Hàng Loa, máy móc, pin", fee: "5.000/Kg", note: "Lưu ý phụ thu số kg Full của kiện hàng đó không phụ thu riêng lẻ" },
    { stt: 3, name: "Sơn móng, nước hoa thông thường", fee: "20.000/Kg", note: "Lưu ý phụ thu số kg Full của kiện hàng đó không phụ thu riêng lẻ" },
    { stt: 4, name: "Thực phẩm khô, TPCN, Mỹ Phẩm", fee: "20.000/Kg", note: "Lưu ý chỉ nhận thực phẩm khô có hạn sử dụng > 3 tháng. Phụ thu số kg Full." },
    { stt: 5, name: "Hàng thịt, trứng, sữa, hạt giống", fee: "30.000/Kg", note: "Lưu ý phụ thu số kg Full của kiện hàng đó không phụ thu riêng lẻ" },
    { stt: 6, name: "Con Labubu", fee: "10.000/Kg", note: "Phụ thu theo số kg tính cước của cả lô hàng." },
    { stt: 7, name: "Nhang trầm", fee: "30.000/Kg", note: "Lưu ý phụ thu số kg Full của kiện hàng đó không phụ thu riêng lẻ" },
    { stt: 8, name: "Thuốc đông y, thuốc tây", fee: "30.000/Kg", note: "Lưu ý phụ thu số kg Full của kiện hàng đó không phụ thu riêng lẻ" },
    { stt: 9, name: "Sách, tài liệu, báo chí", fee: "5.000/Kg", note: "" },
    { stt: 10, name: "Hàng que test y tế, Salonpas", fee: "5.000/Kg", note: "" },
    { stt: 11, name: "Trang sức", fee: "5.000/Kg", note: "" },
    { stt: 12, name: "Tủ bếp, tủ phòng tắm...", fee: "20.000/Kg", note: "Chỉ áp dụng phụ thu riêng đối với SEA USA." },
    { stt: 13, name: "Nội thất bọc nệm", fee: "15.000/Kg", note: "Chỉ áp dụng phụ thu riêng đối với SEA USA." },
  ]
};

const generateAirRows = () => {
  const rows = [];
  for (let w = 0.5; w <= 20.5; w += 0.5) {
    rows.push(w.toFixed(1));
  }
  return rows;
};
const AIR_RETAIL_WEIGHTS = generateAirRows();

const AIR_BULK_TIERS = ["21 - 44 kg", "45 - 99 kg", "100 - 299 kg", "300 kg+"];
const SEA_TIERS = ["21 - 44 kg", "45 - 99 kg", "100 - 299 kg", "300 - 499 kg", "500 - 999 kg", "1000 kg+"];

export const Pricing: React.FC = () => {
  const [activeTab, setActiveTab] = useState('USA');
  const [serviceType, setServiceType] = useState<'air' | 'sea'>('air');
  const [surchargeTab, setSurchargeTab] = useState<'hcm' | 'hanoi' | 'sea'>('hcm');

  // Calculator State
  const [calcWeight, setCalcWeight] = useState<number>(1);
  const [calcType, setCalcType] = useState(GOODS_TYPES[0].id);
  const [calcValue, setCalcValue] = useState<number>(0);
  const [estimatedCost, setEstimatedCost] = useState<number>(0);

  const currentCountry = COUNTRIES.find(c => c.id === activeTab);

  // Calculator Logic
  useEffect(() => {
      if (!currentCountry) return;
      
      let baseCost = calcWeight * currentCountry.rate;
      let surchargeCost = 0;

      const selectedType = GOODS_TYPES.find(t => t.id === calcType);
      
      if (selectedType) {
          if (typeof selectedType.surcharge === 'number' && selectedType.surcharge > 1) {
              surchargeCost = calcWeight * selectedType.surcharge;
          } else if (typeof selectedType.surcharge === 'number' && selectedType.surcharge < 1) {
              surchargeCost = (calcValue * EXCHANGE_RATE) * selectedType.surcharge;
          }
      }

      setEstimatedCost(baseCost + surchargeCost);
  }, [calcWeight, calcType, calcValue, activeTab, currentCountry]);

  return (
    <>
      <div className="bg-brand-navy pt-32 pb-24 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy via-brand-navy to-slate-900"></div>
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
        {/* Decorative Blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-teal/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 px-4">
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-brand-teal font-bold text-xs uppercase mb-6 animate-fade-in-up tracking-widest">
               Áp dụng từ tháng {new Date().getMonth() + 1}/{new Date().getFullYear()}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight animate-fade-in-up delay-100">
                Bảng Giá & Dự Tính Chi Phí
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto animate-fade-in-up delay-200">
               Tra cứu giá cước minh bạch hoặc sử dụng công cụ tính toán tự động bên dưới để biết ngay chi phí về tay.
            </p>
        </div>
      </div>

      <Section className="-mt-16 pt-0 relative z-20">
        <div className="max-w-6xl mx-auto">
            
            {/* --- CALCULATOR --- */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-navy-900/10 border border-slate-100 overflow-hidden mb-20 animate-fade-in-up">
                <div className="grid grid-cols-1 lg:grid-cols-12">
                    {/* Left: Input Form */}
                    <div className="lg:col-span-7 p-8 lg:p-12">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-brand-teal/10 rounded-xl text-brand-teal">
                                <Calculator className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-brand-navy">Dự tính cước phí</h3>
                        </div>

                        <div className="space-y-6">
                            {/* Origin & Weight */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Thị trường gửi</label>
                                    <div className="relative">
                                        <select 
                                            className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-xl focus:ring-brand-teal focus:border-brand-teal block w-full p-3.5 pr-10 font-medium cursor-pointer hover:bg-slate-100 transition-colors"
                                            value={activeTab}
                                            onChange={(e) => setActiveTab(e.target.value)}
                                        >
                                            {COUNTRIES.map(c => (
                                                <option key={c.id} value={c.id}>{c.flag} {c.name}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-4 w-5 h-5 text-slate-400 pointer-events-none" />
                                    </div>

                                    {/* EXCHANGE RATE DISPLAY - NEW */}
                                    <div className="flex items-start gap-3 mt-4 bg-blue-50/60 p-3 rounded-xl border border-blue-100/50">
                                       <div className="p-1 bg-white rounded-full shadow-sm text-brand-blue shrink-0">
                                          <Info className="w-3.5 h-3.5" />
                                       </div>
                                       <div>
                                          <div className="font-bold text-brand-navy text-sm">
                                             Tỷ giá: <span className="text-brand-blue">1 USD = {EXCHANGE_RATE.toLocaleString('vi-VN')} VNĐ</span>
                                          </div>
                                          <p className="text-xs text-slate-500 mt-1 leading-snug">
                                             Tỷ giá này được sử dụng để quy đổi giá trị hàng hóa khi tính phụ thu hoặc bảo hiểm.
                                          </p>
                                       </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Trọng lượng (KG)</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            min="0.5" 
                                            step="0.1"
                                            value={calcWeight}
                                            onChange={(e) => setCalcWeight(parseFloat(e.target.value))}
                                            className="bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-xl focus:ring-brand-teal focus:border-brand-teal block w-full p-3.5 font-bold"
                                        />
                                        <span className="absolute right-4 top-3.5 text-slate-400 font-medium">KG</span>
                                    </div>
                                </div>
                            </div>

                            {/* Goods Type */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Loại hàng hóa</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {GOODS_TYPES.map(type => (
                                        <div 
                                            key={type.id}
                                            onClick={() => setCalcType(type.id)}
                                            className={`cursor-pointer p-3 rounded-xl border transition-all flex items-center ${
                                                calcType === type.id 
                                                ? 'bg-teal-50 border-brand-teal text-brand-teal shadow-sm ring-1 ring-brand-teal' 
                                                : 'bg-white border-slate-200 text-slate-600 hover:border-brand-teal/50'
                                            }`}
                                        >
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-3 ${
                                                calcType === type.id ? 'border-brand-teal bg-brand-teal' : 'border-slate-300'
                                            }`}>
                                                {calcType === type.id && <Check className="w-3 h-3 text-white" />}
                                            </div>
                                            <span className="text-sm font-medium">{type.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Value Input (Only shows if percentage surcharge applies) */}
                            {(calcType === 'electronic' || calcType === 'luxury') && (
                                <div className="animate-fade-in-down">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Giá trị hàng (Ước tính để tính bảo hiểm/phụ thu)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3.5 text-slate-500 font-bold">$</span>
                                        <input 
                                            type="number" 
                                            min="0"
                                            value={calcValue}
                                            onChange={(e) => setCalcValue(parseFloat(e.target.value))}
                                            className="bg-white border border-brand-teal/30 text-slate-900 text-base rounded-xl focus:ring-brand-teal focus:border-brand-teal block w-full p-3.5 pl-8 font-bold shadow-sm"
                                            placeholder="VD: 500"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Result */}
                    <div className="lg:col-span-5 bg-slate-50 p-8 lg:p-12 border-l border-slate-100 flex flex-col justify-center relative overflow-hidden">
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

                        <div className="relative z-10">
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 block">Tổng chi phí ước tính</span>
                            <div className="flex items-baseline gap-2 mb-8">
                                <span className="text-5xl lg:text-6xl font-black text-brand-navy">
                                    {estimatedCost.toLocaleString('vi-VN')}
                                </span>
                                <span className="text-xl font-bold text-slate-500">đ</span>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Cước vận chuyển ({calcWeight}kg):</span>
                                    <span className="font-bold text-slate-900">
                                        {(calcWeight * (currentCountry?.rate || 0)).toLocaleString('vi-VN')} đ
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Phụ thu hàng hóa:</span>
                                    <span className="font-bold text-accent">
                                        + {(estimatedCost - (calcWeight * (currentCountry?.rate || 0))).toLocaleString('vi-VN')} đ
                                    </span>
                                </div>
                                <div className="h-px bg-slate-200 my-2"></div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Thời gian dự kiến:</span>
                                    <span className="font-bold text-brand-teal">7 - 10 Ngày</span>
                                </div>
                            </div>

                            <Button to="/lien-he" variant="teal" size="lg" className="w-full justify-center shadow-xl">
                                Gửi hàng ngay
                            </Button>
                            <p className="text-xs text-center text-slate-400 mt-4">
                                * Giá trên chỉ là ước tính tham khảo. Chưa bao gồm phí ship nội địa Mỹ (nếu có).
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MAIN PRICING TABLES --- */}
            <SectionHeader 
                title="Bảng giá cước vận chuyển"
                subtitle="Tham khảo các mức cân nặng"
                align="center"
                className="mb-12"
            />
        
            {/* Country Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
            {COUNTRIES.map((country) => (
                <button
                key={country.id}
                onClick={() => { setActiveTab(country.id); }}
                className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold transition-all duration-200 border ${
                    activeTab === country.id 
                    ? 'bg-brand-navy border-brand-navy text-white shadow-lg transform -translate-y-1' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-brand-navy hover:text-brand-navy'
                }`}
                >
                <span className="text-lg">{country.flag}</span>
                <span>{country.name}</span>
                </button>
            ))}
            </div>

            {/* Service Type Toggle */}
            <div className="max-w-md mx-auto mb-12">
                <div className="bg-slate-100 p-1.5 rounded-2xl flex relative">
                    <button
                        onClick={() => setServiceType('air')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                            serviceType === 'air' 
                            ? 'bg-white text-brand-blue shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <Plane className="w-4 h-4" />
                        Đường Bay
                    </button>
                    <button
                        onClick={() => setServiceType('sea')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                            serviceType === 'sea' 
                            ? 'bg-white text-brand-blue shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <Ship className="w-4 h-4" />
                        Đường Biển
                    </button>
                </div>
            </div>

            {/* Tables Area */}
            {serviceType === 'air' && (
                <div className="space-y-12 animate-fade-in-up">
                    {/* Air Table 1: Retail */}
                    <div>
                        <div className="bg-blue-50/50 border border-blue-100 rounded-t-2xl p-5 flex flex-col sm:flex-row justify-between items-center gap-2">
                            <div className="flex items-center gap-3 text-brand-blue font-bold">
                                <div className="p-2 bg-white rounded-lg shadow-sm"><Package className="w-5 h-5" /></div>
                                Bảng giá Hàng Lẻ (0.5kg - 20.5kg)
                            </div>
                            <div className="text-xs text-slate-500 font-bold bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
                                 Đơn vị tính: {currentCountry?.currency} / Kiện
                            </div>
                        </div>
                        
                        <div className="overflow-hidden rounded-b-2xl border border-t-0 border-slate-200 shadow-sm bg-white">
                            <div className="overflow-x-auto max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300">
                            <table className="w-full text-left border-collapse min-w-[600px]">
                                <thead className="sticky top-0 z-10">
                                    <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                                        <th className="p-4 text-sm font-bold uppercase w-1/4 text-center">Trọng lượng</th>
                                        <th className="p-4 text-sm font-bold uppercase w-1/4 text-center">Quần áo / Thường</th>
                                        <th className="p-4 text-sm font-bold uppercase w-1/4 text-center">Mỹ phẩm / TPCN</th>
                                        <th className="p-4 text-sm font-bold uppercase w-1/4 text-center">Hàng Điện Tử</th>
                                    </tr>
                                </thead>
                                <tbody className="text-slate-600 divide-y divide-slate-100 text-center text-sm">
                                    {AIR_RETAIL_WEIGHTS.map((weight, i) => (
                                        <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                                            <td className="p-3 font-bold text-brand-navy bg-slate-50/30 border-r border-slate-100">
                                                {weight} KG
                                            </td>
                                            <td className="p-3 text-brand-blue font-bold">{(currentCountry?.rate || 0).toLocaleString()}</td>
                                            <td className="p-3">Liên hệ</td>
                                            <td className="p-3">Liên hệ</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            </div>
                        </div>
                    </div>

                    {/* Air Table 2: Bulk */}
                    <div>
                        <div className="bg-orange-50/50 border border-orange-100 rounded-t-2xl p-5 flex flex-col sm:flex-row justify-between items-center gap-2">
                            <div className="flex items-center gap-3 text-accent font-bold">
                                <div className="p-2 bg-white rounded-lg shadow-sm"><Scale className="w-5 h-5" /></div>
                                Bảng giá Hàng Nặng ({'>'}21kg)
                            </div>
                             <div className="text-xs text-orange-800 font-bold bg-white px-3 py-1.5 rounded-full border border-orange-200 shadow-sm">
                                 Đơn vị tính: {currentCountry?.currency} / KG
                            </div>
                        </div>
                        
                        <div className="overflow-hidden rounded-b-2xl border border-t-0 border-slate-200 shadow-sm bg-white">
                            <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[600px]">
                                <thead>
                                    <tr className="bg-gradient-to-r from-accent to-orange-400 text-white">
                                        <th className="p-4 text-sm font-bold uppercase w-1/4 text-center">Mức cân (KG)</th>
                                        <th className="p-4 text-sm font-bold uppercase w-1/4 text-center border-l border-white/20">Hàng Thường</th>
                                        <th className="p-4 text-sm font-bold uppercase w-1/4 text-center border-l border-white/20">Hàng Khó</th>
                                        <th className="p-4 text-sm font-bold uppercase w-1/4 text-center border-l border-white/20">Hàng Đặc Biệt</th>
                                    </tr>
                                </thead>
                                <tbody className="text-slate-600 divide-y divide-slate-100 text-center text-sm">
                                    {AIR_BULK_TIERS.map((tier, i) => (
                                        <tr key={i} className="hover:bg-orange-50/30 transition-colors">
                                            <td className="p-4 font-bold text-brand-navy bg-slate-50/30 border-r border-slate-100 text-base">
                                                {tier}
                                            </td>
                                            <td className="p-4 text-accent font-bold text-base border-r border-slate-100">Liên hệ</td>
                                            <td className="p-4 border-r border-slate-100">Liên hệ</td>
                                            <td className="p-4">Liên hệ</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* SEA Table */}
            {serviceType === 'sea' && (
                <div className="animate-fade-in-up">
                    <div className="bg-blue-50/50 border border-blue-100 rounded-t-2xl p-5 flex justify-between items-center">
                         <div className="flex items-center gap-3 text-brand-blue font-bold">
                            <div className="p-2 bg-white rounded-lg shadow-sm"><Ship className="w-5 h-5" /></div>
                            Bảng giá Sea (Hàng nặng {'>'}21kg)
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-b-2xl border border-t-0 border-slate-200 shadow-sm bg-white">
                        <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="bg-slate-900 text-white">
                                    <th className="p-4 text-sm font-bold uppercase w-1/3 text-center">Mức cân (KG)</th>
                                    <th className="p-4 text-sm font-bold uppercase w-1/3 bg-white/5 text-center">Giá cước (All-in)</th>
                                    <th className="p-4 text-sm font-bold uppercase w-1/3 text-center">Thời gian dự kiến</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-600 divide-y divide-slate-100 text-center text-sm">
                                {SEA_TIERS.map((tier, i) => (
                                    <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="p-4 font-bold text-brand-navy bg-slate-50/30 border-r border-slate-100 text-base">
                                            {tier}
                                        </td>
                                        <td className="p-4 text-accent font-bold text-base">
                                            Liên hệ báo giá
                                        </td>
                                        <td className="p-4">
                                            3 - 5 tuần
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>
            )}

            {/* --- NEW SURCHARGE SECTION --- */}
            <div className="mt-24 animate-fade-in-up">
                <SectionHeader 
                    title="Bảng Phụ Thu Hàng Hóa Đặc Biệt"
                    subtitle="Áp dụng cho các mặt hàng khó, giá trị cao"
                    align="center"
                    className="mb-10"
                />

                <div className="flex justify-center mb-8">
                   <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
                      <button 
                        onClick={() => setSurchargeTab('hcm')}
                        className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${surchargeTab === 'hcm' ? 'bg-white shadow text-brand-blue' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                         Đường Bay - HCM
                      </button>
                      <button 
                        onClick={() => setSurchargeTab('hanoi')}
                        className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${surchargeTab === 'hanoi' ? 'bg-white shadow text-brand-blue' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                         Đường Bay - Hà Nội
                      </button>
                      <button 
                        onClick={() => setSurchargeTab('sea')}
                        className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${surchargeTab === 'sea' ? 'bg-white shadow text-brand-blue' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                         Đường Biển (Sea)
                      </button>
                   </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-card overflow-hidden">
                    <div className="bg-brand-navy p-4 flex items-center justify-between">
                         <div className="flex items-center gap-2 text-white font-bold">
                            <FileText className="w-5 h-5 text-brand-teal" />
                            {surchargeTab === 'hcm' && "Danh mục phụ thu Đường Bay (Kho HCM)"}
                            {surchargeTab === 'hanoi' && "Danh mục phụ thu Đường Bay (Kho Hà Nội)"}
                            {surchargeTab === 'sea' && "Danh mục phụ thu Đường Biển (Sea Cargo)"}
                         </div>
                    </div>
                    
                    <div className="overflow-x-auto max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead className="sticky top-0 z-10">
                                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                                    <th className="p-4 text-xs font-bold uppercase w-[50px] text-center">STT</th>
                                    <th className="p-4 text-xs font-bold uppercase w-[30%]">Tên mặt hàng</th>
                                    <th className="p-4 text-xs font-bold uppercase w-[25%] text-brand-blue">Đơn giá phụ thu</th>
                                    <th className="p-4 text-xs font-bold uppercase">Ghi chú đặc biệt</th>
                                </tr>
                            </thead>
                            <tbody className="text-slate-600 divide-y divide-slate-100 text-sm">
                                {SURCHARGE_DATA[surchargeTab === 'hcm' ? 'hcmAir' : surchargeTab === 'hanoi' ? 'hanoiAir' : 'sea'].map((item, idx) => (
                                    <tr key={idx} className="hover:bg-blue-50/20 transition-colors">
                                        <td className="p-4 text-center font-mono text-slate-400">{item.stt}</td>
                                        <td className="p-4 font-bold text-brand-navy">{item.name}</td>
                                        <td className="p-4 font-bold text-brand-teal">{item.fee}</td>
                                        <td className="p-4 text-slate-500 italic text-xs leading-relaxed">{item.note}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Important Note Footer */}
                    <div className="bg-orange-50 p-6 border-t border-orange-100 flex items-start gap-4">
                        <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-orange-700 text-sm uppercase mb-1">Lưu ý quan trọng:</h4>
                            <p className="text-sm text-orange-800 leading-relaxed">
                                Giá tra phụ thu vui lòng liên hệ bộ phận chứng từ hoặc Ops EZWAY để được xác nhận chính xác. 
                                <br/>
                                <strong className="font-bold">Quy định chung:</strong> Sẽ phụ thu theo số kg <span className="underline">FULL THÙNG</span> (Gross Weight của cả kiện), không phụ thu trên số kg riêng lẻ của từng mặt hàng bên trong.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </Section>
    </>
  );
};