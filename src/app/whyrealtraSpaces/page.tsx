"use client";
import Blogs from "../blogs/page";
import { Raleway } from 'next/font/google';

// Load Raleway font
const raleway = Raleway({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-raleway',
});

export default function WhyrealtraSpaces() {
    return (
        <>
            <div className={`${raleway.className} bg-[#F7F7F7]`}>
                <div className="max-w-6xl mx-auto py-16 px-4">
                    {/* Header Section with Fade-in Animation */}
                    <div className="flex flex-col sm:flex-row mb-[25px] w-full justify-between items-start gap-6 sm:gap-0 opacity-0 animate-fade-in">
                        <div className="w-full sm:w-1/2 pr-4">
                            <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold text-black transform translate-y-4 opacity-0 animate-slide-up animation-delay-200">
                                Why Realtra Spaces ?
                            </h2>
                            <h3 className="text-xl sm:text-2xl lg:text-4xl font-bold text-[#6E6E73] transform translate-y-4 opacity-0 animate-slide-up animation-delay-400">
                                Built on trust. Designed for ease.
                            </h3>
                        </div>
                        <p className="w-full sm:w-1/2 text-lg text-gray-500 transform translate-y-4 opacity-0 animate-slide-up animation-delay-600">
                            Explore the most sought-after localities with detailed insights into available properties. Compare listings by neighborhood, evaluate your options, and find a location that aligns perfectly with your lifestyle and preferences.
                        </p>
                    </div>

                    {/* Cards Grid with Staggered Animation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-md:max-w-md mx-auto">
                        {/* Card 1 - Verified Listings */}
                        <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-300 transform opacity-0 animate-card-appear animation-delay-800 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-500 ease-out group cursor-pointer">
                            <div className="p-8">
                                <div className="transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="#000"
                                        className="w-8 mb-6 transition-colors duration-300 group-hover:fill-blue-600"
                                        viewBox="0 0 32 32"
                                    >
                                        <path
                                            d="M28.068 12h-.128a.934.934 0 0 1-.864-.6.924.924 0 0 1 .2-1.01l.091-.091a2.938 2.938 0 0 0 0-4.147l-1.511-1.51a2.935 2.935 0 0 0-4.146 0l-.091.091A.956.956 0 0 1 20 4.061v-.129A2.935 2.935 0 0 0 17.068 1h-2.136A2.935 2.935 0 0 0 12 3.932v.129a.956.956 0 0 1-1.614.668l-.086-.091a2.935 2.935 0 0 0-4.146 0l-1.516 1.51a2.938 2.938 0 0 0 0 4.147l.091.091a.935.935 0 0 1 .185 1.035.924.924 0 0 1-.854.579h-.128A2.935 2.935 0 0 0 1 14.932v2.136A2.935 2.935 0 0 0 3.932 20h.128a.934.934 0 0 1 .864.6.924.924 0 0 1-.2 1.01l-.091.091a2.938 2.938 0 0 0 0 4.147l1.51 1.509a2.934 2.934 0 0 0 4.147 0l.091-.091a.936.936 0 0 1 1.035-.185.922.922 0 0 1 .579.853v.129A2.935 2.935 0 0 0 14.932 31h2.136A2.935 2.935 0 0 0 20 28.068v-.129a.956.956 0 0 1 1.614-.668l.091.091a2.935 2.935 0 0 0 4.146 0l1.511-1.509a2.938 2.938 0 0 0 0-4.147l-.091-.091a.935.935 0 0 1-.185-1.035.924.924 0 0 1 .854-.58h.128A2.935 2.935 0 0 0 31 17.068v-2.136A2.935 2.935 0 0 0 28.068 12ZM29 17.068a.933.933 0 0 1-.932.932h-.128a2.956 2.956 0 0 0-2.083 5.028l.09.091a.934.934 0 0 1 0 1.319l-1.511 1.509a.932.932 0 0 1-1.318 0l-.09-.091A2.957 2.957 0 0 0 18 27.939v.129a.933.933 0 0 1-.932.932h-2.136a.933.933 0 0 1-.932-.932v-.129a2.951 2.951 0 0 0-5.028-2.082l-.091.091a.934.934 0 0 1-1.318 0l-1.51-1.509a.934.934 0 0 1 0-1.319l.091-.091A2.956 2.956 0 0 0 4.06 18h-.128A.933.933 0 0 1 3 17.068v-2.136A.933.933 0 0 1 3.932 14h.128a2.956 2.956 0 0 0 2.083-5.028l-.09-.091a.933.933 0 0 1 0-1.318l1.51-1.511a.932.932 0 0 1 1.318 0l.09.091A2.957 2.957 0 0 0 14 4.061v-.129A.933.933 0 0 1 14.932 3h2.136a.933.933 0 0 1 .932.932v.129a2.956 2.956 0 0 0 5.028 2.082l.091-.091a.932.932 0 0 1 1.318 0l1.51 1.511a.933.933 0 0 1 0 1.318l-.091.091A2.956 2.956 0 0 0 27.94 14h.128a.933.933 0 0 1 .932.932Z"
                                            data-original="#000000"
                                        />
                                        <path
                                            d="M16 9a7 7 0 1 0 7 7 7.008 7.008 0 0 0-7-7Zm0 12a5 5 0 1 1 5-5 5.006 5.006 0 0 1-5 5Z"
                                            data-original="#000000"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-slate-900 text-lg font-semibold mb-3 transition-colors duration-300 group-hover:text-blue-600">
                                    Verified Listings
                                </h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed transition-all duration-300 group-hover:text-slate-600">
                                    Every property is vetted for accuracy and authenticity.
                                </p>
                            </div>
                        </div>

                        {/* Card 2 - Trusted Developers */}
                        <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-300 transform opacity-0 animate-card-appear animation-delay-1000 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-500 ease-out group cursor-pointer">
                            <div className="p-8">
                                <div className="transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="#000"
                                        className="w-8 mb-6 transition-colors duration-300 group-hover:fill-green-600"
                                        viewBox="0 0 682.667 682.667"
                                    >
                                        <defs>
                                            <clipPath id="a" clipPathUnits="userSpaceOnUse">
                                                <path d="M0 512h512V0H0Z" data-original="#000000" />
                                            </clipPath>
                                        </defs>
                                        <g
                                            fill="none"
                                            stroke="#000"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeMiterlimit={10}
                                            strokeWidth={40}
                                            clipPath="url(#a)"
                                            transform="matrix(1.33 0 0 -1.33 0 682.667)"
                                        >
                                            <path
                                                d="M256 492 60 410.623v-98.925C60 183.674 137.469 68.38 256 20c118.53 48.38 196 163.674 196 291.698v98.925z"
                                                data-original="#000000"
                                            />
                                            <path
                                                d="M178 271.894 233.894 216 334 316.105"
                                                data-original="#000000"
                                            />
                                        </g>
                                    </svg>
                                </div>
                                <h3 className="text-slate-900 text-lg font-semibold mb-3 transition-colors duration-300 group-hover:text-green-600">
                                    Trusted Developers
                                </h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed transition-all duration-300 group-hover:text-slate-600">
                                    Partnered with renowned builders and real estate brands.
                                </p>
                            </div>
                        </div>

                        {/* Card 3 - Smart Search Filters */}
                        <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-300 transform opacity-0 animate-card-appear animation-delay-1200 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-500 ease-out group cursor-pointer">
                            <div className="p-8">
                                <div className="transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="#000"
                                        className="w-8 mb-6 transition-colors duration-300 group-hover:fill-purple-600"
                                        viewBox="0 0 24 24"
                                    >
                                        <g fillRule="evenodd" clipRule="evenodd">
                                            <path
                                                d="M17.03 8.97a.75.75 0 0 1 0 1.06l-4.2 4.2a.75.75 0 0 1-1.154-.114l-1.093-1.639L8.03 15.03a.75.75 0 0 1-1.06-1.06l3.2-3.2a.75.75 0 0 1 1.154.114l1.093 1.639L15.97 8.97a.75.75 0 0 1 1.06 0z"
                                                data-original="#000000"
                                            />
                                            <path
                                                d="M13.75 9.5a.75.75 0 0 1 .75-.75h2a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-1.25H14.5a.75.75 0 0 1-.75-.75z"
                                                data-original="#000000"
                                            />
                                            <path
                                                d="M3.095 3.095C4.429 1.76 6.426 1.25 9 1.25h6c2.574 0 4.57.51 5.905 1.845C22.24 4.429 22.75 6.426 22.75 9v6c0 2.574-.51 4.57-1.845 5.905C19.571 22.24 17.574 22.75 15 22.75H9c-2.574 0-4.57-.51-5.905-1.845C1.76 19.571 1.25 17.574 1.25 15V9c0-2.574.51-4.57 1.845-5.905zm1.06 1.06C3.24 5.071 2.75 6.574 2.75 9v6c0 2.426.49 3.93 1.405 4.845.916.915 2.419 1.405 4.845 1.405h6c2.426 0 3.93-.49 4.845-1.405.915-.916 1.405-2.419 1.405-4.845V9c0-2.426-.49-3.93-1.405-4.845C18.929 3.24 17.426 2.75 15 2.75H9c-2.426 0-3.93.49-4.845 1.405z"
                                                data-original="#000000"
                                            />
                                        </g>
                                    </svg>
                                </div>
                                <h3 className="text-slate-900 text-lg font-semibold mb-3 transition-colors duration-300 group-hover:text-purple-600">
                                    Smart Search Filters
                                </h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed transition-all duration-300 group-hover:text-slate-600">
                                    Easily narrow down results to fit your exact needs.
                                </p>
                            </div>
                        </div>

                        {/* Card 4 - Expert Assistance */}
                        <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-300 transform opacity-0 animate-card-appear animation-delay-1400 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-500 ease-out group cursor-pointer">
                            <div className="p-8">
                                <div className="transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="#000"
                                        className="w-8 mb-6 transition-colors duration-300 group-hover:fill-orange-600"
                                        viewBox="0 0 512.001 512.001"
                                    >
                                        <path
                                            d="M271.029 0c-33.091 0-61 27.909-61 61s27.909 61 61 61 60-27.909 60-61-26.909-61-60-61zm66.592 122c-16.485 18.279-40.096 30-66.592 30-26.496 0-51.107-11.721-67.592-30-14.392 15.959-23.408 36.866-23.408 60v15c0 8.291 6.709 15 15 15h151c8.291 0 15-6.709 15-15v-15c0-23.134-9.016-44.041-23.408-60zM144.946 460.404 68.505 307.149c-7.381-14.799-25.345-20.834-40.162-13.493l-19.979 9.897c-7.439 3.689-10.466 12.73-6.753 20.156l90 180c3.701 7.423 12.704 10.377 20.083 6.738l19.722-9.771c14.875-7.368 20.938-25.417 13.53-40.272zM499.73 247.7c-12.301-9-29.401-7.2-39.6 3.9l-82 100.8c-5.7 6-16.5 9.6-22.2 9.6h-69.901c-8.401 0-15-6.599-15-15s6.599-15 15-15h60c16.5 0 30-13.5 30-30s-13.5-30-30-30h-78.6c-7.476 0-11.204-4.741-17.1-9.901-23.209-20.885-57.949-30.947-93.119-22.795-19.528 4.526-32.697 12.415-46.053 22.993l-.445-.361-21.696 19.094L174.28 452h171.749c28.2 0 55.201-13.5 72.001-36l87.999-126c9.9-13.201 7.2-32.399-6.299-42.3z"
                                            data-original="#000000"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-slate-900 text-lg font-semibold mb-3 transition-colors duration-300 group-hover:text-orange-600">Expert Assistance</h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed transition-all duration-300 group-hover:text-slate-600">
                                    Personalized support to help you at every step.
                                </p>
                            </div>
                        </div>

                        {/* Card 5 - Transparent Information */}
                        <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-300 transform opacity-0 animate-card-appear animation-delay-1600 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-500 ease-out group cursor-pointer">
                            <div className="p-8">
                                <div className="transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="#000"
                                        className="w-8 mb-6 transition-colors duration-300 group-hover:fill-teal-600"
                                        viewBox="0 0 504.69 504.69"
                                    >
                                        <path
                                            d="M252.343 262.673c-49.32 0-89.447-40.127-89.447-89.447s40.127-89.447 89.447-89.447 89.447 40.127 89.447 89.447-40.121 89.447-89.447 89.447zm0-158.235c-37.926 0-68.787 30.861-68.787 68.787s30.861 68.787 68.787 68.787 68.787-30.861 68.787-68.787-30.855-68.787-68.787-68.787z"
                                            data-original="#000000"
                                        />
                                        <path
                                            d="M391.787 405.309c-5.645 0-10.253-4.54-10.325-10.201-.883-70.306-58.819-127.503-129.15-127.503-49.264 0-93.543 27.405-115.561 71.52-8.724 17.473-13.269 36.31-13.517 55.988-.072 5.702-4.757 10.273-10.459 10.201s-10.273-4.757-10.201-10.459c.289-22.814 5.568-44.667 15.691-64.955 25.541-51.164 76.907-82.95 134.047-82.95 81.581 0 148.788 66.349 149.81 147.905.072 5.702-4.494 10.392-10.201 10.459-.046-.005-.087-.005-.134-.005z"
                                            data-original="#000000"
                                        />
                                        <path
                                            d="M252.343 463.751c-116.569 0-211.408-94.834-211.408-211.408 0-116.569 94.839-211.408 211.408-211.408 116.574 0 211.408 94.839 211.408 211.408 0 116.574-94.834 211.408-211.408 211.408zm0-402.156c-105.18 0-190.748 85.568-190.748 190.748s85.568 190.748 190.748 190.748 190.748-85.568 190.748-190.748S357.523 61.595 252.343 61.595zM71.827 90.07 14.356 32.599c-4.034-4.034-4.034-10.573 0-14.607 4.029-4.034 10.573-4.034 14.607 0l57.466 57.471c4.034 4.034 3.951 10.49 0 14.607-3.792 3.951-11.039 3.698-14.602 0z"
                                            data-original="#000000"
                                        />
                                        <path
                                            d="M14.717 92.254a10.332 10.332 0 0 1-10.299-9.653L.023 15.751a10.317 10.317 0 0 1 2.929-7.908 10.2 10.2 0 0 1 7.851-3.089L77.56 7.796c5.697.258 10.108 5.093 9.85 10.79s-5.041 10.154-10.79 9.85l-55.224-2.521 3.641 55.327c.377 5.692-3.936 10.614-9.628 10.986a7.745 7.745 0 0 1-.692.026zm403.541-2.184c-4.256-3.796-4.034-10.573 0-14.607l58.116-58.116c4.034-4.034 10.573-4.034 14.607 0s4.034 10.573 0 14.607L432.864 90.07c-4.085 3.951-9.338 4.7-14.606 0z"
                                            data-original="#000000"
                                        />
                                        <path
                                            d="M489.974 92.254a9.85 9.85 0 0 1-.687-.021c-5.697-.372-10.01-5.294-9.633-10.986l3.641-55.327-55.224 2.515c-5.511.238-10.526-4.147-10.79-9.85-.258-5.702 4.153-10.531 9.85-10.79l66.757-3.042c2.934-.134 5.79.992 7.851 3.089s3.12 4.974 2.929 7.908l-4.401 66.85c-.361 5.465-4.896 9.654-10.293 9.654zM11.711 489.339c-3.791-4.266-4.034-10.573 0-14.607l60.115-60.11c4.029-4.034 10.578-4.034 14.607 0 4.034 4.034 4.034 10.573 0 14.607l-60.115 60.11c-3.827 3.884-11.156 3.884-14.607 0z"
                                            data-original="#000000"
                                        />
                                        <path
                                            d="M10.327 499.947a10.33 10.33 0 0 1-7.376-3.104 10.312 10.312 0 0 1-2.929-7.902l4.401-66.85c.372-5.697 5.191-10.036 10.986-9.633 5.692.377 10.005 5.294 9.628 10.986l-3.641 55.332 55.224-2.515c5.645-.191 10.531 4.153 10.79 9.85.258 5.697-4.153 10.526-9.85 10.79l-66.763 3.037c-.155.004-.31.009-.47.009zm465.639-13.01-57.708-57.708c-4.034-4.034-4.034-10.573 0-14.607s10.573-4.034 14.607 0l57.708 57.708c4.034 4.034 3.962 10.5 0 14.607-3.817 3.951-10.062 3.951-14.607 0z"
                                            data-original="#000000"
                                        />
                                        <path
                                            d="M494.359 499.947c-.155 0-.315-.005-.47-.01l-66.757-3.042c-5.702-.263-10.108-5.088-9.85-10.79.263-5.702 5.113-9.984 10.79-9.85l55.219 2.515-3.641-55.332c-.372-5.692 3.941-10.609 9.633-10.986 5.625-.398 10.609 3.946 10.986 9.633l4.401 66.85a10.33 10.33 0 0 1-2.929 7.902 10.323 10.323 0 0 1-7.382 3.11z"
                                            data-original="#000000"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-slate-900 text-lg font-semibold mb-3 transition-colors duration-300 group-hover:text-teal-600">
                                    Transparent Information
                                </h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed transition-all duration-300 group-hover:text-slate-600">
                                    No hidden details — just honest, clear property data.
                                </p>
                            </div>
                        </div>

                        {/* Card 6 - Diverse Inventory */}
                        <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-300 transform opacity-0 animate-card-appear animation-delay-1800 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-500 ease-out group cursor-pointer">
                            <div className="p-8">
                                <div className="transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="#000"
                                        className="w-8 mb-6 transition-colors duration-300 group-hover:fill-indigo-600"
                                        viewBox="0 0 682.667 682.667"
                                    >
                                        <defs>
                                            <clipPath id="a" clipPathUnits="userSpaceOnUse">
                                                <path d="M0 512h512V0H0Z" data-original="#000000" />
                                            </clipPath>
                                        </defs>
                                        <g
                                            fill="none"
                                            stroke="#000"
                                            strokeMiterlimit={10}
                                            strokeWidth={30}
                                            clipPath="url(#a)"
                                            transform="matrix(1.33 0 0 -1.33 0 682.667)"
                                        >
                                            <path
                                                d="M226 15v60c0 16.568-13.432 30-30 30H76c-16.568 0-30-13.432-30-30V15Zm-45 165c0-24.853-20.147-45-45-45s-45 20.147-45 45 20.147 45 45 45 45-20.147 45-45ZM466 15v60c0 16.568-13.432 30-30 30H316c-16.568 0-30-13.432-30-30V15Zm-45 165c0-24.853-20.147-45-45-45s-45 20.147-45 45 20.147 45 45 45 45-20.147 45-45Zm-75 167v-50.294L286 347h-60.002L166 296.706V347h-15c-41.421 0-75 33.579-75 75s33.579 75 75 75h210c41.421 0 75-33.579 75-75s-33.579-75-75-75Zm-105 75h30m-90 0h30m90 0h30"
                                                data-original="#000000"
                                            />
                                        </g>
                                    </svg>
                                </div>
                                <h3 className="text-slate-900 text-lg font-semibold mb-3 transition-colors duration-300 group-hover:text-indigo-600">
                                    Diverse Inventory
                                </h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed transition-all duration-300 group-hover:text-slate-600">
                                    From cozy apartments to sprawling commercial spaces — all in one place.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Blogs />

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes card-appear {
                    from {
                        opacity: 0;
                        transform: translateY(30px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                .animate-fade-in {
                    animation: fade-in 0.8s ease-out forwards;
                }

                .animate-slide-up {
                    animation: slide-up 0.8s ease-out forwards;
                }

                .animate-card-appear {
                    animation: card-appear 0.8s ease-out forwards;
                }

                .animation-delay-200 {
                    animation-delay: 0.2s;
                }

                .animation-delay-400 {
                    animation-delay: 0.4s;
                }

                .animation-delay-600 {
                    animation-delay: 0.6s;
                }

                .animation-delay-800 {
                    animation-delay: 0.8s;
                }

                .animation-delay-1000 {
                    animation-delay: 1s;
                }

                .animation-delay-1200 {
                    animation-delay: 1.2s;
                }

                .animation-delay-1400 {
                    animation-delay: 1.4s;
                }

                .animation-delay-1600 {
                    animation-delay: 1.6s;
                }

                .animation-delay-1800 {
                    animation-delay: 1.8s;
                }

                /* Smooth scrolling for better UX */
                html {
                    scroll-behavior: smooth;
                }

                /* Additional hover effect for cards */
                .group:hover {
                    transform: translateY(-8px) scale(1.05);
                }

                /* Subtle glow effect on hover */
                .group:hover {
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1);
                }
            `}</style>
        </>
    )
}