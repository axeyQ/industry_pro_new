'use client';
import { useState } from 'react';
import { FaLinkedin, FaTwitter, FaGithub, FaTimes } from 'react-icons/fa';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';
export function BasicInfoModal({ data, onSave, onCancel, saving,title }) {
  const [formData, setFormData] = useState({
    position: data.position || '',
    company: data.company || '',
    address: data.address || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black relative" >
     <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        {title}
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Edit your {title} information here
      </p>
    <form className="mt-6 mb-0" onSubmit={handleSubmit} >
   
      <LabelInputContainer className="mb-4">
        <Label htmlFor="position">Position</Label>
        <Input
          type="text"
          value={formData.position}
          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </LabelInputContainer>
      <LabelInputContainer className="mb-4">
        <Label htmlFor="company">Company</Label>
        <Input
          type="text"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </LabelInputContainer>
      <LabelInputContainer className="mb-4">
        <Label htmlFor="address">Location</Label>
        <Input
          type="text"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </LabelInputContainer>
      <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded absolute top-2 right-2" 
        >
          <FaTimes />
        </button>
        <button
          type="submit"
          disabled={saving}
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
        >
          {saving ? 'Saving...' : 'Save'}
          <BottomGradient />
        </button>
      </div>
    </form>
    </div>
  );
}

export function AboutModal({ data, onSave, onCancel, saving,title }) {
  const [bio, setBio] = useState(data.bio || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ bio });
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black relative" >
    <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        {title}
          </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Edit your {title} information here
      </p>
    <form onSubmit={handleSubmit} className="mt-6 mb-0">
      <LabelInputContainer className="mb-4">
        <label className="block text-sm font-medium text-gray-700">About</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={6}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Write a summary about yourself..."
        />
        </LabelInputContainer>
        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

<div className="flex justify-end gap-3 mt-6">
  <button
    type="button"
    onClick={onCancel}
    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded absolute top-2 right-2" 
  >
    <FaTimes />
  </button>
  <button
    type="submit"
    disabled={saving}
    className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
  >
    {saving ? 'Saving...' : 'Save'}
    <BottomGradient />
  </button>
</div>
    </form>
    </div>
  );
}

export function ContactInfoModal({ data, onSave, onCancel, saving,title }) {
  const [formData, setFormData] = useState({
    phone: data.phone || '',
    address: data.address || '',
    socialLinks: {
      linkedin: data.socialLinks?.linkedin || '',
      twitter: data.socialLinks?.twitter || '',
      github: data.socialLinks?.github || ''
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black relative" >
    <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        {title}
          </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Edit your {title} information here
      </p>
    <form onSubmit={handleSubmit} className="mt-6 mb-0">
      <LabelInputContainer className="mb-4">
        <Label htmlFor="phone">Phone</Label>
        <Input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </LabelInputContainer>
      <LabelInputContainer className="mb-4">
        <Label htmlFor="address">Address</Label>
        <Input
          type="text"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </LabelInputContainer>
      <LabelInputContainer className="mb-4">
        <Label htmlFor="socialLinks">Social Links</Label>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <FaLinkedin className="text-[#0077b5]" />
            <Input
              type="url"
              value={formData.socialLinks.linkedin}
              onChange={(e) => setFormData({
                ...formData,
                socialLinks: { ...formData.socialLinks, linkedin: e.target.value }
              })}
              placeholder="LinkedIn URL"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <FaTwitter className="text-[#1da1f2]" />
            <Input
              type="url"
              value={formData.socialLinks.twitter}
              onChange={(e) => setFormData({
                ...formData,
                socialLinks: { ...formData.socialLinks, twitter: e.target.value }
              })}
              placeholder="Twitter URL"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <FaGithub />
            <Input
              type="url"
              value={formData.socialLinks.github}
              onChange={(e) => setFormData({
                ...formData,
                socialLinks: { ...formData.socialLinks, github: e.target.value }
              })}
              placeholder="GitHub URL"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </LabelInputContainer>
      
      <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

<div className="flex justify-end gap-3 mt-6">
  <button
    type="button"
    onClick={onCancel}
    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded absolute top-2 right-2" 
  >
    <FaTimes />
  </button>
  <button
    type="submit"
    disabled={saving}
    className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
  >
    {saving ? 'Saving...' : 'Save'}
    <BottomGradient />
  </button>
</div>
    </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};
 
const LabelInputContainer = ({
  children,
  className,
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};