// services/api/src/routes/news.routes.ts
import { FastifyInstance } from 'fastify';

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
      return { data: newArticle };
    } catch (error) {
      server.log.error(error);
      reply.status(500);
      return { error: 'Failed to create news' };
    }
  });
}