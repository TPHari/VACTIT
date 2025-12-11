import React from 'react';
import Image from 'next/image';

export default function Topbar() {
  return (
    // THAY ĐỔI:
    // 1. left-[18rem]: 18rem = 288px (để né sidebar ra)
    // 2. top-4 right-4: Cách đều cạnh trên và phải
    // 3. rounded-2xl: Bo góc
    <header className="fixed top-4 right-4 left-[18rem] h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between px-6 z-40 transition-all duration-300">
      
      {/* Search Bar */}
      <div className="flex items-center bg-gray-50 rounded-xl px-4 py-2 w-full max-w-md border border-gray-100 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
        <input
          type="text"
          placeholder="Tìm kiếm bài thi, tài liệu..."
          className="bg-transparent border-none outline-none text-sm text-gray-700 w-full placeholder-gray-400 font-medium"
        />
        <button className="ml-2 p-1 text-gray-400 hover:text-blue-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </button>
      </div>

      {/* Profile Section */}
      <div className="flex items-center gap-4">
        <button className="relative p-2.5 bg-gray-50 hover:bg-blue-50 rounded-xl transition-colors group">
          <Image
             src="/assets/logos/bell.png"
             alt="Notify"
             width={20}
             height={20}
             className="opacity-60 group-hover:opacity-100 transition-opacity"
          />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-bold text-gray-800">Quang Thanh</div>
            <div className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-md inline-block">ID: 012345</div>
          </div>
          <div className="relative w-10 h-10 ring-2 ring-gray-100 rounded-full overflow-hidden">
            <img 
              src="/assets/logos/avatar.png"
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}