import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Plane, Phone, Mail, Clock } from 'lucide-react';
import { Button } from './UiElements';
import { NavItem } from '../types';

const NAV_ITEMS: NavItem[] = [
  { label: 'Trang chủ', path: '/' },
  { label: 'Mua hộ hàng Mỹ', path: '/mua-ho-hang-my' },
  { label: 'Dịch vụ', path: '/dich-vu' },
  { label: 'Giá cước', path: '/gia-cuoc' },
  { label: 'Tin tức', path: '/tin-tuc' },
  { label: 'Liên hệ', path: '/lien-he' },
];

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Bar - Brand Navy */}
      <div className={`hidden lg:block bg-brand-navy text-slate-300 text-xs py-2 transition-all duration-300 border-b border-white/5 ${scrolled ? '-mt-10' : 'mt-0'}`}>
        <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center">
          <div className="flex gap-6">
            <span className="flex items-center hover:text-white transition-colors cursor-default">
              <Phone className="w-3.5 h-3.5 mr-2 text-accent" /> 1900 1234 567
            </span>
            <span className="flex items-center hover:text-white transition-colors cursor-default">
              <Mail className="w-3.5 h-3.5 mr-2 text-accent" /> support@ezway.vn
            </span>
          </div>
          <div className="flex gap-6">
             <span className="flex items-center">
               <Clock className="w-3.5 h-3.5 mr-2 text-accent" /> Mon - Sat: 08:00 - 17:30
             </span>
             <Link to="/tin-tuc" className="hover:text-white transition-colors">Tin tức</Link>
             <a href="#" className="hover:text-white transition-colors">Tuyển dụng</a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav 
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled 
            ? 'top-0 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200 py-3' 
            : 'top-9 bg-white/80 backdrop-blur-sm py-4 border-b border-white/10'
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="p-2 rounded-lg bg-brand-blue text-white shadow-lg shadow-blue-500/30">
                <Plane className="h-5 w-5 transform group-hover:-rotate-12 transition-transform" />
              </div>
              <div className="flex flex-col -space-y-0.5">
                <span className="text-2xl font-black tracking-tight leading-none text-brand-navy">
                  EZWAY
                </span>
                <span className="text-[10px] tracking-[0.15em] font-bold uppercase text-brand-blue">
                  Moving Made Easy
                </span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'text-brand-blue bg-blue-50'
                        : 'text-slate-600 hover:text-brand-blue hover:bg-slate-50'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <div className="ml-6 pl-6 border-l border-slate-200">
                 {/* Tra Cuu button uses the CTA (Orange) variant for visibility */}
                 <Button to="/tra-cuu" variant="cta" size="sm" icon>
                    Tra cứu
                 </Button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-slate-800 hover:bg-slate-100 transition-colors"
              >
                {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-slate-100 animate-fade-in-down">
            <div className="px-6 py-6 space-y-2">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-lg text-base font-semibold transition-colors ${
                      isActive ? 'text-brand-blue bg-blue-50' : 'text-slate-600 hover:text-brand-blue hover:bg-slate-50'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <div className="pt-4 border-t border-slate-100 mt-4 space-y-3">
                <Button to="/tra-cuu" variant="cta" className="w-full justify-center">
                  Tra cứu đơn hàng
                </Button>
                <div className="flex justify-center gap-6 pt-2 text-slate-500">
                    <a href="tel:19001234567" className="flex items-center"><Phone className="w-4 h-4 mr-2"/> 1900...</a>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};