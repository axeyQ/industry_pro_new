import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import cloudinary from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('logo');

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        {
          folder: 'business_logos',
          allowed_formats: ['jpg', 'png', 'jpeg'],
          transformation: [
            { width: 500, height: 500, crop: 'fill' },
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(buffer);
    });

    const result = await uploadPromise;

    return NextResponse.json(
      { 
        success: true, 
        url: result.secure_url 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logo upload error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to upload logo' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false
  }
}; 