import connectDB from '@/config/database';
import Admin from '@/models/Admin';
import { NextResponse } from 'next/server';

export async function POST(request) {
    const { username, password } = await request.json();

    if (!username || !password) {
        return NextResponse.json(
            { success: false, message: 'Please provide all required fields' },
            { status: 400 }
        );
    }

    try {
        await connectDB();
    
        // Check if admin with the same username already exists
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
          return NextResponse.json(
            { success: false, message: 'Admin with this username already exists.' },
            { status: 400 }
          );
        }
    
        // Create new admin
        const admin = await Admin.create({ username, password });
    
        return NextResponse.json(
          { success: true, message: 'Admin registered successfully!', data: { username: admin.username } },
          { status: 201 }
        );
      } catch (error) {
        console.error('Registration Error:', error);
        return NextResponse.json(
          { success: false, message: 'Server Error. Please try again later.' },
          { status: 500 }
        );
      }
}