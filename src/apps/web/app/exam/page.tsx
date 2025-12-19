'use client';

import React from 'react';
import ExamList from '@/components/exam/ExamList';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function ExamTab() {
  return (
    <DashboardLayout>
      <div className="exam-container fade-in flex flex-col h-[calc(100vh-140px)] relative">
        {/* 1. Header Banner (Giữ lại riêng cho Dashboard nếu muốn) */}
        <div className="w-full bg-white p-6 rounded-2xl shadow-sm mb-4 relative overflow-hidden flex-shrink-0 border border-gray-100">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">
              Kho Đề Thi <br /> ĐGNL & THPTQG
            </h1>
            <p className="text-gray-500 text-sm">
              Hơn 1000+ đề thi thử được cập nhật liên tục từ các trường chuyên và sở giáo dục trên cả nước.
            </p>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-64 pointer-events-none">
            {/* SVG trang trí màu vàng giữ nguyên */}
            <div className="absolute top-[-20px] right-[40px] w-20 h-20 bg-yellow-400 rounded-full opacity-90"></div>
            <div className="absolute bottom-[-10px] right-[100px] w-16 h-16 bg-yellow-400 rounded-full opacity-80"></div>
            <div className="absolute top-[40px] right-[-30px] w-32 h-32 bg-yellow-400 rounded-full opacity-100"></div>
          </div>
        </div>

        {/* Tái sử dụng Grid và Logic */}
        <ExamList />
      </div>
    </DashboardLayout>
  );
}