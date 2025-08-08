import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top Real Estate Developers | RealTraSpaces",
  description: "Discover the most trusted and innovative real estate developers in the market. Explore their projects and find your perfect investment opportunity.",
  keywords: "real estate developers, property developers, real estate companies, property investment, real estate projects",
  openGraph: {
    title: "Top Real Estate Developers | RealTraSpaces",
    description: "Discover the most trusted and innovative real estate developers in the market. Explore their projects and find your perfect investment opportunity.",
    type: "website",
  },
};

export default function DevelopersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
} 