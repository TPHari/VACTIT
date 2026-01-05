'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TeacherList from '@/components/teachers/TeacherList';
import TeacherDetailModal from '@/components/teachers/TeacherDetailModal'; 

const MOCK_TEACHERS = [
  {
    id: 't-tran-phuoc-hai',
    name: 'Trần Phước Hải',
    image: '/uploads/teachers-test/teacher1-test.jpg',
    badges: [
      'Phụ trách phần Toán học',
      'Cựu chuyên Toán THPT Chuyên Lê Quý Đôn Đà Nẵng',
      'Á khoa khối A00 TP Đà Nẵng',
      '4 lần liên tiếp đều đạt mức điểm 1000+ ĐGNL HCM (300/300 phần Toán)',
      'Hơn hai năm kinh nghiệm luyện thi ĐGNL HCM; nhiều học trò đạt 900+, 1000+',
      'Sinh viên Khoa học máy tính — Trường ĐH Khoa học Tự nhiên, ĐHQG HCM'
    ]
  },
  {
    id: 't-phan-le-thuc-bao',
    name: 'Phan Lê Thúc Bảo',
    image: '/uploads/teachers-test/teacher2-test.jpg',
    badges: [
      'Phụ trách phần Tư duy Khoa học',
      'Cựu chuyên Toán THPT Chuyên Quốc Học Huế',
      'Sinh viên Khoa học máy tính — Trường ĐH KHTN, ĐHQG HCM',
      'Thủ khoa toàn quốc ĐGNL HCM 2023 — kỷ lục 1133 điểm (300/300 Toán - Logic - PTSL)',
      'Thủ khoa ĐGNL HCM đợt 1 năm 2025 — 1060 điểm (300/300 Tư duy Khoa học)',
      'Sở hữu 5 điểm 1000+ ĐGNL HCM'
    ]
  },
  {
    id: 't-hoang-phuoc-nguyen',
    name: 'Hoàng Phước Nguyên',
    image: '/uploads/teachers-test/teacher3-test.jpg',
    badges: [
      'Phụ trách phần Ngôn ngữ',
      'Cử nhân Xuất sắc, Khoa CNTT — Trường ĐH KHTN, ĐHQG TP.HCM',
      'Sinh viên Ngôn ngữ học — Trường ĐH Khoa học Xã hội & Nhân văn, ĐHQG TP.HCM',
      'CTV Hội Văn học Nghệ thuật Đồng Nai; đồng tác giả sách IELTS Writing',
      'Sinh viên ngành ngôn ngữ Anh, trường đại học mở Hà Nội'
    ]
  }
];

export default function TeachersPage() {
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);

  return (
    <DashboardLayout>
      <div className="min-h-screen flex bg-gray-50">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-hidden">
            <main
              className="p-6 h-full overflow-auto"
              style={{ maxHeight: 'calc(100vh - 72px)' }}
            >
              <header className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-semibold text-brand-text">Đội ngũ giảng dạy</h1>
              </header>

              {/* Truyền mock data vào và xử lý sự kiện click để mở modal */}
              <TeacherList 
                items={MOCK_TEACHERS} 
                onSelect={(teacher) => setSelectedTeacher(teacher)} 
              />
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