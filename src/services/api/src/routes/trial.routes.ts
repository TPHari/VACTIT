import { FastifyInstance } from 'fastify';

export async function trialRoutes(server: FastifyInstance) {
  // Get all trials
  server.get('/api/trials', async (request, reply) => {
    try {
      const trials = await server.prisma.trial.findMany({
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
      return { 
        error: error instanceof Error ? error.message : 'Failed to fetch trials' 
      };
    }
  });

  // Get trial by ID
  server.get<{ Params: { id: string } }>('/api/trials/:id', async (request, reply) => {
    try {
      const trial = await server.prisma.trial.findUnique({
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
      return { 
        error: error instanceof Error ? error.message : 'Failed to fetch trial' 
      };
    }
  });

  // Create trial
  server.post('/api/trials', async (request, reply) => {
    try {
      const trial = await server.prisma.trial.create({
        data: request.body as any
      });
      reply.status(201);
      return { data: trial };
    } catch (error) {
      reply.status(400);
      return { 
        error: error instanceof Error ? error.message : 'Failed to create trial' 
      };
    }
  });
}
