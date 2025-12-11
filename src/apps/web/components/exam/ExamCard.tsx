import React from 'react';
import Link from 'next/link';

// Chức năng: Đây là thành phần nhỏ nhất trong danh sách. Nó chỉ có nhiệm vụ hiển thị tóm tắt của 1 đề thi (Tiêu đề, số lượt thi, thời gian, nút "Thi ngay"). Nó giống như một "viên gạch" để xây nên bức tường danh sách đề thi.
// Định nghĩa kiểu dữ liệu (tạm thời để any hoặc interface khớp với mock data của bạn)
interface ExamProps {
  exam: any;
  onSelect: (exam: any) => void;
}

export default function ExamCard({ exam, onSelect }: ExamProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full border border-gray-100 hover:border-blue-200 group relative">
      {/* Card Header */}
      <div className="flex justify-between items-start mb-3">
        <span className="text-[10px] text-gray-500 font-semibold bg-gray-100 px-2 py-1 rounded">
          {exam.date}
        </span>
        <div className="flex gap-2">
          {exam.isVip && (
            <span className="bg-gray-900 text-yellow-400 text-[10px] font-bold px-2 py-0.5 rounded border border-yellow-500 shadow-sm animate-pulse">
              VIP
            </span>
          )}
          <button className="text-gray-300 hover:text-blue-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Title */}
      <h3
        className="text-gray-800 font-semibold text-sm mb-4 line-clamp-2 min-h-[40px] group-hover:text-blue-600 transition-colors cursor-pointer"
        title={exam.title}
        onClick={() => onSelect(exam)}
      >
        {exam.title}
      </h3>

      {/* Stats */}
      <div className="space-y-2 mb-4 border-t border-gray-50 pt-3">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          <span>{exam.views} lượt thi</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{exam.duration} phút</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-auto">
        <button
          onClick={() => onSelect(exam)}
          className="flex-1 py-2 text-xs text-gray-600 font-medium hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
        >
          Chi tiết
        </button>
        <Link href={`/exam/${exam.id}`} className="flex-1">
            <button className="w-full h-full py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-all shadow-sm shadow-blue-200 hover:shadow-blue-300 transform active:scale-95">
            Thi ngay
            </button>
        </Link>
      </div>
    </div>
  );
}