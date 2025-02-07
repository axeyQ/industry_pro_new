"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import DOMPurify from 'isomorphic-dompurify';
import { useState, useEffect } from 'react';
import Link from "next/link";

export default function BlogCard({ blog }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get first 100 characters of content and sanitize
  const truncatedContent = blog.content 
    ? DOMPurify.sanitize(blog.content.substring(0, 100)) + '...'
    : '';

  if (!mounted) {
    return null; // or a loading skeleton
  }

  return (
    <Link href={`/post/${blog._id}`} className="max-w-xs w-full group/card">
      <div
        className={cn(
          "cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl max-w-sm mx-auto backgroundImage flex flex-col justify-between p-4",
          "bg-cover"
        )}
        style={{ 
          backgroundImage: `url(${blog.bannerImage || '/default-banner.jpg'})`
        }}
      >
        <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60"></div>
        <div className="flex flex-row items-center space-x-4 z-10">
          <Image
            height={40}
            width={40}
            src={blog.bannerImage || '/default-banner.jpg'}
            alt={blog.title || 'Blog post'}
            className="h-10 w-10 rounded-full border-2 object-cover"
            priority={true}
          />
          <div className="flex flex-col">
            <p className="font-normal text-base text-gray-50 relative z-10">
              {blog.category}
            </p>
            <p className="text-sm text-gray-400">{blog.author || 'Anonymous'}</p>
          </div>
        </div>
        <div className="text content">
          <h1 className="font-bold text-xl md:text-2xl text-gray-50 relative z-10">
            {blog.title}
          </h1>
          <div 
            className="font-normal text-sm text-gray-50 relative z-10 my-4"
            dangerouslySetInnerHTML={{ __html: truncatedContent }}
          />
        </div>
      </div>
    </Link>
  );
}
