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
                    <div className="mb-[25px] w-full justify-between items-start sm:items-center gap-6 sm:gap-0 ">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black w-full pr-4">
                            Featured Properties.
                            <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#6E6E73] w-full pr-4">
                                Highlighting the best on the market.
                            </span>
                        </h2>
                    </div>

                    <div className="flex max-w-7xl items-end justify-end mt-10">
                        <div className="max-w-6xl flex bg-white transition hover:shadow-xl">
                            <div className="hidden sm:block sm:basis-56">
                                <Image
                                    alt=""
                                    src={latestpropertytype}
                                    className="h-full w-full object-cover rounded-xl p-4"
                                />
                            </div>
                            <div className="border-r border-gray-120 border"></div>

                            <div className="flex flex-1 flex-col justify-between">
                                <div className="border-s border-gray-900/10 p-4 sm:border-l-transparent sm:p-6">
                                    <a href="#">
                                        <h3 className="font-semibold text-xl text-gray-900 ">
                                            Apartments Auvkland
                                        </h3>
                                        <h4 className="text-xl text-gray-500 mt-2">
                                            ₹ 4.53 Cr
                                        </h4>
                                    </a>
                                    <div className="border-b border-gray-120 border mt-2"></div>


                                    <div className="flex space-x-8">
                                        <div className="flex items-center space-x-4 mt-6">
                                            <Image
                                                src={bed}
                                                alt="Bed"
                                                width={30}
                                                height={30}
                                                className="opacity-70"
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-600">Bed</span>
                                                <span className="text-sm font-medium text-gray-600">4</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4 mt-6">
                                            <Image
                                                src={bath}
                                                alt="Bed"
                                                width={30}
                                                height={30}
                                                className="opacity-70"
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-600">Bath</span>
                                                <span className="text-sm font-medium text-gray-600">4</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4 mt-6">
                                            <Image
                                                src={sqft}
                                                alt="Bed"
                                                width={30}
                                                height={30}
                                                className="opacity-70"
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-600">Sqft</span>
                                                <span className="text-sm font-medium text-gray-600">4</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="sm:flex sm:items-start sm:justify-start space-x-4">

                                        <Image
                                            src={pin}
                                            alt="Bed"
                                            width={20}
                                            height={20}
                                            className="opacity-70"
                                        />
                                        <p className=" text-lg text-gray-700 ">
                                            Wakad
                                        </p>
                                    </div>

                                    <div className="sm:flex sm:items-end sm:justify-end space-x-4">
                                        <Image
                                            src={bookmark}
                                            alt="bookmark"
                                            width={30}
                                            height={30}
                                            className="opacity-70"
                                        />
                                        <a
                                            href="#"
                                            className=" bg-black px-5 py-2 text-center text-md text-white rounded-md"
                                        >
                                            Details
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex max-w-7xl items-start justify-start mt-10">
                        <div className="max-w-6xl flex bg-white transition hover:shadow-xl">
                            <div className="hidden sm:block sm:basis-56">
                                <Image
                                    alt=""
                                    src={latestpropertytype}
                                    className="h-full w-full object-cover rounded-xl p-4"
                                />
                            </div>
                            <div className="border-r border-gray-120 border"></div>

                            <div className="flex flex-1 flex-col justify-between">
                                <div className="border-s border-gray-900/10 p-4 sm:border-l-transparent sm:p-6">
                                    <a href="#">
                                        <h3 className="font-semibold text-xl text-gray-900 ">
                                            Apartments Auvkland
                                        </h3>
                                        <h4 className="text-xl text-gray-500 mt-2">
                                            ₹ 4.53 Cr
                                        </h4>
                                    </a>
                                    <div className="border-b border-gray-120 border mt-2"></div>


                                    <div className="flex space-x-8">
                                        <div className="flex items-center space-x-4 mt-6">
                                            <Image
                                                src={bed}
                                                alt="Bed"
                                                width={30}
                                                height={30}
                                                className="opacity-70"
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-600">Bed</span>
                                                <span className="text-sm font-medium text-gray-600">4</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4 mt-6">
                                            <Image
                                                src={bath}
                                                alt="Bed"
                                                width={30}
                                                height={30}
                                                className="opacity-70"
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-600">Bath</span>
                                                <span className="text-sm font-medium text-gray-600">4</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4 mt-6">
                                            <Image
                                                src={sqft}
                                                alt="Bed"
                                                width={30}
                                                height={30}
                                                className="opacity-70"
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-600">Sqft</span>
                                                <span className="text-sm font-medium text-gray-600">4</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="sm:flex sm:items-start sm:justify-start space-x-4">

                                        <Image
                                            src={pin}
                                            alt="Bed"
                                            width={20}
                                            height={20}
                                            className="opacity-70"
                                        />
                                        <p className=" text-lg text-gray-700 ">
                                            Wakad
                                        </p>
                                    </div>

                                    <div className="sm:flex sm:items-end sm:justify-end space-x-4">
                                        <Image
                                            src={bookmark}
                                            alt="bookmark"
                                            width={30}
                                            height={30}
                                            className="opacity-70"
                                        />
                                        <a
                                            href="#"
                                            className=" bg-black px-5 py-2 text-center text-md text-white rounded-md"
                                        >
                                            Details
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex max-w-7xl items-end justify-end mt-10">
                        <div className="max-w-6xl flex bg-white transition hover:shadow-xl">
                            <div className="hidden sm:block sm:basis-56">
                                <Image
                                    alt=""
                                    src={latestpropertytype}
                                    className="h-full w-full object-cover rounded-xl p-4"
                                />
                            </div>
                            <div className="border-r border-gray-120 border"></div>

                            <div className="flex flex-1 flex-col justify-between">
                                <div className="border-s border-gray-900/10 p-4 sm:border-l-transparent sm:p-6">
                                    <a href="#">
                                        <h3 className="font-semibold text-xl text-gray-900 ">
                                            Apartments Auvkland
                                        </h3>
                                        <h4 className="text-xl text-gray-500 mt-2">
                                            ₹ 4.53 Cr
                                        </h4>
                                    </a>
                                    <div className="border-b border-gray-120 border mt-2"></div>


                                    <div className="flex space-x-8">
                                        <div className="flex items-center space-x-4 mt-6">
                                            <Image
                                                src={bed}
                                                alt="Bed"
                                                width={30}
                                                height={30}
                                                className="opacity-70"
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-600">Bed</span>
                                                <span className="text-sm font-medium text-gray-600">4</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4 mt-6">
                                            <Image
                                                src={bath}
                                                alt="Bed"
                                                width={30}
                                                height={30}
                                                className="opacity-70"
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-600">Bath</span>
                                                <span className="text-sm font-medium text-gray-600">4</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4 mt-6">
                                            <Image
                                                src={sqft}
                                                alt="Bed"
                                                width={30}
                                                height={30}
                                                className="opacity-70"
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-600">Sqft</span>
                                                <span className="text-sm font-medium text-gray-600">4</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="sm:flex sm:items-start sm:justify-start space-x-4">

                                        <Image
                                            src={pin}
                                            alt="Bed"
                                            width={20}
                                            height={20}
                                            className="opacity-70"
                                        />
                                        <p className=" text-lg text-gray-700 ">
                                            Wakad
                                        </p>
                                    </div>

                                    <div className="sm:flex sm:items-end sm:justify-end space-x-4">
                                        <Image
                                            src={bookmark}
                                            alt="bookmark"
                                            width={30}
                                            height={30}
                                            className="opacity-70"
                                        />
                                        <a
                                            href="#"
                                            className=" bg-black px-5 py-2 text-center text-md text-white rounded-md"
                                        >
                                            Details
                                        </a>
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