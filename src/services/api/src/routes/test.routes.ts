import { FastifyInstance } from 'fastify';

interface GetTestsQuery {
  query?: string;
  type?: string;
  page?: string;
  limit?: string;
}

export async function testRoutes(server: FastifyInstance) {
  
  server.get<{ Querystring: GetTestsQuery }>('/api/tests', async (request, reply) => {
    try {
      const { query, type, page = '1', limit = '12' } = request.query;
      
      const pageInt = parseInt(page);
      const limitInt = parseInt(limit);
      const skip = (pageInt - 1) * limitInt;

      // [CHUẨN HÓA 1]: Lấy User ID để check trạng thái
      const user = (request as any).user; 
      const currentUserId = user?.user_id || user?.id; 

      const where: any = {};
      if (query) {
        where.title = { contains: query, mode: 'insensitive' };
      }
      if (type && type !== 'all') {
        where.type = type;
      }

      const [tests, total] = await Promise.all([
        server.prisma.test.findMany({
          where,
          skip: skip,
          take: limitInt,
          orderBy: { test_id: 'desc' },
          include: {
            author: {
              select: { user_id: true, name: true, email: true }
            },
            
            trials: {
              where: {
                student_id: currentUserId 
              },
              take: 1, 
              select: { trial_id: true } 
            },

            _count: {
              select: { 
                trials: true,    // Tổng số lượt thi (cho Popularity)
              } 
            }
          }
        }),
        server.prisma.test.count({ where })
      ]);

      return { 
        data: tests, 
        pagination: {
          total,
          page: pageInt,
          limit: limitInt,
          totalPages: Math.ceil(total / limitInt)
        }
      };

    } catch (error) {
      server.log.error(error);
      reply.status(500);
      return { error: 'Failed to fetch tests' };
    }
  });

  // ... (Các route getById, create giữ nguyên như cũ)
  // Get test by ID
  server.get<{ Params: { id: string } }>('/api/tests/:id', async (request, reply) => {
    try {
      const test = await server.prisma.test.findUnique({
        where: { test_id: request.params.id },
        include: { author: true, trials: true } // Có thể cần filter trials ở đây giống bên trên nếu muốn detail cũng hiện status
      });
      if (!test) return reply.status(404).send({ error: 'Test not found' });
      return { data: test };
    } catch (error) { return reply.status(500).send({ error: 'Error' }); }
  });

  // Create test
  server.post('/api/tests', async (request, reply) => {
    try {
      const test = await server.prisma.test.create({ data: request.body as any });
      reply.status(201);
      return { data: test };
    } catch (error) { return reply.status(400).send({ error: 'Error' }); }
  });
}