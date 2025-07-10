"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
// existing imports …
import {
  FiPlus,
  FiChevronDown,
  FiMapPin,
  FiPhone,
  FiMessageCircle, // <- you can delete this if you no longer need it
  FiShare2, // NEW  (from react-icons/fi)
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa"; // NEW  colourful WhatsApp logo
import contactimg from "../../../public/assets/images/contactimg.png";

/* ─────────────────────────  CONSTANTS  ───────────────────────── */ 
const ATTRIBUTES = [
  "Carpet Area",
  "Floor",
  "Furn/Unfurnished",
  "Seat in Office",
  "No. of Cabin",
  "Building Structure",
  "Floor Plan",
  "Car Park",
  "Availability Time",
  "Chargeable Area",
  "Efficiency",
  "Quoted Renting / Towards",
  "Maintenance",
  "Taxes",
];

/* ─────────────────────────  COMPONENT  ───────────────────────── */
const CompareProperties = () => {
  const [showSpecs, setShowSpecs] = useState(true);

  const [properties] = useState([
    {
      id: 1,
      title: "Prime Business Hub",
      price: "₹ 4500",
      location: "Location Name",
      description:
        "A premier commercial property located in the thriving business hub...",
      features: {
        "Carpet Area": "1 200 sq ft",
        Floor: "5th",
        "Furn/Unfurnished": "Furnished",
        "Seat in Office": "50",
      },
    },
    {
      id: 2,
      title: "Prime Business Hub",
      price: "₹ 4500",
      location: "Location Name",
      description:
        "A premier commercial property located in the thriving business hub...",
      features: {
        "Carpet Area": "1 500 sq ft",
        Floor: "3rd",
        "Furn/Unfurnished": "Un-furnished",
        "Seat in Office": "40",
      },
    },
  ]);

  return (
    <>
      {/* ─────────────────────────  HERO  ───────────────────────── */}
      <section className="relative h-[60vh] w-full">
        <Image
          src={contactimg}
          alt="Modern Home Interior"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <nav aria-label="breadcrumb">
            <ol className="text-white text-lg flex space-x-2">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>{">"}</li>
              <li>Compare Properties</li>
            </ol>
          </nav> 
        </div>
      </section>

      {/* ─────────────────────────  MAIN  ───────────────────────── */}
      <section className="bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* ─────────  TOOLBAR  ───────── */}
          <div className="flex items-center justify-between bg-[#F1F1F4] rounded-md p-4 mb-6">
            <button className="border border-black bg-white px-4 py-1 rounded text-md text-black hover:bg-gray-200">
              See All Properties
            </button>

            <div className="flex items-center gap-3 text-md">
              <span className="hidden sm:block text-black">
                Want Help Choosing Property ??
              </span>
              <button className="bg-black text-white px-4 py-1 text-md rounded hover:bg-black">
                Contact&nbsp;Us
              </button>
            </div>
          </div>

          {/* ─────────  COMPARISON GRID  ───────── */}
          <div className="flex flex-wrap gap-4 pb-4">
            {/* 1) SPEC-LIST COLUMN */}
              <div className="w-[270px] flex-none rounded-lg border border-[#E5E5EA] p-3">
              <div className="h-66 w-full rounded-tr-lg rounded-tl-lg bg-[#EFEFF3] border flex flex-col items-center justify-center gap-2">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-black">
                  <FiPlus className="text-white" size={20} />
                </span>
                <p className="mt-2 text-sm text-black font-medium">
                  Add New Column
                </p>
              </div>

              {/* Divider Line */}
              {/* <hr className="border-t border-[#E5E5EA]" /> */}

              {/* Attributes */}
              {showSpecs && (
                <ul className="space-y-5 px-6 py-6 text-sm bg-[#EFEFF3] rounded-br-lg rounded-bl-lg">
                  {ATTRIBUTES.map((attr) => (
                    <li
                      key={attr}
                      className="flex items-center gap-3 text-[#5F5F6B]"
                    >
                      <span className="h-4 w-4 rounded-sm border border-gray-400 inline-block" />
                      {attr}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* 2) PLACEHOLDER COLUMN */}
            <div className="w-[270px] flex-none rounded-lg border border-[#E5E5EA] p-3">
              <div className="h-66 w-full rounded-lg bg-[#EFEFF3] border-2 border-dashed border-[#D0D0D7] flex flex-col items-center justify-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-white border border-[#D0D0D7]">
                  <FiPlus className="text-[#9D9DA6]" size={16} />
                </span>
                <p className="text-xs font-medium text-[#5F5F6B] max-w-[140px] text-center leading-snug">
                  Choose from saved properties
                </p>
              </div>
            </div>

            {/* 3+) PROPERTY COLUMNS */}
            {properties.map((prop) => (
              <div
                key={prop.id}
                className="flex-1 min-w-[260px] basis-[300px] rounded-lg border border-[#E5E5EA]"
              >
                {/* Header / thumb */}
                <div className="p-4 border-b border-[#E5E5EA]">
                  <h3 className="font-semibold text-black text-sm">
                    {prop.title}
                  </h3>
                  <p className="flex items-center text-gray-700 text-[11px] gap-1 mb-3">
                    <FiMapPin size={12} />
                    {prop.location}
                  </p>

                  <figure className="relative h-32 w-full rounded overflow-hidden mb-3">
                    <Image
                      src={contactimg}
                      alt={prop.title}
                      fill
                      className="object-cover"
                    />
                  </figure>

                  <div className="flex items-center justify-between mb-2">
                    {/* left: price */}
                    <div>
                      <p className="font-semibold text-black">{prop.price}</p>
                      <p className="text-[11px] text-[#7B7B87]">rent/month</p>
                    </div>

                    {/* right: action buttons */}
                    <div className="flex gap-2">
                    
                      {/* WhatsApp – green circle with white logo */}
                      <button className="h-6 w-6 grid place-items-center rounded bg-[#25D366]">
                        <FaWhatsapp size={12} className="text-white" />
                      </button>

                      {/* share icon */}
                      <button className="h-6 w-6 grid place-items-center text-black rounded border border-[#D0D0D7] hover:bg-gray-100">
                        <FiShare2 size={12} />
                      </button>
                    </div>
                  </div>

                  <p className="mt-1 text-xs text-[#5F5F6B] line-clamp-3">
                    {prop.description}
                  </p>
                  <Link
                    href="#"
                    className="mt-1 inline-block text-[11px] text-blue-600 hover:underline"
                  >
                    Read&nbsp;More
                  </Link>
                </div>

                {/* Attributes */}
                <ul className="divide-y divide-[#E5E5EA] text-xs">
                  {ATTRIBUTES.map((attr) => (
                    <li
                      key={attr}
                      className="flex justify-between px-4 py-2 text-[#5F5F6B]"
                    >
                      <span>{attr}</span>
                      <span className="text-[#26262E]">
                        {prop.features[attr] || "--"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default CompareProperties;
