import { fastify } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const server = fastify({
  logger: true
});

// CORS for frontend access
server.register(require('@fastify/cors'), {
  origin: true, // Allow all origins in development
});

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

// Optional: avoid noisy 404s for browsers requesting favicon
server.get('/favicon.ico', async (request, reply) => {
  reply.status(204).send();
});

// Health check endpoint
server.get('/health', async (request, reply) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { 
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected'
    };
  } catch (error) {
    reply.status(503);
    return { 
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
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
  } catch (error) {
    reply.status(500);
    return { error: error instanceof Error ? error.message : 'Failed to fetch users' };
  }
});

server.get<{ Params: { id: string } }>('/api/users/:id', async (request, reply) => {
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
  } catch (error) {
    reply.status(500);
    return { error: error instanceof Error ? error.message : 'Failed to fetch user' };
  }
});

server.post<{ Body: any }>('/api/users', async (request, reply) => {
  try {
    const user = await prisma.user.create({
      data: request.body as any
    });
    reply.status(201);
    return { data: user };
  } catch (error) {
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
  } catch (error) {
    reply.status(500);
    return { error: error instanceof Error ? error.message : 'Failed to fetch tests' };
  }
});

server.get<{ Params: { id: string } }>('/api/tests/:id', async (request, reply) => {
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
  } catch (error) {
    reply.status(500);
    return { error: error instanceof Error ? error.message : 'Failed to fetch test' };
  }
});

server.post<{ Body: any }>('/api/tests', async (request, reply) => {
  try {
    const test = await prisma.test.create({
      data: request.body as any
    });
    reply.status(201);
    return { data: test };
  } catch (error) {
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
  } catch (error) {
    reply.status(500);
    return { error: error instanceof Error ? error.message : 'Failed to fetch trials' };
  }
});

server.get<{ Params: { id: string } }>('/api/trials/:id', async (request, reply) => {
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
  } catch (error) {
    reply.status(500);
    return { error: error instanceof Error ? error.message : 'Failed to fetch trial' };
  }
});

server.post<{ Body: any }>('/api/trials', async (request, reply) => {
  try {
    const trial = await prisma.trial.create({
      data: request.body as any
    });
    reply.status(201);
    return { data: trial };
  } catch (error) {
    reply.status(400);
    return { error: error instanceof Error ? error.message : 'Failed to create trial' };
  }
});

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
  } catch (error) {
    reply.status(500);
    return { error: error instanceof Error ? error.message : 'Failed to fetch responses' };
  }
});

server.post<{ Body: any }>('/api/responses', async (request, reply) => {
  try {
    const response = await prisma.response.create({
      data: request.body as any
    });
    reply.status(201);
    return { data: response };
  } catch (error) {
    reply.status(400);
    return { error: error instanceof Error ? error.message : 'Failed to create response' };
  }
});

// Graceful shutdown
const closeGracefully = async (signal: string) => {
  console.log(`Received signal ${signal}, closing server gracefully...`);
  await server.close();
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGINT', () => closeGracefully('SIGINT'));
process.on('SIGTERM', () => closeGracefully('SIGTERM'));

export default server;
