import { FastifyInstance } from 'fastify';
import { generateTrialId } from '../utils/generateID';
import { z } from 'zod';

const createTrialSchema = z.object({
  testId: z.string().min(1),
  userId: z.string().optional(),
});

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
      const parsed = createTrialSchema.safeParse(request.body);
      if (!parsed.success) {
        reply.status(422);
        return { error: 'invalid_input', details: parsed.error.flatten() };
      }

      const { testId, userId } = parsed.data;

      // Verify test exists
      const test = await server.prisma.test.findUnique({
        where: { test_id: testId },
      });

      if (!test) {
        reply.status(404);
        return { error: 'test_not_found' };
      }
      const start = new Date()
  const end = new Date(start.getTime() + test.duration * 60000) // or compute end based on test.duration if required
  const trialId = generateTrialId();

  const trial = await server.prisma.trial.create({
    data: {
      trial_id: trialId,
      start_time: start,
      end_time: end,
      // connect required relations instead of setting scalar FK fields
      student: { connect: { user_id: userId } },
      test: { connect: { test_id: testId } },
    },
    select: {
      trial_id: true,
      test_id: true,
      start_time: true,
      end_time: true,
      // add other fields you need
    },
  })

      reply.status(201);
      return { data: trial };
    } catch (error) {
      reply.status(500);
      return {
        error: error instanceof Error ? error.message : 'Failed to create trial',
      };
    }
  });
}
