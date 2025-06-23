import { useState } from "react";
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

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Properties", href: "/properties" },
    { name: "Blog", href: "/blog" },
    { name: "Career", href: "/career" },
    { name: "Contact", href: "/contact" },
    { name: "Saved Properties", href: "/saved-properties", divider: true },
    { name: "Compare Properties", href: "/compare-properties", divider: true },
    { name: "IRR Calculator", href: "/irr-calculator" },
    { name: "LRD Calculator", href: "/lrd-calculator" },
    { name: "ROI Calculator", href: "/roi-calculator" },
  ];

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
            {isSearchOpen && (
              <div className="absolute inset-0 flex items-center justify-center bg-white z-50 px-4">
                <div className="w-full max-w-2xl">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full py-3 pl-4 pr-12 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={toggleSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
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
                    </button>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>The latest. Take a look at whats new right now.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Right side buttons */}
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <button
                type="button"
                onClick={toggleSearch}
                className={`p-2 rounded-md ${
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

              {/* List Property Button */}
              {/* <button
                type="button"
                className="hidden sm:inline-flex bg-white text-black border border-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors uppercase tracking-wider"
              >
                LIST PROPERTY
              </button> */}

              {/* Sign In Button */}
              <button
                type="button"
                className="hidden sm:inline-flex bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors uppercase tracking-wider"
              >
                SIGN IN
              </button>

              {/* Menu Button - X when open, hamburger when closed */}
              <button
                type="button"
                onClick={toggleMenu}
                className={`inline-flex items-center justify-center p-2 rounded-md ${
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
          <div className="fixed inset-0 top-16 z-40 flex justify-end">
            {/* Empty space that closes menu when clicked */}
            <div className="flex-1 bg-black/20" onClick={toggleMenu} />

            {/* Menu content with blur effect */}
            <div className="w-full sm:w-80 bg-[#FEFEFE4D] backdrop-blur-md shadow-lg h-full sm:h-auto">
              <div className="py-4">
                {menuItems.map((item, index) => (
                  <div key={item.name}>
                    <Link
                      href={item.href}
                      className="text-black hover:bg-gray-100 block px-6 py-3 text-sm font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                    {item.divider && (
                      <hr className="border-gray-200 mx-6 my-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
