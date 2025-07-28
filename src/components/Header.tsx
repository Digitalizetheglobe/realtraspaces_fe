import { useState, useEffect } from "react";
import Link from "next/link";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isSearchOpen) setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  type MenuItem = {
    name: string;
    href: string;
    divider?: boolean;
  };

  const menuItems: MenuItem[] = [
    { name: "Blog", href: "/blogs" },
    { name: "Career", href: "/career" },
    { name: "Contact", href: "/contact" },
    { name: "Compare Properties", href: "/compareproperties" },
    { name: "IRR Calculator", href: "/irr-calculator" },
    { name: "LRD Calculator", href: "/lrd-calculator" },
    { name: "ROI Calculator", href: "/roi-calculator" },
  ];

  // Check if the user is logged in by checking local storage for authToken
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoggedIn(!!localStorage.getItem("authToken"));
    }
  }, []);

  return (
    <>
      {/* Blur overlay when menu or search is open */}
      {(isMenuOpen || isSearchOpen) && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => {
            setIsMenuOpen(false);
            setIsSearchOpen(false);
          }}
        />
      )}

      <header className="fixed top-0 left-0 right-0 w-full z-50 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Left empty as in the screenshot */}
            <div className="flex-1">{/* Empty space for logo */}</div>

            {/* Search overlay - appears when search is open */}
           

            {/* Right side buttons */}
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <Link href="/">
                <button
                  type="button"
                  className={`p-2 rounded-md cursor-pointer ${
                    isSearchOpen
                      ? "bg-black text-white"
                      : "bg-[#F5F5FF99] text-black hover:bg-gray-100"
                  } h-8 w-8 flex items-center justify-center transition-colors`}
                  aria-label="Search"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </Link>

              {/* Conditional Button */}
              {/* {isLoggedIn ? (
                <Link
                  href="/profile-page"
                  className="hidden sm:inline-flex bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors uppercase tracking-wider"
                >
                  Profile
                </Link>
              ) : (
                <Link
                  href="/signup"
                  className="hidden sm:inline-flex bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors uppercase tracking-wider"
                >
                  Sign Up
                </Link>
              )} */}

              {/* List Your Property Button */}
              <Link
                href="/"
                className="hidden sm:inline-flex bg-[#F5F5FF99] text-black hover:bg-gray-100  px-4 py-2 rounded-md text-sm font-bold transition-colors uppercase tracking-wider shadow-md "
                style={{ boxShadow: '0 2px 8px rgba(255,180,0,0.15)' }}
              >
               Home
              </Link>
              <Link
                href="/about"
                className="hidden sm:inline-flex bg-[#F5F5FF99] text-black hover:bg-gray-100  px-4 py-2 rounded-md text-sm font-bold transition-colors uppercase tracking-wider shadow-md "
                style={{ boxShadow: '0 2px 8px rgba(255,180,0,0.15)' }}
              >
               About
              </Link>
              <Link
                href="/properties"
                className="hidden sm:inline-flex bg-[#F5F5FF99] text-black hover:bg-gray-100  px-4 py-2 rounded-md text-sm font-bold transition-colors uppercase tracking-wider shadow-md "
                style={{ boxShadow: '0 2px 8px rgba(255,180,0,0.15)' }}
              >
               Properties
              </Link>
              <Link
                href="/list-property"
                className="hidden sm:inline-flex bg-[#F5F5FF99] text-black hover:bg-gray-100  px-4 py-2 rounded-md text-sm font-bold transition-colors uppercase tracking-wider shadow-md "
                style={{ boxShadow: '0 2px 8px rgba(255,180,0,0.15)' }}
              >
                List Property free
              </Link>

              {/* Menu Button - X when open, hamburger when closed */}
              <button
                type="button"
                onClick={toggleMenu}
                className={` cursor-pointer inline-flex items-center justify-center p-2 rounded-md ${
                  isMenuOpen
                    ? "bg-white text-black"
                    : "bg-black text-white hover:bg-gray-100"
                } transition-colors`}
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">
                  {isMenuOpen ? "Close menu" : "Open menu"}
                </span>
                {isMenuOpen ? (
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Menu dropdown */}
        {isMenuOpen && (
          <div className="absolute right-0 top-16 z-40 flex justify-end w-full sm:w-auto">
          
            {/* Menu content with blur effect */}
            {/* <div className="w-full sm:w-80  sm:h-auto"> */}
              <div className="py-4 bg-[#FEFEFE4D] backdrop-blur-md shadow-lg">
                {menuItems.map((item, index) => (
                  <div key={item.name}>
                    <Link href={item.href} className="block" onClick={() => setIsMenuOpen(false)}>
                      <span className="text-black hover:bg-gray-100 block px-6 py-3 text-sm font-bold w-full text-left cursor-pointer">
                        {item.name}
                      </span>
                    </Link>
                    {item.divider && (
                      <hr className="border-gray-200 mx-6 my-2" />
                    )}
                  </div>
                ))}
                {/* List Your Property in mobile menu */}
                {/* <div>
                  <Link href="/list-property" className="block" onClick={() => setIsMenuOpen(false)}>
                    <span className="bg-[#FFB400] text-black font-bold hover:bg-yellow-400 block px-6 py-3 text-sm rounded-md w-full text-left cursor-pointer shadow-md border border-yellow-400" style={{ boxShadow: '0 2px 8px rgba(255,180,0,0.15)' }}>
                      List Your Property
                    </span>
                  </Link>
                </div> */}
                {/* Conditional Profile/Sign Up and Logout in menu */}
                <div className="mt-4 px-6 flex flex-col items-center justify-center text-center">
                  {isLoggedIn ? (
                    <>
                      <Link
                        href="/profile-page"
                        className="block bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors uppercase tracking-wider mb-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                         className="block bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors uppercase tracking-wider"
                         onClick={() => {
                          localStorage.removeItem('authToken');
                          setIsLoggedIn(false);
                          setIsMenuOpen(false);
                        }}
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                     <Link
                  href="/signin"
                      className="block bg-black text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-gray-800 transition-colors uppercase tracking-wider"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            {/* </div> */}
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
