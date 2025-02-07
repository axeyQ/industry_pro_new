import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      const pathname = req.nextUrl.pathname;
      
      // Public paths that don't require authentication
      if (pathname.startsWith('/auth') || pathname === '/') {
        return true;
      }
      
      // Protected paths that require authentication
      return !!token;
    },
  },
});

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/admin/:path*',
    '/api/user/:path*'
  ],
};