"use client";
import Image from "next/image";
import React from "react";
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

const TopDevelopers = () => {
  const developers = [
    { name: "Developer Name 1", logo: devloperimg1 },
    { name: "Developer Name 2", logo: devloperimg2 },
    { name: "Developer Name 3", logo: devloperimg3 },
    { name: "Developer Name 4", logo: devloperimg4 },
  ];

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