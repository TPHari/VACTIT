'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import NewsList from '@/components/news/NewsList';

const MOCK_NEWS = [
  {
    id: 'news-1',
    title: 'ĐIỂM ƯU TIÊN LÀ GÌ? CÁCH TÍNH ĐIỂM ƯU TIÊN 2025',
    author: 'Bai learn',
    date: '29/06/2025',
    views: 2429,
    excerpt: 'Trước mỗi kỳ thi tốt nghiệp THPT quốc gia, xét tuyển vào Đại học, Cao đẳng, những thắc mắc về điểm ưu tiên là gì? Cách tính...',
    image: '/uploads/news-test/news-test.png',
  },
  {
    id: 'news-2',
    title: 'CÁC TRƯỜNG ĐẠI HỌC ĐÀO TẠO NGÀNH BÁO CHÍ 2025',
    author: 'Bai learn',
    date: '28/06/2025',
    views: 1884,
    excerpt: 'Một số trường đại học đào tạo ngành báo chí chất lượng tại Việt Nam, các bạn học sinh tham khảo để đưa ra quyết định...',
    image: '/uploads/news-test/news-test.png',
  },
  {
    id: 'news-3',
    title: 'Học viện Ngân hàng xét tuyển 2025',
    author: 'Bai learn',
    date: '21/06/2025',
    views: 1946,
    excerpt: 'Học viện Ngân hàng xét tuyển theo 5 phương thức. Hướng dẫn cách chuẩn bị hồ sơ và mức điểm tham khảo...',
    image: '/uploads/news-test/news-test.png',
  },
];

export default function NewsPage() {
  const items = MOCK_NEWS;
  return (
    <DashboardLayout>
      <div className="min-h-screen flex bg-gray-50">
        <div className="flex-1 flex flex-col px-6 pt-4 lg:px-8">
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
    </DashboardLayout>
  );
}