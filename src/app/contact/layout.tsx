import { Metadata } from "next";
import { generateMetadata as generateSeoMetadata } from "../../utils/serverSeo";

// Force dynamic rendering to prevent build-time timeouts
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return await generateSeoMetadata("contact");
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
