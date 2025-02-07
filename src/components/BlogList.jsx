// src/components/BlogList.jsx

import Link from 'next/link';
import DOMPurify from 'isomorphic-dompurify';

export default function BlogList({ blogs, onRefresh }) {
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    try {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        // Removed credentials: 'include' since authorization is removed
      });

      const data = await res.json();

      if (data.success) {
        onRefresh(); // Refresh the blog list
      } else {
        alert(data.message || 'Failed to delete blog.');
      }
    } catch (err) {
      console.error('Delete Error:', err);
      alert('An unexpected error occurred.');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Blog Posts</h2>
      {blogs.length === 0 ? (
        <p>No blogs available.</p>
      ) : (
        <div className="space-y-4">
          {blogs.map((blog) => (
            <div key={blog._id} className="p-4 border rounded bg-white shadow">
              <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
              <p className="text-sm text-gray-500 mb-2">
                By <span className="font-semibold">{blog.author}</span> on{' '}
                {new Date(blog.createdAt).toLocaleDateString()}
              </p>
              <div
                className="mb-2"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }}
              ></div>
              <div className="flex items-center space-x-2">
                <Link href={`/admin/blogs/${blog._id}/edit`} className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                    Edit
                </Link>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}