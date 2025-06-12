"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Raleway } from 'next/font/google';
import parking from "../../../public/assets/images/parking.png";
import floor from "../../../public/assets/images/floor.png";
import sqft from "../../../public/assets/images/sqft.png";
import bookmarkprop from "../../../public/assets/images/bookmark.png";
import Discoverpropertieslocation from "../discoverpropertieslocation/page";
import defaultPropertyImage from "../../../public/assets/images/latestproperty1.png";
import share from "../../../public/assets/Frame 29.png";
import bookmark from "../../../public/assets/Frame 28.png";
import whatsapp from "../../../public/assets/WhatsApp.png";

// Load Raleway font with more weight options
const raleway = Raleway({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-raleway',
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

export default function Similarproperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

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
      attr => attr.masterPropertyAttributeId === attributeId
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

  return (
    <div className={raleway.className}>
      <section className="pb-10 lg:pb-20 bg-white dark:bg-dark relative overflow-hidden">
        <div className="container mx-auto">
          <div className="w-full px-4">
            {/* Heading */}
            <div className="mb-[60px] w-full">
              <h2 className="mt-10 font-normal text-[32px] leading-[100%] tracking-normal text-center">
                <span className="text-black">The latest.</span>{" "}
                <span className="text-[#6E6E73]">Take a look at what's new right now.</span>
              </h2>
            </div>

            {/* Property Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.slice(0, 4).map((property) => (
                <div
                  key={property.id}
                  className="w-full max-w-[307.5px] bg-[#F1F1F4] rounded-lg overflow-hidden border border-gray-200 mx-auto flex flex-col"
                >
                  {/* Header with title and checkbox */}
                  <div className="p-3 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-black text-base">
                        {property.title || "Prime Business Hub"}
                      </h3>
                      <div className="flex items-center text-gray-500 text-xs">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {property.address?.subLocality || property.address?.city || "Location Name"}
                      </div>
                    </div>
                    <div className="w-5 h-5 border border-gray-400 rounded flex items-center justify-center">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>

                  {/* Property Image */}
                  <div className="relative h-[180px]">
                    <Image
                      src={defaultPropertyImage}
                      alt={property.title || "Property"}
                      className="w-full h-full object-cover"
                      width={307}
                      height={180}
                    />
                    {/* For Sale/Rent / Property Type overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 text-white p-2 flex items-center text-sm">
                      <span className="mr-2">
                        {property.forSale ? "For Sale" : property.forRent ? "For Rent" : "For Sale"}
                      </span>
                      <span className="mx-1">•</span>
                      <span className="ml-1">{property.propertyType?.displayName || property.propertyType?.childType?.displayName || "Office space"}</span>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="p-3 flex-grow">
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div className="text-gray-500">Carpet Area</div>
                      <div className="text-right text-black">
                        {property.dimension?.area || "5490"} sqft
                      </div>
                      
                      <div className="text-gray-500">Space Condition</div>
                      <div className="text-right text-black">
                        {getAttributeValue(property, "condition-id") || "Furnished"}
                      </div>
                      
                      <div className="text-gray-500">Seat in office</div>
                      <div className="text-right text-black">
                        {getAttributeValue(property, "seating-capacity-id") || "120"}
                      </div>
                      
                      <div className="text-gray-500">No of Cabin</div>
                      <div className="text-right text-black">
                        {getAttributeValue(property, "cabins-id") || "12"}
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 my-2"></div>
                    
                    {/* Price and Actions */}
                    <div className="flex justify-between items-center mt-1">
                      <div>
                        <div className="text-base text-black font-semibold">
                          {property.forRent 
                            ? `₹ ${property.monetaryInfo?.expectedRent || 4500}`
                            : formatPrice(property.monetaryInfo?.expectedPrice)}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {property.forRent ? "rent/month" : ""}
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        {/* Bookmark button */}
                        <button className="p-1.5 rounded flex items-center justify-center">
                          <Image 
                            src={bookmark} 
                            alt="Bookmark" 
                            width={24} 
                            height={24} 
                            className="object-contain"
                          />
                        </button>
                        
                        {/* Share button */}
                        <button className="p-1.5 rounded flex items-center justify-center">
                          <Image 
                            src={share} 
                            alt="Share" 
                            width={24} 
                            height={24} 
                            className="object-contain"
                          />
                        </button>
                        
                        {/* WhatsApp button */}
                        <button className="p-1.5 items-center justify-center">
                          <Image 
                            src={whatsapp} 
                            alt="WhatsApp" 
                            width={24} 
                            height={24} 
                            className="object-contain"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}