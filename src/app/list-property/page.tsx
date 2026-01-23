"use client"
import { useState } from "react";
import { Camera, MapPin, DollarSign, Home, Phone, Mail, Upload, Check, AlertCircle, Building2, FileText } from "lucide-react";
import Link from "next/link";
// Note: We now use FormData directly for file uploads instead of this utility function

export default function ListPropertyPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

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
    images: [] as File[],
    termsAccepted: false,
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
    if (!form.termsAccepted) newErrors.termsAccepted = "You must accept the terms and conditions";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, files, type, checked } = e.target as any;
    if (name === "images" && files && files.length > 0) {
      const fileArray = Array.from(files) as File[];
      setForm(prev => ({ ...prev, [name]: fileArray }));

      // Create previews for all selected images
      const previews: string[] = [];
      fileArray.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result;
          if (typeof result === 'string') {
            previews.push(result);
            if (previews.length === fileArray.length) {
              setImagePreviews(previews);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    } else if (type === "checkbox") {
      setForm(prev => ({ ...prev, [name]: checked }));
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

    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Add all form fields to FormData
      formData.append('propertyName', form.propertyName);
      formData.append('location', form.location);
      formData.append('propertyType', form.propertyType);
      formData.append('transactionType', form.transactionType);
      formData.append('areaCarpet', form.areaCarpet);
      formData.append('areaBuiltup', form.areaBuiltup);
      if (form.rent) formData.append('rent', form.rent);
      if (form.price) formData.append('price', form.price);
      formData.append('contactName', form.contactName);
      formData.append('contactNumber', form.contactNumber);
      formData.append('emailAddress', form.emailAddress);
      formData.append('description', form.description);

      // Add image files to FormData
      form.images.forEach((file) => {
        formData.append('images', file);
      });

      // Call the API with FormData
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://api.realtraspaces.com';
      const response = await fetch(`${baseURL}/api/property-listings/create`, {
        method: 'POST',
        body: formData, // Send FormData instead of JSON
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
        // Clear any previous errors
        setErrors({});
      } else {
        // Handle API errors
        setErrors({ submit: result.message || 'Failed to submit property listing' });
      }
    } catch (error) {
      console.error('Error submitting property listing:', error);
      if (error instanceof Error) {
        setErrors({ submit: `Error: ${error.message}` });
      } else {
        setErrors({ submit: 'Network error. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" style={{ fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif' }}>
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
            onClick={() => { setSubmitted(false); setForm({ propertyName: "", location: "", propertyType: "", transactionType: "", areaCarpet: "", areaBuiltup: "", rent: "", price: "", contactName: "", contactNumber: "", emailAddress: "", description: "", images: [], termsAccepted: false }); setImagePreviews([]); }}
            className="w-full bg-[#FFB400] text-black font-semibold py-3 rounded-lg hover:bg-[#E6A200] transition-all duration-200 transform hover:scale-105"
          >
            List Another Property
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" style={{ fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif' }}>
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
                    placeholder="+41 123 456 7890"
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
                <label className="block font-semibold mb-2 text-gray-900">Property Images</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#FFB400] transition-colors relative">
                  {imagePreviews.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative">
                            <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                            <button
                              type="button"
                              onClick={() => {
                                const newPreviews = imagePreviews.filter((_, i) => i !== index);
                                const newImages = form.images.filter((_, i) => i !== index);
                                setImagePreviews(newPreviews);
                                setForm(prev => ({ ...prev, images: newImages }));
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500">Selected {imagePreviews.length} image(s)</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-500">PNG, JPG up to 10MB each (Multiple files allowed)</p>
                    </>
                  )}
                  <input
                    name="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="md:col-span-2">
                <label className="block font-semibold mb-2 text-gray-900">Terms and Conditions *</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={form.termsAccepted}
                    onChange={handleChange}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <p className="text-sm text-gray-700">
                    I agree to the <Link href="/terms-and-condition" className="text-blue-600 hover:underline">Terms of Service</Link> and <Link href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
                  </p>
                </div>
                {errors.termsAccepted && <p className="text-red-500 text-sm mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.termsAccepted}</p>}
              </div>
            </div>
            {/* Submit Button */}
            <div className="mt-8 text-center">
              {errors.submit && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {errors.submit}
                </div>
              )}
              {isSubmitting && (
                <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
                  Submitting your property listing...
                </div>
              )}
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