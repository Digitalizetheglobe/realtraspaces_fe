"use client";
import Image from "next/image";
import latestproperty1 from '../../../public/assets/images/latestproperty1.png';
import latestproperty2 from '../../../public/assets/images/latestproperty2.png';
import latestproperty3 from '../../../public/assets/images/latestproperty3.png';
import parking from '../../../public/assets/images/parking.png';
import floor from '../../../public/assets/images/floor.png';
import sqft from '../../../public/assets/images/sqft.png';
import bookmark from '../../../public/assets/images/bookmark.png';
import Discoverpropertieslocation from "../discoverpropertieslocation/page";

export default function PropertyCards() {
    return (
        <>
            <section className=" pb-10 lg:pb-20 bg-gray-100 dark:bg-dark relative overflow-hidden">
                <div className="container mx-auto">
                    <div className="w-full px-4">
                        {/* Heading */}
                        <div className="mb-[25px] w-full justify-between items-start sm:items-center gap-6 sm:gap-0 ">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black w-full pr-4">
                                The latest.
                                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#6E6E73] w-full pr-4">
                                    Take a look at what&rsquo;s new right now.
                                </span>
                            </h2>
                        </div>

                        {/* Property Cards */}
                        <div className="flex flex-wrap -mx-4">
                            {/* Property Card 1 */}
                            <div className="w-full px-4 md:w-1/2 lg:w-1/3 mb-8">
                                <div className="relative w-full shadow-lg rounded-lg p-4 sm:p-5 flex flex-col h-full group bg-white border border-[#00000005] hover:shadow-xl transition-shadow duration-300">
                                    {/* Property Image */}
                                    <div className="relative mb-6 sm:mb-8 overflow-hidden rounded-lg">
                                        <Image
                                            src={latestproperty1}
                                            alt="Apartments Auckland"
                                            className="w-full transform scale-100 transition duration-300 ease-in-out group-hover:scale-105"
                                        />
                                        <div className="absolute bottom-4 left-0 right-0 px-4 flex justify-between">
                                            <span className="text-sm text-black bg-white bg-opacity-70 rounded-full px-3 py-1">
                                                Office Space 
                                            </span>
                                            <span className="text-sm text-black bg-white bg-opacity-70 rounded-full px-3 py-1">
                                                Wakad
                                            </span>
                                        </div>
                                    </div>

                                    {/* Property Details */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="text-xl font-bold text-gray-800">
                                            Prime Business Hub
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

                                        <p className="text-lg text-gray-500 mb-3">
                                            ₹ 4.53 Cr
                                        </p>

                                        <div className="border-t border-gray-200 my-3"></div>

                                        <div className="flex items-center justify-between mb-4">
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
                                                    <span className="text-sm font-medium text-gray-600">1520</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-4">
                                                <Image
                                                    src={floor}
                                                    alt="floor"
                                                    width={30}
                                                    height={30}
                                                    className="opacity-70"
                                                />
                                                <div className="flex flex-col ">
                                                    <span className="text-sm font-medium text-gray-600">floor</span>
                                                    <span className="text-sm font-medium text-gray-600">2</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-4">
                                                <Image
                                                    src={parking}
                                                    alt="parking"
                                                    width={30}
                                                    height={30}
                                                    className="opacity-70"
                                                />
                                                <div className="flex flex-col ">
                                                    <span className="text-sm font-medium text-gray-600">parking</span>
                                                    <span className="text-sm font-medium text-gray-600">4</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Property Card 2 */}
                            <div className="w-full px-4 md:w-1/2 lg:w-1/3 mb-8">
                                <div className="relative w-full shadow-lg rounded-lg p-4 sm:p-5 flex flex-col h-full group bg-white border border-[#00000005] hover:shadow-xl transition-shadow duration-300">
                                    {/* Property Image */}
                                    <div className="relative mb-6 sm:mb-8 overflow-hidden rounded-lg">
                                        <Image
                                            src={latestproperty2}
                                            alt="Luxury Villa"
                                            className="w-full transform scale-100 transition duration-300 ease-in-out group-hover:scale-105"
                                        />
                                        <div className="absolute bottom-4 left-0 right-0 px-4 flex justify-between">
                                            <span className="text-sm text-black bg-white bg-opacity-70 rounded-full px-3 py-1">
                                                Showroom
                                            </span>
                                            <span className="text-sm text-black bg-white bg-opacity-70 rounded-full px-3 py-1">
                                                Wakad
                                            </span>
                                        </div>
                                    </div>

                                    {/* Property Details */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="text-xl font-bold text-gray-800">
                                            The Trade Tower
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

                                        <p className="text-lg text-gray-500 mb-3">
                                            ₹ 6.75 Cr
                                        </p>

                                        <div className="border-t border-gray-200 my-3"></div>

                                        <div className="flex items-center justify-between mb-4">
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
                                                    <span className="text-sm font-medium text-gray-600">1520</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-4">
                                                <Image
                                                    src={floor}
                                                    alt="floor"
                                                    width={30}
                                                    height={30}
                                                    className="opacity-70"
                                                />
                                                <div className="flex flex-col ">
                                                    <span className="text-sm font-medium text-gray-600">floor</span>
                                                    <span className="text-sm font-medium text-gray-600">2</span>
                                                </div>
                                            </div>
                                         
                                            <div className="flex items-center space-x-4">
                                                <Image
                                                    src={parking}
                                                    alt="parking"
                                                    width={30}
                                                    height={30}
                                                    className="opacity-70"
                                                />
                                                <div className="flex flex-col ">
                                                    <span className="text-sm font-medium text-gray-600">parking</span>
                                                    <span className="text-sm font-medium text-gray-600">4</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Property Card 3 */}
                            <div className="w-full px-4 md:w-1/2 lg:w-1/3 mb-8">
                                <div className="relative w-full shadow-lg rounded-lg p-4 sm:p-5 flex flex-col h-full group bg-white border border-[#00000005] hover:shadow-xl transition-shadow duration-300">
                                    {/* Property Image */}
                                    <div className="relative mb-6 sm:mb-8 overflow-hidden rounded-lg">
                                        <Image
                                            src={latestproperty3}
                                            alt="Modern Penthouse"
                                            className="w-full transform scale-100 transition duration-300 ease-in-out group-hover:scale-105"
                                        />
                                        <div className="absolute bottom-4 left-0 right-0 px-4 flex justify-between">
                                            <span className="text-sm text-black bg-white bg-opacity-70 rounded-full px-3 py-1">
                                                Warehouse
                                            </span>
                                            <span className="text-sm text-black bg-white bg-opacity-70 rounded-full px-3 py-1">
                                                Wakad
                                            </span>
                                        </div>
                                    </div>

                                    {/* Property Details */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="text-xl font-bold text-gray-800">
                                            Corporate Heights
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

                                        <p className="text-lg text-gray-500 mb-3">
                                            ₹ 5.25 Cr
                                        </p>

                                        <div className="border-t border-gray-200 my-3"></div>

                                        <div className="flex items-center justify-between mb-4">
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
                                                    <span className="text-sm font-medium text-gray-600">1520</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-4">
                                                <Image
                                                    src={floor}
                                                    alt="floor"
                                                    width={30}
                                                    height={30}
                                                    className="opacity-70"
                                                />
                                                <div className="flex flex-col ">
                                                    <span className="text-sm font-medium text-gray-600">floor</span>
                                                    <span className="text-sm font-medium text-gray-600">2</span>
                                                </div>
                                            </div>
                                         
                                            <div className="flex items-center space-x-4">
                                                <Image
                                                    src={parking}
                                                    alt="parking"
                                                    width={30}
                                                    height={30}
                                                    className="opacity-70"
                                                />
                                                <div className="flex flex-col ">
                                                    <span className="text-sm font-medium text-gray-600">parking</span>
                                                    <span className="text-sm font-medium text-gray-600">4</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Discoverpropertieslocation />
        </>
    );
}