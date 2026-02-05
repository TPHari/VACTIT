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
    totalTrials: number; // Đây là số tổng (Global Count)
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

    // --- XỬ LÝ NÚT PHẢI ---
    const handleTakeTest = async () => {
        if (loading) return;
        if (isLockedVisual) return;

        setLoading(true);
        try {
            const testId = exam.id;
            const userId = currentUserId;

            if (!userId) {
                alert("Vui lòng đăng nhập để làm bài");
                setLoading(false);
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

    const getButtonText = () => {
        if (loading) return 'Đang xử lý...';
        if (isRealExamDone) return 'Đã hoàn thành';
        if (isPractice && isCompleted) return 'Thi lại';

        if (!isExamOpen && !isPractice) {
            const now = new Date().getTime();
            const start = exam.startTime ? new Date(exam.startTime).getTime() : 0;
            if (now < start) return 'Chưa mở';
            return 'Đã kết thúc';
        }
        return 'Thi ngay';
    }

    const isLockedVisual = (!isExamOpen && !isPractice && !isCompleted) || isRealExamDone;

    return (
        <>
            <div className={`p-4 rounded-xl shadow-sm transition-all duration-200 flex flex-col justify-between h-full border group relative ${isLockedVisual ? 'bg-gray-50/80 border-gray-200' :
                    'bg-white border-blue-100 hover:border-blue-200'
                }`}>

                {exam.isVip && (
                    <span className="absolute top-3 right-3 bg-gray-900 text-yellow-300 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                        VIP
                    </span>
                )}

                {/* Header */}
                <div className="flex items-center mb-3">
                    <span className="text-[10px] text-gray-600 font-semibold bg-white px-2 py-1 rounded-full border border-gray-100">
                        {exam.startTime
                            ? `${new Date(exam.startTime).toLocaleDateString('vi-VN')} - ${exam.dueTime ? new Date(exam.dueTime).toLocaleDateString('vi-VN') : 'Không giới hạn'}`
                            : new Date(exam.date).toLocaleDateString('vi-VN')}
                    </span>
                </div>

                {/* Content */}
                <div className={`rounded-2xl p-4 mb-4 relative overflow-hidden ${isLockedVisual ? 'bg-gray-100' : 'bg-blue-50'}`}>
                    <img
                        src="/assets/icons/triangle_exam.svg"
                        alt=""
                        className="absolute right-0 bottom-0 w-20 h-20 translate-x-3 translate-y-1 opacity-80"
                    />
                    <h3
                        className={`font-semibold text-sm mb-4 line-clamp-2 min-h-[40px] relative z-10 ${isLockedVisual
                            ? 'text-gray-500 cursor-not-allowed'
                            : 'text-gray-900 cursor-pointer'
                            }`}
                        title={exam.title}
                        onClick={() => !isLockedVisual && onSelect(exam)}
                    >
                        {exam.title}
                    </h3>

                    <div className="space-y-2 relative z-10">
                        <div className="flex items-center gap-2 text-xs text-gray-700">
                            <svg className="w-4 h-4 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 4h9l3 3v13a1 1 0 01-1 1H6a1 1 0 01-1-1V5a1 1 0 011-1z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h6M9 12h6M9 15h3" />
                            </svg>
                            {/* Hiển thị tổng số lượt thi toàn hệ thống */}
                            <span>{exam.totalTrials} lượt thi</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-700">
                            <svg className="w-4 h-4 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 2h12M7 2v4a5 5 0 005 5 5 5 0 005-5V2M7 22v-4a5 5 0 015-5 5 5 0 015 5v4M6 22h12" />
                            </svg>
                            <span>{exam.duration} phút</span>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 mt-auto">
                    <button
                        onClick={() => onSelect(exam)}
                        disabled={isLockedVisual}
                        className={`flex-1 py-2 text-xs font-medium rounded-lg cursor-pointer transition-colors border ${isLockedVisual
                            ? 'bg-white text-gray-400 border-gray-200 cursor-not-allowed'
                            : 'text-gray-600 bg-white hover:bg-gray-50 border-gray-200'
                            }`}
                    >
                        Chi tiết
                    </button>

                    {isLockedVisual ? (
                        <button disabled className={`flex-1 py-2 text-white text-xs font-medium rounded-lg cursor-not-allowed shadow-sm ${timeLeft ? 'bg-orange-400' : 'bg-gray-400'
                            }`}>
                            {timeLeft ? timeLeft : getButtonText()}
                        </button>
                    ) : (
                        <button
                            onClick={handleTakeTest}
                            disabled={loading}
                            className={`flex-1 py-2 text-white text-xs cursor-pointer font-medium rounded-full transition-all shadow-sm transform active:scale-95 ${isCompleted
                                ? 'bg-[#2864D2] hover:bg-[#255BBD] shadow-blue-200 hover:shadow-blue-300'
                                : 'bg-[#2864D2] hover:bg-[#255BBD] shadow-blue-200 hover:shadow-blue-300'
                                } ${loading ? 'opacity-70 cursor-wait' : ''}`}>
                            {getButtonText()}
                        </button>
                    )}
                </div>
            </div>

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
                                Bạn đã hoàn thành kỳ thi này. <br />
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