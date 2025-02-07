import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectDB from '@/config/database';
import Business from '@/models/Business';
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

    // Get user with populated businesses
    const user = await User.findOne({ email: session.user.email })
      .populate('businesses');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Get the first business (assuming one user can have multiple businesses)
    const business = user.businesses[0];

    if (!business) {
      return NextResponse.json(
        { success: false, message: 'No business found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: business },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching business profile:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 