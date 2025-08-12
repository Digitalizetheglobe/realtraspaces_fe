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
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  imageUrls?: {
    Images?: Array<{
      imageFilePath: string;
      isCoverImage: boolean;
      orderRank?: number | null;
    }>;
  };
  propertyType?: {
    displayName?: string;
    childType?: {
      displayName?: string;
      type?: string;
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
    carpetArea?: number | null;
    parking?: number | null;
  };
  furnishStatus?: string;
  unitNo?: string | number;
  attributes?: Array<{
    masterPropertyAttributeId: string;
    value?: string | number;
    displayName?: string;
  }>;
  forSale?: boolean;
  forRent?: boolean;
  enquiredFor?: string;
};

export default function PropertyCards() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [allProperties, setAllProperties] = useState<Property[]>([]); // NEW: Combined properties from both pages
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
  const [enquiredForFilter, setEnquiredForFilter] = useState<string>("");
  const [bookmarkedProperties, setBookmarkedProperties] = useState<Set<string>>(new Set());
  // Add these new states at the top of the component
  const [allCities, setAllCities] = useState<string[]>([]);
  const [allSublocalities, setAllSublocalities] = useState<{ [city: string]: Set<string> }>({});
  const [allPropertyTypes, setAllPropertyTypes] = useState<string[]>([]);
  const [allUniversal, setAllUniversal] = useState<string[]>([]); // for universal search
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionType, setSuggestionType] = useState<string>(""); // city, sublocality, type, universal
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set()); // Track failed image URLs
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set()); // Track loading image URLs

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
        // Fetch properties from latestpropertytype page
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
        const propertiesData = Array.isArray(data) ? data : data.items || data.data || [];
        console.log('Fetched latestpropertytype properties:', propertiesData);
        
        // Fetch properties from properties page
        const propertiesResponse = await fetch(
          "https://prd-lrb-webapi.leadrat.com/api/v1/property/anonymous?PageNumber=1&PageSize=100",
          {
            method: "GET",
            headers: {
              accept: "application/json",
              tenant: "realtraspaces",
            },
          }
        );
        const propertiesData2 = await propertiesResponse.json();
        const propertiesPageData = Array.isArray(propertiesData2) ? propertiesData2 : propertiesData2.items || propertiesData2.data || [];
        console.log('Fetched properties page properties:', propertiesPageData);
        
        // Combine both sets of properties
        const combinedProperties = [...propertiesData, ...propertiesPageData];
        console.log('Combined properties:', combinedProperties);
        
        setProperties(propertiesData);
        setAllProperties(combinedProperties);
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
    const propertyTypes = Array.from(new Set(allProperties.map(p => p.propertyType?.displayName).filter((t): t is string => Boolean(t))));
    // Universal search: collect all searchable strings
    const universal = new Set<string>();
    allProperties.forEach(p => {
      if (p.title) universal.add(p.title);
      if (p.address?.city) universal.add(p.address.city);
      if (p.address?.subLocality) universal.add(p.address.subLocality);
      if (p.address?.state) universal.add(p.address.state);
      if (p.propertyType?.displayName) universal.add(p.propertyType.displayName);
      if (p.propertyType?.childType?.displayName) universal.add(p.propertyType.childType.displayName);
      if (p.monetaryInfo?.expectedPrice) universal.add(p.monetaryInfo.expectedPrice.toString());
      if (p.monetaryInfo?.expectedRent) universal.add(p.monetaryInfo.expectedRent.toString());
      if (p.unitNo) universal.add(p.unitNo.toString());
      if (p.dimension?.area) universal.add(p.dimension.area.toString());
      if (p.attributes) p.attributes.forEach(attr => {
        if (attr.displayName) universal.add(attr.displayName);
        if (attr.value) universal.add(attr.value.toString());
      });
      // Add property status
      if (p.forSale) universal.add("For Sale");
      if (p.forRent) universal.add("For Rent");
      // Add price ranges
      if (p.monetaryInfo?.expectedPrice) {
        const price = p.monetaryInfo.expectedPrice;
        if (price < 1000000) universal.add("Under 10 Lakhs");
        else if (price < 5000000) universal.add("Under 50 Lakhs");
        else if (price < 10000000) universal.add("Under 1 Crore");
        else universal.add("Above 1 Crore");
      }
    });
    setAllCities(cities);
    setAllSublocalities(sublocalities);
    setAllPropertyTypes(propertyTypes);
    setAllUniversal(Array.from(universal));
  }, [allProperties]);

  // Update suggestions as user types
  useEffect(() => {
    if (!search) {
      setSuggestions([]);
      setSuggestionType("");
      return;
    }
    const searchLower = search.toLowerCase();
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
  }, [search, selectedLocations]); // Removed problematic dependencies that cause infinite loops

  // Add suggestion as chip (city, sublocality, type, or universal)
  const handleSuggestionClick = (suggestion: string) => {
    addLocation(suggestion);
    setSearch("");
    setSuggestions([]);
  };

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

  // Helper function to get the best image for a property
  const getPropertyImage = (property: Property): string => {
    if (property.imageUrls?.Images && property.imageUrls.Images.length > 0) {
      // First try to find a cover image
      const coverImage = property.imageUrls.Images.find(img => img.isCoverImage);
      if (coverImage && !failedImages.has(coverImage.imageFilePath)) {
        return coverImage.imageFilePath;
      }
      // If no cover image or cover image failed, return the first non-failed image
      const firstImage = property.imageUrls.Images.find(img => !failedImages.has(img.imageFilePath));
      if (firstImage) {
        return firstImage.imageFilePath;
      }
    }
    return defaultPropertyImage.src;
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

  // Helper function to check if a property matches the enquiredFor filter
  const propertyMatchesEnquiredFor = (property: Property, filter: string): boolean => {
    // If enquiredFor is explicitly set, check it directly
    if (property.enquiredFor) {
      return property.enquiredFor === filter;
    }
    
    // Otherwise, check based on forSale/forRent
    if (filter === "Rent") {
      return property.forRent === true;
    } else if (filter === "Sale") {
      return property.forSale === true;
    }
    
    return false;
  };

  // Enhanced filtering logic with multiple filter types - now searches across both pages
  const filteredProperties = allProperties.filter((property) => {
    // Filter by enquiredFor (Rent/Investment)
    if (enquiredForFilter) {
      if (!propertyMatchesEnquiredFor(property, enquiredForFilter)) {
        return false;
      }
    }
    
    // Filter by search type (Rent/Investment/Research) - keep this for backward compatibility
    if (selectedType && !enquiredForFilter) {
      const typeLower = selectedType.toLowerCase().trim();
      
      // Filter by property type based on search type
      if (typeLower === "rent") {
        if (!property.forRent) return false;
      } else if (typeLower === "investment") {
        if (!property.forSale) return false;
      } else if (typeLower === "research") {
        // For research, show both sale and rent properties
        if (!property.forSale && !property.forRent) return false;
      }
    }

    // Filter by search text and selected locations
    if (search.trim() || selectedLocations.length > 0) {
      const searchLower = search.toLowerCase().trim();
      const hasSearchMatch = search.trim() ? (
        (property.title?.toLowerCase().includes(searchLower) ?? false) ||
        (property.address?.subLocality?.toLowerCase().includes(searchLower) ?? false) ||
        (property.address?.city?.toLowerCase().includes(searchLower) ?? false) ||
        (property.address?.state?.toLowerCase().includes(searchLower) ?? false) ||
        (property.propertyType?.displayName?.toLowerCase().includes(searchLower) ?? false) ||
        (property.propertyType?.childType?.displayName?.toLowerCase().includes(searchLower) ?? false) ||
        (property.dimension?.area?.toString().toLowerCase().includes(searchLower) ?? false) ||
        (property.monetaryInfo?.expectedPrice?.toString().includes(searchLower) ?? false) ||
        (property.monetaryInfo?.expectedRent?.toString().includes(searchLower) ?? false) ||
        (property.unitNo?.toString().toLowerCase().includes(searchLower) ?? false) ||
        (property.attributes?.some(attr =>
          (attr.displayName?.toLowerCase().includes(searchLower) ?? false) ||
          (attr.value?.toString().toLowerCase().includes(searchLower) ?? false)
        ) ?? false) ||
        // Price range matching
        (searchLower.includes("under 10 lakhs") && property.monetaryInfo?.expectedPrice && property.monetaryInfo.expectedPrice < 1000000) ||
        (searchLower.includes("under 50 lakhs") && property.monetaryInfo?.expectedPrice && property.monetaryInfo.expectedPrice < 5000000) ||
        (searchLower.includes("under 1 crore") && property.monetaryInfo?.expectedPrice && property.monetaryInfo.expectedPrice < 10000000) ||
        (searchLower.includes("above 1 crore") && property.monetaryInfo?.expectedPrice && property.monetaryInfo.expectedPrice >= 10000000) ||
        // Property status matching
        (searchLower.includes("for sale") && property.forSale) ||
        (searchLower.includes("for rent") && property.forRent)
      ) : true;

      const hasLocationMatch = selectedLocations.length > 0 ? selectedLocations.some((loc) => {
        const locLower = loc.toLowerCase();
        return (
          (property.address?.subLocality?.toLowerCase().includes(locLower) ?? false) ||
          (property.address?.city?.toLowerCase().includes(locLower) ?? false) ||
          (property.address?.state?.toLowerCase().includes(locLower) ?? false) ||
          (property.propertyType?.displayName?.toLowerCase().includes(locLower) ?? false) ||
          (property.propertyType?.childType?.displayName?.toLowerCase().includes(locLower) ?? false) ||
          (property.title?.toLowerCase().includes(locLower) ?? false) ||
          (property.monetaryInfo?.expectedPrice?.toString().includes(loc) ?? false) ||
          (property.monetaryInfo?.expectedRent?.toString().includes(loc) ?? false) ||
          (property.unitNo?.toString().toLowerCase().includes(locLower) ?? false) ||
          (property.attributes?.some(attr =>
            (attr.displayName?.toLowerCase().includes(locLower) ?? false) ||
            (attr.value?.toString().toLowerCase().includes(locLower) ?? false)
          ) ?? false) ||
          // Price range matching for location chips
          (locLower.includes("under 10 lakhs") && property.monetaryInfo?.expectedPrice && property.monetaryInfo.expectedPrice < 1000000) ||
          (locLower.includes("under 50 lakhs") && property.monetaryInfo?.expectedPrice && property.monetaryInfo.expectedPrice < 5000000) ||
          (locLower.includes("under 1 crore") && property.monetaryInfo?.expectedPrice && property.monetaryInfo.expectedPrice < 10000000) ||
          (locLower.includes("above 1 crore") && property.monetaryInfo?.expectedPrice && property.monetaryInfo.expectedPrice >= 10000000) ||
          // Property status matching for location chips
          (locLower.includes("for sale") && property.forSale) ||
          (locLower.includes("for rent") && property.forRent)
        );
      }) : true;

      return hasSearchMatch && hasLocationMatch;
    }

    // If no filters applied, show all properties
    return true;
  });

  // Helper function to determine enquiredFor value for a property
  const getPropertyEnquiredFor = (property: Property): string | null => {
    // If enquiredFor is explicitly set, use it
    if (property.enquiredFor) {
      return property.enquiredFor;
    }
    
    // Otherwise, derive from forSale/forRent
    if (property.forRent && !property.forSale) {
      return "Rent";
    } else if (property.forSale && !property.forRent) {
      return "Sale";
    } else if (property.forSale && property.forRent) {
      // If both are true, we can't determine - return null
      return null;
    }
    
    return null;
  };

  // Handle bookmark button click
  const handleCheckboxClick = (propertyId: string) => {
    setBookmarkedProperties(prev => {
      const newBookmarks = new Set(prev);
      if (newBookmarks.has(propertyId)) {
        newBookmarks.delete(propertyId);
      } else {
        newBookmarks.add(propertyId);
      }
      return newBookmarks;
    });
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
       <section className="relative w-full h-[220px] sm:h-[320px] md:h-[400px]">
         <div className="absolute inset-0 z-0">
    <video
      autoPlay
      muted
      loop
      playsInline
      className="w-full h-full object-cover"
    >
      <source src="/assets/main_vedio.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    <div className="absolute inset-0 bg-black opacity-50"></div>
  </div>

    <div className="absolute bottom-4 w-full flex justify-center px-4 py-40">
      <div className="flex flex-col sm:flex-row w-full sm:w-[90%] md:w-[750px] max-w-[98%] items-stretch sm:items-center gap-3 px-4 py-3 rounded-2xl border border-gray-300 bg-white/60 backdrop-blur-md shadow-lg overflow-visible relative">
        {/* Suggestions Dropdown - now directly above the search bar */}
       
        {/* Dropdown */}
        <div
          className="relative w-full sm:w-auto"
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <button
            type="button"
            className="appearance-none w-full sm:min-w-[200px] bg-black text-white text-sm font-medium pl-5 pr-10 py-3 rounded-2xl outline-none cursor-pointer flex justify-between items-center"
            onClick={() => setDropdownOpen(true)}
          >
            {selectedType
              ? selectedType === "Rent"
                ? "Rent"
                : selectedType === "Investment"
                ? "Investment"
                : selectedType === ""
                ? ""
                : selectedType
              : "Select Search Type"}
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white text-xs">
              ▼
            </span>
          </button>
          {dropdownOpen && (
            <div className="absolute left-0 right-0  bg-black text-white rounded-lg shadow-lg z-50" style={{ zIndex: 9999 }}>
              <div
                className={`px-5 py-3 cursor-pointer hover:bg-gray-800 rounded-t-lg ${enquiredForFilter === "Rent" ? "bg-gray-700" : ""}`}
                onClick={() => { 
                  setSelectedType("Rent"); 
                  setEnquiredForFilter("Rent");
                  setDropdownOpen(false); 
                }}
              >
                Rent
              </div>
              <div
                className={`px-5 py-3 cursor-pointer hover:bg-gray-800 rounded-b-lg ${enquiredForFilter === "Sale" ? "bg-gray-700" : ""}`}
                onClick={() => { 
                  setSelectedType("Investment"); 
                  setEnquiredForFilter("Sale");
                  setDropdownOpen(false); 
                }}
              >
                Investment
              </div>
              <div
                className={`px-5 py-3 cursor-pointer hover:bg-gray-800 rounded-b-lg ${selectedType === "" ? "bg-gray-700" : ""}`}
                onClick={() => { 
                  setSelectedType("Research"); 
                  setEnquiredForFilter("");
                  setDropdownOpen(false); 
                  router.push('/research');
                }}
              >
                Research
              </div>
            </div>
          )}
        </div>
        {/* Multi-location chips UI inside input area, right-aligned */}
        {/* <div className="mb-2 text-center">
          <p className="text-xs text-gray-600">
            🔍 Searching across both Latest Properties and All Properties pages
          </p>
        </div> */}
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search across both pages: property name, location, or type..."
            className="w-full bg-white text-gray-900 px-5 py-3 text-sm rounded-2xl outline-none pr-44"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleInputKeyDown}
            autoComplete="off"
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
        
        {/* Clear Filters Button */}
        {/* {(selectedType || enquiredForFilter || selectedLocations.length > 0 || search.trim()) && (
          <button
            onClick={() => {
              setSelectedType("");
              setEnquiredForFilter("");
              setSelectedLocations([]);
              setSearch("");
              setSuggestions([]);
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 hover:scale-105"
          >
            Clear
          </button>
        )} */}
      </div>
    </div>


      </section>
   <section className="pb-8 sm:pb-10 lg:pb-20 bg-white dark:bg-dark relative overflow-hidden">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="w-full">
            {/* Heading */}
            <div className="mb-8 sm:mb-[30px] w-full">
              <h2 className="mt-2 sm:mt-10 font-normal text-xl sm:text-2xl md:text-[32px] leading-[120%] tracking-normal text-center transform transition-all duration-700 hover:scale-105">
                <span className="text-black">The Latest.</span>{" "}
                <span className="text-[#6E6E73]">
                  Take a look at whats new right now.
                </span>
              </h2>
              
                             {/* Results Counter */}
               {(selectedType || enquiredForFilter || selectedLocations.length > 0 || search.trim()) && (
                 <div className="mt-4 text-center">
                   <p className="text-sm text-gray-600">
                     Showing {filteredProperties.length} of {allProperties.length} properties (searching across both pages)
                     {selectedType && ` • Type: ${selectedType}`}
                     {enquiredForFilter && ` • Enquired For: ${enquiredForFilter}`}
                     {selectedLocations.length > 0 && ` • Locations: ${selectedLocations.join(", ")}`}
                     {search.trim() && ` • Search: "${search}"`}
                   </p>
                 </div>
               )}
               
               {/* Debug Info */}
               {/* <div className="mt-4 text-center">
                 <p className="text-xs text-gray-500">
                   Debug: Properties with enquiredFor="Rent": {properties.filter(p => p.enquiredFor === "Rent").length} | 
                   Properties with enquiredFor="Sale": {properties.filter(p => p.enquiredFor === "Sale").length} |
                   Properties with forRent=true: {properties.filter(p => p.forRent).length} |
                   Properties with forSale=true: {properties.filter(p => p.forSale).length} |
                   Properties that would show for Rent filter: {properties.filter(p => propertyMatchesEnquiredFor(p, "Rent")).length} |
                   Properties that would show for Sale filter: {properties.filter(p => propertyMatchesEnquiredFor(p, "Sale")).length}
                 </p>
               </div> */}
            </div>

            {/* Property Cards */}
            {filteredProperties.length === 0 ? (
              <div className="text-center ">
                <div className="text-gray-500 text-lg mb-4">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-xl font-medium text-gray-700 mb-2">No properties found</p>
                  <p className="text-gray-500">Try adjusting your search criteria or filters</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedType("");
                    setEnquiredForFilter("");
                    setSelectedLocations([]);
                    setSearch("");
                    setSuggestions([]);
                  }}
                  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
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
                        {[property.address?.subLocality, property.address?.city]
  .filter(Boolean)
  .join(", ") || "Location Name"}
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
                      src={getPropertyImage(property)}
                      alt={property.title || "Property"}
                      className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:brightness-110"
                      width={340}
                      height={180}
                      onLoad={() => {
                        // Remove from loading state when image loads successfully
                        const imageUrl = getPropertyImage(property);
                        if (imageUrl !== defaultPropertyImage.src) {
                          setLoadingImages(prev => {
                            const newSet = new Set(prev);
                            newSet.delete(imageUrl);
                            return newSet;
                          });
                        }
                      }}
                      onError={(e) => {
                        // Add failed image URL to state and fallback to default image
                        const target = e.target as HTMLImageElement;
                        const failedUrl = target.src;
                        setFailedImages(prev => new Set(prev).add(failedUrl));
                        setLoadingImages(prev => {
                          const newSet = new Set(prev);
                          newSet.delete(failedUrl);
                          return newSet;
                        });
                        target.src = defaultPropertyImage.src;
                      }}
                    />
                    {/* Loading overlay */}
                    {loadingImages.has(getPropertyImage(property)) && (
                      <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
                      </div>
                    )}
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
                        {
                          property.propertyType?.childType?.type ||
                          "Office space"}
                      </span>
                    </div>
                    {/* </Link> */}
                  </div>
                  </Link>
                  {/* Property Details */}
                  <div className="p-2 sm:p-3 flex-grow font-monotransition-all duration-300 hover:bg-gray-50/30">
                  <Link href={`/property-details/${property.title}`} key={property.title} className="block">
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div className="text-gray-500 transition-all font-mono duration-300 hover:text-gray-600">Built up Area</div>
                      <div className="text-right text-black transition-all duration-300 hover:font-medium hover:text-gray-800">
                        {property.dimension?.area || "5490"} sqft
                      </div>

                      <div className="text-gray-500 transition-all duration-300 hover:text-gray-600">Carpet Area</div>
                      <div className="text-right text-black transition-all duration-300 hover:font-medium hover:text-gray-800">
                      {property.dimension?.carpetArea ? `${property.dimension.carpetArea} sqft` : "N/A"}
                      </div>

                      <div className="text-gray-500 transition-all duration-300 hover:text-gray-600">Parking</div>
                      <div className="text-right text-black transition-all duration-300 hover:font-medium hover:text-gray-800">
                      {property.dimension?.parking || "N/A"}
                      </div>

                      <div className="text-gray-500 transition-all duration-300 hover:text-gray-600">No of Cabin</div>
                      <div className="text-right text-black transition-all duration-300 hover:font-medium hover:text-gray-800">
                      {property.furnishStatus || "N/A"}
                      </div>
                    </div>
                          </Link>
                    <div className="border-t border-gray-200 my-2 transition-all duration-300 hover:border-gray-300"></div>

                    {/* Price and Actions */}
                    {/* <Link href={`/property-details/${property.title}`} key={property.title} className="block"> */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-1 gap-2 sm:gap-0">
                    <Link href={`/property-details/${property.title}`} key={property.title} className="block">
                      <div className="transition-all duration-300 hover:scale-105">
                        <div className="text-base text-black font-mono font-semibold transition-all duration-300 hover:text-gray-800">
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
            )}
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
  <div className="fixed inset-0 bg-gray-500 bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
    <div className="bg-white  rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 opacity-100">
      {/* Header with gradient background */}
      <div className="bg-black text-white p-6 rounded-t-2xl">
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
          <label htmlFor="name" className="block text-sm font-semibold text-black">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 bg-white text-black"
              placeholder="Enter your full name"
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-semibold text-black">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 bg-white text-black"
              placeholder="Enter your email address"
            />
          </div>
        </div>

        {/* Phone Field */}
        <div className="text-black space-y-2">
  <p>
    <span className="font-semibold ">Contact No:</span>{' '}
    <a href="tel:+919730156575" className="text-black hover:text-blue-800 font-mono hover:underline">
      +91 9730156575
    </a>
  </p>
  <p>
    <span className="font-semibold">Email:</span>{' '}
    <a href="mailto:info@realtraspaces.com" className="text-black hover:text-blue-800 hover:underline">
      info@realtraspaces.com
    </a>
  </p>
  <p>
    <span className="font-semibold">Address:</span> Mumbai, Maharashtra, India
  </p>
</div>


        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-black text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            Send Message
          </button>
          <button
            type="button"
            onClick={handleClosePopup}
            className="flex-1 bg-white text-black border border-black  py-3 px-6 rounded-xl hover:bg-[#F1F1F4] transition-all duration-200 font-semibold  hover:border-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
