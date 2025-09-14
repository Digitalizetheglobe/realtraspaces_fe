"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Globe, Book, Zap, ArrowRight, Star, Award, Users, Home, CheckCircle, Calendar } from 'lucide-react';
import developer3 from "../../../public/assets/developer3.jpg";
import Image from "next/image";
import SeoHead from "../../components/SeoHead";
import PageWithSeo from "../../components/PageWithSeo";
import { getTeamImageUrl, getDeveloperImageUrl, getAwardImageUrl } from "../../utils/imageUtils";

// Team member interface
interface TeamMember {
  id: number;
  full_name: string;
  description: string;
  linkedin_url: string;
  designation: string;
  photo: string | null;
  is_working: number;
  created_at: string;
  updated_at: string;
  image: string;
  name: string;
  role: string;
  linkedin: string;
}

// Award interface
interface Award {
  id: number;
  award_title: string;
  award_image: string;
  demo_field: string;
  status: boolean;
  created_at: string;
  updated_at: string;
  award_image_url: string;
}

// Developer interface
interface Developer {
  id: number;
  buildername: string;
  builder_logo: string;
  descriptions: string;
  project_name: string[];
  status: boolean;
  created_at: string;
  updated_at: string;
  images: string[];
  image_urls: string[];
}

// Colors object
const colors = {
  primary: '#3B82F6'
};

// Format date utility function
const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return 'Invalid Date';
  }
};

// Gallery images
interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  size: 'small' | 'large';
  developerName?: string;
  developerLink?: string;
  description?: string;
  projectCount?: number;
  status?: boolean;
}

const DUMMY_IMAGES = {
  heroVideo: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&h=1080&fit=crop",
  founder: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
  cofounder: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop",
  team1: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=400&fit=crop",
  team2: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=400&fit=crop",
  team3: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=400&fit=crop",
  award1: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=300&fit=crop",
  award2: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
  award3: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
  consultationBg: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=800&fit=crop"
};

// Gallery images




// Awards data


// Counter hook
const useCounter = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);
  
  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [end, duration, isVisible]);

  return { count, ref };
};

export default function RealtraSpacesAbout() {

  const [modalImage, setModalImage] = useState<string | null>(null);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [awardsLoading, setAwardsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [awardsError, setAwardsError] = useState<string | null>(null);
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal handlers
  const openModal = (developer: Developer) => {
    setSelectedDeveloper(developer);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDeveloper(null);
    document.body.style.overflow = 'unset'; // Restore scrolling
  };

  // Fetch team members function
  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.realtraspaces.com'}/api/team/`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success && data.data) {
        console.log('Team API response:', data.data);
        // Filter only active team members and add default image if photo is null
        const activeMembers = data.data
          .filter((member: TeamMember) => member.is_working === 1)
          .map((member: TeamMember) => ({
            ...member,
            image: member.photo ? getTeamImageUrl(member.photo) : DUMMY_IMAGES.team1, // Use proper team image URL
            name: member.full_name,
            role: member.designation,
            linkedin: member.linkedin_url
          }));
        console.log('Processed team members:', activeMembers);
        console.log('Team member images:', activeMembers.map((m: any) => ({ name: m.name, image: m.image })));
        setTeamMembers(activeMembers);
      } else {
        console.warn('API response indicates no success or no data');
        setTeamMembers([]);
        setError('No team data available');
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
      // Fallback to empty array
      setTeamMembers([]);
      setError('Failed to load team members. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch developers for gallery
  const fetchDevelopers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.realtraspaces.com'}/api/developers`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success && data.data) {
        console.log('Developers API response:', data.data);
        
        // Process developers and create gallery images - using image_urls from API response only
        const processedImages: GalleryImage[] = data.data
          .filter((developer: any) => developer.image_urls && developer.image_urls.length > 0)
          .map((developer: any) => {
            // Get the first image URL from developer.image_urls array (this is the full URL)
            const firstImageUrl = developer.image_urls[0];
            console.log(`Processing developer ${developer.buildername}:`, {
              id: developer.id,
              image_urls: developer.image_urls,
              firstImageUrl: firstImageUrl
            });
            
            return {
              id: developer.id.toString(),
              src: firstImageUrl, // Use the full URL directly from image_urls
              alt: `${developer.buildername} - Property Development`,
              size: Math.random() > 0.5 ? 'large' : 'small' as 'small' | 'large',
              developerName: developer.buildername,
              developerLink: `/developers/${developer.id}`,
              // Add additional properties for better display
              description: developer.descriptions || 'No description available',
              projectCount: developer.project_name ? developer.project_name.length : 0,
              status: developer.status
            };
          });
        
        console.log('Processed gallery images:', processedImages);
        setGalleryImages(processedImages);
      } else {
        console.warn('Developers API response indicates no success or no data');
        setGalleryImages([]);
      }
    } catch (error) {
      console.error('Error fetching developers:', error);
      setGalleryImages([]);
    }
  };

  // Fetch awards function
  const fetchAwards = async () => {
    try {
      setAwardsLoading(true);
      setAwardsError(null);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.realtraspaces.com'}/api/awards/`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Awards API response:', data);
      
      if (data.success && data.data) {
        // Filter only active awards and process the data
        const activeAwards = data.data
          .filter((award: Award) => award.status === true)
          .map((award: Award) => ({
            ...award,
            id: award.id,
            src: award.award_image_url,
            alt: award.award_title || 'Award',
            title: award.award_title,
            description: award.demo_field || ''
          }));
        
        console.log('Processed awards:', activeAwards);
        setAwards(activeAwards);
      } else {
        console.warn('Awards API response indicates no success or no data');
        setAwards([]);
        setAwardsError('No awards data available');
      }
    } catch (error) {
      console.error('Error fetching awards:', error);
      setAwards([]);
      setAwardsError('Failed to load awards. Please try again later.');
    } finally {
      setAwardsLoading(false);
    }
  };

  // Fetch team members from API on component mount
  useEffect(() => {
    fetchTeamMembers();
    fetchDevelopers();
    fetchAwards();
  }, []);

  // Create counter components outside of render
  const YearsCounter = () => {
    const { count, ref } = useCounter(8);
    return (
      <div ref={ref}>
        <h3 className="text-5xl font-bold text-gray-300 mb-2">
          {count}+
        </h3>
        <p className="text-xl text-white">Years in Business</p>
      </div>
    );
  };

  const PropertiesCounter = () => {
    const { count, ref } = useCounter(1250);
    return (
      <div ref={ref}>
        <h3 className="text-5xl font-bold text-gray-300 mb-2">
          {count}+
        </h3>
        <p className="text-xl text-white">Properties Sold</p>
      </div>
    );
  };

  const ClientsCounter = () => {
    const { count, ref } = useCounter(500);
    return (
      <div ref={ref}>
        <h3 className="text-5xl font-bold text-gray-300 mb-2">
          {count}+
        </h3>
        <p className="text-xl text-white">Happy Clients</p>
      </div>
    );
  };

  const AwardsCounter = () => {
    const { count, ref } = useCounter(25);
    return (
      <div ref={ref}>
        <h3 className="text-5xl font-bold text-gray-300 mb-2">
          {count}+
        </h3>
        <p className="text-xl text-white">Awards Won</p>
      </div>
    );
  };

  return (
    <PageWithSeo page="about">
    <div className="w-full bg-white">
      <SeoHead />
      {/* Hero Section */}
      <section className="relative  flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={developer3}
            alt="Modern Real Estate"
            width={800}
            height={600}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30"></div>
        </div>

        {/* Hero Content */}
        <div className="relative  pt-16 z-10 container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-block px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <p className="text-white font-medium tracking-wider text-sm">
                ABOUT REALTRA SPACES
              </p>
            </div>
            
            <h1 className="text-5xl md:text-5xl font-bold mb-4 leading-tight">
              Realtra Spaces – Redefining Commercial Real Estate
            </h1>
            
            <p className="text-xl md:text-xl text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed">
              Real & Transparent
            </p>
            
            <p className="text-lg md:text-lg text-gray-300 mb-4 max-w-4xl mx-auto leading-relaxed">
              At Realtra Spaces, we are redefining the way businesses lease, buy, and invest in commercial real estate. With over a decade of industry expertise, we bring transparency, data-driven insights, and verified listings to help companies, startups, and investors make smarter property decisions.
            </p>
            
            <p className="text-lg md:text-lg text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Our mission is simple: to make commercial real estate easy, transparent, and growth-focused—so you can focus on building your business while we take care of the space.
            </p>
            
            
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-black py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Years in Business */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center text-white"
            >
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-black" />
              </div>
              <YearsCounter />
            </motion.div>

            {/* Properties Sold */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center text-white"
            >
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-black" />
              </div>
              <PropertiesCounter />
            </motion.div>

            {/* Happy Clients */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center text-white"
            >
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-black" />
              </div>
              <ClientsCounter />
            </motion.div>

            {/* Awards Won */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center text-white"
            >
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-black" />
              </div>
              <AwardsCounter />
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20" style={{ backgroundColor: '#F5F5FF99' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
                Who We Are 
              </h2> 
              <p className="text-lg text-gray-600 leading-relaxed">
                Realtra Spaces is a premier real estate company dedicated to providing exceptional service in commercial properties. We specialize in commercial spaces, and investment opportunities across multiple cities.
              </p>
            </motion.div>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Our Mission */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="bg-gray-300 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Star className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Our Mission</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                To revolutionize the real estate experience by providing personalized, technology-driven solutions that exceed client expectations and create lasting value.
              </p>
            </motion.div>

            {/* Our Vision */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="bg-gray-300 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Our Vision</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                To become the most trusted and innovative real estate company, setting new standards for excellence in property services and client satisfaction.
              </p>
            </motion.div>

            {/* Our Values */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="bg-gray-300 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Book className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">Our Values</h3>
              <p className="text-gray-600 leading-relaxed">
                Integrity, innovation, and customer-centricity drive everything we do. We believe in transparent communication and building long-term relationships.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

     {/* Team Section - Modern Redesign */}
{teamMembers && teamMembers.length > 0 && (
  <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
    {/* Background Elements */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
    </div>
    
    <div className="container mx-auto px-4 relative z-10">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-block"
        >
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-4">
            Meet Our Team
          </span>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
        >
          Our Expert Team
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl text-gray-600 max-w-3xl mx-auto"
        >
          Meet the dedicated professionals who make Realtraspaces your trusted partner in real estate.
          {!loading && teamMembers.length > 0 && (
            <span className="block mt-2 text-sm text-blue-600 font-medium">
              {teamMembers.length} team member{teamMembers.length !== 1 ? 's' : ''} available
            </span>
          )}
        </motion.p>
      </div>

  <div className="relative bg-white py-12 overflow-hidden">
    {/* Loading State */}
    {loading && (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )}

    {/* Team Members */}
    {!loading && teamMembers.length > 0 && (
      <div className="relative w-full overflow-hidden">
        <div className="flex gap-6 animate-scroll whitespace-nowrap">
          {teamMembers.map((member, index) => (
            <div
              key={`${member.id}-${index}`}
              className="group relative flex-shrink-0 w-64 rounded-2xl overflow-hidden border border-gray-200 transition-shadow duration-500 cursor-pointer"
              onClick={() => member.linkedin && window.open(member.linkedin, '_blank')}
            >
              <div className="relative">
                {/* Image */}
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-72 object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    img.src = DUMMY_IMAGES.team1; // Fallback to default image
                  }}
                />
                {/* Name and Role Overlay */}
                <div className="absolute bottom-3 w-50 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg text-center">
                  <h3 className="text-sm font-semibold text-gray-800">
                    {member.name}
                  </h3>
                  <p className="text-xs text-gray-500">{member.role}</p>
                </div>
                {/* LinkedIn indicator */}
                {member.linkedin && (
                  <div className="absolute top-3 right-3 bg-blue-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.047-1.852-3.047-1.853 0-2.136 1.445-2.136 2.939v5.677H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                )}
              </div>
              {/* Shadow on hover */}
              <div className="absolute inset-0 rounded-2xl pointer-events-none group-hover:shadow-xl transition-shadow duration-500" />
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Error State */}
    {!loading && error && (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchTeamMembers();
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    )}

    {/* No Team Members State */}
    {!loading && !error && teamMembers.length === 0 && (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No team members available at the moment.</p>
      </div>
    )}
  </div>


    </div>
  </section>
)}

      {/* Gallery Section */}
      <section className="py-20" style={{ backgroundColor: '#F5F5FF99' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Our Portfolio
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover some of our finest projects and successful developments.
            </p>
          </div>


          {/* Infinite Carousel */}
          {galleryImages.length > 0 ? (
            <div className="relative overflow-hidden">
              
              
              <div
                className="flex gap-6 animate-scroll"
                style={{
                  width: `${galleryImages.length * 2 * 300}px`,
                  animationPlayState: isCarouselHovered ? 'paused' : 'running'
                }}
                onMouseEnter={() => setIsCarouselHovered(true)}
                onMouseLeave={() => setIsCarouselHovered(false)}
              >
                {[...galleryImages, ...galleryImages].map((image, index) => {
                  // Find the original developer data
                  const developer: Developer = {
                    id: parseInt(image.id),
                    buildername: image.developerName || 'Unknown Developer',
                    builder_logo: image.src,
                    descriptions: image.description || 'No description available',
                    project_name: [],
                    status: image.status || true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    images: [image.src],
                    image_urls: [image.src]
                  };
                  
                  return (
                  <div
                    key={`${image.id}-${index}`}
                    className={`flex-shrink-0 bg-white rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-gray-300 relative group ${
                      image.size === 'large' ? 'w-80 h-60' : 'w-60 h-60'
                    }`}
                    onClick={() => openModal(developer)}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        console.log(`Image failed to load: ${image.src}, using fallback`);
                        img.src = '/assets/signin.jpeg'; // Fallback image
                      }}
                      onLoad={() => {
                        console.log(`Image loaded successfully: ${image.src}`);
                      }}
                    />
                    
                    {/* Status Badge - Top Right */}
                    {image.status !== undefined && (
                      <div className="absolute top-3 right-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          image.status
                            ? "bg-green-500 text-white"
                            : "bg-gray-500 text-white"
                        }`}>
                          {image.status ? "Active" : "Inactive"}
                        </span>
                      </div>
                    )}
                    
                    {/* Project Count - Bottom Left */}
                    {image.projectCount !== undefined && (
                      <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-lg">
                        <div className="flex items-center text-white text-sm">
                          <span className="mr-1">🏗️</span>
                          <span>{image.projectCount} Projects</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Developer name overlay on hover */}
                    {image.developerName && (
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                        <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <h3 className="text-lg font-semibold mb-2">{image.developerName}</h3>
                          {image.description && (
                            <p className="text-sm text-gray-200 mb-2 line-clamp-2 px-4">
                              {image.description}
                            </p>
                          )}
                          <p className="text-sm text-gray-200">Click to view developer</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Hover Indicator Arrow */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500 text-lg">Loading developer portfolio...</p>
              <p className="text-sm text-gray-400 mt-2">Fetching images from API...</p>
            </div>
          )}
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Awards & Recognition
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our commitment to excellence has been recognized by industry leaders.
            </p>
          </div>

          {/* Loading State */}
          {awardsLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <p className="text-white ml-4">Loading awards...</p>
            </div>
          )}

          {/* Error State */}
          {!awardsLoading && awardsError && (
            <div className="text-center py-12">
              <div className="bg-red-900/50 border border-red-500 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-red-200 text-lg mb-4">{awardsError}</p>
                <button
                  onClick={() => {
                    setAwardsError(null);
                    setAwardsLoading(true);
                    fetchAwards();
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Awards Grid */}
          {!awardsLoading && !awardsError && awards.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {awards.map((award, index) => (
                <motion.div
                  key={award.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="bg-white rounded-2xl overflow-hidden hover:bg-gray-300 transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative h-48 overflow-hidden group">
                    <img
                      src={award.award_image_url || getAwardImageUrl(award.award_image)}
                      alt={award.award_title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        img.src = DUMMY_IMAGES.award1; // Fallback to default image
                      }}
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-opacity-0 group-hover:bg-black/50 group-hover:bg-opacity-70 transition-all duration-300 flex items-center justify-center">
                      <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-6">
                        <h3 className="text-lg font-semibold mb-2">{award.award_title}</h3>
                        {award.demo_field && (
                          <p className="text-sm text-gray-200">{award.demo_field}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* No Awards State */}
          {!awardsLoading && !awardsError && awards.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-300 text-lg">No awards available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={DUMMY_IMAGES.consultationBg}
            alt="Consultation Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/80"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Find Your Perfect Property?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Let our experts help you navigate the real estate market and find the perfect investment opportunity.
            </p>

            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 max-w-2xl mx-auto border border-white/30">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-lg bg-white/30 border border-white/50 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/40"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 rounded-lg bg-white/30 border border-white/50 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/40"
                />
              </div>
              <button className="w-full cursor-pointer bg-white text-black font-semibold py-4 px-8 rounded-lg hover:bg-gray-300 transition-colors duration-300 flex items-center justify-center gap-2">
                Get Free Consultation
                <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && selectedDeveloper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
            onClick={closeModal}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scaleIn">
            {/* Modal Header */}
            <div className="relative h-64">
              <Image
                src={selectedDeveloper.builder_logo ? getDeveloperImageUrl(selectedDeveloper.builder_logo) : '/assets/signin.jpeg'}
                alt={selectedDeveloper.buildername}
                width={800}
                height={256}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  img.src = '/assets/signin.jpeg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all"
              >
                <X size={24} />
              </button>

              {/* Status Badge */}
              <div className="absolute top-4 left-4">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    selectedDeveloper.status
                      ? "bg-green-500 text-white"
                      : "bg-gray-500 text-white"
                  }`}
                >
                  {selectedDeveloper.status ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Developer Name */}
              <div className="absolute bottom-6 left-6 right-6">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {selectedDeveloper.buildername}
                </h2>
                <div className="flex items-center text-white/80">
                  <Home className="mr-2" />
                  <span>{(selectedDeveloper.project_name || []).length} Projects</span>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-16rem)]">
              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3" style={{ color: colors.primary }}>
                  About the Developer
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedDeveloper.descriptions || 'No description available for this developer.'}
                </p>
              </div>

              {/* Gallery Images */}
              {(selectedDeveloper.images && selectedDeveloper.images.length > 0) && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4" style={{ color: colors.primary }}>
                    Gallery ({selectedDeveloper.images.length} images)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {selectedDeveloper.images.map((image, idx) => (
                      <div key={idx} className="bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={getDeveloperImageUrl(image)}
                            alt={`${selectedDeveloper.buildername} gallery ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              const img = e.currentTarget as HTMLImageElement;
                              img.src = '/assets/signin.jpeg';
                            }}
                          />
                        </div>
                        <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100">
                          <p className="text-xs text-gray-600 text-center font-medium">
                            Image {idx + 1}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {(selectedDeveloper.project_name && selectedDeveloper.project_name.length > 0) && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4" style={{ color: colors.primary }}>
                    Projects ({selectedDeveloper.project_name.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedDeveloper.project_name.map((project, idx) => (
                      <div key={idx} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <CheckCircle className="mr-3 text-green-500 flex-shrink-0" size={16} />
                        <span className="text-gray-700 font-medium">{project || 'Unnamed Project'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Calendar className="mr-2 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-medium text-gray-700">{formatDate(selectedDeveloper.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Star className="mr-2 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-medium text-gray-700">{formatDate(selectedDeveloper.updated_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
    </PageWithSeo>
  );
}