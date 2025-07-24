"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Raleway } from "next/font/google";
import { X, User, Mail, Phone, MessageSquare, Send } from "lucide-react";
import defaultPropertyImage from "../../../public/assets/images/latestproperty1.png";
import share from "../../../public/assets/Frame 29.png";
import bookmark from "../../../public/assets/Frame 28.png";
import whatsapp from "../../../public/assets/WhatsApp.png";
import TopDevelopers from "../topdevelopers/page";
import home from "../../../public/assets/hero.jpg";
import Link from "next/link";
import ShareModal from "../../components/ShareModal";
import CalculatorSection from "@/components/calculate";
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

export default function PropertyCards() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]); // NEW
  const [showPopup, setShowPopup] = useState(false);
  const [popupDismissed, setPopupDismissed] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    number: "",
    message: ""
  });
  const [openShareIndex, setOpenShareIndex] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");
  const [bookmarkedProperties, setBookmarkedProperties] = useState<Set<string>>(new Set());
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [propertyToBookmark, setPropertyToBookmark] = useState<string | null>(null);

  // Click-away listener for share dropdown
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

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(
          "https://prd-lrb-webapi.leadrat.com/api/v1/property/anonymous?PageNumber=1&PageSize=20",
          {
            method: "GET",
            headers: {
              accept: "application/json",
              tenant: "realtraspaces",
            },
          }
        );
        const data = await response.json();
        // Inspect the response structure and set the correct array
        // Example: if data.items is the array
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

  // Handle scroll to show popup
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Check localStorage for dismissal time
      const dismissedAt = localStorage.getItem('popupDismissedAt');
      if (dismissedAt) {
        const elapsed = Date.now() - parseInt(dismissedAt, 10);
        if (elapsed < 30 * 60 * 1000) { // 30 minutes
          setPopupDismissed(true);
          return;
        } else {
          setPopupDismissed(false);
        }
      }

      // Show popup when user scrolls 50% of the page and popup hasn't been dismissed
      if (scrollPosition > (documentHeight - windowHeight) * 0.5 && !showPopup && !popupDismissed) {
        setShowPopup(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showPopup, popupDismissed]);

  // On mount, check if popup should be shown
  useEffect(() => {
    const dismissedAt = localStorage.getItem('popupDismissedAt');
    if (dismissedAt) {
      const elapsed = Date.now() - parseInt(dismissedAt, 10);
      if (elapsed < 30 * 60 * 1000) {
        setPopupDismissed(true);
      }
    }
  }, []);

  // Popup close handler
  const handleClosePopup = () => {
    setShowPopup(false);
    setPopupDismissed(true);
    localStorage.setItem('popupDismissedAt', Date.now().toString());
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you can add your form submission logic
    handleClosePopup();
    setFormData({ email: "", name: "", number: "", message: "" });
  };

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
    if (price < 100000) return `₹ ${price}`;

    // For values in lakhs (1 lakh = 100,000)
    if (price < 10000000) {
      const lakhs = (price / 100000).toFixed(2);
      return `₹ ${lakhs} Lakhs`;
    }

    // For values in crores (1 crore = 10,000,000)
    const crores = (price / 10000000).toFixed(2);
    return `₹ ${crores} Cr`;
  };

  // Add location to selectedLocations
  const addLocation = (location: string) => {
    if (!location.trim()) return;
    if (!selectedLocations.includes(location)) {
      setSelectedLocations((prev) => [...prev, location]);
    }
    setSearch("");
  };

  // Remove location from selectedLocations
  const removeLocation = (location: string) => {
    setSelectedLocations((prev) => prev.filter((loc) => loc !== location));
  };

  // Handle Enter key in input for adding location
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim()) {
      addLocation(search.trim());
    }
  };

  // Filter properties based on selected locations (if any), else by search
  const filteredProperties = properties.filter((property) => {
    if (selectedLocations.length > 0) {
      // Match if ANY selected location matches subLocality or city (OR logic)
      return selectedLocations.some((loc) =>
        (property.address?.subLocality?.toLowerCase().includes(loc.toLowerCase()) ?? false) ||
        (property.address?.city?.toLowerCase().includes(loc.toLowerCase()) ?? false)
      );
    } else {
      const searchLower = search.toLowerCase();
      return (
        (property.title?.toLowerCase().includes(searchLower) ?? false) ||
        (property.address?.subLocality?.toLowerCase().includes(searchLower) ?? false) ||
        (property.address?.city?.toLowerCase().includes(searchLower) ?? false) ||
        (property.dimension?.area?.toString().toLowerCase().includes(searchLower) ?? false)
      );
    }
  });

  // Handle bookmark button click
  const handleCheckboxClick = (propertyId: string) => {
    if (bookmarkedProperties.has(propertyId)) {
      setBookmarkedProperties(prev => {
        const newBookmarks = new Set(prev);
        newBookmarks.delete(propertyId);
        return newBookmarks;
      });
    } else {
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
    <div className={raleway.className}>
       <section className="relative w-full h-[220px] sm:h-[320px] md:h-[420px]">
        <Image
          src={home}
          alt="City skyline"
          fill
          priority
          className="object-cover"
        />

    <div className="absolute bottom-4 w-full flex justify-center px-4 py-20">
      <div className="flex flex-col sm:flex-row w-full sm:w-[90%] md:w-[750px] max-w-[98%] items-stretch sm:items-center gap-3 px-4 py-3 rounded-2xl border border-gray-300 bg-white/60 backdrop-blur-md shadow-lg overflow-visible relative">
        {/* Suggestions Dropdown - now directly above the search bar */}
        {search && filteredProperties.length > 0 && (
          <div className="absolute left-0 right-0 bottom-full mb-2 max-w-3xl justify-center items-center bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
            {filteredProperties.slice(0, 8).map((property, idx) => (
              <div
                key={property.id}
                className="px-5 py-3 cursor-pointer hover:bg-gray-100 flex justify-between items-center"
                onClick={() => {
                  addLocation(property.address?.subLocality || property.address?.city || property.title || "");
                }}
              >
                <div>
                  <div className="font-medium text-black">{property.title}</div>
                  <div className="text-xs text-gray-500">
                    {(property.address?.subLocality || property.address?.city) && (
                      <>
                        {property.address?.subLocality
                          ? `${property.address.subLocality}, `
                          : ""}
                        {property.address?.city}
                      </>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-400">LOCALITY</span>
              </div>
            ))}
          </div>
        )}
        {/* Dropdown */}
        <div
          className="relative w-full sm:w-auto"
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <button
            type="button"
            className="appearance-none w-full sm:min-w-[200px] bg-black text-white text-sm font-medium pl-5 pr-10 py-3 rounded-full outline-none cursor-pointer flex justify-between items-center"
            onClick={() => setDropdownOpen(true)}
          >
            {selectedType
              ? selectedType === "commercial"
                ? "Commercial"
                : selectedType === "coworking"
                ? "Co-working"
                : selectedType
              : "Select Search Type"}
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white text-xs">
              ▼
            </span>
          </button>
          {dropdownOpen && (
            <div className="absolute left-0 right-0 mt-2 bg-black text-white rounded-lg shadow-lg z-50" style={{ zIndex: 9999 }}>
              <div
                className={`px-5 py-3 cursor-pointer hover:bg-gray-800 rounded-t-lg ${selectedType === "commercial" ? "bg-gray-700" : ""}`}
                onClick={() => { setSelectedType("commercial"); setDropdownOpen(false); }}
              >
                Commercial
              </div>
              <div
                className={`px-5 py-3 cursor-pointer hover:bg-gray-800 rounded-b-lg ${selectedType === "coworking" ? "bg-gray-700" : ""}`}
                onClick={() => { setSelectedType("coworking"); setDropdownOpen(false); }}
              >
                Co-working
              </div>
            </div>
          )}
        </div>
        {/* Multi-location chips UI inside input area, right-aligned */}
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search by property name, location, or type..."
            className="w-full bg-white text-gray-900 px-5 py-3 text-sm rounded-full outline-none pr-44" // add right padding for chips
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleInputKeyDown}
          />
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
      </div>
    </div>


      </section>
   <section className="pb-8 sm:pb-10 lg:pb-20 bg-white dark:bg-dark relative overflow-hidden">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="w-full">
            {/* Heading */}
            <div className="mb-8 sm:mb-[60px] w-full">
              <h2 className="mt-6 sm:mt-10 font-normal text-xl sm:text-2xl md:text-[32px] leading-[120%] tracking-normal text-center transform transition-all duration-700 hover:scale-105">
                <span className="text-black">The Latest.</span>{" "}
                <span className="text-[#6E6E73]">
                  Take a look at whats new right now.
                </span>
              </h2>
            </div>

            {/* Property Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProperties.slice(0, 4).map((property, index) => (
                
                <div
                  key={property.id}
                  className="w-full max-w-full sm:max-w-[340px] bg-[#F1F1F4] rounded-lg overflow-hidden border border-gray-200 mx-auto flex flex-col transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-2xl hover:shadow-gray-400/20 hover:-translate-y-2 hover:border-gray-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Header with title and checkbox */}
                  <div className="p-2 sm:p-3 flex justify-between items-center transition-all duration-300 hover:bg-gray-50/50">
                  <Link href={`/property-details/${property.title}`} key={property.title} className="block">
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
                        {property.address?.subLocality ||
                          property.address?.city ||
                          "Location Name"}
                      </div>
                    </div>
                    </Link>
                    {/* <div className="w-5 h-5 border border-gray-600 rounded flex items-center justify-center transition-all duration-300 hover:border-gray-800 hover:bg-gray-100 hover:scale-110">
                      <svg
                        className="w-3 h-3 text-black transition-all duration-300 hover:scale-110"
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
                    </div> */}
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
                  <Link href={`/property-details/${property.title}`} key={property.title} className="block">
                  <div className="relative h-[140px] sm:h-[180px] overflow-hidden group">
                    <Image
                      src={defaultPropertyImage}
                      alt={property.title || "Property"}
                      className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:brightness-110"
                      width={340}
                      height={180}
                    />
                    {/* For Sale/Rent / Property Type overlay */}
                    {/* <Link href={`/property-details/${property.title}`} key={property.title} className="block"> */}
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
                    {/* </Link> */}
                  </div>
                  </Link>
                  {/* Property Details */}
                  <div className="p-2 sm:p-3 flex-grow transition-all duration-300 hover:bg-gray-50/30">
                  <Link href={`/property-details/${property.title}`} key={property.title} className="block">
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div className="text-gray-500 transition-all duration-300 hover:text-gray-600">Carpet Area</div>
                      <div className="text-right text-black transition-all duration-300 hover:font-medium hover:text-gray-800">
                        {property.dimension?.area || "5490"} sqft
                      </div>

                      <div className="text-gray-500 transition-all duration-300 hover:text-gray-600">Space Condition</div>
                      <div className="text-right text-black transition-all duration-300 hover:font-medium hover:text-gray-800">
                        {getAttributeValue(property, "condition-id") ||
                          "Furnished"}
                      </div>

                      <div className="text-gray-500 transition-all duration-300 hover:text-gray-600">Seat in office</div>
                      <div className="text-right text-black transition-all duration-300 hover:font-medium hover:text-gray-800">
                        {getAttributeValue(property, "seating-capacity-id") ||
                          "120"}
                      </div>

                      <div className="text-gray-500 transition-all duration-300 hover:text-gray-600">No of Cabin</div>
                      <div className="text-right text-black transition-all duration-300 hover:font-medium hover:text-gray-800">
                        {getAttributeValue(property, "cabins-id") || "12"}
                      </div>
                    </div>
                          </Link>
                    <div className="border-t border-gray-200 my-2 transition-all duration-300 hover:border-gray-300"></div>

                    {/* Price and Actions */}
                    {/* <Link href={`/property-details/${property.title}`} key={property.title} className="block"> */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-1 gap-2 sm:gap-0">
                    <Link href={`/property-details/${property.title}`} key={property.title} className="block">
                      <div className="transition-all duration-300 hover:scale-105">
                        <div className="text-base text-black font-semibold transition-all duration-300 hover:text-gray-800">
                          {property.forRent
                            ? `₹ ${property.monetaryInfo?.expectedRent || 4500}`
                            : formatPrice(property.monetaryInfo?.expectedPrice)}
                        </div>
                        <div className="text-gray-500 text-xs transition-all duration-300 hover:text-gray-600">
                          {property.forRent ? "rent/month" : ""}
                        </div>
                      </div>
                      </Link>
                      <div className="flex space-x-1 relative">
                        {/* Bookmark button (functional) */}
                      
                        {/* Location button */}
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
                          href={`https://wa.me/7039311539?text=${encodeURIComponent(property.title || 'Check out this property!')}%20${encodeURIComponent(getPropertyUrl(property))}`}
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
          </div>
        </div>

        {/* CSS Animation Keyframes */}
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
      </section>
      
      <TopDevelopers />

      {/* Popup Modal */}
      {showPopup && (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
    <div className="bg-white border-2 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 opacity-100">
      {/* Header with gradient background */}
      <div className="bg-gray-500 text-white p-6 rounded-t-2xl">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold">Get in Touch</h3>
            <p className="text-[#F1F1F4] mt-1">We'd love to hear from you!</p>
          </div>
          <button
            onClick={handleClosePopup}
            className="text-white hover:text-[#F1F1F4] transition-colors duration-200 p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="p-6 space-y-6 bg-[#F1F1F4]">
        {/* Name Field */}
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-semibold text-[#6E6E73]">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6E6E73] w-5 h-5" />
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 bg-white text-black"
              placeholder="Enter your full name"
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-semibold text-[#6E6E73]">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6E6E73] w-5 h-5" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 bg-white text-black"
              placeholder="Enter your email address"
            />
          </div>
        </div>

        {/* Phone Field */}
        <div className="text-gray-700 space-y-2">
  <p>
    <span className="font-semibold">Contact No:</span>{' '}
    <a href="tel:+919730156575" className="text-blue-600 hover:text-blue-800 hover:underline">
      +91 9730156575
    </a>
  </p>
  <p>
    <span className="font-semibold">Email:</span>{' '}
    <a href="mailto:info@realtraspaces.com" className="text-blue-600 hover:text-blue-800 hover:underline">
      info@realtraspaces.com
    </a>
  </p>
  <p>
    <span className="font-semibold">Address:</span> Pune, Maharashtra, India
  </p>
</div>


        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            Send Message
          </button>
          <button
            type="button"
            onClick={handleClosePopup}
            className="flex-1 bg-white text-[#6E6E73] py-3 px-6 rounded-xl hover:bg-[#F1F1F4] transition-all duration-200 font-semibold border border-gray-300 hover:border-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)}

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

    </div>
  );
}
