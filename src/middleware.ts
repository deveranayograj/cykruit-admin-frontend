import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ⚠️ DISABLE AUTH - Set to true to bypass authentication during development
const DISABLE_AUTH = false;

export function middleware(request: NextRequest) {
  // Skip auth check if disabled
  if (DISABLE_AUTH) {
    return NextResponse.next();
  }

  // Check for access token in cookies (set by Next.js) or try to read from headers
  const accessTokenFromCookie = request.cookies.get('accessToken')?.value;
  const authHeader = request.headers.get('authorization');
  const accessTokenFromHeader = authHeader?.replace('Bearer ', '');
  
  const accessToken = accessTokenFromCookie || accessTokenFromHeader;
  
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = request.nextUrl.pathname === '/login';

  // Redirect to login if accessing admin without accessToken
  if (isAdminRoute && !accessToken) {
    // Since we're using localStorage, we need to check client-side
    // This middleware will only catch requests without cookies
    // For localStorage check, we'll handle it in the layout/page component
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Redirect to admin if accessing login with accessToken
  if (isLoginPage && accessToken) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};