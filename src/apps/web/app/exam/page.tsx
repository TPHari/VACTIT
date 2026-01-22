'use client';

import React, { useState } from 'react';
import ExamList from '@/components/exam/ExamList';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useLeaderboard } from '@/lib/swr-hooks';

type LeaderboardEntry = {
  id?: string;
  name: string;
  avatar?: string;
  score?: number;
  time?: string;
  date?: string;
};

export default function ExamTab() {
  const [filterMode, setFilterMode] = useState<'all' | 'inProgress' | 'practice'>('all');
  const [sortOption, setSortOption] = useState<{ key: 'date' | 'title' | 'plays'; direction: 'asc' | 'desc' }>({ key: 'date', direction: 'desc' });

  const { leaderboard, testInfo, isLoading } = useLeaderboard();
  const top5 = ((leaderboard as LeaderboardEntry[]) || []).slice(0, 5);
  const examTitle =
    (testInfo as any)?.title ||
    (testInfo as any)?.name ||
    (testInfo as any)?.test_name ||
    'Bài thi thử gần nhất';
  const examDate =
    (testInfo as any)?.date ||
    (testInfo as any)?.start_time ||
    (testInfo as any)?.created_at;

  const sortButtons = [
    { key: 'date' as const, label: 'Ngày cập nhật' },
    { key: 'title' as const, label: 'Tên đề' },
    { key: 'plays' as const, label: 'Lượt thi' },
  ];

  const handleSortClick = (key: 'date' | 'title' | 'plays') => {
    if (sortOption.key === key) {
      setSortOption(prev => ({ ...prev, direction: prev.direction === 'desc' ? 'asc' : 'desc' }));
    } else {
      setSortOption({ key, direction: 'desc' });
    }
  };

  return (
    <DashboardLayout>
      <div className="exam-container fade-in relative min-h-full">
        <div className="flex flex-col lg:flex-row gap-6 pt-6">
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            {/* 1. Header Banner */}
            <div className="card card-no-hover w-full relative overflow-visible flex-shrink-0 group bg-white border border-blue-100">
              <div className="relative z-10 flex items-center gap-6 px-6 py-1 pr-32">
                <div className="min-w-[120px]">
                  <h1 className="text-3xl font-bold text-[#2864D2] leading-tight">
                    Thi thử <br /> V-ACT
                  </h1>
                </div>
                <p className="text-slate-500 text-sm max-w-3/5">
                  Bản lĩnh không tự nhiên sinh ra, nó phải được tôi luyện.
                  Hãy để tiếng đồng hồ đếm ngược rèn cho tim bạn nhịp đập thép, tập làm quen với cảm giác căng thẳng ngay tại nhà. 
                  Chỉ khi bạn đổ mồ hôi trên 'sân tập' với cường độ của một trận đấu thật, 
                  thì phòng thi chính thức mới không còn là nỗi ám ảnh, mà trở thành nơi để bạn tỏa sáng.
                </p>
              </div>

              {/* Figures*/}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute right-6 top-[-32px] bottom-0 w-73 overflow-hidden flex items-start justify-center">
                  <img
                    src="/assets/icons/exam_icon.svg"
                    className="w-63 h-auto"
                    alt="Exam icon"
                  />
                </div>
              </div>
            </div>

            {/* Tái sử dụng Grid và Logic */}
            <div className="flex-1 min-h-0">
              {/* Filter & Sort Bar */}
              <div className="bg-blue-50/60 border border-blue-100 rounded-2xl px-4 py-3 mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-center gap-2">
                  {[
                    { key: 'all', label: 'Tất cả' },
                    { key: 'inProgress', label: 'Đang thi' },
                    { key: 'practice', label: 'Đề luyện tập' },
                  ].map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => setFilterMode(opt.key as any)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors border ${
                        filterMode === opt.key
                          ? 'bg-white text-[#2864D2] border-blue-200 shadow-sm'
                          : 'bg-transparent text-slate-600 border-transparent hover:bg-white hover:border-blue-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {sortButtons.map(btn => {
                    const active = sortOption.key === btn.key;
                    const isDesc = sortOption.direction === 'desc';
                    return (
                      <button
                        key={btn.key}
                        onClick={() => handleSortClick(btn.key)}
                        className={`px-4 py-2 rounded-xl text-sm border flex items-center gap-2 transition-colors ${
                          active ? 'border-blue-300 text-[#2864D2] bg-white shadow-sm' : 'border-slate-200 text-slate-700 bg-white'
                        }`}
                      >
                        <span>{btn.label}</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className={`w-4 h-4 transition-transform ${active && !isDesc ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    );
                  })}
                </div>
              </div>

              <ExamList filterMode={filterMode} sortKey={sortOption.key} sortDir={sortOption.direction} />
            </div>
          </div>

          <aside className="w-full lg:w-[200px] xl:w-[260px] flex-shrink-0 self-start lg:sticky lg:top-6 space-y-4">
            <div className="bg-white border border-blue-100 rounded-2xl shadow-sm p-4">
              <div className="flex items-start justify-between mb-3 gap-2">
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500 font-semibold">Top 5</p>
                  <h3 className="text-sm font-bold text-[#2864D2] truncate" title={examTitle}>{examTitle}</h3>
                </div>
                {examDate ? (
                  <span className="text-[11px] text-slate-400 whitespace-nowrap">{formatDate(examDate)}</span>
                ) : null}
              </div>

              {isLoading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, idx) => (
                    <div key={idx} className="h-10 rounded-xl bg-slate-100 animate-pulse" />
                  ))}
                </div>
              ) : top5.length === 0 ? (
                <p className="text-sm text-slate-500">Chưa có dữ liệu xếp hạng.</p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {top5.map((entry, index) => (
                    <li key={entry.id || index} className="flex items-center gap-3 py-3">
                      <div className="w-7 text-center flex-shrink-0">
                        {index < 5 ? (
                          <img src={`/assets/icons/top${index + 1}.svg`} alt={`Hạng ${index + 1}`} className="w-6 h-6 mx-auto" />
                        ) : (
                          <span className="text-slate-500 font-semibold">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{entry.name || 'Ẩn danh'}</p>
                        {entry.time ? <p className="text-[11px] text-slate-500">Thời gian: {entry.time}</p> : null}
                      </div>
                      <div className="text-sm font-bold text-[#2864D2] flex items-center gap-1">
                        {entry.score ?? '—'}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-2xl overflow-hidden border border-blue-100 shadow-sm bg-white">
              <img
                src="/assets/logos/banner.png"
                alt="Banner quảng cáo"
                className="w-full h-full object-cover"
              />
            </div>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}

function formatDate(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
