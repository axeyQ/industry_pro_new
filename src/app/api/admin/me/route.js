import { NextResponse } from 'next/server';
import { verifyToken } from '@/utils/auth';
import Admin from '@/models/Admin';
import connectDB from '@/config/database';

export async function GET(request) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.json(
      { success: false, message: 'Invalid token' },
      { status: 401 }
    );
  }

  try {
    await connectDB();

    const admin = await Admin.findById(decoded.id).select('-password'); // Exclude password

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Admin not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: admin },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fetch Admin Error:', error);
    return NextResponse.json(
      { success: false, message: 'Server Error' },
      { status: 500 }
    );
  }
}