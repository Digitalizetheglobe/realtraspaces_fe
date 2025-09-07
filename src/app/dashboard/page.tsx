"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";

interface DashboardStats {
  totalTestimonials: number;
  totalBlogs: number;
  activeJobs: number;
  activeProperties: number;
}

interface Job {
  isActive: boolean;
}

const DashboardPage = () => {
  const { logout, adminData } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalTestimonials: 0,
    totalBlogs: 0,
    activeJobs: 0,
    activeProperties: 500, // Set static count for properties
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch testimonials count
        const testimonialsRes = await fetch(
          "https://api.realtraspaces.com/api/testimonials"
        );
        const testimonialsData = await testimonialsRes.json();

        // Fetch blogs count
        const blogsRes = await fetch("https://api.realtraspaces.com/api/blogs");
        const blogsData = await blogsRes.json();

        // Fetch active jobs count
        const jobsRes = await fetch("https://api.realtraspaces.com/api/jobs");
        const jobsData = await jobsRes.json();

        setStats((prevStats) => ({
          ...prevStats,
          totalTestimonials: testimonialsData.data?.length || 0,
          totalBlogs: blogsData.data?.length || 0,
          activeJobs: jobsData.data?.filter((job: Job) => job.isActive)?.length || 0,
        }));
      } catch (err) {
        setError("Failed to fetch dashboard data");
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const modules = [
    { name: "Dashboard", icon: "📊", href: "/dashboard" },
    { name: "All Web Users", icon: "👥", href: "/dashboardallwebusers" },
    { name: "Career Management", icon: "💼", href: "/career-management" },
    { name: "Blog", icon: "📝", href: "/blog" },
    { name: "Manage Testimonials", icon: "⭐", href: "/manage-testimonials" },
    {name :'All properties', icon:"🏠", href: '/PropertyListing'},
    {name :'SEO Meta Manager',icon:"🌐", href: '/seometaManager'},
    {name :'Team Management',icon:"👥", href: '/dashboardteam'},
    {name :'Developer Management',icon:"🛠️", href: '/dashboarddeveloper'},
    {name :'List Properties',icon:"💼", href: '/dashboardlistproperty'},
    {name :'Cookie Policy',icon:"📝", href: '/dashboardcookies'},
    {name :'Awards Management',icon:"🏆", href: '/awardmanagement'},
    
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
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div
          className={`${
            isSidebarOpen ? "w-64" : "w-20"
          } bg-gray-200 shadow-lg transition-all duration-300 ease-in-out overflow-hidden flex flex-col`}
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
                Realtraspaces
              </h1>
            )}
          </div>

          {/* Navigation */}
          <nav className="mt-4 flex-1">
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
        <div className="flex-1 p-8 overflow-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome to your Realtraspaces Dashboard
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Testimonials Card */}
            <div className="bg-white rounded-xl shadow-md p-6 transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-between space-x-1">
                <div className="bg-blue-100 p-1 rounded-full">
                  <span className="text-blue-600 text-2xl">⭐</span>
                </div>
                <div>
                  <p className="text-gray-700 font-bold text-sm">Total Testimonials</p>
                  <h3 className="text-xl font-bold text-gray-800 mt-1">
                    {stats.totalTestimonials}
                  </h3>
                </div>
              </div>
              <div className="mt-8">
                <Link
                  href="/manage-testimonials"
                  className="text-lg text-gray-700 relative mb-4 sm:mb-0 after:absolute after:-top-4 after:h-0.5 after:w-[170px] after:bg-gray-300 after:left-0 after:right-0 after:mx-auto after:rounded-full"
                >
                  View all testimonials
                </Link>
              </div>
            </div>

            {/* Blogs Card */}
            <div className="bg-white rounded-xl shadow-md p-6 transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-between space-x-1">
                <div className="bg-green-100 p-2 rounded-full">
                  <span className="text-green-600 text-2xl">📝</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 text-sm">Total Blog Posts</p>
                  <h3 className="text-xl font-bold text-gray-800 mt-1">
                    {stats.totalBlogs}
                  </h3>
                </div>
              </div>
              <div className="mt-8">
                <Link
                  href="/blog"
                  className="text-lg text-gray-700 relative mb-4 sm:mb-0 after:absolute after:-top-4 after:h-0.5 after:w-[170px] after:bg-gray-300 after:left-0 after:right-0 after:mx-auto after:rounded-full"
                >
                  View all blogs
                </Link>
              </div>
            </div>

            {/* Active Jobs Card */}
            <div className="bg-white rounded-xl shadow-md p-6 transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-between space-x-1">
                <div className="bg-purple-100 p-2 rounded-full">
                  <span className="text-purple-600 text-2xl">💼</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 text-sm">Active Jobs</p>
                  <h3 className="text-xl font-bold text-gray-800 mt-1">
                    {stats.activeJobs}
                  </h3>
                </div>
              </div>
              <div className="mt-8">
                <Link
                  href="/career-management"
                  className="text-lg text-gray-700 relative mb-4 sm:mb-0 after:absolute after:-top-4 after:h-0.5 after:w-[170px] after:bg-gray-300 after:left-0 after:right-0 after:mx-auto after:rounded-full"
                >
                  View all jobs
                </Link>
              </div>
            </div>

            {/* Active Properties Card */}
            <div className="bg-white rounded-xl shadow-md p-6 transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-between space-x-1">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <span className="text-yellow-600 text-2xl">🏠</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 text-sm">Active Properties</p>
                  <h3 className="text-xl font-bold text-gray-800 mt-1">
                    {stats.activeProperties}
                  </h3>
                </div>
              </div>
              <div className="mt-8">
                <Link
                  href="/properties"
                  className="text-md font-normal text-gray-700 relative mb-4 sm:mb-0 after:absolute after:-top-4 after:h-0.5 after:w-[170px] after:bg-gray-300 after:left-0 after:right-0 after:mx-auto after:rounded-full"
                >
                  View all properties
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Recent Activity
            </h2>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-4">
                      <span className="text-blue-600">⭐</span>
                    </div>
                    <div>
                      <p className="font-medium text-black">
                        New testimonial added
                      </p>
                      <p className="text-sm text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <Link
                    href="/manage-testimonials"
                    className="text-gray-800 px-4 py-2 hover:text-gray-800 font-bold text-sm rounded-xl border border-gray-400"
                  >
                    View 
                  </Link>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-full mr-4">
                      <span className="text-green-600">📝</span>
                    </div>
                    <div>
                      <p className="font-medium text-black">
                        New blog post published
                      </p>
                      <p className="text-sm text-gray-500">5 hours ago</p>
                    </div>
                  </div>
                  <Link
                    href="/blog"
                    className="text-gray-800 px-4 py-2 hover:text-gray-800 font-bold text-sm rounded-xl border border-gray-400"
                  >
                    View 
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
