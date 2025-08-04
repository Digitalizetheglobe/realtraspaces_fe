"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Globe, Book, Zap, ArrowRight, Star, Award, Users } from 'lucide-react';
import developer3 from "../../../public/assets/developer3.jpg";
import Image from "next/image";
import SeoHead from "../../components/SeoHead";
import PageWithSeo from "../../components/PageWithSeo";

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
const galleryImages = [
  { id: 1, src: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop", alt: 'Modern Office Space', size: 'large' },
  { id: 2, src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=300&fit=crop", alt: 'Luxury Apartment', size: 'small' },
  { id: 3, src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop", alt: 'Commercial Building', size: 'large' },
  { id: 4, src: "https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=300&h=300&fit=crop", alt: 'Residential Complex', size: 'small' },
  { id: 5, src: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop", alt: 'Villa Project', size: 'large' },
  { id: 6, src: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=300&h=300&fit=crop", alt: 'Office Interior', size: 'small' },
  { id: 7, src: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop", alt: 'Shopping Complex', size: 'large' },
  { id: 8, src: "https://images.unsplash.com/photo-1502005229762-cf1b2da60e2f?w=300&h=300&fit=crop", alt: 'Luxury Home', size: 'small' }
];

const teamMembers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Senior Manager',
    image: DUMMY_IMAGES.team1,
    description: 'Sarah leads our team with over a decade of real estate experience, specializing in luxury properties and client relations.',
    linkedin: 'https://www.linkedin.com/in/sarah-johnson/'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Sales Director',
    image: DUMMY_IMAGES.team2,
    description: 'Michael drives our sales strategy and has a proven track record in closing high-value deals across the region.',
    linkedin: 'https://www.linkedin.com/in/michael-chen/'
  },
  {
    id: 3,
    name: 'Emily Davis',
    role: 'Marketing Lead',
    image: DUMMY_IMAGES.team3,
    description: 'Emily crafts our brand story and marketing campaigns, ensuring our properties reach the right audience.',
    linkedin: 'https://www.linkedin.com/in/emily-davis/'
  },
    {
    id: 4,
    name: 'Michael Chen',
    role: 'Sales Director',
    image: DUMMY_IMAGES.team2,
    description: 'Michael drives our sales strategy and has a proven track record in closing high-value deals across the region.',
    linkedin: 'https://www.linkedin.com/in/michael-chen/'
  },
    {
    id: 5,
    name: 'Michael Chen',
    role: 'Sales Director',
    image: DUMMY_IMAGES.team2,
    description: 'Michael drives our sales strategy and has a proven track record in closing high-value deals across the region.',
    linkedin: 'https://www.linkedin.com/in/michael-chen/'
  },
    {
    id: 6,
    name: 'Michael Chen',
    role: 'Sales Director',
    image: DUMMY_IMAGES.team2,
    description: 'Michael drives our sales strategy and has a proven track record in closing high-value deals across the region.',
    linkedin: 'https://www.linkedin.com/in/michael-chen/'
  },
    {
    id: 7,
    name: 'Michael Chen',
    role: 'Sales Director',
    image: DUMMY_IMAGES.team2,
    description: 'Michael drives our sales strategy and has a proven track record in closing high-value deals across the region.',
    linkedin: 'https://www.linkedin.com/in/michael-chen/'
  },
    {
    id: 8,
    name: 'Michael Chen',
    role: 'Sales Director',
    image: DUMMY_IMAGES.team2,
    description: 'Michael drives our sales strategy and has a proven track record in closing high-value deals across the region.',
    linkedin: 'https://www.linkedin.com/in/michael-chen/'
  },
    {
    id: 9,
    name: 'Michael Chen',
    role: 'Sales Director',
    image: DUMMY_IMAGES.team2,
    description: 'Michael drives our sales strategy and has a proven track record in closing high-value deals across the region.',
    linkedin: 'https://www.linkedin.com/in/michael-chen/'
  },
    {
    id: 10,
    name: 'Michael Chen',
    role: 'Sales Director',
    image: DUMMY_IMAGES.team2,
    description: 'Michael drives our sales strategy and has a proven track record in closing high-value deals across the region.',
    linkedin: 'https://www.linkedin.com/in/michael-chen/'
  },
];

// Awards data
const awards = [
  { id: 1, src: DUMMY_IMAGES.award1, alt: 'Real Estate Excellence Award 2024' },
  { id: 2, src: DUMMY_IMAGES.award2, alt: 'Best Customer Service Award' },
  { id: 3, src: DUMMY_IMAGES.award3, alt: 'Industry Innovation Award' }
];

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
        <div className="relative py-10 z-10 container mx-auto px-4 text-center text-white">
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
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Transforming Real Estate
              <span className="text-gray-300"> Dreams</span>
            </h1>
            
            <p className="text-xl md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Realtra Spaces is a forward-thinking real estate company specializing in luxury residential and commercial properties. We combine innovation with expertise to deliver exceptional real estate experiences.
            </p>
            
            {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-black hover:bg-gray-300 px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105">
                Explore Properties
                <ArrowRight size={20} />
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-full font-semibold transition-all duration-300">
                Book Consultation
              </button>
            </div> */}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-black py-10">
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
                Realtra Spaces is a premier real estate company dedicated to providing exceptional service in residential and commercial properties. We specialize in luxury homes, modern apartments, commercial spaces, and investment opportunities across multiple cities.
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
<section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
  {/* Background Elements */}
  <div className="absolute inset-0 opacity-10">
    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl"></div>
    <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
  </div>
  
  <div className="container mx-auto px-4 relative z-10">
    {/* Header */}
    <div className="text-center mb-4">
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
      
    
    </div>

<div className="relative bg-white py-12 overflow-hidden">


  {/* Scrolling container */}
  <div className="relative w-full overflow-hidden">
      <div className="flex gap-6 animate-scroll whitespace-nowrap">
        {[...teamMembers, ...teamMembers].map((member, index) => (
          <div
            key={index}
            className="group relative flex-shrink-0 w-64 rounded-2xl overflow-hidden border border-gray-200 transition-shadow duration-500"
          >
            <div className="relative">
              {/* Image */}
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-72 object-cover grayscale group-hover:grayscale-0 transition-all duration-500 cursor-pointer"
              />
              {/* Name and Role Overlay */}
              <div className="absolute bottom-3 w-50 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg text-center">
                <h3 className="text-sm font-semibold text-gray-800">
                  {member.name}
                </h3>
                <p className="text-xs text-gray-500">{member.role}</p>
              </div>
            </div>
            {/* Shadow on hover */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none group-hover:shadow-xl transition-shadow duration-500" />
          </div>
        ))}
      </div>
  </div>

</div>


  </div>
</section>

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
              {[...galleryImages, ...galleryImages].map((image, index) => (
                <div
                  key={`${image.id}-${index}`}
                  className={`flex-shrink-0 bg-white rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-gray-300 ${
                    image.size === 'large' ? 'w-80 h-60' : 'w-60 h-60'
                  }`}
                  onClick={() => setModalImage(image.src)}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {awards.map((award, index) => (
              <motion.div
                key={award.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white rounded-2xl overflow-hidden hover:bg-gray-300 transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={award.src}
                    alt={award.alt}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-black">{award.alt}</h3>
                </div>
              </motion.div>
            ))}
          </div>
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
      {modalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setModalImage(null)}
        >
          <div
            className="relative bg-white rounded-2xl p-4 max-w-4xl w-full mx-4 border border-gray-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-black z-10 bg-white rounded-full p-2"
              onClick={() => setModalImage(null)}
            >
              <X size={20} />
            </button>
            <div className="w-full h-96 relative rounded-xl overflow-hidden">
              <img
                src={modalImage}
                alt="Modal Image"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-xl font-semibold text-black">Modal Image</h3>
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
      `}</style>
    </div>
    </PageWithSeo>
  );
}