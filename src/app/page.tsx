"use client";

import Image from "next/image";
import home from "../../public/assets/hero.jpg";
import Latestpropertytype from "./latestpropertytype/page";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      {/* ─────────  HERO SECTION  ───────── */}
      <section className="relative w-full h-[420px]">
        <Image
          src={home}
          alt="City skyline"
          fill
          priority
          className="object-cover"
        />

        {/* Search bar positioned at the bottom center of the banner */}
        <div className="absolute bottom-6 w-full flex justify-center">
          <div className="flex w-[750px] max-w-[95%] items-center gap-2 px-2 py-1 rounded-full border border-gray-300 bg-[#F5F5FF99] backdrop-blur-sm shadow-md">
            
            {/* Dropdown */}
            <div className="relative">
              <select
                className="appearance-none bg-black text-white text-sm font-medium pl-6 pr-10 py-[14px] h-full rounded-full outline-none cursor-pointer"
              >
                <option value="">Select search type</option>
                <option value="commercial">Commercial</option>
                <option value="residential">Residential</option>
                <option value="coworking">Co-working</option>
              </select>
              {/* Custom arrow */}
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white text-xs">
                ▼
              </span>
            </div>

            {/* Search input */}
            <input
              type="text"
              placeholder="Search"
              className="flex-1 bg-white text-gray-900 px-6 py-[12px] text-sm rounded-full outline-none"
            />
          </div>
        </div>
      </section>

      {/* Remaining content */}
      <Latestpropertytype />
    </main>
  );
}
