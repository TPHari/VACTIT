'use client';

import React, { useState, useEffect } from 'react';
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

  // --- Giới hạn Top 10 ---
  // Lấy Top 3 cho Podium
  const top3 = leaderboardData.slice(0, 3);
  
  // Lấy từ hạng 4 đến hạng 10 cho List (slice từ index 3 đến 10)
  const restOfList = leaderboardData.slice(3, 10); 

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8 fade-in pb-10">
        
        {/* Header Section */}
        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div className="w-full md:flex-1 bg-[#2864d2] text-white p-8 rounded-[24px] shadow-lg relative overflow-hidden group transition-all duration-300 hover:scale-[1.01] hover:shadow-blue-200/50">
              <div className="relative z-10 w-full max-w-2xl">
                <h1 className="text-3xl font-bold mb-3 leading-tight text-[#ffd700]">
                  Bảng Xếp Hạng
                </h1>
                <p className="text-blue-100 text-sm font-medium opacity-90 mb-4">
                  Vinh danh Top 10 chiến thần xuất sắc nhất.
                </p>

                {/* Dropdown */}
                <div className="relative w-full max-w-md">
                    <label className="text-xs text-blue-200 font-bold uppercase mb-1 block">Chọn kỳ thi:</label>
                    <select 
                        className="w-full p-2.5 text-gray-800 bg-white border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 font-medium truncate cursor-pointer"
                        value={selectedExamId}
                        onChange={(e) => setSelectedExamId(e.target.value)}
                        disabled={exams.length === 0}
                    >
                        {exams.length === 0 && <option>Đang tải danh sách...</option>}
                        {exams.map((ex) => (
                            <option key={ex.test_id} value={ex.test_id}>
                                {ex.title}
                            </option>
                        ))}
                    </select>
                </div>
              </div>

              {/* Background Decoration */}
              <div className="absolute top-0 right-0 h-full w-40 pointer-events-none">
                 <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-[#ffd700] rounded-full group-hover:scale-125 transition-transform duration-700 ease-out shadow-lg shadow-black/10"></div>
                 <div className="absolute bottom-[-10px] right-[40px] w-12 h-12 bg-[#ffd700] rounded-full group-hover:-translate-y-4 transition-transform duration-500 shadow-md"></div>
              </div>
           </div>
        </div>

        {/* Content */}
        {loading ? (
           <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-500">Đang tính toán điểm số...</p>
           </div>
        ) : !selectedExamId ? (
            <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
              {exams.length === 0 ? "Chưa có kỳ thi nào." : "Vui lòng chọn một kỳ thi."}
            </div>
        ) : leaderboardData.length === 0 ? (
           <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
             Chưa có thí sinh nào hoàn thành bài thi này.
           </div>
        ) : (
          <>
            {/* Podium (Top 3) */}
            {top3.length > 0 && (
              <div className="card bg-white border border-gray-100 bg-gradient-to-b from-blue-50/30 to-white pt-8 pb-2 px-6">
                  <div className="text-center mb-6">
                      <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wider">Top 3 Xuất Sắc Nhất</h2>
                      <div className="h-3 w-12 mx-auto mt-2 rounded-full"></div>
                  </div>
                  <Podium top3={top3} />
              </div>
            )}

            {/* List (Rank 4-10) */}
            {restOfList.length > 0 && (
              <div className="card p-0 overflow-hidden border border-gray-100">
                 <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <div className="col-span-1 text-center">#</div>
                    <div className="col-span-5 md:col-span-4">Thí sinh</div>
                    <div className="col-span-3 text-center">Điểm số</div>
                    <div className="col-span-3 text-center hidden md:block">Thời gian</div>
                 </div>

                 <div className="divide-y divide-gray-50 p-2">
                    {restOfList.map((user, index) => {
                       const rank = index + 4;
                       return (
                          <div key={user.id} className="leaderboard-row grid grid-cols-12 gap-4 px-4 py-4 items-center rounded-lg hover:bg-gray-50 transition-colors">
                             <div className="col-span-1 text-center font-bold text-gray-400 text-lg">
                                {rank}
                             </div>
                             
                             <div className="col-span-5 md:col-span-4 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-100 border border-[#2864d2] overflow-hidden flex-shrink-0">
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
                                <span className="inline-flex items-center justify-center px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-xs font-bold shadow-sm">
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
          </>
        )}
      </div>
    </DashboardLayout>
  );
}