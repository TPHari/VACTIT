'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api-client';
import ExamCard, { ExamData } from './ExamCard';
import ExamModal from './ExamModal';
import Loading from '../ui/LoadingSpinner';

const EVENT_CATEGORIES = [
  { id: 'all', label: 'Tất cả', icon: '🌐' },
  { id: 'in_progress', label: 'Đang diễn ra', icon: '🔥' },
  { id: 'countdown', label: 'Sắp bắt đầu (24h)', icon: '⏳' },
  { id: 'upcoming', label: 'Sắp tới', icon: '📅' },
  { id: 'practice', label: 'Luyện tập', icon: '📚' },
  { id: 'locked', label: 'Đã kết thúc', icon: '🔒' },
];

const STATUS_FILTERS = [
  { id: 'all', label: 'Tất cả trạng thái' },
  { id: 'not_started', label: 'Chưa làm' },
  { id: 'completed', label: 'Đã làm' },
];

export default function ExamList() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('query')?.toLowerCase() || '';

  // [2] State lưu User ID lấy từ API User
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);

  const [allExams, setAllExams] = useState<ExamData[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentCategory, setCurrentCategory] = useState('all'); 
  const [currentStatus, setCurrentStatus] = useState('all');     
  const [sortOrder, setSortOrder] = useState('newest');          

  const [selectedExam, setSelectedExam] = useState<ExamData | null>(null);

  // [3] Fetch User Info (Logic tương tự trang Profile)
  useEffect(() => {
    // Gọi endpoint nội bộ của Next.js (nơi NextAuth lưu session) để lấy info
    fetch('/api/user')
      .then(res => res.json())
      .then(data => {
        // Kiểm tra data trả về
        // Tùy vào format API /api/user của bạn trả về { user: ... } hay trực tiếp
        const userObj = data.user || data.data?.user || data;
        
        if (userObj) {
           const uid = userObj.user_id || userObj.id || userObj.email; // Fallback lấy ID
           if (uid) {
             console.log("ExamList: Found User ID:", uid);
             setCurrentUserId(uid);
           }
        }
      })
      .catch(err => {
         // Không làm gì nếu chưa login (khách)
         console.log("ExamList: Guest mode (No user logged in)");
      });
  }, []);

  // [4] Fetch Exams
  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      try {
        const response = await api.tests.getAll({
          query: searchQuery,
          category: currentCategory,
          status: currentStatus,
          sort: sortOrder,
          userId: currentUserId,
        });

        const rawData = response.data || [];

        const formattedData: ExamData[] = rawData.map((item: any) => {
          const userTrials = item.trials || [];
          const isTaken = userTrials.length > 0;
          
          return {
            id: item.test_id,
            title: item.title,
            author: item.author?.name || 'Unknown',
            questions: item._count?.questions || 0, 
            
            // [HIỂN THỊ] Số lượt thi của user này
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
        });

        setAllExams(formattedData);
      } catch (error) {
        console.error("Failed to fetch exams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  // Thêm currentUserId vào dependency để khi fetch user xong thì gọi lại API test
  }, [searchQuery, currentCategory, currentStatus, sortOrder, currentUserId]); 

  return (
    <>
      <div className="mb-6">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 ml-1">Sự kiện & Danh mục</h2>
        <div className="flex overflow-x-auto custom-scrollbar pb-2 gap-2">
          {EVENT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCurrentCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 whitespace-nowrap border ${
                currentCategory === cat.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200 transform scale-105'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-blue-300'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-semibold text-gray-400 uppercase mr-1">Lọc theo:</span>
          {STATUS_FILTERS.map((stat) => (
            <button
              key={stat.id}
              onClick={() => setCurrentStatus(stat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                currentStatus === stat.id
                  ? 'bg-white text-blue-700 border border-blue-200 shadow-sm'
                  : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'
              }`}
            >
              {stat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
           <span className="text-xs font-semibold text-gray-400 uppercase">Sắp xếp:</span>
           <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 outline-none cursor-pointer hover:border-blue-300 transition-colors"
           >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
           </select>
        </div>
      </div>

      {loading && <Loading />}

      <div className="flex-1 overflow-y-auto pr-2 pb-6 custom-scrollbar p-2">
        {!loading && allExams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {allExams.map((exam) => (
              <div 
                key={exam.id} 
                className="h-full transform transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-2 hover:z-10"
              >
                <ExamCard 
                  exam={exam} 
                  onSelect={() => setSelectedExam(exam)} 
                  categoryContext={currentCategory} 
                />
              </div>
            ))}
          </div>
        ) : !loading && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
             <div className="p-4 bg-gray-50 rounded-full mb-3">
                <svg className="w-8 h-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
             </div>
             <p className="font-medium">Không tìm thấy bài thi phù hợp.</p>
             <p className="text-xs mt-1 opacity-75">Thử thay đổi bộ lọc hoặc danh mục khác xem sao.</p>
          </div>
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