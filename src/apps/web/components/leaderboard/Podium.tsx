import React from 'react';
import Image from 'next/image';
import { LeaderboardUser } from '../../mockData/mockLeaderboard';

// Component hiển thị 1 người trên bục
const PodiumStep = ({ user, rank }: { user: LeaderboardUser; rank: 1 | 2 | 3 }) => {
  // Config màu sắc và chiều cao cho từng hạng
  const config = {
    1: { height: 'h-40', color: 'bg-yellow-100 border-yellow-300', icon: '👑', ring: 'ring-yellow-400' },
    2: { height: 'h-32', color: 'bg-gray-100 border-gray-300', icon: '🥈', ring: 'ring-gray-300' },
    3: { height: 'h-24', color: 'bg-orange-100 border-orange-300', icon: '🥉', ring: 'ring-orange-300' },
  };

  const style = config[rank];

  return (
    <div className="flex flex-col items-center justify-end group">
      {/* Avatar bay lên bay xuống animation nhẹ */}
      <div className={`relative mb-2 transition-transform duration-300 group-hover:-translate-y-2`}>
        <div className={`w-16 h-16 rounded-full border-4 ${style.ring} overflow-hidden shadow-lg`}>
           <Image src={user.avatar} alt={user.name} width={64} height={64} className="object-cover" />
        </div>
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md text-lg">
           {style.icon}
        </div>
      </div>

      {/* Info */}
      <div className="text-center mb-2">
        <p className="font-bold text-gray-800 text-sm truncate max-w-[100px]">{user.name}</p>
        <p className="font-extrabold text-blue-600 text-lg">{user.score}</p>
      </div>

      {/* Cái bục */}
      <div className={`w-full ${style.height} ${style.color} border-t-4 rounded-t-xl flex items-end justify-center pb-4 shadow-sm relative overflow-hidden`}>
         {/* Số hạng in mờ trên bục */}
         <span className="text-4xl font-black opacity-20">{rank}</span>
      </div>
    </div>
  );
};

export default function Podium({ top3 }: { top3: LeaderboardUser[] }) {
  // Logic sắp xếp: Hạng 2 (Trái) - Hạng 1 (Giữa) - Hạng 3 (Phải)
  // top3 đầu vào đang là [1, 2, 3]
  
  if (top3.length < 3) return null;

  return (
    <div className="flex items-end justify-center gap-4 w-full max-w-lg mx-auto mb-10 pt-8 px-4">
      <div className="w-1/3 order-1">
         <PodiumStep user={top3[1]} rank={2} />
      </div>
      <div className="w-1/3 order-2 -mt-8"> {/* Hạng 1 cao hơn chút */}
         <PodiumStep user={top3[0]} rank={1} />
      </div>
      <div className="w-1/3 order-3">
         <PodiumStep user={top3[2]} rank={3} />
      </div>
    </div>
  );
}