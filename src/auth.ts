import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { AuthUser } from './types/requests/auth.type';

const backendUrl = (process.env.NEXT_PROXY_URL ?? '') + '/api';

export const { handlers, auth, signIn, signOut } = NextAuth({
  basePath: '/api/next-auth',
  providers: [
    GitHub,
    Google,
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const loginRes = await fetch(`${backendUrl}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        if (!loginRes.ok) return null;

        const { accessToken } = await loginRes.json();

        const meRes = await fetch(`${backendUrl}/auth/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!meRes.ok) return null;

        const user: AuthUser = await meRes.json();

        return { ...user, id: String(user.id), accessToken };
      },
    }),
  ],

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        const { accessToken, ...rest } = user as AuthUser & { accessToken: string; id: string };
        token.accessToken = accessToken;
        token.user = rest;
      }
      return token;
    },
    session({ session, token }) {
      return {
        expires: session.expires,
        accessToken: token.accessToken as string,
        user: token.user as AuthUser,
      };
    },
  },

  pages: {
    signIn: '/login',
  },

  session: {
    strategy: 'jwt',
  },
});
