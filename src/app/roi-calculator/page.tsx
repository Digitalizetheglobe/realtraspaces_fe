'use client';

import { useState, useEffect } from 'react';

export default function ROICalculator() {
  const [propertyPrice, setPropertyPrice] = useState(10000);
  const [rentalPerMonth, setRentalPerMonth] = useState(10000);
  const [lockInPeriod, setLockInPeriod] = useState(20);
  const [agreementTenure, setAgreementTenure] = useState(20);
  const [activeTab, setActiveTab] = useState('monthly');
  
  const [calculations, setCalculations] = useState({
    roi: 0,
    totalReturns: 0,
    monthlyReturn: 0,
    yearlyReturn: 0
  });

  useEffect(() => {
    calculateROI();
  }, [propertyPrice, rentalPerMonth, lockInPeriod, agreementTenure]);

  const calculateROI = () => {
    if (propertyPrice === 0) {
      setCalculations({
        roi: 0,
        totalReturns: 0,
        monthlyReturn: 0,
        yearlyReturn: 0
      });
      return;
    }

    const annualRental = rentalPerMonth * 12;
    const totalRentalIncome = annualRental * agreementTenure;
    const roi = ((totalRentalIncome - propertyPrice) / propertyPrice) * 100;
    const monthlyReturnValue = (rentalPerMonth / propertyPrice) * 100;
    const yearlyReturnValue = (annualRental / propertyPrice) * 100;

    setCalculations({
      roi: roi,
      totalReturns: totalRentalIncome,
      monthlyReturn: monthlyReturnValue,
      yearlyReturn: yearlyReturnValue
    });
  };

  return (
    <div className="bg-gray-600 min-h-screen p-5">
      <div className="max-w-4xl mx-auto bg-white rounded-none shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row min-h-[500px]">
          {/* Left Panel - White Background */}
          <div className="flex-1 p-8 bg-white">
            <h1 className="text-2xl font-normal text-gray-800 mb-3">
              ROI - Return on Investment Calculator
            </h1>
            <p className="text-gray-600 text-sm mb-8">
              Figure out your loan amount and monthly repayments with our Calculator
            </p>
            
            {/* Property Price Input */}
            <div className="mb-6">
              <label className="block text-gray-800 font-normal mb-2 text-sm">
                Property Price is
              </label>
              <input 
                type="number" 
                className="w-full px-3 py-2 border border-gray-400 rounded-none text-base bg-white focus:outline-none focus:border-gray-600"
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(Number(e.target.value))}
                min="0"
              />
            </div>
            
            {/* Rental Per Month Input */}
            <div className="mb-6">
              <label className="block text-gray-800 font-normal mb-2 text-sm">
                Rental Per Month
              </label>
              <input 
                type="number" 
                className="w-full px-3 py-2 border border-gray-400 rounded-none text-base bg-white focus:outline-none focus:border-gray-600"
                value={rentalPerMonth}
                onChange={(e) => setRentalPerMonth(Number(e.target.value))}
                min="0"
              />
            </div>
            
            {/* Lock-in Period Slider */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-800 font-normal text-sm">Lock-in Period</span>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    className="w-12 px-2 py-1 bg-gray-100 border border-gray-300 rounded-none text-xs text-center"
                    value={lockInPeriod}
                    onChange={(e) => setLockInPeriod(Number(e.target.value))}
                    min="1" 
                    max="50"
                  />
                  <span className="text-gray-800 text-sm">years</span>
                </div>
              </div>
              <div className="relative my-4">
                <input 
                  type="range" 
                  className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
                  min="1" 
                  max="50" 
                  value={lockInPeriod}
                  onChange={(e) => setLockInPeriod(Number(e.target.value))}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>1year</span>
                  <span>50year</span>
                </div>
              </div>
            </div>
            
            {/* Agreement Tenure Slider */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-800 font-normal text-sm">Agreement Tenure is</span>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    className="w-12 px-2 py-1 bg-gray-100 border border-gray-300 rounded-none text-xs text-center"
                    value={agreementTenure}
                    onChange={(e) => setAgreementTenure(Number(e.target.value))}
                    min="1" 
                    max="50"
                  />
                  <span className="text-gray-800 text-sm">years</span>
                </div>
              </div>
              <div className="relative my-4">
                <input 
                  type="range" 
                  className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
                  min="1" 
                  max="50" 
                  value={agreementTenure}
                  onChange={(e) => setAgreementTenure(Number(e.target.value))}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>1year</span>
                  <span>50year</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Panel - Black Background */}
          <div className="flex-1 bg-black text-white p-8 flex flex-col justify-center items-center">
            {/* ROI Display */}
            <div className="text-center mb-12">
              <div className="text-white text-lg mb-4 font-light">ROI</div>
              <div className="text-7xl font-light mb-16 leading-none">
                {calculations.roi.toFixed(1)}%
              </div>
            </div>
            
            {/* Total Returns */}
            <div className="text-center mb-12">
              <div className="text-white text-lg mb-4 font-light">Total Returns is</div>
              <div className="text-6xl font-light leading-none">
                {Math.round(calculations.totalReturns).toLocaleString()}
              </div>
            </div>
            
            {/* Monthly/Yearly Tabs */}
           <div className="flex gap-4 mt-4">
  {/* Monthly Tab */}
  <button
    onClick={() => setActiveTab('monthly')}
    className={`px-6 py-3 rounded-lg border transition-colors duration-300 ${
      activeTab === 'monthly'
        ? 'bg-black text-white border-black'
        : 'bg-white text-black border-gray-400 hover:bg-gray-100'
    }`}
  >
    <div className="text-lg font-semibold">Monthly</div>
    <div className="text-sm mt-1">
      ₹ {calculations.monthlyReturn.toFixed(3)}
    </div>
  </button>

  {/* Yearly Tab */}
  <button
    onClick={() => setActiveTab('yearly')}
    className={`px-6 py-3 rounded-lg border transition-colors duration-300 ${
      activeTab === 'yearly'
        ? 'bg-black text-white border-black '
        : 'bg-white text-black border-gray-400 hover:bg-gray-100'
    }`}
  >
    <div className="text-lg font-semibold">Yearly</div>
    <div className="text-sm mt-1">
      ₹ {calculations.yearlyReturn.toFixed(3)}
    </div>
  </button>
</div>

          </div>
        </div>
        
        {/* Custom Slider Styles */}
        <style jsx>{`
          .slider::-webkit-slider-thumb {
            appearance: none;
            width: 16px;
            height: 16px;
            background: #333;
            border-radius: 50%;
            cursor: pointer;
            border: 2px solid #fff;
          }
          
          .slider::-moz-range-thumb {
            width: 16px;
            height: 16px;
            background: #333;
            border-radius: 50%;
            cursor: pointer;
            border: 2px solid #fff;
          }
        `}</style>
      </div>
    </div>
  );
}