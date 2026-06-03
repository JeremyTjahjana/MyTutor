"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { Calendar, DollarSign, TrendingUp } from "lucide-react";
import { getDashboardDataAction } from "@/features/tutor/services/tutor.action";
import type { Booking } from "@/types/user";
import DashboardStatCards from "./DashboardStatCards";
import TodaySchedulePanel from "./TodaySchedulePanel";
import UpcomingBookingsPanel from "./UpcomingBookingsPanel";

type DashboardData = {
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
};

function formatTimeFromISO(isoString: string): string {
  return new Date(isoString).toLocaleTimeString("id-ID", {
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

export default function TutorDashboardOverviewPage() {
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
        if (result.success && result.data) setData(result.data);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, [user]);

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

  const upcomingBookings = useMemo(() => {
    if (!data) return [];
    const now = new Date();
    return data.bookings
      .filter((booking) => {
        return (
          booking.status === "accepted" && new Date(booking.startTime) > now
        );
      })
      .slice(0, 5)
      .map((booking) => ({
        id: booking.id,
        studentName: booking.tutorName,
        subject: booking.subjectName,
        time: formatTimeRange(booking.startTime, booking.endTime),
        date: getRelativeDate(booking.startTime),
      }));
  }, [data]);

  const todaySchedule = useMemo(() => {
    if (!data) return [];
    const today = new Date();
    return data.bookings
      .filter((booking) => {
        const bookingDate = new Date(booking.startTime);
        return (
          booking.status === "accepted" &&
          bookingDate.toDateString() === today.toDateString()
        );
      })
      .map((booking) => ({
        id: booking.id,
        time: formatTimeRange(booking.startTime, booking.endTime),
        studentName: booking.tutorName,
        subject: booking.subjectName,
        note: booking.notes || "No notes provided",
      }));
  }, [data]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--biru)]" />
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

      <DashboardStatCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TodaySchedulePanel
          schedule={todaySchedule}
          selectedBookingId={selectedBookingId}
          onToggleBooking={(bookingId) =>
            setSelectedBookingId((current) =>
              current === bookingId ? null : bookingId,
            )
          }
        />
        <UpcomingBookingsPanel bookings={upcomingBookings} />
      </div>
    </div>
  );
}
