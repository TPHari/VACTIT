"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRoutes = notificationRoutes;
exports.createNotification = createNotification;
const zod_1 = require("zod");
// Redis keys
const CACHE_KEY = 'notifications:broadcast';
const VERSION_KEY = 'notifications:version';
const CACHE_TTL = 300; // 5 minutes
// Schema cho tạo notification mới
const createNotificationSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    message: zod_1.z.string().optional(),
    type: zod_1.z.enum(['exam', 'news', 'score', 'system']),
    link: zod_1.z.string().optional(),
    userId: zod_1.z.string().optional(), // null = broadcast to all
});
async function notificationRoutes(server) {
    // ========== GET /api/notifications ==========
    // Lấy danh sách thông báo broadcast (cached)
    server.get('/api/notifications', async (request, reply) => {
        try {
            //  Check Redis cache first
            if (server.redis) {
                try {
                    const cached = await server.redis.get(CACHE_KEY);
                    if (cached) {
                        console.log('Notifications cache HIT');
                        return JSON.parse(cached);
                    }
                    console.log('Notifications cache MISS');
                }
                catch (cacheErr) {
                    console.error('Cache read error:', cacheErr);
                }
            }
            // Query database
            const notifications = await server.prisma.notification.findMany({
                where: {
                    user_id: null // Chỉ lấy broadcast (gửi cho tất cả)
                },
                orderBy: {
                    created_at: 'desc'
                },
                take: 20
            });
            const response = { data: notifications };
            // ✅ Cache result
            if (server.redis) {
                try {
                    await server.redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(response));
                    console.log('💾 Cached notifications');
                }
                catch (cacheErr) {
                    console.error('Cache write error:', cacheErr);
                }
            }
            return response;
        }
        catch (error) {
            server.log.error(error);
            reply.status(500);
            return { error: 'Failed to fetch notifications' };
        }
    });
    // ========== GET /api/notifications/version ==========
    // Lightweight endpoint chỉ trả về version number
    // Frontend poll endpoint này thay vì full data
    server.get('/api/notifications/version', async (request, reply) => {
        try {
            let version = '0';
            if (server.redis) {
                try {
                    version = await server.redis.get(VERSION_KEY) || '0';
                }
                catch (err) {
                    console.error('Redis version read error:', err);
                }
            }
            return { version };
        }
        catch (error) {
            server.log.error(error);
            reply.status(500);
            return { error: 'Failed to get version', version: '0' };
        }
    });
    // ========== POST /api/notifications ==========
    // Tạo notification mới (Admin hoặc system call)
    server.post('/api/notifications', async (request, reply) => {
        try {
            const parsed = createNotificationSchema.safeParse(request.body);
            if (!parsed.success) {
                reply.status(422);
                return { error: 'invalid_input', details: parsed.error.flatten() };
            }
            const { title, message, type, link, userId } = parsed.data;
            // Create notification in database
            const notification = await server.prisma.notification.create({
                data: {
                    title,
                    message: message || null,
                    type,
                    link: link || null,
                    user_id: userId || null, // null = broadcast
                },
            });
            //  Invalidate cache & increment version
            if (server.redis) {
                try {
                    await server.redis.del(CACHE_KEY);
                    await server.redis.incr(VERSION_KEY);
                    console.log(' Cache invalidated, version incremented');
                }
                catch (err) {
                    console.error('Redis invalidation error:', err);
                }
            }
            reply.status(201);
            return { data: notification };
        }
        catch (error) {
            server.log.error(error);
            reply.status(500);
            return { error: 'Failed to create notification' };
        }
    });
}
// ========== HELPER: Tạo notification từ các modules khác ==========
// Gọi function này khi admin tạo test mới, hoặc khi có điểm mới
async function createNotification(prisma, redis, data) {
    try {
        const notification = await prisma.notification.create({
            data: {
                title: data.title,
                message: data.message || null,
                type: data.type,
                link: data.link || null,
                user_id: data.userId || null,
            },
        });
        // Invalidate cache & increment version
        if (redis) {
            try {
                await redis.del(CACHE_KEY);
                await redis.incr(VERSION_KEY);
                console.log('🔔 Notification created, cache invalidated');
            }
            catch (err) {
                console.error('Redis error:', err);
            }
        }
        return notification;
    }
    catch (error) {
        console.error('Failed to create notification:', error);
        return null;
    }
}
