import Image from "next/image";
import { Metadata } from "next";
import { generateMetadata as generateSeoMetadata } from "../utils/serverSeo";

import Latestpropertytype from "./latestpropertytype/page";
import CookiesBanner from "../components/CookiesBanner";
import SeoHead from "../components/SeoHead";
import PageWithSeo from "../components/PageWithSeo";

// Generate metadata server-side
export async function generateMetadata(): Promise<Metadata> {
  return await generateSeoMetadata("home");
}

export default function Home() {
  return (
    <PageWithSeo page="home">
      <main className="min-h-screen bg-gray-100">
        {/* Static SEO Head - provides additional meta tags */}
        <SeoHead />
        
        <CookiesBanner />
        {/* ─────────  HERO SECTION  ───────── */}
       

        {/* Remaining content */}
        <Latestpropertytype />
      </main>
    </PageWithSeo>
  );
}
