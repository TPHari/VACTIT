'use client';

import React, { useState, useMemo, useEffect } from 'react';
// [THÊM] Import useSearchParams để đọc từ khóa tìm kiếm từ URL
import { useSearchParams } from 'next/navigation';
import ExamCard from './ExamCard';
import ExamModal from './ExamModal';
import ExamFilterBar from '../functionalBar/ExamFilterBar';
import Loading from '../ui/LoadingSpinner'; // Hoặc Loading.tsx tùy tên file của bạn
import { MOCK_EXAMS } from '../../mockData/mockExam';

const getUniqueSubjects = (exams: any[]) => {
  const subjects = exams.map(e => e.subject).filter(Boolean);
  return Array.from(new Set(subjects));
};

export default function ExamList() {
  // --- [TÍNH NĂNG MỚI] Lấy từ khóa tìm kiếm ---
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('query')?.toLowerCase() || '';

  // State quản lý Filter
  const [examSubTab, setExamSubTab] = useState('chua-lam');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedExam, setSelectedExam] = useState<any | null>(null);
  
  // State Loading
  const [isLoading, setIsLoading] = useState(true);

  // Giả lập Loading khi vào trang
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000); 
    return () => clearTimeout(timer);
  }, []);

  // Lấy danh sách môn học duy nhất
  const uniqueSubjects = useMemo(() => getUniqueSubjects(MOCK_EXAMS), []);

  // --- LOGIC FILTER CORE ---
  const filteredExams = useMemo(() => {
    let result = [...MOCK_EXAMS];

    // 1. [MỚI] Lọc theo từ khóa tìm kiếm (Search Query)
    if (searchQuery) {
      result = result.filter(e => 
        e.title.toLowerCase().includes(searchQuery) || 
        // Tìm theo môn học nếu muốn
        (e.subject && e.subject.toLowerCase().includes(searchQuery))
      );
    }

    // 2. Filter theo Tab (Status)
    if (examSubTab === 'chua-lam') result = result.filter(e => e.status !== 'completed');
    else if (examSubTab === 'da-lam') result = result.filter(e => e.status === 'completed');

    // 3. Filter theo Môn học
    if (filterSubject) result = result.filter(e => e.subject === filterSubject);
    
    // 4. Filter theo Độ khó
    if (filterDifficulty) result = result.filter(e => e.difficulty === filterDifficulty);

    // 5. Sorting
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'oldest' ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [examSubTab, filterSubject, filterDifficulty, sortOrder, searchQuery]); // [QUAN TRỌNG]: Thêm searchQuery vào dependency

  return (
    <>
      {/* Loading Screen */}
      {isLoading && <Loading />}

      {/* 2. Filter Bar */}
      <ExamFilterBar 
        currentTab={examSubTab}
        onTabChange={setExamSubTab}
        subject={filterSubject}
        onSubjectChange={setFilterSubject}
        subjectsList={uniqueSubjects}
        difficulty={filterDifficulty}
        onDifficultyChange={setFilterDifficulty}
        sort={sortOrder}
        onSortChange={setSortOrder}
      />

      {/* 3. Scrollable Grid Area */}
      <div className="flex-1 overflow-y-auto pr-2 pb-6 custom-scrollbar p-2">
        {filteredExams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {filteredExams.map((exam) => (
              // Zoom Effect on Hover
              <div 
                key={exam.id} 
                className="h-full transform transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-2 hover:z-10"
              >
                <ExamCard 
                  exam={exam} 
                  onSelect={(e) => setSelectedExam(e)} 
                />
              </div>
            ))}
          </div>
        ) : (
          // Empty State (Khi không tìm thấy kết quả)
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
             <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
             </svg>
             <p>Không tìm thấy đề thi nào phù hợp với từ khóa "{searchQuery}".</p>
             <button 
                onClick={() => {
                   setFilterSubject(''); 
                   setFilterDifficulty(''); 
                   // Nếu muốn xóa luôn từ khóa tìm kiếm:
                   // router.replace(pathname); 
                }}
                className="mt-2 text-blue-600 hover:underline text-sm"
             >
                Xóa bộ lọc
             </button>
          </div>
        )}
      </div>

      {/* 4. Modal */}
      {selectedExam && (
        <ExamModal 
          exam={selectedExam} 
          onClose={() => setSelectedExam(null)} 
        />
      )}
    </>
  );
}