"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBroadcastNotification = void 0;
// Redis keys (shared with notification.routes.ts)
const CACHE_KEY = 'notifications:broadcast';
const VERSION_KEY = 'notifications:version';
const createBroadcastNotification = async (prisma, redis, data) => {
    try {
        console.log('📢 Creating broadcast notification:', data.title);
        const result = await prisma.notification.create({
            data: {
                title: data.title,
                message: data.message || null,
                type: data.type,
                link: data.link || null,
                user_id: data.userId || null,
            },
        });
        // ✅ Invalidate cache & increment version for real-time update
        if (redis) {
            try {
                await redis.del(CACHE_KEY);
                await redis.incr(VERSION_KEY);
                console.log('🔄 Notification cache invalidated, version incremented');
            }
            catch (redisErr) {
                console.error('Redis invalidation error:', redisErr);
            }
        }
        console.log('✅ Notification created:', result.notification_id);
        return result;
    }
    catch (error) {
        console.error('❌ Failed to create notification:', error);
        return null;
    }
};
exports.createBroadcastNotification = createBroadcastNotification;
