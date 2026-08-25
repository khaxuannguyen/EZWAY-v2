import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://ezway.vn'),
  title: 'EZWAY Logistics | Gửi hàng quốc tế dễ dàng',
  description:
    'Giải pháp vận chuyển quốc tế, mua hộ hàng Mỹ và hỗ trợ hải quan từ Việt Nam.',
  openGraph: {
    title: 'Vận chuyển quốc tế nhanh hơn, an toàn hơn, minh bạch hơn',
    description:
      'EZWAY cung cấp giải pháp vận chuyển quốc tế, mua hộ hàng Mỹ và hỗ trợ hải quan.',
    url: '/',
    siteName: 'EZWAY Logistics',
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vận chuyển quốc tế | EZWAY Logistics',
    description:
      'Giải pháp vận chuyển quốc tế rõ ràng, thuận tiện từ Việt Nam.',
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
