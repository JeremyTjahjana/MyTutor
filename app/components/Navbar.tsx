"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isBrowseOpen, setIsBrowseOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isSidebarOpen]);

  return (
    <header className="sticky top-0 z-50 bg-[var(--putih)]/95 backdrop-blur-sm shadow-[0px_4px_25px_0px_#0000000D]">
      <nav className="h-[72px] w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 flex items-center justify-between text-[var(--gelap)]">
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
            <a
              href="/"
              className="flex items-center gap-2 hover:text-[var(--biru)] transition-colors"
            >
              <Image src={assets.home} alt="Home" className="w-5 h-5" />
              <span>Home</span>
            </a>
          </li>
          <li>
            <a
              href="/tutor"
              className="flex items-center gap-2 hover:text-[var(--biru)] transition-color"
            >
              <Image src={assets.lightbulb} alt="Tutor" className="w-5 h-5" />
              <span>Tutor</span>
            </a>
          </li>
          <li>
            <a
              href="/bookinglist"
              className="flex items-center gap-2 hover:text-[var(--biru)] transition-colors"
            >
              <Image src={assets.book} alt="Bookings" className="w-5 h-5" />
              <span>Bookings</span>
            </a>
          </li>
        </ul>

        <div className="hidden md:flex items-center gap-4">
          <button
            type="button"
            aria-label="Open profile sidebar"
            onClick={() => setIsSidebarOpen(true)}
            className="rounded-full active:scale-95 transition"
          >
            <Image
              src={assets.mehehe}
              alt="Foto profil"
              className="w-11 h-11 rounded-full object-cover border-2 border-[var(--biru)]"
            />
          </button>
        </div>

        <button
          aria-label="Open menu"
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-[var(--gelap)]/20 text-[var(--gelap)] active:scale-95 transition"
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

      <div
        className={`fixed inset-0 z-40 bg-[var(--gelap)]/30 transition-opacity duration-300 ${
          isSidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside
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
            className="w-9 h-9 inline-flex items-center justify-center rounded-full text-[var(--gelap)]/65 hover:text-[var(--gelap)]"
          >
            x
          </button>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-3 pb-5 border-b border-[var(--gelap)]/10">
            <Image
              src={assets.mehehe}
              alt="Foto profil"
              className="w-14 h-14 rounded-full object-cover border-2 border-[var(--biru)]"
            />
            <div>
              <p className="text-sm text-[var(--gelap)]/60">Sudah login</p>
              <p className="text-base font-bold text-[var(--biru)]">
                Mwehehehe
              </p>
            </div>
          </div>

          <ul className="mt-5 space-y-1 text-[16px]">
            <li>
              <a
                href="/"
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-[var(--biru)]/10 text-[var(--biru)] font-semibold"
              >
                <Image src={assets.home} alt="Home" className="w-5 h-5" />
                <span>Home</span>
              </a>
            </li>
            <li>
              <a
                href="/tutor"
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--gelap)]/5"
              >
                <Image src={assets.lightbulb} alt="Tutor" className="w-5 h-5" />
                <span>Tutor</span>
              </a>
            </li>
            <li>
              <a
                href="/bookinglist"
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--gelap)]/5"
              >
                <Image src={assets.book} alt="Bookings" className="w-5 h-5" />
                <span>Status Booking</span>
              </a>
            </li>
            <li>
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
            </li>
            <li>
              <a
                href="#"
                className="w-full block px-3 py-2 rounded-lg hover:bg-[var(--gelap)]/5"
              >
                Daftar sebagai tutor
              </a>
            </li>
            <li>
              <button
                type="button"
                className="w-full text-left px-3 py-2 rounded-lg text-[var(--merah)] font-semibold hover:bg-[var(--merah)]/10"
              >
                Sign out
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </header>
  );
};

export default Navbar;
