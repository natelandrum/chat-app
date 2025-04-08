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

  try {
    console.log('nextUrl.pathname:', nextUrl.pathname);
    console.log('nextUrl.origin:', nextUrl.origin);
    console.log('req.url:', req.url);

    if (isPublicRoute && isAuthenticated) {
      return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl.origin));
    }

    if (!isAuthenticated && !isPublicRoute) {
      return Response.redirect(new URL(ROOT, nextUrl.origin));
    }

    return NextResponse.next();
  } catch (err) {
    console.error('Middleware failed:', err);
    return new Response('Middleware error', { status: 500 });
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo.png).*)'],
};
