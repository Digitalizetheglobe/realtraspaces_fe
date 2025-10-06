"use client";
import React, { useState } from "react";
import { Building, Phone, ArrowRight, Shield, Mail, Lock } from "lucide-react";
import { toast } from "react-hot-toast";
import PageWithSeo from "../../components/PageWithSeo";

type FormData = {
  email: string;
};

type OtpData = {
  email: string;
  otpCode: string;
};

type FormErrors = {
  email?: string;
  otpCode?: string;
  [key: string]: string | undefined;
};

const SignInPage = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
  });

  const [otpData, setOtpData] = useState<OtpData>({
    email: "",
    otpCode: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({
      ...prev,
      [name]: value,
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

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOtp = () => {
    const newErrors: FormErrors = {};

    if (!otpData.otpCode.trim()) {
      newErrors.otpCode = "OTP is required";
    } else if (!/^\d{6}$/.test(otpData.otpCode)) {
      newErrors.otpCode = "OTP must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/api/webusers/send-login-otp",
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
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateOtp()) return;

    setIsVerifyingOtp(true);

    try {
      const response = await fetch(
        "http://localhost:8000/api/webusers/verify-login-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(otpData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "OTP verification failed");
      }

      if (result.status === "success" && result.data?.token) {
        localStorage.setItem("authToken", result.data.token);
        toast.success("Login successful!");
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
      <PageWithSeo page="signin">
        <div
          className="min-h-screen flex items-center justify-center p-4 md:p-8"
          style={{
            backgroundColor: "#F1F1F4",
            fontFamily: "Raleway, sans-serif",
          }}
        >
          {/* Main Container */}
          <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Side - Visual */}
              <div
                className="hidden lg:block relative p-12 bg-cover bg-center col-span-1"
                style={{
                  backgroundImage: `url('/assets/signin.jpeg')`,
                }}
              >
                <div className="absolute inset-0 bg-black opacity-30 z-0"></div>
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex items-center space-x-3">
                    <Building className="h-8 w-8 text-white" />
                    <span className="text-2xl font-bold text-white">
                      Realtraspaces
                    </span>
                  </div>

                  <div className="space-y-6">
                    <h1 className="text-4xl font-bold text-white leading-tight">
                      Welcome back to your property journey
                    </h1>

                    <p className="text-xl text-white/90">
                      Sign in to access your personalized dashboard and continue
                      exploring premium properties.
                    </p>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-6 h-6 bg-white/20 rounded-sm flex items-center justify-center mt-1">
                          <Building className="h-4 w-4 text-white" />
                        </div>
                        <p className="text-white/90">
                          Access your saved properties
                        </p>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="w-6 h-6 bg-white/20 rounded-sm flex items-center justify-center mt-1">
                          <span className="text-white text-sm">📅</span>
                        </div>
                        <p className="text-white/90">
                          Manage scheduled site visits
                        </p>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="w-6 h-6 bg-white/20 rounded-sm flex items-center justify-center mt-1">
                          <span className="text-white text-sm">👤</span>
                        </div>
                        <p className="text-white/90">
                          Connect with your consultant
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-white/80 text-sm">
                    © 2023 Realtraspaces. All rights reserved.
                  </div>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="p-8 md:p-12">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[#F1F1F4] rounded-xl mb-4">
                    <Shield className="h-8 w-8 text-blue-600" />
                  </div>
                  <h2
                    className="text-3xl font-bold mb-2"
                    style={{ color: "#1A1A1A" }}
                  >
                    {otpSent ? "Verify Your Email" : "Sign In"}
                  </h2>
                  <p className="text-[#6E6E73]">
                    {otpSent 
                      ? "Enter the OTP sent to your email to complete login"
                      : "Access your account with email"
                    }
                  </p>
                </div>

                {!otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-6">
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
                          className={`w-full pl-10 pr-4 py-3 bg-[#F1F1F4] border border-[#E5E5E7] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.email ? "border-red-500" : ""
                          }`}
                          placeholder="Enter your email"
                          style={{ color: "#1A1A1A" }}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="rememberMe"
                          className="w-4 h-4 text-blue-600 border-[#E5E5E7] rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor="rememberMe"
                          className="text-sm"
                          style={{ color: "#6E6E73" }}
                        >
                          Remember me
                        </label>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      {isLoading ? (
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
                          <ArrowRight className="h-5 w-5" />
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
                          className={`w-full pl-10 pr-4 py-3 bg-[#F1F1F4] border border-[#E5E5E7] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.otpCode ? "border-red-500" : ""
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
                          <ArrowRight className="h-5 w-5" />
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
                      ← Back to Email
                    </button>
                  </form>
                )}

                {/* Sign Up Link */}
                <div className="pt-6 border-t border-[#E5E5E7]">
                  <p className="text-center text-sm" style={{ color: "#6E6E73" }}>
                    Don't have an account?{" "}
                    <a
                      href="/signup"
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      Create Account
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWithSeo>
    </>
  );
};

export default SignInPage;
