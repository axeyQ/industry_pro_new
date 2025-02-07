// src/app/admin/blogs/[id]/edit/page.jsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BlogForm from '@/components/BlogForm';

export default function EditBlogPage({ params }) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/admin/blogs/${params.id}`);
        const data = await res.json();

        if (data.success) {
          setBlog(data.data);
        } else {
          setError(data.message || 'Failed to fetch blog');
        }
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [params.id]);

  const handleBlogUpdated = () => {
    router.push('/admin/dashboard'); // Or wherever you want to redirect after update
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!blog) return <div className="p-4">Blog not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Blog</h1>
      <BlogForm
        blogId={params.id}
        initialData={blog}
        onBlogUpdated={handleBlogUpdated}
      />
    </div>
  );
}