import { Metadata } from "next";
import { generateMetadata as generateSeoMetadata } from "../../utils/serverSeo";

export async function generateMetadata(): Promise<Metadata> {
  return await generateSeoMetadata("signup");
}

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
