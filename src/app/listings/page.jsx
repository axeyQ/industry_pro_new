'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaSearch, FaFilter } from 'react-icons/fa';
import Link from 'next/link';

export default function Listings() {
  const router = useRouter();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    search: '',
    city: '',
    state: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchListings();
  }, [filters]);

  const fetchListings = async () => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const res = await fetch(`/api/listings?${queryParams}`);
      const data = await res.json();

      if (data.success) {
        setListings(data.data);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search listings..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <FaFilter className="mr-2" />
              Filters
            </button>
            <Link className="flex items-center justify-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200" href="/listings/create">Create Listing</Link>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="rounded-lg border border-gray-300 p-2"
              >
                <option value="">All Types</option>
                <option value="product">Products</option>
                <option value="service">Services</option>
              </select>

              <input
                type="text"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                placeholder="Category"
                className="rounded-lg border border-gray-300 p-2"
              />

              <input
                type="text"
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                placeholder="City"
                className="rounded-lg border border-gray-300 p-2"
              />

              <input
                type="text"
                name="state"
                value={filters.state}
                onChange={handleFilterChange}
                placeholder="State"
                className="rounded-lg border border-gray-300 p-2"
              />
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div
              key={listing._id}
              onClick={() => router.push(`/listings/${listing._id}`)}
              className="bg-white rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48">
                {listing.images && listing.images[0] ? (
                  <Image
                    src={listing.images[0]}
                    alt={listing.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm">
                  {listing.type}
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {listing.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  {listing.description.substring(0, 100)}...
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {listing.location.city}, {listing.location.state}
                  </span>
                  <span className="text-blue-600">
                    {listing.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {listings.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-500">No listings found</p>
          </div>
        )}
      </div>
    </div>
  );
} 