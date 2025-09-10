"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { FiMapPin, FiCalendar, FiStar, FiArrowRight, FiHome, FiCheckCircle, FiX, FiEye } from "react-icons/fi";
import devloperimg1 from "../../../public/assets/images/developername1.png";
import devloperimg2 from "../../../public/assets/signin1.jpeg";
import devloperimg3 from "../../../public/assets/developer3.jpg";
import devloperimg4 from "../../../public/assets/developer4.jpg";
import FeaturedProperties from "../featuredproperties/page";
import { Raleway } from 'next/font/google';
import Link from "next/link";
import { getDeveloperImageUrl } from "@/utils/imageUtils";

// Load Raleway font
const raleway = Raleway({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

// Type definitions
interface Developer {
  id: number;
  name: string;
  logo: any; // StaticImageData type
  description?: string;
  projects?: string[];
  buildername: string;
  builder_logo: string | null | any;
  builder_logo_url?: string;
  descriptions: string;
  project_name: string[];
  images?: (string | any)[];
  image_urls?: string[];
  status: boolean;
  created_at: string;
  updated_at: string;
}

interface ApiDeveloper {
  id: number;
  buildername: string;
  builder_logo: string | null | any;
  builder_logo_url?: string;
  descriptions: string;
  project_name: string[];
  images?: (string | any)[];
  image_urls?: string[];
  status: boolean;
  created_at: string;
  updated_at: string;
}

// Default developer images array
const defaultImages = [devloperimg1, devloperimg2, devloperimg3, devloperimg4];

const TopDevelopers = () => {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Color scheme for modal
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

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const response = await fetch('https://api.realtraspaces.com/api/developers');
        const data = await response.json();
        
        if (data.success && data.data) {
          // Take only the first 4 developers and map them with default images
          const limitedDevelopers = data.data.slice(0, 4).map((developer: ApiDeveloper, index: number) => ({
            id: developer.id,
            name: developer.buildername,
            logo: defaultImages[index] || defaultImages[0], // Fallback to first image if index exceeds
            description: developer.descriptions,
            projects: developer.project_name,
            buildername: developer.buildername,
            builder_logo: developer.builder_logo,
            builder_logo_url: developer.builder_logo_url,
            descriptions: developer.descriptions,
            project_name: developer.project_name,
            images: developer.images || [],
            image_urls: developer.image_urls || [],
            status: developer.status,
            created_at: developer.created_at,
            updated_at: developer.updated_at
          }));
          
          setDevelopers(limitedDevelopers);
        }
      } catch (error) {
        console.error('Error fetching developers:', error);
        // Fallback to default developers if API fails
        setDevelopers([
          { 
            id: 1, 
            name: "Developer Name 1", 
            logo: devloperimg1,
            buildername: "Developer Name 1",
            builder_logo: null,
            descriptions: "Premium real estate developer with years of experience",
            project_name: ["Project 1", "Project 2"],
            images: [],
            status: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          { 
            id: 2, 
            name: "Developer Name 2", 
            logo: devloperimg2,
            buildername: "Developer Name 2",
            builder_logo: null,
            descriptions: "Innovative developer focused on modern architecture",
            project_name: ["Project A", "Project B"],
            images: [],
            status: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          { 
            id: 3, 
            name: "Developer Name 3", 
            logo: devloperimg3,
            buildername: "Developer Name 3",
            builder_logo: null,
            descriptions: "commercial developer",
            project_name: ["Project X", "Project Y"],
            images: [],
            status: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          { 
            id: 4, 
            name: "Developer Name 4", 
            logo: devloperimg4,
            buildername: "Developer Name 4",
            builder_logo: null,
            descriptions: "Sustainable and eco-friendly development specialist",
            project_name: ["Green Project 1", "Green Project 2"],
            images: [],
            status: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDevelopers();
  }, []);

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

  // Lightbox handlers
  const openLightbox = (imageUrl: string, index: number) => {
    setLightboxImage(imageUrl);
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
    setLightboxIndex(0);
  };

  const nextLightboxImage = () => {
    if (selectedDeveloper?.images) {
      const nextIndex = (lightboxIndex + 1) % selectedDeveloper.images.length;
      setLightboxIndex(nextIndex);
      setLightboxImage(getDeveloperImageUrl(selectedDeveloper.images[nextIndex]));
    }
  };

  const prevLightboxImage = () => {
    if (selectedDeveloper?.images) {
      const prevIndex = lightboxIndex === 0 ? selectedDeveloper.images.length - 1 : lightboxIndex - 1;
      setLightboxIndex(prevIndex);
      setLightboxImage(getDeveloperImageUrl(selectedDeveloper.images[prevIndex]));
    }
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

  // Lightbox keyboard navigation
  useEffect(() => {
    const handleLightboxKey = (e: KeyboardEvent) => {
      if (lightboxImage) {
        if (e.key === 'Escape') {
          closeLightbox();
        } else if (e.key === 'ArrowLeft') {
          prevLightboxImage();
        } else if (e.key === 'ArrowRight') {
          nextLightboxImage();
        }
      }
    };

    document.addEventListener('keydown', handleLightboxKey);
    return () => document.removeEventListener('keydown', handleLightboxKey);
  }, [lightboxImage, lightboxIndex, selectedDeveloper]);

  if (loading) {
    return (
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="mb-[25px] w-full justify-between items-start sm:items-center gap-6 sm:gap-0">
            <h2
              className={`${raleway.className} font-normal text-[32px] leading-[100%] tracking-normal text-center animate-fade-in-up`}
            >
              <span className="text-black">Top Developers.</span>{" "}
              <span className="text-[#6E6E73]">
                Renowned names you can trust.
              </span>
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Side - Guidance Card */}
            <div className="lg:w-1/3 bg-white rounded-xl shadow-md overflow-hidden p-6 flex flex-col justify-between border border-gray-300 transform transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-gray-400 animate-slide-in-left">
              <div>
                <h3 className={`${raleway.className} text-2xl font-bold text-gray-800 mb-4 transition-colors duration-300 hover:text-black`}>
                  Realtraspace
                </h3>
                <p className={`${raleway.className} text-md text-gray-800 transition-colors duration-300`}>
                  Need Guidance?
                </p>
                <p className={`${raleway.className} text-md mb-6 text-gray-800 transition-colors duration-300`}>
                  We are Here to Help
                </p>
                <p className={`${raleway.className} text-gray-500 mb-6 transition-colors duration-300`}>
                  Not sure where to begin? Reach out to our experts for
                  personalized consultation—we will help you find the perfect
                  property that fits your needs and vision.
                </p>
                <Link href="/contact" >
                <button className={`${raleway.className} bg-black hover:bg-white hover:text-black hover:border hover:border-black cursor-pointer text-white px-4 p-2 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95`}>
                  Contact Us
                </button>
                </Link>
              </div>
            </div>

            {/* Right Side - Developer Grid */}
            <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {developers.map((developer, index) => (
                <div
                  key={index}
                  className="relative group flex items-center space-x-4 cursor-pointer transform transition-all duration-300 hover:scale-105 animate-fade-in-up"
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                  onClick={() => openModal(developer)}
                >
                  <div className="w-full h-42 shadow-2xl border border-gray-200 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-gray-200 group-hover:shadow-lg overflow-hidden bg-white">
                    <Image
                      src={
                        developer.builder_logo && typeof developer.builder_logo === 'string' 
                          ? getDeveloperImageUrl(developer.builder_logo) 
                          : '/assets/signin.jpeg'
                      }
                      alt={developer.buildername}
                      width={200}
                      height={128}
                      className="w-full h-full object-contain rounded-lg transform transition-all duration-500 group-hover:scale-110 group-hover:brightness-75"
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        img.src = '/assets/signin.jpeg';
                      }}
                    />
                  </div>
                  
                  {/* Hover Text Overlay */}
                  <div className="absolute inset-0  bg-black bg-opacity-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-opacity-70 transition-all duration-300 rounded-lg">
                    <h3 className="text-white text-xl mx-6  font-bold text-center transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      {developer.name}
                    </h3>
                  </div>
                  
                  {/* Subtle border animation */}
                  <div className="absolute inset-0 group-hover:border-black rounded-lg transition-all duration-300"></div>
                </div>
              ))}
            </div>
          </div>
          <Link href="/developers">
            <button className="bg-black text-white justify-center items-center cursor-pointer px-4 py-2 mt-4 rounded-md">
              View All Developers
            </button>
          </Link>
        </div>
      </section>

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
            <div className="relative h-64 bg-gray-100 flex items-center justify-center">
              <Image
                src={
                  selectedDeveloper.builder_logo && typeof selectedDeveloper.builder_logo === 'string' 
                    ? getDeveloperImageUrl(selectedDeveloper.builder_logo) 
                    : '/assets/signin.jpeg'
                }
                alt={selectedDeveloper.buildername}
                width={800}
                height={256}
                className="w-full h-full object-contain"
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {selectedDeveloper.images.map((image, idx) => (
                      <div 
                        key={idx} 
                        className="bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                        onClick={() => openLightbox(
                          typeof image === 'string' ? getDeveloperImageUrl(image) : '/assets/signin.jpeg',
                          idx
                        )}
                      >
                        <div className="aspect-[4/3] overflow-hidden relative bg-gray-100 flex items-center justify-center">
                          <Image
                            src={
                              typeof image === 'string' 
                                ? getDeveloperImageUrl(image) 
                                : '/assets/signin.jpeg'
                            }
                            alt={`${selectedDeveloper.buildername} gallery ${idx + 1}`}
                            fill
                            className="object-contain group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              const img = e.currentTarget as HTMLImageElement;
                              img.src = '/assets/signin.jpeg';
                            }}
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="bg-white bg-opacity-90 rounded-full p-2">
                                <FiEye className="w-6 h-6 text-gray-700" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100">
                          <p className="text-sm text-gray-700 text-center font-medium">
                            Gallery Image {idx + 1}
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

      {/* Custom CSS animations */}
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

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
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

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.8s ease-out forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }

        /* Smooth scrolling and performance optimization */
        * {
          transform: translateZ(0);
        }
      `}</style>

      <FeaturedProperties />

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm">
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all z-10"
            >
              <FiX size={24} />
            </button>

            {/* Navigation Buttons */}
            {selectedDeveloper?.images && selectedDeveloper.images.length > 1 && (
              <>
                <button
                  onClick={prevLightboxImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all z-10"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextLightboxImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all z-10"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Image */}
            <div className="relative max-w-full max-h-full flex items-center justify-center">
              <Image
                src={lightboxImage}
                alt={`Gallery image ${lightboxIndex + 1}`}
                width={1200}
                height={800}
                className="max-w-full max-h-full object-contain rounded-lg"
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  img.src = '/assets/signin.jpeg';
                }}
              />
            </div>

            {/* Image Counter */}
            {selectedDeveloper?.images && selectedDeveloper.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
                {lightboxIndex + 1} / {selectedDeveloper.images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TopDevelopers;