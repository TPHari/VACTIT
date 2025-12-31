import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api-client';


// [1] Định nghĩa Interface khớp với dữ liệu từ ExamList truyền xuống
export interface ExamData {
  id: string;
  title: string;
  date: string;
  status: string;
  duration: number;    // ExamList truyền vào số phút (number)
  questions: number;   // ExamList truyền vào số lượng (number)
  subject: string;
  isVip?: boolean;     // Optional (API hiện tại chưa có, để ? để không lỗi)
  author: string;
  type: string;
}

interface ExamProps {
  exam: ExamData;
  onSelect: (exam: ExamData) => void;
  currentUserId?: string;
}

export default function ExamCard({ exam, onSelect, currentUserId }: ExamProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Logic xác định màu sắc và nhãn dựa trên status
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
            </svg>
            Đang làm
          </span>
        );
      default:
        return null;
    }
  };

  async function handleTakeTest() {
    if (loading) return;
    setLoading(true);
    try {
      const testId = exam.id; // Replace with actual test ID from exam data
      let userId = currentUserId;
      if (!userId) {
        const res = await fetch('/api/user');
        if (!res.ok) throw new Error('Failed to fetch current user');
        const data = await res.json();
        console.log('Fetched current user data:', data);
        userId = data?.user.user_id;
      }
      if (!userId) throw new Error('Missing user id');
      console.log('Starting trial for testId:', testId, 'userId:', userId);
      const payload = { testId, userId };
      const res = await api.trials.create(payload);
      const trial = res?.data;
      const NotAllowed = res?.alreadyDone;
      console.log("trial data", trial, "NotAllowed:", NotAllowed);
      if (NotAllowed) {
        setShowNotification(true);
      }
      else router.push(`/exam/${trial.trial_id}`);
    } catch (err: any) {
      console.error('Failed to start trial', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className={`bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full border group relative ${exam.status === 'completed' ? 'border-green-200 bg-green-50/30' : 'border-gray-100 hover:border-blue-200'
        }`}>

        {/* Card Header */}
        <div className="flex justify-between items-start mb-3">
          {/* Ngày tháng */}
          <span className="text-[10px] text-gray-500 font-semibold bg-gray-100 px-2 py-1 rounded">
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

        {/* Stats */}
        <div className="space-y-2 mb-4 border-t border-gray-100 pt-3">
          {/* [2] Sửa views thành questions */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            <span>{exam.questions} lượt thi</span> {/* Hoặc 'câu hỏi' tùy ý nghĩa bạn map */}
          </div>

          {/* [3] Duration: Đã là số, thêm chữ 'phút' vào đây */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{exam.duration} phút</span>
          </div>

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
            className="flex-1 py-2 text-xs text-gray-600 font-medium hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
          >
            {exam.status === 'completed' ? 'Xem lại' : 'Chi tiết'}
          </button>

          {/* replaced Link with action button that calls API */}
          <button
            onClick={handleTakeTest}
            disabled={loading}
            className={`flex-1 py-2 text-white text-xs font-medium rounded-lg transition-all shadow-sm transform active:scale-95 ${exam.status === 'completed'
              ? 'bg-green-600 hover:bg-green-700 shadow-green-200 hover:shadow-green-300'
              : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 hover:shadow-blue-300'
              } ${loading ? 'opacity-60 pointer-events-none' : ''}`}
          >
            {loading ? 'Đang khởi tạo...' : (exam.status === 'completed' ? 'Thi lại' : (exam.status === 'in_progress' ? 'Tiếp tục' : 'Thi ngay'))}
          </button>
        </div>
      </div>

      {/* Notification Modal */}
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
                Bạn đã tham gia kỳ thi này rồi. <br /> Vui lòng không tham gia lại.
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