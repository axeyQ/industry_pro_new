'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Dynamically import ReactQuill with SSR disabled
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

// Define parent categories and their subcategories
const categoryStructure = {
  'Latest Automation News & Articles': [
    'Industry News',
    'Technology Updates',
    'Market Trends',
    'Product Launches',
    'Company Updates'
  ],
  'What\'s trending': [
    'Innovation',
    'Digital Transformation',
    'Smart Manufacturing',
    'Industry 4.0',
    'Automation Solutions'
  ],
  'For Your Conceptual Understanding': [
    'Technical Guides',
    'How-to Articles',
    'Best Practices',
    'Case Studies',
    'Educational Content'
  ],
  'None': ['Uncategorized']
};

export default function BlogForm({ blogId, initialData, onBlogCreated, onBlogUpdated }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    parentCategory: 'Latest Automation News & Articles', // Set default parent category
    category: categoryStructure['Latest Automation News & Articles'][0], // Set default subcategory
    tags: '',
    published: false,
    author: '',
    bannerImage: null,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [mounted, setMounted] = useState(false);
  const { title, content, parentCategory, category, tags, published, author, bannerImage } = formData;

  // Initialize form with existing data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        content: initialData.content || '',
        parentCategory: initialData.parentCategory || 'Latest Automation News & Articles',
        category: initialData.category || categoryStructure['Latest Automation News & Articles'][0],
        tags: initialData.tags?.join(', ') || '',
        published: initialData.published || false,
        author: initialData.author || '',
        bannerImage: null,
      });
      if (initialData.bannerImage) {
        setImagePreview(initialData.bannerImage);
      }
    }
  }, [initialData]);

  useEffect(() => {
    setMounted(true);
    import('react-quill/dist/quill.snow.css');
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === 'bannerImage') {
        const file = files[0];
        setFormData({
          ...formData,
          bannerImage: file,
        });
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
              setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
          } else {
            setImagePreview(null);
          }
        } else {
          setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
          });
        }
      };

  const handleContentChange = (value) => {
    setFormData({ ...formData, content: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = blogId 
        ? `/api/admin/blogs/${blogId}`
        : '/api/admin/blogs';
      
      if (blogId) {
        // For editing, send JSON data
        const updateData = {
          title: formData.title || undefined,
          content: formData.content || undefined,
          parentCategory: formData.parentCategory || undefined,
          category: formData.category || undefined,
          tags: formData.tags || undefined,
          published: Boolean(formData.published),
          author: formData.author || undefined,
        };

        console.log('Update Data:', updateData);

        // Remove undefined values
        Object.keys(updateData).forEach(key => 
          updateData[key] === undefined && delete updateData[key]
        );

        const res = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to update blog');
        }

        if (data.success) {
          if (onBlogUpdated) onBlogUpdated(data.data);
        } else {
          setError(data.message || 'Failed to update blog.');
        }
      } else {
        // For creating new blog, use FormData
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('content', formData.content);
        formDataToSend.append('parentCategory', formData.parentCategory);
        formDataToSend.append('category', formData.category);
        formDataToSend.append('tags', formData.tags);
        formDataToSend.append('published', formData.published);
        formDataToSend.append('author', formData.author);
        
        console.log('Form Data:', {
          title: formData.title,
          parentCategory: formData.parentCategory,
          category: formData.category,
        });
        
        if (formData.bannerImage) {
          formDataToSend.append('bannerImage', formData.bannerImage);
        }

        const res = await fetch(url, {
          method: 'POST',
          body: formDataToSend,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to create blog');
        }

        if (data.success) {
          setFormData({
            title: '',
            content: '',
            parentCategory: 'Latest Automation News & Articles',
            category: categoryStructure['Latest Automation News & Articles'][0],
            tags: '',
            published: false,
            author: '',
            bannerImage: null,
          });
          setImagePreview(null);
          if (onBlogCreated) onBlogCreated(data.data);
        } else {
          setError(data.message || 'Failed to create blog.');
        }
      }
    } catch (err) {
      console.error(`Error ${blogId ? 'updating' : 'submitting'} form:`, err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">
        {blogId ? 'Edit Blog' : 'Create New Blog'}
      </h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Blog Title"
            required
          />
        </div>

        {/* Parent Category */}
        <div className="mb-4">
          <label htmlFor="parentCategory" className="block text-sm font-medium text-gray-700">
            Parent Category <span className="text-red-500">*</span>
          </label>
          <select
            name="parentCategory"
            id="parentCategory"
            value={parentCategory}
            onChange={(e) => {
              const newParentCategory = e.target.value;
              setFormData({
                ...formData,
                parentCategory: newParentCategory,
                category: categoryStructure[newParentCategory][0]
              });
            }}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            required
          >
            {Object.keys(categoryStructure).map((parent) => (
              <option key={parent} value={parent}>
                {parent}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory */}
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Subcategory <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            id="category"
            value={category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            required
          >
            {categoryStructure[parentCategory]?.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Author Name */}
        <div className="mb-4">
          <label htmlFor="author" className="block text-sm font-medium text-gray-700">
            Author Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="author"
            id="author"
            value={author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Author Name"
            required
          />
        </div>

        {/* Banner Image */}
        <div className="mb-4">
          <label htmlFor="bannerImage" className="block text-sm font-medium text-gray-700">
            Banner Image {blogId ? '(Leave empty to keep current image)' : ''}
          </label>
          <input
            type="file"
            name="bannerImage"
            id="bannerImage"
            accept="image/*"
            onChange={handleChange}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Banner Preview"
                className="w-full h-40 object-cover rounded"
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content <span className="text-red-500">*</span>
          </label>
          {mounted && (
            <ReactQuill
              theme="snow"
              value={content}
              onChange={handleContentChange}
              className="w-full h-64"
              placeholder="Write your blog content here..."
            />
          )}
        </div>

        {/* Tags */}
        <div className="mb-4">
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
            Tags
          </label>
          <input
            type="text"
            name="tags"
            id="tags"
            value={tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            placeholder="e.g., React, Next.js, Web Development"
          />
        </div>

        {/* Published */}
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            name="published"
            id="published"
            checked={published}
            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
            Publish Now
          </label>
        </div>

        {/* Error Message */}
        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 font-semibold text-white rounded ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400'
          }`}
        >
          {loading ? `${blogId ? 'Updating' : 'Creating'} Blog...` : blogId ? 'Update Blog' : 'Create Blog'}
        </button>
      </form>
    </div>
  );
}