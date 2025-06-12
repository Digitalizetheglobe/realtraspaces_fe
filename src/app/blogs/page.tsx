"use client";
import Image from "next/image";
import latestpropertytype from "../../../public/assets/images/latestpropertytype.svg";
import ctabg from "../../../public/assets/images/ctabg.png";
import { Raleway } from 'next/font/google';

// Load Raleway font
const raleway = Raleway({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-raleway',
});

const Blogs = () => {
  return (
    <div className={raleway.className}>
      <section className="py-16 bg-gray-50 flex justify-center items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {/* Header row with flex to place items on opposite sides */}
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Insights and Updates
            </h2>
            <button className="text-white bg-black px-4 py-2 rounded-lg">
              Read More
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Blog Card 1 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden group">
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  src={latestpropertytype}
                  alt="blog"
                  className="object-cover p-3 rounded-2xl h-[220px] transform group-hover:scale-110 transition-transform duration-500"
                />
                {/* Property Type and Location - Positioned absolutely on top of image */}
                <div className="absolute top-4 right-0 px-4 flex justify-between">
                  <span className="text-sm text-black bg-white bg-opacity-70 rounded-full px-3 py-1">
                    News
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Luxury Properties
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    April 14, 2024
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Waterfront Luxury Villas: The Ultimate Investment
                </h3>
                {/* <p className="text-gray-600 mb-4">
                  Explore the exclusive world of waterfront properties and why
                  they continue to be one of the most secure real estate
                  investments in 2024.
                </p> */}
              </div>
            </div>

            {/* Blog Card 2 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden group">
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  src={latestpropertytype}
                  alt="blog"
                  className="object-cover p-3 rounded-2xl h-[220px] transform group-hover:scale-110 transition-transform duration-500"
                />
                {/* Property Type and Location - Positioned absolutely on top of image */}
                <div className="absolute top-4 right-0 px-4 flex justify-between">
                  <span className="text-sm text-black bg-white bg-opacity-70 rounded-full px-3 py-1">
                    News
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Luxury Properties
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    April 14, 2024
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Waterfront Luxury Villas: The Ultimate Investment
                </h3>
                {/* <p className="text-gray-600 mb-4">
                  Explore the exclusive world of waterfront properties and why
                  they continue to be one of the most secure real estate
                  investments in 2024.
                </p> */}
              </div>
            </div>

            {/* Blog Card 3 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden group">
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  src={latestpropertytype}
                  alt="blog"
                  className="object-cover p-3 rounded-2xl h-[220px] transform group-hover:scale-110 transition-transform duration-500"
                />
                {/* Property Type and Location - Positioned absolutely on top of image */}
                <div className="absolute top-4 right-0 px-4 flex justify-between">
                  <span className="text-sm text-black bg-white bg-opacity-70 rounded-full px-3 py-1">
                    Article
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Luxury Properties
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    April 14, 2024
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Waterfront Luxury Villas: The Ultimate Investment
                </h3>
                {/* <p className="text-gray-600 mb-4">
                  Explore the exclusive world of waterfront properties and why
                  they continue to be one of the most secure real estate
                  investments in 2024.
                </p> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white flex justify-center items-center min-h-screen">
        <div className="w-full max-w-2xl p-4">
          {/* Updated heading section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2">
              <h2 className="text-3xl font-bold text-gray-900">FAQ</h2>
              <h2 className="text-3xl font-bold text-gray-500">
                Frequently Asked Questions
              </h2>
            </div>
          </div>

          <details className="group [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between gap-1.5 rounded-md border border-gray-100 bg-[#F1F1F4] p-4 text-gray-900 shadow-[#0000001A] shadow-md">
              <h2 className="text-lg font-medium">
                Lorem ipsum dolor sit amet consectetur adipisicing?
              </h2>
              <svg
                className="size-8 shrink-0 transition-transform duration-300 group-open:-rotate-180 bg-[#6E6E73B2] rounded-full border-2 border-gray-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                color="white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <p className="px-4 pt-4 text-gray-900">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit...
            </p>
          </details>

          <details className="group [&_summary::-webkit-details-marker]:hidden mt-4">
            <summary className="flex items-center justify-between gap-1.5 rounded-md border border-gray-100 bg-[#F1F1F4] p-4 text-gray-900 shadow-[#0000001A] shadow-md">
              <h2 className="text-lg font-medium">
                Lorem ipsum dolor sit amet consectetur adipisicing?
              </h2>
              <svg
                className="size-8 shrink-0 transition-transform duration-300 group-open:-rotate-180 bg-[#6E6E73B2] rounded-full border-2 border-gray-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                color="white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <p className="px-4 pt-4 text-gray-900">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit...
            </p>
          </details>

          <details className="group [&_summary::-webkit-details-marker]:hidden mt-4">
            <summary className="flex items-center justify-between gap-1.5 rounded-md border border-gray-100 bg-[#F1F1F4] p-4 text-gray-900 shadow-[#0000001A] shadow-md">
              <h2 className="text-lg font-medium">
                Lorem ipsum dolor sit amet consectetur adipisicing?
              </h2>
              <svg
                className="size-8 shrink-0 transition-transform duration-300 group-open:-rotate-180 bg-[#6E6E73B2] rounded-full border-2 border-gray-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                color="white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <p className="px-4 pt-4 text-gray-900">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit...
            </p>
          </details>

          <details className="group [&_summary::-webkit-details-marker]:hidden mt-4">
            <summary className="flex items-center justify-between gap-1.5 rounded-md border border-gray-100 bg-[#F1F1F4] p-4 text-gray-900 shadow-[#0000001A] shadow-md">
              <h2 className="text-lg font-medium">
                Lorem ipsum dolor sit amet consectetur adipisicing?
              </h2>
              <svg
                className="size-8 shrink-0 transition-transform duration-300 group-open:-rotate-180 bg-[#6E6E73B2] rounded-full border-2 border-gray-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                color="white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <p className="px-4 pt-4 text-gray-900">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit...
            </p>
          </details>
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
            Let our experts guide you. Whether you're buying, selling, or just
            exploring, we're here to help you make informed decisions.
          </p>

          <p className="text-gray-900 font-semibold mb-6">
            Get in touch today for a free consultation.
          </p>

          <div className="flex justify-center gap-4">
            <button className="bg-black text-white px-6 py-2 rounded-md text-sm font-medium">
              Contact Us
            </button>
            <button className="bg-white text-black border border-gray-300 px-6 py-2 rounded-md text-sm font-medium">
              Schedule a Call
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white p-6">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <h3 className="text-[35px] font-bold text-gray-900 whitespace-nowrap">
            Get a quote
          </h3>

          <input
            type="text"
            placeholder="Enter your name"
            className="text-black px-4 py-2 rounded border border-gray-300 bg-[#F1F1F4] text-sm w-48"
          />
          <input
            type="text"
            placeholder="Enter your email"
            className="text-black px-4 py-2 rounded border border-gray-300 bg-[#F1F1F4] text-sm w-48"
          />
          <input
            type="text"
            placeholder="Enter your phone"
            className="text-black px-4 py-2 rounded border border-gray-300 bg-[#F1F1F4] text-sm w-48"
          />

          <button className="bg-black text-white px-4 py-2 rounded text-sm font-medium">
           Submit 
          </button>
        </div>
      </div>
    </div>
  );
};

export default Blogs;