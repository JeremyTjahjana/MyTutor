"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { Calendar, DollarSign, TrendingUp } from "lucide-react";
import { getDashboardDataAction } from "@/features/tutor/services/tutor.action";
import type { Booking } from "@/types/user";

interface DashboardData {
  profile: {
    id: string;
    bio: string;
    experience: string | null;
    cost_per_hour: number;
    rating: number;
    total_sessions: number;
    total_earnings: number;
    portfolio_urls: string[];
  };
  bookings: Booking[];
}

function formatTimeFromISO(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTimeRange(startTime: string, endTime: string): string {
  return `${formatTimeFromISO(startTime)} - ${formatTimeFromISO(endTime)}`;
}

function getRelativeDate(isoString: string): string {
  const date = new Date(isoString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

  return date.toLocaleDateString("id-ID", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function TutorDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      try {
        const result = await getDashboardDataAction(user.id);
        if (result.success && result.data) {
          setData(result.data);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Transform data for stats
  const stats = useMemo(() => {
    if (!data) return [];
    return [
      {
        label: "Total Sessions",
        value: data.profile.total_sessions.toString(),
        icon: Calendar,
        color: "bg-blue-100 text-blue-600",
      },
      {
        label: "Total Earnings",
        value: `Rp ${(data.profile.total_earnings ?? 0).toLocaleString("id-ID")}`,
        icon: DollarSign,
        color: "bg-purple-100 text-purple-600",
      },
      {
        label: "Avg Rating",
        value: data.profile.rating.toFixed(1),
        icon: TrendingUp,
        color: "bg-orange-100 text-orange-600",
      },
    ];
  }, [data]);

  // Transform bookings to upcomingBookings (accepted & future)
  const upcomingBookings = useMemo(() => {
    if (!data) return [];
    const now = new Date();
    return data.bookings
      .filter((b) => b.status === "accepted" && new Date(b.startTime) > now)
      .slice(0, 5)
      .map((booking) => ({
        id: booking.id,
        studentName: booking.tutorName,
        subject: booking.subjectName,
        time: formatTimeRange(booking.startTime, booking.endTime),
        date: getRelativeDate(booking.startTime),
        status: "accepted" as const,
      }));
  }, [data]);

  // Transform bookings to todaySchedule (accepted & today)
  const todaySchedule = useMemo(() => {
    if (!data) return [];
    const today = new Date();
    return data.bookings
      .filter((b) => {
        const bookingDate = new Date(b.startTime);
        return (
          b.status === "accepted" &&
          bookingDate.toDateString() === today.toDateString()
        );
      })
      .map((booking) => ({
        id: booking.id,
        time: formatTimeRange(booking.startTime, booking.endTime),
        studentName: booking.tutorName,
        subject: booking.subjectName,
        status: "accepted" as const,
        note: booking.notes || "No notes provided",
      }));
  }, [data]);

  const selectedBooking = useMemo(
    () => todaySchedule.find((slot) => slot.id === selectedBookingId) ?? null,
    [selectedBookingId, todaySchedule],
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--biru)]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--biru)] mb-1">
          Selamat datang kembali, {user?.fullName}
        </h1>
        <p className="text-sm sm:text-base text-[var(--gelap)]/60">
          Berikut adalah ringkasan les Anda untuk hari ini.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-sm p-5 sm:p-6 border border-[var(--gelap)]/5 hover:shadow-md transition-shadow min-w-0"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-[var(--gelap)]/60 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-[var(--biru)]">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm p-5 sm:p-6 border border-[var(--gelap)]/5 min-w-0">
          <h2 className="text-lg font-semibold text-[var(--biru)] mb-4">
            Jadwal Hari Ini
          </h2>

          <div className="space-y-3">
            {todaySchedule.length === 0 ? (
              <p className="text-sm text-[var(--gelap)]/60">
                Tidak ada jadwal les hari ini
              </p>
            ) : (
              todaySchedule.map((slot) => {
                const isOpen = selectedBookingId === slot.id;

                return (
                  <div
                    key={slot.id}
                    className="rounded-xl border border-[var(--gelap)]/10 bg-white overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedBookingId((current) =>
                          current === slot.id ? null : slot.id,
                        )
                      }
                      className={`w-full px-4 py-3 text-left transition-colors ${
                        isOpen
                          ? "bg-[var(--biru)]/5"
                          : "hover:bg-[var(--gelap)]/3"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[var(--gelap)]">
                            {slot.time}
                          </p>
                          <p className="text-sm text-[var(--biru)] font-medium truncate">
                            {slot.studentName}
                          </p>
                          <p className="text-xs text-[var(--gelap)]/60 truncate">
                            {slot.subject}
                          </p>
                        </div>
                        <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                          {isOpen ? "Hide" : "View"}
                        </span>
                      </div>
                    </button>

                    {isOpen && (
                      <div className="border-t border-[var(--gelap)]/10 bg-[var(--putih)] px-4 py-3 text-sm text-[var(--gelap)]/70 space-y-1">
                        <p>
                          <span className="font-medium">Student:</span>{" "}
                          {slot.studentName}
                        </p>
                        <p>
                          <span className="font-medium">Subject:</span>{" "}
                          {slot.subject}
                        </p>
                        <p>
                          <span className="font-medium">Time:</span> {slot.time}
                        </p>
                        <p>
                          <span className="font-medium">Note:</span> {slot.note}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-5 sm:p-6 border border-[var(--gelap)]/5 min-w-0">
          <div className="flex items-center justify-between mb-4 gap-3">
            <h2 className="text-lg font-semibold text-[var(--biru)]">
              Booking Mendatang
            </h2>
            <a
              href="/tutor-dashboard/bookings"
              className="text-sm text-[var(--biru)] hover:underline"
            >
              Lihat Semua
            </a>
          </div>

          <div className="space-y-3">
            {upcomingBookings.length === 0 ? (
              <p className="text-sm text-[var(--gelap)]/60">
                Tidak ada booking mendatang
              </p>
            ) : (
              upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 p-3 rounded-lg bg-[var(--putih)] border border-[var(--gelap)]/5 hover:bg-[var(--gelap)]/2 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--gelap)] truncate">
                      {booking.studentName}
                    </p>
                    <p className="text-sm text-[var(--gelap)]/60 truncate">
                      {booking.subject}
                    </p>
                    <p className="text-xs text-[var(--gelap)]/50 mt-1">
                      {booking.date} • {booking.time}
                    </p>
                  </div>
                  <div className="self-start sm:self-auto">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        booking.status === "accepted"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {booking.status === "accepted" ? "Accepted" : "Pending"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
