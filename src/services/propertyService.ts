interface PropertyListingData {
  propertyName: string;
  location: string;
  propertyType: string;
  transactionType: string;
  areaCarpet: string;
  areaBuiltup: string;
  rent: number | null;
  price: number | null;
  contactName: string;
  contactNumber: string;
  emailAddress: string | null;
  description: string | null;
  images: string[];
}

interface PropertyListingResponse {
  success: boolean;
  data?: any;
  message?: string;
  status: number;
}

interface PropertyListingFilters {
  page?: number;
  limit?: number;
  status?: 'pending' | 'approved' | 'rejected' | 'active' | 'inactive';
  propertyType?: string;
  transactionType?: string;
  search?: string;
}

class PropertyListingService {
  private baseUrl = 'http://localhost:8000/api/property-listings';

  private async makeRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<PropertyListingResponse> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      return {
        success: response.ok,
        data: data,
        message: data.message,
        status: response.status
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error occurred',
        status: 0
      };
    }
  }

  // Create a new property listing
  async createPropertyListing(propertyData: PropertyListingData): Promise<PropertyListingResponse> {
    return this.makeRequest('/create', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  }

  // Get all property listings with optional filters
  async getAllPropertyListings(filters?: PropertyListingFilters): Promise<PropertyListingResponse> {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = queryParams.toString() ? `/all?${queryParams.toString()}` : '/all';
    return this.makeRequest(endpoint, { method: 'GET' });
  }

  // Get property listing by ID
  async getPropertyListingById(id: number): Promise<PropertyListingResponse> {
    return this.makeRequest(`/${id}`, { method: 'GET' });
  }

  // Update property listing
  async updatePropertyListing(id: number, updateData: Partial<PropertyListingData>): Promise<PropertyListingResponse> {
    return this.makeRequest(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  // Update property listing status
  async updatePropertyListingStatus(id: number, status: string): Promise<PropertyListingResponse> {
    return this.makeRequest(`/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Get property listings by status
  async getPropertyListingsByStatus(status: string): Promise<PropertyListingResponse> {
    return this.makeRequest(`/status/${status}`, { method: 'GET' });
  }

  // Delete property listing
  async deletePropertyListing(id: number): Promise<PropertyListingResponse> {
    return this.makeRequest(`/${id}`, { method: 'DELETE' });
  }

  // Delete all property listings (dangerous operation)
  async deleteAllPropertyListings(): Promise<PropertyListingResponse> {
    return this.makeRequest('/delete-all?confirm=true', { method: 'DELETE' });
  }

  // Upload images (placeholder - implement based on your storage solution)
  async uploadImages(files: File[]): Promise<string[]> {
    // This is a placeholder implementation
    // In a real application, you would upload files to your storage service
    // (AWS S3, Cloudinary, etc.) and return the URLs

    // For now, we'll simulate the upload and return mock filenames
    const timestamp = Date.now();
    return files.map((file, index) => {
      const extension = file.name.split('.').pop();
      return `property-${timestamp}-${index + 1}.${extension}`;
    });
  }

  // Validate property data before submission
  validatePropertyData(data: Partial<PropertyListingData>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.propertyName?.trim()) {
      errors.push('Property name is required');
    }

    if (!data.location?.trim()) {
      errors.push('Location is required');
    }

    if (!data.propertyType) {
      errors.push('Property type is required');
    }

    if (!data.transactionType) {
      errors.push('Transaction type is required');
    }

    if (!data.contactName?.trim()) {
      errors.push('Contact name is required');
    }

    if (!data.contactNumber?.trim()) {
      errors.push('Contact number is required');
    }

    // Validate email if provided
    if (data.emailAddress?.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.emailAddress)) {
        errors.push('Please enter a valid email address');
      }
    }

    // Validate that at least rent or price is provided
    if (!data.rent && !data.price) {
      errors.push('Please provide either rent or price information');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export const propertyListingService = new PropertyListingService();
export type { PropertyListingData, PropertyListingResponse, PropertyListingFilters };
