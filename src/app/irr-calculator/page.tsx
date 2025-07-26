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
    <div className="min-h-screen bg-gray-50 p-2 sm:p-5 flex items-center justify-center">
      <div className="w-full max-w-2xl md:max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row h-full">
          {/* Left Panel */}
          <div className="w-full md:w-1/2 p-4 sm:p-6 bg-white flex flex-col">
            <h1 className="text-lg sm:text-xl font-normal text-gray-800 mb-2">
              IRR - Internal Rate of Return Calculator
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm mb-5">
              Calculate the IRR for your investment project with irregular cash flows
            </p>

            {/* Initial Investment */}
            <div className="mb-4">
              <label className="block text-gray-800 font-semibold mb-1 text-xs sm:text-sm">
                Initial Investment (₹)
              </label>
              <input
                type="number"
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(Number(e.target.value) || 0)}
                className="w-full p-2 border-2 border-gray-300 rounded focus:border-blue-500 focus:outline-none text-xs sm:text-sm"
                min="0"
                placeholder="Enter initial investment"
              />
            </div>

            {/* Cash Flows */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-800 font-semibold text-xs sm:text-sm">
                  Annual Cash Flows (₹)
                </label>
                <button
                  onClick={addCashFlow}
                  className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium"
                  disabled={cashFlows.length >= 10}
                >
                  + Add Year
                </button>
              </div>
              
              <div className="max-h-48 overflow-y-auto space-y-2">
                {cashFlows.map((flow, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm text-gray-600 w-12">
                      Year {index + 1}:
                    </span>
                    <input
                      type="number"
                      value={flow}
                      onChange={(e) => handleCashFlowChange(index, e.target.value)}
                      className="flex-1 p-2 border-2 border-gray-300 rounded focus:border-blue-500 focus:outline-none text-xs sm:text-sm"
                      placeholder="Enter cash flow"
                    />
                    {cashFlows.length > 1 && (
                      <button
                        onClick={() => removeCashFlow(index)}
                        className="text-red-600 hover:text-red-800 text-xs sm:text-sm font-medium px-2"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Project Summary */}
            <div className="mb-4 p-3 bg-gray-50 rounded">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-800 mb-2">
                Project Summary
              </h3>
              <div className="text-xs text-gray-600 space-y-1">
                <div>Project Duration: {cashFlows.length} years</div>
                <div>Total Cash Inflows: ₹{results.totalCashFlow.toLocaleString()}</div>
                <div>Simple ROI: {results.roi.toFixed(2)}%</div>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-full md:w-1/2 bg-gray-800 text-white p-4 sm:p-6 flex flex-col justify-center">
            <div className="mb-6">
              <h2 className="text-xs sm:text-sm font-normal mb-3">Internal Rate of Return (IRR)</h2>
              <div className="text-3xl sm:text-4xl font-bold mb-2">
                {(results.irr * 100).toFixed(2)}%
              </div>
              <p className="text-xs text-gray-300">
                {results.irr > 0.12 ? 'Potentially Good Investment' : 
                 results.irr > 0.08 ? 'Moderate Investment' : 
                 'Consider Alternatives'}
              </p>
            </div>

            <div>
              <h3 className="text-xs sm:text-sm font-normal mb-3">Additional Metrics</h3>
              <div className="space-y-3">
                <div className="border-2 border-gray-600 rounded p-3">
                  <div className="text-xs mb-1">Net Present Value (NPV)</div>
                  <div className="text-base font-bold">
                    ₹{Math.abs(results.npv) < 1000 ? 
                      results.npv.toFixed(2) : 
                      results.npv.toLocaleString()}
                  </div>
                </div>
                
                <div className="border-2 border-gray-600 rounded p-3">
                  <div className="text-xs mb-1">Total Cash Flows</div>
                  <div className="text-base font-bold">
                    ₹{results.totalCashFlow.toLocaleString()}
                  </div>
                </div>
                
                <div className="border-2 border-gray-600 rounded p-3">
                  <div className="text-xs mb-1">Simple ROI</div>
                  <div className="text-base font-bold">
                    {results.roi.toFixed(2)}%
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
    </div>
  );
}