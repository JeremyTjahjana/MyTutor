"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart3,
  Calendar,
  Settings,
  LogOut,
  Home,
  Menu,
  X,
} from "lucide-react";

export default function TutorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, isApprovedTutor } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isApprovedTutor) {
      router.push("/");
    }
  }, [isLoading, isApprovedTutor, router]);

  // Close menu on screen resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[var(--gelap)]/60">Loading...</p>
      </div>
    );
  }

  if (!isApprovedTutor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-[var(--gelap)]/60 mb-4">
            You don't have access to the Tutor Dashboard.
          </p>
          <Link href="/" className="btn-primary px-4 py-2 rounded-lg">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: "/tutor-dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/tutor-dashboard/bookings", label: "Bookings", icon: Calendar },
    { href: "/tutor-dashboard/schedule", label: "Schedule", icon: Calendar },
    { href: "/tutor-dashboard/profile", label: "Profile", icon: Settings },
  ];

  const activeNav = navItems.find(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/"),
  );
  const topBarTitle =
    pathname === "/tutor-dashboard"
      ? "Overview"
      : (activeNav?.label ?? "Tutor Dashboard");

  return (
    <div className="min-h-[100dvh] bg-[var(--putih)]">
      {/* Mini Top Navbar */}
      <nav className="bg-[var(--biru)] text-white shadow-md sticky top-0 z-50">
        <div className="h-16 flex items-center justify-between px-3 sm:px-6 lg:px-8">
          {/* Left Section - Logo and Back Home */}
          <div className="flex items-center gap-2 sm:gap-6">
            {/* Back to Home Button */}
            <Link
              href="/"
              className="flex items-center gap-1 px-2 sm:px-3 py-2 rounded-lg transition-colors text-blue-100 hover:bg-blue-600/50 text-sm sm:text-base"
              title="Back to Home"
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Home</span>
            </Link>

            {/* Logo - Hidden on very small screens */}
            <h1 className="text-lg sm:text-xl font-bold hidden xs:block">
              MyTutor
            </h1>

            {/* Desktop Navigation Menu - Hidden on mobile */}
            <div className="hidden lg:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/tutor-dashboard"
                    ? pathname === item.href
                    : pathname === item.href ||
                      pathname.startsWith(item.href + "/");

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                      isActive
                        ? "bg-blue-700 text-white"
                        : "text-blue-100 hover:bg-blue-600/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Center Section - Mobile Current Page Title */}
          <div className="flex-1 text-center lg:hidden">
            <p className="text-sm sm:text-base font-medium truncate px-2">
              {topBarTitle}
            </p>
          </div>

          {/* Right Section - User Info and Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* User Info - Desktop Only */}
            <div className="hidden sm:block text-right">
              <p className="text-xs sm:text-sm font-semibold truncate max-w-[120px]">
                {user?.name}
              </p>
              <p className="text-xs text-blue-200 truncate max-w-[120px]">
                {user?.email}
              </p>
            </div>

            {/* Logout Button */}
            <button
              className="p-2 rounded-lg text-blue-100 hover:bg-blue-600/50 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>

            {/* Hamburger Menu Button - Mobile Only */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-blue-100 hover:bg-blue-600/50 transition-colors"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-blue-600/50 border-t border-blue-400/30 overflow-hidden transition-all duration-300">
            <div className="flex flex-col space-y-1 px-4 py-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/tutor-dashboard"
                    ? pathname === item.href
                    : pathname === item.href ||
                      pathname.startsWith(item.href + "/");

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
                      isActive
                        ? "bg-blue-700 text-white"
                        : "text-blue-100 hover:bg-blue-600/50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-[var(--putih)]">
        {children}
      </main>
    </div>
  );
}
