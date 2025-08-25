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
  private baseUrl = 'https://api.realtraspaces.com';

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
    const url = `https://api.realtraspaces.com/api/webusers`;
    
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
    const url = `https://api.realtraspaces.com/api/webusers/${userId}/status`;
    
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

  // Validate token
  async validateToken(): Promise<boolean> {
    try {
      await this.getAdminProfile();
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const apiService = new ApiService();
export type { ApiResponse, ApiError };

// SEO Metadata API function
export async function fetchSeoMetaData(page: string): Promise<SeoMetaData | null> {
  try {
    const response = await fetch(`https://api.realtraspaces.com/api/seo/${page}`);
    
    if (!response.ok) {
      // If the endpoint doesn't exist or returns an error, return null
      // This is expected behavior as mentioned in the useSeo hook
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Return null on error - this is expected behavior
    console.warn(`Failed to fetch SEO data for page ${page}:`, error);
    return null;
  }
} 