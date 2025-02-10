import { Suspense } from 'react';
import Link from 'next/link';
import BlogCard from '@/components/BlogCard';
import { HomeCard } from '@/components/HomeCard';

async function getBlogsByCategory(category) {
  try {
    const encodedCategory = encodeURIComponent(category);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const res = await fetch(
      `${baseUrl}/api/blogs/category/${encodedCategory}`,
      { cache: 'no-store' }
    );
    if (!res.ok) throw new Error(`Failed to fetch blogs: ${res.status}`);
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

export default async function CategoryPage({ params }) {
  const blogs = await getBlogsByCategory(decodeURIComponent(params.slug));
    
  if (!blogs || blogs.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 dark:bg-black">
      <div className="mb-8 flex items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{decodeURIComponent(params.slug)}</h1>
      </div>

      <Suspense fallback={<div>Loading blogs...</div>}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {blogs.map((blog) => (
            <HomeCard key={blog._id} blog={blog} />

          ))}
        </div>
      </Suspense>
    </div>
  );
}