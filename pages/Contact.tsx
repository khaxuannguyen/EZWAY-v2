import React from 'react';
import { Section, Button, Card } from '../components/UiElements';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <>
      <div className="bg-slate-50 pt-24 pb-12">
         {/* Header placeholder */}
         <div className="max-w-[1200px] mx-auto px-6 text-center">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4">Liên hệ với chúng tôi</h1>
            <p className="text-slate-600 text-lg">Đội ngũ hỗ trợ của EZWAY luôn sẵn sàng 24/7</p>
         </div>
      </div>

      <Section className="pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Info */}
          <div className="space-y-10">
            <div className="bg-white p-8 rounded-2xl shadow-card border border-slate-100">
                <h3 className="text-2xl font-bold mb-6">Thông tin liên hệ</h3>
                <div className="space-y-8">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div className="ml-6">
                      <h3 className="font-bold text-lg text-slate-900">Trụ sở chính</h3>
                      <p className="text-slate-600 mt-1">123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div className="ml-6">
                      <h3 className="font-bold text-lg text-slate-900">Hotline</h3>
                      <p className="text-slate-600 mt-1 font-mono text-lg">1900 1234 567</p>
                      <p className="text-slate-500 text-sm mt-1">(08:00 - 17:30, Thứ 2 - Thứ 7)</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div className="ml-6">
                      <h3 className="font-bold text-lg text-slate-900">Email</h3>
                      <p className="text-slate-600 mt-1">support@ezway.vn</p>
                      <p className="text-slate-600">sales@ezway.vn</p>
                    </div>
                  </div>
                </div>
            </div>
            
            {/* Map Placeholder */}
            <div className="h-64 bg-slate-200 rounded-2xl overflow-hidden relative shadow-inner">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.6696584237116!2d106.66488007469707!3d10.759920059496734!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f9023a3a85d%3A0x96d9b7f95655785c!2zSOG7kyBDaMOtIE1pbmg!5e0!3m2!1sen!2s!4v1689650000000!5m2!1sen!2s" 
                    width="100%" 
                    height="100%" 
                    style={{border:0}} 
                    allowFullScreen={true} 
                    loading="lazy"
                    className="absolute inset-0 grayscale contrast-75 opacity-80 hover:grayscale-0 transition-all duration-500"
                ></iframe>
            </div>
          </div>

          {/* Form */}
          <Card className="p-10 border-slate-200">
            <h3 className="text-2xl font-bold mb-2">Gửi tin nhắn</h3>
            <p className="text-slate-500 mb-8">Điền thông tin bên dưới, chúng tôi sẽ liên hệ lại ngay.</p>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Họ tên</label>
                  <input type="text" className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium" placeholder="Nguyễn Văn A" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Số điện thoại</label>
                  <input type="tel" className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium" placeholder="0909..." />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Email</label>
                <input type="email" className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium" placeholder="email@example.com" />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Nội dung cần tư vấn</label>
                <textarea rows={5} className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium resize-none" placeholder="Tôi muốn gửi hàng đi Mỹ..."></textarea>
              </div>

              <Button type="submit" size="lg" className="w-full justify-center text-lg mt-2">Gửi yêu cầu tư vấn</Button>
            </form>
          </Card>
        </div>
      </Section>
    </>
  );
};