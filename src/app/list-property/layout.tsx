import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'List Your Property | Realtra Spaces',
  description: 'List your commercial property on Realtra Spaces. Fill out our comprehensive form to showcase your office, retail, coworking, warehouse, or land properties to potential buyers and tenants.',
  keywords: 'list property, commercial property listing, office space for rent, retail space for sale, warehouse listing, coworking space, property management',
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
