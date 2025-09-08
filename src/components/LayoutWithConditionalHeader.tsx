"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import WhatsAppPopup from "./whatsapp";
import ScrollButton from "./scrollbutton";
import PropertyLocations from "./locality";

export default function LayoutWithConditionalHeader({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  const hideHeaderOn = ["/dashboard","/career-management" ,"/blog","/seometaManager","/manage-testimonials","/dashboardteam","/dashboarddeveloper", "/dashboardlistproperty", "/dashboardcookies","/dashboardallwebusers", "/awardmanagement"];
  const shouldHideHeader = hideHeaderOn.includes(pathname);

  return (
    <>
      {!shouldHideHeader && <Header />}
      {children}
      <WhatsAppPopup />
      <ScrollButton />
      {/* <PropertyLocations /> */}
      {!shouldHideHeader && <Footer />}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#10B981',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#EF4444',
            },
          },
        }}
      />
    </>
  );
}
