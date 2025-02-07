import { requireAuth } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await requireAuth();
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {session.user.name}
      </h1>
      {/* Dashboard content */}
    </div>
  );
}