"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export function NavbarFooterWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [clientPathname, setClientPathname] = useState("");

  useEffect(() => {
    setClientPathname(pathname);
  }, [pathname]);

  const isTutorDashboard =
    clientPathname === "/tutor-dashboard" ||
    clientPathname.startsWith("/tutor-dashboard/");
  const isAuthPage =
    clientPathname === "/login" ||
    clientPathname === "/signup" ||
    clientPathname.startsWith("/auth/callback");
  const isAuthCallback = clientPathname.startsWith("/auth/callback");

  return (
    <>
      {!isTutorDashboard && !isAuthCallback && (
        <Navbar pathname={clientPathname} />
      )}
      {children}
      {!isTutorDashboard && !isAuthPage && (
        <Footer pathname={clientPathname} />
      )}
    </>
  );
}
