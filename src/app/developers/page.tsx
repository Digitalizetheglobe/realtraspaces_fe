"use client";

import { useState, useEffect } from "react";
import { FiMapPin, FiCalendar, FiStar, FiArrowRight, FiHome, FiCheckCircle, FiX, FiEye } from "react-icons/fi";
import Image from "next/image";
import { getDeveloperImageUrl, getDeveloperImageUrls } from "@/utils/imageUtils";
interface Developer {
  id: number;
  buildername: string;
  builder_logo: string | null;
  builder_logo_url?: string;
  descriptions: string;
  project_name: string[];
  images?: string[];
  image_urls?: string[];
  status: boolean;
  created_at: string;
  updated_at: string;
}

const DevelopersPage = () => {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Color scheme
  const colors = {
    primary: "#2D5F7D",
    secondary: "#5B9CBD",
    accent: "#E8A75D",
    light: "#F5F9FC",
    dark: "#1A3A4A",
    gradientStart: "#2D5F7D",
    gradientEnd: "#5B9CBD",
    success: "#10B981",
    warning: "#F59E0B",
  };

  // Fetch developers
  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.realtraspaces.com'}/api/developers`);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log('Developers API response:', data.data);
        console.log('Developer images:', data.data?.map((dev: any) => ({
          name: dev.buildername,
          logo: dev.builder_logo,
          logo_url: dev.builder_logo_url,
          images: dev.images,
          image_urls: dev.image_urls
        })));
        setDevelopers(data.data || []);
      } catch (error) {
        setError(
          `Failed to load developers: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      } finally {
        setLoading(false);
      }
    };
    fetchDevelopers();
  }, []);

  // Filter developers based on search and status
  const filteredDevelopers = developers.filter((developer) => {
    const matchesSearch = developer.buildername
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      (developer.descriptions?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (developer.project_name || []).some(project => 
        project?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "active" && developer.status) ||
      (filterStatus === "inactive" && !developer.status);
    
    return matchesSearch && matchesStatus;
  });

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Modal handlers
  const openModal = (developer: Developer) => {
    setSelectedDeveloper(developer);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDeveloper(null);
    document.body.style.overflow = 'unset'; // Restore scrolling
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isModalOpen]);

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: colors.light }}>
        {/* Hero Section Skeleton */}
        <div 
          className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
          style={{
            backgroundImage: `url('/assets/hero.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative max-w-7xl mx-auto text-center">
            <div className="h-16 bg-white/20 rounded-lg mb-6 animate-pulse"></div>
            <div className="h-8 bg-white/20 rounded-lg mb-8 max-w-3xl mx-auto animate-pulse"></div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="h-16 bg-white/20 rounded-full w-80 animate-pulse"></div>
              <div className="h-16 bg-white/20 rounded-full w-48 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Stats Section Skeleton */}
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-8 text-center shadow-lg">
                  <div className="h-12 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cards Skeleton */}
        <div className="px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="h-80 bg-gray-200 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.light }}>
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4">
            <p>{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-lg text-white transition-all"
            style={{ backgroundColor: colors.primary }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.light }}>
             {/* Hero Section */}
       <div 
         className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
         style={{
           backgroundImage: `url('/assets/hero.jpg')`,
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundRepeat: 'no-repeat'
         }}
       >
         <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Top Real Estate Developers
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Discover the most trusted and innovative real estate developers in the market. 
            Explore their projects and find your perfect investment opportunity.
          </p>
          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search developers or projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-80 px-6 py-4 rounded-full text-lg border-0 focus:outline-none focus:ring-4 focus:ring-white/20 shadow-lg"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as "all" | "active" | "inactive")}
              className="px-6 py-4 rounded-full text-lg border-0 focus:outline-none focus:ring-4 focus:ring-white/20 shadow-lg bg-white/10 text-white backdrop-blur-sm"
            >
              <option value="all" className="text-gray-800">All Developers</option>
              <option value="active" className="text-gray-800">Active Only</option>
              <option value="inactive" className="text-gray-800">Inactive Only</option>
            </select>
          </div> */}
        </div>
      </div>

      {/* Stats Section */}
      {/* <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-4xl font-bold mb-2" style={{ color: colors.primary }}>
                {developers.length}
              </div>
              <div className="text-gray-600">Total Developers</div>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-4xl font-bold mb-2" style={{ color: colors.success }}>
                {developers.filter(d => d.status).length}
              </div>
              <div className="text-gray-600">Active Developers</div>
            </div>
                         <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300">
               <div className="text-4xl font-bold mb-2" style={{ color: colors.accent }}>
                 {developers.reduce((acc, dev) => acc + (dev.project_name || []).length, 0)}
               </div>
               <div className="text-gray-600">Total Projects</div>
             </div>
          </div>
        </div>
      </div> */}

      {/* Developers Grid */}
      <div className="px-4 sm:px-6 pt-8 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {filteredDevelopers.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🏢</div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: colors.dark }}>
                No developers found
              </h3>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== "all" 
                  ? "Try adjusting your search or filter criteria."
                  : "No developers are currently available."
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDevelopers.map((developer, index) => (
                <div
                  key={developer.id}
                  className="group relative bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                  onClick={() => openModal(developer)}
                >
                  {/* Card Content */}
                  <div className="relative h-80 overflow-hidden">
                    {/* Background Image/Logo */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200">
                      <Image
                        src={developer.builder_logo ? getDeveloperImageUrl(developer.builder_logo) : '/assets/signin.jpeg'}
                        alt={developer.buildername}
                        width={400}
                        height={320}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          const img = e.currentTarget as HTMLImageElement;
                          img.src = '/assets/signin.jpeg';
                        }}
                      />
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          developer.status
                            ? "bg-green-500 text-white"
                            : "bg-gray-500 text-white"
                        }`}
                      >
                        {developer.status ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {/* View Details Icon */}
                    <div className="absolute top-4 left-4">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <FiEye className="text-white text-lg" />
                      </div>
                    </div>

                    {/* Developer Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl font-bold mb-2 group-hover:text-yellow-300 transition-colors">
                        {developer.buildername}
                      </h3>
                      <p className="text-sm text-white/80 line-clamp-2 mb-3">
                        {developer.descriptions || 'No description available'}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-white/70">
                          <FiHome className="mr-1" />
                          <span>{(developer.project_name || []).length} Projects</span>
                        </div>
                        <div className="text-sm text-white/70">
                          Click to view details
                        </div>
                      </div>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Developer Details Modal */}
      {isModalOpen && selectedDeveloper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
            onClick={closeModal}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scaleIn">
            {/* Modal Header */}
            <div className="relative h-64">
              <Image
                src={selectedDeveloper.builder_logo ? getDeveloperImageUrl(selectedDeveloper.builder_logo) : '/assets/signin.jpeg'}
                alt={selectedDeveloper.buildername}
                width={800}
                height={256}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  img.src = '/assets/signin.jpeg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all"
              >
                <FiX size={24} />
              </button>

              {/* Status Badge */}
              <div className="absolute top-4 left-4">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    selectedDeveloper.status
                      ? "bg-green-500 text-white"
                      : "bg-gray-500 text-white"
                  }`}
                >
                  {selectedDeveloper.status ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Developer Name */}
              <div className="absolute bottom-6 left-6 right-6">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {selectedDeveloper.buildername}
                </h2>
                <div className="flex items-center text-white/80">
                  <FiHome className="mr-2" />
                  <span>{(selectedDeveloper.project_name || []).length} Projects</span>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-16rem)]">
              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3" style={{ color: colors.primary }}>
                  About the Developer
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedDeveloper.descriptions || 'No description available for this developer.'}
                </p>
              </div>

              {/* Gallery Images */}
              {(selectedDeveloper.images && selectedDeveloper.images.length > 0) && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4" style={{ color: colors.primary }}>
                    Gallery ({selectedDeveloper.images.length} images)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {selectedDeveloper.images.map((image, idx) => (
                      <div key={idx} className="bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={getDeveloperImageUrl(image)}
                            alt={`${selectedDeveloper.buildername} gallery ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              const img = e.currentTarget as HTMLImageElement;
                              img.src = '/assets/signin.jpeg';
                            }}
                          />
                        </div>
                        <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100">
                          <p className="text-xs text-gray-600 text-center font-medium">
                            Image {idx + 1}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {(selectedDeveloper.project_name && selectedDeveloper.project_name.length > 0) && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4" style={{ color: colors.primary }}>
                    Projects ({selectedDeveloper.project_name.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedDeveloper.project_name.map((project, idx) => (
                      <div key={idx} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <FiCheckCircle className="mr-3 text-green-500 flex-shrink-0" size={16} />
                        <span className="text-gray-700 font-medium">{project || 'Unnamed Project'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <FiCalendar className="mr-2 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-medium text-gray-700">{formatDate(selectedDeveloper.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiStar className="mr-2 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-medium text-gray-700">{formatDate(selectedDeveloper.updated_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default DevelopersPage;
