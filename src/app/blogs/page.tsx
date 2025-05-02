import Image from "next/image";
import latestpropertytype from "../../../public/assets/images/latestpropertytype.svg";
import ctabg from '../../../public/assets/images/ctabg.png'

const Blogs = () => {
  return (
    <>
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
      <div className="relative bg-white p-8 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-10 z-0">
          <Image
            src={ctabg}
            alt="Modern Home Interior"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Content on top of background */}
        <div className="relative z-10 max-w-xl mx-auto text-center">
          <h2 className="text-slate-900 text-4xl font-bold relative after:absolute after:-bottom-5 after:h-1 after:w-1/2 after:bg-gray-600 after:left-0 after:right-0 after:mx-auto after:rounded-full">
            Looking for the Right Property?
          </h2>

          <div className="mt-12">
            <p className="text-slate-600 text-base">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
              accumsan, nunc et tempus blandit, metus mi consectetur felis turpis
              vitae ligula.
            </p>
          </div>

          <p className="text-black font-bold text-base mt-8 mb-8">
            Get in touch today for a free consultation.
          </p>
          <div className="flex max-sm:flex-col justify-center gap-6 max-w-sm mx-auto ">
            <button
              type="button"
              className="min-w-[140px] rounded px-4 py-2.5 text-sm tracking-wider font-medium outline-none border text-white border-gray-600 bg-black hover:bg-transparent hover:text-black transition-all duration-300"
            >
              Contact us
            </button>
            <button
              type="button"
              className="text-slate-900 min-w-[140px] rounded px-4 py-2.5 text-sm tracking-wider font-medium outline-none border border-gray-600 hover:bg-black hover:text-white transition-all duration-300"
            >
              Schedule a Call
            </button>
          </div>
        </div>
      </div>

      {/* get a quote */}
      <div className="bg-white px-12 py-4">
        <div className="flex flex-wrap items-center justify-center gap-4 max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-slate-900 whitespace-nowrap">Get a quote</h3>

          <input
            type="text"
            placeholder="Enter your name"
            className="px-4 py-3 rounded border border-gray-300 bg-gray-100 text-sm w-60 text-gray-800"
          />
          <input
            type="text"
            placeholder="Enter your name"
            className="px-4 py-3 rounded border border-gray-300 bg-gray-100 text-sm w-60 text-gray-800"
          />
          <input
            type="text"
            placeholder="Enter your name"
            className="px-4 py-3 rounded border border-gray-300 bg-gray-100 text-sm w-60 text-gray-800"
          />

          <button className="px-6 py-3 rounded bg-black text-white text-sm font-medium hover:bg-gray-800">
            Read More
          </button>
        </div>
      </div>

    </>
  );
};

export default Blogs;
