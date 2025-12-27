import React from 'react';

interface NewsCardProps {
  item: any;
  onSelect: (item: any) => void;
}

export default function NewsCard({ item, onSelect }: NewsCardProps) {
  return (
    <article 
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full border border-gray-100 group cursor-pointer"
      onClick={() => onSelect(item)}
    >
      <div className="relative h-48 w-full overflow-hidden rounded-t-2xl">
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
      </div>

      <div className="flex flex-col flex-1 pt-4 pb-5 px-5">
        <div className="text-xs text-gray-500 flex items-center gap-2 mb-3 font-medium">
          <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{item.author}</span>
          <span className="text-gray-300">•</span>
          <span>{item.date}</span>
          {/* [SỬA]: Đã xóa phần hiển thị Views ở đây */}
        </div>

        <h3 className="text-lg font-bold mb-3 leading-snug text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
          {item.title}
        </h3>

        <p className="text-sm text-gray-500 mb-4 line-clamp-3 flex-1 leading-relaxed">
          {item.excerpt}
        </p>

        <div className="mt-auto pt-3 border-t border-gray-50">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(item);
            }}
            className="inline-flex items-center text-blue-600 font-semibold text-sm hover:underline"
          >
            Đọc tiếp
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}