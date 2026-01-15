// apps/web/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

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
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
          {/* Không còn Sidebar, Topbar. Chỉ render nội dung trần. */}
          {children}
      </body>
    </html>
  );
}