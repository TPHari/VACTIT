// services/api/src/routes/news.routes.ts
import { FastifyInstance } from 'fastify';
import { createBroadcastNotification } from '../utils/notification';
export async function newsRoutes(server: FastifyInstance) {
  
  // 1. GET /api/news - Lấy danh sách tin tức
  server.get('/api/news', async (request, reply) => {
    try {
      const newsList = await server.prisma.news.findMany({
        orderBy: { created_at: 'desc' }, // Tin mới nhất lên đầu
        // Có thể thêm phân trang (skip/take) nếu muốn sau này
      });

      return { data: newsList };
    } catch (error) {
      server.log.error(error);
      reply.status(500);
      return { error: 'Failed to fetch news' };
    }
  });

  // 2. POST /api/news - Tạo tin tức (Dùng để seed data)
  server.post('/api/news', async (request, reply) => {
    try {
      const newArticle = await server.prisma.news.create({
        data: request.body as any
      });
      // LOGIC THÔNG BÁO
      await createBroadcastNotification(server.prisma, {
        title: 'Tin tức mới! 📰',
        message: newArticle.title, // Lấy tiêu đề tin làm nội dung
        type: 'news',
        link: `/news?id=${newArticle.news_id}` // Link trỏ tới tin đó
      });

      return { data: newArticle };
    } catch (error) {
      server.log.error(error);
      reply.status(500);
      return { error: 'Failed to create news' };
    }
  });
}