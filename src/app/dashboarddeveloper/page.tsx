"use client";

import { useState, useEffect } from "react";
import { FiEdit2, FiTrash2, FiPlus, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

interface Developer {
  id: number;
  buildername: string;
  builder_logo: string | null;
  builder_logo_url?: string | null;
  descriptions: string;
  project_name: string[];
  images: string[];
  image_urls?: string[];
  status: boolean;
  created_at: string;
  updated_at: string;
}

// Utility function to validate image URL
const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

// Utility function to map API response to Developer interface
const mapApiResponseToDeveloper = (apiData: any): Developer => {
  console.log('Mapping developer data:', apiData);
  console.log('Images array:', apiData.images);
  console.log('Image URLs array:', apiData.image_urls);
  console.log('Is images array?', Array.isArray(apiData.images));
  
  const mapped = {
    id: apiData.id,
    buildername: apiData.buildername || '',
    builder_logo: apiData.builder_logo || null,
    builder_logo_url: apiData.builder_logo_url || null,
    descriptions: apiData.descriptions || '',
    project_name: Array.isArray(apiData.project_name) ? apiData.project_name : [],
    images: Array.isArray(apiData.images) ? apiData.images : [],
    image_urls: Array.isArray(apiData.image_urls) ? apiData.image_urls : [],
    status: Boolean(apiData.status),
    created_at: apiData.created_at || '',
    updated_at: apiData.updated_at || ''
  };
  
  console.log('Mapped result:', mapped);
  return mapped;
};

const DevelopersPage = () => {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentDeveloper, setCurrentDeveloper] = useState<Developer | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  // Form state
  const [formData, setFormData] = useState({
    buildername: "",
    descriptions: "",
    project_name: [] as string[],
    status: true,
    builder_logo: null as File | null,
    logoPreview: "",
    newProject: "",
    images: [] as File[],
    imagePreviews: [] as string[],
  });

  // Color scheme
  const colors = {
    primary: "#2D5F7D",
    secondary: "#5B9CBD",
    accent: "#E8A75D",
    light: "#F5F9FC",
    dark: "#1A3A4A",
    gradientStart: "#2D5F7D",
    gradientEnd: "#5B9CBD",
    error: "#F44336",
  };

  // Fetch developers
  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/developers");
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("API endpoint not found. Please check if the backend server is running.");
          } else if (response.status >= 500) {
            throw new Error("Server error. Please try again later.");
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }
        const data = await response.json();
        console.log('Raw API response:', data);
        const mappedDevelopers = (data.data || []).map(mapApiResponseToDeveloper);
        console.log('Mapped developers:', mappedDevelopers);
        setDevelopers(mappedDevelopers);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        if (errorMessage.includes("Failed to fetch")) {
          setError("Cannot connect to server. Please check if the backend server is running on http://localhost:8000");
        } else {
          setError(`Failed to load developers: ${errorMessage}`);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDevelopers();
  }, []);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "status" ? value === "true" : value,
    }));
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        builder_logo: file,
        logoPreview: URL.createObjectURL(file),
      }));
    }
  };

  // Handle multiple image uploads
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...files],
        imagePreviews: [...prev.imagePreviews, ...newPreviews],
      }));
    }
  };

  // Remove image from preview
  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== index),
    }));
  };

  // Upload images to server
  const uploadImages = async (developerId: number, imageFiles: File[]) => {
    if (imageFiles.length === 0) return;

    const formData = new FormData();
    imageFiles.forEach(file => {
      formData.append('images', file);
    });

    try {
      const response = await fetch(`http://localhost:8000/api/developers/${developerId}/images`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload images');
      }

      const result = await response.json();
      return result.data.uploadedImages;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  };

  // Delete image from server
  const deleteImage = async (developerId: number, imageIndex: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/developers/${developerId}/images/${imageIndex}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  };

  // Handle project addition
  const handleAddProject = () => {
    if (formData.newProject.trim()) {
      setFormData((prev) => ({
        ...prev,
        project_name: [...prev.project_name, formData.newProject.trim()],
        newProject: "",
      }));
    }
  };

  // Handle project removal
  const handleRemoveProject = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      project_name: prev.project_name.filter((_, i) => i !== index),
    }));
  };

  // Open modal for add/edit
  const openModal = (developer: Developer | null = null) => {
    setCurrentDeveloper(developer);
    setFormData({
      buildername: developer?.buildername || "",
      descriptions: developer?.descriptions || "",
      project_name: developer?.project_name || [],
      status: developer?.status ?? true,
      builder_logo: null,
      logoPreview: developer?.builder_logo_url || developer?.builder_logo || "",
      newProject: "",
      images: [],
      imagePreviews: developer?.image_urls || developer?.images || [],
    });
    setShowModal(true);
  };

  // Handle form submission (create/update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("buildername", formData.buildername);
      formDataToSend.append("descriptions", formData.descriptions);
      formDataToSend.append("status", String(formData.status));

      // Append each project name
      formData.project_name.forEach((project) => {
        formDataToSend.append("projectName[]", project);
      });

      if (formData.builder_logo) {
        formDataToSend.append("builder_logo", formData.builder_logo);
      }

      const url = currentDeveloper
        ? `http://localhost:8000/api/developers/${currentDeveloper.id}`
        : "http://localhost:8000/api/developers";

      const method = currentDeveloper ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to process request");
      }

      const result = await response.json();

      // Upload images if any were selected
      if (formData.images.length > 0) {
        try {
          const uploadedImages = await uploadImages(result.data.id, formData.images);
          // Update the developer with the new images
          const updatedDeveloper = {
            ...result.data,
            images: [...(result.data.images || []), ...uploadedImages],
            image_urls: [...(result.data.image_urls || []), ...uploadedImages]
          };
          
          if (currentDeveloper) {
            setDevelopers((prev) =>
              prev.map((d) => (d.id === currentDeveloper.id ? updatedDeveloper : d))
            );
          } else {
            setDevelopers((prev) => 
              prev.map((d) => (d.id === result.data.id ? updatedDeveloper : d))
            );
          }
        } catch (error) {
          console.error('Error uploading images:', error);
          toast.warning('Developer saved but some images failed to upload');
        }
      } else if (currentDeveloper) {
        // If no new images but updating existing developer, preserve existing images
        const updatedDeveloper = {
          ...result.data,
          images: currentDeveloper.images || [],
          image_urls: currentDeveloper.image_urls || []
        };
        setDevelopers((prev) =>
          prev.map((d) => (d.id === currentDeveloper.id ? updatedDeveloper : d))
        );
      }

      if (currentDeveloper) {
        toast.success("Developer updated successfully!");
      } else {
        const mappedDeveloper = mapApiResponseToDeveloper(result.data);
        setDevelopers((prev) => [...prev, mappedDeveloper]);
        toast.success("Developer added successfully!");
      }

      setShowModal(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete with API call
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this developer?")) return;

    setIsDeleting(id);
    try {
      const response = await fetch(
        `http://localhost:8000/api/developers/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete developer");
      }

      setDevelopers((prev) => prev.filter((developer) => developer.id !== id));
      toast.success("Developer deleted successfully!");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
          style={{ borderColor: colors.primary }}
        ></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: colors.light }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold" style={{ color: colors.dark }}>
              Developers
            </h1>
            <button
              onClick={() => openModal()}
              className="flex items-center px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
              style={{ backgroundColor: colors.primary, color: "white" }}
            >
              <FiPlus className="mr-2" /> Add Developer
            </button>
          </div>
                                  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
              <p className="font-medium mb-2">Error Loading Developers</p>
              <p className="text-sm mb-3">{error}</p>
              <div className="text-xs text-red-600 mb-4">
                <p className="mb-1">Troubleshooting tips:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Make sure the backend server is running on http://localhost:8000</li>
                  <li>Check if the API endpoint is accessible</li>
                  <li>Verify your internet connection</li>
                  <li>Try refreshing the page</li>
                </ul>
              </div>
              <button
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  window.location.reload();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
              >
                Retry Loading
              </button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.light }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: colors.dark }}>
              Developers
            </h1>
            <p className="text-gray-600 mt-2">
              Manage real estate developers and their projects
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
            style={{
              background: `linear-gradient(135deg, ${colors.gradientStart} 0%, ${colors.gradientEnd} 100%)`,
              color: "white",
            }}
          >
            <FiPlus className="mr-2" /> Add Developer
          </button>
        </div>

        {/* Developers Grid */}
        {developers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg mb-6">
              No developers found. Add your first developer!
            </p>
            <button
              onClick={() => openModal()}
              className="inline-flex items-center px-6 py-3 rounded-lg text-white hover:shadow-md transition-all"
              style={{ backgroundColor: colors.primary }}
            >
              <FiPlus className="mr-2" /> Add Developer
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {developers.map((developer) => (
              <div
                key={developer.id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
              >
                {/* Developer Logo */}
                <div className="h-48 w-full relative bg-gray-100 flex items-center justify-center">
                  {developer.builder_logo_url && isValidImageUrl(developer.builder_logo_url) ? (
                    <Image
                      src={developer.builder_logo_url}
                      alt={developer.buildername}
                      width={400}
                      height={200}
                      className="w-full h-full object-contain p-4"
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        img.style.display = "none";
                        // Track failed images
                        setFailedImages(prev => new Set(prev).add(developer.builder_logo_url || ''));
                        // Show fallback when image fails to load
                        const fallback = img.parentElement?.querySelector('.image-fallback') as HTMLElement;
                        if (fallback) {
                          fallback.style.display = "flex";
                        }
                      }}
                      onLoad={(e) => {
                        // Image loaded successfully - hide any fallback
                        const fallback = e.currentTarget.parentElement?.querySelector('.image-fallback') as HTMLElement;
                        if (fallback) {
                          fallback.style.display = "none";
                        }
                      }}
                      crossOrigin="anonymous"
                    />
                  ) : null}
                  {/* Fallback when no logo or image fails to load */}
                  <div 
                    className={`flex flex-col items-center justify-center text-gray-400 ${developer.builder_logo_url && isValidImageUrl(developer.builder_logo_url) ? 'image-fallback' : ''}`}
                    style={{ 
                      display: (developer.builder_logo_url && isValidImageUrl(developer.builder_logo_url) && !failedImages.has(developer.builder_logo_url)) ? 'none' : 'flex' 
                    }}
                  >
                    <div
                      className="text-4xl font-bold"
                      style={{ color: colors.primary }}
                    >
                      {developer.buildername.charAt(0).toUpperCase()}
                    </div>
                    <span className="mt-2 text-sm">
                      {developer.builder_logo_url && !isValidImageUrl(developer.builder_logo_url) 
                        ? 'Invalid Image URL' 
                        : developer.builder_logo_url && failedImages.has(developer.builder_logo_url)
                          ? 'Image Failed to Load' 
                          : developer.builder_logo_url 
                            ? 'Loading...' 
                            : 'No Logo'
                      }
                    </span>
                    {developer.builder_logo_url && failedImages.has(developer.builder_logo_url) && (
                      <button
                        onClick={() => {
                          setFailedImages(prev => {
                            const newSet = new Set(prev);
                            newSet.delete(developer.builder_logo_url || '');
                            return newSet;
                          });
                          // Force re-render of the image
                          const img = document.querySelector(`img[src="${developer.builder_logo_url}"]`) as HTMLImageElement;
                          if (img) {
                            img.style.display = 'block';
                            img.src = developer.builder_logo_url + '?retry=' + Date.now();
                          }
                        }}
                        className="mt-2 px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        Retry
                      </button>
                    )}
                  </div>
                </div>

                {/* Developer Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-4">
                    <h2
                      className="text-xl font-bold mb-1 group-hover:text-blue-600 transition-colors"
                      style={{ color: colors.dark }}
                    >
                      {developer.buildername}
                    </h2>
                    <div className="flex items-center mt-1">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          developer.status
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {developer.status ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  <div className="flex-grow">
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                      {developer.descriptions}
                    </p>

                    {developer.project_name.length > 0 && (
                      <div className="mb-4">
                        <h3
                          className="text-sm font-medium mb-1"
                          style={{ color: colors.primary }}
                        >
                          Projects:
                        </h3>
                        <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                          {developer.project_name.map((project, index) => (
                            <li key={index}>{project}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {developer.images && developer.images.length > 0 && (
                      <div className="mb-4">
                        <h3
                          className="text-sm font-medium mb-2"
                          style={{ color: colors.primary }}
                        >
                          Images ({(developer.image_urls || developer.images).length}):
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {(developer.image_urls || developer.images).slice(0, 4).map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image}
                                alt={`${developer.buildername} image ${index + 1}`}
                                className="w-full h-20 object-cover rounded-md border border-gray-200"
                                onError={(e) => {
                                  const img = e.currentTarget as HTMLImageElement;
                                  img.style.display = "none";
                                  // Track failed images
                                  setFailedImages(prev => new Set(prev).add(image));
                                }}
                                onLoad={(e) => {
                                  // Image loaded successfully
                                  const img = e.currentTarget as HTMLImageElement;
                                  img.style.display = "block";
                                }}
                                crossOrigin="anonymous"
                              />
                              <button
                                onClick={async () => {
                                  try {
                                    await deleteImage(developer.id, index);
                                    setDevelopers((prev) =>
                                      prev.map((d) =>
                                        d.id === developer.id
                                          ? { 
                                              ...d, 
                                              images: d.images.filter((_, i) => i !== index),
                                              image_urls: d.image_urls?.filter((_, i) => i !== index) || []
                                            }
                                          : d
                                      )
                                    );
                                    toast.success("Image deleted successfully!");
                                  } catch (error) {
                                    toast.error("Failed to delete image");
                                  }
                                }}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                              >
                                <FiX size={10} />
                              </button>
                            </div>
                          ))}
                          {(developer.image_urls || developer.images).length > 4 && (
                            <div className="w-full h-20 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center text-gray-500 text-xs">
                              +{(developer.image_urls || developer.images).length - 4} more
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons - Edit and Delete */}
                  <div className="flex justify-end items-center pt-4 border-t border-gray-100 mt-4">
                    <div className="flex gap-3">
                      {/* Edit Button */}
                      <button
                        onClick={() => openModal(developer)}
                        className="p-2 rounded-full hover:bg-blue-50 transition-colors"
                        style={{ color: colors.primary }}
                        title="Edit developer"
                      >
                        <FiEdit2 size={18} />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(developer.id)}
                        disabled={isDeleting === developer.id}
                        className="p-2 rounded-full hover:bg-red-50 transition-colors"
                        style={{ color: colors.error }}
                        title="Delete developer"
                      >
                        {isDeleting === developer.id ? (
                          <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"></span>
                        ) : (
                          <FiTrash2 size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Developer Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold" style={{ color: colors.dark }}>
                {currentDeveloper ? "Edit Developer" : "Add Developer"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Developer Name *
                </label>
                <input
                  type="text"
                  name="buildername"
                  value={formData.buildername}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="descriptions"
                  value={formData.descriptions}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={String(formData.status)}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Projects
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={formData.newProject}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, newProject: e.target.value }))
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add project name"
                  />
                  <button
                    type="button"
                    onClick={handleAddProject}
                    className="px-3 py-2 text-white rounded-md"
                    style={{ backgroundColor: colors.primary }}
                  >
                    Add
                  </button>
                </div>
                {formData.project_name.length > 0 && (
                  <ul className="space-y-1">
                    {formData.project_name.map((project, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded"
                      >
                        <span>{project}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveProject(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiX size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo
                </label>
                {formData.logoPreview && (
                  <div className="mb-2">
                    <Image
                      src={formData.logoPreview}
                      alt="Preview"
                      width={128}
                      height={128}
                      className="h-32 w-32 object-contain rounded-md border border-gray-200"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Images (Up to 10 images)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                
                {/* Existing Images (for edit mode) */}
                {currentDeveloper && currentDeveloper.images && currentDeveloper.images.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Existing Images:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {currentDeveloper.images.map((image, index) => (
                        <div key={`existing-${index}`} className="relative group">
                          <Image
                            src={image}
                            alt={`Existing image ${index + 1}`}
                            width={96}
                            height={96}
                            className="h-24 w-full object-cover rounded-md border border-gray-200"
                            onError={(e) => {
                              const img = e.currentTarget as HTMLImageElement;
                              img.style.display = "none";
                              setFailedImages(prev => new Set(prev).add(image));
                            }}
                            crossOrigin="anonymous"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-xs">Existing</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* New Image Previews */}
                {(formData.imagePreviews.length > 0 || formData.images.length > 0) && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">New Images to Upload:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {formData.imagePreviews.map((preview, index) => (
                        <div key={`new-${index}`} className="relative group">
                          <Image
                            src={preview}
                            alt={`New image ${index + 1}`}
                            width={96}
                            height={96}
                            className="h-24 w-full object-cover rounded-md border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FiX size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-white rounded-md flex items-center transition-colors"
                  style={{
                    backgroundColor: colors.primary,
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                      {currentDeveloper ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    <>
                      {currentDeveloper ? "Update Developer" : "Add Developer"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevelopersPage;
