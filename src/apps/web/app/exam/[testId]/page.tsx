import React from 'react';
import ExamContainer from '@/components/exam/ExamContainer';

// Định nghĩa params cho Next.js 15 (Promise) hoặc Next.js 13/14
type Params = Promise<{ testId: string }>;

// Giả lập hàm lấy data (Thay thế bằng logic gọi DB/API thật của bạn)
async function getExamPages(testId: string) {
  // LƯU Ý: Khi fetch trong Server Component, bạn cần dùng absolute URL 
  // hoặc gọi trực tiếp vào Service/DB nếu database chung chỗ.
  // Ở môi trường local dev thường cần http://localhost:3000
  
  try {
    // Cách 1: Fetch qua API nội bộ (cần URL đầy đủ). Hiện tại đang hard code testId là 123, bạn thay đổi theo nhu cầu. ${testId}
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/exam/123/pages`, {
       cache: 'no-store' // Đảm bảo luôn lấy dữ liệu mới nhất
    });
    
    if (!res.ok) return [];
    const data = await res.json();
    return data.pages || [];
  } catch (error) {
    console.error("Failed to fetch exam pages:", error);
    return [];
  }
}

export default async function ExamPage(props: { params: Params }) {
  // Unwrapping params (Next.js 15 pattern)
  const params = await props.params;
  const { testId } = params;

  // Fetch data bên phía server
  const pages = await getExamPages(testId);

  return (
    <div className="min-h-screen flex flex-col h-screen">
      <main className="flex-1 overflow-hidden p-4 bg-gray-50">
         {/* Truyền data xuống Client Component */}
         <ExamContainer 
            testId={testId} 
            initialPages={pages} 
         />
      </main>
    </div>
  );
}