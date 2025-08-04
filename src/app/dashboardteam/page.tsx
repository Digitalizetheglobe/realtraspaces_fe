"use client";

import { useState, useEffect } from "react";
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiLinkedin,
  FiUser,
  FiX,
} from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface TeamMember {
  id: number;
  full_name: string;
  description: string;
  linkedin_url: string;
  designation: string;
  photo: string | null;
  photo_url: string | null;
  is_working: boolean;
  created_at: string;
  updated_at: string;
}

const TeamPage = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentMember, setCurrentMember] = useState<TeamMember | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    full_name: "",
    description: "",
    linkedin_url: "",
    designation: "",
    is_working: true,
    photo: null as File | null,
    photoPreview: "",
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
  };

  // Fetch team members
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/team/");
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setTeamMembers(data.data || []);
      } catch (error) {
        setError(
          `Failed to load team members: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      } finally {
        setLoading(false);
      }
    };
    fetchTeamMembers();
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
      [name]: name === "is_working" ? value === "true" : value,
    }));
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        photo: file,
        photoPreview: URL.createObjectURL(file),
      }));
    }
  };

  // Open modal for add/edit
  const openModal = (member: TeamMember | null = null) => {
    setCurrentMember(member);
    setFormData({
      full_name: member?.full_name || "",
      description: member?.description || "",
      linkedin_url: member?.linkedin_url || "",
      designation: member?.designation || "",
      is_working: member?.is_working ?? true,
      photo: null,
      photoPreview: member?.photo_url || "",
    });
    setShowModal(true);
  };

  // Handle form submission (create/update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("full_name", formData.full_name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("linkedin_url", formData.linkedin_url);
      formDataToSend.append("designation", formData.designation);
      formDataToSend.append("is_working", String(formData.is_working));
      if (formData.photo) {
        formDataToSend.append("photo", formData.photo);
      }

      const url = currentMember
        ? `https://api.realtraspaces.com/team/${currentMember.id}`
        : "https://api.realtraspaces.com/team/";

      const method = currentMember ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (!response.ok)
        throw new Error(
          currentMember
            ? "Failed to update team member"
            : "Failed to add team member"
        );

      const result = await response.json();

      if (currentMember) {
        setTeamMembers((prev) =>
          prev.map((m) => (m.id === currentMember.id ? result.data : m))
        );
        toast.success("Team member updated successfully!");
      } else {
        setTeamMembers((prev) => [...prev, result.data]);
        toast.success("Team member added successfully!");
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

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;

    setIsDeleting(id);
    try {
      const response = await fetch(`https://api.realtraspaces.com/team/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete team member");

      setTeamMembers((prev) => prev.filter((member) => member.id !== id));
      toast.success("Team member deleted successfully!");
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
              Team Management
            </h1>
            <button
              onClick={() => openModal()}
              className="flex items-center px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
              style={{ backgroundColor: colors.primary, color: "white" }}
            >
              <FiPlus className="mr-2" /> Add Team Member
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
              Team Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your team members and their details
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
            <FiPlus className="mr-2" /> Add Team Member
          </button>
        </div>

        {/* Team Grid */}
        {teamMembers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg mb-6">
              No team members found. Add your first team member!
            </p>
            <button
              onClick={() => openModal()}
              className="inline-flex items-center px-6 py-3 rounded-lg text-white hover:shadow-md transition-all"
              style={{ backgroundColor: colors.primary }}
            >
              <FiPlus className="mr-2" /> Add Team Member
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col"
              >
                {/* Member Photo */}
                <div className="h-48 w-full relative bg-gray-100 rounded-t-2xl overflow-hidden">
                  {member.photo ? (
                    <img
                      src={
                        member.photo.startsWith("http")
                          ? member.photo
                          : `https://api.realtraspaces.com/uploads/team/${member.photo}`
                      }
                      alt={member.full_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        img.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 h-full cursor-pointer">
                      <FiUser size={48} />
                      <span className="mt-2 text-sm">No Photo</span>
                    </div>
                  )}
                </div>

                {/* Member Content */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="mb-3">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {member.full_name}
                    </h2>
                    <p className="text-sm text-blue-600">
                      {member.designation}
                    </p>
                    <span
                      className={`mt-1 inline-block text-xs font-medium px-2 py-1 rounded-full ${
                        member.is_working
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {member.is_working ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-3 flex-grow">
                    {member.description}
                  </p>

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-4">
                    {member.linkedin_url ? (
                      <a
                        href={member.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                        title="LinkedIn"
                      >
                        <FiLinkedin size={18} />
                      </a>
                    ) : (
                      <span></span>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal(member)}
                        className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition cursor-pointer"
                        title="Edit"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        disabled={isDeleting === member.id}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-full transition cursor-pointer"
                        title="Delete"
                      >
                        {isDeleting === member.id ? (
                          <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"></span>
                        ) : (
                          <FiTrash2 size={16} />
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

      {/* Add/Edit Team Member Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold" style={{ color: colors.dark }}>
                {currentMember ? "Edit Team Member" : "Add Team Member"}
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
                  Full Name *
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Designation *
                </label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
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
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  name="linkedin_url"
                  value={formData.linkedin_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="is_working"
                  value={String(formData.is_working)}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Photo
                </label>
                {formData.photoPreview && (
                  <div className="mb-2">
                    <img
                      src={formData.photoPreview}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-md"
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
                      {currentMember ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    <>{currentMember ? "Update Member" : "Add Member"}</>
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

export default TeamPage;
