import { NextResponse } from 'next/server';
import Blog from '@/models/Blog';
import connectDB from '@/config/database';
import cloudinary from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request) {
  try {
    await connectDB();

    // Get the form data
    const formData = await request.formData();
    
    // Extract fields from form data
    const title = formData.get('title');
    const content = formData.get('content');
    const parentCategory = formData.get('parentCategory');
    const category = formData.get('category');
    const tags = formData.get('tags');
    const published = formData.get('published') === 'true';
    const author = formData.get('author');
    const bannerImage = formData.get('bannerImage');

    // Validate required fields
    const requiredFields = { title, content, category, parentCategory, author };
    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value) {
        return NextResponse.json(
          { success: false, message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Handle banner image upload if present
    let bannerImageUrl = '';
    if (bannerImage && bannerImage instanceof Blob) {
      const bytes = await bannerImage.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: 'blog_banners',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      bannerImageUrl = result.secure_url;
    }

    // Create new blog
    const newBlog = new Blog({
      title,
      content,
      parentCategory,
      category,
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
      published,
      author,
      bannerImage: bannerImageUrl || null,
    });

    await newBlog.save();

    return NextResponse.json(
      { 
        success: true, 
        message: 'Blog created successfully',
        data: newBlog 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const parentCategory = searchParams.get('parentCategory');
    const query = parentCategory ? { parentCategory } : {};
    
    const blogs = await Blog.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json(
      { success: true, data: blogs },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}