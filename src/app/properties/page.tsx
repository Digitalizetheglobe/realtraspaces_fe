"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Raleway } from "next/font/google";
import defaultPropertyImage from "../../../public/assets/images/latestproperty1.png";
import share from "../../../public/assets/Frame 29.png";
import bookmark from "../../../public/assets/Frame 28.png";
import whatsapp from "../../../public/assets/WhatsApp.png";
import Link from "next/link";
import contactimg from "../../../public/assets/images/contactimg.png";

// Load Raleway font with more weight options
const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-raleway",
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
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [bookmarkedProperties, setBookmarkedProperties] = useState<Set<string>>(new Set());
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [propertyToBookmark, setPropertyToBookmark] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    propertyType: "",
    priceRange: "",
    areaRange: "",
    condition: "",
    transactionType: "", // sale or rent
  });

  // Available filter options
  // const propertyTypes = [
  //   "Office space",
  //   "Retail space",
  //   "Commercial land",
  //   "Warehouse",
  //   "Industrial building",
  // ];

  // const priceRanges = [
  //   "Under ₹50 Lakhs",
  //   "₹50 Lakhs - ₹1 Cr",
  //   "₹1 Cr - ₹2 Cr",
  //   "₹2 Cr - ₹5 Cr",
  //   "Over ₹5 Cr",
  // ];

  // const areaRanges = [
  //   "Under 1000 sqft",
  //   "1000 - 5000 sqft",
  //   "5000 - 10000 sqft",
  //   "10000 - 20000 sqft",
  //   "Over 20000 sqft",
  // ];

  const conditions = ["Furnished", "Semi-Furnished", "Unfurnished"];

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(
          "https://prd-lrb-webapi.leadrat.com/api/v1/property/anonymous?PageNumber=1&PageSize=100",
          {
            method: "GET",
            headers: {
              accept: "application/json",
              tenant: "realtraspaces",
            },
          }
        );
        const data = await response.json();
        const propertiesArray = Array.isArray(data)
          ? data
          : data.items || data.data || [];
        setProperties(propertiesArray);
        setFilteredProperties(propertiesArray);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Add location to selectedLocations
  const addLocation = (location: string) => {
    if (!location.trim()) return;
    if (!selectedLocations.includes(location)) {
      setSelectedLocations((prev) => [...prev, location]);
    }
    setSearchTerm("");
  };

  // Remove location from selectedLocations
  const removeLocation = (location: string) => {
    setSelectedLocations((prev) => prev.filter((loc) => loc !== location));
  };

  // Handle Enter key in input for adding location
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      addLocation(searchTerm.trim());
    }
  };

  // Apply filters whenever search term or filters change
  useEffect(() => {
    let results = properties;

    // Multi-location search logic
    if (selectedLocations.length > 0) {
      results = results.filter((property) =>
        selectedLocations.some((loc) =>
          (property.address?.subLocality?.toLowerCase().includes(loc.toLowerCase()) ?? false) ||
          (property.address?.city?.toLowerCase().includes(loc.toLowerCase()) ?? false)
        )
      );
    } else if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      results = results.filter((property) => {
        return (
          property.title?.toLowerCase().includes(searchLower) ||
          property.address?.subLocality?.toLowerCase().includes(searchLower) ||
          property.address?.city?.toLowerCase().includes(searchLower) ||
          property.propertyType?.displayName?.toLowerCase().includes(searchLower) ||
          property.propertyType?.childType?.displayName?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply property type filter
    if (filters.propertyType) {
      results = results.filter((property) => {
        return (
          property.propertyType?.displayName === filters.propertyType ||
          property.propertyType?.childType?.displayName === filters.propertyType
        );
      });
    }

    // Apply price range filter
    if (filters.priceRange) {
      results = results.filter((property) => {
        const price =
          property.monetaryInfo?.expectedPrice ||
          property.monetaryInfo?.expectedRent ||
          0;

        switch (filters.priceRange) {
          case "Under ₹50 Lakhs":
            return price < 5000000;
          case "₹50 Lakhs - ₹1 Cr":
            return price >= 5000000 && price < 10000000;
          case "₹1 Cr - ₹2 Cr":
            return price >= 10000000 && price < 20000000;
          case "₹2 Cr - ₹5 Cr":
            return price >= 20000000 && price < 50000000;
          case "Over ₹5 Cr":
            return price >= 50000000;
          default:
            return true;
        }
      });
    }

    // Apply area range filter
    if (filters.areaRange) {
      results = results.filter((property) => {
        const area = Number(property.dimension?.area) || 0;

        switch (filters.areaRange) {
          case "Under 1000 sqft":
            return area < 1000;
          case "1000 - 5000 sqft":
            return area >= 1000 && area < 5000;
          case "5000 - 10000 sqft":
            return area >= 5000 && area < 10000;
          case "10000 - 20000 sqft":
            return area >= 10000 && area < 20000;
          case "Over 20000 sqft":
            return area >= 20000;
          default:
            return true;
        }
      });
    }

    // Apply condition filter
    if (filters.condition) {
      results = results.filter((property) => {
        return (
          getAttributeValue(property, "condition-id") === filters.condition
        );
      });
    }

    // Apply transaction type filter
    if (filters.transactionType) {
      if (filters.transactionType === "sale") {
        results = results.filter((property) => property.forSale);
      } else if (filters.transactionType === "rent") {
        results = results.filter((property) => property.forRent);
      }
    }

    setFilteredProperties(results);
  }, [searchTerm, filters, properties, selectedLocations]);

  // Helper function to get attribute value by ID
  const getAttributeValue = (property: Property, attributeId: string) => {
    const attribute = property.attributes?.find(
      (attr) => attr.masterPropertyAttributeId === attributeId
    );
    return attribute?.value || "N/A";
  };

  // Format price in Indian currency format (e.g., ₹ 45,00,000)
  const formatPrice = (price?: number) => {
    if (!price) return "Price not available";

    // For values less than 100,000, show directly
    if (price < 100000) return `₹ ${price.toLocaleString("en-IN")}`;

    // For values in lakhs (1 lakh = 100,000)
    if (price < 10000000) {
      const lakhs = (price / 100000).toFixed(2);
      return `₹ ${lakhs} Lakhs`;
    }

    // For values in crores (1 crore = 10,000,000)
    const crores = (price / 10000000).toFixed(2);
    return `₹ ${crores} Cr`;
  };

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedLocations([]);
    setFilters({
      propertyType: "",
      priceRange: "",
      areaRange: "",
      condition: "",
      transactionType: "",
    });
  };

  const handleCheckboxClick = (propertyId: string) => {
    if (bookmarkedProperties.has(propertyId)) {
      // If already bookmarked, remove it
      setBookmarkedProperties(prev => {
        const newBookmarks = new Set(prev);
        newBookmarks.delete(propertyId);
        return newBookmarks;
      });
    } else {
      // If not bookmarked, show confirmation modal
      setPropertyToBookmark(propertyId);
      setShowBookmarkModal(true);
    }
  };

  const confirmBookmark = (confirm: boolean) => {
    if (confirm && propertyToBookmark) {
      setBookmarkedProperties(prev => {
        const newBookmarks = new Set(prev);
        newBookmarks.add(propertyToBookmark);
        return newBookmarks;
      });
    }
    setShowBookmarkModal(false);
    setPropertyToBookmark(null);
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
    <>
      <div className={raleway.className}>
        <section className="relative h-[60vh] w-full ">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={contactimg}
              alt="Modern Home Interior"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black opacity-60"></div>
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center space-y-4">
            <h2 className="mt-10 font-normal text-[32px] leading-[100%] tracking-normal text-center mt-[100px]">
              <span className="text-white">All Properties</span>{" "}
             <span className="text-gray-400">Explore our properties</span>
            </h2>
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
        <section className="pb-10 lg:pb-20 bg-white dark:bg-dark relative overflow-hidden">
          <div className="container mx-auto">
            <div className="w-full px-4">
              {/* Heading */}
              <div className="mb-[60px] w-full"></div>

              {/* Search and Filter Section */}
             <div className="mb-8 px-4 sm:px-0">
  {/* Search Bar */}
  <div className="relative mb-6">
    <input
      type="text"
      placeholder="Search by property name, location, or type..."
      className="w-full text-black text-sm sm:text-base p-3 sm:p-4 pl-10 sm:pl-12 rounded-lg border border-black focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onKeyDown={handleInputKeyDown}
    />
    <svg
      className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-black"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
    {/* Chips overlay (right side, inside input) */}
    <div className="absolute inset-y-0 right-3 flex items-center space-x-2 pointer-events-none" style={{ zIndex: 10 }}>
      {selectedLocations.length > 0 && (
        <div className="flex items-center space-x-2 pointer-events-auto">
          {selectedLocations.map((loc) => (
            <div key={loc} className="bg-black text-white px-3 py-1 rounded-full flex items-center text-xs font-medium mr-1">
              {loc}
              <button
                type="button"
                className="ml-1 text-white hover:text-gray-200 focus:outline-none"
                style={{ pointerEvents: 'auto' }}
                onClick={() => removeLocation(loc)}
              >
                <span className="ml-1">×</span>
              </button>
            </div>
          ))}
        </div>
      )}
      {/* +Add button */}
      {/* <button
        type="button"
        className="border border-black text-black bg-white px-3 py-1 rounded-full text-xs font-medium hover:bg-black hover:text-white transition-colors ml-1 pointer-events-auto"
        onClick={() => {
          // Focus the input field
          const input = document.querySelector<HTMLInputElement>('input[placeholder="Search by property name, location, or type..."]');
          input?.focus();
        }}
      >
        + Add
      </button> */}
    </div>
  </div>

  <div className="text-sm text-gray-600 mb-4 text-center sm:text-left">
    Showing {filteredProperties.length} of {properties.length} properties
  </div>
</div>


              {/* Property Cards */}
              {filteredProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProperties.map((property) => (
                    <Link href={`/property-details/${property.title}`} key={property.id} className="block">
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
                            <svg
                              className="w-3 h-3 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            {property.address?.subLocality ||
                              property.address?.city ||
                              "Location Name"}
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
                            {property.forSale
                              ? "For Sale"
                              : property.forRent
                              ? "For Rent"
                              : "For Sale"}
                          </span>
                          <span className="mx-1">•</span>
                          <span className="ml-1">
                            {property.propertyType?.displayName ||
                              property.propertyType?.childType?.displayName ||
                              "Office space"}
                          </span>
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
                            {getAttributeValue(property, "condition-id") ||
                              "Furnished"}
                          </div>

                          <div className="text-gray-500">Seat in office</div>
                          <div className="text-right text-black">
                            {getAttributeValue(property, "seating-capacity-id") ||
                              "120"}
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
                                ? `₹ ${(
                                    property.monetaryInfo?.expectedRent || 4500
                                  ).toLocaleString("en-IN")}`
                                : formatPrice(
                                    property.monetaryInfo?.expectedPrice
                                  )}
                            </div>
                            <div className="text-gray-500 text-xs">
                              {property.forRent ? "rent/month" : ""}
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            {/* Bookmark button */}
                            <button className="p-1.5 rounded flex items-center justify-center cursor-pointer">
                              <Image
                                src={bookmark}
                                alt="Bookmark"
                                width={24}
                                height={24}
                                className="object-contain"
                              />
                            </button>

                            {/* Share button */}
                            <button className="p-1.5 rounded flex items-center justify-center cursor-pointer">
                              <Image
                                src={share}
                                alt="Share"
                                width={24}
                                height={24}
                                className="object-contain"
                              />
                            </button>

                            {/* WhatsApp button */}
                            <button className="p-1.5 items-center justify-center cursor-pointer">
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
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <h3 className="text-xl font-medium text-gray-700">
                    No properties found
                  </h3>
                  <p className="text-gray-500 mt-2">
                    Try adjusting your search or filter criteria
                  </p>
                  <button
                    onClick={resetFilters}
                    className="mt-4 px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Bookmark Confirmation Modal */}
      {showBookmarkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Confirm Bookmark</h3>
            <p className="mb-6">Hello, do you want to bookmark this property?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => confirmBookmark(false)}
                className="px-4 py-2 border border-gray-300 cursor-pointer rounded-md text-gray-700 hover:bg-gray-50"
              >
                No
              </button>
              <button
                onClick={() => confirmBookmark(true)}
                className="px-4 py-2 bg-green-600 cursor-pointer text-white rounded-md hover:bg-green-700"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}