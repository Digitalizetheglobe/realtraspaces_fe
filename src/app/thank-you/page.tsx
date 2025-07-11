'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const ThankYouPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [checkmarkComplete, setCheckmarkComplete] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setCheckmarkComplete(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: "✓",
      title: "Verified Properties",
      description: "Every property is verified for accuracy and authenticity"
    },
    {
      icon: "🎯",
      title: "Expert Guidance", 
      description: "Professional consultation for the best investment decisions"
    },
    {
      icon: "🤝",
      title: "Trusted Partners",
      description: "Direct partnerships with India's most reputed developers"
    },
    {
      icon: "💰",
      title: "Best Deals",
      description: "No extra commission or hidden brokerage charges"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-800 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 text-4xl opacity-10 animate-bounce" style={{ animationDelay: '0s', animationDuration: '6s' }}>
          🏠
        </div>
        <div className="absolute top-60 right-20 text-4xl opacity-10 animate-bounce" style={{ animationDelay: '2s', animationDuration: '6s' }}>
          🏢
        </div>
        <div className="absolute bottom-32 left-32 text-4xl opacity-10 animate-bounce" style={{ animationDelay: '4s', animationDuration: '6s' }}>
          🏡
        </div>
      </div>

      <div className="max-w-4xl w-full my-24">
        {/* Main Thank You Card */}
        <div className={`
          bg-white/95 backdrop-blur-lg rounded-3xl p-8 md:p-12 
          shadow-2xl border border-white/20
          transform transition-all duration-1000 ease-out
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}
          hover:shadow-3xl hover:scale-[1.02] group
          relative overflow-hidden
        `}>
          
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                         -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

          {/* Checkmark Animation */}
          <div className={`
            w-20 h-20 mx-auto mb-8 rounded-full 
            bg-gradient-to-br from-green-400 to-green-600
            flex items-center justify-center
            shadow-lg shadow-green-500/30
            transform transition-all duration-600 ease-out
            ${isVisible ? 'scale-100' : 'scale-0'}
            hover:scale-110 hover:shadow-xl hover:shadow-green-500/40
          `} style={{ animationDelay: '0.5s' }}>
            <svg 
              className="w-10 h-10 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={3}
                d="M5 13l4 4L19 7"
                className={`
                  transition-all duration-1000 ease-in-out
                  ${checkmarkComplete ? 'stroke-dasharray-none' : 'stroke-dasharray-100 stroke-dashoffset-100'}
                `}
                style={{
                  strokeDasharray: checkmarkComplete ? 'none' : '100',
                  strokeDashoffset: checkmarkComplete ? '0' : '100'
                }}
              />
            </svg>
          </div>

          {/* Main Content */}
          <div className="text-center space-y-6">
            <h1 className={`
              text-4xl md:text-5xl font-bold text-gray-800 
              transform transition-all duration-800 ease-out
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `} style={{ animationDelay: '0.8s' }}>
              Thank You!
            </h1>

            <p className={`
              text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto
              transform transition-all duration-800 ease-out
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `} style={{ animationDelay: '1.1s' }}>
             Thank you for getting in touch! your Enquire has been successfully submitted.  
             </p>
          </div>

          {/* Features Grid */}
          {/* <div className={`
            grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12
            transform transition-all duration-800 ease-out
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `} style={{ animationDelay: '1.4s' }}>
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group/feature bg-gradient-to-br from-gray-50 to-gray-100 
                          rounded-2xl p-6 text-center
                          hover:from-blue-500 hover:to-purple-600 hover:text-white
                          transform hover:-translate-y-2 hover:scale-105
                          transition-all duration-300 ease-out
                          cursor-pointer relative overflow-hidden
                          border border-gray-200 hover:border-transparent
                          hover:shadow-xl hover:shadow-blue-500/25"
                style={{ animationDelay: `${1.6 + index * 0.1}s` }}
              >
                
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                               -translate-x-full group-hover/feature:translate-x-full transition-transform duration-500" />
                
                <div className="text-3xl mb-3 transform group-hover/feature:scale-125 group-hover/feature:rotate-12 
                               transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2 relative z-10">{feature.title}</h3>
                <p className="text-sm opacity-80 relative z-10">{feature.description}</p>
              </div>
            ))}
          </div> */}

          {/* Call to Action Section */}
          <div className={`
            mt-2 text-center space-y-6
            transform transition-all duration-800 ease-out
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
          `} style={{ animationDelay: '2s' }}>
            <div className="space-y-2">
              {/* <p className="text-lg font-semibold text-gray-800">What happens next?</p> */}
              <p className="text-gray-600">
                Our team will contact you within 24 hours to discuss your property requirements 
                and schedule a consultation.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <Link 
                href="/"
                className="group/btn bg-gradient-to-r from-blue-500 to-purple-600 
                          text-white px-8 py-4 rounded-full font-semibold
                          hover:from-blue-600 hover:to-purple-700
                          transform hover:-translate-y-1 hover:scale-105
                          transition-all duration-300 ease-out
                          shadow-lg hover:shadow-xl hover:shadow-blue-500/25
                          relative overflow-hidden min-w-[200px]"
              >
                <span className="relative z-10">Back to Home</span>
                <div className="absolute inset-0 bg-white/20 rounded-full scale-0 
                               group-hover/btn:scale-100 transition-transform duration-300" />
              </Link>

              <Link 
                href="/luxe-properties"
                className="group/btn bg-white text-blue-600 border-2 border-blue-500
                          px-8 py-4 rounded-full font-semibold
                          hover:bg-blue-500 hover:text-white hover:border-blue-500
                          transform hover:-translate-y-1 hover:scale-105
                          transition-all duration-300 ease-out
                          shadow-lg hover:shadow-xl hover:shadow-blue-500/25
                          relative overflow-hidden min-w-[200px]"
              >
                <span className="relative z-10">Browse Properties</span>
                <div className="absolute inset-0 bg-blue-500 scale-0 
                               group-hover/btn:scale-100 transition-transform duration-300 rounded-full" />
              </Link>
            </div>
          </div>
        </div>

        {/* Contact Info Card */}
        <div className={`
          mt-8 bg-white/90 backdrop-blur-lg rounded-2xl p-6
          shadow-xl border border-white/20
          transform transition-all duration-1000 ease-out
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
          hover:shadow-2xl hover:scale-[1.01]
        `} style={{ animationDelay: '2.3s' }}>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Need Immediate Assistance?
            </h3>
            <p className="text-gray-600 mb-4">
              Our property experts are available to help you make the right investment decision
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Response within 24 hours
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                Expert consultation
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                Personalized recommendations
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;