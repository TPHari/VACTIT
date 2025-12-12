'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { MOCK_LEADERBOARD } from '../../mockData/mockLeaderboard';
import Podium from '@/components/leaderboard/Podium';
import FilterDropdown from '@/components/exam/FilterDropdown'; // Re-use component cũ

export default function LeaderboardPage() {
  const [timeFilter, setTimeFilter] = useState('week');
  const [subjectFilter, setSubjectFilter] = useState('');

  // Tách Top 3 và phần còn lại
  const top3 = MOCK_LEADERBOARD.slice(0, 3);
  const restOfList = MOCK_LEADERBOARD.slice(3);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* 1. Header & Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
              <h1 className="text-2xl font-bold text-gray-900">Bảng Xếp Hạng</h1>
              <p className="text-gray-500 text-sm">Vinh danh những chiến thần luyện đề tuần này 🏆</p>
           </div>
           
           <div className="flex gap-3">
              <FilterDropdown 
                label="Thời gian"
                value={timeFilter}
                onChange={setTimeFilter}
                options={[
                    { value: 'week', label: 'Tuần này' },
                    { value: 'month', label: 'Tháng này' },
                    { value: 'all', label: 'Toàn thời gian' },
                ]}
              />
              <FilterDropdown 
                label="Môn học"
                value={subjectFilter}
                onChange={setSubjectFilter}
                options={[
                    { value: 'math', label: 'Toán' },
                    { value: 'english', label: 'Tiếng Anh' },
                ]}
              />
           </div>
        </div>

        {/* 2. Podium Section (Nổi bật) */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 bg-gradient-to-b from-blue-50/50 to-white">
            <Podium top3={top3} />
        </div>

        {/* 3. List Section (Danh sách còn lại) */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
           {/* Table Header */}
           <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50/50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-5 md:col-span-4">Thí sinh</div>
              <div className="col-span-3 text-center">Điểm số</div>
              <div className="col-span-3 text-center hidden md:block">Thời gian TB</div>
              <div className="col-span-3 md:col-span-1 text-center">Xu hướng</div>
           </div>

           {/* Table Body */}
           <div className="divide-y divide-gray-50">
              {restOfList.map((user, index) => {
                 const rank = index + 4;
                 return (
                    <div key={user.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-blue-50/30 transition-colors group">
                       {/* Rank */}
                       <div className="col-span-1 text-center font-bold text-gray-400">
                          {rank}
                       </div>
                       
                       {/* User Info */}
                       <div className="col-span-5 md:col-span-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                             <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                             <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
                             <p className="text-xs text-gray-500">{user.examCount} đề đã làm</p>
                          </div>
                       </div>

                       {/* Score */}
                       <div className="col-span-3 text-center">
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                             {user.score}
                          </span>
                       </div>

                       {/* Time */}
                       <div className="col-span-3 text-center hidden md:block text-sm text-gray-600">
                          {user.time}
                       </div>

                       {/* Trend */}
                       <div className="col-span-3 md:col-span-1 text-center flex justify-center">
                          {user.trend === 'up' && <span className="text-green-500">▲</span>}
                          {user.trend === 'down' && <span className="text-red-400">▼</span>}
                          {user.trend === 'same' && <span className="text-gray-300">-</span>}
                       </div>
                    </div>
                 );
              })}
           </div>
        </div>

      </div>
    </DashboardLayout>
  );
}