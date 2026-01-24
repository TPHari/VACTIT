"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsRoutes = newsRoutes;
const notification_1 = require("../utils/notification");
async function newsRoutes(server) {
    // 1. GET /api/news - Lấy danh sách tin tức
    server.get('/api/news', async (request, reply) => {
        try {
            const newsList = await server.prisma.news.findMany({
                orderBy: { created_at: 'desc' }, // Tin mới nhất lên đầu
                // Có thể thêm phân trang (skip/take) nếu muốn sau này
            });
            return { data: newsList };
        }
        catch (error) {
            server.log.error(error);
            reply.status(500);
            return { error: 'Failed to fetch news' };
        }
    });
    // 2. POST /api/news - Tạo tin tức (Dùng để seed data)
    server.post('/api/news', async (request, reply) => {
        try {
            const newArticle = await server.prisma.news.create({
                data: request.body
            });
            // LOGIC THÔNG BÁO TỰ ĐỘNG
            // ✅ Pass server.redis để invalidate cache
            await (0, notification_1.createBroadcastNotification)(server.prisma, server.redis, {
                title: 'Tin tức mới! 📰',
                message: newArticle.title,
                type: 'news',
                link: `/news?id=${newArticle.news_id}`
            });
            return { data: newArticle };
        }
        catch (error) {
            server.log.error(error);
            reply.status(500);
            return { error: 'Failed to create news' };
        }
    });
}
