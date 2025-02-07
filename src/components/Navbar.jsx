'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import UserMenu from './auth/UserMenu';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Blogs', href: '/blogs' },
    { name: 'Product Listings', href: '/listings' },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo and primary nav */}
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <Image
                  src="/logo.png" // Add your logo path
                  alt="Logo"
                  width={40}
                  height={40}
                  className="h-8 w-auto"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side buttons */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center gap-4">
            <ThemeToggle />
            {status === 'loading' ? (
              <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-blue-500" />
            ) : session ? (
              <div className="flex items-center space-x-4">
                {session.user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="text-sm font-medium text-gray-700 hover:text-blue-600"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <UserMenu />
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Sign in
              </Link>
            )}

          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Menu icon */}
              {!isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
          {/* Mobile auth buttons */}
          <div className="pt-4 pb-3 border-t border-gray-200">
            {session ? (
              <div className="flex items-center px-4">
                {session.user?.image && (
                  <div className="flex-shrink-0">
                    <Image
                      src={session.user.image}
                      alt={session.user.name || ''}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full"
                    />
                  </div>
                )}
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {session.user?.name}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {session.user?.email}
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-4">
                <Link
                  href="/auth/signin"
                  className="block text-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}