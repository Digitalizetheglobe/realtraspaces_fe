"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { propertyListingService, PropertyListingData } from '@/services/propertyService';

interface PropertyFormData {
  propertyName: string;
  location: string;
  propertyType: string;
  transactionType: string;
  areaCarpet: string;
  areaBuiltup: string;
  rent: number | null;
  price: number | null;
  contactName: string;
  contactNumber: string;
  emailAddress: string;
  description: string;
  images: File[];
}

interface ImagePreview {
  file: File;
  preview: string;
}

const ListPropertyPage = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<PropertyFormData>({
    propertyName: '',
    location: '',
    propertyType: '',
    transactionType: '',
    areaCarpet: '',
    areaBuiltup: '',
    rent: null,
    price: null,
    contactName: '',
    contactNumber: '',
    emailAddress: '',
    description: '',
    images: []
  });

  const [selectedImages, setSelectedImages] = useState<ImagePreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Property type options
  const propertyTypes = [
    'Office',
    'Retail',
    'Coworking',
    'Industrial or warehouse',
    'Land',
    'Others'
  ];

  // Transaction type options
  const transactionTypes = [
    'Lease',
    'Sale',
    'BOTH',
    'Preleased'
  ];

  // Example data for quick testing
  const loadExampleData = (type: number) => {
    const examples = {
      1: {
        propertyName: "Tech Tower Business Center",
        location: "Sector 18, Gurgaon",
        propertyType: "Office",
        transactionType: "Lease",
        areaCarpet: "3200 sq ft",
        areaBuiltup: "4000 sq ft",
        rent: 180000,
        price: null,
        contactName: "Rahul Mehta",
        contactNumber: "+91-9988776655",
        emailAddress: "rahul.mehta@techproperties.com",
        description: "Premium office space with sea view, fully furnished with modern amenities including high-speed internet, conference rooms, and dedicated parking."
      },
      2: {
        propertyName: "Street Side Retail Shop",
        location: "Khan Market, New Delhi",
        propertyType: "Retail",
        transactionType: "Sale",
        areaCarpet: "600 sq ft",
        areaBuiltup: "750 sq ft",
        rent: null,
        price: 4500000,
        contactName: "Sunita Kapoor",
        contactNumber: "+91-8877665544",
        emailAddress: "sunita.kapoor@retailspaces.in",
        description: "Prime retail location with high foot traffic, perfect for boutique or electronics store."
      },
      3: {
        propertyName: "Creative Workspace Hub",
        location: "Koramangala, Bangalore",
        propertyType: "Coworking",
        transactionType: "BOTH",
        areaCarpet: "8000 sq ft",
        areaBuiltup: "10000 sq ft",
        rent: 350000,
        price: 15000000,
        contactName: "Arjun Reddy",
        contactNumber: "+91-7766554433",
        emailAddress: "arjun.reddy@creativespaces.com",
        description: "State-of-the-art coworking facility with 200+ desks, multiple meeting rooms, event space, rooftop cafe, and wellness area."
      }
    };

    const example = examples[type as keyof typeof examples];
    if (example) {
      setFormData(prev => ({
        ...prev,
        ...example,
        images: []
      }));
      // Clear images when loading examples
      clearImages();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value ? parseFloat(value) : null) : value
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addFiles(files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    addFiles(files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  const addFiles = (files: File[]) => {
    const newImages: ImagePreview[] = [];
    const newFiles: File[] = [];

    files.forEach(file => {
      // Check if file already exists
      const exists = selectedImages.some(img => 
        img.file.name === file.name && img.file.size === file.size
      );
      
      if (!exists && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const preview = e.target?.result as string;
          newImages.push({ file, preview });
          
          if (newImages.length === files.length) {
            setSelectedImages(prev => [...prev, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
        newFiles.push(file);
      }
    });

    if (newFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newFiles]
      }));
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const clearImages = () => {
    setSelectedImages([]);
    setFormData(prev => ({ ...prev, images: [] }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const clearForm = () => {
    setFormData({
      propertyName: '',
      location: '',
      propertyType: '',
      transactionType: '',
      areaCarpet: '',
      areaBuiltup: '',
      rent: null,
      price: null,
      contactName: '',
      contactNumber: '',
      emailAddress: '',
      description: '',
      images: []
    });
    clearImages();
  };

  const validateForm = (): boolean => {
    if (!formData.propertyName.trim()) {
      toast.error('Property name is required');
      return false;
    }
    if (!formData.location.trim()) {
      toast.error('Location is required');
      return false;
    }
    if (!formData.propertyType) {
      toast.error('Property type is required');
      return false;
    }
    if (!formData.transactionType) {
      toast.error('Transaction type is required');
      return false;
    }
    if (!formData.contactName.trim()) {
      toast.error('Contact name is required');
      return false;
    }
    if (!formData.contactNumber.trim()) {
      toast.error('Contact number is required');
      return false;
    }
    
    // Email validation (optional field)
    if (formData.emailAddress.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.emailAddress)) {
        toast.error('Please enter a valid email address');
        return false;
      }
    }

    // Validate that at least rent or price is provided
    if (!formData.rent && !formData.price) {
      toast.error('Please provide either rent or price information');
      return false;
    }

    return true;
  };

  // Remove the uploadImages function as it's now handled by the service

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Upload images first
      const imageFilenames = await propertyListingService.uploadImages(formData.images);

      // Prepare API payload
      const payload: PropertyListingData = {
        propertyName: formData.propertyName.trim(),
        location: formData.location.trim(),
        propertyType: formData.propertyType,
        transactionType: formData.transactionType,
        areaCarpet: formData.areaCarpet.trim(),
        areaBuiltup: formData.areaBuiltup.trim(),
        rent: formData.rent,
        price: formData.price,
        contactName: formData.contactName.trim(),
        contactNumber: formData.contactNumber.trim(),
        emailAddress: formData.emailAddress.trim() || null,
        description: formData.description.trim() || null,
        images: imageFilenames
      };

      // Validate using service
      const validation = propertyListingService.validatePropertyData(payload);
      if (!validation.isValid) {
        validation.errors.forEach(error => toast.error(error));
        return;
      }

      // Make API call using service
      const result = await propertyListingService.createPropertyListing(payload);

      if (!result.success) {
        throw new Error(result.message || 'Failed to create property listing');
      }
      
      toast.success('Property listing created successfully!');
      
      // Show success details if available
      if (result.data && formData.images.length > 0) {
        toast.success(`Uploaded ${formData.images.length} image(s) successfully`, {
          duration: 3000,
        });
      }
      
      // Clear form on success
      clearForm();
      
      // Optionally redirect to properties page or show success page
      // router.push('/properties');

    } catch (error) {
      console.error('Error creating property listing:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create property listing');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                List Your Property
              </h1>
              <p className="text-gray-600">
                Fill out the form below to list your commercial property
              </p>
            </div>

           

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Property Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="propertyName" className="block text-sm font-medium text-gray-700 mb-2">
                    Property Name *
                  </label>
                  <input
                    type="text"
                    id="propertyName"
                    name="propertyName"
                    value={formData.propertyName}
                    onChange={handleInputChange}
                    placeholder="Tech Tower Business Center"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Sector 18, Gurgaon"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type *
                  </label>
                  <select
                    id="propertyType"
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Property Type</option>
                    {propertyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="transactionType" className="block text-sm font-medium text-gray-700 mb-2">
                    Transaction Type *
                  </label>
                  <select
                    id="transactionType"
                    name="transactionType"
                    value={formData.transactionType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Transaction Type</option>
                    {transactionTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="areaCarpet" className="block text-sm font-medium text-gray-700 mb-2">
                    Area Carpet
                  </label>
                  <input
                    type="text"
                    id="areaCarpet"
                    name="areaCarpet"
                    value={formData.areaCarpet}
                    onChange={handleInputChange}
                    placeholder="3200 sq ft"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="areaBuiltup" className="block text-sm font-medium text-gray-700 mb-2">
                    Area Builtup
                  </label>
                  <input
                    type="text"
                    id="areaBuiltup"
                    name="areaBuiltup"
                    value={formData.areaBuiltup}
                    onChange={handleInputChange}
                    placeholder="4000 sq ft"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="rent" className="block text-sm font-medium text-gray-700 mb-2">
                    Rent (₹)
                  </label>
                  <input
                    type="number"
                    id="rent"
                    name="rent"
                    value={formData.rent || ''}
                    onChange={handleInputChange}
                    placeholder="180000"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price || ''}
                    onChange={handleInputChange}
                    placeholder="12000000"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    id="contactName"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    placeholder="Rahul Mehta"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    id="contactNumber"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    placeholder="+91-9988776655"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Email Address - Full Width */}
              <div>
                <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="emailAddress"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleInputChange}
                  placeholder="rahul.mehta@techproperties.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Description - Full Width */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Premium office space with sea view, fully furnished with modern amenities..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Images
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    dragOver 
                      ? 'border-blue-400 bg-blue-50' 
                      : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <div className="text-gray-600">
                    <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-lg font-medium">📁 Click to select images or drag & drop here</p>
                    <p className="text-sm text-gray-500 mt-1">Supports JPG, PNG, WebP files</p>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />

                {/* Image Previews */}
                {selectedImages.length > 0 && (
                  <div className="mt-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {selectedImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image.preview}
                            alt={image.file.name}
                            className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                            title="Remove image"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                      <strong>Selected files ({selectedImages.length}):</strong>
                      <br />
                      {selectedImages.map((image, index) => (
                        <span key={index} className="block">
                          • {image.file.name} ({formatFileSize(image.file.size)})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={clearForm}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {selectedImages.length > 0 ? 'Uploading...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      🚀 Create Property Listing
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListPropertyPage;
