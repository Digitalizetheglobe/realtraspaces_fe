"use client";

import { useEffect, useState } from "react";
export default function ScrollButton() {
  const [isAtTop, setIsAtTop] = useState(true);

  // Handle scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight / 2) {
        setIsAtTop(false); // Show "Up" arrow when scrolled down
      } else {
        setIsAtTop(true); // Show "Down" arrow when at top
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll up or down
  const handleScroll = () => {
    if (isAtTop) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <button
      onClick={handleScroll}
      className="fixed bottom-10 right-8 bg-black hover:bg-[#4b6096] font-bo text-white w-8 h-8 flex items-center justify-center rounded shadow-lg z-50"
    >
      {isAtTop ? "↓" : "↑"}
    </button>
  );
}
