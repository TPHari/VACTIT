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
        <div className="card card-no-hover w-full mb-6 relative overflow-visible flex-shrink-0 group bg-white border border-blue-100">
          <div className="relative z-10 flex items-center gap-6 p-6">
            <div className="min-w-[120px]">
              <h1 className="text-2xl font-bold text-blue-600 leading-tight">
                Thi thử <br /> ĐGNL
              </h1>
            </div>
            <p className="text-slate-500 text-sm max-w-xl">
              Lorem ipsum dolor sit amet consectetur. Vel vitae tellus vestibulum nunc.
              Volutpat lacus sed ac aliquam adipiscing. Sagittis commodo massa in
              ullamcorper congue velit. Vulputate bibendum quis interdum nec purus id.
            </p>
          </div>

          {/* Figures (Giữ tone vàng như mẫu) */}
          <div className="absolute right-2 top-[-14px] bottom-[-14px] w-64 pointer-events-none flex items-center justify-center">
            <img
              src="/assets/icons/exam_icon.svg"
              className="w-56 h-auto overflow-visible"
            />
          </div>
        </div>

        {/* Tái sử dụng Grid và Logic */}
        <ExamList />
      </div>
    </DashboardLayout>
  );
}
