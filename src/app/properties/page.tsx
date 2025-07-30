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
import SeoHead from "../../components/SeoHead";
import ShareModal from "../../components/ShareModal";
import PageWithSeo from "../../components/PageWithSeo";

// Removed metadata and head exports

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
  const [openShareIndex, setOpenShareIndex] = useState<number | null>(null);
  useEffect(() => {
    if (openShareIndex === null) return;
    const handleClickOutside = (event: MouseEvent) => {
      // Only close if the click is outside any share dropdown
      // We use a class on the dropdown for detection
      const target = event.target as HTMLElement;
      if (!target.closest('.share-dropdown')) {
        setOpenShareIndex(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openShareIndex]);

  // Debug: log when dropdown is rendered
  useEffect(() => {
    if (openShareIndex !== null) {
      console.log('Dropdown rendered for index:', openShareIndex);
    }
  }, [openShareIndex]);

  // Helper to get property URL
  const getPropertyUrl = (property: Property) => {
    if (!property.title) return window.location.href;
    return `${window.location.origin}/property-details/${encodeURIComponent(property.title)}`;
  };

  // Helper to copy link
  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };
  const [filters, setFilters] = useState({
    propertyType: "",
    priceRange: "",
    areaRange: "",
    condition: "",
    transactionType: "", // sale or rent
  });

  // Add these new states at the top of the component (after useState declarations)
  const [allCities, setAllCities] = useState<string[]>([]);
  const [allSublocalities, setAllSublocalities] = useState<{ [city: string]: Set<string> }>({});
  const [allPropertyTypes, setAllPropertyTypes] = useState<string[]>([]);
  const [allUniversal, setAllUniversal] = useState<string[]>([]); // for universal search
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionType, setSuggestionType] = useState<string>(""); // city, sublocality, type, universal

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

  // After fetching properties, preprocess unique values
  useEffect(() => {
    if (properties.length === 0) return;
    // Unique cities
    const cities = Array.from(new Set(properties.map(p => p.address?.city).filter((c): c is string => Boolean(c))));
    // Unique sublocalities grouped by city
    const sublocalities: { [city: string]: Set<string> } = {};
    properties.forEach(p => {
      if (p.address?.city && p.address?.subLocality) {
        if (!sublocalities[p.address.city]) sublocalities[p.address.city] = new Set();
        sublocalities[p.address.city].add(p.address.subLocality);
      }
    });
    // Unique property types
    const propertyTypes = Array.from(new Set(properties.map(p => p.propertyType?.displayName).filter((t): t is string => Boolean(t))));
    // Universal search: collect all searchable strings
    const universal = new Set<string>();
    properties.forEach(p => {
      if (p.title) universal.add(p.title);
      if (p.address?.city) universal.add(p.address.city);
      if (p.address?.subLocality) universal.add(p.address.subLocality);
      if (p.propertyType?.displayName) universal.add(p.propertyType.displayName);
      if (p.propertyType?.childType?.displayName) universal.add(p.propertyType.childType.displayName);
      if (p.monetaryInfo?.expectedPrice) universal.add(p.monetaryInfo.expectedPrice.toString());
      if (p.monetaryInfo?.expectedRent) universal.add(p.monetaryInfo.expectedRent.toString());
      if (p.unitNo) universal.add(p.unitNo.toString());
      if (p.attributes) p.attributes.forEach(attr => {
        if (attr.displayName) universal.add(attr.displayName);
        if (attr.value) universal.add(attr.value.toString());
      });
      // Add more fields as needed
    });
    setAllCities(cities);
    setAllSublocalities(sublocalities);
    setAllPropertyTypes(propertyTypes);
    setAllUniversal(Array.from(universal));
  }, [properties]);

  // Update suggestions as user types
  useEffect(() => {
    if (!searchTerm) {
      setSuggestions([]);
      setSuggestionType("");
      return;
    }
    const searchLower = searchTerm.toLowerCase();
    // If searching for a city
    const cityMatches = allCities.filter(city => city.toLowerCase().includes(searchLower));
    if (cityMatches.length > 0) {
      setSuggestions(cityMatches);
      setSuggestionType("city");
      return;
    }
    // If a city is selected, suggest sublocalities for that city
    if (selectedLocations.length > 0) {
      const city = selectedLocations[0]; // Only first city for now
      const subs = Array.from(allSublocalities[city] || []);
      const subMatches = subs.filter(sub => sub.toLowerCase().includes(searchLower));
      if (subMatches.length > 0) {
        setSuggestions(subMatches);
        setSuggestionType("sublocality");
        return;
      }
    }
    // If searching for property type
    const typeMatches = allPropertyTypes.filter(type => type.toLowerCase().includes(searchLower));
    if (typeMatches.length > 0) {
      setSuggestions(typeMatches);
      setSuggestionType("type");
      return;
    }
    // Universal search: suggest any matching value from properties
    const universalMatches = allUniversal.filter(val => val.toLowerCase().includes(searchLower));
    if (universalMatches.length > 0) {
      setSuggestions(universalMatches);
      setSuggestionType("universal");
      return;
    }
    setSuggestions([]);
    setSuggestionType("");
  }, [searchTerm, allCities, allSublocalities, allPropertyTypes, allUniversal, selectedLocations]);

  // Add suggestion as chip (city, sublocality, type, or universal)
  const handleSuggestionClick = (suggestion: string) => {
    addLocation(suggestion);
    setSearchTerm("");
    setSuggestions([]);
  };

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

  // Update filtering logic to use all selected chips (city, sublocality, type, universal)
  useEffect(() => {
    let results = properties;

    // Multi-location search logic
    if (selectedLocations.length > 0) {
      results = results.filter((property) =>
        selectedLocations.some((loc) => {
          const locLower = loc.toLowerCase();
          return (
            (property.address?.subLocality?.toLowerCase().includes(locLower) ?? false) ||
            (property.address?.city?.toLowerCase().includes(locLower) ?? false) ||
            (property.propertyType?.displayName?.toLowerCase().includes(locLower) ?? false) ||
            (property.propertyType?.childType?.displayName?.toLowerCase().includes(locLower) ?? false) ||
            (property.title?.toLowerCase().includes(locLower) ?? false) ||
            (property.monetaryInfo?.expectedPrice?.toString().includes(loc) ?? false) ||
            (property.monetaryInfo?.expectedRent?.toString().includes(loc) ?? false) ||
            (property.unitNo?.toString().toLowerCase().includes(locLower) ?? false) ||
            (property.attributes?.some(attr =>
              (attr.displayName?.toLowerCase().includes(locLower) ?? false) ||
              (attr.value?.toString().toLowerCase().includes(locLower) ?? false)
            ) ?? false)
          );
        })
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
      // If not bookmarked, add it directly
      setBookmarkedProperties(prev => {
        const newBookmarks = new Set(prev);
        newBookmarks.add(propertyId);
        return newBookmarks;
      });
    }
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
    <PageWithSeo page="properties">
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
      autoComplete="off"
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
    </div>
    {/* Suggestions dropdown */}
    {suggestions.length > 0 && (
      <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto" style={{ zIndex: 9999 }}>
        {suggestions.map((s, idx) => (
          <div
            className="px-5 py-2 cursor-pointer hover:bg-gray-100 text-sm text-black"
            onClick={() => handleSuggestionClick(s)}
            key={s + idx}
          >
            {s}
          </div>
        ))}
      </div>
    )}
  </div>

  <div className="text-sm text-gray-600 mb-4 text-center sm:text-left">
    Showing {filteredProperties.length} of {properties.length} properties
  </div>
</div>


              {/* Property Cards */}
              {filteredProperties.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg mb-4">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p className="text-xl font-medium text-gray-700 mb-2">No properties found</p>
                    <p className="text-gray-500">Try adjusting your search criteria or filters</p>
                  </div>
                  <button
                    onClick={resetFilters}
                    className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {filteredProperties.map((property, index) => (
                    <div
                      key={property.id}
                      className="w-full max-w-full sm:max-w-[340px] bg-[#F1F1F4] rounded-lg overflow-hidden border border-gray-200 mx-auto flex flex-col transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-2xl hover:shadow-gray-400/20 hover:-translate-y-2 hover:border-gray-300 animate-fade-in-up"
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      {/* Header with title and checkbox */}
                      <div className="p-2 sm:p-3 flex justify-between items-center transition-all duration-300 hover:bg-gray-50/50">
                        <Link href={`/property-details/${property.title}`} className="block">
                          <div className="h-14">
                            <h3 className="font-medium text-black text-sm sm:text-base transition-all duration-300 hover:text-gray-800">
                              {property.title || "Prime Business Hub"}
                            </h3>
                            <div className="flex items-center text-gray-700 text-xs transition-all duration-300 hover:text-gray-900">
                              <svg
                                className="w-4 h-4 mr-1 transition-all duration-300 hover:scale-110"
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
                              {property.address?.subLocality || property.address?.city || "Location Name"}
                            </div>
                          </div>
                        </Link>
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
                      <Link href={`/property-details/${property.title}`} className="block">
                        <div className="relative h-[140px] sm:h-[180px] overflow-hidden group">
                          <Image
                            src={defaultPropertyImage}
                            alt={property.title || "Property"}
                            className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:brightness-110"
                            width={340}
                            height={180}
                          />
                          {/* For Sale/Rent / Property Type overlay */}
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 text-white p-2 flex items-center text-xs transition-all duration-300 group-hover:bg-opacity-90 transform translate-y-0 group-hover:-translate-y-1">
                            <span className="mr-2 transition-all duration-300 group-hover:font-medium">
                              {property.forSale
                                ? "For Sale"
                                : property.forRent
                                ? "For Rent"
                                : "For Sale"}
                            </span>
                            <span className="mx-1 transition-all duration-300 group-hover:scale-110">•</span>
                            <span className="ml-1 transition-all duration-300 group-hover:font-medium">
                              {property.propertyType?.displayName ||
                                property.propertyType?.childType?.displayName ||
                                "Office space"}
                            </span>
                          </div>
                        </div>
                      </Link>
                      {/* Property Details */}
                      <div className="p-2 sm:p-3 flex-grow font-monotransition-all duration-300 hover:bg-gray-50/30">
                        <Link href={`/property-details/${property.title}`} className="block">
                          <div className="grid grid-cols-2 gap-1 text-xs">
                            <div className="text-gray-500 transition-all font-mono duration-300 hover:text-gray-600">Carpet Area</div>
                            <div className="text-right text-black transition-all duration-300 hover:font-medium hover:text-gray-800">
                              {property.dimension?.area || "5490"} sqft
                            </div>
                            <div className="text-gray-500 transition-all duration-300 hover:text-gray-600">Space Condition</div>
                            <div className="text-right text-black transition-all duration-300 hover:font-medium hover:text-gray-800">
                              {getAttributeValue(property, "condition-id") || "Furnished"}
                            </div>
                            <div className="text-gray-500 transition-all duration-300 hover:text-gray-600">Seat in office</div>
                            <div className="text-right text-black transition-all duration-300 hover:font-medium hover:text-gray-800">
                              {getAttributeValue(property, "seating-capacity-id") || "120"}
                            </div>
                            <div className="text-gray-500 transition-all duration-300 hover:text-gray-600">No of Cabin</div>
                            <div className="text-right text-black transition-all duration-300 hover:font-medium hover:text-gray-800">
                              {getAttributeValue(property, "cabins-id") || "12"}
                            </div>
                          </div>
                        </Link>
                        <div className="border-t border-gray-200 my-2 transition-all duration-300 hover:border-gray-300"></div>
                        {/* Price and Actions */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-1 gap-2 sm:gap-0">
                          <Link href={`/property-details/${property.title}`} className="block">
                            <div className="transition-all duration-300 hover:scale-105">
                              <div className="text-base text-black font-mono font-semibold transition-all duration-300 hover:text-gray-800">
                                {property.forRent
                                  ? `₹ ${(property.monetaryInfo?.expectedRent || 4500).toLocaleString("en-IN")}`
                                  : formatPrice(property.monetaryInfo?.expectedPrice)}
                              </div>
                              <div className="text-gray-500 text-xs transition-all duration-300 hover:text-gray-600">
                                {property.forRent ? "rent/month" : ""}
                              </div>
                            </div>
                          </Link>
                          <div className="flex space-x-1 relative">
                            {/* Map button */}
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
                              href={`https://wa.me/7039311539?text=${encodeURIComponent(property.title || 'Check out this property!')}%20${encodeURIComponent(`${window.location.origin}/property-details/${encodeURIComponent(property.title || '')}`)}`}
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
              )}
            </div>
          </div>
        </section>
      </div>
      <style jsx>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out both;
        }
      `}</style>
      </PageWithSeo>
    </>
  );
}