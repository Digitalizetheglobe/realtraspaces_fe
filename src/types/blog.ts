// Blog Types for Realtraspaces Frontend

export interface Blog {
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
  dynamicFields?: Record<string, any>;
  fieldSchema?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface BlogFormData {
  blogTitle: string;
  blogDescription: string;
  blogContent: string;
  writer: string;
  category: string;
  tags: string;
  blogImages: string[];
}

export interface CreateBlogRequest {
  blogTitle: string;
  blogDescription: string;
  blogContent: string;
  writer: string;
  category: string;
  tags: string[];
  dynamicFields?: Record<string, any>;
  fieldSchema?: Record<string, any>;
}

export interface UpdateBlogRequest {
  blogTitle?: string;
  blogDescription?: string;
  blogContent?: string;
  writer?: string;
  category?: string;
  tags?: string[];
  dynamicFields?: Record<string, any>;
  fieldSchema?: Record<string, any>;
}

export interface BlogApiResponse {
  status: 'success' | 'error';
  data?: Blog | Blog[];
  message?: string;
}

export interface BlogFilters {
  category?: string;
  writer?: string;
  tags?: string[];
  search?: string;
  page?: number;
  limit?: number;
}

export interface BlogStats {
  totalBlogs: number;
  totalLikes: number;
  totalBookmarks: number;
  categories: string[];
  writers: string[];
}
