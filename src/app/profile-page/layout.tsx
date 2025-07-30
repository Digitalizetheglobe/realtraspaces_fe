import { Metadata } from "next";
import { generateMetadata as generateSeoMetadata } from "../../utils/serverSeo";

export async function generateMetadata(): Promise<Metadata> {
  return await generateSeoMetadata("profile-page");
}

export default function ProfilePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
