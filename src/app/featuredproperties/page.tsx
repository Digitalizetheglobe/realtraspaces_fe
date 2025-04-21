"use client";
import Image from "next/image";
import React from "react";
import latestpropertytype from '../../../public/assets/images/latestpropertytype.svg'
import bed from '../../../public/assets/images/bed.png';
import bath from '../../../public/assets/images/bath.png';
import sqft from '../../../public/assets/images/sqft.png';
import pin from '../../../public/assets/images/marker-pin-01.png';
import bookmark from '../../../public/assets/images/bookmark.png'
import WhyrealtraSpaces from "../whyrealtraSpaces/page";

const FeaturedProperties = () => {
    return (
        <>
            <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-black">
                            Featured Properties. <span className="text-gray-500">Highlighting the best on the market.</span>
                        </h2>
                    </div>

                    <div className="space-y-6">
                        {/* Property Card 1 - Right aligned */}
                        <div className="flex justify-end">
                        <div className="w-full md:w-3/4 lg:w-2/3 bg-white rounded-lg shadow-sm overflow-hidden">
                                <div className="flex flex-col sm:flex-row">
                                    {/* Image */}
                                    <div className="w-full sm:w-1/3 p-2">
                                        <Image
                                            alt="Property"
                                            src={latestpropertytype}
                                            className="w-full h-56 object-cover rounded-2xl p-2"
                                        />
                                    </div>
                                    
                                    <div className="bg-gray-400 border-r border "></div>
                                    {/* Content */}
                                    <div className="w-full sm:w-2/3 p-4">
                                        {/* Property Tag */}
                                        <div className="mb-3">
                                            <span className="bg-[#6E6E73] text-white px-3 py-1 rounded-full text-sm">Property type</span>
                                        </div>
                                        
                                        {/* Title and Price */}
                                        <h3 className="font-semibold text-xl text-gray-900">
                                            Apartments Auvkland
                                        </h3>
                                        <h4 className="text-base text-gray-500 mb-4">
                                            ₹ 4.53 Cr
                                        </h4>
                                        
                                        {/* Property Details */}
                                        <div className="flex space-x-12 border-t border-b border-gray-200 py-3 mb-3">
                                            <div className="flex items-center space-x-2">
                                                <Image
                                                    src={bed}
                                                    alt="Bed"
                                                    width={20}
                                                    height={20}
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-md text-gray-600">Bed</span>
                                                    <span className="text-sm font-medium text-gray-500">4</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center space-x-2">
                                                <Image
                                                    src={bath}
                                                    alt="Bath"
                                                    width={20}
                                                    height={20}
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-md text-gray-600">Bath</span>
                                                    <span className="text-sm font-medium text-gray-500">2</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center space-x-2">
                                                <Image
                                                    src={sqft}
                                                    alt="Area"
                                                    width={20}
                                                    height={20}
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-md text-gray-600">Sqft</span>
                                                    <span className="text-sm font-medium text-gray-500">1520</span>
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
                                                <span className="text-md text-gray-700">Wakad</span>
                                            </div>
                                            
                                            <div className="flex items-center space-x-3">
                                                <button className="p-1 ">
                                                    <Image
                                                        src={bookmark}
                                                        alt="Bookmark"
                                                        width={30}
                                                        height={30}
                                                    />
                                                </button>
                                                <a
                                                    href="#"
                                                    className="bg-black text-white px-5 py-1 text-md rounded"
                                                >
                                                    Details
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Property Card 2 - Left aligned */}
                        <div className="flex justify-start">
                        <div className="w-full md:w-3/4 lg:w-2/3 bg-white rounded-lg shadow-sm overflow-hidden">
                                <div className="flex flex-col sm:flex-row">
                                    {/* Image */}
                                    <div className="w-full sm:w-1/3 p-2">
                                        <Image
                                            alt="Property"
                                            src={latestpropertytype}
                                            className="w-full h-56 object-cover rounded-2xl p-2"
                                        />
                                    </div>
                                    
                                    <div className="bg-gray-400 border-r border "></div>
                                    {/* Content */}
                                    <div className="w-full sm:w-2/3 p-4">
                                        {/* Property Tag */}
                                        <div className="mb-3">
                                            <span className="bg-[#6E6E73] text-white px-3 py-1 rounded-full text-sm">Property type</span>
                                        </div>
                                        
                                        {/* Title and Price */}
                                        <h3 className="font-semibold text-xl text-gray-900">
                                            Apartments Auvkland
                                        </h3>
                                        <h4 className="text-base text-gray-500 mb-4">
                                            ₹ 4.53 Cr
                                        </h4>
                                        
                                        {/* Property Details */}
                                        <div className="flex space-x-12 border-t border-b border-gray-200 py-3 mb-3">
                                            <div className="flex items-center space-x-2">
                                                <Image
                                                    src={bed}
                                                    alt="Bed"
                                                    width={20}
                                                    height={20}
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-md text-gray-600">Bed</span>
                                                    <span className="text-sm font-medium text-gray-500">4</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center space-x-2">
                                                <Image
                                                    src={bath}
                                                    alt="Bath"
                                                    width={20}
                                                    height={20}
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-md text-gray-600">Bath</span>
                                                    <span className="text-sm font-medium text-gray-500">2</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center space-x-2">
                                                <Image
                                                    src={sqft}
                                                    alt="Area"
                                                    width={20}
                                                    height={20}
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-md text-gray-600">Sqft</span>
                                                    <span className="text-sm font-medium text-gray-500">1520</span>
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
                                                <span className="text-md text-gray-700">Wakad</span>
                                            </div>
                                            
                                            <div className="flex items-center space-x-3">
                                                <button className="p-1 ">
                                                    <Image
                                                        src={bookmark}
                                                        alt="Bookmark"
                                                        width={30}
                                                        height={30}
                                                    />
                                                </button>
                                                <a
                                                    href="#"
                                                    className="bg-black text-white px-5 py-1 text-md rounded"
                                                >
                                                    Details
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Property Card 3 - Right aligned */}
                        <div className="flex justify-end">
                            <div className="w-full md:w-3/4 lg:w-2/3 bg-white rounded-lg shadow-sm overflow-hidden">
                                <div className="flex flex-col sm:flex-row">
                                    {/* Image */}
                                    <div className="w-full sm:w-1/3 p-2">
                                        <Image
                                            alt="Property"
                                            src={latestpropertytype}
                                            className="w-full h-56 object-cover rounded-2xl p-2"
                                        />
                                    </div>
                                    
                                    <div className="bg-gray-400 border-r border "></div>
                                    {/* Content */}
                                    <div className="w-full sm:w-2/3 p-4">
                                        {/* Property Tag */}
                                        <div className="mb-3">
                                            <span className="bg-[#6E6E73] text-white px-3 py-1 rounded-full text-sm">Property type</span>
                                        </div>
                                        
                                        {/* Title and Price */}
                                        <h3 className="font-semibold text-xl text-gray-900">
                                            Apartments Auvkland
                                        </h3>
                                        <h4 className="text-base text-gray-500 mb-4">
                                            ₹ 4.53 Cr
                                        </h4>
                                        
                                        {/* Property Details */}
                                        <div className="flex space-x-12 border-t border-b border-gray-200 py-3 mb-3">
                                            <div className="flex items-center space-x-2">
                                                <Image
                                                    src={bed}
                                                    alt="Bed"
                                                    width={20}
                                                    height={20}
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-md text-gray-600">Bed</span>
                                                    <span className="text-sm font-medium text-gray-500">4</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center space-x-2">
                                                <Image
                                                    src={bath}
                                                    alt="Bath"
                                                    width={20}
                                                    height={20}
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-md text-gray-600">Bath</span>
                                                    <span className="text-sm font-medium text-gray-500">2</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center space-x-2">
                                                <Image
                                                    src={sqft}
                                                    alt="Area"
                                                    width={20}
                                                    height={20}
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-md text-gray-600">Sqft</span>
                                                    <span className="text-sm font-medium text-gray-500">1520</span>
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
                                                <span className="text-md text-gray-700">Wakad</span>
                                            </div>
                                            
                                            <div className="flex items-center space-x-3">
                                                <button className="p-1 ">
                                                    <Image
                                                        src={bookmark}
                                                        alt="Bookmark"
                                                        width={30}
                                                        height={30}
                                                    />
                                                </button>
                                                <a
                                                    href="#"
                                                    className="bg-black text-white px-5 py-1 text-md rounded"
                                                >
                                                    Details
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <WhyrealtraSpaces/>
        </>
    )
}

export default FeaturedProperties