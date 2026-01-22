"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { api } from '@/lib/api-client';
import { useCurrentUser, useLeaderboard, useUserStats } from '@/lib/swr-hooks';

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string | null;
  score: number;
  time: string;
  date: string;
}

interface UserStats {
  testsCompleted: number;
  totalTests: number;
  totalTimeSpent: number;
  totalTimeFormatted: string;
  frequencyData: { date: string; count: number; dayLabel: string }[];
  totalTrials: number;
}

export default function OverviewTab() {
  const router = useRouter();
  //  Use shared SWR hook instead of direct fetch
  const { user } = useCurrentUser();

  // ✅ Use SWR hooks for data fetching (cached globally)
  const { leaderboard, testInfo, isLoading: loadingLeaderboard } = useLeaderboard();
  const { stats, isLoading: loadingStats } = useUserStats();

  const loading = loadingLeaderboard || loadingStats;

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Calculate progress percentage
  const progressPercentage = stats
    ? Math.round((stats.testsCompleted / Math.max(stats.totalTests, 1)) * 100)
    : 0;

  // Get max count for chart scaling
  const maxCount = stats
    ? Math.max(...(stats as UserStats).frequencyData.map((d: { count: number }) => d.count), 1)
    : 1;

  return (
    <DashboardLayout>
      <div className="flex flex-row">
        <div className="flex flex-col flex-1 p-6 overflow-auto">
          <h1 className="page-title mb-6">Tổng quan</h1>

          {/* Welcome Section */}
          <section className="card card--hero mb-6">
            <div className="card--hero__left">
              <p className="hero__subtitle">Chào mừng đã trở lại, {user?.name || '...'}!</p>
              <p className="hero__text">
                Hãy coi mỗi bài thi thử là một mũi tiêm vắc-xin. Hơi đau một tí, nhưng giúp bạn miễn dịch với áp lực sau này.
              </p>
              <button
                className="btn btn--primary hero__button"
                onClick={() => router.push('/exam')}
              >
                Làm bài thi mới
              </button>
            </div>
            <div className="card--hero__right">
              <img
                src="/assets/logos/hero-illustration.png"
                alt="Hero"
                className="hero-illustration"
                width={260}
              />
            </div>
          </section>

          {/* Main Grid: Leaderboard + Stats */}
          <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Leaderboard Section - Takes 3 columns */}
            <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#2864d2]">Bảng xếp hạng</h2>
                <button
                  onClick={() => router.push('/leaderboard')}
                  className="text-sm text-[#2864d2] hover:underline font-medium"
                >
                  Xem tất cả
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  Chưa có dữ liệu bảng xếp hạng
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                        <th className="pb-3 font-semibold">#</th>
                        <th className="pb-3 font-semibold">Họ và tên</th>
                        <th className="pb-3 font-semibold text-center">Điểm thi</th>
                        <th className="pb-3 font-semibold text-center">Thời gian làm bài</th>
                        <th className="pb-3 font-semibold text-center">Ngày thi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(leaderboard as LeaderboardEntry[]).map((entry: LeaderboardEntry, index: number) => (
                        <tr key={entry.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="py-3">
                            {index < 3 ? (
                              <img
                                src={`/assets/icons/top${index + 1}.svg`}
                                alt={`Hạng ${index + 1}`}
                                className="w-6 h-6"
                              />
                            ) : (
                              <span className="text-gray-500 font-medium">{index + 1}</span>
                            )}
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 overflow-hidden flex-shrink-0">
                                {entry.avatar ? (
                                  <img
                                    src={entry.avatar}
                                    alt={entry.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${entry.name}&background=random`;
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-blue-600 font-bold text-sm">
                                    {entry.name.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <span className="font-medium text-gray-800">{entry.name}</span>
                            </div>
                          </td>
                          <td className="py-3 text-center font-bold text-gray-800">{entry.score}</td>
                          <td className="py-3 text-center text-gray-600">{entry.time}</td>
                          <td className="py-3 text-center text-gray-500 text-sm">
                            {formatDate(entry.date)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Stats Section - Takes 2 columns */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#2864d2]">Thống kê</h2>
                <button
                  onClick={() => router.push('/profile')}
                  className="text-sm text-[#2864d2] hover:underline font-medium"
                >
                  Xem chi tiết
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2864d2]"></div>
                </div>
              ) : stats ? (
                <div className="space-y-6">
                  {/* Progress Circle */}
                  <div className="flex items-start gap-6">
                    <div className="relative w-24 h-24">
                      <svg className="w-24 h-24 transform -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="#E5E7EB"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="#FFD700"
                          strokeWidth="8"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${progressPercentage * 2.51} 251`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-bold text-[#000000]">{progressPercentage}%</span>
                      </div>
                    </div>

                    <div className="flex-1 space-y-2">
                      <p className="text-sm text-gray-500 font-medium">Tiến độ hoàn thành bài tập</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Số bài đã làm</span>
                          <span className="font-bold text-gray-800">{stats.testsCompleted}/{stats.totalTests}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Thời gian làm</span>
                          <span className="font-bold text-gray-800">{stats.totalTimeFormatted}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tổng lượt thi</span>
                          <span className="font-bold text-gray-800">{stats.totalTrials}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Frequency Chart */}
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-4">Tần suất học</p>
                    <div className="flex items-end justify-between gap-2 h-32 rounded-lg bg-[#2864d2] px-3 py-3">
                      {(stats as UserStats).frequencyData.map((day: { count: number; dayLabel: string }, index: number) => (
                        <div key={index} className="flex flex-col items-center flex-1">
                          <div
                            className="w-full bg-[#FFD700] rounded-t-md transition-all duration-300 hover:bg-white/80"
                            style={{
                              height: `${Math.max((day.count / maxCount) * 100, day.count > 0 ? 15 : 5)}%`,
                              minHeight: day.count > 0 ? '20px' : '8px'
                            }}
                          >
                            {day.count > 0 && (
                              <div className="text-center text-xs font-bold text-[#FFD700] -mt-5">
                                {day.count}
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-white mt-2">{day.dayLabel}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  Không thể tải thống kê
                </div>
              )}
            </div>
          </section>

          {/* Daily Quiz Section - Keep this */}
          <section className="mt-6">
            <article className="card card--daily-quiz max-w-2xl">
              <header className="card--daily-quiz__header">
                <h2>Daily Quiz</h2>
              </header>
              <div className="card--daily-quiz__question">
                <p>
                  Dòng nào sau đây nêu tên những tác phẩm cùng phong cách sáng tác
                  của trường phái văn học hiện thực?
                </p>
              </div>
              <div className="card--daily-quiz__options">
                <button className="quiz-option">
                  Tắt đèn, Số đỏ, Chí Phèo.
                </button>
                <button className="quiz-option quiz-option--selected">
                  Chữ người tử tù, Giông tố, Lão Hạc.
                </button>
              </div>
            </article>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}