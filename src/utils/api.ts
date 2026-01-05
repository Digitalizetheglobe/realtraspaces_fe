interface ApiResponse<T = any> {
  status: string;
  data: T;
  message?: string;
}

interface ApiError {
  message: string;
  status: number;
}

export interface SeoMetaData {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
}

// Helper function to check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

class ApiService {
  private baseUrl = 'http://localhost:8000';

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Only try to get token if we're in a browser environment
    const token = isBrowser ? localStorage.getItem('adminToken') : null;
    
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        // Token is invalid or expired
        if (isBrowser) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminData');
          window.location.href = '/dashboard/adminlogin';
        }
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  // Web Users API
  async getWebUsers(): Promise<ApiResponse> {
    // Use localhost for web users dashboard
    const url = `http://localhost:8000/api/webusers`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  async updateWebUserStatus(userId: number, isActive: boolean): Promise<ApiResponse> {
    // Use localhost for web users dashboard
    const url = `http://localhost:8000/api/webusers/${userId}/status`;
    
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  // Admin API
  async getAdminProfile(): Promise<ApiResponse> {
    return this.makeRequest<ApiResponse>('/api/admins/me');
  }

  // Validate token (doesn't clear token on 401 - used for background validation)
  async validateToken(): Promise<boolean> {
    try {
      const token = isBrowser ? localStorage.getItem('adminToken') : null;
      
      if (!token) {
        return false;
      }

      const url = `${this.baseUrl}/api/admins/me`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      // Return true if status is 200, false otherwise
      // Don't clear token here - let actual API calls handle that
      return response.status === 200;
    } catch (error) {
      // Don't clear token on network errors
      return false;
    }
  }
}

export const apiService = new ApiService();
export type { ApiResponse, ApiError };

// SEO Metadata API function
export async function fetchSeoMetaData(page: string): Promise<SeoMetaData | null> {
  // In local development or during build, skip remote SEO API calls to avoid timeouts
  if (process.env.NODE_ENV === "development" || process.env.NEXT_PHASE === "phase-production-build") {
    return null;
  }

  try {
    // Add timeout to prevent hanging during build
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(`http://localhost:8000/api/seo/meta-tags/`, {
      signal: controller.signal,
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      // If the endpoint doesn't exist or returns an error, return null
      // This is expected behavior as mentioned in the useSeo hook
      return null;
    }

    const data = await response.json();
    
    // Find the SEO data for the specific page
    if (data.status === 'success' && data.data && Array.isArray(data.data)) {
      const pageData = data.data.find((item: any) => item.page === page);
      if (pageData) {
        return {
          metaTitle: pageData.metaTitle,
          metaDescription: pageData.metaDescription,
          metaKeywords: pageData.metaKeywords,
          canonicalUrl: pageData.canonicalUrl
        };
      }
    }
    
    return null;
  } catch (error) {
    // Silently fall back when SEO service is unreachable or times out
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn('SEO metadata fetch timed out, using fallback');
    }
    return null;
  }
} 