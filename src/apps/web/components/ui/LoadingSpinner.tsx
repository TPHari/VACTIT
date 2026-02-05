import React from 'react';
// Import spinner từ thư viện
import { FadeLoader, HashLoader } from 'react-spinners';

export default function Loading() {
  return (
    // Container: Full màn hình, Nền Xanh đậm (#2563EB), nằm trên cùng
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#2563EB] text-white">

      {/* --- CHỌN 1 TRONG 2 KIỂU DƯỚI ĐÂY --- */}

      {/* Kiểu 1: HashLoader (2 thanh đan chéo xoay - Rất hiện đại & Tech) */}
      <div className="mb-8 scale-150">
        <HashLoader color="#FFD700" size={60} />
      </div>

      {/* Kiểu 2: FadeLoader (Các vạch xoay tròn - Giống iOS, rất gọn) */}
      {/* <div className="mb-8 scale-150">
         <FadeLoader color="#FACC15" height={15} width={5} margin={2} />
      </div> */}

      {/* ------------------------------------- */}

      {/* Text thông báo */}
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold tracking-widest uppercase drop-shadow-md animate text-[#FFD700]">
          ĐANG TẢI DỮ LIỆU
        </h3>
        <p className="text-blue-100 opacity-90 text-sm font-medium">
          Hệ thống đang xử lý, vui lòng đợi giây lát...
        </p>
      </div>
    </div>
  );
}