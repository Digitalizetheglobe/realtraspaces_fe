"use client";

import React, { useState, useRef, useEffect } from "react";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { Raleway } from "next/font/google";
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
import Similarproperties from "@/app/similarproperties/page";
import { GitCompare } from "lucide-react";

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
  amenities?: Array<string | { name: string; value: string }>;
  attributes?: Array<string | { name: string; value: string }>;
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
  const [mainImage, setMainImage] = useState<string | StaticImageData>(propertydetails);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const propertyOverviewRef = useRef<HTMLDivElement | null>(null);
  const [isSticky, setIsSticky] = useState(true);
  const [showEnquirePopup, setShowEnquirePopup] = useState(false);
  const [showSchedulePopup, setShowSchedulePopup] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    message: "",
    propertySlug: propertyTitle || "",
    visitDate: "",
    visitTime: "",
  });

  const thumbnails = [
    propertydetails1,
    propertydetails2,
    propertydetails3,
    propertydetails4,
    propertydetails1,
    propertydetails2,
  ];
  const visibleCount = 4;
  const [isComparing, setIsComparing] = useState(false);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const decodedTitle = decodeURIComponent(propertyTitle).replace(
          /-/g,
          " "
        );

        const response = await fetch(
          `https://prd-lrb-webapi.leadrat.com/api/v1/property/anonymous?PageNumber=1&PageSize=100&PropertyTitle=${encodeURIComponent(
            decodedTitle
          )}`,
          {
            method: "GET",
            headers: {
              accept: "application/json",
              tenant: "realtraspaces",
            },
          }
        );

        const data = await response.json();
        const properties = Array.isArray(data)
          ? data
          : data.items || data.data || [];

        if (properties.length > 0) {
          setProperty(properties[0]);

          // Set image URLs from API if available, otherwise use default images
          if (
            properties[0].imageUrls &&
            typeof properties[0].imageUrls === "object" &&
            Object.keys(properties[0].imageUrls).length > 0
          ) {
            const urls = Object.values(properties[0].imageUrls) as string[];
            setImageUrls(urls);
            setMainImage(urls[0] as any); // Set main image to first API image (string)
          } else {
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
        const overviewPosition =
          propertyOverviewRef.current.getBoundingClientRect().top;
        setIsSticky(overviewPosition > window.innerHeight * 0.5);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [propertyTitle]);

  const handlePrev = () => {
    if (startIndex > 0) {
      const newStartIndex = startIndex - 1;
      setStartIndex(newStartIndex);
      // Update mainImage to the new first visible image
      const newVisibleImages =
        imageUrls.length > 0
          ? imageUrls.slice(newStartIndex, newStartIndex + visibleCount)
          : thumbnails.slice(newStartIndex, newStartIndex + visibleCount);
      setMainImage(newVisibleImages[0]);
    }
  };

  const handleNext = () => {
    if (startIndex + visibleCount < (imageUrls.length > 0 ? imageUrls.length : thumbnails.length)) {
      const newStartIndex = startIndex + 1;
      setStartIndex(newStartIndex);
      // Update mainImage to the new first visible image
      const newVisibleImages =
        imageUrls.length > 0
          ? imageUrls.slice(newStartIndex, newStartIndex + visibleCount)
          : thumbnails.slice(newStartIndex, newStartIndex + visibleCount);
      setMainImage(newVisibleImages[0]);
    }
  };

  const handleEnquireClick = () => {
    setShowEnquirePopup(true);
    // Update the property slug in form data when opening the popup
    setFormData((prev) => ({
      ...prev,
      propertySlug: propertyTitle || "",
    }));
  };

  const handleClosePopup = () => {
    setShowEnquirePopup(false);
  };

  const handleScheduleClick = () => {
    setShowSchedulePopup(true);
    setFormData((prev) => ({
      ...prev,
      propertySlug: propertyTitle || "",
    }));
  };

  const handleCloseSchedulePopup = () => {
    setShowSchedulePopup(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData);
    // Close the popup after submission
    setShowEnquirePopup(false);
    // Reset form
    setFormData({
      name: "",
      mobile: "",
      message: "",
      propertySlug: propertyTitle || "",
      visitDate: "",
      visitTime: "",
    });
    // Show success message
    toast.success("Thank you for your enquiry! We'll get back to you soon.");
  };

  const handleSaveProperty = async () => {
    // Check if user is logged in
    const token = localStorage.getItem("authToken");

    if (!token) {
      // Redirect to signin page if not logged in
      toast.error("Please log in to save properties");
      router.push("/signin");
      return;
    }

    if (!property) {
      toast.error("Property information is not available");
      return;
    }

    try {
      setIsSaving(true);

      const response = await fetch(
        "https://api.realtraspaces.com/api/webusers/save-property",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            propertyId: property.id,
            propertyData: property,
          }),
        }
      );

      if (response.status === 401 || response.status === 403) {
        toast.error("You Are Not Login");
        router.push("/signin");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save property");
      }

      toast.success("Property saved successfully!");
    } catch (error) {
      console.error("Error saving property:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save property. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleThumbnailClick = (img: any) => {
    setMainImage(img);
  };

  const visibleImages =
    imageUrls.length > 0
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

  const handleCompareClick = async () => {
    // Check if user is logged in
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      toast.error("Please log in to compare properties");
      router.push("/signin");
      return;
    }
  
    if (!property) {
      toast.error("Property information is not available");
      return;
    }
  
    try {
      setIsComparing(true);
      
      const response = await fetch("https://api.realtraspaces.com/api/webusers/compare/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          propertyId: property.id,
          propertyData: property
        })
      });
  
      if (response.status === 401 || response.status === 403) {
        toast.error("You Are Not Login");
        router.push("/signin");
        return;
      }
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add property to comparison");
      }
  
      toast.success("Property added to comparison");
      
      // Optionally navigate to compare page
      router.push("/compareproperties");
      
    } catch (error) {
      console.error("Error adding to compare:", error);
      toast.error(error instanceof Error ? error.message : "Failed to add to comparison");
    } finally {
      setIsComparing(false);
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

  // Helper to build full address string for map
  const getFullAddress = (address?: Property["address"]) => {
    if (!address) return "";
    return [
      address.subLocality || address.community,
      address.city,
      address.state,
      address.postalCode,
    ]
      .filter(Boolean)
      .join(", ");
  };

  // Determine if mainImage is the first or last in visibleImages
  const isFirstImageActive =
    (typeof mainImage === "string" && mainImage === visibleImages[0]) ||
    (typeof mainImage !== "string" && mainImage === visibleImages[0]);
  const isLastImageActive =
    (typeof mainImage === "string" && mainImage === visibleImages[visibleImages.length - 1]) ||
    (typeof mainImage !== "string" && mainImage === visibleImages[visibleImages.length - 1]);

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
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Property Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The property you are looking for does not exist or may have been
              removed.
            </p>
            <Link
              href="/"
              className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition"
            >
              Back to Home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={raleway.className}>
      {/* Enquire Now Popup */}
      {showEnquirePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <button
              onClick={handleClosePopup}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Enquire About This Property
            </h2>
            <p className="text-gray-600 mb-6">
              Please fill out the form below and we'll get back to you soon.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Name"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="mobile"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border text-black border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Mobile Number"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border text-black border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your message or questions about this property"
                ></textarea>
              </div>

              <div className="text-sm text-gray-700">
  Enquiring for - <span className="font-medium text-black">{property?.title}</span>
</div>

                
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition duration-300"
                >
                  Submit Enquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule a Visit Popup */}
      {showSchedulePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <button
              onClick={handleCloseSchedulePopup}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Schedule a Visit
            </h2>
            <p className="text-gray-600 mb-6">
              Please fill out the form below and we'll get back to you soon.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                {/* <label
                  htmlFor="name"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Name <span className="text-red-500">*</span>
                </label> */}
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Name"
                />
              </div>

              <div className="mb-4">
                {/* <label
                  htmlFor="mobile"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Mobile Number <span className="text-red-500">*</span>
                </label> */}
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border text-black border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Mobile Number"
                />
              </div>

              {/* Date Field */}
              <div className="mb-4">
                {/* <label
                  htmlFor="visitDate"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Preferred Date <span className="text-red-500">*</span>
                </label> */}
                <input
                  type="date"
                  id="visitDate"
                  name="visitDate"
                  value={formData.visitDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Time Field */}
              <div className="mb-4">
                {/* <label
                  htmlFor="visitTime"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Preferred Time <span className="text-red-500">*</span>
                </label> */}
                <input
                  type="time"
                  id="visitTime"
                  name="visitTime"
                  value={formData.visitTime}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                {/* <label
                  htmlFor="message"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Message
                </label> */}
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border text-black border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your message or questions about this property"
                ></textarea>
              </div>

              <div className="text-sm text-gray-700">
   Schedule a Visit for - <span className="font-medium text-black">{property?.title}</span>
</div>

                
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition duration-300"
                >
                  Submit Enquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative h-[30vh] w-full">
          <div className="absolute inset-0">
            <Image
              src={propertydetails}
              alt={property.title || "Property"}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black opacity-50"></div>
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center space-y-4">
            <h1 className="text-white text-4xl font-bold"> {property.title}</h1>
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
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Side - Image Gallery */}
            <div
              className={`max-w-5xl mx-auto p-4 ${
                isSticky ? "sticky top-4 self-start" : ""
              }`}
            >
              {/* Main Image */}
              <div className="mb-4 rounded-lg overflow-hidden shadow-lg border border-gray-200 relative">
                {/* Previous Button */}
                <button
                  onClick={handlePrev}
                  disabled={startIndex === 0}
                  className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-md ${
                    startIndex === 0
                      ? "opacity-30 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  } ${isFirstImageActive ? "ring-2 ring-blue-500" : ""}`}
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
                {/* Main Image */}
                {typeof mainImage === "string" ? (
                  <img
                    src={mainImage}
                    alt="Main View"
                    className="w-full h-[400px] object-cover"
                    width={600}
                    height={450}
                  />
                ) : (
                  <Image
                    src={mainImage}
                    alt="Main View"
                    className="w-full h-[400px] object-cover"
                    width={600}
                    height={450}
                  />
                )}
                {/* Next Button */}
                <button
                  onClick={handleNext}
                  disabled={
                    startIndex + visibleCount >=
                    (imageUrls.length > 0
                      ? imageUrls.length
                      : thumbnails.length)
                  }
                  className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-md ${
                    startIndex + visibleCount >=
                    (imageUrls.length > 0
                      ? imageUrls.length
                      : thumbnails.length)
                      ? "opacity-30 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  } ${isLastImageActive ? "ring-2 ring-blue-500" : ""}`}
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

              {/* Thumbnails with arrows */}
              <div className="flex items-center justify-center gap-2">
               

                <div className="flex gap-3 overflow-hidden">
                  {visibleImages.map((img, index) => {
                    const isActive =
                      (typeof img === "string" && typeof mainImage === "string" && img === mainImage) ||
                      (typeof img !== "string" && typeof mainImage !== "string" && mainImage === img);

                    return (
                      <div
                        key={index}
                        className={`cursor-pointer rounded-md overflow-hidden border-2 transition ${
                          isActive ? "border-blue-500" : "border-transparent"
                        }`}
                        onClick={() => handleThumbnailClick(img)}
                      >
                        {typeof img === "string" ? (
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
                    );
                  })}
                </div>
                  
               
              </div>
              <div className="mt-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Property Overview
                </h2>
                <div className="bg-gray-100 p-6 rounded-xl max-w-2xl">
                  <p className="text-gray-700 leading-relaxed">
                    Located in the bustling commercial hub of Andheri East, 215
                    Atrium offers a prime leasing opportunity with 35,000 sq.ft.
                    chargeable space. With excellent connectivity and 70%
                    efficiency, this bare shell property is ideal for companies
                    looking for scalable office space.
                  </p>
                </div>
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
                    {property.address?.subLocality ||
                      property.address?.community ||
                      ""}
                    ,
                    {property.address?.city
                      ? ` ${property.address.city}, `
                      : " "}
                    {property.address?.state || ""}
                    {property.address?.postalCode
                      ? ` - ${property.address.postalCode}`
                      : ""}
                  </p>
                </div>

                {/* Badges */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-sm bg-gray-100 text-gray-600 px-4 py-2 rounded-full">
                    {property.enquiredFor || "For Sale/Rent"}
                  </span>
                  <span className="text-sm bg-gray-100 text-gray-600 px-4 py-2 rounded-full">
                    {property.status === "Active"
                      ? "Available"
                      : "Not Available"}
                  </span>
                  {property.possessionDate && (
                    <span className="text-sm bg-gray-100 text-gray-600 px-4 py-2 rounded-full">
                      {new Date(property.possessionDate) <= new Date()
                        ? "Immediate Possession"
                        : `Possession on ${formatDate(
                            property.possessionDate
                          )}`}
                    </span>
                  )}
                </div>

                {/* Buttons */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
  {/* Enquire Now */}
  <button
    onClick={handleEnquireClick}
    className="w-full cursor-pointer border border-black text-black text-sm font-medium py-2 px-6 rounded-lg hover:bg-gray-100 transition"
  >
    Enquire Now
  </button>

  {/* Schedule a Visit */}
  <button
    className="w-full bg-black cursor-pointer text-white text-sm font-medium py-2 px-6 rounded-lg hover:bg-gray-800 transition"
    onClick={handleScheduleClick}
  >
    Schedule a Visit
  </button>

  {/* Save Property */}
  <button
    className={`w-full flex items-center cursor-pointer justify-center gap-2 border border-black text-black text-sm font-medium py-2 px-6 rounded-lg hover:bg-gray-100 transition ${
      isSaving ? "opacity-70 cursor-not-allowed" : ""
    }`}
    onClick={handleSaveProperty}
    disabled={isSaving}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
      />
    </svg>
    {isSaving ? "Saving..." : "Save Property"}
  </button>

  {/* Compare */}
  <button
    onClick={handleCompareClick}
    disabled={isComparing}
    className="w-full flex items-center cursor-pointer justify-center gap-2 border border-black text-black text-sm font-medium py-2 px-6 rounded-lg hover:bg-gray-100 transition"
  >
    {isComparing ? (
      <>
        <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        Adding...
      </>
    ) : (
      <>
        <GitCompare className="h-5 w-5" />
        Compare
      </>
    )}
  </button>
</div>

              </div>

              <div className="mt-8 bg-gray-100 p-4 rounded-xl">
                <h2 className="text-xl font-semibold text-gray-800 p-4">
                  Property Highlights
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-100">
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
                        {property.dimension?.area || "N/A"}{" "}
                        {property.dimension?.unit || "sq ft"}
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
                      <p className="text-sm text-gray-500">
                        Building Structure
                      </p>
                      <p className="font-medium text-gray-800">
                        {property.dimension?.length &&
                        property.dimension?.breadth
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
                        {property.dimension?.carpetArea &&
                        property.dimension?.area
                          ? `${Math.round(
                              (Number(property.dimension.carpetArea) /
                                Number(property.dimension.area)) *
                                100
                            )}%`
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
                      <p className="text-sm text-gray-500">Quoted Total Rent</p>
                      <p className="font-medium text-gray-800">
                        {formatPrice(
                          property.monetaryInfo?.expectedPrice ||
                            property.monetaryInfo?.monthlyRentAmount,
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
                      <p className="font-medium text-gray-800">1:1000 sq.ft.</p>
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
                        <span className="text-gray-700">
                          {typeof amenity === 'string' ? amenity : amenity.name}
                        </span>
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
                        <span className="text-gray-700">
                          Fire Safety Compliance
                        </span>
                      </div>
                    </>
                  )}
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
            {getFullAddress(property.address) || "Location not specified."}
          </p>
          <div className="py-4 mt-8">
            {getFullAddress(property.address) ? (
              <iframe
                title="Property Location"
                width="100%"
                height="350"
                style={{ border: 0, borderRadius: "12px" }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodeURIComponent(getFullAddress(property.address))}&output=embed`}
                className="w-full rounded-lg"
              />
            ) : (
              <p className="text-gray-500">Map not available.</p>
            )}
          </div>
        </div>
      </main>
       <Similarproperties />
      
     {/* ,snbkjdashdkjhsadkjsakdjaspod
     ,xmcnkdjkodn
     d;jaoidjsaoidja */}
    </div>
  );
}
