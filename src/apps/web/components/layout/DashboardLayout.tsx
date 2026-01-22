import React, { Suspense } from 'react';
import Sidebar from '@/components/functionalBar/Sidebar';
import Topbar from '@/components/functionalBar/Topbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <Topbar />
      </Suspense>
      <Sidebar />
      
      {/* Đây là phần giữ khoảng cách để nội dung không bị che */}
      <main className="pl-[18rem] pr-6 pb-6 transition-all duration-300">
        {children}
      </main>
    </>
  );
}