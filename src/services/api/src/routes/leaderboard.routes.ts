import { FastifyInstance } from 'fastify';

export async function leaderboardRoutes(server: FastifyInstance) {
  server.get('/api/leaderboard', async (request, reply) => {
    try {
      // 1. Lấy user và trials của họ (chỉ lấy Author/Student có làm bài)
      // Lưu ý: Với dữ liệu lớn, nên dùng Raw SQL hoặc Aggregation. 
      // Với quy mô nhỏ/vừa, cách này ổn và dễ hiểu.
      const users = await server.prisma.user.findMany({
        where: {
          // Chỉ lấy những user đã từng làm bài thi
          trials: {
            some: {} 
          }
        },
        select: {
          user_id: true,
          name: true,
          trials: {
            select: {
              processed_score: true,
              start_time: true,
              end_time: true,
            }
          }
        }
      });

      // 2. Tính toán điểm số cho từng user
      const leaderboardData = users.map(user => {
        let totalScore = 0;
        let totalTime = 0; // milliseconds

        user.trials.forEach(trial => {
          // Cộng điểm (chuyển Decimal sang Number)
          totalScore += Number(trial.processed_score) || 0;
          
          // Tính thời gian làm bài
          const start = new Date(trial.start_time).getTime();
          const end = new Date(trial.end_time).getTime();
          totalTime += (end - start);
        });

        const examCount = user.trials.length;
        // Thời gian trung bình (phút)
        const avgTimeMinutes = examCount > 0 
          ? Math.floor((totalTime / examCount) / 60000) 
          : 0;

        return {
          id: user.user_id,
          name: user.name,
          avatar:'/default-avatar.png', // Fallback ảnh
          score: totalScore.toFixed(2), // Làm tròn 2 số thập phân
          examCount: examCount,
          time: `${avgTimeMinutes}p`, // Format: 30p
          trend: 'same', // Logic trend cần lịch sử, tạm thời để 'same'
        };
      });

      // 3. Sắp xếp: Điểm cao nhất lên đầu
      leaderboardData.sort((a, b) => Number(b.score) - Number(a.score));

      // 4. Trả về Top 100 (hoặc limit tùy ý)
      return { data: leaderboardData.slice(0, 100) };

    } catch (error) {
      server.log.error(error);
      return reply.code(500).send({ error: 'Failed to fetch leaderboard' });
    }
  });
}