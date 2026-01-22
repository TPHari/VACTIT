'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api-client';
import ExamCard, { ExamData } from './ExamCard';
import ExamModal from './ExamModal';
import Loading from '../ui/LoadingSpinner';
import { useCurrentUser } from '@/lib/swr-hooks';

type FilterMode = 'all' | 'inProgress' | 'practice';
type SortKey = 'date' | 'title' | 'plays';
type SortDir = 'asc' | 'desc';

interface ExamListProps {
    filterMode?: FilterMode;
    sortKey?: SortKey;
    sortDir?: SortDir;
}

export default function ExamList({ filterMode = 'all', sortKey = 'date', sortDir = 'desc' }: ExamListProps) {
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('query')?.toLowerCase() || '';

    // ✅ Use shared SWR hook instead of direct fetch
    const { userId: currentUserId } = useCurrentUser();

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

    // --- LOGIC FETCH DATA ---
    useEffect(() => {
        const initData = async () => {
            setLoading(true);

            // Fetch tests with userId from SWR hook
            try {
                const response = await api.tests.getAll({
                    query: searchQuery,
                    category: 'all',
                    limit: 100,
                    userId: currentUserId,
                    sort: sortKey === 'date' ? (sortDir === 'desc' ? 'newest' : 'oldest') : undefined,
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
                    const allTrials = item.trials || [];
                    const userTrials = currentUserId
                        ? allTrials.filter((t: any) => t.user_id === currentUserId)
                        : allTrials;
                    const isTaken = userTrials.length > 0;

                    const exam: ExamData = {
                        id: item.test_id,
                        title: item.title,
                        author: item.author?.name || 'Unknown',
                        questions: item._count?.questions || 0,
                        totalTrials: userTrials.length,
                        duration: item.duration ? Number(item.duration) : 0,
                        date: item.start_time || item.created_at || new Date().toISOString(),
                        startTime: item.start_time,
                        dueTime: item.due_time,
                        status: isTaken ? 'completed' : 'not_started',
                        type: item.type,
                        subject: 'Tổng hợp',
                        isVip: item.status === 'Premium',
                    };

                    // --- [LOGIC PHÂN NHÓM] ---
                    if (exam.type === 'practice') {
                        // 1. Nếu là Practice: Luôn vào nhóm Practice (được thi lại thoải mái)
                        groups.practice.push(exam);
                    } else {
                        // 2. Nếu là Exam (Bài thi thật)
                        if (isTaken) {
                            // Nếu đã làm rồi -> Đẩy thẳng vào Locked (Coi như đã kết thúc với user này)
                            // Điều này ngăn việc bài thi hiện ở "Đang diễn ra" gây hiểu nhầm là được thi tiếp
                            groups.locked.push(exam);
                        } else {
                            // Nếu chưa làm -> Xét thời gian như bình thường
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
                // BƯỚC 3: Chỉ tắt loading khi CẢ 2 bước trên đã xong
                setLoading(false);
            }
        };

        initData();

        // Bỏ currentUserId khỏi dependency để tránh loop, chỉ chạy lại khi search/sort đổi
    }, [searchQuery, sortKey, sortDir]);

    const sortList = (list: ExamData[]) => {
        const sorted = [...list];
        sorted.sort((a, b) => {
            if (sortKey === 'title') {
                return sortDir === 'asc'
                    ? (a.title || '').localeCompare(b.title || '')
                    : (b.title || '').localeCompare(a.title || '');
            }
            if (sortKey === 'plays') {
                const aCount = a.totalTrials || 0;
                const bCount = b.totalTrials || 0;
                return sortDir === 'asc' ? aCount - bCount : bCount - aCount;
            }
            // default: date
            const aDate = a.date ? new Date(a.date).getTime() : 0;
            const bDate = b.date ? new Date(b.date).getTime() : 0;
            return sortDir === 'asc' ? aDate - bDate : bDate - aDate;
        });
        return sorted;
    };

    const sortedGroups = useMemo(() => {
        return {
            inProgress: sortList(groupedExams.inProgress),
            countdown: sortList(groupedExams.countdown),
            upcoming: sortList(groupedExams.upcoming),
            locked: sortList(groupedExams.locked),
            practice: sortList(groupedExams.practice),
        };
    }, [groupedExams, sortKey, sortDir]);

    const visibleGroups = useMemo(() => {
        if (filterMode === 'inProgress') {
            return { ...sortedGroups, countdown: [], upcoming: [], locked: [], practice: [] };
        }
        if (filterMode === 'practice') {
            return { ...sortedGroups, inProgress: [], countdown: [], upcoming: [], locked: [] };
        }
        return sortedGroups;
    }, [sortedGroups, filterMode]);

    // Component hiển thị Section Header
    const SectionHeader = ({ title, icon, colorClass, count }: any) => {
        if (count === 0) return null;
        return (
            <div className={`flex items-center gap-2 mb-4 mt-8 pb-2 border-b border-gray-100 ${colorClass}`}>
                {icon ? <span className="text-xl">{icon}</span> : null}
                <h2 className="text-lg font-bold uppercase tracking-wide">{title}</h2>
                <span className="ml-auto text-xs font-semibold bg-gray-100 px-2 py-1 rounded-full text-gray-500">{count} bài</span>
            </div>
        );
    };

    return (
        <>

            {/* --- PHẦN 2: DANH SÁCH BÀI THI THEO NHÓM --- */}
            <div className="flex-1 overflow-y-auto pr-2 pb-6 custom-scrollbar p-2">
                {!loading && (
                    <>
                        {/* 1. ĐANG DIỄN RA */}
                        <SectionHeader title="Đang diễn ra" icon="" colorClass="text-red-600 border-red-100" count={visibleGroups.inProgress.length} />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {visibleGroups.inProgress.map(exam => (
                                <div key={exam.id} className="h-full transform transition-all duration-300 hover:scale-105 hover:z-10">
                                    <ExamCard
                                        exam={exam}
                                        onSelect={() => setSelectedExam(exam)}
                                        categoryContext="in_progress"
                                        currentUserId={currentUserId}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* 2. LUYỆN TẬP */}
                        <SectionHeader title="Kho đề luyện tập" icon="" colorClass="text-teal-600 border-teal-100" count={visibleGroups.practice.length} />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {visibleGroups.practice.map(exam => (
                                <div key={exam.id} className="h-full transform transition-all duration-300 hover:scale-105 hover:z-10">
                                    <ExamCard
                                        exam={exam}
                                        onSelect={() => setSelectedExam(exam)}
                                        categoryContext="practice"
                                        currentUserId={currentUserId}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* 3. ĐÃ KẾT THÚC */}
                        <SectionHeader title="Đã kết thúc" icon="" colorClass="text-gray-500 border-gray-200" count={visibleGroups.locked.length} />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {visibleGroups.locked.map(exam => (
                                <div key={exam.id} className="h-full opacity-90 hover:opacity-100 transition-opacity">
                                    <ExamCard
                                        exam={exam}
                                        onSelect={() => setSelectedExam(exam)}
                                        categoryContext="locked"
                                        currentUserId={currentUserId}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* 4. SẮP BẮT ĐẦU*/}
                        <SectionHeader title="Sắp bắt đầu (24h)" icon="" colorClass="text-orange-600 border-orange-100" count={visibleGroups.countdown.length} />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {visibleGroups.countdown.map(exam => (
                                <div key={exam.id} className="h-full transform transition-all duration-300 hover:scale-105 hover:z-10">
                                    <ExamCard
                                        exam={exam}
                                        onSelect={() => setSelectedExam(exam)}
                                        categoryContext="countdown"
                                        currentUserId={currentUserId}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* 5. SẮP TỚI */}
                        <SectionHeader title="Sự kiện sắp tới" icon=""  colorClass="text-blue-600 border-blue-100" count={visibleGroups.upcoming.length} />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {visibleGroups.upcoming.map(exam => (
                                <div key={exam.id} className="h-full transform transition-all duration-300 hover:scale-105 hover:z-10">
                                    <ExamCard
                                        exam={exam}
                                        onSelect={() => setSelectedExam(exam)}
                                        categoryContext="upcoming"
                                        currentUserId={currentUserId}
                                    />
                                </div>
                            ))}
                        </div>

                        {Object.values(visibleGroups).every(arr => arr.length === 0) && (
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
