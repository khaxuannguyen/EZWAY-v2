import type { MetadataRoute } from 'next';
import {services} from './dich-vu/service-data';
import {articles} from './tin-tuc/articles';
export default function sitemap():MetadataRoute.Sitemap{return ['','/gioi-thieu','/dich-vu','/gia-cuoc','/mua-ho-hang-my','/tin-tuc','/lien-he','/chinh-sach-bao-mat',...services.map(s=>`/dich-vu/${s.slug}`),...articles.map(a=>`/tin-tuc/${a.slug}`)].map(path=>({url:`https://ezway.vn${path}`,changeFrequency:path===''?'weekly':'monthly',priority:path===''?1:.7}));}
