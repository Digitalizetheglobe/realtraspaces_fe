"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  FiPlus,
  FiChevronDown,
  FiMapPin,
  FiPhone,
  FiMessageCircle,
  FiShare2,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import contactimg from "../../../public/assets/images/contactimg.png";
import PageWithSeo from "../../components/PageWithSeo";

const ATTRIBUTES = [
  "Carpet Area",
  "Floor",
  "Furn/Unfurnished",
  "Seat in Office",
  "No. of Cabin",
  "Building Structure",
  "Floor Plan",
  "Car Park",
  "Availability Time",
  "Chargeable Area",
  "Efficiency",
  "Quoted Renting / Towards",
  "Maintenance",
  "Taxes",
];

const CompareProperties = () => {
  const [showSpecs, setShowSpecs] = useState(true);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRemoving, setIsRemoving] = useState(null);
  const router = useRouter();

  const fetchComparedProperties = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/signin");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        "https://api.realtraspaces.com/api/webusers/compare/list",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch compared properties");
      }

      const data = await response.json();
      setProperties(data.data || []);
    } catch (error) {
      console.error("Error fetching compared properties:", error);
      toast.error("Failed to load compared properties");
    } finally {
      setLoading(false);
    }
  };

  const removeFromCompare = async (propertyId) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/signin");
      return;
    }

    try {
      setIsRemoving(propertyId);
      const response = await fetch(
        `https://api.realtraspaces.com/api/webusers/compare/remove/${propertyId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove property");
      }

      await fetchComparedProperties();
      toast.success("Property removed from comparison");
    } catch (error) {
      console.error("Error removing property:", error);
      toast.error("Failed to remove property");
    } finally {
      setIsRemoving(null);
    }
  };

  const clearAll = async () => {
    if (properties.length === 0) return;

    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/signin");
      return;
    }

    try {
      const response = await fetch(
        "https://api.realtraspaces.com/api/webusers/compare/clear",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to clear comparison");
      }

      setProperties([]);
      toast.success("Comparison cleared");
    } catch (error) {
      console.error("Error clearing comparison:", error);
      toast.error("Failed to clear comparison");
    }
  };

  useEffect(() => {
    fetchComparedProperties();
  }, []);

  // Helper function to get property features
  const getPropertyFeatures = (property) => {
    return {
      "Carpet Area": property?.propertyData?.dimension?.carpetArea 
        ? `${property.propertyData.dimension.carpetArea} ${property.propertyData.dimension.unit}`
        : "--",
      "Floor": "--", // Not available in API
      "Furn/Unfurnished": property?.propertyData?.furnishStatus || "--",
      "Seat in Office": "--", // Not available in API
      "No. of Cabin": "--", // Not available in API
      "Building Structure": "--", // Not available in API
      "Floor Plan": "--", // Not available in API
      "Car Park": "--", // Not available in API
      "Availability Time": property?.propertyData?.possessionDate 
        ? new Date(property.propertyData.possessionDate).toLocaleDateString()
        : "--",
      "Chargeable Area": "--", // Not available in API
      "Efficiency": "--", // Not available in API
      "Quoted Renting / Towards": property?.propertyData?.monetaryInfo?.expectedPrice
        ? `₹ ${property.propertyData.monetaryInfo.expectedPrice.toLocaleString()}`
        : "--",
      "Maintenance": property?.propertyData?.monetaryInfo?.maintenanceCost
        ? `₹ ${property.propertyData.monetaryInfo.maintenanceCost}`
        : "--",
      "Taxes": "--", // Not available in API
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
    <PageWithSeo page="compareproperties">
      <section className="relative h-[60vh] w-full">
        <Image
          src={contactimg}
          alt="Modern Home Interior"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <nav aria-label="breadcrumb">
            <ol className="text-white text-lg flex space-x-2">
              <li>
              <button className="cursor-pointer" onClick={() => router.push('/profile-page')}>
                Profile </button>
              </li>
              <li>{">"}</li>
              <li>Compare Properties</li>
            </ol>
          </nav> 
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between bg-[#F1F1F4] rounded-md p-4 mb-6">
            <button 
              onClick={clearAll}
              className=" cursor-pointer border border-black bg-white px-4 py-1 rounded text-md text-black hover:bg-gray-200"
            >
              Clear All
            </button>

            <div className="flex items-center gap-3 text-md">
              <span className="hidden sm:block text-black">
                Want Help Choosing Property ??
              </span>
              <button className=" cursor-pointer bg-black text-white px-4 py-1 text-md rounded hover:bg-black">
                Contact&nbsp;Us
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pb-4">
            {/* SPEC-LIST COLUMN */}
            <div className="w-[270px] flex-none rounded-lg border border-[#E5E5EA] p-3">
              <div className="cursor-pointer h-66 w-full rounded-tr-lg rounded-tl-lg bg-[#EFEFF3] border flex flex-col items-center justify-center gap-2"
                onClick={() => router.push('/properties')}
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-black">
                  <FiPlus className="text-white" size={20} />
                </span>
                <p className="mt-2 text-sm text-black font-medium">
                  Add New Property
                </p>
              </div>

              {showSpecs && (
                <ul className="space-y-5 px-6 py-6 text-sm bg-[#EFEFF3] rounded-br-lg rounded-bl-lg">
                  {ATTRIBUTES.map((attr) => (
                    <li
                      key={attr}
                      className="flex items-center gap-3 text-[#5F5F6B]"
                    >
                      <span className="h-4 w-4 rounded-sm border border-gray-400 inline-block" />
                      {attr}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* PROPERTY COLUMNS */}
            {properties.map((property) => (
              <div
                key={property.id}
                className="flex-1 min-w-[260px] basis-[300px] rounded-lg border border-[#E5E5EA]"
              >
                <div className="p-4 border-b border-[#E5E5EA]">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-black text-sm">
                      {property?.propertyData?.title || "Property Title"}
                    </h3>
                    <button 
                      onClick={() => removeFromCompare(property.propertyId)}
                      className="text-red-500 text-xs hover:text-red-700"
                      disabled={isRemoving === property.propertyId}
                    >
                      {isRemoving === property.propertyId ? "Removing..." : "Remove"}
                    </button>
                  </div>
                  
                  <p className="flex items-center text-gray-700 text-[11px] gap-1 mb-3">
                    <FiMapPin size={12} />
                    {property?.propertyData?.address?.locality || 
                     property?.propertyData?.address?.subLocality || 
                     property?.propertyData?.address?.city || 
                     "Location not available"}
                  </p>

                  <figure className="relative h-32 w-full rounded overflow-hidden mb-3">
                    {/* You might want to add actual property images here */}
                    <Image
                      src={contactimg}
                      alt={property?.propertyData?.title || "Property"}
                      fill
                      className="object-cover"
                    />
                  </figure>

                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-black">
                        {property?.propertyData?.monetaryInfo?.expectedPrice
                          ? `₹ ${property.propertyData.monetaryInfo.expectedPrice.toLocaleString()}`
                          : "Price not available"}
                      </p>
                      <p className="text-[11px] text-[#7B7B87]">
                        {property?.propertyData?.enquiredFor === "Sale" 
                          ? "for sale" 
                          : property?.propertyData?.enquiredFor === "Rent"
                          ? "rent/month"
                          : ""}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button className="h-6 w-6 grid place-items-center rounded bg-[#25D366]">
                        <FaWhatsapp size={12} className="text-white" />
                      </button>
                      <button className="h-6 w-6 grid place-items-center text-black rounded border border-[#D0D0D7] hover:bg-gray-100">
                        <FiShare2 size={12} />
                      </button>
                    </div>
                  </div>

                  <p className="mt-1 text-xs text-[#5F5F6B] line-clamp-3">
                    {property?.propertyData?.aboutProperty || 
                     property?.propertyData?.description || 
                     "No description available"}
                  </p>
                  <Link
                    href={`/property/${property?.propertyData?.id}`}
                    className="mt-1 inline-block text-[11px] text-blue-600 hover:underline"
                  >
                    Read&nbsp;More
                  </Link>
                </div>

                <ul className="divide-y divide-[#E5E5EA] text-xs">
                  {ATTRIBUTES.map((attr) => (
                    <li
                      key={attr}
                      className="flex justify-between px-4 py-2 text-[#5F5F6B]"
                    >
                      <span>{attr}</span>
                      <span className="text-[#26262E]">
                        {getPropertyFeatures(property)[attr] || "--"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* ADD PROPERTY COLUMN (only shown if less than max items) */}
            {properties.length < 5 && (
              <div className="w-[270px] flex-none rounded-lg border border-[#E5E5EA] p-3">
                <div className=" cursor-pointer h-66 w-full rounded-lg bg-[#EFEFF3] border-2 border-dashed border-[#D0D0D7] flex flex-col items-center justify-center gap-2"
                onClick={() => router.push('/properties')}
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-white border border-[#D0D0D7]">
                    <FiPlus className="text-[#9D9DA6]" size={16} />
                  </span>
                  <p className="text-xs font-medium text-[#5F5F6B] max-w-[140px] text-center leading-snug">
                    Choose from saved properties
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      </PageWithSeo>
    </>
  );
};

export default CompareProperties;