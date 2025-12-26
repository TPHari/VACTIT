// apps/web/mockData/mockLeaderboard.ts

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string; // URL ảnh
  score: number;
  time: string; // VD: "15p 30s"
  examCount: number; // Số đề đã làm
  trend: 'up' | 'down' | 'same'; // Xu hướng hạng so với tuần trước
}

// Helper random
const names = ["Quang Thanh", "Minh Anh", "Bảo Ngọc", "Hoàng Nam", "Thùy Linh", "Đức Thắng", "Mai Phương", "Gia Bảo", "Hương Ly", "Tuấn Kiệt"];

export const MOCK_LEADERBOARD: LeaderboardUser[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `user-${i + 1}`,
  name: names[i % names.length] + (i > 9 ? ` ${i}` : ''),
  avatar: '/assets/logos/avatar.png', // Dùng tạm ảnh avatar mặc định của bạn
  score: 1000 - (i * 15) - Math.floor(Math.random() * 10), // Điểm giảm dần để đúng logic rank
  time: `${45 + Math.floor(Math.random() * 15)}p ${Math.floor(Math.random() * 60)}s`,
  examCount: 20 + Math.floor(Math.random() * 30),
  trend: Math.random() > 0.6 ? 'up' : Math.random() > 0.3 ? 'down' : 'same'
}));