import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { SiteHeader, SiteFooter } from './components/site-shell';
export function InfoShell({active,children}:{active:string;children:ReactNode}){return <div className="home-page info-page ez-info"><SiteHeader active={active}/><main id="noi-dung">{children}</main><SiteFooter/></div>;}
export function Intro({eyebrow,title,copy,children}:{eyebrow:string;title:string;copy:string;children?:ReactNode}){return <section className="info-intro"><div className="home-container"><p className="info-breadcrumb"><a href="/">Trang chủ</a> / {eyebrow}</p><p className="info-kicker">EZWAY · {eyebrow}</p><h1>{title}</h1><p className="info-lead">{copy}</p>{children}</div></section>;}
export function Section({id,title,children}:{id?:string;title:string;children:ReactNode}){return <section id={id} className="info-section"><h2>{title}</h2>{children}</section>;}
export function FAQ({items}:{items:readonly (readonly [string,string])[]}){return <div className="info-faq">{items.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>;}
export function ContactCTA(){return <aside className="info-cta"><div><h2>Cho EZWAY biết bạn cần gửi gì</h2><p>Chuẩn bị loại hàng, điểm đến, cân nặng và kích thước nếu có.</p></div><a className="info-button" href="/gia-cuoc#yeu-cau">Chuẩn bị yêu cầu báo giá <ArrowUpRight size={18}/></a></aside>;}
