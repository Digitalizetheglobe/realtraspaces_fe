const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.realtraspaces.com';

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
    const response = await fetch(`${API_BASE_URL}/api/seo/meta-tags/${page}`);
    
    if (!response.ok) {
      console.warn(`SEO metadata not found for page ${page}, status: ${response.status}`);
      return null;
    }
    
    const result: ApiResponse<SeoMetaData> = await response.json();
    
    if (result.status === 'success') {
      return result.data;
    } else {
      console.warn(`API returned unsuccessful status for page ${page}`);
      return null;
    }
  } catch (error) {
    console.warn(`Error fetching SEO metadata for page ${page}:`, error);
    return null;
  }
} 