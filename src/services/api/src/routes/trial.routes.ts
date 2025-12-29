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

      // require a user id to enforce "one trial per user per test"
      if (!userId) {
        reply.status(400);
        return { error: 'missing_user_id' };
      }

      // Verify student exists
      const student = await server.prisma.user.findUnique({
        where: { user_id: userId },
        select: { user_id: true }
      });

      if (!student) {
        reply.status(404);
        return { error: 'student_not_found' };
      }

      // Verify test exists
      const test = await server.prisma.test.findUnique({
        where: { test_id: testId },
      });

      if (!test) {
        reply.status(404);
        return { error: 'test_not_found' };
      }

      // Check if this user already has a trial for this test
      const existingTrialforExam = await server.prisma.trial.findFirst({
        where: {
          test_id: testId,
          student_id: userId,
          test: {
            type: "exam"
          }
        },
        select: {
          trial_id: true,
          test_id: true,
          test: {
            select: {
              title: true
            }
          },
          start_time: true,
          end_time: true
        }
      });
      console.log("existingTrialforExam", existingTrialforExam);

      if (existingTrialforExam) {
        reply.status(200);
        return { data: existingTrialforExam, alreadyDone: true };
      }

      const start = new Date();
      // duration is in minutes, default to 0 if null
      const end = new Date(start.getTime() + (test.duration || 0) * 60000);
      const trialId = generateTrialId();

      const trial = await server.prisma.trial.create({
        data: {
          trial_id: trialId,
          start_time: start,
          end_time: end,
          student: { connect: { user_id: userId } },
          test: { connect: { test_id: testId } },
        },
        select: {
          trial_id: true,
          test_id: true,
          start_time: true,
          end_time: true,
        },
      });

      reply.status(201);
      return { data: trial, alreadyDone: false };
    } catch (error) {
      reply.status(500);
      return {
        error: error instanceof Error ? error.message : 'Failed to create trial',
      };
    }
  });
}
