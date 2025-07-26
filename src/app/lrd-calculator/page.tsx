"use client";
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import SeoHead from "../../components/SeoHead";

export default function EmiCalculator() {
  const [loanAmount, setLoanAmount] = useState(10000);
  const [downPayment, setDownPayment] = useState(0);
  const [interestRate, setInterestRate] = useState(9.85);
  const [loanTerm, setLoanTerm] = useState(20);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [yearlyPayment, setYearlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  
  interface ChartDataPoint {
    year: string;
    remainingPrincipal: number;
    totalPaid: number;
  }

  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    calculateEMI();
  }, [loanAmount, downPayment, interestRate, loanTerm]);

  const calculateEMI = () => {
    // Calculate actual loan amount after down payment
    const actualLoanAmount = Math.max(0, loanAmount - downPayment);
    
    // Convert annual interest rate to monthly and percentage to decimal
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    // Handle edge cases
    if (actualLoanAmount <= 0 || interestRate <= 0 || loanTerm <= 0) {
      setMonthlyPayment(0);
      setYearlyPayment(0);
      setTotalPayment(0);
      setTotalInterest(0);
      setChartData([]);
      return;
    }

    // Calculate EMI using the standard formula
    const emi = (actualLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    // Calculate total payment
    const total = emi * numberOfPayments;
    const totalInt = total - actualLoanAmount;

    setMonthlyPayment(emi || 0);
    setYearlyPayment(emi * 12 || 0);
    setTotalPayment(total || 0);
    setTotalInterest(totalInt || 0);

    // Generate chart data - both lines connected to EMI calculations
    const data: ChartDataPoint[] = [];
    let remainingPrincipal = actualLoanAmount;
    let totalPaidSoFar = 0;
    
    // Starting point (Year 0)
    data.push({
      year: 'Yr 0',
      remainingPrincipal: remainingPrincipal / 100000, // Convert to Lacs
      totalPaid: 0
    });
    
    // Calculate year by year progression
    const yearsToShow = Math.min(loanTerm, 10);
    
    for (let year = 1; year <= yearsToShow; year++) {
      // Calculate 12 monthly EMI payments for this year
      for (let month = 1; month <= 12; month++) {
        if (remainingPrincipal <= 0) break;
        
        // Monthly interest on remaining principal
        const monthlyInterest = remainingPrincipal * monthlyRate;
        
        // Monthly principal payment (EMI - interest)
        const monthlyPrincipal = Math.min(emi - monthlyInterest, remainingPrincipal);
        
        // Update balances
        remainingPrincipal -= monthlyPrincipal;
        totalPaidSoFar += emi;
        
        if (remainingPrincipal <= 0) break;
      }
      
      // Add year data point
      data.push({
        year: year === yearsToShow ? 'Yr ...' : `Yr ${year}`,
        remainingPrincipal: Math.max(0, remainingPrincipal / 100000), // Light blue line (decreasing)
        totalPaid: totalPaidSoFar / 100000 // Dark blue line (increasing)
      });
      
      if (remainingPrincipal <= 0) break;
    }
    
    setChartData(data);
  };

  const formatAmount = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatAmountShort = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(2)}K`;
    } else {
      return `₹${amount.toFixed(0)}`;
    }
  };

  const maxDownPayment = Math.max(0, loanAmount * 0.8); // Max 80% of loan amount

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Loan Against Rental Receivables - <span className="font-bold">EMI Calculator</span>
        </h1>
        <p className="text-gray-600">
          Figure out your loan amount and monthly repayments with our Calculator
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side */}
        <div className="bg-white p-6 rounded-lg space-y-8">
          {/* Loan Amount */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Enter the Price</h2>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lg font-semibold text-gray-600">₹</span>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(parseFloat(e.target.value) || 0)}
                className="w-full border-2 text-black border-gray-300 rounded-lg pl-8 pr-4 py-3 text-lg font-semibold focus:outline-none focus:border-blue-500"
                placeholder="10000"
              />
            </div>
          </div>

          {/* Down Payment */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Down Payment</h2>
            <div className="relative mb-4">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lg font-semibold text-gray-600">₹</span>
              <input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(Math.min(parseFloat(e.target.value) || 0, maxDownPayment))}
                className="w-full border-2 text-black border-gray-300 rounded-lg pl-8 pr-4 py-3 text-lg font-semibold focus:outline-none focus:border-blue-500"
                placeholder="0"
                max={maxDownPayment}
              />
            </div>
            
            {/* Down Payment Slider */}
            <div className="relative">
              <input
                type="range"
                min="0"
                max={maxDownPayment}
                value={downPayment}
                onChange={(e) => setDownPayment(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #000 0%, #000 ${(downPayment / maxDownPayment) * 100}%, #e5e7eb ${(downPayment / maxDownPayment) * 100}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>₹0</span>
                <span>{formatAmountShort(maxDownPayment)}</span>
              </div>
            </div>
            
            {/* Loan Amount After Down Payment */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Loan Amount After Down Payment:</p>
              <p className="text-lg font-semibold text-blue-600">{formatAmount(Math.max(0, loanAmount - downPayment))}</p>
            </div>
          </div>

          {/* Loan Term */}
          <div>
            <div className="flex items-center mb-6">
              <span className="text-lg text-gray-700 mr-4">For</span>
              <input
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(parseFloat(e.target.value) || 0)}
                className="w-16 border-2 border-gray-300 rounded px-3 py-2 text-center font-semibold focus:outline-none focus:border-blue-500"
              />
              <span className="text-lg text-gray-700 ml-4">years</span>
            </div>

            {/* Slider */}
            <div className="relative">
              <input
                type="range"
                min="1"
                max="50"
                value={loanTerm}
                onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #000 0%, #000 ${((loanTerm - 1) / 49) * 100}%, #e5e7eb ${((loanTerm - 1) / 49) * 100}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>1year</span>
                <span>50year</span>
              </div>
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex items-center mb-6">
              <span className="text-lg text-gray-700 mr-4">Interest rate</span>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                step="0.01"
                className="w-20 border-2 border-gray-300 rounded px-3 py-2 text-center font-semibold focus:outline-none focus:border-blue-500"
              />
              <span className="text-lg text-gray-700 ml-2">%</span>
            </div>

            {/* Interest Rate Slider */}
            <div className="relative">
              <input
                type="range"
                min="6.23"
                max="12.35"
                step="0.01"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #000 0%, #000 ${((interestRate - 6.23) / (12.35 - 6.23)) * 100}%, #e5e7eb ${((interestRate - 6.23) / (12.35 - 6.23)) * 100}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>6.23%</span>
                <span>12.35%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="bg-black text-white p-8 rounded-lg">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-4">Total Payment is</h2>
            <div className="text-4xl font-bold mb-4">{formatAmount(Math.round(totalPayment))}</div>
            <div className="text-sm text-gray-400">
              Total Interest: {formatAmount(Math.round(totalInterest))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold mb-2">Monthly EMI</h3>
              <div className="text-xl font-bold">{formatAmount(Math.round(monthlyPayment))}</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold mb-2">Yearly</h3>
              <div className="text-xl font-bold">{formatAmount(Math.round(yearlyPayment))}</div>
            </div>
          </div>

          {/* Summary */}
          <div className="border-t border-gray-700 pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Property Price:</p>
                <p className="font-semibold">{formatAmount(loanAmount)}</p>
              </div>
              <div>
                <p className="text-gray-400">Down Payment:</p>
                <p className="font-semibold">{formatAmount(downPayment)}</p>
              </div>
              <div>
                <p className="text-gray-400">Loan Amount:</p>
                <p className="font-semibold">{formatAmount(Math.max(0, loanAmount - downPayment))}</p>
              </div>
              <div>
                <p className="text-gray-400">Interest Rate:</p>
                <p className="font-semibold">{interestRate}%</p>
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