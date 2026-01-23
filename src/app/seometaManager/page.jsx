"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { FiPlus, FiEdit2, FiX, FiCheck, FiArrowLeft, FiTrash2 } from 'react-icons/fi';

const SEOMetaManager = () => {
  const [metaTags, setMetaTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    page: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    canonicalUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Color scheme from RealTraSpaces
  const colors = {
    primary: '#2D5F7D',       // Dark blue from logo
    secondary: '#5B9CBD',     // Medium blue
    accent: '#E8A75D',        // Orange from logo
    light: '#F5F9FC',         // Light background
    dark: '#1A3A4A',          // Dark text
    success: '#4CAF50',       // Green
    error: '#F44336'          // Red
  };

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ ...notification, show: false }), 3000);
  };

  // Fetch all meta tags
  const fetchAllMetaTags = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/seo/meta-tags/');
      setMetaTags(response.data.data);
    } catch (err) {
      showNotification('Failed to fetch meta tags', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch single page meta
  const fetchPageMeta = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/seo/meta-tags/${page}`);
      setCurrentPage(response.data.data);
      setFormData(response.data.data);
    } catch (err) {
      showNotification(`Failed to fetch ${page} meta tags`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete meta tags
  const handleDelete = async (page) => {
    if (!confirm(`Are you sure you want to delete the meta tags for ${page}?`)) return;

    setLoading(true);
    try {
      await axios.delete(`http://localhost:8000/api/seo/meta-tags/${page}`);
      showNotification('Meta tags deleted successfully!', 'success');
      setCurrentPage(null);
      fetchAllMetaTags();
    } catch (err) {
      showNotification('Failed to delete meta tags', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        await axios.put(`http://localhost:8000/api/seo/meta-tags/${formData.page}`, formData);
        showNotification('Meta tags updated successfully!', 'success');
      } else {
        await axios.post('http://localhost:8000/api/seo/meta-tags/', formData);
        showNotification('Meta tags created successfully!', 'success');
      }
      fetchAllMetaTags();
      setIsEditing(false);
    } catch (err) {
      showNotification('Failed to save meta tags', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Initialize data
  useEffect(() => {
    fetchAllMetaTags();
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.light }}>
      {/* Notification */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white z-50 transition-all duration-300 transform ${notification.show ? 'translate-x-0' : 'translate-x-full'}`}
          style={{
            backgroundColor: notification.type === 'success' ? colors.success : colors.error
          }}
        >
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <FiCheck className="mr-2" />
            ) : (
              <FiX className="mr-2" />
            )}
            {notification.message}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: colors.dark }}>SEO Meta Tags Manager</h1>
            <p className="text-gray-600 mt-1">Manage your website's search engine optimization</p>
          </div>
          <button
            onClick={() => {
              setCurrentPage(null);
              setIsEditing(false);
              setFormData({
                page: '',
                metaTitle: '',
                metaDescription: '',
                metaKeywords: '',
                canonicalUrl: ''
              });
            }}
            className="flex items-center px-4 py-3 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
            style={{
              backgroundColor: colors.primary,
              color: 'white',
              cursor: 'pointer'
            }}
          >
            <FiPlus className="mr-2" />
            Add New
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pages List */}
          <div
            className="rounded-xl shadow-md overflow-hidden border border-gray-200"
            style={{ backgroundColor: 'white' }}
          >
            <div
              className="p-5 border-b border-gray-200"
              style={{ backgroundColor: colors.primary }}
            >
              <h2 className="text-xl font-semibold text-white">Pages</h2>
            </div>
            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
              {loading && !metaTags.length ? (
                <div className="p-5 flex justify-center">
                  <div
                    className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2"
                    style={{ borderColor: colors.primary }}
                  ></div>
                </div>
              ) : metaTags.length > 0 ? (
                metaTags.map((meta) => (
                  <div
                    key={meta.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition ${currentPage?.page === meta.page ? 'bg-blue-50' : ''}`}
                    onClick={() => fetchPageMeta(meta.page)}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium" style={{ color: colors.dark }}>{meta.page}</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            fetchPageMeta(meta.page);
                            setIsEditing(true);
                          }}
                          className="flex items-center text-sm p-1 rounded hover:bg-gray-200"
                          style={{ color: colors.secondary, cursor: 'pointer' }}
                        >
                          <FiEdit2 className="mr-1" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(meta.page);
                          }}
                          className="flex items-center text-sm p-1 rounded hover:bg-gray-200"
                          style={{ color: colors.error, cursor: 'pointer' }}
                        >
                          <FiTrash2 className="mr-1" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 truncate">{meta.metaTitle}</p>
                  </div>
                ))
              ) : (
                <div className="p-5 text-center text-gray-500">
                  No meta tags found
                </div>
              )}
            </div>
          </div>

          {/* Form/Details Panel */}
          <div className="lg:col-span-2">
            {isEditing || !currentPage ? (
              <div
                className="rounded-xl shadow-md overflow-hidden border border-gray-200"
                style={{ backgroundColor: 'white' }}
              >
                <div
                  className="p-5 border-b border-gray-200 flex items-center"
                  style={{ backgroundColor: colors.primary }}
                >
                  {isEditing && (
                    <button
                      onClick={() => setIsEditing(false)}
                      className="mr-3 text-white"
                      style={{ cursor: 'pointer' }}
                    >
                      <FiArrowLeft />
                    </button>
                  )}
                  <h2 className="text-xl font-semibold text-white">
                    {isEditing ? `Edit ${formData.page} Meta Tags` : 'Create New Meta Tags'}
                  </h2>
                </div>
                <form onSubmit={handleSubmit} className="p-6">
                  <div className="space-y-5">
                    <div>
                      <label htmlFor="page" className="block text-sm font-medium mb-2" style={{ color: colors.dark }}>
                        Page
                      </label>
                      <input
                        type="text"
                        id="page"
                        name="page"
                        value={formData.page}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:border-transparent"
                        style={{
                          borderColor: colors.secondary,
                          focusRing: colors.accent,
                          color: '#000000',
                        }}
                        required
                        disabled={isEditing}
                        placeholder="e.g., home, about, contact"
                      />
                    </div>

                    <div>
                      <label htmlFor="metaTitle" className="block text-sm font-medium mb-2" style={{ color: colors.dark }}>
                        Meta Title
                      </label>
                      <input
                        type="text"
                        id="metaTitle"
                        name="metaTitle"
                        value={formData.metaTitle}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:border-transparent"
                        style={{
                          borderColor: colors.secondary,
                          focusRing: colors.accent,
                          color: '#000000',
                        }}
                        required
                        placeholder="Page title for search engines"
                      />
                      <p className="mt-1 text-xs" style={{ color: colors.secondary }}>
                        Recommended: 50-60 characters ({formData.metaTitle?.length || 0}/60)
                      </p>
                    </div>

                    <div>
                      <label htmlFor="metaDescription" className="block text-sm font-medium mb-2" style={{ color: colors.dark }}>
                        Meta Description
                      </label>
                      <textarea
                        id="metaDescription"
                        name="metaDescription"
                        rows="4"
                        value={formData.metaDescription}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:border-transparent"
                        style={{
                          borderColor: colors.secondary,
                          focusRing: colors.accent,
                          color: '#000000',
                        }}
                        required
                        placeholder="Brief description of the page"
                      ></textarea>
                      <p className="mt-1 text-xs" style={{ color: colors.secondary }}>
                        Recommended: 150-160 characters ({formData.metaDescription?.length || 0}/160)
                      </p>
                    </div>

                    <div>
                      <label htmlFor="metaKeywords" className="block text-sm font-medium mb-2" style={{ color: colors.dark }}>
                        Meta Keywords
                      </label>
                      <input
                        type="text"
                        id="metaKeywords"
                        name="metaKeywords"
                        value={formData.metaKeywords}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:border-transparent"
                        style={{
                          borderColor: colors.secondary,
                          focusRing: colors.accent,
                          color: '#000000',
                        }}
                        placeholder="Comma separated keywords"
                      />
                      <p className="mt-1 text-xs" style={{ color: colors.secondary }}>
                        Example: real estate, property
                      </p>
                    </div>

                    <div>
                      <label htmlFor="canonicalUrl" className="block text-sm font-medium mb-2" style={{ color: colors.dark }}>
                        Canonical URL
                      </label>
                      <input
                        type="url"
                        id="canonicalUrl"
                        name="canonicalUrl"
                        value={formData.canonicalUrl}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:border-transparent"
                        style={{
                          borderColor: colors.secondary,
                          focusRing: colors.accent,
                          color: '#000000',
                        }}
                        required
                        placeholder="https://realtraspaces.com/pagename"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.dark }}>
                      Terms & Conditions *
                    </label>
                    <div className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        required
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                      />
                      <p className="text-sm text-gray-600">
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
                  </div>

                  <div className="mt-8 flex justify-end space-x-3">
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 rounded-md shadow-sm text-sm font-medium transition-all duration-200"
                        style={{
                          backgroundColor: 'white',
                          color: colors.primary,
                          border: `1px solid ${colors.primary}`,
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 rounded-md shadow-sm text-sm font-medium text-white transition-all duration-200 hover:shadow-md flex items-center"
                      style={{
                        backgroundColor: loading ? colors.secondary : colors.primary,
                        opacity: loading ? 0.7 : 1,
                        cursor: loading ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {loading && (
                        <div
                          className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"
                        ></div>
                      )}
                      {isEditing ? 'Update Meta Tags' : 'Create Meta Tags'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div
                className="rounded-xl shadow-md overflow-hidden border border-gray-200"
                style={{ backgroundColor: 'white' }}
              >
                <div
                  className="p-5 border-b border-gray-200 flex justify-between items-center"
                  style={{ backgroundColor: colors.primary }}
                >
                  <h2 className="text-xl font-semibold text-white capitalize">{currentPage.page} Meta Tags</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        fetchPageMeta(currentPage.page);
                        setIsEditing(true);
                      }}
                      className="flex items-center text-sm text-white p-1 rounded hover:bg-blue-700"
                      style={{ cursor: 'pointer' }}
                    >
                      <FiEdit2 className="mr-1" />
                    </button>
                    <button
                      onClick={() => handleDelete(currentPage.page)}
                      className="flex items-center text-sm text-white p-1 rounded hover:bg-blue-700"
                      style={{ cursor: 'pointer' }}
                    >
                      <FiTrash2 className="mr-1" />
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-5">
                  <DetailItem
                    label="Meta Title"
                    value={currentPage.metaTitle}
                    color={colors.dark}
                  />
                  <DetailItem
                    label="Meta Description"
                    value={currentPage.metaDescription}
                    color={colors.dark}
                  />
                  <DetailItem
                    label="Meta Keywords"
                    value={currentPage.metaKeywords}
                    color={colors.dark}
                  />
                  <DetailItem
                    label="Canonical URL"
                    value={currentPage.canonicalUrl}
                    color={colors.dark}
                    isUrl={true}
                  />
                  <div className="pt-4 border-t border-gray-200">
                    <DetailItem
                      label="Last Updated"
                      value={new Date(currentPage.updatedAt).toLocaleString()}
                      color={colors.dark}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component for detail items
const DetailItem = ({ label, value, color, isUrl = false }) => (
  <div>
    <h3 className="text-sm font-medium mb-1" style={{ color }}>
      {label}
    </h3>
    {isUrl ? (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="break-all block"
        style={{ color: '#5B9CBD' }}
      >
        {value}
      </a>
    ) : (
      <p className="break-words" style={{ color }}>
        {value || '-'}
      </p>
    )}
  </div>
);

export default SEOMetaManager;