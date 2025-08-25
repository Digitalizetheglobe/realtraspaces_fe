"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiService } from "@/utils/api";

interface WebUser {
  id: number;
  fullName: string;
  email: string;
  mobileNumber: string;
  location: string;
  company: string;
  isActive: boolean;
  created_at: string;
  updated_at: string;
}

interface WebUsersResponse {
  status: string;
  count: number;
  data: WebUser[];
}

const DashboardAllWebUsers = () => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [webUsers, setWebUsers] = useState<WebUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

  useEffect(() => {
    fetchWebUsers();
  }, []);

  // Debug function to check token status

  // Call debug function on mount
  // useEffect(() => {
  //   checkTokenStatus();
  // }, []);

  const fetchWebUsers = async (retryCount = 0) => {
    try {
      setLoading(true);
      // Don't clear error automatically - only clear on successful retry
      if (retryCount === 0) {
        setError(null);
      }
      
      const result = await apiService.getWebUsers();
      
      if (result.status === "success") {
        setWebUsers(result.data);
        setError(null); // Only clear error on success
      } else {
        setError("Failed to fetch web users");
      }
    } catch (err) {
      console.error("Error fetching web users:", err);
      if (err instanceof Error) {
        if (retryCount < 2) {
          // Retry up to 2 times for network errors
          console.log(`Retrying fetchWebUsers (attempt ${retryCount + 1})`);
          setTimeout(() => fetchWebUsers(retryCount + 1), 1000 * (retryCount + 1));
          return;
        } else {
          setError(err.message || "Failed to fetch web users. Please try again.");
        }
      } else {
        setError("Failed to fetch web users. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null); // Clear error when user manually retries
    fetchWebUsers(0);
  };

  // Filter users based on search term and location
  const filteredUsers = webUsers.filter((user) => {
    const matchesSearch = 
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mobileNumber.includes(searchTerm) ||
      user.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = filterLocation === "" || 
      user.location.toLowerCase().includes(filterLocation.toLowerCase());
    
    return matchesSearch && matchesLocation;
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Get unique locations for filter dropdown
  const uniqueLocations = [...new Set(webUsers.map(user => user.location))].filter(Boolean);

  // Handle user status toggle
  const toggleUserStatus = async (userId: number, currentStatus: boolean) => {
    try {
      setUpdatingStatus(userId);
      
      const result = await apiService.updateWebUserStatus(userId, !currentStatus);
      
      if (result.status === "success") {
        // Update the user status in the local state
        setWebUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === userId 
              ? { ...user, isActive: !currentStatus }
              : user
          )
        );
      } else {
        setError(result.message || "Failed to update user status");
      }
    } catch (err) {
      console.error("Error updating user status:", err);
      if (err instanceof Error) {
        setError(err.message || "Failed to update user status. Please try again.");
      } else {
        setError("Failed to update user status. Please try again.");
      }
    } finally {
      setUpdatingStatus(null);
    }
  };

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
    { name: "Cookie Policy", icon: "📝", href: "/dashboardcookies" }
  ];

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-100">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-700 mb-4">open...</p>
            <button
              onClick={handleRetry}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              🔄 Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className={`bg-white shadow-lg ${isSidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300`}>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <h1 className={`font-bold text-xl ${isSidebarOpen ? 'block' : 'hidden'}`}>
                Admin Panel
              </h1>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                {isSidebarOpen ? '◀' : '▶'}
              </button>
            </div>
          </div>

          <nav className="mt-8">
            {modules.map((module, index) => (
              <Link
                key={index}
                href={module.href}
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                  module.href === '/dashboardallwebusers' ? 'bg-blue-50 text-blue-600' : ''
                }`}
              >
                <span className="text-xl mr-3">{module.icon}</span>
                {isSidebarOpen && <span>{module.name}</span>}
              </Link>
            ))}
          </nav>

          <div className="mt-auto p-4">
            <button
              // onClick={logout}
              className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <span className="text-xl mr-3">🚪</span>
              {isSidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">All Web Users Dashboard</h1>
              <p className="text-gray-600">Manage and view all registered web users</p>
            </div>

                         {/* Stats Cards */}
             <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{webUsers.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <span className="text-2xl">📍</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Unique Locations</p>
                    <p className="text-2xl font-bold text-gray-900">{uniqueLocations.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                    <span className="text-2xl">🏢</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Companies</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {new Set(webUsers.map(user => user.company)).size}
                    </p>
                  </div>
                </div>
              </div>

                             <div className="bg-white p-6 rounded-lg shadow-md">
                 <div className="flex items-center">
                   <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                     <span className="text-2xl">📅</span>
                   </div>
                   <div className="ml-4">
                     <p className="text-sm font-medium text-gray-600">This Month</p>
                     <p className="text-2xl font-bold text-gray-900">
                       {webUsers.filter(user => {
                         const userDate = new Date(user.created_at);
                         const now = new Date();
                         return userDate.getMonth() === now.getMonth() && 
                                userDate.getFullYear() === now.getFullYear();
                       }).length}
                     </p>
                   </div>
                 </div>
               </div>

               <div className="bg-white p-6 rounded-lg shadow-md">
                 <div className="flex items-center">
                   <div className="p-3 rounded-full bg-emerald-100 text-emerald-600">
                     <span className="text-2xl">✅</span>
                   </div>
                   <div className="ml-4">
                     <p className="text-sm font-medium text-gray-600">Active Users</p>
                     <p className="text-2xl font-bold text-gray-900">
                       {webUsers.filter(user => user.isActive).length}
                     </p>
                   </div>
                 </div>
               </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Users
                  </label>
                  <input
                    type="text"
                    placeholder="Search by name, email, phone, or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Location
                  </label>
                  <select
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Locations</option>
                    {uniqueLocations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleRetry}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    🔄 Refresh Data
                  </button>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">
                  Web Users ({filteredUsers.length} of {webUsers.length})
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                         Status
                       </th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                         Registered
                       </th>
                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                         Actions
                       </th>
                     </tr>
                   </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">
                                  {user.fullName.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.fullName}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {user.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.email}</div>
                          <div className="text-sm text-gray-500">{user.mobileNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {user.location}
                          </span>
                        </td>
                                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                           {user.company}
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap">
                           <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                             user.isActive 
                               ? 'bg-green-100 text-green-800' 
                               : 'bg-red-100 text-red-800'
                           }`}>
                             {user.isActive ? 'Active' : 'Inactive'}
                           </span>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                           {new Date(user.created_at).toLocaleDateString()}
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                           <button
                             onClick={() => toggleUserStatus(user.id, user.isActive)}
                             disabled={updatingStatus === user.id}
                             className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                               user.isActive
                                 ? 'bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50'
                                 : 'bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50'
                             }`}
                           >
                             {updatingStatus === user.id ? (
                               <span className="flex items-center">
                                 <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1"></div>
                                 Updating...
                               </span>
                             ) : (
                               user.isActive ? 'Deactivate' : 'Activate'
                             )}
                           </button>
                         </td>
                       </tr>
                     ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{" "}
                        <span className="font-medium">
                          {Math.min(indexOfLastUser, filteredUsers.length)}
                        </span>{" "}
                        of <span className="font-medium">{filteredUsers.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                          <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === number
                                ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            {number}
                          </button>
                        ))}
                        <button
                          onClick={() => paginate(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
             </div>
   );
};

export default DashboardAllWebUsers;
