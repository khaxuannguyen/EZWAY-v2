import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://ezway.vn'),
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
        url: 'https://ezway-logistics-vietnam.khoahamhoc-2576.chatgpt.site/ezway-logo.jpg',
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
    images: ['https://ezway-logistics-vietnam.khoahamhoc-2576.chatgpt.site/ezway-logo.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
