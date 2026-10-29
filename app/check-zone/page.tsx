import type { Metadata } from 'next';
import { SiteHeader, SiteFooter } from '../components/site-shell';
import { ZoneLookup } from './zone-lookup';
import './zone.css';

export const metadata: Metadata = {
  title: 'Check zone Úc · Aupost & Toll Global | EZWAY',
  description: 'Tra cứu zone tính cước Aupost, Toll Standard và Toll Priority theo postcode, bang và suburb tại Úc.',
  alternates: { canonical: '/check-zone' },
};
export default function CheckZonePage() {
  return <div className="zone-page"><SiteHeader active="/check-zone"/><main id="noi-dung">
    <section className="zone-hero"><div className="ez-container zone-hero-inner">
      <div><p className="zone-eyebrow"><span/> EZWAY / AUSTRALIA</p><h1>Đúng địa chỉ.<br/><em>Rõ zone giao hàng.</em></h1><p className="zone-lead">Tra cứu zone tính cước tại Úc cho Aupost và Toll Global.<br/>Nhập postcode để đối chiếu các dịch vụ trong một lần tra.</p></div>
      <div className="zone-route" aria-label="Tuyến Việt Nam đến Úc"><span>VIỆT NAM</span><div className="zone-route-line"><b>VN</b><i/><b>AU</b></div><span>AUSTRALIA</span><small>Aupost · Toll Global</small></div>
    </div></section>
    <ZoneLookup/>
  </main><SiteFooter/></div>;
}
