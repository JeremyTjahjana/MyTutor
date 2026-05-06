"use client";

import { useState } from "react";
import { CheckCircle, Clock, XCircle } from "lucide-react";

interface BookingItem {
  id: string;
  studentName: string;
  subject: string;
  startTime: Date;
  endTime: Date;
  status: "pending" | "accepted" | "completed" | "rejected";
  notes?: string;
}

export default function BookingsPage() {
  const [filter, setFilter] = useState<
    "all" | "pending" | "accepted" | "completed" | "rejected"
  >("all");

  // Mock bookings data
  const bookings: BookingItem[] = [
    {
      id: "1",
      studentName: "Ahmad Rizki",
      subject: "Matematika",
      startTime: new Date(2026, 4, 6, 14, 0),
      endTime: new Date(2026, 4, 6, 15, 30),
      status: "accepted",
    },
    {
      id: "2",
      studentName: "Siti Nurhaliza",
      subject: "Fisika",
      startTime: new Date(2026, 4, 6, 16, 0),
      endTime: new Date(2026, 4, 6, 17, 30),
      status: "pending",
    },
    {
      id: "3",
      studentName: "Budi Santoso",
      subject: "Kimia",
      startTime: new Date(2026, 4, 7, 10, 0),
      endTime: new Date(2026, 4, 7, 11, 30),
      status: "accepted",
    },
    {
      id: "4",
      studentName: "Rina Wijaya",
      subject: "Biologi",
      startTime: new Date(2026, 4, 5, 9, 0),
      endTime: new Date(2026, 4, 5, 10, 30),
      status: "completed",
    },
    {
      id: "5",
      studentName: "Doni Pratama",
      subject: "Matematika",
      startTime: new Date(2026, 4, 4, 13, 0),
      endTime: new Date(2026, 4, 4, 14, 30),
      status: "rejected",
    },
  ];

  const filteredBookings =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const statusConfig = {
    pending: {
      icon: Clock,
      label: "Pending",
      color: "bg-yellow-100 text-yellow-700",
    },
    accepted: {
      icon: CheckCircle,
      label: "Accepted",
      color: "bg-green-100 text-green-700",
    },
    completed: {
      icon: CheckCircle,
      label: "Completed",
      color: "bg-blue-100 text-blue-700",
    },
    rejected: {
      icon: XCircle,
      label: "Rejected",
      color: "bg-red-100 text-red-700",
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--biru)] mb-1">
          Manage Bookings
        </h1>
        <p className="text-[var(--gelap)]/60">
          View and manage all your student bookings.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(["all", "pending", "accepted", "completed", "rejected"] as const).map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? "bg-[var(--biru)] text-white"
                  : "bg-white border border-[var(--gelap)]/10 text-[var(--gelap)] hover:bg-[var(--gelap)]/5"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ),
        )}
      </div>

      {/* Bookings List */}
      <div className="space-y-3">
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-[var(--gelap)]/5">
            <p className="text-[var(--gelap)]/60">
              No bookings found in this category.
            </p>
          </div>
        ) : (
          filteredBookings.map((booking) => {
            const statusInfo = statusConfig[booking.status];
            const StatusIcon = statusInfo.icon;

            return (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-sm p-6 border border-[var(--gelap)]/5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-[var(--biru)]">
                        {booking.studentName}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}
                      >
                        <StatusIcon className="w-4 h-4" />
                        {statusInfo.label}
                      </span>
                    </div>
                    <p className="text-[var(--gelap)]/70 mb-1">
                      Subject: {booking.subject}
                    </p>
                    <p className="text-sm text-[var(--gelap)]/60">
                      {new Intl.DateTimeFormat("id-ID", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(booking.startTime)}{" "}
                      -{" "}
                      {new Intl.DateTimeFormat("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(booking.endTime)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {booking.status === "pending" && (
                      <>
                        <button className="btn-primary px-4 py-2 rounded-lg text-sm">
                          Accept
                        </button>
                        <button className="btn-secondary px-4 py-2 rounded-lg text-sm">
                          Reject
                        </button>
                      </>
                    )}
                    {booking.status === "accepted" && (
                      <button className="btn-primary px-4 py-2 rounded-lg text-sm">
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
