import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-navy text-slate-400 border-t border-white/10">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Column */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center space-x-3">
              <div className="p-1.5 bg-brand-blue rounded-lg text-white">
                <Plane className="h-5 w-5" />
              </div>
              <div className="flex flex-col -space-y-0.5">
                  <span className="text-2xl font-black tracking-tight text-white leading-none">
                    EZWAY
                  </span>
                  <span className="text-[10px] tracking-[0.15em] font-bold uppercase text-slate-500">
                    Moving Made Easy
                  </span>
              </div>
            </Link>
            <p className="text-slate-400 leading-relaxed text-sm">
              Giải pháp vận chuyển quốc tế toàn diện. Chuyên tuyến Việt Nam đi Mỹ, Úc, Canada, Châu Âu và Dịch vụ Mua hộ hàng Mỹ chuyên nghiệp.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-brand-blue hover:text-white transition-all duration-300 group">
                  <Icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Liên kết nhanh</h3>
            <ul className="space-y-3">
              {[
                { label: 'Mua hộ hàng Mỹ', path: '/mua-ho-hang-my' },
                { label: 'Dịch vụ vận chuyển', path: '/dich-vu' },
                { label: 'Bảng giá cước', path: '/gia-cuoc' },
                { label: 'Theo dõi đơn hàng', path: '/tra-cuu' },
                { label: 'Tin tức & Sự kiện', path: '/tin-tuc' },
              ].map((link, i) => (
                <li key={i}>
                    <Link to={link.path} className="hover:text-accent transition-colors flex items-center group text-sm">
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-accent" />
                    {link.label}
                    </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Dịch vụ</h3>
            <ul className="space-y-3 text-sm">
              <li className="hover:text-white transition-colors cursor-pointer">Gửi hàng đi Mỹ, Úc, Canada</li>
              <li className="hover:text-white transition-colors cursor-pointer">Vận chuyển đi Châu Âu</li>
              <li className="hover:text-white transition-colors cursor-pointer">Mua hộ eBay, Amazon (Mỹ)</li>
              <li className="hover:text-white transition-colors cursor-pointer">Dịch vụ Door-to-Door</li>
              <li className="hover:text-white transition-colors cursor-pointer">Thông quan hải quan</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Liên hệ</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3 group">
                <MapPin className="h-5 w-5 text-accent shrink-0 group-hover:text-white transition-colors" />
                <span className="group-hover:text-white transition-colors">123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center space-x-3 group">
                <Phone className="h-5 w-5 text-accent shrink-0 group-hover:text-white transition-colors" />
                <span className="group-hover:text-white transition-colors font-bold">1900 1234 567</span>
              </li>
              <li className="flex items-center space-x-3 group">
                <Mail className="h-5 w-5 text-accent shrink-0 group-hover:text-white transition-colors" />
                <span className="group-hover:text-white transition-colors">support@ezway.vn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-500 text-xs gap-4">
          <p>&copy; {new Date().getFullYear()} EZWAY Logistics. All rights reserved.</p>
          <div className="flex gap-6">
             <a href="#" className="hover:text-white">Điều khoản sử dụng</a>
             <a href="#" className="hover:text-white">Chính sách bảo mật</a>
          </div>
        </div>
      </div>
    </footer>
  );
};