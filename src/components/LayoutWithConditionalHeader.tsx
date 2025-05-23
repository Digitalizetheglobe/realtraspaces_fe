"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import { ReactNode } from "react";

export default function LayoutWithConditionalHeader({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  const hideHeaderOn = ["/dashboard","/career-management" ,"/blog"];
  const shouldHideHeader = hideHeaderOn.includes(pathname);

  return (
    <>
      {!shouldHideHeader && <Header />}
      {children}
      {!shouldHideHeader && <Footer />}
    </>
  );
}
