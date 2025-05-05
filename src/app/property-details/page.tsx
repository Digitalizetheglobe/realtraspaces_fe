"use client";

import React, { useState } from "react";
import Image from "next/image";
import contactimg from "../../../public/assets/images/contactimg.png";
import propertydetails from "../../../public/assets/images/property-details.png";
import propertydetails1 from "../../../public/assets/images/property-details1.png";
import propertydetails2 from "../../../public/assets/images/property-details2.png";
import propertydetails3 from "../../../public/assets/images/property-details3.png";
import propertydetails4 from "../../../public/assets/images/property-details4.png";
import sqft from "../../../public/assets/images/sqft.png";
import homeimproment from "../../../public/assets/images/home-improvement1.png";
import propertyvideo from "../../../public/assets/images/property-video.png";
import parking from "../../../public/assets/images/parking.png";
import latestpropertytype from "../../../public/assets/images/latestpropertytype.svg";
import next from "../../../public/assets/images/next.png";
import previous from "../../../public/assets/images/previous.png";
import bath from "../../../public/assets/images/bath.png";
import pin from "../../../public/assets/images/marker-pin-01.png";
import bookmark from "../../../public/assets/images/bookmark.png";
import Link from "next/link";


export default function Home() {
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

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    if (startIndex + visibleCount < thumbnails.length) {
      setStartIndex((prev) => prev + 1);
    }
  };

  const visibleImages = thumbnails.slice(startIndex, startIndex + visibleCount);

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
                  <Link href="/">Home</Link>
                </li>
                <li>{">"}</li>
                <li className="">Properties</li>
              </ol>
            </nav>
          </div>
        </section>

        <div className="max-w-5xl items-center justify-center mx-auto py-12">
          <div className="">
            <Image
              src={propertydetails}
              alt="property"
              className="items-center justify-center mx-auto"
            />
          </div>

          {/* Thumbnails with slider buttons */}
          <div className="flex max-w-5xl items-center justify-center mx-auto py-12 gap-4">
            <Image
              src={previous}
              alt="Previous"
              onClick={handlePrev}
              className={`w-8 h-8 cursor-pointer ${
                startIndex === 0 ? "opacity-50 pointer-events-none" : ""
              }`}
            />

            {visibleImages.map((img, index) => (
              <Image
                key={index}
                src={img}
                alt={`property-${index}`}
                className="w-60 h-42"
              />
            ))}
            <Image
              src={next}
              alt="next"
              onClick={handleNext}
              className={`w-8 h-8 cursor-pointer ${
                startIndex + visibleCount >= thumbnails.length ? "opacity-50 pointer-events-none" : ""
              }`}
            />
          </div>

          <div className="max-w-5xl mx-auto items-center justify-center">
            <div>
              <h1 className="text-black text-xl font-semibold">
                About this Property
              </h1>
              <p className="text-gray-600 mt-6">
                Welcome to Brookline Business Tower, a premier commercial
                property located in the thriving business hub of Sector 42,
                Gurugram. This Grade-A commercial space is ideal for corporate
                offices, startups, and enterprises looking to scale in a modern,
                tech-enabled environment. Designed with flexibility in mind, the
                property features open-floor layouts, premium furnishings,
                high-speed elevators, and sustainable infrastructure.
              </p>
            </div>

            <div className="mt-12">
              <h1 className="text-black text-xl font-semibold">
                Property Overview
              </h1>
              <div className="bg-gray-100 rounded-lg px-8 py-8 mt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {/* 1 - ID NO. */}
                  <div className="flex items-center space-x-2">
                    <Image
                      src={sqft}
                      alt="ID"
                      width={30}
                      height={30}
                      className="opacity-70"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-600">
                        ID NO.
                      </span>
                      <span className="text-sm font-medium text-gray-600">
                        #C0142
                      </span>
                    </div>
                  </div>

                  {/* 2 - Category */}
                  <div className="flex items-center space-x-2">
                    <Image
                      src={homeimproment}
                      alt="Category"
                      width={30}
                      height={30}
                      className="opacity-70"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-600">
                        Category
                      </span>
                      <span className="text-sm font-medium text-gray-600">
                        Office Space
                      </span>
                    </div>
                  </div>

                  {/* 3 - Size */}
                  <div className="flex items-center space-x-2">
                    <Image
                      src={sqft}
                      alt="Size"
                      width={30}
                      height={30}
                      className="opacity-70"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-600">
                        Size
                      </span>
                      <span className="text-sm font-medium text-gray-600">
                        4,500 sq.ft
                      </span>
                    </div>
                  </div>

                  {/* 4 - Bath */}
                  <div className="flex items-center space-x-2">
                    <Image
                      src={sqft}
                      alt="Bath"
                      width={30}
                      height={30}
                      className="opacity-70"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-600">
                        Bath
                      </span>
                      <span className="text-sm font-medium text-gray-600">
                        4
                      </span>
                    </div>
                  </div>

                  {/* 5 - Price */}
                  <div className="flex items-center space-x-2">
                    <Image
                      src={sqft}
                      alt="Price"
                      width={30}
                      height={30}
                      className="opacity-70"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-600">
                        Price
                      </span>
                      <span className="text-sm font-medium text-gray-600">
                        ₹3,25,000
                      </span>
                    </div>
                  </div>

                  {/* 6 - Type */}
                  <div className="flex items-center space-x-2">
                    <Image
                      src={homeimproment}
                      alt="Type"
                      width={30}
                      height={30}
                      className="opacity-70"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-600">
                        Type
                      </span>
                      <span className="text-sm font-medium text-gray-600">
                        On Rent
                      </span>
                    </div>
                  </div>

                  {/* 7 - Furnished */}
                  <div className="flex items-center space-x-2">
                    <Image
                      src={sqft}
                      alt="Furnished"
                      width={30}
                      height={30}
                      className="opacity-70"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-600">
                        Furnished
                      </span>
                      <span className="text-sm font-medium text-gray-600">
                        Yes
                      </span>
                    </div>
                  </div>

                  {/* 8 - Parking */}
                  <div className="flex items-center space-x-2">
                    <Image
                      src={sqft}
                      alt="Parking"
                      width={30}
                      height={30}
                      className="opacity-70"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-600">
                        Parking
                      </span>
                      <span className="text-sm font-medium text-gray-600">
                        8 slots
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                padding: "30px",
                fontFamily: "Arial, sans-serif",
              }}
              className="mt-12"
            >
              {/* Left Section */}
              <div
                style={{ flex: "1", minWidth: "300px", marginRight: "40px" }}
              >
                <h3
                  className="text-black"
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    marginBottom: "15px",
                  }}
                >
                  Features and amenities
                </h3>
                <div style={{ display: "flex" }} className="mt-8">
                  {/* Left Column */}
                  <ul
                    className="text-gray-700"
                    style={{
                      listStyle: "none",
                      padding: 0,
                      marginRight: "40px",
                      lineHeight: "1.8",
                    }}
                  >
                    <li>
                      <input type="checkbox" checked readOnly /> Central Air
                      Conditioning
                    </li>
                    <li>
                      <input type="checkbox" checked readOnly /> 24×7 Security
                    </li>
                    <li>
                      <input type="checkbox" checked readOnly /> CCTV
                      Surveillance
                    </li>
                    <li>
                      <input type="checkbox" checked readOnly /> Wi-Fi & LAN
                    </li>
                    <li>
                      <input type="checkbox" checked readOnly /> Lift Access
                    </li>
                    <li>
                      <input type="checkbox" checked readOnly /> Fire Safety
                      Compliance
                    </li>
                  </ul>

                  {/* Right Column */}
                  <ul
                    className="text-gray-700"
                    style={{ listStyle: "none", padding: 0, lineHeight: "1.8" }}
                  >
                    <li>
                      <input type="checkbox" checked readOnly /> Power Backup
                    </li>
                    <li>
                      <input type="checkbox" checked readOnly /> Conference Hall
                    </li>
                    <li>
                      <input type="checkbox" checked readOnly /> Pantry Area
                    </li>
                    <li>
                      <input type="checkbox" checked readOnly /> Covered Parking
                    </li>
                    <li>
                      <input type="checkbox" readOnly /> Biometric Entry
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right Section */}
              <div style={{ flex: "1", minWidth: "300px" }}>
                <h3
                  className="text-black"
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    marginBottom: "15px",
                  }}
                >
                  Location
                </h3>
                <p className="text-gray-700 mt-6">
                  <strong>
                    Andheri East, Mumbai – MIDC Marol Industrial Area
                  </strong>
                </p>
                <p className="text-gray-700">
                  Located in the heart of Mumbai’s booming tech corridor, the
                  property is situated in MIDC Marol, Andheri East – a
                  well-connected and highly sought-after hub for IT companies
                  and startups. It offers excellent connectivity to Western
                  Express Highway, Mumbai Metro Line 1, and Chhatrapati Shivaji
                  Maharaj International Airport (just 10 minutes away).
                </p>
              </div>
            </div>

            <div className="mt-12 ">
              <h1 className="text-black text-xl font-semibold">
                Property Video
              </h1>
              <div className=" mt-8">
                <Image
                  src={propertyvideo}
                  alt="property"
                  className=" items-center justify-center mx-auto"
                />
              </div>
            </div>
          </div>
        </div>

        {/* more properties listing */}
        <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="mb-6 max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-black">
              Explore More Listings
            </h2>
          </div>

          <div className="space-y-6 max-w-5xl mx-auto">
            {/* Property Card 1 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                {/* Image */}
                <div className="w-full sm:w-1/3 p-2">
                  <Image
                    alt="Property"
                    src={latestpropertytype}
                    className="w-full h-56 object-cover rounded-2xl p-2"
                  />
                </div>

                <div className="bg-gray-400 border-r border"></div>

                {/* Content */}
                <div className="w-full sm:w-2/3 p-4 px-8">
                  {/* Property Tag */}
                  <div className="mb-3">
                    <span className="bg-[#6E6E73] text-white px-3 py-1 rounded-full text-sm">
                      Property type
                    </span>
                  </div>

                  {/* Title and Price */}
                  <h3 className="font-semibold text-xl text-gray-900">
                    Metrolla Plaza
                  </h3>
                  <h4 className="text-base text-gray-500 mb-4">₹ 4.53 Cr</h4>

                  {/* Property Details */}
                  <div className="flex space-x-12 border-t border-b border-gray-200 py-3 mb-3">
                    <div className="flex items-center space-x-2">
                      <Image src={sqft} alt="Bed" width={20} height={20} />
                      <div className="flex flex-col">
                        <span className="text-md text-gray-600">Sqft</span>
                        <span className="text-sm font-medium text-gray-500">
                          1520
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Image src={bath} alt="Bath" width={20} height={20} />
                      <div className="flex flex-col">
                        <span className="text-md text-gray-600">Fully </span>
                        <span className="text-sm font-medium text-gray-500">
                          Furnished
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
                        <span className="text-md text-gray-600">Ready to </span>
                        <span className="text-sm font-medium text-gray-500">
                          Move
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Image src={parking} alt="Area" width={20} height={20} />
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
                      <Image src={pin} alt="Location" width={20} height={20} />
                      <span className="text-md text-gray-700">
                        Sector 62, Noida
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

            {/* Property Card 2 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                {/* Content */}
                <div className="w-full sm:w-2/3 p-4 px-8">
                  {/* Property Tag */}
                  <div className="mb-3">
                    <span className="bg-[#6E6E73] text-white px-3 py-1 rounded-full text-sm">
                      Property type
                    </span>
                  </div>

                  {/* Title and Price */}
                  <h3 className="font-semibold text-xl text-gray-900">
                    Metrolla Plaza
                  </h3>
                  <h4 className="text-base text-gray-500 mb-4">₹ 4.53 Cr</h4>

                  {/* Property Details */}
                  <div className="flex space-x-12 border-t border-b border-gray-200 py-3 mb-3">
                    <div className="flex items-center space-x-2">
                      <Image src={sqft} alt="Bed" width={20} height={20} />
                      <div className="flex flex-col">
                        <span className="text-md text-gray-600">Sqft</span>
                        <span className="text-sm font-medium text-gray-500">
                          1520
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Image src={bath} alt="Bath" width={20} height={20} />
                      <div className="flex flex-col">
                        <span className="text-md text-gray-600">Fully </span>
                        <span className="text-sm font-medium text-gray-500">
                          Furnished
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
                        <span className="text-md text-gray-600">Ready to </span>
                        <span className="text-sm font-medium text-gray-500">
                          Move
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Image src={parking} alt="Area" width={20} height={20} />
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
                      <Image src={pin} alt="Location" width={20} height={20} />
                      <span className="text-md text-gray-700">
                        Sector 62, Noida
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

                <div className="bg-gray-400 border-r border"></div>

                {/* Image */}
                <div className="w-full sm:w-1/3 p-2">
                  <Image
                    alt="Property"
                    src={latestpropertytype}
                    className="w-full h-56 object-cover rounded-2xl p-2"
                  />
                </div>
              </div>
            </div>

            {/* Property Card 3 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                {/* Image */}
                <div className="w-full sm:w-1/3 p-2">
                  <Image
                    alt="Property"
                    src={latestpropertytype}
                    className="w-full h-56 object-cover rounded-2xl p-2"
                  />
                </div>

                <div className="bg-gray-400 border-r border"></div>

                {/* Content */}
                <div className="w-full sm:w-2/3 p-4 px-8">
                  {/* Property Tag */}
                  <div className="mb-3">
                    <span className="bg-[#6E6E73] text-white px-3 py-1 rounded-full text-sm">
                      Property type
                    </span>
                  </div>

                  {/* Title and Price */}
                  <h3 className="font-semibold text-xl text-gray-900">
                    Metrolla Plaza
                  </h3>
                  <h4 className="text-base text-gray-500 mb-4">₹ 4.53 Cr</h4>

                  {/* Property Details */}
                  <div className="flex space-x-12 border-t border-b border-gray-200 py-3 mb-3">
                    <div className="flex items-center space-x-2">
                      <Image src={sqft} alt="Bed" width={20} height={20} />
                      <div className="flex flex-col">
                        <span className="text-md text-gray-600">Sqft</span>
                        <span className="text-sm font-medium text-gray-500">
                          1520
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Image src={bath} alt="Bath" width={20} height={20} />
                      <div className="flex flex-col">
                        <span className="text-md text-gray-600">Fully </span>
                        <span className="text-sm font-medium text-gray-500">
                          Furnished
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
                        <span className="text-md text-gray-600">Ready to </span>
                        <span className="text-sm font-medium text-gray-500">
                          Move
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Image src={parking} alt="Area" width={20} height={20} />
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
                      <Image src={pin} alt="Location" width={20} height={20} />
                      <span className="text-md text-gray-700">
                        Sector 62, Noida
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
          </div>
        </div>
      </main>
    </>
  );
}
