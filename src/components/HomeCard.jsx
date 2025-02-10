"use client";
import Image from "next/image";
import { FollowerPointerCard } from "./ui/following-pointer";
import { useEffect, useState } from "react";
import DOMPurify from 'isomorphic-dompurify';
import Link from "next/link";

export function HomeCard({blog}) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);
  
    // Get first 100 characters of content and sanitize
    const truncatedContent = blog.content 
      ? DOMPurify.sanitize(blog.content.substring(0, 100))
      : '';
  
    if (!mounted) {
      return null; // or a loading skeleton
    }
  
  return (
    (<div className="w-80 mx-auto">
      <FollowerPointerCard
        title={
          <TitleComponent title={blog.author} avatar={blog.bannerImage} />
        }>
        <div
          className="relative overflow-hidden h-full rounded-2xl transition duration-200 group bg-white shadow-xl border border-zinc-100 ">
          <div
            className="w-full aspect-w-16 aspect-h-10 bg-gray-100 rounded-tr-lg rounded-tl-lg overflow-hidden xl:aspect-w-16 xl:aspect-h-10 relative">
            <Image
              src={blog.bannerImage || '/default-banner.jpg'}
              alt={blog.title || 'Blog post'}
              height={200}
              width={500}
              objectFit="cover"
              priority={true}
              className={`group-hover:scale-95 group-hover:rounded-2xl transform object-cover transition duration-200 `} />
          </div>
          <div className=" p-4 min-h-[280px] flex flex-col justify-between">
          <div>

            <h2 className="font-bold my-4 text-lg text-zinc-700">
              {blog.title}
            </h2>
            <h2 className="font-normal my-4 text-sm text-zinc-500" 
            dangerouslySetInnerHTML={{ __html: truncatedContent }}>
            </h2>
          </div>

            <div className="flex flex-row justify-between items-center">
              <span className="text-sm text-gray-500">{blog.date}</span>
              <Link href={`/post/${blog._id}`}
                className="relative z-10 px-6 py-2 bg-black text-white font-bold rounded-xl block text-xs cursor-none">
                Read More
              </Link>
            </div>
          </div>
        </div>
      </FollowerPointerCard>
    </div>)
  );
}


const TitleComponent = ({
  title,
  avatar
}) => (
  <div className="flex space-x-2 items-center">
    <Image
      src={avatar}
      height="20"
      width="20"
      alt="thumbnail"
      className="rounded-full border-2 border-white" />
    <p>{title}</p>
  </div>
);
