"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
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
  imageUrls: { [key: string]: string };
  propertyType?: {
    displayName?: string;
    childType?: {
      displayName?: string;
    };
  };
  monetaryInfo?: {
    expectedPrice?: number;
  };
  dimension?: {
    area?: string | number;
  };
  furnishStatus?: string;
  status?: string;
  address?: {
    subLocality?: string;
    city?: string;
  };
};

const FeaturedProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(
          "https://prd-lrb-webapi.leadrat.com/api/v1/property/anonymous?PageNumber=1&PageSize=3",
          {
            method: "GET",
            headers: {
              accept: "application/json",
              tenant: "realtraspaces",
            },
          }
        );
        const data = await response.json();
        // Log the response to inspect its structure
        console.log("API response:", data);
        // Set the correct array based on the response structure
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
    (price?: number): string;
  }

  const formatPrice: FormatPrice = (price) => {
    if (!price) return "Price not available";
    return `₹ ${(price / 100000).toFixed(2)} Cr`;
  };

  interface FurnishStatusMap {
    [key: string]: string;
  }

  const getFurnishStatus = (status?: string): string => {
    const statusMap: FurnishStatusMap = {
      FullyFurnished: "Fully Furnished",
      SemiFurnished: "Semi Furnished",
      Unfurnished: "Unfurnished",
    };
    return statusMap[status ?? ""] || "Fully Furnished";
  };

  return (
    <>
      <section
        className={`${raleway.className} py-12 px-4 sm:px-6 lg:px-8 bg-gray-50`}
      >
        <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="mb-6 max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-black">
              Explore More Listings
            </h2>
          </div>

          <div className="space-y-6 max-w-5xl mx-auto">
            {properties.map((property, index) => (
              <div
                key={property.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div
                  className={`flex flex-col sm:flex-row ${
                    index % 2 !== 0 ? "sm:flex-row-reverse" : ""
                  }`}
                >
                  {/* Image */}
                  <div className="w-full sm:w-1/3 p-2">
                    {Object.keys(property.imageUrls).length > 0 ? (
                      <img
                        src={
                          property.imageUrls[Object.keys(property.imageUrls)[0]]
                        }
                        alt={property.title}
                        className="w-full h-56 object-cover rounded-2xl p-2"
                      />
                    ) : (
                      <Image
                        alt="Property"
                        src={latestpropertytype}
                        className="w-full h-56 object-cover rounded-2xl p-2"
                      />
                    )}
                  </div>

                  <div className="bg-gray-400 border-r border"></div>

                  {/* Content */}
                  <div className="w-full sm:w-2/3 p-4 px-8">
                    {/* Property Tag */}
                    <div className="mb-3">
                      <span className="bg-[#6E6E73] text-white px-3 py-1 rounded-full text-sm">
                        {property.propertyType?.childType?.displayName ||
                          property.propertyType?.displayName ||
                          "Property"}
                      </span>
                    </div>

                    {/* Title and Price */}
                    <h3 className="font-semibold text-xl text-gray-900">
                      {property.title || "Property Title"}
                    </h3>
                    <h4 className="text-base text-gray-500 mb-4">
                      {formatPrice(property.monetaryInfo?.expectedPrice)}
                    </h4>

                    {/* Property Details */}
                    <div className="flex space-x-12 border-t border-b border-gray-200 py-3 mb-3">
                      <div className="flex items-center space-x-2">
                        <Image src={sqft} alt="Area" width={20} height={20} />
                        <div className="flex flex-col">
                          <span className="text-md text-gray-600">Sqft</span>
                          <span className="text-sm font-medium text-gray-500">
                            {property.dimension?.area || "N/A"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Image src={bath} alt="Bath" width={20} height={20} />
                        <div className="flex flex-col">
                          <span className="text-md text-gray-600">Fully </span>
                          <span className="text-sm font-medium text-gray-500">
                            {getFurnishStatus(property.furnishStatus)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Image
                          src={homeimproment}
                          alt="Area"
                          width={20}
                          height={20}
                        />
                        <div className="flex flex-col">
                          <span className="text-md text-gray-600">
                            Ready to{" "}
                          </span>
                          <span className="text-sm font-medium text-gray-500">
                            {property.status === "Active"
                              ? "Move"
                              : "Coming Soon"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Image
                          src={parking}
                          alt="Area"
                          width={20}
                          height={20}
                        />
                        <div className="flex flex-col">
                          <span className="text-md text-gray-600">
                            2 Reserved
                          </span>
                          <span className="text-sm font-medium text-gray-500">
                            Parking
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
                          {property.address?.subLocality ||
                            property.address?.city ||
                            "Location not specified"}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <button className="p-1">
                          <Image
                            src={bookmark}
                            alt="Bookmark"
                            width={30}
                            height={30}
                          />
                        </button>
                        <a
                          href="#"
                          className="bg-black text-white px-5 py-1 text-md rounded"
                        >
                          Details
                        </a>
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
