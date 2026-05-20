import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from './auth';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const AUTH_PATHS = ['/login', '/register', '/forgot-password', '/reset-password'];

function stripLocale(pathname: string) {
  return pathname.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, '') || '/';
}

export default auth((req) => {
  const path = stripLocale(req.nextUrl.pathname);
  const isAuthenticated = !!req.auth;
  const isAuthPath = AUTH_PATHS.some((p) => path === p || path.startsWith(p + '/'));
  const locale = req.cookies.get('NEXT_LOCALE')?.value ?? routing.defaultLocale;

  if (!isAuthenticated && !isAuthPath) {
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    return NextResponse.redirect(url);
  }

  if (isAuthenticated && isAuthPath) {
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}/dashboard`;
    return NextResponse.redirect(url);
  }

  return intlMiddleware(req as NextRequest);
});

export const config = {
  matcher: ['/((?!_next|_vercel|api|.*\\..*).*)'],
};
