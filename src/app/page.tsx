"use client";

import Image from "next/image";

import Latestpropertytype from "./latestpropertytype/page";
import CookiesBanner from "../components/CookiesBanner";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <CookiesBanner />
      {/* ─────────  HERO SECTION  ───────── */}
     

      {/* Remaining content */}
      <Latestpropertytype />
    </main>
  );
}
