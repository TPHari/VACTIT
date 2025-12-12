import React from 'react';

export default function Loading() {
  // Tạo 12 chấm tròn
  const dots = Array.from({ length: 12 });

  return (
    // Container: Full màn hình, z-index cao nhất, nền Xanh, font chữ đẹp
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-primary text-white font-sans">
      
      {/* Khung chứa vòng tròn: 
         - h-32 w-32: Đủ rộng để các chấm xoay không bị lòi ra ngoài
         - mb-12: Đẩy phần chữ xuống xa hơn, tránh bị đè
      */}
      <div className="relative h-32 w-32 mb-12">
        {dots.map((_, i) => {
          // Tính góc xoay (30 độ mỗi chấm)
          const rotation = i * 30;
          // Độ trễ để tạo hiệu ứng sóng (đuổi nhau)
          const delay = `${i * 0.1}s`;

          return (
            <div
              key={i}
              // Định vị chấm ở giữa cạnh trên, sau đó xoay quanh tâm khung chứa
              className="absolute left-1/2 top-0 h-full w-4 origin-bottom -translate-x-1/2"
              style={{
                transform: `rotate(${rotation}deg)`,
              }}
            >
              {/* Chấm tròn Vàng (bg-accent) */}
              <div 
                className="mx-auto h-4 w-4 rounded-full bg-accent shadow-lg shadow-black/20 animate-dot-wave"
                style={{
                  animationDelay: delay, 
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Phần Text thông báo */}
      <div className="text-center z-10">
        <h3 className="text-2xl font-bold tracking-widest uppercase drop-shadow-md">
          Đang tải dữ liệu
        </h3>
        <p className="text-blue-100 opacity-90 text-sm font-medium mt-2 animate-pulse">
          Vui lòng đợi trong giây lát...
        </p>
      </div>
    </div>
  );
}