"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Raleway } from "next/font/google";
import defaultPropertyImage from "../../../public/assets/images/latestproperty1.png";
import share from "../../../public/assets/Frame 29.png";
import bookmark from "../../../public/assets/Frame 28.png";
import whatsapp from "../../../public/assets/WhatsApp.png";
import TopDevelopers from "../topdevelopers/page";
import home from "../../../public/assets/hero.jpg";
import Link from "next/link";
// Load Raleway font with more weight options
const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-raleway",
});

type Property = {
  id: string;
  title?: string;
  propertyType?: {
    displayName?: string;
    childType?: {
      displayName?: string;
    };
  };
  address?: {
    subLocality?: string;
    city?: string;
    state?: string;
  };
  monetaryInfo?: {
    expectedPrice?: number;
    expectedRent?: number;
  };
  dimension?: {
    area?: string | number;
  };
  unitNo?: string | number;
  attributes?: Array<{
    masterPropertyAttributeId: string;
    value?: string | number;
    displayName?: string;
  }>;
  forSale?: boolean;
  forRent?: boolean;
};

export default function PropertyCards() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(
          "https://prd-lrb-webapi.leadrat.com/api/v1/property/anonymous?PageNumber=1&PageSize=20",
          {
            method: "GET",
            headers: {
              accept: "application/json",
              tenant: "realtraspaces",
            },
          }
        );
        const data = await response.json();
        // Inspect the response structure and set the correct array
        // Example: if data.items is the array
        setProperties(
          Array.isArray(data) ? data : data.items || data.data || []
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Helper function to get attribute value by ID
  const getAttributeValue = (property: Property, attributeId: string) => {
    const attribute = property.attributes?.find(
      (attr) => attr.masterPropertyAttributeId === attributeId
    );
    return attribute?.value || "N/A";
  };

  // Format price in Indian currency format (e.g., ₹ 45,00,000)
  const formatPrice = (price?: number) => {
    if (!price) return "Price not available";

    // For values less than 100,000, show directly
    if (price < 100000) return `₹ ${price}`;

    // For values in lakhs (1 lakh = 100,000)
    if (price < 10000000) {
      const lakhs = (price / 100000).toFixed(2);
      return `₹ ${lakhs} Lakhs`;
    }

    // For values in crores (1 crore = 10,000,000)
    const crores = (price / 10000000).toFixed(2);
    return `₹ ${crores} Cr`;
  };

  if (loading) {
    return (
      <div className={raleway.className}>
        <section className="pb-10 lg:pb-20 bg-gray-100 dark:bg-dark relative overflow-hidden">
          <div className="container mx-auto px-4">
            <p>Loading properties...</p>
          </div>
        </section>
      </div>
    );
  }

  // Filter properties based on search input
  const filteredProperties = properties.filter((property) => {
    const searchLower = search.toLowerCase();
    return (
      (property.title?.toLowerCase().includes(searchLower) ?? false) ||
      (property.address?.subLocality?.toLowerCase().includes(searchLower) ?? false) ||
      (property.address?.city?.toLowerCase().includes(searchLower) ?? false) ||
      (property.dimension?.area?.toString().toLowerCase().includes(searchLower) ?? false)
    );
  });

  return (
    <div className={raleway.className}>
       <section className="relative w-full h-[220px] sm:h-[320px] md:h-[420px]">
        <Image
          src={home}
          alt="City skyline"
          fill
          priority
          className="object-cover"
        />

        {/* Search bar positioned at the bottom center of the banner */}
      <div className="absolute bottom-4 w-full flex justify-center px-2">
  <div className="flex flex-col sm:flex-row w-full sm:w-[90%] md:w-[750px] max-w-[98%] items-stretch sm:items-center gap-2 px-3 py-2 rounded-2xl border border-gray-300 bg-[#F5F5FF99] backdrop-blur-sm shadow-md">
    
    {/* Dropdown */}
    <div className="relative w-full sm:w-auto">
      <select
        className="appearance-none w-full bg-black text-white text-sm font-medium pl-6 pr-10 py-3 h-full rounded-full outline-none cursor-pointer"
      >
        <option value="">Select search type</option>
        <option value="commercial">Commercial</option>
        <option value="coworking">Co-working</option>
      </select>
      
      {/* Custom arrow */}
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white text-xs">
        ▼
      </span>
    </div>

    {/* Search input */}
    <input
      type="text"
      placeholder="Search by property name, location, or type..."
      className="w-full bg-white text-gray-900 px-4 py-3 text-sm rounded-full outline-none min-w-0"
      value={search}
      onChange={e => setSearch(e.target.value)}
    />
  </div>
</div>

      </section>
   <section className="pb-8 sm:pb-10 lg:pb-20 bg-white dark:bg-dark relative overflow-hidden">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="w-full">
            {/* Heading */}
            <div className="mb-8 sm:mb-[60px] w-full">
              <h2 className="mt-6 sm:mt-10 font-normal text-xl sm:text-2xl md:text-[32px] leading-[120%] tracking-normal text-center transform transition-all duration-700 hover:scale-105">
                <span className="text-black">The latest.</span>{" "}
                <span className="text-[#6E6E73]">
                  Take a look at whats new right now.
                </span>
              </h2>
            </div>

            {/* Property Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProperties.slice(0, 4).map((property, index) => (
                <Link href={`/property-details/${property.title}`} key={property.title} className="block">
                <div
                  key={property.id}
                  className="w-full max-w-full sm:max-w-[340px] bg-[#F1F1F4] rounded-lg overflow-hidden border border-gray-200 mx-auto flex flex-col transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-2xl hover:shadow-gray-400/20 hover:-translate-y-2 hover:border-gray-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Header with title and checkbox */}
                  <div className="p-2 sm:p-3 flex justify-between items-center transition-all duration-300 hover:bg-gray-50/50">
                    <div className="h-14">
                      <h3 className="font-medium text-black text-sm sm:text-base transition-all duration-300 hover:text-gray-800">
                        {property.title || "Prime Business Hub"}
                      </h3>
                      <div className="flex items-center text-gray-700 text-xs transition-all duration-300 hover:text-gray-900">
                        <svg
                          className="w-4 h-4 mr-1 transition-all duration-300 hover:scale-110"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {property.address?.subLocality ||
                          property.address?.city ||
                          "Location Name"}
                      </div>
                    </div>
                    <div className="w-5 h-5 border border-gray-600 rounded flex items-center justify-center transition-all duration-300 hover:border-gray-800 hover:bg-gray-100 hover:scale-110">
                      <svg
                        className="w-3 h-3 text-black transition-all duration-300 hover:scale-110"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Property Image */}
                  <div className="relative h-[140px] sm:h-[180px] overflow-hidden group">
                    <Image
                      src={defaultPropertyImage}
                      alt={property.title || "Property"}
                      className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:brightness-110"
                      width={340}
                      height={180}
                    />
                    {/* For Sale/Rent / Property Type overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 text-white p-2 flex items-center text-xs transition-all duration-300 group-hover:bg-opacity-90 transform translate-y-0 group-hover:-translate-y-1">
                      <span className="mr-2 transition-all duration-300 group-hover:font-medium">
                        {property.forSale
                          ? "For Sale"
                          : property.forRent
                          ? "For Rent"
                          : "For Sale"}
                      </span>
                      <span className="mx-1 transition-all duration-300 group-hover:scale-110">•</span>
                      <span className="ml-1 transition-all duration-300 group-hover:font-medium">
                        {property.propertyType?.displayName ||
                          property.propertyType?.childType?.displayName ||
                          "Office space"}
                      </span>
                    </div>
                  </div>
                  {/* Property Details */}
                  <div className="p-2 sm:p-3 flex-grow transition-all duration-300 hover:bg-gray-50/30">
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div className="text-gray-500 transition-all duration-300 hover:text-gray-600">Carpet Area</div>
                      <div className="text-right text-black transition-all duration-300 hover:font-medium hover:text-gray-800">
                        {property.dimension?.area || "5490"} sqft
                      </div>

                      <div className="text-gray-500 transition-all duration-300 hover:text-gray-600">Space Condition</div>
                      <div className="text-right text-black transition-all duration-300 hover:font-medium hover:text-gray-800">
                        {getAttributeValue(property, "condition-id") ||
                          "Furnished"}
                      </div>

                      <div className="text-gray-500 transition-all duration-300 hover:text-gray-600">Seat in office</div>
                      <div className="text-right text-black transition-all duration-300 hover:font-medium hover:text-gray-800">
                        {getAttributeValue(property, "seating-capacity-id") ||
                          "120"}
                      </div>

                      <div className="text-gray-500 transition-all duration-300 hover:text-gray-600">No of Cabin</div>
                      <div className="text-right text-black transition-all duration-300 hover:font-medium hover:text-gray-800">
                        {getAttributeValue(property, "cabins-id") || "12"}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 my-2 transition-all duration-300 hover:border-gray-300"></div>

                    {/* Price and Actions */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-1 gap-2 sm:gap-0">
                      <div className="transition-all duration-300 hover:scale-105">
                        <div className="text-base text-black font-semibold transition-all duration-300 hover:text-gray-800">
                          {property.forRent
                            ? `₹ ${property.monetaryInfo?.expectedRent || 4500}`
                            : formatPrice(property.monetaryInfo?.expectedPrice)}
                        </div>
                        <div className="text-gray-500 text-xs transition-all duration-300 hover:text-gray-600">
                          {property.forRent ? "rent/month" : ""}
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        {/* Bookmark button */}
                        <button className="p-1.5 rounded flex items-center cursor-pointer justify-center transition-all duration-300 hover:bg-gray-200 hover:scale-110 hover:shadow-md active:scale-95">
                          <Image
                            src={bookmark}
                            alt="Bookmark"
                            width={20}
                            height={20}
                            className="object-contain transition-all duration-300 hover:scale-110"
                          />
                        </button>

                        {/* Share button */}
                        <button className="p-1.5 rounded cursor-pointer flex items-center justify-center transition-all duration-300 hover:bg-gray-200 hover:scale-110 hover:shadow-md active:scale-95">
                          <Image
                            src={share}
                            alt="Share"
                            width={20}
                            height={20}
                            className="object-contain transition-all duration-300 hover:scale-110"
                          />
                        </button>

                        {/* WhatsApp button */}
                        <button className="p-1.5 items-center justify-center transition-all duration-300 hover:bg-gray-200 hover:scale-110 hover:shadow-md active:scale-95 flex rounded">
                          <Image
                            src={whatsapp}
                            alt="WhatsApp"
                            width={20}
                            height={20}
                            className="object-contain transition-all duration-300 hover:scale-110"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* CSS Animation Keyframes */}
        <style jsx>{`
          @keyframes fade-in-up {
            0% {
              opacity: 0;
              transform: translateY(30px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out both;
          }
        `}</style>
      </section>
      <TopDevelopers />
    </div>
  );
}
