'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface ExamModalProps {
    exam: any; // ExamData
    onClose: () => void;
}

export default function ExamModal({ exam, onClose }: ExamModalProps) {
    const [isNavigating, setIsNavigating] = useState(false);

    if (!exam) return null;

    const formatDateTime = (value?: string) => {
        if (!value) return '---';
        return new Date(value).toLocaleString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Container */}
            <div className="bg-white rounded-[2rem] w-full max-w-5xl relative z-10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 ease-out">

                <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar">
                    {/* Header */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-6 pr-16">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight max-w-2xl">
                            {exam.title}
                        </h2>
                        <div className="flex items-center gap-6 text-sm text-gray-700">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 4h9l3 3v13a1 1 0 01-1 1H6a1 1 0 01-1-1V5a1 1 0 011-1z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h6M9 12h6M9 15h3" />
                                </svg>
                                {/* Hiển thị tổng số lượt thi */}
                                <span>{exam.totalTrials} lượt thi</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 2h12M7 2v4a5 5 0 005 5 5 5 0 005-5V2M7 22v-4a5 5 0 015-5 5 5 0 015 5v4M6 22h12" />
                                </svg>
                                <span>{exam.duration} phút</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 mb-6 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#2864d2]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Bắt đầu: {formatDateTime(exam.startTime || exam.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#CE3838]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>
                                Hạn chót: {exam.dueTime ? formatDateTime(exam.dueTime) : 'Không giới hạn'}
                            </span>
                        </div>
                    </div>

                    {/* 2 Columns */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        {/* Left */}
                        <div className="space-y-3">
                            <h3 className="text-[#2864D2] font-bold text-lg">Thông tin bài thi</h3>
                            <div className="bg-[#2864D2] text-white p-5 pr-3 rounded-2xl h-56 overflow-y-auto overflow-x-hidden shadow-lg shadow-blue-200 custom-scrollbar-light">
                                <p className="text-sm leading-relaxed opacity-95 whitespace-pre-line">
                                    {"Đây không chỉ là một bài kiểm tra, đây là bước chạy đà quan trọng nhất để bạn chạm tay vào tấm vé đại học mơ ước. Đề thi thử ĐGNL 2026 được biên soạn công phu, bám sát cấu trúc đề thi thật của ĐHQG-HCM.\n\nCấu trúc chuẩn 3 phần: Ngôn ngữ (Tiếng Việt, Tiếng Anh) - Toán học, Tư duy khoa học (Logic, phân tích số liệu & Tư duy khoa học).\n\nCác câu hỏi được thiết kế để phân loại thí sinh, từ nhận biết đến vận dụng cao, đảm bảo phản ánh đúng năng lực hiện tại của bạn.\n\nRèn luyện áp lực bằng việc trải nghiệm không khí phòng thi với quy định thời gian nghiêm ngặt (150 phút/120 câu), giúp bạn làm quen với áp lực tâm lý và quản lý thời gian hiệu quả.\n\nMục tiêu: Giúp bạn định vị chính xác năng lực bản thân so với mặt bằng chung trước kỳ thi chính thức."}
                                </p>
                            </div>
                        </div>

                        {/* Right */}
                        <div className="space-y-3">
                            <h3 className="text-[#2864D2] font-bold text-lg">Hướng dẫn thi</h3>
                            <div className="bg-[#2864D2] text-white p-5 pr-3 rounded-2xl h-56 overflow-y-auto overflow-x-hidden shadow-lg shadow-blue-200 relative custom-scrollbar-light">
                                <p className="text-sm leading-relaxed opacity-95 whitespace-pre-line">
                                    {exam.instructions || "1. Chuẩn bị đường truyền ổn định.\n2. Không thoát khỏi màn hình trong quá trình làm bài.\n3. Nộp bài trước khi hết giờ."}
                                </p>

                                {/* Hình vuông bo góc trang trí */}
                                <div className="absolute right-[-10px] w-24 h-24 pointer-events-none">
                                    <div className="w-full h-full bg-yellow-400 rounded-2xl rotate-12"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 mt-auto">
                        <Link
                            href={`/exam/${exam.id}`}
                            className="block w-full"
                            onClick={() => setIsNavigating(true)}
                        >
                            <button
                                disabled={isNavigating}
                                className={`w-full bg-[#2864D2] text-[#FFD700] py-3.5 rounded-full font-bold text-base hover:bg-[#255BBD] transition-all flex items-center justify-center gap-3 ${isNavigating ? 'opacity-90 cursor-wait' : 'hover:-translate-y-0.5'}`}
                            >
                                {isNavigating ? (
                                    <>
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