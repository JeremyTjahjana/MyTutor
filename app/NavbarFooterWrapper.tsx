"use client";

import { usePathname } from "next/navigation";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export function NavbarFooterWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isTutorDashboard = pathname.startsWith("/tutor-dashboard");
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname.startsWith("/auth/callback");

  return (
    <>
      {!isTutorDashboard && !isAuthPage && <Navbar />}
      {children}
      {!isTutorDashboard && !isAuthPage && <Footer />}
    </>
  );
}
