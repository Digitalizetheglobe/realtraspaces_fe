'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { FiPlus, FiArrowLeft, FiSave, FiUpload, FiX } from 'react-icons/fi';

interface BlogFormData {
  blogTitle: string;
  blogDescription: string;
  blogContent: string;
  writer: string;
  category: string;
  tags: string;
  slug: string;
}

interface BlogImage {
  file: File;
  preview: string;
}

const CreateBlogContent = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<BlogFormData>({
    blogTitle: '',
    blogDescription: '',
    blogContent: '',
    writer: '',
    category: '',
    tags: '',
    slug: '',
  });
  const [selectedImages, setSelectedImages] = useState<BlogImage[]>([]);
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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const preview = e.target?.result as string;
          setSelectedImages(prev => [...prev, { file, preview }]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create FormData for multipart/form-data submission
      const formDataToSend = new FormData();
      
      // Add text fields
      formDataToSend.append('blogTitle', formData.blogTitle);
      formDataToSend.append('blogDescription', formData.blogDescription);
      formDataToSend.append('blogContent', formData.blogContent);
      formDataToSend.append('writer', formData.writer);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('tags', formData.tags);
      formDataToSend.append('slug', formData.slug);
      
      // Add images
      selectedImages.forEach((image, index) => {
        formDataToSend.append('images', image.file);
      });

      const response = await fetch(`https://api.realtraspaces.com/api/blogs/`, {
        method: 'POST',
        body: formDataToSend, // Don't set Content-Type header, let browser set it with boundary
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create blog');
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

              {/* Blog Images Upload */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.dark }}>
                  Blog Images
                </label>
                <div className="space-y-4">
                  {/* Image Upload Input */}
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      style={{ borderColor: colors.secondary }}
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FiUpload className="w-8 h-8 mb-2" style={{ color: colors.secondary }} />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB each</p>
                      </div>
                      <input
                        id="image-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Selected Images Preview */}
                  {selectedImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {selectedImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image.preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

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

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.dark }}>
                Terms & Conditions *
              </label>
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  required
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                />
                <p className="text-sm text-gray-600">
                  I agree to the{" "}
                  <Link href="/terms-and-condition" className="text-blue-600 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
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