'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';

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
  currentUserId?: string;
}

export default function ExamCard({ exam, onSelect, categoryContext, currentUserId }: ExamProps) {
  const router = useRouter();
  
  // --- STATE UI ---
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isExamOpen, setIsExamOpen] = useState(false);

  // --- STATE LOGIC ---
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [mounted, setMounted] = useState(false);

  const isCompleted = exam.status === 'completed';
  const isPractice = exam.type === 'practice';

  // [LOGIC]: Bài thi thật (Exam) và Đã làm (Completed) -> Khóa hoàn toàn
  const isRealExamDone = !isPractice && isCompleted;

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // --- LOGIC COUNTDOWN ---
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

  // --- XỬ LÝ NÚT PHẢI (Thi ngay / Thi lại) ---
  const handleTakeTest = async () => {
    if (loading) return;
    
    // Nếu nút bị khóa hiển thị -> Chặn click
    if (isLockedVisual) return;

    setLoading(true);
    try {
      const testId = exam.id;
      let userId = currentUserId;
      
      if (!userId) {
         try {
            const res = await fetch('/api/user');
            const data = await res.json();
            userId = data?.user?.user_id || data?.user?.id;
         } catch(e) {}
      }

      if (!userId) {
          alert("Vui lòng đăng nhập để làm bài");
          return;
      }

      console.log('Starting trial for testId:', testId, 'userId:', userId);
      const res = await api.trials.create({ testId, userId });
      const trial = res?.data;
      const isAlreadyDone = res?.alreadyDone;

      if (isAlreadyDone) {
        setShowNotification(true);
      } else if (trial && trial.trial_id) {
        router.push(`/exam/${trial.trial_id}`);
      }
    } catch (err: any) {
      console.error('Failed to start trial', err);
    } finally {
      setLoading(false);
    }
  };

  // --- UI HELPERS ---
  const renderStatusBadge = () => {
    if (timeLeft) {
      return (
        <span className="text-[10px] font-bold px-2 py-1 rounded bg-orange-100 text-orange-600 flex items-center gap-1 animate-pulse border border-orange-200">
           ⏳ {timeLeft}
        </span>
      );
    }
    // [Badge Màu Xám]: Cho trường hợp Exam đã hoàn thành
    if (isRealExamDone) {
       return <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-1 rounded border border-gray-200">Đã hoàn thành</span>;
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
    if (loading) return 'Đang xử lý...';
    
    // 1. Ưu tiên: Exam đã làm -> "Đã hoàn thành" (nhưng nút sẽ bị disable và màu xám)
    if (isRealExamDone) return 'Đã hoàn thành';

    // 2. Practice đã làm -> "Thi lại"
    if (isPractice && isCompleted) return 'Thi lại';
    
    // 3. Chưa làm nhưng hết giờ/chưa mở
    if (!isExamOpen && !isPractice) {
        const now = new Date().getTime();
        const start = exam.startTime ? new Date(exam.startTime).getTime() : 0;
        if (now < start) return 'Chưa mở';
        return 'Đã kết thúc';
    }
    return 'Thi ngay';
  }

  // Logic xác định trạng thái KHÓA (Visual + Interaction)
  // Khóa khi:
  // 1. Hết giờ hoặc chưa mở (Time locked)
  // 2. HOẶC Là bài thi thật VÀ Đã làm rồi (Completion locked)
  const isLockedVisual = (!isExamOpen && !isPractice && !isCompleted) || isRealExamDone;

  return (
    <>
      <div className={`p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full border group relative ${
        // Nếu bị khóa (bất kể lý do gì) -> Màu xám
        isLockedVisual ? 'bg-gray-50/80 border-gray-200' : 
        // Mặc định -> Màu trắng
        'bg-white border-gray-100 hover:border-blue-300'
      }`}>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <span className="text-[10px] text-gray-500 font-semibold bg-white/60 px-2 py-1 rounded border border-gray-100">
          {new Date(exam.date).toLocaleDateString('vi-VN')}
        </span>
        <div className="flex gap-1 items-center">
            {renderStatusBadge()}
            {exam.isVip && (
              <span className="bg-gray-900 text-yellow-400 text-[10px] font-bold px-2 py-1 rounded border border-yellow-500 shadow-sm ml-1">VIP</span>
            )}
        </div>
      </div>

      {/* Title */}
      <h3
        className={`font-semibold text-sm mb-4 line-clamp-2 min-h-[40px] transition-colors ${
            // Nếu bị khóa -> Title màu xám và không click được
            isLockedVisual 
                ? 'text-gray-500 cursor-not-allowed'
                : 'text-gray-800 group-hover:text-blue-600 cursor-pointer'
        }`}
        title={exam.title}
        onClick={() => !isLockedVisual && onSelect(exam)}
      >
        {exam.title}
      </h3>

      {/* Info Stats */}
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

      {/* Buttons */}
      <div className="flex gap-2 mt-auto">
        
        {/* NÚT TRÁI: CHI TIẾT */}
        <button
          onClick={() => onSelect(exam)}
          disabled={isLockedVisual}
          className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors border ${
            isLockedVisual 
                ? 'bg-white text-gray-400 border-gray-200 cursor-not-allowed' // Luôn xám nếu bị khóa
                : isCompleted 
                    ? 'text-green-700 bg-white border-green-200 hover:bg-green-50' 
                    : 'text-gray-600 bg-white hover:bg-gray-50 border-gray-200'
          }`}
        >
          Chi tiết
        </button>
        
        {/* NÚT PHẢI: THI NGAY / THI LẠI / ĐÃ HOÀN THÀNH */}
        {isLockedVisual ? (
            <button disabled className={`flex-1 py-2 text-white text-xs font-medium rounded-lg cursor-not-allowed shadow-sm ${
                // Nếu bị khóa nhưng có đếm ngược -> màu cam
                // Còn lại (bao gồm Exam đã hoàn thành) -> màu xám
                timeLeft ? 'bg-orange-400' : 'bg-gray-400'
            }`}>
                {timeLeft ? timeLeft : getButtonText()}
            </button>
        ) : (
            <button 
                onClick={handleTakeTest}
                disabled={loading}
                className={`flex-1 py-2 text-white text-xs font-medium rounded-lg transition-all shadow-sm transform active:scale-95 ${
                  isCompleted
                    ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 hover:shadow-blue-300' 
                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 hover:shadow-blue-300'
                } ${loading ? 'opacity-70 cursor-wait' : ''}`}>
                 {getButtonText()}
            </button>
        )}
      </div>
    </div>

    {/* Notification */}
    {mounted && showNotification && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Thông báo</h3>
              <p className="text-sm text-gray-600 mb-6">
                Bạn đã hoàn thành kỳ thi này. <br/> 
                Bài thi này chỉ được phép làm 1 lần.
              </p>
              <button
                onClick={() => setShowNotification(false)}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                type="button"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}