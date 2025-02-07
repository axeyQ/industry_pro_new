import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import connectDB from '@/config/database';
import Business from '@/models/Business';
import User from '@/models/User';

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

    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'name',
      'email',
      'description',
      'industry',
      'size',
      'phone',
      'registrationNumber',
      'taxId'
    ];

    for (const field of requiredFields) {
      if (!body[field]?.trim()) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate address fields
    const requiredAddressFields = ['street', 'city', 'state', 'country', 'postalCode'];
    for (const field of requiredAddressFields) {
      if (!body.address?.[field]?.trim()) {
        return NextResponse.json(
          { success: false, message: `Address ${field} is required` },
          { status: 400 }
        );
      }
    }

    // Check if business already exists
    const existingBusiness = await Business.findOne({
      $or: [
        { email: body.email },
        { registrationNumber: body.registrationNumber },
        { taxId: body.taxId }
      ]
    });

    if (existingBusiness) {
      return NextResponse.json(
        { success: false, message: 'Business already registered' },
        { status: 400 }
      );
    }

    // Create new business
    const business = await Business.create({
      ...body,
      owner: user._id,
      employees: [user._id]
    });

    // Update user with business reference
    await User.findByIdAndUpdate(user._id, {
      $set: { businessRole: 'owner' },
      $push: { businesses: business._id }
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Business registered successfully',
        data: business
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Business registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 