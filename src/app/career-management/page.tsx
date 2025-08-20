'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Job {
  id: number;
  jobTitle: string;
  jobId: string;
  location: string;
  jobType: string;
  experienceLevel: string;
  salaryRange: string;
  postedDate: string;
  applicationDeadline: string;
  jobDescription: string;
  requirements: string[];
  benefits: string[];
  isActive: boolean;
}

const CareerManagementPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('https://api.realtraspaces.com/api/jobs');
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data = await response.json();
        
        // Ensure data is an array
        let jobsArray: Job[] = [];
        if (Array.isArray(data)) {
          jobsArray = data;
        } else if (data.jobs) {
          jobsArray = Array.isArray(data.jobs) ? data.jobs : [];
        } else if (data.data) {
          jobsArray = Array.isArray(data.data) ? data.data : [];
        }
        
        setJobs(jobsArray);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
        setJobs([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      const response = await fetch(`https://api.realtraspaces.com/api/jobs/${jobId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete job');
      }

      setJobs(jobs.filter(job => job.jobId !== jobId));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
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
      <>
        <div className="flex justify-between items-center ml-5 p-8">
        <h1 className="text-3xl font-bold text-gray-900">Career Management</h1>
        <Link
          href="/career-management/create"
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-transparent hover:text-black border border-black transition-colors"
        >
          Create New Job
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-5">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-black">{job.jobTitle}</h2>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  job.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {job.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-gray-600">
                  <span className="font-medium">Job ID:</span> {job.jobId}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Location:</span> {job.location}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Type:</span> {job.jobType}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Experience:</span> {job.experienceLevel}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Salary:</span> {job.salaryRange}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <Link
                  href={`/career-management/applications/${job.jobId}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Applications
                </Link>
                <div className="space-x-2">
                  {/* <button
                    onClick={() => router.push(`/career-management/edit/${job.jobId}`)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button> */}
                  <button
                    onClick={() => handleDeleteJob(job.jobId)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      </>
    </ProtectedRoute>
  );
};

export default CareerManagementPage; 