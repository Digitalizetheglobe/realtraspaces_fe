"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Raleway } from "next/font/google";
// import Similarproperties from "../similarproperties/page";
// Import your static images
import contactimg from "../../../../public/assets/images/contactimg.png";
import propertydetails from "../../../../public/assets/images/property-details.png";
import propertydetails1 from "../../../../public/assets/images/property-details1.png";
import propertydetails2 from "../../../../public/assets/images/property-details2.png";
import propertydetails3 from "../../../../public/assets/images/property-details3.png";
import propertydetails4 from "../../../../public/assets/images/property-details4.png";
import sqft from "../../../../public/assets/images/sqft.png";
import propertyvideo from "../../../../public/assets/images/property-video.png";
import parking from "../../../../public/assets/images/parking.png";
import pin from "../../../../public/assets/images/marker-pin-01.png";
import floor from "../../../../public/assets/images/floor.png";
import location from "../../../../public/assets/images/location.png";
import Similarproperties from "@/app/similarproperties/page";

// Initialize Raleway font
const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
    monthlyRentAmount?: number;
    depositAmount?: number;
    maintenanceCost?: number;
    brokerageUnit?: number;
    currency?: string;
    isNegotiable?: boolean;
  };
  dimension?: {
    area?: string | number;
    unit?: string;
    carpetArea?: number;
    buildUpArea?: number;
    length?: number;
    breadth?: number;
  };
  furnishStatus?: string;
  status?: string;
  address?: {
    subLocality?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    community?: string;
    towerName?: string;
  };
  notes?: string;
  enquiredFor?: string;
  serialNo?: string;
  possessionDate?: string;
  amenities?: Array<any>;
  attributes?: Array<any>;
  aboutProperty?: string;
  ownerDetails?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  noOfBHK?: number;
  bhkType?: string;
  facing?: string;
  tagInfo?: {
    id?: string;
  };
};

export default function PropertyDetails() {
  const params = useParams();
  const propertyTitle = params.title as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [startIndex, setStartIndex] = useState(0);
  const [mainImage, setMainImage] = useState(propertydetails);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const propertyOverviewRef = useRef<HTMLDivElement | null>(null);
  const [isSticky, setIsSticky] = useState(true);

  const thumbnails = [
    propertydetails1,
    propertydetails2,
    propertydetails3,
    propertydetails4,
    propertydetails1,
    propertydetails2,
  ];
  const visibleCount = 4;

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const decodedTitle = decodeURIComponent(propertyTitle).replace(/-/g, " ");
        
        const response = await fetch(
          `https://prd-lrb-webapi.leadrat.com/api/v1/property/anonymous?PageNumber=1&PageSize=100&PropertyTitle=${encodeURIComponent(decodedTitle)}`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              tenant: "realtraspaces",
            },
          }
        );
        
        const data = await response.json();
        const properties = Array.isArray(data) ? data : data.items || data.data || [];
        
        if (properties.length > 0) {
          setProperty(properties[0]);
          
          // Set image URLs from API if available, otherwise use default images
          if (properties[0].imageUrls && typeof properties[0].imageUrls === "object" && Object.keys(properties[0].imageUrls).length > 0) {
            setImageUrls(Object.values(properties[0].imageUrls));
            // setMainImage(Object.values(properties[0].imageUrls)[0]);
          } else {
            // setImageUrls([propertydetails, propertydetails1, propertydetails2, propertydetails3]);
            setMainImage(propertydetails); // Ensure mainImage is set to a default image
          }
        } else {
          console.warn("No property found with this title:", decodedTitle);
          setProperty(null);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching property details:", error);
        setLoading(false);
      }
    };

    if (propertyTitle) {
      fetchPropertyDetails();
    }

    const handleScroll = () => {
      if (propertyOverviewRef.current) {
        const overviewPosition = propertyOverviewRef.current.getBoundingClientRect().top;
        setIsSticky(overviewPosition > window.innerHeight * 0.5);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [propertyTitle]);

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    if (startIndex + visibleCount < thumbnails.length) {
      setStartIndex((prev) => prev + 1);
    }
  };

  const handleThumbnailClick = (img: string) => {
    // setMainImage(img);
  };

  const visibleImages = imageUrls.length > 0 
    ? imageUrls.slice(startIndex, startIndex + visibleCount)
    : thumbnails.slice(startIndex, startIndex + visibleCount);

  const formatPrice = (price?: number, enquiredFor?: string): string => {
    if (!price) return "Price on request";

    if (enquiredFor === "Rent") {
      return `₹ ${price.toLocaleString()} /month`;
    } else {
      if (price >= 10000000) {
        return `₹ ${(price / 10000000).toFixed(2)} Cr`;
      } else if (price >= 100000) {
        return `₹ ${(price / 100000).toFixed(2)} Lac`;
      } else {
        return `₹ ${price.toLocaleString()}`;
      }
    }
  };


  const getFurnishStatus = (status?: string): string => {
    const statusMap: Record<string, string> = {
      FullyFurnished: "Fully Furnished",
      SemiFurnished: "Semi Furnished",
      Unfurnished: "Unfurnished",
      Unknown: "Status Unknown",
    };
    return statusMap[status ?? ""] || "Status Unknown";
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "Not specified";
    
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className={raleway.className}>
        <main className="min-h-screen bg-white">
          <section className="relative h-[70vh] w-full bg-gray-200 animate-pulse"></section>
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 h-64 bg-gray-200 rounded"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!property) {
    return (
      <div className={raleway.className}>
        <main className="min-h-screen bg-white">
          <section className="relative h-[70vh] w-full">
            <div className="absolute inset-0">
              <Image
                src={contactimg}
                alt="Modern Home Interior"
                fill
                priority
                className="object-cover"
              />
            </div>
          </section>
          <div className="max-w-7xl mx-auto px-4 py-12 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Property Not Found</h1>
            <p className="text-gray-600 mb-6">The property you are looking for does not exist or may have been removed.</p>
            <Link href="/" className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition">
              Back to Home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={raleway.className}>
       <main className="min-h-screen bg-white">
        {/* Hero Section */}
         <section className="relative h-[60vh] w-full">
          <div className="absolute inset-0">
            {imageUrls.length > 0 ? (
              <img
                src={imageUrls[0]}
                alt={property.title || "Property"}
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={contactimg}
                alt="Modern Home Interior"
                fill
                priority
                className="object-cover"
              />
            )}
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center space-y-4">
            <h1 className="text-white text-4xl font-bold">  {property.title}</h1>
            <nav aria-label="breadcrumb">
              <ol className="text-white text-lg flex space-x-2">
                <li>
                  <Link href="/" className="">
                    Home
                  </Link>
                </li>
                <li>{">"}</li>
                <li className="">Properties</li>
              </ol>
            </nav>
          </div>
        </section>

        {/* Property Details Section */}
        <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
              {/* Left Side - Image Gallery */}
              <div
                className={`max-w-5xl mx-auto p-4 ${
                  isSticky ? "sticky top-4 self-start" : ""
                }`}
              >
              {/* Main Image */}
              <div className="mb-4 rounded-lg overflow-hidden shadow-lg border border-gray-200">
                  <Image
                    src={mainImage}
                    alt="Main View"
                    className="w-full h-[400px] object-cover"
                    width={800}
                    height={600}
                  />
                </div>

              {/* Thumbnails with arrows */}
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={handlePrev}
                  disabled={startIndex === 0}
                  className={`p-2 rounded-full bg-white shadow-md ${
                    startIndex === 0
                      ? "opacity-30 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <div className="flex gap-3 overflow-hidden">
                  {visibleImages.map((img, index) => (
                    <div
                      key={index}
                      className={`cursor-pointer rounded-md overflow-hidden border-2 transition ${
                        mainImage === img
                          ? "border-blue-500"
                          : "border-transparent"
                      }`}
                      // onClick={() => handleThumbnailClick(img)}
                    >
                      {typeof img === 'string' ? (
                        <img
                          src={img}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-24 h-24 object-cover"
                        />
                      ) : (
                        <Image
                          src={img}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-24 h-24 object-cover"
                          width={96}
                          height={80}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  disabled={startIndex + visibleCount >= (imageUrls.length > 0 ? imageUrls.length : thumbnails.length)}
                  className={`p-2 rounded-full bg-white shadow-md ${
                    startIndex + visibleCount >= (imageUrls.length > 0 ? imageUrls.length : thumbnails.length)
                      ? "opacity-30 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right Side - Property Details */}
            <div
              className={`${
                isSticky ? " sticky w-full md:w-1/2 font-sans" : ""
              }`}
            >
              {/* Sticky Header Section */}
              <div
                className={`${
                  isSticky
                    ? "sticky top-0 bg-white z-10 pb-4 pt-4 border-b border-gray-200"
                    : ""
                }`}
              >
                <h1 className="text-xl font-semibold text-black">
                  {property.title || "Property"}
                </h1>
                <div className="flex mt-2">
                  <Image
                    src={pin}
                    alt="icon"
                    width={20}
                    height={20}
                    className="mt-1"
                  />
                  <p className="text-gray-500 text-sm mt-1">
                    {property.address?.subLocality || property.address?.community || ""}, 
                    {property.address?.city ? ` ${property.address.city}, ` : " "}
                    {property.address?.state || ""}
                    {property.address?.postalCode ? ` - ${property.address.postalCode}` : ""}
                  </p>
                </div>

                {/* Badges */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-sm bg-gray-100 text-gray-600 px-4 py-2 rounded-full">
                    {property.enquiredFor || "For Sale/Rent"}
                  </span>
                  <span className="text-sm bg-gray-100 text-gray-600 px-4 py-2 rounded-full">
                    {property.status === "Active" ? "Available" : "Not Available"}
                  </span>
                  {property.possessionDate && (
                    <span className="text-sm bg-gray-100 text-gray-600 px-4 py-2 rounded-full">
                      {new Date(property.possessionDate) <= new Date() 
                        ? "Immediate Possession" 
                        : `Possession on ${formatDate(property.possessionDate)}`}
                    </span>
                  )}
                </div>

                {/* Buttons */}
                <div className="mt-5 flex flex-wrap gap-3">
                  <button className="border border-black text-black text-sm font-medium py-2 px-10 rounded-lg">
                    Enquire Now
                  </button>
                  <button className="bg-black text-white text-sm font-medium py-2 px-10 rounded-lg">
                    Schedule a Visit
                  </button>
                </div>
              </div>

              <div className="mt-8 bg-gray-100 p-4 rounded-xl">
                <h2 className="text-xl font-semibold text-gray-800 p-4">
                  Property Highlights
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-100">
                  <div className="flex items-start gap-4 p-2">
                    <Image
                      src={pin}
                      alt="icon"
                      width={20}
                      height={20}
                      className="mt-1"
                    />
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="font-medium text-gray-800">
                        {property.propertyType?.childType?.displayName || 
                         property.propertyType?.displayName || 
                         "Office Space"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-2">
                    <Image
                      src={pin}
                      alt="icon"
                      width={20}
                      height={20}
                      className="mt-1"
                    />
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="font-medium text-gray-800">
                        {property.enquiredFor || "On Lease"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-2">
                    <Image
                      src={floor}
                      alt="icon"
                      width={20}
                      height={20}
                      className="mt-1"
                    />
                    <div>
                      <p className="text-sm text-gray-500">Floor</p>
                      <p className="font-medium text-gray-800">
                        {property.tagInfo?.id ? "Floor info" : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-2">
                    <Image
                      src={sqft}
                      alt="icon"
                      width={20}
                      height={20}
                      className="mt-1"
                    />
                    <div>
                      <p className="text-sm text-gray-500">Chargeable Area</p>
                      <p className="font-medium text-gray-800">
                        {property.dimension?.area || "N/A"} {property.dimension?.unit || "sq ft"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-2">
                    <Image
                      src={sqft}
                      alt="icon"
                      width={20}
                      height={20}
                      className="mt-1"
                    />
                    <div>
                      <p className="text-sm text-gray-500">Carpet</p>
                      <p className="font-medium text-gray-800">
                        {property.dimension?.carpetArea || "N/A"} sq ft
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-2">
                    <Image
                      src={pin}
                      alt="icon"
                      width={20}
                      height={20}
                      className="mt-1"
                    />
                    <div>
                      <p className="text-sm text-gray-500">Building Structure</p>
                      <p className="font-medium text-gray-800">
                        {property.dimension?.length && property.dimension?.breadth 
                          ? `${property.dimension.length} x ${property.dimension.breadth}` 
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-2">
                    <Image
                      src={pin}
                      alt="icon"
                      width={20}
                      height={20}
                      className="mt-1"
                    />
                    <div>
                      <p className="text-sm text-gray-500">Efficiency</p>
                      <p className="font-medium text-gray-800">
                        {property.dimension?.carpetArea && property.dimension?.area
                          ? `${Math.round((Number(property.dimension.carpetArea) / Number(property.dimension.area)) * 100)}%`
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-2">
                    <Image
                      src={pin}
                      alt="icon"
                      width={20}
                      height={20}
                      className="mt-1"
                    />
                    <div>
                      <p className="text-sm text-gray-500">Quoted Rent</p>
                      <p className="font-medium text-gray-800">
                        {formatPrice(
                          property.monetaryInfo?.expectedPrice || property.monetaryInfo?.monthlyRentAmount,
                          property.enquiredFor
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-2">
                    <Image
                      src={pin}
                      alt="icon"
                      width={20}
                      height={20}
                      className="mt-1"
                    />
                    <div>
                      <p className="text-sm text-gray-500">Maintenance</p>
                      <p className="font-medium text-gray-800">
                        {property.monetaryInfo?.maintenanceCost
                          ? `₹ ${property.monetaryInfo.maintenanceCost.toLocaleString()}/month`
                          : "Included in rent"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-2">
                    <Image
                      src={pin}
                      alt="icon"
                      width={20}
                      height={20}
                      className="mt-1"
                    />
                    <div>
                      <p className="text-sm text-gray-500">Taxes</p>
                      <p className="font-medium text-gray-800">
                        Included in rent
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-2">
                    <Image
                      src={pin}
                      alt="icon"
                      width={20}
                      height={20}
                      className="mt-1"
                    />
                    <div>
                      <p className="text-sm text-gray-500">Possession</p>
                      <p className="font-medium text-gray-800">
                        {property.possessionDate
                          ? new Date(property.possessionDate) <= new Date()
                            ? "Immediate"
                            : formatDate(property.possessionDate)
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-2">
                    <Image
                      src={pin}
                      alt="icon"
                      width={20}
                      height={20}
                      className="mt-1"
                    />
                    <div>
                      <p className="text-sm text-gray-500">Condition</p>
                      <p className="font-medium text-gray-800">
                        {getFurnishStatus(property.furnishStatus)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-2">
                    <Image
                      src={parking}
                      alt="icon"
                      width={20}
                      height={20}
                      className="mt-1"
                    />
                    <div>
                      <p className="text-sm text-gray-500">Car Park Ratio</p>
                      <p className="font-medium text-gray-800">
                        1:1000 sq.ft.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-2">
                    <Image
                      src={parking}
                      alt="icon"
                      width={20}
                      height={20}
                      className="mt-1"
                    />
                    <div>
                      <p className="text-sm text-gray-500">Car Park Charges</p>
                      <p className="font-medium text-gray-800">
                        ₹7,500 per car park
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-2">
                    <Image
                      src={pin}
                      alt="icon"
                      width={20}
                      height={20}
                      className="mt-1"
                    />
                    <div>
                      <p className="text-sm text-gray-500">Security Deposit</p>
                      <p className="font-medium text-gray-800">
                        {property.monetaryInfo?.depositAmount
                          ? `₹ ${property.monetaryInfo.depositAmount.toLocaleString()}`
                          : "12 months"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 mt-12">
                  Features and Amenities
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {property.amenities?.length ? (
                    property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-4 h-4 border-gray-400 border flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-black"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 border-gray-400 border flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-black"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-700">Power Backup</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 border-gray-400 border flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-black"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-700">24x7 Security</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 border-gray-400 border flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-black"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-700">Conference Hall</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 border-gray-400 border flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-black"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-700">CCTV Surveillance</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 border-gray-400 border flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-black"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-700">Pantry Area</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 border-gray-400 border flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-black"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-700">Wi-Fi & LAN</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 border-gray-400 border flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-black"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-700">Covered Parking</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 border-gray-400 border flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-black"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-700">Lift Access</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 border-gray-400 border flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-black"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-700">Biometric Entry</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 border-gray-400 border flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-black"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-700">Fire Safety Compliance</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Property Overview
                </h2>
                <div className="bg-gray-100 p-6 rounded-xl">
                  <p className="text-gray-700 leading-relaxed">
                    Located in the bustling commercial hub of Andheri East,
                    215 Atrium offers a prime leasing opportunity with 35,000
                    sq.ft. chargeable space. With excellent connectivity and
                    70% efficiency, this bare shell property is ideal for
                    companies looking for scalable office space.
                  </p>
                </div>
              </div>

              <div className="max-w-5xl mx-auto mt-10">
                <h1 className="text-black text-xl font-semibold">
                  Property Video
                </h1>
                <div className="mt-8">
                  <Image
                    src={propertyvideo}
                    alt="property"
                    className="items-center justify-center mx-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 max-w-5xl mx-auto px-4">
          <h1 className="text-black text-xl font-semibold mb-2">Location</h1>
          <p className="text-gray-700 text-md">
            Located in the bustling commercial hub of Andheri East, 215
            Atrium.
          </p>
          <div className="py-4 mt-8">
            <Image
              src={location}
              alt="property location"
              className="items-center justify-center mx-auto"
            />
          </div>
        </div>
      {/* </div> */}
    </main>
    <Similarproperties />
    </div>
  
  );
}