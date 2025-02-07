import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Blog from '@/models/Blog';
import cloudinary from '@/utils/cloudinary';
import formidable from 'formidable';
import fs from 'fs';
import { writeFile } from 'fs/promises';
import path from 'path';
import os from 'os';

const parseForm = async (request) => {
  const form = formidable({
    uploadDir: './public/uploads',
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB
  });

  return new Promise(async (resolve, reject) => {
    try {
      // Get the request body as a readable stream
      const bodyStream = await request.formData();
      
      // Convert FormData to fields and files objects
      const fields = {};
      const files = {};

      for (const [key, value] of bodyStream.entries()) {
        if (value instanceof Blob) {
          // Handle file
          const buffer = Buffer.from(await value.arrayBuffer());
          const filename = value.name;
          const filepath = `./public/uploads/${filename}`;
          
          // Write file to disk
          require('fs').writeFileSync(filepath, buffer);
          
          files[key] = {
            filepath,
            originalFilename: filename,
            mimetype: value.type,
            size: value.size,
          };
        } else {
          // Handle regular field
          fields[key] = value;
        }
      }

      resolve({ fields, files });
    } catch (error) {
      reject(error);
    }
  });
};

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const parentCategory = searchParams.get('parentCategory');
    
    const query = {
      published: true,
      ...(parentCategory && { parentCategory }),
    };

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .limit(6);

    return NextResponse.json(
      { success: true, data: blogs },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blogs.' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const formData = await request.formData();
    
    // Debug log
    console.log('Received FormData:', Object.fromEntries(formData.entries()));

    // Create new blog with explicit data
    const blogData = {
      title: formData.get('title')?.trim(),
      content: formData.get('content'),
      parentCategory: formData.get('parentCategory'), // Make sure this matches the enum values
      category: formData.get('category'),
      tags: formData.get('tags') ? formData.get('tags').split(',').map(tag => tag.trim()) : [],
      published: formData.get('published') === 'true',
      author: formData.get('author')?.trim(),
    };

    // Handle banner image if present
    const bannerImage = formData.get('bannerImage');
    if (bannerImage && bannerImage instanceof Blob) {
      try {
        // Create a temporary file in the system's temp directory
        const bytes = await bannerImage.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Use the OS temp directory
        const tempFilePath = path.join(os.tmpdir(), bannerImage.name);
        
        // Write the file
        await writeFile(tempFilePath, buffer);

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(tempFilePath, {
          folder: 'blog_banners',
          use_filename: true,
          unique_filename: true,
        });
        
        blogData.bannerImage = result.secure_url;
        
        // Clean up temp file
        await fs.promises.unlink(tempFilePath).catch(console.error);
      } catch (error) {
        console.error('Error uploading image:', error);
        // Continue with blog creation even if image upload fails
      }
    }

    // Debug log before saving
    console.log('Final Blog Data:', blogData);

    // Validate data before saving
    if (!blogData.parentCategory) {
      throw new Error('Parent Category is required');
    }

    // Create the blog with validated data
    const newBlog = await Blog.create({
      ...blogData,
      parentCategory: blogData.parentCategory || 'None' // Ensure parentCategory is set
    });

    // Debug log after saving
    console.log('Saved Blog:', newBlog.toObject());

    return NextResponse.json(
      { success: true, data: newBlog, message: 'Blog created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to create blog',
        error: error.toString()
      },
      { status: 500 }
    );
  }
}
