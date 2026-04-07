'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Job {
    id: number;
    jobId: string;
    jobTitle: string;
    location: string;
    jobType: string;
    salaryRange: string;
    postedDate: string;
    isActive: boolean;
    applicationDeadline?: string;
}

interface Submission {
    id: number;
    first_name: string;
    last_name: string;
    phone_number: string;
    email_id: string;
    message: string | null;
    cv_file: string | null;
    cv_file_url?: string;
    status: 'pending' | 'reviewed' | 'contacted' | 'rejected';
    admin_notes: string | null;
    submission_date: string;
    created_at?: string;
}

export default function CareerManagementPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'jobs' | 'submissions'>('jobs');

    // Jobs State
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loadingJobs, setLoadingJobs] = useState(true);
    const [jobsError, setJobsError] = useState<string | null>(null);

    // Submissions State
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loadingSubmissions, setLoadingSubmissions] = useState(false);
    const [submissionsError, setSubmissionsError] = useState<string | null>(null);

    useEffect(() => {
        if (activeTab === 'jobs') {
            fetchJobs();
        } else {
            fetchSubmissions();
        }
    }, [activeTab]);

    const fetchJobs = async () => {
        try {
            setLoadingJobs(true);
            const response = await fetch('http://localhost:8000/api/jobs');
            if (!response.ok) {
                throw new Error('Failed to fetch jobs');
            }
            const data = await response.json();

            // Assuming the API returns { status: 'success', data: [...] }
            if (data.status === 'success' && Array.isArray(data.data)) {
                setJobs(data.data);
            } else {
                // Fallback if structure is different
                setJobs([]);
                console.error('Unexpected API response structure:', data);
            }
        } catch (err) {
            setJobsError(err instanceof Error ? err.message : 'An error occurred while fetching jobs');
            console.error(err);
        } finally {
            setLoadingJobs(false);
        }
    };

    const fetchSubmissions = async () => {
        try {
            setLoadingSubmissions(true);
            const response = await fetch('http://localhost:8000/api/cv-submissions');
            if (!response.ok) {
                throw new Error('Failed to fetch submissions');
            }
            const data = await response.json();

            if (data.success && Array.isArray(data.data)) {
                setSubmissions(data.data);
            } else {
                setSubmissions([]);
                console.error('Unexpected API response structure:', data);
            }
        } catch (err) {
            setSubmissionsError(err instanceof Error ? err.message : 'An error occurred while fetching submissions');
            console.error(err);
        } finally {
            setLoadingSubmissions(false);
        }
    };

    const handleDeleteJob = async (jobId: string) => {
        if (!confirm('Are you sure you want to deactivate this job?')) return;

        try {
            const response = await fetch(`http://localhost:8000/api/jobs/${jobId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete job');
            }

            // Refresh list
            fetchJobs();
        } catch (err) {
            alert('Error deleting job');
            console.error(err);
        }
    }

    const handleDeleteSubmission = async (id: number) => {
        if (!confirm('Are you sure you want to delete this submission?')) return;

        try {
            const response = await fetch(`http://localhost:8000/api/cv-submissions/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete submission');
            }

            // Refresh list
            fetchSubmissions();
        } catch (err) {
            alert('Error deleting submission');
            console.error(err);
        }
    }

    const LoadingSpinner = () => (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
    );

    const ErrorView = ({ error, onRetry }: { error: string, onRetry: () => void }) => (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <button
                className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 font-bold py-1 px-3 rounded text-sm"
                onClick={onRetry}
            >
                Retry
            </button>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Career Management</h1>
                    <p className="text-gray-500 mt-1">Manage job postings and applications</p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Tabs */}
                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('jobs')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'jobs'
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Job Postings
                        </button>
                        <button
                            onClick={() => setActiveTab('submissions')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'submissions'
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            CV Submissions
                        </button>
                    </div>

                    {activeTab === 'jobs' && (
                        <Link
                            href="/career-management/create"
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                        >
                            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create New Job
                        </Link>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
                {activeTab === 'jobs' ? (
                    // Jobs View
                    loadingJobs ? <LoadingSpinner /> : jobsError ? <ErrorView error={jobsError} onRetry={fetchJobs} /> : (
                        jobs.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
                                <p className="mt-1 text-sm text-gray-500">Get started by creating a new job posting.</p>
                                <div className="mt-6">
                                    <Link
                                        href="/career-management/create"
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Create Job
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Job Info
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Type / Salary
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Location
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Posted Date
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {jobs.map((job) => (
                                            <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div>
                                                            <div className="text-sm font-medium text-indigo-600 truncate max-w-xs" title={job.jobTitle}>
                                                                {job.jobTitle}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                ID: {job.jobId}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{job.jobType}</div>
                                                    <div className="text-sm text-gray-500">{job.salaryRange}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{job.location}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {new Date(job.postedDate).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${job.isActive
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {job.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end space-x-3">
                                                        <Link
                                                            href={`/career-management/edit/${job.jobId}`}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            className="text-red-600 hover:text-red-900"
                                                            onClick={() => handleDeleteJob(job.jobId)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    )
                ) : (
                    // Submissions View
                    loadingSubmissions ? <LoadingSpinner /> : submissionsError ? <ErrorView error={submissionsError} onRetry={fetchSubmissions} /> : (
                        submissions.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No submissions found</h3>
                                <p className="mt-1 text-sm text-gray-500">Wait for candidates to submit their CVs.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Candidate
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Contact Info
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Submitted Date
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                CV File
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {submissions.map((submission) => (
                                            <tr key={submission.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 flex-shrink-0">
                                                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                                                {submission.first_name.charAt(0)}{submission.last_name.charAt(0)}
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {submission.first_name} {submission.last_name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{submission.email_id}</div>
                                                    <div className="text-sm text-gray-500">{submission.phone_number}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {new Date(submission.submission_date || submission.created_at || Date.now()).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                        ${submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            submission.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                                                                submission.status === 'contacted' ? 'bg-green-100 text-green-800' :
                                                                    'bg-red-100 text-red-800'}`}>
                                                        {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {submission.cv_file_url ? (
                                                        <a
                                                            href={submission.cv_file_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                                                        >
                                                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            Download CV
                                                        </a>
                                                    ) : (
                                                        <span className="text-gray-400 italic">No file</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        className="text-red-600 hover:text-red-900"
                                                        onClick={() => handleDeleteSubmission(submission.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    )
                )}
            </div>
        </div>
    );
}
