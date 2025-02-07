import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import DOMPurify from 'isomorphic-dompurify';

async function getBlogById(id) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/admin/blogs/${id}`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch blog');
    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

export default async function BlogPost({ params }) {
  const blog = await getBlogById(params.id);
  
  if (!blog) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8">
        ← Back to Home
      </Link>
      <div className="flex items-center gap-4 mb-6">
        <div className="h-12 w-12 relative rounded-full overflow-hidden">
          <Image
            src={blog.bannerImage || '/default-banner.jpg'}
            alt={blog.author}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="font-semibold">{blog.author}</p>
          <p className="text-gray-600">
            {new Date(blog.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>

      <div className="flex gap-2 mb-8">
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
          {blog.parentCategory}
        </span>
        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
          {blog.category}
        </span>
      </div>
      <div className="relative w-full h-[400px] mb-8">
        <Image
          src={blog.bannerImage || '/default-banner.jpg'}
          alt={blog.title}
          fill
          className="object-cover rounded-lg"
          priority
        />
      </div>



      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ 
          __html: DOMPurify.sanitize(blog.content) 
        }}
      />
    </article>
  );
}