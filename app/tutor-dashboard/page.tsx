"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import { useMemo, useState } from "react";
import { Calendar, DollarSign, TrendingUp } from "lucide-react";

export default function TutorDashboard() {
  const { user } = useAuth();
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );

  const stats = [
    {
      label: "Total Sessions",
      value: "24",
      icon: Calendar,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Total Earnings",
      value: "$2,400",
      icon: DollarSign,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Avg Rating",
      value: "4.8",
      icon: TrendingUp,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  const upcomingBookings = [
    {
      id: "1",
      studentName: "Ahmad Rizki",
      subject: "Matematika",
      time: "14:00 - 15:30",
      date: "Today",
      status: "accepted",
    },
    {
      id: "2",
      studentName: "Siti Nurhaliza",
      subject: "Fisika",
      time: "16:00 - 17:30",
      date: "Today",
      status: "pending",
    },
    {
      id: "3",
      studentName: "Budi Santoso",
      subject: "Kimia",
      time: "10:00 - 11:30",
      date: "Tomorrow",
      status: "accepted",
    },
  ];

  const todaySchedule = [
    {
      id: "1",
      time: "10:30 - 12:00",
      studentName: "Ahmad Rizki",
      subject: "Matematika",
      status: "accepted",
      note: "Review integral and limit concepts.",
    },
    {
      id: "2",
      time: "14:30 - 16:00",
      studentName: "Siti Nurhaliza",
      subject: "Fisika",
      status: "accepted",
      note: "Focus on wave motion practice.",
    },
  ];

  const selectedBooking = useMemo(
    () => todaySchedule.find((slot) => slot.id === selectedBookingId) ?? null,
    [selectedBookingId],
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--biru)] mb-1">
          Welcome back, {user?.name}
        </h1>
        <p className="text-sm sm:text-base text-[var(--gelap)]/60">
          Here's your tutoring summary for today.
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
            Today's Schedule
          </h2>

          <div className="space-y-3">
            {todaySchedule.map((slot) => {
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
            })}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-5 sm:p-6 border border-[var(--gelap)]/5 min-w-0">
          <div className="flex items-center justify-between mb-4 gap-3">
            <h2 className="text-lg font-semibold text-[var(--biru)]">
              Upcoming Bookings
            </h2>
            <a
              href="/tutor-dashboard/bookings"
              className="text-sm text-[var(--biru)] hover:underline"
            >
              View All
            </a>
          </div>

          <div className="space-y-3">
            {upcomingBookings.map((booking) => (
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
