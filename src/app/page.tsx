import Image from "next/image";
import home from '../../public/assets/images/Home.png'
import Latestpropertytype from "./latestpropertytype/page";
// import Blogs from "./blogs/page";

export default function Home() {
  return (
    <>
    <main className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="relative h-[90vh] w-full">
        <div className="absolute inset-0">
          <Image
            src={home}
            alt="Modern Home Interior"
            fill
            priority
            className="object-cover"
          />
        </div>
        
        {/* Content Container */}
        <div className="relative h-full flex flex-col justify-end pb-8">
          {/* Search Bar Container */}
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-[#FEFEFE4D] backdrop-blur-[10%] rounded-full shadow-lg p-4">
              {/* Property Type Tags */}
              {/* <div className="flex gap-2 mb-4">
                <span className="bg-black text-white backdrop-blur-sm px-4 py-1 rounded-full text-sm font-medium">
                  Leasing
                </span>
                <span className="bg-white text-black backdrop-blur-sm px-4 py-1 rounded-full text-sm font-medium">
                  Leasing
                </span>
                <span className="bg-white text-black px-4 py-1 rounded-full text-sm font-medium">
                  Leasing
                </span>
              </div> */}
              {/* Search Bar */}
              <div className="flex flex-wrap md:flex-nowrap gap-2">
                <div className="w-full md:w-1/4">
                  <select className="w-full px-4 py-2 border-0 focus:ring-0 text-gray-600 bg-white backdrop-blur-sm rounded-md">
                    <option value="">Location </option>
                    <option value="new-york">New York</option>
                    <option value="london">London</option>
                    <option value="paris">Paris</option>
                  </select>
                </div>
                <div className="w-full md:w-1/4">
                  <select className="w-full px-4 py-2 border-0 focus:ring-0 text-gray-600 bg-white/80 backdrop-blur-sm rounded-md">
                    <option value="">Property Type </option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="villa">Villa</option>
                  </select>
                </div>
                <div className="w-full md:w-1/4">
                  <select className="w-full px-4 py-2 border-0 focus:ring-0 text-gray-600 bg-white/80 backdrop-blur-sm rounded-md">
                    <option value="">Location </option>
                    <option value="downtown">Downtown</option>
                    <option value="suburb">Suburb</option>
                    <option value="beach">Beach</option>
                  </select>
                </div>
                <div className="w-full md:w-1/4">
                  <input
                    type="text"
                    placeholder="Property Name"
                    className="w-full px-4 py-2 border-0 focus:ring-0 text-gray-600 bg-white/80 backdrop-blur-sm rounded-md"
                  />
                </div>
                <div className="w-full md:w-auto">
                  <button className="w-full md:w-auto bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors">
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <Latestpropertytype />

    </>
  );
}