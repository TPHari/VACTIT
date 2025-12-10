import { FastifyInstance } from 'fastify';

export async function responseRoutes(server: FastifyInstance) {
  // Get all responses
  server.get('/api/responses', async (request, reply) => {
    try {
      const responses = await server.prisma.response.findMany({
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
      return { 
        error: error instanceof Error ? error.message : 'Failed to fetch responses' 
      };
    }
  });

  // Create response
  server.post('/api/responses', async (request, reply) => {
    try {
      const response = await server.prisma.response.create({
        data: request.body as any
      });
      reply.status(201);
      return { data: response };
    } catch (error) {
      reply.status(400);
      return { 
        error: error instanceof Error ? error.message : 'Failed to create response' 
      };
    }
  });
}
