"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Raleway } from 'next/font/google';
import defaultPropertyImage from "../../../public/assets/images/latestproperty1.png";
import share from "../../../public/assets/Frame 29.png";
import bookmark from "../../../public/assets/Frame 28.png";
import whatsapp from "../../../public/assets/WhatsApp.png";
import Link from "next/link";
import ShareModal from "../../components/ShareModal";

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
  imageUrls?: {
    Images?: Array<{
      imageFilePath: string;
      isCoverImage: boolean;
      orderRank: number | null;
    }>;
  };
};

export default function Similarproperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [openShareIndex, setOpenShareIndex] = useState<number | null>(null);
  // Add bookmarking state
  const [bookmarkedProperties, setBookmarkedProperties] = useState<Set<string>>(new Set());

  // Handler to toggle bookmark
  const handleCheckboxClick = (propertyId: string) => {
    setBookmarkedProperties(prev => {
      const newBookmarks = new Set(prev);
      if (newBookmarks.has(propertyId)) {
        newBookmarks.delete(propertyId);
      } else {
        newBookmarks.add(propertyId);
      }
      return newBookmarks;
    });
  };

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

  // Helper function to get the best available image for a property
  const getPropertyImage = (property: Property) => {
    if (!property.imageUrls?.Images || property.imageUrls.Images.length === 0) {
      return defaultPropertyImage;
    }
    
    // First try to find a cover image
    const coverImage = property.imageUrls.Images.find(img => img.isCoverImage);
    if (coverImage) {
      return coverImage.imageFilePath;
    }
    
    // If no cover image, return the first available image
    return property.imageUrls.Images[0].imageFilePath;
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

  // Helper to get property URL
  const getPropertyUrl = (property: Property) => {
    if (!property.title) return typeof window !== 'undefined' ? window.location.href : '';
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/property-details/${encodeURIComponent(property.title)}`;
    }
    return `/property-details/${encodeURIComponent(property.title)}`;
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
                <span className="text-[#6E6E73]">Take a look at whats new right now.</span>
              </h2>
            </div>

            {/* Property Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.slice(0, 4).map((property, index) => (
                <div
                  key={property.id}
                  className="w-full max-w-[307.5px] bg-[#F1F1F4] rounded-lg overflow-hidden border border-gray-200 mx-auto flex flex-col hover:shadow-lg transition cursor-pointer"
                >
                  {/* Header with title and checkbox */}
                  <div className="p-3 flex justify-between items-center">
                    <div>
                      <Link href={`/property-details/${encodeURIComponent(property.title ?? "")}`} prefetch={false}>
                        <h3 className="font-medium text-black text-base">
                          {property.title || "Prime Business Hub"}
                        </h3>
                      </Link>
                      <div className="flex items-center text-gray-500 text-xs">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {property.address?.subLocality || property.address?.city || "Location Name"}
                      </div>
                    </div>
                    <button
                          onClick={() => handleCheckboxClick(property.id)}
                          className={`w-5 h-5 border rounded flex items-center justify-center cursor-pointer ${
                            bookmarkedProperties.has(property.id)
                              ? "border-green-500 bg-green-500"
                              : "border-gray-400"
                          }`}
                        >
                          {bookmarkedProperties.has(property.id) && (
                            <svg
                              className="w-3 h-3 text-white"
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
                          )}
                        </button>
                  </div>

                  {/* Property Image */}
                  <Link href={`/property-details/${encodeURIComponent(property.title ?? "")}`} prefetch={false}>
                    <div className="relative h-[180px]">
                      <Image
                        src={getPropertyImage(property)}
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
                        <span className="ml-1 transition-all duration-300 group-hover:font-medium">
                              {property.propertyType?.childType?.displayName ||
                                "Office space"}
                            </span></div>
                    </div>
                  </Link>

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
                         <div className="flex space-x-1 relative">
                                              {/* Bookmark button (functional) */}
                                            
                                              {/* Location button */}
                                              <button
                                                className="p-1.5 rounded flex items-center cursor-pointer justify-center transition-all duration-300 hover:bg-red-200 hover:scale-110 hover:shadow-md active:scale-95"
                                                aria-label="View on Map"
                                                onClick={() => {
                                                  const address = [
                                                    property.address?.subLocality,
                                                    property.address?.city,
                                                    property.address?.state
                                                  ].filter(Boolean).join(", ");
                                                  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
                                                  window.open(mapUrl, '_blank');
                                                }}
                                              >
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  fill="none"
                                                  viewBox="0 0 24 24"
                                                  strokeWidth={1.5}
                                                  stroke="currentColor"
                                                  className="w-5 h-5 text-red-500"
                                                >
                                                  <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 21c-4.418 0-8-5.373-8-10A8 8 0 0112 3a8 8 0 018 8c0 4.627-3.582 10-8 10zm0-7a3 3 0 100-6 3 3 0 000 6z"
                                                  />
                                                </svg>
                                              </button>
                                              {/* Share button */}
                                              <div className="relative">
                                                <button
                                                  className="p-1.5 rounded cursor-pointer flex items-center justify-center transition-all duration-300 hover:bg-blue-200 hover:scale-110 hover:shadow-md active:scale-95"
                                                  onClick={() => setOpenShareIndex(openShareIndex === index ? null : index)}
                                                  aria-label="Share"
                                                  type="button"
                                                >
                                                  <Image
                                                    src={share}
                                                    alt="Share"
                                                    width={20}
                                                    height={20}
                                                    className="object-contain transition-all duration-300 hover:scale-110"
                                                  />
                                                </button>
                                                <ShareModal
                                                  open={openShareIndex === index}
                                                  onClose={() => setOpenShareIndex(null)}
                                                  property={property}
                                                  getPropertyUrl={getPropertyUrl}
                                                />
                                              </div>
                                              {/* WhatsApp button */}
                                              <a
                                                href={`https://wa.me/7039311539?text=${encodeURIComponent(property.title || 'Check out this property!')}%20${encodeURIComponent(getPropertyUrl(property))}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-1.5 items-center justify-center transition-all duration-300 hover:bg-green-200 hover:scale-110 hover:shadow-md active:scale-95 flex rounded"
                                                aria-label="WhatsApp"
                                              >
                                                <Image
                                                  src={whatsapp}
                                                  alt="WhatsApp"
                                                  width={20}
                                                  height={20}
                                                  className="object-contain transition-all duration-300 hover:scale-110"
                                                />
                                              </a>
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