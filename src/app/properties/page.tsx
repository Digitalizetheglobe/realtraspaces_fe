import Image from "next/image";
import contactimg from '../../../public/assets/images/contactimg.png'
import latestproperty1 from '../../../public/assets/images/latestproperty1.png';
import latestproperty2 from '../../../public/assets/images/latestproperty2.png';
import latestproperty3 from '../../../public/assets/images/latestproperty3.png';
import parking from '../../../public/assets/images/parking.png';
import floor from '../../../public/assets/images/floor.png';
import sqft from '../../../public/assets/images/sqft.png';
import bookmark from '../../../public/assets/images/bookmark.png';

export default function Home() {
    return (
        <>
            <main className="min-h-screen bg-white">
                {/* Hero Section */}
                <section className="relative h-[90vh] w-full">
                    <div className="absolute inset-0">
                        <Image
                            src={contactimg}
                            alt="Modern Home Interior"
                            fill
                            priority
                            className="object-cover"
                        />
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <h1 className="text-white text-4xl font-bold">Properties</h1>
                        <p className="text-white text-lg">Home {">"} Properties</p>
                    </div>
                </section>

                <div className="flex flex-wrap md:flex-nowrap gap-2 bg-gray-300 max-w-5xl mx-auto p-2 border-2 border-gray-200 shadow-md mt-6 rounded-xl">
                    <div className="w-full md:w-1/4 ">
                        <select className="w-full px-4 py-2 border-0 focus:ring-0 text-gray-600 bg-white/80 backdrop-blur-sm rounded-md">
                            <option value="">Location </option>
                            <option value="new-york">New York</option>
                            <option value="london">London</option>
                            <option value="paris">Paris</option>
                        </select>
                    </div>
                    <div className="w-full md:w-1/4">
                        <select className="w-full px-4 py-2 border-0 focus:ring-0 text-gray-600 bg-white/80 backdrop-blur-sm rounded-md">
                            <option value="">Property Type </option>
                            <option value="apartment">Apartment</option>
                            <option value="house">House</option>
                            <option value="villa">Villa</option>
                        </select>
                    </div>
                    <div className="w-full md:w-1/4">
                        <select className="w-full px-4 py-2 border-0 focus:ring-0 text-gray-600 bg-white/80 backdrop-blur-sm rounded-md">
                            <option value="">Location </option>
                            <option value="downtown">Downtown</option>
                            <option value="suburb">Suburb</option>
                            <option value="beach">Beach</option>
                        </select>
                    </div>
                    <div className="w-full md:w-1/4">
                        <input
                            type="text"
                            placeholder="Property Name"
                            className="w-full px-4 py-2 border-0 focus:ring-0 text-gray-600 bg-white/80 backdrop-blur-sm rounded-md"
                        />
                    </div>
                    <div className="w-full md:w-auto">
                        <button className="w-full md:w-auto bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors">
                            Search
                        </button>
                    </div>
                </div>
            </main>

            <section className=" pb-10 lg:pb-20 bg-white dark:bg-dark relative overflow-hidden">
                <div className="container mx-auto">
                    <div className="w-full px-4">
                        {/* Heading */}
                        <div className="mb-[25px] w-full justify-between items-start sm:items-center gap-6 sm:gap-0 mt-8">
                            <h2 className="text-lg text-gray-500 relative after:absolute after:-bottom-4 after:h-1 after:w-[1000px] after:bg-gray-300 after:left-0 after:right-0 after:mx-auto after:rounded-full mb-10">
                                26 properties found
                            </h2>
                        </div>

                        {/* Property Cards */}
                        <div className="flex flex-wrap -mx-4">
                            {/* Property Card 1 */}
                            <div className="w-full px-4 md:w-1/2 lg:w-1/3 mb-8">
                                <div className="relative w-full shadow-lg rounded-lg p-4 sm:p-5 flex flex-col h-full group bg-[#F1F1F4] border border-[#00000005] hover:shadow-xl transition-shadow duration-300">
                                    {/* Property Image */}
                                    <div className="relative mb-6 sm:mb-8 overflow-hidden rounded-lg">
                                        <Image
                                            src={latestproperty1}
                                            alt="Apartments Auckland"
                                            className="w-full transform scale-100 transition duration-300 ease-in-out group-hover:scale-105"
                                        />
                                        <div className="absolute bottom-4 left-0 right-0 px-4 flex justify-between">
                                            <span className="text-sm text-black bg-white bg-opacity-70 rounded-full px-3 py-1">
                                                Apartment
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
                                                Apartments Auckland
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

                                        <p className="text-lg font-bold text-gray-500 mb-3">
                                            ₹ 4.53 Cr
                                        </p>

                                        <div className="border-t border-gray-300 my-3"></div>

                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-2">
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

                                            <div className="flex items-center space-x-2">
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

                                            <div className="flex items-center space-x-2">
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
                                <div className="relative w-full shadow-lg rounded-lg p-4 sm:p-5 flex flex-col h-full group bg-[#F1F1F4] border border-[#00000005] hover:shadow-xl transition-shadow duration-300">
                                    {/* Property Image */}
                                    <div className="relative mb-6 sm:mb-8 overflow-hidden rounded-lg">
                                        <Image
                                            src={latestproperty2}
                                            alt="Luxury Villa"
                                            className="w-full transform scale-100 transition duration-300 ease-in-out group-hover:scale-105"
                                        />
                                        <div className="absolute bottom-4 left-0 right-0 px-4 flex justify-between">
                                            <span className="text-sm text-black bg-white bg-opacity-70 rounded-full px-3 py-1">
                                                Villa
                                            </span>
                                            <span className="text-sm text-black bg-white bg-opacity-70 rounded-full px-3 py-1">
                                                Baner
                                            </span>
                                        </div>
                                    </div>

                                    {/* Property Details */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="text-xl font-bold text-gray-800">
                                                Luxury Villa
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

                                        <p className="text-lg font-bold text-gray-500 mb-3">
                                            ₹ 6.75 Cr
                                        </p>

                                        <div className="border-t border-gray-300 my-3"></div>

                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-2">
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

                                            <div className="flex items-center space-x-2">
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

                                            <div className="flex items-center space-x-2">
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
                                <div className="relative w-full shadow-lg rounded-lg p-4 sm:p-5 flex flex-col h-full group bg-[#F1F1F4] border border-[#00000005] hover:shadow-xl transition-shadow duration-300">
                                    {/* Property Image */}
                                    <div className="relative mb-6 sm:mb-8 overflow-hidden rounded-lg">
                                        <Image
                                            src={latestproperty3}
                                            alt="Modern Penthouse"
                                            className="w-full transform scale-100 transition duration-300 ease-in-out group-hover:scale-105"
                                        />
                                        <div className="absolute bottom-4 left-0 right-0 px-4 flex justify-between">
                                            <span className="text-sm text-black bg-white bg-opacity-70 rounded-full px-3 py-1">
                                                Penthouse
                                            </span>
                                            <span className="text-sm text-black bg-white bg-opacity-70 rounded-full px-3 py-1">
                                                Hinjewadi
                                            </span>
                                        </div>
                                    </div>

                                    {/* Property Details */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="text-xl font-bold text-gray-800">
                                                Modern Penthouse
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

                                        <p className="text-lg font-bold text-gray-500 mb-3">
                                            ₹ 5.25 Cr
                                        </p>

                                        <div className="border-t border-gray-300 my-3"></div>

                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-2">
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

                                            <div className="flex items-center space-x-2">
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

                                            <div className="flex items-center space-x-2">
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

                        {/* Property Cards */}
                        <div className="flex flex-wrap -mx-4">
                            {/* Property Card 1 */}
                            <div className="w-full px-4 md:w-1/2 lg:w-1/3 mb-8">
                                <div className="relative w-full shadow-lg rounded-lg p-4 sm:p-5 flex flex-col h-full group bg-[#F1F1F4] border border-[#00000005] hover:shadow-xl transition-shadow duration-300">
                                    {/* Property Image */}
                                    <div className="relative mb-6 sm:mb-8 overflow-hidden rounded-lg">
                                        <Image
                                            src={latestproperty1}
                                            alt="Apartments Auckland"
                                            className="w-full transform scale-100 transition duration-300 ease-in-out group-hover:scale-105"
                                        />
                                        <div className="absolute bottom-4 left-0 right-0 px-4 flex justify-between">
                                            <span className="text-sm text-black bg-white bg-opacity-70 rounded-full px-3 py-1">
                                                Apartment
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
                                                Apartments Auckland
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

                                        <p className="text-lg font-bold text-gray-500 mb-3">
                                            ₹ 4.53 Cr
                                        </p>

                                        <div className="border-t border-gray-300 my-3"></div>

                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-2">
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

                                            <div className="flex items-center space-x-2">
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

                                            <div className="flex items-center space-x-2">
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
                                <div className="relative w-full shadow-lg rounded-lg p-4 sm:p-5 flex flex-col h-full group bg-[#F1F1F4] border border-[#00000005] hover:shadow-xl transition-shadow duration-300">
                                    {/* Property Image */}
                                    <div className="relative mb-6 sm:mb-8 overflow-hidden rounded-lg">
                                        <Image
                                            src={latestproperty2}
                                            alt="Luxury Villa"
                                            className="w-full transform scale-100 transition duration-300 ease-in-out group-hover:scale-105"
                                        />
                                        <div className="absolute bottom-4 left-0 right-0 px-4 flex justify-between">
                                            <span className="text-sm text-black bg-white bg-opacity-70 rounded-full px-3 py-1">
                                                Villa
                                            </span>
                                            <span className="text-sm text-black bg-white bg-opacity-70 rounded-full px-3 py-1">
                                                Baner
                                            </span>
                                        </div>
                                    </div>

                                    {/* Property Details */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="text-xl font-bold text-gray-800">
                                                Luxury Villa
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

                                        <p className="text-lg font-bold text-gray-500 mb-3">
                                            ₹ 6.75 Cr
                                        </p>

                                        <div className="border-t border-gray-300 my-3"></div>

                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-2">
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

                                            <div className="flex items-center space-x-2">
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

                                            <div className="flex items-center space-x-2">
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
                                <div className="relative w-full shadow-lg rounded-lg p-4 sm:p-5 flex flex-col h-full group bg-[#F1F1F4] border border-[#00000005] hover:shadow-xl transition-shadow duration-300">
                                    {/* Property Image */}
                                    <div className="relative mb-6 sm:mb-8 overflow-hidden rounded-lg">
                                        <Image
                                            src={latestproperty3}
                                            alt="Modern Penthouse"
                                            className="w-full transform scale-100 transition duration-300 ease-in-out group-hover:scale-105"
                                        />
                                        <div className="absolute bottom-4 left-0 right-0 px-4 flex justify-between">
                                            <span className="text-sm text-black bg-white bg-opacity-70 rounded-full px-3 py-1">
                                                Penthouse
                                            </span>
                                            <span className="text-sm text-black bg-white bg-opacity-70 rounded-full px-3 py-1">
                                                Hinjewadi
                                            </span>
                                        </div>
                                    </div>

                                    {/* Property Details */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="text-xl font-bold text-gray-800">
                                                Modern Penthouse
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

                                        <p className="text-lg font-bold text-gray-500 mb-3">
                                            ₹ 5.25 Cr
                                        </p>

                                        <div className="border-t border-gray-300 my-3"></div>

                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-2">
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

                                            <div className="flex items-center space-x-2">
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

                                            <div className="flex items-center space-x-2">
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
        </>
    )
}

