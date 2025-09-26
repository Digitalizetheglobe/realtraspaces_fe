"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Raleway } from "next/font/google";
import { toast } from "react-hot-toast";
import defaultPropertyImage from "../../../public/assets/images/latestproperty1.png";
import share from "../../../public/assets/Frame 29.png";
import bookmark from "../../../public/assets/Frame 28.png";
import whatsapp from "../../../public/assets/WhatsApp.png";
import Link from "next/link";

import contactimg from "../../../public/assets/images/contactimg.png";
import SeoHead from "../../components/SeoHead";
import ShareModal from "../../components/ShareModal";
import PageWithSeo from "../../components/PageWithSeo";
import { useRouter } from "next/navigation";
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
    carpetArea?: string | number;
    parking?: string | number;
  };
  unitNo?: string | number;
  furnishStatus?: string;
  attributes?: Array<{
    masterPropertyAttributeId: string;
    value?: string | number;
    displayName?: string;
  }>;
  forSale?: boolean;
  forRent?: boolean;
};

export default function Similarproperties() {
   const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [bookmarkedProperties, setBookmarkedProperties] = useState<Set<string>>(new Set());
  const [openShareIndex, setOpenShareIndex] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());
  const [isLoggedIn, setIsLoggedIn] = useState(false);
 const [isComparing, setIsComparing] = useState(false);
  // Check authentication status
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoggedIn(!!localStorage.getItem("authToken"));
    }
  }, []);

  // Helper function to get the best image URL for a property
  const getPropertyImage = (property: Property | null): string => {
    if (!property) return defaultPropertyImage.src;
    
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

  // Handle click outside for search dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.search-dropdown')) {
        setShowCityDropdown(false);
        setShowSubLocationDropdown(false);
        setShowPropertyTypeDropdown(false);
        setShowCarpetAreaDropdown(false);
        // Clear search terms when dropdowns are closed
        setCitySearchTerm("");
        setSubLocationSearchTerm("");
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // Add these new states for the multi-component search
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedSubLocations, setSelectedSubLocations] = useState<string[]>([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);

  // Debug effect to monitor selectedPropertyTypes changes
  useEffect(() => {
    console.log('selectedPropertyTypes changed:', selectedPropertyTypes);
    console.log('selectedPropertyTypes length:', selectedPropertyTypes.length);
  }, [selectedPropertyTypes]);
  const [selectedCarpetArea, setSelectedCarpetArea] = useState<string>("");
  const [minCarpetArea, setMinCarpetArea] = useState<string>("");
  const [maxCarpetArea, setMaxCarpetArea] = useState<string>("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showSubLocationDropdown, setShowSubLocationDropdown] = useState(false);
  const [showPropertyTypeDropdown, setShowPropertyTypeDropdown] = useState(false);
  const [showCarpetAreaDropdown, setShowCarpetAreaDropdown] = useState(false);
  const [citySearchTerm, setCitySearchTerm] = useState<string>("");
  const [subLocationSearchTerm, setSubLocationSearchTerm] = useState<string>("");
  const [allProperties, setAllProperties] = useState<Property[]>([]); // NEW: Combined properties from both pages
  
  // Add missing state variables for search functionality
  const [selectedType, setSelectedType] = useState<string>("");
  const [enquiredForFilter, setEnquiredForFilter] = useState<string>("");
 
  // Add state for contact form
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactFormData, setContactFormData] = useState({
    name: "",
    email: "",
    phone: "",
    propertyType: "",
    transactionType: "",
    inquiry: ""
  });

  // Carpet area options
  const carpetAreaOptions = [
    "Under 500 sqft",
    "500 - 1000 sqft", 
    "1000 - 1500 sqft",
    "1500 - 2000 sqft",
    "2000 - 3000 sqft",
    "3000 - 5000 sqft",
    "Over 5000 sqft"
  ];

  // Get available sub-locations for selected cities
  const getAvailableSubLocations = () => {
    if (selectedCities.length === 0) return [];
    
    // Get all sub-locations from all selected cities
    const allSubLocations = new Set<string>();
    selectedCities.forEach(city => {
      const citySubLocations = allSublocalities[city] || [];
      citySubLocations.forEach(subLoc => allSubLocations.add(subLoc));
    });
    
    return Array.from(allSubLocations);
  };

  // Get filtered and organized cities
  const getFilteredCities = () => {
    const priorityCities = [
      "Mumbai", "New Mumbai", "Thane", "Pune", "Pimpri-Chinchwad", 
      "Bangalore", "Chennai", "Hyderabad", "Kolkata", "Delhi"
    ];
    
    let filteredCities = allCities;
    
    // Filter by search term if provided
    if (citySearchTerm.trim()) {
      const searchLower = citySearchTerm.toLowerCase();
      filteredCities = allCities.filter(city => 
        city.toLowerCase().startsWith(searchLower)
      );
    }
    
    // Organize cities: priority cities first, then others
    const priorityCitiesInFiltered = priorityCities.filter(city => 
      filteredCities.includes(city)
    );
    const otherCitiesInFiltered = filteredCities.filter(city => 
      !priorityCities.includes(city)
    );
    
    return [...priorityCitiesInFiltered, ...otherCitiesInFiltered];
  };

  // Get filtered sub-locations
  const getFilteredSubLocations = () => {
    if (selectedCities.length === 0) return [];
    
    let filteredSubLocations = getAvailableSubLocations();
    
    // Filter by search term if provided
    if (subLocationSearchTerm.trim()) {
      const searchLower = subLocationSearchTerm.toLowerCase();
      filteredSubLocations = filteredSubLocations.filter(subLocation => 
        subLocation.toLowerCase().startsWith(searchLower)
      );
    }
    
    return filteredSubLocations;
  };

  // Get available property types (including child types)
  const getAllPropertyTypes = () => {
    const types = new Set<string>();
    allProperties.forEach(p => {
      if (p.propertyType?.displayName) {
        types.add(p.propertyType.displayName);
      }
      if (p.propertyType?.childType?.displayName) {
        types.add(p.propertyType.childType.displayName);
      }
    });
    const result = Array.from(types).sort(); // Sort to ensure consistent order
    return result;
  };

  const conditions = ["Furnished", "Semi-Furnished", "Unfurnished"];

  // Handle search parameters from sessionStorage for auto-populating search fields
  useEffect(() => {
    // Check for search data from latestpropertytype page
    const searchData = sessionStorage.getItem('searchData');
    
    if (searchData) {
      try {
        const parsedData = JSON.parse(searchData);
        
        // Apply search data if it exists
        if (parsedData.search) {
          setSearchTerm(parsedData.search);
        }
        
        if (parsedData.locations && parsedData.locations.length > 0) {
          setSelectedLocations(parsedData.locations);
          // Also set selected cities for the multi-component search
          setSelectedCities(parsedData.locations);
        }
        
        if (parsedData.type) {
          setSelectedType(parsedData.type);
        }
        
        if (parsedData.enquiredFor) {
          setEnquiredForFilter(parsedData.enquiredFor);
        }
        
        // Clear the search data after reading it
        sessionStorage.removeItem('searchData');
      } catch (error) {
        console.error('Error parsing search data from sessionStorage:', error);
        sessionStorage.removeItem('searchData');
      }
    }
    
    // Check sessionStorage for backward compatibility with other search methods
    const searchCity = sessionStorage.getItem('searchCity');
    const searchSubLocation = sessionStorage.getItem('searchSubLocation');
    
    if (searchCity && !searchData) {
      setSelectedCities([searchCity]);
    }
    if (searchSubLocation && !searchData) {
      setSelectedSubLocations([searchSubLocation]);
    }
    
    // Clear sessionStorage after reading the values
    sessionStorage.removeItem('searchCity');
    sessionStorage.removeItem('searchSubLocation');
  }, []);
const handleCompareClick = async () => {
    // Check if user is logged in
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      toast.error("Please log in to compare properties");
      router.push("/signin");
      return;
    }

    // Check if any properties are selected for comparison
    if (bookmarkedProperties.size === 0) {
      toast.error("Please select at least one property to compare");
      return;
    }
    
    try {
      setIsComparing(true);
      
      // Get selected properties
      const selectedProperties = allProperties.filter(prop => bookmarkedProperties.has(prop.id));
      let addedCount = 0;
      let alreadyInListCount = 0;
      
      // Add each selected property to comparison
      for (const property of selectedProperties) {
        try {
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
            const errorMessage = errorData.message || "Failed to add property to comparison";
            
            // Check if property is already in comparison list
            if (errorMessage.toLowerCase().includes("already in comparison") || 
                errorMessage.toLowerCase().includes("already exists")) {
              alreadyInListCount++;
              continue; // Skip this property and continue with others
            }
            
            throw new Error(errorMessage);
          }
          
          addedCount++;
          
        } catch (propertyError) {
          console.error(`Error adding property ${property.id}:`, propertyError);
          // Continue with other properties even if one fails
        }
      }
  
      // Show appropriate success message
      if (addedCount > 0 && alreadyInListCount > 0) {
        toast.success(`${addedCount} properties added to comparison. ${alreadyInListCount} were already in your list.`);
      } else if (addedCount > 0) {
        toast.success(`${addedCount} properties added to comparison`);
      } else if (alreadyInListCount > 0) {
        toast.success(`All ${alreadyInListCount} selected properties are already in your comparison list`);
      }
      
      // Navigate to compare page if any properties were added
      if (addedCount > 0) {
        router.push("/compareproperties");
      }
      
    } catch (error) {
      console.error("Error adding to compare:", error);
      toast.error(error instanceof Error ? error.message : "Failed to add to comparison");
    } finally {
      setIsComparing(false);
    }
  };
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(
          "https://prd-lrb-webapi.leadrat.com/api/v1/property/anonymous?PageNumber=1&PageSize=1000",
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
        setAllProperties(propertiesArray);
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
    if (allProperties.length === 0) return;
    // Unique cities
    const cities = Array.from(new Set(allProperties.map(p => p.address?.city).filter((c): c is string => Boolean(c))));
    // Unique sublocalities grouped by city
    const sublocalities: { [city: string]: Set<string> } = {};
    allProperties.forEach(p => {
      if (p.address?.city && p.address?.subLocality) {
        if (!sublocalities[p.address.city]) sublocalities[p.address.city] = new Set();
        sublocalities[p.address.city].add(p.address.subLocality);
      }
    });
    // Unique property types
    const propertyTypes = Array.from(new Set(allProperties.map(p => p.propertyType?.displayName).filter((t): t is string => Boolean(t))));
    
    // Add pre-fed popular cities that might not have properties yet
    const popularCities = [
      "Mumbai","New Mumbai","Thane","Pune","Pimpri-Chinchwad", "Bangalore",  "Chennai","Hyderabad", "Kolkata", "Delhi",
      "Ahmedabad", "Jaipur", "Surat", "Lucknow", "Kanpur", "Nagpur", "Indore", 
       "Bhopal", "Visakhapatnam",  "Patna", "Vadodara",
      "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot",
      "Kalyan-Dombivli", "Vasai-Virar", "Varanasi", "Srinagar", "Aurangabad",
      "Dhanbad", "Amritsar", "Allahabad", "Ranchi", "Howrah", "Coimbatore",
      "Jabalpur", "Gwalior", "Vijayawada", "Jodhpur", "Madurai", "Raipur",
      "Kota", "Guwahati", "Chandigarh", "Solapur", "Hubli-Dharwad", "Bareilly",
      "Moradabad", "Mysore", "Gurgaon", "Aligarh", "Jalandhar", "Tiruchirappalli",
      "Bhubaneswar", "Salem", "Warangal", "Mira-Bhayandar", "Thiruvananthapuram",
      "Bhiwandi", "Saharanpur", "Guntur", "Amravati", "Bikaner", "Noida",
      "Jamshedpur", "Bhilai", "Cuttack", "Firozabad", "Kochi", "Nellore",
      "Bhavnagar", "Dehradun", "Durgapur", "Asansol", "Rourkela", "Nanded",
      "Kolhapur", "Ajmer", "Akola", "Gulbarga", "Jamnagar", "Ujjain",
      "Loni", "Siliguri", "Jhansi", "Ulhasnagar", "Jammu", "Mangalore",
      "Belgaum", "Ambattur", "Tirunelveli", "Malegaon", "Gaya", "Jalgaon",
      "Udaipur", "Maheshtala", "Tiruppur", "Davanagere", "Kozhikode", "Akola",
      "Kurnool", "Rajpur Sonarpur", "Bokaro", "South Dumdum", "Bellary",
      "Patiala", "Gopalpur", "Agartala", "Bhagalpur", "Muzaffarnagar",
      "Bhatpara", "Panihati", "Latur", "Dhule", "Rohtak", "Sagar",
      "Korba", "Bhilwara", "Brahmapur", "Muzaffarpur", "Ahmednagar",
      "Mathura", "Kollam", "Avadi", "Kadapa", "Kamarhati", "Bilaspur",
      "Shahjahanpur", "Satara", "Bijapur", "Rampur", "Shivamogga",
      "Chandrapur", "Junagadh", "Thrissur", "Alwar", "Bardhaman",
      "Kulti", "Kakinada", "Nizamabad", "Parbhani", "Tumkur",
      "Hisar", "Ozhukarai", "Bihar Sharif", "Panipat", "Darbhanga",
      "Bally", "Aizawl", "Dewas", "Ichalkaranji", "Tirupati",
      "Karnal", "Bathinda", "Rampur", "Shivpuri", "Ratlam",
      "Uluberia", "Murwara", "Sambalpur", "Singrauli", "Unnao",
      "Hugli-Chinsurah", "Raichur", "Vellore", "Alappuzha",
      "Khandwa", "Yamunanagar", "Bidar", "Saugor", "Raurkela",
      "Hapur", "Panvel", "Bharatpur", "Haldia", "Habra",
      "Barasat", "Kharagpur", "Malkajgiri", "Adoni", "Tenali",
      "Chittoor", "Bhind", "Bhusawal", "Raebareli", "Khammam",
      "Bhiwani", "Nagaon", "Udaipur", "Hazaribagh", "Bhimavaram",
      "Kumbakonam", "Botad", "Sikar", "Hardwar", "Dabgram",
      "Morena", "Siwan", "Bettiah", "Fatehpur", "Rae Bareli",
      "Khurja", "Vejalpur", "Gondiya", "Sikar", "Bharuch",
      "Hajipur", "Sasaram", "Dharmavaram", "Bilaspur", "Batala",
      "Mandi", "Hoshiarpur", "Etawah", "Saharsa", "Chhapra",
      "Karnal", "Bathinda", "Rampur", "Shivpuri", "Ratlam",
      "Uluberia", "Murwara", "Sambalpur", "Singrauli", "Unnao",
      "Hugli-Chinsurah", "Raichur", "Vellore", "Alappuzha",
      "Khandwa", "Yamunanagar", "Bidar", "Saugor", "Raurkela",
      "Hapur", "Panvel", "Bharatpur", "Haldia", "Habra",
      "Barasat", "Kharagpur", "Malkajgiri", "Adoni", "Tenali",
      "Chittoor", "Bhind", "Bhusawal", "Raebareli", "Khammam",
      "Bhiwani", "Nagaon", "Udaipur", "Hazaribagh", "Bhimavaram",
      "Kumbakonam", "Botad", "Sikar", "Hardwar", "Dabgram",
      "Morena", "Siwan", "Bettiah", "Fatehpur", "Rae Bareli",
      "Khurja", "Vejalpur", "Gondiya", "Sikar", "Bharuch",
      "Hajipur", "Sasaram", "Dharmavaram", "Bilaspur", "Batala",
      "Mandi", "Hoshiarpur", "Etawah", "Saharsa", "Chhapra"
    ];
    
    // Combine existing cities with popular cities and remove duplicates
    const allCitiesCombined = Array.from(new Set([...cities, ...popularCities])).sort();
    
    setAllCities(allCitiesCombined);
    setAllSublocalities(sublocalities);
    setAllPropertyTypes(propertyTypes);
  }, [allProperties]);

  // Update filtering logic to use new search components
  useEffect(() => {
    if (allProperties.length === 0) {
      setFilteredProperties([]);
      return;
    }
    
    let results = allProperties;

    // Search by property name
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      results = results.filter((property) => {
        return property.title?.toLowerCase().includes(searchLower);
      });
    }

    // Filter by enquiredFor (Rent/Investment) - similar to latestpropertytype page
    if (enquiredForFilter) {
      results = results.filter((property) => {
        // Check based on forSale/forRent
        if (enquiredForFilter === "Rent") {
          return property.forRent === true;
        } else if (enquiredForFilter === "Sale") {
          return property.forSale === true;
        }
        
        return false;
      });
    }

    // Filter by search type (Rent/Investment/Research) - keep this for backward compatibility
    if (selectedType && !enquiredForFilter) {
      const typeLower = selectedType.toLowerCase().trim();
      
      // Filter by property type based on search type
      if (typeLower === "rent") {
        results = results.filter((property) => property.forRent);
      } else if (typeLower === "investment") {
        results = results.filter((property) => property.forSale);
      } else if (typeLower === "research") {
        // For research, show both sale and rent properties
        results = results.filter((property) => property.forSale || property.forRent);
      }
    }

    // Filter by cities
    if (selectedCities.length > 0) {
      results = results.filter((property) => {
        return selectedCities.includes(property.address?.city || "");
      });
    }

    // Filter by sub-locations
    if (selectedSubLocations.length > 0) {
      results = results.filter((property) => {
        return selectedSubLocations.includes(property.address?.subLocality || "");
      });
    }

    // Filter by property type
    if (selectedPropertyTypes.length > 0) {
      results = results.filter((property) => {
        return selectedPropertyTypes.some(propertyType => 
          property.propertyType?.displayName === propertyType ||
          property.propertyType?.childType?.displayName === propertyType
        );
      });
    }

    // Filter by carpet area
    if (selectedCarpetArea || minCarpetArea || maxCarpetArea) {
      results = results.filter((property) => {
        const carpetArea = Number(property.dimension?.carpetArea) || 0;
        
        // Handle predefined ranges
        if (selectedCarpetArea) {
          switch (selectedCarpetArea) {
            case "Under 500 sqft":
              return carpetArea < 500;
            case "500 - 1000 sqft":
              return carpetArea >= 500 && carpetArea < 1000;
            case "1000 - 1500 sqft":
              return carpetArea >= 1000 && carpetArea < 1500;
            case "1500 - 2000 sqft":
              return carpetArea >= 1500 && carpetArea < 2000;
            case "2000 - 3000 sqft":
              return carpetArea >= 2000 && carpetArea < 3000;
            case "3000 - 5000 sqft":
              return carpetArea >= 3000 && carpetArea < 5000;
            case "Over 5000 sqft":
              return carpetArea >= 5000;
            default:
              return true;
          }
        }
        
        // Handle custom min/max range
        if (minCarpetArea || maxCarpetArea) {
          const minArea = minCarpetArea ? Number(minCarpetArea) : 0;
          const maxArea = maxCarpetArea ? Number(maxCarpetArea) : Infinity;
          
          if (minCarpetArea && maxCarpetArea) {
            return carpetArea >= minArea && carpetArea <= maxArea;
          } else if (minCarpetArea) {
            return carpetArea >= minArea;
          } else if (maxCarpetArea) {
            return carpetArea <= maxArea;
          }
        }
        
        return true;
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
    
    // Show contact form if no properties found and user has selected specific filters
    if (results.length === 0 && (selectedCities.length > 0 || selectedSubLocations.length > 0 || selectedPropertyTypes.length > 0 || selectedCarpetArea || minCarpetArea || maxCarpetArea || searchTerm)) {
      setShowContactForm(true);
      // Pre-fill the form with selected filters
      setContactFormData(prev => ({
        ...prev,
        location: selectedCities.join(", ") || "",
        propertyType: selectedPropertyTypes.join(", ") || "",
        requirement: `${selectedCities.length > 0 ? `Cities: ${selectedCities.join(", ")}` : ""}${selectedSubLocations.length > 0 ? `, Sub-locations: ${selectedSubLocations.join(", ")}` : ""}${selectedPropertyTypes.length > 0 ? `, Property Types: ${selectedPropertyTypes.join(", ")}` : ""}${selectedCarpetArea ? `, Area: ${selectedCarpetArea}` : ""}${(minCarpetArea || maxCarpetArea) && !selectedCarpetArea ? `, Area: ${minCarpetArea || '0'} - ${maxCarpetArea || '∞'} sqft` : ""}${searchTerm ? `, Search: ${searchTerm}` : ""}`.trim()
      }));
    } else {
      setShowContactForm(false);
    }
  }, [searchTerm, filters, allProperties, selectedLocations, selectedCities, selectedSubLocations, selectedPropertyTypes, selectedCarpetArea, minCarpetArea, maxCarpetArea, selectedType, enquiredForFilter]);

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
    setSelectedCities([]);
    setSelectedSubLocations([]);
    setSelectedPropertyTypes([]);
    setSelectedCarpetArea("");
    setMinCarpetArea("");
    setMaxCarpetArea("");
    setShowCityDropdown(false);
    setShowSubLocationDropdown(false);
    setShowPropertyTypeDropdown(false);
    setShowCarpetAreaDropdown(false);
    setShowContactForm(false);
    setSelectedType("");
    setEnquiredForFilter("");
    setFilters({
      propertyType: "",
      priceRange: "",
      areaRange: "",
      condition: "",
      transactionType: "",
    });
  };

  // Handle contact form submission
  const handleContactFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send the form data to your backend
    // For now, we'll just show an alert
    alert("Thank you for your interest! Our team will contact you soon.");
    
    // Reset form
    setContactFormData({
      name: "",
      email: "",
      phone: "",
      propertyType: "",
      transactionType: "",
      inquiry: ""
    });
    setShowContactForm(false);
  };

  // Handle contact form input changes
  const handleContactFormChange = (field: string, value: string) => {
    setContactFormData(prev => ({
      ...prev,
      [field]: value
    }));
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



  return (
    <>
      <PageWithSeo page="properties">
        <div className={raleway.className}>
          <section className="relative h-[40vh] w-full ">
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={contactimg}
                alt="Modern Interior"
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
                  {/* Multi-Component Search */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                    {/* Search Input */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search by property name..."
                        className="w-full text-black text-sm p-3 pl-10 rounded-lg border border-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoComplete="off"
                      />
                      <svg
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black"
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
                    </div>

                    {/* City Dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        className="w-full text-left text-black text-sm p-3 cursor-pointer pr-10 rounded-lg border border-black focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        onClick={() => {
                          setShowCityDropdown(!showCityDropdown);
                          setShowSubLocationDropdown(false);
                          setShowPropertyTypeDropdown(false);
                          setShowCarpetAreaDropdown(false);
                        }}
                      >
                        {selectedCities.length > 0 ? `${selectedCities.length} cities selected` : "Select Cities"}
                      </button>
                      <svg
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      {showCityDropdown && (
                        <div className="search-dropdown absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                          {/* Search Input */}
                          <div className="sticky top-0 cursor-pointer bg-white border-b border-gray-200 p-2">
                            <input
                              type="text"
                              placeholder="Search cities..."
                              value={citySearchTerm}
                              onChange={(e) => setCitySearchTerm(e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          
                          {/* Clear All Option */}
                          {selectedCities.length > 0 && (
                            <div
                              className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm text-red-600 border-b border-gray-100 font-medium"
                              onClick={() => {
                                setSelectedCities([]);
                                setSelectedSubLocations([]);
                                setCitySearchTerm("");
                              }}
                            >
                              Clear All Cities
                            </div>
                          )}
                          {/* Priority Cities Section */}
                          {getFilteredCities().filter(city => 
                            ["Mumbai", "New Mumbai", "Thane", "Pune", "Pimpri-Chinchwad", "Bangalore", "Chennai", "Hyderabad", "Kolkata", "Delhi"].includes(city)
                          ).length > 0 && (
                            <>
                              {/* <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-100">
                                Popular Cities
                              </div> */}
                              {getFilteredCities()
                                .filter(city => 
                                  ["Mumbai", "New Mumbai", "Thane", "Pune", "Pimpri-Chinchwad", "Bangalore", "Chennai", "Hyderabad", "Kolkata", "Delhi"].includes(city)
                                )
                                .map((city) => (
                                  <div
                                    key={city}
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm text-black flex items-center"
                                    onClick={() => {
                                      const isSelected = selectedCities.includes(city);
                                      if (isSelected) {
                                        setSelectedCities(selectedCities.filter(c => c !== city));
                                      } else {
                                        setSelectedCities([...selectedCities, city]);
                                      }
                                      setSelectedSubLocations([]);
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedCities.includes(city)}
                                      onChange={() => {}} // Handled by parent div onClick
                                      className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    {city}
                                  </div>
                                ))}
                            </>
                          )}
                          
                          {/* Other Cities Section */}
                          {getFilteredCities().filter(city => 
                            !["Mumbai", "New Mumbai", "Thane", "Pune", "Pimpri-Chinchwad", "Bangalore", "Chennai", "Hyderabad", "Kolkata", "Delhi"].includes(city)
                          ).length > 0 && (
                            <>
                              {/* <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-100">
                                All Cities
                              </div> */}
                              {getFilteredCities()
                                .filter(city => 
                                  !["Mumbai", "New Mumbai", "Thane", "Pune", "Pimpri-Chinchwad", "Bangalore", "Chennai", "Hyderabad", "Kolkata", "Delhi"].includes(city)
                                )
                                .map((city) => (
                                  <div
                                    key={city}
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm text-black flex items-center"
                                    onClick={() => {
                                      const isSelected = selectedCities.includes(city);
                                      if (isSelected) {
                                        setSelectedCities(selectedCities.filter(c => c !== city));
                                      } else {
                                        setSelectedCities([...selectedCities, city]);
                                      }
                                      setSelectedSubLocations([]);
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedCities.includes(city)}
                                      onChange={() => {}} // Handled by parent div onClick
                                      className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    {city}
                                  </div>
                                ))}
                            </>
                          )}
                          
                          {/* No results message */}
                          {getFilteredCities().length === 0 && (
                            <div className="px-4 py-2 text-sm text-gray-500">
                              No cities found
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Sub-Location Dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        className="w-full text-left cursor-pointer text-black text-sm p-3 pr-10 rounded-lg border border-black focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                        disabled={selectedCities.length === 0}
                        onClick={() => {
                          setShowSubLocationDropdown(!showSubLocationDropdown);
                          setShowCityDropdown(false);
                          setShowPropertyTypeDropdown(false);
                          setShowCarpetAreaDropdown(false);
                        }}
                      >
                        {selectedSubLocations.length > 0 ? `${selectedSubLocations.length} sub-locations selected` : (selectedCities.length > 0 ? "Select Sub-Location" : "Select Cities First")}
                      </button>
                      <svg
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      {showSubLocationDropdown && selectedCities.length > 0 && (
                        <div className="search-dropdown absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                          {/* Search Input */}
                          <div className="sticky top-0 bg-white border-b border-gray-200 p-2">
                            <input
                              type="text"
                              placeholder="Search sub-locations..."
                              value={subLocationSearchTerm}
                              onChange={(e) => setSubLocationSearchTerm(e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          
                          {/* Clear All Option */}
                          {selectedSubLocations.length > 0 && (
                            <div
                              className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm text-red-600 border-b border-gray-100 font-medium"
                              onClick={() => {
                                setSelectedSubLocations([]);
                                setSubLocationSearchTerm("");
                              }}
                            >
                              Clear All Sub-Locations
                            </div>
                          )}
                          
                          {/* Filtered Sub-Locations */}
                          {getFilteredSubLocations().map((subLocation) => (
                            <div
                              key={subLocation}
                              className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm text-black flex items-center"
                              onClick={() => {
                                const isSelected = selectedSubLocations.includes(subLocation);
                                if (isSelected) {
                                  setSelectedSubLocations(selectedSubLocations.filter(sl => sl !== subLocation));
                                } else {
                                  setSelectedSubLocations([...selectedSubLocations, subLocation]);
                                }
                                setSubLocationSearchTerm("");
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={selectedSubLocations.includes(subLocation)}
                                onChange={() => {}} // Handled by parent div onClick
                                className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              {subLocation}
                            </div>
                          ))}
                          
                          {/* No results message */}
                          {getFilteredSubLocations().length === 0 && (
                            <div className="px-4 py-2 text-sm text-gray-500">
                              No sub-locations found
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Property Type Dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        className="w-full text-left cursor-pointer text-black text-sm p-3 pr-10 rounded-lg border border-black focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        onClick={() => {
                          setShowPropertyTypeDropdown(!showPropertyTypeDropdown);
                          setShowCityDropdown(false);
                          setShowSubLocationDropdown(false);
                          setShowCarpetAreaDropdown(false);
                        }}
                      >
                        {selectedPropertyTypes.length > 0 
                          ? selectedPropertyTypes.length === 1 
                            ? selectedPropertyTypes[0]
                            : `${selectedPropertyTypes.length} Property Types Selected`
                          : "Select Property Type"}
                      </button>
                      <svg
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      {showPropertyTypeDropdown && (
                        <div className="search-dropdown absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                          <div
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm text-black flex items-center"
                            onClick={() => {
                              setSelectedPropertyTypes([]);
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={selectedPropertyTypes.length === 0}
                              onChange={() => setSelectedPropertyTypes([])}
                              className="mr-2"
                            />
                            All Property Types
                          </div>
                          {getAllPropertyTypes().map((propertyType, index) => (
                            <label
                              key={`${propertyType}-${index}`}
                              className="px-4 py-2 hover:bg-gray-100 text-sm text-black flex items-center cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={selectedPropertyTypes.includes(propertyType)}
                                onChange={() => {
                                  console.log('Checkbox onChange - Current selectedPropertyTypes:', selectedPropertyTypes);
                                  console.log('Checkbox onChange - propertyType:', propertyType);
                                  if (selectedPropertyTypes.includes(propertyType)) {
                                    setSelectedPropertyTypes(prev => prev.filter(type => type !== propertyType));
                                  } else {
                                    setSelectedPropertyTypes(prev => {
                                      // Use Set to ensure no duplicates
                                      const newSet = new Set([...prev, propertyType]);
                                      const newArray = Array.from(newSet);
                                      console.log('Checkbox onChange - New array:', newArray);
                                      return newArray;
                                    });
                                  }
                                }}
                                className="mr-2"
                              />
                              {propertyType}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Carpet Area Dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        className="w-full text-left cursor-pointer text-black text-sm p-3 pr-10 rounded-lg border border-black focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        onClick={() => {
                          setShowCarpetAreaDropdown(!showCarpetAreaDropdown);
                          setShowCityDropdown(false);
                          setShowSubLocationDropdown(false);
                          setShowPropertyTypeDropdown(false);
                        }}
                      >
                        {selectedCarpetArea || (minCarpetArea || maxCarpetArea ? `${minCarpetArea || '0'} - ${maxCarpetArea || '∞'} sqft` : "Select Carpet Area")}
                      </button>
                      <svg
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      {showCarpetAreaDropdown && (
                        <div className="search-dropdown absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                          <div
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm text-black"
                            onClick={() => {
                              setSelectedCarpetArea("");
                              setMinCarpetArea("");
                              setMaxCarpetArea("");
                              setShowCarpetAreaDropdown(false);
                            }}
                          >
                            All Areas
                          </div>
                          
                          {/* Min/Max Input Fields */}
                          <div className="px-4 py-3 border-t border-gray-100">
                            <div className="text-xs font-medium text-gray-600 mb-2">Custom Range (sqft)</div>
                            <div className="flex gap-2">
                              <input
                                type="number"
                                placeholder="Min"
                                value={minCarpetArea}
                                onChange={(e) => setMinCarpetArea(e.target.value)}
                                className="w-20 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                min="0"
                              />
                              <input
                                type="number"
                                placeholder="Max"
                                value={maxCarpetArea}
                                onChange={(e) => setMaxCarpetArea(e.target.value)}
                                className="w-20 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                min="0"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                if (minCarpetArea || maxCarpetArea) {
                                  setSelectedCarpetArea("");
                                  setShowCarpetAreaDropdown(false);
                                }
                              }}
                              className="mt-2 px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              disabled={!minCarpetArea && !maxCarpetArea}
                            >
                              Apply Range
                            </button>
                          </div>
                          
                          <div className="px-4 py-2 text-xs font-medium text-gray-600 border-t border-gray-100">Predefined Ranges</div>
                          {carpetAreaOptions.map((area) => (
                            <div
                              key={area}
                              className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm text-black"
                              onClick={() => {
                                setSelectedCarpetArea(area);
                                setMinCarpetArea("");
                                setMaxCarpetArea("");
                                setShowCarpetAreaDropdown(false);
                              }}
                            >
                              {area}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Selected Filters Display */}
                  {(selectedCities.length > 0 || selectedSubLocations.length > 0 || selectedPropertyTypes.length > 0 || selectedCarpetArea || minCarpetArea || maxCarpetArea) && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedCities.map((city) => (
                        <div key={city} className="bg-black text-white px-3 py-1 rounded-full flex items-center text-xs font-medium">
                          City: {city}
                          <button
                            type="button"
                            className="ml-1 text-white hover:text-gray-200 focus:outline-none"
                            onClick={() => {
                              setSelectedCities(selectedCities.filter(c => c !== city));
                              setSelectedSubLocations([]);
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      {selectedSubLocations.map((subLocation) => (
                        <div key={subLocation} className="bg-black text-white px-3 py-1 rounded-full flex items-center text-xs font-medium">
                          Sub-Location: {subLocation}
                          <button
                            type="button"
                            className="ml-1 text-white hover:text-gray-200 focus:outline-none"
                            onClick={() => setSelectedSubLocations(selectedSubLocations.filter(sl => sl !== subLocation))}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      {selectedPropertyTypes.map((propertyType, index) => (
                        <div key={`filter-${propertyType}-${index}`} className="bg-black text-white px-3 py-1 rounded-full flex items-center text-xs font-medium">
                          Type: {propertyType}
                          <button
                            type="button"
                            className="ml-1 text-white hover:text-gray-200 focus:outline-none"
                            onClick={() => setSelectedPropertyTypes(prev => prev.filter(type => type !== propertyType))}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      {selectedCarpetArea && (
                        <div className="bg-black text-white px-3 py-1 rounded-full flex items-center text-xs font-medium">
                          Area: {selectedCarpetArea}
                          <button
                            type="button"
                            className="ml-1 text-white hover:text-gray-200 focus:outline-none"
                            onClick={() => setSelectedCarpetArea("")}
                          >
                            ×
                          </button>
                        </div>
                      )}
                      {(minCarpetArea || maxCarpetArea) && !selectedCarpetArea && (
                        <div className="bg-black text-white px-3 py-1 rounded-full flex items-center text-xs font-medium">
                          Area: {minCarpetArea || '0'} - {maxCarpetArea || '∞'} sqft
                          <button
                            type="button"
                            className="ml-1 text-white hover:text-gray-200 focus:outline-none"
                            onClick={() => {
                              setMinCarpetArea("");
                              setMaxCarpetArea("");
                            }}
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* <div className="text-sm text-gray-600 mb-4 text-center sm:text-left">
                    Showing {filteredProperties.length} of {properties.length} properties
                  </div> */}
                </div>

                {/* Contact Form for Rare Requirements */}
                {showContactForm && (
                  <div className="mb-8 px-4 sm:px-0">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-dashed border-blue-300 rounded-xl p-6 text-center">
                      <div className="mb-4">
                        <div className="text-4xl mb-2">🤔</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          Oooops! Seems like your requirement is rare/specific
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Don't worry! We love unique requirements. Let's connect you with our expert team who will work closely to find exactly what you're looking for.
                        </p>
                      </div>
                      
                      <form onSubmit={handleContactFormSubmit} className="max-w-2xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                            <input
                              type="text"
                              required
                              value={contactFormData.name}
                              onChange={(e) => handleContactFormChange("name", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Your full name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                            <input
                              type="email"
                              required
                              value={contactFormData.email}
                              onChange={(e) => handleContactFormChange("email", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="your.email@example.com"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                            <input
                              type="tel"
                              required
                              value={contactFormData.phone}
                              onChange={(e) => handleContactFormChange("phone", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Your phone number"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                            <select
                              value={contactFormData.propertyType}
                              onChange={(e) => handleContactFormChange("propertyType", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">Select Property Type</option>
                              <option value="Commercial">Commercial</option>
                              <option value="Office Space">Office Space</option>
                              <option value="Shop">Shop</option>
                              <option value="Warehouse">Warehouse</option>
                              <option value="Industrial">Industrial</option>
                              <option value="Retail">Retail</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
                            <select
                              value={contactFormData.transactionType}
                              onChange={(e) => handleContactFormChange("transactionType", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">Select Transaction Type</option>
                              <option value="Buy">Buy</option>
                              <option value="Rent">Rent</option>
                              <option value="Sell">Sell</option>
                            
                            </select>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Inquiry</label>
                          <textarea
                            value={contactFormData.inquiry}
                            onChange={(e) => handleContactFormChange("inquiry", e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Tell us about your inquiry or specific requirements..."
                          />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
                          >
                            Submit Requirement
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowContactForm(false)}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors duration-200"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Property Cards */}
                
                {loading ? (
                  // Loading state - show skeleton cards
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {[...Array(8)].map((_, index) => (
                      <div
                        key={index}
                        className="w-full max-w-full sm:max-w-[340px] bg-[#F1F1F4] rounded-lg overflow-hidden border border-gray-200 mx-auto flex flex-col animate-pulse"
                      >
                        {/* Header skeleton */}
                        <div className="p-2 sm:p-3 flex justify-between items-center">
                          <div className="h-14 w-full">
                            <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
                            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                          </div>
                          <div className="w-5 h-5 bg-gray-300 rounded"></div>
                        </div>

                        {/* Image skeleton */}
                        <div className="relative h-[140px] sm:h-[180px] bg-gray-300">
                          <div className="absolute bottom-0 left-0 right-0 bg-gray-400 p-2">
                            <div className="h-3 bg-gray-300 rounded w-1/3 mb-1"></div>
                            <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                          </div>
                        </div>

                        {/* Details skeleton */}
                        <div className="p-2 sm:p-3 flex-grow">
                          <div className="grid grid-cols-2 gap-1 text-xs mb-3">
                            <div className="h-3 bg-gray-300 rounded w-16"></div>
                            <div className="h-3 bg-gray-300 rounded w-20 ml-auto"></div>
                            <div className="h-3 bg-gray-300 rounded w-20"></div>
                            <div className="h-3 bg-gray-300 rounded w-16 ml-auto"></div>
                            <div className="h-3 bg-gray-300 rounded w-16"></div>
                            <div className="h-3 bg-gray-300 rounded w-16 ml-auto"></div>
                            <div className="h-3 bg-gray-300 rounded w-20"></div>
                            <div className="h-3 bg-gray-300 rounded w-16 ml-auto"></div>
                          </div>
                          
                          <div className="border-t border-gray-200 my-2"></div>
                          
                          <div className="flex justify-between items-center mt-1">
                            <div>
                              <div className="h-4 bg-gray-300 rounded w-24 mb-1"></div>
                              <div className="h-3 bg-gray-300 rounded w-20"></div>
                            </div>
                            <div className="flex space-x-1">
                              <div className="w-8 h-8 bg-gray-300 rounded"></div>
                              <div className="w-8 h-8 bg-gray-300 rounded"></div>
                              <div className="w-8 h-8 bg-gray-300 rounded"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredProperties.length === 0 ? (
                  // No properties found state - show empty state
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🏠</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No properties found</h3>
                    <p className="text-gray-600 mb-4">Try adjusting your search criteria or browse all available properties.</p>
                    <button
                      onClick={resetFilters}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div>
                     <div className="flex gap-4 mb-4">
                {bookmarkedProperties.size > 0 && (
                  <button
                    className="block bg-black cursor-pointer text-white px-4 py-2 mb-4 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors uppercase tracking-wider"
                    onClick={handleCompareClick} 
                  >
                    Compare Properties ({bookmarkedProperties.size})
                  </button>
                 
                )}
                                {bookmarkedProperties.size > 0 && (
                  <button
                    className="block bg-black cursor-pointer text-white px-4 py-2 mb-4 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors uppercase tracking-wider"
                    onClick={() => {
                      const selectedPropertyLinks = Array.from(bookmarkedProperties).map(propertyId => {
                        const property = properties.find(p => p.id === propertyId);
                        if (property) {
                          const baseUrl = window.location.origin;
                          return `${baseUrl}/property-details/${property.title}`;
                        }
                        return null;
                      }).filter(Boolean).join('\n');
                      
                      const message = `I want to inquire about these properties:\n\n${selectedPropertyLinks}`;
                      const whatsappUrl = `https://wa.me/918384848485?text=${encodeURIComponent(message)}`;
                      window.open(whatsappUrl, '_blank');
                    }}
                  >
                    Inquire this ({bookmarkedProperties.size}) properties
                  </button>
                )}
                </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {filteredProperties.map((property, index) => (
                      <div
                        key={`${property.id}-${index}`}
                        className="w-full max-w-full sm:max-w-[340px] bg-[#F1F1F4] rounded-lg overflow-hidden border border-gray-200 mx-auto flex flex-col transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-2xl hover:shadow-gray-400/20 hover:-translate-y-2 hover:border-gray-300 animate-fade-in-up"
                        style={{ animationDelay: `${index * 150}ms` }}
                      >
                        {/* Header with title and checkbox */}
                        <div className="p-2 sm:p-3 flex justify-between items-center transition-all duration-300 hover:bg-gray-50/50">
                          <Link href={`/property-details/${property.title}`} className="block">
                            <div className="h-14">
                              <h3 className="font-medium text-black text-sm sm:text-base transition-all duration-300 hover:text-gray-800">
                                {isLoggedIn ? (property.title || "Prime Business Hub") : "Property Details"}
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
                              src={getPropertyImage(property)}
                              alt={isLoggedIn ? (property.title || "Property") : "Property Details"}
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
                                {property.propertyType?.childType?.displayName ||
                                  "Office space"}
                              </span>
                            </div>
                          </div>
                        </Link>
                        {/* Property Details */}
                        <div className="p-2 sm:p-3 flex-grow font-monotransition-all duration-300 hover:bg-gray-50/30">
                          <Link href={`/property-details/${property.title}`} className="block">
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
                               {/* Share button */}
                        <div className="relative">
                          {/* <button
                            className="p-1.5 rounded cursor-pointer flex items-center justify-center transition-all duration-300 hover:bg-blue-200 hover:scale-110 hover:shadow-md active:scale-95"
                            onClick={() => setOpenShareIndex(openShareIndex === index ? null : index)}
                            aria-label="Share"
                            type="button"
                          >
                           
                          </button> */}
                                         {isLoggedIn && (
                  <button
                    type="button"
                    className="p-1.5 rounded cursor-pointer flex items-center justify-center transition-all duration-300 hover:bg-blue-200 hover:scale-110 hover:shadow-md active:scale-95"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: property.title,
                          text: `Check out this property: ${property.title}`,
                          url: `https://realtraspaces.com/property-details/${property.title}`,
                        });
                      } else {
                        alert("Share not supported on this browser.");
                      }
                    }}
                    title="Share"
                  >
                    <Image
                      src={share}
                      alt="Share"
                      width={20}
                      height={20}
                      className="object-contain transition-all duration-300 hover:scale-110"
                    />
                  </button>
                )}
                        </div>
                              {/* WhatsApp button */}
                              <a
                                href={`https://wa.me/7039311539?text=${encodeURIComponent(isLoggedIn ? (property.title || 'Check out this property!') : 'Check out this property!')}%20${encodeURIComponent(`${window.location.origin}/property-details/${encodeURIComponent(property.title || '')}`)}`}
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
                              <Link href="/contact">
                          <button
                            className="p-1.5 rounded flex items-center cursor-pointer justify-center transition-all duration-300 hover:bg-purple-200 hover:scale-110 hover:shadow-md active:scale-95"
                            aria-label="Inquire"
                            title="Inquire about this property"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-5 h-5 text-purple-600"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                              />
                            </svg>
                          </button>
                        </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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