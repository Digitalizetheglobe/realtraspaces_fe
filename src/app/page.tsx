"use client";

import Image from "next/image";

import Latestpropertytype from "./latestpropertytype/page";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      {/* ─────────  HERO SECTION  ───────── */}
     

      {/* Remaining content */}
      <Latestpropertytype />
    </main>
  );
}
