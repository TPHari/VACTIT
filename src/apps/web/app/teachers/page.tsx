'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TeacherList from '@/components/teachers/TeacherList';

const MOCK_TEACHERS = [
  {
    id: 't-tran-phuoc-hai',
    name: 'Trần Phước Hải',
    image: '/uploads/teachers-test/teacher1-test.jpg',
    badges: ["Cựu chuyên Toán THPT Chuyên Lê Quý Đôn Đà Nẵng",
             "Giải Nhất HSG Toán Quốc gia 2022-2023",
             "Á Khoa TP Đà Nẵng năm 2023",
              "Sở hữu 4 điểm 1000+ ĐGNL HCM",
              "Hơn hai năm kinh nghiệm dạy luyện thi ĐGNL HCM, có nhiều học trò đạt 900+, 1000+",
              "Đang theo học ngành Khoa học máy tính - Trường ĐH Khoa học Tự nhiên - ĐHQG HCM"
            ],
  }
];

export default function TeachersPage() {
  const [teachers, setTeachers] = React.useState<Array<any>>([]);
  return (
    <DashboardLayout>
      <div className="min-h-screen flex bg-gray-50">

        <div className="flex-1 flex flex-col">

          {/* content area: keep topbar fixed and make list scrollable */}
          <div className="flex-1 overflow-hidden">
            <main
              className="p-6 h-full overflow-auto"
              style={{ maxHeight: 'calc(100vh - 72px)' }} // adjust if Topbar height differs
            >
              <header className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-semibold text-brand-text">Giảng viên</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Danh sách giảng viên — click "Tìm hiểu thêm" để xem thông tin chi tiết.
                </p>
              </header>

              <TeacherList items={MOCK_TEACHERS} />
            </main>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}