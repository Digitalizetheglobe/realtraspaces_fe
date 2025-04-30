"use client";
import Image from "next/image";
import React from "react";
import latestpropertytype from '../../../public/assets/images/latestpropertytype.svg'
import sqft from "../../../public/assets/images/sqft.png";
import homeimproment from "../../../public/assets/images/home-improvement1.png";
import parking from '../../../public/assets/images/parking.png'
import bath from '../../../public/assets/images/bath.png';
import pin from '../../../public/assets/images/marker-pin-01.png';
import bookmark from '../../../public/assets/images/bookmark.png'
import WhyrealtraSpaces from "../whyrealtraSpaces/page";

const FeaturedProperties = () => {
    return (
        <>
            <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
  <div className="mb-6 max-w-5xl mx-auto">
    <h2 className="text-2xl sm:text-3xl font-bold text-black">
      Explore More Listings             
    </h2>
  </div>

  <div className="space-y-6 max-w-5xl mx-auto">
    {/* Property Card 1 */}
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="w-full sm:w-1/3 p-2">
          <Image
            alt="Property"
            src={latestpropertytype}
            className="w-full h-56 object-cover rounded-2xl p-2"
          />
        </div>

        <div className="bg-gray-400 border-r border"></div>
        
        {/* Content */}
        <div className="w-full sm:w-2/3 p-4 px-8">
          {/* Property Tag */}
          <div className="mb-3">
            <span className="bg-[#6E6E73] text-white px-3 py-1 rounded-full text-sm">
              Property type
            </span>
          </div>

          {/* Title and Price */}
          <h3 className="font-semibold text-xl text-gray-900">
            Metrolla Plaza
          </h3>
          <h4 className="text-base text-gray-500 mb-4">₹ 4.53 Cr</h4>

          {/* Property Details */}
          <div className="flex space-x-12 border-t border-b border-gray-200 py-3 mb-3">
            <div className="flex items-center space-x-2">
              <Image src={sqft} alt="Bed" width={20} height={20} />
              <div className="flex flex-col">
                <span className="text-md text-gray-600">Sqft</span>
                <span className="text-sm font-medium text-gray-500">
                  1520
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Image src={bath} alt="Bath" width={20} height={20} />
              <div className="flex flex-col">
                <span className="text-md text-gray-600">Fully </span>
                <span className="text-sm font-medium text-gray-500">
                Furnished
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Image src={homeimproment} alt="Area" width={20} height={20} />
              <div className="flex flex-col">
                <span className="text-md text-gray-600">Ready to </span>
                <span className="text-sm font-medium text-gray-500">
                  Move
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Image src={parking} alt="Area" width={20} height={20} />
              <div className="flex flex-col">
                <span className="text-md text-gray-600">2 Reserved</span>
                <span className="text-sm font-medium text-gray-500">
                Parking
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
              <span className="text-md text-gray-700">Sector 62, Noida</span>
            </div>

            <div className="flex items-center space-x-3">
              <button className="p-1">
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

    {/* Property Card 2 */}
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Content */}
        <div className="w-full sm:w-2/3 p-4 px-8">
          {/* Property Tag */}
          <div className="mb-3">
            <span className="bg-[#6E6E73] text-white px-3 py-1 rounded-full text-sm">
              Property type
            </span>
          </div>

          {/* Title and Price */}
          <h3 className="font-semibold text-xl text-gray-900">
            Metrolla Plaza
          </h3>
          <h4 className="text-base text-gray-500 mb-4">₹ 4.53 Cr</h4>

          {/* Property Details */}
          <div className="flex space-x-12 border-t border-b border-gray-200 py-3 mb-3">
            <div className="flex items-center space-x-2">
              <Image src={sqft} alt="Bed" width={20} height={20} />
              <div className="flex flex-col">
                <span className="text-md text-gray-600">Sqft</span>
                <span className="text-sm font-medium text-gray-500">
                  1520
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Image src={bath} alt="Bath" width={20} height={20} />
              <div className="flex flex-col">
                <span className="text-md text-gray-600">Fully </span>
                <span className="text-sm font-medium text-gray-500">
                Furnished
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Image src={homeimproment} alt="Area" width={20} height={20} />
              <div className="flex flex-col">
                <span className="text-md text-gray-600">Ready to </span>
                <span className="text-sm font-medium text-gray-500">
                  Move
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Image src={parking} alt="Area" width={20} height={20} />
              <div className="flex flex-col">
                <span className="text-md text-gray-600">2 Reserved</span>
                <span className="text-sm font-medium text-gray-500">
                Parking
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
              <span className="text-md text-gray-700">Sector 62, Noida</span>
            </div>

            <div className="flex items-center space-x-3">
              <button className="p-1">
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
        
        <div className="bg-gray-400 border-r border"></div>
        
        {/* Image */}
        <div className="w-full sm:w-1/3 p-2">
          <Image
            alt="Property"
            src={latestpropertytype}
            className="w-full h-56 object-cover rounded-2xl p-2"
          />
        </div>
      </div>
    </div>

    {/* Property Card 3 */}
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="w-full sm:w-1/3 p-2">
          <Image
            alt="Property"
            src={latestpropertytype}
            className="w-full h-56 object-cover rounded-2xl p-2"
          />
        </div>

        <div className="bg-gray-400 border-r border"></div>
        
        {/* Content */}
        <div className="w-full sm:w-2/3 p-4 px-8">
          {/* Property Tag */}
          <div className="mb-3">
            <span className="bg-[#6E6E73] text-white px-3 py-1 rounded-full text-sm">
              Property type
            </span>
          </div>

          {/* Title and Price */}
          <h3 className="font-semibold text-xl text-gray-900">
            Metrolla Plaza
          </h3>
          <h4 className="text-base text-gray-500 mb-4">₹ 4.53 Cr</h4>

          {/* Property Details */}
          <div className="flex space-x-12 border-t border-b border-gray-200 py-3 mb-3">
            <div className="flex items-center space-x-2">
              <Image src={sqft} alt="Bed" width={20} height={20} />
              <div className="flex flex-col">
                <span className="text-md text-gray-600">Sqft</span>
                <span className="text-sm font-medium text-gray-500">
                  1520
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Image src={bath} alt="Bath" width={20} height={20} />
              <div className="flex flex-col">
                <span className="text-md text-gray-600">Fully </span>
                <span className="text-sm font-medium text-gray-500">
                Furnished
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Image src={homeimproment} alt="Area" width={20} height={20} />
              <div className="flex flex-col">
                <span className="text-md text-gray-600">Ready to </span>
                <span className="text-sm font-medium text-gray-500">
                  Move
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Image src={parking} alt="Area" width={20} height={20} />
              <div className="flex flex-col">
                <span className="text-md text-gray-600">2 Reserved</span>
                <span className="text-sm font-medium text-gray-500">
                Parking
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
              <span className="text-md text-gray-700">Sector 62, Noida</span>
            </div>

            <div className="flex items-center space-x-3">
              <button className="p-1">
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
            </section>

            <WhyrealtraSpaces/>
        </>
    )
}

export default FeaturedProperties