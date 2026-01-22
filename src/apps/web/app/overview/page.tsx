"use client";
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
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
  const { user } = useCurrentUser();
  const { leaderboard, isLoading: loadingLeaderboard } = useLeaderboard();
  const { stats, isLoading: loadingStats } = useUserStats();

  const loading = loadingLeaderboard || loadingStats;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const progressPercentage = stats
    ? Math.round((stats.testsCompleted / Math.max(stats.totalTests, 1)) * 100)
    : 0;

  const maxCount = stats
    ? Math.max(...(stats as UserStats).frequencyData.map((d: { count: number }) => d.count), 1)
    : 1;

  return (
    <DashboardLayout>
      <div className="flex flex-row">
        <div className="flex flex-col flex-1 px-6 pt-6 pb-6 overflow-auto custom-scrollbar">
          
          <div className="relative mb-6 overflow-hidden pt-8 px-1">
            
            {/* 1. Page Title */}
            <h1 className="page-title mb-6 relative z-10">Tổng quan</h1>

            {/* 2. Welcome Section (Blue Card) */}
            <section className="w-full bg-[#2864d2] rounded-2xl p-8 flex items-center justify-between shadow-sm min-h-[180px] relative z-10">
              <div className="max-w-2xl text-white">
                <p className="text-xl md:text-2xl font-bold mb-2">
                  Chào mừng đã trở lại, {user?.name || '...'}!
                </p>
                <p className="text-blue-100 text-sm md:text-base mb-6 leading-relaxed opacity-90">
                  Hãy coi mỗi bài thi thử là một mũi tiêm vắc-xin. Hơi đau một tí, nhưng giúp bạn miễn dịch với áp lực sau này.
                </p>
                <button
                  className="px-6 py-2.5 bg-white text-blue-600 font-bold rounded-full shadow-md hover:bg-blue-50 transition-colors transform active:scale-95"
                  onClick={() => router.push('/exam')}
                >
                  Bắt đầu ngay
                </button>
              </div>
              {/* Bên phải để trống cho text không đè lên vùng logo (trên mobile/tablet) */}
              <div className="hidden md:block w-32 shrink-0"></div>
            </section>

            {/* 3. Logo (Nằm cùng cấp với Section, nhưng Absolute theo Parent Div) */}
            {/* Logic: bottom-0 sẽ căn theo đáy của Parent Div (tức là đáy của Blue Card) */}
            <div className="absolute right-20 bottom-0 pointer-events-none md:pointer-events-auto z-20">
               <div className="relative w-48 h-48 md:w-80 md:h-80 translate-x-10 translate-y-6 md:translate-x-0 md:translate-y-10">
                  <img
                    src="/assets/logos/hero-illustration.png"
                    alt="Hero Illustration"
                    className="w-full h-full object-contain transition-transform duration-500 ease-out hover:-rotate-15"
                  />
               </div>
            </div>

          </div>


          {/* Main Grid: Leaderboard + Stats */}
          <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Leaderboard Section */}
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
                        <tr key={entry.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <td className="py-3">
                            {index < 5 ? (
                              <img
                                src={`/assets/icons/top${index + 1}.svg`}
                                alt={`Hạng ${index + 1}`}
                                className="w-6 h-6"
                              />
                            ) : (
                              <span className="text-gray-500 font-medium ml-2">{index + 1}</span>
                            )}
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 overflow-hidden flex-shrink-0 border border-blue-50">
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
                              <span className="font-medium text-gray-800 text-sm truncate max-w-[120px] sm:max-w-xs" title={entry.name}>{entry.name}</span>
                            </div>
                          </td>
                          <td className="py-3 text-center font-bold text-gray-800">{entry.score}</td>
                          <td className="py-3 text-center text-gray-600 text-sm">{entry.time}</td>
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

            {/* Stats Section */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#2864d2]">Thống kê</h2>
                {/* <button
                  onClick={() => router.push('/profile')}
                  className="text-sm text-[#2864d2] hover:underline font-medium"
                >
                  Xem chi tiết
                </button> */}
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2864d2]"></div>
                </div>
              ) : stats ? (
                <div className="space-y-6">
                  {/* Progress Circle */}
                  <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24 flex-shrink-0">
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
                        <div key={index} className="flex flex-col items-center flex-1 group">
                          <div
                            className="w-full bg-[#FFD700] rounded-t-sm transition-all duration-300 group-hover:bg-white/90 relative"
                            style={{
                              height: `${Math.max((day.count / maxCount) * 100, day.count > 0 ? 15 : 5)}%`,
                              minHeight: day.count > 0 ? '20px' : '4px'
                            }}
                          >
                             {/* Tooltip on Hover */}
                            {day.count > 0 && (
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {day.count} bài
                              </div>
                            )}
                          </div>
                          <span className="text-[10px] text-blue-100 mt-2 font-medium">{day.dayLabel}</span>
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

          {/* Daily Quiz Section */}
          {/* <section className="mt-6">
            <article className="card card--daily-quiz max-w-2xl bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <header className="mb-4 flex items-center gap-2">
                 <span className="text-2xl">💡</span>
                <h2 className="text-lg font-bold text-gray-800">Daily Quiz</h2>
              </header>
              <div className="mb-6">
                <p className="text-gray-700 font-medium text-lg leading-relaxed">
                  Dòng nào sau đây nêu tên những tác phẩm cùng phong cách sáng tác
                  của trường phái văn học hiện thực?
                </p>
              </div>
              <div className="space-y-3">
                <button className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-gray-700 font-medium">
                  A. Tắt đèn, Số đỏ, Chí Phèo.
                </button>
                <button className="w-full text-left p-4 rounded-xl border-2 border-blue-500 bg-blue-50 text-blue-800 font-bold shadow-sm">
                  B. Chữ người tử tù, Giông tố, Lão Hạc.
                </button>
              </div>
            </article>
          </section> */}
        </div>
      </div>
    </DashboardLayout>
  );
}