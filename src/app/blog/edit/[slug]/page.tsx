'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { FiArrowLeft, FiSave, FiUpload, FiX } from 'react-icons/fi';
import { Blog, BlogFormData } from '@/types/blog';
import BlogService from '@/services/blogService';

const EditBlogContent = () => {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  
  const [blog, setBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState<BlogFormData>({
    blogTitle: '',
    blogDescription: '',
    blogContent: '',
    writer: '',
    category: '',
    tags: '',
    blogImages: [],
  });
  const [newImages, setNewImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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

  // Fetch blog data by slug
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blogData = await BlogService.getBlogBySlug(slug);
        
        setBlog(blogData);
        setFormData({
          blogTitle: blogData.blogTitle || '',
          blogDescription: blogData.blogDescription || '',
          blogContent: blogData.blogContent || '',
          writer: blogData.writer || '',
          category: blogData.category || '',
          tags: Array.isArray(blogData.tags) ? blogData.tags.join(', ') : '',
          blogImages: blogData.blogImages || [],
        });
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch blog');
      } finally {
        setFetching(false);
      }
    };

    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate form data
      const validationErrors = BlogService.validateBlogData({
        blogTitle: formData.blogTitle,
        blogDescription: formData.blogDescription,
        blogContent: formData.blogContent,
        writer: formData.writer,
        category: formData.category,
      });

      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      // Prepare update data
      const updateData = {
        blogTitle: formData.blogTitle,
        blogDescription: formData.blogDescription,
        blogContent: formData.blogContent,
        writer: formData.writer,
        category: formData.category,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      };

      // Update blog using service
      await BlogService.updateBlog(blog!.id, updateData, newImages);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewImages(prev => [...prev, ...files]);
    }
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      blogImages: prev.blogImages.filter((_, i) => i !== index)
    }));
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.light }}>
        <div 
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
          style={{ borderColor: colors.primary }}
        ></div>
      </div>
    );
  }

  if (error && !blog) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: colors.light }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              Back
            </button>
            <h1 className="text-3xl font-bold" style={{ color: colors.dark }}>
              Edit Blog Post
            </h1>
            <div className="w-8"></div>
          </div>
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
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
              Edit Blog Post
            </h1>
            <div className="w-8"></div> {/* Spacer for alignment */}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
              <p>{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Blog Title */}
              <div className="md:col-span-2">
                <label htmlFor="blogTitle" className="block text-sm font-medium text-gray-700 mb-2">
                  Blog Title *
                </label>
                <input
                  type="text"
                  id="blogTitle"
                  name="blogTitle"
                  value={formData.blogTitle}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter blog title"
                />
              </div>

              {/* Writer */}
              <div>
                <label htmlFor="writer" className="block text-sm font-medium text-gray-700 mb-2">
                  Writer *
                </label>
                <input
                  type="text"
                  id="writer"
                  name="writer"
                  value={formData.writer}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter writer name"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter category"
                />
              </div>

              {/* Tags */}
              <div className="md:col-span-2">
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter tags separated by commas (e.g., real estate, investment, tips)"
                />
              </div>

              {/* Blog Description */}
              <div className="md:col-span-2">
                <label htmlFor="blogDescription" className="block text-sm font-medium text-gray-700 mb-2">
                  Blog Description *
                </label>
                <textarea
                  id="blogDescription"
                  name="blogDescription"
                  value={formData.blogDescription}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter a brief description of the blog post"
                />
              </div>

              {/* Blog Content */}
              <div className="md:col-span-2">
                <label htmlFor="blogContent" className="block text-sm font-medium text-gray-700 mb-2">
                  Blog Content *
                </label>
                <textarea
                  id="blogContent"
                  name="blogContent"
                  value={formData.blogContent}
                  onChange={handleChange}
                  required
                  rows={10}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Write your blog content here..."
                />
              </div>
            </div>

            {/* Existing Images */}
            {formData.blogImages && formData.blogImages.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Images
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.blogImages.map((image, index) => (
                    <div key={index} className="relative group">
                                             <img
                         src={BlogService.getImageUrl(image)}
                         alt={`Blog image ${index + 1}`}
                         className="w-full h-32 object-cover rounded-lg"
                       />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FiX size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images */}
            <div className="mb-6">
              <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
                Add New Images
              </label>
              <input
                type="file"
                id="images"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              {/* Preview new images */}
              {newImages.length > 0 && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Images Preview
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {newImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`New image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FiX size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-8 py-3 rounded-lg text-white hover:shadow-md transition-all disabled:opacity-50"
                style={{ 
                  backgroundColor: colors.primary
                }}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2" />
                    Update Blog
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default EditBlogContent;
