"use client";

// BenefitsSection.jsx
import React, { useState, useEffect } from 'react';
import { ArrowRight, Upload, MapPin, Clock, Users, Award, Target, Heart } from "lucide-react";
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';
import PageWithSeo from "../../components/PageWithSeo";

// Define TypeScript interfaces outside the component
interface Job {
  id: number;
  jobTitle?: string;
  jobId?: string;
  location?: string;
  jobType?: string;
  experienceLevel?: string;
  salaryRange?: string;
  postedDate?: string;
  applicationDeadline?: string;
  jobDescription?: string;
  requirements?: string;
  benefits?: string;
  additionalDocFiles?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface FormattedJob {
  id: number;
  jobTitle: string;
  location: string;
  jobType: string;
  link: string;
}

const BenefitsSection = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    message: string;
    resume: File | null;
  }>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    message: '',
    resume: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });
  const [fileName, setFileName] = useState('');
  const [fileError, setFileError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp'
      ];

      if (allowedTypes.includes(file.type)) {
        setFormData((prev: typeof formData) => ({ ...prev, resume: file }));
        setFileName(file.name);
        setFileError('');
      } else {
        setFileError('Only PDF, JPEG, PNG, JPG, GIF, and WebP files are allowed.');
        setFormData((prev: typeof formData) => ({ ...prev, resume: null }));
        setFileName('');
        // Clear the file input
        e.target.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submissionData = new FormData();
      submissionData.append('first_name', formData.firstName);
      submissionData.append('last_name', formData.lastName);
      submissionData.append('phone_number', formData.phone);
      submissionData.append('email_id', formData.email);
      submissionData.append('message', formData.message);
      if (formData.resume) {
        submissionData.append('cv_file', formData.resume);
      }

      const response = await fetch('https://api.realtraspaces.com/api/cv-submissions/submit', {
        method: 'POST',
        body: submissionData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit CV');
      }

      const result = await response.json();

      if (result.success) {
        setSubmitStatus({
          success: true,
          message: result.message || 'CV submitted successfully!'
        });

        setFormData({
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
          message: '',
          resume: null
        });
        setFileName('');
      } else {
        throw new Error(result.message || 'Failed to submit CV');
      }

    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        success: false,
        message: 'There was an error submitting your CV. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const [jobs, setJobs] = useState<FormattedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.realtraspaces.com'}/api/jobs`);

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const result = await response.json();

        // Check if the structure matches { data: [...] }
        const jobsData = Array.isArray(result) ? result : (result.data || []);

        const formattedJobs: FormattedJob[] = jobsData.map((job: Job) => ({
          id: job.id,
          jobTitle: job.jobTitle || 'Job Opening',
          location: job.location || 'Remote',
          jobType: job.jobType || 'Full-time',
          link: '#apply'
        }));

        setJobs(formattedJobs);
        setError(null);
      } catch (err) {
        console.error('Error fetching job opportunities:', err);
        setError('Failed to load job opportunities. Please try again later.');

        // Fallback data for demo
        setJobs([
          {
            id: 1,
            jobTitle: 'Senior Property Manager',
            location: 'New York, NY',
            jobType: 'Full-time',
            link: '#apply'
          },
          {
            id: 2,
            jobTitle: 'Real Estate Marketing Specialist',
            location: 'Los Angeles, CA',
            jobType: 'Full-time',
            link: '#apply'
          },
          {
            id: 3,
            jobTitle: 'Digital Innovation Manager',
            location: 'Remote',
            jobType: 'Full-time',
            link: '#apply'
          },
          {
            id: 4,
            jobTitle: 'Client Relations Coordinator',
            location: 'Miami, FL',
            jobType: 'Full-time',
            link: '#apply'
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <PageWithSeo page="career">
      <div style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 400, fontSize: '16px', lineHeight: '140%' }}>
        {/* Hero Section */}
        <section
          id="top"
          className="relative min-h-screen bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/assets/hero.jpg')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>

          <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
            <div className="text-center max-w-4xl mx-auto text-white">
              <p className="uppercase tracking-[2px] text-white mb-6 font-medium text-sm">
                CAREERS AT REALTRA SPACES
              </p>

              <h1 className="text-white mb-8 font-light text-5xl md:text-7xl leading-tight tracking-wide">
                Shape the Future of <br />
                <span className="text-white font-medium">Real Estate</span>
              </h1>

              <p className="text-xl mb-10 max-w-2xl mx-auto leading-relaxed text-gray-200" >
                Join our innovative team where cutting-edge technology meets exceptional real estate expertise.
                Build your career with industry leaders who are redefining property experiences.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="#open-roles">
                  <button className="bg-black hover:bg-white text-white hover:text-black font-medium px-8 py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105">
                    Explore Opportunities
                    <ArrowRight size={18} />
                  </button>
                </Link>

                <Link href="#culture">
                  <button className="border-2 border-white text-white hover:bg-white hover:text-black font-medium px-8 py-4 rounded-lg transition-all duration-300">
                    Our Culture
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Company Mission Section */}
        <section className="py-20" style={{ backgroundColor: '#F1F1F4' }}>
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why Work With Us?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We&apos;re looking for passionate individuals who share our vision of transforming the real estate industry. Join our team and be part of something extraordinary.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: <Target className="w-8 h-8 text-black" />,
                    title: 'Innovation First',
                    desc: 'We leverage cutting-edge technology to transform how people discover, buy, and sell properties.'
                  },
                  {
                    icon: <Users className="w-8 h-8 text-black" />,
                    title: 'People-Centered',
                    desc: 'Our success is built on putting clients and team members at the heart of everything we do.'
                  },
                  {
                    icon: <Award className="w-8 h-8 text-black" />,
                    title: 'Excellence Driven',
                    desc: 'We maintain the highest standards in service delivery and professional growth.'
                  }
                ].map((item, index) => (
                  <div key={index} className="text-center p-6" data-aos="fade-up" data-aos-delay={index * 100}>
                    <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      {item.icon}
                    </div>
                    <h3 className="text-2xl font-medium text-black mb-4">{item.title}</h3>
                    <p className="leading-relaxed" style={{ color: '#6E6E73' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="culture" className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <p className="uppercase text-sm font-medium tracking-wider text-black mb-4">
                EMPLOYEE BENEFITS
              </p>
              <h2 className="text-4xl md:text-5xl font-light text-black mb-6">
                Your Career, Our Investment
              </h2>
              <p className="text-xl max-w-3xl mx-auto" style={{ color: '#6E6E73' }}>
                We believe in comprehensive support that goes beyond just a paycheck.
                Your growth and well-being are our priority.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Heart className="w-6 h-6 text-white" />,
                  title: 'Comprehensive Health',
                  desc: 'Premium medical, dental, vision, and mental health coverage for you and your family',
                  color: 'bg-black'
                },
                {
                  icon: <Target className="w-6 h-6 text-white" />,
                  title: 'Professional Growth',
                  desc: 'Generous education budget, mentorship programs, and career advancement opportunities',
                  color: 'bg-black'
                },
                {
                  icon: <Users className="w-6 h-6 text-white" />,
                  title: 'Work-Life Balance',
                  desc: 'Flexible schedules, remote work options, and unlimited PTO policy',
                  color: 'bg-black'
                },
                {
                  icon: <Award className="w-6 h-6 text-white" />,
                  title: 'Equity & Ownership',
                  desc: 'Stock options and profit-sharing programs to share in our collective success',
                  color: 'bg-black'
                },
                {
                  icon: <MapPin className="w-6 h-6 text-white" />,
                  title: 'Modern Workspace',
                  desc: 'State-of-the-art offices, latest technology, and collaborative work environments',
                  color: 'bg-black'
                },
                {
                  icon: <Clock className="w-6 h-6 text-white" />,
                  title: 'Performance Rewards',
                  desc: 'Competitive salaries, performance bonuses, and recognition programs',
                  color: 'bg-black'
                }
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  style={{ backgroundColor: '#F1F1F4' }}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className={`${benefit.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-black mb-3">{benefit.title}</h3>
                  <p className="leading-relaxed" style={{ color: '#6E6E73' }}>{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Roles Section */}
        <section id="open-roles" className="py-20" style={{ backgroundColor: '#F1F1F4' }}>
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <p className="uppercase text-sm font-medium tracking-wider text-black mb-4">
                CURRENT OPENINGS
              </p>
              <h2 className="text-4xl md:text-5xl font-light text-black mb-6">
                Find Your Perfect Role
              </h2>
              <p className="text-xl max-w-3xl mx-auto" style={{ color: '#6E6E73' }}>
                Discover opportunities that match your skills and ambitions. Join our team of
                professionals who are passionate about redefining real estate.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Job Listings */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl border-2 border-black overflow-hidden">
                  {isLoading ? (
                    <div className="p-8 text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                      <p style={{ color: '#6E6E73' }}>Loading opportunities...</p>
                    </div>
                  ) : error ? (
                    <div className="p-8 text-center">
                      <p className="text-black mb-4">{error}</p>
                      <button
                        onClick={() => window.location.reload()}
                        className="text-black hover:underline font-medium"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : jobs.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="mb-4" style={{ color: '#6E6E73' }}>No open positions at the moment.</p>
                      <p className="text-sm" style={{ color: '#6E6E73' }}>Check back soon for new opportunities!</p>
                    </div>
                  ) : (
                    jobs.map((job, index) => (
                      <Link
                        key={job.id}
                        href={job.link}
                        className={`block p-6 hover:bg-white transition-all duration-300 border-b-2 border-black last:border-b-0 group ${index === 0 ? 'bg-white' : ''
                          }`}
                        style={{ backgroundColor: index === 0 ? '#F1F1F4' : 'transparent' }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-black mb-2 group-hover:text-black transition-colors">
                              {job.jobTitle}
                            </h3>
                            <div className="flex items-center gap-4" style={{ color: '#6E6E73' }}>
                              <span className="flex items-center gap-1">
                                <MapPin size={16} />
                                {job.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={16} />
                                {job.jobType}
                              </span>
                            </div>
                          </div>
                          <div className="bg-black text-white p-3 rounded-full group-hover:bg-white group-hover:text-black transition-colors border-2 border-black">
                            <ArrowRight size={18} />
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>

              {/* Image/Info Panel */}
              <div className="lg:col-span-1">
                <div className="bg-black rounded-xl p-8 text-white h-full">
                  <h3 className="text-2xl font-semibold mb-4 text-white">Ready to Apply?</h3>
                  <p className="mb-6 leading-relaxed" style={{ color: '#6E6E73' }}>
                    Don&apos;t see a role that fits? We&apos;re always looking for talented individuals
                    who share our passion for innovation in real estate.
                  </p>
                  <Link href="#apply">
                    <button className="bg-white hover:bg-black text-black hover:text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 border-2 border-white">
                      Submit Your Resume
                      <ArrowRight size={16} />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Application Section */}
        <section id="apply" className="py-20 bg-white">
          <div className="container max-w-4xl mx-auto px-4">
            <div className="rounded-2xl shadow-xl overflow-hidden border-2 border-black" style={{ backgroundColor: '#F1F1F4' }}>
              <div className="p-8 md:p-12">
                <div className="text-center mb-12">
                  <p className="uppercase text-sm font-medium tracking-wider text-black mb-4">
                    JOIN OUR TEAM
                  </p>
                  <h2 className="text-4xl md:text-5xl font-light text-black mb-6">
                    Start Your Journey
                  </h2>
                  <p className="text-xl max-w-2xl mx-auto" style={{ color: '#6E6E73' }}>
                    Ready to be part of something extraordinary? Submit your application and
                    let&apos;s discuss how you can contribute to our mission.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* File Upload */}
                  <div className="mb-8">
                    <label
                      htmlFor="resume"
                      className="flex items-center justify-center py-4 px-6 border-2 border-dashed border-black rounded-xl cursor-pointer hover:bg-white transition-all duration-300"
                    >
                      <div className="text-center">
                        <Upload className="mx-auto mb-2 text-black" size={24} />
                        <span className="text-black font-medium">
                          {fileName || 'Upload Your Resume'}
                        </span>
                        <p className="text-sm mt-1" style={{ color: '#6E6E73' }}>PDF, JPEG, PNG, JPG, GIF, or WebP format</p>
                      </div>
                      <input
                        type="file"
                        id="resume"
                        name="resume"
                        accept=".pdf,.jpeg,.jpg,.png,.gif,.webp"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* File Error Message */}
                  {fileError && (
                    <div className="mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm font-medium">{fileError}</p>
                    </div>
                  )}

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Cover Letter / Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 bg-white"
                      placeholder="Tell us about yourself and why you're interested in joining Realtra Spaces..."
                      style={{ color: '#6E6E73' }}
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Terms & Conditions *
                    </label>
                    <div className="flex items-start space-x-2 text-left">
                      <input
                        type="checkbox"
                        required
                        className="w-4 h-4 mt-1 text-black border-2 border-black rounded focus:ring-black"
                      />
                      <p className="text-sm" style={{ color: '#6E6E73' }}>
                        I agree to the{' '}
                        <Link href="/terms-and-condition" className="text-black underline">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy-policy" className="text-black underline">
                          Privacy Policy
                        </Link>
                        .
                      </p>
                    </div>
                  </div>

                  <div className="text-center pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-black hover:bg-white text-white hover:text-black font-medium px-8 py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 mx-auto hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                      {!isSubmitting && <ArrowRight size={18} />}
                    </button>
                  </div>

                  {/* Status Message */}
                  {submitStatus.message && (
                    <div className={`mt-6 p-4 rounded-lg text-center border-2 ${submitStatus.success
                      ? 'bg-white border-black text-black'
                      : 'bg-white border-black text-black'
                      }`}>
                      {submitStatus.message}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageWithSeo>
  );
};

export default BenefitsSection;