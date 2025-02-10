'use client';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function UserMenu() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (!session) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        {session.user.image && (
          <Image
            src={session.user.image}
            alt={session.user.name}
            width={32}
            height={32}
            className="rounded-full"
          />
        )}
        {/* <span>{session.user.name}</span> */}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
        <div className="flex flex-col items-center justify-center mb-3">
        {session.user.image && (
          <Image
            src={session.user.image}
            alt={session.user.name}
            width={60}
            height={60}
            className="rounded-full mb-2"
          />
        )}
        <span className='text-base font-medium text-gray-700'>{session.user.name}</span>
        <span className=' text-xs text-gray-700'>{session.user.email}</span>
        </div>
          <Link
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            Profile
          </Link>
          <button
            onClick={() => signOut()}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}