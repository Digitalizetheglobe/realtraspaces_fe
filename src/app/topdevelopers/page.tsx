"use client";
import Image from "next/image";
import React from "react";
import devloperimg1 from '../../../public/assets/images/developername1.png'
import devloperimg2 from '../../../public/assets/images/developername2.png'
import FeaturedProperties from "../featuredproperties/page";

const TopDevelopers = () => {
  const developers = [
    { name: "Realmspace", logo: devloperimg1 },
    { name: "Developer Name", logo: devloperimg2 },
    { name: "Developer Name", logo: devloperimg2 },
    { name: "Developer Name", logo: devloperimg1 }, // Using first image as placeholder for fourth
  ];

  return (
    <>
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
      <div className="mb-[25px] w-full justify-between items-start sm:items-center gap-6 sm:gap-0 ">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black w-full pr-4">
                        Don&apos;t miss out on the top developers!. 
                            <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#6E6E73] w-full pr-4">
                            Renowned names you can trust.
                            </span>
                        </h2>
                    </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - Guidance Card */}
          <div className="lg:w-1/3 bg-white rounded-xl shadow-md overflow-hidden p-6 flex flex-col justify-between border-10 border-gray-300 ">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 font-[var(--font-qwitcher-grypen)]">Realtraspace</h3>
              <p className="text-md text-gray-800">
                Need Guidance?
              </p>
              <p className="text-md mb-6 text-gray-800">
                We&rsquo;re Here to Help
              </p>
              <p className="text-gray-500 mb-6">
               Not sure where to begin? Reach out to our experts for personalized consultation—we&rsquo;ll help you find the perfect property that fits your needs and vision.              </p>
           <button className="bg-black text-white px-4 p-2 rounded-lg">Contact Us</button>
            </div>           
          </div>

          {/* Right Side - Developer Grid */}
          <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {developers.map((developer, index) => (
              <div key={index} className="relative flex items-center space-x-4 ">
                <div className="bg-gray-100 rounded-lg flex items-center justify-center">
                  <Image 
                    src={developer.logo} 
                    alt='developer'
                    className="object-contain"
                  />
                </div>
                {/* Hover Text Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-20 transition-opacity duration-300">
                  <h3 className="text-white text-xl font-bold">{developer.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

<FeaturedProperties />
    </>
  );
};

export default TopDevelopers;