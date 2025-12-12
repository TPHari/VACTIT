import { FastifyInstance } from 'fastify';

export async function userRoutes(server: FastifyInstance) {
  // Get all users
  server.get('/api/users', async (request, reply) => {
    try {
      const users = await server.prisma.user.findMany({
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
      return { 
        error: error instanceof Error ? error.message : 'Failed to fetch users' 
      };
    }
  });

  // Get user by ID
  server.get<{ Params: { id: string } }>('/api/users/:id', async (request, reply) => {
    try {
      const user = await server.prisma.user.findUnique({
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
      return { 
        error: error instanceof Error ? error.message : 'Failed to fetch user' 
      };
    }
  });

  // Create user (admin endpoint)
  server.post('/api/users', async (request, reply) => {
    try {
      const user = await server.prisma.user.create({
        data: request.body as any
      });
      reply.status(201);
      return { data: user };
    } catch (error) {
      reply.status(400);
      return { 
        error: error instanceof Error ? error.message : 'Failed to create user' 
      };
    }
  });
}
