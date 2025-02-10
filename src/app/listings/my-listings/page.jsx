'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function MyListings() {
  const { data: session } = useSession();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    try {
      const res = await fetch('/api/listings/user');
      const data = await res.json();
      setListings(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error('Error fetching listings');
      setLoading(false);
    }
  };

  const handleDelete = async (listingId) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        const res = await fetch(`/api/listings/${listingId}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          toast.success('Listing deleted successfully');
          // Remove the deleted listing from state
          setListings(listings.filter((listing) => listing._id !== listingId));
        }
      } catch (error) {
        console.error('Error deleting listing:', error);
        toast.error('Error deleting listing');
      }
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!session) {
    return <div className="text-center mt-10">Please sign in to view your listings</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Listings</h1>
        <Link
          href="/listings/create"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <p>You haven&apos;t created any listings yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg overflow-hidden shadow-md bg-white dark:bg-gray-800"
            >
              <Image
                src={listing.images[0] || '/images/default-property.jpg'}
                alt={listing.name}
                width={500}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{listing.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  ${listing.price.toLocaleString()}
                </p>
                <div className="flex justify-end space-x-4">
                  <Link
                    href={`/listings/edit/${listing._id}`}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <FaEdit className="text-xl" />
                  </Link>
                  <button
                    onClick={() => handleDelete(listing._id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <FaTrash className="text-xl" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}