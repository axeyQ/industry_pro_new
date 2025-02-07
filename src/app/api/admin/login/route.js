import { NextResponse } from 'next/server';
import Admin from '@/models/Admin';
import connectDB from '@/config/database';
import bcrypt from 'bcryptjs';
import { signToken } from '@/utils/auth';
export async function POST(request) {


    try {
        await connectDB();
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { success: false, message: 'Please provide all required fields' },
                { status: 400 }
            );
        }
        // Find the admin by username
        const admin = await Admin.findOne({ username });
        if (!admin) {
          return NextResponse.json(
            { success: false, message: 'Invalid username or password.' },
            { status: 401 }
          );
        }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid username or password.' },
        { status: 401 }
      );
    }

        // Generate JWT Token
        const token = signToken({ id: admin._id, username: admin.username });

        // Set token in HTTP-only cookie
        const response = NextResponse.json(
            { success: true, message: 'Logged in successfully' },
            { status: 200 }
        );

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: false, // Set to true in production
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24, // 1 day
          });

        return response;
    } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json(
            { success: false, message: 'Server Error' },
            { status: 500 }
        );
    }
}