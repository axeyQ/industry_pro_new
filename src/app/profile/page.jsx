'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaLinkedin, FaTwitter, FaGithub, FaPencilAlt, FaCamera, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { MdWork, MdPhone, MdLocationOn } from 'react-icons/md';
import { BasicInfoModal, AboutModal, ContactInfoModal } from '@/components/profile/EditModals';
import Link from 'next/link';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    image: '',
    company: '',
    position: '',
    phone: '',
    address: '',
    bio: '',
    socialLinks: {
      linkedin: '',
      twitter: '',
      github: ''
    }
  });
  const [userListings, setUserListings] = useState([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
    if (status === 'authenticated') {
      fetchProfileData();
      fetchUserListings();
    }
  }, [status, router]);

  const fetchProfileData = async () => {
    try {
      const res = await fetch('/api/user/profile');
      const data = await res.json();
      if (data.success) {
        setProfileData(data.data);
      }
    } catch (error) {
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserListings = async () => {
    try {
      const res = await fetch('/api/listings/user');
      const data = await res.json();
      
      if (data.success) {
        setUserListings(data.data);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to fetch listings');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setSaving(true);
      const res = await fetch('/api/user/profile/image', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setProfileData(prev => ({ ...prev, image: data.data.image }));
      }
    } catch (error) {
      setError('Failed to upload image');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (sectionData) => {
    setSaving(true);
    try {
      const updatedData = {
        ...profileData,
        ...sectionData
      };

      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      const responseData = await res.json();
      
      if (responseData.success) {
        setProfileData(responseData.data);
        setActiveSection(null);
      } else {
        setError(responseData.message || 'Failed to save changes');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      setError('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (listingId) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    try {
      const res = await fetch(`/api/listings/${listingId}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (data.success) {
        setUserListings(userListings.filter(listing => listing._id !== listingId));
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to delete listing');
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
    <div className="bg-gray-100 min-h-screen pb-8">
      {/* Cover Photo Section */}
      <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-600 relative">
        {/* Profile Image */}
        <div className="absolute -bottom-16 left-8">
          <div className="relative">
            <Image
              src={profileData.image || '/default-avatar.png'}
              alt={profileData.name}
              width={128}
              height={128}
              className="rounded-full border-4 border-white"
            />
            <label className="absolute bottom-0 right-0 bg-gray-100 p-2 rounded-full cursor-pointer hover:bg-gray-200">
              <FaCamera className="text-gray-600" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 mt-20">
        {error && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        {/* Basic Info Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{profileData.name}</h1>
              <p className="text-lg text-gray-600">{profileData.position} at {profileData.company}</p>
              <p className="text-gray-500 flex items-center mt-1">
                <MdLocationOn className="mr-1" /> {profileData.address || 'Location not specified'}
              </p>
              <div className="mt-4 flex space-x-4">
                {profileData.socialLinks?.linkedin && (
                  <a
                    href={profileData.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    <FaLinkedin size={24} />
                  </a>
                )}
                {profileData.socialLinks?.twitter && (
                  <a
                    href={profileData.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-400"
                  >
                    <FaTwitter size={24} />
                  </a>
                )}
                {profileData.socialLinks?.github && (
                  <a
                    href={profileData.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <FaGithub size={24} />
                  </a>
                )}
              </div>
            </div>
            <button
              onClick={() => setActiveSection('basic')}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
            >
              <FaPencilAlt />
            </button>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold">About</h2>
            <button
              onClick={() => setActiveSection('about')}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
            >
              <FaPencilAlt />
            </button>
          </div>
          <p className="text-gray-700 whitespace-pre-wrap">
            {profileData.bio || 'No bio provided'}
          </p>
        </div>

        {/* Experience Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold">Experience</h2>
            <button
              onClick={() => setActiveSection('experience')}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
            >
              <FaPencilAlt />
            </button>
          </div>
          <div className="flex items-start space-x-4">
            <div className="mt-1">
              <MdWork className="text-gray-400 text-2xl" />
            </div>
            <div>
              <h3 className="font-semibold">{profileData.position}</h3>
              <p className="text-gray-600">{profileData.company}</p>
            </div>
          </div>
        </div>

        {/* Contact Info Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold">Contact Info</h2>
            <button
              onClick={() => setActiveSection('contact')}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
            >
              <FaPencilAlt />
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <MdPhone className="text-gray-400 text-xl" />
              <span>{profileData.phone || 'Phone not provided'}</span>
            </div>
            <div className="flex items-center space-x-3">
              <MdLocationOn className="text-gray-400 text-xl" />
              <span>{profileData.address || 'Address not provided'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
            <h2 className="text-xl font-bold">Listings</h2>
            <div className="flex flex-wrap gap-4">
                <Link href="/listings">Your Product Listings</Link>
            </div>
        </div>

        {/* My Listings Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">My Listings</h2>
              <button
                onClick={() => router.push('/listings/create')}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <FaPlus className="mr-2" />
                Create New Listing
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : userListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {userListings.map((listing) => (
                <div key={listing._id} className="bg-white border rounded-lg overflow-hidden">
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
                    <p className="text-gray-600 text-sm mb-4">
                      {listing.description.substring(0, 100)}...
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {listing.location.city}, {listing.location.state}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => router.push(`/listings/edit/${listing._id}`)}
                          className="p-2 text-blue-600 hover:text-blue-800"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(listing._id)}
                          className="p-2 text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              You haven't created any listings yet.
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {activeSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">
              Edit {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
            </h2>
            
            {activeSection === 'basic' && (
              <BasicInfoModal
                data={profileData}
                onSave={handleSave}
                onCancel={() => setActiveSection(null)}
                saving={saving}
              />
            )}
            
            {activeSection === 'about' && (
              <AboutModal
                data={profileData}
                onSave={handleSave}
                onCancel={() => setActiveSection(null)}
                saving={saving}
              />
            )}
            
            {activeSection === 'contact' && (
              <ContactInfoModal
                data={profileData}
                onSave={handleSave}
                onCancel={() => setActiveSection(null)}
                saving={saving}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}