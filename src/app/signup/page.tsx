"use client";
import React, { useState } from "react";
import Link from "next/link";
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
  mobileOpt: boolean;
};

type OtpData = {
  email: string;
  otpCode: string;
};

type FormErrors = {
  fullName?: string;
  email?: string;
  mobileNumber?: string;
  location?: string;
  company?: string;
  otpCode?: string;
  [key: string]: string | undefined;
};

const SignUpPage = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    mobileNumber: "",
    location: "",
    company: "",
    mobileOpt: false,
  });

  const [otpData, setOtpData] = useState<OtpData>({
    email: "",
    otpCode: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [registrationTermsAccepted, setRegistrationTermsAccepted] = useState(false);
  const [verifyTermsAccepted, setVerifyTermsAccepted] = useState(false);

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

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOtpData((prev: OtpData) => ({
      ...prev,
      [name]: value,
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
    if (!registrationTermsAccepted) {
      newErrors.registrationTerms = "You must accept the terms to continue";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOtp = () => {
    const newErrors: FormErrors = {};

    if (!otpData.otpCode.trim()) newErrors.otpCode = "OTP is required";
    else if (!/^\d{6}$/.test(otpData.otpCode))
      newErrors.otpCode = "OTP must be 6 digits";
    if (!verifyTermsAccepted) {
      newErrors.verifyTerms = "You must accept the terms to continue";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "http://localhost:8000/api/webusers/send-registration-otp",
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
        throw new Error(result.message || "Failed to send OTP");
      }

      if (result.status === "success") {
        setOtpData({ ...otpData, email: formData.email });
        setOtpSent(true);
        toast.success("OTP sent to your email!");
      } else {
        throw new Error(result.message || "Failed to send OTP");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred while sending OTP");
      console.error("Send OTP error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateOtp()) return;

    setIsVerifyingOtp(true);

    try {
      const response = await fetch(
        "http://localhost:8000/api/webusers/verify-registration-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...otpData,
            ...formData,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "OTP verification failed");
      }

      if (result.status === "success" && result.data?.token) {
        localStorage.setItem("authToken", result.data.token);
        toast.success("Registration successful!");
        window.location.href = "/";
      } else {
        throw new Error("No authentication token received");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred during OTP verification");
      console.error("Verify OTP error:", error);
    } finally {
      setIsVerifyingOtp(false);
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

                {/* Main Content */}
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex items-center space-x-3">
                    <Building className="h-8 w-8 text-white" />
                    <span className="text-2xl font-bold text-white">
                      Realtraspaces
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
                    © 2023 Realtraspaces. All rights reserved.
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
                    {otpSent ? "Verify Your Email" : "Create Account"}
                  </h2>
                  <p className="text-[#6E6E73]">
                    {otpSent
                      ? "Enter the OTP sent to your email to complete registration"
                      : "Join Realtraspaces to find your perfect property"
                    }
                  </p>
                </div>

                {!otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-6">
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
                            className={`w-full pl-10 pr-4 py-3 bg-[#F1F1F4] border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.fullName ? "border-red-500" : "border-[#E5E5E7]"
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
                            className={`w-full pl-10 pr-4 py-3 bg-[#F1F1F4] border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? "border-red-500" : "border-[#E5E5E7]"
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
                            className={`flex-1 px-4 py-3 bg-[#F1F1F4] border rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.mobileNumber
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
                            className={`w-full pl-10 pr-4 py-3 bg-[#F1F1F4] border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.location ? "border-red-500" : "border-[#E5E5E7]"
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
                          className={`w-full pl-10 pr-4 py-3 bg-[#F1F1F4] border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.company ? "border-red-500" : "border-[#E5E5E7]"
                            }`}
                          placeholder="Enter your company name"
                          style={{ color: "#1A1A1A" }}
                        />
                      </div>
                      {errors.company && (
                        <p className="text-red-500 text-sm mt-1">{errors.company}</p>
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Terms & Conditions *
                      </label>
                      <div className="flex items-start space-x-2">
                        <input
                          type="checkbox"
                          id="signupTerms"
                          checked={registrationTermsAccepted}
                          onChange={(e) => {
                            setRegistrationTermsAccepted(e.target.checked);
                            if (errors.registrationTerms) {
                              setErrors((prev) => ({ ...prev, registrationTerms: "" }));
                            }
                          }}
                          className="w-4 h-4 mt-1 text-blue-600 border-[#E5E5E7] rounded focus:ring-blue-500"
                        />
                        <p className="text-sm" style={{ color: "#6E6E73" }}>
                          I agree to the{" "}
                          <Link href="/terms-and-condition" className="text-blue-600 hover:underline">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                            Privacy Policy
                          </Link>
                          .
                        </p>
                      </div>
                      {errors.registrationTerms && (
                        <p className="text-red-500 text-sm mt-1">{errors.registrationTerms}</p>
                      )}
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
                          <span>Sending OTP...</span>
                        </>
                      ) : (
                        <>
                          <span>Send OTP</span>
                          <span>→</span>
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-6">
                    {/* OTP Input */}
                    <div>
                      <label
                        className="block text-sm font-medium mb-1"
                        style={{ color: "#6E6E73" }}
                      >
                        Enter OTP *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#6E6E73]" />
                        <input
                          type="text"
                          name="otpCode"
                          value={otpData.otpCode}
                          onChange={handleOtpChange}
                          className={`w-full pl-10 pr-4 py-3 bg-[#F1F1F4] border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.otpCode ? "border-red-500" : "border-[#E5E5E7]"
                            }`}
                          placeholder="Enter 6-digit OTP"
                          style={{ color: "#1A1A1A" }}
                          maxLength={6}
                        />
                      </div>
                      {errors.otpCode && (
                        <p className="text-red-500 text-sm mt-1">{errors.otpCode}</p>
                      )}
                      <p className="text-sm text-[#6E6E73] mt-2">
                        We've sent a 6-digit OTP to {otpData.email}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Terms & Conditions *
                      </label>
                      <div className="flex items-start space-x-2">
                        <input
                          type="checkbox"
                          id="verifySignupTerms"
                          checked={verifyTermsAccepted}
                          onChange={(e) => {
                            setVerifyTermsAccepted(e.target.checked);
                            if (errors.verifyTerms) {
                              setErrors((prev) => ({ ...prev, verifyTerms: "" }));
                            }
                          }}
                          className="w-4 h-4 mt-1 text-blue-600 border-[#E5E5E7] rounded focus:ring-blue-500"
                        />
                        <p className="text-sm" style={{ color: "#6E6E73" }}>
                          I agree to the{" "}
                          <Link href="/terms-and-condition" className="text-blue-600 hover:underline">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy-policy" className="text-blue-600 hover:underline">
                            Privacy Policy
                          </Link>
                          .
                        </p>
                      </div>
                      {errors.verifyTerms && (
                        <p className="text-red-500 text-sm mt-1">{errors.verifyTerms}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isVerifyingOtp}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      {isVerifyingOtp ? (
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
                          <span>Verifying OTP...</span>
                        </>
                      ) : (
                        <>
                          <span>Verify OTP</span>
                          <span>→</span>
                        </>
                      )}
                    </button>

                    {/* Back Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtpData({ email: "", otpCode: "" });
                        setErrors({});
                      }}
                      className="w-full bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-200"
                    >
                      ← Back to Form
                    </button>
                  </form>
                )}

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
              </div>
            </div>
          </div>
        </div>
      </PageWithSeo>
    </>
  );
};

export default SignUpPage;
