"use client";
import React, { useState } from 'react';
import { Building, Phone, ArrowRight, Shield, Mail } from 'lucide-react';
import { toast } from 'react-hot-toast';
const SignInPage = () => {
  const [formData, setFormData] = useState({
    mobileNumber: '',
    password: ''
  });
  
  const [errors, setErrors] = useState<{ mobileNumber?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

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

  const validateForm = () => {
    const newErrors: { mobileNumber?: string; password?: string } = {};
    
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Mobile number must be 10 digits';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/webusers/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobileNumber: formData.mobileNumber,
          password: formData.password
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      if (result.data?.token) {
        localStorage.setItem('authToken', result.data.token);
        toast.success('Login successful!');
        // Redirect to dashboard or home page
        window.location.href = '/';
      } else {
        throw new Error('No authentication token received');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during login');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 md:p-8"
      style={{ 
        backgroundColor: '#F1F1F4',
        fontFamily: 'Raleway, sans-serif'
      }}
    >
      {/* Main Container */}
      <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Side - Visual */}
         
<div
  className="hidden lg:block relative p-12 bg-cover bg-center col-span-1"
  style={{
    backgroundImage: `url('/assets/signin.jpeg')`
  }}
>
            <div className="absolute inset-0 bg-black opacity-30 z-0"></div>
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="flex items-center space-x-3">
                <Building className="h-8 w-8 text-white" />
                <span className="text-2xl font-bold text-white">Realtraspace</span>
              </div>
              
              <div className="space-y-6">
                <h1 className="text-4xl font-bold text-white leading-tight">
                  Welcome back to your property journey
                </h1>
                
                <p className="text-xl text-white/90">
                  Sign in to access your personalized dashboard and continue exploring premium properties.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-white/20 rounded-sm flex items-center justify-center mt-1">
                      <Building className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-white/90">Access your saved properties</p>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-white/20 rounded-sm flex items-center justify-center mt-1">
                      <span className="text-white text-sm">📅</span>
                    </div>
                    <p className="text-white/90">Manage scheduled site visits</p>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-white/20 rounded-sm flex items-center justify-center mt-1">
                      <span className="text-white text-sm">👤</span>
                    </div>
                    <p className="text-white/90">Connect with your consultant</p>
                  </div>
                </div>
              </div>
              
              <div className="text-white/80 text-sm">
                © 2023 Realtraspace. All rights reserved.
              </div>
            </div>
          </div>
          
          {/* Right Side - Form */}
          <div className="p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#F1F1F4] rounded-xl mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold mb-2" style={{ color: '#1A1A1A' }}>Sign In</h2>
              <p className="text-[#6E6E73]">Access your account with mobile number</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Mobile Number */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#6E6E73' }}>
                  Mobile Number *
                </label>
                <div className="flex">
                  <div className="flex items-center bg-[#F1F1F4] border border-r-0 border-[#E5E5E7] rounded-l-lg px-3">
                    <span className="text-2xl mr-2">🇮🇳</span>
                    <span style={{ color: '#6E6E73' }}>+91</span>
                  </div>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    className={`flex-1 px-4 py-3 bg-[#F1F1F4] border border-[#E5E5E7] rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.mobileNumber ? 'border-red-500' : ''
                    }`}
                    placeholder="Enter Mobile Number"
                    style={{ color: '#1A1A1A' }}
                    maxLength={10}
                  />
                </div>
                {errors.mobileNumber && <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>}
              </div>
              
              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#6E6E73' }}>
                  Password *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#6E6E73]" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 bg-[#F1F1F4] border border-[#E5E5E7] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.password ? 'border-red-500' : ''
                    }`}
                    placeholder="Enter your password"
                    style={{ color: '#1A1A1A' }}
                  />
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>
              
              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    className="w-4 h-4 text-blue-600 border-[#E5E5E7] rounded focus:ring-blue-500"
                  />
                  <label htmlFor="rememberMe" className="text-sm" style={{ color: '#6E6E73' }}>
                    Remember me
                  </label>
                </div>
                {/* <a href="/forgot-password" className="text-sm text-blue-600 hover:underline font-semibold">
                  Forgot password?
                </a> */}
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
              
              {/* Sign Up Link */}
              <div className="pt-6 border-t border-[#E5E5E7]">
                <p className="text-center text-sm" style={{ color: '#6E6E73' }}>
                  Don't have an account?{' '}
                  <a href="/signup" className="text-blue-600 hover:underline font-semibold">
                    Create Account
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;