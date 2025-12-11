'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiEye, FiAward } from 'react-icons/fi';

interface Award {
  id: string;
  award_title: string;
  award_image?: string;
  award_image_url?: string;
  demo_field?: string;
  status: boolean;
  created_at: string;
  updated_at?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: Award[] | Award;
}

interface AwardStats {
  total: number;
  active: number;
  inactive: number;
  withImages: number;
}

export default function AwardManagementPage() {
  const { logout, adminData } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [awards, setAwards] = useState<Award[]>([]);
  const [stats, setStats] = useState<AwardStats>({
    total: 0,
    active: 0,
    inactive: 0,
    withImages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal and form states
  const [showModal, setShowModal] = useState(false);
  const [currentAward, setCurrentAward] = useState<Award | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    award_title: '',
    demo_field: '',
    status: true,
    award_image: null as File | null,
    imagePreview: ''
  });

  // API responses for testing
  const [showCreateResponse, setShowCreateResponse] = useState(false);
  const [showUpdateResponse, setShowUpdateResponse] = useState(false);
  const [showDeleteResponse, setShowDeleteResponse] = useState(false);
  const [showGetResponse, setShowGetResponse] = useState(false);
  const [apiResponse, setApiResponse] = useState('');

  const API_BASE = 'https://api.realtraspaces.com/api/awards';

  // Dashboard modules for sidebar
  const modules = [
    { name: "Dashboard", icon: "📊", href: "/dashboard" },
    { name: "All Web Users", icon: "👥", href: "/dashboardallwebusers" },
    { name: "Career Management", icon: "💼", href: "/career-management" },
    { name: "Blog", icon: "📝", href: "/blog" },
    { name: "Manage Testimonials", icon: "⭐", href: "/manage-testimonials" },
    { name: "All Properties", icon: "🏠", href: "/PropertyListing" },
    { name: "SEO Meta Manager", icon: "🌐", href: "/seometaManager" },
    { name: "Team Management", icon: "👥", href: "/dashboardteam" },
    { name: "Developer Management", icon: "🛠️", href: "/dashboarddeveloper" },
    { name: "List Properties", icon: "💼", href: "/dashboardlistproperty" },
    { name: "Awards Management", icon: "🏆", href: "/awardmanagement" },
    { name: "Cookie Policy", icon: "📝", href: "/dashboardcookies" }
  ];

  // Load awards and calculate stats
  const loadAwards = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE);
      const result: ApiResponse = await response.json();
      
      if (response.ok && result.success && Array.isArray(result.data)) {
        setAwards(result.data);
        calculateStats(result.data);
      } else {
        setError(result.message || 'Failed to load awards');
        setAwards([]);
      }
    } catch (error) {
      console.error('Error loading awards:', error);
      setError('Failed to connect to the server');
      setAwards([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (awardsData: Award[]) => {
    const total = awardsData.length;
    const active = awardsData.filter(award => award.status).length;
    const inactive = total - active;
    const withImages = awardsData.filter(award => award.award_image_url).length;
    
    setStats({ total, active, inactive, withImages });
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'status' ? value === 'true' : value
    }));
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        award_image: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  // Open modal for add/edit
  const openModal = (award: Award | null = null) => {
    setCurrentAward(award);
    setFormData({
      award_title: award?.award_title || '',
      demo_field: award?.demo_field || '',
      status: award?.status ?? true,
      award_image: null,
      imagePreview: award?.award_image_url || ''
    });
    setShowModal(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formDataToSend = new FormData();
    formDataToSend.append('award_title', formData.award_title);
    formDataToSend.append('demo_field', formData.demo_field);
    formDataToSend.append('status', String(formData.status));
    if (formData.award_image) {
      formDataToSend.append('award_image', formData.award_image);
    }
    
    try {
      const url = currentAward ? `${API_BASE}/${currentAward.id}` : API_BASE;
      const method = currentAward ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        body: formDataToSend
      });
      
      const result = await response.json();
      setApiResponse(JSON.stringify(result, null, 2));
      
      if (response.ok) {
        setShowModal(false);
        loadAwards();
        if (currentAward) {
          setShowUpdateResponse(true);
        } else {
          setShowCreateResponse(true);
        }
      } else {
        setError(result.message || 'Failed to save award');
      }
    } catch (error) {
      setError(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this award?')) return;
    
    setIsDeleting(id);
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      setApiResponse(JSON.stringify(result, null, 2));
      
      if (response.ok) {
        loadAwards();
        setShowDeleteResponse(true);
      } else {
        setError(result.message || 'Failed to delete award');
      }
    } catch (error) {
      setError(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsDeleting(null);
    }
  };

  // Handle get all awards (for testing)
  const handleGetAllAwards = async () => {
    try {
      const response = await fetch(API_BASE);
      const result = await response.json();
      setApiResponse(JSON.stringify(result, null, 2));
      setShowGetResponse(true);
    } catch (error) {
      setApiResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setShowGetResponse(true);
    }
  };

  // Load awards on mount
  useEffect(() => {
    loadAwards();
  }, []);

  // Response modal component
  const ResponseModal = ({ show, onClose, title }: { show: boolean; onClose: () => void; title: string }) => {
    if (!show) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FiX size={24} />
            </button>
          </div>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">{apiResponse}</pre>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex h-screen bg-gray-100">
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-gray-200 shadow-lg transition-all duration-300 ease-in-out flex flex-col`}>
          <div className="p-4 flex items-center gap-x-2">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-800 font-bold text-xl"
            >
              {isSidebarOpen ? '←' : '→'}
            </button>
            {isSidebarOpen && (
              <h1 className="text-xl font-bold text-black whitespace-nowrap">
                Realtraspaces
              </h1>
            )}
          </div>

          <nav className="mt-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            {modules.map((module) => (
              <Link
                key={module.name}
                href={module.href}
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 ${
                  module.href === '/awardmanagement' ? 'bg-gray-100 border-r-4 border-blue-500' : ''
                }`}
              >
                <span className="text-xl">{module.icon}</span>
                {isSidebarOpen && <span className="ml-3">{module.name}</span>}
              </Link>
            ))}
          </nav>

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
        <div className="flex-1 p-8 overflow-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Awards Management</h1>
            <p className="text-gray-600 mt-2">Manage awards and recognitions</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-between">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FiAward className="text-blue-600 text-2xl" />
                </div>
                <div className="text-right">
                  <p className="text-gray-700 font-bold text-sm">Total Awards</p>
                  <h3 className="text-2xl font-bold text-gray-800">{stats.total}</h3>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-between">
                <div className="bg-green-100 p-3 rounded-full">
                  <span className="text-green-600 text-2xl">✅</span>
                </div>
                <div className="text-right">
                  <p className="text-gray-700 font-bold text-sm">Active Awards</p>
                  <h3 className="text-2xl font-bold text-gray-800">{stats.active}</h3>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-between">
                <div className="bg-gray-100 p-3 rounded-full">
                  <span className="text-gray-600 text-2xl">❌</span>
                </div>
                <div className="text-right">
                  <p className="text-gray-700 font-bold text-sm">Inactive Awards</p>
                  <h3 className="text-2xl font-bold text-gray-800">{stats.inactive}</h3>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-between">
                <div className="bg-purple-100 p-3 rounded-full">
                  <span className="text-purple-600 text-2xl">🖼️</span>
                </div>
                <div className="text-right">
                  <p className="text-gray-700 font-bold text-sm">With Images</p>
                  <h3 className="text-2xl font-bold text-gray-800">{stats.withImages}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => openModal()}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiPlus className="mr-2" /> Add New Award
              </button>
              <button
                onClick={handleGetAllAwards}
                className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FiEye className="mr-2" /> Test Get All Awards
              </button>
              <button
                onClick={loadAwards}
                className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                🔄 Refresh Awards
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
              {error}
            </div>
          )}

          {/* Awards List */}
          <div className="bg-white rounded-xl shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Awards List</h2>
            </div>
            
            {awards.length === 0 ? (
              <div className="p-12 text-center">
                <FiAward className="mx-auto text-gray-400 text-6xl mb-4" />
                <p className="text-gray-600 text-lg mb-6">No awards found. Create your first award!</p>
                <button
                  onClick={() => openModal()}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiPlus className="mr-2" /> Add Award
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {awards.map((award) => (
                  <div key={award.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                    {/* Award Image */}
                    <div className="h-32 w-full bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                      {award.award_image_url ? (
                        <img
                          src={award.award_image_url}
                          alt={award.award_title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FiAward className="text-gray-400 text-3xl" />
                      )}
                    </div>
                    
                    {/* Award Details */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-800 truncate">{award.award_title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{award.demo_field || 'No description'}</p>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          award.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {award.status ? 'Active' : 'Inactive'}
                        </span>
                        <span className="text-xs text-gray-500">
                          ID: {award.id}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Created: {new Date(award.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => openModal(award)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="Edit"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(award.id)}
                        disabled={isDeleting === award.id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete"
                      >
                        {isDeleting === award.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
                        ) : (
                          <FiTrash2 size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-6">
              <h2 className="text-xl font-bold text-gray-800">
                {currentAward ? 'Edit Award' : 'Add Award'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Award Title *
                  </label>
                  <input
                    type="text"
                    name="award_title"
                    value={formData.award_title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Demo Field
                  </label>
                  <textarea
                    name="demo_field"
                    value={formData.demo_field}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={String(formData.status)}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Award Image
                  </label>
                  {formData.imagePreview && (
                    <div className="mb-2">
                      <img
                        src={formData.imagePreview}
                        alt="Preview"
                        className="h-32 w-32 object-cover rounded-md border border-gray-200"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
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

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      {currentAward ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    currentAward ? 'Update Award' : 'Create Award'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Response Modals */}
      <ResponseModal 
        show={showCreateResponse} 
        onClose={() => setShowCreateResponse(false)} 
        title="Create Award Response" 
      />
      <ResponseModal 
        show={showUpdateResponse} 
        onClose={() => setShowUpdateResponse(false)} 
        title="Update Award Response" 
      />
      <ResponseModal 
        show={showDeleteResponse} 
        onClose={() => setShowDeleteResponse(false)} 
        title="Delete Award Response" 
      />
      <ResponseModal 
        show={showGetResponse} 
        onClose={() => setShowGetResponse(false)} 
        title="Get All Awards Response" 
      />
    </ProtectedRoute>
  );
}