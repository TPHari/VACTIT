"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = require("fastify");
const client_1 = require("@prisma/client");
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const prisma = new client_1.PrismaClient();
const server = (0, fastify_1.fastify)({
    logger: true
});
// CORS for frontend access
server.register(require('@fastify/cors'), {
    origin: true, // Allow all origins in development
});
// Setup Redis connection (only if REDIS_URL is provided)
const redisConnection = process.env.REDIS_URL
    ? new ioredis_1.default(process.env.REDIS_URL, {
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
        retryStrategy: (times) => Math.min(times * 50, 2000),
    })
    : undefined;
// Setup queues (only if Redis is available)
const scoringQueue = redisConnection
    ? new bullmq_1.Queue('scoring-queue', { connection: redisConnection })
    : null;
const rankingQueue = redisConnection
    ? new bullmq_1.Queue('ranking-queue', { connection: redisConnection })
    : null;
// Log Redis connection status
if (redisConnection) {
    redisConnection.on('connect', () => {
        console.log('Redis connected');
    });
    redisConnection.on('error', (err) => {
        console.error('Redis connection error:', err.message);
    });
}
else {
    console.warn('Redis not configured - queue features disabled');
}
// Root endpoint (useful for Render health checks and quick info)
server.get('/', async (request, reply) => {
    return {
        name: 'VACTIT API',
        status: 'ok',
        message: 'See /health for status or /api for endpoints',
        links: {
            health: '/health',
            api: '/api'
        }
    };
});
// Request logging
server.addHook('onRequest', async (request, reply) => {
    console.log(`[${new Date().toISOString()}] ${request.method} ${request.url}`);
});
server.addHook('onResponse', async (request, reply) => {
    console.log(`[${new Date().toISOString()}] ${request.method} ${request.url} - ${reply.statusCode} (${reply.getResponseTime().toFixed(2)}ms)`);
});
// Optional: avoid noisy 404s for browsers requesting favicon
server.get('/favicon.ico', async (request, reply) => {
    reply.status(204).send();
});
// Health check endpoint
server.get('/health', async (request, reply) => {
    const health = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        redis: 'disconnected',
        uptime: process.uptime(),
    };
    // Test database
    try {
        await prisma.$queryRaw `SELECT 1`;
        health.database = 'connected';
    }
    catch (error) {
        health.status = 'error';
        health.database = 'disconnected';
        health.error = error.message;
    }
    // Test Redis (if available)
    if (redisConnection) {
        try {
            await redisConnection.ping();
            health.redis = 'connected';
        }
        catch (error) {
            health.redis = 'disconnected';
        }
    }
    else {
        health.redis = 'not configured';
    }
    return reply.code(health.status === 'ok' ? 200 : 500).send(health);
});
// API Info endpoint
server.get('/api', async (request, reply) => {
    return {
        name: 'VACTIT API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            users: '/api/users',
            tests: '/api/tests',
            trials: '/api/trials'
        }
    };
});
// ===== USER ROUTES =====
server.get('/api/users', async (request, reply) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                user_id: true,
                name: true,
                email: true,
                role: true,
                membership: true,
                created_at: true
            }
        });
        return { data: users, count: users.length };
    }
    catch (error) {
        reply.status(500);
        return { error: error instanceof Error ? error.message : 'Failed to fetch users' };
    }
});
server.get('/api/users/:id', async (request, reply) => {
    try {
        const user = await prisma.user.findUnique({
            where: { user_id: request.params.id },
            include: {
                authoredTests: true,
                trials: true
            }
        });
        if (!user) {
            reply.status(404);
            return { error: 'User not found' };
        }
        return { data: user };
    }
    catch (error) {
        reply.status(500);
        return { error: error instanceof Error ? error.message : 'Failed to fetch user' };
    }
});
server.post('/api/users', async (request, reply) => {
    try {
        const user = await prisma.user.create({
            data: request.body
        });
        reply.status(201);
        return { data: user };
    }
    catch (error) {
        reply.status(400);
        return { error: error instanceof Error ? error.message : 'Failed to create user' };
    }
});
// ===== TEST ROUTES =====
server.get('/api/tests', async (request, reply) => {
    try {
        const tests = await prisma.test.findMany({
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
        return { error: error instanceof Error ? error.message : 'Failed to fetch tests' };
    }
});
server.get('/api/tests/:id', async (request, reply) => {
    try {
        const test = await prisma.test.findUnique({
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
        return { error: error instanceof Error ? error.message : 'Failed to fetch test' };
    }
});
server.post('/api/tests', async (request, reply) => {
    try {
        const test = await prisma.test.create({
            data: request.body
        });
        reply.status(201);
        return { data: test };
    }
    catch (error) {
        reply.status(400);
        return { error: error instanceof Error ? error.message : 'Failed to create test' };
    }
});
// ===== TRIAL ROUTES =====
server.get('/api/trials', async (request, reply) => {
    try {
        const trials = await prisma.trial.findMany({
            include: {
                student: {
                    select: {
                        user_id: true,
                        name: true,
                        email: true
                    }
                },
                test: {
                    select: {
                        test_id: true,
                        title: true,
                        type: true
                    }
                },
                _count: {
                    select: { responses: true }
                }
            }
        });
        return { data: trials, count: trials.length };
    }
    catch (error) {
        reply.status(500);
        return { error: error instanceof Error ? error.message : 'Failed to fetch trials' };
    }
});
server.get('/api/trials/:id', async (request, reply) => {
    try {
        const trial = await prisma.trial.findUnique({
            where: { trial_id: request.params.id },
            include: {
                student: true,
                test: true,
                responses: true
            }
        });
        if (!trial) {
            reply.status(404);
            return { error: 'Trial not found' };
        }
        return { data: trial };
    }
    catch (error) {
        reply.status(500);
        return { error: error instanceof Error ? error.message : 'Failed to fetch trial' };
    }
});
server.post('/api/trials', async (request, reply) => {
    try {
        const trial = await prisma.trial.create({
            data: request.body
        });
        reply.status(201);
        return { data: trial };
    }
    catch (error) {
        reply.status(400);
        return { error: error instanceof Error ? error.message : 'Failed to create trial' };
    }
});
// ============ Job Queue Endpoints ============
// Queue health check
server.get('/health/queue', async (request, reply) => {
    if (!scoringQueue) {
        return reply.code(503).send({
            error: 'Queue not configured',
            redis: 'disconnected'
        });
    }
    try {
        const jobCounts = await scoringQueue.getJobCounts();
        return reply.send({
            status: 'ok',
            queue: 'scoring-queue',
            jobs: jobCounts,
        });
    }
    catch (error) {
        return reply.code(500).send({
            error: 'Failed to get queue status',
            message: error.message
        });
    }
});
// Submit scoring job
server.post('/api/jobs/score-test', async (request, reply) => {
    if (!scoringQueue) {
        return reply.code(503).send({
            error: 'Queue service unavailable',
            message: 'Redis connection not configured'
        });
    }
    const { trialId, userId } = request.body;
    if (!trialId || !userId) {
        return reply.code(400).send({
            error: 'Missing required fields',
            message: 'trialId and userId are required'
        });
    }
    try {
        const job = await scoringQueue.add('score-trial', {
            trialId,
            userId,
            timestamp: new Date().toISOString(),
        });
        return reply.code(202).send({
            message: 'Job queued for processing',
            jobId: job.id,
            data: job.data,
        });
    }
    catch (error) {
        return reply.code(500).send({
            error: 'Failed to queue job',
            message: error.message
        });
    }
});
// Get job status
server.get('/api/jobs/status/:jobId', async (request, reply) => {
    if (!scoringQueue) {
        return reply.code(503).send({ error: 'Queue service unavailable' });
    }
    const { jobId } = request.params;
    try {
        const job = await scoringQueue.getJob(jobId);
        if (!job) {
            return reply.code(404).send({ error: 'Job not found' });
        }
        const state = await job.getState();
        return reply.send({
            jobId: job.id,
            state,
            progress: job.progress,
            data: job.data,
            returnvalue: job.returnvalue,
            failedReason: job.failedReason,
        });
    }
    catch (error) {
        return reply.code(500).send({
            error: 'Failed to get job status',
            message: error.message
        });
    }
});
// ============ Response Endpoints ============
// ===== RESPONSE ROUTES =====
server.get('/api/responses', async (request, reply) => {
    try {
        const responses = await prisma.response.findMany({
            include: {
                trial: {
                    select: {
                        trial_id: true,
                        student_id: true,
                        test_id: true
                    }
                }
            }
        });
        return { data: responses, count: responses.length };
    }
    catch (error) {
        reply.status(500);
        return { error: error instanceof Error ? error.message : 'Failed to fetch responses' };
    }
});
server.post('/api/responses', async (request, reply) => {
    try {
        const response = await prisma.response.create({
            data: request.body
        });
        reply.status(201);
        return { data: response };
    }
    catch (error) {
        reply.status(400);
        return { error: error instanceof Error ? error.message : 'Failed to create response' };
    }
});
// Graceful shutdown
const closeGracefully = async (signal) => {
    console.log(`Received signal ${signal}, closing server gracefully...`);
    await server.close();
    await prisma.$disconnect();
    process.exit(0);
};
process.on('SIGINT', () => closeGracefully('SIGINT'));
process.on('SIGTERM', () => closeGracefully('SIGTERM'));
exports.default = server;
