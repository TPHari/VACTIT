'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TeacherList from '@/components/teachers/TeacherList';
// Import Modal vừa tách ra
import TeacherDetailModal from '@/components/teachers/TeacherDetailModal'; 
import { api } from '@/lib/api-client';

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true);
      try {
        const response = await api.teachers.getAll();
        const rawData = response.data || [];

        const formattedData = rawData.map((t: any) => {
          const badges = ['Giảng viên'];
          
          const testCount = t._count?.authoredTests || 0;
          if (testCount > 0) {
            badges.push(`${testCount} đề thi`);
          }

          return {
            id: t.user_id,
            name: t.name,
            email: t.email,
            phone: t.phone,
            role: t.role || 'Author',
            image: '/uploads/teachers-test/teachers-test.jpg',
            badges: badges,
          };
        });

        setTeachers(formattedData);
      } catch (error) {
        console.error("Failed to fetch teachers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  return (
    <DashboardLayout>
      <div className="min-h-screen flex bg-gray-50">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-hidden">
            <main
              className="p-6 h-full overflow-auto custom-scrollbar"
              style={{ maxHeight: 'calc(100vh - 72px)' }}
            >
              {/* --- BANNER --- */}
              <div className="card card-blue w-full mb-8 relative overflow-hidden flex-shrink-0 group shadow-lg rounded-2xl">
                <div className="relative z-10 max-w-3xl p-8">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
                    Đội Ngũ Giảng Viên <br /> Uy Tín & Tận Tâm
                  </h1>
                  <p className="text-blue-100 text-sm md:text-base font-medium max-w-xl">
                    Danh sách các thầy cô, chuyên gia giáo dục đóng góp đề thi chất lượng, giúp bạn chinh phục mọi kỳ thi quan trọng.
                  </p>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-64 pointer-events-none">
                  <div className="absolute top-[-20px] right-[40px] w-24 h-24 bg-yellow-400 rounded-full opacity-90 group-hover:scale-125 transition-transform duration-500 shadow-lg shadow-blue-900/20"></div>
                  <div className="absolute bottom-[-10px] right-[100px] w-20 h-20 bg-yellow-400 rounded-full opacity-80 group-hover:scale-110 transition-transform duration-700 shadow-lg shadow-blue-900/20"></div>
                  <div className="absolute top-[40px] right-[-30px] w-40 h-40 bg-yellow-400 rounded-full opacity-100 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-blue-900/20"></div>
                </div>
              </div>

              {/* --- LIST --- */}
              {loading ? (
                <div className="flex justify-center items-center h-64">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                   <span className="ml-3 text-gray-500 font-medium">Đang tải dữ liệu giảng viên...</span>
                </div>
              ) : (
                <TeacherList 
                  items={teachers} 
                  onSelect={(t) => setSelectedTeacher(t)} 
                />
              )}
            </main>
          </div>
        </div>
      </div>

      {/* Hiển thị Modal khi có SelectedTeacher */}
      {selectedTeacher && (
        <TeacherDetailModal 
          teacher={selectedTeacher} 
          onClose={() => setSelectedTeacher(null)} 
        />
      )}
    </DashboardLayout>
  );
}