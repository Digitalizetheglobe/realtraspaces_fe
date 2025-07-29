"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Blog {
  id: number;
  blogTitle: string;
  blogDescription: string;
  blogImage: string | null;
  writer: string;
  category: string;
  tags: string[];
  slug: string;
  likes: number;
  bookmarks: number;
}

const BlogPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/api/blogs/`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        let blogsArray: Blog[] = [];
        if (Array.isArray(data)) {
          blogsArray = data;
        } else if (data.blogs) {
          blogsArray = Array.isArray(data.blogs) ? data.blogs : [];
        } else if (data.data) {
          blogsArray = Array.isArray(data.data) ? data.data : [];
        } else if (typeof data === "object") {
          blogsArray = [data];
        }
        blogsArray = blogsArray.map((blog) => {
          let cleanImageUrl = null;
          if (blog.blogImage) {
            try {
              const url = new URL(blog.blogImage);
              if (url.protocol === "http:" || url.protocol === "https:") {
                cleanImageUrl = blog.blogImage;
              }
            } catch (e) {}
          }
          return {
            ...blog,
            blogImage: cleanImageUrl,
            tags: Array.isArray(blog.tags) ? blog.tags : [],
            likes: typeof blog.likes === "number" ? blog.likes : 0,
            bookmarks: typeof blog.bookmarks === "number" ? blog.bookmarks : 0,
          };
        });
        setBlogs(blogsArray);
      } catch (error) {
        setError(
          `Failed to load blogs: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 mt-15">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
          <Link href="/blog/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Create New Blog
          </Link>
        </div>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="p-8 mt-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
          <Link href="/blog/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Create New Blog
          </Link>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No blogs found. Create your first blog post!
          </p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="p-8 mt-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
          <Link href="/blog/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Create New Blog
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-48 w-full bg-gray-200">
                {blog.blogImage && (
                  <div className="relative w-full h-full">
                    <Image
                      src={blog.blogImage}
                      alt={blog.blogTitle}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const img = e.currentTarget;
                        img.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-500">{blog.category}</span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">By {blog.writer}</span>
                </div>
                <h2 className="text-xl font-semibold mb-2 text-gray-700">{blog.blogTitle}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {blog.blogDescription}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <span className="text-gray-500 flex items-center gap-1">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      {blog.likes}
                    </span>
                    <span className="text-gray-500 flex items-center gap-1">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                        />
                      </svg>
                      {blog.bookmarks}
                    </span>
                  </div>
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default BlogPage;
