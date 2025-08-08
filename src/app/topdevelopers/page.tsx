"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import devloperimg1 from "../../../public/assets/images/developername1.png";
import devloperimg2 from "../../../public/assets/signin1.jpeg";
import devloperimg3 from "../../../public/assets/developer3.jpg";
import devloperimg4 from "../../../public/assets/developer4.jpg";
import FeaturedProperties from "../featuredproperties/page";
import { Raleway } from 'next/font/google';
import Link from "next/link";

// Load Raleway font
const raleway = Raleway({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

// Type definitions
interface Developer {
  name: string;
  logo: any; // StaticImageData type
  description?: string;
  projects?: string[];
}

interface ApiDeveloper {
  id: number;
  buildername: string;
  builder_logo: string | null;
  descriptions: string;
  project_name: string[];
  status: boolean;
  created_at: string;
  updated_at: string;
}

// Default developer images array
const defaultImages = [devloperimg1, devloperimg2, devloperimg3, devloperimg4];

const TopDevelopers = () => {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const response = await fetch('https://api.realtraspaces.com/api/developers');
        const data = await response.json();
        
        if (data.success && data.data) {
          // Take only the first 4 developers and map them with default images
          const limitedDevelopers = data.data.slice(0, 4).map((developer: ApiDeveloper, index: number) => ({
            name: developer.buildername,
            logo: defaultImages[index] || defaultImages[0], // Fallback to first image if index exceeds
            description: developer.descriptions,
            projects: developer.project_name
          }));
          
          setDevelopers(limitedDevelopers);
        }
      } catch (error) {
        console.error('Error fetching developers:', error);
        // Fallback to default developers if API fails
        setDevelopers([
          { name: "Developer Name 1", logo: devloperimg1 },
          { name: "Developer Name 2", logo: devloperimg2 },
          { name: "Developer Name 3", logo: devloperimg3 },
          { name: "Developer Name 4", logo: devloperimg4 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDevelopers();
  }, []);

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
                >
                  <div className=" rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-gray-200 group-hover:shadow-lg overflow-hidden">
                    <Image
                      src={developer.logo}
                      alt="developer"
                      className="object-contain rounded-lg transform transition-all duration-500 group-hover:scale-110 group-hover:brightness-75"
                    />
                  </div>
                  
                  {/* Hover Text Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-opacity-70 transition-all duration-300 rounded-lg">
                    <h3 className="text-white text-xl font-bold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
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
            <button className="bg-black text-white px-4 py-2 mt-4 rounded-md">
              View All Developers
            </button>
          </Link>
        </div>
      </section>

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

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.8s ease-out forwards;
        }

        /* Smooth scrolling and performance optimization */
        * {
          transform: translateZ(0);
        }
      `}</style>

      <FeaturedProperties />
    </>
  );
};

export default TopDevelopers;