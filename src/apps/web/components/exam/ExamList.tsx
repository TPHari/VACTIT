'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api-client';
import ExamCard, { ExamData } from './ExamCard';
import ExamModal from './ExamModal';
import Loading from '../ui/LoadingSpinner';

export default function ExamList() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('query')?.toLowerCase() || '';

  // State lưu User ID
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);

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
  
  // [KHÔI PHỤC] State sắp xếp
  const [sortOrder, setSortOrder] = useState('newest'); 

  // 1. Fetch User Info
  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(data => {
        const userObj = data.user || data.data?.user || data;
        if (userObj) {
           const uid = userObj.user_id || userObj.id || userObj.email;
           if (uid) setCurrentUserId(uid);
        }
      })
      .catch(() => {});
  }, []);

  // 2. Fetch Exams & Grouping Logic
  useEffect(() => {
    const fetchAndGroupExams = async () => {
      setLoading(true);
      try {
        const response = await api.tests.getAll({
          query: searchQuery,
          category: 'all', 
          limit: 100, 
          userId: currentUserId,
          sort: sortOrder, // [QUAN TRỌNG] Truyền tham số sort xuống backend
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
          const userTrials = item.trials || [];
          const isTaken = userTrials.length > 0;
          
          const exam: ExamData = {
            id: item.test_id,
            title: item.title,
            author: item.author?.name || 'Unknown',
            questions: item._count?.questions || 0, 
            totalTrials: userTrials.length, 
            duration: item.duration ? Math.floor(item.duration / 60) : 0,
            date: item.start_time || item.created_at || new Date().toISOString(),
            startTime: item.start_time,
            dueTime: item.due_time,
            status: isTaken ? 'completed' : 'not_started',
            type: item.type, 
            subject: 'Tổng hợp',
            isVip: item.status === 'Premium',
          };

          if (exam.type === 'practice') {
              groups.practice.push(exam);
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
        });

        setGroupedExams(groups);
      } catch (error) {
        console.error("Failed to fetch exams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndGroupExams();
  // Thêm sortOrder vào dependency để khi đổi sort thì fetch lại
  }, [searchQuery, currentUserId, sortOrder]); 

  // Component hiển thị Section Header
  const SectionHeader = ({ title, icon, colorClass, count }: any) => {
      if (count === 0) return null;
      return (
        <div className={`flex items-center gap-2 mb-4 mt-8 pb-2 border-b border-gray-100 ${colorClass}`}>
            <span className="text-xl">{icon}</span>
            <h2 className="text-lg font-bold uppercase tracking-wide">{title}</h2>
            <span className="ml-auto text-xs font-semibold bg-gray-100 px-2 py-1 rounded-full text-gray-500">{count} bài</span>
        </div>
      );
  };

  return (
    <>
      {/* --- PHẦN 0: HEADER & SORT CONTROL (Đã khôi phục) --- */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
         <div>
            <h1 className="text-2xl font-bold text-gray-800">Danh sách kỳ thi</h1>
            <p className="text-sm text-gray-500 mt-1">
               {searchQuery ? `Kết quả tìm kiếm cho "${searchQuery}"` : 'Cập nhật các bài thi mới nhất'}
            </p>
         </div>

         {/* Sort Dropdown */}
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

      {/* --- PHẦN 1: CHÚ THÍCH UI (Legend) --- */}
      <div className="mb-8 bg-white p-5 rounded-2xl border border-blue-100 shadow-sm relative overflow-hidden">
         {/* Background Decoration */}
         <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full mix-blend-multiply filter blur-2xl opacity-70 -translate-y-1/2 translate-x-1/2"></div>
         
         <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Hướng dẫn trạng thái
         </h3>
         
         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <div className="text-xs">
                    <p className="font-bold text-gray-800">Đang diễn ra</p>
                    <p className="text-gray-500">Vào thi ngay</p>
                </div>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-sm">⏳</span>
                <div className="text-xs">
                    <p className="font-bold text-gray-800">Đếm ngược</p>
                    <p className="text-gray-500">Dưới 24h nữa</p>
                </div>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <div className="text-xs">
                    <p className="font-bold text-gray-800">Sắp tới</p>
                    <p className="text-gray-500">Chưa mở đề</p>
                </div>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                <div className="text-xs">
                    <p className="font-bold text-gray-800">Đã kết thúc</p>
                    <p className="text-gray-500">Chỉ xem lại</p>
                </div>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                <div className="text-xs">
                    <p className="font-bold text-gray-800">Luyện tập</p>
                    <p className="text-gray-500">Thi tự do</p>
                </div>
            </div>
         </div>
      </div>

      {loading && <Loading />}

      {/* --- PHẦN 2: DANH SÁCH BÀI THI THEO NHÓM --- */}
      <div className="flex-1 overflow-y-auto pr-2 pb-6 custom-scrollbar p-2">
        {!loading && (
            <>
                {/* 1. ĐANG DIỄN RA */}
                <SectionHeader title="Đang diễn ra" icon="🔥" colorClass="text-red-600 border-red-100" count={groupedExams.inProgress.length} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {groupedExams.inProgress.map(exam => (
                        <div key={exam.id} className="h-full transform transition-all duration-300 hover:scale-105 hover:z-10">
                            <ExamCard exam={exam} onSelect={() => setSelectedExam(exam)} categoryContext="in_progress" />
                        </div>
                    ))}
                </div>

                {/* 2. SẮP BẮT ĐẦU */}
                <SectionHeader title="Sắp bắt đầu (24h)" icon="⏳" colorClass="text-orange-600 border-orange-100" count={groupedExams.countdown.length} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {groupedExams.countdown.map(exam => (
                        <div key={exam.id} className="h-full transform transition-all duration-300 hover:scale-105 hover:z-10">
                            <ExamCard exam={exam} onSelect={() => setSelectedExam(exam)} categoryContext="countdown" />
                        </div>
                    ))}
                </div>

                {/* 3. SẮP TỚI */}
                <SectionHeader title="Sự kiện sắp tới" icon="📅" colorClass="text-blue-600 border-blue-100" count={groupedExams.upcoming.length} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {groupedExams.upcoming.map(exam => (
                        <div key={exam.id} className="h-full transform transition-all duration-300 hover:scale-105 hover:z-10">
                            <ExamCard exam={exam} onSelect={() => setSelectedExam(exam)} categoryContext="upcoming" />
                        </div>
                    ))}
                </div>

                 {/* 4. ĐÃ KẾT THÚC */}
                 <SectionHeader title="Đã kết thúc" icon="🔒" colorClass="text-gray-500 border-gray-200" count={groupedExams.locked.length} />
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {groupedExams.locked.map(exam => (
                        <div key={exam.id} className="h-full opacity-90 hover:opacity-100 transition-opacity">
                            <ExamCard exam={exam} onSelect={() => setSelectedExam(exam)} categoryContext="locked" />
                        </div>
                    ))}
                </div>

                {/* 5. LUYỆN TẬP */}
                <SectionHeader title="Kho đề luyện tập" icon="📚" colorClass="text-teal-600 border-teal-100" count={groupedExams.practice.length} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {groupedExams.practice.map(exam => (
                        <div key={exam.id} className="h-full transform transition-all duration-300 hover:scale-105 hover:z-10">
                            <ExamCard exam={exam} onSelect={() => setSelectedExam(exam)} categoryContext="practice" />
                        </div>
                    ))}
                </div>

                {/* Empty State */}
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