import { FastifyInstance } from 'fastify';

// Interface cho Query Params
interface GetTestsQuery {
  query?: string;
  type?: string; 
  category?: 'upcoming' | 'countdown' | 'in_progress' | 'locked' | 'practice' | 'all';
  status?: 'completed' | 'not_started' | 'all';
  sort?: 'newest' | 'oldest';
  page?: string;
  limit?: string;
  userId?: string;
}

export async function testRoutes(server: FastifyInstance) {
  
  // 1. API Lấy danh sách bài thi (GET /api/tests)
  server.get<{ Querystring: GetTestsQuery }>('/api/tests', async (request, reply) => {
    try {
      const { 
        query, type, category = 'all', status = 'all', sort = 'newest',
        page = '1', limit = '12',
        userId
      } = request.query;
      
      const pageInt = parseInt(page);
      const limitInt = parseInt(limit);
      const skip = (pageInt - 1) * limitInt;

      // --- LOGIC LẤY USER ID ---
      // Ưu tiên lấy từ Query Param do Frontend gửi xuống
      const currentUserId = userId; 
      const searchUserId = currentUserId; 

      // --- Debug Log ---
      console.log(`[API] Fetching tests. UserID provided: ${currentUserId || 'Guest'}`);

      // --- B. Mốc thời gian ---
      const now = new Date();
      const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000); 

      // --- C. Bộ lọc (WHERE) ---
      const where: any = {};

      if (query) where.title = { contains: query, mode: 'insensitive' };

      // Filter theo Category
      switch (category) {
        case 'upcoming':
          where.type = 'exam';
          where.start_time = { gt: oneDayLater };
          break;
        case 'countdown':
          where.type = 'exam';
          where.start_time = { gt: now, lte: oneDayLater };
          break;
        case 'in_progress':
          where.type = 'exam';
          where.start_time = { lte: now };
          where.due_time = { gte: now };
          break;
        case 'locked':
          where.type = 'exam';
          where.due_time = { lt: now };
          break;
        case 'practice':
          where.type = 'practice';
          break;
        case 'all':
        default:
          if (type && type !== 'all') where.type = type;
          break;
      }

      // Filter theo Status (Dựa trên searchUserId)
      if (status === 'completed') {
        where.trials = { some: { student_id: searchUserId } };
      } else if (status === 'not_started') {
        where.trials = { none: { student_id: searchUserId } };
      }

      // --- D. Sắp xếp (ORDER BY) ---
      let orderBy: any = [];
      if (['upcoming', 'countdown', 'in_progress'].includes(category)) {
         orderBy = [{ start_time: 'asc' }, { test_id: 'asc' }];
      } else {
         if (sort === 'oldest') {
            orderBy = [{ start_time: 'asc' }, { test_id: 'asc' }];
         } else {
            orderBy = [{ start_time: 'desc' }, { test_id: 'desc' }];
         }
      }

      // --- E. Truy vấn ---
      const [tests, total] = await Promise.all([
        server.prisma.test.findMany({
          where,
          skip: skip,
          take: limitInt,
          orderBy: orderBy,
          include: {
            author: { select: { user_id: true, name: true, email: true } },
            
            // Lấy danh sách lần thi của User này để Frontend đếm
            trials: {
              where: { student_id: searchUserId },
              select: { trial_id: true } 
            },
            
            _count: { select: { trials: true } }
          }
        }),
        server.prisma.test.count({ where })
      ]);

      return { 
        data: tests, 
        pagination: { 
          total, page: pageInt, limit: limitInt, totalPages: Math.ceil(total / limitInt) 
        }
      };

    } catch (error) {
      server.log.error(error);
      reply.status(500);
      return { error: 'Failed to fetch tests' };
    }
  });

  server.get<{ Params: { id: string } }>('/api/tests/:id', async (request, reply) => {
    try {
      const test = await server.prisma.test.findUnique({
        where: { test_id: request.params.id },
        include: { author: true, trials: true }
      });
      if (!test) return reply.status(404).send({ error: 'Test not found' });
      return { data: test };
    } catch (error) {
      server.log.error(error);
      reply.status(500);
      return { error: 'Failed' };
    }
  });

  server.post('/api/tests', async (request, reply) => {
    try {
      const test = await server.prisma.test.create({ data: request.body as any });
      reply.status(201);
      return { data: test };
    } catch (error) {
      server.log.error(error);
      reply.status(400);
      return { error: 'Failed' };
    }
  });
}