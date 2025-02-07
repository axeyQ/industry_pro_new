'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaUsers, FaChartLine, FaCog, FaBell } from 'react-icons/fa';
import { MdBusinessCenter, MdLocationOn } from 'react-icons/md';

export default function BusinessDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
    if (status === 'authenticated') {
      fetchBusinessData();
    }
  }, [status, router]);

  const fetchBusinessData = async () => {
    try {
      const res = await fetch('/api/business/profile');
      const data = await res.json();
      
      if (data.success) {
        setBusiness(data.data);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to load business data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h2 className="text-xl font-bold mb-4">No Business Found</h2>
            <p className="mb-4">You haven't registered a business yet.</p>
            <button
              onClick={() => router.push('/auth/business/register')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Register Business
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              {business.logo && (
                <Image
                  src={business.logo}
                  alt={business.name}
                  width={48}
                  height={48}
                  className="rounded-lg mr-4"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{business.name}</h1>
                <p className="text-gray-500">{business.industry}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <FaBell className="w-6 h-6" />
              </button>
              <button 
                onClick={() => router.push('/business/settings')}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <FaCog className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaUsers className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500">Employees</p>
                <p className="text-2xl font-bold">{business.employees?.length || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FaChartLine className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500">Company Size</p>
                <p className="text-2xl font-bold">{business.size}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <MdBusinessCenter className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500">Status</p>
                <p className="text-2xl font-bold">
                  {business.isVerified ? 'Verified' : 'Pending'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Business Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Business Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-500">Description</p>
                <p className="text-gray-900">{business.description}</p>
              </div>
              <div>
                <p className="text-gray-500">Contact</p>
                <p className="text-gray-900">{business.phone}</p>
                <p className="text-gray-900">{business.email}</p>
              </div>
              <div className="flex items-center">
                <MdLocationOn className="text-gray-400 mr-2" />
                <p className="text-gray-900">
                  {`${business.address.street}, ${business.address.city}, ${business.address.state} ${business.address.postalCode}`}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => router.push('/business/employees')}
                className="p-4 border rounded-lg hover:bg-gray-50 text-center"
              >
                <FaUsers className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <span>Manage Employees</span>
              </button>
              <button
                onClick={() => router.push('/business/profile')}
                className="p-4 border rounded-lg hover:bg-gray-50 text-center"
              >
                <MdBusinessCenter className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <span>Edit Profile</span>
              </button>
              {/* Add more quick actions as needed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 