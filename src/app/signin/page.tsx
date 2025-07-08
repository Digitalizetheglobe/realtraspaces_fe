"use client";
import React, { useState } from 'react';
import { Building, Phone, ArrowRight, Shield } from 'lucide-react';

const SignInPage = () => {
  const [formData, setFormData] = useState({
    mobile: '',
    otp: ''
  });
  
  const [step, setStep] = useState(1); // 1: Enter mobile, 2: Enter OTP
  const [errors, setErrors] = useState<{ mobile?: string; otp?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateMobile = () => {
    const newErrors: { mobile?: string } = {};
    
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be 10 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOTP = () => {
    const newErrors: { otp?: string } = {};
    
    if (!formData.otp.trim()) {
      newErrors.otp = 'OTP is required';
    } else if (!/^\d{6}$/.test(formData.otp)) {
      newErrors.otp = 'OTP must be 6 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = async () => {
    if (validateMobile()) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        setOtpSent(true);
        setStep(2);
        console.log('OTP sent to:', formData.mobile);
      }, 1500);
    }
  };

  const handleVerifyOTP = async () => {
    if (validateOTP()) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        console.log('Login successful:', formData);
        alert('Login successful!');
        // Redirect to dashboard
      }, 1500);
    }
  };

  const handleResendOTP = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('OTP resent successfully!');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      {/* Background City Silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/30 to-transparent pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-r from-transparent via-black/20 to-transparent"></div>
      </div>
      
      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side - Content */}
        <div className="text-white space-y-8 px-4">
          <div className="flex items-center space-x-3">
            <Building className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold">Realtraspace</span>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              Welcome back to your property journey
            </h1>
            
            <p className="text-xl text-gray-300">
              Sign in to access your personalized dashboard and continue exploring premium properties.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 bg-blue-500 rounded-sm flex items-center justify-center mt-1">
                  <Building className="h-4 w-4 text-white" />
                </div>
                <p className="text-gray-300">Access your saved properties and shortlisted options</p>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 bg-blue-500 rounded-sm flex items-center justify-center mt-1">
                  <span className="text-white text-sm">📅</span>
                </div>
                <p className="text-gray-300">Manage your scheduled site visits and meetings</p>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 bg-blue-500 rounded-sm flex items-center justify-center mt-1">
                  <span className="text-white text-sm">👤</span>
                </div>
                <p className="text-gray-300">Connect with your assigned property consultant</p>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 bg-blue-500 rounded-sm flex items-center justify-center mt-1">
                  <span className="text-white text-sm">🔔</span>
                </div>
                <p className="text-gray-300">Get personalized property recommendations</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Side - Sign In Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mx-4 lg:mx-0">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              {step === 1 ? (
                <Phone className="h-8 w-8 text-blue-600" />
              ) : (
                <Shield className="h-8 w-8 text-blue-600" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {step === 1 ? 'Sign In' : 'Verify OTP'}
            </h2>
            <p className="text-gray-600 mt-2">
              {step === 1 
                ? 'Enter your mobile number to continue' 
                : `OTP sent to +91-${formData.mobile}`
              }
            </p>
          </div>
          
          <div className="space-y-6">
            {step === 1 ? (
              // Step 1: Mobile Number Input
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <div className="flex">
                    <div className="flex items-center bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg px-3">
                      <span className="text-2xl mr-2">🇮🇳</span>
                      <span className="text-gray-700">+91</span>
                    </div>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      className={`flex-1 px-4 py-3 border rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.mobile ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter Mobile Number"
                      maxLength={10}
                    />
                  </div>
                  {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
                </div>
                
                <button
                  onClick={handleSendOTP}
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Send OTP</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </>
            ) : (
              // Step 2: OTP Input
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter 6-digit OTP
                  </label>
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-2xl tracking-widest ${
                      errors.otp ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="000000"
                    maxLength={6}
                  />
                  {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
                </div>
                
                <button
                  onClick={handleVerifyOTP}
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify & Sign In</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
                
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">
                    Didn't receive the OTP?
                  </p>
                  <button
                    onClick={handleResendOTP}
                    disabled={isLoading}
                    className="text-blue-600 hover:text-blue-700 font-semibold text-sm disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                </div>
                
                <button
                  onClick={() => {
                    setStep(1);
                    setFormData({ mobile: '', otp: '' });
                    setErrors({});
                  }}
                  className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
                >
                  Change Mobile Number
                </button>
              </>
            )}
            
            {/* Sign Up Link */}
            <div className="pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <a href="/signup" className="text-blue-600 hover:underline font-semibold">
                  Create Account
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;