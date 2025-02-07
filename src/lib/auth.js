import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

export async function requireAuth() {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/auth/signin');
  }
  
  return session;
}

export async function redirectIfAuthenticated() {
  const session = await getServerSession();
  
  if (session) {
    redirect('/dashboard');
  }
}