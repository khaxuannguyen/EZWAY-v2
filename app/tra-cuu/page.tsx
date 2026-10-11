import type { Metadata } from 'next';
import { TrackingLookup } from './tracking-lookup';
import { SiteHeader, SiteFooter } from '../components/site-shell';
export const metadata: Metadata={title:'Tra cứu đơn hàng | EZWAY Logistics',description:'Theo dõi trạng thái và hành trình kiện hàng EZWAY từ KSN, NamDe và ZAT.',alternates:{canonical:'/tra-cuu'},robots:{index:false,follow:true}};
export default function TrackingPage(){return <div className="lookup-page ez-lookup"><SiteHeader active="/tra-cuu"/><main id="noi-dung"><section className="lookup-hero"><div className="container lookup-hero-inner"><p>EZWAY / TRACKING</p><h1>Mỗi kiện hàng.<br/><span>Một hành trình rõ ràng.</span></h1><span>Nhập mã vận đơn để xem cập nhật mới nhất từ đối tác.</span></div></section><section className="container lookup-main" aria-label="Tra cứu hành trình đơn hàng"><TrackingLookup/></section></main><SiteFooter/></div>;}
