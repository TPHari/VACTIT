import type {  NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { api } from '@/lib/api-client';

export const authOptions: NextAuthOptions= {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null;
          
          // Call Fastify API for authentication
          const response = await api.auth.login({
            email: credentials.email,
            password: credentials.password,
          });

          if (response?.data?.user) {
            return {
              id: response.data.user.user_id,
              name: response.data.user.name ?? undefined,
              email: response.data.user.email,
            };
          }

          return null;
        } catch (err) {
          console.error('authorize error:', err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
};

