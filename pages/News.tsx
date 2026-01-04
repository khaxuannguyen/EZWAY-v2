import React from 'react';
import { Section, SectionHeader, Card, Button } from '../components/UiElements';
import { Calendar, User, ArrowRight, Tag, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

// MOCK DATA FOR NEWS
export const NEWS_POSTS = [
  {
    id: 1,
    slug: 'cap-nhat-bang-gia-van-chuyen-my-viet-2024',
    title: 'Cập nhật bảng giá vận chuyển Mỹ - Việt áp dụng từ tháng 10/2024',
    excerpt: 'EZWAY thông báo điều chỉnh giảm cước phí vận chuyển đường bay cho các mặt hàng điện tử và thực phẩm chức năng. Xem chi tiết bảng giá mới nhất tại đây.',
    category: 'Thông báo',
    date: '10/10/2024',
    author: 'Admin EZWAY',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    featured: true
  },
  {
    id: 2,
    slug: 'bi-quyet-san-sale-black-friday',
    title: 'Bí quyết săn sale Black Friday & Cyber Monday không lo về giá',
    excerpt: 'Black Friday là dịp sale lớn nhất năm. Hãy cùng EZWAY điểm qua các tips săn hàng hiệu giá rẻ và cách tránh tình trạng hủy đơn khi mua hàng tại Mỹ.',
    category: 'Cẩm nang',
    date: '05/10/2024',
    author: 'Minh Hạnh',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    featured: false
  },
  {
    id: 3,
    slug: 'lich-nghi-tet-nguyen-dan-2025',
    title: 'Lịch ngưng nhận hàng & Giao hàng Tết Nguyên Đán 2025',
    excerpt: 'Để đảm bảo hàng hóa về trước Tết, quý khách vui lòng lưu ý các mốc thời gian chốt đơn (Cut-off time) cho đường bay và đường biển.',
    category: 'Thông báo',
    date: '01/10/2024',
    author: 'Admin EZWAY',
    image: 'https://images.unsplash.com/photo-1548685913-fe6678babe8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    featured: false
  },
  {
    id: 4,
    slug: 'thay-doi-chinh-sach-hai-quan-hang-dien-tu',
    title: 'Lưu ý quan trọng về thủ tục nhập khẩu Laptop & Điện thoại cũ',
    excerpt: 'Tổng cục Hải quan vừa ban hành quy định mới về việc nhập khẩu các thiết bị công nghệ đã qua sử dụng. Khách hàng cá nhân cần chuẩn bị những gì?',
    category: 'Pháp lý',
    date: '28/09/2024',
    author: 'Tuấn Luật',
    image: 'https://images.unsplash.com/photo-1531297461136-82lw9b220371?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    featured: false
  },
  {
    id: 5,
    slug: 'top-5-website-mua-nuoc-hoa-uy-tin',
    title: 'Top 5 Website mua nước hoa chính hãng tại Mỹ (Sale off 50%)',
    excerpt: 'Đừng bỏ lỡ Sephora, FragranceNet hay Jomashop nếu bạn là tín đồ của hương thơm. Hướng dẫn cách check batch code và order về Việt Nam.',
    category: 'Cẩm nang',
    date: '20/09/2024',
    author: 'Lan Hương',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    featured: false
  },
  {
    id: 6,
    slug: 'khai-truong-kho-oregon',
    title: 'EZWAY khai trương kho mới tại Oregon - Miễn thuế Mỹ (Tax Free)',
    excerpt: 'Tin vui cho các tín đồ công nghệ: Mua iPhone, MacBook gửi về kho Oregon sẽ tiết kiệm được 8-9% thuế bang (Sales Tax).',
    category: 'Tin công ty',
    date: '15/09/2024',
    author: 'Admin EZWAY',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    featured: false
  }
];

export const News: React.FC = () => {
  const featuredPost = NEWS_POSTS.find(p => p.featured) || NEWS_POSTS[0];
  const otherPosts = NEWS_POSTS.filter(p => p.id !== featuredPost.id);

  return (
    <>
      {/* Page Header */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-orange-50 pt-32 pb-20 text-center relative overflow-hidden">
         <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
         <div className="relative z-10 px-6">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-primary text-xs font-bold uppercase tracking-wider mb-4 animate-fade-in-up">
               EZWAY Blog
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight animate-fade-in-up delay-100">
               Tin Tức & Sự Kiện
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto animate-fade-in-up delay-200">
               Cập nhật thông tin mới nhất về thị trường Logistics, khuyến mãi và cẩm nang mua sắm quốc tế.
            </p>
         </div>
      </div>

      <Section className="pt-0">
        {/* Featured Post */}
        <div className="mb-20">
           <Link to={`/tin-tuc/${featuredPost.slug}`} className="group block">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[21/9] md:aspect-[2/1]">
                 <img src={featuredPost.image} alt={featuredPost.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent"></div>
                 <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full md:w-3/4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded bg-accent text-white text-xs font-bold uppercase mb-4">
                       <Tag className="w-3 h-3" /> {featuredPost.category}
                    </span>
                    <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight group-hover:text-blue-200 transition-colors">
                       {featuredPost.title}
                    </h2>
                    <p className="text-slate-300 text-sm md:text-lg line-clamp-2 md:line-clamp-3 mb-6 hidden md:block">
                       {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center text-slate-400 text-sm font-medium gap-6">
                       <span className="flex items-center"><User className="w-4 h-4 mr-2" /> {featuredPost.author}</span>
                       <span className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {featuredPost.date}</span>
                    </div>
                 </div>
              </div>
           </Link>
        </div>

        {/* Latest News Grid */}
        <SectionHeader title="Bài viết mới nhất" align="left" subtitle="Cập nhật hàng ngày" className="mb-10" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {otherPosts.map((post) => (
             <Link to={`/tin-tuc/${post.slug}`} key={post.id} className="group">
                <Card className="h-full p-0 overflow-hidden border-transparent hover:border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                   <div className="relative h-56 overflow-hidden">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-slate-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                         {post.category}
                      </div>
                   </div>
                   <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center text-xs text-slate-500 mb-3 space-x-4">
                         <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {post.date}</span>
                         <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> 5 phút đọc</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                         {post.title}
                      </h3>
                      <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-grow">
                         {post.excerpt}
                      </p>
                      <span className="inline-flex items-center text-primary font-bold text-sm mt-auto group-hover:translate-x-2 transition-transform">
                         Đọc tiếp <ArrowRight className="w-4 h-4 ml-1" />
                      </span>
                   </div>
                </Card>
             </Link>
           ))}
        </div>

        {/* Categories / Tags Cloud */}
        <div className="mt-20 pt-10 border-t border-slate-200">
           <h4 className="text-lg font-bold text-slate-900 mb-6 text-center">Chủ đề phổ biến</h4>
           <div className="flex flex-wrap justify-center gap-3">
              {['Kinh nghiệm mua hàng', 'Săn Sale', 'Thủ tục hải quan', 'Black Friday', 'Công nghệ', 'Nước hoa', 'Hàng hiệu', 'Vận chuyển', 'Bảng giá'].map((tag, i) => (
                 <span key={i} className="px-4 py-2 bg-slate-100 rounded-full text-slate-600 text-sm font-medium hover:bg-primary hover:text-white transition-colors cursor-pointer">
                    #{tag}
                 </span>
              ))}
           </div>
        </div>
      </Section>

      {/* CTA Newsletter */}
      <div className="bg-primary py-16">
         <div className="max-w-[1200px] mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Đăng ký nhận tin</h2>
            <p className="text-blue-100 mb-8 max-w-xl mx-auto">
               Nhận thông báo về các chương trình khuyến mãi, mã giảm giá vận chuyển và tin tức thị trường mới nhất.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
               <input type="email" placeholder="Email của bạn" className="px-6 py-3 rounded-xl focus:outline-none text-slate-900 w-full" />
               <Button variant="white" className="font-bold whitespace-nowrap">Đăng ký ngay</Button>
            </div>
         </div>
      </div>
    </>
  );
};