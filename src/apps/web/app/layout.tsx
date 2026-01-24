// apps/web/app/layout.tsx
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import localFont from 'next/font/local';
import './globals.css';
import KeepAliveProvider from '../components/KeepAliveProvider';
import NavigationLoading from '../components/NavigationLoading';
import SWRProvider from '../components/SWRProvider';

// Sử dụng next/font/local để tối ưu font loading
const monaSans = localFont({
  src: [
    {
      path: '../public/fonts/static/MonaSans-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/static/MonaSans-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/static/MonaSans-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/static/MonaSans-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-mona-sans',
  preload: true,
});

export const metadata: Metadata = {
  title: 'VACTIT – Thi thử Đánh giá năng lực ĐHQG-HCM V-ACT',
  description: 'Hệ thống thi thử đánh giá năng lực V-ACT miễn phí, tích hợp chấm điểm theo lý thuyết IRT và phân tích kết quả chi tiết.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`h-full ${monaSans.variable}`}>
      <body className={`min-h-screen bg-slate-50 text-slate-900 antialiased ${monaSans.className}`}>
        {/* ✅ SWRProvider: Global cache persists across page navigations */}
        <SWRProvider>
          <KeepAliveProvider>
            <Suspense fallback={null}>
              <NavigationLoading />
            </Suspense>
            {children}
          </KeepAliveProvider>
        </SWRProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}