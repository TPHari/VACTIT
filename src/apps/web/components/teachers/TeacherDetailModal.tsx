'use client';

import React from 'react';

interface TeacherDetailModalProps {
  teacher: any;
  onClose: () => void;
}

export default function TeacherDetailModal({ teacher, onClose }: TeacherDetailModalProps) {
  if (!teacher) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Header với Background màu xanh */}
        <div className="h-28 bg-gradient-to-br from-blue-600 to-blue-800 relative">
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-1.5 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Avatar & Tên */}
        <div className="px-6 relative -mt-12 text-center pb-4 border-b border-gray-100">
          <div className="inline-block p-1.5 bg-white rounded-full shadow-lg">
            <img 
              src={teacher.image} 
              alt={teacher.name} 
              className="w-24 h-24 rounded-full object-cover bg-gray-200"
            />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mt-2">{teacher.name}</h2>
          <span className="inline-block mt-1 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wide rounded-full border border-blue-100">
            {teacher.role}
          </span>
        </div>

        {/* Thông tin chi tiết: Email & Phone */}
        <div className="p-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Thông tin liên hệ</h3>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="p-2 bg-white rounded-full text-blue-600 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="overflow-hidden">
              <p className="text-xs text-gray-400 font-medium">Email</p>
              <p className="text-sm text-gray-800 font-medium truncate" title={teacher.email}>
                {teacher.email || 'Chưa cập nhật'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="p-2 bg-white rounded-full text-green-600 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Số điện thoại</p>
              <p className="text-sm text-gray-800 font-medium">
                {teacher.phone || 'Chưa cập nhật'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <button 
            onClick={onClose}
            className="w-full py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 hover:text-gray-900 transition shadow-sm"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}