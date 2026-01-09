'use client';

import React from 'react';

interface NewsDetailModalProps {
  news: any;
  onClose: () => void;
}

export default function NewsDetailModal({ news, onClose }: NewsDetailModalProps) {
  if (!news) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
      >
        <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none opacity-20">
            <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl"></div>
            <div className="absolute top-[20px] right-[50px] w-20 h-20 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl"></div>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="overflow-y-auto custom-scrollbar flex-1">
          <div className="relative h-64 w-full sm:h-80">
            <img 
              src={news.image} 
              alt={news.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 p-6 sm:p-8 text-white w-full">
              <div className="flex items-center gap-3 text-sm mb-2 opacity-90">
                <span className="bg-yellow-500 text-black px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
                  {news.author || 'Tin tức'}
                </span>
                <span>{news.date}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white shadow-sm">
                {news.title}
              </h2>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <p className="text-lg font-medium text-gray-700 mb-6 italic border-l-4 border-yellow-400 pl-4 bg-gray-50 py-2 rounded-r-lg">
              {news.excerpt}
            </p>

            <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed">
              {news.content ? (
                <div dangerouslySetInnerHTML={{ __html: news.content }} />
              ) : (
                <p>
                 (Nội dung chi tiết bài viết đang được cập nhật...)
                 <br/><br/>
                 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 flex justify-end bg-gray-50">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Đóng bài viết
          </button>
        </div>
      </div>
    </div>
  );
}