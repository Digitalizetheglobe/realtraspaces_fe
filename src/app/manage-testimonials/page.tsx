'use client';

import { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiStar, FiPlus, FiCheck, FiX } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Testimonial {
  id: number;
  name: string;
  testimonial: string;
  rating: number;
  isActive: boolean;
  createdAt: string;
}

const ManageTestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    testimonial: '',
    rating: 5,
    isActive: true
  });
  const router = useRouter();

  // Color scheme
  const colors = {
    primary: '#2D5F7D',
    secondary: '#5B9CBD',
    accent: '#E8A75D',
    light: '#F5F9FC',
    dark: '#1A3A4A',
    success: '#4CAF50',
    error: '#F44336'
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.realtraspaces.com/api/testimonials');
      if (!response.ok) throw new Error('Failed to fetch testimonials');
      const { data } = await response.json();
      setTestimonials(data || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('https://api.realtraspaces.com/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTestimonial)
      });

      if (!response.ok) throw new Error('Failed to add testimonial');

      const { data } = await response.json();
      setTestimonials([...testimonials, data]);
      setShowForm(false);
      setNewTestimonial({
        name: '',
        testimonial: '',
        rating: 5,
        isActive: true
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const response = await fetch(`https://api.realtraspaces.com/api/testimonials/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete testimonial');

      setTestimonials(testimonials.filter(t => t.id !== id));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const handleStatusChange = async (id: number, isActive: boolean) => {
    try {
      const response = await fetch(`https://api.realtraspaces.com/api/testimonials/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive })
      });

      if (!response.ok) throw new Error('Failed to update status');

      setTestimonials(testimonials.map(t =>
        t.id === id ? { ...t, isActive } : t
      ));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const renderStars = (rating: number, interactive = false, onChange?: (rating: number) => void) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={interactive ? () => onChange?.(star) : undefined}
            className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} ${interactive ? 'hover:scale-110 transition-transform' : ''
              }`}
          >
            <FiStar />
          </button>
        ))}
      </div>
    );
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

  return (
    <ProtectedRoute>
      <div className="min-h-screen" style={{ backgroundColor: colors.light }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: colors.dark }}>
                Testimonials Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage client testimonials and their visibility
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
              style={{
                backgroundColor: colors.primary,
                color: 'white'
              }}
            >
              <FiPlus className="mr-2" />
              Add Testimonial
            </button>
          </div>

          {/* Add Testimonial Form */}
          {showForm && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 border border-gray-200">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold" style={{ color: colors.dark }}>
                    Add New Testimonial
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <FiX />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.dark }}>
                      Client Name
                    </label>
                    <input
                      type="text"
                      value={newTestimonial.name}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:border-transparent"
                      style={{
                        borderColor: colors.secondary,
                      }}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.dark }}>
                      Testimonial Content
                    </label>
                    <textarea
                      value={newTestimonial.testimonial}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, testimonial: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:border-transparent"
                      style={{
                        borderColor: colors.secondary,
                      }}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.dark }}>
                      Rating
                    </label>
                    {renderStars(newTestimonial.rating, true, (rating) =>
                      setNewTestimonial({ ...newTestimonial, rating })
                    )}
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={newTestimonial.isActive}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, isActive: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300 focus:ring-blue-500"
                      style={{
                        borderColor: colors.secondary,
                      }}
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                      Active
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.dark }}>
                      Terms & Conditions *
                    </label>
                    <div className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        required
                        className="h-4 w-4 rounded border-gray-300 focus:ring-blue-500"
                        style={{ borderColor: colors.secondary }}
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

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-6 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-md text-white hover:shadow-md transition-all flex items-center"
                      style={{
                        backgroundColor: colors.primary
                      }}
                    >
                      <FiCheck className="mr-2" />
                      Save Testimonial
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Testimonials Grid */}
          {testimonials.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <p className="text-gray-600">No testimonials found. Add your first testimonial!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold" style={{ color: colors.dark }}>
                        {testimonial.name}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${testimonial.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {testimonial.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="mb-6">
                      <div className="mb-3">
                        {renderStars(testimonial.rating)}
                      </div>
                      <p className="text-gray-600">{testimonial.testimonial}</p>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500">
                        {new Date(testimonial.createdAt).toLocaleDateString()}
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => router.push(`/manage-testimonials/edit/${testimonial.id}`)}
                          className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleStatusChange(testimonial.id, !testimonial.isActive)}
                          className={`p-2 rounded-full transition-colors ${testimonial.isActive
                            ? 'text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50'
                            : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                            }`}
                          title={testimonial.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {testimonial.isActive ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="12" y1="8" x2="12" y2="16"></line>
                              <line x1="8" y1="12" x2="16" y2="12"></line>
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(testimonial.id)}
                          className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ManageTestimonialsPage;