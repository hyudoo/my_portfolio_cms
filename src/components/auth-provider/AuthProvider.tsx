"use client";

import React, { ReactNode, useContext, useState } from "react";
import { AuthUser } from "../../types/requests/auth.type";

type AuthProviderProps = {
  auth?: AuthUser;
  children: ReactNode;
};

const AuthContext = React.createContext<
  [
    AuthUser | undefined,
    React.Dispatch<React.SetStateAction<AuthUser | undefined>>,
  ]
>([undefined, () => {}]);

export const useAuth = () => useContext(AuthContext);

export const useAuthAccount = () => {
  const [auth] = useContext(AuthContext);

  return auth;
};

export const useAuthUser = () => {
  const [auth] = useContext(AuthContext);

  return auth;
};

export const AuthProvider: React.FC<AuthProviderProps> = (props) => {
  const [auth, setAuth] = useState(props.auth);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {props.children}
    </AuthContext.Provider>
  );
};
