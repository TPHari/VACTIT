'use client';

import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Podium from '@/components/leaderboard/Podium';
import { api } from '@/lib/api-client';

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  score: number;
  examCount: number;
  time: string;
  trend: 'up' | 'down' | 'same';
}

interface ExamOption {
  test_id: string;
  title: string;
}

export default function LeaderboardPage() {
  const [loading, setLoading] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  
  const [exams, setExams] = useState<ExamOption[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>('');

  // State cho Custom Dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 1. Load Exam List
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await api.leaderboard.getExams();
        const examList = res.data || [];
        setExams(examList);
        if (examList.length > 0) {
          setSelectedExamId(examList[0].test_id);
        }
      } catch (e) {
        console.error("Failed to fetch exams", e);
      }
    };
    fetchExams();
  }, []);

  // 2. Load Leaderboard Data
  useEffect(() => {
    if (!selectedExamId) return;

    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const response = await api.leaderboard.get(selectedExamId);
        const rawData = response.data || [];

        const formattedData: LeaderboardUser[] = rawData.map((user: any) => ({
          id: user.id,
          name: user.name,
          avatar: user.avatar || '/default-avatar.png',
          score: Number(user.score) || 0,
          examCount: user.examCount || 0,
          time: user.time || '0p',
          trend: user.trend || 'same',
        }));

        setLeaderboardData(formattedData);
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
        setLeaderboardData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [selectedExamId]);

  // Logic đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const top3 = leaderboardData.slice(0, 3);
  const restOfList = leaderboardData.slice(3, 10); 

  // Lấy title của exam đang chọn để hiển thị
  const selectedExamTitle = exams.find(e => e.test_id === selectedExamId)?.title || "Chọn kỳ thi";

  return (
    <DashboardLayout>
      <div className="max-w-5xl pt-[1rem] mx-auto space-y-[2rem] fade-in pb-[2.5rem]">
        
        {/* Header Section */}
        <div className="relative w-full bg-[#2864d2] text-white p-[2rem] rounded-[1.5rem] shadow-lg overflow-hidden group">
            <div className="relative z-10 w-full">
              <h1 className="text-3xl font-bold mb-[0.5rem] leading-tight text-[#ffd700]">
                Bảng Xếp Hạng
              </h1>
              <p className="text-blue-100 text-sm font-medium opacity-90 max-w-xl">
                Vinh danh Top 10 chiến thần xuất sắc nhất trong các bài thi.
              </p>
            </div>

            {/* Background Decoration */}
            <div className="absolute top-0 right-0 h-full w-[10rem] pointer-events-none">
                <div className="absolute top-[-1.25rem] right-[-1.25rem] w-[6rem] h-[6rem] bg-[#ffd700] rounded-full group-hover:scale-125 transition-transform duration-700 ease-out shadow-lg shadow-black/10"></div>
                <div className="absolute bottom-[-0.625rem] right-[2.5rem] w-[3rem] h-[3rem] bg-[#ffd700] rounded-full group-hover:-translate-y-4 transition-transform duration-500 shadow-md"></div>
            </div>
        </div>

        {/* Dropdown NGOÀI container - Góc phải */}
        <div className="relative z-[999] flex justify-end mb-[0.75rem]" ref={dropdownRef}>
          <div className="relative w-[16rem] sm:w-[21.5rem]">
                    {/* Nút bấm mở Dropdown */}
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        disabled={exams.length === 0}
                      type="button"
                        className={`w-full pl-[1rem] pr-[2.5rem] py-[0.5rem] text-sm bg-white border rounded-full shadow-sm text-left flex items-center justify-between transition-all outline-none
                            ${isDropdownOpen ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-200 hover:border-blue-300'}
                            ${exams.length === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 cursor-pointer font-medium'}
                        `}
                    >
                        <span className="truncate">{exams.length === 0 ? 'Đang tải...' : selectedExamTitle}</span>
                        
                        {/* Custom Arrow Icon */}
                        <div className="absolute inset-y-0 right-0 flex items-center pr-[0.75rem] pointer-events-none text-gray-500">
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" 
                                className={`w-[1rem] h-[1rem] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </div>
                    </button>

                    {/* Danh sách xổ xuống (Custom List) */}
                    {isDropdownOpen && exams.length > 0 && (
                      <div className="absolute right-0 mt-[0.5rem] w-full bg-white border border-gray-100 rounded-2xl shadow-xl max-h-[15rem] overflow-y-auto z-[1000] animate-in fade-in zoom-in-95 duration-100 custom-scrollbar">
                            <div className="py-[0.25rem]">
                                {exams.map((ex) => (
                                  <div 
                                    key={ex.test_id}
                                    onMouseDown={(e) => {
                                      e.preventDefault(); // tránh blur/close trước khi chọn
                                      setSelectedExamId(ex.test_id);
                                      setIsDropdownOpen(false);
                                    }}
                                    className={`px-[1rem] py-[0.5rem] text-sm cursor-pointer transition-colors truncate
                                      ${selectedExamId === ex.test_id 
                                        ? 'bg-blue-50 text-blue-700 font-bold' 
                                        : 'text-gray-700 hover:bg-gray-50'
                                      }
                                    `}
                                  >
                                    {ex.title}
                                  </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
        </div>
        {/* ------------------------------------------------ */}

        {/* Hall of Fame Banner - NGOÀI container để overflow, tăng 30% */}
        {!loading && leaderboardData.length > 0 && (
          <div className="relative flex justify-center mb-[-2rem] z-50">
            <div className="relative">
              <img 
                src="/assets/icons/hall_of_fame_background.svg" 
                alt="Hall of Fame" 
                className="h-[3.9rem] w-auto"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[#2864D2] font-bold text-[2.3rem]">
                  Hall of Fame
                </span>
              </div>
            </div>
          </div>
        )}

        {/* MAIN CARD CONTAINER - Viền xanh đậm */}
        <div className="relative border-[3px] border-[#2864D2] rounded-[1.5rem] shadow-sm pt-[5rem] pb-[0] relative h-[28rem] overflow-hidden">

            {/* Sun decoration - top 20%, tăng 50%, nằm sau stage (z-0) */}
            {!loading && leaderboardData.length > 0 && (
              <div className="absolute -left-[6rem] top-[20%] w-[18rem] h-[18rem] z-0 pointer-events-none">
                <img 
                  src="/assets/icons/sun.svg" 
                  alt="Sun" 
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {loading ? (
               <div className="flex flex-col items-center justify-center h-[16rem] mt-[3rem]">
                 <div className="animate-spin rounded-full h-[2.5rem] w-[2.5rem] border-b-2 border-blue-600 mb-[1rem]"></div>
                 <p className="text-gray-500">Đang tính toán điểm số...</p>
               </div>
            ) : !selectedExamId ? (
               <div className="flex flex-col items-center justify-center h-[16rem] mt-[3rem] text-gray-400">
                  <p>Vui lòng chọn một kỳ thi.</p>
               </div>
            ) : leaderboardData.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-[16rem] mt-[3rem] text-gray-400">
                  <p className="text-lg font-medium mb-[0.5rem]">Chưa có kết quả xếp hạng</p>
                  <p className="text-sm">Chưa có thí sinh nào hoàn thành bài thi này.</p>
               </div>
            ) : (
               <>
                  {/* Podium - Cards và Stage */}
                  <Podium top3={top3} />
               </>
            )}
        </div>

        {/* List (Rank 4-10) */}
        {!loading && restOfList.length > 0 && (
          <div className="bg-white rounded-[1.25rem] overflow-hidden border border-gray-100 shadow-sm">
             <div className="grid grid-cols-12 gap-[1rem] px-[1.5rem] py-[1rem] bg-gray-50/80 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-5 md:col-span-4">Thí sinh</div>
                <div className="col-span-3 text-center">Điểm số</div>
                <div className="col-span-3 text-center hidden md:block">Thời gian</div>
             </div>

             <div className="divide-y divide-gray-50 p-[0.5rem]">
                {restOfList.map((user, index) => {
                   const rank = index + 4;
                   return (
                      <div key={user.id} className="grid grid-cols-12 gap-[1rem] px-[1rem] py-[1rem] items-center rounded-xl hover:bg-gray-50 transition-colors duration-200">
                         <div className="col-span-1 text-center font-bold text-gray-400 text-lg">
                            {rank}
                         </div>
                         
                         <div className="col-span-5 md:col-span-4 flex items-center gap-[1rem]">
                            <div className="w-[2.5rem] h-[2.5rem] rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                               <img 
                                  src={user.avatar} 
                                  alt={user.name} 
                                  className="w-full h-full object-cover" 
                                  onError={(e) => {
                                     (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${user.name}&background=random`;
                                  }}
                               />
                            </div>
                            <div className="min-w-0">
                               <p className="font-bold text-gray-800 text-sm truncate">{user.name}</p>
                            </div>
                         </div>

                         <div className="col-span-3 text-center">
                            <span className="inline-flex items-center justify-center px-[0.75rem] py-[0.25rem] bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-xs font-bold">
                               {user.score}
                            </span>
                         </div>

                         <div className="col-span-3 text-center hidden md:block text-sm text-gray-500 font-medium">
                            {user.time}
                         </div>
                      </div>
                   );
                })}
             </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}