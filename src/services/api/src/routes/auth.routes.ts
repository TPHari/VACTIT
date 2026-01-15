import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { randomBytes } from 'node:crypto';
import nodemailer from 'nodemailer';
import { hashPassword, verifyPassword } from '../utils/password';

// ----- Gmail SMTP for sending OTP emails -----
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const transporter = EMAIL_USER && EMAIL_PASS
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    })
  : null;

console.log('[Auth] Email configured:', !!transporter, EMAIL_USER ? `(${EMAIL_USER})` : '');

async function sendOtpEmail(to: string, code: string, name: string): Promise<boolean> {
  if (!transporter) {
    console.log(`[DEV] OTP for ${to}: ${code}`);
    return true; // Allow dev testing without email
  }

  try {
    console.log(`[OTP] Sending to ${to} via Gmail...`);
    await transporter.sendMail({
      from: `VACTIT <${EMAIL_USER}>`,
      to,
      subject: 'Mã xác nhận đăng ký VACTIT',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Xin chào ${name}!</h2>
          <p>Mã xác nhận của bạn là:</p>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2563eb;">${code}</span>
          </div>
          <p style="color: #666;">Mã này có hiệu lực trong 10 phút.</p>
          <p style="color: #999; font-size: 12px;">Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
        </div>
      `,
    });

    console.log(`[OTP] Email sent successfully to ${to}`);
    return true;
  } catch (error) {
    console.error('[OTP] Email send error:', error);
    return false;
  }
}

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ----- Temporary store for OTP during signup (use Redis in production) -----
interface OtpEntry {
  code: string;
  name: string;
  expiresAt: number;
}
const otpStore = new Map<string, OtpEntry>();

function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [email, entry] of otpStore) {
    if (entry.expiresAt < now) otpStore.delete(email);
  }
}
// Run cleanup every 5 minutes
setInterval(cleanupExpiredEntries, 5 * 60 * 1000);

// ----- Zod schemas -----
const sendOtpSchema = z.object({
  email: z.string().email('Email không hợp lệ').refine(
    (val) => val.toLowerCase().endsWith('@gmail.com'),
    { message: 'Chỉ chấp nhận địa chỉ Gmail (@gmail.com)' }
  ),
  name: z.string().min(1, 'Tên không được để trống'),
});

const verifyOtpSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  code: z.string().length(6, 'Mã xác nhận phải có 6 chữ số'),
});

const completeSignupSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
});

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
  // ========== SEND OTP ==========
  server.post('/api/auth/send-otp', async (request, reply) => {
    try {
      const parsed = sendOtpSchema.safeParse(request.body);
      if (!parsed.success) {
        reply.status(422);
        return { error: parsed.error.issues[0]?.message || 'Dữ liệu không hợp lệ' };
      }

      const { email, name } = parsed.data;
      const normalizedEmail = email.toLowerCase();

      // Check if email already registered in our DB
      const existing = await server.prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (existing) {
        reply.status(409);
        return { error: 'Email đã được đăng ký. Vui lòng đăng nhập.' };
      }

      // Generate OTP
      const code = generateOtp();
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

      // Store OTP with user data
      otpStore.set(normalizedEmail, { code, name, expiresAt });

      // Send OTP email
      const sent = await sendOtpEmail(normalizedEmail, code, name);
      if (!sent && transporter) {
        reply.status(500);
        return { error: 'Không thể gửi email. Vui lòng thử lại sau.' };
      }

      console.log(`[OTP] Sent to ${normalizedEmail}`);
      return { success: true, message: 'Mã xác nhận đã được gửi tới email của bạn.' };
    } catch (error) {
      console.error('send-otp error:', error);
      reply.status(500);
      return { error: 'Không thể gửi mã OTP. Vui lòng thử lại.' };
    }
  });

  // ========== VERIFY OTP ==========
  server.post('/api/auth/verify-otp', async (request, reply) => {
    try {
      const parsed = verifyOtpSchema.safeParse(request.body);
      if (!parsed.success) {
        reply.status(422);
        return { error: parsed.error.issues[0]?.message || 'Dữ liệu không hợp lệ' };
      }

      const { email, code } = parsed.data;
      const normalizedEmail = email.toLowerCase();

      // Check we have OTP data for this email
      const entry = otpStore.get(normalizedEmail);
      if (!entry) {
        reply.status(400);
        return { error: 'Không tìm thấy mã OTP. Vui lòng yêu cầu gửi lại.' };
      }

      if (Date.now() > entry.expiresAt) {
        otpStore.delete(normalizedEmail);
        reply.status(400);
        return { error: 'Mã OTP đã hết hạn. Vui lòng yêu cầu gửi lại.' };
      }

      if (entry.code !== code) {
        reply.status(400);
        return { error: 'Mã OTP không đúng.' };
      }

      console.log(`[OTP] Verified for ${normalizedEmail}`);
      return { 
        success: true, 
        verified: true,
        message: 'Email đã được xác minh thành công.' 
      };
    } catch (error) {
      console.error('verify-otp error:', error);
      reply.status(500);
      return { error: 'Không thể xác minh OTP. Vui lòng thử lại.' };
    }
  });

  // ========== COMPLETE SIGNUP (after OTP verified) ==========
  server.post('/api/auth/complete-signup', async (request, reply) => {
    try {
      const parsed = completeSignupSchema.safeParse(request.body);
      if (!parsed.success) {
        reply.status(422);
        return { error: parsed.error.issues[0]?.message || 'Dữ liệu không hợp lệ' };
      }

      const { email, password } = parsed.data;
      const normalizedEmail = email.toLowerCase();

      // Check we have OTP data (means they verified)
      const entry = otpStore.get(normalizedEmail);
      if (!entry) {
        reply.status(400);
        return { error: 'Phiên đăng ký đã hết hạn. Vui lòng bắt đầu lại.' };
      }

      if (Date.now() > entry.expiresAt) {
        otpStore.delete(normalizedEmail);
        reply.status(400);
        return { error: 'Phiên đăng ký đã hết hạn. Vui lòng bắt đầu lại.' };
      }

      // Check if user already exists in our DB
      const existing = await server.prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (existing) {
        otpStore.delete(normalizedEmail);
        reply.status(409);
        return { error: 'Email đã được đăng ký.' };
      }

      // Create user in our database
      const hashed = await hashPassword(password);
      const user = await server.prisma.user.create({
        data: {
          user_id: normalizedEmail,
          name: entry.name,
          email: normalizedEmail,
          hash_password: hashed,
          created_at: new Date(),
          role: 'Student',
        },
        select: {
          user_id: true,
          email: true,
          name: true,
          role: true,
          membership: true,
        },
      });

      // Clean up
      otpStore.delete(normalizedEmail);

      reply.status(201);
      return { 
        success: true,
        data: { user },
        message: 'Tài khoản đã được tạo thành công!' 
      };
    } catch (error) {
      console.error('complete-signup error:', error);
      reply.status(500);
      return { error: 'Không thể tạo tài khoản. Vui lòng thử lại.' };
    }
  });

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
