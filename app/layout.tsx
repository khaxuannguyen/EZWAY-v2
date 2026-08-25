import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://ezway.vn'),
  title: 'EZWAY Logistics | Gửi hàng quốc tế dễ dàng',
  description:
    'Giải pháp vận chuyển quốc tế, mua hộ hàng Mỹ và hỗ trợ hải quan từ Việt Nam.',
  openGraph: {
    title: 'Gửi hàng đi xa. Không còn lo xa.',
    description:
      'EZWAY đồng hành từ lấy hàng, khai báo hải quan đến giao tận tay.',
    url: '/',
    siteName: 'EZWAY Logistics',
    locale: 'vi_VN',
    type: 'website',
    images: [{ url: '/og.png', width: 1729, height: 910, alt: 'EZWAY Logistics' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gửi hàng đi xa. Không còn lo xa.',
    description:
      'Giải pháp vận chuyển quốc tế rõ ràng, thuận tiện từ Việt Nam.',
    images: ['/og.png'],
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
