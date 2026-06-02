"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  CalendarCheck,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { Booking } from "@/types/user";
import {
  acceptBookingAction,
  cancelBookingAction,
  completeBookingAction,
} from "@/features/booking/services/booking.action";
import Image from "next/image";
import { assets } from "@/assets/assets";

const statusConfig = {
  pending: {
    icon: Clock,
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  accepted: {
    icon: CheckCircle,
    label: "Diterima",
    color: "bg-green-100 text-green-700 border-green-200",
  },
  completed: {
    icon: CheckCircle,
    label: "Selesai",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  cancelled: {
    icon: XCircle,
    label: "Dibatalkan",
    color: "bg-gray-100 text-gray-600 border-gray-200",
  },
};

type Filter = "all" | "pending" | "accepted" | "completed" | "cancelled";

const DAY_ID: Record<number, string> = {
  0: "Minggu",
  1: "Senin",
  2: "Selasa",
  3: "Rabu",
  4: "Kamis",
  5: "Jumat",
  6: "Sabtu",
};

function formatSchedule(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const day = DAY_ID[s.getDay()] ?? "";
  const startT = s.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const endT = e.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${day} (${startT} - ${endT})`;
}

function isToday(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function BookingCard({
  booking,
  onAction,
  actionLoading,
}: {
  booking: Booking;
  onAction: (id: string, action: "accept" | "cancel" | "complete") => void;
  actionLoading: string | null;
}) {
  const statusInfo =
    statusConfig[booking.status as keyof typeof statusConfig] ??
    statusConfig.pending;
  const StatusIcon = statusInfo.icon;
  const loading = actionLoading?.startsWith(booking.id);

  return (
    <div className="bg-white rounded-xl border border-[var(--gelap)]/8 shadow-sm hover:shadow-md transition-all p-5 flex gap-4">
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full overflow-hidden border border-[var(--gelap)]/10 shrink-0">
        <Image
          src={booking.tutorAvatarUrl ?? assets.profile}
          alt={booking.tutorName}
          width={48}
          height={48}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <p className="font-semibold text-[var(--gelap)] leading-tight">
              {booking.tutorName}
            </p>
            <p className="text-sm text-[var(--biru)] font-medium mt-0.5">
              {booking.subjectName}
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusInfo.color}`}
          >
            <StatusIcon className="w-3.5 h-3.5" />
            {statusInfo.label}
          </span>
        </div>

        <p className="mt-2 flex items-center gap-2 text-sm text-[var(--gelap)]/60">
          <Clock className="h-4 w-4 shrink-0 text-[var(--gelap)]/40" />
          <span>{formatSchedule(booking.startTime, booking.endTime)}</span>
        </p>
        {booking.notes && (
          <p className="mt-1.5 text-sm italic text-[var(--gelap)]/50">
            "{booking.notes}"
          </p>
        )}

        {/* Actions */}
        {booking.status === "pending" && (
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => onAction(booking.id, "accept")}
              disabled={!!actionLoading}
              className="btn-primary px-4 py-1.5 text-sm rounded-lg flex items-center gap-1.5"
            >
              {actionLoading === booking.id + "accept" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle className="h-3.5 w-3.5" />
              )}
              Terima
            </button>
            <button
              onClick={() => onAction(booking.id, "cancel")}
              disabled={!!actionLoading}
              className="btn-secondary px-4 py-1.5 text-sm rounded-lg flex items-center gap-1.5 "
            >
              {actionLoading === booking.id + "cancel" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <XCircle className="h-3.5 w-3.5" />
              )}
              Tolak
            </button>
          </div>
        )}
        {booking.status === "accepted" && (
          <div className="mt-3 space-y-2">
            <p className="text-xs text-[var(--gelap)]/55">
              Konfirmasi selesai: tutor{" "}
              {booking.tutorCompletedAt ? "sudah" : "belum"}, murid{" "}
              {booking.studentCompletedAt ? "sudah" : "belum"}.
            </p>
            <button
              onClick={() => onAction(booking.id, "complete")}
              disabled={!!actionLoading || Boolean(booking.tutorCompletedAt)}
              className="btn-primary px-4 py-1.5 text-sm rounded-lg flex items-center gap-1.5"
            >
              {actionLoading === booking.id + "complete" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle className="h-3.5 w-3.5" />
              )}
              {booking.tutorCompletedAt ? "Menunggu murid" : "Tandai Selesai"}
            </button>
          </div>
        )}
      </div>
    </div>
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
              <BookingCard
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
              <BookingCard
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
