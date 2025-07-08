"use client";
import React, { useState } from 'react';
import { Building, Phone, Mail, MapPin, User } from 'lucide-react';

type FormData = {
  name: string;
  email: string;
  mobile: string;
  location: string;
  mobileOpt: boolean;
};

type FormErrors = {
  name?: string;
  email?: string;
  mobile?: string;
  location?: string;
  [key: string]: string | undefined;
};

const SignUpPage = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    mobile: '',
    location: '',
    mobileOpt: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

interface InputChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

const handleInputChange = (e: InputChangeEvent) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: FormData) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
        setErrors((prev: FormErrors) => ({ ...prev, [name]: '' }));
    }
};

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    else if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'Mobile number must be 10 digits';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

interface SubmitEvent extends React.FormEvent<HTMLFormElement> {}

const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    if (validateForm()) {
        console.log('Form submitted:', formData);
        // Handle form submission here - send OTP to mobile
        alert('OTP sent to your mobile number!');
    }
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
              Take control of the service experience during your property search & ownership journey
            </h1>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 bg-blue-500 rounded-sm flex items-center justify-center mt-1">
                  <Building className="h-4 w-4 text-white" />
                </div>
                <p className="text-gray-300">Provide more information about your property needs</p>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 bg-blue-500 rounded-sm flex items-center justify-center mt-1">
                  <span className="text-white text-sm">♥</span>
                </div>
                <p className="text-gray-300">Shortlist more properties for site visits & evaluation</p>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 bg-blue-500 rounded-sm flex items-center justify-center mt-1">
                  <span className="text-white text-sm">★</span>
                </div>
                <p className="text-gray-300">Rate your experience with us and give feedback</p>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 bg-blue-500 rounded-sm flex items-center justify-center mt-1">
                  <User className="h-4 w-4 text-white" />
                </div>
                <p className="text-gray-300">View assigned sales expert's profile & request for change if required</p>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 bg-blue-500 rounded-sm flex items-center justify-center mt-1">
                  <span className="text-white text-sm">📅</span>
                </div>
                <p className="text-gray-300">Manage your meetings/site visits schedule</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Side - Sign Up Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mx-4 lg:mx-0">
          <div className="text-center mb-8">
            {/* <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Building className="h-8 w-8 text-blue-600" />
            </div> */}
            <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-600 mt-2">Join Realtraspace to find your perfect property</p>
          </div>
          
          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            
            {/* Mobile Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number *
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
                />
              </div>
              {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
            </div>
            
            {/* Location Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your location"
                />
              </div>
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>
            
            {/* Mobile Opt Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="mobileOpt"
                id="mobileOpt"
                checked={formData.mobileOpt}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="mobileOpt" className="text-sm text-gray-700">
                I agree to receive SMS updates and promotional offers
              </label>
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <span>Send OTP</span>
              <span>→</span>
            </button>
            
            {/* Login Link */}
            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{' '}
              <a href="/signin" className="text-blue-600 hover:underline font-semibold">
                Sign In Here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;