"use client";

import { useState, useEffect } from "react";
import { Loader2, CalendarCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { Booking } from "@/types/user";
import {
  acceptBookingAction,
  cancelBookingAction,
  completeBookingAction,
} from "@/features/booking/services/booking.action";
import TutorBookingCard from "./TutorBookingCard";

type Filter = "all" | "pending" | "accepted" | "completed" | "cancelled";

function isToday(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export default function BookingsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<Filter>("all");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const load = () => {
    if (!user) return;
    fetch(`/api/bookings?tutorUserId=${user.id}`)
      .then((r) => r.json())
      .then(setBookings)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    load();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAction = async (
    bookingId: string,
    action: "accept" | "cancel" | "complete",
  ) => {
    setActionLoading(bookingId + action);
    try {
      if (action === "accept") await acceptBookingAction(bookingId);
      if (action === "cancel") await cancelBookingAction(bookingId);
      if (action === "complete") await completeBookingAction(bookingId);
      load();
    } finally {
      setActionLoading(null);
    }
  };

  const todayBookings = bookings.filter(
    (b) =>
      isToday(b.startTime) &&
      (b.status === "pending" || b.status === "accepted"),
  );

  const filtered =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const FILTERS: { key: Filter; label: string }[] = [
    { key: "all", label: "Semua" },
    { key: "pending", label: "Pending" },
    { key: "accepted", label: "Diterima" },
    { key: "completed", label: "Selesai" },
    { key: "cancelled", label: "Dibatalkan" },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--biru)]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--biru)] mb-1">
          Kelola Pemesanan
        </h1>
        <p className="text-[var(--gelap)]/60">
          Lihat dan kelola semua pesanan dari siswa.
        </p>
      </div>

      {/* ── Today's Bookings ── */}
      {todayBookings.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <CalendarCheck className="w-5 h-5 text-[var(--biru)]" />
            <h2 className="text-lg font-semibold text-[var(--biru)]">
              Jadwal Hari Ini
            </h2>
            <span className="ml-1 px-2 py-0.5 bg-[var(--biru)] text-white text-xs font-bold rounded-full">
              {todayBookings.length}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {todayBookings.map((b) => (
              <TutorBookingCard
                key={b.id}
                booking={b}
                onAction={handleAction}
                actionLoading={actionLoading}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── All Bookings ── */}
      <section>
        <h2 className="text-lg font-semibold text-[var(--gelap)] mb-3">
          Semua Pemesanan
        </h2>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                filter === key
                  ? "bg-[var(--biru)] text-white border-[var(--biru)]"
                  : "bg-white border-[var(--gelap)]/15 text-[var(--gelap)] hover:bg-[var(--gelap)]/5"
              }`}
            >
              {label}
              {key !== "all" && (
                <span className="ml-1.5 text-xs opacity-70">
                  ({bookings.filter((b) => b.status === key).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-[var(--gelap)]/8 p-10 text-center">
            <p className="text-[var(--gelap)]/50">
              Tidak ada pemesanan di kategori ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map((b) => (
              <TutorBookingCard
                key={b.id}
                booking={b}
                onAction={handleAction}
                actionLoading={actionLoading}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
