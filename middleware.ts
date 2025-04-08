import NextAuth from 'next-auth';
import { authOptions } from './app/auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authOptions);

const PUBLIC_ROUTES = ['/signin'];
const DEFAULT_REDIRECT = '/';
const ROOT = '/signin';

export default auth((req) => {
  const { nextUrl } = req;

  const isAuthenticated = !!req.auth;
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);

  if (isPublicRoute && isAuthenticated) {
    return Response.redirect(new URL(DEFAULT_REDIRECT, req.url));
  }

  if (!isAuthenticated && !isPublicRoute) {
    return Response.redirect(new URL(ROOT, req.url));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo.png).*)'],
};
