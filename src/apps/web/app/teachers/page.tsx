'use client';

import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import TeacherList from '@/components/teachers/TeacherList';

const MOCK_TEACHERS = [
  {
    id: 't-phan-thi-dieu',
    name: 'TS. Phạm Thị Diệu',
    image: '/uploads/teachers-test/teachers-test.jpg',
    badges: ['Giảng viên chính', 'Khoa Ngoại ngữ', 'Tiến sĩ - University of Oxford'],
  },
  {
    id: 't-hoang-van-em',
    name: 'TS. Hoàng Văn Em',
    image: '/uploads/teachers-test/teachers-test.jpg',
    badges: ['Giảng viên', 'Khoa Kinh tế', 'Tiến sĩ - Đại học Kinh tế TP.HCM'],
  },
  {
    id: 't-vu-thi-phuong',
    name: 'ThS. Vũ Thị Phương',
    image: '/uploads/teachers-test/teachers-test.jpg',
    badges: ['Giảng viên', 'Khoa Thiết kế Đồ họa', 'Thạc sĩ - Đại học Mỹ thuật Công nghiệp'],
  },
  // more examples
  {
    id: 't-nguyen-thi-a',
    name: 'PGS.TS. Nguyễn Thị A',
    image: '/uploads/teachers-test/teachers-test.jpg',
    badges: ['Phó giáo sư', 'Khoa Toán', 'Tiến sĩ - University of Cambridge'],
  },
  {
    id: 't-tran-van-b',
    name: 'TS. Trần Văn B',
    image: '/uploads/teachers-test/teachers-test.jpg',
    badges: ['Giảng viên', 'Khoa Vật lý', 'Tiến sĩ - Đại học Quốc gia Hà Nội'],
  },
];

export default function TeachersPage() {
  const [teachers, setTeachers] = React.useState<Array<any>>([]);
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

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
  );
}