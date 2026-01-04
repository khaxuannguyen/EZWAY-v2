import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';

export const FloatingContact: React.FC = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 items-end">
      {/* Zalo Button */}
      <a 
        href="https://zalo.me/0909123456" 
        target="_blank" 
        rel="noreferrer"
        className="group flex items-center justify-center w-14 h-14 bg-blue-600 rounded-full shadow-lg shadow-blue-600/30 hover:scale-110 transition-transform duration-300 relative"
        title="Chat Zalo"
      >
        <span className="absolute right-full mr-3 bg-white text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Chat Zalo
        </span>
        <div className="text-white font-bold text-xl">Z</div>
      </a>

      {/* Hotline Button with Pulse Effect */}
      <a 
        href="tel:19001234567"
        className="group flex items-center justify-center w-14 h-14 bg-brand-teal rounded-full shadow-lg shadow-teal-500/30 hover:scale-110 transition-transform duration-300 relative"
        title="Gọi Hotline"
      >
        {/* Ping Animation */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-brand-teal opacity-75 animate-ping"></span>
        
        <span className="absolute right-full mr-3 bg-white text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          1900 1234 567
        </span>
        <Phone className="w-6 h-6 text-white relative z-10" />
      </a>
    </div>
  );
};