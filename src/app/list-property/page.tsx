"use client"
import { useState } from "react";
import { Camera, MapPin, DollarSign, Home, Phone, Mail, Upload, Check, AlertCircle, Building2, FileText } from "lucide-react";

export default function ListPropertyPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    propertyName: "",
    location: "",
    propertyType: "",
    transactionType: "",
    areaCarpet: "",
    areaBuiltup: "",
    rent: "",
    price: "",
    contactName: "",
    contactNumber: "",
    emailAddress: "",
    description: "",
    image: null as File | null,
  });

  const propertyTypes = ["Office", "Retail", "Coworking", "Industrial or warehouse", "Land", "Others"];
  const transactionTypes = ["Lease", "Sale", "BOTH", "Preleased"];

  function validateForm() {
    const newErrors: any = {};
    if (!form.propertyType) newErrors.propertyType = "Property type is required";
    if (!form.transactionType) newErrors.transactionType = "Transaction type is required";
    if (!form.areaCarpet.trim()) newErrors.areaCarpet = "Area Carpet is required";
    if (!form.areaBuiltup.trim()) newErrors.areaBuiltup = "Area Builtup is required";
    
    // Conditional validation for Rent and Price
    if (form.transactionType === "Lease" || form.transactionType === "BOTH") {
      if (!form.rent.trim()) newErrors.rent = "Rent is required for Lease/BOTH";
    }
    if (form.transactionType === "Sale" || form.transactionType === "Preleased" || form.transactionType === "BOTH") {
      if (!form.price.trim()) newErrors.price = "Price is required for Sale/Preleased/BOTH";
    }
    
    if (!form.contactName.trim()) newErrors.contactName = "Contact name is required";
    if (!form.contactNumber.trim()) newErrors.contactNumber = "Contact number is required";
    if (!form.emailAddress.trim() || !/\S+@\S+\.\S+/.test(form.emailAddress)) {
      newErrors.emailAddress = "Valid email is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, files } = e.target as any;
    if (name === "image" && files && files[0]) {
      const file = files[0];
      setForm(prev => ({ ...prev, [name]: file }));
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: "" }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" style={{fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif'}}>
        <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg text-center border border-gray-200">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-4 text-gray-900">Property Listed Successfully!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for listing your property with Real Estate Spaces. Our team will review your submission and contact you within 24-48 hours.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">What's Next?</h3>
            <ul className="text-sm text-gray-700 space-y-1 text-left">
              <li>• Property review and verification</li>
              <li>• Professional photography (if needed)</li>
              <li>• Listing activation</li>
            </ul>
          </div>
          <button 
            onClick={() => {setSubmitted(false); setForm({propertyName: "", location: "", propertyType: "", transactionType: "", areaCarpet: "", areaBuiltup: "", rent: "", price: "", contactName: "", contactNumber: "", emailAddress: "", description: "", image: null}); setImagePreview(null);}}
            className="w-full bg-[#FFB400] text-black font-semibold py-3 rounded-lg hover:bg-[#E6A200] transition-all duration-200 transform hover:scale-105"
          >
            List Another Property
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" style={{fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif'}}>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">List Your Property</h1>
          <p className="text-gray-600 text-lg">Join thousands of property owners on Real Estate Spaces</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="bg-gray-900 p-6">
            <h2 className="text-2xl font-semibold text-white flex items-center">
              <Building2 className="mr-3" />
              Property Details
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Property Name */}
              <div className="md:col-span-2">
                <label className="block font-semibold mb-2 text-gray-900">Property Name</label>
                <div className="relative">
                  <Home className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input 
                    name="propertyName" 
                    value={form.propertyName} 
                    onChange={handleChange} 
                    placeholder="e.g., Premium Office Space"
                    className="w-full border border-gray-300 rounded-lg px-10 py-3 focus:ring-2 focus:ring-[#FFB400] focus:border-[#FFB400] transition-colors text-gray-900"
                  />
                </div>
              </div>
              
              {/* Location */}
              <div className="md:col-span-2">
                <label className="block font-semibold mb-2 text-gray-900">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input 
                    name="location" 
                    value={form.location} 
                    onChange={handleChange}
                    placeholder="e.g., BKC, Mumbai"
                    className="w-full border border-gray-300 rounded-lg px-10 py-3 focus:ring-2 focus:ring-[#FFB400] focus:border-[#FFB400] transition-colors text-gray-900"
                  />
                </div>
              </div>
              
              {/* Property Type */}
              <div>
                <label className="block font-semibold mb-2 text-gray-900">Property Type *</label>
                <select 
                  name="propertyType" 
                  value={form.propertyType} 
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-3 focus:ring-2 focus:ring-[#FFB400] focus:border-[#FFB400] transition-colors text-gray-900 bg-white ${errors.propertyType ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select Type</option>
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.propertyType && <p className="text-red-500 text-sm mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.propertyType}</p>}
              </div>
              
              {/* Transaction Type */}
              <div>
                <label className="block font-semibold mb-2 text-gray-900">Transaction Type *</label>
                <select 
                  name="transactionType" 
                  value={form.transactionType} 
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-3 focus:ring-2 focus:ring-[#FFB400] focus:border-[#FFB400] transition-colors text-gray-900 bg-white ${errors.transactionType ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select Type</option>
                  {transactionTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.transactionType && <p className="text-red-500 text-sm mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.transactionType}</p>}
              </div>
              
              {/* Area Carpet */}
              <div>
                <label className="block font-semibold mb-2 text-gray-900">Area Carpet *</label>
                <input 
                  name="areaCarpet" 
                  value={form.areaCarpet} 
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g., 2000 sq ft"
                  className={`w-full border rounded-lg px-3 py-3 focus:ring-2 focus:ring-[#FFB400] focus:border-[#FFB400] transition-colors text-gray-900 ${errors.areaCarpet ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.areaCarpet && <p className="text-red-500 text-sm mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.areaCarpet}</p>}
              </div>
              
              {/* Area Builtup */}
              <div>
                <label className="block font-semibold mb-2 text-gray-900">Area Builtup *</label>
                <input 
                  name="areaBuiltup" 
                  value={form.areaBuiltup} 
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g., 2500 sq ft"
                  className={`w-full border rounded-lg px-3 py-3 focus:ring-2 focus:ring-[#FFB400] focus:border-[#FFB400] transition-colors text-gray-900 ${errors.areaBuiltup ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.areaBuiltup && <p className="text-red-500 text-sm mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.areaBuiltup}</p>}
              </div>
              
              {/* Rent - Conditional */}
              {(form.transactionType === "Lease" || form.transactionType === "BOTH") && (
                <div>
                  <label className="block font-semibold mb-2 text-gray-900">Rent (₹) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400 font-semibold">₹</span>
                    <input 
                      name="rent" 
                      value={form.rent} 
                      onChange={handleChange}
                      type="number" 
                      min="0"
                      placeholder="50000"
                      className={`w-full border rounded-lg px-10 py-3 focus:ring-2 focus:ring-[#FFB400] focus:border-[#FFB400] transition-colors text-gray-900 ${errors.rent ? 'border-red-500' : 'border-gray-300'}`}
                    />
                  </div>
                  {errors.rent && <p className="text-red-500 text-sm mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.rent}</p>}
                </div>
              )}
              
              {/* Price - Conditional */}
              {(form.transactionType === "Sale" || form.transactionType === "Preleased" || form.transactionType === "BOTH") && (
                <div>
                  <label className="block font-semibold mb-2 text-gray-900">Price (₹) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400 font-semibold">₹</span>
                    <input 
                      name="price" 
                      value={form.price} 
                      onChange={handleChange}
                      type="number" 
                      min="0"
                      placeholder="5000000"
                      className={`w-full border rounded-lg px-10 py-3 focus:ring-2 focus:ring-[#FFB400] focus:border-[#FFB400] transition-colors text-gray-900 ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                    />
                  </div>
                  {errors.price && <p className="text-red-500 text-sm mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.price}</p>}
                </div>
              )}
              
              {/* Contact Name */}
              <div>
                <label className="block font-semibold mb-2 text-gray-900">Contact Name *</label>
                <input 
                  name="contactName" 
                  value={form.contactName} 
                  onChange={handleChange}
                  placeholder="Your Name"
                  className={`w-full border rounded-lg px-3 py-3 focus:ring-2 focus:ring-[#FFB400] focus:border-[#FFB400] transition-colors text-gray-900 ${errors.contactName ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.contactName && <p className="text-red-500 text-sm mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.contactName}</p>}
              </div>
              
              {/* Contact Number */}
              <div>
                <label className="block font-semibold mb-2 text-gray-900">Contact Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input 
                    name="contactNumber" 
                    value={form.contactNumber} 
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    className={`w-full border rounded-lg px-10 py-3 focus:ring-2 focus:ring-[#FFB400] focus:border-[#FFB400] transition-colors text-gray-900 ${errors.contactNumber ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
                {errors.contactNumber && <p className="text-red-500 text-sm mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.contactNumber}</p>}
              </div>
              
              {/* Email Address */}
              <div className="md:col-span-2">
                <label className="block font-semibold mb-2 text-gray-900">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input 
                    name="emailAddress" 
                    value={form.emailAddress} 
                    onChange={handleChange}
                    type="email"
                    placeholder="your@email.com"
                    className={`w-full border rounded-lg px-10 py-3 focus:ring-2 focus:ring-[#FFB400] focus:border-[#FFB400] transition-colors text-gray-900 ${errors.emailAddress ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
                {errors.emailAddress && <p className="text-red-500 text-sm mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.emailAddress}</p>}
              </div>
              
              {/* Description */}
              <div className="md:col-span-2">
                <label className="block font-semibold mb-2 text-gray-900">Description</label>
                <textarea 
                  name="description" 
                  value={form.description} 
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe your property in detail..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-[#FFB400] focus:border-[#FFB400] transition-colors text-gray-900 resize-none"
                />
              </div>
              
              {/* Image Upload */}
              <div className="md:col-span-2">
                <label className="block font-semibold mb-2 text-gray-900">Image Upload</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#FFB400] transition-colors relative">
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                      <button 
                        type="button" 
                        onClick={() => {setImagePreview(null); setForm(prev => ({...prev, image: null}));}}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                    </>
                  )}
                  <input 
                    name="image" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
            {/* Submit Button */}
            <div className="mt-8 text-center">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-[#FFB400] text-black font-bold py-4 px-8 rounded-lg hover:bg-[#E6A200] transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  "List My Property"
                )}
              </button>
              <p className="text-sm text-gray-500 mt-2">By submitting, you agree to our Terms of Service</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}