'use client';

import React from 'react';

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  score: number;
}

const PodiumStep = ({ user, rank }: { user: LeaderboardUser; rank: 1 | 2 | 3 }) => {
  // Config chi tiết cho từng hạng
  const config = {
    1: { 
        height: 'h-40', 
        color: 'bg-[#FFF9C4] border-yellow-300', 
        trophy: '/assets/logos/trophy.png',
        iconPosition: '-top-8 left-4  w-14 h-14',
        avatarRing: 'ring-4 ring-[#FFD700]', 
    },
    2: { 
        height: 'h-32', 
        color: 'bg-gray-100 border-gray-300', 
        trophy: '/assets/logos/trophy2.png',
        iconPosition: '-top-5 right-1 w-8 h-8',
        avatarRing: 'ring-0',
    },
    3: { 
        height: 'h-24', 
        color: 'bg-[#FFCCBC] border-orange-300', 
        trophy: '/assets/logos/trophy3.png',
        // Top 3: Chính giữa avatar (Centered)
        iconPosition: '-top-3 left-1/2 -translate-x-1/2 w-4 h-4',
        avatarRing: 'ring-0',
    },
  };

  const style = config[rank];

  return (
    <div className="flex flex-col items-center justify-end group w-full">
      {/* Avatar Section */}
      <div className={`relative mb-4 transition-transform duration-300 group-hover:-translate-y-2`}>
        {/* Avatar Circle */}
        <div className={`w-16 h-16 rounded-full overflow-hidden shadow-md bg-white ${style.avatarRing}`}>
            <img 
              src={user.avatar || '/default-avatar.png'} 
              alt={user.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${user.name}&background=random`;
              }} 
            />
        </div>
        
        {/* Trophy/Crown Icon */}
        <div className={`absolute flex items-center justify-center filter drop-shadow-sm z-20 ${style.iconPosition}`}>
           <img 
             src={style.trophy} 
             alt={`Top ${rank}`} 
             className="w-full h-full object-contain"
           />
        </div>
      </div>

      {/* Info */}
      <div className="text-center mb-2 w-full px-1">
        <p className="font-bold text-gray-800 text-sm truncate w-full" title={user.name}>
            {user.name}
        </p>
        <p className="font-extrabold text-blue-600 text-lg">
            {user.score}
        </p>
      </div>

      {/* Podium Block */}
      <div className={`w-full ${style.height} ${style.color} border-t-4 rounded-t-xl flex items-end justify-center pb-4 shadow-sm relative overflow-hidden`}>
         {/* Số hạng hiển thị to và mờ */}
         <span className="text-5xl font-black text-black/10 select-none">{rank}</span>
      </div>
    </div>
  );
};

export default function Podium({ top3 }: { top3: LeaderboardUser[] }) {
  if (!top3 || top3.length === 0) return null;

  const first = top3[0];
  const second = top3[1];
  const third = top3[2];

  return (
    <div className="flex items-end justify-center gap-4 w-full max-w-lg mx-auto mb-8 pt-10 px-4 h-64">
      {/* Hạng 2 */}
      <div className="w-1/3 order-1 flex justify-center">
         {second ? <PodiumStep user={second} rank={2} /> : <div className="w-full h-32"></div>}
      </div>

      {/* Hạng 1 */}
      <div className="w-1/3 order-2 -mt-10 flex justify-center z-10"> 
         {first && <PodiumStep user={first} rank={1} />}
      </div>

      {/* Hạng 3 */}
      <div className="w-1/3 order-3 flex justify-center">
         {third ? <PodiumStep user={third} rank={3} /> : <div className="w-full h-24"></div>}
      </div>
    </div>
  );
}