import type { Metadata } from 'next';
import './globals.css';
import './fonts.css';
import './info.css';
import './redesign.css';
import { MotionSystem } from './components/motion-system';
import { ConsultationProvider } from './components/consultation/consultation-provider';

export const metadata: Metadata = {
  metadataBase: new URL('https://ezway.vn'),
  icons: { icon: '/favicon.png' },
  title: 'EZWAY Logistics | Gửi hàng quốc tế dễ dàng',
  description:
    'Giải pháp vận chuyển quốc tế, mua hộ hàng Mỹ và hỗ trợ hải quan từ Việt Nam.',
  openGraph: {
    title: 'Gửi hàng quốc tế dễ hơn cùng EZWAY',
    description:
      'Theo dõi hành trình, chuẩn bị hàng và nhận tư vấn vận chuyển quốc tế từ Việt Nam.',
    url: '/',
    siteName: 'EZWAY Logistics',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/ezway-logo.jpg',
        width: 1280,
        height: 960,
        alt: 'EZWAY — Moving Made Easy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gửi hàng quốc tế dễ hơn cùng EZWAY',
    description:
      'Theo dõi hành trình và nhận tư vấn vận chuyển quốc tế từ Việt Nam.',
    images: ['/ezway-logo.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="preload" href="/fonts/font-10.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/font-12.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body><MotionSystem/>{children}<ConsultationProvider/></body>
    </html>
  );
}
