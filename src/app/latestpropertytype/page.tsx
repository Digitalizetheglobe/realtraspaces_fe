"use client";
import Image from "next/image";
import propertyImage from '../../../public/assets/images/latestpropertytype.svg';
import bed from '../../../public/assets/images/bed.png';
import bath from '../../../public/assets/images/bath.png';
import sqft from '../../../public/assets/images/sqft.png';
import bookmark from '../../../public/assets/images/bookmark.png'; // Import bookmark icon
import Discoverpropertieslocation from "../discoverpropertieslocation/page";

export default function PropertyCards() {
    const properties = [
        {
            title: "Apartments Auvkland",
            location: "Wakad",
            price: "4.53 Cr",
            beds: 4,
            baths: 2,
            area: "1520",
            type: "Apartment"
        },
        {
            title: "Apartments Auvkland",
            location: "Wakad",
            price: "4.53 Cr",
            beds: 4,
            baths: 2,
            area: "1520",
            type: "Apartment"
        },
        {
            title: "Apartments Auvkland",
            location: "Wakad",
            price: "4.53 Cr",
            beds: 4,
            baths: 2,
            area: "1520",
            type: "Apartment"
        }
    ];

    return (
        <>
        <section className="pt-12 sm:pt-16 lg:pt-[70px] pb-10 lg:pb-20 bg-gray-100 dark:bg-dark relative overflow-hidden">
            <div className="container mx-auto">
                <div className="w-full px-4">
                    {/* Heading */}
                    <div className="mb-[25px] w-full justify-between items-start sm:items-center gap-6 sm:gap-0 ">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black w-full pr-4">
                            The latest.
                            <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#6E6E73] w-full pr-4">
                                Take a look at what's new right now.
                            </span>
                        </h2>
                    </div>

                    {/* Property Cards */}
                    <div className="flex flex-wrap -mx-4">
                        {properties.map((property, index) => (
                            <div key={index} className="w-full px-4 md:w-1/2 lg:w-1/3 mb-8">
                                <div className="relative w-full shadow-lg rounded-lg p-4 sm:p-5 flex flex-col h-full group bg-white border border-[#00000005] hover:shadow-xl transition-shadow duration-300">
                                    {/* Property Image */}
                                    <div className="relative mb-6 sm:mb-8 overflow-hidden rounded-lg">
                                        {/* Image */}
                                        <Image
                                            src={propertyImage}
                                            alt={property.title}
                                            className="w-full transform scale-100 transition duration-300 ease-in-out group-hover:scale-105"
                                        />
                                        
                                        {/* Property Type and Location - Positioned absolutely on top of image */}
                                        <div className="absolute top-4 left-0 right-0 px-4 flex justify-between">
                                            <span className="text-sm text-black bg-white bg-opacity-70 rounded-full px-3 py-1">
                                                {property.type}
                                            </span>
                                            <span className="text-sm text-black bg-white bg-opacity-70 rounded-full px-3 py-1">
                                                {property.location}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Property Details */}
                                    <div className="flex-1">
                                        {/* Property Type and Location */}
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="text-xl font-bold text-gray-800">
                                                {property.title}
                                            </h3>
                                            <button className="ml-2">
                                                <Image 
                                                    src={bookmark} 
                                                    alt="Bookmark" 
                                                    width={30} 
                                                    height={30} 
                                                    className="opacity-70 hover:opacity-100 transition-opacity"
                                                />
                                            </button>
                                        </div>

                                        {/* Price */}
                                        <p className="text-lg font-bold text-gray-500 mb-3">
                                            ₹ {property.price}
                                        </p>

                                        {/* Divider */}
                                        <div className="border-t border-gray-200 my-3"></div>

                                        {/* Features with Icons */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-4">
                                                <Image 
                                                    src={bed} 
                                                    alt="Bed" 
                                                    width={30} 
                                                    height={30} 
                                                    className="opacity-70"
                                                />
                                                <div className="flex flex-col ">
                                                 <span className="text-sm font-medium text-gray-600">Bed</span>
                                                <span className="text-sm font-medium text-gray-600">{property.beds}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <Image 
                                                    src={bath} 
                                                    alt="Bath" 
                                                    width={30} 
                                                    height={30} 
                                                    className="opacity-70"
                                                />
                                                <div className="flex flex-col ">
                                                 <span className="text-sm font-medium text-gray-600">Bath</span>
                                                <span className="text-sm font-medium text-gray-600">{property.baths}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <Image 
                                                    src={sqft} 
                                                    alt="Area" 
                                                    width={30} 
                                                    height={30} 
                                                    className="opacity-70"
                                                />
                                                <div className="flex flex-col ">
                                                 <span className="text-sm font-medium text-gray-600">Sqft</span>
                                                <span className="text-sm font-medium text-gray-600">{property.area}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                  
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
        <Discoverpropertieslocation/>
        </>
    );
}