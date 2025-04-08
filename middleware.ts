import { auth } from '@/auth';
import { NextResponse } from 'next/server';

const PUBLIC_ROUTES = ['/signin'];
const DEFAULT_REDIRECT = '/';
const ROOT = '/signin';

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);

  try {
    console.log('🧪 req.url:', req.url);
    console.log('🧪 nextUrl.pathname:', nextUrl.pathname);

    const safeRedirectToHome = new URL(DEFAULT_REDIRECT, req.url).toString();
    const safeRedirectToSignIn = new URL(ROOT, req.url).toString();

    console.log('🧪 safeRedirectToHome:', safeRedirectToHome);
    console.log('🧪 safeRedirectToSignIn:', safeRedirectToSignIn);

    if (isPublicRoute && isAuthenticated) {
      return Response.redirect(new URL(DEFAULT_REDIRECT, req.url));
    }

    if (!isAuthenticated && !isPublicRoute) {
      return NextResponse.redirect(new URL(ROOT, req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('❌ Middleware Error:', (error as Error).message);
    return NextResponse.error();
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo.png).*)'],
};
