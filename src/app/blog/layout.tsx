'use client';

import { useState } from 'react';
import Link from 'next/link';

const BlogLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const modules = [
    { name: 'Dashboard', icon: '📊', href: '/dashboard' },
    { name: 'Properties', icon: '🏠', href: '/properties' },
    { name: 'Tenants', icon: '👥', href: '/tenants' },
    { name: 'Payments', icon: '💰', href: '/payments' },
    { name: 'Reports', icon: '📈', href: '/reports' },
    { name: 'Settings', icon: '⚙️', href: '/settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
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
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default BlogLayout; 