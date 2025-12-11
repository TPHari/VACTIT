'use client';

import React from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import NewsList from '@/components/news/NewsList';

export const MOCK_NEWS = [
  {
    id: 'news-1',
    title: 'ĐIỂM ƯU TIÊN LÀ GÌ? CÁCH TÍNH ĐIỂM ƯU TIÊN 2025',
    author: 'Empire Team',
    date: '29/06/2025',
    views: 2429,
    excerpt: 'Trước mỗi kỳ thi tốt nghiệp THPT quốc gia, xét tuyển vào Đại học, Cao đẳng, những thắc mắc về điểm ưu tiên là gì? Cách tính...',
    image: '/uploads/news-test/news-test.png',
  },
  {
    id: 'news-2',
    title: 'CÁC TRƯỜNG ĐẠI HỌC ĐÀO TẠO NGÀNH BÁO CHÍ 2025',
    author: 'Empire Team',
    date: '28/06/2025',
    views: 1884,
    excerpt: 'Một số trường đại học đào tạo ngành báo chí chất lượng tại Việt Nam, các bạn học sinh tham khảo để đưa ra quyết định...',
    image: '/uploads/news-test/news-test.png',
  },
  {
    id: 'news-3',
    title: 'Học viện Ngân hàng xét tuyển 2025',
    author: 'Empire Team',
    date: '21/06/2025',
    views: 1946,
    excerpt: 'Học viện Ngân hàng xét tuyển theo 5 phương thức. Hướng dẫn cách chuẩn bị hồ sơ và mức điểm tham khảo...',
    image: '/uploads/news-test/news-test.png',
  },

  // New items
  {
    id: 'news-4',
    title: 'HƯỚNG DẪN LỰA CHỌN NGÀNH NGHỀ SAU TỐT NGHIỆP THPT',
    author: 'Student Hub',
    date: '15/07/2025',
    views: 1320,
    excerpt: 'Làm thế nào để chọn ngành phù hợp với năng lực và xu hướng việc làm? Các bước khảo sát, thử nghề và tham khảo điểm chuẩn...',
    image: '/uploads/news-test/news-test.png',
  },
  {
    id: 'news-5',
    title: 'TĂNG TỐC KỲ THI THPT: BÍ QUYẾT ÔN TẬP HIỆU QUẢ',
    author: 'Exam Coach',
    date: '10/07/2025',
    views: 987,
    excerpt: 'Lịch ôn luyện 4 tuần cuối, mẹo làm bài trắc nghiệm và cách phân bổ thời gian cho từng môn học để tối đa điểm số...',
    image: '/uploads/news-test/news-test.png',
  },
  {
    id: 'news-6',
    title: 'HỌC BỔNG TOÀN PHẦN VÀ CÁCH SĂN HỌC BỔNG 2025',
    author: 'Scholarship Center',
    date: '05/07/2025',
    views: 2103,
    excerpt: 'Danh sách học bổng trong nước và quốc tế, điều kiện ứng tuyển và mẫu hồ sơ tham khảo giúp tăng cơ hội nhận học bổng...',
    image: '/uploads/news-test/news-test.png',
  },
  {
    id: 'news-7',
    title: 'KỸ NĂNG PHỎNG VẤN ĐẦU VÀO TRƯỜNG: GHI ĐIỂM NHANH',
    author: 'Career Lab',
    date: '01/07/2025',
    views: 754,
    excerpt: 'Chuẩn bị câu trả lời, trang phục và thái độ khi tham gia phỏng vấn tuyển sinh hay học bổng — những lỗi cần tránh...',
    image: '/uploads/news-test/news-test.png',
  },
  {
    id: 'news-8',
    title: 'CẬP NHẬT THÔNG TIN TUYỂN SINH NGẮN HẠN: LỊCH NHỮNG ĐỢT NHẬP HỌC',
    author: 'Admission News',
    date: '28/06/2025',
    views: 643,
    excerpt: 'Các đợt tuyển sinh ngắn hạn, kỳ thi năng lực, và các chương trình đào tạo mùa hè — lịch chi tiết và hướng dẫn đăng ký...',
    image: '/uploads/news-test/news-test.png',
  },
];

export default function NewsPage() {
  const items = MOCK_NEWS;
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col px-6 pt-4 lg:px-8">
        <Topbar />
        {/* content container: reserve space for Topbar and make news area its own scrollable pane */}
        <div className="flex-1 overflow-hidden">
          {/* main becomes the scroll container for news only */}
          <main
            className="p-2 h-full overflow-auto"
            style={{ maxHeight: 'calc(100vh - 72px)' }} // adjust 72px to match Topbar height if needed
          >
            <header className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-semibold">Tin tức mới nhất</h1>
              <p className="text-sm text-gray-500 mt-1">Cập nhật các tin tức, bài viết và hướng dẫn mới nhất.</p>
            </header>

            <NewsList items={items} />
          </main>
        </div>
      </div>
    </div>
  );
}