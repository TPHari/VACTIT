'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import NewsList from '@/components/news/NewsList';
import NewsDetailModal from '@/components/news/NewsDetailModal';
import { api } from '@/lib/api-client';

// [SỬA 1]: Xóa views khỏi interface
interface NewsItem {
  id: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  content?: string;
  image: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await api.news.getAll();
        const rawData = response.data || [];

        const formattedData: NewsItem[] = rawData.map((item: any) => ({
          id: item.news_id,
          title: item.title,
          author: item.author || 'Bailearn',
          date: new Date(item.created_at).toLocaleDateString('vi-VN'),
          excerpt: item.excerpt || '',
          content: item.content || '',
          image: item.image || '/uploads/news-test/news-test.png', 
        }));

        setNews(formattedData);
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <DashboardLayout>
      <div className="min-h-screen flex bg-gray-50">
        <div className="flex-1 flex flex-col pt-4"> 
          <div className="flex-1 overflow-hidden">
            <main
              className="p-6 h-full overflow-auto custom-scrollbar"
              style={{ maxHeight: 'calc(100vh - 72px)' }}
            >
              <div className="card card-blue w-full mb-8 relative overflow-hidden flex-shrink-0 group shadow-lg rounded-2xl">
                <div className="relative z-10 max-w-3xl p-8">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
                    Tin Tức & Sự Kiện 📰
                  </h1>
                  <p className="text-blue-100 text-sm md:text-base font-medium max-w-xl">
                    Cập nhật những thông tin tuyển sinh mới nhất, bí quyết ôn thi và các sự kiện giáo dục nổi bật.
                  </p>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-64 pointer-events-none">
                  <div className="absolute top-[-20px] right-[40px] w-24 h-24 bg-yellow-400 rounded-full opacity-90 transition-transform duration-500 ease-out group-hover:scale-125 shadow-lg shadow-blue-900/20"></div>
                  <div className="absolute bottom-[-10px] right-[100px] w-20 h-20 bg-yellow-400 rounded-full opacity-80 transition-transform duration-700 ease-out group-hover:scale-110 shadow-lg shadow-blue-900/20"></div>
                  <div className="absolute top-[40px] right-[-30px] w-40 h-40 bg-yellow-400 rounded-full opacity-100 transition-transform duration-500 ease-out group-hover:scale-110 shadow-lg shadow-blue-900/20"></div>
                </div>
              </div>

              {loading ? (
                 <div className="flex flex-col items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-500">Đang tải tin tức...</p>
                 </div>
              ) : news.length > 0 ? (
                <NewsList items={news} onSelect={(item) => setSelectedNews(item)} />
              ) : (
                <div className="text-center py-20 text-gray-500">
                  Chưa có tin tức nào.
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      {selectedNews && (
        <NewsDetailModal news={selectedNews} onClose={() => setSelectedNews(null)} />
      )}
    </DashboardLayout>
  );
}