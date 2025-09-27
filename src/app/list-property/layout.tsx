import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sell Your Commercial Property In Mumbai ',
  description: 'Looking to sell your Commercial property in Mumbai? Our dedicated team offers personalized support and market insights to ensure a successful sale.',
  keywords: 'sell your commercial property Mumbai, Mumbai commercial property for sale, commercial property sale Mumbai, office space sale Mumbai, retail shop sale Mumbai, sell office space Mumbai, sell retail property Mumbai, commercial real estate Mumbai',
  openGraph: {
    title: 'List Your Property | Realtra Spaces',
    description: 'List your commercial property on Realtra Spaces. Fill out our comprehensive form to showcase your office, retail, coworking, warehouse, or land properties to potential buyers and tenants.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'List Your Property | Realtra Spaces',
    description: 'List your commercial property on Realtra Spaces. Fill out our comprehensive form to showcase your office, retail, coworking, warehouse, or land properties to potential buyers and tenants.',
  },
};

export default function ListPropertyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
