"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ProtectedRoute from "@/components/ProtectedRoute";
import { FiEdit2, FiTrash2, FiHeart, FiBookmark, FiPlus, FiArrowRight } from "react-icons/fi";
import router from "next/router";

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

  // Enhanced color scheme
  const colors = {
    primary: '#2D5F7D',
    secondary: '#5B9CBD',
    accent: '#E8A75D',
    light: '#F5F9FC',
    dark: '#1A3A4A',
    success: '#4CAF50',
    error: '#F44336',
    gradientStart: '#2D5F7D',
    gradientEnd: '#5B9CBD'
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`https://api.realtraspaces.com/api/blogs/`);
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

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`https://api.realtraspaces.com/api/blogs/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete blog');
      }
  
      router.push('/blog');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div 
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
          style={{ borderColor: colors.primary }}
        ></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: colors.light }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold" style={{ color: colors.dark }}>Blog Posts</h1>
            <Link 
              href="/blog/create" 
              className="flex items-center px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
              style={{ 
                backgroundColor: colors.primary,
                color: 'white'
              }}
            >
              <FiPlus className="mr-2" />
              Create New Blog
            </Link>
          </div>
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: colors.light }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold" style={{ color: colors.dark }}>Blog Posts</h1>
            <Link 
              href="/blog/create" 
              className="flex items-center px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
              style={{ 
                backgroundColor: colors.primary,
                color: 'white'
              }}
            >
              <FiPlus className="mr-2" />
              Create New Blog
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg mb-6">
              No blogs found. Create your first blog post!
            </p>
            <Link
              href="/blog/create"
              className="inline-flex items-center px-6 py-3 rounded-lg text-white hover:shadow-md transition-all"
              style={{ 
                backgroundColor: colors.primary
              }}
            >
              <FiPlus className="mr-2" />
              Create Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen" style={{ backgroundColor: colors.light }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: colors.dark }}>Blog Posts</h1>
              <p className="text-gray-600 mt-2">Discover the latest insights and trends in real estate</p>
            </div>
            <Link 
              href="/blog/create" 
              className="flex items-center px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
              style={{ 
                background: `linear-gradient(135deg, ${colors.gradientStart} 0%, ${colors.gradientEnd} 100%)`,
                color: 'white'
              }}
            >
              <FiPlus className="mr-2" />
              Create New Blog
            </Link>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group"
              >
                {/* Blog Content */}
                <div className="p-6 h-full flex flex-col">
                  {/* Category and Author */}
                  <div className="flex items-center justify-between mb-4">
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider"
                      style={{ 
                        backgroundColor: colors.light,
                        color: colors.primary
                      }}
                    >
                      {blog.category}
                    </span>
                    <span className="text-xs text-gray-500">By {blog.writer}</span>
                  </div>

                  {/* Title and Description */}
                  <div className="flex-grow">
                    <h2 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors" style={{ color: colors.dark }}>
                      {blog.blogTitle}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {blog.blogDescription}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {blog.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: colors.light,
                          color: colors.secondary
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
                    <div className="flex gap-4">
                     
                    </div>
                    <div className="flex gap-2 items-center">
                      <Link
                        href={`/blog/edit/${blog.slug}`}
                        className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <FiEdit2 size={16} />
                      </Link>
                      <button
                        className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                        title="Delete"
                        onClick={() => handleDelete(blog.id)}
                      >
                        <FiTrash2 size={16} />
                      </button>
                     
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default BlogPage;