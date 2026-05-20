import { auth } from '../auth';
import { AuthUser } from '../types/requests/auth.type';

export const getAuthInfo = async (): Promise<AuthUser | undefined> => {
  const session = await auth();
  return session?.user;
};
