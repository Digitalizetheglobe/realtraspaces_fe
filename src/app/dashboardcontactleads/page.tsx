'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
interface Contact {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'responded' | 'closed';
  created_at: string;
  responded_at?: string;
  admin_notes?: string;
  ip_address?: string;
}

interface ContactStats {
  total: number;
  recent: number;
  byStatus: {
    new: number;
    read: number;
    responded: number;
    closed: number;
  };
  avgResponseHours: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

const DashboardContactLeads: React.FC = () => {
  const { isAuthenticated, adminData, isLoading, logout } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [stats, setStats] = useState<ContactStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedContacts, setSelectedContacts] = useState<Set<number>>(new Set());
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    sort: 'created_at',
    order: 'DESC' as 'ASC' | 'DESC',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });

  const API_BASE = 'http://localhost:8000/api/contacts';

  // Fetch contact statistics
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
  const fetchStats = async () => {
    try {
      const url = `${API_BASE}/stats`;
      console.log('Fetching stats from:', url);
      
      const response = await fetch(url);
      const result = await response.json();
      
      console.log('Stats API Response:', result);
      console.log('Stats Response status:', response.status);
      
      if (result.success && result.data) {
        setStats(result.data);
      } else {
        console.log('Stats API returned success: false or no data');
        setStats(null);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats(null);
    }
  };

  // Fetch contacts with filters
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });

      const url = `${API_BASE}?${params.toString()}`;
      console.log('Fetching contacts from:', url);
      
      const response = await fetch(url);
      const result = await response.json();
      
      console.log('API Response:', result);
      console.log('Response status:', response.status);
      
      // Check if the API returns data directly or in a nested structure
      if (result.success) {
        // Try different possible data structures
        let contactsData = [];
        let paginationData = { currentPage: 1, totalPages: 1, totalItems: 0 };
        
        if (result.data) {
          if (Array.isArray(result.data)) {
            // If data is directly an array
            contactsData = result.data;
          } else if (result.data.contacts) {
            // If data has contacts property
            contactsData = result.data.contacts;
            paginationData = result.data.pagination || paginationData;
          } else if (result.data.data && Array.isArray(result.data.data)) {
            // If data has nested data property
            contactsData = result.data.data;
            paginationData = result.data.pagination || paginationData;
          }
        }
        
        console.log('Processed contacts:', contactsData);
        console.log('Processed pagination:', paginationData);
        
        setContacts(contactsData);
        setPagination(paginationData);
      } else {
        console.log('API returned success: false');
        setContacts([]);
        setPagination({ currentPage: 1, totalPages: 1, totalItems: 0 });
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setContacts([]);
      setPagination({ currentPage: 1, totalPages: 1, totalItems: 0 });
    } finally {
      setLoading(false);
    }
  };

  // Update contact status
  const updateContactStatus = async (id: number, status: string, adminNotes?: string) => {
    try {
      const response = await fetch(`${API_BASE}/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status,
          admin_notes: adminNotes
        })
      });

      const result = await response.json();
      if (result.success) {
        fetchContacts();
        fetchStats();
      }
      return result;
    } catch (error) {
      console.error('Error updating contact status:', error);
      return { success: false, message: 'Error updating contact status' };
    }
  };

  // Bulk update status
  const bulkUpdateStatus = async (status: string, adminNotes?: string) => {
    if (selectedContacts.size === 0) return;

    try {
      const response = await fetch(`${API_BASE}/bulk/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ids: Array.from(selectedContacts),
          status,
          admin_notes: adminNotes
        })
      });

      const result = await response.json();
      if (result.success) {
        setSelectedContacts(new Set());
        fetchContacts();
        fetchStats();
      }
      return result;
    } catch (error) {
      console.error('Error bulk updating contacts:', error);
      return { success: false, message: 'Error bulk updating contacts' };
    }
  };

  // Delete contact
  const deleteContact = async (id: number) => {
    if (!confirm('Are you sure you want to delete this contact? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      if (result.success) {
        fetchContacts();
        fetchStats();
      }
      return result;
    } catch (error) {
      console.error('Error deleting contact:', error);
      return { success: false, message: 'Error deleting contact' };
    }
  };

  // Handle filter changes
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key === 'page' ? value : 1
    }));
  };

  // Toggle contact selection
  const toggleContactSelection = (id: number) => {
    const newSelected = new Set(selectedContacts);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedContacts(newSelected);
  };

  // Select all contacts
  const selectAllContacts = () => {
    if (!contacts || contacts.length === 0) return;
    
    if (selectedContacts.size === contacts.length) {
      setSelectedContacts(new Set());
    } else {
      setSelectedContacts(new Set(contacts.map(c => c.id)));
    }
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedContacts(new Set());
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'read': return 'bg-gray-100 text-gray-800';
      case 'responded': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  useEffect(() => {
    fetchStats();
    fetchContacts();
  }, [filters]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please log in to access the admin dashboard.</p>
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
        } bg-gray-200 shadow-lg transition-all duration-300 ease-in-out flex flex-col fixed h-screen`}
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
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'} overflow-y-auto h-screen scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200`}>
        <div className="p-6 min-h-full">
          <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Contact Leads Management</h1>
          <p className="text-gray-600 mt-2">Manage and track customer inquiries and contact submissions</p>
          <div className="mt-4 flex space-x-4">
            <button
              onClick={() => {
                console.log('Manual refresh triggered');
                fetchStats();
                fetchContacts();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Refresh Data
            </button>
            
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Contacts</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl font-bold text-green-600">{stats.recent}</div>
              <div className="text-sm text-gray-600">Last 30 Days</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl font-bold text-blue-600">{stats.byStatus.new || 0}</div>
              <div className="text-sm text-gray-600">New</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl font-bold text-gray-600">{stats.byStatus.read || 0}</div>
              <div className="text-sm text-gray-600">Read</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl font-bold text-green-600">{stats.byStatus.responded || 0}</div>
              <div className="text-sm text-gray-600">Responded</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl font-bold text-red-600">{stats.byStatus.closed || 0}</div>
              <div className="text-sm text-gray-600">Closed</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl font-bold text-purple-600">{stats.avgResponseHours || 0}h</div>
              <div className="text-sm text-gray-600">Avg Response</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Filters & Search</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search contacts..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="responded">Responded</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="created_at">Date Created</option>
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="status">Status</option>
                <option value="subject">Subject</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
              <select
                value={filters.order}
                onChange={(e) => handleFilterChange('order', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="DESC">Newest First</option>
                <option value="ASC">Oldest First</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Per Page</label>
              <select
                value={filters.limit}
                onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilters({
                    search: '',
                    status: '',
                    sort: 'created_at',
                    order: 'DESC',
                    page: 1,
                    limit: 10
                  });
                }}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedContacts.size > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-yellow-800">
                  {selectedContacts.size} contact(s) selected
                </span>
                <select
                  onChange={async (e) => {
                    if (e.target.value) {
                      await bulkUpdateStatus(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="px-3 py-1 border border-yellow-300 rounded-md text-sm"
                >
                  <option value="">Bulk Actions</option>
                  <option value="read">Mark as Read</option>
                  <option value="responded">Mark as Responded</option>
                  <option value="closed">Mark as Closed</option>
                </select>
              </div>
              <button
                onClick={clearSelection}
                className="text-sm text-yellow-700 hover:text-yellow-900"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}

        {/* Contacts Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Contacts</h2>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={contacts && contacts.length > 0 && selectedContacts.size === contacts.length}
                  onChange={selectAllContacts}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-600">Select All</span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading contacts...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Select
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contacts && contacts.length > 0 ? contacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedContacts.has(contact.id)}
                          onChange={() => toggleContactSelection(contact.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                          <div className="text-sm text-gray-500">{contact.email}</div>
                          <div className="text-sm text-gray-500">{contact.phone_number}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">{contact.subject}</div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">{contact.message}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={contact.status}
                          onChange={async (e) => {
                            await updateContactStatus(contact.id, e.target.value);
                          }}
                          className={`text-xs px-2 py-1 rounded-full border-0 ${getStatusBadgeColor(contact.status)}`}
                        >
                          <option value="new">New</option>
                          <option value="read">Read</option>
                          <option value="responded">Responded</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(contact.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          
                          <button
                            onClick={() => deleteContact(contact.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No contacts found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {((pagination.currentPage - 1) * filters.limit) + 1} to{' '}
                  {Math.min(pagination.currentPage * filters.limit, pagination.totalItems)} of{' '}
                  {pagination.totalItems} results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleFilterChange('page', pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => handleFilterChange('page', pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContactLeads;
