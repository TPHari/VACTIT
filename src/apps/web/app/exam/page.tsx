'use client';

import React, { useEffect } from 'react';
import ExamList from '@/components/exam/ExamList';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function ExamTab() {
  return (
    <DashboardLayout>
      <div className="exam-container fade-in flex flex-col relative min-h-full">
        
        {/* 1. Header Banner */}
        {/* THAY ĐỔI QUAN TRỌNG: 
            - Thêm 'card-blue': Để nhận nền xanh và chữ trắng từ globals.css (ghi đè lên màu trắng của .card).
            - Giữ 'card' & 'group': Để có bo góc, bóng đổ và hiệu ứng hover zoom.
        */}
        <div className="card card-blue w-full mb-6 relative overflow-hidden flex-shrink-0 group">
          
          <div className="relative z-10 max-w-2xl p-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              Kho Đề Thi <br /> ĐGNL & THPTQG
            </h1>
            <p className="text-blue-100 text-sm font-medium">
              Hơn 1000+ đề thi thử được cập nhật liên tục từ các trường chuyên và sở giáo dục trên cả nước.
            </p>
          </div>

          {/* Figures (Các hình trang trí giữ nguyên màu Vàng) */}
          <div className="absolute right-0 top-0 bottom-0 w-64 pointer-events-none">
            
            {/* Figure 1 */}
            <div className="absolute top-[-20px] right-[40px] w-20 h-20 bg-yellow-400 rounded-full opacity-90 transition-transform duration-500 ease-out group-hover:scale-125 shadow-lg shadow-blue-900/20"></div>
            
            {/* Figure 2 */}
            <div className="absolute bottom-[-10px] right-[100px] w-16 h-16 bg-yellow-400 rounded-full opacity-80 transition-transform duration-700 ease-out group-hover:scale-110 shadow-lg shadow-blue-900/20"></div>
            
            {/* Figure 3 */}
            <div className="absolute top-[40px] right-[-30px] w-32 h-32 bg-yellow-400 rounded-full opacity-100 transition-transform duration-500 ease-out group-hover:scale-110 shadow-lg shadow-blue-900/20"></div>
          
          </div>
        </div>

        {/* Tái sử dụng Grid và Logic */}
        <ExamList />
      </div>
    </DashboardLayout>
  );
}