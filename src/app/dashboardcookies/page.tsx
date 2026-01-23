"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

// Get API base URL from environment or default to localhost
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface CookieStatistics {
  status: string;
  data: {
    totalAcceptances: number;
    recentAcceptances: number;
    uniqueUsers: number;
  };
}

const modules = [
  { name: "Dashboard", icon: "📊", href: "/dashboard" },
  { name: "Career Management", icon: "💼", href: "/career-management" },
  { name: "Blog", icon: "📝", href: "/blog" },
  { name: "Manage Testimonials", icon: "⭐", href: "/manage-testimonials" },
  { name: 'All properties', icon: "🏠", href: '/PropertyListing' },
  { name: 'SEO Meta Manager', icon: "🌐", href: '/seometaManager' },
  { name: 'Team Management', icon: "👥", href: '/dashboardteam' },
  { name: 'Developer Management', icon: "🛠️", href: '/dashboarddeveloper' },
  { name: 'List Properties', icon: "💼", href: '/dashboardlistproperty' },
  { name: 'Cookie Policy', icon: "📝", href: '/dashboardcookies' }
];

interface CookieRecord {
  id: number;
  userId: number | null;
  sessionId: string | null;
  ipAddress: string;
  userAgent: string;
  accepted: boolean;
  acceptedAt: string;
  policyVersion: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

interface RecordsResponse {
  status: string;
  data: {
    records: CookieRecord[];
    total: number;
    limit: number;
    offset: number;
  };
}

const DashboardCookies = () => {
  const [statistics, setStatistics] = useState<CookieStatistics | null>(null);
  const [records, setRecords] = useState<CookieRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit] = useState(10);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch statistics
      const statsResponse = await fetch(`${API_BASE_URL}/api/cookie-policy/statistics`);
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        if (statsData.status === 'success') {
          setStatistics(statsData);
        }
      }

      // Fetch records with pagination
      const offset = (currentPage - 1) * limit;
      const recordsResponse = await fetch(
        `${API_BASE_URL}/api/cookie-policy/records?limit=${limit}&offset=${offset}`
      );

      if (recordsResponse.ok) {
        const recordsData: RecordsResponse = await recordsResponse.json();
        if (recordsData.status === 'success') {
          setRecords(recordsData.data.records);
          setTotalRecords(recordsData.data.total);
        }
      }
    } catch (err) {
      setError('Failed to fetch data. Please check if the backend server is running.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Implement logout logic here
    console.log('Logout clicked');
    // You can redirect to login page or clear auth tokens
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getBrowserInfo = (userAgent: string) => {
    if (!userAgent) return 'Unknown';

    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';

    return 'Other';
  };

  const totalPages = Math.ceil(totalRecords / limit);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading cookie policy data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`${isSidebarOpen ? "w-64" : "w-20"
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
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error Loading Data</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={fetchData}
                      className="bg-red-100 text-red-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-200"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Cookie Policy Dashboard</h1>
                <p className="mt-2 text-gray-600">Monitor and manage cookie policy acceptance across your website</p>
              </div>

              {/* Statistics Cards */}
              {statistics && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Total Acceptances</p>
                        <p className="text-2xl font-semibold text-gray-900">{statistics.data.totalAcceptances.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Recent Acceptances (30 days)</p>
                        <p className="text-2xl font-semibold text-gray-900">{statistics.data.recentAcceptances.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Unique Users</p>
                        <p className="text-2xl font-semibold text-gray-900">{statistics.data.uniqueUsers.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Records Table */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Cookie Policy Records</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Showing {records.length} of {totalRecords} records
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          IP Address
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Browser
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Accepted At
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Policy Version
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {records.map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            {record.user ? (
                              <div>
                                <div className="text-sm font-medium text-gray-900">{record.user.name}</div>
                                <div className="text-sm text-gray-500">{record.user.email}</div>
                              </div>
                            ) : (
                              <div>
                                <div className="text-sm text-gray-500">Anonymous</div>
                                <div className="text-xs text-gray-400">
                                  Session: {truncateText(record.sessionId || '', 20)}
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.ipAddress}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {getBrowserInfo(record.userAgent)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(record.acceptedAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.policyVersion}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${record.accepted
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                              }`}>
                              {record.accepted ? 'Accepted' : 'Declined'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalRecords)} of {totalRecords} results
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <span className="px-3 py-2 text-sm text-gray-700">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Refresh Button */}
              <div className="mt-6 text-center">
                <button
                  onClick={fetchData}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh Data
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardCookies;
