'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { FiPlus, FiArrowLeft, FiSave } from 'react-icons/fi';

interface BlogFormData {
  blogTitle: string;
  blogDescription: string;
  blogContent: string;
  blogImage: string;
  writer: string;
  category: string;
  tags: string;
  slug: string;
}

const CreateBlogContent = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<BlogFormData>({
    blogTitle: '',
    blogDescription: '',
    blogContent: '',
    blogImage: '',
    writer: '',
    category: '',
    tags: '',
    slug: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Color scheme
  const colors = {
    primary: '#2D5F7D',
    secondary: '#5B9CBD',
    accent: '#E8A75D',
    light: '#F5F9FC',
    dark: '#1A3A4A',
    success: '#4CAF50',
    error: '#F44336'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convert tags string to array
      const tagsArray = formData.tags.split(',').map(tag => tag.trim());

      const response = await fetch(`https://api.realtraspaces.com/api/blogs/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: tagsArray,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create blog');
      }

      router.push('/blog');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.light }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold" style={{ color: colors.dark }}>
            Create New Blog Post
          </h1>
          <div className="w-8"></div> {/* Spacer for alignment */}
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          {error && (
            <div 
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
              role="alert"
            >
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-8">
              {/* Blog Title */}
              <div>
                <label htmlFor="blogTitle" className="block text-sm font-medium mb-2" style={{ color: colors.dark }}>
                  Blog Title
                </label>
                <input
                  type="text"
                  id="blogTitle"
                  name="blogTitle"
                  value={formData.blogTitle}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ 
                    borderColor: colors.secondary,
                    color:"black"
                  }}
                  placeholder="Enter your blog title"
                />
              </div>

              {/* Blog Description */}
              <div>
                <label htmlFor="blogDescription" className="block text-sm font-medium mb-2" style={{ color: colors.dark }}>
                  Blog Description
                </label>
                <textarea
                  id="blogDescription"
                  name="blogDescription"
                  value={formData.blogDescription}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ 
                    borderColor: colors.secondary,
                    color:"black"
                  }}
                  placeholder="Write a brief description of your blog..."
                />
              </div>

              {/* Blog Content */}
              <div>
                <label htmlFor="blogContent" className="block text-sm font-medium mb-2" style={{ color: colors.dark }}>
                  Blog Content
                </label>
                <textarea
                  id="blogContent"
                  name="blogContent"
                  value={formData.blogContent}
                  onChange={handleChange}
                  required
                  rows={10}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ 
                    borderColor: colors.secondary,
                    color:"black"
                  }}
                  placeholder="Write your blog content here..."
                />
              </div>

              {/* Blog Image URL */}
              {/* <div>
                <label htmlFor="blogImage" className="block text-sm font-medium mb-2" style={{ color: colors.dark }}>
                  Blog Image URL
                </label>
                <input
                  type="url"
                  id="blogImage"
                  name="blogImage"
                  value={formData.blogImage}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ 
                    borderColor: colors.secondary,
                    }}
                  placeholder="https://example.com/image.jpg"
                />
              </div> */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Writer */}
                <div>
                  <label htmlFor="writer" className="block text-sm font-medium mb-2" style={{ color: colors.dark }}>
                    Writer Name
                  </label>
                  <input
                    type="text"
                    id="writer"
                    name="writer"
                    value={formData.writer}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ 
                      borderColor: colors.secondary,
                      color:"black"
                    }}
                    placeholder="Enter writer name"
                  />
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-2" style={{ color: colors.dark }}>
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ 
                      borderColor: colors.secondary,
                      color:"black"
                      }}
                  >
                    <option value="">Select a category</option>
                    <option value="RealEstate">Real Estate</option>
                    <option value="Technology">Technology</option>
                    <option value="Business">Business</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Travel">Travel</option>
                    <option value="Food">Food</option>
                    <option value="Health">Health</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Tags */}
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium mb-2" style={{ color: colors.dark }}>
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ 
                      borderColor: colors.secondary,
                      color:"black"
                      }}
                    placeholder="tag1, tag2, tag3"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium mb-2" style={{ color: colors.dark }}>
                    URL Slug
                  </label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ 
                      borderColor: colors.secondary,
                      color:"black"
                      }}
                    placeholder="blog-post-title"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-8">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-6 py-3 rounded-md text-white hover:shadow-md transition-all"
                style={{ 
                  backgroundColor: loading ? colors.secondary : colors.primary,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? (
                  <div 
                    className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"
                  ></div>
                ) : (
                  <FiSave className="mr-2" />
                )}
                Create Blog
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const CreateBlogPage = () => {
  return (
    <ProtectedRoute>
      <CreateBlogContent />
    </ProtectedRoute>
  );
};

export default CreateBlogPage;