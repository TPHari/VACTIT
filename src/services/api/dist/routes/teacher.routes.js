"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teacherRoutes = teacherRoutes;
async function teacherRoutes(server) {
    // GET /api/teachers
    server.get('/api/teachers', async (request, reply) => {
        try {
            // Gọi prisma từ server đã được decorate hoặc import trực tiếp
            const teachers = await server.prisma.user.findMany({
                where: {
                    role: 'Author',
                },
                select: {
                    user_id: true,
                    name: true,
                    email: true,
                    phone: true,
                    role: true,
                    _count: {
                        select: { authoredTests: true } // Đếm số bài thi đã tạo
                    }
                }
            });
            return { data: teachers };
        }
        catch (error) {
            server.log.error(error);
            return reply.code(500).send({ error: 'Failed to fetch teachers' });
        }
    });
}
