'use client';

import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import { AuthUser } from '../../../types/requests/auth.type';
import { setAccessToken } from '../../../utils/api.util';

type AuthContextValue = [AuthUser | undefined, React.Dispatch<React.SetStateAction<AuthUser | undefined>>];

const AuthContext = React.createContext<AuthContextValue>([undefined, () => {}]);

export const useAuth = () => useContext(AuthContext);

export const useAuthAccount = () => useContext(AuthContext)[0];

export const useAuthUser = () => useContext(AuthContext)[0];

function AuthContextProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [auth, setAuth] = useState<AuthUser | undefined>(session?.user);

  useEffect(() => {
    if (status === 'loading') return;
    setAuth(session?.user);
    setAccessToken(session?.accessToken ?? null);
  }, [status, session?.user, session?.accessToken]);

  return <AuthContext.Provider value={[auth, setAuth]}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider basePath="/api/next-auth">
      <AuthContextProvider>{children}</AuthContextProvider>
    </SessionProvider>
  );
}
