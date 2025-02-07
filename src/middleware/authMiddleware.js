import { verifyToken } from '@/utils/auth';
import { NextResponse } from 'next/server';

export function middleware(req) {
    const token = req.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    const decoded = verifyToken(token);

    if (!decoded) {
        // Invalid token
        const response = NextResponse.redirect(new URL('/admin/login', req.url));
        response.cookies.set('token', '', { maxAge: -1 }); // Remove invalid token
        return response;
    }

    // Token is valid, proceed
    return NextResponse.next();
}

// Apply the middleware to protected routes
export const config = {
    matcher: ['/admin/dashboard/:path*'],
};