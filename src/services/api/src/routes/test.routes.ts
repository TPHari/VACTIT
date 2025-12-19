import { FastifyInstance } from 'fastify';

// Định nghĩa kiểu dữ liệu cho Query Params
interface GetTestsQuery {
  query?: string;
  type?: string;
  page?: string;
  limit?: string;
}

export async function testRoutes(server: FastifyInstance) {
  
  server.get<{ Querystring: GetTestsQuery }>('/api/tests', async (request, reply) => {
    try {
      // 1. Lấy tham số từ URL
      const { query, type, page = '1', limit = '12' } = request.query;
      
      const pageInt = parseInt(page);
      const limitInt = parseInt(limit);
      const skip = (pageInt - 1) * limitInt;

      // 2. Xây dựng bộ lọc (Where clause)
      const where: any = {};

      // Tìm kiếm theo tên đề (Title)
      if (query) {
        where.title = {
          contains: query,
          mode: 'insensitive', // Không phân biệt hoa thường
        };
      }

      // Lọc theo loại (exam/practice)
      if (type && type !== 'all') {
        where.type = type;
      }

      // 3. Truy vấn Database (Lấy data + đếm tổng số)
      const [tests, total] = await Promise.all([
        server.prisma.test.findMany({
          where,
          skip: skip,
          take: limitInt,
          orderBy: { test_id: 'desc' }, // Đề mới nhất lên đầu
          include: {
            author: {
              select: {
                user_id: true,
                name: true,
                email: true
              }
            },
            _count: {
              // Lấy số lượng trials để hiển thị 'lượt thi' trên UI
              select: { trials: true } 
            }
          }
        }),
        server.prisma.test.count({ where })
      ]);

      // 4. Trả về kết quả
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
      return { 
        error: error instanceof Error ? error.message : 'Failed to fetch tests' 
      };
    }
  });

  // Get test by ID -> /api/tests/:id
  server.get<{ Params: { id: string } }>('/api/tests/:id', async (request, reply) => {
    try {
      const test = await server.prisma.test.findUnique({
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
      return { 
        error: error instanceof Error ? error.message : 'Failed to fetch test' 
      };
    }
  });

  // Create test -> /api/tests
  server.post('/api/tests', async (request, reply) => {
    try {
      const test = await server.prisma.test.create({
        data: request.body as any
      });
      reply.status(201);
      return { data: test };
    } catch (error) {
      reply.status(400);
      return { 
        error: error instanceof Error ? error.message : 'Failed to create test' 
      };
    }
  });
}