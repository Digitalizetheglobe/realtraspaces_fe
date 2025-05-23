"use client";
import { useEffect, useState } from "react";
import Blogs from "../blogs/page";
import Image from "next/image";
import quotation from "../../../public/assets/images/quotation.png";
import smallquotation from "../../../public/assets/images/smallquotation.png";
import reversequoatation from "../../../public/assets/images/reversequotaion.png";

export default function Testimonial() {
  const testimonials = [
    {
      id: 1,
      name: "Adam Wightman",
      image: "https://readymadeui.com/team-2.webp",
      rating: 5,
      text: "Professional, reliable, and creative. The team delivered exactly what we envisioned.",
    },
    {
      id: 2,
      name: "Adam Wightman",
      image: "https://readymadeui.com/team-3.webp",
      rating: 5,
      text: "Professional, reliable, and creative. The team delivered exactly what we envisioned.",
    },
    {
      id: 3,
      name: "Adam Wightman",
      image: "https://readymadeui.com/team-4.webp",
      rating: 5,
      text: "Professional, reliable, and creative. The team delivered exactly what we envisioned.",
    },
    {
      id: 4,
      name: "Adam Wightman",
      image: "https://readymadeui.com/team-1.webp",
      rating: 5,
      text: "Professional, reliable, and creative. The team delivered exactly what we envisioned.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <>
      <div className="py-16 w-full bg-gray-50 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            {/* Left-aligned heading with quote icon */}
            <div className="md:w-1/4">
              <div className="text-gray-400 text-4xl mb-4">
                <Image src={quotation} alt="quotation" className="" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                What our clients are saying
              </h2>
            </div>

            {/* Right-aligned testimonial carousel with overflow effect */}
            <div className="md:w-3/4 relative">
              <div className="relative overflow-visible">
                {/* Remove padding-right on container to allow last card to overflow */}
                <div className="flex space-x-4 pr-0">
                  {/* Display current testimonial and next two, with the third one partially visible */}
                  {[0, 1, 2].map((offset) => {
                    const index = (currentIndex + offset) % testimonials.length;
                    const testimonial = testimonials[index];

                    return (
                      <div
                        key={testimonial.id}
                        className={`bg-white p-6 rounded-md shadow-sm flex-none ${
                          // Make cards a fixed width to ensure consistent overflow
                          offset < 2 ? "w-full md:w-4/12" : "w-full md:w-4/12"
                        }`}
                      >
                        <Image
                          src={smallquotation}
                          alt="smallquoation"
                          className="items-start"
                        />
                        {/* Testimonial text */}
                        <p className="text-md text-gray-600 mb-6 mt-4">
                          {testimonial.text}
                        </p>
                        <div className="flex justify-end w-full">
                          <Image
                            src={reversequoatation}
                            alt="reverse quotation"
                          />
                        </div>
                        {/* User info with avatar and name */}
                        <div className="flex items-center gap-3 mt-4">
                          <Image
                            src={testimonial.image}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full"
                            alt={testimonial.name}
                          />
                          <div>
                            <h4 className="text-sm font-medium text-slate-900">
                              {testimonial.name}
                            </h4>
                            {/* Star rating */}
                            <div className="flex space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className="w-3 h-3 fill-yellow-400"
                                  viewBox="0 0 14 13"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Blogs />
    </>
  );
}
