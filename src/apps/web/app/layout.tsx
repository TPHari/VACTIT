// apps/web/app/layout.tsx
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import KeepAliveProvider from '../components/KeepAliveProvider';
import NavigationLoading from '../components/NavigationLoading';
import SWRProvider from '../components/SWRProvider';

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
    <html lang="vi" className="h-full">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
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