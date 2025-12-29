import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { randomBytes } from 'node:crypto';
import { hashPassword, verifyPassword } from '../utils/password';

const signupSchema = z.object({
  name: z.string().min(1, 'Tên không được để trống'),
  email: z.string().email('Sai cú pháp email'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

const loginSchema = z.object({
  email: z.string().email('Sai cú pháp email'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

// OAuth (Google) - we only need enough info to ensure a User exists in DB.
// NextAuth handles Google verification + web session; this endpoint upserts the user record.
const googleOAuthSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).optional(),
  picture: z.string().url().optional(),
});

export async function authRoutes(server: FastifyInstance) {
  // Register/Signup endpoint
  server.post('/api/auth/signup', async (request, reply) => {
    try {
      console.log('Signup request body:', request.body);
      
      const parsed = signupSchema.safeParse(request.body);

      if (!parsed.success) {
        reply.status(422);
        
        console.log('Full error:', JSON.stringify(parsed.error, null, 2));
        
        // Zod uses 'issues' not 'errors'
        const errors = parsed.error.issues;
        
        if (errors && errors.length > 0) {
          // Return the first error's custom message
          const errorMessage = errors[0].message;
          console.log('Returning error:', errorMessage);
          return { error: errorMessage };
        }
        
        return { error: 'Dữ liệu không nhập không hợp lệ !' };
      }

      const { name, email, password } = parsed.data;

      // Check if user exists
      const existing = await server.prisma.user.findUnique({
        where: { email },
      });

      if (existing) {
        reply.status(409);
        return { error: 'Email đã tồn tại' };
      }

      const hashed = await hashPassword(password);

      const user = await server.prisma.user.create({
        data: {
          user_id: email, // Using email as user_id
          name,
          email,
          hash_password: hashed,
          created_at: new Date(),
          role: 'Student',
          // membership defaults to "Regular" in schema
        },
        select: {
          user_id: true,
          email: true,
          name: true,
          role: true,
          membership: true,
        },
      });

      reply.status(201);
      return { data: user };
    } catch (error) {
      reply.status(500);
      return {
        error: error instanceof Error ? error.message : 'Failed to create user',
      };
    }
  });

  // Login endpoint
  server.post('/api/auth/login', async (request, reply) => {
    try {
      const parsed = loginSchema.safeParse(request.body);

      if (!parsed.success) {
        reply.status(422);
        
        // Zod uses 'issues' not 'errors'
        const errors = parsed.error.issues;
        
        if (errors && errors.length > 0) {
          // Return the first error's custom message
          return { error: errors[0].message };
        }
        
        return { error: 'Dữ liệu nhập không hợp lệ !' };
      }

      const { email, password } = parsed.data;

      const user = await server.prisma.user.findUnique({
        where: { email },
      });

      if (!user || !user.hash_password) {
        reply.status(401);
        return { error: 'Email hoặc mật khẩu không đúng' };
      }

      const isValid = await verifyPassword(password, user.hash_password);

      if (!isValid) {
        reply.status(401);
        return { error: 'Email hoặc mật khẩu không đúng' };
      }
      console.log('User logged in successfully:', user);
      return {
        data: {
          user: {
            user_id: user.user_id,
            email: user.email,
            name: user.name,
            role: user.role,
            membership: user.membership,
          },
        },
      };
    } catch (error) {
      reply.status(500);
      return { 
        error: error instanceof Error ? error.message : 'Đăng nhập thất bại' 
      };
    }
  });

  // Google OAuth upsert endpoint
  // Called by the web app (NextAuth callback) after Google authenticates.
  // Purpose: ensure a User row exists in our Postgres DB.
  server.post('/api/auth/oauth/google', async (request, reply) => {
  try {
    const parsed = googleOAuthSchema.safeParse(request.body);

    if (!parsed.success) {
      reply.status(422);
      return {
        error: 'invalid_input',
        details: parsed.error.flatten(),
      };
    }

    const { email, name } = parsed.data;

    // 1) If user exists: DO NOT update any fields
    const existing = await server.prisma.user.findUnique({
      where: { email },
      select: {
        user_id: true,
        email: true,
        name: true,
        role: true,
        membership: true,
      },
    });

    if (existing) {
      return { data: { user: existing } };
    }

    // 2) If user does NOT exist: create
    // Must satisfy schema's required hash_password.
    const randomSecret = randomBytes(32).toString('hex');
    const hashed = await hashPassword(randomSecret);

    const created = await server.prisma.user.create({
      data: {
        user_id: email, // keep consistent with your existing signup convention
        email,
        name: name ?? email.split('@')[0],
        role: 'Student',
        membership: 'Regular',
        created_at: new Date(),
        hash_password: hashed,
      },
      select: {
        user_id: true,
        email: true,
        name: true,
        role: true,
        membership: true,
      },
    });

    return { data: { user: created } };
  } catch (error) {
    reply.status(500);
    return {
      error: error instanceof Error ? error.message : 'OAuth create failed',
    };
  }
  });

}
