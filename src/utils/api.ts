const API_BASE_URL = 'https://api.realtraspaces.com/api';

export interface SeoMetaData {
  id: number;
  page: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  status: string;
  data: T;
}

export async function fetchSeoMetaData(page: string): Promise<SeoMetaData | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/seo/meta-tags/${page}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: ApiResponse<SeoMetaData> = await response.json();
    
    if (result.status === 'success') {
      return result.data;
    } else {
      throw new Error('API returned unsuccessful status');
    }
  } catch (error) {
    console.error(`Error fetching SEO metadata for page ${page}:`, error);
    return null;
  }
} 