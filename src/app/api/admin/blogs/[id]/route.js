import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Blog from '@/models/Blog';
import cloudinary from 'cloudinary';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const blog = await Blog.findById(params.id);
    
    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: blog }, { status: 200 });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    // Get the request body as text first
    const bodyText = await request.text();
    let body;
    
    try {
      body = JSON.parse(bodyText);
    } catch (error) {
      console.error('Error parsing JSON:', error, 'Body text:', bodyText);
      return NextResponse.json(
        { success: false, message: 'Invalid JSON data' },
        { status: 400 }
      );
    }
    
    // Find existing blog
    const existingBlog = await Blog.findById(params.id);
    if (!existingBlog) {
      return NextResponse.json(
        { success: false, message: 'Blog not found' },
        { status: 404 }
      );
    }

    const { title, content, category, tags, published, author,parentCategory } = body;

    // Update blog
    const updatedBlog = await Blog.findByIdAndUpdate(
      params.id,
      {
        ...(title && { title: title.trim() }),
        ...(content && { content }),
        ...(category && { category }),
        ...(tags && { tags: tags.split(',').map(tag => tag.trim()) }),
        ...(typeof published === 'boolean' && { published }),
        ...(parentCategory && { parentCategory }),
        ...(author && { author: author.trim() }),
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      { success: true, data: updatedBlog, message: 'Blog updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update blog' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const blog = await Blog.findById(params.id);
    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog not found' },
        { status: 404 }
      );
    }

    // Delete image from Cloudinary if it exists
    if (blog.bannerImage) {
      const publicId = blog.bannerImage.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`blog_banners/${publicId}`);
    }

    await Blog.findByIdAndDelete(params.id);

    return NextResponse.json(
      { success: true, message: 'Blog deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete blog' },
      { status: 500 }
    );
  }
}
