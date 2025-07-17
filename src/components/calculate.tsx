'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const CalculatorSection = () => {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState(null);

  const calculators = [
    {
      id: 'lrd',
      title: 'LRD Calculator',
      description: 'Calculate your Loan-to-Deposit Ratio with precision and monitor financial leverage effectively.',
      route: '/lrd-calculator',
      icon: '📊',
      metrics: ['Liquidity', 'Risk Assessment', 'Compliance']
    },
    {
      id: 'irr',
      title: 'IRR Calculator',
      description: 'Determine Internal Rate of Return for investments and analyze profitability potential.',
      route: '/irr-calculator',
      icon: '💰',
      metrics: ['ROI Analysis', 'Investment', 'Profitability']
    },
    {
      id: 'roi',
      title: 'ROI Calculator',
      description: 'Measure Return on Investment efficiency and optimize your investment portfolio.',
      route: '/roi-calculator',
      icon: '📈',
      metrics: ['Performance', 'Efficiency', 'Growth']
    }
  ];

  const handleCardClick = (route) => {
    router.push(route);
  };

  return (
    <div className="min-h-screen bg-[#F1F1F4] py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        {/* <div className="text-center mb-16">
          
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
             
          </h1>
          
        </div> */}
         <div className="mb-8 w-full">
              <h2 className=" font-normal text-xl sm:text-2xl md:text-[32px] leading-[120%] tracking-normal text-center transform transition-all duration-700 hover:scale-105">
                <span className="text-black">Financial</span>{" "}
                <span className="text-[#6E6E73]">
                  Calculators
                </span>
              </h2>
            </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {calculators.map((calc, index) => (
            <div
              key={calc.id}
              className={`group relative bg-white rounded-3xl p-8 cursor-pointer transition-all duration-500 ease-out border-2 hover:border-black ${
                hoveredCard === calc.id ? 'border-black' : 'border-[#6E6E73]'
              }`}
              style={{
                transform: hoveredCard === calc.id ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                boxShadow: hoveredCard === calc.id ? '0 25px 50px rgba(0, 0, 0, 0.15)' : '0 10px 30px rgba(0, 0, 0, 0.08)',
                animationDelay: `${index * 100}ms`
              }}
              onMouseEnter={() => setHoveredCard(calc.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleCardClick(calc.route)}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#F1F1F4] rounded-full -translate-y-16 translate-x-16 transition-transform duration-500 group-hover:scale-150"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#F1F1F4] rounded-full translate-y-12 -translate-x-12 transition-transform duration-500 group-hover:scale-125"></div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 ${
                    hoveredCard === calc.id ? 'bg-black text-white' : 'bg-[#F1F1F4] text-black'
                  }`}>
                    {calc.icon}
                  </div>
                  <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    hoveredCard === calc.id ? 'bg-black' : 'bg-[#6E6E73]'
                  }`}></div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-black mb-3 group-hover:text-[#6E6E73] transition-colors duration-300">
                  {calc.title}
                </h3>

                {/* Description */}
                <p className="text-[#6E6E73] text-sm leading-relaxed mb-6">
                  {calc.description}
                </p>

                {/* Metrics Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {calc.metrics.map((metric, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                        hoveredCard === calc.id 
                          ? 'bg-black text-white' 
                          : 'bg-[#F1F1F4] text-[#6E6E73]'
                      }`}
                    >
                      {metric}
                    </span>
                  ))}
                </div>

                {/* Action Button */}
                <div className="flex items-center justify-between">
                  <button
                    className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                      hoveredCard === calc.id
                        ? 'bg-black text-white'
                        : 'bg-[#F1F1F4] text-black hover:bg-[#6E6E73] hover:text-white'
                    }`}
                  >
                    <span>Calculate</span>
                    <svg 
                      className={`w-4 h-4 transition-transform duration-300 ${
                        hoveredCard === calc.id ? 'translate-x-1' : ''
                      }`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  {/* Progress Indicator */}
                  {/* <div className="flex space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          hoveredCard === calc.id && i <= index
                            ? 'bg-black'
                            : 'bg-[#6E6E73]'
                        }`}
                      ></div>
                    ))}
                  </div> */}
                </div>
              </div>

              {/* Hover Overlay */}
              <div className={`absolute inset-0 rounded-3xl transition-opacity duration-300 ${
                hoveredCard === calc.id ? 'opacity-5' : 'opacity-0'
              } bg-black pointer-events-none`}></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
       
      </div>
    </div>
  );
};

export default CalculatorSection;