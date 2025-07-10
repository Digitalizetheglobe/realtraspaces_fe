'use client';

import { useState, useEffect } from 'react';

export default function IRRCalculator() {
  const [principal, setPrincipal] = useState(10000);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(9.85);
  const [interestType, setInterestType] = useState('simple');
  const [results, setResults] = useState({
    totalAmount: 10000,
    monthlyInterest: 0.005,
    yearlyInterest: 0.005
  });

  const calculateInterest = () => {
    let totalAmount;
    let totalInterest;

    if (interestType === 'simple') {
      totalInterest = (principal * rate * years) / 100;
      totalAmount = principal + totalInterest;
    } else {
      totalAmount = principal * Math.pow((1 + rate / 100), years);
      totalInterest = totalAmount - principal;
    }

    const monthlyInterest = totalInterest / (years * 12);
    const yearlyInterest = totalInterest / years;

    setResults({
      totalAmount: Math.round(totalAmount),
      monthlyInterest: Number(monthlyInterest.toFixed(3)),
      yearlyInterest: Number(yearlyInterest.toFixed(3))
    });
  };

  useEffect(() => {
    calculateInterest();
  }, [principal, years, rate, interestType]);

  return (
    <div className="min-h-screen bg-gray-100 p-5 flex items-center justify-center">
      <div className="w-[800px] h-[466px] bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex h-full">
          {/* Left Panel */}
          <div className="w-[400px] h-full p-6 bg-white flex flex-col">
            <h1 className="text-xl font-normal text-gray-800 mb-2">
              IRR - Interest Calculator
            </h1>
            <p className="text-gray-600 text-xs mb-5">
              Figure out your loan amount and monthly repayments with our Calculator
            </p>

            {/* Interest Type */}
            <div className="mb-4">
              <label className="block text-gray-800 font-semibold mb-1 text-sm">
                Choose Interest Type
              </label>
              <select
                value={interestType}
                onChange={(e) => setInterestType(e.target.value)}
                className="w-full p-2 border-2 border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm"
              >
                <option value="simple">Simple Interest</option>
                <option value="compound">Compound Interest</option>
              </select>
            </div>

            {/* Principal */}
            <div className="mb-4">
              <label className="block text-gray-800 font-semibold mb-1 text-sm">
                Principal in Rupees
              </label>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value) || 0)}
                className="w-full p-2 border-2 border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm"
                min="0"
              />
            </div>

            {/* Years */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <label className="text-gray-800 font-semibold text-sm">For</label>
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value) || 1)}
                  className="w-12 p-2 border-2 border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm text-center"
                  min="1"
                  max="50"
                />
                <span className="text-gray-800 text-sm">years</span>
              </div>
              <div className="mb-3">
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>1year</span>
                  <span>50year</span>
                </div>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="mb-4">
              <div className="mb-3">
                <label className="block text-gray-800 font-semibold mb-1 text-sm">
                  Interest rate
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value) || 0)}
                    className="w-16 p-2 border-2 border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm text-center"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                  <span className="text-gray-800 text-sm">%</span>
                </div>
              </div>
              <div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  step="0.01"
                  className="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>8.23%</span>
                  <span>12.35%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-[400px] h-full bg-gray-800 text-white p-6 flex flex-col">
            <div className="mb-6">
              <h2 className="text-sm font-normal mb-3">Total Amount is</h2>
              <div className="text-4xl font-bold mb-4">
                {results.totalAmount.toLocaleString()}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-normal mb-3">Interest</h3>
              <div className="flex gap-4">
                <div className="border-2 border-gray-600 rounded p-3 text-center flex-1">
                  <div className="text-xs mb-1">Monthly</div>
                  <div className="text-base font-bold">
                    {results.monthlyInterest}
                  </div>
                </div>
                <div className="border-2 border-gray-600 rounded p-3 text-center flex-1">
                  <div className="text-xs mb-1">Yearly</div>
                  <div className="text-base font-bold">
                    {results.yearlyInterest}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #374151;
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #374151;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}