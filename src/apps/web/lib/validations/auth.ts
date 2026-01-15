import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { api } from '@/lib/api-client';

export const authOptions: NextAuthOptions= {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        captchaToken: { label: 'Captcha', type: 'text' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password || !credentials?.captchaToken) return null;
          
          // Call Fastify API for authentication
          const response = await api.auth.login({
            email: credentials.email,
            password: credentials.password,
            captchaToken: credentials.captchaToken,
          });

          if (response?.data?.user) {
            return {
              id: response.data.user.user_id,
              name: response.data.user.name ?? undefined,
              email: response.data.user.email,
              role: response.data.user.role,
            } as any;
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
    async signIn({ user, account, profile }) {
      // If user signs in with Google, ensure a matching DB row exists (create if missing).
      if (account?.provider === "google") {
        try {
          const email = (profile as any)?.email || user.email;
          const name = (profile as any)?.name || user.name;

          if (!email) return false;

          // API route now: "if exists -> return unchanged; else create"
          await api.auth.oauthGoogle({
            email,
            name: name ?? undefined,
          });

          return true;
        } catch (err) {
          console.error("google signIn ensure-user failed:", err);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user, account, profile }) {
      // This runs on every request. Only set fields when we actually have fresh auth info.
      // That is: when user/account exists (initial sign-in), not on every subsequent call.
      if (user) {
        const email = (profile as any)?.email || user.email;

        // For Google, prefer stable id = email (matches your DB user_id)
        if (account?.provider === "google" && email) {
          token.id = email;
          (token as any).email = email;
        } else {
          // Credentials login: your authorize() should have set user.id already
          // But if your system uses email as user_id, keeping email works too.
          token.id = (user as any).id ?? email ?? token.id;
          if (email) (token as any).email = email;
          if ((user as any).role) (token as any).role = (user as any).role;
        }
      }

      // Fallback: if id missing, use stored email
      if (!token.id && (token as any).email) {
        token.id = (token as any).email;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        if ((token as any).role) (session.user as any).role = (token as any).role;
      }
      return session;
    },
  },

};

