'use client';

import { useState } from 'react';
import Link from 'next/link';

const DashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const modules = [
    { name: 'Dashboard', icon: '📊', href: '/bashboard' },
    { name: 'Blog', icon: '🏠', href: '/blog' },
    { name: 'Carrer Management', icon: '👥', href: '/carrer-management' },
    // { name: 'Payments', icon: '💰', href: '/payments' },
    // { name: 'Reports', icon: '📈', href: '/reports' },
    // { name: 'Settings', icon: '⚙️', href: '/settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-100 mt-10">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white shadow-lg transition-all duration-300 ease-in-out`}
      >
        <div className="p-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-600 hover:text-gray-900"
          >
            {isSidebarOpen ? '←' : '→'}
          </button>
        </div>
        <nav className="mt-4">
          {modules.map((module) => (
            <Link
              key={module.name}
              href={module.href}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100"
            >
              <span className="text-xl">{module.icon}</span>
              {isSidebarOpen && (
                <span className="ml-3">{module.name}</span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dashboard Cards */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Total Properties</h2>
            <p className="text-3xl font-bold text-blue-600">12</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Active Tenants</h2>
            <p className="text-3xl font-bold text-green-600">8</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Monthly Revenue</h2>
            <p className="text-3xl font-bold text-purple-600">$5,200</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
