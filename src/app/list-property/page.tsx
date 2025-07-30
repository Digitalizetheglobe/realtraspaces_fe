"use client"
import { useState } from "react";
import { Camera, MapPin, DollarSign, Home, Phone, Mail, Upload, Check, AlertCircle } from "lucide-react";

export default function ListPropertyPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    location: "",
    price: "",
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
    sqft: "",
    description: "",
    contact: "",
    email: "",
    image: null as File | null,
    amenities: [] as string[],
  });

  const propertyTypes = ["House", "Apartment", "Condo", "Townhouse", "Villa", "Commercial", "Land"];
  const amenitiesList = ["Parking", "Swimming Pool", "Gym", "Security", "Garden", "Balcony", "AC", "Furnished"];

  function validateForm() {
    const newErrors: any = {};
    if (!form.name.trim()) newErrors.name = "Property name is required";
    if (!form.location.trim()) newErrors.location = "Location is required";
    if (!form.price || parseFloat(form.price) <= 0) newErrors.price = "Valid price is required";
    if (!form.propertyType) newErrors.propertyType = "Property type is required";
    if (!form.description.trim() || form.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }
    if (!form.contact.trim()) newErrors.contact = "Contact number is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Valid email is required";
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

  function handleAmenityChange(amenity: string) {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
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
            onClick={() => {setSubmitted(false); setForm({name: "", location: "", price: "", propertyType: "", bedrooms: "", bathrooms: "", sqft: "", description: "", contact: "", email: "", image: null, amenities: []}); setImagePreview(null);}}
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
              <Home className="mr-3" />
              Property Details
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Property Name */}
              <div className="md:col-span-2">
                <label className="block font-semibold mb-2 text-gray-900">Property Name *</label>
                <div className="relative">
                  <Home className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input 
                    name="name" 
                    value={form.name} 
                    onChange={handleChange} 
                    placeholder="e.g., Luxury 3BHK Apartment"
                    className={`w-full border rounded-lg px-10 py-3 focus:ring-2 focus:ring-[#FFB400] focus:border-[#FFB400] transition-colors text-gray-900 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
                {errors.name && <p className="text-red-500 text-sm mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.name}</p>}
              </div>
              {/* Location */}
              <div className="md:col-span-2">
                <label className="block font-semibold mb-2 text-gray-900">Location *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input 
                    name="location" 
                    value={form.location} 
                    onChange={handleChange}
                    placeholder="e.g., Koregaon Park, Mumbai"
                    className={`w-full border rounded-lg px-10 py-3 focus:ring-2 focus:ring-[#FFB400] focus:border-[#FFB400] transition-colors text-gray-900 ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
                {errors.location && <p className="text-red-500 text-sm mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.location}</p>}
              </div>
              {/* Price */}
              <div>
                <label className="block font-semibold mb-2 text-gray-900">Price (₹) *</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
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
              {/* Bedrooms */}
              <div>
                <label className="block font-semibold mb-2 text-gray-900">Bedrooms</label>
                <input 
                  name="bedrooms" 
                  value={form.bedrooms} 
                  onChange={handleChange}
                  type="number" 
                  min="0"
                  placeholder="3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-[#FFB400] focus:border-[#FFB400] transition-colors text-gray-900"
                />
              </div>
              {/* Bathrooms */}
              <div>
                <label className="block font-semibold mb-2 text-gray-900">Bathrooms</label>
                <input 
                  name="bathrooms" 
                  value={form.bathrooms} 
                  onChange={handleChange}
                  type="number" 
                  min="0"
                  placeholder="2"
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-[#FFB400] focus:border-[#FFB400] transition-colors text-gray-900"
                />
              </div>
              {/* Square Feet */}
              <div>
                <label className="block font-semibold mb-2 text-gray-900">Area (sq ft)</label>
                <input 
                  name="sqft" 
                  value={form.sqft} 
                  onChange={handleChange}
                  type="number" 
                  min="0"
                  placeholder="1200"
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:ring-2 focus:ring-[#FFB400] focus:border-[#FFB400] transition-colors text-gray-900"
                />
              </div>
              {/* Contact */}
              <div>
                <label className="block font-semibold mb-2 text-gray-900">Contact Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input 
                    name="contact" 
                    value={form.contact} 
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    className={`w-full border rounded-lg px-10 py-3 focus:ring-2 focus:ring-[#FFB400] focus:border-[#FFB400] transition-colors text-gray-900 ${errors.contact ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
                {errors.contact && <p className="text-red-500 text-sm mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.contact}</p>}
              </div>
              {/* Email */}
              <div>
                <label className="block font-semibold mb-2 text-gray-900">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input 
                    name="email" 
                    value={form.email} 
                    onChange={handleChange}
                    type="email"
                    placeholder="your@email.com"
                    className={`w-full border rounded-lg px-10 py-3 focus:ring-2 focus:ring-[#FFB400] focus:border-[#FFB400] transition-colors text-gray-900 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.email}</p>}
              </div>
              {/* Amenities */}
              <div className="md:col-span-2">
                <label className="block font-semibold mb-3 text-gray-900">Amenities</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {amenitiesList.map(amenity => (
                    <label key={amenity} className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={form.amenities.includes(amenity)}
                        onChange={() => handleAmenityChange(amenity)}
                        className="w-4 h-4 text-[#FFB400] rounded focus:ring-[#FFB400] border-gray-300"
                      />
                      <span className="text-sm text-gray-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Description */}
              <div className="md:col-span-2">
                <label className="block font-semibold mb-2 text-gray-900">Description *</label>
                <textarea 
                  name="description" 
                  value={form.description} 
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe your property in detail..."
                  className={`w-full border rounded-lg px-3 py-3 focus:ring-2 focus:ring-[#FFB400] focus:border-[#FFB400] transition-colors text-gray-900 resize-none ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                />
                <p className="text-sm text-gray-500 mt-1">{form.description.length}/20 characters minimum</p>
                {errors.description && <p className="text-red-500 text-sm mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.description}</p>}
              </div>
              {/* Image Upload */}
              <div className="md:col-span-2">
                <label className="block font-semibold mb-2 text-gray-900">Property Image</label>
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