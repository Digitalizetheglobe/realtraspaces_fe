"use client";
import { useState, useEffect} from 'react';
import Image from 'next/image';

interface PropertyType {
  id: string;
  baseId: string | null;
  level: number;
  type: string;
  displayName: string;
  childType: PropertyType | null;
}

interface MonetaryInfo {
  id: string;
  expectedPrice: number;
  isNegotiable: boolean;
  currency: string;
  monthlyRentAmount: number;
}

interface Dimension {
  area: number;
  unit: string;
}

interface Address {
  subLocality: string;
  city: string;
  state: string;
}

interface Property {
  id: string;
  propertyType: PropertyType;
  title: string;
  saleType: string;
  status: string;
  monetaryInfo: MonetaryInfo;
  dimension: Dimension;
  address: Address;
  notes: string;
  possessionDate: string;
  serialNo: string;
  imageUrls: Record<string, string>;
}

const PropertyListing = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(
          'https://prd-lrb-webapi.leadrat.com/api/v1/property/anonymous?PageNumber=1&PageSize=20',
          {
            headers: {
              accept: 'application/json',
              tenant: 'realtraspaces',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }

        const data = await response.json();
        setProperties(data.items);
        setFilteredProperties(data.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    const filtered = properties.filter(
      (property) =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.subLocality.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.serialNo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProperties(filtered);
  }, [searchTerm, properties]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="container bg-white mx-auto px-4 py-8 mt-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Property Listings</h1>
        
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by title, location, or serial number..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredProperties.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">No properties found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you are looking for.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-full px-4 md:w-1/2 lg:w-1/3 mb-8">
                {Object.keys(property.imageUrls).length > 0 ? (
                  <Image
                    src={property.imageUrls[Object.keys(property.imageUrls)[0]]}
                    alt={property.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <svg
                    className="h-16 w-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">{property.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {property.address.subLocality}, {property.address.city}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {property.serialNo}
                  </span>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-500">Price</span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(property.monetaryInfo.expectedPrice)}
                      {property.monetaryInfo.isNegotiable && (
                        <span className="ml-1 text-sm font-normal text-gray-500">(Negotiable)</span>
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-500">Area</span>
                    <span className="text-sm text-gray-900">
                      {property.dimension.area} {property.dimension.unit}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-500">Type</span>
                    <span className="text-sm text-gray-900">
                      {property.propertyType.childType?.displayName || property.propertyType.displayName}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-500">Status</span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        property.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {property.status}
                    </span>
                  </div>

                  {property.possessionDate && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-500">Possession</span>
                      <span className="text-sm text-gray-900">{formatDate(property.possessionDate)}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {property.notes.replace(/Notes - /, '').split('\n')[0]}
                  </p>
                </div>

                <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyListing;