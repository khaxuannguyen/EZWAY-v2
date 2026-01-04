import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Section, Button, Card } from '../components/UiElements';
import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Tag } from 'lucide-react';
import { NEWS_POSTS } from './News';

export const NewsDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // Find the post based on slug (Mock implementation)
  // In a real app, you would fetch data from an API here
  const post = NEWS_POSTS.find(p => p.slug === slug) || NEWS_POSTS[0];
  
  // Scroll to top when loading new article
  useEffect(() => {
     window.scrollTo(0, 0);
  }, [slug]);

  if (!post) return <div>Loading...</div>;

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
       {/* Hero / Header Image */}
       <div className="h-[50vh] relative">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/50"></div>
          <div className="absolute bottom-0 left-0 w-full p-6 pb-12 lg:pb-20">
             <div className="max-w-[800px] mx-auto text-center">
                <span className="inline-block px-3 py-1 bg-accent text-white text-xs font-bold uppercase rounded mb-4">
                   {post.category}
                </span>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                   {post.title}
                </h1>
                <div className="flex items-center justify-center text-white/80 text-sm gap-6 font-medium">
                   <span className="flex items-center"><User className="w-4 h-4 mr-2" /> {post.author}</span>
                   <span className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> {post.date}</span>
                </div>
             </div>
          </div>
       </div>

       <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
             
             {/* Main Content */}
             <div className="lg:col-span-8">
                <div className="bg-white rounded-2xl shadow-card p-8 md:p-12">
                   {/* Mock Content Body */}
                   <div className="prose prose-lg prose-slate max-w-none">
                      <p className="lead font-medium text-xl text-slate-600 mb-8 border-l-4 border-primary pl-4 italic">
                         {post.excerpt}
                      </p>

                      <p>
                         Trong bối cảnh thị trường logistics toàn cầu đang có nhiều biến động, việc cập nhật thông tin kịp thời là vô cùng quan trọng đối với các doanh nghiệp và cá nhân thường xuyên giao thương quốc tế.
                      </p>

                      <h3>1. Tại sao giá cước thay đổi?</h3>
                      <p>
                         Theo thông tin mới nhất từ các hãng hàng không và tàu biển, chi phí nhiên liệu đã tăng nhẹ trong quý này. Tuy nhiên, nhờ việc tối ưu hóa quy trình vận hành tại kho Oregon và California, EZWAY đã nỗ lực giữ bình ổn giá, thậm chí giảm nhẹ đối với các mặt hàng thiết yếu.
                      </p>
                      
                      <img 
                        src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
                        alt="Kho hàng Logistics" 
                        className="w-full rounded-xl my-8 shadow-sm"
                      />

                      <h3>2. Lưu ý quan trọng cho khách hàng</h3>
                      <p>
                         Để đảm bảo hàng hóa được thông quan nhanh chóng, quý khách vui lòng cung cấp đầy đủ Invoice (Hóa đơn mua hàng) và Tracking Number ngay sau khi order. Việc này giúp đội ngũ EZWAY khai báo hải quan trước khi hàng về đến Việt Nam.
                      </p>
                      <ul className="list-disc pl-5 space-y-2">
                         <li>Hàng điện tử cần khai báo số Serial/IMEI.</li>
                         <li>Hàng thực phẩm chức năng giới hạn số lượng theo quy định 6 lọ/người nhận.</li>
                         <li>Nước hoa và chất lỏng cần đóng gói gia cố đặc biệt (có phụ phí).</li>
                      </ul>

                      <h3>3. Cam kết từ EZWAY</h3>
                      <p>
                         Chúng tôi cam kết bồi thường 100% giá trị hàng hóa nếu xảy ra mất mát, hư hỏng trong quá trình vận chuyển (đối với đơn hàng có mua bảo hiểm hoặc khai báo giá trị đầy đủ). Thời gian giao hàng dự kiến từ 7-10 ngày làm việc kể từ khi bay.
                      </p>

                      <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl my-8">
                         <h4 className="text-primary font-bold text-lg mb-2">Bạn cần tư vấn chi tiết?</h4>
                         <p className="text-slate-600 mb-4 text-sm">Liên hệ ngay với đội ngũ CSKH của chúng tôi để được hỗ trợ 24/7.</p>
                         <Button to="/lien-he" size="sm">Chat với nhân viên</Button>
                      </div>
                   </div>

                   {/* Tags & Share */}
                   <div className="border-t border-slate-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="flex gap-2">
                         <span className="px-3 py-1 bg-slate-100 rounded text-xs font-bold text-slate-500 hover:bg-slate-200 cursor-pointer">#Logistics</span>
                         <span className="px-3 py-1 bg-slate-100 rounded text-xs font-bold text-slate-500 hover:bg-slate-200 cursor-pointer">#Shipping</span>
                         <span className="px-3 py-1 bg-slate-100 rounded text-xs font-bold text-slate-500 hover:bg-slate-200 cursor-pointer">#US_Vietnam</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <span className="text-sm font-bold text-slate-400">Chia sẻ:</span>
                         <div className="flex gap-2">
                            <button className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"><Facebook className="w-4 h-4" /></button>
                            <button className="w-8 h-8 rounded-full bg-sky-100 text-sky-500 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-colors"><Twitter className="w-4 h-4" /></button>
                            <button className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors"><Linkedin className="w-4 h-4" /></button>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             {/* Sidebar */}
             <div className="lg:col-span-4 space-y-8">
                {/* Related Posts */}
                <div className="bg-white rounded-2xl shadow-card p-6 border border-slate-100 sticky top-24">
                   <h3 className="font-bold text-lg text-slate-900 mb-6 flex items-center pb-3 border-b border-slate-100">
                      Bài viết liên quan
                   </h3>
                   <div className="space-y-6">
                      {NEWS_POSTS.filter(p => p.id !== post.id).slice(0, 4).map((rel) => (
                         <Link to={`/tin-tuc/${rel.slug}`} key={rel.id} className="flex gap-4 group">
                            <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden">
                               <img src={rel.image} alt={rel.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                            </div>
                            <div>
                               <h4 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-primary transition-colors mb-1">
                                  {rel.title}
                               </h4>
                               <span className="text-xs text-slate-400 block">{rel.date}</span>
                            </div>
                         </Link>
                      ))}
                   </div>
                   
                   <div className="mt-8 pt-6 border-t border-slate-100">
                      <Button to="/tin-tuc" variant="outline" className="w-full justify-center text-sm">
                         <ArrowLeft className="w-4 h-4 mr-2" /> Xem tất cả tin tức
                      </Button>
                   </div>
                </div>
             </div>

          </div>
       </div>
    </div>
  );
};