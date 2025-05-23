"use client";

import React, { useState, useRef, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import contactimg from "../../../public/assets/images/contactimg.png";
import propertydetails from "../../../public/assets/images/property-details.png";
import propertydetails1 from "../../../public/assets/images/property-details1.png";
import propertydetails2 from "../../../public/assets/images/property-details2.png";
import propertydetails3 from "../../../public/assets/images/property-details3.png";
import propertydetails4 from "../../../public/assets/images/property-details4.png";
import sqft from "../../../public/assets/images/sqft.png";
import propertyvideo from "../../../public/assets/images/property-video.png";
import parking from "../../../public/assets/images/parking.png";
import pin from "../../../public/assets/images/marker-pin-01.png";
import latestproperty1 from "../../../public/assets/images/latestproperty1.png";
import latestproperty2 from "../../../public/assets/images/latestproperty2.png";
import latestproperty3 from "../../../public/assets/images/latestproperty3.png";
import floor from "../../../public/assets/images/floor.png";
import bookmark from "../../../public/assets/images/bookmark.png";
import location from '../../../public/assets/images/location.png'

export default function PropertyDetails() {
  const thumbnails = [
    propertydetails1,
    propertydetails2,
    propertydetails3,
    propertydetails4,
    propertydetails1,
    propertydetails2,
  ];
  const visibleCount = 4;
  const [startIndex, setStartIndex] = useState(0);
  const [mainImage, setMainImage] = useState(propertydetails);

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    if (startIndex + visibleCount < thumbnails.length) {
      setStartIndex((prev) => prev + 1);
    }
  };

  const handleThumbnailClick = (img: StaticImageData) => {
    setMainImage(img);
  };

  const visibleImages = thumbnails.slice(startIndex, startIndex + visibleCount);

  const propertyOverviewRef = useRef(null);
  const [isSticky, setIsSticky] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (propertyOverviewRef.current) {
        const overviewPosition =
          propertyOverviewRef.current.getBoundingClientRect().top;
        setIsSticky(overviewPosition > window.innerHeight * 0.5);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative h-[90vh] w-full">
          <div className="absolute inset-0">
            <Image
              src={contactimg}
              alt="Modern Home Interior"
              fill
              priority
              className="object-cover"
            />
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center space-y-4">
            <h1 className="text-white text-4xl font-bold">Properties</h1>
            {/* Breadcrumb */}
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
                {/* Left Arrow */}
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

                {/* Thumbnails */}
                <div className="flex gap-3 overflow-hidden">
                  {visibleImages.map((img, index) => (
                    <div
                      key={index}
                      className={`cursor-pointer rounded-md overflow-hidden border-2 transition ${
                        mainImage === img
                          ? "border-blue-500"
                          : "border-transparent"
                      }`}
                      onClick={() => handleThumbnailClick(img)}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-24 h-24 object-cover"
                        width={96}
                        height={80}
                      />
                    </div>
                  ))}
                </div>

                {/* Right Arrow */}
                <button
                  onClick={handleNext}
                  disabled={startIndex + visibleCount >= thumbnails.length}
                  className={`p-2 rounded-full bg-white shadow-md ${
                    startIndex + visibleCount >= thumbnails.length
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
            <div className="w-full md:w-1/2 font-sans">
              {/* Sticky Header Section */}
              <div
                className={`${
                  isSticky
                    ? "sticky top-0 bg-white z-10 pb-4 pt-4 border-b border-gray-200"
                    : ""
                }`}
              >
                <h1 className="text-xl font-semibold text-black">
                  215 Atrium - Andheri East
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
                    <i className="fas fa-map-marker-alt mr-1"></i>
                    Chakala, Andheri Kurla Road, Mumbai - 400059
                  </p>
                </div>

                {/* Badges */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-sm bg-gray-100 text-gray-600 px-4 py-2 rounded-full">
                    Lease
                  </span>
                  <span className="text-sm bg-gray-100 text-gray-600 px-4 py-2 rounded-full">
                    Available
                  </span>
                  <span className="text-sm bg-gray-100 text-gray-600 px-4 py-2 rounded-full">
                    Immediate Possession
                  </span>
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
                      <p className="font-medium text-gray-800">Office Space</p>
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
                      <p className="font-medium text-gray-800">On Lease</p>
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
                      <p className="text-sm text-gray-500">Floor</p>
                      <p className="font-medium text-gray-800">10 Floor</p>
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
                      <p className="text-sm text-gray-500">Chargeable Area</p>
                      <p className="font-medium text-gray-800">42,500 sq ft</p>
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
                      <p className="text-sm text-gray-500">Carpet</p>
                      <p className="font-medium text-gray-800">40,500 sq ft</p>
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
                        B + G + 10 floors
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
                      <p className="font-medium text-gray-800">70%</p>
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
                        ₹125/sq.ft./month
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
                      <p className="font-medium text-gray-800">Immediate</p>
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
                      <p className="font-medium text-gray-800">Bareshell</p>
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
                      <p className="text-sm text-gray-500">Car Park Ratio</p>
                      <p className="font-medium text-gray-800">1:1000 sq.ft.</p>
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
                      <p className="font-medium text-gray-800">12 months</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 mt-12">
                  Features and Amenities
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      Central Air Conditioning
                    </span>
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
                </div>
              </div>

              <div className="mt-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Property Overview
                </h2>
                <div className="bg-gray-100 p-6 rounded-xl">
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
          </div>
        </div>

        <div className="mt-12 max-w-5xl mx-auto">
          <h1 className="text-black text-xl font-semibold mb-2">Location</h1>
          <p className="text-gray-700 text-md">Located in the bustling commercial hub of Andheri East, 215 Atrium.</p>
          <div className=" mt-8">
            <Image
              src={location}
              alt="property"
              className=" items-center justify-center mx-auto"
            />
          </div>
        </div>

        <div className="mt-12 max-w-5xl mx-auto">
          <h1 className="text-black text-xl font-semibold">Property Video</h1>
          <div className=" mt-8">
            <Image
              src={propertyvideo}
              alt="property"
              className=" items-center justify-center mx-auto"
            />
          </div>
        </div>
      </main>


      {/* more properties listing */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="mb-6 max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-black">
            Explore More Listings
          </h2>
        </div>
        <div className="flex flex-wrap -mx-4 mt-10">
              {/* Property Card 1 */}
              <div className="w-full px-4 md:w-1/2 lg:w-1/3 mb-8">
                <div className="relative w-full shadow-lg rounded-lg p-4 sm:p-5 flex flex-col h-full group bg-[#F1F1F4] border border-[#00000005] hover:shadow-xl transition-shadow duration-300">
                  {/* Property Image */}
                  <div className="relative mb-6 sm:mb-8 overflow-hidden rounded-lg">
                    <Link href="/property-details">
                      <Image
                        src={latestproperty1}
                        alt="Apartments Auckland"
                        className="w-full transform scale-100 transition duration-300 ease-in-out group-hover:scale-105"
                      />
                    </Link>
                    <div className="absolute bottom-4 left-0 right-0 px-4 flex justify-between">
                      <span className="text-sm text-black bg-white bg-opacity-70 rounded-full px-3 py-1">
                        Apartment
                      </span>
                      <span className="text-sm text-black bg-white bg-opacity-70 rounded-full px-3 py-1">
                        Wakad
                      </span>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-xl font-bold text-gray-800">
                        Apartments Auckland
                      </h3>
                      <button className="ml-2">
                        <Image
                          src={bookmark}
                          alt="Bookmark"
                          width={30}
                          height={30}
                          className="opacity-70 hover:opacity-100 transition-opacity"
                        />
                      </button>
                    </div>

                    <p className="text-lg font-bold text-gray-500 mb-3">
                      ₹ 4.53 Cr
                    </p>

                    <div className="border-t border-gray-300 my-3"></div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Image
                          src={sqft}
                          alt="Area"
                          width={30}
                          height={30}
                          className="opacity-70"
                        />
                        <div className="flex flex-col ">
                          <span className="text-sm font-medium text-gray-600">
                            Sqft
                          </span>
                          <span className="text-sm font-medium text-gray-600">
                            1520
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Image
                          src={floor}
                          alt="floor"
                          width={30}
                          height={30}
                          className="opacity-70"
                        />
                        <div className="flex flex-col ">
                          <span className="text-sm font-medium text-gray-600">
                            floor
                          </span>
                          <span className="text-sm font-medium text-gray-600">
                            2
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Image
                          src={parking}
                          alt="parking"
                          width={30}
                          height={30}
                          className="opacity-70"
                        />
                        <div className="flex flex-col ">
                          <span className="text-sm font-medium text-gray-600">
                            parking
                          </span>
                          <span className="text-sm font-medium text-gray-600">
                            4
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Card 2 */}
              <div className="w-full px-4 md:w-1/2 lg:w-1/3 mb-8">
                <div className="relative w-full shadow-lg rounded-lg p-4 sm:p-5 flex flex-col h-full group bg-[#F1F1F4] border border-[#00000005] hover:shadow-xl transition-shadow duration-300">
                  {/* Property Image */}
                  <div className="relative mb-6 sm:mb-8 overflow-hidden rounded-lg">
                    <Image
                      src={latestproperty2}
                      alt="Luxury Villa"
                      className="w-full transform scale-100 transition duration-300 ease-in-out group-hover:scale-105"
                    />
                    <div className="absolute bottom-4 left-0 right-0 px-4 flex justify-between">
                      <span className="text-sm text-black bg-white bg-opacity-70 rounded-full px-3 py-1">
                        Villa
                      </span>
                      <span className="text-sm text-black bg-white bg-opacity-70 rounded-full px-3 py-1">
                        Baner
                      </span>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-xl font-bold text-gray-800">
                        Luxury Villa
                      </h3>
                      <button className="ml-2">
                        <Image
                          src={bookmark}
                          alt="Bookmark"
                          width={30}
                          height={30}
                          className="opacity-70 hover:opacity-100 transition-opacity"
                        />
                      </button>
                    </div>

                    <p className="text-lg font-bold text-gray-500 mb-3">
                      ₹ 6.75 Cr
                    </p>

                    <div className="border-t border-gray-300 my-3"></div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Image
                          src={sqft}
                          alt="Area"
                          width={30}
                          height={30}
                          className="opacity-70"
                        />
                        <div className="flex flex-col ">
                          <span className="text-sm font-medium text-gray-600">
                            Sqft
                          </span>
                          <span className="text-sm font-medium text-gray-600">
                            1520
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Image
                          src={floor}
                          alt="floor"
                          width={30}
                          height={30}
                          className="opacity-70"
                        />
                        <div className="flex flex-col ">
                          <span className="text-sm font-medium text-gray-600">
                            floor
                          </span>
                          <span className="text-sm font-medium text-gray-600">
                            2
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Image
                          src={parking}
                          alt="parking"
                          width={30}
                          height={30}
                          className="opacity-70"
                        />
                        <div className="flex flex-col ">
                          <span className="text-sm font-medium text-gray-600">
                            parking
                          </span>
                          <span className="text-sm font-medium text-gray-600">
                            4
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Card 3 */}
              <div className="w-full px-4 md:w-1/2 lg:w-1/3 mb-8">
                <div className="relative w-full shadow-lg rounded-lg p-4 sm:p-5 flex flex-col h-full group bg-[#F1F1F4] border border-[#00000005] hover:shadow-xl transition-shadow duration-300">
                  {/* Property Image */}
                  <div className="relative mb-6 sm:mb-8 overflow-hidden rounded-lg">
                    <Image
                      src={latestproperty3}
                      alt="Modern Penthouse"
                      className="w-full transform scale-100 transition duration-300 ease-in-out group-hover:scale-105"
                    />
                    <div className="absolute bottom-4 left-0 right-0 px-4 flex justify-between">
                      <span className="text-sm text-black bg-white bg-opacity-70 rounded-full px-3 py-1">
                        Penthouse
                      </span>
                      <span className="text-sm text-black bg-white bg-opacity-70 rounded-full px-3 py-1">
                        Hinjewadi
                      </span>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-xl font-bold text-gray-800">
                        Modern Penthouse
                      </h3>
                      <button className="ml-2">
                        <Image
                          src={bookmark}
                          alt="Bookmark"
                          width={30}
                          height={30}
                          className="opacity-70 hover:opacity-100 transition-opacity"
                        />
                      </button>
                    </div>

                    <p className="text-lg font-bold text-gray-500 mb-3">
                      ₹ 5.25 Cr
                    </p>

                    <div className="border-t border-gray-300 my-3"></div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Image
                          src={sqft}
                          alt="Area"
                          width={30}
                          height={30}
                          className="opacity-70"
                        />
                        <div className="flex flex-col ">
                          <span className="text-sm font-medium text-gray-600">
                            Sqft
                          </span>
                          <span className="text-sm font-medium text-gray-600">
                            1520
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Image
                          src={floor}
                          alt="floor"
                          width={30}
                          height={30}
                          className="opacity-70"
                        />
                        <div className="flex flex-col ">
                          <span className="text-sm font-medium text-gray-600">
                            floor
                          </span>
                          <span className="text-sm font-medium text-gray-600">
                            2
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Image
                          src={parking}
                          alt="parking"
                          width={30}
                          height={30}
                          className="opacity-70"
                        />
                        <div className="flex flex-col ">
                          <span className="text-sm font-medium text-gray-600">
                            parking
                          </span>
                          <span className="text-sm font-medium text-gray-600">
                            4
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
      </div>
    </>
  );
}
