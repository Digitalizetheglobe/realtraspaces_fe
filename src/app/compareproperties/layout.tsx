import { Metadata } from "next";
import { generateMetadata as generateSeoMetadata } from "../../utils/serverSeo";

export async function generateMetadata(): Promise<Metadata> {
  return await generateSeoMetadata("compareproperties");
}

export default function ComparePropertiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
