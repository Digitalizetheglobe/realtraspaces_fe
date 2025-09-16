'use client';

import { useState, useEffect } from 'react';
import SeoHead from "../../components/SeoHead";

export default function IRRCalculator() {
  const [initialInvestment, setInitialInvestment] = useState(100000);
  const [cashFlows, setCashFlows] = useState([20000, 25000, 30000, 35000, 40000]);
  const [results, setResults] = useState({
    irr: 0,
    npv: 0,
    totalCashFlow: 0,
    roi: 0
  });

  // IRR calculation using Newton-Raphson method
  const calculateIRR = (initialInv: number, flows: number[]): number => {
    const maxIterations = 1000;
    const tolerance = 1e-7;
    let rate = 0.1; // Starting guess of 10%

    for (let i = 0; i < maxIterations; i++) {
      let npv = -initialInv;
      let dnpv = 0;

      // Calculate NPV and derivative
      for (let j = 0; j < flows.length; j++) {
        const period = j + 1;
        const factor = Math.pow(1 + rate, period);
        npv += flows[j] / factor;
        dnpv -= (flows[j] * period) / Math.pow(1 + rate, period + 1);
      }

      // Newton-Raphson iteration
      const newRate = rate - npv / dnpv;
      
      if (Math.abs(newRate - rate) < tolerance) {
        return newRate;
      }
      
      rate = newRate;
    }
    
    return rate;
  };

  const calculateNPV = (rate: number, initialInv: number, flows: number[]): number => {
    let npv = -initialInv;
    for (let i = 0; i < flows.length; i++) {
      npv += flows[i] / Math.pow(1 + rate, i + 1);
    }
    return npv;
  };

  const calculateResults = () => {
    const validFlows = cashFlows.filter(flow => flow !== 0);
    
    if (validFlows.length === 0 || initialInvestment <= 0) {
      setResults({
        irr: 0,
        npv: 0,
        totalCashFlow: 0,
        roi: 0
      });
      return;
    }

    const irr = calculateIRR(initialInvestment, validFlows);
    const npv = calculateNPV(irr, initialInvestment, validFlows);
    const totalCashFlow = validFlows.reduce((sum, flow) => sum + flow, 0);
    const roi = ((totalCashFlow - initialInvestment) / initialInvestment) * 100;

    setResults({
      irr: isNaN(irr) ? 0 : irr,
      npv: isNaN(npv) ? 0 : npv,
      totalCashFlow,
      roi: isNaN(roi) ? 0 : roi
    });
  };

  useEffect(() => {
    calculateResults();
  }, [initialInvestment, cashFlows]);

  const handleCashFlowChange = (index: number, value: string | number) => {
    const newCashFlows = [...cashFlows];
    newCashFlows[index] = Number(value) || 0;
    setCashFlows(newCashFlows);
  };

  const addCashFlow = () => {
    if (cashFlows.length < 10) {
      setCashFlows([...cashFlows, 0]);
    }
  };

  const removeCashFlow = (index: number) => {
    if (cashFlows.length > 1) {
      const newCashFlows = cashFlows.filter((_, i) => i !== index);
      setCashFlows(newCashFlows);
    }
  };

  return (
    <div className="max-w-6xl mx-auto my-20 p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          IRR - <span className="font-bold">Internal Rate of Return Calculator</span>
        </h1>
        <p className="text-gray-600">
          Calculate the IRR for your investment project with irregular cash flows
        </p>
       
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side */}
        <div className="bg-white p-6 rounded-lg space-y-8">

          {/* Initial Investment */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Initial Investment</h2>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lg font-semibold text-gray-600">₹</span>
              <input
                type="number"
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(Number(e.target.value) || 0)}
                className="w-full border-2 text-black border-gray-300 rounded-lg pl-8 pr-4 py-3 text-lg font-semibold focus:outline-none focus:border-blue-500"
                placeholder="100000"
                min="0"
              />
            </div>
          </div>

          {/* Cash Flows */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Annual Cash Flows</h2>
              <button
                onClick={addCashFlow}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 border border-blue-600 rounded-lg hover:bg-blue-50"
                disabled={cashFlows.length >= 10}
              >
                + Add Year
              </button>
            </div>
            
            <div className="max-h-48 overflow-y-auto space-y-3">
              {cashFlows.map((flow, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-16 font-medium">
                    Year {index + 1}:
                  </span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm font-semibold text-gray-600">₹</span>
                    <input
                      type="number"
                      value={flow}
                      onChange={(e) => handleCashFlowChange(index, e.target.value)}
                      className="w-full border-2 text-black border-gray-300 rounded-lg pl-8 pr-4 py-2 text-sm font-semibold focus:outline-none focus:border-blue-500"
                      placeholder="Enter cash flow"
                    />
                  </div>
                  {cashFlows.length > 1 && (
                    <button
                      onClick={() => removeCashFlow(index)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium px-2 py-1 border border-red-600 rounded-lg hover:bg-red-50"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Project Summary */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Project Summary
            </h3>
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex justify-between">
                <span>Project Duration:</span>
                <span className="font-semibold">{cashFlows.length} years</span>
              </div>
              <div className="flex justify-between">
                <span>Total Cash Inflows:</span>
                <span className="font-semibold">₹{results.totalCashFlow.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Simple ROI:</span>
                <span className="font-semibold">{results.roi.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="bg-black text-white p-8 rounded-lg">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-4">IRR is</h2>
            <div className="text-4xl font-bold mb-4">{(results.irr * 100).toFixed(2)}%</div>
            <div className="text-sm text-gray-400">
              {results.irr > 0.12 ? 'Potentially Good Investment' : 
               results.irr > 0.08 ? 'Moderate Investment' : 
               'Consider Alternatives'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold mb-2">NPV</h3>
              <div className="text-xl font-bold">
                ₹{Math.abs(results.npv) < 1000 ? 
                  results.npv.toFixed(2) : 
                  results.npv.toLocaleString()}
              </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold mb-2">Simple ROI</h3>
              <div className="text-xl font-bold">{results.roi.toFixed(2)}%</div>
            </div>
          </div>

          {/* Summary */}
          <div className="border-t border-gray-700 pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Initial Investment:</p>
                <p className="font-semibold">₹{initialInvestment.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400">Total Cash Flows:</p>
                <p className="font-semibold">₹{results.totalCashFlow.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400">Project Duration:</p>
                <p className="font-semibold">{cashFlows.length} years</p>
              </div>
              <div>
                <p className="text-gray-400">Investment Status:</p>
                <p className="font-semibold">
                  {results.irr > 0.12 ? 'Good' : 
                   results.irr > 0.08 ? 'Moderate' : 
                   'Consider Alternatives'}
                </p>
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