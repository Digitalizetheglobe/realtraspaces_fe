"use client";

import { useState } from "react";
import Link from "next/link";

const SeoMetaManagerLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const modules = [
    { name: "Dashboard", icon: "📊", href: "/dashboard" },
    { name: "Career Management", icon: "💼", href: "/career-management" },
    { name: "Blog", icon: "📝", href: "/blog" },
    { name: "Manage Testimonials", icon: "⭐", href: "/manage-testimonials" },
    { name: "SEO Meta Manager", icon: "🌐", href: "/seometaManager", active: true },
    { name: "Team Management", icon: "👥", href: "/dashboardteam" },
    { name: "Developer Management", icon: "🛠️", href: "/dashboarddeveloper" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-70" : "w-30"
        } bg-white shadow-xl transition-all duration-300 ease-in-out flex flex-col border-r border-gray-200`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {isSidebarOpen ? (
            <h2 className="text-sm font-bold text-indigo-600">
              {" "}
            Dashboard
            </h2>
          ) : (
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-indigo-600">RD</span>
            </div>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isSidebarOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {modules.map((module) => (
              <li key={module.name}>
                <Link
                  href={module.href}
                  className={`flex items-center px-4 py-3 rounded-lg mx-2 transition-all duration-200 ${
                    module.active
                      ? "bg-indigo-50 text-indigo-700 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-xl w-6 text-center">{module.icon}</span>
                  {isSidebarOpen && <span className="ml-3">{module.name}</span>}
                  {module.active && isSidebarOpen && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-indigo-500"></span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-600">👤</span>
            </div>
            {isSidebarOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">Admin User</p>
                <p className="text-xs text-gray-500">admin@example.com</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="p-6">
          {/* Content Header */}
          {/* <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Manage Testimonials</h2>
            <div className="flex space-x-4">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                Refresh
              </button>
              <button className="px-4 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition-colors duration-200">
                Add New
              </button>
            </div>
          </div> */}

          {/* Page Content */}
          <div className="bg-white rounded-xl shadow-sm p-6">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default SeoMetaManagerLayout;
