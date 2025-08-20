"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import latestpropertytype from "../../../public/assets/images/latestpropertytype.svg";
import sqft from "../../../public/assets/images/sqft.png";
import homeimproment from "../../../public/assets/images/home-improvement1.png";
import parking from "../../../public/assets/images/parking.png";
import bath from "../../../public/assets/images/bath.png";
import pin from "../../../public/assets/images/marker-pin-01.png";
import bookmark from "../../../public/assets/images/bookmark.png";
import WhyrealtraSpaces from "../whyrealtraSpaces/page";
import { Raleway } from "next/font/google";

// Load Raleway font
const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-raleway",
});

type Property = {
  id: string;
  title?: string;
  imageUrls?: {
    Images?: Array<{
      imageFilePath: string;
      isCoverImage: boolean;
      orderRank?: number | null;
    }>;
  };
  propertyType?: {
    displayName?: string;
    childType?: {
      displayName?: string;
    };
  };
  monetaryInfo?: {
    expectedPrice?: number;
    monthlyRentAmount?: number;
  };
  dimension?: {
    area?: string | number;
    unit?: string;
  };
  furnishStatus?: string;
  status?: string;
  address?: {
    subLocality?: string;
    city?: string;
    state?: string;
  };
  notes?: string;
  enquiredFor?: string;
  serialNo?: string;
};

const FeaturedProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check authentication status
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoggedIn(!!localStorage.getItem("authToken"));
    }
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(
          "https://prd-lrb-webapi.leadrat.com/api/v1/property/anonymous?PageNumber=1&PageSize=6",
          {
            method: "GET",
            headers: {
              accept: "application/json",
              tenant: "realtraspaces",
            },
          }
        );
        const data = await response.json();
        console.log("API response:", data);
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleItems(prev => new Set(prev).add(index));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    const propertyElements = document.querySelectorAll('.property-card');
    propertyElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [properties]);

  if (loading) {
    return (
      <section
        className={`${raleway.className} py-12 px-4 sm:px-6 lg:px-8 bg-gray-50`}
      >
        <div className="max-w-5xl mx-auto">
          <p>Loading properties...</p>
        </div>
      </section>
    );
  }

  interface FormatPrice {
    (price?: number, enquiredFor?: string): string;
  }

  const formatPrice: FormatPrice = (price, enquiredFor) => {
    if (!price) return "Price on request";

    if (enquiredFor === "Rent") {
      return `₹ ${price.toLocaleString()} /month`;
    } else {
      // For sale properties
      if (price >= 10000000) {
        return `₹ ${(price / 10000000).toFixed(2)} Cr`;
      } else if (price >= 100000) {
        return `₹ ${(price / 100000).toFixed(2)} Lac`;
      } else {
        return `₹ ${price.toLocaleString()}`;
      }
    }
  };

  interface FurnishStatusMap {
    [key: string]: string;
  }

  const getFurnishStatus = (status?: string): string => {
    const statusMap: FurnishStatusMap = {
      FullyFurnished: "Fully Furnished",
      SemiFurnished: "Semi Furnished",
      Unfurnished: "Unfurnished",
      Unknown: "Status Unknown",
    };
    return statusMap[status ?? ""] || "Status Unknown";
  };

  const getPropertyNotes = (notes?: string): string => {
    if (!notes) return "";
    // Extract the first sentence or limit to 100 characters
    const firstSentence = notes.split(".")[0];
    return firstSentence.length > 100
      ? firstSentence.substring(0, 100) + "..."
      : firstSentence;
  };

  // Function to create a URL-friendly slug from the property title
  const createSlug = (title?: string): string => {
    if (!title) return "property";
    return title.replace(/\s+/g, "-").toLowerCase();
  };

  return (
    <>
      <style jsx global>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-left {
          animation: slideInLeft 0.8s ease-out forwards;
        }

        .animate-slide-right {
          animation: slideInRight 0.8s ease-out forwards;
        }

        .animate-fade-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .property-card {
          opacity: 0;
          transform: translateX(-100px);
          transition: all 0.3s ease;
        }

        .property-card.visible-left {
          animation: slideInLeft 0.8s ease-out forwards;
        }

        .property-card.visible-right {
          animation: slideInRight 0.8s ease-out forwards;
        }

        .property-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .property-image {
          transition: transform 0.3s ease;
        }

        .property-card:hover .property-image {
          transform: scale(1.05);
        }

        .property-tags span {
          transition: all 0.3s ease;
        }

        .property-card:hover .property-tags span {
          transform: translateY(-2px);
        }

        .property-details > div {
          transition: transform 0.3s ease;
        }

        .property-card:hover .property-details > div {
          transform: translateY(-2px);
        }

        .bookmark-btn {
          transition: transform 0.3s ease;
        }

        .property-card:hover .bookmark-btn {
          transform: rotate(10deg) scale(1.1);
        }

        .details-btn {
          transition: all 0.3s ease;
        }

        .details-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }

        .header-animate {
          opacity: 0;
          transform: translateY(30px);
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>

      <section
        className={`${raleway.className} py-12 px-4 sm:px-6 lg:px-8 bg-gray-50`}
      >
        <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="mb-6 max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-black header-animate">
              Explore Commercial Properties in BKC
            </h2>
          </div>

          <div className="space-y-6 max-w-5xl mx-auto">
            {properties.map((property, index) => (
              <div
                key={property.id}
                className={`property-card bg-white rounded-lg shadow-sm overflow-hidden ${
                  visibleItems.has(index) 
                    ? (index % 2 === 0 ? 'visible-left' : 'visible-right')
                    : ''
                }`}
                data-index={index}
              >
                <div
                  className={`flex flex-col sm:flex-row ${
                    index % 2 !== 0 ? "sm:flex-row-reverse" : ""
                  }`}
                >
                  {/* Image */}
                  <div className="w-full sm:w-1/3 p-2 overflow-hidden flex items-center justify-center">
                    {property.imageUrls?.Images && property.imageUrls.Images.length > 0 ? (
                      <img
                        src={property.imageUrls.Images[0].imageFilePath}
                        alt={isLoggedIn ? property.title : "Property Details"}
                        className="property-image w-full h-56 object-cover rounded-2xl p-2"
                      />
                    ) : (
                      <Image
                        alt="Property"
                        src={latestpropertytype}
                        className="property-image  w-full h-56 object-cover rounded-2xl p-2"
                      />
                    )}
                  </div>

                  <div className="bg-gray-400 border-r border"></div>

                  {/* Content */}
                  <div className="w-full sm:w-2/3 p-4 px-8">
                    {/* Property Tag */}
                    <div className="property-tags mb-3">
                      <span className="bg-[#6E6E73] text-white px-3 py-1 rounded-full text-sm">
                        {property.propertyType?.childType?.displayName ||
                          property.propertyType?.displayName ||
                          "Office Space"}
                      </span>
                      <span className="ml-2 bg-[#6E6E73] text-white px-3 py-1 rounded-full text-sm">
                        {property.enquiredFor || "For Sale/Rent"}
                      </span>
                    </div>

                    {/* Title and Price */}
                    <h3 className="font-semibold text-xl text-gray-900 transition-colors duration-300">
                      {isLoggedIn ? (property.title || "ONE BKC C Wing") : "Property Details"}
                    </h3>
                    <h4 className="text-base text-gray-500 font-mono mb-4 transition-colors duration-300">
                      {formatPrice(
                        property.monetaryInfo?.expectedPrice ||
                          property.monetaryInfo?.monthlyRentAmount,
                        property.enquiredFor
                      )}
                    </h4>

                    {/* Property Details */}
                    <div className="property-details flex flex-wrap space-x-4 md:space-x-12 border-t border-b border-gray-200 py-3 mb-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <Image src={sqft} alt="Area" width={20} height={20} />
                        <div className="flex flex-col">
                          <span className="text-md text-gray-600">Area</span>
                          <span className="text-sm font-medium text-gray-500">
                            {property.dimension?.area || "N/A"}{" "}
                            {property.dimension?.unit || "Sq. Feet"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mb-2">
                        <Image src={bath} alt="Bath" width={20} height={20} />
                        <div className="flex flex-col">
                          <span className="text-md text-gray-600">Status</span>
                          <span className="text-sm font-medium text-gray-500">
                            {getFurnishStatus(property.furnishStatus)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mb-2">
                        <Image
                          src={homeimproment}
                          alt="Status"
                          width={20}
                          height={20}
                        />
                        <div className="flex flex-col">
                          <span className="text-md text-gray-600">
                            Availability
                          </span>
                          <span className="text-sm font-medium text-gray-500">
                            {property.status === "Active"
                              ? "Ready to Move"
                              : "Coming Soon"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mb-2">
                        <Image
                          src={parking}
                          alt="Parking"
                          width={20}
                          height={20}
                        />
                        <div className="flex flex-col">
                          <span className="text-md text-gray-600">
                            Property ID
                          </span>
                          <span className="text-sm font-medium text-gray-500">
                            {property.serialNo || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Location and Actions */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-1">
                        <Image
                          src={pin}
                          alt="Location"
                          width={20}
                          height={20}
                        />
                        <span className="text-md text-gray-700">
                          {property.address?.subLocality || ""},{" "}
                          {property.address?.city || "Mumbai"},{" "}
                          {property.address?.state || "Maharashtra"}
                        </span>
                      </div>

                      <div className="flex items-center cursor-pointer space-x-3">
                        <button className="bookmark-btn p-1 cursor-pointer">
                          <Image
                            src={bookmark}
                            alt="Bookmark"
                            width={30}
                            height={30}
                          />
                        </button>
                        <Link
                          href={`/property-details/${createSlug(property.title)}`}
                          className="details-btn bg-black text-white px-5 py-1 text-md rounded cursor-pointer hover:bg-gray-800 transition-colors"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WhyrealtraSpaces />
    </>
  );
};

export default FeaturedProperties;