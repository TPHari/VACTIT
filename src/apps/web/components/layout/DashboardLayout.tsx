import React from 'react';
import Sidebar from '@/components/functionalBar/Sidebar';
import Topbar from '@/components/functionalBar/Topbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <Topbar />
      
      {/* Đây là phần giữ khoảng cách để nội dung không bị che */}
      <main className="pl-[18rem] pt-24 pr-6 pb-6 min-h-screen transition-all duration-300">
        {children}
      </main>
    </>
  );
}