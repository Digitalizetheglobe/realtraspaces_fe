'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('https://api.realtraspaces.com/api/testimonials');
        if (!response.ok) {
          throw new Error('Failed to fetch testimonials');
        }
        const data = await response.json();
        
        // Ensure data is an array
        let testimonialsArray: Testimonial[] = [];
        if (Array.isArray(data)) {
          testimonialsArray = data;
        } else if (data.testimonials) {
          testimonialsArray = Array.isArray(data.testimonials) ? data.testimonials : [];
        } else if (data.data) {
          testimonialsArray = Array.isArray(data.data) ? data.data : [];
        }
        
        setTestimonials(testimonialsArray);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const response = await fetch(`https://api.realtraspaces.com/api/testimonials/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete testimonial');
      }

      setTestimonials(testimonials.filter(testimonial => testimonial.id !== id));
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
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) {
        throw new Error('Failed to update testimonial status');
      }

      setTestimonials(testimonials.map(testimonial => 
        testimonial.id === id ? { ...testimonial, isActive } : testimonial
      ));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <span
        key={index}
        className={`text-2xl ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="">
        <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Manage Testimonials</h1>
        <Link
          href="/manage-testimonials/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Testimonial
        </Link>
      </div>

      {testimonials.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No testimonials found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-700">{testimonial.name}</h2>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    testimonial.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {testimonial.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex mb-2">
                    {renderStars(testimonial.rating)}
                  </div>
                  <p className="text-gray-600">{testimonial.testimonial}</p>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Added: {new Date(testimonial.createdAt).toLocaleDateString()}
                  </p>
                  <div className="space-x-2">
                    <button
                      onClick={() => router.push(`/manage-testimonials/edit/${testimonial.id}`)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleStatusChange(testimonial.id, !testimonial.isActive)}
                      className={`text-sm px-2 py-1 rounded ${
                        testimonial.isActive
                          ? 'bg-red-100 text-red-800 hover:bg-red-200'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {testimonial.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </ProtectedRoute>
  );
};

export default ManageTestimonialsPage; 