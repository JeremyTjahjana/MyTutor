"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import {
  LayoutDashboard,
  CalendarClock,
  ClipboardList,
  UserCircle,
  Home,
  Menu,
  X,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import Image from "next/image";
import { assets } from "@/assets/assets";

const tutorNavItems = [
  {
    href: "/tutor-dashboard",
    label: "Overview",
    description: "Ringkasan, statistik, dan apa selanjutnya",
    icon: LayoutDashboard,
    match: (pathname: string) => pathname === "/tutor-dashboard",
  },
  {
    href: "/tutor-dashboard/bookings",
    label: "Bookings",
    description: "Permintaan siswa dan status sesi",
    icon: ClipboardList,
    match: (pathname: string) =>
      pathname === "/tutor-dashboard/bookings" ||
      pathname.startsWith("/tutor-dashboard/bookings/"),
  },
  {
    href: "/tutor-dashboard/schedule",
    label: "Availability",
    description: "Jadwal yang dapat dipesan siswa",
    icon: CalendarClock,
    match: (pathname: string) =>
      pathname === "/tutor-dashboard/schedule" ||
      pathname.startsWith("/tutor-dashboard/schedule/"),
  },
  {
    href: "/tutor-dashboard/subjects",
    label: "Mata kuliah & skill",
    description: "Materi yang bisa Anda ajarkan",
    icon: GraduationCap,
    match: (pathname: string) =>
      pathname === "/tutor-dashboard/subjects" ||
      pathname.startsWith("/tutor-dashboard/subjects/"),
  },
  {
    href: "/tutor-dashboard/profile",
    label: "Profile",
    description: "Foto, kontak, bio, dan tarif per jam",
    icon: UserCircle,
    match: (pathname: string) =>
      pathname === "/tutor-dashboard/profile" ||
      pathname.startsWith("/tutor-dashboard/profile/"),
  },
] as const;

export default function TutorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading, isApprovedTutor } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const canAccessDashboard = isApprovedTutor;
  const navItems = tutorNavItems;

  useEffect(() => {
    setAvatarError(false);
  }, [user?.avatarUrl]);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/login");
    } else if (!canAccessDashboard) {
      router.replace("/");
    }
  }, [canAccessDashboard, isAuthenticated, isLoading, router]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const activeItem = useMemo(
    () => navItems.find((item) => item.match(pathname)),
    [navItems, pathname],
  );

  const pageTitle = activeItem?.label ?? "Dashboard";
  const dashboardLabel =
    user?.role === "admin" ? "Admin dashboard" : "Tutor dashboard";

  if (isLoading || !canAccessDashboard) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[var(--putih)]">
        <p className="text-sm text-[var(--gelap)]/60">Loading dashboard…</p>
      </div>
    );
  }

  const NavLinks = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="flex flex-col gap-1 p-3">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = item.match(pathname);
        return (
          <Link
            key={`${item.href}-${item.label}`}
            href={item.href}
            onClick={onNavigate}
            className={`group flex gap-3 rounded-xl px-3 py-3 transition-colors ${
              active
                ? "bg-[var(--biru)] text-white shadow-sm"
                : "text-[var(--gelap)] hover:bg-[var(--gelap)]/[0.06]"
            }`}
          >
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                active
                  ? "bg-white/15"
                  : "bg-[var(--biru)]/10 text-[var(--biru)]"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.25 : 2} />
            </span>
            <span className="min-w-0 flex-1 text-left">
              <span className="flex items-center gap-1 font-semibold leading-tight">
                {item.label}
                <ChevronRight
                  className={`h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-60 ${
                    active ? "opacity-80" : ""
                  }`}
                />
              </span>
              <span
                className={`mt-0.5 block text-xs leading-snug ${
                  active ? "text-blue-100" : "text-[var(--gelap)]/55"
                }`}
              >
                {item.description}
              </span>
            </span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-[100dvh] bg-[var(--putih)] text-[var(--gelap)]">
      {/* Mobile header */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b border-[var(--gelap)]/10 bg-white px-3 sm:px-4 lg:hidden">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[var(--biru)]">
            {pageTitle}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-[var(--gelap)] hover:bg-[var(--gelap)]/[0.06]"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Mobile overlay */}
      {menuOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(20rem,100vw-3rem)] flex-col border-r border-[var(--gelap)]/10 bg-white shadow-xl transition-transform duration-200 ease-out lg:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--gelap)]/10 px-3">
          <span className="font-bold text-[var(--biru)]">MyTutor</span>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-[var(--gelap)]/[0.06]"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <NavLinks onNavigate={() => setMenuOpen(false)} />
        </div>
        <div className="shrink-0 border-t border-[var(--gelap)]/10 bg-[var(--putih)] p-3">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--biru)] hover:bg-[var(--biru)]/5"
          >
            <Home className="h-4 w-4" />
            Kembali ke Home
          </Link>
        </div>
      </aside>

      <div className="flex min-h-[calc(100dvh-3.5rem)] flex-1 lg:min-h-[100dvh]">
        {/* Desktop sidebar */}
        <aside className="relative hidden w-[280px] shrink-0 flex-col border-r border-[var(--gelap)]/10 bg-white lg:flex">
          <div className="border-b border-[var(--gelap)]/10 px-5 py-6">
            <p className="text-lg font-bold text-[var(--biru)]">MyTutor</p>
            <p className="mt-1 text-sm text-[var(--gelap)]/55">
              {dashboardLabel}
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--biru)] hover:underline"
            >
              <Home className="h-4 w-4" />
              Back to website
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto pb-24">
            <NavLinks />
          </div>

          <div className="absolute bottom-0 left-0 right-0 border-t border-[var(--gelap)]/10 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--gelap)]/10 bg-[var(--biru)]/10">
                {!avatarError && user?.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt=""
                    width={44}
                    height={44}
                    className="h-full w-full object-cover"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <Image
                    src={assets.profile}
                    alt=""
                    width={28}
                    height={28}
                    className="opacity-70"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {user?.fullName}
                </p>
                <p className="truncate text-xs text-[var(--gelap)]/50">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex-1 overflow-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
