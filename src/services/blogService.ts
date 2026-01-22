import { Blog, CreateBlogRequest, UpdateBlogRequest, BlogApiResponse, BlogFilters } from '@/types/blog';

const API_BASE_URL = 'https://api.realtraspaces.com/api/blogs';

class BlogService {
  // Get all blogs
  static async getAllBlogs(filters?: BlogFilters): Promise<Blog[]> {
    try {
      const queryParams = new URLSearchParams();

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (Array.isArray(value)) {
              queryParams.append(key, JSON.stringify(value));
            } else {
              queryParams.append(key, String(value));
            }
          }
        });
      }

      const url = queryParams.toString() ? `${API_BASE_URL}?${queryParams.toString()}` : API_BASE_URL;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BlogApiResponse = await response.json();

      if (data.status === 'error') {
        throw new Error(data.message || 'Failed to fetch blogs');
      }

      if (!data.data) {
        throw new Error('No data received from API');
      }
      return Array.isArray(data.data) ? data.data : [data.data];
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw error;
    }
  }

  // Get blog by ID
  static async getBlogById(id: number): Promise<Blog> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BlogApiResponse = await response.json();

      if (data.status === 'error') {
        throw new Error(data.message || 'Blog not found');
      }

      return data.data as Blog;
    } catch (error) {
      console.error('Error fetching blog:', error);
      throw error;
    }
  }

  // Get blog by slug
  static async getBlogBySlug(slug: string): Promise<Blog> {
    try {
      const response = await fetch(`${API_BASE_URL}/slug/${slug}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BlogApiResponse = await response.json();

      if (data.status === 'error') {
        throw new Error(data.message || 'Blog not found');
      }

      return data.data as Blog;
    } catch (error) {
      console.error('Error fetching blog by slug:', error);
      throw error;
    }
  }

  // Create new blog
  static async createBlog(blogData: CreateBlogRequest): Promise<Blog> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BlogApiResponse = await response.json();

      if (data.status === 'error') {
        throw new Error(data.message || 'Failed to create blog');
      }

      return data.data as Blog;
    } catch (error) {
      console.error('Error creating blog:', error);
      throw error;
    }
  }

  // Update blog
  static async updateBlog(id: number, blogData: UpdateBlogRequest, images?: File[]): Promise<Blog> {
    try {
      const formData = new FormData();

      // Add form fields
      Object.entries(blogData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'tags' && Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      // Add images if provided
      if (images && images.length > 0) {
        images.forEach((image) => {
          formData.append('images', image);
        });
      }

      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BlogApiResponse = await response.json();

      if (data.status === 'error') {
        throw new Error(data.message || 'Failed to update blog');
      }

      return data.data as Blog;
    } catch (error) {
      console.error('Error updating blog:', error);
      throw error;
    }
  }

  // Delete blog
  static async deleteBlog(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BlogApiResponse = await response.json();

      if (data.status === 'error') {
        throw new Error(data.message || 'Failed to delete blog');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      throw error;
    }
  }

  // Like blog
  static async likeBlog(id: number): Promise<Blog> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/like`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BlogApiResponse = await response.json();

      if (data.status === 'error') {
        throw new Error(data.message || 'Failed to like blog');
      }

      return data.data as Blog;
    } catch (error) {
      console.error('Error liking blog:', error);
      throw error;
    }
  }

  // Bookmark blog
  static async bookmarkBlog(id: number): Promise<Blog> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/bookmark`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BlogApiResponse = await response.json();

      if (data.status === 'error') {
        throw new Error(data.message || 'Failed to bookmark blog');
      }

      return data.data as Blog;
    } catch (error) {
      console.error('Error bookmarking blog:', error);
      throw error;
    }
  }

  // Update field schema
  static async updateFieldSchema(schema: Record<string, any>): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/schema/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(schema),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BlogApiResponse = await response.json();

      if (data.status === 'error') {
        throw new Error(data.message || 'Failed to update field schema');
      }
    } catch (error) {
      console.error('Error updating field schema:', error);
      throw error;
    }
  }

  // Helper method to format image URL
  static getImageUrl(imagePath: string): string {
    if (!imagePath) return '';

    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    // Otherwise, prepend the API base URL
    return `${API_BASE_URL.replace('/api/blogs', '')}/${imagePath}`;
  }

  // Helper method to validate blog data
  static validateBlogData(data: Partial<Blog>): string[] {
    const errors: string[] = [];

    if (!data.blogTitle?.trim()) {
      errors.push('Blog title is required');
    }

    if (!data.blogDescription?.trim()) {
      errors.push('Blog description is required');
    }

    if (!data.blogContent?.trim()) {
      errors.push('Blog content is required');
    }

    if (!data.writer?.trim()) {
      errors.push('Writer is required');
    }

    if (!data.category?.trim()) {
      errors.push('Category is required');
    }

    return errors;
  }
}

export default BlogService;
