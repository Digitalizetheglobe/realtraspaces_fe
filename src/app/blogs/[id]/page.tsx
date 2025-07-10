"use client";

// BlogDetail.jsx
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight, Upload } from "lucide-react";
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Define TypeScript interfaces outside the component
interface Blog {
  id: number;
  blogTitle: string;
  blogDescription: string;
  blogContent: string;
  blogImages: string[];
  writer: string;
  category: string;
  tags: string[];
  slug: string;
  likes: number;
  bookmarks: number;
  dynamicFields: {
    isFeatured: boolean;
    readingTime: number;
  };
  fieldSchema: any;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  status: string;
  data: Blog;
}

interface PageProps {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

const BlogDetail = ({ params }: PageProps) => {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Unwrap the params Promise using React.use()
  const resolvedParams = React.use(params as unknown as Promise<{ id: string }>);
  
  useEffect(() => {
    // Initialize AOS animation library
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
    });
  }, []);
  
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        console.log('Fetching blog for id:', resolvedParams.id);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/api/blogs/${resolvedParams.id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch blog data: ${response.status}`);
        }
        
        const result: ApiResponse = await response.json();
        console.log('Received blog data:', result);
        
        // Extract data from the response structure
        if (result.status === 'success' && result.data) {
          setBlog(result.data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Unable to load blog content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    if (resolvedParams.id) {
      fetchBlog();
    }
  }, [resolvedParams.id]);

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Function to render HTML content safely
  const createMarkup = (htmlContent: string) => {
    return { __html: htmlContent };
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#172747]"></div>
      </div>
    );
  }
  
  if (error || !blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <h2 className="text-2xl text-[#172747] mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-6">{error || 'Blog not found'}</p>
        <Link href="/blogs">
          <button className="bg-[#172747] rounded-[4px] text-white hover:bg-white hover:text-[#172747] hover:border hover:border-[#172747] px-6 py-3 flex items-center justify-center gap-2 transition-colors">
            Back to Blogs
          </button>
        </Link>
      </div>
    );
  }

  return (
    <> 
      {/* Hero Section */}
      <section id="top" className="relative min-h-screen">
        <div className="absolute inset-0 z-0">
          {/* Use blog image if available, otherwise use default */}
          {blog.blogImages && blog.blogImages.length > 0 ? (
            <Image 
              src={blog.blogImages[0]}
              alt={blog.blogTitle} 
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          ) : (
            <Image 
              src="/assets/hero.jpg"
              alt="Default blog image" 
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          )}
          <div className="absolute inset-0 bg-black opacity-40"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-3xl mx-auto text-white">
            <div className="flex items-center justify-center gap-4 mb-4">
              <p className="text-sm uppercase font-medium tracking-wider">
                {blog.category}
              </p>
              {blog.dynamicFields?.isFeatured && (
                <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded-full">
                  Featured
                </span>
              )}
            </div>
            
            <h2 className="text-4xl md:text-5xl font-serif leading-tight mb-6">
              Blogs
            </h2>
            
            <h1 className="text-4xl md:text-5xl font-serif leading-tight mb-6" data-aos="fade-up">
              {blog.blogTitle}
            </h1>
            
            <p className="mb-8 max-w-xl mx-auto" data-aos="fade-up" data-aos-delay="100">
              {blog.blogDescription}
            </p>
            
            {/* Blog Meta Information */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8" data-aos="fade-up" data-aos-delay="200">
              <p className="text-sm">Written by <span className="font-medium">{blog.writer}</span></p>
              <span className="hidden sm:inline">•</span>
              <p className="text-sm">{formatDate(blog.createdAt)}</p>
              {blog.dynamicFields?.readingTime && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <p className="text-sm">{blog.dynamicFields.readingTime} min read</p>
                </>
              )}
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center gap-4">
                <span className="text-sm">❤️ {blog.likes}</span>
                <span className="text-sm">🔖 {blog.bookmarks}</span>
              </div>
            </div>

            {/* Tags */}
            {/* {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-8" data-aos="fade-up" data-aos-delay="300">
                {blog.tags.map((tag, index) => (
                  <span key={index} className="text-xs bg-white/20 px-3 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )} */}
            
            {/* CTA Button */}
            <div className="flex justify-center">
              <Link
               href="/blogs"
                className="bg-white text-[#172747] hover:bg-[#172747] hover:text-white border border-white px-6 py-3 rounded-[4px] flex items-center justify-center gap-2 transition-colors"
              >
                Read Article
                <ArrowRight size={16} />
              </Link>
               
              
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content Section */}
      <section id="blog-content" className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Article Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-serif leading-tight mb-6">
              {blog.blogTitle} 
            </h1>
            
            <p className="text-lg text-gray-700 mb-6">
              {blog.blogDescription}
            </p>

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-4 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">By</span>
                <span className="text-sm font-medium">{blog.writer}</span>
              </div>
              <span className="text-gray-300">•</span>
              <span className="text-sm text-gray-600">{formatDate(blog.createdAt)}</span>
              {blog.dynamicFields?.readingTime && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="text-sm text-gray-600">{blog.dynamicFields.readingTime} min read</span>
                </>
              )}
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">❤️ {blog.likes}</span>
                <span className="text-sm text-gray-600">🔖 {blog.bookmarks}</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {blog.blogImages && blog.blogImages.length > 0 && (
            <div className="mb-8">
              <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
                <Image 
                  src={blog.blogImages[0]}
                  alt={blog.blogTitle} 
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>
            </div>
          )}

          {/* Blog Content */}
          <div 
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900"
            dangerouslySetInnerHTML={createMarkup(blog.blogContent)}
            data-aos="fade-up"
          />
          
          {/* Additional Images */}
          {blog.blogImages && blog.blogImages.length > 1 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Gallery</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {blog.blogImages.slice(1).map((image, index) => (
                  <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                    <Image 
                      src={image}
                      alt={`${blog.blogTitle} - Image ${index + 2}`} 
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Tags Section */}
          {/* {blog.tags && blog.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
           */}
          {/* Back to blogs button */}
          <div className="mt-12 flex justify-center">
            <Link href="/blogs">
              <button className="bg-[#172747] rounded-[4px] text-white hover:bg-white hover:text-[#172747] hover:border hover:border-[#172747] px-6 py-3 flex items-center justify-center gap-2 transition-colors">
                Back to All Blogs
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogDetail;