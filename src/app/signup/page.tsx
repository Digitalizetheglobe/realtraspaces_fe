"use client";
import React, { useState } from "react";
import {
  Building,
  Phone,
  Mail,
  MapPin,
  User,
  Eye,
  EyeOff,
  Lock,
  Briefcase,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import signupImg from "../../../public/assets/signup.jpg";
import SeoHead from "../../components/SeoHead";
import PageWithSeo from "../../components/PageWithSeo";

type FormData = {
  fullName: string;
  email: string;
  mobileNumber: string;
  location: string;
  company: string;
  password: string;
  mobileOpt: boolean;
};

type FormErrors = {
  fullName?: string;
  email?: string;
  mobileNumber?: string;
  location?: string;
  company?: string;
  password?: string;
  [key: string]: string | undefined;
};

const SignUpPage = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    mobileNumber: "",
    location: "",
    company: "",
    password: "",
    mobileOpt: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: FormData) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev: FormErrors) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.mobileNumber.trim())
      newErrors.mobileNumber = "Mobile number is required";
    else if (!/^\d{10}$/.test(formData.mobileNumber))
      newErrors.mobileNumber = "Mobile number must be 10 digits";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.company.trim()) newErrors.company = "Company is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://api.realtraspaces.com/api/webusers/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }

      if (result.status === "success" && result.data?.token) {
        localStorage.setItem("authToken", result.data.token);
        toast.success("Registration successful!");
        window.location.href = "/";
      } else if (result.data?.token) {
        localStorage.setItem("authToken", result.data.token);
        toast.success("Registration successful!");
        window.location.href = "/";
      } else {
        throw new Error("No authentication token received");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred during registration");
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <PageWithSeo page="signup">
    <div
      className="min-h-screen flex items-center justify-center p-4 md:p-8"
      style={{
        backgroundColor: "#F1F1F4",
        fontFamily: "Raleway, sans-serif",
      }}
    >
      {/* Main Container */}
      <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* Left Side - 1/3 width on large screens */}
          <div
            className="hidden lg:block relative p-12 bg-cover bg-center col-span-1"
            style={{
              backgroundImage: `url(${signupImg.src})`,
            }}
          >
            {/* Black Overlay */}
            <div className="absolute inset-0 bg-black opacity-60 z-0"></div>

            {/* Optional: Pattern overlay */}
            <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-cover opacity-10 z-0"></div>

            {/* Main Content */}
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="flex items-center space-x-3">
                <Building className="h-8 w-8 text-white" />
                <span className="text-2xl font-bold text-white">
                  Realtraspace
                </span>
              </div>

              <div className="space-y-6">
                <h1 className="text-4xl font-bold text-white leading-tight">
                  Take control of your property journey
                </h1>

                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-white/20 rounded-sm flex items-center justify-center mt-1">
                      <Building className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-white/90">Premium property listings</p>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-white/20 rounded-sm flex items-center justify-center mt-1">
                      <span className="text-white text-sm">♥</span>
                    </div>
                    <p className="text-white/90">
                      Personalized recommendations
                    </p>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-white/20 rounded-sm flex items-center justify-center mt-1">
                      <span className="text-white text-sm">★</span>
                    </div>
                    <p className="text-white/90">Exclusive market insights</p>
                  </div>
                </div>
              </div>

              <div className="text-white/80 text-sm">
                © 2023 Realtraspace. All rights reserved.
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="col-span-3 lg:col-span-2 p-8 md:p-12">
            <div className="text-center mb-8">
              <h2
                className="text-3xl font-bold mb-2"
                style={{ color: "#1A1A1A" }}
              >
                Create Account
              </h2>
              <p className="text-[#6E6E73]">
                Join Realtraspace to find your perfect property
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: "#6E6E73" }}
                  >
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#6E6E73]" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 bg-[#F1F1F4] border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.fullName ? "border-red-500" : "border-[#E5E5E7]"
                      }`}
                      placeholder="Enter your full name"
                      style={{ color: "#1A1A1A" }}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: "#6E6E73" }}
                  >
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#6E6E73]" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 bg-[#F1F1F4] border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.email ? "border-red-500" : "border-[#E5E5E7]"
                      }`}
                      placeholder="Enter your email"
                      style={{ color: "#1A1A1A" }}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Mobile Number */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: "#6E6E73" }}
                  >
                    Mobile Number *
                  </label>
                  <div className="flex">
                    <div className="flex items-center bg-[#F1F1F4] border border-r-0 border-[#E5E5E7] rounded-l-lg px-3">
                      <span className="text-2xl mr-2">🇮🇳</span>
                      <span style={{ color: "#6E6E73" }}>+91</span>
                    </div>
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      className={`flex-1 px-4 py-3 bg-[#F1F1F4] border rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.mobileNumber
                          ? "border-red-500"
                          : "border-[#E5E5E7]"
                      }`}
                      placeholder="Enter Mobile Number"
                      style={{ color: "#1A1A1A" }}
                    />
                  </div>
                  {errors.mobileNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.mobileNumber}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: "#6E6E73" }}
                  >
                    Location *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#6E6E73]" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 bg-[#F1F1F4] border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.location ? "border-red-500" : "border-[#E5E5E7]"
                      }`}
                      placeholder="Enter your location"
                      style={{ color: "#1A1A1A" }}
                    />
                  </div>
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.location}
                    </p>
                  )}
                </div>
              </div>

              {/* Company */}
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: "#6E6E73" }}
                >
                  Company *
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#6E6E73]" />
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 bg-[#F1F1F4] border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.company ? "border-red-500" : "border-[#E5E5E7]"
                    }`}
                    placeholder="Enter your company name"
                    style={{ color: "#1A1A1A" }}
                  />
                </div>
                {errors.company && (
                  <p className="text-red-500 text-sm mt-1">{errors.company}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: "#6E6E73" }}
                >
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#6E6E73]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-10 py-3 bg-[#F1F1F4] border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.password ? "border-red-500" : "border-[#E5E5E7]"
                    }`}
                    placeholder="Enter your password"
                    style={{ color: "#1A1A1A" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6E6E73] hover:text-[#1A1A1A]"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Checkbox */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="mobileOpt"
                  id="mobileOpt"
                  checked={formData.mobileOpt}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-[#E5E5E7] rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="mobileOpt"
                  className="text-sm"
                  style={{ color: "#6E6E73" }}
                >
                  I agree to receive SMS updates and promotional offers
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <span>→</span>
                  </>
                )}
              </button>

              {/* Login Link */}
              <p className="text-center text-sm" style={{ color: "#6E6E73" }}>
                Already have an account?{" "}
                <a
                  href="/signin"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Sign In Here
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
    </PageWithSeo>
    </>
  );
};

export default SignUpPage;
