'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { FaCloudUploadAlt, FaPlus, FaTimes } from 'react-icons/fa';

export default function EditListing({ params }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState([]);
  const [specifications, setSpecifications] = useState([{ name: '', value: '' }]);
  const [formData, setFormData] = useState({
    name: '',
    type: 'product',
    description: '',
    category: '',
    customizationAvailable: false,
    tags: '',
    status: 'active',
    location: {
      city: '',
      state: '',
      country: ''
    }
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
    if (status === 'authenticated') {
      fetchListing();
    }
  }, [status, params.id]);

  const fetchListing = async () => {
    try {
      const res = await fetch(`/api/listings/${params.id}`);
      const data = await res.json();

      if (data.success) {
        const listing = data.data;
        setFormData({
          ...listing,
          tags: listing.tags.join(', ')
        });
        setImages(listing.images || []);
        setSpecifications(listing.specifications.length > 0 
          ? listing.specifications 
          : [{ name: '', value: '' }]
        );
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to fetch listing');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setLoading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        const res = await fetch('/api/listings/upload-image', {
          method: 'POST',
          body: formData
        });

        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        return data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setImages(prev => [...prev, ...uploadedUrls]);
    } catch (error) {
      setError('Failed to upload images');
    } finally {
      setLoading(false);
    }
  };

  const handleSpecificationChange = (index, field, value) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = value;
    setSpecifications(newSpecs);
  };

  const addSpecification = () => {
    setSpecifications([...specifications, { name: '', value: '' }]);
  };

  const removeSpecification = (index) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const listingData = {
        ...formData,
        images,
        specifications: specifications.filter(spec => spec.name && spec.value),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };

      const res = await fetch(`/api/listings/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(listingData)
      });

      const data = await res.json();
      if (data.success) {
        router.push('/profile');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to update listing');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">Edit Listing</h1>

          {error && (
            <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Listing Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Listing Type
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="product"
                    checked={formData.type === 'product'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">Product</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    value="service"
                    checked={formData.type === 'service'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">Service</span>
                </label>
              </div>
            </div>

            {/* Basic Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            {/* Location */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  value={formData.location.city}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, city: e.target.value }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">State</label>
                <input
                  type="text"
                  value={formData.location.state}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, state: e.target.value }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Country</label>
                <input
                  type="text"
                  value={formData.location.country}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, country: e.target.value }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images
              </label>
              <div className="grid grid-cols-4 gap-4 mb-4">
                {images.map((url, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={url}
                      alt={`Image ${index + 1}`}
                      width={100}
                      height={100}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, i) => i !== index))}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                    >
                      <FaTimes className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <label className="w-full h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                  <div className="text-center">
                    <FaCloudUploadAlt className="w-8 h-8 mx-auto text-gray-400" />
                    <span className="mt-2 block text-sm text-gray-600">Add Image</span>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>

            {/* Specifications */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.type === 'product' ? 'Specifications' : 'Service Details'}
              </label>
              {specifications.map((spec, index) => (
                <div key={index} className="flex gap-4 mb-2">
                  <input
                    type="text"
                    placeholder={formData.type === 'product' ? "Spec name" : "Detail name"}
                    value={spec.name}
                    onChange={(e) => handleSpecificationChange(index, 'name', e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={spec.value}
                    onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpecification(index)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addSpecification}
                className="mt-2 flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <FaPlus className="w-4 h-4 mr-1" />
                Add {formData.type === 'product' ? 'Specification' : 'Service Detail'}
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="e.g., handmade, vintage, professional"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="customization"
                checked={formData.customizationAvailable}
                onChange={(e) => setFormData({ ...formData, customizationAvailable: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="customization" className="ml-2 block text-sm text-gray-700">
                {formData.type === 'product' 
                  ? 'Customization Available'
                  : 'Service can be customized'}
              </label>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 