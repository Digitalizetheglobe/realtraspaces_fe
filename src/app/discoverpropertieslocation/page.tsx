"use client";
import Image from "next/image";
import discoverproperties from "../../../public/assets/images/discoverproprty.png";
import latestpropertytype from "../../../public/assets/images/latestpropertytype.svg";
import TopDevelopers from "../topdevelopers/page";
import { Raleway } from "next/font/google";

// Load Raleway font
const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});
export default function Discoverpropertieslocation() {
  return (
    <>
      <div className="flex flex-col min-h-screen items-center justify-center py-10 bg-gray-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-[60px] w-full">
            <h2
              className={`${raleway.className} mt-10 font-normal text-[32px] leading-[100%] tracking-normal text-center`}
            >
              <span className="text-black">Top Developers.</span>{" "}
              <span className="text-[#6E6E73]">
                Renowned names you can trust.
              </span>
            </h2>
          </div>
          {/* Cards Section */}
          <div className="flex flex-col items-center">
            <div className="flex flex-col md:flex-row items-start justify-start mb-8">
              {/* Left Side - Image */}
              <div className="flex-shrink-0">
                <Image
                  src={discoverproperties}
                  alt="vector"
                  className="w-[480px] h-auto"
                />
              </div>

              {/* Right Side - Text Content */}
              <div className="p-4 h-[370px] bg-white w-[550px]">
                <div className="mb-[25px] w-full justify-between items-start sm:items-center gap-6 sm:gap-0 px-4 mt-12">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-black w-full">
                    Our Findings.
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#6E6E73] w-full">
                      Discover Properties by Location
                    </span>
                  </h2>
                </div>
                <p className="text-gray-500 text-md mt-2 px-4">
                  Explore the most sought-after localities with detailed
                  insights into available properties. Compare listings by
                  neighborhood, evaluate your options, and find a location that
                  aligns perfectly with your lifestyle and preferences.
                </p>
              </div>
            </div>

            {/* Location Cards Grid - 2 columns, 3 rows */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-5xl">
              {/* Location Card 1 */}
              <div className="p-4 bg-white rounded-sm shadow-sm flex items-center space-x-4">
                <Image
                  src={latestpropertytype}
                  alt="location-icon"
                  className="w-15 h-15 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <p className="text-gray-900 text-lg font-bold">
                    Location Name
                  </p>
                  <p className="text-gray-500 text-md font-semibold">
                    No. of Properties
                  </p>
                </div>
              </div>

              {/* Location Card 2 */}
              <div className="p-4 bg-white rounded-sm shadow-sm flex items-center space-x-4">
                <Image
                  src={latestpropertytype}
                  alt="location-icon"
                  className="w-15 h-15 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <p className="text-gray-900 text-lg font-bold">
                    Location Name
                  </p>
                  <p className="text-gray-500 text-md font-semibold">
                    No. of Properties
                  </p>
                </div>
              </div>

              {/* Location Card 3 */}
              <div className="p-4 bg-white rounded-sm shadow-sm flex items-center space-x-4">
                <Image
                  src={latestpropertytype}
                  alt="location-icon"
                  className="w-15 h-15 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <p className="text-gray-900 text-lg font-bold">
                    Location Name
                  </p>
                  <p className="text-gray-500 text-md font-semibold">
                    No. of Properties
                  </p>
                </div>
              </div>

              {/* Location Card 4 */}
              <div className="p-4 bg-white rounded-sm shadow-sm flex items-center space-x-4">
                <Image
                  src={latestpropertytype}
                  alt="location-icon"
                  className="w-15 h-15 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <p className="text-gray-900 text-lg font-bold">
                    Location Name
                  </p>
                  <p className="text-gray-500 text-md font-semibold">
                    No. of Properties
                  </p>
                </div>
              </div>

              {/* Location Card 5 */}
              <div className="p-4 bg-white rounded-sm shadow-sm flex items-center space-x-4">
                <Image
                  src={latestpropertytype}
                  alt="location-icon"
                  className="w-15 h-15 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <p className="text-gray-900 text-lg font-bold">
                    Location Name
                  </p>
                  <p className="text-gray-500 text-md font-semibold">
                    No. of Properties
                  </p>
                </div>
              </div>

              {/* Location Card 6 */}
              <div className="p-4 bg-white rounded-sm shadow-sm flex items-center space-x-4">
                <Image
                  src={latestpropertytype}
                  alt="location-icon"
                  className="w-15 h-15 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <p className="text-gray-900 text-lg font-bold">
                    Location Name
                  </p>
                  <p className="text-gray-500 text-md font-semibold">
                    No. of Properties
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TopDevelopers />
    </>
  );
}
