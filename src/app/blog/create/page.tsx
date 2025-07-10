'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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

const CreateBlogPage = () => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convert tags string to array
      const tagsArray = formData.tags.split(',').map(tag => tag.trim());

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/api/blogs/`, {
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Blog Post</h1>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Blog Title */}
                <div>
                  <label htmlFor="blogTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Blog Title
                  </label>
                  <input
                    type="text"
                    id="blogTitle"
                    name="blogTitle"
                    value={formData.blogTitle}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your blog title"
                  />
                </div>

                {/* Blog Description */}
                <div>
                  <label htmlFor="blogDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    Blog Description
                  </label>
                  <textarea
                    id="blogDescription"
                    name="blogDescription"
                    value={formData.blogDescription}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    placeholder="Write a brief description of your blog..."
                  />
                </div>

                {/* Blog Content */}
                <div>
                  <label htmlFor="blogContent" className="block text-sm font-medium text-gray-700 mb-1">
                    Blog Content
                  </label>
                  <textarea
                    id="blogContent"
                    name="blogContent"
                    value={formData.blogContent}
                    onChange={handleChange}
                    required
                    rows={10}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    placeholder="Write your blog content here..."
                  />
                </div>

                {/* Blog Image URL */}
                <div>
                  <label htmlFor="blogImage" className="block text-sm font-medium text-gray-700 mb-1">
                    Blog Image URL
                  </label>
                  <input
                    type="url"
                    id="blogImage"
                    name="blogImage"
                    value={formData.blogImage}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* Writer */}
                <div>
                  <label htmlFor="writer" className="block text-sm font-medium text-gray-700 mb-1">
                    Writer Name
                  </label>
                  <input
                    type="text"
                    id="writer"
                    name="writer"
                    value={formData.writer}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter writer name"
                  />
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select a category</option>
                    <option value="Technology">Technology</option>
                    <option value="Business">Business</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Travel">Travel</option>
                    <option value="Food">Food</option>
                    <option value="Health">Health</option>
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="tag1, tag2, tag3"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="blog-post-title"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </span>
                  ) : (
                    'Create Blog'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBlogPage; 