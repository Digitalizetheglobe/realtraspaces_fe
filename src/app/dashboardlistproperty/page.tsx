"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Trash2, 
  Edit, 
  Eye, 
  Search, 
  Filter, 
  MoreHorizontal, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Building2,
  MapPin,
  DollarSign,
  Phone,
  Mail,
  Calendar,
  RefreshCw,
  Plus,
  Download,
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
  FileText,
  Image as ImageIcon,
  Home,
  Building,
  Car,
  Bath,
  Bed,
  Square,
  User
} from "lucide-react";

// API utility functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.realtraspaces.com';

const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

interface PropertyListing {
  id: number;
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
  emailAddress: string;
  description: string;
  imageUrl: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'inactive';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PropertyImages {
  id: number;
  imageUrl: string;
  propertyId: number;
  createdAt: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export default function DashboardListProperty() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [listings, setListings] = useState<PropertyListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Modal states
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyListing | null>(null);
  const [propertyImages, setPropertyImages] = useState<PropertyImages[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    propertyType: '',
    transactionType: '',
    search: ''
  });
  const modules = [
    { name: "Dashboard", icon: "📊", href: "/dashboard" },
    { name: "Career Management", icon: "💼", href: "/career-management" },
    { name: "Blog", icon: "📝", href: "/blog" },
    { name: "Manage Testimonials", icon: "⭐", href: "/manage-testimonials" },
    {name :'All properties', icon:"🏠", href: '/PropertyListing'},
    {name :'SEO Meta Manager',icon:"🌐", href: '/seometaManager'},
    {name :'Team Management',icon:"👥", href: '/dashboardteam'},
    {name :'Developer Management',icon:"🛠️", href: '/dashboarddeveloper'},
    {name :'List Properties',icon:"💼", href: '/dashboardlistproperty'},
    {name :'Cookie Policy',icon:"📝", href: '/dashboardcookies'},
    {name :'Contact Leads',icon:"📝", href: '/dashboardcontactleads'},
    {name :'Awards Management',icon:"🏆", href: '/awardmanagement'},

  ];

  // Logout function
  const logout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to login page
    router.push('/signin');
  };

  // Fetch property listings
  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });

      const result = await apiCall(`/api/property-listings/all?${queryParams}`);
      
      if (result.success) {
        setListings(result.data.listings);
        setPagination(result.data.pagination);
      } else {
        setError(result.message || 'Failed to fetch listings');
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      setError('Failed to load property listings');
    } finally {
      setLoading(false);
    }
  };

  // Delete single listing
  const deleteListing = async (id: number) => {
    try {
      setDeleteLoading(true);
      const result = await apiCall(`/api/property-listings/${id}`, { method: 'DELETE' });
      
      if (result.success) {
        setListings(prev => prev.filter(item => item.id !== id));
        setSelectedItems(prev => prev.filter(item => item !== id));
      } else {
        setError(result.message || 'Failed to delete listing');
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
      setError('Failed to delete listing');
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  // Delete all listings
  const deleteAllListings = async () => {
    try {
      setDeleteLoading(true);
      const result = await apiCall('/api/property-listings/delete-all?confirm=true', { method: 'DELETE' });
      
      if (result.success) {
        setListings([]);
        setSelectedItems([]);
        setPagination(null);
      } else {
        setError(result.message || 'Failed to delete all listings');
      }
    } catch (error) {
      console.error('Error deleting all listings:', error);
      setError('Failed to delete all listings');
    } finally {
      setDeleteLoading(false);
      setShowDeleteAllModal(false);
    }
  };

  // Update listing status
  const updateStatus = async (id: number, status: string) => {
    try {
      const result = await apiCall(`/api/property-listings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      
      if (result.success) {
        setListings(prev => prev.map(item => 
          item.id === id ? { ...item, status: status as any } : item
        ));
      } else {
        setError(result.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update status');
    }
  };

  // Modal functions
  const handleViewDetails = async (property: PropertyListing) => {
    setSelectedProperty(property);
    setShowDetailsModal(true);
    setCurrentImageIndex(0);
    
    // Fetch property images
    setIsLoadingImages(true);
    try {
      const response = await apiCall(`/api/properties/${property.id}/images`);
      if (response.success) {
        setPropertyImages(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      setPropertyImages([]);
    } finally {
      setIsLoadingImages(false);
    }
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedProperty(null);
    setPropertyImages([]);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (propertyImages.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % propertyImages.length);
    }
  };

  const prevImage = () => {
    if (propertyImages.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + propertyImages.length) % propertyImages.length);
    }
  };

  const downloadImage = async (imageUrl: string, imageName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedProperty?.propertyName || 'property'}_${imageName}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const downloadAllImages = async () => {
    for (let i = 0; i < propertyImages.length; i++) {
      await downloadImage(propertyImages[i].imageUrl, `image_${i + 1}`);
      // Add delay between downloads
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const downloadPDF = () => {
    if (!selectedProperty) return;
    
    const element = document.createElement('div');
    element.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px;">
        <h1 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
          Property Details
        </h1>
        
        <div style="margin: 20px 0;">
          <h2 style="color: #374151; margin-bottom: 10px;">${selectedProperty.propertyName}</h2>
          <p style="color: #6b7280; font-size: 14px; margin-bottom: 20px;">
            <strong>Location:</strong> ${selectedProperty.location}
          </p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
          <div>
            <h3 style="color: #374151; margin-bottom: 10px;">Property Information</h3>
            <p><strong>Type:</strong> ${selectedProperty.propertyType}</p>
            <p><strong>Transaction:</strong> ${selectedProperty.transactionType}</p>
            <p><strong>Carpet Area:</strong> ${selectedProperty.areaCarpet} sq ft</p>
            <p><strong>Built-up Area:</strong> ${selectedProperty.areaBuiltup} sq ft</p>
            ${selectedProperty.rent ? `<p><strong>Rent:</strong> ₹${selectedProperty.rent.toLocaleString()}</p>` : ''}
            ${selectedProperty.price ? `<p><strong>Price:</strong> ₹${selectedProperty.price.toLocaleString()}</p>` : ''}
          </div>
          
          <div>
            <h3 style="color: #374151; margin-bottom: 10px;">Contact Information</h3>
            <p><strong>Name:</strong> ${selectedProperty.contactName}</p>
            <p><strong>Phone:</strong> ${selectedProperty.contactNumber}</p>
            <p><strong>Email:</strong> ${selectedProperty.emailAddress}</p>
            <p><strong>Status:</strong> ${selectedProperty.status}</p>
            <p><strong>Active:</strong> ${selectedProperty.isActive ? 'Yes' : 'No'}</p>
          </div>
        </div>

        ${selectedProperty.description ? `
          <div style="margin: 20px 0;">
            <h3 style="color: #374151; margin-bottom: 10px;">Description</h3>
            <p style="color: #6b7280; line-height: 1.6;">${selectedProperty.description}</p>
          </div>
        ` : ''}

        <div style="margin: 20px 0;">
          <h3 style="color: #374151; margin-bottom: 10px;">Property Images</h3>
          ${propertyImages.length > 0 ? 
            propertyImages.map((img, index) => 
              `<p style="color: #6b7280; margin: 5px 0;">Image ${index + 1}: ${img.imageUrl}</p>`
            ).join('') : 
            '<p style="color: #6b7280;">No images available</p>'
          }
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
          <p>Generated on: ${new Date().toLocaleString()}</p>
          <p>Property ID: ${selectedProperty.id}</p>
        </div>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Property Details - ${selectedProperty.propertyName}</title>
            <style>
              body { margin: 0; padding: 20px; }
              @media print {
                body { margin: 0; }
              }
            </style>
          </head>
          <body>
            ${element.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  // Handle bulk selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(listings.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(item => item !== id));
    }
  };

  // Format currency
  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle },
      active: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      inactive: { color: 'bg-gray-100 text-gray-800', icon: AlertCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Fetch listings on component mount and filter changes
  useEffect(() => {
    fetchListings();
  }, [filters]);

  if (loading && !listings.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading property listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-gray-200 shadow-lg transition-all duration-300 ease-in-out flex flex-col`}
      >
        <div className="p-4 flex items-center gap-x-2">
          {/* Toggle Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-800 font-bold text-xl"
          >
            {isSidebarOpen ? "←" : "→"}
          </button>

          {/* Logo / Title */}
          {isSidebarOpen && (
            <h1 className="text-xl font-bold text-black whitespace-nowrap">
              Realtraspace
            </h1>
          )}
        </div>

        {/* Navigation */}
        <nav className="mt-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          {modules.map((module) => (
            <Link
              key={module.name}
              href={module.href}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100"
            >
              <span className="text-xl">{module.icon}</span>
              {isSidebarOpen && <span className="ml-3">{module.name}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4">
          <button
            onClick={logout}
            className="flex items-center px-4 py-3 text-red-600 hover:bg-red-50 w-full rounded-lg transition-colors"
          >
            <span className="text-xl">🚪</span>
            {isSidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Property Listings Dashboard</h1>
                <p className="text-gray-600 mt-1">Manage and monitor all property listings</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => router.push('/list-property')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#FFB400] hover:bg-[#E6A200] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFB400]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Listing
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search properties..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFB400] focus:border-[#FFB400]"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFB400] focus:border-[#FFB400]"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Property Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                <select
                  value={filters.propertyType}
                  onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFB400] focus:border-[#FFB400]"
                >
                  <option value="">All Types</option>
                  <option value="Office">Office</option>
                  <option value="Retail">Retail</option>
                  <option value="Coworking">Coworking</option>
                  <option value="Industrial or warehouse">Industrial</option>
                  <option value="Land">Land</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              {/* Transaction Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
                <select
                  value={filters.transactionType}
                  onChange={(e) => handleFilterChange('transactionType', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFB400] focus:border-[#FFB400]"
                >
                  <option value="">All Transactions</option>
                  <option value="Lease">Lease</option>
                  <option value="Sale">Sale</option>
                  <option value="BOTH">Both</option>
                  <option value="Preleased">Preleased</option>
                </select>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-blue-800 font-medium">
                  {selectedItems.length} item(s) selected
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete Selected
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Listings Table */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Property Listings ({pagination?.totalItems || 0})
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={fetchListings}
                    disabled={loading}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFB400]"
                  >
                    <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                  <button
                    onClick={() => setShowDeleteAllModal(true)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete All
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedItems.length === listings.length && listings.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-[#FFB400] focus:ring-[#FFB400]"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price/Rent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {listings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(listing.id)}
                          onChange={(e) => handleSelectItem(listing.id, e.target.checked)}
                          className="rounded border-gray-300 text-[#FFB400] focus:ring-[#FFB400]"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-gray-500" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {listing.propertyName || 'Unnamed Property'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {listing.propertyType}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                          {listing.location || 'Location not specified'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{listing.transactionType}</div>
                        <div className="text-sm text-gray-500">
                          {listing.areaCarpet} / {listing.areaBuiltup}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {listing.rent && formatCurrency(listing.rent)}
                          {listing.price && listing.rent && ' / '}
                          {listing.price && formatCurrency(listing.price)}
                          {!listing.rent && !listing.price && 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{listing.contactName}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {listing.contactNumber}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {listing.emailAddress}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(listing.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(listing.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleViewDetails(listing)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => setShowDeleteModal(true)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{' '}
                      <span className="font-medium">{(pagination.currentPage - 1) * pagination.itemsPerPage + 1}</span>
                      {' '}to{' '}
                      <span className="font-medium">
                        {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
                      </span>
                      {' '}of{' '}
                      <span className="font-medium">{pagination.totalItems}</span>
                      {' '}results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === pagination.currentPage
                              ? 'z-10 bg-[#FFB400] border-[#FFB400] text-white'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">Delete Property Listing</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this property listing? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-center space-x-3 mt-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteListing(selectedItems[0])}
                  disabled={deleteLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {deleteLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete All Modal */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">Delete All Property Listings</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete ALL property listings? This action cannot be undone and will remove all listings from the system.
                </p>
              </div>
              <div className="flex justify-center space-x-3 mt-4">
                <button
                  onClick={() => setShowDeleteAllModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteAllListings}
                  disabled={deleteLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {deleteLoading ? 'Deleting...' : 'Delete All'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Property Details Modal */}
      {showDetailsModal && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Property Details</h2>
              <button
                onClick={closeDetailsModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Property Header */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {selectedProperty.propertyName}
                </h3>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="w-4 h-4 mr-2" />
                  {selectedProperty.location}
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedProperty.status === 'approved' ? 'bg-green-100 text-green-800' :
                    selectedProperty.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    selectedProperty.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedProperty.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedProperty.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedProperty.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Property Images */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">Property Images</h4>
                  <div className="flex space-x-2">
                    {propertyImages.length > 0 && (
                      <>
                        <button
                          onClick={downloadAllImages}
                          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download All
                        </button>
                        <button
                          onClick={downloadPDF}
                          className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm flex items-center"
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          Download PDF
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {isLoadingImages ? (
                  <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : propertyImages.length > 0 ? (
                  <div className="relative">
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={propertyImages[currentImageIndex]?.imageUrl}
                        alt={`Property image ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {propertyImages.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                          {currentImageIndex + 1} / {propertyImages.length}
                        </div>
                      </>
                    )}

                    {/* Image Thumbnails */}
                    <div className="flex space-x-2 mt-4 overflow-x-auto">
                      {propertyImages.map((image, index) => (
                        <div key={image.id} className="flex-shrink-0">
                          <button
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                              index === currentImageIndex ? 'border-blue-600' : 'border-gray-200'
                            }`}
                          >
                            <img
                              src={image.imageUrl}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                          <button
                            onClick={() => downloadImage(image.imageUrl, `image_${index + 1}`)}
                            className="w-full mt-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs flex items-center justify-center"
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">No images available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Property Details Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Property Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Building className="w-5 h-5 mr-2" />
                    Property Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{selectedProperty.propertyType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction:</span>
                      <span className="font-medium">{selectedProperty.transactionType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Carpet Area:</span>
                      <span className="font-medium">{selectedProperty.areaCarpet} sq ft</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Built-up Area:</span>
                      <span className="font-medium">{selectedProperty.areaBuiltup} sq ft</span>
                    </div>
                    {selectedProperty.rent && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rent:</span>
                        <span className="font-medium text-green-600">₹{selectedProperty.rent.toLocaleString()}</span>
                      </div>
                    )}
                    {selectedProperty.price && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-medium text-green-600">₹{selectedProperty.price.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Contact Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="font-medium">{selectedProperty.contactName}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-500" />
                      <a href={`tel:${selectedProperty.contactNumber}`} className="text-blue-600 hover:underline">
                        {selectedProperty.contactNumber}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-500" />
                      <a href={`mailto:${selectedProperty.emailAddress}`} className="text-blue-600 hover:underline">
                        {selectedProperty.emailAddress}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-gray-600">
                        Created: {new Date(selectedProperty.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-gray-600">
                        Updated: {new Date(selectedProperty.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedProperty.description && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Description</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">{selectedProperty.description}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={closeDetailsModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                {propertyImages.length > 0 && (
                  <button
                    onClick={downloadPDF}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Download PDF
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
