'use client';

import { useState, FormEvent, ChangeEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import heroBackground from '@/public/images/7578550-uhd_3840_2160_30fps 1.png'; 
import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

export default function JobTitle() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JobTitleContent />
    </Suspense>
  );
}

function JobTitleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId') || '';
  
  const [formData, setFormData] = useState({
    jobId: jobId,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    currentCompany: '',
    linkedInProfile: '',
    portfolioUrl: '',
    experienceYears: '',
    currentSalary: '',
    expectedSalary: '',
    noticePeriod: '',
    coverLetter: '',
    resume: null as File | null,
    additionalDocuments: null as FileList | null
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      // For resume, we only need one file
      if (name === 'resume') {
        setFormData({
          ...formData,
          [name]: files[0]
        });
      } 
      // For additional documents, we can have multiple files
      else if (name === 'additionalDocuments') {
        setFormData({
          ...formData,
          [name]: files
        });
      }
      
      // Clear error when field is edited
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: ''
        });
      }
    }
  };
  
  const validateForm = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!formData.jobId) newErrors.jobId = 'Job ID is required';
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.experienceYears) newErrors.experienceYears = 'Years of experience is required';
    if (!formData.resume) newErrors.resume = 'Resume is required';
    
    return newErrors;
  };
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create FormData object to handle file uploads
      const submitData = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        const value = formData[key as keyof typeof formData];
        if (key === 'resume') {
          if (value) {
            submitData.append(key, value as File);
          }
        } else if (key === 'additionalDocuments') {
          if (value) {
            const files = value as FileList;
            Array.from(files).forEach((file, index) => {
              submitData.append(`${key}[${index}]`, file);
            });
          }
        } else if (value) {
          submitData.append(key, String(value));
        }
      });
      
      // Submit the form data
      const response = await fetch('https://api.propertydronerealty.com/applications/submit', {
        method: 'POST',
        body: submitData,
      });
      
      if (response.ok) {
        const result = await response.json();
        setSubmitMessage('Application submitted successfully!');
        
        // Redirect or clear form after successful submission
        setTimeout(() => {
          router.push('/dashboard/application-success');
        }, 2000);
      } else {
        const errorData = await response.json();
        setSubmitMessage(`Submission failed: ${errorData.message || 'Please try again later'}`);
      }
    } catch (error) {
      setSubmitMessage(`Error submitting form: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  interface JobData {
    jobTitle: string;
    location: string;
    jobType: string;
    experienceLevel: string;
    salaryRange: string;
    jobDescription: string;
    postedDate: string;
    applicationDeadline: string;
    jobId: string;
  }

  const [jobData, setJobData] = useState<JobData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Get the current URL path
        const path = window.location.pathname;
        // Extract the slug from the URL (last part after the final slash)
        const slug = path.substring(path.lastIndexOf('/') + 1);
        
        const response = await fetch("https://api.propertydronerealty.com/careers");
        if (!response.ok) {
          throw new Error("Failed to fetch job data");
        }
        
        const data = await response.json();
        
        if (slug && slug !== 'careers') {
          // Find the job that matches the slug (case insensitive)
            const matchingJob = data.find((job: JobData) => {
            // Extract job title or job ID to match with slug
            const jobSlug: string = job.jobTitle.toLowerCase().replace(/\s+/g, '-');
            const jobIdSlug: string = job.jobId.toLowerCase();
            return jobSlug === slug.toLowerCase() || jobIdSlug === slug.toLowerCase();
            });
          
          if (matchingJob) {
            setJobData(matchingJob);
          } else {
            // If no matching job, default to the first one
            setJobData(data[0]);
          }
        } else {
          // If on the main careers page, show the first job
          setJobData(data[0]);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Format date to be more readable
  

  // Format date to be more readable
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
     <> 
        <section className="relative min-h-screen">
      <div className="absolute inset-0 z-0">
        <Image 
          src={heroBackground}
          alt="Career Opportunity Background" 
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        <div className="absolute inset-0 bg-black opacity-40"></div>
      </div>
      
      {/* Hero Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-4xl mx-auto text-white">
          <p className="text-sm uppercase font-medium tracking-wider text-gray-300 mb-4">CAREER OPPORTUNITY</p>
          
          {loading ? (
            <h1 className="text-4xl md:text-5xl font-serif leading-tight mb-6">Loading job details...</h1>
          ) : error ? (
            <h1 className="text-4xl md:text-5xl font-serif leading-tight mb-6">Unable to load job data</h1>
          ) : jobData ? (
            <>
              <h1 className="text-4xl md:text-5xl font-serif leading-tight mb-6">
                {jobData.jobTitle}
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-gray-200">
                <div>
                  <p className="font-medium">Location</p>
                  <p>{jobData.location}</p>
                </div>
                <div>
                  <p className="font-medium">Position Type</p>
                  <p>{jobData.jobType} | {jobData.experienceLevel}</p>
                </div>
                <div>
                  <p className="font-medium">Salary Range</p>
                  <p>{jobData.salaryRange}</p>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg mb-8">
                <p className="text-gray-100 mb-4">
                  {jobData.jobDescription.substring(0, 150)}...
                </p>
                
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <p>
                    <span className="font-medium">Posted:</span> {formatDate(jobData.postedDate)}
                  </p>
                  <p>
                    <span className="font-medium">Application Deadline:</span> {formatDate(jobData.applicationDeadline)}
                  </p>
                  <p>
                    <span className="font-medium">Job ID:</span> {jobData.jobId}
                  </p>
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="bg-blue-900 text-white px-6 py-3 flex items-center justify-center gap-2 hover:bg-blue-800 transition-colors">
                  Apply Now
                </button>
                
              </div>
            </>
          ) : (
            <h1 className="text-4xl md:text-5xl font-serif leading-tight mb-6">No Job Listings Available</h1>
          )}
        </div>
      </div>
    </section>
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Job Application</h1>
          <p className="mt-2 text-gray-600">Complete the form below to apply</p>
        </div>
        
        {submitMessage && (
          <div className={`mb-6 p-4 rounded ${submitMessage.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {submitMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Job ID */}
            <div>
              <label htmlFor="jobId" className="block text-sm font-medium text-gray-700">
                Job ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="jobId"
                name="jobId"
                value={formData.jobId}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.jobId ? 'border-red-300' : ''}`}
                readOnly={!!jobId}
              />
              {errors.jobId && <p className="mt-1 text-sm text-red-600">{errors.jobId}</p>}
            </div>
            
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.firstName ? 'border-red-300' : ''}`}
              />
              {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
            </div>
            
            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.lastName ? 'border-red-300' : ''}`}
              />
              {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
            </div>
            
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.email ? 'border-red-300' : ''}`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
            
            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.phone ? 'border-red-300' : ''}`}
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>
            
            {/* Current Company */}
            <div>
              <label htmlFor="currentCompany" className="block text-sm font-medium text-gray-700">
                Current Company
              </label>
              <input
                type="text"
                id="currentCompany"
                name="currentCompany"
                value={formData.currentCompany}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            {/* LinkedIn Profile */}
            <div>
              <label htmlFor="linkedInProfile" className="block text-sm font-medium text-gray-700">
                LinkedIn Profile
              </label>
              <input
                type="url"
                id="linkedInProfile"
                name="linkedInProfile"
                value={formData.linkedInProfile}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
            
            {/* Portfolio URL */}
            <div>
              <label htmlFor="portfolioUrl" className="block text-sm font-medium text-gray-700">
                Portfolio URL
              </label>
              <input
                type="url"
                id="portfolioUrl"
                name="portfolioUrl"
                value={formData.portfolioUrl}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="https://yourportfolio.com"
              />
            </div>
            
            {/* Experience Years */}
            <div>
              <label htmlFor="experienceYears" className="block text-sm font-medium text-gray-700">
                Years of Experience <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="experienceYears"
                name="experienceYears"
                value={formData.experienceYears}
                onChange={handleChange}
                min="0"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.experienceYears ? 'border-red-300' : ''}`}
              />
              {errors.experienceYears && <p className="mt-1 text-sm text-red-600">{errors.experienceYears}</p>}
            </div>
            
            {/* Current Salary */}
            <div>
              <label htmlFor="currentSalary" className="block text-sm font-medium text-gray-700">
                Current Salary
              </label>
              <input
                type="text"
                id="currentSalary"
                name="currentSalary"
                value={formData.currentSalary}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g. $75,000"
              />
            </div>
            
            {/* Expected Salary */}
            <div>
              <label htmlFor="expectedSalary" className="block text-sm font-medium text-gray-700">
                Expected Salary
              </label>
              <input
                type="text"
                id="expectedSalary"
                name="expectedSalary"
                value={formData.expectedSalary}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g. $85,000"
              />
            </div>
            
            {/* Notice Period */}
            <div>
              <label htmlFor="noticePeriod" className="block text-sm font-medium text-gray-700">
                Notice Period
              </label>
              <input
                type="text"
                id="noticePeriod"
                name="noticePeriod"
                value={formData.noticePeriod}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g. 2 weeks"
              />
            </div>
          </div>
          
          {/* Cover Letter */}
          <div>
            <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700">
              Cover Letter
            </label>
            <textarea
              id="coverLetter"
              name="coverLetter"
              rows={4}
              value={formData.coverLetter}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Tell us why you're a good fit for this position..."
            ></textarea>
          </div>
          
          {/* Resume */}
          <div>
            <label htmlFor="resume" className="block text-sm font-medium text-gray-700">
              Resume <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 flex items-center">
              <input
                type="file"
                id="resume"
                name="resume"
                onChange={handleFileChange}
                className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${errors.resume ? 'border-red-300' : ''}`}
                accept=".pdf,.doc,.docx"
              />
            </div>
            {errors.resume && <p className="mt-1 text-sm text-red-600">{errors.resume}</p>}
            <p className="mt-1 text-xs text-gray-500">
              Accepted file formats: PDF, DOC, DOCX
            </p>
          </div>
          
          {/* Additional Documents */}
          <div>
            <label htmlFor="additionalDocuments" className="block text-sm font-medium text-gray-700">
              Additional Documents
            </label>
            <div className="mt-1 flex items-center">
              <input
                type="file"
                id="additionalDocuments"
                name="additionalDocuments"
                onChange={handleFileChange}
                multiple
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              You can select multiple files. Accepted file formats: PDF, DOC, DOCX, JPG, JPEG, PNG
            </p>
          </div>
          
          {/* Submit button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
     
     </>
  );
}