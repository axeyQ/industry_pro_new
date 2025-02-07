'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { FaUser, FaMapMarkerAlt, FaTags, FaCog } from 'react-icons/fa';

export default function ListingDetails({ params }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchListing();
  }, [params.id]);

  const fetchListing = async () => {
    try {
      const res = await fetch(`/api/listings/${params.id}`);
      const data = await res.json();

      if (data.success) {
        setListing(data.data);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to fetch listing details');
    } finally {
      setLoading(false);
    }
  };

  const handleContact = async (e) => {
    e.preventDefault();
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingId: listing._id,
          sellerId: listing.seller._id,
          message,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage('');
        setShowContactForm(false);
        // Show success message
      }
    } catch (error) {
      setError('Failed to send message');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg">
            {error || 'Listing not found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            <div className="space-y-4">
              <div className="relative h-96 rounded-lg overflow-hidden">
                {listing.images && listing.images.length > 0 ? (
                  <Image
                    src={listing.images[selectedImage]}
                    alt={listing.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </div>
              {listing.images && listing.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {listing.images.map((image, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-20 rounded-lg overflow-hidden cursor-pointer ${
                        selectedImage === index ? 'ring-2 ring-blue-500' : ''
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${listing.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Listing Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-gray-900">{listing.name}</h1>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {listing.type}
                  </span>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <FaMapMarkerAlt className="mr-2" />
                  {listing.location.city}, {listing.location.state}, {listing.location.country}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900">Description</h2>
                <p className="mt-2 text-gray-600">{listing.description}</p>
              </div>

              {listing.specifications && listing.specifications.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {listing.type === 'product' ? 'Specifications' : 'Service Details'}
                  </h2>
                  <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                    {listing.specifications.map((spec, index) => (
                      <div key={index} className="border-b border-gray-200 pb-2">
                        <dt className="text-sm font-medium text-gray-500">{spec.name}</dt>
                        <dd className="mt-1 text-sm text-gray-900">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {listing.tags && listing.tags.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Tags</h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {listing.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Seller Info */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden">
                    {listing.seller.image ? (
                      <Image
                        src={listing.seller.image}
                        alt={listing.seller.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <FaUser className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">
                      {listing.seller.name}
                    </h3>
                    <p className="text-sm text-gray-500">Member since {new Date(listing.seller.createdAt).getFullYear()}</p>
                  </div>
                </div>

                {session?.user?.email !== listing.seller.email && (
                  <button
                    onClick={() => setShowContactForm(true)}
                    className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Contact Seller
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Modal */}
        {showContactForm && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-lg font-semibold mb-4">Contact Seller</h2>
              <form onSubmit={handleContact}>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message..."
                  className="w-full h-32 p-2 border rounded-md resize-none"
                  required
                />
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 