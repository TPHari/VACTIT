import { FastifyInstance } from 'fastify';

export async function notificationRoutes(server: FastifyInstance) {
  
  // GET /api/notifications
  // Lấy danh sách thông báo (Broadcast) mới nhất
  server.get('/api/notifications', async (request, reply) => {
    try {
      // Logic lấy 20 thông báo broadcast mới nhất
      const notifications = await server.prisma.notification.findMany({
        where: {
          user_id: null // Chỉ lấy broadcast (gửi cho tất cả)
        },
        orderBy: {
          created_at: 'desc'
        },
        take: 20
      });

      return { data: notifications };
    } catch (error) {
      server.log.error(error);
      reply.status(500);
      return { error: 'Failed to fetch notifications' };
    }
  });
}