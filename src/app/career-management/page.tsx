'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';


interface CVSubmission {
  id: number;
  first_name: string;
  last_name: string;
  email_id: string;
  phone_number: string;
  message?: string;
  cv_file?: string;
  cv_file_url?: string;
  status: 'pending' | 'reviewed' | 'contacted' | 'rejected';
  submission_date: string;
  admin_notes?: string;
}

interface CVStats {
  total: number;
  byStatus: {
    pending: number;
    reviewed: number;
    contacted: number;
    rejected: number;
  };
}

const CareerManagementPage = () => {

  // CV Submissions State
  const [cvSubmissions, setCvSubmissions] = useState<CVSubmission[]>([]);
  const [cvStats, setCvStats] = useState<CVStats | null>(null);
  const [cvLoading, setCvLoading] = useState(false);
  const [cvError, setCvError] = useState<string | null>(null);
  
  // CV Submissions Filters
  const [searchSubmissions, setSearchSubmissions] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  
  // Update submission modal state
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<CVSubmission | null>(null);
  const [updateStatus, setUpdateStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchCVSubmissions();
    fetchCVStats();
  }, [searchSubmissions, statusFilter, pageNumber, pageLimit]);


  // CV Submissions API Functions
  const fetchCVStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/cv-submissions/stats');
      const result = await response.json();
      
      if (response.ok && result.success) {
        setCvStats(result.data);
      }
    } catch (error) {
      console.error('Error fetching CV stats:', error);
    }
  };

  const fetchCVSubmissions = async () => {
    setCvLoading(true);
    setCvError(null);
    
    try {
      const params = new URLSearchParams();
      if (searchSubmissions) params.append('search', searchSubmissions);
      if (statusFilter) params.append('status', statusFilter);
      params.append('page', pageNumber.toString());
      params.append('limit', pageLimit.toString());
      
      const url = `http://localhost:8000/api/cv-submissions?${params.toString()}`;
      const response = await fetch(url);
      const result = await response.json();
      
      if (response.ok && result.success) {
        setCvSubmissions(result.data);
      } else {
        setCvError(result.message || 'Failed to fetch CV submissions');
      }
    } catch (error) {
      setCvError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setCvLoading(false);
    }
  };

  const updateSubmissionStatus = async (id: number, status: string, notes?: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/cv-submissions/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status,
          admin_notes: notes || undefined
        })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        fetchCVSubmissions();
        fetchCVStats();
        setShowUpdateModal(false);
        setSelectedSubmission(null);
        setUpdateStatus('');
        setAdminNotes('');
      } else {
        setCvError(result.message || 'Failed to update submission');
      }
    } catch (error) {
      setCvError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const deleteSubmission = async (id: number) => {
    if (!confirm('Are you sure you want to delete this submission? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:8000/api/cv-submissions/${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (response.ok) {
        fetchCVSubmissions();
        fetchCVStats();
      } else {
        setCvError(result.message || 'Failed to delete submission');
      }
    } catch (error) {
      setCvError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const downloadCV = (filename: string) => {
    const downloadUrl = `http://localhost:8000/api/cv-submissions/download/${filename}`;
    window.open(downloadUrl, '_blank');
  };


  const openUpdateModal = (submission: CVSubmission) => {
    setSelectedSubmission(submission);
    setUpdateStatus(submission.status);
    setAdminNotes(submission.admin_notes || '');
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = () => {
    if (selectedSubmission && updateStatus) {
      updateSubmissionStatus(selectedSubmission.id, updateStatus, adminNotes);
    }
  };


  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="flex justify-between items-center p-8 bg-white shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">CV Submissions Management</h1>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="space-y-6">
              {/* CV Statistics */}
              {cvStats && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">CV Submission Statistics</h2>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{cvStats.total}</div>
                      <div className="text-sm text-gray-600">Total</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{cvStats.byStatus.pending || 0}</div>
                      <div className="text-sm text-gray-600">Pending</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{cvStats.byStatus.reviewed || 0}</div>
                      <div className="text-sm text-gray-600">Reviewed</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{cvStats.byStatus.contacted || 0}</div>
                      <div className="text-sm text-gray-600">Contacted</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{cvStats.byStatus.rejected || 0}</div>
                      <div className="text-sm text-gray-600">Rejected</div>
                    </div>
                  </div>
                </div>
              )}

              {/* CV Filters */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Submissions</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                    <input
                      type="text"
                      value={searchSubmissions}
                      onChange={(e) => setSearchSubmissions(e.target.value)}
                      placeholder="Search by name, email, or phone"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="contacted">Contacted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Page</label>
                    <input
                      type="number"
                      value={pageNumber}
                      onChange={(e) => setPageNumber(parseInt(e.target.value) || 1)}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Per Page</label>
                    <select
                      value={pageLimit}
                      onChange={(e) => setPageLimit(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* CV Submissions List */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">CV Submissions</h3>
                </div>
                
                {cvLoading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading submissions...</p>
                  </div>
                ) : cvError ? (
                  <div className="p-8 text-center">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                      {cvError}
                    </div>
                  </div>
                ) : cvSubmissions.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-gray-600">No CV submissions found.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {cvSubmissions.map((submission) => (
                      <div key={submission.id} className="p-6 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-2">
                              <h4 className="text-lg font-medium text-gray-900">
                                {submission.first_name} {submission.last_name}
                              </h4>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                submission.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                                submission.status === 'contacted' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {submission.status.toUpperCase()}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                              <div>
                                <p><span className="font-medium">ID:</span> {submission.id}</p>
                                <p><span className="font-medium">Email:</span> {submission.email_id}</p>
                                <p><span className="font-medium">Phone:</span> {submission.phone_number}</p>
                              </div>
                              <div>
                                <p><span className="font-medium">Submitted:</span> {new Date(submission.submission_date).toLocaleString()}</p>
                                {submission.cv_file && (
                                  <p>
                                    <span className="font-medium">CV:</span>{' '}
                                    <button
                                      onClick={() => downloadCV(submission.cv_file!)}
                                      className="text-blue-600 hover:text-blue-800 underline"
                                    >
                                      Download CV
                                    </button>
                                  </p>
                                )}
                              </div>
                            </div>
                            {submission.message && (
                              <div className="mt-3">
                                <p className="text-sm"><span className="font-medium">Message:</span> {submission.message}</p>
                              </div>
                            )}
                            {submission.admin_notes && (
                              <div className="mt-3 p-3 bg-gray-100 rounded-md">
                                <p className="text-sm"><span className="font-medium">Admin Notes:</span> {submission.admin_notes}</p>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col space-y-2 ml-4">
                            <button
                              onClick={() => openUpdateModal(submission)}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                            >
                              Update Status
                            </button>
                            <button
                              onClick={() => deleteSubmission(submission.id)}
                              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
        </div>

        {/* Update Status Modal */}
        {showUpdateModal && selectedSubmission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Update Submission Status
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Submission ID: {selectedSubmission.id}
                  </label>
                  <p className="text-sm text-gray-600">
                    {selectedSubmission.first_name} {selectedSubmission.last_name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={updateStatus}
                    onChange={(e) => setUpdateStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Status</option>
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="contacted">Contacted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Internal notes about this submission"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default CareerManagementPage; 