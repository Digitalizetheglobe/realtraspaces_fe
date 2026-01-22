'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

interface Application {
  id: number;
  jobId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  currentCompany: string;
  linkedInProfileLink: string;
  experienceYears: number;
  resume: string;
  additionalDocuments: string[];
  status: 'under_review' | 'rejected' | 'offered' | 'hired' | 'selected_for_next_round';
  createdAt: string;
}

interface Job {
  id: number;
  jobTitle: string;
  jobId: string;
}

interface PageProps {
  params: Promise<{ jobId: string }>;
}

const ApplicationsPage = ({ params }: PageProps) => {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const resolvedParams = use(params);
  const jobId = resolvedParams.jobId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobResponse = await fetch(`https://api.realtraspaces.com/api/jobs/${jobId}`);
        if (!jobResponse.ok) {
          throw new Error('Failed to fetch job details');
        }
        const jobData = await jobResponse.json();
        setJob(jobData.data);

        const applicationsResponse = await fetch(`https://api.realtraspaces.com/api/applications/job/${jobId}`);
        if (!applicationsResponse.ok) {
          throw new Error('Failed to fetch applications');
        }
        const applicationsData = await applicationsResponse.json();

        // Ensure applications is an array
        let applicationsArray: Application[] = [];
        if (Array.isArray(applicationsData)) {
          applicationsArray = applicationsData;
        } else if (applicationsData.applications) {
          applicationsArray = Array.isArray(applicationsData.applications) ? applicationsData.applications : [];
        } else if (applicationsData.data) {
          applicationsArray = Array.isArray(applicationsData.data) ? applicationsData.data : [];
        }

        setApplications(applicationsArray);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
        setApplications([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId]);

  const handleStatusUpdate = async (applicationId: number, newStatus: Application['status']) => {
    try {
      const response = await fetch(`https://api.realtraspaces.com/api/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update application status');
      }

      setApplications(applications.map(app =>
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'offered': return 'bg-green-100 text-green-800';
      case 'hired': return 'bg-blue-100 text-blue-800';
      case 'selected_for_next_round': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
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
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
          {job && (
            <p className="text-gray-600 mt-2">
              For: {job.jobTitle} (ID: {job.jobId})
            </p>
          )}
        </div>
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Back to Jobs
        </button>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No applications found for this job.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((application) => (
            <div
              key={application.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {application.firstName} {application.lastName}
                    </h2>
                    <p className="text-gray-600">{application.email}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(application.status)}`}>
                    {application.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-600"><span className="font-medium">Phone:</span> {application.phone}</p>
                    <p className="text-gray-600"><span className="font-medium">Company:</span> {application.currentCompany}</p>
                    <p className="text-gray-600"><span className="font-medium">Experience:</span> {application.experienceYears} years</p>
                  </div>
                  <div>
                    <p className="text-gray-600">
                      <span className="font-medium">LinkedIn:</span>{' '}
                      <a href={application.linkedInProfileLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">View</a>
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Resume:</span>{' '}
                      <a href={application.resume} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">Download</a>
                    </p>
                  </div>
                </div>

                {application.additionalDocuments?.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-700 mb-2">Additional Documents:</h3>
                    <div className="flex flex-wrap gap-2">
                      {application.additionalDocuments.map((doc, index) => (
                        <a
                          key={index}
                          href={doc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Document {index + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Applied on: {new Date(application.createdAt).toLocaleDateString()}
                  </p>
                  <div className="space-x-2">
                    <select
                      value={application.status}
                      onChange={(e) => handleStatusUpdate(application.id, e.target.value as Application['status'])}
                      className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="under_review">Under Review</option>
                      <option value="selected_for_next_round">Selected for Next Round</option>
                      <option value="offered">Offered</option>
                      <option value="hired">Hired</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
