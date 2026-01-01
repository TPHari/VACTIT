import React from 'react';
import Loading from '@/components/ui/LoadingSpinner';

export default function LoadingExam() {
  return (
    // Dùng thẻ div full màn hình màu trắng để che đi nội dung cũ
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <Loading />
    </div>
  );
}