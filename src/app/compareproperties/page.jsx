"use client";

import React, { useState } from "react";
import { FiPlus, FiChevronDown } from "react-icons/fi";
import { Raleway } from "next/font/google";
import Image from "next/image";
import contactimg from "../../../public/assets/images/contactimg.png";
import Link from "next/link";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-raleway",
});

const CompareProperties = () => {
  const [showAddColumn, setShowAddColumn] = useState(false);

  // Sample property data
  const [properties, setProperties] = useState([
    {
      id: 1,
      title: "Prime Business Hub",
      price: "$4500 rent/month",
      location: "Location Name",
      description: "A premier commercial property located in the thriving business hub...",
      features: {
        carpetArea: "1200 sqft",
        floor: "5th Floor",
        furnished: "Furnished",
        seats: "50 Seats"
      }
    },
    {
      id: 2,
      title: "Print Business Hub",
      price: "$4500 rent/month",
      location: "Location Name",
      description: "A premier commercial property located in the thriving business hub...",
      features: {
        carpetArea: "1500 sqft",
        floor: "3rd Floor",
        furnished: "Unfurnished",
        seats: "40 Seats"
      }
    }
  ]);

  return (
    <section className={`${raleway.className} py-12 px-4 sm:px-6 lg:px-8 bg-gray-50`}>
      <div className="max-w-7xl mx-auto">
        {/* Hero Section with Background Image */}
        <section className="relative h-[60vh] w-full">
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

        {/* Compare Properties Section */}
        <div className="mt-12 bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">See All Properties</h2>
          </div>

          {/* Add New Column Section */}
          <div className="p-6 border-b">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setShowAddColumn(!showAddColumn)}
            >
              <h3 className="text-lg font-semibold">Add New Column</h3>
              <FiChevronDown className={`transition-transform ${showAddColumn ? 'rotate-180' : ''}`} />
            </div>
            
            {showAddColumn && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center">
                  <input type="checkbox" id="carpet-area" className="mr-2" />
                  <label htmlFor="carpet-area">Carpet Area</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="floor" className="mr-2" />
                  <label htmlFor="floor">Floor</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="furnished" className="mr-2" />
                  <label htmlFor="furnished">Furn/Unfurnished</label>
                </div>
              </div>
            )}
          </div>

          {/* Choose from saved properties */}
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold mb-4">Choose from saved properties</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Property Cards */}
              {properties.map((property) => (
                <div key={property.id} className="border rounded-lg p-4">
                  <h4 className="font-bold">{property.title}</h4>
                  <p className="text-gray-600">{property.location}</p>
                </div>
              ))}
              
              {/* Add Property Button */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center p-6 cursor-pointer hover:bg-gray-50">
                <div className="text-center">
                  <FiPlus className="mx-auto h-6 w-6 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Add Property</p>
                </div>
              </div>
            </div>
          </div>

          {/* Property Details Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {properties.map((property) => (
              <div key={property.id} className="border-b p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold">{property.price}</h3>
                  <p className="text-gray-600">{property.description}</p>
                  <button className="text-blue-600 mt-2">Read More</button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-500">Carpet Area</p>
                    <p>{property.features.carpetArea}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Floor</p>
                    <p>{property.features.floor}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Furnished/Unfurnished</p>
                    <p>{property.features.furnished}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Seat in Office</p>
                    <p>{property.features.seats}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Empty column for adding new property */}
            <div className="border-b p-6">
              <div className="h-full flex items-center justify-center">
                <button className="flex items-center text-blue-600">
                  <FiPlus className="mr-2" />
                  Add Property
                </button>
              </div>
            </div>
          </div>

          {/* Contact Us Section */}
          <div className="p-6 bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {properties.map((property) => (
                <div key={property.id} className="border rounded-lg p-4">
                  <h4 className="font-bold">{property.title}</h4>
                  <p className="text-gray-600">{property.location}</p>
                  
                  <div className="mt-4 space-y-2">
                    <p className="text-gray-500">Carpet Area</p>
                    <p>{property.features.carpetArea}</p>
                    
                    <p className="text-gray-500">Floor</p>
                    <p>{property.features.floor}</p>
                    
                    <p className="text-gray-500">Furnished/Unfurnished</p>
                    <p>{property.features.furnished}</p>
                    
                    <p className="text-gray-500">Seat in Office</p>
                    <p>{property.features.seats}</p>
                  </div>
                </div>
              ))}
              
              {/* Empty contact card */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center p-6 cursor-pointer hover:bg-gray-100">
                <div className="text-center">
                  <FiPlus className="mx-auto h-6 w-6 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Add Property</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompareProperties;