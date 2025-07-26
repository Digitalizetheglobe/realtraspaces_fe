import Image from "next/image";

import Latestpropertytype from "./latestpropertytype/page";
import CookiesBanner from "../components/CookiesBanner";
import SeoHead from "../components/SeoHead";

export const metadata = {
  title: "Realtra Spaces | Premium Real Estate in Pune",
  description: "Discover the best real estate opportunities in Pune with Realtra Spaces. Explore properties, connect with developers, and invest smartly.",
  keywords: "Real estate Pune, buy property Pune, real estate investment, residential plots, commercial properties",
  robots: "index, follow",
  alternates: {
    canonical: "https://Realtraspaces.com/",
  },
};



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
