"use client";
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function EmiCalculator() {
  const [loanAmount, setLoanAmount] = useState(10000);
  const [interestRate, setInterestRate] = useState(9.85);
  const [loanTerm, setLoanTerm] = useState(20);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [yearlyPayment, setYearlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  interface ChartDataPoint {
    year: string;
    remainingPrincipal: number;
    totalPaid: number;
  }

  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    calculateEMI();
  }, [loanAmount, interestRate, loanTerm]);

  const calculateEMI = () => {
    // Convert annual interest rate to monthly and percentage to decimal
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    // Handle edge cases
    if (loanAmount <= 0 || interestRate <= 0 || loanTerm <= 0) {
      setMonthlyPayment(0);
      setYearlyPayment(0);
      setTotalPayment(0);
      setChartData([]);
      return;
    }

    // Calculate EMI using the standard formula
    const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    // Calculate total payment
    const total = emi * numberOfPayments;

    setMonthlyPayment(emi || 0);
    setYearlyPayment(emi * 12 || 0);
    setTotalPayment(total || 0);

    // Generate chart data - both lines connected to EMI calculations
    const data: ChartDataPoint[] = [];
    let remainingPrincipal = loanAmount;
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

  const handleLoanTermChange = (term: number) => {
    setLoanTerm(term);
  };

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
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(parseFloat(e.target.value) || 0)}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg font-semibold focus:outline-none focus:border-blue-500"
              placeholder="10000"
            />
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
            <div className="text-6xl font-bold mb-8">{Math.round(totalPayment)}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold mb-2">Monthly</h3>
              <div className="text-2xl font-bold">{monthlyPayment.toFixed(3)}</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold mb-2">Yearly</h3>
              <div className="text-2xl font-bold">{yearlyPayment.toFixed(3)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      {/* <div className="mt-8 bg-white p-6 rounded-lg">
        <div className="h-96">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 80, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="year" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  domain={[0, 'dataMax + 10']}
                  tickFormatter={(value) => `${value} Lacs`}
                  label={{ 
                    value: 'Loan paid (in ₹)', 
                    angle: -90, 
                    position: 'insideLeft', 
                    style: { textAnchor: 'middle', fontSize: '12px', fill: '#6b7280' } 
                  }}
                />
              
                <Line 
                  type="monotone" 
                  dataKey="remainingPrincipal" 
                  stroke="#60a5fa" 
                  strokeWidth={3}
                  dot={{ fill: '#60a5fa', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 8, fill: '#60a5fa', stroke: '#fff', strokeWidth: 2 }}
                  name="Remaining Principal"
                />
                
                <Line 
                  type="monotone" 
                  dataKey="totalPaid" 
                  stroke="#1e40af" 
                  strokeWidth={3}
                  dot={{ fill: '#1e40af', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 8, fill: '#1e40af', stroke: '#fff', strokeWidth: 2 }}
                  name="Total Paid"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Loading chart...</p>
            </div>
          )}
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">Years Elapsed</p>
        </div>
        
     
        <div className="mt-4 flex justify-center space-x-8">
          <div className="flex items-center">
            <div className="w-4 h-0.5 bg-blue-400 mr-2"></div>
            <span className="text-sm text-gray-600">Remaining Principal</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-0.5 bg-blue-800 mr-2"></div>
            <span className="text-sm text-gray-600">Total Paid</span>
          </div>
        </div>
      </div> */}

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