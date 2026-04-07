"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import latestpropertytype from "../../../public/assets/images/latestpropertytype.svg";
import sqft from "../../../public/assets/images/sqft.png";
import homeimproment from "../../../public/assets/images/home-improvement1.png";
import parking from "../../../public/assets/images/parking.png";
import bath from "../../../public/assets/images/bath.png";
import pin from "../../../public/assets/images/marker-pin-01.png";
import bookmark from "../../../public/assets/images/bookmark.png";
import WhyrealtraSpaces from "../whyrealtraSpaces/page";
import { Raleway } from "next/font/google";

// Load Raleway font
const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
  Location: string;
  City: string;
  ImageUrl: string;
  RefNumber: string;
  FloorNumber: string;
  NoOfParking: string;
  [key: string]: unknown;
};

// ── Fallback data (shown when API fails) ─────────────────────────────────────
const FALLBACK_DATA: RawProperty[] = [
  { Id: "1", Title: "Commercial Office Space for Rent in Andheri East", PropertyTypeText: "Commercial Office/Space", WantToText: "Rent", PropertyName: "Arena House", BuildingName: "Arena House", Price: "1762500", PriceText: "17.63 Lac", SaleArea: "23800", SaleAreaText: "23800 Sq.Ft.", CarpetArea: "14100", CarpetAreaText: "14100 Sq.Ft.", Furnishing: "Fully Furnished", Possession: "Immediately", Location: "Andheri (East)", City: "Mumbai", ImageUrl: "", RefNumber: "REF001", FloorNumber: "3", NoOfParking: "12" },
  { Id: "2", Title: "Commercial Office Space for Rent in BKC", PropertyTypeText: "Commercial Office/Space", WantToText: "Rent", PropertyName: "Ackruti Star", BuildingName: "Ackruti Star", Price: "2200000", PriceText: "22.00 Lac", SaleArea: "23900", SaleAreaText: "23900 Sq.Ft.", CarpetArea: "13800", CarpetAreaText: "13800 Sq.Ft.", Furnishing: "Fully Furnished", Possession: "Immediately", Location: "BKC", City: "Mumbai", ImageUrl: "", RefNumber: "REF002", FloorNumber: "7", NoOfParking: "23" },
  { Id: "3", Title: "Commercial Office Space in Andheri East", PropertyTypeText: "Commercial Office/Space", WantToText: "Sale", PropertyName: "Nand Ghanshyam", BuildingName: "Nand Ghanshyam", Price: "200000", PriceText: "2.00 Lac", SaleArea: "2000", SaleAreaText: "2000 Sq.Ft.", CarpetArea: "", CarpetAreaText: "", Furnishing: "Fully Furnished", Possession: "Immediately", Location: "Andheri (East)", City: "Mumbai", ImageUrl: "", RefNumber: "REF003", FloorNumber: "1", NoOfParking: "" },
  { Id: "4", Title: "Premium Office Space for Lease in Powai", PropertyTypeText: "Commercial Office/Space", WantToText: "Rent", PropertyName: "Hiranandani Gardens", BuildingName: "Hiranandani Gardens", Price: "1500000", PriceText: "15.00 Lac", SaleArea: "18000", SaleAreaText: "18000 Sq.Ft.", CarpetArea: "12000", CarpetAreaText: "12000 Sq.Ft.", Furnishing: "Semi Furnished", Possession: "Immediately", Location: "Powai", City: "Mumbai", ImageUrl: "", RefNumber: "REF004", FloorNumber: "5", NoOfParking: "8" },
];

const API_URL = 'https://connector.b2bbricks.com/api/Property/getrecentproperties';
const TOKEN   = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6InJhaHVsc29uYXJAY3JlZGVmaW5lLmNvbSIsIm5iZiI6MTc3NTEyMTM0MSwiZXhwIjoxOTMyODg3NzQxLCJpYXQiOjE3NzUxMjEzNDEsImlzcyI6Imh0dHBzOi8vY29ubmVjdG9yLmIyYmJyaWNrcy5jb20iLCJhdWQiOiJodHRwczovL2Nvbm5lY3Rvci5iMmJicmlja3MuY29tIn0.sgFhfl2X3DhaDckUkVqLQ1pAkSsRFUuRJT8eTwekVZs';


const FeaturedProperties = () => {
  const [properties, setProperties] = useState<RawProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check authentication status
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoggedIn(!!localStorage.getItem("authToken"));
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(API_URL, { headers: { Authorization: `Bearer ${TOKEN}` } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const items: RawProperty[] = Array.isArray(data) ? data : data.data || data.items || [];
        if (!items.length) throw new Error("empty");
        setProperties(items.slice(8, 14));
      } catch {
        console.warn("[B2BBricks] Live API unreachable — using local snapshot.");
        setProperties(FALLBACK_DATA);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleItems(prev => new Set(prev).add(index));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    const propertyElements = document.querySelectorAll('.property-card');
    propertyElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [properties]);

  if (loading) {
    return (
      <section
        className={`${raleway.className} py-12 px-4 sm:px-6 lg:px-8 bg-gray-50`}
      >
        <div className="max-w-5xl mx-auto">
          <p>Loading properties...</p>
        </div>
      </section>
    );
  }

  const formatPrice = (p: RawProperty): string => {
    if (p.PriceText) return `₹ ${p.PriceText}`;
    const val = parseFloat(String(p.Price || 0).replace(/[^0-9.]/g, "")) || 0;
    if (!val) return "Price on Request";
    if (p.WantToText === "Rent") return `₹ ${val.toLocaleString()} /month`;
    if (val >= 10000000) return `₹ ${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹ ${(val / 100000).toFixed(2)} Lac`;
    return `₹ ${val.toLocaleString()}`;
  };

  const createSlug = (title?: string): string => {
    if (!title) return "property";
    return title.replace(/\s+/g, "-").toLowerCase();
  };


  return (
    <>
      <style jsx global>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-left {
          animation: slideInLeft 0.8s ease-out forwards;
        }

        .animate-slide-right {
          animation: slideInRight 0.8s ease-out forwards;
        }

        .animate-fade-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .property-card {
          opacity: 0;
          transform: translateX(-100px);
          transition: all 0.3s ease;
        }

        .property-card.visible-left {
          animation: slideInLeft 0.8s ease-out forwards;
        }

        .property-card.visible-right {
          animation: slideInRight 0.8s ease-out forwards;
        }

        .property-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .property-image {
          transition: transform 0.3s ease;
        }

        .property-card:hover .property-image {
          transform: scale(1.05);
        }

        .property-tags span {
          transition: all 0.3s ease;
        }

        .property-card:hover .property-tags span {
          transform: translateY(-2px);
        }

        .property-details > div {
          transition: transform 0.3s ease;
        }

        .property-card:hover .property-details > div {
          transform: translateY(-2px);
        }

        .bookmark-btn {
          transition: transform 0.3s ease;
        }

        .property-card:hover .bookmark-btn {
          transform: rotate(10deg) scale(1.1);
        }

        .details-btn {
          transition: all 0.3s ease;
        }

        .details-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }

        .header-animate {
          opacity: 0;
          transform: translateY(30px);
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>

      <section
        className={`${raleway.className} py-12 px-4 sm:px-6 lg:px-8 bg-gray-50`}
      >
        <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="mb-6 max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-black header-animate">
              Explore Commercial Properties
            </h2>
          </div>

          <div className="space-y-6 max-w-5xl mx-auto">
            {properties.map((property, index) => (
              <div
                key={property.Id}
                className={`property-card bg-white rounded-lg shadow-sm overflow-hidden ${visibleItems.has(index)
                  ? (index % 2 === 0 ? 'visible-left' : 'visible-right')
                  : ''
                  }`}
                data-index={index}
              >
                <div
                  className={`flex flex-col sm:flex-row ${index % 2 !== 0 ? "sm:flex-row-reverse" : ""
                    }`}
                >
                  {/* Image */}
                  <div className="w-full sm:w-1/3 p-2 overflow-hidden flex items-center justify-center">
                    {property.ImageUrl ? (
                      <img
                        src={property.ImageUrl}
                        alt={property.Title || "Property"}
                        className="property-image w-full h-56 object-cover rounded-2xl p-2"
                      />
                    ) : (
                      <Image
                        alt="Property"
                        src={latestpropertytype}
                        className="property-image  w-full h-56 object-cover rounded-2xl p-2"
                      />
                    )}
                  </div>

                  <div className="bg-gray-400 border-r border"></div>

                  {/* Content */}
                  <div className="w-full sm:w-2/3 p-4 px-8">
                    {/* Property Tag */}
                    <div className="property-tags mb-3">
                      <span className="bg-[#6E6E73] text-white px-3 py-1 rounded-full text-sm">
                        {property.PropertyTypeText || "Office Space"}
                      </span>
                      <span className="ml-2 bg-[#6E6E73] text-white px-3 py-1 rounded-full text-sm">
                        {property.WantToText || "For Sale/Rent"}
                      </span>
                    </div>

                    {/* Title and Price */}
                    <h3 className="font-semibold text-xl text-gray-900 transition-colors duration-300">
                      {isLoggedIn ? (property.Title || property.BuildingName || "Property") : "Property Details"}
                    </h3>
                    <h4 className="text-base text-gray-500 font-mono mb-4 transition-colors duration-300">
                      {formatPrice(property)}
                    </h4>

                    {/* Property Details */}
                    <div className="property-details flex font-mono  flex-wrap space-x-4 md:space-x-12 border-t border-b border-gray-200 py-3 mb-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <Image src={sqft} alt="Area" width={20} height={20} />
                        <div className="flex flex-col">
                          <span className="text-md text-gray-600">Area</span>
                          <span className="text-sm font-medium text-gray-500">
                            {property.SaleAreaText || property.CarpetAreaText || "N/A"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mb-2">
                        <Image src={bath} alt="Bath" width={20} height={20} />
                        <div className="flex flex-col">
                          <span className="text-md text-gray-600">Status</span>
                          <span className="text-sm font-medium text-gray-500">
                            {property.Furnishing || "N/A"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mb-2">
                        <Image
                          src={homeimproment}
                          alt="Status"
                          width={20}
                          height={20}
                        />
                        <div className="flex flex-col">
                          <span className="text-md text-gray-600">
                            Availability
                          </span>
                          <span className="text-sm font-medium text-gray-500">
                            {property.Possession || "Ready to Move"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mb-2">
                        <Image
                          src={parking}
                          alt="Parking"
                          width={20}
                          height={20}
                        />
                        <div className="flex flex-col">
                          <span className="text-md text-gray-600">
                            Property ID
                          </span>
                          <span className="text-sm font-medium text-gray-500">
                            {property.RefNumber || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Location and Actions */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-1">
                        <Image
                          src={pin}
                          alt="Location"
                          width={20}
                          height={20}
                        />
                        <span className="text-md text-gray-700">
                          {[property.Location, property.City].filter(Boolean).join(", ") || "Location N/A"}
                        </span>
                      </div>

                      <div className="flex items-center cursor-pointer space-x-3">
                        <button className="bookmark-btn p-1 cursor-pointer">
                          <Image
                            src={bookmark}
                            alt="Bookmark"
                            width={30}
                            height={30}
                          />
                        </button>
                        <Link
                          href={`/property-details/${createSlug(property.Title)}`}
                          className="details-btn bg-black text-white px-5 py-1 text-md rounded cursor-pointer hover:bg-gray-800 transition-colors"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WhyrealtraSpaces />
    </>
  );
};

export default FeaturedProperties;