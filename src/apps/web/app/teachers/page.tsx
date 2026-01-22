'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TeacherList from '@/components/teachers/TeacherList';
import TeacherDetailModal from '@/components/teachers/TeacherDetailModal'; 

const MOCK_TEACHERS = [
  {
    id: 't-tran-phuoc-hai',
    name: 'Trần Phước Hải',
    image: '/uploads/teachers-test/teacher_1.jpg',
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
    image: '/uploads/teachers-test/teacher_2.jpg',
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
    image: '/uploads/teachers-test/teacher_3.jpg',
    badges: [
      'Phụ trách phần Ngôn ngữ',
      'Cử nhân Xuất sắc, Khoa CNTT — Trường ĐH KHTN, ĐHQG TP.HCM',
      'Sinh viên Ngôn ngữ học — Trường ĐH Khoa học Xã hội & Nhân văn, ĐHQG TP.HCM',
      'CTV Hội Văn học Nghệ thuật Đồng Nai; đồng tác giả sách IELTS Writing',
      'Sinh viên ngành ngôn ngữ Anh, trường đại học mở Hà Nội'
    ]
  },
  {
    id: 't-do-thi-minh-dieu',
    name: 'Đỗ Thị Minh Diệu',
    image: '/uploads/teachers-test/teacher_4.png',
    badges: [
      '3 năm kinh nghiệm dạy Tiếng Anh ôn thi & Tiếng Anh giao tiếp',
      'Giải Ba HSG Tiếng Anh tỉnh Quảng Ngãi',
      'Thủ khoa khối D01 trường THPT Số 2 Tư Nghĩa',
      'Sinh viên chuyên ngành Kinh doanh quốc tế - Đại học Kinh tế TP.HCM',
      'Phụ trách phần Tiếng Anh'
    ]
  },
  {
    id: 't-phan-thi-bao-tram',
    name: 'Phan Thị Bảo Trâm',
    image: '/uploads/teachers-test/teacher_5.png',
    badges: [
      'IELTS 7.5',
      'Trên 1 năm kinh nghiệm dạy các lớp IELTS 3.5, 4.5, 5.5, 6.5',
      'Quán quân Cuộc Thi Sáng Tạo Chiến Lược Truyền Thông S-Maze 2025',
      'Top 10 cuộc thi Marketing Challengers 2025',
      'Sinh viên 5 tốt cấp UEH',
      'Cựu chuyên Toán THPT Chuyên Quốc Học - Huế',
      'Sinh viên chuyên ngành Marketing - Đại học Kinh tế TP.HCM',
      'Phụ trách phần Tiếng Anh'
    ]
  },
  {
    id: 't-le-ngoc-khanh-linh',
    name: 'Lê Ngọc Khánh Linh',
    image: '/uploads/teachers-test/teacher_6.png',
    badges: [
      '1022/1200 điểm ĐGNL HCM 2025',
      'Giải 3 Hùng biện Tiếng Anh 2022',
      'Giải 3 IOE cấp Quốc Gia 2022',
      '1510/1600 SAT',
      '27,25 A01 thi Tốt Nghiệp THPTQG 2025 (10 Lí)',
      'Có kinh nghiệm kèm IELTS (trong đó có 2 bạn 7.0)',
      'Cựu học sinh chuyên Anh trường THPT Chuyên Hùng Vương Bình Dương',
      'Sinh viên trường Đại học Kinh tế HCM',
      'Phụ trách phần Tiếng Anh'
    ]
  },
  {
    id: 't-nguyen-duy-hau',
    name: 'Nguyễn Duy Hậu',
    image: '/uploads/teachers-test/teacher_7.png',
    badges: [
      'Á khoa khối B toàn quốc THPTQG 2023 (10 Toán - 10 Sinh - 9,75 Hóa)',
      'Thủ khoa đầu vào ĐH Y Dược TPHCM 2023',
      'Thủ khoa HSG Toán TP Đà Nẵng 2023',
      'Cựu chuyên Toán THPT Chuyên Lê Quý Đôn Đà Nẵng',
      'Sinh viên Trường Y ĐH Y Dược TP HCM',
      'Phụ trách phần Toán học, Tư duy khoa học'
    ]
  },
  {
    id: 't-nguyen-minh-triet',
    name: 'Nguyễn Minh Triết',
    image: '/uploads/teachers-test/teacher_8.png',
    badges: [
      'Đạt 1052 điểm trong kì thi ĐGNL của ĐHQG - HCM',
      'Giải ba chung kết năm Đường lên đỉnh Olympia năm thứ 23',
      'Cựu học sinh chuyên Lý trường THPT chuyên Quốc Học Huế',
      'Sinh viên trường Đại học Công nghệ thông tin, ĐHQG - HCM',
      'Phụ trách phần Tư duy khoa học'
    ]
  },
  {
    id: 't-le-tran-hoang-long',
    name: 'Lê Trần Hoàng Long',
    image: '/uploads/teachers-test/teacher_9.png',
    badges: [
      '29.5 A00 - Thủ Khoa TP Đà Nẵng năm 2025: 9.5 Toán, 10 Vật lý, 10 Hoá',
      'Giải Nhất HSG Toán TP. Đà Nẵng 2024-2025',
      'Cựu chuyên Toán THPT Chuyên Lê Quý Đôn Đà Nẵng',
      'Sinh viên Khoa học máy tính - Trường ĐH KTHN - ĐHQG HCM',
      'Phụ trách phần Toán học'
    ]
  },
  {
    id: 't-phan-ban-nhat-nam',
    name: 'Phan Bản Nhật Nam',
    image: '/uploads/teachers-test/teacher_10.png',
    badges: [
      '1087 điểm ĐGNL HCM năm 2024',
      'Cựu chuyên Lý THPT Chuyên Quốc Học - Huế',
      'Sinh viên Trường Đại học Công nghệ Thông tin, ĐHQG-HCM',
      'Phụ trách phần Tiếng Việt'
    ]
  },
  {
    id: 't-phung-hoang-huu-phu',
    name: 'Phùng Hoàng Hữu Phú',
    image: '/uploads/teachers-test/teacher_11.png',
    badges: [
      '1050 điểm ĐGNL HCM đợt 1 (top 3 cả nước)',
      'Thành viên Ban Đối ngoại chương trình Nguyệt Quế Đỏ (tìm kiếm, bồi dưỡng thí sinh Olympia)',
      'Cựu học sinh chuyên Toán THPT Chuyên Quốc Học Huế',
      'Sinh viên khoa Toán - Tin, chuyên ngành Khoa học dữ liệu, trường KHTN, ĐHQG-HCM',
      'Phụ trách phần Toán học'
    ]
  },
  {
    id: 't-nguyen-phuc-tam',
    name: 'Nguyễn Phúc Tâm',
    image: '/uploads/teachers-test/teacher_12.png',
    badges: [
      '1078 điểm ĐGNL HCM đợt 2 năm 2025 (300/300 điểm Tư duy khoa học)',
      '28,5 điểm khối A00, tổng điểm 37,5/40 các môn kỳ thi Tốt nghiệp THPTQG 2025',
      'Huy chương Đồng môn Hóa học kỳ thi Olympic Khoa học Tự nhiên (HSGS) 2023',
      'Cựu chuyên Hóa THPT Chuyên Quốc Học - Huế',
      'Sinh viên ngành Công nghệ thông tin - Trường Đại học Khoa học Tự nhiên - ĐHQG-HCM',
      'Phụ trách phần Tiếng Việt, Tư duy khoa học'
    ]
  },
  {
    id: 't-hoang-anh-dung',
    name: 'Hoàng Anh Dũng',
    image: '/uploads/teachers-test/teacher_13.png',
    badges: [
      '1009 điểm ĐGNL HCM Đợt 1 năm 2025',
      '28 điểm khối A00, tổng điểm 36,75/40 các môn kỳ thi Tốt nghiệp THPTQG 2025',
      'Cựu học sinh chuyên Lý trường THPT chuyên Quốc Học Huế',
      'Sinh viên trường Đại học Bách Khoa, ĐHQG - HCM',
      'Phụ trách phần Tiếng Việt'
    ]
  },
  {
    id: 't-vo-duc-anh-huy',
    name: 'Võ Đức Anh Huy',
    image: '/uploads/teachers-test/teacher_14.png',
    badges: [
      'Huy chương Đồng môn Toán học kỳ thi Olympic Khoa học Tự nhiên (HSGS) 2022',
      'Top 1 Toán Kì thi Toán Logic FPT 2023',
      'Cựu chuyên Toán THPT Chuyên Lê Quý Đôn - Đà Nẵng',
      'Sinh viên Trường Đại học Công nghệ Thông tin, ĐHQG-HCM',
      'Phụ trách phần Toán học, Tư duy khoa học'
    ]
  },
  {
    id: 't-nguyen-minh-quan',
    name: 'Nguyễn Minh Quân',
    image: '/uploads/teachers-test/teacher_15.png',
    badges: [
      '1055/1200 điểm ĐGNL HCM năm 2024',
      'Thủ khoa khối A01 trường THPT Chuyên Lê Quý Đôn - Bình Định năm 2024',
      'Cựu học sinh THPT Chuyên Lê Quý Đôn - Bình Định',
      'Sinh viên ngành Khoa học Máy tính - trường ĐH KHTN - ĐHQG-HCM',
      'Phụ trách phần Toán học, Tư duy khoa học'
    ]
  },
  {
    id: 't-pham-nguyen-minh-quan',
    name: 'Phạm Nguyễn Minh Quân',
    image: '/uploads/teachers-test/teacher_16.png',
    badges: [
      'Học bổng của Viện Nghiên cứu Cao cấp về Toán VIASM (2023)',
      'Chứng chỉ Xác suất ranking 8/10 của Hiệp hội Actuary Hoa Kỳ (2023)',
      'Chứng chỉ Toán tài chính ranking 8/10 của Hiệp hội Actuary Hoa Kỳ (2024)',
      'Chuyên viên Vận hành số - Kiểm soát dữ liệu, Công ty cổ phần Hợp tác đầu tư & Công nghệ TECHCOOP',
      'Tốt nghiệp loại Xuất sắc hệ Cử nhân Tài năng ngành Toán học, Đại học KHTN-TPHCM',
      'Phụ trách phần Toán học'
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
                <h1 className="text-2xl sm:text-3xl font-semibold text-brand-text">Đội ngũ chuyên môn</h1>
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