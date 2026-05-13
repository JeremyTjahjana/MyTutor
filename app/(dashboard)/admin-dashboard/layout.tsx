"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChevronRight,
  Home,
  LogOut,
  Menu,
  ShieldCheck,
  UserCheck,
  Users,
  X,
} from "lucide-react";

const adminNavItems = [
  {
    href: "/admin-dashboard/pendaftaran",
    label: "Pendaftaran",
    description: "Review pengajuan tutor",
    icon: UserCheck,
    match: (pathname: string) =>
      pathname === "/admin-dashboard" ||
      pathname.startsWith("/admin-dashboard/pendaftaran"),
  },
  {
    href: "/admin-dashboard/list-tutors",
    label: "List tutors",
    description: "Lihat tutor aktif dan revoke role",
    icon: Users,
    match: (pathname: string) =>
      pathname.startsWith("/admin-dashboard/list-tutors"),
  },
] as const;

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const canAccessDashboard = user?.role === "admin";

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
    } else if (!canAccessDashboard) {
      router.replace("/");
    }
  }, [canAccessDashboard, isLoading, router, user]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
    router.push("/");
  }, [logout, router]);

  const activeItem = useMemo(
    () => adminNavItems.find((item) => item.match(pathname)),
    [pathname],
  );

  if (isLoading || !canAccessDashboard) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[var(--putih)]">
        <p className="text-sm text-[var(--gelap)]/60">
          Loading admin dashboard…
        </p>
      </div>
    );
  }

  const NavLinks = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="flex flex-col gap-1 p-3">
      {adminNavItems.map((item) => {
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
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b border-[var(--gelap)]/10 bg-white px-3 sm:px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-[var(--gelap)] hover:bg-[var(--gelap)]/[0.06]"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <p className="truncate text-sm font-semibold text-[var(--biru)]">
          {activeItem?.label ?? "Admin dashboard"}
        </p>
        <button
          type="button"
          onClick={handleLogout}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-[var(--gelap)] hover:bg-red-50 hover:text-red-600"
          aria-label="Log out"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </header>

      {menuOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

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
            Exit to website
          </Link>
        </div>
      </aside>

      <div className="flex min-h-[calc(100dvh-3.5rem)] flex-1 lg:min-h-[100dvh]">
        <aside className="relative hidden w-[280px] shrink-0 flex-col border-r border-[var(--gelap)]/10 bg-white lg:flex">
          <div className="border-b border-[var(--gelap)]/10 px-5 py-6">
            <p className="text-lg font-bold text-[var(--biru)]">MyTutor</p>
            <p className="mt-1 text-sm text-[var(--gelap)]/55">
              Admin dashboard
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
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--gelap)]/10 bg-[var(--biru)]/10">
                <ShieldCheck className="h-5 w-5 text-[var(--biru)]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {user?.fullName}
                </p>
                <p className="truncate text-xs text-[var(--gelap)]/50">
                  {user?.email}
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--gelap)]/60 hover:bg-red-50 hover:text-red-600"
                title="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex-1 overflow-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
