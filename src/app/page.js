import { Suspense } from 'react';
import Link from 'next/link';
import BlogCard from '@/components/BlogCard';
import ListingCard from '@/components/ListingCard';
import { getServerSession } from 'next-auth/next';
import { headers } from 'next/headers';
import { HomeCard } from '@/components/HomeCard';

// Parent category tabs data
const parentCategories = [
  'Latest Automation News & Articles',
  'What\'s trending',
  'For Your Conceptual Understanding'
];

async function getBlogs(parentCategory) {
  try {
    // Encode the parent category for the URL
    const encodedCategory = encodeURIComponent(parentCategory);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    const res = await fetch(
      `${baseUrl}/api/admin/blogs?parentCategory=${encodedCategory}`,
      {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch blogs: ${res.status}`);
    }

    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

async function getLatestListings() {
  try {
    const session = await getServerSession();
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    // Add session info to headers
    const headersList = new Headers(headers());
    if (session) {
      headersList.set('x-auth-email', session.user.email);
    }

    const res = await fetch(
      `${baseUrl}/api/listings?limit=4`,
      {
        cache: 'no-store',
        headers: headersList,
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch listings: ${res.status}`);
    }

    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching listings:', error);
    return [];
  }
}

export default async function Home() {
  // Fetch blogs for each parent category
  const blogsByCategory = await Promise.all(
    parentCategories.map(async (category) => ({
      category,
      blogs: await getBlogs(category)
    }))
  );

  // Fetch latest listings
  const latestListings = await getLatestListings();

  return (
    <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] dark:bg-black">


      {/* Existing Blog Categories */}
      {blogsByCategory.map(({ category, blogs }) => (
        <section key={category} className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold dark:text-white text-gray-800">{category}</h2>
            {blogs.length > 4 && (


<Link
href={`/category/${encodeURIComponent(category)}`}
  class="overflow-hidden relative w-32 p-2 h-12 bg-black text-white dark:border-2 dark:border-white hover:border-none rounded-md text-lg flex justify-center items-center font-bold cursor-pointer z-10 group"
>
  View All
  <span
    class="absolute w-36 h-32 -top-8 -left-2 bg-sky-200 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-right"
  ></span>
  <span
    class="absolute w-36 h-32 -top-8 -left-2 bg-sky-400 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-right"
  ></span>
  <span
    class="absolute w-36 h-32 -top-8 -left-2 bg-sky-600 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-1000 duration-500 origin-right"
  ></span>
  <span
    class="group-hover:opacity-100 group-hover:duration-1000 duration-100 opacity-0 absolute top-2.5 left-6 z-10"
    >Explore!</span>
</Link>


            )}
          </div>
          <Suspense fallback={<div>Loading blogs...</div>}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {blogs.slice(0, 4).map((blog) => (
                <HomeCard key={blog._id} blog={blog} />
              ))}
            </div>
            {blogs.length === 0 && (
              <p className="text-gray-500">No blogs found in this category.</p>
            )}
          </Suspense>
        </section>
      ))}

            {/* Latest Listings Section */}
            <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Latest Products & Services</h2>
          <Link
            href="/listings"
  class="overflow-hidden relative w-32 p-2 h-12 bg-black text-white  dark:border-2 dark:border-white rounded-md text-lg flex justify-center items-center hover:border-none font-bold cursor-pointer z-10 group"
>
  View All
  <span
    class="absolute w-36 h-32 -top-8 -left-2 bg-sky-200 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-right"
  ></span>
  <span
    class="absolute w-36 h-32 -top-8 -left-2 bg-sky-400 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-right"
  ></span>
  <span
    class="absolute w-36 h-32 -top-8 -left-2 bg-sky-600 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-1000 duration-500 origin-right"
  ></span>
  <span
    class="group-hover:opacity-100 group-hover:duration-1000 duration-100 opacity-0 absolute top-2.5 left-6 z-10"
    >Explore!</span>
</Link>
        </div>
        <Suspense fallback={<div>Loading listings...</div>}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {latestListings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
          {latestListings.length === 0 && (
            <p className="text-gray-500">No listings found.</p>
          )}
        </Suspense>
      </section>
    </div>
  );
}