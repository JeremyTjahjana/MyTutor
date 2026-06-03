"use client";

import Link from "next/link";

type UpcomingBookingItem = {
  id: string;
  studentName: string;
  subject: string;
  time: string;
  date: string;
};

export default function UpcomingBookingsPanel({
  bookings,
}: {
  bookings: UpcomingBookingItem[];
}) {
  return (
    <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-5 sm:p-6 border border-[var(--gelap)]/5 min-w-0">
      <div className="flex items-center justify-between mb-4 gap-3">
        <h2 className="text-lg font-semibold text-[var(--biru)]">
          Booking Mendatang
        </h2>
        <Link
          href="/tutor-dashboard/bookings"
          className="text-sm text-[var(--biru)] hover:underline"
        >
          Lihat Semua
        </Link>
      </div>

      <div className="space-y-3">
        {bookings.length === 0 ? (
          <p className="text-sm text-[var(--gelap)]/60">
            Tidak ada booking mendatang
          </p>
        ) : (
          bookings.map((booking) => (
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
                  {booking.date} - {booking.time}
                </p>
              </div>
              <div className="self-start sm:self-auto">
                <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700">
                  Accepted
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
