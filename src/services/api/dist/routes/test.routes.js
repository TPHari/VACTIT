"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testRoutes = testRoutes;
async function testRoutes(server) {
    // Get all tests
    server.get('/api/tests', async (request, reply) => {
        try {
            const tests = await server.prisma.test.findMany({
                include: {
                    author: {
                        select: {
                            user_id: true,
                            name: true,
                            email: true
                        }
                    },
                    _count: {
                        select: { trials: true }
                    }
                }
            });
            return { data: tests, count: tests.length };
        }
        catch (error) {
            reply.status(500);
            return {
                error: error instanceof Error ? error.message : 'Failed to fetch tests'
            };
        }
    });
    // Get test by ID
    server.get('/api/tests/:id', async (request, reply) => {
        try {
            const test = await server.prisma.test.findUnique({
                where: { test_id: request.params.id },
                include: {
                    author: true,
                    trials: true
                }
            });
            if (!test) {
                reply.status(404);
                return { error: 'Test not found' };
            }
            return { data: test };
        }
        catch (error) {
            reply.status(500);
            return {
                error: error instanceof Error ? error.message : 'Failed to fetch test'
            };
        }
    });
    // Create test
    server.post('/api/tests', async (request, reply) => {
        try {
            const test = await server.prisma.test.create({
                data: request.body
            });
            reply.status(201);
            return { data: test };
        }
        catch (error) {
            reply.status(400);
            return {
                error: error instanceof Error ? error.message : 'Failed to create test'
            };
        }
    });
}
