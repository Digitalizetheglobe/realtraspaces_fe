"use client";

import { useState, useEffect } from "react";
import { FiEdit2, FiTrash2, FiPlus, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Developer {
  id: number;
  buildername: string;
  builder_logo: string | null;
  descriptions: string;
  project_name: string[];
  status: boolean;
  created_at: string;
  updated_at: string;
}

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

  // Form state
  const [formData, setFormData] = useState({
    buildername: "",
    descriptions: "",
    project_name: [] as string[],
    status: true,
    builder_logo: null as File | null,
    logoPreview: "",
    newProject: "",
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
        const response = await fetch("https://api.realtraspaces.com/developers");
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setDevelopers(data.data || []);
      } catch (error) {
        setError(
          `Failed to load developers: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
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
      logoPreview: developer?.builder_logo || "",
      newProject: "",
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
        formDataToSend.append("builderLogo", formData.builder_logo);
      }

      const url = currentDeveloper
        ? `https://api.realtraspaces.com/developers/${currentDeveloper.id}`
        : "https://api.realtraspaces.com/developers";

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

      if (currentDeveloper) {
        setDevelopers((prev) =>
          prev.map((d) => (d.id === currentDeveloper.id ? result.data : d))
        );
        toast.success("Developer updated successfully!");
      } else {
        setDevelopers((prev) => [...prev, result.data]);
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
        `https://api.realtraspaces.com/developers/${id}`,
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
            <p>{error}</p>
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
                  {developer.builder_logo ? (
                    <img
                      src={developer.builder_logo}
                      alt={developer.buildername}
                      className="w-full h-full object-contain p-4"
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        img.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <div
                        className="text-4xl font-bold"
                        style={{ color: colors.primary }}
                      >
                        {developer.buildername.charAt(0).toUpperCase()}
                      </div>
                      <span className="mt-2">No Logo</span>
                    </div>
                  )}
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
                      setFormData({ ...formData, newProject: e.target.value })
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
                    <img
                      src={formData.logoPreview}
                      alt="Preview"
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
