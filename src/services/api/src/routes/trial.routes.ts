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

  // Get trials by student
  server.get<{ Params: { studentId: string } }>(
    '/api/students/:studentId/trials',
    async (request, reply) => {
      try {
        const { studentId } = request.params;

        const trials = await server.prisma.trial.findMany({
          where: { student_id: studentId },
          orderBy: { start_time: 'desc' },
          include: {
            test: { select: { test_id: true, title: true, type: true, duration: true } },
            _count: { select: { responses: true } },
          },
        });

        return { data: trials, count: trials.length };
      } catch (error) {
        reply.status(500);
        return {
          error: error instanceof Error ? error.message : 'Failed to fetch student trials',
        };
      }
    }
  );

  server.get<{ Params: { id: string } }>(
  "/api/trials/:id/details",
  async (request, reply) => {
    try {
      const trialId = request.params.id;

      const trial = await server.prisma.trial.findUnique({
        where: { trial_id: trialId },
        include: {
          test: { select: { test_id: true, title: true, duration: true, type: true } },
          responses: {
            select: {
              question_id: true,
              chosen_option: true,
              response_time: true,
              question: { // requires Prisma relation Response -> Question
                select: {
                  question_id: true,
                  correct_option: true,
                  section: true,
                },
              },
            },
          },
        },
      });

      if (!trial) {
        reply.status(404);
        return { error: "Trial not found" };
      }

      return { data: trial };
    } catch (error) {
      reply.status(500);
      return { error: error instanceof Error ? error.message : "Failed to fetch trial details" };
    }
  }
);



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
