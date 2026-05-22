"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { user, logout } = useAuth();

  const dashboardHref =
    user?.role === "admin"
      ? "/admin-dashboard"
      : user?.role === "tutor"
        ? "/tutor-dashboard"
        : null;

  const dashboardLabel =
    user?.role === "admin" ? "Admin Dashboard" : "Tutor Dashboard";

  const closeSidebar = () => setIsSidebarOpen(false);

  const isActiveRoute = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeSidebar();
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isSidebarOpen]);

  const avatarSrc =
    user?.avatarUrl && !imageError ? user.avatarUrl : assets.profile;

  return (
    <>
      <header className="sticky top-0 z-50 bg-[var(--putih)]/95 backdrop-blur-sm shadow-[0px_4px_25px_0px_#0000000D]">
        <nav className="h-[72px] w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 flex items-center justify-between text-[var(--gelap)]">
          <Link href="/" aria-label="Go to home page" className="inline-flex">
            <Image
              src={assets.logo2}
              alt="MyTutor logo"
              className="w-[132px] sm:w-[160px] md:w-[180px] h-auto"
              priority
            />
          </Link>

          <ul className="hidden md:flex items-center gap-6 lg:gap-10 text-[15px]">
            <li>
              <Link
                href="/"
                className={`flex items-center gap-2 pb-1 transition-colors ${isActiveRoute("/") ? "text-[var(--biru)] font-semibold border-b-2 border-[var(--biru)]" : "hover:text-[var(--biru)] border-b-2 border-transparent"}`}
              >
                <Image src={assets.home} alt="Home" className="w-5 h-5" />
                <span>Home</span>
              </Link>
            </li>

            <li>
              <Link
                href="/tutors"
                className={`flex items-center gap-2 pb-1 transition-colors ${isActiveRoute("/tutors") ? "text-[var(--biru)] border-b-2 border-[var(--biru)] font-semibold" : "hover:text-[var(--biru)] border-b-2 border-transparent"}`}
              >
                <Image src={assets.lightbulb} alt="Tutor" className="w-5 h-5" />
                <span>Tutor</span>
              </Link>
            </li>

            <li>
              <Link
                href="/booking-list"
                className={`flex items-center gap-2 pb-1 transition-colors ${isActiveRoute("/booking-list") ? "text-[var(--biru)] border-b-2 border-[var(--biru)] font-semibold" : "hover:text-[var(--biru)] border-b-2 border-transparent"}`}
              >
                <Image src={assets.book} alt="Bookings" className="w-5 h-5" />
                <span>Bookings</span>
              </Link>
            </li>

            {dashboardHref && (
              <li>
                <Link
                  href={dashboardHref}
                  className={`flex items-center gap-2 pb-1 transition-colors ${isActiveRoute(dashboardHref) ? "text-[var(--biru)] border-b-2 border-[var(--biru)] font-semibold" : "hover:text-[var(--biru)] border-b-2 border-transparent"}`}
                >
                  <span>{dashboardLabel}</span>
                </Link>
              </li>
            )}
          </ul>

          <button
            type="button"
            aria-label="Open profile sidebar"
            onClick={() => setIsSidebarOpen(true)}
            className="hidden md:flex rounded-full cursor-pointer"
          >
            <Image
              src={avatarSrc}
              alt="Foto profil"
              width={40}
              height={40}
              className="w-12 h-12 rounded-full object-cover border border-[var(--gelap)] transition-transform hover:scale-105"
              onError={() => setImageError(true)}
            />
          </button>

          <button
            aria-label="Open menu"
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden h-10 w-10 flex items-center justify-center rounded-full border border-[var(--gelap)]/20 text-[var(--gelap)] cursor-pointer"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </nav>
      </header>

      <div
        onClick={closeSidebar}
        className={`fixed inset-0 z-[90] bg-[var(--gelap)]/30 transition-opacity duration-300 ${
          isSidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-[100] w-[84%] max-w-[340px] bg-[var(--putih)] border-r border-[var(--gelap)]/15 shadow-2xl transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-[72px] px-4 flex items-center justify-between border-b border-[var(--gelap)]/10">
          <Link href="/" onClick={closeSidebar} className="inline-flex">
            <Image
              src={assets.logo2}
              alt="MyTutor logo"
              className="w-[130px] h-auto"
            />
          </Link>

          <button
            type="button"
            onClick={closeSidebar}
            className="h-9 w-9 flex items-center justify-center cursor-pointer"
          >
            <Image src={assets.close} alt="Close" className="w-6 h-6" />
          </button>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-3 pb-5 border-b border-[var(--gelap)]/10">
            <Image
              src={avatarSrc}
              alt="Foto profil"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
              onError={() => setImageError(true)}
            />

            <div>
              <p className="text-base font-bold text-[var(--biru)]">
                {user ? user.fullName : "Tamu"}
              </p>
              {user && (
                <p className="text-xs text-[var(--gelap)]/60 truncate max-w-[160px]">
                  {user.email}
                </p>
              )}
            </div>
          </div>

          <ul className="mt-5 space-y-1 text-[16px]">
            <MobileNavLink
              href="/"
              active={isActiveRoute("/")}
              onClick={closeSidebar}
            >
              Home
            </MobileNavLink>

            <MobileNavLink
              href="/tutors"
              active={isActiveRoute("/tutors")}
              onClick={closeSidebar}
            >
              Tutor
            </MobileNavLink>

            <MobileNavLink
              href="/booking-list"
              active={isActiveRoute("/booking-list")}
              onClick={closeSidebar}
            >
              Status Booking
            </MobileNavLink>

            {dashboardHref && (
              <MobileNavLink
                href={dashboardHref}
                active={isActiveRoute(dashboardHref)}
                onClick={closeSidebar}
              >
                {dashboardLabel}
              </MobileNavLink>
            )}

            {user?.role !== "tutor" && (
              <MobileNavLink
                href="/register-tutor"
                active={isActiveRoute("/register-tutor")}
                onClick={closeSidebar}
              >
                Daftar sebagai tutor
              </MobileNavLink>
            )}

            {!user ? (
              <>
                <MobileNavLink
                  href="/login"
                  active={isActiveRoute("/login")}
                  onClick={closeSidebar}
                >
                  Masuk
                </MobileNavLink>

                <MobileNavLink
                  href="/signup"
                  active={isActiveRoute("/signup")}
                  onClick={closeSidebar}
                >
                  Daftar
                </MobileNavLink>
              </>
            ) : (
              <li>
                <button
                  type="button"
                  disabled={isLoggingOut}
                  onClick={async () => {
                    if (isLoggingOut) return;

                    setIsLoggingOut(true);

                    try {
                      await logout();
                      closeSidebar();
                      router.replace("/");
                      router.refresh();
                    } finally {
                      setIsLoggingOut(false);
                    }
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-[var(--merah)] font-semibold hover:bg-[var(--merah)]/10 cursor-pointer disabled:opacity-50"
                >
                  {isLoggingOut ? "Logging out..." : "Sign out"}
                </button>
              </li>
            )}
          </ul>
        </div>
      </aside>
    </>
  );
};

function MobileNavLink({
  href,
  active,
  onClick,
  children,
}: {
  href: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
          active
            ? "bg-[var(--biru)]/10 text-[var(--biru)] font-semibold"
            : "hover:bg-[var(--gelap)]/5"
        }`}
      >
        <span>{children}</span>
      </Link>
    </li>
  );
}

export default Navbar;
