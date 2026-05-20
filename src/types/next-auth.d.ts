import { AuthUser } from './requests/auth.type';

declare module 'next-auth' {
  interface Session {
    accessToken: string;
    user: AuthUser;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    user: AuthUser;
  }
}
