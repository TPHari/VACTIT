'use client';

import React from 'react';

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  score: number;
}

// Ribbon Card Component - Sử dụng SVG card (tăng 20%)
const RibbonCard = ({ user, rank }: { user: LeaderboardUser; rank: 1 | 2 | 3 }) => {
  // Config cho từng hạng - đã tăng 20%
  const config = {
    1: { 
      cardSvg: '/assets/icons/top1_card.svg',
      cardWidth: 'w-[10.8rem]',   // 9 * 1.2
      cardHeight: 'h-[14.4rem]',  // 12 * 1.2
      avatarSize: 'w-[4.8rem] h-[4.8rem]',  // 4 * 1.2
      avatarTop: 'top-[1.8rem]',
      nameTop: 'top-[7.2rem]',
      scoreTop: 'top-[8.7rem]',
      scoreSize: 'text-[2.7rem]',
      marginTop: '-mt-[3.6rem]',
      zIndex: 'z-20',
      shadowWidth: 'w-[6rem]',
      badgeRight: '-right-[-1rem]',  // TOP 1 dịch sang trái
    },
    2: { 
      cardSvg: '/assets/icons/top23_card.svg',
      cardWidth: 'w-[9rem]',      // 7.5 * 1.2
      cardHeight: 'h-[12rem]',    // 10 * 1.2
      avatarSize: 'w-[3.9rem] h-[3.9rem]',  // 3.25 * 1.2
      avatarTop: 'top-[1.7rem]',
      nameTop: 'top-[6rem]',
      scoreTop: 'top-[7.7rem]',
      scoreSize: 'text-[2.1rem]',
      marginTop: 'mt-0',
      zIndex: 'z-10',
      shadowWidth: 'w-[4.8rem]',
      badgeRight: '-right-[-0.4rem]',  // TOP 2 giữ nguyên
    },
    3: { 
      cardSvg: '/assets/icons/top23_card.svg',
      cardWidth: 'w-[9rem]',      // 7.5 * 1.2
      cardHeight: 'h-[12rem]',    // 10 * 1.2
      avatarSize: 'w-[3.9rem] h-[3.9rem]',  // 3.25 * 1.2
      avatarTop: 'top-[1.7rem]',
      nameTop: 'top-[6rem]',
      scoreTop: 'top-[7.7rem]',
      scoreSize: 'text-[2.1rem]',
      marginTop: 'mt-0',
      zIndex: 'z-10',
      shadowWidth: 'w-[4.8rem]',
      badgeRight: '-right-[-0.4rem]',  // TOP 3 giữ nguyên
    },
  };

  const style = config[rank];

  return (
    <div className={`flex flex-col items-center ${style.zIndex} ${style.marginTop}`}>
      {/* Card Container */}
      <div className={`relative ${style.cardWidth} ${style.cardHeight}`}>
        {/* Card SVG Background */}
        <img 
          src={style.cardSvg}
          alt={`Top ${rank} card`}
          className="absolute inset-0 w-full h-full object-contain"
        />
        
        {/* Badge TOP - Nền VÀNG, chữ XANH */}
        <div className={`absolute ${style.badgeRight} z-30`}>
          <div className="relative">
            <img 
              src="/assets/icons/badge.svg" 
              alt="Badge" 
              className="w-[2.1rem] h-[2.1rem] object-contain"
            />
            {/* Text TOP trên badge - MÀU XANH */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-[0.1rem]">
              <span className="text-[0.6rem] font-bold text-[#2864D2] leading-none">TOP</span>
              <span className="text-[0.6rem] font-semibold text-[#2864D2] leading-none">{rank}</span>
            </div>
          </div>
        </div>

        {/* Avatar với viền trắng */}
        <div className={`absolute ${style.avatarTop} left-1/2 -translate-x-1/2 ${style.avatarSize} rounded-full overflow-hidden border-[3px] border-[#FFD700] bg-white shadow-md`}>
          <img 
            src={user.avatar || '/default-avatar.png'} 
            alt={user.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${user.name}&background=e0e7ff&color=2864d2`;
            }} 
          />
        </div>

        {/* Tên - màu TRẮNG */}
        <p className={`absolute ${style.nameTop} left-1/2 -translate-x-1/2 text-white font-semibold text-[0.84rem] truncate max-w-[85%] text-center leading-tight`} title={user.name}>
          {user.name}
        </p>

        {/* Điểm - màu VÀNG */}
        <p className={`absolute ${style.scoreTop} left-1/2 -translate-x-1/2 text-[#FFD700] font-bold ${style.scoreSize} leading-none`}>
          {user.score}
        </p>
      </div>

      {/* Shadow - sử dụng SVG */}
      <img 
        src="/assets/icons/shadow_card.svg"
        alt="Shadow"
        className={`${style.shadowWidth} h-auto mt-[0.6rem]`}
      />
    </div>
  );
};

export default function Podium({ top3 }: { top3: LeaderboardUser[] }) {
  if (!top3 || top3.length === 0) return null;

  const first = top3[0];
  const second = top3[1];
  const third = top3[2];

  return (
    <div className="relative w-full">
      {/* Podium Cards Container */}
      <div className="relative flex items-end justify-center gap-[2rem] z-20 pb-[1rem] translate-y-[15%]">
        {/* Hạng 2 - Bên trái */}
        <div className="flex-shrink-0 translate-y-[15%]">
          {second ? <RibbonCard user={second} rank={2} /> : <div className="w-[9rem] h-[12rem]"></div>}
        </div>

        {/* Hạng 1 - Chính giữa (cao hơn) */}
        <div className="flex-shrink-0">
          {first && <RibbonCard user={first} rank={1} />}
        </div>

        {/* Hạng 3 - Bên phải */}
        <div className="flex-shrink-0 translate-y-[15%]">
          {third ? <RibbonCard user={third} rank={3} /> : <div className="w-[9rem] h-[12rem]"></div>}
        </div>
      </div>

      {/* Stage SVG - Ở phần dưới, dịch xuống để bị cắt, tăng 30% */}
      <div className="relative w-full mt-[0rem] scale-[1.1] translate-y-[-15%]">
        <img 
          src="/assets/icons/stage.svg"
          alt="Stage"
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}