"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import latestpropertytype from "../../../public/assets/images/latestpropertytype.svg";
import { Raleway } from "next/font/google";
import Link from "next/link";
import CalculatorSection from "@/components/calculate";
import PageWithSeo from "../../components/PageWithSeo";
import SeoHead from "../../components/SeoHead";
import PropertyLocations from "@/components/locality";
import { getBlogImageUrl } from "@/utils/imageUtils";

// Removed metadata and head exports

// Load Raleway font
const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-raleway",
});

type Blog = {
  id: string | number;
  slug: string;
  blogTitle: string;
  blogDescription: string;
  blogImages?: string[];
  category?: string;
  createdAt: string;
  writer?: string;
  likes?: number;
  bookmarks?: number;
  tags?: string[];
  dynamicFields?: {
    isFeatured?: boolean;
    readingTime?: number;
  };
};

const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        //http://localhost:8000
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/api/blogs/`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Extract data from the response structure
        if (result.status === 'success' && result.data) {
          setBlogs(result.data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Format date helper function
  interface FormatDateOptions {
    year: 'numeric' | '2-digit';
    month: 'long' | 'short' | 'narrow' | 'numeric' | '2-digit';
    day: 'numeric' | '2-digit';
  }

  const formatDate = (dateString: string, options?: FormatDateOptions): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options ?? {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Slider navigation functions
  const nextSlide = () => {
    const maxSlides = Math.ceil(blogs.length / 3) - 1;
    setCurrentSlide(current => current < maxSlides ? current + 1 : 0);
  };

  const prevSlide = () => {
    const maxSlides = Math.ceil(blogs.length / 3) - 1;
    setCurrentSlide(current => current > 0 ? current - 1 : maxSlides);
  };

  // Get current slide blogs
  const getCurrentSlideBlogs = () => {
    const startIndex = currentSlide * 3;
    return blogs.slice(startIndex, startIndex + 3);
  };

  const firstFaqRef = useRef<HTMLDetailsElement>(null);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState(0); // 0: first open by default
  const [showAllFaqs, setShowAllFaqs] = useState(false); // State for showing all FAQs

  return (
    <>
      <PageWithSeo page="blogs">
        <div className={raleway.className}>
          <section className="py-16 bg-gray-50 flex justify-center items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
              {/* Header row with flex to place items on opposite sides */}
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900">
                  Insights and Updates
                </h2>
                {/* <button className="text-white bg-black px-4 py-2 rounded-lg">
              Read More
            </button> */}
              </div>

              {/* Loading state */}
              {loading && (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                </div>
              )}

              {/* Error state */}
              {error && (
                <div className="text-center py-8">
                  <p className="text-red-600 mb-4">Error loading blogs: {error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-black text-white px-4 py-2 rounded-lg cursor-pointer"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Blogs slider */}
              {!loading && !error && (
                <div className="relative">
                  {/* Navigation buttons */}
                  {blogs.length > 3 && (
                    <>
                      <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white hover:bg-gray-100 text-gray-800 rounded-full p-3 shadow-lg border border-gray-200 transition-all duration-200"
                        aria-label="Previous slide"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white hover:bg-gray-100 text-gray-800 rounded-full p-3 shadow-lg border border-gray-200 transition-all duration-200"
                        aria-label="Next slide"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}

                  {/* Slider container */}
                  <div className="overflow-hidden">
                    <div
                      className="flex gap-8 transition-transform duration-500 ease-in-out"
                      style={{
                        transform: `translateX(-${currentSlide * 100}%)`
                      }}
                    >
                      {blogs.length > 0 ? (
                        Array.from({ length: Math.ceil(blogs.length / 3) }, (_, slideIndex) => (
                          <div key={slideIndex} className="flex gap-8 w-full flex-shrink-0">
                            {blogs.slice(slideIndex * 3, slideIndex * 3 + 3).map((blog, index) => (
                              <div key={blog.slug} className="flex-shrink-0 w-full md:w-1/3">
                                <Link href={`/blogs/${blog.slug}`} className="block group">
                                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                                    <div className="relative overflow-hidden rounded-lg">
                                      <Image
                                        src={blog.blogImages && blog.blogImages.length > 0 ? getBlogImageUrl(blog.blogImages[0]) : latestpropertytype}
                                        alt={blog.blogTitle || "blog"}
                                        className="object-cover p-3 rounded-2xl h-[220px] transform group-hover:scale-110 transition-transform duration-500"
                                        width={400}
                                        height={220}
                                        onError={(e) => {
                                          // Fallback to default image if blog image fails to load
                                          const target = e.target as HTMLImageElement;
                                          target.src = latestpropertytype;
                                        }}
                                      />
                                      {/* Property Type and Location - Positioned absolutely on top of image */}
                                      <div className="absolute top-4 right-0 px-4 flex justify-between">
                                        <span className="text-sm text-black bg-white bg-opacity-70 rounded-full px-3 py-1">
                                          {blog.dynamicFields?.isFeatured ? "Featured" : "Article"}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="p-6">
                                      {/* Category and Date */}
                                      <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm text-blue-600 font-medium">
                                          {blog.category || 'General'}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                          {formatDate(blog.createdAt, { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </span>
                                      </div>

                                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {blog.blogTitle.split(' ').length > 7
                                          ? blog.blogTitle.split(' ').slice(0, 7).join(' ') + '...'
                                          : blog.blogTitle}
                                      </h3>
                                      <p className="text-gray-600 mb-4">
                                        {blog.blogDescription.split(' ').length > 15
                                          ? blog.blogDescription.split(' ').slice(0, 15).join(' ') + '...'
                                          : blog.blogDescription}
                                      </p>

                                      {/* Read More Button */}
                                      <div className="text-center">
                                        <span className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                                          Read More →
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                              </div>
                            ))}
                          </div>
                        ))
                      ) : (
                        <div className="w-full text-center py-8">
                          <p className="text-gray-600">No blogs available at the moment.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Slider indicators */}
                  {blogs.length > 3 && (
                    <div className="flex justify-center mt-8 space-x-2">
                      {Array.from({ length: Math.ceil(blogs.length / 3) }, (_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-200 ${currentSlide === index ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
          <CalculatorSection />

          {/* FAQ */}
          <section className="bg-white flex justify-center items-center min-h-screen">
            <div className="w-full max-w-6xl px-4 py-10">
              {/* Heading */}
              <div className="text-center mb-8">
                <div className=" items-center space-x-2">
                  <h2 className="text-3xl mb-2 font-bold text-gray-900">FAQ</h2>
                  <h2 className="text-3xl font-bold text-gray-500">
                    Frequently Asked Questions
                  </h2>
                </div>
              </div>

              {/* FAQ Data */}
              {(() => {
                const faqData = [
                  {
                    question: "What is RealtraSpaces.com and how does it help with Mumbai commercial real estate?",
                    answer: "RealtraSpaces.com is a digital platform specializing in Mumbai commercial real estate, helping clients lease, buy, and invest in prime office spaces, coworking hubs, and pre-leased properties with transparency."
                  },
                  {
                    question: "Why should I lease office space in Mumbai through RealtraSpaces?",
                    answer: "We provide verified listings, market insights, and past deal data, making it easier for businesses to lease office space in Mumbai's prime commercial hubs like Nariman Point, BKC, Lower Parel, and Andheri."
                  },
                  {
                    question: "Can I buy pre-leased commercial properties in Mumbai on RealtraSpaces?",
                    answer: "Yes, RealtraSpaces offers a wide selection of pre-leased commercial properties in Mumbai with stable tenants, providing investors steady rental income and long-term capital appreciation."
                  },
                  {
                    question: "How does RealtraSpaces ensure transparency in Mumbai commercial real estate transactions?",
                    answer: "We use real-time data, historical deals, and detailed analytics to ensure tenants, landlords, and investors in Mumbai make well-informed decisions."
                  },
                  {
                    question: "Does RealtraSpaces provide coworking office spaces in Mumbai?",
                    answer: "Absolutely. We list coworking spaces in Mumbai across prime locations like Powai, Andheri, BKC, and Navi Mumbai, catering to startups, freelancers, and corporates."
                  },
                  {
                    question: "Which types of Mumbai commercial properties are available on RealtraSpaces?",
                    answer: "We cover office spaces, coworking desks, retail outlets, pre-leased properties, and Grade A commercial assets across Mumbai, Navi Mumbai, and Thane."
                  },
                  {
                    question: "How can startups find affordable office space in Mumbai with RealtraSpaces?",
                    answer: "Startups can explore flexible coworking spaces and small private offices in Mumbai through RealtraSpaces, offering cost-effective options with scalable plans."
                  },
                  {
                    question: "Why is investing in Mumbai commercial real estate profitable?",
                    answer: "Mumbai's commercial real estate market offers high rental yields, consistent demand from corporates, and strong appreciation potential, making it a top choice for investors."
                  },
                  {
                    question: "Can NRIs invest in Mumbai commercial properties through RealtraSpaces?",
                    answer: "Yes, we help NRIs invest in Mumbai's pre-leased and fractional commercial properties while ensuring all RERA and legal compliances."
                  },
                  {
                    question: "What is fractional ownership in Mumbai commercial real estate?",
                    answer: "Fractional ownership allows multiple investors to co-own high-value Mumbai commercial assets, share rental income, and enjoy capital gains at lower investment entry points."
                  },
                  {
                    question: "How does RealtraSpaces support landlords in Mumbai?",
                    answer: "We assist landlords in Mumbai by listing their commercial properties, connecting them with quality tenants, negotiating deals, and ensuring faster closures."
                  },
                  {
                    question: "Which micro-markets of Mumbai are best for leasing office space?",
                    answer: "Emerging micro-markets like Andheri, Powai, Lower Parel, and Navi Mumbai are gaining traction, while traditional hubs like Nariman Point and BKC remain premium choices."
                  },
                  {
                    question: "Can RealtraSpaces help with retail shop leasing in Mumbai?",
                    answer: "Yes, we provide retail shops and showroom spaces for rent in Mumbai malls, high streets, and business districts with high footfall."
                  },
                  {
                    question: "What is the average rental yield for commercial properties in Mumbai?",
                    answer: "Rental yields in Mumbai commercial real estate typically range from 6–9%, depending on location, tenant profile, and property type."
                  },
                  {
                    question: "Does RealtraSpaces offer Grade A office spaces in Mumbai?",
                    answer: "Yes, we specialize in premium Grade A office spaces in iconic commercial towers across Mumbai's business hubs."
                  },
                  {
                    question: "How does RealtraSpaces help investors compare Mumbai commercial properties?",
                    answer: "We provide side-by-side comparisons of Mumbai office spaces based on rental rates, amenities, connectivity, and past transaction data."
                  },
                  {
                    question: "Can I invest in pre-leased IT parks in Navi Mumbai through RealtraSpaces?",
                    answer: "Yes, RealtraSpaces lists pre-leased IT parks and office spaces in Navi Mumbai, offering investors long-term stable returns."
                  },
                  {
                    question: "How quickly can RealtraSpaces help me lease an office in Mumbai?",
                    answer: "With verified listings and streamlined negotiations, businesses can finalize office leases in Mumbai within weeks."
                  },
                  {
                    question: "Does RealtraSpaces offer coworking spaces for corporates in Mumbai?",
                    answer: "Yes, corporates can find managed coworking solutions in Mumbai that provide flexibility, scalability, and cost savings."
                  },
                  {
                    question: "Can RealtraSpaces guide me on legal compliances in Mumbai real estate?",
                    answer: "Yes, we assist with RERA registrations, lease agreements, and due diligence for commercial real estate in Mumbai."
                  },
                  {
                    question: "How do I list my Mumbai commercial property on RealtraSpaces?",
                    answer: "Property owners can register on RealtraSpaces.com, submit details, and our team will verify and promote the property to potential tenants and investors."
                  },
                  {
                    question: "Why is Mumbai considered the top market for commercial real estate in India?",
                    answer: "Mumbai is India's financial hub, home to global corporations, strong infrastructure, and constant demand for Grade A office spaces, making it the most attractive commercial market."
                  },
                  {
                    question: "Does RealtraSpaces provide coworking options in Navi Mumbai and Thane?",
                    answer: "Yes, we cover coworking and serviced office spaces across Navi Mumbai and Thane for growing businesses and startups."
                  },
                  {
                    question: "What are the benefits of pre-leased commercial properties in Mumbai?",
                    answer: "Pre-leased properties in Mumbai offer assured rental income from day one, lower risk, and long-term tenant security."
                  },
                  {
                    question: "How can RealtraSpaces help SMEs expand office presence in Mumbai?",
                    answer: "We provide scalable office solutions and market insights, helping SMEs choose the right location and property for expansion."
                  },
                  {
                    question: "Which areas in Mumbai have affordable commercial property options?",
                    answer: "Areas like Navi Mumbai, Thane, and suburban micro-markets such as Kandivali and Malad offer affordable commercial property compared to South Mumbai and BKC."
                  },
                  {
                    question: "Does RealtraSpaces assist with investment in Mumbai coworking real estate?",
                    answer: "Yes, we connect investors to profitable coworking and flexible workspace assets in Mumbai."
                  },
                  {
                    question: "Can RealtraSpaces provide analytics for Mumbai commercial leasing trends?",
                    answer: "Yes, we share transactional data and market insights to highlight leasing demand across Mumbai's micro-markets."
                  },
                  {
                    question: "How does RealtraSpaces differentiate from traditional property brokers in Mumbai?",
                    answer: "Unlike brokers, we provide verified listings, data-backed insights, and complete transparency in Mumbai commercial real estate."
                  },
                  {
                    question: "Why choose RealtraSpaces for Mumbai office space leasing?",
                    answer: "With 30+ cumulative years of experience and access to 8,000+ commercial property owners in Mumbai, RealtraSpaces offers unmatched expertise, data, and convenience."
                  }
                ];

                const visibleFaqs = showAllFaqs ? faqData : faqData.slice(0, 10);

                return (
                  <>
                    {visibleFaqs.map((faq, index) => (
                      <details
                        key={index}
                        open={openFaq === index}
                        className="group [&_summary::-webkit-details-marker]:hidden"
                        style={{ marginTop: index === 0 ? '0' : '1rem' }}
                        onClick={e => {
                          e.preventDefault();
                          setOpenFaq(openFaq === index ? -1 : index);
                        }}
                      >
                        <summary className="flex items-center justify-between gap-1.5 rounded-md border border-gray-100 bg-[#F1F1F4] p-4 text-gray-900 shadow-[#0000001A] shadow-md">
                          <h2 className="text-lg font-medium cursor-pointer">
                            {faq.question}
                          </h2>
                          <svg
                            className="size-8 cursor-pointer shrink-0 transition-transform duration-300 group-open:-rotate-180 bg-[#6E6E73B2] rounded-full border-2 border-gray-300"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            color="white"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </summary>
                        <p className="px-4 pt-4 text-gray-900">
                          {faq.answer}
                        </p>
                      </details>
                    ))}

                    {/* See All Button */}
                    {faqData.length > 10 && (
                      <div className="text-center mt-8">
                        <button
                          onClick={() => setShowAllFaqs(!showAllFaqs)}
                          className="bg-black text-white hover:bg-white hover:text-black hover:border hover:border-black px-6 py-3 rounded-md text-sm font-medium transition-all duration-200"
                        >
                          {showAllFaqs ? 'Show Less' : `See All ${faqData.length} FAQs`}
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </section>


          {/* CTA */}
          <div className="bg-[#F1F1F4] p-8">
            {/* Main CTA Section */}
            <div className="max-w-xl mx-auto text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Looking for the Right Property?
              </h2>

              <p className="text-gray-600 mb-8">
                Let our experts guide you. Whether you are buying, selling, or just
                exploring, we are here to help you make informed decisions.
              </p>

              <p className="text-gray-900 font-semibold mb-6">
                Get in touch today for a free consultation.
              </p>

              <div className="flex justify-center gap-4">
                <Link href="/contact" >
                  <button className="bg-black text-white hover:bg-white hover:text-black hover:border hover:border-black px-6 py-2 rounded-md text-sm cursor-pointer font-medium">
                    Contact Us
                  </button>
                </Link>

                {/* <button className="bg-white text-black border border-gray-300 cursor-pointer px-6 py-2 rounded-md text-sm font-medium">
              Schedule a Call
            </button> */}
              </div>
            </div>
          </div>
          <div className="bg-white p-6">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-[35px] font-bold text-gray-900 text-center mb-6">
                Get a quote
              </h3>

              <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center items-center gap-4">
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="text-black px-4 py-2 rounded border border-gray-300 bg-[#F1F1F4] text-sm w-full sm:w-48"
                />
                <input
                  type="text"
                  placeholder="Enter your email"
                  className="text-black px-4 py-2 rounded border border-gray-300 bg-[#F1F1F4] text-sm w-full sm:w-48"
                />
                <input
                  type="text"
                  placeholder="Enter your phone"
                  className="text-black px-4 py-2 rounded border border-gray-300 bg-[#F1F1F4] text-sm w-full sm:w-48"
                />
                <button className="bg-black hover:bg-white hover:text-black hover:border hover:border-black text-white px-4 py-2 rounded text-sm cursor-pointer font-medium w-full sm:w-auto">
                  Submit
                </button>
              </div>
            </div>
          </div>

        </div>
        <PropertyLocations />
      </PageWithSeo>
    </>
  );
};

export default Blogs;