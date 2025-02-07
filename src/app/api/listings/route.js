import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectDB from '@/config/database';
import Product from '@/models/Product';
import User from '@/models/User';

// Create a new listing
export async function POST(request) {
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

    const data = await request.json();

    // Create the listing
    const product = await Product.create({
      ...data,
      seller: user._id
    });

    return NextResponse.json(
      { success: true, data: product },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating listing:', error);
    return NextResponse.json(
      { success: false, message: 'Error creating listing' },
      { status: 500 }
    );
  }
}

// Get all listings (with filters)
export async function GET(request) {
  try {
    await connectDB();
    const session = await getServerSession();

    const { searchParams } = new URL(request.url);
    const query = { status: 'active' }; // Only show active listings

    // If user is logged in, exclude their listings
    if (session) {
      const user = await User.findOne({ email: session.user.email });
      if (user) {
        query.seller = { $ne: user._id }; // Exclude user's own listings
      }
    }

    // Add filters
    if (searchParams.get('type')) {
      query.type = searchParams.get('type');
    }
    if (searchParams.get('category')) {
      query.category = searchParams.get('category');
    }
    if (searchParams.get('search')) {
      query.$text = { $search: searchParams.get('search') };
    }
    if (searchParams.get('city')) {
      query['location.city'] = new RegExp(searchParams.get('city'), 'i');
    }
    if (searchParams.get('state')) {
      query['location.state'] = new RegExp(searchParams.get('state'), 'i');
    }

    // Pagination
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .populate('seller', 'name email image')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching listings' },
      { status: 500 }
    );
  }
} 