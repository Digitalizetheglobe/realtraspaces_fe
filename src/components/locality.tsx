"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Define types for property and address
interface Address {
  city?: string;
  subLocality?: string;
}

interface Property {
  address?: Address;
  enquiredFor?: string;
}

// Type for locations state
interface LocationsMap {
  [city: string]: string[];
}

const PropertyLocations = () => {
  const router = useRouter();
  const [locations, setLocations] = useState<LocationsMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCities, setExpandedCities] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [allProperties, setAllProperties] = useState<Property[]>([]);

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          'https://prd-lrb-webapi.leadrat.com/api/v1/property/anonymous?PageNumber=1&PageSize=100',
          {
            method: 'GET',
            headers: {
              'accept': 'application/json',
              'tenant': 'realtraspaces',
            },
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Handle different response structures
        const propertiesArray = Array.isArray(data) 
          ? data 
          : data.items || data.data || [];
        
        setAllProperties(propertiesArray);
        
        // Process the data to group by city and subLocality based on active filter
        const locationMap: { [city: string]: Set<string> } = {};
        
        if (propertiesArray && propertiesArray.length > 0) {
          propertiesArray.forEach((property: Property) => {
            if (property.address) {
              const city = property.address.city;
              const subLocality = property.address.subLocality;
              
              if (city && subLocality) {
                if (!locationMap[city]) {
                  locationMap[city] = new Set<string>();
                }
                locationMap[city].add(subLocality);
              }
            }
          });
        }
        
        // Convert Sets to Arrays for easier rendering
        const processedLocations: LocationsMap = {};
        Object.keys(locationMap).forEach((city: string) => {
          processedLocations[city] = Array.from(locationMap[city]);
        });
        
        setLocations(processedLocations);
      } catch (err) {
        console.error('Error fetching property data:', err);
        let message = 'Failed to fetch data';
        if (err instanceof Error) {
          message = err.message;
        }
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-50 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading locations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Function to handle expanding/collapsing cities
  const toggleCityExpansion = (city: string) => {
    setExpandedCities(prev => {
      const newSet = new Set(prev);
      if (newSet.has(city)) {
        newSet.delete(city);
      } else {
        newSet.add(city);
      }
      return newSet;
    });
  };

  // Function to filter properties based on enquiredFor
  const filterProperties = (filterType: string) => {
    setActiveFilter(filterType);
    
    const locationMap: { [city: string]: Set<string> } = {};
    
    allProperties.forEach((property: Property) => {
      if (property.address) {
        const city = property.address.city;
        const subLocality = property.address.subLocality;
        
        // Apply filter based on enquiredFor
        let shouldInclude = true;
        if (filterType === "rent" && property.enquiredFor !== "Rent") {
          shouldInclude = false;
        } else if (filterType === "investment" && property.enquiredFor !== "Sale") {
          shouldInclude = false;
        }
        // For "all" filter, include all properties
        
        if (shouldInclude && city && subLocality) {
          if (!locationMap[city]) {
            locationMap[city] = new Set<string>();
          }
          locationMap[city].add(subLocality);
        }
      }
    });
    
    // Convert Sets to Arrays for easier rendering
    const processedLocations: LocationsMap = {};
    Object.keys(locationMap).forEach((city: string) => {
      processedLocations[city] = Array.from(locationMap[city]);
    });
    
    setLocations(processedLocations);
  };

  // Function to navigate to properties page with search parameters
  const handleSubLocationClick = (subLocality: string, city: string) => {
    // Navigate to properties page with clean URL
    router.push('/properties');
    
    // Store search parameters in sessionStorage for the properties page to read
    sessionStorage.setItem('searchCity', city);
    sessionStorage.setItem('searchSubLocation', subLocality);
  };

  return (
    <div className="bg-gray-50">
      {/* Header Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 py-4">
            <div 
              className={`text-sm font-medium cursor-pointer transition-colors ${
                activeFilter === "all" 
                  ? "text-gray-900" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => filterProperties("all")}
            >
              All Properties 
            </div>
            <div 
              className={`text-sm font-medium cursor-pointer transition-colors ${
                activeFilter === "rent" 
                  ? "text-gray-900" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => filterProperties("rent")}
            >
              Property for Rent
            </div>
            <div 
              className={`text-sm font-medium cursor-pointer transition-colors ${
                activeFilter === "investment" 
                  ? "text-gray-900" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => filterProperties("investment")}
            >
              Property for Investment
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {Object.keys(locations).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No locations found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-8">
            {Object.entries(locations).map(([city, subLocalities]) => {
              const isExpanded = expandedCities.has(city);
              const displaySubLocalities = isExpanded 
                ? subLocalities 
                : subLocalities.slice(0, 10);
              const hasMore = subLocalities.length > 10;
              
              return (
                <div key={city} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                    Property for {activeFilter === "rent" ? "Rent" : "Sale"} in {city}
                  </h2>
                  <div className="space-y-2">
                                         {displaySubLocalities.map((subLocality: string, index: number) => (
                       <div key={index}>
                         <button 
                           onClick={() => handleSubLocationClick(subLocality, city)}
                           className="text-gray-600 cursor-pointer hover:text-gray-900 text-sm hover:underline block transition-colors text-left w-full"
                         >
                            Property for {activeFilter === "rent" ? "Rent" : "Sale"} in {subLocality}
                         </button>
                       </div>
                     ))}
                    {hasMore && (
                      <button
                        onClick={() => toggleCityExpansion(city)}
                        className="text-gray-600 hover:text-gray-900 text-sm font-medium hover:underline transition-colors mt-2"
                      >
                        {isExpanded ? 'See Less' : `See More (${subLocalities.length - 10} more)`}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyLocations;