import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectDB from '@/config/database';
import Product from '@/models/Product';
import User from '@/models/User';

// Get a single listing
export async function GET(request, { params }) {
  try {
    await connectDB();

    const product = await Product.findById(params.id)
      .populate('seller', 'name email image');

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Listing not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching listing:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching listing' },
      { status: 500 }
    );
  }
}

// Update a listing
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    const product = await Product.findById(params.id);

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Listing not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (product.seller.toString() !== user._id.toString()) {
      return NextResponse.json(
        { success: false, message: 'Not authorized' },
        { status: 403 }
      );
    }

    const data = await request.json();
    const updatedProduct = await Product.findByIdAndUpdate(
      params.id,
      { ...data, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error('Error updating listing:', error);
    return NextResponse.json(
      { success: false, message: 'Error updating listing' },
      { status: 500 }
    );
  }
}

// Delete a listing
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    const product = await Product.findById(params.id);

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Listing not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (product.seller.toString() !== user._id.toString()) {
      return NextResponse.json(
        { success: false, message: 'Not authorized' },
        { status: 403 }
      );
    }

    await Product.findByIdAndDelete(params.id);

    return NextResponse.json(
      { success: true, message: 'Listing deleted successfully' }
    );
  } catch (error) {
    console.error('Error deleting listing:', error);
    return NextResponse.json(
      { success: false, message: 'Error deleting listing' },
      { status: 500 }
    );
  }
} 