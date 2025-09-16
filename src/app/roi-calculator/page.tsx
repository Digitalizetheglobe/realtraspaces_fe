'use client';

import { useState, useEffect } from 'react';
import SeoHead from "../../components/SeoHead";

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
    <div className="max-w-6xl mx-auto my-20 p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          ROI - <span className="font-bold">Return on Investment Calculator</span>
        </h1>
        <p className="text-gray-600">
          Figure out your loan amount and monthly repayments with our Calculator
        </p>
       
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side */}
        <div className="bg-white p-6 rounded-lg space-y-8">
            
          {/* Property Price */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Property Price is</h2>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lg font-semibold text-gray-600">₹</span>
              <input
                type="number"
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(Number(e.target.value) || 0)}
                className="w-full border-2 text-black border-gray-300 rounded-lg pl-8 pr-4 py-3 text-lg font-semibold focus:outline-none focus:border-blue-500"
                placeholder="10000"
                min="0"
              />
            </div>
          </div>
            
          {/* Rental Per Month */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Rental Per Month</h2>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lg font-semibold text-gray-600">₹</span>
              <input
                type="number"
                value={rentalPerMonth}
                onChange={(e) => setRentalPerMonth(Number(e.target.value) || 0)}
                className="w-full border-2 text-black border-gray-300 rounded-lg pl-8 pr-4 py-3 text-lg font-semibold focus:outline-none focus:border-blue-500"
                placeholder="10000"
                min="0"
              />
            </div>
          </div>
            
          {/* Lock-in Period */}
          <div>
            <div className="flex items-center mb-6">
              <span className="text-lg text-gray-700 mr-4">Lock-in Period</span>
              <input
                type="number"
                value={lockInPeriod}
                onChange={(e) => setLockInPeriod(Number(e.target.value) || 0)}
                className="w-16 border-2 border-gray-300 rounded px-3 py-2 text-center font-semibold focus:outline-none focus:border-blue-500"
                min="1"
                max="50"
              />
              <span className="text-lg text-gray-700 ml-4">years</span>
            </div>

            {/* Slider */}
            <div className="relative">
              <input
                type="range"
                min="1"
                max="50"
                value={lockInPeriod}
                onChange={(e) => setLockInPeriod(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #000 0%, #000 ${((lockInPeriod - 1) / 49) * 100}%, #e5e7eb ${((lockInPeriod - 1) / 49) * 100}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>1year</span>
                <span>50year</span>
              </div>
            </div>
          </div>
            
          {/* Agreement Tenure */}
          <div>
            <div className="flex items-center mb-6">
              <span className="text-lg text-gray-700 mr-4">Agreement Tenure is</span>
              <input
                type="number"
                value={agreementTenure}
                onChange={(e) => setAgreementTenure(Number(e.target.value) || 0)}
                className="w-16 border-2 border-gray-300 rounded px-3 py-2 text-center font-semibold focus:outline-none focus:border-blue-500"
                min="1"
                max="50"
              />
              <span className="text-lg text-gray-700 ml-4">years</span>
            </div>

            {/* Slider */}
            <div className="relative">
              <input
                type="range"
                min="1"
                max="50"
                value={agreementTenure}
                onChange={(e) => setAgreementTenure(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #000 0%, #000 ${((agreementTenure - 1) / 49) * 100}%, #e5e7eb ${((agreementTenure - 1) / 49) * 100}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>1year</span>
                <span>50year</span>
              </div>
            </div>
          </div>
        </div>
          
        {/* Right Side */}
        <div className="bg-black text-white p-8 rounded-lg">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-4">ROI is</h2>
            <div className="text-4xl font-bold mb-4">{calculations.roi.toFixed(1)}%</div>
            <div className="text-sm text-gray-400">
              Total Returns: ₹{Math.round(calculations.totalReturns).toLocaleString()}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold mb-2">Monthly Return</h3>
              <div className="text-xl font-bold">{calculations.monthlyReturn.toFixed(3)}%</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold mb-2">Yearly Return</h3>
              <div className="text-xl font-bold">{calculations.yearlyReturn.toFixed(3)}%</div>
            </div>
          </div>

          {/* Summary */}
          <div className="border-t border-gray-700 pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Property Price:</p>
                <p className="font-semibold">₹{propertyPrice.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400">Monthly Rental:</p>
                <p className="font-semibold">₹{rentalPerMonth.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400">Lock-in Period:</p>
                <p className="font-semibold">{lockInPeriod} years</p>
              </div>
              <div>
                <p className="text-gray-400">Agreement Tenure:</p>
                <p className="font-semibold">{agreementTenure} years</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: #000;
          cursor: pointer;
          border-radius: 50%;
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #000;
          cursor: pointer;
          border-radius: 50%;
          border: none;
        }
      `}</style>
    </div>
  );
}