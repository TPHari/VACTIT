'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api-client';
import ExamCard, { ExamData } from './ExamCard';
import ExamModal from './ExamModal';
import Loading from '../ui/LoadingSpinner';
import { useCurrentUser } from '@/lib/swr-hooks';

export default function ExamList() {
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('query')?.toLowerCase() || '';

    // Lấy user info
    const { user } = useCurrentUser();
    // Fallback nhiều trường hợp để đảm bảo lấy được ID
    const currentUserId = user?.user_id || user?.id || user?.sub;

    // State lưu trữ các nhóm bài thi
    const [groupedExams, setGroupedExams] = useState<{
        inProgress: ExamData[];
        countdown: ExamData[];
        upcoming: ExamData[];
        locked: ExamData[];
        practice: ExamData[];
    }>({
        inProgress: [],
        countdown: [],
        upcoming: [],
        locked: [],
        practice: []
    });

    const [loading, setLoading] = useState(true);
    const [selectedExam, setSelectedExam] = useState<ExamData | null>(null);
    const [sortOrder, setSortOrder] = useState('newest');

    // --- LOGIC FETCH DATA ---
    useEffect(() => {
        const initData = async () => {
            setLoading(true);

            try {
                // Backend API đã được thiết kế để:
                // 1. Trả về tổng số lượt thi trong `_count.trials`
                // 2. Trả về lượt thi CỦA USER trong `trials` (nhờ tham số userId gửi xuống)
                const response = await api.tests.getAll({
                    query: searchQuery,
                    category: 'all',
                    limit: 100,
                    userId: currentUserId, 
                    sort: sortOrder,
                });

                const rawData = response.data || [];
                const now = new Date().getTime();
                const oneDayMs = 24 * 60 * 60 * 1000;

                const groups = {
                    inProgress: [] as ExamData[],
                    countdown: [] as ExamData[],
                    upcoming: [] as ExamData[],
                    locked: [] as ExamData[],
                    practice: [] as ExamData[],
                };

                rawData.forEach((item: any) => {
                    // [LOGIC 1]: Xác định User đã làm bài này chưa?
                    // Vì backend đã lọc `trials` theo userId, nên nếu mảng này có phần tử => User đã làm.
                    const userPersonalTrials = item.trials || []; 
                    const isTaken = userPersonalTrials.length > 0;

                    // [LOGIC 2]: Lấy tổng số lượt thi của TOÀN BỘ User
                    // Backend trả về trong `_count`
                    const globalTotalTrials = item._count?.trials || 0;

                    const exam: ExamData = {
                        id: item.test_id,
                        title: item.title,
                        author: item.author?.name || 'Unknown',
                        questions: item._count?.questions || 0,
                        
                        // HIỂN THỊ: Tổng số lượt thi của tất cả mọi người
                        totalTrials: globalTotalTrials, 
                        
                        duration: item.duration ? Number(item.duration) : 0,
                        date: item.start_time || item.created_at || new Date().toISOString(),
                        startTime: item.start_time,
                        dueTime: item.due_time,
                        
                        // TRẠNG THÁI: Tính dựa trên việc User hiện tại đã làm hay chưa
                        status: isTaken ? 'completed' : 'not_started',
                        
                        type: item.type,
                        subject: 'Tổng hợp',
                        isVip: item.status === 'Premium',
                    };

                    // --- PHÂN NHÓM (Dựa trên status của User và Thời gian) ---
                    if (exam.type === 'practice') {
                        groups.practice.push(exam);
                    } else {
                        // Nếu là Exam và User ĐÃ LÀM -> Khóa (Locked)
                        if (isTaken) {
                            groups.locked.push(exam);
                        } else {
                            const start = exam.startTime ? new Date(exam.startTime).getTime() : 0;
                            const due = exam.dueTime ? new Date(exam.dueTime).getTime() : Infinity;

                            if (now >= start && now <= due) {
                                groups.inProgress.push(exam);
                            } else if (now < start) {
                                if (start - now <= oneDayMs) {
                                    groups.countdown.push(exam);
                                } else {
                                    groups.upcoming.push(exam);
                                }
                            } else if (now > due) {
                                groups.locked.push(exam);
                            }
                        }
                    }
                });

                setGroupedExams(groups);
            } catch (error) {
                console.error("Failed to fetch exams:", error);
            } finally {
                setLoading(false);
            }
        };

        initData();
    }, [searchQuery, sortOrder, currentUserId]);

    const SectionHeader = ({ title, icon, colorClass, count }: any) => {
        if (count === 0) return null;
        return (
            <div className={`flex items-center gap-2 mb-4 mt-8 pb-2 border-b border-gray-100 ${colorClass}`}>
                {icon && <span className="text-xl">{icon}</span>}
                <h2 className="text-lg font-bold uppercase tracking-wide">{title}</h2>
                <span className="ml-auto text-xs font-semibold bg-gray-100 px-2 py-1 rounded-full text-gray-500">{count} bài</span>
            </div>
        );
    };

    return (
        <>
            {/* Header & Sort Control */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Danh sách kỳ thi</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {searchQuery ? `Kết quả tìm kiếm cho "${searchQuery}"` : 'Cập nhật các bài thi mới nhất'}
                    </p>
                </div>

                <div className="flex items-center gap-3 bg-white p-1.5 pl-4 rounded-xl border border-gray-200 shadow-sm">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Sắp xếp:</span>
                    <select 
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg border-0 py-1.5 pl-3 pr-8 focus:ring-2 focus:ring-blue-500 cursor-pointer outline-none hover:bg-gray-100 transition-colors"
                    >
                        <option value="newest">Mới nhất</option>
                        <option value="oldest">Cũ nhất</option>
                    </select>
                </div>
            </div>

            {loading && <Loading />}

            <div className="flex-1 overflow-y-auto pr-2 pb-6 custom-scrollbar p-2">
                {!loading && (
                    <>
                        {/* IN PROGRESS */}
                        <SectionHeader title="Đang diễn ra" icon="🔥" colorClass="text-red-600 border-red-100" count={groupedExams.inProgress.length} />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {groupedExams.inProgress.map(exam => (
                                <div key={exam.id} className="h-full transform transition-all duration-300 hover:scale-105 hover:z-10">
                                    <ExamCard exam={exam} onSelect={() => setSelectedExam(exam)} categoryContext="in_progress" currentUserId={currentUserId} />
                                </div>
                            ))}
                        </div>

                        {/* COUNTDOWN */}
                        <SectionHeader title="Sắp bắt đầu (24h)" icon="⏳" colorClass="text-orange-600 border-orange-100" count={groupedExams.countdown.length} />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {groupedExams.countdown.map(exam => (
                                <div key={exam.id} className="h-full transform transition-all duration-300 hover:scale-105 hover:z-10">
                                    <ExamCard exam={exam} onSelect={() => setSelectedExam(exam)} categoryContext="countdown" currentUserId={currentUserId} />
                                </div>
                            ))}
                        </div>

                        {/* UPCOMING */}
                        <SectionHeader title="Sự kiện sắp tới" icon="📅" colorClass="text-blue-600 border-blue-100" count={groupedExams.upcoming.length} />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {groupedExams.upcoming.map(exam => (
                                <div key={exam.id} className="h-full transform transition-all duration-300 hover:scale-105 hover:z-10">
                                    <ExamCard exam={exam} onSelect={() => setSelectedExam(exam)} categoryContext="upcoming" currentUserId={currentUserId} />
                                </div>
                            ))}
                        </div>

                        {/* LOCKED */}
                        <SectionHeader title="Đã kết thúc" icon="🔒" colorClass="text-gray-500 border-gray-200" count={groupedExams.locked.length} />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {groupedExams.locked.map(exam => (
                                <div key={exam.id} className="h-full opacity-90 hover:opacity-100 transition-opacity">
                                    <ExamCard exam={exam} onSelect={() => setSelectedExam(exam)} categoryContext="locked" currentUserId={currentUserId} />
                                </div>
                            ))}
                        </div>

                        {/* PRACTICE */}
                        <SectionHeader title="Kho đề luyện tập" icon="📚" colorClass="text-teal-600 border-teal-100" count={groupedExams.practice.length} />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {groupedExams.practice.map(exam => (
                                <div key={exam.id} className="h-full transform transition-all duration-300 hover:scale-105 hover:z-10">
                                    <ExamCard exam={exam} onSelect={() => setSelectedExam(exam)} categoryContext="practice" currentUserId={currentUserId} />
                                </div>
                            ))}
                        </div>

                        {Object.values(groupedExams).every(arr => arr.length === 0) && (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200 mt-8">
                                <p className="font-medium">Chưa có bài thi nào phù hợp.</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {selectedExam && (
                <ExamModal
                    exam={selectedExam}
                    onClose={() => setSelectedExam(null)}
                />
            )}
        </>
    );
}