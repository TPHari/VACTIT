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

export default function LeaderboardPage() {
  const [loading, setLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const response = await api.leaderboard.get();
        const rawData = response.data || [];

        // [SỬA 2]: Map và ép kiểu dữ liệu từ API
        const formattedData: LeaderboardUser[] = rawData.map((user: any) => ({
          id: user.id,
          name: user.name,
          avatar: user.avatar || '/default-avatar.png',
          
          // Chuyển string "85.50" từ API thành number 85.5
          score: Number(user.score) || 0, 
          
          examCount: user.examCount || 0,
          time: user.time || '0p',
          trend: user.trend || 'same',
        }));

        setLeaderboardData(formattedData);
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // Tách Top 3 và phần còn lại
  const top3 = leaderboardData.slice(0, 3);
  const restOfList = leaderboardData.slice(3);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8 fade-in pb-10">
        
        {/* 1. Header Section */}
        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div className="w-full md:flex-1 bg-[#2563EB] text-white p-8 rounded-[24px] shadow-lg relative overflow-hidden group transition-all duration-300 hover:scale-[1.01] hover:shadow-blue-200/50">
              <div className="relative z-10 max-w-lg">
                <h1 className="text-3xl font-bold mb-3 leading-tight">
                  Bảng Xếp Hạng 🏆
                </h1>
                <p className="text-blue-100 text-sm font-medium opacity-90">
                  Vinh danh những chiến thần luyện đề xuất sắc nhất. Hãy nỗ lực để tên bạn được xướng lên tại đây!
                </p>
              </div>
              <div className="absolute top-0 right-0 h-full w-40 pointer-events-none">
                 <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-yellow-500 rounded-full opacity-90 group-hover:scale-125 transition-transform duration-700 ease-out shadow-lg shadow-black/10"></div>
                 <div className="absolute bottom-[-10px] right-[40px] w-12 h-12 bg-yellow-500 rounded-full opacity-80 group-hover:-translate-y-4 transition-transform duration-500 shadow-md"></div>
                 <svg className="absolute top-[40%] right-[80px] w-8 h-8 text-yellow-500 opacity-80 animate-bounce delay-700 group-hover:rotate-45 transition-transform" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M50 0 L100 100 L0 100 Z" />
                 </svg>
              </div>
           </div>
        </div>

        {/* LOADING STATE */}
        {loading ? (
           <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-500">Đang cập nhật bảng xếp hạng...</p>
           </div>
        ) : leaderboardData.length === 0 ? (
           <div className="text-center py-10 text-gray-500">
             Chưa có dữ liệu xếp hạng. Hãy là người đầu tiên làm bài thi!
           </div>
        ) : (
          <>
            {/* 2. Podium Section */}
            {top3.length > 0 && (
              <div className="card bg-white border border-gray-100 bg-gradient-to-b from-blue-50/30 to-white pt-8 pb-2 px-6">
                  <div className="text-center mb-6">
                     <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wider">Top 3 Xuất Sắc Nhất</h2>
                     <div className="h-1 w-12 bg-yellow-400 mx-auto mt-2 rounded-full"></div>
                  </div>
                  {/* Bây giờ top3 đã đúng kiểu dữ liệu score: number */}
                  <Podium top3={top3} />
              </div>
            )}

            {/* 3. List Section */}
            {restOfList.length > 0 && (
              <div className="card p-0 overflow-hidden border border-gray-100">
                 <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <div className="col-span-1 text-center">#</div>
                    <div className="col-span-5 md:col-span-4">Thí sinh</div>
                    <div className="col-span-3 text-center">Điểm số</div>
                    <div className="col-span-3 text-center hidden md:block">Thời gian TB</div>
                    <div className="col-span-3 md:col-span-1 text-center">Xu hướng</div>
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
                                <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                                   <img 
                                      src={user.avatar} 
                                      alt={user.name} 
                                      className="w-full h-full object-cover" 
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + user.name;
                                      }}
                                   />
                                </div>
                                <div className="min-w-0">
                                   <p className="font-bold text-gray-800 text-sm truncate">{user.name}</p>
                                   <p className="text-xs text-gray-500 truncate">{user.examCount} đề đã làm</p>
                                </div>
                             </div>

                             <div className="col-span-3 text-center">
                                <span className="inline-flex items-center justify-center px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-xs font-bold shadow-sm">
                                   {/* Hiển thị điểm số (number) */}
                                   {user.score}
                                </span>
                             </div>

                             <div className="col-span-3 text-center hidden md:block text-sm text-gray-500 font-medium">
                                {user.time}
                             </div>

                             <div className="col-span-3 md:col-span-1 text-center flex justify-center items-center">
                                {user.trend === 'up' && <span className="text-green-500 font-bold">▲</span>}
                                {user.trend === 'down' && <span className="text-red-400 font-bold">▼</span>}
                                {user.trend === 'same' && <span className="text-gray-300 font-bold">-</span>}
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