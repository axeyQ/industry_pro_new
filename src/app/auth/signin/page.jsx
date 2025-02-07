import LoginButton from '@/components/auth/LoginButton';
import Link from 'next/link';

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Welcome Back</h2>
          <p className="mt-2 text-gray-600">
            Sign in to access your account
          </p>
        </div>
        <div className="flex justify-center">
          <LoginButton />
        </div>
      </div>

      <div className="max-w-md w-full space-y-8 p-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Welcome Back</h2>
          <p className="mt-2 text-gray-600">
            Sign in to access your Business account
          </p>
        </div>
        <div className="flex justify-center">
          <Link href="/auth/business/register">Sign In</Link>
        </div>
      </div>

    </div>
  );
}