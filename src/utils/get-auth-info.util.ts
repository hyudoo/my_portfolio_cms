import { cache } from 'react';
import 'server-only';
import { authRequest } from '../requests/auth.request';

export const getAuthInfo = cache(async () => {
  try {
    return await authRequest.serverMe();
  } catch {}
});
