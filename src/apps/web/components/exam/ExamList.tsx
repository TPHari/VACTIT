'use client';

import React, { useState, useMemo } from 'react';
import ExamCard from './ExamCard';
import ExamModal from './ExamModal';
import ExamFilterBar from '../functionalBar/ExamFilterBar';
import { MOCK_EXAMS } from '../../mockData/mockExam';

// Helper để lấy danh sách môn học unique từ data
const getUniqueSubjects = (exams: any[]) => {
  const subjects = exams.map(e => e.subject).filter(Boolean);
  return Array.from(new Set(subjects));
};

export default function ExamList() {
  // State quản lý Filter
  const [examSubTab, setExamSubTab] = useState('chua-lam'); // 'chua-lam' | 'da-lam' | 'tong-hop'
  const [filterSubject, setFilterSubject] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  const [selectedExam, setSelectedExam] = useState<any | null>(null);

  // Lấy danh sách môn học duy nhất có trong data
  const uniqueSubjects = useMemo(() => getUniqueSubjects(MOCK_EXAMS), []);

  // --- LOGIC FILTER CORE ---
  const filteredExams = useMemo(() => {
    let result = [...MOCK_EXAMS];

    // 1. Filter theo Tab (Status)
    if (examSubTab === 'chua-lam') {
      // Giả sử logic là check trường status hoặc history
      result = result.filter(e => e.status !== 'completed');
    } else if (examSubTab === 'da-lam') {
      result = result.filter(e => e.status === 'completed');
    }
    // 'tong-hop' thì không filter status

    // 2. Filter theo Môn học
    if (filterSubject) {
      result = result.filter(e => e.subject === filterSubject);
    }

    // 3. Filter theo Độ khó
    if (filterDifficulty) {
      result = result.filter(e => e.difficulty === filterDifficulty);
    }

    // 4. Sorting (Sắp xếp)
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      
      if (sortOrder === 'oldest') {
        return dateA - dateB;
      }
      return dateB - dateA; // Default: Newest
    });

    return result;
  }, [examSubTab, filterSubject, filterDifficulty, sortOrder]);

  return (
    <>
      {/* 2. Filter Bar (Đã tách component) */}
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
      <div className="flex-1 overflow-y-auto pr-2 pb-6 custom-scrollbar">
        {filteredExams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {filteredExams.map((exam) => (
              <ExamCard 
                key={exam.id} 
                exam={exam} 
                onSelect={(e) => setSelectedExam(e)} 
              />
            ))}
          </div>
        ) : (
          // Empty State khi không tìm thấy kết quả
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
             <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
             <p>Không tìm thấy đề thi nào phù hợp.</p>
             <button 
                onClick={() => { setFilterSubject(''); setFilterDifficulty(''); }}
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