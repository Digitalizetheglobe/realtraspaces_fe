"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building, Trash2, Heart, ArrowRight, MapPin, Star, Ruler, Bed } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { 
  User, Home, Search, LogOut, GitCompare, 
} from 'lucide-react';

type Property = {
  id: string;
  propertyId: string;
  propertyData: {
    id: string;
    title: string;
    address: {
      subLocality: string;
      city: string;
      state: string;
    };
    dimension: {
      area: number;
      unit: string;
    };
    monetaryInfo: {
      expectedPrice: number;
      currency: string;
    };
    propertyType: {
      childType: {
        displayName: string;
      };
    };
    attributes: Array<{
      attributeName: string;
      value: string;
    }>;
    imageUrls: {
      main?: string;
    };
    noOfBHK?: number;
    furnishStatus?: string;
    createdAt: string;
  };
  savedAt: string;
};

const SavedProperties = () => {
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const router = useRouter();

  const fetchSavedProperties = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/signin");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/webusers/saved-properties?page=${page}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch saved properties");
      }

      const data = await response.json();
      const properties = data.data || [];
      
      setSavedProperties(prev => page === 1 ? properties : [...prev, ...properties]);
      setHasMore(data.pagination?.total > page * 10);
    } catch (error) {
      console.error("Error fetching saved properties:", error);
      toast.error("Failed to load saved properties");
    } finally {
      setLoading(false);
    }
  };

  const removeSavedProperty = async (propertyId: string) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/signin");
      return;
    }

    try {
      setIsRemoving(propertyId);
      const response = await fetch(
        `http://localhost:8000/api/webusers/saved-properties/${propertyId}`,
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

      setSavedProperties(prev => prev.filter(prop => prop.propertyId !== propertyId));
      toast.success("Property removed from saved list");
    } catch (error) {
      console.error("Error removing property:", error);
      toast.error("Failed to remove property");
    } finally {
      setIsRemoving(null);
    }
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  useEffect(() => {
    fetchSavedProperties();
  }, [page]);

  if (loading && savedProperties.length === 0) {
    return (
      <div 
        className="flex justify-center items-center h-64"
        style={{ 
          backgroundColor: '#F1F1F4',
          fontFamily: 'Raleway, sans-serif'
        }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex"
      style={{ 
        backgroundColor: '#F1F1F4',
        fontFamily: 'Raleway, sans-serif'
      }}
    >
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg hidden md:block">
        <div className="p-6 border-b border-[#E5E5E7]">
          <div className="flex items-center space-x-3">
            <Building className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold">Realtraspace</span>
          </div>
        </div>
        
        <nav className="p-4 space-y-2">
          <button
            onClick={() => router.push('/compareproperties')}
            className="cursor-pointer w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-[#F1F1F4] transition-colors"
          >
            <Home className="h-5 w-5" />
            <span className="text-black">Compare Properties</span>
          </button>
          
          <button
            onClick={() => router.push('/properties')}
            className="cursor-pointer w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-[#F1F1F4] transition-colors"
          >
            <Search className="h-5 w-5" />
            <span className="text-black">Explore More</span>
          </button>
          
          <button
            onClick={() => router.push('/profile-page')}
            className="cursor-pointer w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-[#F1F1F4] transition-colors"
          >
            <User className="h-5 w-5" />
            <span className="text-black">Profile</span>
          </button>
          
          <button
            onClick={() => router.push('/saved-properties')}
            className="cursor-pointer w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-600"
          >
            <Heart className="h-5 w-5" />
            <span className="text-black">Saved Properties</span>
          </button>
          
          <button
            onClick={() => {
              localStorage.removeItem('authToken');
              router.push('/login');
            }}
            className="cursor-pointer w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 mt-8"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold" style={{ color: '#1A1A1A' }}>Saved Properties</h2>
              <p className="text-[#6E6E73] mt-2">Your curated collection of favorite properties</p>
            </div>
            <div className="flex items-center space-x-2 text-sm" style={{ color: '#6E6E73' }}>
              <span>{savedProperties.length} {savedProperties.length === 1 ? 'Property' : 'Properties'}</span>
            </div>
          </div>

          {savedProperties.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-medium" style={{ color: '#1A1A1A' }}>
                No saved properties yet
              </h3>
              <p className="text-[#6E6E73] mt-2 mb-6">
                Save properties you're interested in to view them here
              </p>
              <button
                onClick={() => router.push("/properties")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Browse Properties
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedProperties.map((property) => (
                  <div
                    key={property.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-[#E5E5E7]"
                  >
                    <div className="relative h-60">
                      <Image
                        src={property.propertyData.imageUrls?.main || "/assets/hero.jpg"}
                        alt={property.propertyData.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSavedProperty(property.propertyId);
                        }}
                        disabled={isRemoving === property.propertyId}
                        className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition-colors"
                        title="Remove from saved"
                      >
                        {isRemoving === property.propertyId ? (
                          <div className="h-5 w-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 className="h-5 w-5 text-red-500" />
                        )}
                      </button>
                      <div className="absolute bottom-4 left-4 flex items-center bg-white/90 px-3 py-1 rounded-full">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="text-sm font-medium">Saved</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-lg" style={{ color: '#1A1A1A' }}>
                          {property.propertyData.title}
                        </h3>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {property.propertyData.propertyType?.childType?.displayName || 'Property'}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-[#6E6E73] mb-4">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">
                          {property.propertyData.address?.subLocality}, {property.propertyData.address?.city}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="flex items-center">
                          <Ruler className="h-4 w-4 mr-1 text-[#6E6E73]" />
                          <span className="text-sm">
                            {property.propertyData.dimension?.area} {property.propertyData.dimension?.unit}
                          </span>
                        </div>
                        {property.propertyData.noOfBHK && (
                          <div className="flex items-center">
                            <Bed className="h-4 w-4 mr-1 text-[#6E6E73]" />
                            <span className="text-sm">{property.propertyData.noOfBHK} BHK</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <span className="text-sm capitalize">
                            {property.propertyData.furnishStatus?.toLowerCase() || 'Unspecified'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-4 border-t border-[#E5E5E7]">
                        <div>
                          <span className="text-xs" style={{ color: '#6E6E73' }}>Price</span>
                          <p className="font-bold text-blue-600">
                            {property.propertyData.monetaryInfo?.currency === 'INR' ? '₹' : ''}
                            {property.propertyData.monetaryInfo?.expectedPrice?.toLocaleString() || 'Price on request'}
                          </p>
                        </div>
                        <Link
                          href={`/property/${property.propertyId}`}
                          className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View Details <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="px-6 py-3 border border-[#E5E5E7] rounded-lg font-medium hover:bg-[#F1F1F4] transition-colors disabled:opacity-50"
                    style={{ color: '#6E6E73' }}
                  >
                    {loading ? "Loading..." : "Load More Properties"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedProperties;