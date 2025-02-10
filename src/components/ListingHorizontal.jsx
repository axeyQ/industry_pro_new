import Image from 'next/image';
import Link from 'next/link';
import { FaMapMarkerAlt } from 'react-icons/fa';

export default function ListingHorizontal({ listing }) {
  return (
    <Link 
      href={`/listings/${listing._id}`}
      className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
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
        
        {/* Specifications Section */}
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

        <div className="flex items-center justify-between text-sm">
          {/* <div className="flex items-center text-gray-500">
            <FaMapMarkerAlt className="mr-1" />
            <span>
              {listing.location.city}, {listing.location.state}
            </span>
          </div> */}
          <span className="text-green-600 font-bold bg-green-100 px-2 py-1 rounded-md">
            In Stock
          </span>
          <span className="text-blue-600">
            {listing.category}
          </span>
        </div>
      </div>
    </Link>
  );
} 