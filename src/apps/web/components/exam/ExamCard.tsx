import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export interface ExamData {
  id: string;
  title: string;
  date: string;
  startTime?: string;
  dueTime?: string;
  status: string;
  duration: number;
  questions: number;
  totalTrials: number;
  subject: string;
  isVip?: boolean;
  author: string;
  type: string;
}

interface ExamProps {
  exam: ExamData;
  onSelect: (exam: ExamData) => void;
  categoryContext?: string;
}

export default function ExamCard({ exam, onSelect, categoryContext }: ExamProps) {
  
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isExamOpen, setIsExamOpen] = useState(false);

  const isCompleted = exam.status === 'completed';
  const isPractice = exam.type === 'practice';
  
  useEffect(() => {
    const checkStatus = () => {
      const now = new Date().getTime();
      const start = exam.startTime ? new Date(exam.startTime).getTime() : 0;
      const due = exam.dueTime ? new Date(exam.dueTime).getTime() : Infinity;

      if (isPractice) {
        setIsExamOpen(true);
        return;
      }

      if (now >= start && now <= due) {
        setIsExamOpen(true);
      } else {
        setIsExamOpen(false);
      }

      const distance = start - now;
      if (distance > 0 && distance <= 24 * 60 * 60 * 1000) {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        const h = hours < 10 ? `0${hours}` : hours;
        const m = minutes < 10 ? `0${minutes}` : minutes;
        const s = seconds < 10 ? `0${seconds}` : seconds;
        
        setTimeLeft(`${h}:${m}:${s}`);
      } else {
        setTimeLeft('');
      }
    };

    checkStatus();
    const timer = setInterval(checkStatus, 1000);
    return () => clearInterval(timer);
  }, [exam.startTime, exam.dueTime, exam.type, isPractice]);

  const renderStatusBadge = () => {
    if (timeLeft) {
      return (
        <span className="text-[10px] font-bold px-2 py-1 rounded bg-orange-100 text-orange-600 flex items-center gap-1 animate-pulse border border-orange-200">
           ⏳ {timeLeft}
        </span>
      );
    }

    if (isCompleted) {
       return <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded border border-green-200">Đã làm</span>;
    }
    
    if (categoryContext === 'in_progress' || (isExamOpen && !isPractice)) {
        return <span className="text-[10px] font-bold px-2 py-1 rounded bg-red-100 text-red-600 animate-pulse border border-red-200">● Đang diễn ra</span>;
    }

    if (categoryContext === 'locked' || (!isExamOpen && !isPractice && !timeLeft)) {
        const now = new Date().getTime();
        const start = exam.startTime ? new Date(exam.startTime).getTime() : 0;
        if (now < start) return <span className="text-[10px] font-bold px-2 py-1 rounded bg-blue-100 text-blue-600 border border-blue-200">📅 Sắp tới</span>;
        return <span className="text-[10px] font-bold px-2 py-1 rounded bg-gray-100 text-gray-500 border border-gray-200">🔒 Đã kết thúc</span>;
    }

    if (isPractice) {
        return <span className="text-[10px] font-bold px-2 py-1 rounded bg-teal-50 text-teal-600 border border-teal-100">📖 Luyện tập</span>;
    }

    return null;
  };

  const getButtonText = () => {
    if (isCompleted) return 'Thi lại';
    if (!isExamOpen && !isPractice) {
        const now = new Date().getTime();
        const start = exam.startTime ? new Date(exam.startTime).getTime() : 0;
        if (now < start) return 'Chưa mở';
        return 'Đã kết thúc';
    }
    return 'Thi ngay';
  }

  const isLockedVisual = !isExamOpen && !isPractice && !isCompleted;

  return (
    <div className={`p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full border group relative ${
        isLockedVisual ? 'bg-gray-50/80 border-gray-200' : 
        isCompleted ? 'bg-green-50/40 border-green-200' : 'bg-white border-gray-100 hover:border-blue-300'
    }`}>
      
      <div className="flex justify-between items-start mb-3">
        <span className="text-[10px] text-gray-500 font-semibold bg-white/60 px-2 py-1 rounded border border-gray-100">
          {new Date(exam.date).toLocaleDateString('vi-VN')}
        </span>
        
        <div className="flex gap-1 items-center">
            {renderStatusBadge()}
            {exam.isVip && (
                <span className="bg-gray-900 text-yellow-400 text-[10px] font-bold px-2 py-1 rounded border border-yellow-500 shadow-sm ml-1">
                VIP
                </span>
            )}
        </div>
      </div>

      <h3
        className={`font-semibold text-sm mb-4 line-clamp-2 min-h-[40px] transition-colors ${
            isLockedVisual ? 'text-gray-500 cursor-not-allowed' : 'text-gray-800 group-hover:text-blue-600 cursor-pointer'
        }`}
        title={exam.title}
        onClick={() => !isLockedVisual && onSelect(exam)}
      >
        {exam.title}
      </h3>

      <div className="space-y-2 mb-4 border-t border-gray-100/50 pt-3">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span>Bạn đã thi: {exam.totalTrials} lần</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{exam.duration} phút</span>
        </div>
      </div>

      <div className="flex gap-2 mt-auto">
        <button
          onClick={() => onSelect(exam)}
          disabled={isLockedVisual}
          className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors border ${
            isLockedVisual ? 'bg-white text-gray-400 border-gray-200 cursor-not-allowed' :
            isCompleted 
              ? 'text-green-700 bg-white border-green-200 hover:bg-green-50' 
              : 'text-gray-600 bg-white hover:bg-gray-50 border-gray-200'
          }`}
        >
          {isCompleted ? 'Kết quả' : 'Chi tiết'}
        </button>
        
        {(!isExamOpen && !isPractice && !isCompleted) ? (
            <button disabled className={`flex-1 py-2 text-white text-xs font-medium rounded-lg cursor-not-allowed shadow-sm ${
                timeLeft ? 'bg-orange-400' : 'bg-gray-400'
            }`}>
                {timeLeft ? timeLeft : getButtonText()}
            </button>
        ) : (
            <Link href={`/exam/${exam.id}`} className="flex-1">
                <button className={`w-full h-full py-2 text-white text-xs font-medium rounded-lg transition-all shadow-sm transform active:scale-95 ${
                    isCompleted
                    ? 'bg-green-600 hover:bg-green-700 shadow-green-200 hover:shadow-green-300' 
                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 hover:shadow-blue-300'
                }`}>
                 {getButtonText()}
                </button>
            </Link>
        )}
      </div>
    </div>
  );
}