import { Metadata } from "next";
import { generateMetadata as generateSeoMetadata } from "../../utils/serverSeo";

export async function generateMetadata(): Promise<Metadata> {
  return await generateSeoMetadata("signin");
}

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
