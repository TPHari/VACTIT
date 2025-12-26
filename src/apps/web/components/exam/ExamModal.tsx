'use client'; // Thêm dòng này để dùng useState cho nút Loading

import React, { useState } from 'react';
import Link from 'next/link';

interface ExamModalProps {
  exam: any;
  onClose: () => void;
}

export default function ExamModal({ exam, onClose }: ExamModalProps) {
  const [isNavigating, setIsNavigating] = useState(false);

  if (!exam) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop mờ */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      {/* Thêm 'animate-in zoom-in-95 duration-200' để có hiệu ứng bật lên nhẹ nhàng */}
      <div className="bg-white rounded-[2rem] w-full max-w-5xl relative z-10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 ease-out">
        
        {/* Header Deco */}
        <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none">
          <svg viewBox="0 0 200 200" className="w-full h-full text-yellow-400 fill-current opacity-100 transform translate-x-1/3 -translate-y-1/3"><circle cx="100" cy="100" r="80" /></svg>
          <svg viewBox="0 0 200 200" className="absolute top-10 right-10 w-32 h-32 text-yellow-300 fill-current opacity-80"><circle cx="100" cy="100" r="80" /></svg>
        </div>

        <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar">
          {/* Modal Title */}
          <div className="mb-6 relative pr-20">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 leading-tight">
              {exam.title}
            </h2>
            <div className="flex gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <span className="font-medium">{exam.views} lượt thi</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="font-medium">{exam.duration} phút</span>
              </div>
            </div>
          </div>

          {/* 2 Columns: Info & Guide */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            
            {/* Cột 1: Thông tin (Thêm hiệu ứng hover zoom) */}
            <div className="space-y-2 group">
              <h3 className="text-blue-600 font-bold text-lg group-hover:text-blue-700 transition-colors">Thông tin bài thi</h3>
              <div className="bg-[#2563EB] text-white p-5 rounded-2xl h-48 overflow-y-auto overflow-x-hidden shadow-lg shadow-blue-200 custom-scrollbar-light transition-transform duration-300 ease-out hover:scale-[1.02] hover:shadow-xl">
                <p className="text-sm leading-relaxed opacity-95 whitespace-pre-line">
                  {exam.description || "Chưa có thông tin mô tả cho bài thi này."}
                </p>
              </div>
            </div>

            {/* Cột 2: Hướng dẫn (Thêm hiệu ứng hover zoom) */}
            <div className="space-y-2 relative group">
              <h3 className="text-blue-600 font-bold text-lg group-hover:text-blue-700 transition-colors">Hướng dẫn thi</h3>
              <div className="bg-[#2563EB] text-white p-5 rounded-2xl h-48 overflow-y-auto overflow-x-hidden shadow-lg shadow-blue-200 relative custom-scrollbar-light flex flex-col transition-transform duration-300 ease-out hover:scale-[1.02] hover:shadow-xl">
                <div className="relative z-10">
                  <p className="text-sm leading-relaxed opacity-95 whitespace-pre-line">
                    {exam.instructions || "Chưa có hướng dẫn cụ thể cho bài thi này."}
                  </p>
                </div>
                {/* Hình tam giác trang trí cũng xoay nhẹ khi hover */}
                <div className="absolute bottom-[-10px] right-[-10px] w-24 h-24 pointer-events-none opacity-50 transition-transform duration-500 group-hover:rotate-45">
                  <svg viewBox="0 0 100 100" className="w-full h-full fill-yellow-400 transform rotate-12"><path d="M50 0 L100 50 L50 100 L0 50 Z" /></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mt-auto">
            
            <Link 
                href={`/exam/${exam.id}`} 
                className="block w-full"
                onClick={() => setIsNavigating(true)} // Bật loading khi bấm
            >
                <button 
                    disabled={isNavigating}
                    className={`w-full bg-[#2563EB] text-white py-4 rounded-full font-bold text-lg shadow-lg hover:bg-blue-700 transition-all hover:shadow-blue-300 flex items-center justify-center gap-3 ${isNavigating ? 'opacity-90 cursor-wait' : 'hover:-translate-y-1'}`}
                >
                {isNavigating ? (
                    <>
                        {/* Spinner trắng đơn giản cho nút */}
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang vào thi...
                    </>
                ) : (
                    "Vào thi ngay"
                )}
                </button>
            </Link>

            <button
              onClick={onClose}
              disabled={isNavigating}
              className="w-full bg-gray-100 text-gray-600 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors"
            >
              Trở lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}