"use client";

import { useState, useEffect } from "react";
import { FiMapPin, FiCalendar, FiStar, FiArrowRight, FiHome, FiCheckCircle } from "react-icons/fi";
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
                  className="group relative bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  {/* Card Front (Initial View) */}
                  <div className="relative h-80 overflow-hidden">
                    {/* Background Image/Logo */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200">
                      <Image
                        src={developer.builder_logo ? getDeveloperImageUrl(developer.builder_logo) : '/assets/signin.jpeg'}
                        alt={developer.buildername}
                        width={400}
                        height={320}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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

                    {/* Developer Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl font-bold mb-2 group-hover:text-yellow-300 transition-colors">
                        {developer.buildername}
                      </h3>
                                             <p className="text-sm text-white/80 line-clamp-2">
                         {developer.descriptions || 'No description available'}
                       </p>
                                             <div className="flex items-center mt-3 text-sm text-white/70">
                         <FiHome className="mr-1" />
                         <span>{(developer.project_name || []).length} Projects</span>
                       </div>
                    </div>

                    {/* Hover Indicator */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                          <FiArrowRight className="text-white text-xl" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Back (Hover Details) */}
                  <div className="absolute inset-0 bg-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold" style={{ color: colors.dark }}>
                          {developer.buildername}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            developer.status
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {developer.status ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {developer.descriptions || 'No description available'}
                      </p>

                      {/* Developer Gallery Images */}
                      {(developer.images && developer.images.length > 0) && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold mb-2" style={{ color: colors.primary }}>
                            Gallery 
                          </h4>
                          <div className="flex gap-2 overflow-x-auto pb-2">
                            {(developer.images || []).slice(0, 3).map((image, idx) => (
                              <div key={idx} className="flex-shrink-0">
                                <img
                                  src={getDeveloperImageUrl(image)}
                                  alt={`${developer.buildername} gallery ${idx + 1}`}
                                  className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                  onError={(e) => {
                                    const img = e.currentTarget as HTMLImageElement;
                                    img.src = '/assets/signin.jpeg';
                                  }}
                                />
                              </div>
                            ))}
                            {(developer.images || []).length > 3 && (
                              <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                                <span className="text-xs text-gray-500 font-medium">
                                  +{(developer.images || []).length - 3}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {(developer.project_name || []).length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold mb-2" style={{ color: colors.primary }}>
                            Projects ({(developer.project_name || []).length})
                          </h4>
                          <div className="space-y-1">
                            {(developer.project_name || []).slice(0, 3).map((project, idx) => (
                              <div key={idx} className="flex items-center text-sm text-gray-600">
                                <FiCheckCircle className="mr-2 text-green-500 flex-shrink-0" size={14} />
                                <span className="truncate">{project || 'Unnamed Project'}</span>
                              </div>
                            ))}
                            {(developer.project_name || []).length > 3 && (
                              <div className="text-xs text-gray-500 mt-1">
                                +{(developer.project_name || []).length - 3} more projects
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center">
                          <FiCalendar className="mr-1" />
                          <span>Created: {formatDate(developer.created_at)}</span>
                        </div>
                        <div className="flex items-center">
                          <FiStar className="mr-1" />
                          <span>Updated: {formatDate(developer.updated_at)}</span>
                        </div>
                      </div>
                    </div>

                    {/* <div className="mt-4 pt-4 border-t border-gray-100">
                      <button
                        className="w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 transform hover:scale-105"
                        style={{
                          background: `linear-gradient(135deg, ${colors.gradientStart} 0%, ${colors.gradientEnd} 100%)`
                        }}
                      >
                        View Details
                      </button>
                    </div> */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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
