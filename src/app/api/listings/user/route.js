import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectDB from '@/config/database';
import Product from '@/models/Product';
import User from '@/models/User';

export async function GET(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get the current user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Get user's listings
    const listings = await Product.find({ seller: user._id })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: listings
    });
  } catch (error) {
    console.error('Error fetching user listings:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching listings' },
      { status: 500 }
    );
  }
} 