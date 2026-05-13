"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { assets } from "@/assets/assets";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const sidebarRef = useRef<HTMLElement | null>(null);
  const { user, logout } = useAuth();
  const dashboardHref =
    user?.role === "admin"
      ? "/admin-dashboard"
      : user?.role === "tutor"
        ? "/tutor-dashboard"
        : null;
  const dashboardLabel =
    user?.role === "admin" ? "Admin Dashboard" : "Tutor Dashboard";

  const isActiveRoute = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
    document.body.classList.toggle("sidebar-open", isSidebarOpen);

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (!isSidebarOpen) return;

      const target = event.target as HTMLElement | null;
      if (!target) return;

      // Check if clicked on toggle button
      const isToggleButton = target.closest('[data-toggle-sidebar]');
      if (isToggleButton) return;

      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(target)
      ) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("sidebar-open");
      window.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [isSidebarOpen]);

  return (
    <header style={{
      transition: 'background-color 300ms ease, color 300ms ease'
    }} className={`sticky top-0 z-50 ${isSidebarOpen ? "bg-[var(--putih)]/40" : "bg-[var(--putih)]/95"} backdrop-blur-sm shadow-[0px_4px_25px_0px_#0000000D] shadow-[0px_2px_16px_0px_#0000000D]`}>
      <nav className={`h-[72px] w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 flex items-center justify-between text-[var(--gelap)]`} style={{
        transition: 'opacity 300ms ease',
        opacity: isSidebarOpen ? 0.6 : 1
      }}>
        <Link href="/" aria-label="Go to home page" className="inline-flex">
          <Image
            src={assets.logo2}
            alt="MyTutor logo"
            className="w-[132px] sm:w-[160px] md:w-[180px] h-auto hover:cursor-pointer"
            priority
          />
        </Link>

        <ul className="hidden md:flex items-center gap-6 lg:gap-10 text-[15px]">
          <li>
            <Link
              href="/"
              className={`flex items-center gap-2 pb-1 transition-colors ${
                isActiveRoute("/")
                  ? "text-[var(--biru)] font-semibold border-b-2 border-[var(--biru)]"
                  : "hover:text-[var(--biru)] border-b-2 border-transparent"
              }`}
            >
              <Image src={assets.home} alt="Home" className="w-5 h-5" />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link
              href="/tutors"
              className={`flex items-center gap-2 pb-1 transition-colors ${
                isActiveRoute("/tutors")
                  ? "text-[var(--biru)] border-b-2 border-[var(--biru)] font-semibold"
                  : "hover:text-[var(--biru)] border-b-2 border-transparent"
              }`}
            >
              <Image src={assets.lightbulb} alt="Tutor" className="w-5 h-5" />
              <span>Tutor</span>
            </Link>
          </li>
          <li>
            <Link
              href="/booking-list"
              className={`flex items-center gap-2 pb-1 transition-colors ${
                isActiveRoute("/booking-list")
                  ? "text-[var(--biru)] border-b-2 border-[var(--biru)] font-semibold"
                  : "hover:text-[var(--biru)] border-b-2 border-transparent"
              }`}
            >
              <Image src={assets.book} alt="Bookings" className="w-5 h-5" />
              <span>Bookings</span>
            </Link>
          </li>
          {dashboardHref && (
            <li>
              <Link
                href={dashboardHref}
                className={`flex items-center gap-2 pb-1 transition-colors ${
                  isActiveRoute("/admin-dashboard") ||
                  isActiveRoute("/tutor-dashboard")
                    ? "text-[var(--biru)] border-b-2 border-[var(--biru)] font-semibold"
                    : "hover:text-[var(--biru)] border-b-2 border-transparent"
                }`}
              >
                <span>{dashboardLabel}</span>
              </Link>
            </li>
          )}
        </ul>

        <div className="hidden md:flex items-center gap-4">
          <button
            type="button"
            data-toggle-sidebar
            aria-label={isSidebarOpen ? "Close sidebar" : "Open profile sidebar"}
            onClick={(e) => {
              e.stopPropagation();
              setIsSidebarOpen(!isSidebarOpen);
            }}
            className="btn-icon border-transparent bg-transparent p-0"
          >
            <Image
              src={
                user?.avatarUrl && !imageError ? user.avatarUrl : assets.profile
              }
              alt="Foto profil"
              width={56}
              height={56}
              className="w-12 h-12 rounded-full object-cover hover:cursor-pointer  hover:scale-105 
              border border-1 border-[var(--gelap)]
              transition-transform"
              onError={() => setImageError(true)}
            />
          </button>
        </div>

        <button
          data-toggle-sidebar
          aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsSidebarOpen(!isSidebarOpen);
          }}
          className="btn-icon md:hidden h-10 w-10 border border-[var(--gelap)]/20 text-[var(--gelap)]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </nav>

      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 z-50 h-screen w-[84%] max-w-[340px] bg-[var(--putih)] border-r border-[var(--gelap)]/15 shadow-2xl transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-[72px] px-4 flex items-center justify-between border-b border-[var(--gelap)]/10">
          <Link href="/" aria-label="Go to home page" className="inline-flex">
            <Image
              src={assets.logo2}
              alt="MyTutor logo"
              className="w-[130px] h-auto"
            />
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setIsSidebarOpen(false)}
            className="btn-icon h-9 w-9 text-[var(--gelap)]/65 hover:text-[var(--gelap)]"
          >
            <Image src={assets.close} alt="Close" className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-3 pb-5 border-b border-[var(--gelap)]/10">
            <Image
              src={
                user?.avatarUrl && !imageError ? user.avatarUrl : assets.profile
              }
              alt="Foto profil"
              width={56}
              height={56}
              className="w-14 h-14 rounded-full object-cover"
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
            <li>
              <Link
                href="/"
                onClick={() => setIsSidebarOpen(false)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActiveRoute("/")
                    ? "bg-[var(--biru)]/10 text-[var(--biru)] font-semibold"
                    : "hover:bg-[var(--gelap)]/5"
                }`}
              >
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link
                href="/tutors"
                onClick={() => setIsSidebarOpen(false)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActiveRoute("/tutors")
                    ? "bg-[var(--biru)]/10 text-[var(--biru)] font-semibold"
                    : "hover:bg-[var(--gelap)]/5"
                }`}
              >
                <span>Tutor</span>
              </Link>
            </li>
            <li>
              <Link
                href="/booking-list"
                onClick={() => setIsSidebarOpen(false)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActiveRoute("/booking-list")
                    ? "bg-[var(--biru)]/10 text-[var(--biru)] font-semibold"
                    : "hover:bg-[var(--gelap)]/5"
                }`}
              >
                <span>Status Booking</span>
              </Link>
            </li>
            {dashboardHref && (
              <li>
                <Link
                  href={dashboardHref}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActiveRoute("/tutor-dashboard")
                      ? "bg-[var(--biru)]/10 text-[var(--biru)] font-semibold"
                      : "hover:bg-[var(--gelap)]/5"
                  }`}
                >
                  <span>{dashboardLabel}</span>
                </Link>
              </li>
            )}
            {/* <li>
              <button
                type="button"
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[var(--gelap)]/5"
                onClick={() => setIsBrowseOpen((prev) => !prev)}
              >
                <span>Browse categories</span>
                <span>{isBrowseOpen ? "-" : "+"}</span>
              </button>
              {isBrowseOpen && (
                <div className="pl-6 pr-3 pb-2 text-sm text-[var(--gelap)]/75 space-y-1">
                  <a href="#" className="block py-1">
                    Mathematics
                  </a>
                  <a href="#" className="block py-1">
                    Science
                  </a>
                  <a href="#" className="block py-1">
                    Language
                  </a>
                </div>
              )}
            </li>
            <li>
              <button
                type="button"
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[var(--gelap)]/5"
                onClick={() => setIsExploreOpen((prev) => !prev)}
              >
                <span>Explore</span>
                <span>{isExploreOpen ? "-" : "+"}</span>
              </button>
              {isExploreOpen && (
                <div className="pl-6 pr-3 pb-2 text-sm text-[var(--gelap)]/75 space-y-1">
                  <a href="#" className="block py-1">
                    Promo
                  </a>
                  <a href="#" className="block py-1">
                    Top tutor
                  </a>
                </div>
              )}
            </li> */}
            {user?.role !== "tutor" && (
              <li>
                <a
                  href="/register-tutor"
                  className="w-full block px-3 py-2 rounded-lg hover:bg-[var(--gelap)]/5"
                >
                  Daftar sebagai tutor
                </a>
              </li>
            )}
            {!user ? (
              <>
                <li>
                  <Link
                    href="/login"
                    onClick={() => setIsSidebarOpen(false)}
                    className="w-full block px-3 py-2 rounded-lg font-semibold text-[var(--biru)] hover:bg-[var(--biru)]/10"
                  >
                    Masuk
                  </Link>
                </li>
                <li>
                  <Link
                    href="/signup"
                    onClick={() => setIsSidebarOpen(false)}
                    className="w-full block px-3 py-2 rounded-lg font-semibold text-[var(--gelap)] hover:bg-[var(--gelap)]/5"
                  >
                    Daftar
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <button
                  type="button"
                  onClick={async () => {
                    setIsSidebarOpen(false);
                    await logout();
                    router.push("/");
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-[var(--merah)] font-semibold hover:bg-[var(--merah)]/10"
                >
                  Sign out
                </button>
              </li>
            )}
          </ul>
        </div>
      </aside>
    </header>
  );
};

export default Navbar;
