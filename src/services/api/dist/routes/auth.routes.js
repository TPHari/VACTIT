"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const zod_1 = require("zod");
const node_crypto_1 = require("node:crypto");
const password_1 = require("../utils/password");
const signupSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
// OAuth (Google) - we only need enough info to ensure a User exists in DB.
// NextAuth handles Google verification + web session; this endpoint upserts the user record.
const googleOAuthSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    name: zod_1.z.string().min(1).optional(),
    picture: zod_1.z.string().url().optional(),
});
async function authRoutes(server) {
    // Register/Signup endpoint
    server.post('/api/auth/signup', async (request, reply) => {
        try {
            const parsed = signupSchema.safeParse(request.body);
            if (!parsed.success) {
                reply.status(422);
                return {
                    error: 'invalid_input',
                    details: parsed.error.flatten(),
                };
            }
            const { name, email, password } = parsed.data;
            // Check if user exists
            const existing = await server.prisma.user.findUnique({
                where: { email },
            });
            if (existing) {
                reply.status(409);
                return { error: 'email_exists' };
            }
            const hashed = await (0, password_1.hashPassword)(password);
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
        }
        catch (error) {
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
                return {
                    error: 'invalid_input',
                    details: parsed.error.flatten(),
                };
            }
            const { email, password } = parsed.data;
            const user = await server.prisma.user.findUnique({
                where: { email },
            });
            if (!user || !user.hash_password) {
                reply.status(401);
                return { error: 'invalid_credentials' };
            }
            const isValid = await (0, password_1.verifyPassword)(password, user.hash_password);
            if (!isValid) {
                reply.status(401);
                return { error: 'invalid_credentials' };
            }
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
        }
        catch (error) {
            reply.status(500);
            return {
                error: error instanceof Error ? error.message : 'Login failed',
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
            const randomSecret = (0, node_crypto_1.randomBytes)(32).toString('hex');
            const hashed = await (0, password_1.hashPassword)(randomSecret);
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
        }
        catch (error) {
            reply.status(500);
            return {
                error: error instanceof Error ? error.message : 'OAuth create failed',
            };
        }
    });
}
