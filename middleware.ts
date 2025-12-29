import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('user_session')?.value;
  const { pathname } = request.nextUrl;

  // Define paths that don't require authentication
  const publicPaths = ['/login'];
  
  // Check if the current path is a public path
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  // If the user is not logged in and tries to access a protected route
  if (!currentUser && !isPublicPath) {
    // Redirect to login page
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If the user is logged in and tries to access the login page
  if (currentUser && isPublicPath) {
    // Redirect to dashboard
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - .*\\.(?:svg|png|jpg|jpeg|gif|webp)$ (image files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
