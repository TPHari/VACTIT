'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api-client';
import ExamCard from './ExamCard';
import ExamModal from './ExamModal';
import ExamFilterBar from '../functionalBar/ExamFilterBar';
import Loading from '../ui/LoadingSpinner';

interface ExamUI {
  id: string;
  title: string;
  author: string;
  questions: number; // Lưu ý: Biến này đang chứa số lượng trials (lượt làm bài)
  duration: number;
  date: string;
  status: string;
  type: string;
  subject: string;
}

export default function ExamList() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('query')?.toLowerCase() || '';

  const [allExams, setAllExams] = useState<ExamUI[]>([]);
  const [loading, setLoading] = useState(true);

  // Status Tab: 'all' | 'completed' | 'not_started'
  const [currentTab, setCurrentTab] = useState('all'); 
  const [selectedExam, setSelectedExam] = useState<ExamUI | null>(null);
  
  const [sortOrder, setSortOrder] = useState('newest');

  // --- 1. GỌI API & MAPPING DỮ LIỆU ---
  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      try {
        const response = await api.tests.getAll({
          query: searchQuery,
          type: 'all', 
        });

        const rawData = response.data || [];

        const formattedData: ExamUI[] = rawData.map((item: any) => ({
          id: item.test_id,
          title: item.title,
          author: item.author?.name || 'Unknown',
          questions: item._count?.trials || 0, 
          duration: item.duration || 0,
          date: item.start_time || new Date().toISOString(),
          status: item.status || 'Regular',
          type: item.type || 'practice',
          subject: 'Tổng hợp',
        }));

        setAllExams(formattedData);
      } catch (error) {
        console.error("Failed to fetch exams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [searchQuery]); // Chỉ fetch lại khi search query thay đổi

  // --- 2. LOGIC FILTER CLIENT-SIDE ---
  const displayedExams = useMemo(() => {
    return allExams
      .filter((exam) => {
        if (currentTab === 'completed') {
           // Đã làm = Có trial (questions > 0)
           if (exam.questions === 0) return false;
        } else if (currentTab === 'not_started') {
           // Chưa làm = Chưa có trial (questions === 0)
           if (exam.questions > 0) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // [SỬA LOGIC SORT]: Sắp xếp theo ngày tháng (Timestamp)
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();

        if (sortOrder === 'newest') {
          return dateB - dateA; // Mới nhất lên đầu
        }
        if (sortOrder === 'oldest') {
          return dateA - dateB; // Cũ nhất lên đầu
        }
        return 0;
      });
  }, [allExams, currentTab, sortOrder]);

  return (
    <>
      {loading && <Loading />}

      <ExamFilterBar 
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        sort={sortOrder}
        onSortChange={setSortOrder}
      />

      <div className="flex-1 overflow-y-auto pr-2 pb-6 custom-scrollbar p-2">
        {!loading && displayedExams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {displayedExams.map((exam) => (
              <div 
                key={exam.id} 
                className="h-full transform transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-2 hover:z-10"
              >
                <ExamCard 
                  exam={{
                    ...exam,
                    duration: exam.duration ? Math.floor(exam.duration) : 0
                  }} 
                  onSelect={() => setSelectedExam(exam)} 
                />
              </div>
            ))}
          </div>
        ) : !loading && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
             <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
             <p>Không tìm thấy đề thi nào phù hợp.</p>
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