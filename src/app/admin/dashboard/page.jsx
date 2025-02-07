'use client';

import { useEffect, useState } from 'react';
import BlogList from '@/components/BlogList';
import BlogForm from '@/components/BlogForm';

export default function DashboardPage() {
    const [blogs, setBlogs] = useState([]);
    const [loadingBlogs, setLoadingBlogs] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [refresh, setRefresh] = useState(false); // To trigger re-fetching blogs
  
    useEffect(() => {
      const fetchBlogs = async () => {
        try {
          const res = await fetch('/api/admin/blogs', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            // Removed credentials: 'include' since authorization is removed
          });
  
          const data = await res.json();
  
          if (data.success) {
            setBlogs(data.data);
          } else {
            setError(data.message || 'Failed to fetch blogs.');
          }
        } catch (err) {
          console.error('Error fetching blogs:', err);
          setError('An unexpected error occurred.');
        } finally {
          setLoadingBlogs(false);
        }
      };
  
      fetchBlogs();
    }, [refresh]);
  
    const handleBlogCreated = () => {
      setShowForm(false);
      setRefresh(!refresh); // Trigger re-fetching blogs
    };
  
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Blog Management</h1>
  
        <button
          onClick={() => setShowForm(!showForm)}
          className="mb-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          {showForm ? 'Close Form' : 'Create New Blog'}
        </button>
  
        {showForm && <BlogForm onBlogCreated={handleBlogCreated} />}
  
        {loadingBlogs ? (
          <p>Loading blogs...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <BlogList blogs={blogs} onRefresh={() => setRefresh(!refresh)} />
        )}
      </div>
    );
  }