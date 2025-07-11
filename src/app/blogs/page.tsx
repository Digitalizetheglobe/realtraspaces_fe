"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import latestpropertytype from "../../../public/assets/images/latestpropertytype.svg";
import { Raleway } from "next/font/google";
import Link from "next/link";

// Load Raleway font
const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-raleway",
});

type Blog = {
  id: string | number;
  slug: string;
  blogTitle: string;
  blogDescription: string;
  blogImages?: string[];
  category?: string;
  createdAt: string;
  writer?: string;
  likes?: number;
  bookmarks?: number;
  tags?: string[];
  dynamicFields?: {
    isFeatured?: boolean;
    readingTime?: number;
  };
};

const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/api/blogs/`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        // Extract data from the response structure
        if (result.status === 'success' && result.data) {
          setBlogs(result.data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Format date helper function
  interface FormatDateOptions {
    year: 'numeric' | '2-digit';
    month: 'long' | 'short' | 'narrow' | 'numeric' | '2-digit';
    day: 'numeric' | '2-digit';
  }

  const formatDate = (dateString: string, options?: FormatDateOptions): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options ?? {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={raleway.className}>
      <section className="py-16 bg-gray-50 flex justify-center items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {/* Header row with flex to place items on opposite sides */}
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Insights and Updates
            </h2>
            {/* <button className="text-white bg-black px-4 py-2 rounded-lg">
              Read More
            </button> */}
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">Error loading blogs: {error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-black text-white px-4 py-2 rounded-lg cursor-pointer"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Blogs grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogs.length > 0 ? (
                blogs.map((blog, index) => (
                  <Link href={`/blogs/${blog.slug}`} key={blog.slug} className="block group">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                      <div className="relative overflow-hidden rounded-lg">
                        <Image
                          src={blog.blogImages && blog.blogImages.length > 0 ? blog.blogImages[0] : latestpropertytype}
                          alt={blog.blogTitle || "blog"}
                          className="object-cover p-3 rounded-2xl h-[220px] transform group-hover:scale-110 transition-transform duration-500"
                          width={400}
                          height={220}
                        />
                        {/* Property Type and Location - Positioned absolutely on top of image */}
                        <div className="absolute top-4 right-0 px-4 flex justify-between">
                          <span className="text-sm text-black bg-white bg-opacity-70 rounded-full px-3 py-1">
                            {blog.dynamicFields?.isFeatured ? "Featured" : "Article"}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                       
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {blog.blogTitle}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {blog.blogDescription.split(' ').length > 10
                            ? blog.blogDescription.split(' ').slice(0, 10).join(' ') + '...'
                            : blog.blogDescription}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                           
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500">
                                ❤️ {blog.likes}
                              </span>
                              <span className="text-sm text-gray-500">
                                🔖 {blog.bookmarks}
                              </span>
                            </div>
                          </div>
                        </div>
                       
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-600">No blogs available at the moment.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white flex justify-center items-center min-h-screen">
        <div className="w-full max-w-2xl p-4">
          {/* Updated heading section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2">
              <h2 className="text-3xl font-bold text-gray-900">FAQ</h2>
              <h2 className="text-3xl font-bold text-gray-500">
                Frequently Asked Questions
              </h2>
            </div>
          </div>

          <details className="group [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between gap-1.5 rounded-md border border-gray-100 bg-[#F1F1F4] p-4 text-gray-900 shadow-[#0000001A] shadow-md">
              <h2 className="text-lg font-medium">
                Lorem ipsum dolor sit amet consectetur adipisicing?
              </h2>
              <svg
                className="size-8 shrink-0 transition-transform duration-300 group-open:-rotate-180 bg-[#6E6E73B2] rounded-full border-2 border-gray-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                color="white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <p className="px-4 pt-4 text-gray-900">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit...
            </p>
          </details>

          <details className="group [&_summary::-webkit-details-marker]:hidden mt-4">
            <summary className="flex items-center justify-between gap-1.5 rounded-md border border-gray-100 bg-[#F1F1F4] p-4 text-gray-900 shadow-[#0000001A] shadow-md">
              <h2 className="text-lg font-medium">
                Lorem ipsum dolor sit amet consectetur adipisicing?
              </h2>
              <svg
                className="size-8 shrink-0 transition-transform duration-300 group-open:-rotate-180 bg-[#6E6E73B2] rounded-full border-2 border-gray-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                color="white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <p className="px-4 pt-4 text-gray-900">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit...
            </p>
          </details>

          <details className="group [&_summary::-webkit-details-marker]:hidden mt-4">
            <summary className="flex items-center justify-between gap-1.5 rounded-md border border-gray-100 bg-[#F1F1F4] p-4 text-gray-900 shadow-[#0000001A] shadow-md">
              <h2 className="text-lg font-medium">
                Lorem ipsum dolor sit amet consectetur adipisicing?
              </h2>
              <svg
                className="size-8 shrink-0 transition-transform duration-300 group-open:-rotate-180 bg-[#6E6E73B2] rounded-full border-2 border-gray-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                color="white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <p className="px-4 pt-4 text-gray-900">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit...
            </p>
          </details>

          <details className="group [&_summary::-webkit-details-marker]:hidden mt-4">
            <summary className="flex items-center justify-between gap-1.5 rounded-md border border-gray-100 bg-[#F1F1F4] p-4 text-gray-900 shadow-[#0000001A] shadow-md">
              <h2 className="text-lg font-medium">
                Lorem ipsum dolor sit amet consectetur adipisicing?
              </h2>
              <svg
                className="size-8 shrink-0 transition-transform duration-300 group-open:-rotate-180 bg-[#6E6E73B2] rounded-full border-2 border-gray-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                color="white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <p className="px-4 pt-4 text-gray-900">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit...
            </p>
          </details>
        </div>
      </section>

      {/* CTA */}
      <div className="bg-[#F1F1F4] p-8">
        {/* Main CTA Section */}
        <div className="max-w-xl mx-auto text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Looking for the Right Property?
          </h2>

          <p className="text-gray-600 mb-8">
            Let our experts guide you. Whether you are buying, selling, or just
            exploring, we are here to help you make informed decisions.
          </p>

          <p className="text-gray-900 font-semibold mb-6">
            Get in touch today for a free consultation.
          </p>

          <div className="flex justify-center gap-4">
            <button className="bg-black text-white px-6 py-2 rounded-md text-sm cursor-pointer font-medium">
              Contact Us
            </button>
            <button className="bg-white text-black border border-gray-300 cursor-pointer px-6 py-2 rounded-md text-sm font-medium">
              Schedule a Call
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white p-6">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <h3 className="text-[35px] font-bold text-gray-900 whitespace-nowrap">
            Get a quote
          </h3>

          <input
            type="text"
            placeholder="Enter your name"
            className="text-black px-4 py-2 rounded border border-gray-300 bg-[#F1F1F4] text-sm w-48"
          />
          <input
            type="text"
            placeholder="Enter your email"
            className="text-black px-4 py-2 rounded border border-gray-300 bg-[#F1F1F4] text-sm w-48"
          />
          <input
            type="text"
            placeholder="Enter your phone"
            className="text-black px-4 py-2 rounded border border-gray-300 bg-[#F1F1F4] text-sm w-48"
          />

          <button className="bg-black text-white px-4 py-2 rounded text-sm cursor-pointer font-medium">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Blogs;