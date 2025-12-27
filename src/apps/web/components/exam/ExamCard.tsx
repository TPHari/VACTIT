import React from 'react';
import Link from 'next/link';

// Interface chuẩn dùng chung cho cả ExamList và ExamCard
export interface ExamData {
  id: string;
  title: string;
  date: string;
  status: string; 
  duration: number;
  questions: number;    // Số câu hỏi
  totalTrials: number;  // Tổng lượt thi
  subject: string;
  isVip?: boolean;
  author: string;
  type: string;
}

interface ExamProps {
  exam: ExamData;
  onSelect: (exam: ExamData) => void;
}

export default function ExamCard({ exam, onSelect }: ExamProps) {
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="flex items-center gap-1 bg-green-100 text-green-700 border border-green-200 text-[10px] font-bold px-2 py-1 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
            </svg>
            Đã làm
          </span>
        );
      case 'in_progress':
        return (
          <span className="flex items-center gap-1 bg-blue-50 text-blue-600 border border-blue-200 text-[10px] font-bold px-2 py-1 rounded-full">
             Đang làm
          </span>
        );
      default:
        return null;
    }
  };

  const isCompleted = exam.status === 'completed';

  return (
    <div className={`p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full border group relative ${
        isCompleted ? 'bg-green-50/40 border-green-200' : 'bg-white border-gray-100 hover:border-blue-200'
    }`}>
      
      {/* Header: Date + Badge */}
      <div className="flex justify-between items-start mb-3">
        <span className="text-[10px] text-gray-500 font-semibold bg-white/60 px-2 py-1 rounded border border-gray-100">
          {new Date(exam.date).toLocaleDateString('vi-VN')}
        </span>
        
        <div className="flex gap-1 items-center">
            {getStatusBadge(exam.status)}
            {exam.isVip && (
                <span className="bg-gray-900 text-yellow-400 text-[10px] font-bold px-2 py-1 rounded border border-yellow-500 shadow-sm ml-1">
                VIP
                </span>
            )}
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

      {/* Stats Area */}
      <div className="space-y-2 mb-4 border-t border-gray-100/50 pt-3">
        
        {/* Dòng 1: Tổng lượt thi */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span>{exam.totalTrials} lượt thi</span>
        </div>
        
        {/* Dòng 2: Thời gian */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{exam.duration} phút</span>
        </div>
        
        {/* Dòng 3: Môn học */}
        {exam.subject && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-purple-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
                <span>{exam.subject}</span>
            </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-auto">
        <button
          onClick={() => onSelect(exam)}
          className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors border ${
            isCompleted 
              ? 'text-green-700 bg-white border-green-200 hover:bg-green-50' 
              : 'text-gray-600 bg-white hover:bg-gray-50 border-gray-200'
          }`}
        >
          {isCompleted ? 'Kết quả' : 'Chi tiết'}
        </button>
        
        <Link href={`/exam/${exam.id}`} className="flex-1">
            <button className={`w-full h-full py-2 text-white text-xs font-medium rounded-lg transition-all shadow-sm transform active:scale-95 ${
                isCompleted
                ? 'bg-green-600 hover:bg-green-700 shadow-green-200 hover:shadow-green-300' 
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 hover:shadow-blue-300'
            }`}>
             {isCompleted ? 'Thi lại' : 'Thi ngay'}
            </button>
        </Link>
      </div>
    </div>
  );
}