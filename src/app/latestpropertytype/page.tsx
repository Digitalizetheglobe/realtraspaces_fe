"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from 'framer-motion';
import { Raleway } from "next/font/google";
import { X, User, Mail, Phone, MessageSquare, Send } from "lucide-react";
import { toast } from "react-hot-toast";
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

// ── Raw shape from B2BBricks API (PascalCase) ───────────────────────────────
type RawProperty = {
  Id: string;
  Title: string;
  PropertyTypeText: string;
  WantToText: string;
  PropertyName: string;
  BuildingName: string;
  Price: string;
  PriceText: string;
  SaleArea: string;
  SaleAreaText: string;
  CarpetArea: string;
  CarpetAreaText: string;
  Furnishing: string;
  Possession: string;
  FloorNumber: string;
  TotalFloor: string;
  NoOfParking: string;
  Location: string;
  City: string;
  Landmark: string;
  ImageUrl: string;
  Url: string;
  RefNumber: string;
  Description: string;
  IsFeatured: boolean;
  EmployeeName: string;
  EmployeeMobile: string;
  [key: string]: unknown;
};

// ── Fallback data ─────────────────────────────────────────────────────────────────────────────
const FALLBACK_DATA: RawProperty[] = [{"Id":"05a753a8-66d7-4a69-ac45-0341564e8fc3","RefNumber":"JP040426-151256-1550","Title":"Commercial Office/Space for Rent in Andheri (East), Mumbai Bandra - Dahisar","Description":"","CreateDate":"2:54 PM","PropertyType":"11","PropertyTypeText":"Commercial Office/Space","PropertyGroup":null,"WantTo":"3","WantToText":"Rent","PropertyTypeArea":"2","PropertyName":"Arena House","TotalRoom":"","MasterBedRoom":null,"ChildBedRoom":"","GuestRoom":"","OtherRoom":"","EnsuiteBathRoom":"","CommonBathRoom":"","TotalBathRoom":"","Furnishing":"Fully Furnished","Flooring":"Tiles","FloorNumber":"3","TotalLift":"1","TotalFloor":"5","SaleArea":"23800.00","SaleAreaText":"23800 Sq.Ft.","SaleAreaUnit":"1","BuiltArea":"","BuiltAreaText":"","BuiltAreaUnit":"1","CarpetArea":"14100.00","CarpetAreaText":"14100 Sq.Ft.","CarpetAreaUnit":"1","TerraceArea":"","TerraceAreaText":"","TerraceAreaUnit":"1","MaxArea":null,"MaxAreaUnit":null,"MinArea":null,"MinAreaUnit":null,"PlotSize":null,"PlotSizeUnit":null,"DepositePrice":null,"Price":"1762500","PriceText":"17.63 Lac","Rate":"74.05","NegotiableAmount":null,"IsNegotiable":true,"Transaction":"Resale","PropertyAge":"","Ownership":"Lease Hold","SocietyName":null,"Possession":"Immediately","Facing":"","Obligation":"","LocationId":"10","Location":"Andheri (East)","City":"Mumbai Bandra - Dahisar","State":null,"PinCode":"","LastUpdated":"07-Apr-2026 2:54 PM","Url":"","Latitude":19.1195,"Longitude":72.8712,"EmployeeName":"Administrator","EmployeeMobile":"9769971110","EmployeeEmail":"rahulsonar@credefine.com","WebsiteKeyword":"Furnished office for Lease at Andheri East","BuildingName":"Arena House","FlatNumber":null,"Landmark":"Marol MIDC Industrial Estate","StreetName":null,"OtherAmenities":"","NoOfParking":"12","TotalRecords":3,"IsFeatured":false,"Suitable":"Corporate Office","Unique":"Easy Public transport, 24/7 Water Supply","ImageUrl":""},{"Id":"7869e6af-fd4e-4b39-bbab-885fd8cb841b","RefNumber":"JP060426-163733-2467","Title":"Commercial Office/Space for Rent in Andheri (East), Mumbai Bandra - Dahisar","Description":"","CreateDate":"2:53 PM","PropertyType":"11","PropertyTypeText":"Commercial Office/Space","PropertyGroup":null,"WantTo":"3","WantToText":"Rent","PropertyTypeArea":"2","PropertyName":"Ackruti Star","TotalRoom":"","MasterBedRoom":null,"ChildBedRoom":"","GuestRoom":"","OtherRoom":"","EnsuiteBathRoom":"","CommonBathRoom":"","TotalBathRoom":"","Furnishing":"Fully Furnished","Flooring":"","FloorNumber":"7","TotalLift":"","TotalFloor":"","SaleArea":"23900.00","SaleAreaText":"23900 Sq.Ft.","SaleAreaUnit":"1","BuiltArea":"","BuiltAreaText":"","BuiltAreaUnit":"1","CarpetArea":"13800.00","CarpetAreaText":"13800 Sq.Ft.","CarpetAreaUnit":"1","TerraceArea":"","TerraceAreaText":"","TerraceAreaUnit":"1","MaxArea":null,"MaxAreaUnit":null,"MinArea":null,"MinAreaUnit":null,"PlotSize":null,"PlotSizeUnit":null,"DepositePrice":null,"Price":"2200000","PriceText":"22.00 Lac","Rate":"92.05","NegotiableAmount":null,"IsNegotiable":true,"Transaction":"Resale","PropertyAge":"","Ownership":"Free Hold","SocietyName":null,"Possession":"Immediately","Facing":"","Obligation":"","LocationId":"10","Location":"Andheri (East)","City":"Mumbai Bandra - Dahisar","State":null,"PinCode":"","LastUpdated":"07-Apr-2026 2:53 PM","Url":"","Latitude":19.1185,"Longitude":72.8703,"EmployeeName":"Administrator","EmployeeMobile":"9769971110","EmployeeEmail":"rahulsonar@credefine.com","WebsiteKeyword":"Furnished office for Lease at Andheri East","BuildingName":"Ackruti Star","FlatNumber":null,"Landmark":"MIDC Central Road","StreetName":null,"OtherAmenities":"","NoOfParking":"23","TotalRecords":3,"IsFeatured":false,"Suitable":"Corporate Office","Unique":"Good No. of Reserved Parking, Easy Public transport, 24/7 Water Supply","ImageUrl":""},{"Id":"dda2f29d-6a83-42ce-a3e2-c03d72f53b19","RefNumber":"JP070426-140527-1285","Title":"Commercial Office/Space for Rent in Andheri (East), Mumbai Bandra - Dahisar","Description":"","CreateDate":"2:52 PM","PropertyType":"11","PropertyTypeText":"Commercial Office/Space","PropertyGroup":null,"WantTo":"3","WantToText":"Rent","PropertyTypeArea":"2","PropertyName":"Nand Ghanshyam","TotalRoom":"","MasterBedRoom":null,"ChildBedRoom":"","GuestRoom":"","OtherRoom":"","EnsuiteBathRoom":"","CommonBathRoom":"","TotalBathRoom":"","Furnishing":"Fully Furnished","Flooring":"","FloorNumber":"1","TotalLift":"","TotalFloor":"","SaleArea":"2000.00","SaleAreaText":"2000 Sq.Ft.","SaleAreaUnit":"1","BuiltArea":"","BuiltAreaText":"","BuiltAreaUnit":"1","CarpetArea":"","CarpetAreaText":"","CarpetAreaUnit":"1","TerraceArea":"","TerraceAreaText":"","TerraceAreaUnit":"1","MaxArea":null,"MaxAreaUnit":null,"MinArea":null,"MinAreaUnit":null,"PlotSize":null,"PlotSizeUnit":null,"DepositePrice":null,"Price":"200000","PriceText":"2.00 Lac","Rate":"100.00","NegotiableAmount":null,"IsNegotiable":true,"Transaction":"Resale","PropertyAge":"","Ownership":"Free Hold","SocietyName":null,"Possession":"","Facing":"","Obligation":"","LocationId":"10","Location":"Andheri (East)","City":"Mumbai Bandra - Dahisar","State":null,"PinCode":"","LastUpdated":"07-Apr-2026 2:52 PM","Url":"","Latitude":19.1234,"Longitude":72.862,"EmployeeName":"Administrator","EmployeeMobile":"9769971110","EmployeeEmail":"rahulsonar@credefine.com","WebsiteKeyword":"Furnished office for Lease at Andheri East","BuildingName":"Nand Ghanshyam","FlatNumber":null,"Landmark":"Opp Sun pharma building","StreetName":null,"OtherAmenities":"","NoOfParking":"","TotalRecords":3,"IsFeatured":false,"Suitable":"Corporate Office","Unique":"Easy Public transport, Earthquake resistance, 24/7 Water Supply","ImageUrl":""}];

const API_URL = '/api/b2b/properties';
const TOKEN   = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6InJhaHVsc29uYXJAY3JlZGVmaW5lLmNvbSIsIm5iZiI6MTc3NTEyMTM0MSwiZXhwIjoxOTMyODg3NzQxLCJpYXQiOjE3NzUxMjEzNDEsImlzcyI6Imh0dHBzOi8vY29ubmVjdG9yLmIyYmJyaWNrcy5jb20iLCJhdWQiOiJodHRwczovL2Nvbm5lY3Rvci5iMmJicmlja3MuY29tIn0.sgFhfl2X3DhaDckUkVqLQ1pAkSsRFUuRJT8eTwekVZs';

export default function PropertyCards() {
  const router = useRouter();
  const [properties, setProperties] = useState<RawProperty[]>([]);
  const [allProperties, setAllProperties] = useState<RawProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]); // NEW
  const [showPopup, setShowPopup] = useState(false);
  const [popupDismissed, setPopupDismissed] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone_number: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [openShareIndex, setOpenShareIndex] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");
  const [enquiredForFilter, setEnquiredForFilter] = useState<string>("");
  const [bookmarkedProperties, setBookmarkedProperties] = useState<Set<string>>(new Set());
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  // Add these new states at the top of the component
  const [allCities, setAllCities] = useState<string[]>([]);
  const [allSublocalities, setAllSublocalities] = useState<{ [city: string]: Set<string> }>({});
  const [allPropertyTypes, setAllPropertyTypes] = useState<string[]>([]);
  const [allUniversal, setAllUniversal] = useState<string[]>([]); // for universal search
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionType, setSuggestionType] = useState<string>(""); // city, sublocality, type, universal
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set()); // Track failed image URLs
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set()); // Track loading image URLs
  const [showSearchBar, setShowSearchBar] = useState(false); // Control search bar visibility
  const [showHeading, setShowHeading] = useState(true); // Control heading visibility
  const [initialDelayComplete, setInitialDelayComplete] = useState(false); // Track initial 5-second delay

  // Check authentication status
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoggedIn(!!localStorage.getItem("authToken"));
    }
  }, []);

  // Initial delay effect - hide heading after 5 seconds, then show search bar
  useEffect(() => {
    const hideHeadingTimer = setTimeout(() => {
      setShowHeading(false);
    }, 4000);

    const showSearchBarTimer = setTimeout(() => {
      setShowSearchBar(true);
      setInitialDelayComplete(true);
    }, 4500); // Show search bar 1 second after heading hides

    return () => {
      clearTimeout(hideHeadingTimer);
      clearTimeout(showSearchBarTimer);
    };
  }, []);

  // Scroll effect - show search bar on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowSearchBar(true);
        setShowHeading(false); // Also hide heading when scrolling
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click-away listener for share dropdown
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
      const selectedProperties = allProperties.filter(prop => bookmarkedProperties.has(prop.Id));
      let addedCount = 0;
      let alreadyInListCount = 0;

      // Add each selected property to comparison
      for (const property of selectedProperties) {
        try {
          const response = await fetch("http://localhost:8000/api/webusers/compare/add", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              propertyId: property.Id,
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
          console.error(`Error adding property ${property.Id}:`, propertyError);
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

  // Fetch properties — same pattern as PropertyListing
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(API_URL, { headers: { Authorization: `Bearer ${TOKEN}` } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const items: RawProperty[] = Array.isArray(data) ? data : data.data || data.items || [];
        if (!items.length) throw new Error("empty");
        const unique = items.filter((p, i, arr) => i === arr.findIndex(q => q.Id === p.Id));
        setProperties(unique);
        setAllProperties(unique);
      } catch {
        console.warn("[B2BBricks] Live API unreachable — using local snapshot.");
        setProperties(FALLBACK_DATA);
        setAllProperties(FALLBACK_DATA);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // After fetching, preprocess unique values for search/filter
  useEffect(() => {
    if (properties.length === 0) return;
    const cities = Array.from(new Set(properties.map(p => p.City).filter((c): c is string => Boolean(c))));
    const sublocalities: { [city: string]: Set<string> } = {};
    properties.forEach(p => {
      if (p.City && p.Location) {
        if (!sublocalities[p.City]) sublocalities[p.City] = new Set();
        sublocalities[p.City].add(p.Location);
      }
    });
    const propertyTypes = Array.from(new Set(allProperties.map(p => p.PropertyTypeText).filter((t): t is string => Boolean(t))));
    const universal = new Set<string>();
    allProperties.forEach(p => {
      if (p.Title) universal.add(p.Title);
      if (p.City) universal.add(p.City);
      if (p.Location) universal.add(p.Location);
      if (p.PropertyTypeText) universal.add(p.PropertyTypeText);
      if (p.PriceText) universal.add(p.PriceText);
      if (p.WantToText) universal.add(p.WantToText);
      if (p.Furnishing) universal.add(p.Furnishing);
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

  // Helper to get property URL
  const getPropertyUrl = (property: RawProperty) => {
    if (!property.Title) return window.location.href;
    return `${window.location.origin}/property-details/${encodeURIComponent(property.Title)}`;
  };

  // Helper to copy link
  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  // Popup close handler
  const handleClosePopup = () => {
    setShowPopup(false);
    setPopupDismissed(true);
    localStorage.setItem('popupDismissedAt', Date.now().toString());
    // Reset form state
    setFormData({
      name: "",
      email: "",
      phone_number: "",
      subject: "",
      message: ""
    });
    setSubmitStatus({ type: null, message: '' });
    setIsSubmitting(false);
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('http://localhost:8000/api/contacts/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you for your message! We will get back to you soon.'
        });
        setFormData({
          name: "",
          email: "",
          phone_number: "",
          subject: "",
          message: ""
        });
        toast.success('Message sent successfully!');
        // Close popup after a short delay to show success message
        setTimeout(() => {
          handleClosePopup();
        }, 2000);
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.message || 'Failed to send message. Please try again.'
        });
        toast.error(result.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Network error. Please check your connection and try again.'
      });
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAttributeValue = (_property: RawProperty, _attributeId: string) => "N/A";

  // Get image from B2BBricks ImageUrl field
  const getPropertyImage = (property: RawProperty): string => {
    if (property.ImageUrl && !failedImages.has(property.ImageUrl)) return property.ImageUrl;
    return defaultPropertyImage.src;
  };

  // Format price using B2BBricks PriceText / Price fields
  const formatPrice = (property: RawProperty) => {
    if (property.PriceText) return `₹ ${property.PriceText}`;
    const val = parseFloat(String(property.Price || 0).replace(/[^0-9.]/g, "")) || 0;
    if (!val) return "Price not available";
    if (val >= 10000000) return `₹ ${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹ ${(val / 100000).toFixed(2)} Lakhs`;
    return `₹ ${val}`;
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

  // Simplified matching for B2BBricks fields — check WantToText
  const propertyMatchesEnquiredFor = (property: RawProperty, filter: string): boolean => {
    return property.WantToText === filter;
  };

  // Filter across B2BBricks fields
  const filteredProperties = allProperties.filter((property) => {
    if (enquiredForFilter && !propertyMatchesEnquiredFor(property, enquiredForFilter)) return false;
    if (selectedType && !enquiredForFilter) {
      const t = selectedType.toLowerCase();
      if (t === "rent" && property.WantToText !== "Rent") return false;
      if (t === "investment" && property.WantToText !== "Sale") return false;
    }
    if (search.trim() || selectedLocations.length > 0) {
      const s = search.toLowerCase();
      const matches = (v?: string) => v?.toLowerCase().includes(s) ?? false;
      const hasSearchMatch = search.trim() ? (
        matches(property.Title) || matches(property.City) || matches(property.Location) ||
        matches(property.PropertyTypeText) || matches(property.WantToText) ||
        matches(property.Furnishing) || matches(property.PriceText)
      ) : true;
      const hasLocationMatch = selectedLocations.length > 0 ? selectedLocations.some(loc => {
        const l = loc.toLowerCase();
        return (
          property.City?.toLowerCase().includes(l) ||
          property.Location?.toLowerCase().includes(l) ||
          property.Title?.toLowerCase().includes(l) ||
          property.PropertyTypeText?.toLowerCase().includes(l)
        );
      }) : true;
      if (!hasSearchMatch || !hasLocationMatch) return false;
    }
    return true;
  });


  // Determine sale/rent label for B2BBricks
  const getPropertyEnquiredFor = (property: RawProperty): string => property.WantToText || "N/A";


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

  // Add suggestion as chip (city, sublocality, type, or universal)
  const handleSuggestionClick = (suggestion: string) => {
    addLocation(suggestion);
    setSearch("");
    setSuggestions([]);
  };

  // if (loading) {
  //   return (
  //     <div className={raleway.className}>
  //       <section className="pb-10 lg:pb-20 bg-gray-100 dark:bg-dark relative overflow-hidden">
  //         <div className="container mx-auto px-4">
  //           <p>Loading properties...</p>
  //         </div>
  //       </section>
  //     </div>
  //   );
  // }

  return (
    <div className={raleway.className}>
      <section className="relative w-full h-[400px] sm:h-[400px] md:h-[400px]">
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

        <div className="absolute pt-10 bottom-4 w-full flex justify-center px-4">
          <div className="max-w-4xl mx-auto w-full mt-10 ">
            {showHeading && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-6  justify-center px-4"
              >
                <h1 className="text-2xl sm:text-2xl md:text-6xl text-white font-bold mb-2 sm:mb-3 leading-tight">
                  <span className="block sm:inline">Realtra Spaces –</span>
                  <span className="block sm:inline text-gray-300 mt-1 sm:mt-0">Redefining Commercial Real Estate</span>
                </h1>

                <p className="text-sm sm:text-lg md:text-xl text-gray-300 mb-6 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
                  Real & Transparent. We make commercial real estate easy, transparent, and growth-focused—so you can focus on building your business while we take care of the space.
                </p>
              </motion.div>
            )}

            {/* Search Bar - Conditionally rendered */}
            {showSearchBar && (
              <div className="py-8 sm:py-20 md:py-40">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex flex-col sm:flex-row w-full sm:w-[90%] md:w-[750px] max-w-[98%] items-stretch sm:items-center gap-3 px-2 sm:px-4 py-3 rounded-2xl border border-gray-300 bg-white/60 backdrop-blur-md shadow-lg overflow-visible relative mx-auto "
                >
                  {/* Suggestions Dropdown - now directly above the search bar */}

                  {/* Dropdown */}
                  <div
                    className="relative w-full sm:w-auto"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <button
                      type="button"
                      className="appearance-none w-full sm:min-w-[200px] bg-black text-white text-sm font-medium pl-3 sm:pl-5 pr-8 sm:pr-10 py-3 rounded-2xl outline-none cursor-pointer flex justify-between items-center"
                      onClick={() => setDropdownOpen(true)}
                    >
                      <span className="truncate text-left">
                        {selectedType
                          ? selectedType === "Rent"
                            ? "Rent"
                            : selectedType === "Investment"
                              ? "Investment"
                              : selectedType === ""
                                ? ""
                                : selectedType
                          : "Select Search Type"}
                      </span>
                      <span className="pointer-events-none absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white text-xs flex-shrink-0">
                        ▼
                      </span>
                    </button>
                    {dropdownOpen && (
                      <div className="absolute left-0 right-0 sm:right-auto sm:min-w-full bg-black text-white rounded-lg shadow-lg z-50" style={{ zIndex: 9999 }}>
                        <div
                          className={`px-3 sm:px-5 py-3 cursor-pointer hover:bg-gray-800 rounded-t-lg ${enquiredForFilter === "Rent" ? "bg-gray-700" : ""}`}
                          onClick={() => {
                            setSelectedType("Rent");
                            setEnquiredForFilter("Rent");
                            setDropdownOpen(false);
                          }}
                        >
                          Rent
                        </div>
                        <div
                          className={`px-3 sm:px-5 py-3 cursor-pointer hover:bg-gray-800 ${enquiredForFilter === "Sale" ? "bg-gray-700" : ""}`}
                          onClick={() => {
                            setSelectedType("Investment");
                            setEnquiredForFilter("Sale");
                            setDropdownOpen(false);
                          }}
                        >
                          Investment
                        </div>
                        <div
                          className={`px-3 sm:px-5 py-3 cursor-pointer hover:bg-gray-800 rounded-b-lg ${selectedType === "" ? "bg-gray-700" : ""}`}
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
                      placeholder="Search property name, location, or type..."
                      className="w-full bg-white text-gray-900 px-3 sm:px-5 py-3 text-sm rounded-2xl outline-none pr-20 sm:pr-44"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyDown={handleInputKeyDown}
                      autoComplete="off"
                    />
                    {/* Chips overlay (right side, inside input) */}
                    <div className="absolute inset-y-0 right-2 sm:right-3 flex items-center space-x-1 sm:space-x-2 pointer-events-none" style={{ zIndex: 10 }}>
                      {selectedLocations.length > 0 && (
                        <div className="flex items-center space-x-1 sm:space-x-2 pointer-events-auto max-w-[60px] sm:max-w-none overflow-hidden">
                          {/* Mobile: Show only first chip + count */}
                          <div className="sm:hidden flex items-center space-x-1">
                            <div className="bg-black text-white px-2 py-1 rounded-full flex items-center text-xs font-medium mr-1 flex-shrink-0">
                              <span className="truncate max-w-[40px]">{selectedLocations[0]}</span>
                              <button
                                type="button"
                                className="ml-1 text-white hover:text-gray-200 focus:outline-none flex-shrink-0"
                                style={{ pointerEvents: 'auto' }}
                                onClick={() => removeLocation(selectedLocations[0])}
                              >
                                <span className="ml-1">×</span>
                              </button>
                            </div>
                            {selectedLocations.length > 1 && (
                              <div className="bg-gray-600 text-white px-2 py-1 rounded-full text-xs font-medium flex-shrink-0">
                                +{selectedLocations.length - 1}
                              </div>
                            )}
                          </div>
                          {/* Desktop: Show all chips */}
                          <div className="hidden sm:flex items-center space-x-2">
                            {selectedLocations.map((loc) => (
                              <div key={loc} className="bg-black text-white px-3 py-1 rounded-full flex items-center text-xs font-medium mr-1 flex-shrink-0">
                                <span className="truncate">{loc}</span>
                                <button
                                  type="button"
                                  className="ml-1 text-white hover:text-gray-200 focus:outline-none flex-shrink-0"
                                  style={{ pointerEvents: 'auto' }}
                                  onClick={() => removeLocation(loc)}
                                >
                                  <span className="ml-1">×</span>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Suggestions dropdown */}
                    {suggestions.length > 0 && (
                      <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto" style={{ zIndex: 9999 }}>
                        {suggestions.map((s, idx) => (
                          <div
                            className="px-3 sm:px-5 py-2 cursor-pointer hover:bg-gray-100 text-sm text-black"
                            onClick={() => handleSuggestionClick(s)}
                            key={s + idx}
                          >
                            {s}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <Link href="/properties">
                    <button
                      type="button"
                      className="bg-black cursor-pointer hover:bg-gray-800 text-white px-2 py-3 rounded-2xl text-sm font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center"
                      onClick={() => {
                        // Store search data in sessionStorage before navigation
                        sessionStorage.setItem('searchData', JSON.stringify({
                          search: search,
                          locations: selectedLocations,
                          type: selectedType,
                          enquiredFor: enquiredForFilter
                        }));
                      }}
                    >
                      <svg
                        className="w-5 h-5 "
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

                    </button>
                  </Link>

                  {/* Clear Filters Button */}
                  {(selectedType || enquiredForFilter || selectedLocations.length > 0 || search.trim()) && (
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
                  )}
                </motion.div>
              </div>
            )}
          </div>
        </div>


      </section>

      {/* INQUIRE NOW Button - Fixed on right side */}
      <div className="fixed right-4 top-1/4 md:right-6 md:top-1/3 transform -translate-y-1/2 z-40">
        <button
          onClick={() => setShowPopup(true)}
          className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 font-bold text-sm uppercase tracking-wider"
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed'
          }}
        >
          INQUIRE NOW
        </button>
      </div>

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
              {/* {(selectedType || enquiredForFilter || selectedLocations.length > 0 || search.trim()) && (
                 <div className="mt-4 text-center">
                   <p className="text-sm text-gray-600">
                     Showing of {allProperties.length} properties (searching across both pages)
                     {selectedType && ` • Type: ${selectedType}`}
                     {enquiredForFilter && ` • Enquired For: ${enquiredForFilter}`}
                     {selectedLocations.length > 0 && ` • Locations: ${selectedLocations.join(", ")}`}
                     {search.trim() && ` • Search: "${search}"`}
                   </p>
                 </div>
               )} */}

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
            {/* Debug Info */}


            {/* Property Cards */}
            {loading ? (
              // Loading state - show 8 skeleton cards
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
              <div></div>
            ) : (
              <div >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-4">
                    {bookmarkedProperties.size > 0 && (
                      <button
                        className="block bg-black cursor-pointer text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors uppercase tracking-wider"
                        onClick={handleCompareClick}
                      >
                        Compare Properties ({bookmarkedProperties.size})
                      </button>

                    )}
                    {bookmarkedProperties.size > 0 && (
                      <button
                        className="block bg-black cursor-pointer text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors uppercase tracking-wider"
                        onClick={() => {
                          const selectedPropertyLinks = Array.from(bookmarkedProperties).map(propertyId => {
                            const property = properties.find(p => p.Id === propertyId);
                            if (property) {
                              const baseUrl = window.location.origin;
                              return `${baseUrl}/property-details/${property.Title}`;
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
                  <Link href="/properties">
                    <button
                      className="bg-black text-white px-4 py-1 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors cursor-pointer tracking-wider"
                      onClick={() => {
                        // Store search data in sessionStorage before navigation
                        sessionStorage.setItem('searchData', JSON.stringify({
                          search: search,
                          locations: selectedLocations,
                          type: selectedType,
                          enquiredFor: enquiredForFilter
                        }));
                      }}
                    >
                      Explore More
                    </button>
                    {/* ({filteredProperties.length})  */}
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">

                  {filteredProperties.slice(0, 8).map((property, index) => (

                    <div
                    key={`${property.Id}-${index}`}
                      className="w-full max-w-full sm:max-w-[340px] bg-[#F1F1F4] rounded-lg overflow-hidden border border-gray-200 mx-auto flex flex-col transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-2xl hover:shadow-gray-400/20 hover:-translate-y-2 hover:border-gray-300 animate-fade-in-up"
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      {/* Header with title and checkbox */}
                      <div className="p-2 sm:p-3 flex justify-between items-center transition-all duration-300 hover:bg-gray-50/50">
                         <Link href={`/property-details/${property.Title}`} key={property.Title} className="block">
                          <div className="h-14">
                            <h3 className="font-medium text-black text-sm sm:text-base transition-all duration-300 hover:text-gray-800">
                              {isLoggedIn ? (property.Title || "Prime Business Hub") : "Property Details"}
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
                              {[property.Location, property.City]
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
                          onClick={() => handleCheckboxClick(property.Id)}
                          className={`w-5 h-5 border rounded flex items-center justify-center cursor-pointer ${bookmarkedProperties.has(property.Id)
                            ? "border-green-500 bg-green-500"
                            : "border-gray-400"
                            }`}
                        >
                          {bookmarkedProperties.has(property.Id) && (
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
                      <Link href={`/property-details/${property.Title}`} key={property.Title} className="block">
                        <div className="relative h-[140px] sm:h-[180px] overflow-hidden group">
                          <Image
                            src={getPropertyImage(property)}
                            alt={isLoggedIn ? (property.Title || "Property") : "Property Details"}
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
                              {enquiredForFilter === "Rent"
                                ? "For Rent"
                                : enquiredForFilter === "Sale"
                                  ? "For Sale"
                                  : `For ${property.WantToText || "Sale/Rent"}`}
                            </span>
                            <span className="mx-1 transition-all duration-300 group-hover:scale-110">•</span>
                            <span className="ml-1 transition-all duration-300 group-hover:font-medium">
                              {
                                property.PropertyTypeText ||
                                "Office space"}
                            </span>
                          </div>
                          {/* </Link> */}
                        </div>
                      </Link>
                      {/* Property Details */}
                      <div className="p-2 sm:p-3 flex-grow font-mono transition-all duration-300 hover:bg-gray-50/30">
                         <Link href={`/property-details/${property.Title}`} key={property.Title} className="block">
                          <div className="grid grid-cols-2 gap-1 text-xs">
                            <div className="text-gray-500 transition-all font-mono duration-300 hover:text-gray-600">Built up Area</div>
                            <div className="text-right text-black transition-all duration-300 hover:font-medium hover:text-gray-800">
                              {property.SaleAreaText || property.SaleArea || "5490"} sqft
                            </div>

                            <div className="text-gray-500 transition-all duration-300 hover:text-gray-600">Carpet Area</div>
                            <div className="text-right text-black transition-all duration-300 hover:font-medium hover:text-gray-800">
                              {property.CarpetAreaText || property.CarpetArea || "N/A"}
                            </div>

                            <div className="text-gray-500 transition-all duration-300 hover:text-gray-600">Parking</div>
                            <div className="text-right text-black transition-all duration-300 hover:font-medium hover:text-gray-800">
                              {property.NoOfParking || "N/A"}
                            </div>

                            <div className="text-gray-500 transition-all duration-300 hover:text-gray-600">Furnishing</div>
                            <div className="text-right text-black transition-all duration-300 hover:font-medium hover:text-gray-800">
                              {property.Furnishing || "N/A"}
                            </div>
                          </div>
                        </Link>
                        <div className="border-t border-gray-200 my-2 transition-all duration-300 hover:border-gray-300"></div>

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-1 gap-2 sm:gap-0">
                         <Link href={`/property-details/${property.Title}`} key={property.Title} className="block">
                            <div className="transition-all duration-300 hover:scale-105">
                              <div className="text-base text-black font-mono font-semibold transition-all duration-300 hover:text-gray-800">
                                {formatPrice(property)}
                              </div>
                              <div className="text-gray-500 text-xs transition-all duration-300 hover:text-gray-600">
                                {property.WantToText === "Rent" ? "rent/month" : ""}
                              </div>
                            </div>
                          </Link>
                          <div className="flex space-x-1 relative">

                            <button
                              className="p-1.5 rounded flex items-center cursor-pointer justify-center transition-all duration-300 hover:bg-red-200 hover:scale-110 hover:shadow-md active:scale-95"
                              aria-label="View on Map"
                              onClick={() => {
                                const address = [
                                  property.Location,
                                  property.City
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
                            {/* Share button - only show if user is logged in */}
                            {isLoggedIn && (
                              <div className="relative">
                                <button
                                  type="button"
                                  className="p-1.5 rounded cursor-pointer flex items-center justify-center transition-all duration-300 hover:bg-blue-200 hover:scale-110 hover:shadow-md active:scale-95"
                                  onClick={() => {
                                    if (navigator.share) {
                                      navigator.share({
                                        title: property.Title,
                                        text: `Check out this property: ${property.Title}`,
                                        url: `https://realtraspaces.com/property-details/${property.Title}`,
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
                              </div>
                            )}
                            {/* WhatsApp button */}
                            <a
                              href={`https://wa.me/7039311539?text=${encodeURIComponent(isLoggedIn ? (property.Title || 'Check out this property!') : 'Check out this property!')}%20${encodeURIComponent(getPropertyUrl(property))}`}
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
                            {/* Inquiry button */}
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

      {/* Share Modal - moved outside cards for proper positioning */}
      {openShareIndex !== null && properties[openShareIndex] && (
        <ShareModal
          open={true}
          onClose={() => setOpenShareIndex(null)}
          property={properties[openShareIndex]}
          getPropertyUrl={getPropertyUrl}
        />
      )}

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-60 flex items-center justify-center z-50 py-4 px-2 backdrop-blur-sm">
          <div className="bg-white  rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] transform transition-all duration-300 scale-100 opacity-100">
            {/* Header with gradient background */}
            <div className="bg-black text-white px-6 py-4 rounded-t-2xl">
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
            <div className="px-6 py-4 space-y-4 bg-[#F1F1F4]">
              {/* Name and Email Row */}
              <div className="flex gap-4">
                {/* Name Field */}
                <div className="flex-1 space-y-2">
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
                <div className="flex-1 space-y-2">
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
              </div>

              {/* Phone and Subject Row */}
              <div className="flex gap-4">
                {/* Phone Field */}
                <div className="flex-1 space-y-2">
                  <label htmlFor="phone_number" className="block text-sm font-semibold text-black">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
                    <input
                      type="tel"
                      id="phone_number"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Allow only numbers and restrict to 10 digits
                        if (/^\d{0,10}$/.test(value)) {
                          handleInputChange(e);
                        }
                      }}
                      required
                      maxLength={10}
                      className="w-full pl-10 pr-4 py-3 border border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 bg-white text-black"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                {/* Subject Field */}
                <div className="flex-1 space-y-2">
                  <label htmlFor="subject" className="block text-sm font-semibold text-black">
                    Subject *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-4 pr-4 py-3 border border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 bg-white text-black"
                      placeholder="Enter subject"
                    />
                  </div>
                </div>
              </div>

              {/* Message Field */}
              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-semibold text-black">
                  Message *
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 text-black w-5 h-5" />
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={2}
                    className="w-full pl-10 pr-4 py-3 border border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 bg-white text-black resize-none"
                    placeholder="Enter your message"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="text-black space-y-1">
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

              {/* Status Messages */}
              {submitStatus.type && (
                <div className={`p-3 rounded-lg ${submitStatus.type === 'success'
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                  {submitStatus.message}
                </div>
              )}


              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`flex-1 py-3 px-6 rounded-xl cursor-pointer transition-all duration-200 font-semibold shadow-lg transform flex items-center justify-center gap-2 ${isSubmitting
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-black text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:scale-[1.02]'
                    }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 cursor-pointer border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 cursor-pointer" />
                      Send Message
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleClosePopup}
                  className="flex-1 bg-white cursor-pointer text-black border border-black  py-3 px-6 rounded-xl hover:bg-[#F1F1F4] transition-all duration-200 font-semibold  hover:border-gray-400"
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
