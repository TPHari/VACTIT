'use client';

import React from 'react';
import ExamList from '@/components/exam/ExamList';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function ExamTab() {
  return (
    <DashboardLayout>
      <div className="exam-container fade-in flex flex-col relative min-h-full">
        
        {/* 1. Header Banner */}
        <div className="card card-no-hover w-full mb-6 relative overflow-visible flex-shrink-0 group bg-white border border-blue-100">
          <div className="relative z-10 flex items-center gap-6 px-6 py-1 pr-32">
            <div className="min-w-[120px]">
              <h1 className="text-3xl font-bold text-[#2864D2] leading-tight">
                Thi thử <br /> V-ACT
              </h1>
            </div>
            <p className="text-slate-500 text-sm max-w-xl">
              Bản lĩnh không tự nhiên sinh ra, nó phải được tôi luyện.
              Hãy để tiếng đồng hồ đếm ngược rèn cho tim bạn nhịp đập thép, tập làm quen với cảm giác căng thẳng ngay tại nhà. 
              Chỉ khi bạn đổ mồ hôi trên 'sân tập' với cường độ của một trận đấu thật, 
              thì phòng thi chính thức mới không còn là nỗi ám ảnh, mà trở thành nơi để bạn tỏa sáng.
            </p>
          </div>

          {/* Figures*/}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute right-6 top-[-32px] bottom-0 w-73 overflow-hidden flex items-start justify-center">
              <img
                src="/assets/icons/exam_icon.svg"
                className="w-63 h-auto"
                alt="Exam icon"
              />
            </div>
          </div>
        </div>

        {/* Tái sử dụng Grid và Logic */}
        <ExamList />
      </div>
    </DashboardLayout>
  );
}
